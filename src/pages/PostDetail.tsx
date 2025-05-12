import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, MessageCircle, Share2 } from 'lucide-react';

interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  timestamp: string;
}

const mockComments: Comment[] = [
  {
    id: '1',
    userId: '3',
    userName: 'Emily White',
    userAvatar: 'https://source.unsplash.com/random/100x100/?portrait=3',
    content: 'This looks amazing! Would love to try making it.',
    timestamp: '1 hour ago'
  },
  {
    id: '2',
    userId: '4',
    userName: 'David Lee',
    userAvatar: 'https://source.unsplash.com/random/100x100/?portrait=4',
    content: 'Could you share the recipe? 😊',
    timestamp: '30 minutes ago'
  }
];

const PostDetail: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();

  // Mock post data (to be replaced with API call)
  const post = {
    id: postId,
    userId: '1',
    userName: 'Sarah Chen',
    userAvatar: 'https://source.unsplash.com/random/100x100/?portrait=1',
    content: 'Just made this amazing pasta dish! 🍝 The secret is in the fresh herbs. Here\'s my step-by-step process and some tips for getting it perfect every time.',
    image: 'https://source.unsplash.com/random/600x400/?pasta',
    likes: 42,
    comments: mockComments.length,
    timestamp: '2 hours ago'
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
          <h1 className="ml-2 font-semibold">Post</h1>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center gap-3 mb-4">
          <img
            src={post.userAvatar}
            alt={post.userName}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <p className="font-medium text-gray-900">{post.userName}</p>
            <p className="text-sm text-gray-500">{post.timestamp}</p>
          </div>
        </div>

        <img
          src={post.image}
          alt="Post"
          className="w-full aspect-video object-cover rounded-lg mb-4"
        />

        <p className="text-gray-800 mb-6 whitespace-pre-line">{post.content}</p>

        <div className="flex items-center gap-6 py-4 border-y border-gray-200">
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

        <div className="mt-6">
          <h2 className="font-semibold mb-4">Comments</h2>
          <div className="space-y-4">
            {mockComments.map((comment) => (
              <div key={comment.id} className="flex gap-3">
                <img
                  src={comment.userAvatar}
                  alt={comment.userName}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="bg-gray-100 rounded-2xl p-3">
                    <p className="font-medium text-gray-900">{comment.userName}</p>
                    <p className="text-gray-800">{comment.content}</p>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{comment.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail; 