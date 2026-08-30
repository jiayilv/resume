import React, { useState } from 'react';
import { Sparkles, Wand2, Loader2, Check, FileCheck2 } from 'lucide-react';
import { ResumeData } from '../../types';
import { SectionTitleBar } from './SectionTitleBar';

interface SummaryEditorProps {
  summary: string;
  sectionTitle?: string;
  resumeData: ResumeData;
  onChange: (updated: string) => void;
  onChangeTitle?: (newTitle: string) => void;
}

export const SummaryEditor: React.FC<SummaryEditorProps> = ({
  summary,
  sectionTitle = '自我评价',
  resumeData,
  onChange,
  onChangeTitle,
}) => {
  const [loading, setLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<{
    primarySummary: string;
    alternativeSummary: string;
    coreKeywords: string[];
  } | null>(null);

  const handleGenerateSummary = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai/generate-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeData }),
      });
      if (!res.ok) throw new Error('生成失败');
      const data = await res.json();
      setAiSuggestions(data);
    } catch (err) {
      console.error(err);
      alert('AI 总结生成失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 text-xs">
      {/* Title Customization Bar */}
      {onChangeTitle && (
        <SectionTitleBar
          sectionKey="summary"
          currentTitle={sectionTitle}
          onUpdateTitle={onChangeTitle}
          icon={<FileCheck2 className="w-4 h-4" />}
          subtitle="可自由修改为：自我评价、个人总结、个人优势、关于我、职业素养等"
        />
      )}

      {/* Main Content Area */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="block text-slate-700 font-semibold">
            {sectionTitle || '自我评价'} 正文内容（建议 150-300 字，突显核心竞争力）
          </label>
          <button
            type="button"
            onClick={handleGenerateSummary}
            disabled={loading}
            className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs text-[11px]"
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                正在提炼亮点...
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                智能基于经历提炼亮点
              </>
            )}
          </button>
        </div>

        <textarea
          rows={6}
          value={summary}
          onChange={(e) => onChange(e.target.value)}
          placeholder="例如：5年互联网全栈开发经验，具备扎实的计算机基础与大型分布式系统架构能力。熟练掌握 React、TypeScript、Node.js 及云原生微服务。具备良好的技术领导力与业务敏锐度，善于通过工程化与自动化手段为团队提效 40%..."
          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none leading-relaxed text-slate-900"
        />
      </div>

      {/* AI Suggested Cards */}
      {aiSuggestions && (
        <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl space-y-3">
          <div className="flex items-center justify-between font-bold text-amber-900">
            <span className="flex items-center gap-1.5">
              <Wand2 className="w-3.5 h-3.5 text-amber-600" />
              智能提炼推荐（点击应用）：
            </span>
          </div>

          {aiSuggestions.coreKeywords?.length > 0 && (
            <div className="flex flex-wrap gap-1">
              <span className="text-amber-800 font-semibold">提取标签:</span>
              {aiSuggestions.coreKeywords.map((kw, i) => (
                <span key={i} className="bg-amber-100/90 text-amber-900 px-2 py-0.5 rounded text-[10px] font-medium">
                  {kw}
                </span>
              ))}
            </div>
          )}

          <div className="space-y-2">
            <div className="bg-white p-3 rounded-lg border border-amber-200/80 shadow-2xs space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-900 text-[11px]">版本一：【专业严谨版】</span>
                <button
                  type="button"
                  onClick={() => onChange(aiSuggestions.primarySummary)}
                  className="px-2 py-0.5 bg-amber-600 hover:bg-amber-700 text-white rounded font-semibold cursor-pointer text-[10px] flex items-center gap-1"
                >
                  <Check className="w-3 h-3" /> 应用此版本
                </button>
              </div>
              <p className="text-slate-700 text-xs leading-relaxed">{aiSuggestions.primarySummary}</p>
            </div>

            <div className="bg-white p-3 rounded-lg border border-amber-200/80 shadow-2xs space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-900 text-[11px]">版本二：【敏捷进取版】</span>
                <button
                  type="button"
                  onClick={() => onChange(aiSuggestions.alternativeSummary)}
                  className="px-2 py-0.5 bg-amber-600 hover:bg-amber-700 text-white rounded font-semibold cursor-pointer text-[10px] flex items-center gap-1"
                >
                  <Check className="w-3 h-3" /> 应用此版本
                </button>
              </div>
              <p className="text-slate-700 text-xs leading-relaxed">{aiSuggestions.alternativeSummary}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

