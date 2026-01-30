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

  useEffect(() => {
    if (id) {
      loadAnimal(id);
    }
  }, [id]);

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

  const handleLike = async () => {
    if (!animal) return;

    try {
      const { error } = await supabase
        .from('animals')
        .update({ likes: animal.likes + 1 })
        .eq('id', animal.id);

      if (error) throw error;

      setAnimal({ ...animal, likes: animal.likes + 1 });
      toast.success('点赞成功！');
    } catch (error: any) {
      console.error('点赞失败:', error);
      toast.error('点赞失败');
    }
  };

  const handleAttack = async () => {
    if (!animal) return;

    try {
      const { error } = await supabase
        .from('animals')
        .update({ attacks: (animal.attacks || 0) + 1 })
        .eq('id', animal.id);

      if (error) throw error;

      setAnimal({ ...animal, attacks: (animal.attacks || 0) + 1 });
      toast.error('已记录攻击事件 😢');
    } catch (error: any) {
      console.error('记录攻击失败:', error);
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
        <div className="flex flex-col items-center gap-4">
          <PawPrint className="h-12 w-12 animate-bounce text-amber-600" />
          <p className="text-stone-600">加载中...</p>
        </div>
      </div>
    );
  }

  if (!animal) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <PawPrint className="h-16 w-16 mx-auto text-stone-400 mb-4" />
          <p className="text-stone-600 mb-4">未找到该动物</p>
          <button
            onClick={() => navigate('/')}
            className="text-amber-600 hover:text-amber-700 underline"
          >
            返回首页
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* 漂浮背景装饰 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 h-64 w-64 animate-float-slow rounded-full bg-amber-200/20 blur-3xl" />
        <div className="absolute top-40 right-20 h-96 w-96 animate-float-medium rounded-full bg-orange-200/15 blur-3xl" />
        <div className="absolute bottom-20 left-1/3 h-80 w-80 animate-float-fast rounded-full bg-pink-200/20 blur-3xl" />
      </div>

      {/* 固定顶部导航栏 */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-amber-100/50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-6xl">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-amber-700 hover:text-amber-800 transition-colors font-medium"
          >
            <ArrowLeft className="h-5 w-5" />
            返回首页
          </button>
          
          <div className="flex items-center gap-3">
            <button
              onClick={handleShare}
              className="p-2 rounded-full hover:bg-amber-100 transition-colors"
              title="分享"
            >
              <Share2 className="h-5 w-5 text-amber-700" />
            </button>
            
            <button
              onClick={handleLike}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white font-medium hover:shadow-lg transition-all transform hover:scale-105"
            >
              <Heart className="h-4 w-4" />
              {animal.likes}
            </button>
            
            <button
              onClick={handleAttack}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white font-medium hover:shadow-lg transition-all transform hover:scale-105"
            >
              <Heart className="h-4 w-4" />
              {animal.attacks || 0}
            </button>
          </div>
        </div>
      </div>

      {/* 主内容 */}
      <div className="relative pt-20">
        {/* 大图展示区 */}
        <div className="relative h-[40vh] md:h-[50vh] overflow-hidden md:mx-auto md:max-w-4xl md:rounded-3xl md:shadow-2xl">
          {/* 图片加载占位 */}
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-amber-100/50">
              <PawPrint className="h-12 w-12 animate-pulse text-amber-600" />
            </div>
          )}
          
          <img
            src={animal.image_url}
            alt={animal.name}
            className={`w-full h-full object-cover transition-opacity duration-500 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
          />
          
          {/* 类型标签 */}
          <div className="absolute top-6 left-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/95 backdrop-blur-sm px-4 py-2 text-base font-medium text-amber-700 shadow-lg">
              {animal.type === 'cat' ? '🐱 猫咪' : '🐶 狗狗'}
            </span>
          </div>
        </div>

        {/* 内容区域 */}
        <div className="relative -mt-8 md:mt-12">
          <div className="container mx-auto px-4 max-w-4xl">
            {/* 名字和品种 */}
            <div className="mb-8 text-center">
              <h1 className="text-5xl md:text-6xl font-bold text-stone-800 mb-3 drop-shadow-sm">
                {animal.name}
              </h1>
              {animal.breed && (
                <p className="text-xl md:text-2xl text-amber-700 font-medium">
                  {animal.breed}
                </p>
              )}
            </div>

            {/* 信息标签组 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
              {/* 地点 */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-full bg-amber-100">
                    <MapPin className="h-5 w-5 text-amber-600" />
                  </div>
                  <span className="font-semibold text-stone-700">发现地点</span>
                </div>
                <p className="text-stone-800 text-lg ml-11">{animal.location}</p>
              </div>

              {/* 学校 */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-full bg-orange-100">
                    <School className="h-5 w-5 text-orange-600" />
                  </div>
                  <span className="font-semibold text-stone-700">所属学校</span>
                </div>
                <p className="text-stone-800 text-lg ml-11">{animal.school}</p>
              </div>

              {/* 时间 */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-full bg-pink-100">
                    <Calendar className="h-5 w-5 text-pink-600" />
                  </div>
                  <span className="font-semibold text-stone-700">添加时间</span>
                </div>
                <p className="text-stone-800 text-lg ml-11">
                  {new Date(animal.created_at).toLocaleDateString('zh-CN')}
                </p>
              </div>
            </div>

            {/* 性格描述区 */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <PawPrint className="h-6 w-6 text-amber-600" />
                <h2 className="text-3xl font-bold text-stone-800">性格特点</h2>
              </div>
              
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-8 md:p-10 shadow-lg">
                <p className="text-stone-700 text-lg md:text-xl leading-relaxed whitespace-pre-wrap">
                  {animal.personality}
                </p>
              </div>
            </div>

            {/* 互动区域 */}
            <div className="mb-12">
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 md:p-10 shadow-lg">
                <h2 className="text-2xl md:text-3xl font-bold text-stone-800 mb-8 text-center">
                  互动统计 📊
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* 点赞区 */}
                  <div className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-gradient-to-br from-pink-50 to-red-50">
                    <div className="text-center">
                      <p className="text-stone-600 text-sm mb-1">如果你今天摸了它</p>
                      <p className="text-stone-800 font-semibold text-lg">请点赞 ❤️</p>
                    </div>
                    <button
                      onClick={handleLike}
                      className="flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold text-xl hover:shadow-xl transition-all transform hover:scale-105"
                    >
                      <Heart className="h-6 w-6" />
                      <span>{animal.likes}</span>
                    </button>
                  </div>

                  {/* 哭哭区 */}
                  <div className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50">
                    <div className="text-center">
                      <p className="text-stone-600 text-sm mb-1">如果你今天被它攻击了</p>
                      <p className="text-stone-800 font-semibold text-lg">请点一个 😭</p>
                    </div>
                    <button
                      onClick={handleAttack}
                      className="flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold text-xl hover:shadow-xl transition-all transform hover:scale-105"
                    >
                      <span className="text-2xl">😭</span>
                      <span>{animal.attacks || 0}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 评论区 */}
            <div className="mb-12">
              <CommentSection animalId={animal.id} />
            </div>

            {/* 底部装饰 */}
            <div className="text-center py-12 mb-8">
              <div className="inline-flex items-center gap-2 text-stone-500">
                <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-300" />
                <span className="text-2xl">🐾</span>
                <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-300" />
              </div>
              <p className="mt-4 text-stone-600">
                感谢您对校园小动物的关注与爱护 💛
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 个人主页按钮 */}
      <button
        onClick={() => user ? navigate('/profile') : navigate('/auth')}
        className="fixed bottom-8 left-8 z-40 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 p-4 text-white shadow-2xl transition-all hover:scale-110 hover:shadow-xl animate-bounce-subtle"
        aria-label="个人主页"
        title={user ? '个人主页' : '登录/注册'}
      >
        <User className="h-6 w-6" />
      </button>
    </div>
  );
}