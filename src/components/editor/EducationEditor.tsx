import React, { useState } from 'react';
import { Education } from '../../types';
import { Plus, Trash2, BookOpen, ChevronDown, ChevronUp, Tag, X, GraduationCap } from 'lucide-react';
import { SectionTitleBar } from './SectionTitleBar';

interface EducationEditorProps {
  educations: Education[];
  onChange: (updated: Education[]) => void;
  sectionTitle?: string;
  onUpdateSectionTitle?: (newTitle: string) => void;
}

const COMMON_EDU_TAGS = [
  'CET-4 英语四级', 'CET-6 英语六级', 'TEM-8 专八', '雅思 7.5', '托福 105+',
  '全国计算机二级', '国家奖学金', '校一等奖学金', '优秀毕业生', '三好学生', '院系前 5%', '竞赛一等奖'
];

export const EducationEditor: React.FC<EducationEditorProps> = ({
  educations,
  onChange,
  sectionTitle,
  onUpdateSectionTitle,
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(educations[0]?.id || null);
  const [newPointInput, setNewPointInput] = useState<{ [id: string]: string }>({});

  const handleAdd = () => {
    const newId = 'edu_' + Date.now();
    const newItem: Education = {
      id: newId,
      school: '',
      degree: '本科',
      major: '',
      startDate: '2019.09',
      endDate: '2023.06',
      gpa: '',
      courses: '',
      honors: '',
      customPoints: ['英语四级 (CET-4)'],
      additionalInfo: '',
    };
    onChange([...educations, newItem]);
    setExpandedId(newId);
  };

  const handleUpdate = (id: string, updates: Partial<Education>) => {
    onChange(educations.map((e) => (e.id === id ? { ...e, ...updates } : e)));
  };

  const handleDelete = (id: string) => {
    onChange(educations.filter((e) => e.id !== id));
  };

  const handleAddCustomPoint = (id: string, pointToAdd?: string) => {
    const text = pointToAdd || newPointInput[id]?.trim();
    if (!text) return;
    const edu = educations.find((e) => e.id === id);
    if (!edu) return;

    const currentPoints = edu.customPoints || [];
    if (currentPoints.includes(text)) return;

    handleUpdate(id, { customPoints: [...currentPoints, text] });
    setNewPointInput({ ...newPointInput, [id]: '' });
  };

  const handleRemoveCustomPoint = (id: string, indexToRemove: number) => {
    const edu = educations.find((e) => e.id === id);
    if (!edu || !edu.customPoints) return;
    handleUpdate(id, {
      customPoints: edu.customPoints.filter((_, idx) => idx !== indexToRemove),
    });
  };

  return (
    <div className="space-y-3 text-xs">
      {onUpdateSectionTitle && (
        <SectionTitleBar
          sectionKey="education"
          currentTitle={sectionTitle}
          onUpdateTitle={onUpdateSectionTitle}
          icon={<GraduationCap className="w-4 h-4" />}
          subtitle="可自由修改为：教育经历、学历学位、求学经历、学习履历等"
        />
      )}

      <div className="flex justify-between items-center mb-1">
        <span className="text-slate-500 font-medium">已添加 {educations.length} 条教育背景</span>
        <button
          type="button"
          onClick={handleAdd}
          className="px-2.5 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 font-semibold rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          添加教育背景
        </button>
      </div>

      {educations.map((item, index) => {
        const isExpanded = expandedId === item.id;
        const currentPoints = item.customPoints || [];

        return (
          <div
            key={item.id}
            className="border border-slate-200 bg-white rounded-xl overflow-hidden shadow-2xs transition-all"
          >
            <div
              onClick={() => setExpandedId(isExpanded ? null : item.id)}
              className="p-3 bg-slate-50/80 hover:bg-slate-100/80 flex items-center justify-between cursor-pointer border-b border-slate-200/60"
            >
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-[11px] font-bold flex items-center justify-center">
                  {index + 1}
                </span>
                <span className="font-bold text-slate-900">
                  {item.school || '（未填写院校名称）'}
                </span>
                {item.major && (
                  <span className="text-slate-500 font-medium">· {item.major} ({item.degree})</span>
                )}
              </div>

              <div className="flex items-center gap-2 text-slate-400">
                <span className="text-[11px] font-mono">
                  {item.startDate} - {item.endDate}
                </span>
                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </div>

            {isExpanded && (
              <div className="p-4 space-y-3.5 bg-white">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      毕业院校 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={item.school}
                      onChange={(e) => handleUpdate(item.id, { school: e.target.value })}
                      placeholder="如：清华大学 / 浙江大学"
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      学历层次 <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={item.degree}
                      onChange={(e) => handleUpdate(item.id, { degree: e.target.value })}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-900"
                    >
                      <option value="博士">博士研究生</option>
                      <option value="硕士">硕士研究生</option>
                      <option value="本科">本科 (学士)</option>
                      <option value="大专">大专 (专科)</option>
                      <option value="高中">高中 / 中专</option>
                      <option value="MBA/EMBA">MBA / EMBA</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      专业名称 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={item.major}
                      onChange={(e) => handleUpdate(item.id, { major: e.target.value })}
                      placeholder="如：计算机科学与技术"
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">就读时间</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={item.startDate}
                        onChange={(e) => handleUpdate(item.id, { startDate: e.target.value })}
                        placeholder="2019.09"
                        className="w-1/2 px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-center font-mono text-slate-900"
                      />
                      <span className="text-slate-400">至</span>
                      <input
                        type="text"
                        value={item.endDate}
                        onChange={(e) => handleUpdate(item.id, { endDate: e.target.value })}
                        placeholder="2023.06"
                        className="w-1/2 px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-center font-mono text-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">成绩 GPA / 排名</label>
                    <input
                      type="text"
                      value={item.gpa || ''}
                      onChange={(e) => handleUpdate(item.id, { gpa: e.target.value })}
                      placeholder="如：3.85 / 4.0 (专业前 5%)"
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">学术荣誉 / 奖学金</label>
                    <input
                      type="text"
                      value={item.honors || ''}
                      onChange={(e) => handleUpdate(item.id, { honors: e.target.value })}
                      placeholder="如：国家奖学金、校级优秀毕业生"
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-900"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-slate-700 font-semibold mb-1">主修核心课程 (选填)</label>
                    <input
                      type="text"
                      value={item.courses || ''}
                      onChange={(e) => handleUpdate(item.id, { courses: e.target.value })}
                      placeholder="如：高级算法、数据结构、计算机网络、分布式系统"
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-900"
                    />
                  </div>
                </div>

                {/* Custom Points & Certificates inside Education (CET-4, CET-6, etc.) */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
                  <div className="flex justify-between items-center">
                    <label className="font-semibold text-slate-800 flex items-center gap-1">
                      <Tag className="w-3.5 h-3.5 text-blue-600" />
                      自定义加分项 / 证书等级（如：CET-4、CET-6、计算机二级、竞赛等）
                    </label>
                  </div>

                  {/* Add Input */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newPointInput[item.id] || ''}
                      onChange={(e) => setNewPointInput({ ...newPointInput, [item.id]: e.target.value })}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddCustomPoint(item.id);
                        }
                      }}
                      placeholder="输入自定义项 (如：CET-4 610分 / 全国数模一等奖)，回车添加"
                      className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-[11px] focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-900"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddCustomPoint(item.id)}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg flex items-center gap-1 cursor-pointer transition-colors shadow-2xs text-[11px]"
                    >
                      <Plus className="w-3 h-3" />
                      添加此项
                    </button>
                  </div>

                  {/* Quick Tags */}
                  <div className="flex flex-wrap gap-1.5 items-center pt-1">
                    <span className="text-[10px] text-slate-500 font-medium">快速添加:</span>
                    {COMMON_EDU_TAGS.map((tag) => {
                      const isAdded = currentPoints.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => !isAdded && handleAddCustomPoint(item.id, tag)}
                          disabled={isAdded}
                          className={`px-2 py-0.5 rounded text-[10px] font-medium transition-all ${
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

                  {/* Added Points Pills */}
                  {currentPoints.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1.5">
                      {currentPoints.map((pt, pIdx) => (
                        <span
                          key={pIdx}
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-800 border border-blue-200 rounded-lg text-xs font-medium"
                        >
                          {pt}
                          <button
                            type="button"
                            onClick={() => handleRemoveCustomPoint(item.id, pIdx)}
                            className="text-blue-400 hover:text-blue-700 cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Additional Info / School Experience Description */}
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    在校经历 / 附加亮点说明 (选填)
                  </label>
                  <textarea
                    rows={2}
                    value={item.additionalInfo || ''}
                    onChange={(e) => handleUpdate(item.id, { additionalInfo: e.target.value })}
                    placeholder="如：担任院学生会主席，组织多场大型学术讲座；连续三年荣获校三好学生标兵..."
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-900 leading-relaxed"
                  />
                </div>

                <div className="flex justify-end pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="text-red-500 hover:text-red-700 flex items-center gap-1 font-medium cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    删除此学历
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
