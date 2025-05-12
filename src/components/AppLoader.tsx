import React from 'react';
import { ChefHat } from 'lucide-react';

interface AppLoaderProps {
  message?: string;
}

const AppLoader: React.FC<AppLoaderProps> = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <div className="relative">
        <ChefHat className="h-12 w-12 text-[#FF6B35] animate-bounce" />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#8AC926] rounded-full animate-pulse"></span>
      </div>
      <p className="mt-4 text-slate-600 animate-pulse">{message}</p>
    </div>
  );
};

export default AppLoader;