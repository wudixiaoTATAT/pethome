# 🔧 修复 "Email not confirmed" 错误

## 📌 问题说明

当您尝试登录时看到以下错误：
```
认证错误: AuthApiError: Email not confirmed
```

这是因为 Supabase Auth 默认要求用户在登录前验证邮箱，但我们还没有配置邮件服务器（SMTP）。

---

## ✅ 解决方案（3 种方法）

### 方法 1️⃣：禁用邮箱验证（推荐用于开发环境）⭐

**步骤：**

1. 打开 Supabase Dashboard
   - 访问：https://supabase.com/dashboard
   - 选择项目：`qbglfhdvkrhxspwrbsgq`

2. 进入认证设置
   ```
   左侧菜单 → Authentication → Providers → Email
   ```

3. 关闭邮箱确认
   - 找到 **"Confirm email"** 选项
   - 将其设置为 **OFF（关闭）**
   - 点击 **Save** 保存

**效果：**
- ✅ 用户注册后立即可以登录
- ✅ 无需配置邮件服务器
- ✅ 适合开发和测试环境

**截图位置：**
```
Dashboard → Authentication → Providers → Email → Confirm email (OFF)
```

---

### 方法 2️⃣：手动确认现有用户的邮箱

如果您已经注册了账号但无法登录，可以手动确认邮箱：

**步骤：**

1. 打开 Supabase Dashboard
2. 进入用户管理
   ```
   Dashboard → Authentication → Users
   ```
3. 找到您的用户（通过邮箱搜索）
4. 点击用户名进入详情页
5. 点击 **"Confirm Email"** 按钮

**或者使用 SQL：**

```sql
-- 手动确认特定用户的邮箱
UPDATE auth.users 
SET email_confirmed_at = NOW(),
    confirmed_at = NOW()
WHERE email = 'your-email@example.com';
```

将 `your-email@example.com` 替换为您的邮箱地址。

---

### 方法 3️⃣：配置 SMTP 邮件服务器（用于生产环境）

如果您想要真实的邮箱验证功能（适合生产环境）：

**步骤：**

1. 打开 Supabase Dashboard
2. 进入邮件设置
   ```
   Dashboard → Project Settings → Auth → Email Auth
   ```

3. 配置 SMTP 服务器
   - **SMTP Host**: smtp.gmail.com（如果使用 Gmail）
   - **SMTP Port**: 587
   - **SMTP User**: your-email@gmail.com
   - **SMTP Password**: 您的应用专用密码
   - **Sender Email**: your-email@gmail.com
   - **Sender Name**: 校园动物档案馆

4. 测试邮件发送

**常用 SMTP 服务：**

| 服务商 | SMTP Host | Port | 说明 |
|--------|-----------|------|------|
| Gmail | smtp.gmail.com | 587 | 需要开启两步验证并生成应用专用密码 |
| 腾讯企业邮 | smtp.exmail.qq.com | 465 | 企业邮箱 |
| QQ 邮箱 | smtp.qq.com | 465/587 | 需要开启 SMTP 服务 |
| 网易 163 | smtp.163.com | 465 | 需要开启 SMTP 服务 |
| Outlook | smtp-mail.outlook.com | 587 | Microsoft 邮箱 |
| SendGrid | smtp.sendgrid.net | 587 | 专业邮件服务 |

---

## 🚀 快速修复（推荐）

### 立即执行这两步：

#### 步骤 1：在 Supabase Dashboard 禁用邮箱确认

```
1. 访问 https://supabase.com/dashboard/project/qbglfhdvkrhxspwrbsgq/auth/providers
2. 找到 Email Provider
3. 关闭 "Confirm email" 选项
4. 点击 Save
```

#### 步骤 2：确认现有用户（如果有）

如果您已经注册了账号，在 Supabase SQL Editor 中执行：

```sql
-- 确认所有现有用户的邮箱
UPDATE auth.users 
SET email_confirmed_at = NOW(),
    confirmed_at = NOW()
WHERE email_confirmed_at IS NULL;
```

---

## 🧪 测试修复

修复后，请测试以下流程：

### 测试 1：新用户注册
```
1. 打开网站
2. 点击"登录/注册"
3. 切换到"注册"
4. 填写信息：
   - 邮箱：test@example.com
   - 密码：123456
   - 用户名：测试用户
5. 点击"注册"
6. 应该立即自动登录 ✅
```

### 测试 2：已有用户登录
```
1. 使用之前注册的邮箱和密码登录
2. 应该成功登录 ✅
```

---

## 📊 三种方法对比

| 方法 | 优点 | 缺点 | 适用场景 |
|------|------|------|----------|
| **方法 1：禁用邮箱验证** | • 无需配置<br>• 立即生效<br>• 开发简单 | • 无法验证邮箱真实性<br>• 可能有垃圾注册 | ✅ 开发环境<br>✅ 测试环境<br>✅ 校园内网 |
| **方法 2：手动确认** | • 临时快速修复 | • 需要手动操作<br>• 不适合批量用户 | ✅ 临时修复<br>✅ 少量用户 |
| **方法 3：配置 SMTP** | • 真实邮箱验证<br>• 安全性高<br>• 用户可重置密码 | • 需要配置 SMTP<br>• 需要邮箱服务 | ✅ 生产环境<br>✅ 公网部署 |

---

## ⚙️ 当前代码更新

前端代码已经更新，添加了 `emailRedirectTo` 选项：

```typescript
// /src/contexts/auth-context.tsx
const { error } = await supabase.auth.signUp({
  email,
  password,
  options: {
    data: {
      username,
      username_lower: username.toLowerCase(),
      avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
    },
    emailRedirectTo: window.location.origin, // ✅ 已添加
  },
});
```

这样即使启用了邮箱验证，用户点击确认链接后也会正确跳转回网站。

---

## 🎯 推荐配置（校园网站）

对于校园宠物社区网站，推荐使用 **方法 1**（禁用邮箱验证）：

### 原因：
1. ✅ 校园网站用户群体可信度高
2. ✅ 快速上手，无需配置邮件服务器
3. ✅ 用户体验好，注册即可使用
4. ✅ 可以后期再添加邮箱验证功能

### 额外安全措施：
虽然禁用了邮箱验证，但系统仍然具有以下安全措施：

- ✅ 密码加密存储（Supabase 自动处理）
- ✅ 用户名唯一性检查
- ✅ 邮箱唯一性检查
- ✅ 用户名格式验证
- ✅ 密码长度验证
- ✅ JWT Token 认证

---

## 🔄 如果将来需要启用邮箱验证

当您配置好 SMTP 后，只需：

1. 在 Supabase Dashboard 中开启 "Confirm email"
2. 用户注册后会收到确认邮件
3. 点击邮件中的链接即可激活账号
4. 前端代码已经准备好，无需修改！

---

## ❓ 常见问题

### Q1: 禁用邮箱验证安全吗？
**A:** 对于校园内部网站是安全的。邮箱仍然是唯一的，只是不需要验证真实性。

### Q2: 用户忘记密码怎么办？
**A:** 如果禁用了邮箱验证，建议管理员手动重置密码，或者后期配置 SMTP 以支持密码重置邮件。

### Q3: 已经注册的用户怎么办？
**A:** 使用方法 2 手动确认邮箱，或者在 SQL Editor 中批量确认所有用户。

### Q4: 什么时候需要邮箱验证？
**A:** 如果网站对外公开，建议启用邮箱验证以防止垃圾注册。校园内网可以不启用。

### Q5: 如何查看哪些用户需要确认邮箱？
**A:** 
```sql
-- 查看未确认邮箱的用户
SELECT email, created_at 
FROM auth.users 
WHERE email_confirmed_at IS NULL;
```

---

## 🎉 总结

**立即行动：**

1. ✅ 访问 Supabase Dashboard
2. ✅ 关闭 "Confirm email" 选项
3. ✅ 如有现有用户，执行 SQL 确认邮箱
4. ✅ 测试注册和登录功能

完成后，所有用户都可以正常注册和登录了！
