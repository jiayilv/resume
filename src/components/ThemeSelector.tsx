import React, { useState } from 'react';
import { ThemeConfig, ResumeData, HeaderStyle, AvatarShape } from '../types';
import { Palette, Layout, Type, Sliders, Eye, EyeOff, ArrowUp, ArrowDown, Sparkles, MoveVertical, RotateCcw, Edit3, Check } from 'lucide-react';
import { DEFAULT_SECTION_ORDER, SECTION_TITLE_PRESETS, getSectionTitle } from '../utils/templateHelpers';

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

const HEADER_STYLES: { id: HeaderStyle; label: string; desc: string }[] = [
  { id: 'underline', label: '下划线', desc: '底部单横线分割' },
  { id: 'left-bar', label: '侧边色条', desc: '左侧主题色竖条' },
  { id: 'pill', label: '胶囊色块', desc: '背景色药丸徽章' },
  { id: 'double-line', label: '双横线', desc: '上下双细线' },
  { id: 'minimal', label: '极简无框', desc: '纯文字高反差' },
  { id: 'academic', label: '严谨学术', desc: '居中横线衬托' },
];

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  theme,
  onChangeTheme,
  resumeData,
  onChangeResumeData,
  onToggleSection,
}) => {
  const [activeTab, setActiveTab] = useState<'theme' | 'diy' | 'titles' | 'order'>('theme');

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

  const handleUpdateSectionTitle = (sectionKey: string, newTitle: string) => {
    onChangeResumeData({
      ...resumeData,
      sectionTitles: {
        ...resumeData.sectionTitles,
        [sectionKey]: newTitle.trim(),
      },
    });
  };

  const handleResetAllTitles = () => {
    onChangeResumeData({
      ...resumeData,
      sectionTitles: {
        summary: '自我评价',
      },
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
        <div className="flex items-center gap-1.5 flex-wrap">
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
            精选模版 & 主题
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('diy')}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'diy'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            DIY 模版深度定制
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('titles')}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'titles'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            模块叫法与自定义重命名
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
            模块排序与显隐 ({currentOrder.length})
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

      {activeTab === 'theme' && (
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
              <div className="flex items-center justify-between">
                <label className="font-semibold text-slate-700 flex items-center gap-1 text-[11px]">
                  <Palette className="w-3 h-3 text-blue-600" />
                  主题基调色：
                </label>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-slate-400">自定义:</span>
                  <input
                    type="color"
                    value={theme.primaryColor}
                    onChange={(e) => onChangeTheme({ ...theme, primaryColor: e.target.value })}
                    className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent p-0"
                    title="自由选取任意十六进制颜色"
                  />
                </div>
              </div>
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
      )}

      {/* DIY Deep Customization Tab */}
      {activeTab === 'diy' && (
        <div className="space-y-4 p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <div>
              <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-blue-600" />
                DIY 模版深度个性化配置
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                支持自由调节标题线型风格、照片边框形状、页面留白边距，随心搭配专属模版
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Header Style */}
            <div className="space-y-2">
              <label className="font-semibold text-slate-800 text-[11px] block">
                1. 模块标题风格 (Header Style)：
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {HEADER_STYLES.map((style) => (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => onChangeTheme({ ...theme, headerStyle: style.id })}
                    className={`p-2 rounded-lg border text-left cursor-pointer transition-all ${
                      (theme.headerStyle || 'underline') === style.id
                        ? 'border-blue-600 bg-white ring-2 ring-blue-500/20 shadow-2xs font-bold text-blue-700'
                        : 'border-slate-200 bg-white hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <div className="text-xs">{style.label}</div>
                    <div className="text-[9.5px] text-slate-400 font-normal">{style.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Avatar Shape */}
            <div className="space-y-2">
              <label className="font-semibold text-slate-800 text-[11px] block">
                2. 照片框外形 (Photo Shape)：
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'rounded', label: '优雅圆角', desc: '微弧度 (12px)' },
                  { id: 'square', label: '商务直角', desc: '严谨平直' },
                  { id: 'circle', label: '现代圆形', desc: '极简圆形' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onChangeTheme({ ...theme, avatarShape: item.id as AvatarShape })}
                    className={`p-2 rounded-lg border text-left cursor-pointer transition-all ${
                      (theme.avatarShape || 'rounded') === item.id
                        ? 'border-blue-600 bg-white ring-2 ring-blue-500/20 shadow-2xs font-bold text-blue-700'
                        : 'border-slate-200 bg-white hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <div className="text-xs">{item.label}</div>
                    <div className="text-[9.5px] text-slate-400 font-normal">{item.desc}</div>
                  </button>
                ))}
              </div>

              {/* Page Padding Margin */}
              <div className="pt-2">
                <label className="font-semibold text-slate-800 text-[11px] block mb-1.5">
                  3. A4 纸张页面边距：
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: 'compact', label: '紧凑 (15mm)' },
                    { id: 'normal', label: '标准 (20mm)' },
                    { id: 'relaxed', label: '宽松 (25mm)' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => onChangeTheme({ ...theme, pagePadding: p.id as any, autoFitA4: false })}
                      className={`p-1.5 rounded-lg border text-center text-[11px] cursor-pointer ${
                        theme.pagePadding === p.id
                          ? 'border-blue-600 bg-white font-bold text-blue-700'
                          : 'border-slate-200 bg-white text-slate-600'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Custom Color & Toggles */}
            <div className="space-y-2">
              <label className="font-semibold text-slate-800 text-[11px] block">
                4. 细节修饰与基调：
              </label>
              <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-700">主色 Hex 代码：</span>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      value={theme.primaryColor}
                      onChange={(e) => onChangeTheme({ ...theme, primaryColor: e.target.value })}
                      className="w-20 px-2 py-0.5 border border-slate-300 rounded font-mono text-[11px] text-slate-800 uppercase"
                    />
                    <input
                      type="color"
                      value={theme.primaryColor}
                      onChange={(e) => onChangeTheme({ ...theme, primaryColor: e.target.value })}
                      className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent p-0"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex flex-col gap-1.5">
                  <span className="text-[10.5px] text-slate-500">
                    💡 提示：在【模块叫法】标签页中，您可以自由将“工作经历”修改为“实践经历”，或将“求职意向”修改为“期望职位”等。
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Module Renaming Tab */}
      {activeTab === 'titles' && (
        <div className="space-y-3 p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2 flex-wrap gap-2">
            <div>
              <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                <Edit3 className="w-3.5 h-3.5 text-blue-600" />
                简历各模块叫法自由自定义 (DIY 标题)
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                在这里可以直接修改所有模块在简历中展现的标题（如工作经历 ➔ 实践经历、求职意向 ➔ 期望职位等）
              </p>
            </div>

            <button
              type="button"
              onClick={handleResetAllTitles}
              className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer font-medium px-2 py-1 bg-white border border-slate-200 rounded-lg hover:border-slate-300"
            >
              <RotateCcw className="w-3 h-3" />
              一键重置为默认叫法
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { key: 'work', defaultName: '工作经历', desc: '用于企业职场、社会实习、教学实践等' },
              { key: 'jobIntent', defaultName: '求职意向', desc: '用于目标职位、期望方向、求职方向等' },
              { key: 'project', defaultName: '项目经验', desc: '用于项目经历、科研成果、作品集等' },
              { key: 'education', defaultName: '教育背景', desc: '用于学历学位、教育经历、学习履历等' },
              { key: 'summary', defaultName: '自我评价', desc: '用于个人总结、个人亮点、个人优势等' },
              { key: 'skills', defaultName: '专业技能', desc: '用于核心技能、技术栈、技能清单等' },
              { key: 'certs', defaultName: '荣誉证书与语言', desc: '用于荣誉资质、语言水平、资格证书等' },
              { key: 'custom', defaultName: '其他项目/亮点', desc: '用于社团活动、志愿经历、代表成果等' },
            ].map(({ key, defaultName, desc }) => {
              const currentTitle = getSectionTitle(resumeData, key);
              const presets = SECTION_TITLE_PRESETS[key] || [];

              return (
                <div key={key} className="p-3 bg-white border border-slate-200 rounded-xl space-y-2 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-800 text-xs">{defaultName}</span>
                      <span className="text-[10px] text-slate-400 ml-1.5">{desc}</span>
                    </div>
                  </div>

                  {/* Input */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-slate-500 shrink-0 font-medium">当前叫法:</span>
                    <input
                      type="text"
                      value={currentTitle}
                      onChange={(e) => handleUpdateSectionTitle(key, e.target.value)}
                      placeholder={defaultName}
                      className="flex-1 px-2.5 py-1 bg-slate-50 border border-slate-300 rounded-md text-xs font-semibold text-blue-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {currentTitle !== defaultName && (
                      <button
                        type="button"
                        onClick={() => handleUpdateSectionTitle(key, defaultName)}
                        className="text-[10px] text-slate-400 hover:text-slate-600 px-1.5 py-1 bg-slate-100 rounded cursor-pointer shrink-0"
                        title="恢复默认"
                      >
                        恢复
                      </button>
                    )}
                  </div>

                  {/* Quick Presets */}
                  {presets.length > 0 && (
                    <div className="flex items-center gap-1 flex-wrap pt-0.5">
                      <span className="text-[10px] text-slate-400 shrink-0">一键预设:</span>
                      {presets.slice(0, 5).map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => handleUpdateSectionTitle(key, p)}
                          className={`px-1.5 py-0.5 rounded text-[10.5px] cursor-pointer transition-all ${
                            currentTitle === p
                              ? 'bg-blue-600 text-white font-bold shadow-2xs'
                              : 'bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-700'
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Section Reordering & Visibility Manager */}
      {activeTab === 'order' && (
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
