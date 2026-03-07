import { S3Client } from '@aws-sdk/client-s3';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { BedrockRuntimeClient } from '@aws-sdk/client-bedrock-runtime';
import dotenv from 'dotenv';

// Load environment variables first
dotenv.config();

const AWS_REGION = process.env.AWS_REGION || 'us-east-1';

// AWS credentials configuration
const awsCredentials = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
};

// S3 Client
export const s3Client = new S3Client({
  region: AWS_REGION,
  credentials: awsCredentials,
});

// DynamoDB Client (raw client for CreateTable/DescribeTable; docClient for items)
export const dynamoClient = new DynamoDBClient({
  region: AWS_REGION,
  credentials: awsCredentials,
});

export const docClient = DynamoDBDocumentClient.from(dynamoClient);

// Bedrock Client
export const bedrockClient = new BedrockRuntimeClient({
  region: AWS_REGION,
  credentials: awsCredentials,
});

export const config = {
  s3BucketName: process.env.S3_BUCKET_NAME,
  productsTable: process.env.DYNAMODB_PRODUCTS_TABLE,
  conversationsTable: process.env.DYNAMODB_CONVERSATIONS_TABLE,
  usersTable: process.env.DYNAMODB_USERS_TABLE,
  bedrockModelId: process.env.BEDROCK_MODEL_ID,
};
