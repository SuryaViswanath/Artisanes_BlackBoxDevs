import { PutCommand, GetCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { docClient, config } from '../config/aws.js';

export async function saveProduct(product) {
  try {
    const command = new PutCommand({
      TableName: config.productsTable,
      Item: product
    });

    await docClient.send(command);
    console.log('Product saved:', product.productId);
    return product;
  } catch (error) {
    console.error('DynamoDB save error:', error);
    throw new Error(`Failed to save product: ${error.message}`);
  }
}

export async function getProduct(productId) {
  try {
    const command = new GetCommand({
      TableName: config.productsTable,
      Key: { productId }
    });

    const response = await docClient.send(command);
    return response.Item;
  } catch (error) {
    console.error('DynamoDB get error:', error);
    throw new Error(`Failed to get product: ${error.message}`);
  }
}

export async function getAllProducts() {
  try {
    const command = new ScanCommand({
      TableName: config.productsTable,
      FilterExpression: '#status = :published',
      ExpressionAttributeNames: {
        '#status': 'status'
      },
      ExpressionAttributeValues: {
        ':published': 'published'
      }
    });

    const response = await docClient.send(command);
    return response.Items || [];
  } catch (error) {
    console.error('DynamoDB scan error:', error);
    throw new Error(`Failed to get products: ${error.message}`);
  }
}


export async function getProductsBySeller(sellerId) {
  try {
    const command = new ScanCommand({
      TableName: config.productsTable,
      FilterExpression: 'sellerId = :sellerId',
      ExpressionAttributeValues: {
        ':sellerId': sellerId
      }
    });

    const response = await docClient.send(command);
    return response.Items || [];
  } catch (error) {
    console.error('DynamoDB get seller products error:', error);
    return [];
  }
}
