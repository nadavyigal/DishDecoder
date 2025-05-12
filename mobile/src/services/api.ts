import { Platform } from 'react-native';
import { DietaryPreference, DietaryType, Recipe } from '../types/Recipe';

// Set the API base URL depending on the environment
const API_BASE_URL = 
  Platform.OS === 'ios' 
    ? 'http://localhost:3000/api' // iOS Simulator uses localhost
    : 'http://10.0.2.2:3000/api';  // Android Emulator needs special IP

class ApiService {
  /**
   * Fetches a recipe by ID with optional dietary preferences
   */
  async getRecipe(id: string, dietaryType?: DietaryType): Promise<Recipe> {
    try {
      const queryParams = dietaryType && dietaryType !== 'none' 
        ? `?dietaryType=${dietaryType}` 
        : '';
      
      const response = await fetch(`${API_BASE_URL}/recipes/${id}${queryParams}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch recipe: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching recipe:', error);
      throw error;
    }
  }

  /**
   * Fetches all available recipes
   */
  async getRecipes(): Promise<Recipe[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/recipes`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch recipes: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching recipes:', error);
      throw error;
    }
  }

  /**
   * Adapts a recipe to a specific dietary preference
   */
  async adaptRecipe(id: string, dietaryType: DietaryType): Promise<Recipe> {
    try {
      const response = await fetch(`${API_BASE_URL}/recipes/${id}/adapt`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dietaryType }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to adapt recipe: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error adapting recipe:', error);
      throw error;
    }
  }

  /**
   * Uploads an image for dish identification
   */
  async identifyDish(imageUri: string): Promise<{ recipeId: string }> {
    try {
      const formData = new FormData();
      
      // Create file object from URI
      const filename = imageUri.split('/').pop() || 'photo.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';
      
      // @ts-ignore - React Native's FormData implementation
      formData.append('image', {
        uri: imageUri,
        name: filename,
        type,
      });
      
      const response = await fetch(`${API_BASE_URL}/identify-dish`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to identify dish: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error identifying dish:', error);
      throw error;
    }
  }

  /**
   * Fetches all available dietary preferences
   */
  async getDietaryPreferences(): Promise<DietaryPreference[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/dietary-preferences`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch dietary preferences: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching dietary preferences:', error);
      throw error;
    }
  }
}

// Export a singleton instance
export const apiService = new ApiService();
export default apiService; 