# Giscus 评论系统配置指南

## 📚 什么是 Giscus？

Giscus 是一个基于 GitHub Discussions 的评论系统，完全免费且功能强大。它可以让你的网站访客通过 GitHub 账号登录并发表评论。

### ✨ 主要优势

- ✅ **完全免费** - 永久免费使用
- 🔒 **安全可靠** - GitHub OAuth 登录，自动防垃圾评论
- 🎨 **界面美观** - 支持多种主题，与网站完美融合
- 💬 **功能丰富** - 支持评论、回复、点赞、Markdown 等
- 🌐 **多语言支持** - 支持中文和多种语言
- 📱 **响应式设计** - 完美适配移动端

## 🚀 配置步骤

### 第一步：准备 GitHub 仓库

1. 创建一个新的 GitHub 仓库（或使用现有仓库）
2. 仓库必须是 **公开的**（Public）
3. 在仓库设置中启用 **Discussions** 功能：
   - 进入仓库的 Settings
   - 找到 Features 部分
   - 勾选 ✅ Discussions

### 第二步：安装 Giscus App

1. 访问 https://github.com/apps/giscus
2. 点击 **Install** 按钮
3. 选择你要安装的仓库
4. 授权访问

### 第三步：获取配置参数

1. 访问 https://giscus.app/zh-CN
2. 在"仓库"部分输入你的仓库信息（格式：`username/repo`）
3. 网站会自动检查你的仓库是否符合要求
4. 向下滚动到"页面 ↔️ discussion 映射关系"，选择 **specific**
5. 在"Discussion 分类"中选择或创建一个分类（建议创建"宠物评论"分类）
6. 继续滚动，复制生成的配置代码

### 第四步：配置本项目

打开 `/src/app/config/giscus.ts` 文件，填入你的配置：

```typescript
export const giscusConfig = {
  // 你的 GitHub 用户名/仓库名
  repo: 'your-username/your-repo-name',
  
  // 从 giscus.app 网站获取
  repoId: 'R_xxxxxxxxx',
  
  // Discussion 分类名称
  category: '宠物评论',
  
  // 从 giscus.app 网站获取
  categoryId: 'DIC_xxxxxxxxx',
  
  // 其他配置保持不变
  mapping: 'specific' as const,
  reactionsEnabled: '1',
  emitMetadata: '0',
  inputPosition: 'top' as const,
  theme: 'light',
  lang: 'zh-CN',
  loading: 'lazy' as const,
};
```

## 📝 如何在 GitHub 创建 Discussion 分类

1. 进入你的 GitHub 仓库
2. 点击顶部的 **Discussions** 标签
3. 点击右侧的齿轮图标 ⚙️（Categories）
4. 点击 **New category**
5. 填写信息：
   - Name: `宠物评论`
   - Description: `校园宠物的评论和讨论`
   - Format: 选择 **Announcement** 或 **Discussion**
6. 点击 **Create**

## 🎯 使用说明

配置完成后：

1. 访客打开宠物详情页时，会看到 Giscus 评论区
2. 访客需要点击"使用 GitHub 登录"按钮
3. 授权后即可发表评论、回复、点赞
4. 所有评论会自动同步到你的 GitHub Discussions
5. 你可以在 GitHub 上管理所有评论

## 🔧 高级配置

### 更改主题

在 `giscus.ts` 中修改 `theme` 字段：

```typescript
theme: 'light',        // 浅色主题
theme: 'dark',         // 深色主题
theme: 'preferred_color_scheme',  // 跟随系统
```

### 更改语言

```typescript
lang: 'zh-CN',  // 简体中文
lang: 'zh-TW',  // 繁体中文
lang: 'en',     // 英语
```

### 更改评论框位置

```typescript
inputPosition: 'top',     // 评论框在顶部
inputPosition: 'bottom',  // 评论框在底部
```

## ❓ 常见问题

### Q: 为什么我看不到评论区？

A: 检查以下几点：
1. 确认已正确填写 `giscus.ts` 配置文件
2. 仓库必须是公开的
3. 已启用 Discussions 功能
4. 已安装 Giscus GitHub App

### Q: 如何删除垃圾评论？

A: 直接在 GitHub Discussions 中删除即可，会自动同步到网站。

### Q: 评论数据存储在哪里？

A: 所有评论都存储在你的 GitHub Discussions 中，完全由你掌控。

### Q: 可以导出评论数据吗？

A: 可以，GitHub Discussions 支持导出，你随时拥有评论数据的完整控制权。

## 🆘 需要帮助？

- Giscus 官方文档：https://giscus.app/zh-CN
- GitHub Discussions 文档：https://docs.github.com/cn/discussions
- Giscus 仓库：https://github.com/giscus/giscus

## 🎉 完成！

配置完成后，你的校园宠物社区就拥有了一个强大的评论系统！访客可以通过 GitHub 登录来分享他们与萌宠的故事。
