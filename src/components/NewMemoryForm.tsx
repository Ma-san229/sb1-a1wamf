import React from 'react';
import { PlusCircle } from 'lucide-react';

interface NewMemoryFormProps {
  onClick: () => void;
}

function NewMemoryForm({ onClick }: NewMemoryFormProps) {
  return (
    <div
      onClick={onClick}
      className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl shadow-sm border-2 border-dashed border-pink-200 p-6 hover:border-pink-300 transition-colors cursor-pointer h-full min-h-[240px] flex items-center justify-center"
    >
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto">
          <PlusCircle className="h-8 w-8 text-pink-500" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">新しいメモリーを作成</h3>
          <p className="text-sm text-gray-600">
            大切な人への感謝の気持ちを
            <br />
            メッセージに込めて
          </p>
        </div>
      </div>
    </div>
  );
}

export default NewMemoryForm;