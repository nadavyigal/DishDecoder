import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Share2 } from 'lucide-react';

interface Post {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  image: string;
  likes: number;
  comments: number;
  timestamp: string;
}

const mockPosts: Post[] = [
  {
    id: '1',
    userId: '1',
    userName: 'Sarah Chen',
    userAvatar: 'https://source.unsplash.com/random/100x100/?portrait=1',
    content: 'Just made this amazing pasta dish! 🍝 The secret is in the fresh herbs.',
    image: 'https://source.unsplash.com/random/600x400/?pasta',
    likes: 42,
    comments: 8,
    timestamp: '2 hours ago'
  },
  {
    id: '2',
    userId: '2',
    userName: 'Mike Johnson',
    userAvatar: 'https://source.unsplash.com/random/100x100/?portrait=2',
    content: 'My first attempt at making sushi rolls! What do you think? 🍣',
    image: 'https://source.unsplash.com/random/600x400/?sushi',
    likes: 89,
    comments: 15,
    timestamp: '4 hours ago'
  }
];

const CommunityFeed: React.FC = () => {
  return (
    <div className="page-container">
      <div className="mb-6">
        <h1 className="page-title">Community</h1>
        <p className="page-subtitle">See what others are cooking</p>
      </div>

      <div className="space-y-6">
        {mockPosts.map((post) => (
          <div key={post.id} className="card overflow-hidden">
            <div className="p-4 flex items-center gap-3">
              <img
                src={post.userAvatar}
                alt={post.userName}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <Link to={`/profile/${post.userId}`} className="font-medium text-gray-900 hover:text-primary-main">
                  {post.userName}
                </Link>
                <p className="text-sm text-gray-500">{post.timestamp}</p>
              </div>
            </div>

            <img
              src={post.image}
              alt="Post"
              className="w-full aspect-video object-cover"
            />

            <div className="p-4">
              <p className="text-gray-800 mb-4">{post.content}</p>

              <div className="flex items-center gap-6">
                <button className="flex items-center gap-2 text-gray-600 hover:text-primary-main">
                  <Heart size={20} />
                  <span>{post.likes}</span>
                </button>
                <button className="flex items-center gap-2 text-gray-600 hover:text-primary-main">
                  <MessageCircle size={20} />
                  <span>{post.comments}</span>
                </button>
                <button className="flex items-center gap-2 text-gray-600 hover:text-primary-main ml-auto">
                  <Share2 size={20} />
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunityFeed; 