import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Custom render function to include providers if needed
function customRender(ui, options = {}) {
  return render(ui, {
    // Wrap component with any providers needed
    wrapper: ({ children }) => children,
    ...options,
  });
}

// Create a user event for testing interactions
function setupUserEvent() {
  return userEvent.setup();
}

// Re-export everything from testing-library
export * from '@testing-library/react';

// Override render method
export { customRender as render, setupUserEvent };

// Mock API responses for tests
export const mockApiResponses = {
  uploadSuccess: {
    id: 'recipe-123',
    dishName: 'pasta',
    confidence: 95,
    found: true,
  },
  recipeSuccess: {
    id: 'recipe-123',
    title: 'Homemade Pasta with Tomato Sauce',
    imageUrl: 'https://example.com/pasta.jpg',
    ingredients: [
      { name: 'Flour', quantity: '2', unit: 'cups' },
      { name: 'Eggs', quantity: '3', unit: 'large' },
    ],
    steps: [
      { id: 1, instruction: 'Mix flour and salt in a large bowl.' },
      { id: 2, instruction: 'Make a well in the center and crack eggs into it.' },
    ],
    prepTime: 45,
    cookTime: 30,
    servings: 4,
    difficulty: 'medium',
    cuisine: 'Italian',
  },
  dietaryPreferencesSuccess: [
    {
      id: 'vegetarian',
      name: 'Vegetarian',
      description: 'No meat, poultry, or seafood',
    },
    {
      id: 'vegan',
      name: 'Vegan',
      description: 'No animal products, including dairy, eggs, and honey',
    },
  ],
  errorResponse: {
    error: 'Failed to process request',
  },
}; 