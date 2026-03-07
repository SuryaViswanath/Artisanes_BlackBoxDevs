import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { PutCommand, GetCommand } from '@aws-sdk/lib-dynamodb';
import { CreateTableCommand, DescribeTableCommand } from '@aws-sdk/client-dynamodb';
import { docClient, dynamoClient, config } from '../config/aws.js';

const SALT_ROUNDS = 10;

function normalizeEmail(email) {
  return String(email).trim().toLowerCase();
}

/** Create the users table if it does not exist (uses same credentials as backend). */
export async function ensureUsersTable() {
  if (!config.usersTable) return;

  try {
    await dynamoClient.send(
      new DescribeTableCommand({ TableName: config.usersTable })
    );
    return; // table exists
  } catch (err) {
    if (err.name !== 'ResourceNotFoundException') {
      console.error('DynamoDB DescribeTable error:', err);
      throw err;
    }
  }

  console.log(`Creating DynamoDB table "${config.usersTable}"...`);
  try {
    await dynamoClient.send(
      new CreateTableCommand({
        TableName: config.usersTable,
        AttributeDefinitions: [{ AttributeName: 'email', AttributeType: 'S' }],
        KeySchema: [{ AttributeName: 'email', KeyType: 'HASH' }],
        BillingMode: 'PAY_PER_REQUEST',
      })
    );
    console.log(`Table "${config.usersTable}" created. Waiting for ACTIVE...`);
    await waitForTableActive(config.usersTable);
    console.log(`Table "${config.usersTable}" is ready.`);
  } catch (err) {
    if (err.name === 'ResourceInUseException') {
      return; // created by another process
    }
    console.error('DynamoDB CreateTable error:', err);
    throw new Error(`Failed to create users table: ${err.message}`);
  }
}

function waitForTableActive(tableName, maxWaitMs = 30000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const check = async () => {
      try {
        const out = await dynamoClient.send(
          new DescribeTableCommand({ TableName: tableName })
        );
        if (out.Table?.TableStatus === 'ACTIVE') {
          return resolve();
        }
      } catch (e) {
        return reject(e);
      }
      if (Date.now() - start > maxWaitMs) {
        return reject(new Error('Table creation timeout'));
      }
      setTimeout(check, 1500);
    };
    check();
  });
}

export async function createUser({ email, password, name, role = 'seller' }) {
  if (!config.usersTable) {
    throw new Error('DYNAMODB_USERS_TABLE is not configured. Add it to .env (e.g. DYNAMODB_USERS_TABLE=artisan-users).');
  }
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail || !password) {
    throw new Error('Email and password are required');
  }

  let existing = await findUserByEmail(normalizedEmail);
  if (existing === undefined) {
    await ensureUsersTable();
    existing = await findUserByEmail(normalizedEmail);
  }
  if (existing) {
    throw new Error('An account with this email already exists');
  }

  const hashedPassword = await bcrypt.hash(String(password), SALT_ROUNDS);
  const user = {
    email: normalizedEmail,
    id: uuidv4(),
    passwordHash: hashedPassword,
    name: String(name || '').trim() || normalizedEmail.split('@')[0],
    role,
    createdAt: new Date().toISOString(),
  };

  try {
    await docClient.send(
      new PutCommand({
        TableName: config.usersTable,
        Item: user,
        ConditionExpression: 'attribute_not_exists(#email)',
        ExpressionAttributeNames: { '#email': 'email' },
      })
    );
    console.log('User created:', user.email);
    return { id: user.id, email: user.email, name: user.name, role: user.role };
  } catch (error) {
    if (error.name === 'ConditionalCheckFailedException') {
      throw new Error('An account with this email already exists');
    }
    if (error.name === 'ResourceNotFoundException') {
      await ensureUsersTable();
      return createUser({ email, password, name, role });
    }
    console.error('DynamoDB user save error:', error);
    throw new Error(`Failed to create user: ${error.message}`);
  }
}

export async function findUserByEmail(email) {
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail) return null;

  if (!config.usersTable) {
    console.warn('DYNAMODB_USERS_TABLE not set; user lookup will fail');
    return null;
  }

  try {
    const response = await docClient.send(
      new GetCommand({
        TableName: config.usersTable,
        Key: { email: normalizedEmail },
      })
    );
    return response.Item || null;
  } catch (error) {
    if (error.name === 'ResourceNotFoundException') {
      return undefined; // signal "table missing" so caller can ensure table and retry
    }
    console.error('DynamoDB user get error:', error);
    throw new Error(`Failed to get user: ${error.message}`);
  }
}

export async function verifyPassword(user, password) {
  if (!user || !user.passwordHash) return false;
  return bcrypt.compare(String(password), user.passwordHash);
}

export function toPublicUser(user) {
  if (!user) return null;
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };
}
