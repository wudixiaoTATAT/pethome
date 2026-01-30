-- ============================================
-- 校园动物档案馆 - 数据库初始化脚本
-- ============================================
-- 使用说明：
-- 1. 访问 https://supabase.com/dashboard/project/qbglfhdvkrhxspwrbsgq/sql/new
-- 2. 复制本文件的全部内容
-- 3. 粘贴到 SQL Editor
-- 4. 点击 "Run" 按钮执行
-- ============================================

-- 1️⃣ 创建 animals 表（动物信息）
CREATE TABLE IF NOT EXISTS public.animals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  personality TEXT NOT NULL,
  image_url TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('cat', 'dog', 'other')),
  breed TEXT,
  school TEXT NOT NULL,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引以提升查询性能
CREATE INDEX IF NOT EXISTS idx_animals_type ON public.animals(type);
CREATE INDEX IF NOT EXISTS idx_animals_school ON public.animals(school);
CREATE INDEX IF NOT EXISTS idx_animals_created_at ON public.animals(created_at DESC);

-- 启用行级安全策略（RLS）
ALTER TABLE public.animals ENABLE ROW LEVEL SECURITY;

-- 删除可能存在的旧策略
DROP POLICY IF EXISTS "Allow public read access" ON public.animals;
DROP POLICY IF EXISTS "Allow public insert" ON public.animals;
DROP POLICY IF EXISTS "Allow public update" ON public.animals;

-- 允许所有人读取
CREATE POLICY "Allow public read access" ON public.animals
  FOR SELECT
  USING (true);

-- 允许所有人插入（投稿）
CREATE POLICY "Allow public insert" ON public.animals
  FOR INSERT
  WITH CHECK (true);

-- 允许所有人更新（点赞）
CREATE POLICY "Allow public update" ON public.animals
  FOR UPDATE
  USING (true);

-- 2️⃣ 创建 comments 表（评论）
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  animal_id UUID NOT NULL REFERENCES public.animals(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_comments_animal_id ON public.comments(animal_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON public.comments(created_at DESC);

-- 启用行级安全策略
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- 删除可能存在的旧策略
DROP POLICY IF EXISTS "Allow public read access" ON public.comments;
DROP POLICY IF EXISTS "Allow public insert" ON public.comments;

-- 允许所有人读取
CREATE POLICY "Allow public read access" ON public.comments
  FOR SELECT
  USING (true);

-- 允许所有人插入（评论）
CREATE POLICY "Allow public insert" ON public.comments
  FOR INSERT
  WITH CHECK (true);

-- 3️⃣ 创建 submissions 表（投稿管理）
CREATE TABLE IF NOT EXISTS public.submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  animal_data JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  submitter_name TEXT NOT NULL,
  submitter_contact TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_submissions_status ON public.submissions(status);
CREATE INDEX IF NOT EXISTS idx_submissions_created_at ON public.submissions(created_at DESC);

-- 启用行级安全策略
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- 删除可能存在的旧策略
DROP POLICY IF EXISTS "Allow public insert" ON public.submissions;
DROP POLICY IF EXISTS "Allow admin read" ON public.submissions;
DROP POLICY IF EXISTS "Allow admin update" ON public.submissions;

-- 允许所有人插入（投稿）
CREATE POLICY "Allow public insert" ON public.submissions
  FOR INSERT
  WITH CHECK (true);

-- 允许所有人查看（简化版，实际应用可以限制为管理员）
CREATE POLICY "Allow admin read" ON public.submissions
  FOR SELECT
  USING (true);

-- 允许更新状态（简化版，实际应用可以限制为管理员）
CREATE POLICY "Allow admin update" ON public.submissions
  FOR UPDATE
  USING (true);

-- 4️⃣ 创建 Storage Bucket（图片存储）
INSERT INTO storage.buckets (id, name, public)
VALUES ('animal-photos', 'animal-photos', true)
ON CONFLICT (id) DO NOTHING;

-- 删除可能存在的旧策略
DROP POLICY IF EXISTS "Allow public upload" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read" ON storage.objects;

-- 允许所有人上传图片
CREATE POLICY "Allow public upload" ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'animal-photos');

-- 允许所有人读取图片
CREATE POLICY "Allow public read" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'animal-photos');

-- 5️⃣ 插入示例数据（可选，用于测试）
INSERT INTO public.animals (name, location, personality, image_url, type, breed, school, likes)
VALUES
  ('小橘', '教学楼A座', '非常亲人，喜欢晒太阳，经常在A座门口睡觉。看到同学会主动过来蹭腿，最爱吃小鱼干！', 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800', 'cat', '橘猫', 'XX大学', 42),
  ('大黄', '图书馆门口', '温柔可爱，爱吃小鱼干。性格温顺，喜欢被抚摸，是图书馆的吉祥物。', 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=800', 'cat', '狸花猫', 'XX大学', 38),
  ('旺财', '操场草坪', '活泼好动，喜欢和同学玩耍。每天下午都会在操场上奔跑，是校园里的开心果！', 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=800', 'dog', '金毛', 'XX大学', 56),
  ('花花', '食堂后门', '害羞内向，但很温柔。喜欢安静的地方，偶尔会接受投喂。', 'https://images.unsplash.com/photo-1529778873920-4da4926a72c2?w=800', 'cat', '三花猫', 'XX大学', 29),
  ('豆豆', '宿舍楼下', '活力四射，爱玩球。每天早上都在宿舍楼下等同学一起玩耍！', 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800', 'dog', '柯基', 'XX大学', 64)
ON CONFLICT (id) DO NOTHING;

-- ✅ 完成！
-- 现在你可以刷新网站页面，应该就能看到数据了！
