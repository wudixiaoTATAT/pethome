import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import type { Pet } from '@/app/types';
import { MapPin, Heart, ArrowLeft, GraduationCap } from 'lucide-react';

interface PetDetailProps {
  pet: Pet;
  onBack: () => void;
  children?: React.ReactNode;
}

export function PetDetail({ pet, onBack, children }: PetDetailProps) {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Decorative background */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute top-10 right-10 text-5xl animate-float">🐾</div>
        <div className="absolute bottom-20 left-10 text-6xl animate-float-delayed">🐾</div>
        <div className="absolute top-1/3 left-1/4 text-4xl animate-float">🐾</div>
      </div>

      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/70 backdrop-blur-xl border-b border-border shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>返回列表</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        {/* Pet Info Card */}
        <div className="bg-card rounded-3xl overflow-hidden border-2 border-border shadow-xl shadow-pink-100/30 mb-8">
          <div className="relative h-[28rem]">
            <ImageWithFallback
              src={pet.imageUrl}
              alt={pet.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <div className="flex items-end justify-between">
                <div className="text-white">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-white drop-shadow-lg">{pet.name}</h1>
                    <span className="text-3xl drop-shadow-lg">{pet.type === 'cat' ? '🐱' : pet.type === 'dog' ? '🐶' : '🦢'}</span>
                  </div>
                  <p className="text-white/95 drop-shadow-md">{pet.breed}</p>
                </div>
                <div className="flex items-center gap-2 bg-white/95 backdrop-blur-md px-5 py-3 rounded-2xl shadow-lg">
                  <Heart className="w-5 h-5 text-amber-500 fill-amber-500" />
                  <span className="font-medium text-amber-700">{pet.friendliness}/5</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <div className="flex items-center gap-2 text-muted-foreground px-4 py-3 bg-accent/50 rounded-2xl">
                <MapPin className="w-5 h-5" />
                <span>常出没地点：{pet.location}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground px-4 py-3 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl">
                <GraduationCap className="w-5 h-5 text-amber-600" />
                <span className="font-medium text-amber-700">{pet.school}</span>
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="text-primary">关于 {pet.name}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {pet.description}
              </p>
            </div>
          </div>
        </div>

        {/* Comments and Posts Section */}
        {children}
      </div>
    </div>
  );
}