import { useState } from 'react';
import type { PetSubmission } from '@/app/types';
import { X, Upload, AlertCircle } from 'lucide-react';

interface SubmitPetFormProps {
  schools: string[];
  onSubmit: (submission: Omit<PetSubmission, 'id' | 'timestamp' | 'status'>) => void;
  onClose: () => void;
}

export function SubmitPetForm({ schools, onSubmit, onClose }: SubmitPetFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'cat' as 'cat' | 'dog' | 'other',
    breed: '',
    description: '',
    imageUrl: '',
    location: '',
    school: schools[0] || '',
    submitterName: '',
    submitterContact: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = '请输入宠物名字';
    if (!formData.breed.trim()) newErrors.breed = '请输入品种';
    if (!formData.description.trim()) newErrors.description = '请输入描述';
    if (!formData.imageUrl.trim()) newErrors.imageUrl = '请输入图片链接';
    if (!formData.location.trim()) newErrors.location = '请输入常出没地点';
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
        <div className="sticky top-0 bg-gradient-to-r from-amber-50 to-yellow-50 p-6 border-b border-amber-200 flex items-center justify-between rounded-t-3xl">
          <div>
            <h2 className="text-2xl font-bold text-primary">🐾 投稿新萌宠</h2>
            <p className="text-sm text-muted-foreground mt-1">分享你遇见的校园小可爱</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/50 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* 基本信息 */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <span>📝</span>
              <span>萌宠信息</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  宠物名字 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-4 py-2.5 border-2 rounded-xl focus:outline-none focus:border-primary transition-colors ${
                    errors.name ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                  placeholder="例如：小橘"
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
                  动物类型 <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-colors"
                >
                  <option value="cat">🐱 猫咪</option>
                  <option value="dog">🐶 狗狗</option>
                  <option value="other">🦢 其他</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  品种 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.breed}
                  onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                  className={`w-full px-4 py-2.5 border-2 rounded-xl focus:outline-none focus:border-primary transition-colors ${
                    errors.breed ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                  placeholder="例如：橘猫、金毛"
                />
                {errors.breed && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.breed}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  所在学校 <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.school}
                  onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-colors"
                >
                  {schools.map((school) => (
                    <option key={school} value={school}>
                      {school}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                常出没地点 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className={`w-full px-4 py-2.5 border-2 rounded-xl focus:outline-none focus:border-primary transition-colors ${
                  errors.location ? 'border-red-300 bg-red-50' : 'border-gray-200'
                }`}
                placeholder="例如：图书馆门口、食堂附近"
              />
              {errors.location && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.location}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                描述 <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className={`w-full px-4 py-2.5 border-2 rounded-xl focus:outline-none focus:border-primary transition-colors resize-none ${
                  errors.description ? 'border-red-300 bg-red-50' : 'border-gray-200'
                }`}
                placeholder="描述一下这只萌宠的特点、��格等..."
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
                <Upload className="w-4 h-4 inline mr-1" />
                图片链接 <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                className={`w-full px-4 py-2.5 border-2 rounded-xl focus:outline-none focus:border-primary transition-colors ${
                  errors.imageUrl ? 'border-red-300 bg-red-50' : 'border-gray-200'
                }`}
                placeholder="https://example.com/image.jpg"
              />
              {errors.imageUrl && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.imageUrl}
                </p>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                可以使用 Unsplash、imgur 等图床上传图片后粘贴链接
              </p>
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
                投稿后需要管理员审核通过才会显示在网站上。我们会通过您提供的联系方式与您沟通。
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
              className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-xl font-medium hover:from-amber-600 hover:to-yellow-600 transition-colors shadow-lg hover:shadow-xl"
            >
              提交投稿
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
