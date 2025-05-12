// Test setup for React Native

// Mock the Firebase modules
jest.mock('@react-native-firebase/app', () => {
  return () => ({
    app: jest.fn(),
  });
});

jest.mock('@react-native-firebase/auth', () => {
  return () => ({
    currentUser: null,
    signInWithEmailAndPassword: jest.fn(() => Promise.resolve()),
    createUserWithEmailAndPassword: jest.fn(() => Promise.resolve()),
    signOut: jest.fn(() => Promise.resolve()),
    onAuthStateChanged: jest.fn(),
  });
});

jest.mock('@react-native-firebase/firestore', () => {
  return () => ({
    collection: jest.fn(() => ({
      doc: jest.fn(() => ({
        get: jest.fn(() => Promise.resolve({ exists: false, data: () => ({}) })),
        set: jest.fn(() => Promise.resolve()),
        update: jest.fn(() => Promise.resolve()),
      })),
      add: jest.fn(() => Promise.resolve()),
      where: jest.fn(() => ({
        get: jest.fn(() => Promise.resolve({ docs: [] })),
      })),
    })),
  });
});

jest.mock('@react-native-firebase/storage', () => {
  return () => ({
    ref: jest.fn(() => ({
      putFile: jest.fn(() => ({
        on: jest.fn((event, onProgress, onError, onComplete) => {
          onComplete();
          return { task: { snapshot: { ref: { getDownloadURL: jest.fn(() => Promise.resolve('https://example.com/image.jpg')) } } } };
        }),
      })),
    })),
  });
});

// Mock the navigation
jest.mock('@react-navigation/native', () => {
  return {
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
      setOptions: jest.fn(),
    }),
    useRoute: () => ({
      params: {},
    }),
  };
});

// Mock the expo modules
jest.mock('expo-image-picker', () => ({
  launchImageLibraryAsync: jest.fn(() => Promise.resolve({ cancelled: false, uri: 'file://test.jpg' })),
  launchCameraAsync: jest.fn(() => Promise.resolve({ cancelled: false, uri: 'file://test.jpg' })),
  requestMediaLibraryPermissionsAsync: jest.fn(() => Promise.resolve({ granted: true })),
  requestCameraPermissionsAsync: jest.fn(() => Promise.resolve({ granted: true })),
}));

// Mock react-native-uuid
jest.mock('react-native-uuid', () => ({
  v4: jest.fn(() => 'test-uuid'),
}));

// Mock the Dimensions API
jest.mock('react-native/Libraries/Utilities/Dimensions', () => ({
  get: jest.fn(() => ({ width: 375, height: 812 })),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
}));

// Silence the warning: Animated: `useNativeDriver` is not supported
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

// Setup global timers
jest.useFakeTimers(); 