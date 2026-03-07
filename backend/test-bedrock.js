import dotenv from 'dotenv';
import { generateListing } from './services/bedrock.js';

dotenv.config();

// Test the Bedrock listing generation
async function testBedrockIntegration() {
  console.log('🧪 Testing AWS Bedrock Integration...\n');
  
  const mockProductData = {
    productId: 'test-123',
    photoUrls: [
      'https://example.com/photo1.jpg',
      'https://example.com/photo2.jpg'
    ],
    transcription: `
      Hello, I'm excited to share this beautiful handcrafted clay pot with you. 
      This is a traditional clay pot that I made using techniques passed down through generations. 
      I used natural red clay sourced from local riverbanks and shaped it entirely by hand on a pottery wheel. 
      The process took about 3 hours from start to finish, including drying time. 
      Each pot is unique with its own character and imperfections that make it special. 
      It's perfect for storing water, keeping it cool naturally, or as a decorative piece. 
      The pot is about 10 inches tall and 8 inches wide, and it's completely food-safe and eco-friendly.
    `
  };

  try {
    console.log('📝 Input Transcription:');
    console.log(mockProductData.transcription.trim());
    console.log('\n⏳ Generating listing with AI...\n');
    
    const listing = await generateListing(mockProductData);
    
    console.log('✅ Listing Generated Successfully!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    console.log('📌 TITLE:');
    console.log(listing.title);
    console.log(`   (${listing.title.length} characters)\n`);
    
    console.log('📋 BULLET POINTS:');
    listing.bulletPoints.forEach((point, i) => {
      console.log(`   ${i + 1}. ${point}`);
    });
    console.log('');
    
    console.log('📄 DESCRIPTION:');
    console.log(listing.description);
    console.log('');
    
    console.log('🏷️  TAGS:');
    console.log(`   ${listing.tags.join(', ')}`);
    console.log('');
    
    console.log('📂 CATEGORY:');
    console.log(`   ${listing.category}`);
    console.log('');
    
    console.log('✨ STORY CARD:');
    console.log(listing.storyCard);
    console.log('');
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('📊 STATISTICS:');
    console.log(`   Title Length: ${listing.title.length} chars`);
    console.log(`   Bullet Points: ${listing.bulletPoints.length}`);
    console.log(`   Tags: ${listing.tags.length}`);
    console.log(`   Description Length: ${listing.description.length} chars`);
    console.log('');
    
    console.log('✅ Test completed successfully!');
    
    if (listing.title.includes('Handcrafted') && listing.bulletPoints.length === 5) {
      console.log('✅ Bedrock AI is working correctly!');
    } else {
      console.log('⚠️  Using fallback mock generator (Bedrock may not be configured)');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('\nTroubleshooting:');
    console.error('1. Check AWS credentials in .env file');
    console.error('2. Verify Bedrock model access is enabled');
    console.error('3. Ensure region supports Bedrock (us-east-1, us-west-2)');
    console.error('4. Check IAM permissions include bedrock:InvokeModel');
  }
}

// Run the test
testBedrockIntegration();
