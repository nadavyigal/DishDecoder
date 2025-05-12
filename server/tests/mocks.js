// Mock data and utilities for testing
import { join } from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

// Load sample recipes for testing
export const loadSampleRecipes = () => {
  try {
    const recipesPath = join(__dirname, '..', 'recipes.json');
    return JSON.parse(readFileSync(recipesPath, 'utf8'));
  } catch (error) {
    console.error('Error loading sample recipes:', error);
    return {};
  }
};

// Mock OpenAI API Vision response
export const mockOpenAIResponse = {
  id: 'chatcmpl-test123456789',
  object: 'chat.completion',
  created: 1683130000,
  model: 'gpt-4-vision-preview',
  choices: [
    {
      index: 0,
      message: {
        role: 'assistant',
        content: 'pasta'
      },
      finish_reason: 'stop'
    }
  ],
  usage: {
    prompt_tokens: 100,
    completion_tokens: 10,
    total_tokens: 110
  }
};

// For backward compatibility
export const mockClarifaiResponse = mockOpenAIResponse;

// Mock request object
export const mockRequest = (overrides = {}) => {
  const req = {
    body: {},
    params: {},
    query: {},
    headers: {},
    ...overrides,
  };
  return req;
};

// Mock response object
export const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  res.sendStatus = jest.fn().mockReturnValue(res);
  res.on = jest.fn().mockImplementation((event, cb) => {
    if (event === 'finish') {
      cb();
    }
    return res;
  });
  res.set = jest.fn().mockReturnValue(res);
  return res;
};

// Mock next function
export const mockNext = jest.fn(); 