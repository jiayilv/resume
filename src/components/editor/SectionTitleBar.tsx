import React, { useState } from 'react';
import { Edit3, Check, RotateCcw, Sparkles } from 'lucide-react';
import { SECTION_TITLE_PRESETS, DEFAULT_SECTION_TITLES } from '../../utils/templateHelpers';

interface SectionTitleBarProps {
  sectionKey: string;
  currentTitle?: string;
  onUpdateTitle: (newTitle: string) => void;
  icon?: React.ReactNode;
  subtitle?: string;
}

export const SectionTitleBar: React.FC<SectionTitleBarProps> = ({
  sectionKey,
  currentTitle,
  onUpdateTitle,
  icon,
  subtitle,
}) => {
  const defaultTitle = DEFAULT_SECTION_TITLES[sectionKey] || sectionKey;
  const effectiveTitle = currentTitle || defaultTitle;
  const presets = SECTION_TITLE_PRESETS[sectionKey] || [];

  const [isCustomizing, setIsCustomizing] = useState(false);
  const [customInput, setCustomInput] = useState(effectiveTitle);

  const handleApplyPreset = (preset: string) => {
    setCustomInput(preset);
    onUpdateTitle(preset);
  };

  const handleApplyInput = () => {
    if (customInput.trim()) {
      onUpdateTitle(customInput.trim());
      setIsCustomizing(false);
    }
  };

  const handleReset = () => {
    setCustomInput(defaultTitle);
    onUpdateTitle(defaultTitle);
    setIsCustomizing(false);
  };

  return (
    <div className="p-3 bg-gradient-to-r from-slate-50 to-blue-50/40 border border-slate-200/90 rounded-xl mb-3 space-y-2">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          {icon && <div className="text-blue-600 shrink-0">{icon}</div>}
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-slate-500 font-medium">模块叫法 / 简历标题：</span>
              <strong className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200/80">
                {effectiveTitle}
              </strong>
            </div>
            {subtitle && <p className="text-[10px] text-slate-400 mt-0.5">{subtitle}</p>}
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => {
              setCustomInput(effectiveTitle);
              setIsCustomizing(!isCustomizing);
            }}
            className={`px-2 py-1 rounded-md text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-all ${
              isCustomizing
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-slate-300 text-slate-700 hover:border-blue-400 hover:text-blue-600'
            }`}
            title="自由修改当前模块在简历中显示的名称"
          >
            <Edit3 className="w-3 h-3" />
            {isCustomizing ? '收起改名' : '修改模块名称'}
          </button>

          {effectiveTitle !== defaultTitle && (
            <button
              type="button"
              onClick={handleReset}
              className="p-1 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100 cursor-pointer"
              title={`恢复默认名称（${defaultTitle}）`}
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Customizable renaming panel with quick presets */}
      {isCustomizing && (
        <div className="pt-2 border-t border-slate-200/70 space-y-2">
          {/* Quick presets */}
          {presets.length > 0 && (
            <div className="space-y-1">
              <span className="text-[10.5px] font-medium text-slate-500 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                常用推荐叫法 (点击直接生效)：
              </span>
              <div className="flex flex-wrap gap-1.5">
                {presets.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handleApplyPreset(preset)}
                    className={`px-2 py-0.8 rounded-md text-[11px] font-medium cursor-pointer transition-all ${
                      effectiveTitle === preset
                        ? 'bg-blue-600 text-white font-bold shadow-2xs'
                        : 'bg-white border border-slate-200 hover:border-blue-400 text-slate-700 hover:bg-blue-50/50'
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Custom text input */}
          <div className="flex items-center gap-1.5 pt-1">
            <span className="text-[11px] text-slate-600 shrink-0 font-medium">或自定义输入：</span>
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleApplyInput();
              }}
              placeholder={`如：${presets[1] || '自定义模块标题'}`}
              className="flex-1 px-2.5 py-1 bg-white border border-slate-300 rounded-md text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              maxLength={20}
            />
            <button
              type="button"
              onClick={handleApplyInput}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-md text-xs flex items-center gap-1 cursor-pointer"
            >
              <Check className="w-3 h-3" />
              确定
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
