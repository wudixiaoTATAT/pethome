import { useState } from 'react';
import { X, Upload, Camera } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/auth-context';
import { toast } from 'sonner';

interface SubmissionFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function SubmissionForm({ onClose, onSuccess }: SubmissionFormProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    personality: '',
    type: 'cat' as 'cat' | 'dog' | 'other',
    breed: '',
    school: '',
    submitter_name: '',
    submitter_contact: '',
  });
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error('图片大小不能超过 5MB');
        return;
      }
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      toast.error('请上传宠物照片');
      return;
    }

    setLoading(true);

    try {
      // 1. 上传图片到 Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `submissions/${fileName}`;

      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('animal-photos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. 获取公开 URL
      const { data: { publicUrl } } = supabase.storage
        .from('animal-photos')
        .getPublicUrl(filePath);

      // 3. 创建投稿记录
      const { error: insertError } = await supabase
        .from('submissions')
        .insert({
          animal_data: {
            name: formData.name,
            location: formData.location,
            personality: formData.personality,
            type: formData.type,
            breed: formData.breed,
            school: formData.school,
            image_url: publicUrl,
          },
          submitter_name: formData.submitter_name,
          submitter_contact: formData.submitter_contact,
          user_id: user?.id || null, // 添加 user_id
          status: 'pending',
        });

      if (insertError) throw insertError;

      toast.success('投稿成功！等待管理员审核');
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('提交失败:', error);
      toast.error(error.message || '投稿失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-8 shadow-2xl scrollbar-hide">
        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-stone-500 transition-all hover:bg-stone-100 hover:rotate-90"
        >
          <X className="h-6 w-6" />
        </button>

        {/* 标题 */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-stone-800">
            投稿萌宠 🐾
          </h2>
          <p className="mt-2 text-stone-600">
            发现可爱的校园小动物？快来分享给大家吧！
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 照片上传 */}
          <div>
            <label className="mb-2 block text-sm font-medium text-stone-700">
              宠物照片 *
            </label>
            <div className="relative">
              {preview ? (
                <div className="relative aspect-video w-full overflow-hidden rounded-xl">
                  <img
                    src={preview}
                    alt="预览"
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setPreview(null);
                      setFile(null);
                    }}
                    className="absolute right-2 top-2 rounded-full bg-white p-2 shadow-md transition-all hover:bg-stone-100 hover:rotate-90"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <label className="flex aspect-video w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-stone-300 bg-stone-50 transition-colors hover:border-amber-400 hover:bg-amber-50">
                  <Camera className="h-12 w-12 text-stone-400" />
                  <span className="mt-3 text-sm text-stone-600">
                    点击上传照片
                  </span>
                  <span className="mt-1 text-xs text-stone-500">
                    支持 JPG、PNG，最大 5MB
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </label>
              )}
            </div>
          </div>

          {/* 基本信息 */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-stone-700">
                动物名称 *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="例如：小橘"
                className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-stone-800 placeholder:text-stone-400 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-stone-700">
                发现地点 *
              </label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                placeholder="例如：教学楼A座"
                className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-stone-800 placeholder:text-stone-400 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-stone-700">
                动物类型 *
              </label>
              <select
                required
                value={formData.type}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    type: e.target.value as 'cat' | 'dog' | 'other',
                  })
                }
                className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-amber-600 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100 cursor-pointer font-medium"
              >
                <option value="cat" style={{ color: '#d97706' }}>🐱 猫咪</option>
                <option value="dog" style={{ color: '#d97706' }}>🐶 狗狗</option>
                <option value="other" style={{ color: '#d97706' }}>🐾 其他</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-stone-700">
                品种（可选）
              </label>
              <input
                type="text"
                value={formData.breed}
                onChange={(e) =>
                  setFormData({ ...formData, breed: e.target.value })
                }
                placeholder="例如：橘猫"
                className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-stone-800 placeholder:text-stone-400 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-stone-700">
              所属学校 *
            </label>
            <input
              type="text"
              required
              value={formData.school}
              onChange={(e) =>
                setFormData({ ...formData, school: e.target.value })
              }
              placeholder="例如：XX大学"
              className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-stone-800 placeholder:text-stone-400 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-stone-700">
              性格描述 *
            </label>
            <textarea
              required
              value={formData.personality}
              onChange={(e) =>
                setFormData({ ...formData, personality: e.target.value })
              }
              placeholder="描述一下这只小可爱的性格特点..."
              rows={4}
              className="w-full resize-none rounded-xl border border-stone-300 bg-white px-4 py-3 text-stone-800 placeholder:text-stone-400 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
            />
          </div>

          {/* 投稿人信息 */}
          <div className="rounded-xl bg-stone-50 p-6">
            <h3 className="mb-4 text-lg font-semibold text-stone-800">
              投稿人信息
            </h3>
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-stone-700">
                  您的昵称 *
                </label>
                <input
                  type="text"
                  required
                  value={formData.submitter_name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      submitter_name: e.target.value,
                    })
                  }
                  placeholder="请输入昵称"
                  className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-stone-800 placeholder:text-stone-400 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-stone-700">
                  联系方式 *
                </label>
                <input
                  type="text"
                  required
                  value={formData.submitter_contact}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      submitter_contact: e.target.value,
                    })
                  }
                  placeholder="邮箱或微信号"
                  className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-stone-800 placeholder:text-stone-400 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
                />
              </div>
            </div>
          </div>

          {/* 提交按钮 */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-stone-300 bg-white px-6 py-3 font-medium text-stone-700 transition-colors hover:bg-stone-50"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-3 font-medium text-white shadow-lg transition-all hover:shadow-xl disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Upload className="h-5 w-5 animate-spin" />
                  提交中...
                </span>
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