import React from 'react';
import { Smile } from 'lucide-react';

const stamps = [
  { id: '1', emoji: '👍', name: 'いいね' },
  { id: '2', emoji: '❤️', name: 'ハート' },
  { id: '3', emoji: '👏', name: '拍手' },
  { id: '4', emoji: '🎉', name: 'お祝い' },
  { id: '5', emoji: '✨', name: 'キラキラ' },
  { id: '6', emoji: '💪', name: '頑張れ' },
  { id: '7', emoji: '🙏', name: 'ありがとう' },
  { id: '8', emoji: '💯', name: 'パーフェクト' },
];

interface StampPickerProps {
  onSelect: (stampId: string) => void;
}

function StampPicker({ onSelect }: StampPickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-gray-500 hover:text-gray-700 transition-colors p-2 rounded-full hover:bg-gray-100"
      >
        <Smile className="h-5 w-5" />
      </button>

      {isOpen && (
        <div className="absolute bottom-full left-0 mb-2 bg-white rounded-lg shadow-lg border border-gray-200 p-2 grid grid-cols-4 gap-2 min-w-[200px]">
          {stamps.map((stamp) => (
            <button
              key={stamp.id}
              onClick={() => {
                onSelect(stamp.id);
                setIsOpen(false);
              }}
              className="flex flex-col items-center p-2 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <span className="text-2xl">{stamp.emoji}</span>
              <span className="text-xs text-gray-600 mt-1">{stamp.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default StampPicker;