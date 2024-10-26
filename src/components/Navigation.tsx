import React from 'react';
import { Home, Calendar, Users, Bell, Settings, BookTemplate } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { icon: Home, label: 'ホーム', path: '/' },
  { icon: Calendar, label: '予約', path: '/scheduled' },
  { icon: Users, label: 'タイムライン', path: '/timeline' },
  { icon: BookTemplate, label: 'テンプレート', path: '/templates' },
  { icon: Bell, label: '通知', path: '/notifications' },
  { icon: Settings, label: '設定', path: '/settings' }
];

function Navigation() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 w-full bg-white border-t border-gray-100 md:relative md:w-64 md:h-screen md:border-r md:border-t-0">
      <div className="flex justify-around md:flex-col md:p-4 md:space-y-2">
        {navItems.map(({ icon: Icon, label, path }) => (
          <Link
            key={path}
            to={path}
            className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-colors ${
              location.pathname === path
                ? 'text-pink-600 bg-pink-50'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Icon className="h-5 w-5" />
            <span className="hidden md:inline font-medium">{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}

export default Navigation;