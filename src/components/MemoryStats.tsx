import React from 'react';
import { useMemoryStore } from '../store/memoryStore';
import { usePointsStore } from '../store/pointsStore';
import { Award, Heart, MessageCircle, Share2 } from 'lucide-react';

function MemoryStats() {
  const memories = useMemoryStore(state => state.memories);
  const { userPoints } = usePointsStore();

  const stats = {
    totalMemories: memories.length,
    totalLikes: memories.reduce((sum, memory) => sum + memory.likes_count, 0),
    totalComments: memories.reduce((sum, memory) => sum + memory.comments_count, 0),
    publicMemories: memories.filter(m => m.is_public).length
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div className="bg-gradient-to-br from-pink-50 to-purple-50 p-4 rounded-xl border border-pink-100">
        <div className="flex items-center space-x-2 mb-2">
          <Award className="h-5 w-5 text-pink-500" />
          <span className="text-sm font-medium text-gray-600">メモリー数</span>
        </div>
        <p className="text-2xl font-bold text-gray-800">{stats.totalMemories}</p>
      </div>
      
      <div className="bg-gradient-to-br from-pink-50 to-purple-50 p-4 rounded-xl border border-pink-100">
        <div className="flex items-center space-x-2 mb-2">
          <Heart className="h-5 w-5 text-pink-500" />
          <span className="text-sm font-medium text-gray-600">いいね数</span>
        </div>
        <p className="text-2xl font-bold text-gray-800">{stats.totalLikes}</p>
      </div>
      
      <div className="bg-gradient-to-br from-pink-50 to-purple-50 p-4 rounded-xl border border-pink-100">
        <div className="flex items-center space-x-2 mb-2">
          <MessageCircle className="h-5 w-5 text-pink-500" />
          <span className="text-sm font-medium text-gray-600">コメント数</span>
        </div>
        <p className="text-2xl font-bold text-gray-800">{stats.totalComments}</p>
      </div>
      
      <div className="bg-gradient-to-br from-pink-50 to-purple-50 p-4 rounded-xl border border-pink-100">
        <div className="flex items-center space-x-2 mb-2">
          <Share2 className="h-5 w-5 text-pink-500" />
          <span className="text-sm font-medium text-gray-600">公開メモリー</span>
        </div>
        <p className="text-2xl font-bold text-gray-800">{stats.publicMemories}</p>
      </div>
    </div>
  );
}

export default MemoryStats;