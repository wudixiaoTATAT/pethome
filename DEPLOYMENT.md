# 🚀 校园动物档案馆 - 部署指南

## 📋 目录
- [从 Figma Make 下载项目](#从-figma-make-下载项目)
- [配置 Supabase 数据库](#配置-supabase-数据库)
- [本地开发](#本地开发)
- [部署到 Vercel](#部署到-vercel)

---

## 从 Figma Make 下载项目

1. 在 Figma Make 界面中找到"Export"或"Download"按钮
2. 下载项目 ZIP 文件
3. 解压到本地文件夹

---

## 配置 Supabase 数据库

### 1. 创建 Supabase 项目

1. 访问 [supabase.com](https://supabase.com) 并登录
2. 点击 "New Project"
3. 填写信息：
   - 项目名称：`campus-zoo`
   - 数据库密码：设置一个强密码并保存
   - 区域：选择 `Northeast Asia (Tokyo)`
4. 等待项目创建完成（1-2 分钟）

### 2. 获取配置信息

在 Supabase Dashboard → Settings → API 中复制：
- `Project URL`（项目 URL）
- `anon public` key（匿名公钥）

### 3. 创建数据库表

在 Supabase Dashboard → SQL Editor 中执行以下 SQL：

```sql
-- 1. 创建动物表
CREATE TABLE animals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  species TEXT NOT NULL,
  image_url TEXT NOT NULL,
  location TEXT,
  personality TEXT,
  first_seen DATE,
  likes INTEGER DEFAULT 0,
  attacks INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 2. 创建评论表
CREATE TABLE comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  animal_id UUID REFERENCES animals(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 3. 创建投稿表
CREATE TABLE submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  species TEXT NOT NULL,
  image_url TEXT,
  location TEXT,
  personality TEXT,
  submitter_name TEXT NOT NULL,
  submitter_contact TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 4. 启用实时订阅
ALTER PUBLICATION supabase_realtime ADD TABLE animals;
ALTER PUBLICATION supabase_realtime ADD TABLE comments;
ALTER PUBLICATION supabase_realtime ADD TABLE submissions;

-- 5. 创建索引
CREATE INDEX idx_animals_species ON animals(species);
CREATE INDEX idx_comments_animal_id ON comments(animal_id);
CREATE INDEX idx_submissions_status ON submissions(status);

-- 6. 添加示例数据（可选）
INSERT INTO animals (name, species, image_url, location, personality, first_seen, likes, attacks, comment_count)
VALUES 
  ('橘猫小胖', 'cat', 'https://images.unsplash.com/photo-1574158622682-e40e69881006', '图书馆后门', '温柔亲人，喜欢被摸头', '2024-01-15', 128, 2, 15),
  ('黑狗旺财', 'dog', 'https://images.unsplash.com/photo-1543466835-00a7907e9de1', '操场草坪', '活泼好动，喜欢追球', '2024-02-20', 95, 0, 8);
```

### 4. 配置 Storage（图片存储）

1. 在 Supabase Dashboard → Storage
2. 点击 "Create a new bucket"
3. Bucket 名称：`animal-photos`
4. ✅ 勾选 "Public bucket"
5. 点击 "Create bucket"

---

## 本地开发

### 1. 创建环境变量文件

在项目根目录创建 `.env` 文件：

```bash
VITE_SUPABASE_URL=https://你的项目ID.supabase.co
VITE_SUPABASE_ANON_KEY=你的匿名公钥
```

（将上面的值替换为你在 Supabase 获取的实际值）

### 2. 安装依赖

```bash
npm install
# 或
pnpm install
```

### 3. 启动开发服务器

```bash
npm run dev
# 或
pnpm dev
```

访问 `http://localhost:5173` 查看网站

---

## 部署到 Vercel

### 方式 A: 通过 GitHub（推荐）

#### 1. 上传到 GitHub

```bash
# 初始化 Git 仓库
git init

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit"

# 连接远程仓库（替换为你的 GitHub 仓库地址）
git branch -M main
git remote add origin https://github.com/你的用户名/campus-zoo.git
git push -u origin main
```

#### 2. 在 Vercel 导入项目

1. 访问 [vercel.com](https://vercel.com) 并登录
2. 点击 "New Project"
3. 选择 "Import Git Repository"
4. 选择你的 `campus-zoo` 仓库
5. 配置环境变量：
   ```
   VITE_SUPABASE_URL = https://你的项目ID.supabase.co
   VITE_SUPABASE_ANON_KEY = 你的匿名公钥
   ```
6. 点击 "Deploy" 🚀

---

### 方式 B: 使用 Vercel CLI

```bash
# 安装 Vercel CLI
npm install -g vercel

# 登录
vercel login

# 部署
vercel

# 按照提示配置项目
# 记得在 Vercel Dashboard 添加环境变量
```

---

## 🎉 部署成功！

部署完成后，你会得到一个网址，例如：
- `https://campus-zoo.vercel.app`

可以通过以下方式分享：
- 📱 微信朋友圈
- 📧 邮件
- 📝 论坛/贴吧
- 🎓 学生群

---

## 🔧 常见问题

### Q: 网站显示"Failed to fetch"错误
A: 检查环境变量是否正确配置，确保 `VITE_SUPABASE_URL` 和 `VITE_SUPABASE_ANON_KEY` 都已设置

### Q: 图片上传失败
A: 确保在 Supabase Storage 中创建了 `animal-photos` bucket 并设置为 Public

### Q: 实时更新不工作
A: 确保执行了 `ALTER PUBLICATION supabase_realtime ADD TABLE` SQL 语句

### Q: 如何添加自定义域名
A: 在 Vercel 项目设置 → Domains 中添加你的域名并配置 DNS

---

## 📞 需要帮助？

如有问题，请查看：
- [Supabase 文档](https://supabase.com/docs)
- [Vercel 文档](https://vercel.com/docs)
