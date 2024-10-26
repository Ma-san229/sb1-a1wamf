import React from 'react';
import { Trophy } from 'lucide-react';

interface PointsBadgeProps {
  points: number;
  level: number;
}

function PointsBadge({ points, level }: PointsBadgeProps) {
  return (
    <div className="flex items-center space-x-2">
      <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-3 py-1 rounded-full flex items-center space-x-1">
        <Trophy className="h-4 w-4" />
        <span className="text-sm font-medium">{points} pts</span>
      </div>
      <div className="bg-gradient-to-r from-purple-400 to-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium">
        Lv. {level}
      </div>
    </div>
  );
}

export default PointsBadge;