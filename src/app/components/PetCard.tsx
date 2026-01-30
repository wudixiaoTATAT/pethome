import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import type { Pet } from '@/app/types';
import { MapPin, Heart, GraduationCap } from 'lucide-react';

interface PetCardProps {
  pet: Pet;
  onClick: () => void;
}

export function PetCard({ pet, onClick }: PetCardProps) {
  return (
    <div
      onClick={onClick}
      className="group cursor-pointer bg-card rounded-3xl overflow-hidden border-2 border-border hover:border-primary/30 hover:shadow-2xl hover:shadow-amber-100/50 transition-all duration-300 transform hover:-translate-y-2"
    >
      <div className="relative h-64 overflow-hidden">
        <ImageWithFallback
          src={pet.imageUrl}
          alt={pet.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-4 py-2 rounded-full shadow-lg">
          <span className="text-xl">{pet.type === 'cat' ? '🐱' : pet.type === 'dog' ? '🐶' : '🦢'}</span>
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="mb-1.5 group-hover:text-primary transition-colors">{pet.name}</h3>
            <p className="text-sm text-muted-foreground">{pet.breed}</p>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-100 to-orange-100 rounded-full">
            <Heart className="w-4 h-4 fill-amber-500 text-amber-500" />
            <span className="text-sm font-medium text-amber-700">{pet.friendliness}</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
          {pet.description}
        </p>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground px-3 py-2 bg-accent/50 rounded-xl">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm truncate">{pet.location}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground px-3 py-2 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl">
            <GraduationCap className="w-4 h-4 flex-shrink-0 text-amber-600" />
            <span className="text-sm truncate font-medium text-amber-700">{pet.school}</span>
          </div>
        </div>
      </div>
    </div>
  );
}