import React, { useState } from 'react';
import { PenLine } from 'lucide-react';
import MemoryStats from '../components/MemoryStats';
import MemoryCard from '../components/MemoryCard';
import NewMemoryForm from '../components/NewMemoryForm';
import MemoryForm from '../components/MemoryForm';
import { useMemoryStore } from '../store/memoryStore';

function Home() {
  const [showMemoryForm, setShowMemoryForm] = useState(false);
  const { memories, loading: memoriesLoading, toggleLike } = useMemoryStore();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">マイメモリー</h2>
        <button
          onClick={() => setShowMemoryForm(true)}
          className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-full flex items-center space-x-2 hover:opacity-90 transition-opacity"
        >
          <PenLine className="h-4 w-4" />
          <span>新しいメモリー</span>
        </button>
      </div>

      <MemoryStats />

      {showMemoryForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">新しいメモリーを作成</h2>
            <MemoryForm onClose={() => setShowMemoryForm(false)} />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <NewMemoryForm onClick={() => setShowMemoryForm(true)} />
        {memoriesLoading ? (
          <div className="col-span-full flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent"></div>
          </div>
        ) : (
          memories.map((memory) => (
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

export default Home;