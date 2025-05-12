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

// Simple test function
async function testOpenAI() {
  try {
    console.log('Testing OpenAI connectivity...');
    
    // Basic completion test
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "user", content: "Hello, can you confirm this test is working?" }
      ]
    });
    
    console.log('✅ OpenAI text API is working!');
    console.log('Response:', completion.choices[0].message.content);
    
    return true;
  } catch (error) {
    console.error('❌ OpenAI API test failed:', error.message);
    return false;
  }
}

// Run the test
testOpenAI()
  .then(success => {
    if (success) {
      console.log('All tests passed! Your OpenAI integration is working.');
    } else {
      console.log('Test failed. Please check your API key and try again.');
    }
  })
  .catch(err => {
    console.error('Unexpected error during testing:', err);
  }); 