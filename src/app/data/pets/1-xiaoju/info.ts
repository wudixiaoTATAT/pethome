import type { Pet } from '@/app/types';

export const petInfo: Pet = {
  id: '1',
  name: '小橘',
  type: 'cat',
  breed: '橘猫',
  description: '一只超级爱睡觉的小橘猫，经常在图书馆门口晒太阳。性格温顺，喜欢被摸头。',
  imageUrl: 'https://images.unsplash.com/photo-1667518158994-8b3b2957dd01?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmFuZ2UlMjB0YWJieSUyMGNhdHxlbnwxfHx8fDE3Njg0MTM2MTF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  location: '图书馆',
  school: '清华大学',
  friendliness: 5,
  likes: 142,
};
