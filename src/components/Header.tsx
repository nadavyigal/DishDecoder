import React from 'react';
import { ChefHat } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-10 backdrop-blur-md bg-white/70 border-b border-slate-200">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <ChefHat className="h-8 w-8 text-[#FF6B35]" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-[#FF6B35] to-[#8AC926] bg-clip-text text-transparent">
            DishDecoder
          </h1>
        </div>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <a 
                href="#" 
                className="text-slate-600 hover:text-[#FF6B35] transition-colors"
              >
                Home
              </a>
            </li>
            <li>
              <a 
                href="#" 
                className="text-slate-600 hover:text-[#FF6B35] transition-colors"
              >
                Recipes
              </a>
            </li>
            <li>
              <a 
                href="#" 
                className="text-slate-600 hover:text-[#FF6B35] transition-colors"
              >
                About
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;