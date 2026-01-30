import { useState, useEffect } from 'react';
import { supabase, type Animal } from '@/lib/supabase';
import { AnimalCard } from '@/components/AnimalCard';
import { AnimalDetail } from '@/components/AnimalDetail';
import { AnimalSubmissionForm } from '@/components/AnimalSubmissionForm';
import { Search, Plus, Loader2, Filter } from 'lucide-react';
import Masonry from 'react-responsive-masonry';

export default function NewApp() {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [filteredAnimals, setFilteredAnimals] = useState<Animal[]>([]);
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'cat' | 'dog' | 'other'>('all');
  const [filterSchool, setFilterSchool] = useState<string>('all');

  // 加载动物数据
  useEffect(() => {
    loadAnimals();

    // 订阅实时更新
    const channel = supabase
      .channel('animals')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'animals'
        },
        (payload) => {
          console.log('Animal change:', payload);
          loadAnimals();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // 筛选逻辑
  useEffect(() => {
    let filtered = animals;

    // 搜索
    if (searchQuery.trim()) {
      filtered = filtered.filter(animal =>
        animal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        animal.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        animal.personality.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (animal.breed && animal.breed.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (animal.school && animal.school.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // 类型筛选
    if (filterType !== 'all') {
      filtered = filtered.filter(animal => animal.type === filterType);
    }

    // 学校筛选
    if (filterSchool !== 'all') {
      filtered = filtered.filter(animal => animal.school === filterSchool);
    }

    setFilteredAnimals(filtered);
  }, [animals, searchQuery, filterType, filterSchool]);

  const loadAnimals = async () => {
    try {
      const { data, error } = await supabase
        .from('animals')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setAnimals(data || []);
    } catch (err: any) {
      console.error('加载动物数据失败:', err);
      alert('加载数据失败，请刷新页面重试');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = async (animalId: string) => {
    try {
      const animal = animals.find(a => a.id === animalId);
      if (!animal) return;

      const { error } = await supabase
        .from('animals')
        .update({ likes: (animal.likes || 0) + 1 })
        .eq('id', animalId);

      if (error) throw error;

      // 更新本地状态
      setAnimals(prev => prev.map(a =>
        a.id === animalId ? { ...a, likes: (a.likes || 0) + 1 } : a
      ));

      if (selectedAnimal && selectedAnimal.id === animalId) {
        setSelectedAnimal({ ...selectedAnimal, likes: (selectedAnimal.likes || 0) + 1 });
      }
    } catch (err: any) {
      console.error('点赞失败:', err);
      alert('点赞失败，请重试');
    }
  };

  // 获取所有学校列表
  const schools = Array.from(new Set(animals.map(a => a.school).filter(Boolean))) as string[];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-yellow-50">
      {/* 装饰性背景 */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute top-20 left-10 text-6xl animate-float">🐾</div>
        <div className="absolute top-40 right-20 text-5xl animate-float-delayed">🐾</div>
        <div className="absolute bottom-32 left-1/4 text-4xl animate-float">🐾</div>
        <div className="absolute top-1/2 right-1/3 text-5xl animate-float-delayed">🐾</div>
        <div className="absolute bottom-20 right-10 text-6xl animate-float">🐾</div>
      </div>

      {/* 头部 */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-amber-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center mb-6">
            <h1 className="text-4xl sm:text-5xl font-bold mb-2 bg-gradient-to-r from-amber-700 via-amber-600 to-yellow-700 bg-clip-text text-transparent">
              🐾 校园动物档案馆
            </h1>
            <p className="text-muted-foreground">记录我们校园里的每一只小可爱</p>
          </div>

          {/* 搜索栏 */}
          <div className="max-w-3xl mx-auto mb-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="搜索动物名字、地点、性格..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-amber-200 rounded-2xl focus:outline-none focus:border-primary transition-all shadow-sm hover:shadow-md"
              />
            </div>
          </div>

          {/* 筛选和投稿按钮 */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3 flex-wrap">
              {/* 类型筛选 */}
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="px-4 py-2 border-2 border-amber-200 rounded-xl focus:outline-none focus:border-primary transition-colors bg-white"
              >
                <option value="all">全部类型</option>
                <option value="cat">🐱 猫咪</option>
                <option value="dog">🐶 狗狗</option>
                <option value="other">🦢 其他</option>
              </select>

              {/* 学校筛选 */}
              {schools.length > 0 && (
                <select
                  value={filterSchool}
                  onChange={(e) => setFilterSchool(e.target.value)}
                  className="px-4 py-2 border-2 border-amber-200 rounded-xl focus:outline-none focus:border-primary transition-colors bg-white"
                >
                  <option value="all">全部学校</option>
                  {schools.map(school => (
                    <option key={school} value={school}>{school}</option>
                  ))}
                </select>
              )}

              <div className="text-sm text-muted-foreground flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                找到 <span className="font-medium text-primary">{filteredAnimals.length}</span> 只萌宠
              </div>
            </div>

            {/* 投稿按钮 */}
            <button
              onClick={() => setShowSubmissionForm(true)}
              className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-xl hover:from-amber-600 hover:to-yellow-600 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 font-medium"
            >
              <Plus className="w-5 h-5" />
              投稿萌宠
            </button>
          </div>
        </div>
      </header>

      {/* 主内容 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
        {isLoading ? (
          <div className="text-center py-20">
            <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary mb-4" />
            <p className="text-muted-foreground">加载中...</p>
          </div>
        ) : filteredAnimals.length === 0 ? (
          <div className="text-center py-20 bg-white/50 rounded-3xl backdrop-blur-sm">
            <div className="text-6xl mb-4">😿</div>
            <p className="text-xl text-muted-foreground mb-4">没有找到相关的萌宠</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setFilterType('all');
                setFilterSchool('all');
              }}
              className="px-6 py-2 border-2 border-primary text-primary rounded-xl hover:bg-primary hover:text-white transition-colors"
            >
              清除筛选
            </button>
          </div>
        ) : (
          <Masonry columnsCount={window.innerWidth < 640 ? 2 : window.innerWidth < 1024 ? 3 : 4} gutter="1.5rem">
            {filteredAnimals.map(animal => (
              <AnimalCard
                key={animal.id}
                animal={animal}
                onClick={() => setSelectedAnimal(animal)}
              />
            ))}
          </Masonry>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-20 py-8 border-t border-amber-200 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-muted-foreground">
          <p className="flex items-center justify-center gap-2">
            用爱记录校园里的每一只毛孩子
            <span className="inline-block animate-bounce">🐾</span>
          </p>
        </div>
      </footer>

      {/* 动物详情模态框 */}
      {selectedAnimal && (
        <AnimalDetail
          animal={selectedAnimal}
          onClose={() => setSelectedAnimal(null)}
          onLike={() => handleLike(selectedAnimal.id)}
        />
      )}

      {/* 投稿表单模态框 */}
      {showSubmissionForm && (
        <AnimalSubmissionForm
          onClose={() => setShowSubmissionForm(false)}
          onSuccess={loadAnimals}
        />
      )}

      {/* CSS 动画 */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float 6s ease-in-out 3s infinite;
        }
      `}</style>
    </div>
  );
}
