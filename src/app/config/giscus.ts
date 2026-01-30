/**
 * Giscus 评论系统配置
 * 
 * 配置步骤：
 * 1. 访问 https://giscus.app/zh-CN
 * 2. 选择你的 GitHub 仓库（需要是公开仓库）
 * 3. 在仓库设置中启用 Discussions 功能
 * 4. 安装 Giscus GitHub App: https://github.com/apps/giscus
 * 5. 按照 giscus.app 网站的指引获取以下配置值
 */

export const giscusConfig = {
  // 你的 GitHub 用户名/仓库名，格式: "username/repo"
  repo: 'YOUR_GITHUB_USERNAME/YOUR_REPO_NAME',
  
  // 仓库 ID（从 giscus.app 获取）
  repoId: 'YOUR_REPO_ID',
  
  // Discussion 分类（建议创建一个专门的分类，如"宠物评论"）
  category: '宠物评论',
  
  // 分类 ID（从 giscus.app 获取）
  categoryId: 'YOUR_CATEGORY_ID',
  
  // 其他配置
  mapping: 'specific' as const,
  reactionsEnabled: '1',
  emitMetadata: '0',
  inputPosition: 'top' as const,
  theme: 'light',
  lang: 'zh-CN',
  loading: 'lazy' as const,
};

/**
 * 是否已配置 Giscus
 * 检查关键配置项是否已填写
 */
export const isGiscusConfigured = () => {
  return (
    giscusConfig.repo !== 'YOUR_GITHUB_USERNAME/YOUR_REPO_NAME' &&
    giscusConfig.repoId !== 'YOUR_REPO_ID' &&
    giscusConfig.categoryId !== 'YOUR_CATEGORY_ID'
  );
};
