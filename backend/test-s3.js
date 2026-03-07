import { S3Client, PutObjectCommand, ListBucketsCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';

dotenv.config();

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
});

async function testS3() {
  console.log('Testing S3 connection...\n');
  
  // Test 1: List buckets
  console.log('Test 1: Listing buckets...');
  try {
    const listCommand = new ListBucketsCommand({});
    const response = await s3Client.send(listCommand);
    console.log('✓ Successfully connected to S3');
    console.log(`✓ Found ${response.Buckets.length} buckets`);
    
    const targetBucket = response.Buckets.find(b => b.Name === process.env.S3_BUCKET_NAME);
    if (targetBucket) {
      console.log(`✓ Target bucket "${process.env.S3_BUCKET_NAME}" exists`);
    } else {
      console.log(`✗ Target bucket "${process.env.S3_BUCKET_NAME}" NOT FOUND`);
      console.log('Available buckets:', response.Buckets.map(b => b.Name).join(', '));
    }
  } catch (error) {
    console.error('✗ Failed to list buckets:', error.message);
    return;
  }
  
  // Test 2: Upload a test file
  console.log('\nTest 2: Uploading test file...');
  try {
    const testContent = 'This is a test file from the artisan marketplace backend';
    const testKey = `test/test-${Date.now()}.txt`;
    
    const putCommand = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: testKey,
      Body: Buffer.from(testContent),
      ContentType: 'text/plain',
    });
    
    await s3Client.send(putCommand);
    console.log('✓ Successfully uploaded test file');
    console.log(`✓ File location: https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${testKey}`);
    console.log('\n✅ All S3 tests passed! Your configuration is working correctly.');
  } catch (error) {
    console.error('✗ Failed to upload test file:', error.message);
    console.error('\nPossible issues:');
    console.error('1. IAM user lacks S3 permissions (needs AmazonS3FullAccess)');
    console.error('2. Bucket name is incorrect');
    console.error('3. Credentials are invalid or expired');
  }
}

testS3();
