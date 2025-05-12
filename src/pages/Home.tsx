import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Camera } from 'lucide-react';
import AppLoader from '../components/AppLoader';
import RecipeCard from '../components/RecipeCard';
import { Recipe } from '../types';

// Mock recipes data (to be replaced with actual API)
const mockRecipes: Recipe[] = [
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
];

const Home: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API loading
    const timer = setTimeout(() => {
      setRecipes(mockRecipes);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const filteredRecipes = recipes.filter(recipe => 
    recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    recipe.cuisine.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="page-container">
      <div className="mb-6">
        <h1 className="page-title">DishDecoder</h1>
        <p className="page-subtitle">Discover delicious recipes</p>
      </div>

      <div className="relative mb-6">
        <input
          type="text"
          className="w-full h-12 px-10 rounded-full border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-main"
          placeholder="Search recipes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
          <Search size={20} />
        </div>
        {searchQuery && (
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            onClick={() => setSearchQuery('')}
          >
            &times;
          </button>
        )}
      </div>

      {isLoading ? (
        <AppLoader message="Loading recipes..." />
      ) : filteredRecipes.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {filteredRecipes.map(recipe => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-lg text-gray-600 mb-4">
            {searchQuery
              ? 'No recipes match your search.'
              : 'No recipes available.'}
          </p>
          {searchQuery && (
            <button
              className="text-primary-main font-medium"
              onClick={() => setSearchQuery('')}
            >
              Clear search
            </button>
          )}
        </div>
      )}

      <Link
        to="/camera"
        className="fixed right-6 bottom-20 bg-primary-main text-white p-4 rounded-full shadow-lg hover:bg-primary-dark transition-colors"
      >
        <Camera size={24} />
      </Link>
    </div>
  );
};

export default Home;