import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, CheckCircle, XCircle, Copy, ExternalLink, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

export function SetupGuidePage() {
  const navigate = useNavigate();
  const [copied, setCopied] = useState<string | null>(null);

  const projectId = 'qbglfhdvkrhxspwrbsgq';

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    toast.success('已复制到剪贴板');
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-amber-50">
      {/* 返回按钮 */}
      <button
        onClick={() => navigate('/')}
        className="fixed top-6 left-6 z-50 flex items-center gap-2 rounded-full bg-white/80 backdrop-blur-sm px-4 py-2 text-red-700 shadow-lg transition-all hover:bg-white hover:shadow-xl"
      >
        <ArrowLeft className="h-4 w-4" />
        返回首页
      </button>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* 头部警告 */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 inline-flex items-center justify-center rounded-full bg-red-100 p-4">
            <AlertTriangle className="h-12 w-12 text-red-600" />
          </div>
          <h1 className="mb-2 text-3xl font-bold text-red-600">
            ⚠️ "Email not confirmed" 错误修复
          </h1>
          <p className="text-stone-600">
            请按照以下步骤在 Supabase Dashboard 中修复此问题
          </p>
        </div>

        {/* 主要内容 */}
        <div className="space-y-6">
          {/* 步骤 1 */}
          <div className="rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-lg font-bold text-red-600">
                1
              </div>
              <div className="flex-1">
                <h2 className="mb-2 text-xl font-bold text-stone-800">
                  打开 Supabase Dashboard
                </h2>
                <p className="mb-4 text-stone-600">
                  点击下面的按钮直接访问邮箱验证设置页面
                </p>
                <a
                  href={`https://supabase.com/dashboard/project/${projectId}/auth/providers`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-red-500 to-orange-500 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:shadow-xl"
                >
                  打开 Supabase Dashboard
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>

          {/* 步骤 2 */}
          <div className="rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100 text-lg font-bold text-orange-600">
                2
              </div>
              <div className="flex-1">
                <h2 className="mb-2 text-xl font-bold text-stone-800">
                  禁用邮箱验证
                </h2>
                <p className="mb-4 text-stone-600">
                  在打开的页面中，找到 Email Provider，然后：
                </p>
                <div className="space-y-3 rounded-lg bg-orange-50 p-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-orange-600" />
                    <span className="text-stone-700">找到 <strong>"Confirm email"</strong> 开关</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-orange-600" />
                    <span className="text-stone-700">将开关设置为 <strong>OFF</strong>（灰色/关闭状态）</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-orange-600" />
                    <span className="text-stone-700">滚动到页面底部，点击 <strong>Save</strong> 按钮</span>
                  </div>
                </div>
                <div className="mt-4 rounded-lg border-2 border-orange-200 bg-white p-4">
                  <p className="text-sm font-medium text-orange-800">
                    📍 路径：Authentication → Providers → Email → Confirm email (OFF)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 步骤 3 */}
          <div className="rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-lg font-bold text-amber-600">
                3
              </div>
              <div className="flex-1">
                <h2 className="mb-2 text-xl font-bold text-stone-800">
                  确认现有用户（如果已注册过账号）
                </h2>
                <p className="mb-4 text-stone-600">
                  如果您之前注册过账号，需要执行以下 SQL 来确认邮箱：
                </p>
                
                {/* SQL 编辑器链接 */}
                <div className="mb-4">
                  <a
                    href={`https://supabase.com/dashboard/project/${projectId}/sql/new`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2 font-medium text-white shadow-md transition-all hover:shadow-lg"
                  >
                    打开 SQL Editor
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>

                {/* SQL 代码 */}
                <div className="relative rounded-lg bg-stone-900 p-4">
                  <button
                    onClick={() => copyToClipboard(
                      `-- 确认所有未验证的用户\nUPDATE auth.users \nSET email_confirmed_at = NOW(), confirmed_at = NOW()\nWHERE email_confirmed_at IS NULL;\n\n-- 查看结果\nSELECT email, \n       CASE WHEN email_confirmed_at IS NOT NULL \n            THEN '✅ 已确认' \n            ELSE '❌ 未确认' \n       END as status\nFROM auth.users;`,
                      'sql'
                    )}
                    className="absolute right-2 top-2 rounded-md bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
                  >
                    {copied === 'sql' ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                  <pre className="overflow-x-auto text-sm text-green-400">
                    <code>{`-- 确认所有未验证的用户
UPDATE auth.users 
SET email_confirmed_at = NOW(), 
    confirmed_at = NOW()
WHERE email_confirmed_at IS NULL;

-- 查看结果
SELECT email, 
       CASE WHEN email_confirmed_at IS NOT NULL 
            THEN '✅ 已确认' 
            ELSE '❌ 未确认' 
       END as status
FROM auth.users;`}</code>
                  </pre>
                </div>

                <div className="mt-4 space-y-2 text-sm text-stone-600">
                  <p>1. 点击上面的 "打开 SQL Editor" 按钮</p>
                  <p>2. 点击代码框右上角的复制按钮</p>
                  <p>3. 粘贴到 SQL Editor 中</p>
                  <p>4. 点击 "Run" 按钮执行</p>
                </div>
              </div>
            </div>
          </div>

          {/* 步骤 4 */}
          <div className="rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100 text-lg font-bold text-green-600">
                4
              </div>
              <div className="flex-1">
                <h2 className="mb-2 text-xl font-bold text-stone-800">
                  清除缓存并测试
                </h2>
                <p className="mb-4 text-stone-600">
                  完成上述步骤后，请清除浏览器缓存并测试：
                </p>
                <div className="space-y-3">
                  <div className="rounded-lg bg-green-50 p-4">
                    <p className="mb-2 font-medium text-green-800">清除缓存：</p>
                    <ul className="space-y-1 text-sm text-stone-700">
                      <li>• Windows: <code className="rounded bg-white px-2 py-1">Ctrl + Shift + Delete</code></li>
                      <li>• Mac: <code className="rounded bg-white px-2 py-1">Cmd + Shift + Delete</code></li>
                    </ul>
                  </div>
                  <div className="rounded-lg bg-blue-50 p-4">
                    <p className="mb-2 font-medium text-blue-800">测试步骤：</p>
                    <ul className="space-y-1 text-sm text-stone-700">
                      <li>• 刷新页面（F5）</li>
                      <li>• 尝试登录或注册</li>
                      <li>• 应该能成功登录 ✅</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 检查清单 */}
          <div className="rounded-2xl bg-gradient-to-r from-green-50 to-emerald-50 p-6 shadow-xl">
            <h2 className="mb-4 text-xl font-bold text-green-800">
              ✅ 完成检查清单
            </h2>
            <div className="space-y-3">
              <label className="flex items-center gap-3 rounded-lg bg-white p-3 transition-colors hover:bg-green-50">
                <input type="checkbox" className="h-5 w-5 rounded border-green-300 text-green-600" />
                <span className="text-stone-700">已打开 Supabase Dashboard</span>
              </label>
              <label className="flex items-center gap-3 rounded-lg bg-white p-3 transition-colors hover:bg-green-50">
                <input type="checkbox" className="h-5 w-5 rounded border-green-300 text-green-600" />
                <span className="text-stone-700">已将 "Confirm email" 设置为 OFF</span>
              </label>
              <label className="flex items-center gap-3 rounded-lg bg-white p-3 transition-colors hover:bg-green-50">
                <input type="checkbox" className="h-5 w-5 rounded border-green-300 text-green-600" />
                <span className="text-stone-700">已点击 Save 保存更改</span>
              </label>
              <label className="flex items-center gap-3 rounded-lg bg-white p-3 transition-colors hover:bg-green-50">
                <input type="checkbox" className="h-5 w-5 rounded border-green-300 text-green-600" />
                <span className="text-stone-700">已执行 SQL 确认现有用户（如果有）</span>
              </label>
              <label className="flex items-center gap-3 rounded-lg bg-white p-3 transition-colors hover:bg-green-50">
                <input type="checkbox" className="h-5 w-5 rounded border-green-300 text-green-600" />
                <span className="text-stone-700">已清除浏览器缓存</span>
              </label>
              <label className="flex items-center gap-3 rounded-lg bg-white p-3 transition-colors hover:bg-green-50">
                <input type="checkbox" className="h-5 w-5 rounded border-green-300 text-green-600" />
                <span className="text-stone-700">已测试登录功能</span>
              </label>
            </div>
          </div>

          {/* 常见问题 */}
          <div className="rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="mb-4 text-xl font-bold text-stone-800">
              ❓ 常见问题
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="mb-2 font-semibold text-stone-700">Q: 为什么不能在代码中修复？</h3>
                <p className="text-sm text-stone-600">
                  A: 这是 Supabase 服务端的配置问题，前端代码无法绕过邮箱验证检查。必须在 Dashboard 中修改配置。
                </p>
              </div>
              <div>
                <h3 className="mb-2 font-semibold text-stone-700">Q: 禁用邮箱验证安全吗？</h3>
                <p className="text-sm text-stone-600">
                  A: 对于校园内部网站是安全的。邮箱仍然必须唯一，只是不需要验证真实性。如果网站对外公开，建议配置 SMTP 并启用邮箱验证。
                </p>
              </div>
              <div>
                <h3 className="mb-2 font-semibold text-stone-700">Q: 如果还是不行怎么办？</h3>
                <p className="text-sm text-stone-600">
                  A: 请确认所有步骤都已完成，特别是点击了 Save 按钮。如果问题仍然存在，请查看详细文档 <code className="rounded bg-stone-100 px-2 py-1">/URGENT_FIX_EMAIL_CONFIRMED.md</code>
                </p>
              </div>
            </div>
          </div>

          {/* 底部提示 */}
          <div className="rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 p-6 text-center">
            <p className="text-stone-600">
              完成以上步骤后，请点击下方按钮返回首页并测试登录功能
            </p>
            <button
              onClick={() => navigate('/')}
              className="mt-4 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 px-8 py-3 font-semibold text-white shadow-lg transition-all hover:shadow-xl"
            >
              返回首页测试
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
