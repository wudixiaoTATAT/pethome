# 宠物数据文件夹结构说明

## 📁 文件夹结构

每只宠物都有自己的专属文件夹，文件夹命名格式为：`{id}-{拼音名字}`

```
pets/
├── 1-xiaoju/          # 小橘的文件夹
│   ├── info.ts        # 宠物基本信息
│   ├── comments.ts    # 评论数据
│   └── posts.ts       # 动态数据
├── 2-dahuang/         # 大黄的文件夹
│   ├── info.ts
│   ├── comments.ts
│   └── posts.ts
├── 3-huahua/          # 花花的文件夹
│   ├── info.ts
│   ├── comments.ts
│   └── posts.ts
└── ...
```

## 📝 文件说明

### info.ts - 宠物基本信息
包含宠物的所有基本信息：
- id: 唯一标识符
- name: 宠物名字
- type: 类型（cat/dog/other）
- breed: 品种
- description: 描述
- imageUrl: 图片链接
- location: 位置
- school: 学校
- friendliness: 友好度（1-5）
- likes: 点赞数

### comments.ts - 评论数据
包含该宠物的所有评论

### posts.ts - 动态数据
包含该宠物的所有日常动态

## 🖼️ 关于图片

目前图片使用的是 Unsplash 的在线图片链接。如果你想使用本地图片：

1. 在宠物文件夹中添加图片文件，例如：`1-xiaoju/image.jpg`
2. 在 `info.ts` 中更新 `imageUrl` 字段
3. 导入图片：`import petImage from './image.jpg'`
4. 使用：`imageUrl: petImage`

## ➕ 如何添加新宠物

1. 在 `pets/` 文件夹下创建新的文件夹，例如：`10-xinchongwu/`
2. 在新文件夹中创建三个文件：
   - `info.ts` - 复制其他宠物的模板，修改信息
   - `comments.ts` - 初始为空数组 `[]`
   - `posts.ts` - 初始为空数组 `[]`
3. 在 `index.ts` 中导入新宠物的数据
4. 将新宠物添加到 `allPets` 数组中

## 🔄 数据更新

当用户在网站上添加评论或动态时，数据会保存在组件的 state 中。刷新页面后会重置为文件中的初始数据。

如果需要持久化存储，可以考虑：
- 使用 localStorage
- 连接后端数据库（如 Supabase）
- 使用其他数据存储方案
