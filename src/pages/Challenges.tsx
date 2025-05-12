import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Users, Clock } from 'lucide-react';

interface Challenge {
  id: string;
  title: string;
  description: string;
  image: string;
  participants: number;
  daysLeft: number;
  difficulty: 'easy' | 'medium' | 'hard';
  prize: string;
}

const mockChallenges: Challenge[] = [
  {
    id: '1',
    title: 'Perfect Pizza Challenge',
    description: 'Create your best homemade pizza from scratch and share your unique toppings combination!',
    image: 'https://source.unsplash.com/random/600x400/?pizza',
    participants: 128,
    daysLeft: 5,
    difficulty: 'medium',
    prize: '$50 Gift Card'
  },
  {
    id: '2',
    title: 'Vegan Desserts',
    description: 'Show us your most creative vegan dessert recipes. Bonus points for using seasonal ingredients!',
    image: 'https://source.unsplash.com/random/600x400/?vegan-dessert',
    participants: 85,
    daysLeft: 7,
    difficulty: 'hard',
    prize: 'Premium Baking Set'
  }
];

const Challenges: React.FC = () => {
  const getDifficultyColor = (difficulty: Challenge['difficulty']) => {
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
    <div className="page-container">
      <div className="mb-6">
        <h1 className="page-title">Cooking Challenges</h1>
        <p className="page-subtitle">Compete with other chefs and win prizes</p>
      </div>

      <div className="space-y-6">
        {mockChallenges.map((challenge) => (
          <Link
            key={challenge.id}
            to={`/challenge/${challenge.id}`}
            className="block"
          >
            <div className="card overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img
                  src={challenge.image}
                  alt={challenge.title}
                  className="w-full aspect-video object-cover"
                />
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(challenge.difficulty)}`}>
                    {challenge.difficulty}
                  </span>
                </div>
              </div>

              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{challenge.title}</h2>
                <p className="text-gray-600 mb-4">{challenge.description}</p>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center">
                      <Users size={16} className="mr-1" />
                      <span>{challenge.participants} joined</span>
                    </div>
                    <div className="flex items-center">
                      <Clock size={16} className="mr-1" />
                      <span>{challenge.daysLeft} days left</span>
                    </div>
                  </div>
                  <div className="flex items-center text-primary-main">
                    <Trophy size={16} className="mr-1" />
                    <span>{challenge.prize}</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Challenges; 