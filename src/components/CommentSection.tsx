import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { MessageCircle, Send } from 'lucide-react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

interface Comment {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  user: {
    username: string;
    avatar_url?: string;
  };
}

interface CommentSectionProps {
  memoryId: string;
  comments: Comment[];
  onAddComment: (content: string) => Promise<void>;
}

function CommentSection({ memoryId, comments, onAddComment }: CommentSectionProps) {
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setIsSubmitting(true);
    try {
      await onAddComment(comment.trim());
      setComment('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 text-gray-600">
        <MessageCircle className="h-5 w-5" />
        <h3 className="font-medium">コメント ({comments.length})</h3>
      </div>

      <form onSubmit={handleSubmit} className="flex space-x-2">
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="コメントを追加..."
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          disabled={isSubmitting}
        />
        <button
          type="submit"
          disabled={isSubmitting || !comment.trim()}
          className="bg-pink-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-pink-600 transition-colors disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
          <span>送信</span>
        </button>
      </form>

      <div className="space-y-3">
        {comments.map((comment) => (
          <div key={comment.id} className="flex space-x-3">
            {comment.user.avatar_url ? (
              <img
                src={comment.user.avatar_url}
                alt={comment.user.username}
                className="h-8 w-8 rounded-full"
              />
            ) : (
              <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-gray-500 text-sm">
                  {comment.user.username[0].toUpperCase()}
                </span>
              </div>
            )}
            <div className="flex-1">
              <div className="bg-gray-50 rounded-lg px-4 py-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-gray-800">
                    {comment.user.username}
                  </span>
                  <span className="text-sm text-gray-500">
                    {format(new Date(comment.created_at), 'MM/dd HH:mm', { locale: ja })}
                  </span>
                </div>
                <p className="text-gray-600">{comment.content}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CommentSection;