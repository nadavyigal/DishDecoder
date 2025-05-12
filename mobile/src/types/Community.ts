import { Timestamp } from 'firebase/firestore';

// Post with user-cooked recipe photo
export interface Post {
  id: string;
  userId: string;
  userName: string;
  userPhotoURL?: string;
  recipeId: string;
  recipeName: string;
  photoURL: string;
  caption: string;
  likes: string[]; // Array of user IDs
  commentCount: number;
  createdAt: Timestamp;
  dietaryTags?: string[];
  difficulty?: 'easy' | 'medium' | 'hard';
  challengeId?: string; // If post is part of a challenge
}

// Comment on a post
export interface Comment {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  userPhotoURL?: string;
  content: string;
  likes: string[]; // Array of user IDs
  createdAt: Timestamp;
}

// Cooking challenge
export interface Challenge {
  id: string;
  title: string;
  description: string;
  coverImageURL: string;
  startDate: Timestamp;
  endDate: Timestamp;
  participants: string[]; // Array of user IDs
  recipeIds: string[]; // Related recipes for the challenge
  rewards?: string;
  status: 'upcoming' | 'active' | 'completed';
  createdBy: string; // Admin or user ID
  featured: boolean;
  postCount: number;
}

// Participant in a challenge
export interface ChallengeParticipant {
  userId: string;
  challengeId: string;
  joinedAt: Timestamp;
  completed: boolean;
  postIds?: string[]; // Posts submitted for this challenge
}

// User notification
export interface Notification {
  id: string;
  userId: string; // Recipient
  type: 'like' | 'comment' | 'follow' | 'challenge' | 'mention';
  sourceUserId?: string; // User who triggered the notification
  sourceUserName?: string;
  sourceUserPhotoURL?: string;
  postId?: string;
  challengeId?: string;
  commentId?: string;
  content: string;
  read: boolean;
  createdAt: Timestamp;
}

// Post like
export interface Like {
  userId: string;
  postId: string;
  createdAt: Timestamp;
}

// User follower relationship
export interface Follower {
  followerId: string; // User who is following
  followingId: string; // User being followed
  createdAt: Timestamp;
}

export default {
  Post,
  Comment,
  Challenge,
  ChallengeParticipant,
  Notification,
  Like,
  Follower
}; 