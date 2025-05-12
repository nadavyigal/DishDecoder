export interface Ingredient {
  id: string;
  name: string;
  amount: string;
  unit: string;
  isSubstitution?: boolean;
  originalIngredient?: string;
}

export interface VideoTutorial {
  id: string;
  title: string;
  provider: 'youtube' | 'vimeo';
  videoId: string;
  thumbnailUrl?: string;
  duration?: number; // in seconds
}

export interface Step {
  id: string;
  description: string;
  image?: string;
  video?: VideoTutorial;
  isModified?: boolean;
  originalStep?: string;
  duration?: number; // in minutes
}

export interface RecipeNutrition {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  // Additional nutritional information can be added as needed
}

export interface DietaryInfo {
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  isDairyFree: boolean;
  isKeto: boolean;
  isPaleo: boolean;
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  image: string;
  prepTime: number; // in minutes
  cookTime: number; // in minutes
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  ingredients: Ingredient[];
  steps: Step[];
  tags: string[];
  nutrition?: RecipeNutrition;
  dietaryInfo?: DietaryInfo;
  isAdapted?: boolean;
  adaptationNotes?: string;
  hasVideoTutorials?: boolean;
  tutorialPlaylist?: VideoTutorial; // Overall recipe tutorial if available
}

export interface RecipeCardProps {
  recipe: Partial<Recipe>;
  onPress?: (recipe: Partial<Recipe>) => void;
}

export type DietaryType = 
  | 'vegetarian'
  | 'vegan'
  | 'gluten-free'
  | 'dairy-free'
  | 'keto'
  | 'paleo'
  | 'none';

export interface DietaryPreference {
  type: DietaryType;
  displayName: string;
  description: string;
  excludedIngredients: string[];
  substitutions: Record<string, string[]>;
}

export default Recipe; 