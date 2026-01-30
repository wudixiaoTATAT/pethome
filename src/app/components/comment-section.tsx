import { useState, useEffect } from 'react';
import { MessageCircle, Send, User } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Comment } from '@/lib/types';
import { useAuth } from '@/contexts/auth-context';
import { toast } from 'sonner';

interface CommentSectionProps {
  animalId: string;
}

export function CommentSection({ animalId }: CommentSectionProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newComment, setNewComment] = useState({
    user_name: '',
    content: '',
  });

  // 加载评论
  useEffect(() => {
    loadComments();

    // 如果用户已登录，自动填充昵称
    if (user) {
      setNewComment(prev => ({
        ...prev,
        user_name: user.user_metadata?.username || user.email?.split('@')[0] || '',
      }));
    }

    // 实时订阅评论更新
    const subscription = supabase
      .channel(`comments:${animalId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'comments',
          filter: `animal_id=eq.${animalId}`,
        },
        () => {
          loadComments();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [animalId, user]);

  const loadComments = async () => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('animal_id', animalId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setComments(data || []);
    } catch (error: any) {
      console.error('加载评论失败:', error);
      toast.error('加载评论失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newComment.user_name.trim() || !newComment.content.trim()) {
      toast.error('请填写昵称和评论内容');
      return;
    }

    setSubmitting(true);

    try {
      const { error } = await supabase.from('comments').insert({
        animal_id: animalId,
        user_name: newComment.user_name.trim(),
        content: newComment.content.trim(),
        user_id: user?.id || null, // 添加 user_id
      });

      if (error) throw error;

      toast.success('评论成功！');
      setNewComment({ 
        user_name: user?.user_metadata?.username || user?.email?.split('@')[0] || '',
        content: '' 
      });
    } catch (error: any) {
      console.error('发表评论失败:', error);
      toast.error('发表评论失败，请重试');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    if (days < 7) return `${days}天前`;
    return date.toLocaleDateString('zh-CN');
  };

  return (
    <div className="rounded-3xl bg-white p-8 shadow-lg">
      {/* 标题 */}
      <div className="mb-6 flex items-center gap-3">
        <MessageCircle className="h-6 w-6 text-amber-600" />
        <h3 className="text-2xl font-bold text-stone-800">
          评论区 ({comments.length})
        </h3>
      </div>

      {/* 评论输入框 */}
      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <input
            type="text"
            value={newComment.user_name}
            onChange={(e) =>
              setNewComment({ ...newComment, user_name: e.target.value })
            }
            placeholder="您的昵称"
            className="rounded-xl border border-stone-300 bg-white px-4 py-3 text-stone-800 placeholder:text-stone-400 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
          />
        </div>

        <div className="relative">
          <textarea
            value={newComment.content}
            onChange={(e) =>
              setNewComment({ ...newComment, content: e.target.value })
            }
            placeholder="分享你对这只小可爱的看法..."
            rows={4}
            className="w-full resize-none rounded-xl border border-stone-300 bg-white px-4 py-3 text-stone-800 placeholder:text-stone-400 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-3 font-medium text-white shadow-lg transition-all hover:shadow-xl disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
            {submitting ? '发送中...' : '发表评论'}
          </button>
        </div>
      </form>

      {/* 评论列表 */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-200 border-t-amber-600" />
          </div>
        ) : comments.length === 0 ? (
          <div className="py-12 text-center text-stone-500">
            还没有评论，来抢沙发吧~ 🐾
          </div>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="rounded-xl border border-stone-200 bg-stone-50 p-6 transition-colors hover:bg-stone-100"
            >
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-white">
                  <User className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-stone-800">
                    {comment.user_name}
                  </div>
                  <div className="text-xs text-stone-500">
                    {formatDate(comment.created_at)}
                  </div>
                </div>
              </div>
              <p className="leading-relaxed text-stone-700">
                {comment.content}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}