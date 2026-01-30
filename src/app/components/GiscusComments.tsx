import Giscus from '@giscus/react';
import { giscusConfig, isGiscusConfigured } from '@/app/config/giscus';

interface GiscusCommentsProps {
  petId: string;
  petName: string;
}

export function GiscusComments({ petId, petName }: GiscusCommentsProps) {
  const configured = isGiscusConfigured();

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4 text-primary">💬 与大家一起聊聊 {petName}</h3>
      <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-border">
        {configured ? (
          <Giscus
            id={`pet-${petId}`}
            repo={giscusConfig.repo as `${string}/${string}`}
            repoId={giscusConfig.repoId}
            category={giscusConfig.category}
            categoryId={giscusConfig.categoryId}
            mapping={giscusConfig.mapping}
            term={`pet-${petId}`}
            reactionsEnabled={giscusConfig.reactionsEnabled}
            emitMetadata={giscusConfig.emitMetadata}
            inputPosition={giscusConfig.inputPosition}
            theme={giscusConfig.theme}
            lang={giscusConfig.lang}
            loading={giscusConfig.loading}
          />
        ) : (
          <div className="p-6 bg-amber-50 border-2 border-amber-300 rounded-xl text-center">
            <div className="text-4xl mb-3">⚙️</div>
            <h4 className="font-semibold text-amber-900 mb-2">Giscus 评论系统未配置</h4>
            <p className="text-sm text-amber-700 mb-4">
              请先配置 Giscus 以启用 GitHub 登录评论功能
            </p>
          </div>
        )}
        
        <div className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl">
          <p className="text-sm text-amber-800 leading-relaxed">
            <strong className="flex items-center gap-2 mb-2">
              <span>💡</span>
              <span>配置指南</span>
            </strong>
            
            <ol className="space-y-2 ml-6 list-decimal">
              <li>
                访问 <a href="https://giscus.app/zh-CN" target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:underline font-medium">giscus.app</a> 进行配置
              </li>
              <li>在你的 GitHub 仓库中启用 <strong>Discussions</strong> 功能</li>
              <li>安装 <a href="https://github.com/apps/giscus" target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:underline font-medium">Giscus GitHub App</a></li>
              <li>按照网站指引获取配置参数</li>
              <li>编辑 <code className="bg-amber-100 px-2 py-1 rounded text-xs font-mono">/src/app/config/giscus.ts</code> 文件，填入你的配置</li>
            </ol>
            
            <div className="mt-3 pt-3 border-t border-amber-200">
              <p className="text-xs text-amber-700">
                ✅ <strong>优势：</strong>使用 GitHub 账号登录，自动防垃圾评论，完全免费
                <br />
                🔒 <strong>隐私：</strong>每位访客需要登录 GitHub 才能发表评论和点赞
              </p>
            </div>
          </p>
        </div>
      </div>
    </div>
  );
}