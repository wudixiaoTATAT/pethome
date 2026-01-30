import { useState, useEffect } from 'react';
import { supabase, type Comment as CommentType } from '@/lib/supabase';
import { MessageCircle, Send, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface CommentSectionProps {
  animalId: string;
}

export function CommentSection({ animalId }: CommentSectionProps) {
  const [comments, setComments] = useState<CommentType[]>([]);
  const [newComment, setNewComment] = useState({ userName: '', content: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // 加载评论
  useEffect(() => {
    loadComments();

    // 订阅实时更新
    const channel = supabase
      .channel(`comments:${animalId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'comments',
          filter: `animal_id=eq.${animalId}`
        },
        (payload) => {
          console.log('Comment change:', payload);
          loadComments(); // 重新加载评论
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [animalId]);

  const loadComments = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('comments')
        .select('*')
        .eq('animal_id', animalId)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      
      setComments(data || []);
    } catch (err: any) {
      console.error('加载评论失败:', err);
      setError('加载评论失败');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    if (!newComment.userName.trim() || !newComment.content.trim()) {
      setError('请填写完整信息');
      setIsSubmitting(false);
      return;
    }

    try {
      const { error: insertError } = await supabase
        .from('comments')
        .insert([{
          animal_id: animalId,
          user_name: newComment.userName.trim(),
          content: newComment.content.trim()
        }]);

      if (insertError) throw insertError;

      // 清空表单
      setNewComment({ userName: '', content: '' });
      
      // 评论会通过实时订阅自动更新
    } catch (err: any) {
      console.error('发布评论失败:', err);
      setError('发布评论失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-3xl p-6 border-2 border-amber-200">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <MessageCircle className="w-6 h-6 text-primary" />
        <span>留言讨论</span>
        <span className="text-sm font-normal text-muted-foreground">
          ({comments.length})
        </span>
      </h3>

      {/* 发布评论表单 */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="bg-white rounded-2xl p-4 space-y-3">
          {error && (
            <div className="text-red-600 text-sm bg-red-50 px-3 py-2 rounded-lg">
              {error}
            </div>
          )}
          
          <input
            type="text"
            placeholder="您的昵称"
            value={newComment.userName}
            onChange={(e) => setNewComment({ ...newComment, userName: e.target.value })}
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-colors"
            maxLength={20}
            disabled={isSubmitting}
          />
          
          <textarea
            placeholder="分享你对这只萌宠的看法..."
            value={newComment.content}
            onChange={(e) => setNewComment({ ...newComment, content: e.target.value })}
            rows={3}
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-colors resize-none"
            maxLength={500}
            disabled={isSubmitting}
          />
          
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">
              {newComment.content.length}/500
            </span>
            <button
              type="submit"
              disabled={isSubmitting || !newComment.userName.trim() || !newComment.content.trim()}
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-xl hover:from-amber-600 hover:to-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  发布中...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  发布评论
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* 评论列表 */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="text-center py-8">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
            <p className="text-sm text-muted-foreground mt-2">加载评论中...</p>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-30" />
            <p>还没有评论，来发表第一条吧！</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center text-white font-bold text-sm">
                    {comment.user_name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{comment.user_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(comment.created_at), 'yyyy-MM-dd HH:mm', { locale: zhCN })}
                    </p>
                  </div>
                </div>
              </div>
              <p className="text-sm pl-10">{comment.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
