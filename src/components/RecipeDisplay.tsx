import React, { useState } from 'react';
import { ArrowLeft, Clock, Users, Bookmark, ChefHat, Info } from 'lucide-react';
import Button from './ui/Button';
import { Card, CardContent } from './ui/Card';
import { Recipe } from '../types';
import { formatTime } from '../utils/imageHelpers';
import DietaryPreferences from './DietaryPreferences';
import RecipeAdaptationNotes from './RecipeAdaptationNotes';
import { adaptRecipe } from '../services/api';

interface RecipeDisplayProps {
  recipe: Recipe;
  onBack: () => void;
}

const RecipeDisplay: React.FC<RecipeDisplayProps> = ({ recipe: initialRecipe, onBack }) => {
  const [recipe, setRecipe] = useState(initialRecipe);
  const [selectedDietaryType, setSelectedDietaryType] = useState<string | null>(null);
  const [isAdapting, setIsAdapting] = useState(false);

  const handleSelectDietaryType = async (dietaryType: string | null) => {
    if (dietaryType === null) {
      // Reset to original recipe
      setRecipe(initialRecipe);
      setSelectedDietaryType(null);
      return;
    }

    // Set loading state
    setIsAdapting(true);

    try {
      // Adapt recipe for selected dietary type
      const adaptedRecipe = await adaptRecipe(recipe.id, dietaryType);
      setRecipe(adaptedRecipe);
      setSelectedDietaryType(dietaryType);
    } catch (error) {
      console.error('Failed to adapt recipe:', error);
      // Show error message or handle failure
    } finally {
      setIsAdapting(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <Button
        type="button"
        variant="ghost"
        className="mb-4"
        icon={<ArrowLeft size={16} />}
        onClick={onBack}
      >
        Back to Upload
      </Button>

      <div className="mb-6">
        <div className="relative h-64 md:h-80 overflow-hidden rounded-xl">
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-6">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
              {recipe.title}
            </h1>
            <p className="text-white/80">
              {recipe.cuisine} • {recipe.difficulty} difficulty
            </p>
          </div>
        </div>
      </div>

      {/* Dietary Preferences Selector */}
      <DietaryPreferences 
        onSelectDietaryType={handleSelectDietaryType}
        selectedDietaryType={selectedDietaryType}
      />
      
      {/* Adaptation Notes */}
      {recipe.adaptationNotes && (
        <RecipeAdaptationNotes 
          adaptationNotes={recipe.adaptationNotes}
          isAdapted={recipe.isAdapted}
        />
      )}

      {isAdapting && (
        <div className="my-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-blue-500 text-center">Adapting recipe for your dietary preferences...</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 mt-6">
        <Card className="flex items-center p-4">
          <Clock className="h-5 w-5 text-[#FF6B35] mr-3" />
          <div>
            <p className="text-sm text-slate-500">Prep Time</p>
            <p className="font-medium">{formatTime(recipe.prepTime)}</p>
          </div>
        </Card>
        <Card className="flex items-center p-4">
          <ChefHat className="h-5 w-5 text-[#FF6B35] mr-3" />
          <div>
            <p className="text-sm text-slate-500">Cook Time</p>
            <p className="font-medium">{formatTime(recipe.cookTime)}</p>
          </div>
        </Card>
        <Card className="flex items-center p-4">
          <Users className="h-5 w-5 text-[#FF6B35] mr-3" />
          <div>
            <p className="text-sm text-slate-500">Servings</p>
            <p className="font-medium">{recipe.servings} people</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-1">
          <Card>
            <CardContent>
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <span className="w-1 h-6 bg-[#FF6B35] rounded-full mr-2"></span>
                Ingredients
              </h2>
              <ul className="space-y-3">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className={`flex items-start ${ingredient.isSubstitute ? 'bg-green-50 p-2 rounded-md' : ''}`}>
                    <span className={`w-2 h-2 rounded-full ${ingredient.isSubstitute ? 'bg-green-500' : 'bg-[#8AC926]'} mr-2 mt-2`}></span>
                    <div>
                      <span className="text-slate-800">
                        {ingredient.quantity} {ingredient.unit} {ingredient.name}
                      </span>
                      
                      {ingredient.isSubstitute && ingredient.original && (
                        <div className="text-xs text-green-700 mt-1 flex items-start">
                          <Info size={12} className="mr-1 mt-0.5" />
                          <span>Substituted for {ingredient.original}</span>
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <Button
                  fullWidth
                  variant="outline"
                  icon={<Bookmark size={16} />}
                >
                  Save Recipe
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <Card>
            <CardContent>
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <span className="w-1 h-6 bg-[#8AC926] rounded-full mr-2"></span>
                Instructions
              </h2>
              <ol className="space-y-6">
                {recipe.steps.map((step) => (
                  <li key={step.id} className={`relative pl-10 ${step.originalInstruction ? 'bg-green-50 p-3 rounded-md' : ''}`}>
                    <span className="absolute left-0 top-0 flex items-center justify-center w-7 h-7 rounded-full bg-[#1982C4] text-white font-medium text-sm">
                      {step.id}
                    </span>
                    <p className="text-slate-700 leading-relaxed">{step.instruction}</p>
                    
                    {step.originalInstruction && (
                      <div className="text-xs text-green-700 mt-2 flex items-start">
                        <Info size={12} className="mr-1 mt-0.5" />
                        <span>Original: {step.originalInstruction}</span>
                      </div>
                    )}
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RecipeDisplay;