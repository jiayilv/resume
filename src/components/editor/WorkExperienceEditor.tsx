import React, { useState } from 'react';
import { WorkExperience } from '../../types';
import { Plus, Trash2, ChevronDown, ChevronUp, Tag, X } from 'lucide-react';

interface WorkExperienceEditorProps {
  workExperiences: WorkExperience[];
  onChange: (updated: WorkExperience[]) => void;
  onOpenPolishModal?: (text: string, onApply: (newText: string) => void, contextRole?: string) => void;
}

const QUICK_TAGS = ['主导重构', '团队管理', '核心骨干', '从0到1搭建', '性能优化', '业务增长', '年度优秀员工'];

export const WorkExperienceEditor: React.FC<WorkExperienceEditorProps> = ({
  workExperiences,
  onChange,
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(workExperiences[0]?.id || null);
  const [newTagInputs, setNewTagInputs] = useState<Record<string, string>>({});

  const handleAdd = () => {
    const newId = 'work_' + Date.now();
    const newItem: WorkExperience = {
      id: newId,
      company: '',
      position: '',
      department: '',
      city: '',
      startDate: '2023.01',
      endDate: '',
      current: true,
      description: '',
      achievements: '• 主导...\n• 优化...',
    };
    onChange([newItem, ...workExperiences]);
    setExpandedId(newId);
  };

  const handleUpdate = (id: string, updates: Partial<WorkExperience>) => {
    onChange(workExperiences.map((w) => (w.id === id ? { ...w, ...updates } : w)));
  };

  const handleDelete = (id: string) => {
    onChange(workExperiences.filter((w) => w.id !== id));
  };

  const handleAddTag = (workId: string, tag: string) => {
    if (!tag.trim()) return;
    const work = workExperiences.find((w) => w.id === workId);
    if (!work) return;

    // Append to achievements as a bullet point or tag
    const currentAch = work.achievements || '';
    const newAch = currentAch ? `${currentAch}\n• 【${tag.trim()}】` : `• 【${tag.trim()}】`;
    handleUpdate(workId, { achievements: newAch });
    setNewTagInputs({ ...newTagInputs, [workId]: '' });
  };

  return (
    <div className="space-y-3 text-xs">
      <div className="flex justify-between items-center mb-1">
        <span className="text-slate-500 font-medium">已添加 {workExperiences.length} 段工作/实习经历</span>
        <button
          type="button"
          onClick={handleAdd}
          className="px-2.5 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 font-semibold rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          添加经历
        </button>
      </div>

      {workExperiences.map((item, index) => {
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
                  {item.company || '（未填写公司名称）'}
                </span>
                {item.position && (
                  <span className="text-slate-500 font-medium">· {item.position}</span>
                )}
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
                      公司名称 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={item.company}
                      onChange={(e) => handleUpdate(item.id, { company: e.target.value })}
                      placeholder="如：腾讯科技 / 字节跳动"
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      职位名称 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={item.position}
                      onChange={(e) => handleUpdate(item.id, { position: e.target.value })}
                      placeholder="如：高级前端开发 / 产品专家"
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">所在部门/业务线</label>
                    <input
                      type="text"
                      value={item.department || ''}
                      onChange={(e) => handleUpdate(item.id, { department: e.target.value })}
                      placeholder="如：智能商业化平台部"
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">在职时间段</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={item.startDate}
                        onChange={(e) => handleUpdate(item.id, { startDate: e.target.value })}
                        placeholder="2022.03"
                        className="w-1/2 px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-center font-mono"
                      />
                      <span className="text-slate-400">至</span>
                      {item.current ? (
                        <span className="w-1/2 px-2 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-center font-medium">
                          至今 (在职)
                        </span>
                      ) : (
                        <input
                          type="text"
                          value={item.endDate}
                          onChange={(e) => handleUpdate(item.id, { endDate: e.target.value })}
                          placeholder="2024.08"
                          className="w-1/2 px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-center font-mono"
                        />
                      )}
                    </div>
                    <label className="flex items-center gap-1.5 mt-1.5 cursor-pointer text-slate-600">
                      <input
                        type="checkbox"
                        checked={item.current}
                        onChange={(e) => handleUpdate(item.id, { current: e.target.checked })}
                        className="rounded text-blue-600 w-3.5 h-3.5"
                      />
                      目前仍在此职位
                    </label>
                  </div>
                </div>

                {/* Overall Description */}
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    岗位概况 / 核心职责简述
                  </label>
                  <textarea
                    rows={2}
                    value={item.description}
                    onChange={(e) => handleUpdate(item.id, { description: e.target.value })}
                    placeholder="简述负责的核心业务范围与协作团队规模..."
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                {/* Quick Add Custom Point Bar */}
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-700 flex items-center gap-1">
                      <Tag className="w-3.5 h-3.5 text-blue-600" />
                      添加自定义亮点/标签（快捷插入到工作业绩）：
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newTagInputs[item.id] || ''}
                      onChange={(e) => setNewTagInputs({ ...newTagInputs, [item.id]: e.target.value })}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTag(item.id, newTagInputs[item.id] || '');
                        }
                      }}
                      placeholder="输入自定义亮点并回车 (如: 独立负责千万级流量系统)"
                      className="flex-1 px-2.5 py-1 bg-white border border-slate-300 rounded-md text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddTag(item.id, newTagInputs[item.id] || '')}
                      className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold cursor-pointer"
                    >
                      插入亮点
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <span className="text-[11px] text-slate-500">快捷推荐:</span>
                    {QUICK_TAGS.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleAddTag(item.id, tag)}
                        className="px-2 py-0.5 bg-white border border-slate-200 hover:border-blue-400 text-slate-700 rounded text-[11px] cursor-pointer"
                      >
                        + {tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Key Achievements */}
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    核心业绩与成果（每行一条，支持使用 • 符号）
                  </label>
                  <textarea
                    rows={4}
                    value={item.achievements || ''}
                    onChange={(e) => handleUpdate(item.id, { achievements: e.target.value })}
                    placeholder="• 主导微前端架构重构，页面加载提速 65%&#10;• 设计自动化测试平台，故障率下降 45%"
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
                    删除此条经历
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
