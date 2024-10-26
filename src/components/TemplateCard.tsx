import React, { useState } from 'react';
import { Template } from '../store/templateStore';
import { Edit2, Trash2, Copy, Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface TemplateCardProps extends Template {
  onDelete: () => Promise<void>;
  onUpdate: (updates: Partial<Template>) => Promise<void>;
  onUse: (template: Template) => void;
}

function TemplateCard({
  id,
  title,
  message,
  category,
  tags,
  is_public,
  usage_count,
  onDelete,
  onUpdate,
  onUse
}: TemplateCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const [editedMessage, setEditedMessage] = useState(message);

  const handleDelete = async () => {
    if (window.confirm('このテンプレートを削除してもよろしいですか？')) {
      try {
        await onDelete();
        toast.success('テンプレートを削除しました');
      } catch (error) {
        toast.error('削除に失敗しました');
      }
    }
  };

  const handleUpdate = async () => {
    try {
      await onUpdate({ title: editedTitle, message: editedMessage });
      setIsEditing(false);
      toast.success('テンプレートを更新しました');
    } catch (error) {
      toast.error('更新に失敗しました');
    }
  };

  const handleTogglePublic = async () => {
    try {
      await onUpdate({ is_public: !is_public });
      toast.success(`テンプレートを${is_public ? '非公開' : '公開'}にしました`);
    } catch (error) {
      toast.error('更新に失敗しました');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-pink-100">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          {isEditing ? (
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          ) : (
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          )}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleTogglePublic}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              {is_public ? (
                <Eye className="h-4 w-4" />
              ) : (
                <EyeOff className="h-4 w-4" />
              )}
            </button>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <Edit2 className="h-4 w-4" />
            </button>
            <button
              onClick={handleDelete}
              className="text-gray-500 hover:text-red-500 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {isEditing ? (
          <div className="space-y-3">
            <textarea
              value={editedMessage}
              onChange={(e) => setEditedMessage(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              rows={4}
            />
            <div className="flex space-x-2">
              <button
                onClick={handleUpdate}
                className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 hover:opacity-90 transition-opacity"
              >
                <span>更新</span>
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                キャンセル
              </button>
            </div>
          </div>
        ) : (
          <>
            <p className="text-gray-600 mb-4 leading-relaxed">{message}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <span className="text-sm text-gray-500">
                使用回数: {usage_count}回
              </span>
              <button
                onClick={() => onUse({ id, title, message, category, tags, is_public, usage_count })}
                className="flex items-center space-x-1 text-pink-600 hover:text-pink-700 transition-colors"
              >
                <Copy className="h-4 w-4" />
                <span>使用する</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default TemplateCard;