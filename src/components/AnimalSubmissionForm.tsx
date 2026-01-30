import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Upload, X, Loader2 } from 'lucide-react';

interface AnimalSubmissionFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function AnimalSubmissionForm({ onClose, onSuccess }: AnimalSubmissionFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    personality: '',
    type: 'cat' as 'cat' | 'dog' | 'other',
    breed: '',
    school: '',
    submitterName: '',
    submitterContact: '',
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      let imageUrl = '';

      // 1. 上传图片到 Supabase Storage
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('animal-photos')
          .upload(fileName, imageFile);

        if (uploadError) {
          throw new Error(`图片上传失败: ${uploadError.message}`);
        }

        // 获取公开 URL
        const { data: { publicUrl } } = supabase.storage
          .from('animal-photos')
          .getPublicUrl(fileName);

        imageUrl = publicUrl;
      } else {
        throw new Error('请选择一张图片');
      }

      // 2. 将数据存入 submissions 表
      const { error: insertError } = await supabase
        .from('submissions')
        .insert([{
          animal_name: formData.name,
          location: formData.location,
          personality: formData.personality,
          image_url: imageUrl,
          type: formData.type,
          breed: formData.breed || null,
          school: formData.school || null,
          submitter_name: formData.submitterName,
          submitter_contact: formData.submitterContact,
          status: 'pending'
        }]);

      if (insertError) {
        throw new Error(`提交失败: ${insertError.message}`);
      }

      // 成功
      alert('投稿成功！感谢您的贡献，我们会尽快审核。');
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || '提交失败，请重试');
      console.error('提交错误:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-amber-50 to-yellow-50 p-6 border-b border-amber-200 flex items-center justify-between rounded-t-3xl">
          <div>
            <h2 className="text-2xl font-bold text-primary">🐾 投稿新萌宠</h2>
            <p className="text-sm text-muted-foreground mt-1">分享你遇见的校园小可爱</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/50 rounded-full transition-colors"
            type="button"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* 错误信息 */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          {/* 图片上传 */}
          <div>
            <label className="block text-sm font-medium mb-2">
              <Upload className="w-4 h-4 inline mr-1" />
              上传照片 <span className="text-red-500">*</span>
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-primary transition-colors">
              {imagePreview ? (
                <div className="relative">
                  <img 
                    src={imagePreview} 
                    alt="预览" 
                    className="max-h-64 mx-auto rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview('');
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer block">
                  <div className="text-4xl mb-2">📸</div>
                  <p className="text-sm text-muted-foreground mb-2">
                    点击上传或拖拽图片到这里
                  </p>
                  <p className="text-xs text-muted-foreground">
                    支持 JPG、PNG、WEBP 格式
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    required
                  />
                </label>
              )}
            </div>
          </div>

          {/* 基本信息 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                宠物名字 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-colors"
                placeholder="例如：小橘"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                动物类型 <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-colors"
                required
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
                品种（可选）
              </label>
              <input
                type="text"
                value={formData.breed}
                onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-colors"
                placeholder="例如：橘猫、金毛"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                所在学校（可选）
              </label>
              <input
                type="text"
                value={formData.school}
                onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-colors"
                placeholder="例如：清华大学"
              />
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
              className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-colors"
              placeholder="例如：图书馆门口、食堂附近"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              性格描述 <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.personality}
              onChange={(e) => setFormData({ ...formData, personality: e.target.value })}
              rows={4}
              className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-colors resize-none"
              placeholder="描述一下这只萌宠的特点、性格等..."
              required
            />
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
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-colors"
                  placeholder="您的名字或昵称"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  联系方式 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.submitterContact}
                  onChange={(e) => setFormData({ ...formData, submitterContact: e.target.value })}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-colors"
                  placeholder="邮箱或微信"
                  required
                />
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
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-xl font-medium hover:from-amber-600 hover:to-yellow-600 transition-colors shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  提交中...
                </>
              ) : (
                '提交投稿'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
