import OpenAI from 'openai';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Initialize environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Check if API key is set
if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key') {
  console.error('Error: OPENAI_API_KEY not set or using placeholder value');
  console.log('Please add your OpenAI API key to the .env file');
  process.exit(1);
}

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Test function for Vision API
async function testVisionAPI(imagePath) {
  try {
    console.log(`Testing OpenAI Vision API with image: ${imagePath}`);
    
    // Check if image exists
    if (!fs.existsSync(imagePath)) {
      console.error(`Error: Image file not found at ${imagePath}`);
      return false;
    }
    
    // Read the image file as base64
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString('base64');
    
    console.log('Image loaded successfully, sending to OpenAI Vision API...');
    
    // Make the API call
    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "What food item is in this image? Respond with just the food name, no other text." },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ]
        }
      ],
      max_tokens: 100
    });
    
    const dishName = response.choices[0].message.content.trim();
    
    console.log('✅ OpenAI Vision API is working!');
    console.log('Detected dish:', dishName);
    
    return true;
  } catch (error) {
    console.error('❌ OpenAI Vision API test failed:', error.message);
    return false;
  }
}

// Main test function
async function runTest() {
  try {
    // Check if test image exists or prompt to create/place one
    const testImagePath = path.join(__dirname, 'test-food.jpg');
    
    if (!fs.existsSync(testImagePath)) {
      console.log('\n⚠️ Test image not found at:', testImagePath);
      console.log('Please place a food image named "test-food.jpg" in the server directory and run this script again.');
      return;
    }
    
    // Test Vision API
    const visionSuccess = await testVisionAPI(testImagePath);
    
    if (visionSuccess) {
      console.log('\n✅ All tests passed! Your OpenAI Vision API integration is working correctly.');
      console.log('You can now run the full application with: node index.js');
    } else {
      console.log('\n❌ Vision API test failed. Please check your API key and try again.');
    }
  } catch (err) {
    console.error('Unexpected error during testing:', err);
  }
}

// Run the tests
runTest(); 