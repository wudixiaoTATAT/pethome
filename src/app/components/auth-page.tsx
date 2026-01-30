import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, PawPrint, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { toast } from 'sonner';

export function AuthPage() {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        // 登录
        const { error } = await signIn(formData.email, formData.password);
        if (error) throw error;
        toast.success('登录成功！');
        navigate('/profile');
      } else {
        // 注册
        if (!formData.username.trim()) {
          toast.error('请输入用户名');
          setLoading(false);
          return;
        }
        const { error } = await signUp(formData.email, formData.password, formData.username);
        if (error) throw error;
        toast.success('注册成功！正在自动登录...');
        
        // 注册后自动登录
        setTimeout(async () => {
          const { error: signInError } = await signIn(formData.email, formData.password);
          if (!signInError) {
            navigate('/profile');
          } else {
            toast.success('注册成功！请手动登录');
            setIsLogin(true);
          }
        }, 1000);
      }
    } catch (error: any) {
      console.error('认证错误:', error);
      
      // 友好的错误提示
      let errorMessage = '操作失败，请重试';
      
      if (error.message?.includes('Email not confirmed')) {
        errorMessage = '邮箱未验证';
        toast.error(errorMessage, {
          description: '请点击下方按钮查看详细修复步骤',
          duration: 10000,
          action: {
            label: '查看修复指南',
            onClick: () => navigate('/setup-guide')
          },
        });
      } else if (error.message?.includes('Invalid login credentials')) {
        errorMessage = '邮箱或密码错误';
        toast.error(errorMessage);
      } else if (error.message?.includes('User already registered')) {
        errorMessage = '该邮箱已被注册，请直接登录';
        toast.error(errorMessage);
      } else if (error.message?.includes('Password should be at least')) {
        errorMessage = '密码至少需要 6 个字符';
        toast.error(errorMessage);
      } else if (error.message) {
        errorMessage = error.message;
        toast.error(errorMessage);
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-pink-50 relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-20 left-10 h-64 w-64 animate-float-slow rounded-full bg-amber-200/30 blur-3xl" />
        <div className="absolute top-40 right-20 h-96 w-96 animate-float-medium rounded-full bg-orange-200/20 blur-3xl" />
        <div className="absolute bottom-20 left-1/3 h-80 w-80 animate-float-fast rounded-full bg-pink-200/25 blur-3xl" />
      </div>

      {/* 返回按钮 */}
      <button
        onClick={() => navigate('/')}
        className="fixed top-6 left-6 z-50 flex items-center gap-2 rounded-full bg-white/80 backdrop-blur-sm px-4 py-2 text-amber-700 shadow-lg transition-all hover:bg-white hover:shadow-xl"
      >
        <ArrowLeft className="h-4 w-4" />
        返回首页
      </button>

      {/* 主内容 */}
      <div className="flex min-h-screen items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 inline-flex items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 p-4 shadow-xl">
              <PawPrint className="h-12 w-12 text-white" />
            </div>
            <h1 className="mb-2 text-3xl font-bold text-stone-800">
              {isLogin ? '欢迎回来' : '加入我们'}
            </h1>
            <p className="text-stone-600">
              {isLogin ? '登录校园动物档案馆' : '创建您的账户'}
            </p>
          </div>

          {/* 表单卡片 */}
          <div className="rounded-3xl bg-white/90 backdrop-blur-sm p-8 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 用户名（仅注册时显示） */}
              {!isLogin && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-stone-700">
                    用户名
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400" />
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="请输入用户名"
                      required={!isLogin}
                      className="w-full rounded-xl border border-stone-300 bg-white py-3 pl-12 pr-4 text-stone-800 placeholder:text-stone-400 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
                    />
                  </div>
                </div>
              )}

              {/* 邮箱 */}
              <div>
                <label className="mb-2 block text-sm font-medium text-stone-700">
                  邮箱
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    required
                    className="w-full rounded-xl border border-stone-300 bg-white py-3 pl-12 pr-4 text-stone-800 placeholder:text-stone-400 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
                  />
                </div>
              </div>

              {/* 密码 */}
              <div>
                <label className="mb-2 block text-sm font-medium text-stone-700">
                  密码
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="请输入密码"
                    required
                    minLength={6}
                    className="w-full rounded-xl border border-stone-300 bg-white py-3 pl-12 pr-4 text-stone-800 placeholder:text-stone-400 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
                  />
                </div>
                {!isLogin && (
                  <p className="mt-1 text-xs text-stone-500">密码至少 6 位</p>
                )}
              </div>

              {/* 提交按钮 */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 py-3 font-semibold text-white shadow-lg transition-all hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '处理中...' : isLogin ? '登录' : '注册'}
              </button>
            </form>

            {/* 切换登录/注册 */}
            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setFormData({ email: '', password: '', username: '' });
                }}
                className="text-sm text-amber-600 hover:text-amber-700 font-medium"
              >
                {isLogin ? '还没有账户？立即注册' : '已有账户？立即登录'}
              </button>
            </div>
          </div>

          {/* 底部提示 */}
          <p className="mt-6 text-center text-sm text-stone-500">
            登录即表示您同意我们的服务条款和隐私政策
          </p>
        </div>
      </div>
    </div>
  );
}