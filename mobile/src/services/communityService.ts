import {
  db,
  storage,
  Timestamp,
  uploadImage,
  getCurrentUser,
  getUserProfile
} from './firebase';
import { 
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  arrayUnion,
  arrayRemove,
  increment
} from 'firebase/firestore';
import uuid from 'react-native-uuid';
import { 
  Post, 
  Comment, 
  Challenge,
  ChallengeParticipant,
  Notification 
} from '../types/Community';

// Posts Service
export const createPost = async (
  recipeId: string,
  recipeName: string,
  imageUri: string,
  caption: string,
  dietaryTags?: string[],
  difficulty?: 'easy' | 'medium' | 'hard',
  challengeId?: string
): Promise<Post> => {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser) throw new Error('User not authenticated');
    
    const userProfile = await getUserProfile(currentUser.uid);
    if (!userProfile) throw new Error('User profile not found');
    
    // Upload image
    const imagePath = `posts/${currentUser.uid}/${uuid.v4()}`;
    const photoURL = await uploadImage(imageUri, imagePath);
    
    // Create post document
    const postData: Omit<Post, 'id'> = {
      userId: currentUser.uid,
      userName: userProfile.displayName,
      userPhotoURL: userProfile.photoURL,
      recipeId,
      recipeName,
      photoURL,
      caption,
      likes: [],
      commentCount: 0,
      createdAt: Timestamp.now(),
      dietaryTags,
      difficulty,
      challengeId
    };
    
    const postRef = await addDoc(collection(db, 'posts'), postData);
    
    // If part of a challenge, update challenge
    if (challengeId) {
      // Update challenge participant record
      const participantQuery = query(
        collection(db, 'challengeParticipants'),
        where('userId', '==', currentUser.uid),
        where('challengeId', '==', challengeId)
      );
      
      const participantSnapshot = await getDocs(participantQuery);
      
      if (!participantSnapshot.empty) {
        const participantDoc = participantSnapshot.docs[0];
        await updateDoc(participantDoc.ref, {
          postIds: arrayUnion(postRef.id)
        });
      }
      
      // Update challenge post count
      await updateDoc(doc(db, 'challenges', challengeId), {
        postCount: increment(1)
      });
    }
    
    // Update user's recipe count
    await updateDoc(doc(db, 'users', currentUser.uid), {
      recipesCreated: increment(1)
    });
    
    return {
      id: postRef.id,
      ...postData
    };
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};

export const getPosts = async (
  lastVisible?: any, 
  limit = 10,
  filterByFollowing = false
): Promise<{posts: Post[], lastVisible: any}> => {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser && filterByFollowing) throw new Error('User not authenticated');
    
    let postsQuery;
    
    if (filterByFollowing && currentUser) {
      const userProfile = await getUserProfile(currentUser.uid);
      if (!userProfile || !userProfile.following || userProfile.following.length === 0) {
        // If user doesn't follow anyone, return empty array
        return { posts: [], lastVisible: null };
      }
      
      postsQuery = query(
        collection(db, 'posts'),
        where('userId', 'in', userProfile.following),
        orderBy('createdAt', 'desc'),
        limit
      );
    } else {
      postsQuery = query(
        collection(db, 'posts'),
        orderBy('createdAt', 'desc'),
        limit
      );
    }
    
    if (lastVisible) {
      postsQuery = query(
        postsQuery,
        startAfter(lastVisible)
      );
    }
    
    const snapshot = await getDocs(postsQuery);
    const posts = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Post[];
    
    const newLastVisible = snapshot.docs.length > 0 
      ? snapshot.docs[snapshot.docs.length - 1] 
      : null;
      
    return {
      posts,
      lastVisible: newLastVisible
    };
  } catch (error) {
    console.error('Error getting posts:', error);
    throw error;
  }
};

export const getPostById = async (postId: string): Promise<Post | null> => {
  try {
    const postDoc = await getDoc(doc(db, 'posts', postId));
    if (postDoc.exists()) {
      return {
        id: postDoc.id,
        ...postDoc.data()
      } as Post;
    }
    return null;
  } catch (error) {
    console.error('Error getting post:', error);
    throw error;
  }
};

export const getUserPosts = async (
  userId: string,
  lastVisible?: any,
  limit = 10
): Promise<{posts: Post[], lastVisible: any}> => {
  try {
    let postsQuery = query(
      collection(db, 'posts'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit
    );
    
    if (lastVisible) {
      postsQuery = query(
        postsQuery,
        startAfter(lastVisible)
      );
    }
    
    const snapshot = await getDocs(postsQuery);
    const posts = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Post[];
    
    const newLastVisible = snapshot.docs.length > 0 
      ? snapshot.docs[snapshot.docs.length - 1] 
      : null;
      
    return {
      posts,
      lastVisible: newLastVisible
    };
  } catch (error) {
    console.error('Error getting user posts:', error);
    throw error;
  }
};

export const likePost = async (postId: string): Promise<void> => {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser) throw new Error('User not authenticated');
    
    // Update post likes
    await updateDoc(doc(db, 'posts', postId), {
      likes: arrayUnion(currentUser.uid)
    });
    
    // Get post for notification
    const postDoc = await getDoc(doc(db, 'posts', postId));
    if (!postDoc.exists()) throw new Error('Post not found');
    
    const post = postDoc.data() as Post;
    
    // Don't notify if liking own post
    if (post.userId !== currentUser.uid) {
      // Create notification for post owner
      const notificationData: Omit<Notification, 'id'> = {
        userId: post.userId,
        type: 'like',
        sourceUserId: currentUser.uid,
        sourceUserName: currentUser.displayName || '',
        sourceUserPhotoURL: currentUser.photoURL || '',
        postId,
        content: 'liked your post',
        read: false,
        createdAt: Timestamp.now()
      };
      
      await addDoc(collection(db, 'notifications'), notificationData);
    }
  } catch (error) {
    console.error('Error liking post:', error);
    throw error;
  }
};

export const unlikePost = async (postId: string): Promise<void> => {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser) throw new Error('User not authenticated');
    
    await updateDoc(doc(db, 'posts', postId), {
      likes: arrayRemove(currentUser.uid)
    });
  } catch (error) {
    console.error('Error unliking post:', error);
    throw error;
  }
};

export const deletePost = async (postId: string): Promise<void> => {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser) throw new Error('User not authenticated');
    
    const postDoc = await getDoc(doc(db, 'posts', postId));
    if (!postDoc.exists()) throw new Error('Post not found');
    
    const post = postDoc.data() as Post;
    
    // Verify ownership
    if (post.userId !== currentUser.uid) {
      throw new Error('Not authorized to delete this post');
    }
    
    // Delete post document
    await deleteDoc(doc(db, 'posts', postId));
    
    // If part of a challenge, update challenge
    if (post.challengeId) {
      // Update challenge participant record
      const participantQuery = query(
        collection(db, 'challengeParticipants'),
        where('userId', '==', currentUser.uid),
        where('challengeId', '==', post.challengeId)
      );
      
      const participantSnapshot = await getDocs(participantQuery);
      
      if (!participantSnapshot.empty) {
        const participantDoc = participantSnapshot.docs[0];
        await updateDoc(participantDoc.ref, {
          postIds: arrayRemove(postId)
        });
      }
      
      // Update challenge post count
      await updateDoc(doc(db, 'challenges', post.challengeId), {
        postCount: increment(-1)
      });
    }
    
    // Delete associated comments
    const commentsQuery = query(
      collection(db, 'comments'),
      where('postId', '==', postId)
    );
    
    const commentsSnapshot = await getDocs(commentsQuery);
    const batch = commentsSnapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(batch);
    
    // Update user's recipe count
    await updateDoc(doc(db, 'users', currentUser.uid), {
      recipesCreated: increment(-1)
    });
  } catch (error) {
    console.error('Error deleting post:', error);
    throw error;
  }
};

// Comments Service
export const addComment = async (
  postId: string,
  content: string
): Promise<Comment> => {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser) throw new Error('User not authenticated');
    
    // Create comment document
    const commentData: Omit<Comment, 'id'> = {
      postId,
      userId: currentUser.uid,
      userName: currentUser.displayName || '',
      userPhotoURL: currentUser.photoURL || '',
      content,
      likes: [],
      createdAt: Timestamp.now()
    };
    
    const commentRef = await addDoc(collection(db, 'comments'), commentData);
    
    // Update post comment count
    await updateDoc(doc(db, 'posts', postId), {
      commentCount: increment(1)
    });
    
    // Get post for notification
    const postDoc = await getDoc(doc(db, 'posts', postId));
    if (!postDoc.exists()) throw new Error('Post not found');
    
    const post = postDoc.data() as Post;
    
    // Don't notify if commenting on own post
    if (post.userId !== currentUser.uid) {
      // Create notification for post owner
      const notificationData: Omit<Notification, 'id'> = {
        userId: post.userId,
        type: 'comment',
        sourceUserId: currentUser.uid,
        sourceUserName: currentUser.displayName || '',
        sourceUserPhotoURL: currentUser.photoURL || '',
        postId,
        commentId: commentRef.id,
        content: 'commented on your post',
        read: false,
        createdAt: Timestamp.now()
      };
      
      await addDoc(collection(db, 'notifications'), notificationData);
    }
    
    return {
      id: commentRef.id,
      ...commentData
    };
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};

export const getComments = async (
  postId: string,
  lastVisible?: any,
  limit = 20
): Promise<{comments: Comment[], lastVisible: any}> => {
  try {
    let commentsQuery = query(
      collection(db, 'comments'),
      where('postId', '==', postId),
      orderBy('createdAt', 'desc'),
      limit
    );
    
    if (lastVisible) {
      commentsQuery = query(
        commentsQuery,
        startAfter(lastVisible)
      );
    }
    
    const snapshot = await getDocs(commentsQuery);
    const comments = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Comment[];
    
    const newLastVisible = snapshot.docs.length > 0 
      ? snapshot.docs[snapshot.docs.length - 1] 
      : null;
      
    return {
      comments,
      lastVisible: newLastVisible
    };
  } catch (error) {
    console.error('Error getting comments:', error);
    throw error;
  }
};

export const deleteComment = async (commentId: string): Promise<void> => {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser) throw new Error('User not authenticated');
    
    const commentDoc = await getDoc(doc(db, 'comments', commentId));
    if (!commentDoc.exists()) throw new Error('Comment not found');
    
    const comment = commentDoc.data() as Comment;
    
    // Verify ownership
    if (comment.userId !== currentUser.uid) {
      throw new Error('Not authorized to delete this comment');
    }
    
    // Delete comment document
    await deleteDoc(doc(db, 'comments', commentId));
    
    // Update post comment count
    await updateDoc(doc(db, 'posts', comment.postId), {
      commentCount: increment(-1)
    });
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
};

// Challenges Service
export const getChallenges = async (
  status?: 'upcoming' | 'active' | 'completed',
  featured?: boolean,
  lastVisible?: any,
  limit = 10
): Promise<{challenges: Challenge[], lastVisible: any}> => {
  try {
    let challengesQuery: any = collection(db, 'challenges');
    
    // Apply filters
    if (status) {
      challengesQuery = query(
        challengesQuery,
        where('status', '==', status)
      );
    }
    
    if (featured !== undefined) {
      challengesQuery = query(
        challengesQuery,
        where('featured', '==', featured)
      );
    }
    
    // Apply sorting and pagination
    challengesQuery = query(
      challengesQuery,
      orderBy('startDate', 'desc'),
      limit
    );
    
    if (lastVisible) {
      challengesQuery = query(
        challengesQuery,
        startAfter(lastVisible)
      );
    }
    
    const snapshot = await getDocs(challengesQuery);
    const challenges = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Challenge[];
    
    const newLastVisible = snapshot.docs.length > 0 
      ? snapshot.docs[snapshot.docs.length - 1] 
      : null;
      
    return {
      challenges,
      lastVisible: newLastVisible
    };
  } catch (error) {
    console.error('Error getting challenges:', error);
    throw error;
  }
};

export const getChallengeById = async (challengeId: string): Promise<Challenge | null> => {
  try {
    const challengeDoc = await getDoc(doc(db, 'challenges', challengeId));
    if (challengeDoc.exists()) {
      return {
        id: challengeDoc.id,
        ...challengeDoc.data()
      } as Challenge;
    }
    return null;
  } catch (error) {
    console.error('Error getting challenge:', error);
    throw error;
  }
};

export const joinChallenge = async (challengeId: string): Promise<void> => {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser) throw new Error('User not authenticated');
    
    const challengeDoc = await getDoc(doc(db, 'challenges', challengeId));
    if (!challengeDoc.exists()) throw new Error('Challenge not found');
    
    // Add user to challenge participants
    await updateDoc(doc(db, 'challenges', challengeId), {
      participants: arrayUnion(currentUser.uid)
    });
    
    // Create participant record
    const participantData: ChallengeParticipant = {
      userId: currentUser.uid,
      challengeId,
      joinedAt: Timestamp.now(),
      completed: false,
      postIds: []
    };
    
    await addDoc(collection(db, 'challengeParticipants'), participantData);
    
    // Create notification
    const challenge = challengeDoc.data() as Challenge;
    
    const notificationData: Omit<Notification, 'id'> = {
      userId: currentUser.uid,
      type: 'challenge',
      challengeId,
      content: `You've joined the "${challenge.title}" challenge`,
      read: false,
      createdAt: Timestamp.now()
    };
    
    await addDoc(collection(db, 'notifications'), notificationData);
  } catch (error) {
    console.error('Error joining challenge:', error);
    throw error;
  }
};

export const leaveChallenge = async (challengeId: string): Promise<void> => {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser) throw new Error('User not authenticated');
    
    // Remove user from challenge participants
    await updateDoc(doc(db, 'challenges', challengeId), {
      participants: arrayRemove(currentUser.uid)
    });
    
    // Delete participant record
    const participantQuery = query(
      collection(db, 'challengeParticipants'),
      where('userId', '==', currentUser.uid),
      where('challengeId', '==', challengeId)
    );
    
    const participantSnapshot = await getDocs(participantQuery);
    
    if (!participantSnapshot.empty) {
      const participantDoc = participantSnapshot.docs[0];
      await deleteDoc(participantDoc.ref);
    }
  } catch (error) {
    console.error('Error leaving challenge:', error);
    throw error;
  }
};

export const getUserChallenges = async (
  userId?: string,
  status?: 'upcoming' | 'active' | 'completed',
  lastVisible?: any,
  limit = 10
): Promise<{challenges: Challenge[], lastVisible: any}> => {
  try {
    const uid = userId || (getCurrentUser()?.uid);
    if (!uid) throw new Error('User not provided or not authenticated');
    
    // Get challenges the user is participating in
    const participantQuery = query(
      collection(db, 'challengeParticipants'),
      where('userId', '==', uid)
    );
    
    const participantSnapshot = await getDocs(participantQuery);
    const challengeIds = participantSnapshot.docs.map(doc => doc.data().challengeId);
    
    if (challengeIds.length === 0) {
      return {
        challenges: [],
        lastVisible: null
      };
    }
    
    // Get challenge documents
    let challengesQuery: any = query(
      collection(db, 'challenges'),
      where('__name__', 'in', challengeIds)
    );
    
    // Apply status filter if provided
    if (status) {
      challengesQuery = query(
        challengesQuery,
        where('status', '==', status)
      );
    }
    
    // Apply sorting and pagination
    challengesQuery = query(
      challengesQuery,
      orderBy('startDate', 'desc'),
      limit
    );
    
    if (lastVisible) {
      challengesQuery = query(
        challengesQuery,
        startAfter(lastVisible)
      );
    }
    
    const snapshot = await getDocs(challengesQuery);
    const challenges = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Challenge[];
    
    const newLastVisible = snapshot.docs.length > 0 
      ? snapshot.docs[snapshot.docs.length - 1] 
      : null;
      
    return {
      challenges,
      lastVisible: newLastVisible
    };
  } catch (error) {
    console.error('Error getting user challenges:', error);
    throw error;
  }
};

// Notifications Service
export const getNotifications = async (
  lastVisible?: any,
  limit = 20
): Promise<{notifications: Notification[], lastVisible: any}> => {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser) throw new Error('User not authenticated');
    
    let notificationsQuery = query(
      collection(db, 'notifications'),
      where('userId', '==', currentUser.uid),
      orderBy('createdAt', 'desc'),
      limit
    );
    
    if (lastVisible) {
      notificationsQuery = query(
        notificationsQuery,
        startAfter(lastVisible)
      );
    }
    
    const snapshot = await getDocs(notificationsQuery);
    const notifications = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Notification[];
    
    const newLastVisible = snapshot.docs.length > 0 
      ? snapshot.docs[snapshot.docs.length - 1] 
      : null;
      
    return {
      notifications,
      lastVisible: newLastVisible
    };
  } catch (error) {
    console.error('Error getting notifications:', error);
    throw error;
  }
};

export const markNotificationAsRead = async (notificationId: string): Promise<void> => {
  try {
    await updateDoc(doc(db, 'notifications', notificationId), {
      read: true
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

export const markAllNotificationsAsRead = async (): Promise<void> => {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser) throw new Error('User not authenticated');
    
    const notificationsQuery = query(
      collection(db, 'notifications'),
      where('userId', '==', currentUser.uid),
      where('read', '==', false)
    );
    
    const snapshot = await getDocs(notificationsQuery);
    
    const updates = snapshot.docs.map(doc => 
      updateDoc(doc.ref, { read: true })
    );
    
    await Promise.all(updates);
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    throw error;
  }
};

// User Follow Service
export const followUser = async (userId: string): Promise<void> => {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser) throw new Error('User not authenticated');
    
    if (currentUser.uid === userId) {
      throw new Error('Cannot follow yourself');
    }
    
    // Update current user's following list
    await updateDoc(doc(db, 'users', currentUser.uid), {
      following: arrayUnion(userId)
    });
    
    // Update target user's followers list
    await updateDoc(doc(db, 'users', userId), {
      followers: arrayUnion(currentUser.uid)
    });
    
    // Create notification for target user
    const notificationData: Omit<Notification, 'id'> = {
      userId,
      type: 'follow',
      sourceUserId: currentUser.uid,
      sourceUserName: currentUser.displayName || '',
      sourceUserPhotoURL: currentUser.photoURL || '',
      content: 'started following you',
      read: false,
      createdAt: Timestamp.now()
    };
    
    await addDoc(collection(db, 'notifications'), notificationData);
  } catch (error) {
    console.error('Error following user:', error);
    throw error;
  }
};

export const unfollowUser = async (userId: string): Promise<void> => {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser) throw new Error('User not authenticated');
    
    // Update current user's following list
    await updateDoc(doc(db, 'users', currentUser.uid), {
      following: arrayRemove(userId)
    });
    
    // Update target user's followers list
    await updateDoc(doc(db, 'users', userId), {
      followers: arrayRemove(currentUser.uid)
    });
  } catch (error) {
    console.error('Error unfollowing user:', error);
    throw error;
  }
};

export default {
  // Posts
  createPost,
  getPosts,
  getPostById,
  getUserPosts,
  likePost,
  unlikePost,
  deletePost,
  
  // Comments
  addComment,
  getComments,
  deleteComment,
  
  // Challenges
  getChallenges,
  getChallengeById,
  joinChallenge,
  leaveChallenge,
  getUserChallenges,
  
  // Notifications
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  
  // Follow
  followUser,
  unfollowUser
}; 