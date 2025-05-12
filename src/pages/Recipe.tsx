import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Users, ChefHat, Heart, Share2 } from 'lucide-react';
import { getRecipe } from '../services/api';
import { Recipe as RecipeType, DietaryType } from '../types';
import AppLoader from '../components/AppLoader';

const dietaryOptions: { id: DietaryType; label: string }[] = [
  { id: 'none', label: 'Original Recipe' },
  { id: 'vegetarian', label: 'Vegetarian' },
  { id: 'vegan', label: 'Vegan' },
  { id: 'gluten-free', label: 'Gluten-Free' },
  { id: 'dairy-free', label: 'Dairy-Free' },
  { id: 'keto', label: 'Keto' },
  { id: 'paleo', label: 'Paleo' },
];

const Recipe: React.FC = () => {
  const { recipeId } = useParams<{ recipeId: string }>();
  const navigate = useNavigate();
  
  const [recipe, setRecipe] = useState<RecipeType | null>(null);
  const [selectedDietaryType, setSelectedDietaryType] = useState<DietaryType>('none');
  const [isAdapting, setIsAdapting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const loadRecipe = async () => {
      if (!recipeId) return;
      
      try {
        setIsLoading(true);
        const recipeData = await getRecipe(recipeId);
        setRecipe(recipeData);
      } catch (error) {
        console.error('Failed to load recipe:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadRecipe();
  }, [recipeId]);

  const handleSelectDietaryType = async (type: DietaryType) => {
    if (type === selectedDietaryType || !recipeId) return;
    
    setIsAdapting(true);
    setSelectedDietaryType(type);
    
    try {
      const adaptedRecipe = await getRecipe(recipeId, type);
      setRecipe(adaptedRecipe);
    } catch (error) {
      console.error('Failed to adapt recipe:', error);
    } finally {
      setIsAdapting(false);
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // In a real app, this would update the user's favorites in a database
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: recipe?.title || 'Check out this recipe!',
        text: `Check out this delicious ${recipe?.title} recipe!`,
        url: window.location.href,
      }).catch((error) => console.log('Error sharing', error));
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href)
        .then(() => alert('Link copied to clipboard!'))
        .catch((error) => console.error('Failed to copy link:', error));
    }
  };

  if (isLoading) {
    return <AppLoader message="Loading recipe..." />;
  }

  if (!recipe) {
    return (
      <div className="page-container">
        <div className="text-center py-12">
          <p className="text-lg text-gray-600 mb-4">
            Recipe not found or there was an error loading it.
          </p>
          <button
            className="btn btn-primary py-2 px-4"
            onClick={() => navigate('/')}
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-16">
      {/* Recipe Hero */}
      <div className="relative h-64 md:h-80">
        <img
          src={recipe.imageUrl}
          alt={recipe.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent">
          <div className="absolute top-4 left-4">
            <button
              onClick={() => navigate(-1)}
              className="bg-white/20 backdrop-blur-sm p-2 rounded-full hover:bg-white/30 transition-colors"
            >
              <ArrowLeft className="text-white" size={20} />
            </button>
          </div>
          <div className="absolute top-4 right-4 flex gap-2">
            <button
              onClick={toggleFavorite}
              className="bg-white/20 backdrop-blur-sm p-2 rounded-full hover:bg-white/30 transition-colors"
            >
              <Heart 
                className={isFavorite ? 'text-feedback-error' : 'text-white'} 
                fill={isFavorite ? '#FF6B6B' : 'none'}
                size={20} 
              />
            </button>
            <button
              onClick={handleShare}
              className="bg-white/20 backdrop-blur-sm p-2 rounded-full hover:bg-white/30 transition-colors"
            >
              <Share2 className="text-white" size={20} />
            </button>
          </div>
          <div className="absolute bottom-0 left-0 p-4 md:p-6">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
              {recipe.title}
            </h1>
            <div className="flex flex-wrap gap-2 text-white/90 text-sm">
              <span>{recipe.cuisine}</span>
              <span>•</span>
              <span className="capitalize">{recipe.difficulty} difficulty</span>
              {recipe.isAdapted && <span>• Adapted</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Recipe Info */}
      <div className="flex justify-around py-4 bg-white shadow-sm">
        <div className="text-center">
          <div className="flex items-center justify-center">
            <Clock size={16} className="text-gray-500 mr-1" />
            <span className="text-sm text-gray-700">{recipe.prepTime + recipe.cookTime} min</span>
          </div>
          <span className="text-xs text-gray-500">Total Time</span>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center">
            <Users size={16} className="text-gray-500 mr-1" />
            <span className="text-sm text-gray-700">{recipe.servings}</span>
          </div>
          <span className="text-xs text-gray-500">Servings</span>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center">
            <ChefHat size={16} className="text-gray-500 mr-1" />
            <span className="text-sm text-gray-700 capitalize">{recipe.difficulty}</span>
          </div>
          <span className="text-xs text-gray-500">Difficulty</span>
        </div>
      </div>

      <div className="page-container">
        {/* Dietary Preferences */}
        <div className="my-4">
          <h2 className="text-lg font-semibold mb-2">Dietary Preferences</h2>
          <div className="flex flex-wrap gap-2">
            {dietaryOptions.map((option) => (
              <button
                key={option.id}
                className={`px-3 py-1.5 rounded-full text-sm ${
                  selectedDietaryType === option.id
                    ? 'bg-primary-main text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => handleSelectDietaryType(option.id)}
                disabled={isAdapting}
              >
                {option.label}
              </button>
            ))}
          </div>
          
          {isAdapting && (
            <div className="mt-3 p-3 bg-primary-light/10 text-primary-dark rounded-md flex items-center justify-center">
              <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
              <span>Adapting recipe...</span>
            </div>
          )}
          
          {recipe.adaptationNotes && recipe.adaptationNotes.length > 0 && (
            <div className={`mt-3 p-3 rounded-md ${recipe.isAdapted ? 'bg-secondary-light/10 text-secondary-dark' : 'bg-gray-100 text-gray-700'}`}>
              {recipe.adaptationNotes.map((note, index) => (
                <p key={index} className="text-sm">{note}</p>
              ))}
            </div>
          )}
        </div>
        
        {/* Ingredients */}
        <section className="my-6">
          <h2 className="text-xl font-semibold mb-3">Ingredients</h2>
          <ul className="space-y-2 border-l-2 border-primary-light pl-4">
            {recipe.ingredients.map((ingredient) => (
              <li key={ingredient.id} className="text-sm md:text-base text-gray-700">
                <span className="font-medium">{ingredient.quantity} {ingredient.unit}</span> {ingredient.name}
                {ingredient.note && <span className="text-gray-500 ml-1">({ingredient.note})</span>}
              </li>
            ))}
          </ul>
        </section>
        
        {/* Instructions */}
        <section className="my-6">
          <h2 className="text-xl font-semibold mb-3">Instructions</h2>
          <ol className="space-y-4">
            {recipe.steps.map((step, index) => (
              <li key={step.id} className="pb-4 border-b border-gray-100 last:border-0">
                <div className="flex">
                  <div className="mr-4 h-8 w-8 rounded-full bg-primary-main/10 flex items-center justify-center shrink-0">
                    <span className="text-primary-dark font-semibold">{index + 1}</span>
                  </div>
                  <p className="text-gray-700">{step.instruction}</p>
                </div>
                {step.imageUrl && (
                  <img 
                    src={step.imageUrl} 
                    alt={`Step ${index + 1}`} 
                    className="mt-3 w-full h-40 object-cover rounded-md"
                  />
                )}
              </li>
            ))}
          </ol>
        </section>
        
        {/* Video Tutorial */}
        {recipe.hasVideoTutorials && recipe.videoTutorials && recipe.videoTutorials.length > 0 && (
          <section className="my-6">
            <h2 className="text-xl font-semibold mb-3">Video Tutorial</h2>
            <div className="bg-gray-100 rounded-lg overflow-hidden">
              <div className="relative pb-[56.25%]">
                <img 
                  src={recipe.videoTutorials[0].thumbnailUrl || recipe.imageUrl} 
                  alt={recipe.videoTutorials[0].title}
                  className="absolute inset-0 w-full h-full object-cover" 
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <a 
                    href={recipe.videoTutorials[0].url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-primary-main text-white p-4 rounded-full hover:bg-primary-dark transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default Recipe; 