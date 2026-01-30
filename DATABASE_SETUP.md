# 数据库设置指南

## ✅ Supabase 配置

**好消息！** Supabase 连接配置已经自动配置完成，无需手动设置环境变量。

项目已自动连接到 Supabase 实例：
- Project ID: `qbglfhdvkrhxspwrbsgq`
- URL: `https://qbglfhdvkrhxspwrbsgq.supabase.co`

## Supabase 数据库结构

请在 Supabase 控制台中执行以下 SQL 语句来创建所需的表和存储桶。

**访问控制台：** https://supabase.com/dashboard/project/qbglfhdvkrhxspwrbsgq

### 1. 创建 animals 表

```sql
-- 创建 animals 表
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

-- 创建索引
CREATE INDEX idx_animals_type ON public.animals(type);
CREATE INDEX idx_animals_school ON public.animals(school);
CREATE INDEX idx_animals_created_at ON public.animals(created_at DESC);

-- 启用行级安全策略
ALTER TABLE public.animals ENABLE ROW LEVEL SECURITY;

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
```

### 2. 创建 comments 表

```sql
-- 创建 comments 表
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  animal_id UUID NOT NULL REFERENCES public.animals(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX idx_comments_animal_id ON public.comments(animal_id);
CREATE INDEX idx_comments_created_at ON public.comments(created_at DESC);

-- 启用行级安全策略
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- 允许所有人读取
CREATE POLICY "Allow public read access" ON public.comments
  FOR SELECT
  USING (true);

-- 允许所有人插入（评论）
CREATE POLICY "Allow public insert" ON public.comments
  FOR INSERT
  WITH CHECK (true);
```

### 3. 创建 submissions 表（投稿管理）

```sql
-- 创建 submissions 表
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
CREATE INDEX idx_submissions_status ON public.submissions(status);
CREATE INDEX idx_submissions_created_at ON public.submissions(created_at DESC);

-- 启用行级安全策略
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- 允许所有人插入（投稿）
CREATE POLICY "Allow public insert" ON public.submissions
  FOR INSERT
  WITH CHECK (true);

-- 仅管理员可以查看和更新
-- 注意：需要根据实际的认证系统调整
CREATE POLICY "Allow admin read" ON public.submissions
  FOR SELECT
  USING (true);

CREATE POLICY "Allow admin update" ON public.submissions
  FOR UPDATE
  USING (true);
```

### 4. 创建 Storage Bucket

在 Supabase 控制台的 Storage 部分：

1. 创建一个新的 bucket，命名为 `animal-photos`
2. 设置为 **Public** bucket（公开访问）
3. 配置文件上传策略：
   - 允许的文件类型：image/jpeg, image/png, image/webp, image/gif
   - 最大文件大小：5MB

或者使用 SQL：

```sql
-- 创建 storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('animal-photos', 'animal-photos', true)
ON CONFLICT (id) DO NOTHING;

-- 允许所有人上传
CREATE POLICY "Allow public upload" ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'animal-photos');

-- 允许所有人读取
CREATE POLICY "Allow public read" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'animal-photos');
```

### 5. 实时订阅设置

确保在 Supabase 控制台的 Database > Replication 中启用以下表的实时功能：

- ✅ animals
- ✅ comments
- ✅ submissions

### 6. 示例数据（可选）

```sql
-- 插入示例动物数据
INSERT INTO public.animals (name, location, personality, image_url, type, breed, school, likes)
VALUES
  ('小橘', '教学楼A座', '非常亲人，喜欢晒太阳', 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800', 'cat', '橘猫', 'XX大学', 42),
  ('大黄', '图书馆门口', '温柔可爱，爱吃小鱼干', 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=800', 'cat', '狸花猫', 'XX大学', 38),
  ('旺财', '操场草坪', '活泼好动，喜欢和同学玩耍', 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=800', 'dog', '金毛', 'XX大学', 56);
```

## 验证设置

1. 在 Supabase 控制台的 Table Editor 中检查所有表是否创建成功
2. 在 Storage 中检查 `animal-photos` bucket 是否存在
3. 测试上传一张图片到 Storage
4. 在应用中测试投稿功能
5. 验证评论实时更新是否正常

## 故障排查

### 问题：无法上传图片
- 检查 Storage bucket 是否设置为 public
- 检查 Storage policies 是否正确配置
- 确认文件大小不超过 5MB

### 问题：评论不实时更新
- 在 Database > Replication 中启用 comments 表的实时功能
- 检查浏览器控制台是否有 WebSocket 连接错误

### 问题：无法插入数据
- 检查 RLS (Row Level Security) 策略是否正确配置
- 确认 API Key 权限正确

## 管理员功能（未来扩展）

如需添加管理员审核功能，可以：

1. 在 Supabase Auth 中设置用户认证
2. 创建管理员角色
3. 修改 submissions 表的 RLS 策略
4. 添加审核界面组件

---

数据库设置完成后，重启开发服务器即可开始使用！