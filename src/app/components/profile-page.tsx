import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Heart, MessageCircle, Upload, LogOut, Edit2, Camera } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface UserStats {
  likesGiven: number;
  commentsCount: number;
  submissionsCount: number;
}

interface RecentComment {
  id: string;
  content: string;
  created_at: string;
  animal_id: string;
  animals?: {
    name: string;
  };
}

export function ProfilePage() {
  const navigate = useNavigate();
  const { user, signOut, updateProfile } = useAuth();
  const [stats, setStats] = useState<UserStats>({
    likesGiven: 0,
    commentsCount: 0,
    submissionsCount: 0,
  });
  const [recentComments, setRecentComments] = useState<RecentComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editUsername, setEditUsername] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    loadUserData();
    setEditUsername(user.user_metadata?.username || '');
  }, [user, navigate]);

  const loadUserData = async () => {
    if (!user) return;

    try {
      // 加载评论数据
      const { data: comments, error: commentsError } = await supabase
        .from('comments')
        .select('*, animals(name)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (commentsError) throw commentsError;

      // 加载投稿数据
      const { data: submissions, error: submissionsError } = await supabase
        .from('submissions')
        .select('*')
        .eq('user_email', user.email)
        .order('created_at', { ascending: false });

      if (submissionsError) throw submissionsError;

      setRecentComments(comments || []);
      setStats({
        likesGiven: 0, // 可以扩展：记录用户点赞历史
        commentsCount: comments?.length || 0,
        submissionsCount: submissions?.length || 0,
      });
    } catch (error: any) {
      console.error('加载用户数据失败:', error);
      toast.error('加载数据失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('已退出登录');
      navigate('/');
    } catch (error) {
      toast.error('退出失败');
    }
  };

  const handleUpdateProfile = async () => {
    if (!editUsername.trim()) {
      toast.error('用户名不能为空');
      return;
    }

    // 验证用户名格式
    if (editUsername.length < 2 || editUsername.length > 20) {
      toast.error('用户名长度必须在 2-20 个字符之间');
      return;
    }

    const usernameRegex = /^[\u4e00-\u9fa5a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(editUsername)) {
      toast.error('用户名只能包含中文、字母、数字和下划线');
      return;
    }

    // 如果用户名没有变化，直接返回
    if (editUsername.trim() === user?.user_metadata?.username) {
      setIsEditing(false);
      return;
    }

    try {
      const { error } = await updateProfile(editUsername.trim());
      if (error) throw error;
      toast.success('更新成功！');
      setIsEditing(false);
      // 刷新页面以显示新用户名
      window.location.reload();
    } catch (error: any) {
      console.error('更新失败:', error);
      toast.error('更新失败，请重试');
    }
  };

  const handleChangeAvatar = () => {
    const newSeed = Math.random().toString(36).substring(7);
    const newAvatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${newSeed}`;
    updateProfile(user?.user_metadata?.username || '', newAvatarUrl);
    toast.success('头像已更新！');
    // 刷新页面以显示新头像
    window.location.reload();
  };

  if (!user) return null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-pink-50 flex items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-amber-200 border-t-amber-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-pink-50 relative overflow-hidden">
      {/* 背景装饰 */}
 <div className="fixed inset-0 -z-10">
  <div className="absolute top-20 left-10 h-64 w-64 animate-float-slow rounded-full bg-amber-200/30 blur-3xl" />
  <div className="absolute top-40 right-20 h-96 w-96 animate-float-medium rounded-full bg-orange-200/20 blur-3xl" />
  <div className="absolute bottom-20 left-1/3 h-80 w-80 animate-float-fast rounded-full bg-pink-200/25 blur-3xl" />
</div>
      {/* 顶部导航 */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-amber-100/50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-4xl">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-amber-700 hover:text-amber-800 transition-colors font-medium"
          >
            <ArrowLeft className="h-5 w-5" />
            返回首页
          </button>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 rounded-full bg-red-500 px-4 py-2 text-white hover:bg-red-600 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            退出登录
          </button>
        </div>
      </div>

      {/* 主内容 */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* 个人信息卡片 */}
        <div className="mb-8 rounded-3xl bg-white/90 backdrop-blur-sm p-8 shadow-2xl">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* 头像 */}
            <div className="relative group">
              <img
                src={user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`}
                alt="头像"
                className="h-32 w-32 rounded-full border-4 border-amber-200 shadow-lg"
              />
              <button
                onClick={handleChangeAvatar}
                className="absolute bottom-0 right-0 rounded-full bg-amber-500 p-2 text-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                title="更换头像"
              >
                <Camera className="h-4 w-4" />
              </button>
            </div>

            {/* 用户信息 */}
            <div className="flex-1 text-center md:text-left">
              {isEditing ? (
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    value={editUsername}
                    onChange={(e) => setEditUsername(e.target.value)}
                    className="rounded-lg border border-stone-300 px-3 py-2 text-xl font-bold text-stone-800"
                  />
                  <button
                    onClick={handleUpdateProfile}
                    className="rounded-lg bg-green-500 px-4 py-2 text-white hover:bg-green-600"
                  >
                    保存
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditUsername(user.user_metadata?.username || '');
                    }}
                    className="rounded-lg bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
                  >
                    取消
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
                  <h1 className="text-3xl font-bold text-stone-800">
                    {user.user_metadata?.username || '匿名用户'}
                  </h1>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="rounded-full p-2 hover:bg-amber-100 transition-colors"
                    title="编辑资料"
                  >
                    <Edit2 className="h-4 w-4 text-amber-600" />
                  </button>
                </div>
              )}
              <div className="flex items-center gap-2 text-stone-600 justify-center md:justify-start">
                <Mail className="h-4 w-4" />
                <span>{user.email}</span>
              </div>
              <p className="mt-3 text-sm text-stone-500">
                加入于 {new Date(user.created_at).toLocaleDateString('zh-CN')}
              </p>
            </div>
          </div>

          {/* 统计数据 */}
          <div className="mt-8 grid grid-cols-3 gap-4">
            <div className="rounded-2xl bg-gradient-to-br from-pink-50 to-red-50 p-6 text-center">
              <Heart className="mx-auto mb-2 h-8 w-8 text-red-500" />
              <p className="text-2xl font-bold text-stone-800">{stats.likesGiven}</p>
              <p className="text-sm text-stone-600">点赞数</p>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 p-6 text-center">
              <MessageCircle className="mx-auto mb-2 h-8 w-8 text-blue-500" />
              <p className="text-2xl font-bold text-stone-800">{stats.commentsCount}</p>
              <p className="text-sm text-stone-600">评论数</p>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 p-6 text-center">
              <Upload className="mx-auto mb-2 h-8 w-8 text-orange-500" />
              <p className="text-2xl font-bold text-stone-800">{stats.submissionsCount}</p>
              <p className="text-sm text-stone-600">投稿数</p>
            </div>
          </div>
        </div>

        {/* 最近评论 */}
        <div className="rounded-3xl bg-white/90 backdrop-blur-sm p-8 shadow-2xl">
          <h2 className="mb-6 text-2xl font-bold text-stone-800">最近评论</h2>
          {recentComments.length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle className="mx-auto mb-4 h-12 w-12 text-stone-300" />
              <p className="text-stone-500">还没有发表评论</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentComments.map((comment) => (
                <div
                  key={comment.id}
                  className="rounded-xl border border-stone-200 bg-amber-50/50 p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => navigate(`/animal/${comment.animal_id}`)}
                >
                  <p className="text-stone-800 mb-2">{comment.content}</p>
                  <div className="flex items-center justify-between text-sm text-stone-500">
                    <span>
                      评论于{' '}
                      <span className="font-medium text-amber-600">
                        {comment.animals?.name || '未知动物'}
                      </span>
                    </span>
                    <span>{new Date(comment.created_at).toLocaleDateString('zh-CN')}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 底部装饰 */}
        <div className="text-center py-12">
          <div className="inline-flex items-center gap-2 text-stone-500">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-300" />
            <User className="h-5 w-5 text-amber-600" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-300" />
          </div>
        </div>
      </div>
    </div>
  );
}