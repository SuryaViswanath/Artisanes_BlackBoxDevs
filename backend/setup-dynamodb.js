import { DynamoDBClient, CreateTableCommand, ListTablesCommand } from '@aws-sdk/client-dynamodb';
import dotenv from 'dotenv';

dotenv.config();

const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
});

async function setupDynamoDB() {
  console.log('Setting up DynamoDB tables...\n');
  
  try {
    // Check existing tables
    const listCommand = new ListTablesCommand({});
    const { TableNames } = await client.send(listCommand);
    console.log('Existing tables:', TableNames);
    
    // Create products table if it doesn't exist
    if (!TableNames.includes(process.env.DYNAMODB_PRODUCTS_TABLE)) {
      console.log(`\nCreating table: ${process.env.DYNAMODB_PRODUCTS_TABLE}`);
      
      const createProductsTable = new CreateTableCommand({
        TableName: process.env.DYNAMODB_PRODUCTS_TABLE,
        KeySchema: [
          { AttributeName: 'productId', KeyType: 'HASH' }
        ],
        AttributeDefinitions: [
          { AttributeName: 'productId', AttributeType: 'S' }
        ],
        BillingMode: 'PAY_PER_REQUEST' // On-demand pricing (free tier eligible)
      });
      
      await client.send(createProductsTable);
      console.log('✓ Products table created successfully!');
    } else {
      console.log(`✓ Products table already exists`);
    }
    
    // Create conversations table if it doesn't exist
    if (!TableNames.includes(process.env.DYNAMODB_CONVERSATIONS_TABLE)) {
      console.log(`\nCreating table: ${process.env.DYNAMODB_CONVERSATIONS_TABLE}`);
      
      const createConversationsTable = new CreateTableCommand({
        TableName: process.env.DYNAMODB_CONVERSATIONS_TABLE,
        KeySchema: [
          { AttributeName: 'conversationId', KeyType: 'HASH' }
        ],
        AttributeDefinitions: [
          { AttributeName: 'conversationId', AttributeType: 'S' }
        ],
        BillingMode: 'PAY_PER_REQUEST' // On-demand pricing (free tier eligible)
      });
      
      await client.send(createConversationsTable);
      console.log('✓ Conversations table created successfully!');
    } else {
      console.log(`✓ Conversations table already exists`);
    }
    
    console.log('\n✅ DynamoDB setup complete!');
    console.log('\nYour tables:');
    console.log(`  - ${process.env.DYNAMODB_PRODUCTS_TABLE}`);
    console.log(`  - ${process.env.DYNAMODB_CONVERSATIONS_TABLE}`);
    console.log('\nYou can now restart your backend server.');
    
  } catch (error) {
    console.error('❌ Error setting up DynamoDB:', error.message);
    
    if (error.name === 'ResourceInUseException') {
      console.log('\n✓ Tables already exist, you\'re good to go!');
    } else {
      console.error('\nPossible issues:');
      console.error('1. IAM user needs DynamoDB permissions (AmazonDynamoDBFullAccess)');
      console.error('2. AWS credentials are incorrect');
      console.error('3. Region is incorrect');
    }
  }
}

setupDynamoDB();
