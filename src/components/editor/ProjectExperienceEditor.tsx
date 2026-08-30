import React, { useState } from 'react';
import { ProjectExperience } from '../../types';
import { Plus, Trash2, Sparkles, ChevronDown, ChevronUp, FolderGit2 } from 'lucide-react';

interface ProjectExperienceEditorProps {
  projectExperiences: ProjectExperience[];
  onChange: (updated: ProjectExperience[]) => void;
  onOpenPolishModal: (text: string, onApply: (newText: string) => void, contextRole?: string) => void;
}

export const ProjectExperienceEditor: React.FC<ProjectExperienceEditorProps> = ({
  projectExperiences,
  onChange,
  onOpenPolishModal,
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(projectExperiences[0]?.id || null);

  const handleAdd = () => {
    const newId = 'proj_' + Date.now();
    const newItem: ProjectExperience = {
      id: newId,
      projectName: '',
      role: '',
      startDate: '2023.06',
      endDate: '2024.01',
      current: false,
      techStack: 'React + TypeScript + Node.js',
      description: '',
      results: '• 项目上线后日活提升...\n• 获得...',
    };
    onChange([newItem, ...projectExperiences]);
    setExpandedId(newId);
  };

  const handleUpdate = (id: string, updates: Partial<ProjectExperience>) => {
    onChange(projectExperiences.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  const handleDelete = (id: string) => {
    onChange(projectExperiences.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-3 text-xs">
      <div className="flex justify-between items-center mb-1">
        <span className="text-slate-500 font-medium">已添加 {projectExperiences.length} 个重点项目</span>
        <button
          type="button"
          onClick={handleAdd}
          className="px-2.5 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 font-semibold rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          添加项目
        </button>
      </div>

      {projectExperiences.map((item, index) => {
        const isExpanded = expandedId === item.id;

        return (
          <div
            key={item.id}
            className="border border-slate-200 bg-white rounded-xl overflow-hidden shadow-2xs transition-all"
          >
            {/* Header Accordion Bar */}
            <div
              onClick={() => setExpandedId(isExpanded ? null : item.id)}
              className="p-3 bg-slate-50/80 hover:bg-slate-100/80 flex items-center justify-between cursor-pointer border-b border-slate-200/60"
            >
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-[11px] font-bold flex items-center justify-center">
                  {index + 1}
                </span>
                <span className="font-bold text-slate-900">
                  {item.projectName || '（未填写项目名称）'}
                </span>
                {item.role && <span className="text-slate-500 font-medium">· {item.role}</span>}
              </div>

              <div className="flex items-center gap-2 text-slate-400">
                <span className="text-[11px] font-mono">
                  {item.startDate || '开始'} - {item.current ? '至今' : item.endDate || '结束'}
                </span>
                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </div>

            {/* Expandable Form */}
            {isExpanded && (
              <div className="p-4 space-y-3 bg-white">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      项目名称 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={item.projectName}
                      onChange={(e) => handleUpdate(item.id, { projectName: e.target.value })}
                      placeholder="如：NovaFlow 自动化工作流引擎"
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      担任角色 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={item.role}
                      onChange={(e) => handleUpdate(item.id, { role: e.target.value })}
                      placeholder="如：前端核心主导 / 技术架构师"
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-slate-700 font-semibold mb-1">技术栈 / 采用工具</label>
                    <input
                      type="text"
                      value={item.techStack || ''}
                      onChange={(e) => handleUpdate(item.id, { techStack: e.target.value })}
                      placeholder="如：React 18 + TypeScript + Zustand + WebAssembly + NestJS"
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono text-[11px]"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">项目起止时间</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={item.startDate}
                        onChange={(e) => handleUpdate(item.id, { startDate: e.target.value })}
                        placeholder="2023.01"
                        className="w-1/2 px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-center font-mono"
                      />
                      <span className="text-slate-400">至</span>
                      {item.current ? (
                        <span className="w-1/2 px-2 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-center font-medium">
                          至今
                        </span>
                      ) : (
                        <input
                          type="text"
                          value={item.endDate}
                          onChange={(e) => handleUpdate(item.id, { endDate: e.target.value })}
                          placeholder="2023.12"
                          className="w-1/2 px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-center font-mono"
                        />
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">项目/演示链接 (选填)</label>
                    <input
                      type="text"
                      value={item.projectUrl || ''}
                      onChange={(e) => handleUpdate(item.id, { projectUrl: e.target.value })}
                      placeholder="如：https://github.com/..."
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono text-[11px]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">项目背景与主要职责</label>
                  <textarea
                    rows={2}
                    value={item.description}
                    onChange={(e) => handleUpdate(item.id, { description: e.target.value })}
                    placeholder="简述项目目标、痛点以及你负责的核心功能模块..."
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-slate-700 font-semibold flex items-center gap-1">
                      项目战果与关键指标（量化收益）
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        onOpenPolishModal(
                          item.results || item.description,
                          (polished) => handleUpdate(item.id, { results: polished }),
                          `${item.projectName} ${item.role}`
                        )
                      }
                      className="text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 px-2 py-0.5 rounded-md font-bold flex items-center gap-1 cursor-pointer transition-colors text-[11px]"
                    >
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      AI 润色战果
                    </button>
                  </div>
                  <textarea
                    rows={3}
                    value={item.results || ''}
                    onChange={(e) => handleUpdate(item.id, { results: e.target.value })}
                    placeholder="• 累计支撑超 800 万次自动化调度，系统稳定性 99.99%&#10;• 开源仓库获 GitHub 2.3k Stars"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-sans"
                  />
                </div>

                <div className="flex justify-end pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="text-red-500 hover:text-red-700 flex items-center gap-1 font-medium cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    删除此项目
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
