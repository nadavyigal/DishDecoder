import React from 'react';
import { User } from '../types';

const Profile: React.FC = () => {
  // Mock user data (to be replaced with actual auth state)
  const mockUser: User = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    photoURL: 'https://source.unsplash.com/random/100x100/?portrait',
    bio: 'Food enthusiast and amateur chef',
    dietaryPreferences: ['vegetarian'],
    favorites: [],
    followers: 42
  };

  return (
    <div className="page-container">
      <div className="mb-6">
        <h1 className="page-title">Profile</h1>
        <p className="page-subtitle">Manage your account and preferences</p>
      </div>

      <div className="card p-6">
        <div className="flex items-center gap-4 mb-6">
          <img
            src={mockUser.photoURL}
            alt={mockUser.name}
            className="w-20 h-20 rounded-full object-cover"
          />
          <div>
            <h2 className="text-xl font-semibold">{mockUser.name}</h2>
            <p className="text-gray-600">{mockUser.email}</p>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium mb-4">About</h3>
          <p className="text-gray-700">{mockUser.bio}</p>
        </div>

        <div className="border-t border-gray-200 mt-6 pt-6">
          <h3 className="text-lg font-medium mb-4">Stats</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-primary-main">{mockUser.favorites?.length || 0}</p>
              <p className="text-sm text-gray-600">Favorites</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary-main">{mockUser.followers}</p>
              <p className="text-sm text-gray-600">Followers</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary-main">0</p>
              <p className="text-sm text-gray-600">Recipes</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-6 pt-6">
          <h3 className="text-lg font-medium mb-4">Dietary Preferences</h3>
          <div className="flex flex-wrap gap-2">
            {mockUser.dietaryPreferences?.map((pref) => (
              <span
                key={pref}
                className="px-3 py-1 bg-primary-light/20 text-primary-dark rounded-full text-sm"
              >
                {pref}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 