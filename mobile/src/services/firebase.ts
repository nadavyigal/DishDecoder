import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  updateProfile,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
  UserCredential
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  Timestamp,
  addDoc,
  arrayUnion,
  increment
} from 'firebase/firestore';
import { 
  getStorage, 
  ref, 
  uploadBytesResumable, 
  getDownloadURL
} from 'firebase/storage';

// Firebase configuration - In a real app, these would be in .env files
const firebaseConfig = {
  apiKey: "REPLACE_WITH_YOUR_API_KEY", // For demo purposes - use env variables in real app
  authDomain: "dish-decoder-app.firebaseapp.com",
  projectId: "dish-decoder-app",
  storageBucket: "dish-decoder-app.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890abcdef"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// User types
export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  bio?: string;
  following?: string[];
  followers?: string[];
  dietaryPreferences?: string[];
  createdAt: Timestamp;
  completedChallenges?: number;
  recipesCreated?: number;
  favorites?: string[];
}

// Auth services
export const registerUser = async (
  email: string, 
  password: string, 
  displayName: string
): Promise<UserProfile> => {
  try {
    // Create user authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update profile with display name
    await updateProfile(user, { displayName });
    
    // Create user profile in Firestore
    const userProfile: UserProfile = {
      uid: user.uid,
      displayName,
      email,
      photoURL: user.photoURL || '',
      bio: '',
      following: [],
      followers: [],
      dietaryPreferences: [],
      createdAt: Timestamp.now(),
      completedChallenges: 0,
      recipesCreated: 0,
      favorites: []
    };
    
    await setDoc(doc(db, 'users', user.uid), userProfile);
    
    return userProfile;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

export const signIn = async (
  email: string, 
  password: string
): Promise<UserCredential> => {
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
};

export const signOut = async (): Promise<void> => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return userDoc.data() as UserProfile;
    }
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};

export const updateUserProfile = async (
  uid: string, 
  data: Partial<UserProfile>
): Promise<void> => {
  try {
    await updateDoc(doc(db, 'users', uid), data);
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// Image upload service
export const uploadImage = async (
  uri: string, 
  path: string, 
  onProgress?: (progress: number) => void
): Promise<string> => {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();
    
    const storageRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(storageRef, blob);
    
    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (onProgress) onProgress(progress);
        },
        (error) => {
          console.error('Error uploading image:', error);
          reject(error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        }
      );
    });
  } catch (error) {
    console.error('Error in upload process:', error);
    throw error;
  }
};

// Export Firebase instances
export { app, auth, db, storage, Timestamp };

// Auth state observer
export const onAuthStateChange = (callback: (user: User | null) => void): (() => void) => {
  return onAuthStateChanged(auth, callback);
};

export default {
  registerUser,
  signIn,
  signOut,
  getCurrentUser,
  getUserProfile,
  updateUserProfile,
  uploadImage,
  auth,
  db,
  storage,
  onAuthStateChange
}; 