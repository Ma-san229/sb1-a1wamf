import React from 'react';
import { usePointsStore } from '../store/pointsStore';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { TrendingUp, TrendingDown, Loader2 } from 'lucide-react';

function PointsHistory() {
  const { history, loading } = usePointsStore();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-pink-500" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">ポイント履歴</h3>
      <div className="space-y-2">
        {history.map((record) => (
          <div
            key={record.id}
            className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100"
          >
            <div className="flex items-center space-x-3">
              <div className={`
                p-2 rounded-full
                ${record.points > 0 
                  ? 'bg-green-100 text-green-600'
                  : 'bg-red-100 text-red-600'}
              `}>
                {record.points > 0 ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">{record.reason}</p>
                <p className="text-xs text-gray-500">
                  {format(new Date(record.created_at), 'yyyy年MM月dd日 HH:mm', { locale: ja })}
                </p>
              </div>
            </div>
            <span className={`
              font-medium
              ${record.points > 0 ? 'text-green-600' : 'text-red-600'}
            `}>
              {record.points > 0 ? '+' : ''}{record.points} pts
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PointsHistory;