import React, { useState } from 'react';
import { ThemeConfig, ResumeData } from '../types';
import { Palette, Layout, Type, Sliders, Eye, EyeOff, ArrowUp, ArrowDown, Sparkles, MoveVertical, RotateCcw, Check } from 'lucide-react';
import { DEFAULT_SECTION_ORDER, DEFAULT_SECTION_TITLES, getSectionTitle } from '../utils/templateHelpers';

interface ThemeSelectorProps {
  theme: ThemeConfig;
  onChangeTheme: (updated: ThemeConfig) => void;
  resumeData: ResumeData;
  onChangeResumeData: (updated: ResumeData) => void;
  onToggleSection: (sectionKey: string) => void;
}

const TEMPLATES = [
  { id: 'classic', name: '经典商务', desc: 'HR首选，信息层次清晰分明' },
  { id: 'modern', name: '科技敏捷', desc: '互联网/研发/产品高颜值' },
  { id: 'sidebar', name: '侧栏精英', desc: '双栏高效排版，紧凑充实' },
  { id: 'minimal', name: '极简北欧', desc: '大留白优雅风，设计/文创' },
  { id: 'executive', name: '高管领袖', desc: '突出战略成果与管理跨度' },
  { id: 'academic', name: '学术海外', desc: '严谨论文/硕博/海外通用CV' },
];

const PRESET_COLORS = [
  { name: '深海湛蓝', hex: '#1e40af' },
  { name: '墨黑商务', hex: '#0f172a' },
  { name: '翡翠墨绿', hex: '#065f46' },
  { name: '典雅紫罗兰', hex: '#4f46e5' },
  { name: '尊贵酒红', hex: '#831843' },
  { name: '极客青蓝', hex: '#0e7490' },
  { name: '暖调琥珀', hex: '#b45309' },
  { name: '钛金雅灰', hex: '#334155' },
];

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  theme,
  onChangeTheme,
  resumeData,
  onChangeResumeData,
  onToggleSection,
}) => {
  const [activeTab, setActiveTab] = useState<'theme' | 'order'>('theme');

  const currentOrder = resumeData.sectionOrder && resumeData.sectionOrder.length > 0
    ? resumeData.sectionOrder
    : DEFAULT_SECTION_ORDER;

  const handleMoveSection = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= currentOrder.length) return;

    const newOrder = [...currentOrder];
    const [moved] = newOrder.splice(index, 1);
    newOrder.splice(targetIndex, 0, moved);

    onChangeResumeData({
      ...resumeData,
      sectionOrder: newOrder,
    });
  };

  const handleResetOrder = () => {
    onChangeResumeData({
      ...resumeData,
      sectionOrder: DEFAULT_SECTION_ORDER,
    });
  };

  const handleToggleAutoFitA4 = () => {
    const newAutoFit = !theme.autoFitA4;
    onChangeTheme({
      ...theme,
      autoFitA4: newAutoFit,
      lineHeight: newAutoFit ? 'fill-a4' : 'normal',
      sectionSpacing: newAutoFit ? 'fill-a4' : 'normal',
      pagePadding: newAutoFit ? 'fill-a4' : 'normal',
      fontSize: newAutoFit ? 'medium' : theme.fontSize,
    });
  };

  return (
    <div className="p-4 bg-white border-b border-slate-200 space-y-3.5 text-xs">
      {/* Top Switcher Bar */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('theme')}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'theme'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            排版主题与样式
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('order')}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'order'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <MoveVertical className="w-3.5 h-3.5" />
            模块顺序与显示调节 ({currentOrder.length})
          </button>
        </div>

        {/* Fill A4 Button */}
        <button
          type="button"
          onClick={handleToggleAutoFitA4}
          className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs ${
            theme.autoFitA4
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white ring-2 ring-emerald-400'
              : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white'
          }`}
          title="根据内容量自动调节行高、段落间距和内边距，使整份简历刚好均匀填满一张标准A4纸"
        >
          <Sparkles className="w-3.5 h-3.5" />
          {theme.autoFitA4 ? '已开启：内容均匀铺满A4纸' : '一键内容均匀铺满A4纸 (防空白/防跨页)'}
        </button>
      </div>

      {activeTab === 'theme' ? (
        <div className="space-y-4">
          {/* Template Card Selection */}
          <div>
            <label className="font-bold text-slate-800 mb-2 flex items-center gap-1.5">
              <Layout className="w-3.5 h-3.5 text-blue-600" />
              精选简历模版库
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {TEMPLATES.map((tpl) => (
                <button
                  key={tpl.id}
                  onClick={() => onChangeTheme({ ...theme, templateId: tpl.id as any })}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    theme.templateId === tpl.id
                      ? 'border-blue-600 bg-blue-50/70 shadow-xs ring-2 ring-blue-500/20'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="font-bold text-slate-900 text-xs mb-0.5">{tpl.name}</div>
                  <div className="text-[10px] text-slate-500 line-clamp-1">{tpl.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Colors & Fonts & Spacing Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100 items-center">
            {/* Colors */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 flex items-center gap-1 text-[11px]">
                <Palette className="w-3 h-3 text-blue-600" />
                主题基调色：
              </label>
              <div className="flex items-center gap-1.5 flex-wrap">
                {PRESET_COLORS.map((c) => (
                  <button
                    key={c.hex}
                    onClick={() => onChangeTheme({ ...theme, primaryColor: c.hex })}
                    className={`w-5 h-5 rounded-full cursor-pointer transition-transform ${
                      theme.primaryColor === c.hex ? 'scale-125 ring-2 ring-blue-600 ring-offset-2' : 'hover:scale-110'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            {/* Font Family */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 flex items-center gap-1 text-[11px]">
                <Type className="w-3 h-3 text-blue-600" />
                排版字体：
              </label>
              <div className="flex gap-1">
                <button
                  onClick={() => onChangeTheme({ ...theme, fontFamily: 'sans' })}
                  className={`px-2.5 py-1 rounded-md border text-[11px] font-sans cursor-pointer ${
                    theme.fontFamily === 'sans' ? 'bg-slate-900 text-white font-bold' : 'bg-white text-slate-700 border-slate-200'
                  }`}
                >
                  黑体 (现代)
                </button>
                <button
                  onClick={() => onChangeTheme({ ...theme, fontFamily: 'serif' })}
                  className={`px-2.5 py-1 rounded-md border text-[11px] font-serif cursor-pointer ${
                    theme.fontFamily === 'serif' ? 'bg-slate-900 text-white font-bold' : 'bg-white text-slate-700 border-slate-200'
                  }`}
                >
                  宋体 (严谨)
                </button>
                <button
                  onClick={() => onChangeTheme({ ...theme, fontFamily: 'mono' })}
                  className={`px-2.5 py-1 rounded-md border text-[11px] font-mono cursor-pointer ${
                    theme.fontFamily === 'mono' ? 'bg-slate-900 text-white font-bold' : 'bg-white text-slate-700 border-slate-200'
                  }`}
                >
                  等宽 (极客)
                </button>
              </div>
            </div>

            {/* Font Size & Line Height */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 flex items-center gap-1 text-[11px]">
                <Sliders className="w-3 h-3 text-blue-600" />
                内容密度与字距：
              </label>
              <div className="flex gap-2 flex-wrap">
                <select
                  value={theme.fontSize}
                  onChange={(e) => onChangeTheme({ ...theme, fontSize: e.target.value as any, autoFitA4: false })}
                  className="px-2 py-1 bg-white border border-slate-300 rounded text-[11px] text-slate-800 font-medium cursor-pointer"
                >
                  <option value="small">紧凑字号 (12px)</option>
                  <option value="medium">标准字号 (13.5px)</option>
                  <option value="large">清晰大字 (15px)</option>
                </select>
                <select
                  value={theme.lineHeight}
                  onChange={(e) => onChangeTheme({ ...theme, lineHeight: e.target.value as any, autoFitA4: false })}
                  className="px-2 py-1 bg-white border border-slate-300 rounded text-[11px] text-slate-800 font-medium cursor-pointer"
                >
                  <option value="compact">紧凑间距 (1.35x)</option>
                  <option value="normal">标准间距 (1.55x)</option>
                  <option value="relaxed">宽松间距 (1.75x)</option>
                  <option value="fill-a4">充盈铺满 (1.68x)</option>
                </select>
                <select
                  value={theme.sectionSpacing}
                  onChange={(e) => onChangeTheme({ ...theme, sectionSpacing: e.target.value as any, autoFitA4: false })}
                  className="px-2 py-1 bg-white border border-slate-300 rounded text-[11px] text-slate-800 font-medium cursor-pointer"
                >
                  <option value="compact">段落紧凑 (10px)</option>
                  <option value="normal">段落适中 (18px)</option>
                  <option value="relaxed">段落舒展 (26px)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Section Reordering & Visibility Manager */
        <div className="space-y-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
          <div className="flex justify-between items-center">
            <span className="font-bold text-slate-800 text-xs flex items-center gap-1">
              <MoveVertical className="w-3.5 h-3.5 text-blue-600" />
              调整模块在简历中的上下排列顺序（除基本信息固定置顶外）：
            </span>
            <button
              type="button"
              onClick={handleResetOrder}
              className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer font-medium"
            >
              <RotateCcw className="w-3 h-3" />
              恢复默认顺序
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {currentOrder.map((sectionKey, idx) => {
              const isHidden = resumeData.hiddenSections.includes(sectionKey);
              const title = getSectionTitle(resumeData, sectionKey);

              return (
                <div
                  key={sectionKey}
                  className={`p-2.5 bg-white border rounded-lg flex items-center justify-between shadow-2xs transition-all ${
                    isHidden ? 'border-slate-200 opacity-60 bg-slate-50' : 'border-slate-300 hover:border-blue-400'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className={`font-semibold ${isHidden ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                      {title}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    {/* Up button */}
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMoveSection(idx, 'up')}
                      className="p-1 text-slate-500 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer hover:bg-slate-100 rounded"
                      title="向上移动"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>

                    {/* Down button */}
                    <button
                      type="button"
                      disabled={idx === currentOrder.length - 1}
                      onClick={() => handleMoveSection(idx, 'down')}
                      className="p-1 text-slate-500 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer hover:bg-slate-100 rounded"
                      title="向下移动"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>

                    {/* Toggle visibility */}
                    <button
                      type="button"
                      onClick={() => onToggleSection(sectionKey)}
                      className={`p-1 rounded cursor-pointer ${
                        isHidden ? 'text-slate-400 hover:text-slate-600' : 'text-blue-600 hover:bg-blue-50'
                      }`}
                      title={isHidden ? '取消隐藏' : '隐藏此模块'}
                    >
                      {isHidden ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
