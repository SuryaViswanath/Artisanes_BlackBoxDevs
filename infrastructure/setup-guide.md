# AWS Infrastructure Setup Guide

This guide helps you set up the required AWS resources for the Artisan Marketplace POC using the AWS Free Tier.

## Prerequisites

1. AWS Account with Free Tier access
2. AWS CLI installed and configured
3. Basic understanding of AWS services

## Required AWS Services

### 1. S3 Bucket (Media Storage)

Create an S3 bucket for storing product images and voice recordings:

```bash
aws s3 mb s3://artisan-marketplace-media --region us-east-1
```

Enable CORS for the bucket:

```bash
aws s3api put-bucket-cors --bucket artisan-marketplace-media --cors-configuration file://s3-cors.json
```

### 2. DynamoDB Tables

Create products table:

```bash
aws dynamodb create-table \
  --table-name artisan-products \
  --attribute-definitions AttributeName=productId,AttributeType=S \
  --key-schema AttributeName=productId,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region us-east-1
```

Create conversations table:

```bash
aws dynamodb create-table \
  --table-name artisan-conversations \
  --attribute-definitions AttributeName=conversationId,AttributeType=S \
  --key-schema AttributeName=conversationId,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region us-east-1
```

### 3. IAM User & Permissions

Create an IAM user with programmatic access and attach the following policies:

- AmazonS3FullAccess (or custom policy with s3:PutObject, s3:GetObject)
- AmazonDynamoDBFullAccess (or custom policy with dynamodb:PutItem, dynamodb:GetItem, dynamodb:Scan)
- AmazonBedrockFullAccess (for AI model access)
- AmazonTranscribeFullAccess (for voice-to-text)

Save the Access Key ID and Secret Access Key for your `.env` file.

### 4. Bedrock Model Access

Enable model access in AWS Bedrock console:

1. Go to AWS Bedrock console
2. Navigate to "Model access"
3. Request access to: `anthropic.claude-3-haiku-20240307-v1:0`
4. Wait for approval (usually instant for Haiku)

## Cost Estimates (Free Tier)

- **S3**: 5GB storage, 20,000 GET requests, 2,000 PUT requests/month
- **DynamoDB**: 25GB storage, 25 read/write capacity units
- **Bedrock**: Pay-as-you-go (Claude Haiku: ~$0.25 per 1M input tokens)
- **Transcribe**: 60 minutes free per month

**Estimated monthly cost for POC**: $5-10 (mostly Bedrock usage)

## Environment Variables

After setup, update your `backend/.env` file:

```
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here
S3_BUCKET_NAME=artisan-marketplace-media
DYNAMODB_PRODUCTS_TABLE=artisan-products
DYNAMODB_CONVERSATIONS_TABLE=artisan-conversations
BEDROCK_MODEL_ID=anthropic.claude-3-haiku-20240307-v1:0
```

## Verification

Test your setup:

```bash
# Test S3
aws s3 ls s3://artisan-marketplace-media

# Test DynamoDB
aws dynamodb describe-table --table-name artisan-products

# Test Bedrock access
aws bedrock list-foundation-models --region us-east-1
```

## Next Steps

Once infrastructure is set up, proceed to implement:
1. Photo and voice upload (Step 2)
2. Bedrock listing generation (Step 3)
3. Conversational AI (Step 4)
4. Buyer marketplace (Step 5)
