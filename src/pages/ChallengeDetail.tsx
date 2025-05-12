import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy, Users, Clock, Camera } from 'lucide-react';

interface Submission {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  image: string;
  description: string;
  likes: number;
  timestamp: string;
}

const mockSubmissions: Submission[] = [
  {
    id: '1',
    userId: '1',
    userName: 'Sarah Chen',
    userAvatar: 'https://source.unsplash.com/random/100x100/?portrait=1',
    image: 'https://source.unsplash.com/random/600x400/?pizza-1',
    description: 'My take on a classic Margherita with homemade basil pesto!',
    likes: 24,
    timestamp: '2 hours ago'
  },
  {
    id: '2',
    userId: '2',
    userName: 'Mike Johnson',
    userAvatar: 'https://source.unsplash.com/random/100x100/?portrait=2',
    image: 'https://source.unsplash.com/random/600x400/?pizza-2',
    description: 'BBQ chicken pizza with red onions and cilantro 🍕',
    likes: 18,
    timestamp: '4 hours ago'
  }
];

const ChallengeDetail: React.FC = () => {
  const { challengeId } = useParams<{ challengeId: string }>();
  const navigate = useNavigate();

  // Mock challenge data (to be replaced with API call)
  const challenge = {
    id: challengeId,
    title: 'Perfect Pizza Challenge',
    description: 'Create your best homemade pizza from scratch and share your unique toppings combination! Show us your creativity and pizza-making skills.',
    image: 'https://source.unsplash.com/random/800x400/?pizza',
    participants: 128,
    daysLeft: 5,
    difficulty: 'medium',
    prize: '$50 Gift Card',
    rules: [
      'Pizza must be made from scratch, including the dough',
      'Include at least 3 toppings',
      'Take a clear photo of your creation',
      'Share your recipe in the description'
    ]
  };

  return (
    <div className="pb-16">
      <div className="sticky top-0 bg-white z-10 border-b border-gray-200">
        <div className="flex items-center h-14 px-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="ml-2 font-semibold">Challenge Details</h1>
        </div>
      </div>

      <div className="relative">
        <img
          src={challenge.image}
          alt={challenge.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
          <div className="absolute bottom-4 left-4 text-white">
            <h1 className="text-2xl font-bold">{challenge.title}</h1>
            <div className="flex items-center gap-4 mt-2 text-sm">
              <div className="flex items-center">
                <Users size={16} className="mr-1" />
                <span>{challenge.participants} joined</span>
              </div>
              <div className="flex items-center">
                <Clock size={16} className="mr-1" />
                <span>{challenge.daysLeft} days left</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Prize</h2>
          <div className="flex items-center text-primary-main">
            <Trophy size={20} className="mr-2" />
            <span className="text-lg">{challenge.prize}</span>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Description</h2>
          <p className="text-gray-700">{challenge.description}</p>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Rules</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            {challenge.rules.map((rule, index) => (
              <li key={index}>{rule}</li>
            ))}
          </ul>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Recent Submissions</h2>
          <div className="space-y-4">
            {mockSubmissions.map((submission) => (
              <div key={submission.id} className="card overflow-hidden">
                <div className="p-3 flex items-center gap-3">
                  <img
                    src={submission.userAvatar}
                    alt={submission.userName}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium">{submission.userName}</p>
                    <p className="text-sm text-gray-500">{submission.timestamp}</p>
                  </div>
                </div>
                <img
                  src={submission.image}
                  alt="Submission"
                  className="w-full aspect-video object-cover"
                />
                <div className="p-3">
                  <p className="text-gray-700">{submission.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="fixed bottom-20 right-4">
        <button className="bg-primary-main text-white p-4 rounded-full shadow-lg hover:bg-primary-dark transition-colors">
          <Camera size={24} />
        </button>
      </div>
    </div>
  );
};

export default ChallengeDetail; 