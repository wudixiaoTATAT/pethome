# 🚀 快速设置指南（3分钟）

## ⚠️ 当前状态
你看到错误 **"Could not find the table 'public.animals'"** 是因为数据库表还没有创建。

## ✅ 解决方案（只需 3 个步骤）

### 步骤 1：打开 Supabase SQL Editor

**点击这个链接** 👉 https://supabase.com/dashboard/project/qbglfhdvkrhxspwrbsgq/sql/new

（如果提示登录，请用你的 Supabase 账号登录）

### 步骤 2：复制并执行 SQL

1. 打开项目中的 **`setup.sql`** 文件
2. **全选并复制** 所有内容（Ctrl+A，Ctrl+C）
3. 在 Supabase SQL Editor 中 **粘贴**（Ctrl+V）
4. 点击右下角的 **"Run"** 按钮（或按 Ctrl+Enter）

### 步骤 3：等待执行完成

- ✅ 看到绿色的 **"Success"** 提示
- ✅ 可能会显示 "5 rows" （这是插入的示例数据）

## 🎉 完成！

现在 **刷新你的网站页面**，错误应该就消失了！

你应该能看到：
- 🐱 5 只可爱的示例宠物
- ✨ 可以正常使用投稿、评论、点赞功能

---

## 📋 验证设置是否成功

### 方法 1：检查表
1. 访问 https://supabase.com/dashboard/project/qbglfhdvkrhxspwrbsgq/editor
2. 在左侧应该能看到三个表：
   - ✅ `animals`
   - ✅ `comments`
   - ✅ `submissions`

### 方法 2：检查 Storage
1. 访问 https://supabase.com/dashboard/project/qbglfhdvkrhxspwrbsgq/storage/buckets
2. 应该能看到：
   - ✅ `animal-photos` bucket（公开）

### 方法 3：检查网站
1. 刷新网站页面
2. 应该能看到 5 只示例宠物卡片
3. 点击任意卡片可以查看详情和评论

---

## 🔧 如果还有问题

### 问题：SQL 执行失败

**可能原因**：某些策略已存在

**解决方法**：
- SQL 脚本已经包含了 `DROP POLICY IF EXISTS`，可以安全地重复运行
- 如果还是报错，请复制错误信息

### 问题：看不到示例数据

**可能原因**：示例数据插入被跳过（表中已有数据）

**解决方法**：
- 这是正常的，不影响功能
- 可以通过"投稿萌宠"按钮添加新数据

### 问题：能看到数据但无法点赞/评论

**可能原因**：RLS 策略未正确设置

**解决方法**：
1. 访问 https://supabase.com/dashboard/project/qbglfhdvkrhxspwrbsgq/auth/policies
2. 确认每个表都有正确的策略（见下方）

**应该有的策略：**
- `animals` 表：3 个策略（SELECT, INSERT, UPDATE）
- `comments` 表：2 个策略（SELECT, INSERT）
- `submissions` 表：3 个策略（SELECT, INSERT, UPDATE）

---

## 📞 需要帮助？

如果按照上述步骤操作后仍然有问题，请提供：
1. SQL 执行的错误信息（如果有）
2. 浏览器控制台的错误信息（按 F12 打开）
3. 你看到的具体现象

---

## 🎯 下一步

设置完成后，你可以：
1. 📸 删除示例数据，投稿真实的校园宠物
2. 🎨 自定义 UI 样式和主题色
3. 🔒 添加管理员审核功能
4. 🌐 部署到 Vercel 或 Netlify

**祝你使用愉快！** 🐾
