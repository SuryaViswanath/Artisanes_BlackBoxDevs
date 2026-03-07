import { InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';
import { bedrockClient, config } from '../config/aws.js';

export async function generateListing(productData) {
  const { transcription, photoUrls, productId } = productData;

  const prompt = `You are an expert Amazon listing creator for handcrafted artisan products. 
Based on the artisan's voice description below, create a professional, SEO-optimized Amazon product listing.

ARTISAN'S DESCRIPTION:
${transcription}

PRODUCT IMAGES: ${photoUrls.length} photos provided

Generate a complete Amazon listing with the following:

1. TITLE (50-80 characters, Amazon-optimized):
   - Include key materials and product type
   - Make it searchable and compelling
   - No promotional language

2. BULLET POINTS (5 key features, each 150-200 characters):
   - Highlight materials, craftsmanship, and benefits
   - Focus on what makes it unique
   - Include dimensions if mentioned
   - Emphasize handmade quality

3. DESCRIPTION (200-300 words):
   - Tell the artisan's story
   - Explain the craft technique
   - Describe materials and process
   - Include care instructions if relevant
   - Make it authentic and personal

4. TAGS (10-15 relevant keywords):
   - Include craft type, materials, style
   - Add use cases and occasions
   - Make them searchable

5. CATEGORY SUGGESTION:
   - Best Amazon category for this product

6. STORY CARD (100-150 words):
   - "Meet the Maker" section
   - Artisan background and technique
   - What makes this product special
   - Authenticity markers

Format your response as JSON:
{
  "title": "...",
  "bulletPoints": ["...", "...", "...", "...", "..."],
  "description": "...",
  "tags": ["...", "...", ...],
  "category": "...",
  "storyCard": "..."
}

Be authentic, highlight the handmade nature, and optimize for Amazon search.`;

  try {
    // Determine model type based on model ID
    const isClaude = config.bedrockModelId.includes('anthropic');
    const isTitan = config.bedrockModelId.includes('titan');
    const isNova = config.bedrockModelId.includes('nova');
    
    let requestBody;
    if (isClaude) {
      requestBody = {
        anthropic_version: 'bedrock-2023-05-31',
        max_tokens: 2000,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7
      };
    } else if (isTitan) {
      requestBody = {
        inputText: prompt,
        textGenerationConfig: {
          maxTokenCount: 2000,
          temperature: 0.7,
          topP: 0.9
        }
      };
    } else if (isNova) {
      // Nova uses the same format as Claude (Messages API)
      requestBody = {
        messages: [
          {
            role: 'user',
            content: [{ text: prompt }]
          }
        ],
        inferenceConfig: {
          maxTokens: 2000,
          temperature: 0.7
        }
      };
    }
    
    const command = new InvokeModelCommand({
      modelId: config.bedrockModelId,
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify(requestBody)
    });

    const response = await bedrockClient.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    
    // Extract the text content based on model type
    let textContent;
    if (isClaude) {
      textContent = responseBody.content[0].text;
    } else if (isTitan) {
      textContent = responseBody.results[0].outputText;
    } else if (isNova) {
      textContent = responseBody.output.message.content[0].text;
    }
    
    // Parse the JSON from the response - use a more robust approach
    let listing;
    try {
      // First, try to find and parse the JSON directly
      const jsonMatch = textContent.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Could not find JSON in AI response');
      }
      
      listing = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      // If direct parsing fails, clean the string first
      console.log('Direct JSON parse failed, trying with cleanup...');
      const jsonMatch = textContent.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Could not find JSON in AI response');
      }
      
      // More aggressive cleaning
      let cleanedJson = jsonMatch[0];
      
      // Replace literal newlines within string values with escaped newlines
      cleanedJson = cleanedJson.replace(/"([^"]*?)"/g, (match, content) => {
        const escaped = content
          .replace(/\\/g, '\\\\')
          .replace(/\n/g, '\\n')
          .replace(/\r/g, '\\r')
          .replace(/\t/g, '\\t')
          .replace(/[\u0000-\u001F\u007F-\u009F]/g, '');
        return `"${escaped}"`;
      });
      
      listing = JSON.parse(cleanedJson);
    }
    
    console.log('Generated listing:', listing);
    return listing;

  } catch (error) {
    console.error('Bedrock error:', error);
    console.error('Error details:', error.message);
    
    // Fallback to mock listing if Bedrock fails
    console.log('Using fallback mock listing');
    return generateMockListing(transcription);
  }
}

// Fallback mock listing generator
function generateMockListing(transcription) {
  // Extract key information from transcription
  const words = transcription.toLowerCase();
  
  // Try to identify product type
  let productType = 'Handcrafted Product';
  if (words.includes('pot') || words.includes('clay')) productType = 'Clay Pot';
  if (words.includes('jewelry') || words.includes('necklace')) productType = 'Handmade Jewelry';
  if (words.includes('textile') || words.includes('fabric')) productType = 'Handwoven Textile';
  if (words.includes('basket')) productType = 'Woven Basket';
  
  return {
    title: `Handcrafted ${productType} - Traditional Artisan Made`,
    bulletPoints: [
      '100% Handmade by skilled artisan using traditional techniques',
      'Made from natural, eco-friendly materials sourced locally',
      'Each piece is unique with its own character and charm',
      'Perfect for home decor or as a thoughtful gift',
      'Supports local artisans and preserves traditional crafts'
    ],
    description: `This beautiful ${productType.toLowerCase()} is handcrafted with care and attention to detail. ${transcription.substring(0, 200)}... Each piece tells a story of traditional craftsmanship passed down through generations. The artisan uses time-honored techniques to create products that are not only functional but also works of art. By purchasing this item, you're supporting local artisans and helping preserve traditional craft techniques.`,
    tags: [
      'handmade',
      'artisan',
      'traditional',
      'handcrafted',
      'eco-friendly',
      'natural',
      'unique',
      'home-decor',
      'gift',
      'sustainable'
    ],
    category: 'Home & Kitchen > Home Décor > Decorative Accessories',
    storyCard: `Meet the artisan behind this beautiful creation. Using techniques passed down through generations, each piece is crafted with dedication and skill. The materials are sourced locally, ensuring authenticity and sustainability. Every product is unique, carrying the maker's personal touch and the rich heritage of traditional craftsmanship.`
  };
}

export async function chatWithAI(conversationHistory, userMessage, productContext) {
  const systemPrompt = `You are a helpful AI assistant helping an artisan gather complete product information for their marketplace listing.

Your goal is to ask clarifying questions to gather:
- Care instructions (how to wash, clean, maintain)
- Storage recommendations
- Customization options available
- Shipping considerations (fragile, special packaging)
- Exact dimensions and weight
- Any other details that would help customers

PRODUCT CONTEXT:
${productContext ? JSON.stringify(productContext, null, 2) : 'No context yet'}

CONVERSATION SO FAR:
${conversationHistory.map(msg => `${msg.role}: ${msg.content}`).join('\n')}

USER MESSAGE: ${userMessage}

Respond naturally and conversationally. Ask one question at a time. Be friendly and supportive.
If the artisan has provided enough information, summarize what you've learned and ask if there's anything else.`;

  try {
    // Determine model type based on model ID
    const isClaude = config.bedrockModelId.includes('anthropic');
    const isTitan = config.bedrockModelId.includes('titan');
    const isNova = config.bedrockModelId.includes('nova');
    
    let requestBody;
    if (isClaude) {
      requestBody = {
        anthropic_version: 'bedrock-2023-05-31',
        max_tokens: 500,
        messages: [
          {
            role: 'user',
            content: systemPrompt
          }
        ],
        temperature: 0.8
      };
    } else if (isTitan) {
      requestBody = {
        inputText: systemPrompt,
        textGenerationConfig: {
          maxTokenCount: 500,
          temperature: 0.8,
          topP: 0.9
        }
      };
    } else if (isNova) {
      // Nova uses the same format as Claude (Messages API)
      requestBody = {
        messages: [
          {
            role: 'user',
            content: [{ text: systemPrompt }]
          }
        ],
        inferenceConfig: {
          maxTokens: 500,
          temperature: 0.8
        }
      };
    }
    
    const command = new InvokeModelCommand({
      modelId: config.bedrockModelId,
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify(requestBody)
    });

    const response = await bedrockClient.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    
    // Extract response based on model type
    let aiResponse;
    if (isClaude) {
      aiResponse = responseBody.content[0].text;
    } else if (isTitan) {
      aiResponse = responseBody.results[0].outputText;
    } else if (isNova) {
      aiResponse = responseBody.output.message.content[0].text;
    }

    console.log('AI chat response:', aiResponse);
    return { response: aiResponse, success: true };

  } catch (error) {
    console.error('Chat AI error:', error);
    
    // Fallback to mock responses
    return generateMockChatResponse(conversationHistory, userMessage);
  }
}

function generateMockChatResponse(conversationHistory, userMessage) {
  const questionCount = conversationHistory.filter(msg => msg.role === 'assistant').length;
  
  const questions = [
    "Great! Let me help you gather some important details. First, how should customers care for this product? For example, can it be washed, and if so, how?",
    "Thanks for that information! How should customers store this product when not in use? Are there any special storage requirements?",
    "Perfect! Can customers request any customizations? For example, different colors, sizes, or personalization?",
    "Good to know! Is this product fragile or does it need special packaging for shipping?",
    "Excellent! Could you provide the exact dimensions (length, width, height) and approximate weight of the product?",
    "Thank you for all this information! Is there anything else customers should know about this product that we haven't covered?"
  ];

  if (questionCount < questions.length) {
    return {
      response: questions[questionCount],
      success: true
    };
  }

  return {
    response: "Perfect! I have all the information I need. This will help create comprehensive FAQs and provide great customer support. Thank you!",
    success: true
  };
}
