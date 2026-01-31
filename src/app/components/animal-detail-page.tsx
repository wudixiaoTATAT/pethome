import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Heart, Calendar, PawPrint, Share2, School, User } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Animal } from '@/lib/types';
import { CommentSection } from './comment-section';
import { useAuth } from '@/contexts/auth-context';
import { toast } from 'sonner';

export function AnimalDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [animal, setAnimal] = useState<Animal | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);

  // 加载数据
  const loadAnimal = async (animalId: string) => {
    try {
      const { data, error } = await supabase
        .from('animals')
        .select('*')
        .eq('id', animalId)
        .single();

      if (error) throw error;
      setAnimal(data);
    } catch (error: any) {
      console.error('加载动物数据失败:', error);
      toast.error('加载失败，请重试');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadAnimal(id);

      // 实时同步点赞数
      const channel = supabase.channel(`animal_detail_${id}`)
        .on('postgres_changes', { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'animals',
          filter: `id=eq.${id}` 
        }, (payload) => {
          setAnimal(payload.new as Animal);
        })
        .subscribe();

      return () => { supabase.removeChannel(channel); };
    }
  }, [id]);

  // 核心逻辑：调用数据库函数实现每日限额
  const handleAction = async (type: 'like' | 'attack') => {
    if (!user) {
      toast.error('请先登录后再操作 🐾');
      return;
    }
    if (!animal) return;

    try {
      const { data, error } = await supabase.rpc('perform_user_action', {
        p_animal_id: animal.id,
        p_action_type: type
      });

      if (error) throw error;

      if (data.success) {
        if (data.action === 'added') {
          toast.success(type === 'like' ? '点赞成功！❤️' : '已记录攻击事件 😭');
        } else {
          toast.info('已取消操作');
        }
      }
    } catch (error: any) {
      toast.error('操作失败');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${animal?.name} - 校园动物档案馆`,
        text: `来看看这只可爱的${animal?.type === 'cat' ? '猫咪' : '狗狗'}！`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('链接已复制到剪贴板');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center">
        <PawPrint className="h-12 w-12 animate-bounce text-amber-600" />
      </div>
    );
  }

  if (!animal) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* 恢复：背景装饰气泡 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 h-64 w-64 animate-float-slow rounded-full bg-amber-200/20 blur-3xl" />
        <div className="absolute top-40 right-20 h-96 w-96 animate-float-medium rounded-full bg-orange-200/15 blur-3xl" />
        <div className="absolute bottom-20 left-1/3 h-80 w-80 animate-float-fast rounded-full bg-pink-200/20 blur-3xl" />
      </div>

      {/* 恢复：固定顶部导航 */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-amber-100/50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-6xl">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-amber-700 hover:text-amber-800 transition-colors font-medium">
            <ArrowLeft className="h-5 w-5" /> 返回首页
          </button>
          
          <div className="flex items-center gap-3">
            <button onClick={handleShare} className="p-2 rounded-full hover:bg-amber-100 transition-colors">
              <Share2 className="h-5 w-5 text-amber-700" />
            </button>
            <button 
              onClick={() => handleAction('like')} 
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white font-medium hover:shadow-lg transition-all transform hover:scale-105 active:scale-95"
            >
              <Heart className="h-4 w-4" /> {animal.likes}
            </button>
            <button 
              onClick={() => handleAction('attack')} 
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium hover:shadow-lg transition-all transform hover:scale-105 active:scale-95"
            >
              <span className="text-sm">😭</span> {animal.attacks || 0}
            </button>
          </div>
        </div>
      </div>

      <div className="relative pt-20 pb-20">
        {/* 恢复：原有大图圆角卡片布局 */}
        <div className="relative h-[40vh] md:h-[50vh] overflow-hidden md:mx-auto md:max-w-4xl md:rounded-3xl md:shadow-2xl">
          <img
            src={animal.image_url}
            alt={animal.name}
            className={`w-full h-full object-cover transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImageLoaded(true)}
          />
          <div className="absolute top-6 left-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/95 backdrop-blur-sm px-4 py-2 text-base font-medium text-amber-700 shadow-lg">
              {animal.type === 'cat' ? '🐱 猫咪' : '🐶 狗狗'}
            </span>
          </div>
        </div>

        <div className="container mx-auto px-4 max-w-4xl relative -mt-8 md:mt-12">
          {/* 名字区 */}
          <div className="mb-8 text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-stone-800 mb-3 drop-shadow-sm">{animal.name}</h1>
            {animal.breed && <p className="text-xl md:text-2xl text-amber-700 font-medium">{animal.breed}</p>}
          </div>

          {/* 恢复：三栏信息卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-white/50">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-full bg-amber-100"><MapPin className="h-5 w-5 text-amber-600" /></div>
                <span className="font-semibold text-stone-700">发现地点</span>
              </div>
              <p className="text-stone-800 text-lg ml-11">{animal.location}</p>
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-white/50">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-full bg-orange-100"><School className="h-5 w-5 text-orange-600" /></div>
                <span className="font-semibold text-stone-700">所属学校</span>
              </div>
              <p className="text-stone-800 text-lg ml-11">{animal.school}</p>
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-white/50">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-full bg-pink-100"><Calendar className="h-5 w-5 text-pink-600" /></div>
                <span className="font-semibold text-stone-700">添加时间</span>
              </div>
              <p className="text-stone-800 text-lg ml-11">{new Date(animal.created_at).toLocaleDateString('zh-CN')}</p>
            </div>
          </div>

          {/* 性格描述 */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <PawPrint className="h-6 w-6 text-amber-600" />
              <h2 className="text-3xl font-bold text-stone-800">性格特点</h2>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-8 md:p-10 shadow-lg border border-amber-100/50">
              <p className="text-stone-700 text-lg md:text-xl leading-relaxed whitespace-pre-wrap">{animal.personality}</p>
            </div>
          </div>

          {/* 互动统计面板 */}
          <div className="mb-12 bg-white/90 backdrop-blur-sm rounded-3xl p-8 md:p-10 shadow-lg">
             <h2 className="text-2xl font-bold text-stone-800 mb-8 text-center">互动统计 📊</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-gradient-to-br from-pink-50 to-red-50 border border-pink-100">
                  <p className="text-stone-800 font-semibold">如果你今天摸了它 ❤️</p>
                  <button onClick={() => handleAction('like')} className="flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold text-xl hover:shadow-xl transition-all transform hover:scale-105 active:scale-95">
                    <Heart className="h-6 w-6" /> <span>{animal.likes}</span>
                  </button>
                </div>
                <div className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100">
                  <p className="text-stone-800 font-semibold">如果你被它攻击了 😭</p>
                  <button onClick={() => handleAction('attack')} className="flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold text-xl hover:shadow-xl transition-all transform hover:scale-105 active:scale-95">
                    <span className="text-2xl">😭</span> <span>{animal.attacks || 0}</span>
                  </button>
                </div>
             </div>
          </div>

          {/* 评论区 */}
          <div className="mb-12">
            <CommentSection animalId={animal.id} />
          </div>
        </div>
      </div>

      {/* 恢复：左下角个人主页按钮 */}
      <button
        onClick={() => user ? navigate('/profile') : navigate('/auth')}
        className="fixed bottom-8 left-8 z-40 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 p-4 text-white shadow-2xl transition-all hover:scale-110 animate-bounce-subtle"
      >
        <User className="h-6 w-6" />
      </button>
    </div>
  );
}