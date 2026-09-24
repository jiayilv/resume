import React, { useRef, useState } from 'react';
import { UserProfile } from '../../types';
import { User, Phone, Mail, MapPin, Globe, Github, Camera, Upload, Trash2, Check, Image as ImageIcon, Link } from 'lucide-react';

interface ProfileEditorProps {
  profile: UserProfile;
  onChange: (updated: UserProfile) => void;
}

export const ProfileEditor: React.FC<ProfileEditorProps> = ({ profile, onChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [tempUrl, setTempUrl] = useState('');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [showExtraLinks, setShowExtraLinks] = useState(Boolean(profile.wechat || profile.website || profile.github));

  const updateProfile = (updates: Partial<UserProfile>) => {
    onChange({ ...profile, ...updates });
  };

  const handleFieldChange = (key: keyof UserProfile, value: any) => {
    updateProfile({ [key]: value });
  };

  const handleBirthDateChange = (val: string) => {
    const updates: Partial<UserProfile> = { birthDate: val };
    if (val) {
      const year = parseInt(val.split('-')[0], 10);
      if (!isNaN(year) && year > 1940 && year <= new Date().getFullYear()) {
        const computedAge = `${new Date().getFullYear() - year}岁`;
        // If age is empty or was previously computed, sync age
        if (!profile.age || profile.age.endsWith('岁')) {
          updates.age = computedAge;
        }
      }
    }
    updateProfile(updates);
  };

  // Compress image to high-quality lightweight base64 to avoid localStorage quota issues
  const processImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setUploadError('请选择有效的图片文件 (JPG / PNG / WEBP 等)');
      return;
    }
    setUploadError(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const resultStr = event.target?.result as string;
      if (!resultStr) {
        setUploadError('图片读取失败，请重试');
        return;
      }

      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          // Support high resolution 1000x1400 without loss
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1680;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height = Math.round((height * MAX_WIDTH) / width);
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width = Math.round((width * MAX_HEIGHT) / height);
              width = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const compressedBase64 = canvas.toDataURL('image/jpeg', 0.92);
            updateProfile({
              avatar: compressedBase64,
              showAvatar: true,
              avatarFit: profile.avatarFit || 'contain', // Default contain for crisp 1000x1400 without zoom
              avatarScale: profile.avatarScale ?? 100,
              avatarPosition: profile.avatarPosition || 'center',
            });
          } else {
            // Fallback to raw data url
            updateProfile({ avatar: resultStr, showAvatar: true });
          }
        } catch (err) {
          // If canvas compression fails, fallback to direct data URL
          updateProfile({ avatar: resultStr, showAvatar: true });
        }
      };

      img.onerror = () => {
        // Fallback directly to raw data URL
        updateProfile({ avatar: resultStr, showAvatar: true });
      };

      img.src = resultStr;
    };

    reader.onerror = () => {
      setUploadError('图片读取失败，请检查文件权限');
    };

    reader.readAsDataURL(file);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleApplyUrl = () => {
    if (tempUrl.trim()) {
      updateProfile({ avatar: tempUrl.trim(), showAvatar: true });
      setShowUrlInput(false);
      setTempUrl('');
    }
  };

  const avatarFit = profile.avatarFit || 'contain';
  const avatarScale = profile.avatarScale ?? 100;
  const avatarPosition = profile.avatarPosition || 'center';

  return (
    <div className="space-y-4 text-xs">
      {/* Avatar Section */}
      <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
            <Camera className="w-3.5 h-3.5 text-blue-600" />
            简历求职照片 (1寸 25×35mm)
          </span>
          <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 font-medium">
            <input 
              type="checkbox" 
              checked={profile.showAvatar} 
              onChange={(e) => handleFieldChange('showAvatar', e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5 cursor-pointer"
            />
            在简历中显示照片
          </label>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Avatar Dropzone Box (Standard 1-inch 25mm x 35mm, 5:7 ratio) */}
          <div className="flex flex-col items-center gap-1 shrink-0">
            <div 
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative group w-[80px] h-[112px] rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden bg-white ${
                isDragging
                  ? 'border-blue-600 bg-blue-50/80 ring-2 ring-blue-400/40 scale-102'
                  : profile.avatar
                  ? 'border-slate-300 shadow-xs'
                  : 'border-slate-300 hover:border-blue-400 bg-slate-100/70 hover:bg-blue-50/40'
              }`}
              title="点击或拖拽上传 1 寸证件照 (25mm × 35mm)"
            >
              {profile.avatar ? (
                <>
                  <div className="w-full h-full overflow-hidden flex items-center justify-center bg-white relative">
                    <img 
                      src={profile.avatar} 
                      alt="头像" 
                      style={{
                        objectFit: avatarFit,
                        objectPosition: avatarPosition,
                        transform: `scale(${avatarScale / 100})`,
                        transformOrigin: avatarPosition === 'top' ? 'top center' : avatarPosition === 'bottom' ? 'bottom center' : 'center center',
                      }}
                      className="w-full h-full select-none pointer-events-none transition-transform"
                    />
                  </div>
                  <div className="absolute inset-0 bg-black/40 text-white opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity text-[10px] font-medium gap-0.5 z-10">
                    <Upload className="w-3.5 h-3.5" />
                    <span>更换照片</span>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-400 gap-1 p-1 text-center">
                  <Upload className="w-4 h-4 text-slate-400" />
                  <span className="text-[10px] text-slate-600 font-medium leading-tight">1寸照片</span>
                  <span className="text-[8px] text-slate-400 font-mono">25×35mm</span>
                </div>
              )}
            </div>
            <span className="text-[10px] text-slate-500 font-medium">1寸 (25×35mm)</span>
          </div>

          <div className="flex-1 space-y-2.5 w-full">
            <div className="flex items-center gap-2 flex-wrap">
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                onClick={(e) => { (e.target as HTMLInputElement).value = ''; }}
                accept="image/*" 
                className="hidden" 
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs text-xs"
              >
                <Upload className="w-3.5 h-3.5" />
                本地选择照片
              </button>

              <button
                type="button"
                onClick={() => setShowUrlInput(!showUrlInput)}
                className="px-2.5 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium rounded-lg flex items-center gap-1 cursor-pointer transition-colors shadow-2xs text-[11px]"
              >
                <Link className="w-3 h-3 text-slate-500" />
                图片链接
              </button>

              {profile.avatar && (
                <button
                  type="button"
                  onClick={() => handleFieldChange('avatar', '')}
                  className="px-2 py-1.5 text-slate-500 hover:text-red-600 rounded-lg hover:bg-red-50 cursor-pointer text-[11px] flex items-center gap-1 transition-colors"
                  title="清除头像"
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-400" />
                  删除照片
                </button>
              )}
            </div>

            {/* Direct URL input */}
            {showUrlInput && (
              <div className="flex gap-1.5 pt-1">
                <input
                  type="url"
                  value={tempUrl}
                  onChange={(e) => setTempUrl(e.target.value)}
                  placeholder="输入图片直链 URL (https://...)"
                  className="flex-1 px-2.5 py-1 bg-white border border-slate-300 rounded-md text-[11px] focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleApplyUrl}
                  className="px-2.5 py-1 bg-slate-900 text-white rounded-md text-[11px] font-medium cursor-pointer"
                >
                  应用
                </button>
              </div>
            )}

            {uploadError && (
              <p className="text-red-500 text-[11px]">{uploadError}</p>
            )}

            {/* Photo Fit & Zoom Adjustment (Fixes 1000x1400 photo enlargement) */}
            {profile.avatar && (
              <div className="p-2.5 bg-white border border-blue-200/80 rounded-xl space-y-2 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-700 text-[11px] flex items-center gap-1">
                    <ImageIcon className="w-3 h-3 text-blue-600" />
                    照片缩放与适配模式：
                  </span>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => handleFieldChange('avatarFit', 'contain')}
                      className={`px-2 py-0.5 rounded text-[10.5px] font-medium cursor-pointer transition-all ${
                        avatarFit === 'contain'
                          ? 'bg-blue-600 text-white font-bold'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                      title="完整显示整张照片，不裁剪边缘，不放大"
                    >
                      📐 完整居中 (不裁切/不放大)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFieldChange('avatarFit', 'cover')}
                      className={`px-2 py-0.5 rounded text-[10.5px] font-medium cursor-pointer transition-all ${
                        avatarFit === 'cover'
                          ? 'bg-blue-600 text-white font-bold'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                      title="裁切填满1寸框"
                    >
                      🔲 填满裁切
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-slate-100 items-center">
                  {/* Zoom Slider */}
                  <div className="flex items-center gap-2">
                    <span className="text-[10.5px] text-slate-500 shrink-0">自由缩放:</span>
                    <input
                      type="range"
                      min={50}
                      max={150}
                      step={2}
                      value={avatarScale}
                      onChange={(e) => handleFieldChange('avatarScale', Number(e.target.value))}
                      className="w-full accent-blue-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                    />
                    <span className="text-[10px] font-mono text-slate-700 w-8 text-right font-semibold">
                      {avatarScale}%
                    </span>
                    <button
                      type="button"
                      onClick={() => handleFieldChange('avatarScale', 100)}
                      className="text-[9px] text-slate-400 hover:text-slate-600 px-1 py-0.5 bg-slate-100 rounded cursor-pointer"
                      title="重置缩放为 100%"
                    >
                      重置
                    </button>
                  </div>

                  {/* Position */}
                  <div className="flex items-center gap-1.5 justify-end">
                    <span className="text-[10.5px] text-slate-500 shrink-0">对齐位置:</span>
                    <div className="flex gap-1">
                      {(['top', 'center', 'bottom'] as const).map((pos) => (
                        <button
                          key={pos}
                          type="button"
                          onClick={() => handleFieldChange('avatarPosition', pos)}
                          className={`px-1.5 py-0.5 rounded text-[10px] cursor-pointer ${
                            avatarPosition === pos
                              ? 'bg-slate-800 text-white font-semibold'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {pos === 'top' ? '顶部' : pos === 'center' ? '居中' : '底部'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Info Grid - Exactly the 13 requested fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* 1. 你的姓名 */}
        <div>
          <label className="block text-slate-700 font-semibold mb-1">
            你的姓名 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={profile.name}
            onChange={(e) => handleFieldChange('name', e.target.value)}
            placeholder="如：李明远"
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
          />
        </div>

        {/* 2. 出生年月（日历类选择） */}
        <div>
          <label className="block text-slate-700 font-semibold mb-1">
            出生年月（日历类选择）
          </label>
          <input
            type="month"
            value={profile.birthDate || ''}
            onChange={(e) => handleBirthDateChange(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 font-sans"
          />
        </div>

        {/* 3. 手机号码 */}
        <div>
          <label className="block text-slate-700 font-semibold mb-1">
            手机号码 <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            value={profile.phone}
            onChange={(e) => handleFieldChange('phone', e.target.value)}
            placeholder="如：138-0013-8000"
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
          />
        </div>

        {/* 4. 学历 */}
        <div>
          <label className="block text-slate-700 font-semibold mb-1">
            学历
          </label>
          <input
            type="text"
            list="degree-presets"
            value={profile.highestDegree || ''}
            onChange={(e) => handleFieldChange('highestDegree', e.target.value)}
            placeholder="如：硕士 / 本科 / 大专"
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
          />
          <datalist id="degree-presets">
            <option value="博士研究生" />
            <option value="硕士研究生" />
            <option value="本科" />
            <option value="大专" />
            <option value="高中/中专" />
          </datalist>
        </div>

        {/* 5. 婚姻状况 */}
        <div>
          <label className="block text-slate-700 font-semibold mb-1">
            婚姻状况
          </label>
          <select
            value={profile.maritalStatus || '未婚'}
            onChange={(e) => handleFieldChange('maritalStatus', e.target.value)}
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
          >
            <option value="未婚">未婚</option>
            <option value="已婚">已婚</option>
            <option value="已婚已育">已婚已育</option>
            <option value="保密">保密</option>
          </select>
        </div>

        {/* 6. 籍贯地址 */}
        <div>
          <label className="block text-slate-700 font-semibold mb-1">
            籍贯地址
          </label>
          <input
            type="text"
            value={profile.nativePlace || ''}
            onChange={(e) => handleFieldChange('nativePlace', e.target.value)}
            placeholder="如：湖北武汉 / 江苏南京"
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
          />
        </div>

        {/* 7. 年龄 */}
        <div>
          <label className="block text-slate-700 font-semibold mb-1">
            年龄
          </label>
          <input
            type="text"
            value={profile.age || ''}
            onChange={(e) => handleFieldChange('age', e.target.value)}
            placeholder="如：28岁"
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
          />
        </div>

        {/* 8. 你的性别 */}
        <div>
          <label className="block text-slate-700 font-semibold mb-1">
            你的性别
          </label>
          <select
            value={profile.gender || '男'}
            onChange={(e) => handleFieldChange('gender', e.target.value)}
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
          >
            <option value="男">男</option>
            <option value="女">女</option>
            <option value="保密">保密</option>
          </select>
        </div>

        {/* 9. 工作经验 */}
        <div>
          <label className="block text-slate-700 font-semibold mb-1">
            工作经验
          </label>
          <input
            type="text"
            list="workyears-presets"
            value={profile.workYears || ''}
            onChange={(e) => handleFieldChange('workYears', e.target.value)}
            placeholder="如：5年经验 / 应届毕业生"
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
          />
          <datalist id="workyears-presets">
            <option value="应届毕业生" />
            <option value="1年经验" />
            <option value="2年经验" />
            <option value="3年经验" />
            <option value="5年经验" />
            <option value="8年经验" />
            <option value="10年以上经验" />
          </datalist>
        </div>

        {/* 10. 邮箱地址 */}
        <div>
          <label className="block text-slate-700 font-semibold mb-1">
            邮箱地址 <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={profile.email}
            onChange={(e) => handleFieldChange('email', e.target.value)}
            placeholder="如：your.name@domain.com"
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
          />
        </div>

        {/* 11. 意向岗位 */}
        <div>
          <label className="block text-slate-700 font-semibold mb-1">
            意向岗位 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={profile.title}
            onChange={(e) => handleFieldChange('title', e.target.value)}
            placeholder="如：资深前端架构师 / 资深产品专家"
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
          />
        </div>

        {/* 12. 政治面貌 */}
        <div>
          <label className="block text-slate-700 font-semibold mb-1">
            政治面貌
          </label>
          <input
            type="text"
            list="political-presets"
            value={profile.politicalStatus || ''}
            onChange={(e) => handleFieldChange('politicalStatus', e.target.value)}
            placeholder="如：中共党员 / 共青团员 / 群众"
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
          />
          <datalist id="political-presets">
            <option value="中共党员" />
            <option value="中共预备党员" />
            <option value="共青团员" />
            <option value="群众" />
            <option value="民主党派" />
          </datalist>
        </div>

        {/* 13. 现居地址 */}
        <div className="sm:col-span-2">
          <label className="block text-slate-700 font-semibold mb-1">
            现居地址
          </label>
          <input
            type="text"
            value={profile.location}
            onChange={(e) => handleFieldChange('location', e.target.value)}
            placeholder="如：北京市海淀区中关村南大街"
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
          />
        </div>
      </div>

      {/* Optional Links Toggle */}
      <div className="pt-2 border-t border-slate-200">
        <button
          type="button"
          onClick={() => setShowExtraLinks(!showExtraLinks)}
          className="text-[11px] text-slate-500 hover:text-blue-600 flex items-center gap-1 font-medium cursor-pointer"
        >
          <span>{showExtraLinks ? '收起附加社交与主页链接' : '+ 填写附加社交/主页链接 (微信号/GitHub/作品集/求职状态)'}</span>
        </button>

        {showExtraLinks && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2.5 p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <label className="block text-slate-600 font-medium mb-1 text-[11px]">微信号</label>
              <input
                type="text"
                value={profile.wechat || ''}
                onChange={(e) => handleFieldChange('wechat', e.target.value)}
                placeholder="如：dev_wechat"
                className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-md text-xs focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1 text-[11px]">求职状态</label>
              <select
                value={profile.status || '离职-随时到岗'}
                onChange={(e) => handleFieldChange('status', e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-md text-xs focus:ring-2 focus:ring-blue-500"
              >
                <option value="离职-随时到岗">离职-随时到岗</option>
                <option value="在职-月内到岗">在职-月内到岗</option>
                <option value="在职-考虑机会">在职-考虑机会</option>
                <option value="在职-暂不考虑">在职-暂不考虑</option>
                <option value="应届生求职">应届生求职</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1 text-[11px]">个人主页 / 作品集链接</label>
              <input
                type="text"
                value={profile.website || ''}
                onChange={(e) => handleFieldChange('website', e.target.value)}
                placeholder="如：https://yourname.me"
                className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-md text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1 text-[11px]">GitHub / Code 仓库</label>
              <input
                type="text"
                value={profile.github || ''}
                onChange={(e) => handleFieldChange('github', e.target.value)}
                placeholder="如：github.com/username"
                className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-md text-xs font-mono"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
