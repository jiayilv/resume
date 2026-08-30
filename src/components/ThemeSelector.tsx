import React from 'react';
import { ThemeConfig, ResumeData } from '../types';
import { Palette, Layout, Type, Sliders, Eye, EyeOff } from 'lucide-react';

interface ThemeSelectorProps {
  theme: ThemeConfig;
  onChangeTheme: (updated: ThemeConfig) => void;
  resumeData: ResumeData;
  onToggleSection: (sectionKey: string) => void;
}

const TEMPLATES = [
  { id: 'classic', name: '经典商务', desc: '传统HR最爱，信息严谨分明' },
  { id: 'modern', name: '科技敏捷', desc: '互联网/技术岗高颜值模板' },
  { id: 'sidebar', name: '侧栏精英', desc: '双栏高效排版，紧凑充实' },
  { id: 'minimal', name: '极简北欧', desc: '大留白优雅风，设计/文创首选' },
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

const ALL_SECTIONS = [
  { key: 'jobIntent', label: '求职意向' },
  { key: 'summary', label: '个人总结' },
  { key: 'work', label: '工作经历' },
  { key: 'project', label: '项目经验' },
  { key: 'education', label: '教育背景' },
  { key: 'skills', label: '专业技能' },
  { key: 'certificates', label: '证书与荣誉' },
  { key: 'languages', label: '语言能力' },
];

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  theme,
  onChangeTheme,
  resumeData,
  onToggleSection,
}) => {
  return (
    <div className="p-4 bg-white border-b border-slate-200 space-y-4 text-xs">
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-slate-100 items-center">
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
            内容密度调节：
          </label>
          <div className="flex gap-2">
            <select
              value={theme.fontSize}
              onChange={(e) => onChangeTheme({ ...theme, fontSize: e.target.value as any })}
              className="px-2 py-1 bg-white border border-slate-200 rounded text-[11px] text-slate-700"
            >
              <option value="small">紧凑字号 (13px)</option>
              <option value="medium">标准字号 (14px)</option>
              <option value="large">清晰大字 (15px)</option>
            </select>
            <select
              value={theme.lineHeight}
              onChange={(e) => onChangeTheme({ ...theme, lineHeight: e.target.value as any })}
              className="px-2 py-1 bg-white border border-slate-200 rounded text-[11px] text-slate-700"
            >
              <option value="compact">紧凑间距 (1.4x)</option>
              <option value="normal">标准间距 (1.6x)</option>
              <option value="relaxed">宽松间距 (1.75x)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Section Visibility Toggles */}
      <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2">
        <span className="text-[11px] text-slate-500 font-semibold">板块显示/隐藏：</span>
        {ALL_SECTIONS.map((sec) => {
          const isHidden = resumeData.hiddenSections.includes(sec.key);
          return (
            <button
              key={sec.key}
              onClick={() => onToggleSection(sec.key)}
              className={`px-2 py-0.5 rounded text-[11px] flex items-center gap-1 cursor-pointer transition-all ${
                isHidden
                  ? 'bg-slate-100 text-slate-400 line-through'
                  : 'bg-blue-50 text-blue-700 border border-blue-200 font-medium'
              }`}
            >
              {isHidden ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
              {sec.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
