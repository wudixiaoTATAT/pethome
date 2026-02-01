import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Heart, Calendar, PawPrint, Share2, School, User } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Animal } from '@/lib/types';
import { CommentSection } from './comment-section';
import { useAuth } from '@/contexts/auth-context';
import { toast } from 'sonner';

// Swiper 核心组件与样式
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

export function AnimalDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [animal, setAnimal] = useState<Animal | null>(null);
  const [loading, setLoading] = useState(true);

  // 本地互动状态
  const [localLikes, setLocalLikes] = useState(0);
  const [localAttacks, setLocalAttacks] = useState(0);
  const [isLiked, setIsLiked] = useState(false); 
  const [isAttacked, setIsAttacked] = useState(false);

  const loadInitialData = async (animalId: string) => {
    try {
      const { data: animalData, error: animalError } = await supabase
        .from('animals')
        .select('*')
        .eq('id', animalId)
        .single();

      if (animalError) throw animalError;
      setAnimal(animalData);
      setLocalLikes(animalData.likes || 0);
      setLocalAttacks(animalData.attacks || 0);

      if (user) {
        const today = new Date().toISOString().split('T')[0];
        const { data: actions } = await supabase
          .from('user_actions')
          .select('action_type')
          .eq('animal_id', animalId)
          .eq('user_id', user.id)
          .eq('action_date', today);

        if (actions) {
          setIsLiked(actions.some(a => a.action_type === 'like'));
          setIsAttacked(actions.some(a => a.action_type === 'attack'));
        }
      }
    } catch (error: any) {
      console.error('加载失败:', error);
      toast.error('档案加载失败');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadInitialData(id);
      const channel = supabase.channel(`animal_detail_${id}`)
        .on('postgres_changes', { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'animals',
          filter: `id=eq.${id}` 
        }, (payload) => {
          const newData = payload.new as Animal;
          setAnimal(newData);
          setLocalLikes(newData.likes || 0);
          setLocalAttacks(newData.attacks || 0);
        })
        .subscribe();
      return () => { supabase.removeChannel(channel); };
    }
  }, [id, user]);

  const handleAction = async (type: 'like' | 'attack') => {
    if (!user) return toast.error('请先登录后再操作 🐾');
    if (!animal) return;
    const alreadyDone = type === 'like' ? isLiked : isAttacked;
    const offset = alreadyDone ? -1 : 1;
    if (type === 'like') { setLocalLikes(prev => prev + offset); setIsLiked(!isLiked); }
    else { setLocalAttacks(prev => prev + offset); setIsAttacked(!isAttacked); }
    try {
      const { data, error } = await supabase.rpc('perform_user_action', {
        p_animal_id: animal.id, p_action_type: type
      });
      if (error) throw error;
      if (data.success) {
        toast.success(data.action === 'added' ? (type === 'like' ? '点赞成功！❤️' : '已记录攻击 😭') : '已取消操作');
      }
    } catch (error: any) {
      if (type === 'like') { setLocalLikes(prev => prev - offset); setIsLiked(alreadyDone); }
      else { setLocalAttacks(prev => prev - offset); setIsAttacked(alreadyDone); }
      toast.error('操作失败，请重试');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${animal?.name} - 校园动物档案馆`,
        text: `来看看这只可爱的${animal?.type === 'cat' ? '猫咪' : '狗狗'}！`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('链接已复制到剪贴板');
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-amber-50 flex items-center justify-center">
      <PawPrint className="h-12 w-12 animate-bounce text-amber-600" />
    </div>
  );

  if (!animal) return null;

  const images = Array.isArray(animal.image_url) 
    ? animal.image_url 
    : (typeof animal.image_url === 'string' && animal.image_url.startsWith('[')
      ? JSON.parse(animal.image_url) 
      : [animal.image_url].filter(Boolean));

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 relative selection:bg-orange-200">
      {/* --- Swiper 视觉定制样式注入 --- */}
      <style dangerouslySetInnerHTML={{ __html: `
        .swiper-button-next, .swiper-button-prev {
          color: #ffffff !important;
          filter: drop-shadow(0 0 4px rgba(0,0,0,0.4));
        }
        .swiper-button-next:after, .swiper-button-prev:after {
          font-size: 22px !important;
          font-weight: 900;
        }
        .swiper-pagination-bullet {
          background: #ffffff !important;
          opacity: 0.6;
          filter: drop-shadow(0 0 2px rgba(0,0,0,0.3));
        }
        .swiper-pagination-bullet-active {
          background: #ffffff !important;
          opacity: 1;
          width: 20px;
          border-radius: 4px;
          transition: all 0.3s;
        }
      ` }} />

      {/* 装饰背景球 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 h-64 w-64 animate-float-slow rounded-full bg-amber-200/20 blur-3xl" />
        <div className="absolute top-40 right-20 h-96 w-96 animate-float-medium rounded-full bg-orange-200/15 blur-3xl" />
        <div className="absolute bottom-20 left-1/3 h-80 w-80 animate-float-fast rounded-full bg-pink-200/20 blur-3xl" />
      </div>

      <div className="fixed top-0 left-0 right-0 z-50 p-4">
        <div className="container mx-auto flex items-center justify-between max-w-7xl">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-md text-amber-700 font-bold shadow-sm border border-white/50 transition-transform active:scale-95">
            <ArrowLeft className="h-5 w-5" /> 返回
          </button>
          <button onClick={handleShare} className="p-2.5 rounded-full bg-white/80 backdrop-blur-md text-amber-700 shadow-sm border border-white/50 transition-transform active:scale-95">
            <Share2 className="h-5 w-5" />
          </button>
        </div>
      </div>

      <main className="container mx-auto max-w-7xl px-4 pt-20 pb-20">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-12 items-start">
          
          {/* 左侧：照片滚动区域 */}
          <div className="w-full lg:w-1/2 lg:sticky lg:top-24">
            <div className="bg-white p-2 md:p-4 rounded-[32px] md:rounded-[40px] shadow-2xl border border-white relative">
              <div className="relative aspect-[4/5] md:aspect-square lg:aspect-[4/5] overflow-hidden rounded-[24px] md:rounded-[32px] bg-stone-100">
                {images.length > 0 ? (
                  <Swiper
                    key={`swiper-${images.length}`}
                    loop={images.length > 1}
                    modules={[Pagination, Navigation, Autoplay, EffectFade]}
                    pagination={{ clickable: true, dynamicBullets: true }}
                    navigation={true}
                    effect="fade"
                    fadeEffect={{ crossFade: true }}
                    autoplay={{ delay: 3500, disableOnInteraction: false }}
                    className="h-full w-full group"
                  >
                    {images.map((url: string, index: number) => (
                      <SwiperSlide key={`${url}-${index}`}>
                        <img 
                          src={url} 
                          alt={`${animal.name}-${index}`} 
                          className="h-full w-full object-cover" 
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-stone-200">
                    <PawPrint className="h-12 w-12 text-stone-300 opacity-30" />
                  </div>
                )}
                <div className="absolute top-4 left-4 z-10">
                  <span className="inline-flex items-center gap-2 rounded-full bg-black/30 backdrop-blur-md px-4 py-1.5 text-xs font-bold text-white border border-white/10">
                    {animal.type === 'cat' ? '🐱 猫咪档案' : '🐶 狗狗档案'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 右侧：详情内容区域 */}
          <div className="w-full lg:w-1/2 flex flex-col gap-6">
            <div className="bg-white/70 backdrop-blur-xl rounded-[32px] md:rounded-[40px] p-6 md:p-10 shadow-xl border border-white/50">
              
              <div className="mb-6 lg:mb-8 text-center lg:text-left">
                <h1 className="text-4xl md:text-6xl font-black text-stone-800 mb-2">{animal.name}</h1>
                {animal.breed && (
                  <span className="px-4 py-1 rounded-full bg-orange-100 text-orange-700 text-sm md:text-lg font-bold">
                    {animal.breed}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2 md:gap-4 mb-8 md:mb-10">
                {[
                  { icon: MapPin, color: 'bg-amber-500', label: '地点', value: animal.location },
                  { icon: School, color: 'bg-orange-500', label: '校区', value: animal.school },
                  { icon: Calendar, color: 'bg-pink-500', label: '日期', value: new Date(animal.created_at).toLocaleDateString('zh-CN', {month: 'numeric', day: 'numeric'}) }
                ].map((item, idx) => (
                  <div key={idx} className="bg-white/60 p-2 md:p-5 rounded-2xl border border-white shadow-sm flex flex-col items-center md:items-start text-center md:text-left gap-1 md:gap-2 transition-colors hover:bg-white/80">
                    <div className={`w-7 h-7 md:w-10 md:h-10 rounded-lg md:rounded-2xl ${item.color} text-white flex items-center justify-center shadow-md`}>
                      <item.icon className="h-4 w-4 md:h-5 md:w-5" />
                    </div>
                    <div className="w-full overflow-hidden">
                      <p className="text-[8px] md:text-[10px] font-black text-stone-400 uppercase tracking-tighter mb-0.5">{item.label}</p>
                      <p className="text-[10px] md:text-base text-stone-800 font-bold truncate leading-tight">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* 互动统计 */}
              <div className="mb-8 md:mb-10 bg-white/40 rounded-[28px] p-4 md:p-6 border border-white/60 shadow-inner">
                <h2 className="text-[10px] md:text-xs font-black text-stone-400 uppercase tracking-widest mb-4 text-center">互动统计</h2>
                <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => handleAction('like')} 
                    className={`flex flex-col items-center gap-2 p-4 rounded-[24px] transition-all active:scale-95 border-2 ${isLiked ? 'bg-rose-50 border-rose-200' : 'bg-white/80 border-transparent shadow-sm'}`}>
                    <Heart className={`h-8 w-8 md:h-10 md:w-10 ${isLiked ? 'fill-rose-500 text-rose-500 animate-pulse' : 'text-stone-200'}`} />
                    <div className="text-center">
                      <p className="text-2xl font-black text-stone-800">{localLikes}</p>
                      <p className={`text-[10px] font-bold ${isLiked ? 'text-rose-600' : 'text-stone-400'}`}>摸摸它</p>
                    </div>
                  </button>
                  <button onClick={() => handleAction('attack')} 
                    className={`flex flex-col items-center gap-2 p-4 rounded-[24px] transition-all active:scale-95 border-2 ${isAttacked ? 'bg-blue-50 border-blue-200' : 'bg-white/80 border-transparent shadow-sm'}`}>
                    <span className={`text-3xl md:text-4xl ${isAttacked ? '' : 'grayscale'}`}>😭</span>
                    <div className="text-center">
                      <p className="text-2xl font-black text-stone-800">{localAttacks}</p>
                      <p className={`text-[10px] font-bold ${isAttacked ? 'text-blue-600' : 'text-stone-400'}`}>被凶了</p>
                    </div>
                  </button>
                </div>
              </div>

              <div className="pt-8 border-t border-stone-100">
                <CommentSection animalId={animal.id} />
              </div>
            </div>
          </div>
        </div>
      </main>

      <button onClick={() => user ? navigate('/profile') : navigate('/auth')}
        className="fixed bottom-6 left-6 md:bottom-8 md:left-8 z-40 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 p-4 text-white shadow-2xl transition-all hover:scale-110 active:scale-90">
        <User className="h-6 w-6" />
      </button>
    </div>
  );
}