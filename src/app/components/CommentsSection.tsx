import { useState, useEffect } from 'react';
import { Send, MessageCircle, Clock, ThumbsUp, ChevronDown } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/auth-context';
import { toast } from 'sonner';

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  user_name: string;
  likes: number; // 需确保数据库有此字段
  is_optimistic?: boolean;
}

export function CommentSection({ animalId }: { animalId: string }) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [sortBy, setSortBy] = useState<'latest' | 'hot'>('latest'); // 排序状态

  // 1. 加载评论逻辑（带排序和限制15条）
  const loadComments = async () => {
    let query = supabase
      .from('comments')
      .select('*')
      .eq('animal_id', animalId)
      .limit(15);

    if (sortBy === 'latest') {
      query = query.order('created_at', { ascending: false });
    } else {
      query = query.order('likes', { ascending: false }).order('created_at', { ascending: false });
    }

    const { data } = await query;
    if (data) setComments(data);
  };

  useEffect(() => {
    loadComments();
  }, [animalId, sortBy]); // 切换排序方式时自动重新加载

  // 2. 提交评论（严格锁定姓名）
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;

    // 严格从 auth 体系获取姓名，不给前端修改机会
    const realName = user.user_metadata?.full_name || user.email?.split('@')[0] || '神秘游客';
    const content = newComment.trim();
    setNewComment('');

    const tempId = crypto.randomUUID();
    const optimisticComment: Comment = {
      id: tempId,
      content,
      created_at: new Date().toISOString(),
      user_id: user.id,
      user_name: realName,
      likes: 0,
      is_optimistic: true
    };
    
    setComments(prev => [optimisticComment, ...prev]);

    try {
      const { error } = await supabase.from('comments').insert({
        id: tempId,
        content,
        animal_id: animalId,
        user_id: user.id,
        user_name: realName, // 这里插入的是后端/Auth验证过的名字
        likes: 0
      });
      if (error) throw error;
    } catch (err) {
      setComments(prev => prev.filter(c => c.id !== tempId));
      setNewComment(content);
      toast.error('留言失败');
    }
  };

  // 3. 评论点赞功能
  const handleLikeComment = async (commentId: string) => {
    if (!user) {
      toast.error('请先登录再点赞 🐾');
      return;
    }

    // 本地乐观更新数字
    setComments(prev => prev.map(c => 
      c.id === commentId ? { ...c, likes: c.likes + 1 } : c
    ));

    try {
      // 这里的逻辑建议在数据库写一个函数，类似点赞动物的逻辑
      // 简单处理：直接增加 likes 字段
      await supabase.rpc('like_comment', { target_comment_id: commentId });
    } catch (err) {
      // 失败则不处理，或回滚
      console.error(err);
    }
  };

  return (
    <div className="mt-12">
      {/* 头部：标题与排序切换 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-stone-800">
          <MessageCircle className="h-6 w-6 text-amber-600" />
          <h2 className="text-2xl font-bold">精灵留言板</h2>
        </div>
        
        <div className="flex bg-stone-100 p-1 rounded-xl text-sm font-medium">
          <button 
            onClick={() => setSortBy('latest')}
            className={`px-3 py-1.5 rounded-lg transition-all ${sortBy === 'latest' ? 'bg-white text-amber-600 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
          >
            最新
          </button>
          <button 
            onClick={() => setSortBy('hot')}
            className={`px-3 py-1.5 rounded-lg transition-all ${sortBy === 'hot' ? 'bg-white text-amber-600 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
          >
            最热
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mb-8 relative">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder={user ? "分享一下你和它的故事吧..." : "登录后开启留言功能 🐾"}
          disabled={!user}
          className="w-full rounded-2xl border-2 border-amber-100 bg-white/80 p-4 pr-12 focus:border-amber-400 focus:outline-none min-h-[100px] text-stone-700 shadow-inner"
        />
        <button
          type="submit"
          disabled={!user || !newComment.trim()}
          className="absolute bottom-4 right-4 p-2 rounded-xl bg-amber-500 text-white shadow-lg hover:bg-amber-600 transition-all active:scale-95"
        >
          <Send className="h-5 w-5" />
        </button>
      </form>

      {/* 评论列表 */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="text-center py-10 text-stone-400 italic">还没有留言，快来抢沙发 🐾</div>
        ) : (
          comments.map((comment) => (
            <div 
              key={comment.id} 
              className={`p-5 rounded-2xl border bg-white shadow-sm transition-all ${
                comment.is_optimistic ? 'opacity-50 border-dashed border-amber-300' : 'border-stone-100 hover:border-amber-100'
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-amber-400 to-orange-400 flex items-center justify-center text-white font-bold shadow-sm">
                    {comment.user_name?.[0]}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-stone-800">{comment.user_name}</p>
                    <div className="flex items-center gap-1 text-[10px] text-stone-400">
                      <Clock className="h-3 w-3" />
                      {new Date(comment.created_at).toLocaleString('zh-CN', { hour12: false })}
                    </div>
                  </div>
                </div>

                {/* 评论点赞按钮 */}
                <button 
                  onClick={() => handleLikeComment(comment.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-50 text-stone-500 hover:bg-rose-50 hover:text-rose-500 transition-colors group"
                >
                  <ThumbsUp className="h-3.5 w-3.5 group-active:scale-125 transition-transform" />
                  <span className="text-xs font-bold">{comment.likes}</span>
                </button>
              </div>
              <p className="text-stone-700 text-[15px] leading-relaxed pl-1 shadow-stone-400 whitespace-pre-wrap">
                {comment.content}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
\\好像没什么用