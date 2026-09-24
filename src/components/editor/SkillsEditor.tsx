import React, { useState } from 'react';
import { SkillItem } from '../../types';
import { Plus, Trash2, Wrench } from 'lucide-react';
import { SectionTitleBar } from './SectionTitleBar';

interface SkillsEditorProps {
  skills: SkillItem[];
  onChange: (updated: SkillItem[]) => void;
  sectionTitle?: string;
  onUpdateSectionTitle?: (newTitle: string) => void;
}

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
      level: 5,
    };
    onChange([...skills, newItem]);
    if (!nameToAdd) setNewSkillName('');
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
          placeholder="输入专业技能名称 (如：React / TypeScript，按回车添加)..."
          className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-900"
        />
        <button
          type="button"
          onClick={() => handleAdd()}
          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          添加技能
        </button>
      </div>

      {/* Current Skills List */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-slate-500 font-medium">已添加 {skills.length} 项专业技能：</span>
        </div>
        {skills.length === 0 ? (
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-center text-slate-400">
            暂未添加技能，请在上方输入技能名称并回车添加
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {skills.map((skill) => (
              <div
                key={skill.id}
                className="flex items-center justify-between p-2.5 bg-white border border-slate-200 rounded-lg shadow-2xs hover:border-slate-300 transition-colors"
              >
                <div className="flex-1 mr-2 truncate">
                  <span className="font-semibold text-slate-900">{skill.name}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(skill.id)}
                  className="p-1 text-slate-300 hover:text-red-500 cursor-pointer transition-colors ml-1"
                  title="删除此技能"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
