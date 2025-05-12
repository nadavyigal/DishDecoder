import { Recipe, DietaryType, DietaryPreference } from '../types';

// Mock API URL - would be replaced with actual API URL in production
const API_BASE_URL = 'https://api.dishdecoder.com/v1';

/**
 * Upload a food image and get a recipe ID
 */
export const uploadFoodImage = async (file: File): Promise<{ id: string }> => {
  try {
    // In a real implementation, this would be an actual API call
    // Mock implementation for now
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock successful response
        resolve({ id: 'recipe-123' });
      }, 2000);
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

/**
 * Fetches a recipe by ID with optional dietary preferences
 */
export const getRecipe = async (id: string, dietaryType?: DietaryType): Promise<Recipe> => {
  try {
    // In a real implementation, this would be an actual API call
    // Mock implementation for now
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock recipe data
        resolve({
          id,
          title: 'Vegetable Pasta Primavera',
          imageUrl: 'https://source.unsplash.com/random/800x600/?pasta',
          ingredients: [
            { id: '1', name: 'Pasta', quantity: '250', unit: 'g' },
            { id: '2', name: 'Cherry tomatoes', quantity: '200', unit: 'g' },
            { id: '3', name: 'Zucchini', quantity: '1', unit: 'medium' },
            { id: '4', name: 'Yellow bell pepper', quantity: '1', unit: 'medium' },
            { id: '5', name: 'Olive oil', quantity: '2', unit: 'tbsp' },
            { id: '6', name: 'Garlic', quantity: '2', unit: 'cloves' },
            { id: '7', name: 'Fresh basil', quantity: '1/4', unit: 'cup' },
            { id: '8', name: 'Parmesan cheese', quantity: '1/4', unit: 'cup' },
            { id: '9', name: 'Salt', quantity: '1/2', unit: 'tsp' },
            { id: '10', name: 'Black pepper', quantity: '1/4', unit: 'tsp' },
          ],
          steps: [
            { id: '1', instruction: 'Bring a large pot of salted water to a boil. Cook pasta according to package instructions until al dente.' },
            { id: '2', instruction: 'While pasta cooks, prepare the vegetables. Slice cherry tomatoes in half, dice zucchini and bell pepper.' },
            { id: '3', instruction: 'Heat olive oil in a large skillet over medium heat. Add garlic and sauté for 30 seconds until fragrant.' },
            { id: '4', instruction: 'Add zucchini and bell pepper to the skillet. Cook for 3-4 minutes until softened but still crisp.' },
            { id: '5', instruction: 'Add cherry tomatoes and cook for another 2 minutes until they begin to soften.' },
            { id: '6', instruction: 'Drain pasta, reserving 1/4 cup of pasta water.' },
            { id: '7', instruction: 'Add pasta to the skillet with the vegetables. Add the reserved pasta water, torn basil leaves, salt, and pepper.' },
            { id: '8', instruction: 'Toss everything together and cook for 1-2 minutes until well combined and heated through.' },
            { id: '9', instruction: 'Serve immediately, topped with freshly grated Parmesan cheese and additional basil if desired.' },
          ],
          prepTime: 15,
          cookTime: 20,
          servings: 4,
          difficulty: 'easy',
          cuisine: 'Italian',
          dietaryType: dietaryType || 'none',
          isAdapted: !!dietaryType && dietaryType !== 'none',
          adaptationNotes: dietaryType && dietaryType !== 'none' 
            ? [`Recipe adapted for ${dietaryType} diet.`] 
            : undefined,
          dietaryInfo: {
            isVegetarian: true,
            isVegan: false,
            isGlutenFree: false,
            isDairyFree: false,
          },
          hasVideoTutorials: true,
          videoTutorials: [
            {
              id: 'v1',
              title: 'How to Make Perfect Pasta Primavera',
              url: 'https://www.youtube.com/watch?v=example',
              thumbnailUrl: 'https://source.unsplash.com/random/300x200/?cooking',
              duration: 360,
            }
          ]
        });
      }, 1500);
    });
  } catch (error) {
    console.error('Error fetching recipe:', error);
    throw error;
  }
};

/**
 * Fetches all available recipes
 */
export const getRecipes = async (): Promise<Recipe[]> => {
  try {
    // In a real implementation, this would be an actual API call
    // Mock implementation for now
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock recipes data
        resolve([
          {
            id: '1',
            title: 'Vegetable Pasta Primavera',
            imageUrl: 'https://source.unsplash.com/random/300x200/?pasta',
            ingredients: [],
            steps: [],
            prepTime: 15,
            cookTime: 20,
            servings: 4,
            difficulty: 'easy',
            cuisine: 'Italian',
          },
          {
            id: '2',
            title: 'Thai Coconut Curry',
            imageUrl: 'https://source.unsplash.com/random/300x200/?curry',
            ingredients: [],
            steps: [],
            prepTime: 20,
            cookTime: 30,
            servings: 4,
            difficulty: 'medium',
            cuisine: 'Thai',
          },
          {
            id: '3',
            title: 'Berry Smoothie Bowl',
            imageUrl: 'https://source.unsplash.com/random/300x200/?smoothie',
            ingredients: [],
            steps: [],
            prepTime: 10,
            cookTime: 0,
            servings: 1,
            difficulty: 'easy',
            cuisine: 'Breakfast',
          },
          {
            id: '4',
            title: 'Mushroom Risotto',
            imageUrl: 'https://source.unsplash.com/random/300x200/?risotto',
            ingredients: [],
            steps: [],
            prepTime: 15,
            cookTime: 25,
            servings: 4,
            difficulty: 'medium',
            cuisine: 'Italian',
          },
          {
            id: '5',
            title: 'Classic Cheeseburger',
            imageUrl: 'https://source.unsplash.com/random/300x200/?burger',
            ingredients: [],
            steps: [],
            prepTime: 15,
            cookTime: 10,
            servings: 2,
            difficulty: 'easy',
            cuisine: 'American',
          },
          {
            id: '6',
            title: 'Avocado Toast',
            imageUrl: 'https://source.unsplash.com/random/300x200/?avocado',
            ingredients: [],
            steps: [],
            prepTime: 5,
            cookTime: 5,
            servings: 1,
            difficulty: 'easy',
            cuisine: 'Breakfast',
          }
        ]);
      }, 800);
    });
  } catch (error) {
    console.error('Error fetching recipes:', error);
    throw error;
  }
};

/**
 * Get available dietary preferences
 */
export const getDietaryPreferences = async (): Promise<DietaryPreference[]> => {
  // In a real implementation, this would fetch from an API
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      resolve([
        {
          id: 'vegetarian',
          name: 'Vegetarian',
          description: 'No meat, poultry, or seafood'
        },
        {
          id: 'vegan',
          name: 'Vegan',
          description: 'No animal products, including dairy, eggs, and honey'
        },
        {
          id: 'gluten-free',
          name: 'Gluten-Free',
          description: 'No wheat, barley, rye, or other gluten-containing ingredients'
        },
        {
          id: 'dairy-free',
          name: 'Dairy-Free',
          description: 'No milk, cheese, yogurt, butter, or other dairy products'
        },
        {
          id: 'keto',
          name: 'Keto',
          description: 'Very low carbohydrate, high fat diet'
        },
        {
          id: 'paleo',
          name: 'Paleo',
          description: 'Based on foods presumed to be available to ancient humans, excluding grains, legumes, dairy, processed foods'
        }
      ] as DietaryPreference[]);
    }, 1000);
  });
};

/**
 * Adapt a recipe for a dietary preference
 */
export const adaptRecipe = async (recipeId: string, dietaryType: DietaryType): Promise<Recipe> => {
  // In a real implementation, this would call the API
  return getRecipe(recipeId, dietaryType);
};