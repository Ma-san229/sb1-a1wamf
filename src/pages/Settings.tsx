import React from 'react';
import { useAuthStore } from '../store/authStore';
import { Bell, Lock, User, Globe } from 'lucide-react';

function Settings() {
  const { user } = useAuthStore();

  const sections = [
    {
      title: 'プロフィール設定',
      icon: User,
      items: [
        { label: 'メールアドレス', value: user?.email },
        { label: 'ユーザー名', value: 'Not set' },
        { label: 'プロフィール画像', value: 'Not set' }
      ]
    },
    {
      title: '通知設定',
      icon: Bell,
      items: [
        { label: 'メール通知', value: 'ON' },
        { label: 'プッシュ通知', value: 'OFF' },
        { label: 'リマインダー', value: 'ON' }
      ]
    },
    {
      title: 'プライバシー設定',
      icon: Lock,
      items: [
        { label: 'アカウントの公開範囲', value: '友達のみ' },
        { label: 'メモリーの既定の公開範囲', value: '非公開' }
      ]
    },
    {
      title: '言語と地域',
      icon: Globe,
      items: [
        { label: '言語', value: '日本語' },
        { label: 'タイムゾーン', value: 'Asia/Tokyo' }
      ]
    }
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">設定</h2>
      
      <div className="space-y-6">
        {sections.map(({ title, icon: Icon, items }) => (
          <div key={title} className="bg-white rounded-xl p-6 shadow-sm border border-pink-100">
            <div className="flex items-center space-x-2 mb-4">
              <Icon className="h-5 w-5 text-pink-500" />
              <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
            </div>
            <div className="space-y-3">
              {items.map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-gray-600">{label}</span>
                  <span className="text-gray-800 font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Settings;