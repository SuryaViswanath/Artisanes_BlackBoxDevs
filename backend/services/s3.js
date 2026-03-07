import { PutObjectCommand } from '@aws-sdk/client-s3';
import { s3Client, config } from '../config/aws.js';

export async function uploadToS3(buffer, key, contentType) {
  try {
    const command = new PutObjectCommand({
      Bucket: config.s3BucketName,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    });

    await s3Client.send(command);

    // Return the S3 URL
    const url = `https://${config.s3BucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    return url;
  } catch (error) {
    console.error('S3 upload error:', error);
    throw new Error(`Failed to upload to S3: ${error.message}`);
  }
}
