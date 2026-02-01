import { X, Heart, MapPin, School } from 'lucide-react';
import { Animal } from '@/lib/types';
import { CommentSection } from './comment-section';
import { useState } from 'react';

interface AnimalDetailProps {
  animal: Animal;
  onClose: () => void;
  onLike: (id: string) => void;
}

export function AnimalDetail({ animal, onClose, onLike }: AnimalDetailProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [localLikes, setLocalLikes] = useState(animal.likes);

  const handleLike = () => {
    if (!isLiked) {
      setIsLiked(true);
      setLocalLikes(localLikes + 1);
      onLike(animal.id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 p-4">
      <div className="mx-auto my-8 max-w-4xl">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-50 via-white to-orange-50 shadow-2xl">
          {/* 关闭按钮 */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-10 rounded-full bg-white p-2 shadow-lg hover:bg-stone-100"
          >
            <X className="h-6 w-6 text-stone-600" />
          </button>

          {/* 图片区域 */}
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
            <img
              src={animal.image_url}
              alt={animal.name}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            
            {/* 底部渐变信息栏 */}
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <h1 className="text-4xl font-bold drop-shadow-lg">
                {animal.name}
              </h1>
              <div className="mt-3 flex flex-wrap gap-3">
                <div className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 backdrop-blur-sm">
                  <MapPin className="h-4 w-4" />
                  <span>{animal.location}</span>
                </div>
                {animal.school && (
                  <div className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 backdrop-blur-sm">
                    <School className="h-4 w-4" />
                    <span>{animal.school}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 内容区域 */}
          <div className="p-8">
            {/* 标签和点赞 */}
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-amber-100 px-4 py-2 text-sm font-medium text-amber-700">
                {animal.type === 'cat' ? '🐱 猫咪' : '🐶 狗狗'}
              </span>
              {animal.breed && (
                <span className="rounded-full bg-stone-100 px-4 py-2 text-sm text-stone-700">
                  {animal.breed}
                </span>
              )}
              <div className="ml-auto">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-2 rounded-full px-6 py-3 text-base font-medium transition-all duration-300 ${
                    isLiked
                      ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg'
                      : 'bg-gradient-to-r from-rose-50 to-pink-50 text-rose-600 hover:from-rose-100 hover:to-pink-100'
                  }`}
                >
                  <Heart
                    className={`h-5 w-5 transition-all duration-300 ${isLiked ? 'fill-white text-white animate-pulse' : ''}`}
                  />
                  <span>{localLikes}</span>
                </button>
              </div>
            </div>

            {/* 性格描述 */}
            <div className="mb-8 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 p-6">
              <h3 className="mb-3 text-lg font-semibold text-stone-800">
                性格特点
              </h3>
              <p className="leading-relaxed text-stone-700">
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
