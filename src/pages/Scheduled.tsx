import React, { useState } from 'react';
import { useMemoryStore } from '../store/memoryStore';
import MemoryCard from '../components/MemoryCard';
import { Calendar } from 'lucide-react';

function Scheduled() {
  const { memories, loading, toggleLike } = useMemoryStore();
  const scheduledMemories = memories.filter(memory => memory.status === 'scheduled');
  const [selectedDate, setSelectedDate] = useState<string>('');

  const filteredMemories = selectedDate
    ? scheduledMemories.filter(memory => memory.scheduled_date?.startsWith(selectedDate))
    : scheduledMemories;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">予約済みメモリー</h2>
        <div className="flex items-center space-x-2">
          <Calendar className="h-5 w-5 text-gray-500" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent"></div>
          </div>
        ) : filteredMemories.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500">予約済みのメモリーはありません</p>
          </div>
        ) : (
          filteredMemories.map((memory) => (
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

export default Scheduled;