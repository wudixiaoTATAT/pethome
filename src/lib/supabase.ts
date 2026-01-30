import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '/utils/supabase/info';

// 构建 Supabase URL
// 如果设置了环境变量（Vercel 部署），优先使用环境变量
// 否则使用 Figma Make 提供的配置
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || `https://${projectId}.supabase.co`;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || publicAnonKey;

// 创建 Supabase 客户端
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 导出类型定义（从 types.ts 导入）
export type { Animal, Comment, Submission } from './types';