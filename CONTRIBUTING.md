# 🤝 贡献指南

感谢你对校园动物档案馆项目的关注！我们欢迎所有形式的贡献。

## 如何贡献

### 报告 Bug

如果你发现了 Bug，请：

1. 在 GitHub Issues 中搜索，确认问题还没有被报告
2. 创建新 Issue，包含：
   - 清晰的标题和描述
   - 重现步骤
   - 期望行为 vs 实际行为
   - 截图（如果适用）
   - 环境信息（浏览器、操作系统等）

### 提出新功能

有好的想法？欢迎：

1. 在 Issues 中创建 Feature Request
2. 描述功能的用途和价值
3. 提供可能的实现方案（可选）

### 提交代码

#### 开发环境设置

```bash
# 1. Fork 并克隆项目
git clone https://github.com/YOUR_USERNAME/campus-zoo.git
cd campus-zoo

# 2. 安装依赖
npm install

# 3. 配置 Supabase（参考 QUICKSTART.md）
cp .env.example .env.local
# 填入你的 Supabase 凭据

# 4. 启动开发服务器
npm run dev
```

#### 代码规范

- 使用 TypeScript
- 遵循现有代码风格
- 组件使用函数式组件 + Hooks
- 使用 Tailwind CSS 进行样式设计
- 保持代码简洁易读

#### 提交流程

1. **创建分支**
```bash
git checkout -b feature/your-feature-name
# 或
git checkout -b fix/bug-description
```

2. **进行更改**
- 编写代码
- 测试功能
- 确保现有功能不受影响

3. **提交更改**
```bash
git add .
git commit -m "feat: add amazing feature"
# 或
git commit -m "fix: resolve issue with comments"
```

提交信息格式：
- `feat:` 新功能
- `fix:` Bug 修复
- `docs:` 文档更新
- `style:` 代码格式调整
- `refactor:` 重构
- `test:` 测试相关
- `chore:` 构建/工具更新

4. **推送分支**
```bash
git push origin feature/your-feature-name
```

5. **创建 Pull Request**
- 访问 GitHub 仓库
- 点击 "New Pull Request"
- 选择你的分支
- 填写 PR 描述
- 提交审核

#### Pull Request 要求

- [ ] 代码通过构建测试
- [ ] 功能在本地测试通过
- [ ] 更新了相关文档
- [ ] 提交信息清晰明确
- [ ] 遵循项目代码规范

## 开发指南

### 项目结构

```
src/
├── app/
│   ├── components/      # React 组件
│   │   ├── animal-card.tsx
│   │   ├── animal-detail.tsx
│   │   ├── comment-section.tsx
│   │   └── submission-form.tsx
│   └── App.tsx         # 主应用
├── lib/
│   ├── supabase.ts     # Supabase 客户端
│   └── types.ts        # TypeScript 类型
└── styles/
    └── theme.css       # 全局样式
```

### 添加新组件

1. 在 `src/app/components/` 创建组件文件
2. 使用 TypeScript 定义 props 接口
3. 导出组件
4. 在需要的地方导入使用

示例：

```typescript
// src/app/components/my-component.tsx
interface MyComponentProps {
  title: string;
  onAction: () => void;
}

export function MyComponent({ title, onAction }: MyComponentProps) {
  return (
    <div className="rounded-xl bg-white p-4">
      <h2>{title}</h2>
      <button onClick={onAction}>Click Me</button>
    </div>
  );
}
```

### 数据库操作

使用 Supabase 客户端进行数据操作：

```typescript
import { supabase } from '@/lib/supabase';

// 查询
const { data, error } = await supabase
  .from('animals')
  .select('*')
  .eq('type', 'cat');

// 插入
const { error: insertError } = await supabase
  .from('animals')
  .insert({ name: '小橘', ... });

// 更新
const { error: updateError } = await supabase
  .from('animals')
  .update({ likes: likes + 1 })
  .eq('id', animalId);
```

### 实时订阅

```typescript
useEffect(() => {
  const subscription = supabase
    .channel('my_channel')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'animals',
      },
      (payload) => {
        // 处理更新
      }
    )
    .subscribe();

  return () => {
    subscription.unsubscribe();
  };
}, []);
```

### 样式指南

使用 Tailwind CSS 实用类：

```tsx
<div className="rounded-2xl bg-white p-6 shadow-lg">
  <h3 className="text-lg font-semibold text-stone-800">
    Title
  </h3>
  <p className="text-stone-600">
    Description
  </p>
</div>
```

主题色：
- 主色：`amber-500`, `orange-500`（温暖的棕橘色）
- 文字：`stone-800`, `stone-600`
- 背景：`stone-50`, `white`
- 边框：`stone-200`, `stone-300`

### 错误处理

```typescript
try {
  const { data, error } = await supabase
    .from('animals')
    .select('*');

  if (error) throw error;
  
  // 处理数据
} catch (error: any) {
  console.error('Error:', error);
  toast.error('操作失败，请重试');
}
```

## 功能开发建议

### 优先级高的功能

1. **管理员审核面板**
   - 查看待审核投稿
   - 批准/拒绝投稿
   - 编辑动物信息

2. **用户认证**
   - 使用 Supabase Auth
   - 邮箱/社交登录
   - 用户个人主页

3. **图片优化**
   - 客户端压缩
   - 响应式图片
   - 懒加载

4. **评论功能增强**
   - 点赞评论
   - 回复评论
   - 举报功能

### 中等优先级

5. **搜索优化**
   - 全文搜索
   - 智能推荐
   - 热门标签

6. **数据导出**
   - CSV 导出
   - 打印友好视图
   - 分享功能

7. **PWA 支持**
   - 离线访问
   - 安装到桌面
   - 推送通知

### 未来规划

8. **多语言支持** (i18n)
9. **深色模式** 优化
10. **数据可视化** 面板
11. **AI 功能**（识别品种、生成描述）

## 测试

### 手动测试清单

开发新功能时，请测试：

- [ ] 桌面端显示
- [ ] 移动端显示
- [ ] 不同浏览器（Chrome、Firefox、Safari）
- [ ] 网络慢速情况
- [ ] 错误情况处理

### 未来计划

- 添加单元测试
- 添加端到端测试
- CI/CD 集成

## 代码审查

所有 Pull Request 都需要经过审查。审查者会检查：

- 代码质量和可读性
- 是否遵循项目规范
- 功能完整性
- 潜在的性能问题
- 安全性

## 文档

如果你的贡献涉及：

- 新功能 → 更新 README.md
- API 变更 → 更新相关文档
- 配置变更 → 更新 QUICKSTART.md
- 部署相关 → 更新 DEPLOYMENT.md

## 社区准则

- 尊重他人
- 保持友好和专业
- 欢迎新手
- 及时响应反馈
- 遵守开源协议

## 获取帮助

遇到问题？

1. 查看现有文档
2. 搜索 Issues
3. 在 Discussions 提问
4. 联系维护者

## 许可证

贡献的代码将遵循项目的 MIT 许可证。

---

**感谢你的贡献！** 🙏

每一个贡献，无论大小，都让这个项目变得更好 🐾
