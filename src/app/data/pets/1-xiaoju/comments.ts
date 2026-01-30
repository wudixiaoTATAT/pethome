import type { Comment } from '@/app/types';

export const comments: Comment[] = [
  {
    id: '1',
    petId: '1',
    userName: '张同学',
    content: '小橘真的太可爱了！今天又在图书馆门口看到它睡觉🥰',
    timestamp: new Date('2026-01-14T10:30:00'),
  },
  {
    id: '2',
    petId: '1',
    userName: '李同学',
    content: '它特别喜欢被摸头，每次路过都要打个招呼',
    timestamp: new Date('2026-01-14T15:20:00'),
  },
];
