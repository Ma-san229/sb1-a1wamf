import React from 'react';
import { ValueTag, useValueStore } from '../store/valueStore';
import { Award, Loader2 } from 'lucide-react';

interface ValueTagSelectorProps {
  selectedTags: string[];
  onTagSelect: (tagId: string) => void;
}

function ValueTagSelector({ selectedTags, onTagSelect }: ValueTagSelectorProps) {
  const { tags, loading } = useValueStore();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-4">
        <Loader2 className="h-5 w-5 animate-spin text-pink-500" />
      </div>
    );
  }

  const groupedTags = tags.reduce((acc, tag) => {
    if (!acc[tag.category]) {
      acc[tag.category] = [];
    }
    acc[tag.category].push(tag);
    return acc;
  }, {} as Record<string, ValueTag[]>);

  const categoryLabels = {
    culture: '企業文化',
    principle: '行動指針',
    behavior: '行動規範',
  };

  return (
    <div className="space-y-4">
      {Object.entries(groupedTags).map(([category, categoryTags]) => (
        <div key={category}>
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            {categoryLabels[category as keyof typeof categoryLabels]}
          </h3>
          <div className="flex flex-wrap gap-2">
            {categoryTags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => onTagSelect(tag.id)}
                className={`
                  inline-flex items-center px-3 py-1 rounded-full text-sm
                  ${
                    selectedTags.includes(tag.id)
                      ? 'bg-pink-100 text-pink-700 border-pink-200'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                  }
                  border transition-colors duration-200
                `}
              >
                <Award className="h-3.5 w-3.5 mr-1" />
                <span>{tag.name}</span>
                <span className="ml-1 text-xs text-pink-500">+{tag.point_value}</span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default ValueTagSelector;