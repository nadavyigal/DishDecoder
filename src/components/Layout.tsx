import React from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { Home, Camera, Users, Heart, User, Video, Trophy } from 'lucide-react';

interface NavLinkProps {
  isActive: boolean;
}

const Layout: React.FC = () => {
  const location = useLocation();
  
  const getTabClass = (isActive: boolean) => {
    return `flex flex-col items-center justify-center py-2 px-4 text-xs ${
      isActive 
        ? 'text-[#E9A646] font-medium' 
        : 'text-gray-600'
    }`;
  };

  const getIconClass = (isActive: boolean) => {
    return isActive 
      ? 'text-[#E9A646]' 
      : 'text-gray-500';
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FFFBF1]">
      <main className="flex-1 pb-16">
        <Outlet />
      </main>
      
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="grid grid-cols-5 max-w-lg mx-auto">
          <NavLink
            to="/"
            className={({ isActive }) => getTabClass(isActive)}
            end
          >
            <Home className={getIconClass(location.pathname === '/')} size={20} />
            <span>Home</span>
          </NavLink>

          <NavLink
            to="/camera"
            className={({ isActive }) => getTabClass(isActive)}
          >
            <Camera className={getIconClass(location.pathname === '/camera')} size={20} />
            <span>Camera</span>
          </NavLink>

          <NavLink
            to="/community"
            className={({ isActive }) => getTabClass(isActive)}
          >
            <Users className={getIconClass(location.pathname === '/community')} size={20} />
            <span>Community</span>
          </NavLink>

          <NavLink
            to="/favorites"
            className={({ isActive }) => getTabClass(isActive)}
          >
            <Heart className={getIconClass(location.pathname === '/favorites')} size={20} />
            <span>Favorites</span>
          </NavLink>

          <NavLink
            to="/profile"
            className={({ isActive }) => getTabClass(isActive)}
          >
            <User className={getIconClass(location.pathname === '/profile')} size={20} />
            <span>Profile</span>
          </NavLink>
        </div>
      </nav>

      {/* Secondary Navigation */}
      <nav className="fixed bottom-16 left-0 right-0 bg-white border-t border-gray-200">
        <div className="grid grid-cols-2 max-w-lg mx-auto">
          <NavLink
            to="/challenges"
            className={({ isActive }) => getTabClass(isActive)}
          >
            <Trophy className={getIconClass(location.pathname === '/challenges')} size={20} />
            <span>Challenges</span>
          </NavLink>

          <NavLink
            to="/tutorials"
            className={({ isActive }) => getTabClass(isActive)}
          >
            <Video className={getIconClass(location.pathname === '/tutorials')} size={20} />
            <span>Tutorials</span>
          </NavLink>
        </div>
      </nav>
    </div>
  );
};

export default Layout; 