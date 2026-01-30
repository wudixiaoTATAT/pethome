import type { School } from '@/app/types';

import { schoolInfo as school1 } from './1-tsinghua/info';
import { schoolInfo as school2 } from './2-peking/info';
import { schoolInfo as school3 } from './3-fudan/info';
import { schoolInfo as school4 } from './4-sjtu/info';

export const allSchools: School[] = [
  school1,
  school2,
  school3,
  school4,
];

// 添加更多学校，继续导入...
// import { schoolInfo as school5 } from './5-zhejiang/info';
