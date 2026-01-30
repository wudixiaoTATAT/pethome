import { type Animal } from '@/lib/supabase';
import { CommentSection } from './CommentSection';
import { X, MapPin, Heart, Calendar, Award } from 'lucide-react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface AnimalDetailProps {
  animal: Animal;
  onClose: () => void;
  onLike: () => void;
}

export function AnimalDetail({ animal, onClose, onLike }: AnimalDetailProps) {
  const getTypeEmoji = (type: string) => {
    switch (type) {
      case 'cat': return '🐱';
      case 'dog': return '🐶';
      default: return '🦢';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="min-h-screen px-4 py-8">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* 头部 */}
          <div className="relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors shadow-lg"
            >
              <X className="w-6 h-6" />
            </button>

            {/* 图片 */}
            <div className="relative aspect-[16/9] bg-gradient-to-br from-amber-100 to-yellow-100">
              <img
                src={animal.image_url}
                alt={animal.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/800x450?text=No+Image';
                }}
              />
              
              {/* 类型标签 */}
              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full font-medium flex items-center gap-2 shadow-lg">
                <span className="text-2xl">{getTypeEmoji(animal.type)}</span>
                <span className="capitalize text-lg">
                  {animal.type === 'cat' ? '猫咪' : animal.type === 'dog' ? '狗狗' : '其他'}
                </span>
              </div>
            </div>
          </div>

          {/* 内容 */}
          <div className="p-8 space-y-6">
            {/* 标题和基本信息 */}
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-primary mb-2">
                  {animal.name}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{animal.location}</span>
                  </div>
                  {animal.school && (
                    <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg">
                      {animal.school}
                    </div>
                  )}
                  {animal.breed && (
                    <div className="flex items-center gap-1">
                      <Award className="w-4 h-4" />
                      <span>{animal.breed}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {format(new Date(animal.created_at), 'yyyy年MM月dd日', { locale: zhCN })}
                    </span>
                  </div>
                </div>
              </div>

              {/* 点赞按钮 */}
              <button
                onClick={onLike}
                className="flex flex-col items-center gap-1 px-6 py-3 bg-gradient-to-br from-red-500 to-pink-500 text-white rounded-2xl hover:from-red-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Heart className="w-8 h-8 fill-current" />
                <span className="font-bold text-xl">{animal.likes || 0}</span>
                <span className="text-xs">点赞</span>
              </button>
            </div>

            {/* 性格描述 */}
            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-6 border-2 border-amber-200">
              <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                <span>✨</span>
                <span>性格特点</span>
              </h3>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {animal.personality}
              </p>
            </div>

            {/* 评论区 */}
            <CommentSection animalId={animal.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
