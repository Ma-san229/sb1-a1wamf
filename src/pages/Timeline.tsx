import React from 'react';
import { useMemoryStore } from '../store/memoryStore';
import MemoryCard from '../components/MemoryCard';

function Timeline() {
  const { memories, loading, toggleLike } = useMemoryStore();
  const publicMemories = memories.filter(memory => memory.is_public);

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">タイムライン</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent"></div>
          </div>
        ) : publicMemories.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500">公開されているメモリーはまだありません</p>
          </div>
        ) : (
          publicMemories.map((memory) => (
            <MemoryCard
              key={memory.id}
              {...memory}
              onDelete={() => useMemoryStore.getState().deleteMemory(memory.id)}
              onUpdate={(updates) => useMemoryStore.getState().updateMemory(memory.id, updates)}
              onLike={() => toggleLike(memory.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default Timeline;