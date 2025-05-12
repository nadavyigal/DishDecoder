import React from 'react';
import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';
import { Recipe } from '../types';

interface RecipeCardProps {
  recipe: Recipe;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  const { id, title, imageUrl, prepTime, cookTime, difficulty } = recipe;
  
  const totalTime = prepTime + cookTime;
  
  const getDifficultyColor = () => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Link to={`/recipe/${id}`} className="block">
      <div className="card h-full transition-shadow hover:shadow-lg">
        <div className="relative pb-[65%] overflow-hidden">
          <img 
            src={imageUrl} 
            alt={title} 
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
        <div className="p-3">
          <h3 className="font-medium text-gray-800 mb-1 line-clamp-1">{title}</h3>
          
          <div className="flex justify-between items-center text-xs text-gray-600">
            <div className="flex items-center">
              <Clock size={14} className="inline mr-1" />
              <span>{totalTime} min</span>
            </div>
            
            <span className={`px-2 py-0.5 rounded-full ${getDifficultyColor()} capitalize`}>
              {difficulty}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RecipeCard; 