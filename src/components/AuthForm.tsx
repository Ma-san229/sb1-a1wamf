import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { toast } from 'react-hot-toast';
import { LogIn, UserPlus, Loader2, Mail, Lock } from 'lucide-react';

function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuthStore();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('すべての項目を入力してください');
      return;
    }

    if (!validateEmail(email)) {
      toast.error('有効なメールアドレスを入力してください');
      return;
    }

    if (!isLogin && password.length < 6) {
      toast.error('パスワードは6文字以上で入力してください');
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-xl shadow-sm border border-pink-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        {isLogin ? 'ログイン' : '新規登録'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            メールアドレス
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              required
              disabled={loading}
              placeholder="example@email.com"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            パスワード
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              required
              disabled={loading}
              minLength={6}
              placeholder="••••••"
            />
          </div>
          {!isLogin && (
            <p className="mt-1 text-sm text-gray-500">
              パスワードは6文字以上で入力してください
            </p>
          )}
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>処理中...</span>
            </>
          ) : isLogin ? (
            <>
              <LogIn className="h-4 w-4" />
              <span>ログイン</span>
            </>
          ) : (
            <>
              <UserPlus className="h-4 w-4" />
              <span>アカウント作成</span>
            </>
          )}
        </button>
        <div className="text-center">
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setEmail('');
              setPassword('');
            }}
            className="text-sm text-pink-600 hover:text-pink-700 transition-colors"
            disabled={loading}
          >
            {isLogin ? 'アカウントをお持ちでない方はこちら' : 'アカウントをお持ちの方はこちら'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AuthForm;