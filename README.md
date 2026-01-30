# 🐾 校园动物档案馆 (Campus Zoo)

> 记录校园里每一只可爱的小生命 ❤️

一个温馨可爱的校园宠物社区网站，用来记录学校里面的所有小猫小狗。每一只宠物都有自己的页面，可以发布评论和日常动态。

![Campus Zoo](https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=1200&h=400&fit=crop)

---

## ✨ 功能特性

### 🏠 主页功能
- ✅ 动态简约背景
- ✅ 响应式宠物卡片（移动端 2 列，桌面端 3 列）
- ✅ 按猫咪/狗狗分类筛选
- ✅ 实时搜索功能
- ✅ 分页系统（每页 9 只萌宠）
- ✅ 详细的页数信息显示
- ✅ 回到顶部按钮

### 🐱 宠物详情页
- ✅ 完整的宠物档案信息
- ✅ 点赞互动（"如果你今天摸了它请点赞"）
- ✅ 哭哭互动（"如果你今天被它攻击了请点一个"）
- ✅ 实时评论系统
- ✅ 数据同步到主页卡片

### 📝 投稿系统
- ✅ 用户可以投稿新宠物
- ✅ 支持图片上传
- ✅ 管理员审核机制

### 🎨 设计风格
- ✅ 温馨可爱的棕色系主题
- ✅ 流畅的动画效果
- ✅ 完全响应式设计
- ✅ 温馨的底部文字

---

## 🛠️ 技术栈

- **前端框架**: React 18 + TypeScript
- **样式**: Tailwind CSS v4
- **路由**: React Router v6
- **后端**: Supabase (数据库 + Storage + 实时订阅)
- **图标**: Lucide React
- **构建工具**: Vite
- **部署**: Vercel

---

## 📦 项目结构

```
campus-zoo/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── home-page.tsx          # 主页面
│   │   │   ├── animal-card.tsx        # 宠物卡片组件
│   │   │   ├── animal-detail-page.tsx # 宠物详情页
│   │   │   ├── comment-section.tsx    # 评论系统
│   │   │   └── submission-form.tsx    # 投稿表单
│   │   └── App.tsx                     # 主应用组件
│   ├── lib/
│   │   ├── supabase.ts                 # Supabase 客户端配置
│   │   └── types.ts                    # TypeScript 类型定义
│   └── styles/
│       ├── theme.css                   # 主题样式
│       └── fonts.css                   # 字体配置
├── .env.example                        # 环境变量示例
├── DEPLOYMENT.md                       # 部署指南
└── README.md                           # 项目说明
```

---

## 🚀 快速开始

### 前置要求

- Node.js 18+ 
- npm 或 pnpm
- Supabase 账号

### 本地开发

1. **克隆或下载项目**
   ```bash
   # 如果从 Figma Make 下载，解压 ZIP 文件
   cd campus-zoo
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **配置环境变量**
   
   复制 `.env.example` 为 `.env` 并填写你的 Supabase 配置：
   ```bash
   cp .env.example .env
   ```
   
   编辑 `.env`：
   ```
   VITE_SUPABASE_URL=https://你的项目ID.supabase.co
   VITE_SUPABASE_ANON_KEY=你的匿名公钥
   ```

4. **配置 Supabase 数据库**
   
   参考 [DEPLOYMENT.md](./DEPLOYMENT.md) 中的数据库设置说明

5. **启动开发服务器**
   ```bash
   npm run dev
   ```
   
   访问 `http://localhost:5173`

---

## 📤 部署

详细部署步骤请参考 [DEPLOYMENT.md](./DEPLOYMENT.md)

### 快速部署到 Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. 点击上方按钮
2. 连接 GitHub 仓库
3. 配置环境变量
4. 点击 Deploy

---

## 🗄️ 数据库结构

### animals 表
| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| name | TEXT | 宠物名字 |
| species | TEXT | 种类（cat/dog） |
| image_url | TEXT | 图片 URL |
| location | TEXT | 常出没地点 |
| personality | TEXT | 性格描述 |
| first_seen | DATE | 首次发现日期 |
| likes | INTEGER | 点赞数 |
| attacks | INTEGER | 攻击数 |
| comment_count | INTEGER | 评论数 |

### comments 表
| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| animal_id | UUID | 宠物 ID（外键） |
| user_name | TEXT | 评论者昵称 |
| content | TEXT | 评论内容 |
| created_at | TIMESTAMP | 创建时间 |

### submissions 表
| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| name | TEXT | 宠物名字 |
| species | TEXT | 种类 |
| image_url | TEXT | 图片 URL |
| location | TEXT | 地点 |
| personality | TEXT | 性格 |
| submitter_name | TEXT | 投稿人 |
| submitter_contact | TEXT | 联系方式 |
| status | TEXT | 状态（pending/approved/rejected） |

---

## 🎨 主题定制

项目使用 Tailwind CSS v4，主题配置在 `/src/styles/theme.css`：

```css
:root {
  --color-primary: #8B6B47;     /* 棕色主题色 */
  --color-accent: #D4A574;      /* 浅棕色强调色 */
  --color-background: #FFF8F0;  /* 温暖的背景色 */
}
```

---

## 📸 截图

### 主页
![主页](https://via.placeholder.com/800x400/8B6B47/FFFFFF?text=Home+Page)

### 宠物详情页
![详情页](https://via.placeholder.com/800x400/D4A574/FFFFFF?text=Detail+Page)

### 投稿表单
![投稿](https://via.placeholder.com/800x400/FFF8F0/8B6B47?text=Submission+Form)

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

## 📄 许可证

MIT License

---

## 💌 联系方式

如有问题或建议，欢迎联系：

- 📧 Email: your-email@example.com
- 🐱 GitHub: [@yourusername](https://github.com/yourusername)

---

<p align="center">
  用 ❤️ 为校园小动物们制作
</p>
