import { useState, useEffect, useMemo } from 'react';
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
  const [totalPages, setTotalPages] = useState(1); // 新增：总页数状态
  const ITEMS_PER_PAGE = 15;

  // 1. 专门获取初始化的筛选列表（解决问题2：确保下拉框选项完整）
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

  // 2. 修改后的加载逻辑：支持后端分页、筛选和排序（解决问题1：依靠热度）
  const loadAnimals = async () => {
    setLoading(true);
    try {
      const from = (currentPage - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      // 构建查询语句
      let query = supabase
        .from('animals')
        .select('*', { count: 'exact' });

      // 后端筛选
      if (selectedType !== 'all') {
        query = query.eq('type', selectedType);
      }
      if (selectedSchool !== 'all') {
        query = query.eq('school', selectedSchool);
      }
      if (searchQuery.trim()) {
        // 简单的模糊搜索
        query = query.or(`name.ilike.%${searchQuery}%,location.ilike.%${searchQuery}%`);
      }

      // 核心排序与范围限制
      const { data, error, count } = await query
        .order('hot_score', { ascending: false }) // 严格按热度排序
        .range(from, to); // 只取当前页的15条

      if (error) throw error;

      setAnimals(data || []);
      if (count !== null) {
        setTotalPages(Math.ceil(count / ITEMS_PER_PAGE));
      }
    } catch (error: any) {
      toast.error('加载数据失败');
    } finally {
      setLoading(false);
    }
  };

  // 初始化加载筛选条件
  useEffect(() => {
    loadFilters();
  }, []);

  // 当分页或筛选条件改变时，重新从后端拉取数据
  useEffect(() => {
    loadAnimals();
  }, [currentPage, selectedType, selectedSchool, searchQuery]);

  // 当搜索或筛选改变时，重置页码到第一页
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedType, selectedSchool, searchQuery]);

  // 实时订阅逻辑（保持不变，但仅用于触发刷新）
  useEffect(() => {
    const subscription = supabase
      .channel('animals_channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'animals' }, () => loadAnimals())
      .subscribe();
    return () => { subscription.unsubscribe(); };
  }, [currentPage]); // 这里的依赖项需要注意

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

  const handleScrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-amber-50">
      {/* 动态背景 */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-pink-50" />
        <div className="absolute top-20 left-10 h-64 w-64 animate-float-slow rounded-full bg-amber-200/30 blur-3xl" />
        <div className="absolute top-40 right-20 h-96 w-96 animate-float-medium rounded-full bg-orange-200/20 blur-3xl" />
        <div className="absolute bottom-20 left-1/3 h-80 w-80 animate-float-fast rounded-full bg-pink-200/25 blur-3xl" />
        <div className="absolute bottom-40 right-1/4 h-72 w-72 animate-float-slow rounded-full bg-amber-300/20 blur-3xl" />
      </div>

      <header className="border-b border-amber-100/50 bg-transparent">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 text-center">
            <div className="inline-block rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 p-3 shadow-lg mb-3">
              <PawPrint className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-stone-800 sm:text-4xl">校园动物档案馆</h1>
            <p className="mt-1 text-sm text-stone-600">记录每一只可爱的校园小精灵 🐾</p>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 rounded-2xl bg-white/80 backdrop-blur-sm p-6 shadow-lg">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-stone-700">
              <Filter className="h-5 w-5" />
              <span className="font-semibold">筛选条件</span>
            </div>
            <button onClick={() => setShowSubmissionForm(true)} className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2 text-sm font-medium text-white shadow-lg">
              <Plus className="h-4 w-4" /> 投稿萌宠
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="relative sm:col-span-2 lg:col-span-1">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400" />
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="搜索名字、地点..." className="w-full rounded-xl border border-stone-300 bg-white py-3 pl-12 pr-4 focus:border-amber-400 focus:outline-none" />
            </div>
            <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} className="rounded-xl border border-stone-300 bg-white px-4 py-3 text-amber-600 font-medium">
              <option value="all">🌟 全部类型</option>
              {types.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <select value={selectedSchool} onChange={(e) => setSelectedSchool(e.target.value)} className="rounded-xl border border-stone-300 bg-white px-4 py-3 text-amber-600 font-medium">
              <option value="all">🏫 全部学校</option>
              {schools.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

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
          /* 空状态处理 */
          <div className="flex flex-col items-center justify-center py-20 bg-white/50 rounded-3xl border-2 border-dashed border-amber-200">
            <div className="bg-amber-100 p-4 rounded-full mb-4">
              <Search className="h-8 w-8 text-amber-500" />
            </div>
            <h3 className="text-xl font-bold text-stone-700">没有找到相关小动物</h3>
            <p className="text-stone-500 mt-2">换个搜索词或者筛选条件试试吧？</p>
            <button 
              onClick={() => { setSearchQuery(''); setSelectedType('all'); setSelectedSchool('all'); }}
              className="mt-6 px-6 py-2 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-colors"
            >
              重置筛选
            </button>
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-12 flex flex-col items-center gap-4">
            <div className="flex items-center gap-4">
              <button onClick={() => { setCurrentPage(p => Math.max(p-1, 1)); handleScrollTop(); }} disabled={currentPage === 1} className="rounded-full bg-white/90 px-6 py-3 shadow-md disabled:opacity-40 hover:bg-stone-50 transition-colors">← 上一页</button>
              <div className="rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-3 font-bold text-white shadow-lg">第 {currentPage} / {totalPages} 页</div>
              <button onClick={() => { setCurrentPage(p => Math.min(p+1, totalPages)); handleScrollTop(); }} disabled={currentPage >= totalPages} className="rounded-full bg-white/90 px-6 py-3 shadow-md disabled:opacity-40 hover:bg-stone-50 transition-colors">下一页 →</button>
            </div>
          </div>
        )}
      </main>

      <div className="mt-16 mb-8 text-center text-stone-500">
        <p className="text-lg font-medium text-stone-700">每一只小动物都是校园的温暖陪伴 💛</p>
      </div>

      {showSubmissionForm && <SubmissionForm onClose={() => setShowSubmissionForm(false)} onSuccess={loadAnimals} />}
      
      {showScrollTop && (
        <button onClick={handleScrollTop} className="fixed bottom-8 right-8 z-40 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 p-4 text-white shadow-2xl transition-all hover:scale-110">
          <ArrowUp className="h-6 w-6" />
        </button>
      )}

      <button onClick={() => user ? navigate('/profile') : navigate('/auth')} className="fixed bottom-8 left-8 z-40 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 p-4 text-white shadow-2xl transition-all hover:scale-110">
        <User className="h-6 w-6" />
      </button>
    </div>
  );
}