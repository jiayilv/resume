import React, { useState } from 'react';
import { SkillItem } from '../../types';
import { Plus, Trash2, Sparkles, Tag, Wrench } from 'lucide-react';
import { SectionTitleBar } from './SectionTitleBar';

interface SkillsEditorProps {
  skills: SkillItem[];
  onChange: (updated: SkillItem[]) => void;
  sectionTitle?: string;
  onUpdateSectionTitle?: (newTitle: string) => void;
}

const COMMON_SKILLS = [
  'React / Next.js', 'Vue 3 / Vite', 'TypeScript', 'Node.js / NestJS', 'Python', 'Java / Spring Boot',
  'Go (Golang)', 'SQL / MySQL / Redis', 'Docker / K8s', 'Tailwind CSS', 'Figma / UI设计', 
  '产品规划 (PRD)', '数据分析 (SQL/Python)', '大模型微调 (LLM/RAG)', '微前端架构', 'Git / CI-CD'
];

export const SkillsEditor: React.FC<SkillsEditorProps> = ({
  skills,
  onChange,
  sectionTitle,
  onUpdateSectionTitle,
}) => {
  const [newSkillName, setNewSkillName] = useState('');

  const handleAdd = (nameToAdd?: string) => {
    const skillName = nameToAdd || newSkillName.trim();
    if (!skillName) return;
    if (skills.some((s) => s.name.toLowerCase() === skillName.toLowerCase())) return;

    const newItem: SkillItem = {
      id: 'skill_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      name: skillName,
      level: 4,
    };
    onChange([...skills, newItem]);
    if (!nameToAdd) setNewSkillName('');
  };

  const handleUpdateLevel = (id: string, level: number) => {
    onChange(skills.map((s) => (s.id === id ? { ...s, level } : s)));
  };

  const handleDelete = (id: string) => {
    onChange(skills.filter((s) => s.id !== id));
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

      {/* Quick Add Custom Skill */}
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
          placeholder="输入自定义技能名称 (按回车添加)..."
          className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-900"
        />
        <button
          type="button"
          onClick={() => handleAdd()}
          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          添加
        </button>
      </div>

      {/* Preset Skill Tag Bank */}
      <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl space-y-2">
        <div className="text-slate-600 font-semibold flex items-center gap-1 text-[11px]">
          <Tag className="w-3 h-3 text-slate-400" />
          快捷推荐技能库（点击直接加入）：
        </div>
        <div className="flex flex-wrap gap-1.5">
          {COMMON_SKILLS.map((tag) => {
            const isAdded = skills.some((s) => s.name.toLowerCase() === tag.toLowerCase());
            return (
              <button
                key={tag}
                type="button"
                onClick={() => !isAdded && handleAdd(tag)}
                disabled={isAdded}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
                  isAdded
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-white border border-slate-200 hover:border-blue-400 hover:text-blue-600 text-slate-700 cursor-pointer shadow-2xs'
                }`}
              >
                {isAdded ? `✓ ${tag}` : `+ ${tag}`}
              </button>
            );
          })}
        </div>
      </div>

      {/* Current Skills List with Level Adjustment */}
      <div className="space-y-2">
        <span className="text-slate-500 font-medium">已添加 {skills.length} 项专业技能：</span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {skills.map((skill) => (
            <div
              key={skill.id}
              className="flex items-center justify-between p-2.5 bg-white border border-slate-200 rounded-lg shadow-2xs"
            >
              <div className="flex-1 mr-2 truncate">
                <span className="font-semibold text-slate-900">{skill.name}</span>
              </div>

              {/* Level Stars */}
              <div className="flex items-center gap-1.5">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => handleUpdateLevel(skill.id, lvl)}
                      className={`w-3.5 h-3.5 rounded-full transition-all cursor-pointer ${
                        lvl <= skill.level ? 'bg-blue-600 scale-105' : 'bg-slate-200 hover:bg-slate-300'
                      }`}
                      title={`熟练度 ${lvl}/5`}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(skill.id)}
                  className="p-1 text-slate-300 hover:text-red-500 cursor-pointer transition-colors ml-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
