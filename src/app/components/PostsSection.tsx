import { useState } from 'react';
import type { Post } from '@/app/types';
import { Calendar, Send } from 'lucide-react';

interface PostsSectionProps {
  petId: string;
  posts: Post[];
  onAddPost: (post: Omit<Post, 'id' | 'timestamp'>) => void;
}

export function PostsSection({ petId, posts, onAddPost }: PostsSectionProps) {
  const [newPost, setNewPost] = useState('');
  const [userName, setUserName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPost.trim() && userName.trim()) {
      onAddPost({
        petId,
        userName: userName.trim(),
        content: newPost.trim(),
      });
      setNewPost('');
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
    return date.toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' });
  };

  return (
    <div className="bg-card rounded-3xl border-2 border-border p-8 shadow-lg shadow-amber-100/20">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 bg-gradient-to-br from-yellow-100 to-amber-100 rounded-xl">
          <Calendar className="w-5 h-5 text-secondary" />
        </div>
        <h3>日常动态</h3>
        <span className="px-3 py-1 text-sm text-secondary bg-secondary/10 rounded-full font-medium">
          {posts.length}
        </span>
      </div>

      {/* Post Form */}
      <form onSubmit={handleSubmit} className="mb-6 space-y-3">
        <div>
          <input
            type="text"
            placeholder="你的昵称"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full px-4 py-3 bg-input-background border-2 border-transparent rounded-2xl focus:outline-none focus:border-secondary transition-all shadow-sm"
          />
        </div>
        <div className="relative">
          <textarea
            placeholder="分享你和它的日常故事..."
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 bg-input-background border-2 border-transparent rounded-2xl focus:outline-none focus:border-secondary transition-all resize-none shadow-sm"
          />
          <button
            type="submit"
            disabled={!newPost.trim() || !userName.trim()}
            className="absolute bottom-3 right-3 p-2.5 bg-gradient-to-r from-yellow-600 to-amber-700 text-white rounded-xl hover:shadow-lg hover:shadow-yellow-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* Posts Timeline */}
      <div className="space-y-4">
        {posts.length === 0 ? (
          <div className="text-center py-12 bg-accent/30 rounded-2xl">
            <div className="text-4xl mb-3">📝</div>
            <p className="text-muted-foreground">
              还没有日常动态，快来分享第一条吧！
            </p>
          </div>
        ) : (
          posts.map((post) => (
            <div
              key={post.id}
              className="relative pl-8 pb-6 border-l-2 border-primary/20 last:pb-0"
            >
              {/* Timeline dot */}
              <div className="absolute left-0 top-1 -translate-x-[9px] w-4 h-4 rounded-full bg-gradient-to-br from-yellow-600 to-amber-700 border-2 border-background shadow-md"></div>
              
              <div className="bg-gradient-to-br from-accent/40 to-accent/20 rounded-2xl p-5 hover:shadow-md transition-all border border-border/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-foreground">{post.userName}</span>
                  <span className="text-xs text-muted-foreground bg-white/50 px-2 py-1 rounded-lg">
                    {formatTime(post.timestamp)}
                  </span>
                </div>
                <p className="text-sm text-foreground leading-relaxed">
                  {post.content}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}