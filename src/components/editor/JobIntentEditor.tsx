import React from 'react';
import { JobIntent } from '../../types';
import { SectionTitleBar } from './SectionTitleBar';
import { Compass } from 'lucide-react';

interface JobIntentEditorProps {
  jobIntent: JobIntent;
  onChange: (updated: JobIntent) => void;
  sectionTitle?: string;
  onUpdateSectionTitle?: (newTitle: string) => void;
}

export const JobIntentEditor: React.FC<JobIntentEditorProps> = ({
  jobIntent,
  onChange,
  sectionTitle,
  onUpdateSectionTitle,
}) => {
  const handleChange = (key: keyof JobIntent, value: string) => {
    onChange({ ...jobIntent, [key]: value });
  };

  return (
    <div className="space-y-3 text-xs">
      {onUpdateSectionTitle && (
        <SectionTitleBar
          sectionKey="jobIntent"
          currentTitle={sectionTitle}
          onUpdateTitle={onUpdateSectionTitle}
          icon={<Compass className="w-4 h-4" />}
          subtitle="可自由修改为：求职目标、期望职位、职业意向、应聘意向等"
        />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div>
          <label className="block text-slate-700 font-semibold mb-1">
            期望岗位 / 目标职位 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={jobIntent.targetPosition}
            onChange={(e) => handleChange('targetPosition', e.target.value)}
            placeholder="如：资深前端工程师 / 产品总监"
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
          />
        </div>

        <div>
          <label className="block text-slate-700 font-semibold mb-1">期望工作城市</label>
          <input
            type="text"
            value={jobIntent.targetCity}
            onChange={(e) => handleChange('targetCity', e.target.value)}
            placeholder="如：北京 / 上海 / 远程"
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
          />
        </div>

        <div>
          <label className="block text-slate-700 font-semibold mb-1">期望薪资范围</label>
          <input
            type="text"
            value={jobIntent.targetSalary}
            onChange={(e) => handleChange('targetSalary', e.target.value)}
            placeholder="如：30K - 45K · 16薪 或 面议"
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
          />
        </div>

        <div>
          <label className="block text-slate-700 font-semibold mb-1">期望行业方向</label>
          <input
            type="text"
            value={jobIntent.targetIndustry}
            onChange={(e) => handleChange('targetIndustry', e.target.value)}
            placeholder="如：互联网 / 人工智能 / 企业SaaS"
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-slate-700 font-semibold mb-1">最快到岗时间</label>
          <input
            type="text"
            value={jobIntent.availableTime}
            onChange={(e) => handleChange('availableTime', e.target.value)}
            placeholder="如：随时到岗 / 2周内 / 1个月内"
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
          />
        </div>
      </div>
    </div>
  );
};

