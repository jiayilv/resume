import React, { useState } from 'react';
import { Education } from '../../types';
import { Plus, Trash2, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';

interface EducationEditorProps {
  educations: Education[];
  onChange: (updated: Education[]) => void;
}

export const EducationEditor: React.FC<EducationEditorProps> = ({ educations, onChange }) => {
  const [expandedId, setExpandedId] = useState<string | null>(educations[0]?.id || null);

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

  return (
    <div className="space-y-3 text-xs">
      <div className="flex justify-between items-center mb-1">
        <span className="text-slate-500 font-medium">已添加 {educations.length} 条教育经历</span>
        <button
          type="button"
          onClick={handleAdd}
          className="px-2.5 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 font-semibold rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          添加教育经历
        </button>
      </div>

      {educations.map((item, index) => {
        const isExpanded = expandedId === item.id;

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
              <div className="p-4 space-y-3 bg-white">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      毕业院校 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={item.school}
                      onChange={(e) => handleUpdate(item.id, { school: e.target.value })}
                      placeholder="如：清华大学 / 北京航空航天大学"
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      学历层次 <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={item.degree}
                      onChange={(e) => handleUpdate(item.id, { degree: e.target.value })}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
                        className="w-1/2 px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-center font-mono"
                      />
                      <span className="text-slate-400">至</span>
                      <input
                        type="text"
                        value={item.endDate}
                        onChange={(e) => handleUpdate(item.id, { endDate: e.target.value })}
                        placeholder="2023.06"
                        className="w-1/2 px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-center font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">成绩 GPA / 排名</label>
                    <input
                      type="text"
                      value={item.gpa || ''}
                      onChange={(e) => handleUpdate(item.id, { gpa: e.target.value })}
                      placeholder="如：3.85 / 4.0 (前 5%)"
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">学术荣誉 / 奖学金</label>
                    <input
                      type="text"
                      value={item.honors || ''}
                      onChange={(e) => handleUpdate(item.id, { honors: e.target.value })}
                      placeholder="如：国家奖学金、校级优秀毕业生"
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-slate-700 font-semibold mb-1">主修核心课程 (选填)</label>
                    <input
                      type="text"
                      value={item.courses || ''}
                      onChange={(e) => handleUpdate(item.id, { courses: e.target.value })}
                      placeholder="如：高级算法、分布式系统、计算机网络、操作系统"
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
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
