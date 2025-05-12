export interface Recipe {
  id: string;
  title: string;
  imageUrl: string;
  ingredients: Ingredient[];
  steps: Step[];
  prepTime: number; // in minutes
  cookTime: number; // in minutes
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  cuisine: string;
  dietaryType?: DietaryType;
  adaptationNotes?: string[];
  isAdapted?: boolean;
  nutrition?: RecipeNutrition;
  dietaryInfo?: DietaryInfo;
  hasVideoTutorials?: boolean;
  videoTutorials?: VideoTutorial[];
}

export interface Ingredient {
  id: string;
  name: string;
  quantity: string;
  unit?: string;
  note?: string;
}

export interface Step {
  id: string;
  instruction: string;
  imageUrl?: string;
}

export interface RecipeNutrition {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
}

export interface DietaryInfo {
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  isDairyFree: boolean;
  isKeto?: boolean;
  isPaleo?: boolean;
}

export interface VideoTutorial {
  id: string;
  title: string;
  url: string;
  thumbnailUrl?: string;
  duration?: number; // in seconds
}

export interface User {
  id: string;
  name: string;
  email: string;
  photoURL?: string;
  bio?: string;
  dietaryPreferences?: string[];
  favorites?: string[];
  following?: string[];
  followers?: number;
}

export type DietaryType = 'none' | 'vegetarian' | 'vegan' | 'gluten-free' | 'dairy-free' | 'keto' | 'paleo';

export interface DietaryPreference {
  id: DietaryType;
  name: string;
  description: string;
}

export interface UploadStatus {
  isUploading: boolean;
  progress: number;
  error: string | null;
}