import { useState } from 'react';
import type { PetSubmission, SchoolSubmission } from '@/app/types';
import { X, Check, XCircle, Calendar, User, Mail } from 'lucide-react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface AdminPanelProps {
  petSubmissions: PetSubmission[];
  schoolSubmissions: SchoolSubmission[];
  onApprovePet: (id: string) => void;
  onRejectPet: (id: string) => void;
  onApproveSchool: (id: string) => void;
  onRejectSchool: (id: string) => void;
  onClose: () => void;
}

export function AdminPanel({
  petSubmissions,
  schoolSubmissions,
  onApprovePet,
  onRejectPet,
  onApproveSchool,
  onRejectSchool,
  onClose,
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'pets' | 'schools'>('pets');

  const pendingPets = petSubmissions.filter(s => s.status === 'pending');
  const pendingSchools = schoolSubmissions.filter(s => s.status === 'pending');

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 border-b border-purple-200 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-purple-900">🛡️ 管理员审核面板</h2>
            <p className="text-sm text-muted-foreground mt-1">
              待审核: {pendingPets.length} 只萌宠 · {pendingSchools.length} 所学校
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/50 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('pets')}
            className={`flex-1 px-6 py-4 font-medium transition-colors relative ${
              activeTab === 'pets'
                ? 'text-primary border-b-2 border-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            🐾 萌宠投稿
            {pendingPets.length > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-amber-500 text-white text-xs rounded-full">
                {pendingPets.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('schools')}
            className={`flex-1 px-6 py-4 font-medium transition-colors relative ${
              activeTab === 'schools'
                ? 'text-primary border-b-2 border-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            🏫 学校申请
            {pendingSchools.length > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full">
                {pendingSchools.length}
              </span>
            )}
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'pets' && (
            <div className="space-y-4">
              {pendingPets.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <div className="text-4xl mb-3">✅</div>
                  <p>暂无待审核的萌宠投稿</p>
                </div>
              ) : (
                pendingPets.map((submission) => (
                  <div
                    key={submission.id}
                    className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl p-6 border-2 border-amber-200"
                  >
                    <div className="flex gap-6">
                      {/* Image */}
                      <div className="flex-shrink-0">
                        <img
                          src={submission.imageUrl}
                          alt={submission.name}
                          className="w-32 h-32 object-cover rounded-xl"
                          onError={(e) => {
                            e.currentTarget.src = 'https://via.placeholder.com/150?text=No+Image';
                          }}
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 space-y-3">
                        <div>
                          <h3 className="text-xl font-bold text-primary flex items-center gap-2">
                            {submission.name}
                            <span className="text-sm font-normal px-2 py-1 bg-amber-200 rounded-lg">
                              {submission.type === 'cat' ? '🐱 猫咪' : submission.type === 'dog' ? '🐶 狗狗' : '🦢 其他'}
                            </span>
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {submission.breed} · {submission.location} · {submission.school}
                          </p>
                        </div>

                        <p className="text-sm">{submission.description}</p>

                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            投稿人：{submission.submitterName}
                          </span>
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {submission.submitterContact}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {format(submission.timestamp, 'yyyy-MM-dd HH:mm', { locale: zhCN })}
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 pt-2">
                          <button
                            onClick={() => onApprovePet(submission.id)}
                            className="px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors flex items-center gap-2 text-sm font-medium"
                          >
                            <Check className="w-4 h-4" />
                            通过
                          </button>
                          <button
                            onClick={() => onRejectPet(submission.id)}
                            className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors flex items-center gap-2 text-sm font-medium"
                          >
                            <XCircle className="w-4 h-4" />
                            拒绝
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'schools' && (
            <div className="space-y-4">
              {pendingSchools.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <div className="text-4xl mb-3">✅</div>
                  <p>暂无待审核的学校申请</p>
                </div>
              ) : (
                pendingSchools.map((submission) => (
                  <div
                    key={submission.id}
                    className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-200"
                  >
                    <div className="space-y-3">
                      <div>
                        <h3 className="text-xl font-bold text-blue-900">{submission.name}</h3>
                        <p className="text-sm text-muted-foreground">{submission.address}</p>
                      </div>

                      <p className="text-sm">{submission.description}</p>

                      {submission.websiteUrl && (
                        <p className="text-sm">
                          <strong>网址：</strong>
                          <a href={submission.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            {submission.websiteUrl}
                          </a>
                        </p>
                      )}

                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          申请人：{submission.submitterName}
                        </span>
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {submission.submitterContact}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {format(submission.timestamp, 'yyyy-MM-dd HH:mm', { locale: zhCN })}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={() => onApproveSchool(submission.id)}
                          className="px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors flex items-center gap-2 text-sm font-medium"
                        >
                          <Check className="w-4 h-4" />
                          通过
                        </button>
                        <button
                          onClick={() => onRejectSchool(submission.id)}
                          className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors flex items-center gap-2 text-sm font-medium"
                        >
                          <XCircle className="w-4 h-4" />
                          拒绝
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
