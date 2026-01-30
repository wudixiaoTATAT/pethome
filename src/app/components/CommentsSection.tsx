import { useState } from 'react';
import type { Comment } from '@/app/types';
import { MessageCircle, Send } from 'lucide-react';

interface CommentsSectionProps {
  petId: string;
  comments: Comment[];
  onAddComment: (comment: Omit<Comment, 'id' | 'timestamp'>) => void;
}

export function CommentsSection({ petId, comments, onAddComment }: CommentsSectionProps) {
  const [newComment, setNewComment] = useState('');
  const [userName, setUserName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim() && userName.trim()) {
      onAddComment({
        petId,
        userName: userName.trim(),
        content: newComment.trim(),
      });
      setNewComment('');
    }
  };

  const formatTime = (date: Date) => {
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
    <div className="bg-card rounded-3xl border-2 border-border p-8 shadow-lg shadow-amber-100/20">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl">
          <MessageCircle className="w-5 h-5 text-primary" />
        </div>
        <h3>评论区</h3>
        <span className="px-3 py-1 text-sm text-primary bg-primary/10 rounded-full font-medium">
          {comments.length}
        </span>
      </div>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="mb-6 space-y-3">
        <div>
          <input
            type="text"
            placeholder="你的昵称"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full px-4 py-3 bg-input-background border-2 border-transparent rounded-2xl focus:outline-none focus:border-primary transition-all shadow-sm"
          />
        </div>
        <div className="relative">
          <textarea
            placeholder="写下你的评论..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 bg-input-background border-2 border-transparent rounded-2xl focus:outline-none focus:border-primary transition-all resize-none shadow-sm"
          />
          <button
            type="submit"
            disabled={!newComment.trim() || !userName.trim()}
            className="absolute bottom-3 right-3 p-2.5 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-xl hover:shadow-lg hover:shadow-amber-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-3">
        {comments.length === 0 ? (
          <div className="text-center py-12 bg-accent/30 rounded-2xl">
            <div className="text-4xl mb-3">💬</div>
            <p className="text-muted-foreground">
              还没有评论，快来抢沙发吧！
            </p>
          </div>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="p-5 bg-gradient-to-br from-accent/40 to-accent/20 rounded-2xl hover:shadow-md transition-all border border-border/50"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-foreground">{comment.userName}</span>
                <span className="text-xs text-muted-foreground bg-white/50 px-2 py-1 rounded-lg">
                  {formatTime(comment.timestamp)}
                </span>
              </div>
              <p className="text-sm text-foreground leading-relaxed">
                {comment.content}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}