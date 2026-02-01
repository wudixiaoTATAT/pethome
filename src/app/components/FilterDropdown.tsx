import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, PawPrint, Filter, ArrowUp, User, MapPin } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Animal } from '@/lib/types';
import { AnimalCard } from './animal-card';
import { SubmissionForm } from './submission-form';
import { FilterDropdown } from './filter-dropdown'; // 确保路径正确
import { useAuth } from '@/contexts/auth-context';
import { toast } from 'sonner';

export function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [types, setTypes] = useState<string[]>([]);
  const [selectedSchool, setSelectedSchool] = useState<string>('all');
  const [schools, setSchools] = useState<string[]>([]);
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const ITEMS_PER_PAGE = 15;

  // 获取所有分类信息（用于填充下拉框，解决选项消失问题）
  const loadFilters = async () => {
    try {
      const { data } = await supabase.from('animals').select('type, school');
      if (data) {
        setTypes([...new Set(data.map((animal) => animal.type))]);
        setSchools([...new Set(data.map((animal) => animal.school))]);
      }
    } catch (error) {
      console.error('加载筛选条件失败');
    }
  };

  // 后端分页加载（解决排序与性能问题）
  const loadAnimals = async () => {
    setLoading(true);
    try {
      const from = (currentPage - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      let query = supabase.from('animals').select('*', { count: 'exact' });

      if (selectedType !== 'all') query = query.eq('type', selectedType);
      if (selectedSchool !== 'all') query = query.eq('school', selectedSchool);
      if (searchQuery.trim()) {
        query = query.or(`name.ilike.%${searchQuery}%,location.ilike.%${searchQuery}%`);
      }

      const { data, error, count } = await query
        .order('hot_score', { ascending: false })
        .range(from, to);

      if (error) throw error;
      setAnimals(data || []);
      if (count !== null) setTotalPages(Math.ceil(count / ITEMS_PER_PAGE));
    } catch (error: any) {
      toast.error('加载数据失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadFilters(); }, []);
  useEffect(() => { loadAnimals(); }, [currentPage, selectedType, selectedSchool, searchQuery]);
  useEffect(() => { setCurrentPage(1); }, [selectedType, selectedSchool, searchQuery]);

  // 实时订阅
  useEffect(() => {
    const subscription = supabase
      .channel('animals_channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'animals' }, () => loadAnimals())
      .subscribe();
    return () => { subscription.unsubscribe(); };
  }, [currentPage]);

  const handleAction = async (id: string, type: 'like' | 'attack') => {
    if (!user) {
      toast.error('请先登录后再操作 🐾');
      return;
    }
    try {
      const { data, error } = await supabase.rpc('perform_user_action', {
        p_animal_id: id,
        p_action_type: type
      });
      if (error) throw error;
      if (data.success) {
        if (data.action === 'added') toast.success(type === 'like' ? '点赞成功' : '攻击成功');
        else toast.info('已取消操作');
      }
    } catch (err: any) {
      toast.error('操作失败');
    }
  };

  // 格式化下拉框选项
  const typeOptions = [
    { value: 'all', label: '全部类型', emoji: '🌟' },
    ...types.map(t => ({ value: t, label: t, emoji: '🐾' }))
  ];

  const schoolOptions = [
    { value: 'all', label: '全部学校', emoji: '🏫' },
    ...schools.map(s => ({ value: s, label: s }))
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-amber-50">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-pink-50" />
        <div className="absolute top-20 left-10 h-64 w-64 animate-float-slow rounded-full bg-amber-200/30 blur-3xl" />
        <div className="absolute top-40 right-20 h-96 w-96 animate-float-medium rounded-full bg-orange-200/20 blur-3xl" />
        <div className="absolute bottom-20 left-1/3 h-80 w-80 animate-float-fast rounded-full bg-pink-200/25 blur-3xl" />
      </div>

      <header className="border-b border-amber-100/50 bg-transparent py-8 text-center">
        <div className="inline-block rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 p-3 shadow-lg mb-3">
          <PawPrint className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-stone-800 sm:text-4xl">校园动物档案馆</h1>
        <p className="mt-1 text-sm text-stone-600">记录每一只可爱的校园小精灵 🐾</p>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* 筛选工具栏 */}
        <div className="mb-8 rounded-3xl bg-white/80 backdrop-blur-md p-6 shadow-xl border border-white/20">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2 text-stone-700">
              <Filter className="h-5 w-5 text-amber-500" />
              <span className="font-bold text-lg">发现精灵</span>
            </div>
            <button onClick={() => setShowSubmissionForm(true)} className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 px-6 py-3 text-sm font-bold text-white shadow-lg transition-transform hover:scale-105 active:scale-95">
              <Plus className="h-5 w-5" /> 投稿萌宠
            </button>
          </div>

          <div className="flex flex-wrap gap-4 items-center">
            {/* 搜索框 */}
            <div className="relative flex-1 min-w-[280px]">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400" />
              <input 
                type="text" 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
                placeholder="搜索精灵名字、出没地点..." 
                className="w-full rounded-2xl border-2 border-stone-100 bg-white/50 py-3 pl-12 pr-4 focus:border-amber-400 focus:bg-white focus:outline-none transition-all shadow-inner" 
              />
            </div>

            {/* 新的下拉组件 */}
            <FilterDropdown 
              icon={<PawPrint className="w-5 h-5" />}
              label="类型"
              options={typeOptions}
              selectedValue={selectedType}
              onSelect={setSelectedType}
            />

            <FilterDropdown 
              icon={<MapPin className="w-5 h-5" />}
              label="校区"
              options={schoolOptions}
              selectedValue={selectedSchool}
              onSelect={setSelectedSchool}
            />
          </div>
        </div>

        {/* 列表显示 */}
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-amber-200 border-t-amber-600" />
          </div>
        ) : animals.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
            {animals.map((animal) => (
              <AnimalCard
                key={animal.id}
                animal={animal}
                onClick={() => navigate(`/animal/${animal.id}`)}
                onLike={() => handleAction(animal.id, 'like')}
                onAttack={() => handleAction(animal.id, 'attack')}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-white/40 rounded-3xl border-2 border-dashed border-amber-200">
            <Search className="h-12 w-12 text-amber-300 mb-4" />
            <h3 className="text-xl font-bold text-stone-700">空空如也</h3>
            <p className="text-stone-500 mt-2">换个词搜搜，或者尝试重置筛选条件</p>
            <button 
              onClick={() => { setSearchQuery(''); setSelectedType('all'); setSelectedSchool('all'); }}
              className="mt-6 px-8 py-3 bg-white text-amber-600 border-2 border-amber-500 rounded-2xl font-bold hover:bg-amber-500 hover:text-white transition-all"
            >
              重置所有条件
            </button>
          </div>
        )}

        {/* 分页组件 */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center gap-4">
            <button 
              onClick={() => { setCurrentPage(p => Math.max(p-1, 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
              disabled={currentPage === 1} 
              className="rounded-2xl bg-white px-6 py-3 shadow-md disabled:opacity-30 font-bold text-stone-600 hover:bg-amber-50 transition-colors"
            >
              ← 上一页
            </button>
            <div className="rounded-2xl bg-stone-800 px-6 py-3 font-bold text-white shadow-lg">
              {currentPage} / {totalPages}
            </div>
            <button 
              onClick={() => { setCurrentPage(p => Math.min(p+1, totalPages)); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
              disabled={currentPage >= totalPages} 
              className="rounded-2xl bg-white px-6 py-3 shadow-md disabled:opacity-30 font-bold text-stone-600 hover:bg-amber-50 transition-colors"
            >
              下一页 →
            </button>
          </div>
        )}
      </main>

      {/* 悬浮按钮 */}
      {showScrollTop && (
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="fixed bottom-8 right-8 z-40 rounded-full bg-amber-500 p-4 text-white shadow-2xl hover:scale-110 transition-transform">
          <ArrowUp className="h-6 w-6" />
        </button>
      )}

      <button onClick={() => user ? navigate('/profile') : navigate('/auth')} className="fixed bottom-8 left-8 z-40 rounded-full bg-amber-500 p-4 text-white shadow-2xl hover:scale-110 transition-transform">
        <User className="h-6 w-6" />
      </button>

      {showSubmissionForm && <SubmissionForm onClose={() => setShowSubmissionForm(false)} onSuccess={loadAnimals} />}
    </div>
  );
}