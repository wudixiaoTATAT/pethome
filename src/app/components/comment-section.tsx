import { useState, useEffect } from 'react';
import { MessageCircle, Send, User, ThumbsUp, Clock, Flame, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/auth-context';
import { toast } from 'sonner';

interface Comment {
  id: string;
  animal_id: string;
  user_name: string;
  content: string;
  created_at: string;
  user_id: string | null;
  likes: number;
  is_liked?: boolean;
}

interface CommentSectionProps {
  animalId: string;
}

export function CommentSection({ animalId }: CommentSectionProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [sortBy, setSortBy] = useState<'latest' | 'hot'>('latest');
  const [content, setContent] = useState('');
  // 新增：记录用户今日是否已评论
  const [hasCommentedToday, setHasCommentedToday] = useState(false);

  const getDisplayName = () => {
    return user?.user_metadata?.username || user?.user_metadata?.full_name || user?.email?.split('@')[0] || '神秘游客';
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    if (diff < 60000) return '刚刚';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`;
    return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
  };

  const loadComments = async () => {
    try {
      let query = supabase
        .from('comments')
        .select('*, comment_likes!left(user_id)')
        .eq('animal_id', animalId)
        .limit(15);

      if (sortBy === 'hot') {
        query = query.order('likes', { ascending: false }).order('created_at', { ascending: false });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query;
      if (error) throw error;

      const processedData = (data as any[]).map(c => ({
        ...c,
        is_liked: c.comment_likes?.some((l: any) => l.user_id === user?.id)
      }));

      setComments(processedData);

      // 核心检查：判断当前用户在过去24小时内是否评价过
      if (user) {
        const todayComment = processedData.find(c => 
          c.user_id === user.id && 
          (new Date().getTime() - new Date(c.created_at).getTime()) < 24 * 60 * 60 * 1000
        );
        setHasCommentedToday(!!todayComment);
      }
    } catch (error: any) {
      console.error('加载失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!animalId) return;
    loadComments();

    const channel = supabase.channel(`comments_${animalId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'comments', filter: `animal_id=eq.${animalId}` }, () => {
        loadComments();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [animalId, sortBy, user?.id]);

  const handleLike = async (commentId: string) => {
    if (!user) return toast.error('请先登录再点赞');
    setComments(prev => prev.map(c => {
      if (c.id === commentId) {
        const currentlyLiked = c.is_liked;
        return { ...c, is_liked: !currentlyLiked, likes: currentlyLiked ? Math.max(0, c.likes - 1) : (c.likes || 0) + 1 };
      }
      return c;
    }));
    try {
      await supabase.rpc('toggle_comment_like', { target_comment_id: commentId, target_user_id: user.id });
    } catch (err) {
      loadComments();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || hasCommentedToday) return;
    if (!content.trim()) return;

    setSubmitting(true);
    try {
      const { error } = await supabase.from('comments').insert({
        animal_id: animalId,
        user_id: user.id,
        user_name: getDisplayName(),
        content: content.trim(),
        likes: 0
      });

      if (error) {
        // 如果触发器拦截了，显示后端返回的提示
        if (error.message.includes('每天只能')) {
          toast.error(error.message);
        } else {
          throw error;
        }
        return;
      }

      toast.success('发表成功！');
      setContent('');
      loadComments();
    } catch (err) {
      toast.error('发表失败，请稍后再试');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-3xl bg-white p-6 md:p-8 shadow-xl border border-amber-100/50">
      {/* 头部展示 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-100 rounded-xl"><MessageCircle className="h-6 w-6 text-amber-600" /></div>
          <div>
            <h3 className="text-xl font-bold text-stone-800">精灵留言板</h3>
            <p className="text-xs text-stone-400">每位精灵每天限留言一次 🐾</p>
          </div>
        </div>

        <div className="flex bg-stone-100 p-1 rounded-xl w-full sm:w-auto">
          <button type="button" onClick={() => setSortBy('latest')} className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${sortBy === 'latest' ? 'bg-white text-amber-600 shadow-sm' : 'text-stone-500'}`}><Clock className="h-4 w-4" /> 最新</button>
          <button type="button" onClick={() => setSortBy('hot')} className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${sortBy === 'hot' ? 'bg-white text-amber-600 shadow-sm' : 'text-stone-500'}`}><Flame className="h-4 w-4" /> 最热</button>
        </div>
      </div>

      {/* 发表区：增加禁用状态提示 */}
      <form onSubmit={handleSubmit} className="mb-10">
        <div className="mb-2 px-1 flex justify-between items-center">
          <span className="text-[11px] font-bold text-stone-400 uppercase tracking-widest">
            {user ? (<>正在以 <span className="text-amber-600">@{getDisplayName()}</span> 发言</>) : '请先登录'}
          </span>
          {hasCommentedToday && (
            <span className="flex items-center gap-1 text-[10px] text-rose-500 font-bold">
              <AlertCircle className="h-3 w-3" /> 今日已达上限
            </span>
          )}
        </div>
        <div className="relative group">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={
              !user ? "登录后开启留言功能..." : 
              hasCommentedToday ? "今天已经分享过故事了，明天再来吧 🐾" : 
              "写下你和它的温馨瞬间..."
            }
            disabled={!user || submitting || hasCommentedToday}
            rows={3}
            className={`w-full rounded-2xl border-2 p-4 pr-16 transition-all resize-none shadow-inner ${
              hasCommentedToday 
              ? 'bg-stone-100 border-stone-200 text-stone-400 cursor-not-allowed' 
              : 'bg-stone-50/50 border-stone-100 focus:border-amber-400 focus:bg-white text-stone-700'
            }`}
          />
          <button
            type="submit"
            disabled={!user || !content.trim() || submitting || hasCommentedToday}
            className="absolute bottom-3 right-3 p-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg disabled:opacity-30 disabled:grayscale transition-all active:scale-90"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </form>

      {/* 评论列表 */}
      <div className="space-y-5">
        {loading ? (
          <div className="flex justify-center py-10"><div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-100 border-t-amber-500" /></div>
        ) : comments.length === 0 ? (
          <div className="text-center py-12 text-stone-400 italic bg-stone-50 rounded-2xl border-dashed border-2 border-stone-100">暂无留言 🐾</div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="p-5 rounded-2xl border border-stone-100 bg-white hover:border-amber-200 hover:shadow-md transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-amber-100 to-orange-100 flex items-center justify-center text-amber-700 font-bold border border-amber-200">
                    {comment.user_name?.[0] || '匿'}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-stone-800 mb-1">{comment.user_name}</p>
                    <div className="flex items-center gap-1 text-[10px] text-stone-400 font-semibold"><Clock className="h-3 w-3" /><span>{formatDate(comment.created_at)}</span></div>
                  </div>
                </div>
                <button type="button" onClick={() => handleLike(comment.id)} className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition-all border shadow-sm ${comment.is_liked ? 'bg-rose-50 text-rose-500 border-rose-200' : 'bg-stone-50 text-stone-400 border-transparent hover:bg-stone-100'}`}><ThumbsUp className={`h-3.5 w-3.5 ${comment.is_liked ? 'fill-current' : ''}`} /><span className="text-xs font-bold">{comment.likes || 0}</span></button>
              </div>
              <p className="text-stone-700 text-[15px] leading-relaxed pl-1 whitespace-pre-wrap">{comment.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}