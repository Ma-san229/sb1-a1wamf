import React from 'react';
import { Heart, MessageCircle, UserPlus, Bell } from 'lucide-react';

const mockNotifications = [
  {
    id: 1,
    type: 'like',
    user: 'Yuki',
    content: 'あなたのメモリーにいいねしました',
    time: '5分前',
    icon: Heart,
    color: 'text-pink-500',
    bgColor: 'bg-pink-100'
  },
  {
    id: 2,
    type: 'comment',
    user: 'Taro',
    content: 'あなたのメモリーにコメントしました',
    time: '1時間前',
    icon: MessageCircle,
    color: 'text-blue-500',
    bgColor: 'bg-blue-100'
  },
  {
    id: 3,
    type: 'follow',
    user: 'Hanako',
    content: 'あなたをフォローしました',
    time: '2時間前',
    icon: UserPlus,
    color: 'text-green-500',
    bgColor: 'bg-green-100'
  }
];

function Notifications() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">通知</h2>

      {mockNotifications.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bell className="h-8 w-8 text-gray-400" />
          </div>
          <p className="text-gray-500">新しい通知はありません</p>
        </div>
      ) : (
        <div className="space-y-4">
          {mockNotifications.map(({ id, type, user, content, time, icon: Icon, color, bgColor }) => (
            <div
              key={id}
              className="bg-white rounded-lg p-4 shadow-sm border border-pink-100 flex items-center space-x-4"
            >
              <div className={`${bgColor} p-2 rounded-full`}>
                <Icon className={`h-5 w-5 ${color}`} />
              </div>
              <div className="flex-1">
                <p className="text-gray-800">
                  <span className="font-medium">{user}</span>さんが{content}
                </p>
                <p className="text-sm text-gray-500">{time}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Notifications;