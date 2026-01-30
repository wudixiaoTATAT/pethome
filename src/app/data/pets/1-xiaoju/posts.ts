import type { Post } from '@/app/types';

export const posts: Post[] = [
  {
    id: '1',
    petId: '1',
    userName: '张同学',
    content: '今天小橘在图书馆门口晒了一下午的太阳，看起来特别舒服😊',
    timestamp: new Date('2026-01-14T14:00:00'),
  },
  {
    id: '3',
    petId: '1',
    userName: '赵同学',
    content: '小橘吃了好多零食，肚子都圆了哈哈',
    timestamp: new Date('2026-01-12T12:00:00'),
  },
];
