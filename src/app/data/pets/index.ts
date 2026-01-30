import type { Pet, Comment, Post } from '@/app/types';

// 导入所有宠物数据
import { petInfo as pet1 } from './1-xiaoju/info';
import { comments as comments1 } from './1-xiaoju/comments';
import { posts as posts1 } from './1-xiaoju/posts';

import { petInfo as pet2 } from './2-dahuang/info';
import { comments as comments2 } from './2-dahuang/comments';
import { posts as posts2 } from './2-dahuang/posts';

import { petInfo as pet3 } from './3-huahua/info';
import { comments as comments3 } from './3-huahua/comments';
import { posts as posts3 } from './3-huahua/posts';

import { petInfo as pet4 } from './4-doudou/info';
import { comments as comments4 } from './4-doudou/comments';
import { posts as posts4 } from './4-doudou/posts';

import { petInfo as pet5 } from './5-mimi/info';
import { comments as comments5 } from './5-mimi/comments';
import { posts as posts5 } from './5-mimi/posts';

import { petInfo as pet6 } from './6-xiaobai/info';
import { comments as comments6 } from './6-xiaobai/comments';
import { posts as posts6 } from './6-xiaobai/posts';

import { petInfo as pet7 } from './7-heitiane/info';
import { comments as comments7 } from './7-heitiane/comments';
import { posts as posts7 } from './7-heitiane/posts';

import { petInfo as pet8 } from './8-xueqiu/info';
import { comments as comments8 } from './8-xueqiu/comments';
import { posts as posts8 } from './8-xueqiu/posts';

import { petInfo as pet9 } from './9-ciqiu/info';
import { comments as comments9 } from './9-ciqiu/comments';
import { posts as posts9 } from './9-ciqiu/posts';

// 聚合所有宠物
export const allPets: Pet[] = [
  pet1,
  pet2,
  pet3,
  pet4,
  pet5,
  pet6,
  pet7,
  pet8,
  pet9,
];

// 聚合所有评论
export const allComments: Comment[] = [
  ...comments1,
  ...comments2,
  ...comments3,
  ...comments4,
  ...comments5,
  ...comments6,
  ...comments7,
  ...comments8,
  ...comments9,
];

// 聚合所有动态
export const allPosts: Post[] = [
  ...posts1,
  ...posts2,
  ...posts3,
  ...posts4,
  ...posts5,
  ...posts6,
  ...posts7,
  ...posts8,
  ...posts9,
];
