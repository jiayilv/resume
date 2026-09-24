import React, { useState } from 'react';
import { SkillItem } from '../../types';
import { Plus, Trash2, ArrowUp, ArrowDown, Wrench, List, Grid, Tag, ClipboardList, Check, RefreshCw } from 'lucide-react';
import { SectionTitleBar } from './SectionTitleBar';

interface SkillsEditorProps {
  skills: SkillItem[];
  onChange: (updated: SkillItem[]) => void;
  sectionTitle?: string;
  onUpdateSectionTitle?: (newTitle: string) => void;
  skillLayout?: 'list' | 'tags' | 'grid';
  onChangeLayout?: (layout: 'list' | 'tags' | 'grid') => void;
}

const RECOMMENDED_SAMPLE_SKILLS = [
  '熟练掌握 React 18 / TypeScript 核心原理与 Hook 架构，具备大型 Web 应用与工程化脚手架搭建能力',
  '深入理解前端性能优化指标（Core Web Vitals），有长列表虚拟滚动、代码拆分及首屏秒开实战经验',
  '精通前端工程化体系（Vite / Webpack / ESLint / CI-CD），熟练使用 Docker 进行容器化交付',
  '具备微前端（Qiankun / Module Federation）架构实践经验，能独立主导老旧巨石系统拆分改造',
  '熟练运用 TailwindCSS / CSS 响应式布局，熟悉 RESTful API 与 GraphQL 接口设计规范',
  '熟悉 Node.js 服务端开发与常用数据库（Redis / PostgreSQL），具备全栈协同及 AI 大模型 API 集成经验',
];

export const SkillsEditor: React.FC<SkillsEditorProps> = ({
  skills,
  onChange,
  sectionTitle,
  onUpdateSectionTitle,
  skillLayout = 'list',
  onChangeLayout,
}) => {
  const [newSkillName, setNewSkillName] = useState('');
  const [isBatchOpen, setIsBatchOpen] = useState(false);
  const [batchText, setBatchText] = useState('');

  // Add single skill
  const handleAdd = () => {
    const trimmed = newSkillName.trim();
    if (!trimmed) return;
    const newItem: SkillItem = {
      id: 'skill_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      name: trimmed,
      level: 5,
    };
    onChange([...skills, newItem]);
    setNewSkillName('');
  };

  // Directly edit in-place without deleting
  const handleUpdate = (id: string, updatedName: string) => {
    onChange(skills.map((s) => (s.id === id ? { ...s, name: updatedName } : s)));
  };

  // Delete skill
  const handleDelete = (id: string) => {
    onChange(skills.filter((s) => s.id !== id));
  };

  // Reorder up
  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const next = [...skills];
    const temp = next[index];
    next[index] = next[index - 1];
    next[index - 1] = temp;
    onChange(next);
  };

  // Reorder down
  const handleMoveDown = (index: number) => {
    if (index === skills.length - 1) return;
    const next = [...skills];
    const temp = next[index];
    next[index] = next[index + 1];
    next[index + 1] = temp;
    onChange(next);
  };

  // Batch import
  const handleBatchImport = () => {
    if (!batchText.trim()) return;
    const lines = batchText
      .split('\n')
      .map((l) => l.trim())
      // Strip bullet points: •, ·, -, *, 1., 2), ①, 【1】 etc.
      .map((l) => l.replace(/^([•·\-*]|\d+[\.\、\)]|\([0-9]\)|【\d+】)\s*/, '').trim())
      .filter((l) => l.length > 0);

    if (lines.length === 0) return;

    const newItems: SkillItem[] = lines.map((line, idx) => ({
      id: 'skill_' + (Date.now() + idx) + '_' + Math.random().toString(36).substring(2, 6),
      name: line,
      level: 5,
    }));

    onChange([...skills, ...newItems]);
    setBatchText('');
    setIsBatchOpen(false);
  };

  // Populate recommended skills
  const handleLoadSamples = () => {
    if (skills.length > 0) {
      if (!window.confirm('载入范例将替换现有的技能列表，是否确认继续？')) return;
    }
    const samples: SkillItem[] = RECOMMENDED_SAMPLE_SKILLS.map((name, idx) => ({
      id: 'skill_sample_' + (Date.now() + idx),
      name,
      level: 5,
    }));
    onChange(samples);
  };

  return (
    <div className="space-y-4 text-xs">
      {onUpdateSectionTitle && (
        <SectionTitleBar
          sectionKey="skills"
          currentTitle={sectionTitle}
          onUpdateTitle={onUpdateSectionTitle}
          icon={<Wrench className="w-4 h-4" />}
          subtitle="可自由修改为：专业技能、核心技能、技术栈、技能清单、专业特长等"
        />
      )}

      {/* 排列布局选择与提示 */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2.5">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="font-semibold text-slate-800 flex items-center gap-1.5">
            <List className="w-4 h-4 text-blue-600" />
            技能排列与排版方式：
          </span>
          <span className="text-[11px] text-slate-500">
            已开启自动折行，长句绝对不超出页面边界
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => onChangeLayout && onChangeLayout('list')}
            className={`px-3 py-2 rounded-lg border text-left flex items-start gap-2 cursor-pointer transition-all ${
              skillLayout === 'list'
                ? 'bg-blue-50 border-blue-500 text-blue-900 shadow-2xs font-semibold'
                : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
            }`}
          >
            <List className={`w-4 h-4 mt-0.5 shrink-0 ${skillLayout === 'list' ? 'text-blue-600' : 'text-slate-400'}`} />
            <div>
              <div className="text-xs">条目列表式</div>
              <div className="text-[10px] text-slate-500 font-normal mt-0.5">适合长句详细描述(推荐)</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onChangeLayout && onChangeLayout('grid')}
            className={`px-3 py-2 rounded-lg border text-left flex items-start gap-2 cursor-pointer transition-all ${
              skillLayout === 'grid'
                ? 'bg-blue-50 border-blue-500 text-blue-900 shadow-2xs font-semibold'
                : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
            }`}
          >
            <Grid className={`w-4 h-4 mt-0.5 shrink-0 ${skillLayout === 'grid' ? 'text-blue-600' : 'text-slate-400'}`} />
            <div>
              <div className="text-xs">双列网格式</div>
              <div className="text-[10px] text-slate-500 font-normal mt-0.5">左右两列整齐排布</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onChangeLayout && onChangeLayout('tags')}
            className={`px-3 py-2 rounded-lg border text-left flex items-start gap-2 cursor-pointer transition-all ${
              skillLayout === 'tags'
                ? 'bg-blue-50 border-blue-500 text-blue-900 shadow-2xs font-semibold'
                : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
            }`}
          >
            <Tag className={`w-4 h-4 mt-0.5 shrink-0 ${skillLayout === 'tags' ? 'text-blue-600' : 'text-slate-400'}`} />
            <div>
              <div className="text-xs">胶囊标签式</div>
              <div className="text-[10px] text-slate-500 font-normal mt-0.5">适合短词关键字技术栈</div>
            </div>
          </button>
        </div>
      </div>

      {/* 添加新技能输入框 */}
      <div className="space-y-2">
        <div className="flex gap-2">
          <input
            type="text"
            value={newSkillName}
            onChange={(e) => setNewSkillName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAdd();
              }
            }}
            placeholder="输入技能描述（支持长句完整描述，按回车或点右侧添加）..."
            className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-900 text-xs shadow-2xs"
          />
          <button
            type="button"
            onClick={handleAdd}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            添加技能
          </button>
          <button
            type="button"
            onClick={() => setIsBatchOpen(!isBatchOpen)}
            className={`px-3 py-2 rounded-lg border flex items-center gap-1.5 cursor-pointer transition-colors shrink-0 ${
              isBatchOpen
                ? 'bg-blue-50 border-blue-400 text-blue-700 font-medium'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
            title="批量导入多行技能"
          >
            <ClipboardList className="w-3.5 h-3.5" />
            批量导入
          </button>
        </div>

        {/* 批量导入折叠框 */}
        {isBatchOpen && (
          <div className="p-3 bg-blue-50/50 border border-blue-200 rounded-xl space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-slate-800 text-xs flex items-center gap-1">
                <ClipboardList className="w-3.5 h-3.5 text-blue-600" />
                多行粘贴批量导入：
              </span>
              <span className="text-[11px] text-slate-500">
                每行一项，系统将自动去除序号与圆点
              </span>
            </div>
            <textarea
              rows={4}
              value={batchText}
              onChange={(e) => setBatchText(e.target.value)}
              placeholder="请粘贴多行技能描述，例如：&#10;1. 熟练掌握 React 18 核心原理与 Hook 架构...&#10;2. 深入理解 Web 性能优化与首屏秒开实战...&#10;3. 具备微前端系统拆分与工程化脚手架搭建经验..."
              className="w-full p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-900 text-xs leading-relaxed"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setBatchText('');
                  setIsBatchOpen(false);
                }}
                className="px-3 py-1.5 text-slate-600 hover:bg-slate-200/60 rounded-lg cursor-pointer"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleBatchImport}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
              >
                <Check className="w-3.5 h-3.5" />
                确认批量导入
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 技能列表及就地实时修改 */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-slate-700 font-semibold">技能列表 ({skills.length} 项)：</span>
            <span className="text-[11px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              ✍️ 可直接在框内点击修改错字，无需删掉重填
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleLoadSamples}
              className="text-[11px] text-slate-600 hover:text-blue-600 flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              载入专业范例
            </button>
            {skills.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('确定要清空所有技能吗？')) {
                    onChange([]);
                  }
                }}
                className="text-[11px] text-slate-400 hover:text-red-500 cursor-pointer"
              >
                清空全部
              </button>
            )}
          </div>
        </div>

        {skills.length === 0 ? (
          <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl text-center space-y-2">
            <div className="text-slate-400">暂未添加技能条目</div>
            <div className="text-slate-500 text-[11px]">
              可在上方输入技能描述添加，或点击右上角“载入专业范例”快速体验
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {skills.map((skill, index) => (
              <div
                key={skill.id}
                className="flex items-start gap-2 p-2 bg-white border border-slate-200 rounded-lg shadow-2xs hover:border-slate-300 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all"
              >
                {/* 序号 */}
                <div className="w-6 h-6 rounded bg-slate-100 text-slate-500 font-mono text-[11px] font-semibold flex items-center justify-center shrink-0 mt-0.5">
                  {String(index + 1).padStart(2, '0')}
                </div>

                {/* 就地直接编辑输入框 */}
                <div className="flex-1">
                  <textarea
                    rows={Math.max(1, Math.ceil(skill.name.length / 34))}
                    value={skill.name}
                    onChange={(e) => handleUpdate(skill.id, e.target.value)}
                    placeholder="输入或就地修改技能内容..."
                    className="w-full px-2 py-1 text-xs text-slate-900 bg-transparent border-0 focus:outline-none leading-relaxed resize-y"
                  />
                </div>

                {/* 调整排序与删除按钮 */}
                <div className="flex items-center gap-0.5 shrink-0 mt-0.5">
                  <button
                    type="button"
                    onClick={() => handleMoveUp(index)}
                    disabled={index === 0}
                    className={`p-1 rounded cursor-pointer transition-colors ${
                      index === 0 ? 'text-slate-200 cursor-not-allowed' : 'text-slate-400 hover:text-blue-600 hover:bg-slate-100'
                    }`}
                    title="上移此技能"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMoveDown(index)}
                    disabled={index === skills.length - 1}
                    className={`p-1 rounded cursor-pointer transition-colors ${
                      index === skills.length - 1 ? 'text-slate-200 cursor-not-allowed' : 'text-slate-400 hover:text-blue-600 hover:bg-slate-100'
                    }`}
                    title="下移此技能"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(skill.id)}
                    className="p-1 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded cursor-pointer transition-colors ml-0.5"
                    title="删除此技能"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
