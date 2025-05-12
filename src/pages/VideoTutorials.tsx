import React, { useState } from 'react';
import { Play, Clock } from 'lucide-react';

interface VideoTutorial {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  duration: number;
  views: number;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

const mockCategories = [
  'All',
  'Basics',
  'Baking',
  'Main Dishes',
  'Desserts',
  'Vegetarian',
  'Quick & Easy'
];

const mockTutorials: VideoTutorial[] = [
  {
    id: '1',
    title: 'Basic Knife Skills',
    description: 'Learn essential knife techniques for faster and safer cooking',
    thumbnailUrl: 'https://source.unsplash.com/random/600x400/?knife-skills',
    duration: 720, // 12 minutes
    views: 1200,
    category: 'Basics',
    difficulty: 'easy'
  },
  {
    id: '2',
    title: 'Perfect Pizza Dough',
    description: 'Master the art of making authentic Italian pizza dough',
    thumbnailUrl: 'https://source.unsplash.com/random/600x400/?pizza-dough',
    duration: 900, // 15 minutes
    views: 850,
    category: 'Baking',
    difficulty: 'medium'
  },
  {
    id: '3',
    title: 'Homemade Pasta',
    description: 'Create fresh pasta from scratch with simple ingredients',
    thumbnailUrl: 'https://source.unsplash.com/random/600x400/?pasta-making',
    duration: 1200, // 20 minutes
    views: 650,
    category: 'Main Dishes',
    difficulty: 'medium'
  }
];

const VideoTutorials: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} min`;
  };

  const formatViews = (views: number): string => {
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}k views`;
    }
    return `${views} views`;
  };

  const filteredTutorials = selectedCategory === 'All'
    ? mockTutorials
    : mockTutorials.filter(tutorial => tutorial.category === selectedCategory);

  return (
    <div className="page-container">
      <div className="mb-6">
        <h1 className="page-title">Video Tutorials</h1>
        <p className="page-subtitle">Learn new cooking techniques</p>
      </div>

      {/* Categories */}
      <div className="mb-6 overflow-x-auto">
        <div className="flex gap-2 pb-2">
          {mockCategories.map((category) => (
            <button
              key={category}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
                selectedCategory === category
                  ? 'bg-primary-main text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Video Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {filteredTutorials.map((tutorial) => (
          <div key={tutorial.id} className="card overflow-hidden">
            <div className="relative">
              <img
                src={tutorial.thumbnailUrl}
                alt={tutorial.title}
                className="w-full aspect-video object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <button className="bg-white/90 p-4 rounded-full">
                  <Play className="w-6 h-6 text-primary-main" />
                </button>
              </div>
              <div className="absolute bottom-2 right-2 bg-black/70 text-white text-sm px-2 py-1 rounded">
                {formatDuration(tutorial.duration)}
              </div>
            </div>

            <div className="p-4">
              <h3 className="font-semibold mb-1">{tutorial.title}</h3>
              <p className="text-sm text-gray-600 mb-2">{tutorial.description}</p>

              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    tutorial.difficulty === 'easy'
                      ? 'bg-green-100 text-green-800'
                      : tutorial.difficulty === 'medium'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {tutorial.difficulty}
                  </span>
                  <span>{tutorial.category}</span>
                </div>
                <div className="flex items-center">
                  <Clock size={14} className="mr-1" />
                  <span>{formatViews(tutorial.views)}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoTutorials; 