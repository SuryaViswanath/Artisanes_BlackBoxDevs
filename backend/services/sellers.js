import { PutCommand, GetCommand, QueryCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { docClient, config } from '../config/aws.js';

const SELLERS_TABLE = 'artisan-sellers';

export async function saveSeller(seller) {
  try {
    const command = new PutCommand({
      TableName: SELLERS_TABLE,
      Item: seller
    });

    await docClient.send(command);
    console.log('Seller saved:', seller.sellerId);
    return seller;
  } catch (error) {
    console.error('DynamoDB save seller error:', error);
    throw new Error(`Failed to save seller: ${error.message}`);
  }
}

export async function getSeller(sellerId) {
  try {
    const command = new GetCommand({
      TableName: SELLERS_TABLE,
      Key: { sellerId }
    });

    const response = await docClient.send(command);
    return response.Item;
  } catch (error) {
    console.error('DynamoDB get seller error:', error);
    throw new Error(`Failed to get seller: ${error.message}`);
  }
}

export async function getSellerByEmail(email) {
  try {
    const command = new QueryCommand({
      TableName: SELLERS_TABLE,
      IndexName: 'email-index',
      KeyConditionExpression: 'email = :email',
      ExpressionAttributeValues: {
        ':email': email
      }
    });

    const response = await docClient.send(command);
    return response.Items && response.Items.length > 0 ? response.Items[0] : null;
  } catch (error) {
    // If index doesn't exist, fall back to scan (slower but works for POC)
    console.log('Email index not found, using scan...');
    try {
      const { ScanCommand } = await import('@aws-sdk/lib-dynamodb');
      const scanCommand = new ScanCommand({
        TableName: SELLERS_TABLE,
        FilterExpression: 'email = :email',
        ExpressionAttributeValues: {
          ':email': email
        }
      });
      
      const response = await docClient.send(scanCommand);
      return response.Items && response.Items.length > 0 ? response.Items[0] : null;
    } catch (scanError) {
      console.error('DynamoDB scan error:', scanError);
      return null;
    }
  }
}

export async function updateSellerProductCount(sellerId, increment = 1) {
  try {
    const command = new UpdateCommand({
      TableName: SELLERS_TABLE,
      Key: { sellerId },
      UpdateExpression: 'SET productsCount = if_not_exists(productsCount, :zero) + :inc',
      ExpressionAttributeValues: {
        ':inc': increment,
        ':zero': 0
      },
      ReturnValues: 'ALL_NEW'
    });

    const response = await docClient.send(command);
    return response.Attributes;
  } catch (error) {
    console.error('Update seller product count error:', error);
    // Don't throw - this is not critical
  }
}


export async function updateSellerProfile(sellerId, profileData) {
  try {
    const command = new UpdateCommand({
      TableName: SELLERS_TABLE,
      Key: { sellerId },
      UpdateExpression: 'SET #story = :story, craftType = :craftType, experience = :experience, techniques = :techniques, materials = :materials, inspiration = :inspiration, profileComplete = :complete, updatedAt = :updatedAt',
      ExpressionAttributeNames: {
        '#story': 'story'
      },
      ExpressionAttributeValues: {
        ':story': profileData.story || '',
        ':craftType': profileData.craftType || '',
        ':experience': profileData.experience || '',
        ':techniques': profileData.techniques || '',
        ':materials': profileData.materials || '',
        ':inspiration': profileData.inspiration || '',
        ':complete': true,
        ':updatedAt': new Date().toISOString()
      },
      ReturnValues: 'ALL_NEW'
    });

    const response = await docClient.send(command);
    console.log('Seller profile updated:', sellerId);
    return response.Attributes;
  } catch (error) {
    console.error('Update seller profile error:', error);
    throw new Error(`Failed to update profile: ${error.message}`);
  }
}
