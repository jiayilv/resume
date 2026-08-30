import React, { useRef } from 'react';
import { UserProfile } from '../../types';
import { User, Phone, Mail, MapPin, Globe, Github, Camera, Upload, Trash2, Check } from 'lucide-react';

interface ProfileEditorProps {
  profile: UserProfile;
  onChange: (updated: UserProfile) => void;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
];

export const ProfileEditor: React.FC<ProfileEditorProps> = ({ profile, onChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFieldChange = (key: keyof UserProfile, value: any) => {
    onChange({ ...profile, [key]: value });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          handleFieldChange('avatar', event.target.result as string);
          handleFieldChange('showAvatar', true);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-4 text-xs">
      {/* Avatar Section */}
      <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
            <Camera className="w-3.5 h-3.5 text-blue-600" />
            简历求职照片
          </span>
          <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 font-medium">
            <input 
              type="checkbox" 
              checked={profile.showAvatar} 
              onChange={(e) => handleFieldChange('showAvatar', e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
            />
            在简历中显示照片
          </label>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group shrink-0">
            {profile.avatar ? (
              <img 
                src={profile.avatar} 
                alt="头像" 
                className="w-16 h-20 object-cover rounded-lg border border-slate-300 shadow-xs"
              />
            ) : (
              <div className="w-16 h-20 bg-slate-200 rounded-lg flex items-center justify-center text-slate-400">
                <User className="w-6 h-6" />
              </div>
            )}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 bg-black/40 text-white rounded-lg opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer text-[10px]"
            >
              更换
            </button>
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                accept="image/*" 
                className="hidden" 
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium rounded-lg flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
              >
                <Upload className="w-3 h-3" />
                本地上传照片
              </button>
              {profile.avatar && (
                <button
                  type="button"
                  onClick={() => handleFieldChange('avatar', '')}
                  className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 cursor-pointer"
                  title="清除头像"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Quick Presets */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-slate-500">职场样图:</span>
              <div className="flex gap-1.5">
                {PRESET_AVATARS.map((url, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      handleFieldChange('avatar', url);
                      handleFieldChange('showAvatar', true);
                    }}
                    className={`w-6 h-6 rounded-full overflow-hidden border cursor-pointer ${
                      profile.avatar === url ? 'ring-2 ring-blue-600 border-white' : 'border-slate-300'
                    }`}
                  >
                    <img src={url} alt={`Preset ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Info Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-slate-700 font-semibold mb-1">
            姓名 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={profile.name}
            onChange={(e) => handleFieldChange('name', e.target.value)}
            placeholder="如：李明远"
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
          />
        </div>

        <div>
          <label className="block text-slate-700 font-semibold mb-1">
            职位头衔 / 身份
          </label>
          <input
            type="text"
            value={profile.title}
            onChange={(e) => handleFieldChange('title', e.target.value)}
            placeholder="如：资深前端架构师 / 资深产品专家"
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
          />
        </div>

        <div>
          <label className="block text-slate-700 font-semibold mb-1">
            手机电话 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={profile.phone}
            onChange={(e) => handleFieldChange('phone', e.target.value)}
            placeholder="如：138-0000-0000"
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
          />
        </div>

        <div>
          <label className="block text-slate-700 font-semibold mb-1">
            电子邮箱 <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={profile.email}
            onChange={(e) => handleFieldChange('email', e.target.value)}
            placeholder="如：your.name@domain.com"
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
          />
        </div>

        <div>
          <label className="block text-slate-700 font-semibold mb-1">微信号</label>
          <input
            type="text"
            value={profile.wechat || ''}
            onChange={(e) => handleFieldChange('wechat', e.target.value)}
            placeholder="如：dev_wechat"
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
          />
        </div>

        <div>
          <label className="block text-slate-700 font-semibold mb-1">现居城市</label>
          <input
            type="text"
            value={profile.location}
            onChange={(e) => handleFieldChange('location', e.target.value)}
            placeholder="如：北京市海淀区"
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
          />
        </div>

        <div>
          <label className="block text-slate-700 font-semibold mb-1">工作经验年限</label>
          <input
            type="text"
            value={profile.workYears || ''}
            onChange={(e) => handleFieldChange('workYears', e.target.value)}
            placeholder="如：5年经验 / 应届毕业生"
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
          />
        </div>

        <div>
          <label className="block text-slate-700 font-semibold mb-1">最高学历</label>
          <input
            type="text"
            value={profile.highestDegree || ''}
            onChange={(e) => handleFieldChange('highestDegree', e.target.value)}
            placeholder="如：硕士 / 本科"
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
          />
        </div>

        <div>
          <label className="block text-slate-700 font-semibold mb-1">求职状态</label>
          <select
            value={profile.status || '离职-随时到岗'}
            onChange={(e) => handleFieldChange('status', e.target.value)}
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
          >
            <option value="离职-随时到岗">离职-随时到岗</option>
            <option value="在职-月内到岗">在职-月内到岗</option>
            <option value="在职-考虑机会">在职-考虑机会</option>
            <option value="在职-暂不考虑">在职-暂不考虑</option>
            <option value="应届生求职">应届生求职</option>
          </select>
        </div>

        <div>
          <label className="block text-slate-700 font-semibold mb-1">年龄 / 出生年月</label>
          <input
            type="text"
            value={profile.age || ''}
            onChange={(e) => handleFieldChange('age', e.target.value)}
            placeholder="如：28岁 或 1996.08"
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
          />
        </div>

        <div>
          <label className="block text-slate-700 font-semibold mb-1">个人主页 / 作品集链接</label>
          <input
            type="text"
            value={profile.website || ''}
            onChange={(e) => handleFieldChange('website', e.target.value)}
            placeholder="如：https://yourname.me"
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 font-mono text-[11px]"
          />
        </div>

        <div>
          <label className="block text-slate-700 font-semibold mb-1">GitHub / Code 仓库</label>
          <input
            type="text"
            value={profile.github || ''}
            onChange={(e) => handleFieldChange('github', e.target.value)}
            placeholder="如：github.com/username"
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 font-mono text-[11px]"
          />
        </div>
      </div>
    </div>
  );
};
