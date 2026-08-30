import React, { useState } from 'react';
import { Target, X, Loader2, Check, AlertCircle, Copy, CheckCheck, Sparkles } from 'lucide-react';
import { ResumeData, AIJDMatchResult } from '../../types';

interface AIJDMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  resumeData: ResumeData;
}

export const AIJDMatchModal: React.FC<AIJDMatchModalProps> = ({
  isOpen,
  onClose,
  resumeData,
}) => {
  const [jdText, setJdText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AIJDMatchResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleMatch = async () => {
    if (!jdText.trim()) {
      alert('请先粘贴目标职位的招聘要求 (JD)');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/ai/match-jd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeData, jobDescription: jdText }),
      });
      if (!res.ok) throw new Error('匹配分析失败');
      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || '匹配失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyPitch = () => {
    if (result?.recommendedPitch) {
      navigator.clipboard.writeText(result.recommendedPitch);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 px-5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            <div>
              <h2 className="font-bold text-base">AI 职位 JD 匹配度精准测评</h2>
              <p className="text-xs text-emerald-100">
                输入目标岗位要求，深度计算匹配契合度，挖掘缺失关键词与专属自荐信
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1 text-xs">
          {/* JD Input */}
          <div className="space-y-1.5">
            <label className="block text-slate-700 font-semibold">
              粘贴目标职位招聘描述（岗位职责、任职要求等）：
            </label>
            <textarea
              rows={4}
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              placeholder="例如：
1. 负责核心商业化产品前端架构设计与技术攻坚；
2. 熟练掌握 React 18 / Next.js / TypeScript，有微前端落地经验；
3. 具备良好的跨团队沟通与工程化提效能力..."
              className="w-full p-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-900 text-xs"
            />
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleMatch}
                disabled={loading || !jdText.trim()}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    正在深度比对计算...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    开始 AI 匹配度测评
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Results Display */}
          {result && (
            <div className="space-y-4 pt-2 border-t border-slate-200">
              {/* Match Header */}
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <span className="text-xs text-emerald-800 font-semibold block mb-0.5">岗位契合度评分</span>
                  <span className="text-2xl font-black text-emerald-950">{result.matchPercentage}% 匹配度</span>
                </div>
                <div className="text-xs text-emerald-800">
                  {result.matchPercentage >= 80 ? '🎯 极度契合，强烈推荐立即投递！' : '💡 建议根据缺失词补充相关经历'}
                </div>
              </div>

              {/* Keywords Matrix */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="font-bold text-emerald-700 block mb-1.5">✓ 简历已命中技能关键词：</span>
                  <div className="flex flex-wrap gap-1">
                    {result.matchedKeywords.map((kw, i) => (
                      <span key={i} className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[11px] font-medium">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="font-bold text-amber-700 block mb-1.5">⚠️ 目标JD中强调但简历缺失项：</span>
                  <div className="flex flex-wrap gap-1">
                    {result.missingKeywords.map((kw, i) => (
                      <span key={i} className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded text-[11px] font-medium">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Advice */}
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1.5">
                <span className="font-bold text-slate-900 block">🎯 针对此 JD 的简历微调建议：</span>
                <ul className="space-y-1 text-slate-700">
                  {result.keyAdvice.map((adv, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>{adv}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommended Pitch Message */}
              {result.recommendedPitch && (
                <div className="bg-emerald-950 text-emerald-100 p-4 rounded-xl space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-xs text-white">
                      💬 专属打招呼自荐信（可直接复制用于 Boss/猎聘）：
                    </span>
                    <button
                      onClick={handleCopyPitch}
                      className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg flex items-center gap-1 cursor-pointer transition-colors text-[11px] font-medium"
                    >
                      {copied ? <CheckCheck className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      {copied ? '已复制！' : '一键复制'}
                    </button>
                  </div>
                  <p className="text-xs leading-relaxed text-emerald-200 bg-emerald-900/60 p-2.5 rounded-lg border border-emerald-800/80 font-sans">
                    {result.recommendedPitch}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-medium rounded-xl cursor-pointer text-xs"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
};
