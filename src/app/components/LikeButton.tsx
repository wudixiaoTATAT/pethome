import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';

interface LikeButtonProps {
  petId: string;
  initialLikes: number;
  onLikeChange: (likes: number) => void;
}

// Helper function to get today's date string
function getTodayKey(): string {
  const today = new Date();
  return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
}

// Helper function to check if user has liked today
function hasLikedToday(petId: string): boolean {
  const todayKey = getTodayKey();
  const storageKey = `pet_like_${petId}_${todayKey}`;
  return localStorage.getItem(storageKey) === 'true';
}

// Helper function to set like status
function setLikeStatus(petId: string, liked: boolean): void {
  const todayKey = getTodayKey();
  const storageKey = `pet_like_${petId}_${todayKey}`;
  if (liked) {
    localStorage.setItem(storageKey, 'true');
  } else {
    localStorage.removeItem(storageKey);
  }
}

export function LikeButton({ petId, initialLikes, onLikeChange }: LikeButtonProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [hasLiked, setHasLiked] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Check if user has already liked today on mount
  useEffect(() => {
    setHasLiked(hasLikedToday(petId));
  }, [petId]);

  const handleLike = () => {
    if (hasLiked) {
      // Unlike
      const newLikes = likes - 1;
      setLikes(newLikes);
      setHasLiked(false);
      setLikeStatus(petId, false);
      onLikeChange(newLikes);
    } else {
      // Like
      const newLikes = likes + 1;
      setLikes(newLikes);
      setHasLiked(true);
      setLikeStatus(petId, true);
      setIsAnimating(true);
      onLikeChange(newLikes);
      
      // Reset animation
      setTimeout(() => setIsAnimating(false), 600);
    }
  };

  return (
    <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-3xl p-6 shadow-md border-2 border-amber-100">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-center sm:text-left">
          <p className="text-muted-foreground mb-1">
            🐾 如果你今天摸了{hasLiked ? 'TA' : 'TA'}，请点赞
          </p>
          <p className="text-sm text-amber-700">每人每天只能点一个赞哦~</p>
        </div>
        
        <button
          onClick={handleLike}
          className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-medium transition-all shadow-md hover:shadow-lg group ${
            hasLiked
              ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white'
              : 'bg-white text-muted-foreground hover:bg-rose-50'
          }`}
        >
          <Heart
            className={`w-6 h-6 transition-all ${
              hasLiked ? 'fill-white text-white' : 'text-rose-500 group-hover:text-rose-600'
            } ${isAnimating ? 'animate-bounce' : ''}`}
          />
          <span className="text-lg font-semibold">{likes}</span>
        </button>
      </div>
    </div>
  );
}
