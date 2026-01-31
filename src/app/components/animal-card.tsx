import { Heart } from 'lucide-react';
import { Animal } from '@/lib/types';

interface AnimalCardProps {
  animal: Animal;
  onClick: () => void;
  onLike: (id: string) => void;
  onAttack: (id: string) => void;
}

export function AnimalCard({ animal, onClick, onLike, onAttack }: AnimalCardProps) {
  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    onLike(animal.id);
  };

  const handleAttack = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAttack(animal.id);
  };

  return (
    <div
      onClick={onClick}
      className="group relative overflow-hidden rounded-xl bg-white/90 backdrop-blur-sm shadow-md transition-all hover:shadow-xl cursor-pointer"
    >
      <div className="aspect-[4/3] overflow-hidden bg-stone-100">
        <img
          src={animal.image_url}
          alt={animal.name}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
      </div>

      <div className="p-3">
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
              className="flex items-center gap-1 rounded-full bg-stone-100 px-2 py-1 text-xs text-stone-600 hover:bg-pink-50 hover:text-pink-500 transition-colors"
            >
              <Heart className="h-3 w-3" />
              <span>{animal.likes || 0}</span>
            </button>
            
            <button 
              onClick={handleAttack}
              className="flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-xs text-blue-600 hover:bg-blue-100 transition-colors"
            >
              <span>😭</span>
              <span>{animal.attacks || 0}</span>
            </button>
          </div>
        </div>

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