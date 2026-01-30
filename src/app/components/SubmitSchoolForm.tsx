import { useState } from 'react';
import type { SchoolSubmission } from '@/app/types';
import { X, AlertCircle } from 'lucide-react';

interface SubmitSchoolFormProps {
  onSubmit: (submission: Omit<SchoolSubmission, 'id' | 'timestamp' | 'status'>) => void;
  onClose: () => void;
}

export function SubmitSchoolForm({ onSubmit, onClose }: SubmitSchoolFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    logoUrl: '',
    websiteUrl: '',
    submitterName: '',
    submitterContact: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = '请输入学校名称';
    if (!formData.description.trim()) newErrors.description = '请输入学校描述';
    if (!formData.address.trim()) newErrors.address = '请输入学校地址';
    if (!formData.submitterName.trim()) newErrors.submitterName = '请输入您的称呼';
    if (!formData.submitterContact.trim()) newErrors.submitterContact = '请输入联系方式';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    onSubmit(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-blue-200 flex items-center justify-between rounded-t-3xl">
          <div>
            <h2 className="text-2xl font-bold text-blue-900">🏫 添加新学校</h2>
            <p className="text-sm text-muted-foreground mt-1">让更多校园加入萌宠社区</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/50 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <span>🎓</span>
              <span>学校信息</span>
            </h3>

            <div>
              <label className="block text-sm font-medium mb-2">
                学校名称 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`w-full px-4 py-2.5 border-2 rounded-xl focus:outline-none focus:border-primary transition-colors ${
                  errors.name ? 'border-red-300 bg-red-50' : 'border-gray-200'
                }`}
                placeholder="例如：清华大学"
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                学校地址 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className={`w-full px-4 py-2.5 border-2 rounded-xl focus:outline-none focus:border-primary transition-colors ${
                  errors.address ? 'border-red-300 bg-red-50' : 'border-gray-200'
                }`}
                placeholder="例如：北京市海淀区清华园1号"
              />
              {errors.address && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.address}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                学校简介 <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className={`w-full px-4 py-2.5 border-2 rounded-xl focus:outline-none focus:border-primary transition-colors resize-none ${
                  errors.description ? 'border-red-300 bg-red-50' : 'border-gray-200'
                }`}
                placeholder="简单介绍一下这所学校..."
              />
              {errors.description && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.description}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                学校网址（可选）
              </label>
              <input
                type="url"
                value={formData.websiteUrl}
                onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-colors"
                placeholder="https://example.edu.cn"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                学校徽标链接（可选）
              </label>
              <input
                type="url"
                value={formData.logoUrl}
                onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-colors"
                placeholder="https://example.com/logo.png"
              />
            </div>
          </div>

          {/* 投稿者信息 */}
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <span>👤</span>
              <span>您的信息</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  您的称呼 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.submitterName}
                  onChange={(e) => setFormData({ ...formData, submitterName: e.target.value })}
                  className={`w-full px-4 py-2.5 border-2 rounded-xl focus:outline-none focus:border-primary transition-colors ${
                    errors.submitterName ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                  placeholder="您的名字或昵称"
                />
                {errors.submitterName && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.submitterName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  联系方式 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.submitterContact}
                  onChange={(e) => setFormData({ ...formData, submitterContact: e.target.value })}
                  className={`w-full px-4 py-2.5 border-2 rounded-xl focus:outline-none focus:border-primary transition-colors ${
                    errors.submitterContact ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                  placeholder="邮箱或微信"
                />
                {errors.submitterContact && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.submitterContact}
                  </p>
                )}
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-sm text-blue-800">
                <strong>📌 提示：</strong>
                <br />
                提交后需要管理员审核。审核通过后，该学校将出现在学校列表中。
              </p>
            </div>
          </div>

          {/* 按钮 */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl font-medium hover:from-blue-600 hover:to-indigo-600 transition-colors shadow-lg hover:shadow-xl"
            >
              提交申请
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
