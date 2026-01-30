# 🚀 快速启动指南

欢迎使用校园动物档案馆！这是一个简单的 5 分钟启动教程。

## ✅ 好消息：Supabase 已自动配置！

**项目已自动连接到 Supabase**，无需手动设置环境变量！

- **Supabase URL**: `https://qbglfhdvkrhxspwrbsgq.supabase.co`
- **控制台访问**: https://supabase.com/dashboard/project/qbglfhdvkrhxspwrbsgq

## 第一步：配置数据库表（必需）

### 1.1 访问 Supabase 控制台

直接访问：https://supabase.com/dashboard/project/qbglfhdvkrhxspwrbsgq

（如果需要登录，请使用你的 Supabase 账号）

### 1.2 设置数据库表

1. 在 Supabase 项目页面，点击左侧菜单的 **SQL Editor**
2. 点击 **New query**
3. 复制 `DATABASE_SETUP.md` 文件中的所有 SQL 语句
4. 粘贴到 SQL 编辑器中
5. 点击 **Run** 或按 `Ctrl/Cmd + Enter` 执行

✅ 看到 "Success. No rows returned" 表示创建成功！

### 1.3 创建 Storage Bucket

1. 点击左侧菜单的 **Storage**
2. 点击 **New bucket**
3. 设置：
   - **Name**: `animal-photos`
   - **Public bucket**: ✅ 勾选（允许公开访问）
4. 点击 **Create bucket**

## 第二步：启动项目

### 2.1 安装依赖（首次运行）

```bash
npm install
```

### 2.2 启动开发服务器

```bash
npm run dev
```

### 2.3 打开浏览器

访问 [http://localhost:5173](http://localhost:5173)

🎉 **恭喜！应用已经运行成功！**

## 第三步：测试功能

### 测试投稿功能

1. 点击右上角 **"投稿萌宠"** 按钮
2. 填写表单：
   - 上传一张宠物照片
   - 填写名字（如：小橘）
   - 填写地点（如：图书馆）
   - 选择类型（猫咪/狗狗）
   - 填写性格描述
   - 填写学校名称
   - 填写投稿人信息
3. 点击 **"提交投稿"**
4. ✅ 看到成功提示后，卡片会出现在首页

### 测试评论功能

1. 点击任意宠物卡片打开详情页
2. 滚动到底部的评论区
3. 填写昵称和评论内容
4. 点击 **"发表评论"**
5. ✅ 评论会立即显示（实时更新）

### 测试筛选功能

1. 使用搜索框搜索宠物名字
2. 使用类型下拉菜单筛选猫咪或狗狗
3. 使用学校下拉菜单筛选不同学校
4. ✅ 列表会实时过滤

## 常见问题

### ❓ 投稿后看不到图片？

**可能原因**：Storage Bucket 没有设置为 public

**解决方法**：
1. 进入 Supabase Storage
2. 找到 `animal-photos` bucket
3. 点击设置图标
4. 确保 **Public bucket** 已勾选

### ❓ 评论不实时更新？

**可能原因**：Realtime 功能未启用

**解决方法**：
1. 进入 Supabase 项目
2. 点击 **Database** > **Replication**
3. 找到 `animals` 和 `comments` 表
4. 确保它们的复制功能已启用（绿色开关）

### ❓ 上传图片失败？

**可能原因**：图片太大或格式不支持

**解决方法**：
1. 确保图片大小 < 5MB
2. 使用常见格式（JPG、PNG、WebP）
3. 检查 Storage Bucket 是否创建成功

## 下一步

恭喜完成基本配置！你现在可以：

1. 📸 **投稿更多萌宠** - 为你的校园动物们创建档案
2. 💬 **发表评论** - 与其他用户分享你对萌宠的看法
3. ❤️ **点赞** - 为你喜欢的萌宠点赞
4. 🎨 **自定义** - 根据需求修改 UI 样式和功能

## 数据库管理

### 查看数据

在 Supabase 控制台：
- **Table Editor** - 查看和编辑表数据
- **Database** > **Tables** - 查看表结构
- **Storage** - 管理上传的图片

### 添加示例数据

如果想快速测试，可以在 SQL Editor 中运行：

```sql
INSERT INTO public.animals (name, location, personality, image_url, type, breed, school, likes)
VALUES
  ('小橘', '教学楼A座', '非常亲人，喜欢晒太阳', 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800', 'cat', '橘猫', 'XX大学', 42),
  ('大黄', '图书馆门口', '温柔可爱，爱吃小鱼干', 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=800', 'cat', '狸花猫', 'XX大学', 38);
```

## 部署上线

项目可以部署到：

- **Vercel** （推荐）
- **Netlify**
- **Cloudflare Pages**

只需在部署平台配置相同的环境变量即可。

## 获取帮助

- 📖 查看完整文档：`README.md`
- 🗄️ 数据库设置：`DATABASE_SETUP.md`
- 💬 遇到问题？查看"常见问题"部分或提交 Issue

---

**祝你使用愉快！** 🐾