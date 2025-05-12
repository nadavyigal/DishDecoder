import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { XCircle } from 'lucide-react';
import { Recipe } from '../types';
import RecipeCard from '../components/RecipeCard';

// Mock favorites data (to be replaced with actual storage/API)
const initialFavorites: Recipe[] = [
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
];

const Favorites: React.FC = () => {
  const [favorites, setFavorites] = useState<Recipe[]>(initialFavorites);
  const navigate = useNavigate();

  const handleRemoveFavorite = (id: string) => {
    if (window.confirm('Are you sure you want to remove this recipe from favorites?')) {
      setFavorites(favorites.filter(recipe => recipe.id !== id));
    }
  };

  return (
    <div className="page-container">
      <div className="mb-6">
        <h1 className="page-title">Favorites</h1>
        <p className="page-subtitle">Your saved recipes</p>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-bold text-gray-800 mb-3">No Favorites Yet</h2>
          <p className="text-gray-600 mb-6">
            Start adding recipes to your favorites to see them here.
          </p>
          <button 
            className="btn btn-primary py-2 px-6"
            onClick={() => navigate('/')}
          >
            Browse Recipes
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {favorites.map(recipe => (
            <div key={recipe.id} className="relative">
              <RecipeCard recipe={recipe} />
              <button
                onClick={() => handleRemoveFavorite(recipe.id)}
                className="absolute top-2 right-2 bg-feedback-error text-white rounded-full p-1 shadow-md hover:bg-feedback-error/90 transition-colors z-10"
                aria-label="Remove from favorites"
              >
                <XCircle size={18} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites; 