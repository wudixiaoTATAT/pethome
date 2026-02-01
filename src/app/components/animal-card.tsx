import { useState, useEffect, useMemo } from 'react'; // 关键：引入 useMemo 和 Hooks
import { Heart } from 'lucide-react';
import { Animal } from '@/lib/types';

interface AnimalCardProps {
  animal: Animal;
  onClick: () => void;
  onLike: (id: string) => void;
  onAttack: (id: string) => void;
}

export function AnimalCard({ animal, onClick, onLike, onAttack }: AnimalCardProps) {
  // --- 1. 图片解析逻辑（新增：解决多图不显示的问题） ---
  const displayImage = useMemo(() => {
    try {
      if (Array.isArray(animal.image_url)) return animal.image_url[0];
      if (typeof animal.image_url === 'string' && animal.image_url.startsWith('[')) {
        return JSON.parse(animal.image_url)[0];
      }
      return animal.image_url;
    } catch (e) {
      return animal.image_url;
    }
  }, [animal.image_url]);

  // --- 2. 你的零延迟反馈逻辑（完整保留） ---
  const [localLikes, setLocalLikes] = useState(animal.likes || 0);
  const [localAttacks, setLocalAttacks] = useState(animal.attacks || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [isAttacked, setIsAttacked] = useState(false);

  useEffect(() => {
    setLocalLikes(animal.likes || 0);
    setLocalAttacks(animal.attacks || 0);
  }, [animal.likes, animal.attacks]);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    const offset = isLiked ? -1 : 1;
    setLocalLikes(prev => prev + offset);
    setIsLiked(!isLiked);
    onLike(animal.id);
  };

  const handleAttack = (e: React.MouseEvent) => {
    e.stopPropagation();
    const offset = isAttacked ? -1 : 1;
    setLocalAttacks(prev => prev + offset);
    setIsAttacked(!isAttacked);
    onAttack(animal.id);
  };

  return (
    <div
      onClick={onClick}
      className="group relative overflow-hidden rounded-xl bg-white/90 backdrop-blur-sm shadow-md transition-all hover:shadow-xl cursor-pointer"
    >
      {/* 图片部分使用解析后的 displayImage */}
      <div className="aspect-[4/3] overflow-hidden bg-stone-100">
        <img
          src={displayImage}
          alt={animal.name}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
      </div>

      <div className="p-3">
        {/* 名字与互动区：恢复你原本的横向布局 */}
        <div className="mb-2 flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="truncate text-base font-semibold text-stone-800">
              {animal.name}
            </h3>
            <p className="truncate text-xs text-stone-600">
              📍 {animal.location}
            </p>
          </div>

          <div className="flex gap-1 flex-shrink-0">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs transition-colors ${
                isLiked 
                ? 'bg-pink-100 text-pink-500' 
                : 'bg-stone-100 text-stone-600 hover:bg-pink-50 hover:text-pink-500'
              }`}
            >
              <Heart className={`h-3 w-3 ${isLiked ? 'fill-current' : ''}`} />
              <span>{localLikes}</span>
            </button>
            
            <button 
              onClick={handleAttack}
              className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs transition-colors ${
                isAttacked 
                ? 'bg-blue-100 text-blue-600' 
                : 'bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-600'
              }`}
            >
              <span>😭</span>
              <span>{localAttacks}</span>
            </button>
          </div>
        </div>

        {/* 标签区域：完整恢复 */}
        <div className="flex gap-1.5 flex-wrap">
          {animal.type && (
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
              {animal.type === 'cat' ? '🐱' : '🐶'}
            </span>
          )}
          {animal.breed && (
            <span className="rounded-full bg-stone-100 px-2 py-0.5 text-xs text-stone-600 truncate max-w-[100px]">
              {animal.breed}
            </span>
          )}
          {animal.school && (
            <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700 truncate max-w-[100px]">
              {animal.school}
            </span>
          )}
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/0 via-black/0 to-black/0 opacity-0 transition-opacity group-hover:opacity-100" />
    </div>
  );
}