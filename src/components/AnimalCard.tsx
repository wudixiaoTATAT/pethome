import { type Animal } from '@/lib/supabase';
import { MapPin, Heart, MessageCircle } from 'lucide-react';

interface AnimalCardProps {
  animal: Animal;
  onClick: () => void;
}

export function AnimalCard({ animal, onClick }: AnimalCardProps) {
  const getTypeEmoji = (type: string) => {
    switch (type) {
      case 'cat': return '🐱';
      case 'dog': return '🐶';
      default: return '🦢';
    }
  };

  return (
    <div
      onClick={onClick}
      className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
    >
      {/* 图片 */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img
          src={animal.image_url}
          alt={animal.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = 'https://via.placeholder.com/400?text=No+Image';
          }}
        />
        
        {/* 类型标签 */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full font-medium text-sm flex items-center gap-1 shadow-md">
          <span>{getTypeEmoji(animal.type)}</span>
          <span className="capitalize">
            {animal.type === 'cat' ? '猫咪' : animal.type === 'dog' ? '狗狗' : '其他'}
          </span>
        </div>

        {/* 点赞数 */}
        <div className="absolute top-3 right-3 bg-red-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full font-medium text-sm flex items-center gap-1 shadow-md">
          <Heart className="w-4 h-4 fill-current" />
          <span>{animal.likes || 0}</span>
        </div>
      </div>

      {/* 信息 */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-primary mb-2 truncate">
          {animal.name}
        </h3>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <MapPin className="w-4 h-4 flex-shrink-0" />
          <span className="truncate">{animal.location}</span>
        </div>

        {animal.school && (
          <div className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-lg inline-block mb-2">
            {animal.school}
          </div>
        )}

        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {animal.personality}
        </p>

        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <span className="text-xs text-muted-foreground">
            {animal.breed || '未知品种'}
          </span>
          <button className="text-xs text-primary font-medium hover:underline flex items-center gap-1">
            查看详情 →
          </button>
        </div>
      </div>
    </div>
  );
}
