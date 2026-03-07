import { DynamoDBClient, CreateTableCommand } from '@aws-sdk/client-dynamodb';
import dotenv from 'dotenv';

dotenv.config();

const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
});

async function setupSellersTable() {
  console.log('Creating sellers table...\n');
  
  try {
    const command = new CreateTableCommand({
      TableName: 'artisan-sellers',
      KeySchema: [
        { AttributeName: 'sellerId', KeyType: 'HASH' }
      ],
      AttributeDefinitions: [
        { AttributeName: 'sellerId', AttributeType: 'S' },
        { AttributeName: 'email', AttributeType: 'S' }
      ],
      GlobalSecondaryIndexes: [
        {
          IndexName: 'email-index',
          KeySchema: [
            { AttributeName: 'email', KeyType: 'HASH' }
          ],
          Projection: {
            ProjectionType: 'ALL'
          }
        }
      ],
      BillingMode: 'PAY_PER_REQUEST'
    });
    
    await client.send(command);
    console.log('✓ Sellers table created successfully!');
    console.log('\nYou can now restart your backend server.');
    
  } catch (error) {
    if (error.name === 'ResourceInUseException') {
      console.log('✓ Sellers table already exists!');
    } else {
      console.error('❌ Error:', error.message);
    }
  }
}

setupSellersTable();
