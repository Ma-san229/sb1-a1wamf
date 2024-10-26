import React from 'react';
import { Heart, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { usePointsStore } from '../store/pointsStore';
import PointsBadge from './PointsBadge';

function Header() {
  const { signOut } = useAuthStore();
  const { userPoints } = usePointsStore();

  return (
    <header className="bg-white/70 backdrop-blur-sm border-b border-pink-100 fixed w-full z-10">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Heart className="h-6 w-6 text-pink-500" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            メモリーリレー
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          {userPoints && (
            <PointsBadge points={userPoints.points} level={userPoints.level} />
          )}
          <button
            onClick={() => signOut()}
            className="text-gray-600 hover:text-gray-800 transition-colors"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;