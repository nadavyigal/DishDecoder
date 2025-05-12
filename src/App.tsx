import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import pages
import Home from './pages/Home';
import Camera from './pages/Camera';
import Recipe from './pages/Recipe';
import Favorites from './pages/Favorites';
import Profile from './pages/Profile';
import CommunityFeed from './pages/CommunityFeed';
import PostDetail from './pages/PostDetail';
import Challenges from './pages/Challenges';
import ChallengeDetail from './pages/ChallengeDetail';
import VideoTutorials from './pages/VideoTutorials';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';

// Import components
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Import contexts
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Auth routes (public) */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
          {/* Protected routes (require authentication) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="camera" element={<Camera />} />
              <Route path="recipe/:recipeId" element={<Recipe />} />
              <Route path="favorites" element={<Favorites />} />
              <Route path="profile" element={<Profile />} />
              <Route path="community" element={<CommunityFeed />} />
              <Route path="post/:postId" element={<PostDetail />} />
              <Route path="challenges" element={<Challenges />} />
              <Route path="challenge/:challengeId" element={<ChallengeDetail />} />
              <Route path="tutorials" element={<VideoTutorials />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;