import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, PawPrint, Filter, ArrowUp, User } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Animal } from '@/lib/types';
import { AnimalCard } from './animal-card';
import { SubmissionForm } from './submission-form';
import { useAuth } from '@/contexts/auth-context';
import { toast } from 'sonner';

export function HomePage() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [filteredAnimals, setFilteredAnimals] = useState<Animal[]>([]);
  const [displayedAnimals, setDisplayedAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'cat' | 'dog'>('all');
  const [selectedSchool, setSelectedSchool] = useState<string>('all');
  const [schools, setSchools] = useState<string[]>([]);
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 15;

  // 加载动物数据
  useEffect(() => {
    loadAnimals();

    // 实时订阅数据更新
    const subscription = supabase
      .channel('animals_channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'animals',
        },
        () => {
          loadAnimals();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // 筛选逻辑
  useEffect(() => {
    let filtered = animals;

    // 按类型筛选
    if (selectedType !== 'all') {
      filtered = filtered.filter((animal) => animal.type === selectedType);
    }

    // 按学校筛选
    if (selectedSchool !== 'all') {
      filtered = filtered.filter((animal) => animal.school === selectedSchool);
    }

    // 搜索筛选
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (animal) =>
          animal.name.toLowerCase().includes(query) ||
          animal.location.toLowerCase().includes(query) ||
          animal.personality.toLowerCase().includes(query) ||
          (animal.breed && animal.breed.toLowerCase().includes(query))
      );
    }

    setFilteredAnimals(filtered);
    // 筛选条件改变时重置到第一页
    setCurrentPage(1);
  }, [animals, selectedType, selectedSchool, searchQuery]);

  const loadAnimals = async () => {
    try {
      const { data, error } = await supabase
        .from('animals')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setAnimals(data || []);

      // 提取学校列表
      const uniqueSchools = [
        ...new Set(data?.map((animal) => animal.school) || []),
      ];
      setSchools(uniqueSchools);
    } catch (error: any) {
      console.error('加载数据失败:', error);
      toast.error('加载数据失败，请刷新页面');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (id: string) => {
    try {
      const animal = animals.find((a) => a.id === id);
      if (!animal) return;

      const { error } = await supabase
        .from('animals')
        .update({ likes: animal.likes + 1 })
        .eq('id', id);

      if (error) throw error;

      // 更新本地状态
      setAnimals((prev) =>
        prev.map((a) => (a.id === id ? { ...a, likes: a.likes + 1 } : a))
      );
    } catch (error: any) {
      console.error('点赞失败:', error);
      toast.error('点赞失败');
    }
  };

  // 分页逻辑
  useEffect(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    setDisplayedAnimals(filteredAnimals.slice(start, end));
  }, [filteredAnimals, currentPage]);

  // 滚动监听
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAnimalClick = (animal: Animal) => {
    navigate(`/animal/${animal.id}`);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-amber-50">
      {/* 动态背景 */}
      <div className="fixed inset-0 -z-10">
        {/* 渐变底色 */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-pink-50" />
        
        {/* 漂浮圆形装饰 */}
        <div className="absolute top-20 left-10 h-64 w-64 animate-float-slow rounded-full bg-amber-200/30 blur-3xl" />
        <div className="absolute top-40 right-20 h-96 w-96 animate-float-medium rounded-full bg-orange-200/20 blur-3xl" />
        <div className="absolute bottom-20 left-1/3 h-80 w-80 animate-float-fast rounded-full bg-pink-200/25 blur-3xl" />
        <div className="absolute bottom-40 right-1/4 h-72 w-72 animate-float-slow rounded-full bg-amber-300/20 blur-3xl" />
      </div>

      {/* 头部 - 居中，透明背景 */}
      <header className="border-b border-amber-100/50 bg-transparent">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 p-3 shadow-lg">
              <PawPrint className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-stone-800 sm:text-4xl">
                校园动物档案馆
              </h1>
              <p className="mt-1 text-sm text-stone-600">
                记录每一只可爱的校园小精灵 🐾
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* 主内容 */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* 筛选栏 */}
        <div className="mb-8 rounded-2xl bg-white/80 backdrop-blur-sm p-6 shadow-lg">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-stone-700">
              <Filter className="h-5 w-5" />
              <span className="font-semibold">筛选条件</span>
            </div>
            <button
              onClick={() => setShowSubmissionForm(true)}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2 text-sm font-medium text-white shadow-lg transition-all hover:shadow-xl"
            >
              <Plus className="h-4 w-4" />
              投稿萌宠
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* 搜索框 */}
            <div className="relative sm:col-span-2 lg:col-span-1">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索名字、地点、性格..."
                className="w-full rounded-xl border border-stone-300 bg-white py-3 pl-12 pr-4 text-stone-800 placeholder:text-stone-400 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
              />
            </div>

            {/* 类型筛选 */}
            <select
              value={selectedType}
              onChange={(e) =>
                setSelectedType(e.target.value as 'all' | 'cat' | 'dog')
              }
              className="rounded-xl border border-stone-300 bg-white px-4 py-3 text-amber-600 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100 cursor-pointer transition-all hover:border-amber-300 hover:shadow-sm font-medium"
            >
              <option value="all" style={{ color: '#d97706' }}>🌟 全部类型</option>
              <option value="cat" style={{ color: '#d97706' }}>🐱 猫咪</option>
              <option value="dog" style={{ color: '#d97706' }}>🐶 狗狗</option>
            </select>

            {/* 学校筛选 */}
            <select
              value={selectedSchool}
              onChange={(e) => setSelectedSchool(e.target.value)}
              className="rounded-xl border border-stone-300 bg-white px-4 py-3 text-amber-600 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100 cursor-pointer transition-all hover:border-amber-300 hover:shadow-sm font-medium"
            >
              <option value="all" style={{ color: '#d97706' }}>🏫 全部学校</option>
              {schools.map((school) => (
                <option key={school} value={school} style={{ color: '#d97706' }}>
                  {school}
                </option>
              ))}
            </select>
          </div>

          {/* 结果统计 */}
          <div className="mt-4 text-sm text-stone-600">
            找到 <span className="font-semibold text-amber-600">{filteredAnimals.length}</span> 只萌宠
          </div>
        </div>

        {/* 动物卡片网格 */}
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-amber-200 border-t-amber-600" />
          </div>
        ) : filteredAnimals.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl bg-white/80 backdrop-blur-sm p-12 text-center shadow-lg">
            <div className="mb-4 text-6xl">🐾</div>
            <h3 className="mb-2 text-xl font-semibold text-stone-800">
              暂无萌宠
            </h3>
            <p className="text-stone-600">
              {searchQuery || selectedType !== 'all' || selectedSchool !== 'all'
                ? '试试调整筛选条件'
                : '快来投稿第一只萌宠吧！'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
            {displayedAnimals.map((animal) => (
              <AnimalCard
                key={animal.id}
                animal={animal}
                onClick={() => handleAnimalClick(animal)}
                onLike={handleLike}
              />
            ))}
          </div>
        )}

        {/* 分页 */}
        {filteredAnimals.length > ITEMS_PER_PAGE && (
          <div className="mt-12 flex flex-col items-center gap-4">
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="rounded-full bg-white/90 px-6 py-3 font-medium text-stone-700 shadow-md transition-all hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed backdrop-blur-sm"
              >
                ← 上一页
              </button>
              <div className="rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-3 font-bold text-white shadow-lg">
                第 {currentPage} 页
              </div>
              <button
                onClick={() => setCurrentPage((prev) => prev + 1)}
                disabled={currentPage * ITEMS_PER_PAGE >= filteredAnimals.length}
                className="rounded-full bg-white/90 px-6 py-3 font-medium text-stone-700 shadow-md transition-all hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed backdrop-blur-sm"
              >
                下一页 →
              </button>
            </div>
            
            {/* 页面统计信息 */}
            <div className="rounded-full bg-white/80 backdrop-blur-sm px-6 py-2 shadow-md">
              <span className="text-sm text-stone-600">
                第 <span className="font-bold text-amber-600">{currentPage}</span> 页 
                / 共 <span className="font-bold text-amber-600">{Math.ceil(filteredAnimals.length / ITEMS_PER_PAGE)}</span> 页 
                · 共 <span className="font-bold text-amber-600">{filteredAnimals.length}</span> 只萌宠
              </span>
            </div>
          </div>
        )}
        
        {/* 底部温馨提示 */}
        <div className="mt-16 mb-8 text-center">
          <div className="inline-flex items-center gap-2 text-stone-500 mb-4">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-300" />
            <span className="text-2xl">🐾</span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-300" />
          </div>
          <div className="max-w-2xl mx-auto space-y-2">
            <p className="text-stone-700 font-medium text-lg">
              每一只小动物都是校园的温暖陪伴 💛
            </p>
            <p className="text-stone-600 text-sm">
              请文明爱护，适度投喂，让我们共同守护这些可爱的小生命
            </p>
            <p className="text-stone-500 text-xs mt-4">
              校园动物档案馆 · Campus Zoo
            </p>
          </div>
        </div>
      </main>

      {/* 投稿表单 */}
      {showSubmissionForm && (
        <SubmissionForm
          onClose={() => setShowSubmissionForm(false)}
          onSuccess={loadAnimals}
        />
      )}

      {/* 回到顶部按钮 */}
      {showScrollTop && (
        <button
          onClick={handleScrollTop}
          className="fixed bottom-8 right-8 z-40 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 p-4 text-white shadow-2xl transition-all hover:scale-110 hover:shadow-xl animate-bounce-subtle"
          aria-label="回到顶部"
        >
          <ArrowUp className="h-6 w-6" />
        </button>
      )}

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