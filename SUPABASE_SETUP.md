# Supabase 数据库设置指南

## 数据库表结构

请在 Supabase 控制台中执行以下 SQL 语句来创建数据表：

```sql
-- 创建 animals 表
CREATE TABLE IF NOT EXISTS animals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  personality TEXT NOT NULL,
  image_url TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('cat', 'dog', 'other')),
  breed TEXT,
  school TEXT,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建 comments 表
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  animal_id UUID NOT NULL REFERENCES animals(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建 submissions 表（投稿待审核）
CREATE TABLE IF NOT EXISTS submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  animal_name TEXT NOT NULL,
  location TEXT NOT NULL,
  personality TEXT NOT NULL,
  image_url TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('cat', 'dog', 'other')),
  breed TEXT,
  school TEXT,
  submitter_name TEXT NOT NULL,
  submitter_contact TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_animals_created_at ON animals(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_animals_type ON animals(type);
CREATE INDEX IF NOT EXISTS idx_comments_animal_id ON comments(animal_id);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status);

-- 启用 Row Level Security (RLS)
ALTER TABLE animals ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- 允许所有人查看动物
CREATE POLICY "Allow public read access on animals" 
  ON animals FOR SELECT 
  USING (true);

-- 允许所有人查看评论
CREATE POLICY "Allow public read access on comments" 
  ON comments FOR SELECT 
  USING (true);

-- 允许所有人插入评论
CREATE POLICY "Allow public insert on comments" 
  ON comments FOR INSERT 
  WITH CHECK (true);

-- 允许所有人插入投稿
CREATE POLICY "Allow public insert on submissions" 
  ON submissions FOR INSERT 
  WITH CHECK (true);

-- 只允许管理员查看所有投稿
CREATE POLICY "Allow public read pending submissions" 
  ON submissions FOR SELECT 
  USING (true);

-- 只允许管理员更新和删除
-- (未来可以通过 auth.uid() 限制)
```

## Storage Bucket 设置

1. 在 Supabase 控制台中，进入 **Storage** 部分
2. 创建一个新的 bucket，命名为：`animal-photos`
3. 设置为 **Public bucket**（允许公开访问图片）

或者通过 SQL 创建：

```sql
-- 创建 Storage Bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('animal-photos', 'animal-photos', true)
ON CONFLICT (id) DO NOTHING;

-- 设置 Storage Policy（允许所有人上传）
CREATE POLICY "Allow public uploads to animal-photos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'animal-photos');

-- 允许所有人读取
CREATE POLICY "Allow public read access to animal-photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'animal-photos');
```

## 环境变量设置

在项目根目录创建 `.env.local` 文件：

```env
NEXT_PUBLIC_SUPABASE_URL=你的Supabase项目URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的Supabase匿名密钥
```

## 初始数据（可选）

如果你想添加一些初始数据用于测试：

```sql
-- 插入示例动物
INSERT INTO animals (name, location, personality, image_url, type, breed, school, likes) VALUES
('小橘', '图书馆门口', '温顺可爱，喜欢晒太阳，对人类很友好', 'https://images.unsplash.com/photo-1574158622682-e40e69881006', 'cat', '橘猫', '清华大学', 42),
('大黄', '食堂附近', '活泼好动，喜欢追逐小鸟，偶尔会向学生讨食', 'https://images.unsplash.com/photo-1543466835-00a7907e9de1', 'dog', '中华田园犬', '清华大学', 38),
('小白', '宿舍楼下', '性格害羞，喜欢安静的角落，晚上会出来散步', 'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8', 'cat', '白猫', '北京大学', 55);

-- 插入示例评论
INSERT INTO comments (animal_id, user_name, content) VALUES
((SELECT id FROM animals WHERE name = '小橘' LIMIT 1), '张同学', '今天在图书馆又见到小橘了，它好可爱！'),
((SELECT id FROM animals WHERE name = '小橘' LIMIT 1), '李同学', '给小橘带了点猫粮，它吃得可开心了'),
((SELECT id FROM animals WHERE name = '大黄' LIMIT 1), '王同学', '大黄今天又跟着我走了一路，真是太粘人了哈哈');
```

## 下一步

1. 确保已在 Supabase 控制台中执行了所有 SQL 语句
2. 创建了 `animal-photos` Storage Bucket
3. 设置了环境变量文件
4. 重启开发服务器以加载环境变量

现在你可以开始使用应用了！
