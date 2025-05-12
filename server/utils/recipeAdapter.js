import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { logger } from './logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load dietary preferences data
const dietaryPreferencesPath = path.join(__dirname, '..', 'dietaryPreferences.json');
const dietaryPreferences = JSON.parse(fs.readFileSync(dietaryPreferencesPath, 'utf8'));

/**
 * Check if an ingredient needs substitution based on dietary type
 * @param {string} ingredientName - The ingredient name to check
 * @param {string} dietaryType - The dietary type (e.g., 'vegetarian', 'gluten-free')
 * @returns {boolean} - Whether the ingredient needs substitution
 */
function needsSubstitution(ingredientName, dietaryType) {
  const dietaryInfo = dietaryPreferences.dietaryTypes[dietaryType];
  if (!dietaryInfo) {
    logger.warn(`Unknown dietary type: ${dietaryType}`);
    return false;
  }

  // Check if any excluded ingredient is in the ingredient name
  return dietaryInfo.excludedIngredients.some(excluded => 
    ingredientName.toLowerCase().includes(excluded.toLowerCase())
  );
}

/**
 * Get substitutions for an ingredient based on dietary type
 * @param {string} ingredientName - The ingredient name to find substitutions for
 * @param {string} dietaryType - The dietary type (e.g., 'vegetarian', 'gluten-free')
 * @returns {string[]} - Array of possible substitutions
 */
function getSubstitutions(ingredientName, dietaryType) {
  const dietaryInfo = dietaryPreferences.dietaryTypes[dietaryType];
  if (!dietaryInfo) {
    logger.warn(`Unknown dietary type: ${dietaryType}`);
    return [];
  }

  // Find the excluded ingredient that matches
  const matchedExcluded = dietaryInfo.excludedIngredients.find(excluded => 
    ingredientName.toLowerCase().includes(excluded.toLowerCase())
  );

  if (matchedExcluded && dietaryInfo.substitutions[matchedExcluded]) {
    return dietaryInfo.substitutions[matchedExcluded];
  }

  // If no direct match, return a generic message
  return ["suitable alternative"];
}

/**
 * Adapt recipe ingredients to match dietary preferences
 * @param {Array} ingredients - Original recipe ingredients
 * @param {string} dietaryType - Dietary preference to adapt to
 * @returns {Object} - Adapted ingredients and notes
 */
function adaptIngredients(ingredients, dietaryType) {
  const adaptedIngredients = [];
  const notes = [];

  ingredients.forEach(ingredient => {
    const ingredientName = ingredient.name;
    
    if (needsSubstitution(ingredientName, dietaryType)) {
      const substitutions = getSubstitutions(ingredientName, dietaryType);
      const primarySubstitution = substitutions[0] || "suitable alternative";
      
      // Create adapted ingredient with substitution
      const adaptedIngredient = {
        ...ingredient,
        name: primarySubstitution,
        original: ingredientName,
        isSubstitute: true
      };
      
      adaptedIngredients.push(adaptedIngredient);
      
      // Create note about the substitution
      const note = `${ingredientName} has been replaced with ${primarySubstitution}`;
      if (substitutions.length > 1) {
        const alternatives = substitutions.slice(1).join(', ');
        notes.push(`${note}. Other alternatives: ${alternatives}.`);
      } else {
        notes.push(note);
      }
    } else {
      // Ingredient doesn't need substitution
      adaptedIngredients.push({
        ...ingredient,
        isSubstitute: false
      });
    }
  });

  return {
    adaptedIngredients,
    notes
  };
}

/**
 * Adapt cooking steps based on substituted ingredients
 * @param {Array} steps - Original recipe steps
 * @param {Array} ingredients - Original ingredients
 * @param {Array} adaptedIngredients - Adapted ingredients with substitutions
 * @returns {Object} - Adapted steps and notes
 */
function adaptSteps(steps, ingredients, adaptedIngredients) {
  const adaptedSteps = [...steps];
  const notes = [];
  
  // Find substituted ingredients
  const substitutions = adaptedIngredients
    .filter(ing => ing.isSubstitute)
    .map(ing => ({
      original: ing.original,
      substitute: ing.name
    }));
  
  if (substitutions.length === 0) {
    return { adaptedSteps, notes };
  }
  
  // Process each step to update instructions based on substitutions
  substitutions.forEach(sub => {
    adaptedSteps.forEach((step, index) => {
      if (step.instruction.toLowerCase().includes(sub.original.toLowerCase())) {
        const originalInstruction = step.instruction;
        // Replace the original ingredient with the substitution in the instruction
        const updatedInstruction = step.instruction.replace(
          new RegExp(sub.original, 'i'), 
          `${sub.substitute} (substituted for ${sub.original})`
        );
        
        adaptedSteps[index] = {
          ...step,
          instruction: updatedInstruction,
          originalInstruction
        };
        
        // Add a note about the step modification
        notes.push(`Step ${step.id} has been modified to use ${sub.substitute} instead of ${sub.original}.`);
      }
    });
  });
  
  return { adaptedSteps, notes };
}

/**
 * Adapt a recipe to match dietary preferences
 * @param {Object} recipe - Original recipe object
 * @param {string} dietaryType - Dietary preference to adapt to
 * @returns {Object} - Adapted recipe
 */
export function adaptRecipe(recipe, dietaryType) {
  try {
    logger.info(`Adapting recipe "${recipe.title}" for ${dietaryType} diet`);
    
    // Check if the dietary type exists
    if (!dietaryPreferences.dietaryTypes[dietaryType]) {
      logger.warn(`Unknown dietary type: ${dietaryType}, returning original recipe`);
      return {
        ...recipe,
        adaptationNotes: [`Dietary preference '${dietaryType}' is not supported.`]
      };
    }
    
    // Adapt ingredients
    const { adaptedIngredients, notes: ingredientNotes } = adaptIngredients(recipe.ingredients, dietaryType);
    
    // Adapt steps based on ingredient substitutions
    const { adaptedSteps, notes: stepNotes } = adaptSteps(recipe.steps, recipe.ingredients, adaptedIngredients);
    
    // Combine all notes
    const adaptationNotes = [
      `Recipe adapted for ${dietaryPreferences.dietaryTypes[dietaryType].name} diet:`,
      ...ingredientNotes,
      ...stepNotes
    ];
    
    // Create adapted recipe
    const adaptedRecipe = {
      ...recipe,
      ingredients: adaptedIngredients,
      steps: adaptedSteps,
      dietaryType,
      adaptationNotes,
      isAdapted: true
    };
    
    logger.info(`Successfully adapted recipe for ${dietaryType} diet with ${adaptationNotes.length - 1} modifications`);
    return adaptedRecipe;
  } catch (error) {
    logger.error(`Error adapting recipe: ${error.message}`, { error: error.stack });
    // Return original recipe if adaptation fails
    return {
      ...recipe,
      adaptationNotes: [`Failed to adapt for ${dietaryType} diet: ${error.message}`],
      isAdapted: false
    };
  }
}

/**
 * Get available dietary types
 * @returns {Object[]} - Array of dietary type objects with name and description
 */
export function getAvailableDietaryTypes() {
  return Object.entries(dietaryPreferences.dietaryTypes).map(([id, data]) => ({
    id,
    name: data.name,
    description: data.description
  }));
}

export default {
  adaptRecipe,
  getAvailableDietaryTypes
}; 