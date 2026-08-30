import React, { useState, useEffect } from 'react';
import { Sparkles, X, Loader2, CheckCircle, AlertTriangle, TrendingUp, ShieldCheck, Check, ArrowRight } from 'lucide-react';
import { ResumeData, AIDiagnosisResult } from '../../types';

interface AIDiagnosisModalProps {
  isOpen: boolean;
  onClose: () => void;
  resumeData: ResumeData;
  onApplyFix?: (original: string, suggestion: string) => void;
}

export const AIDiagnosisModal: React.FC<AIDiagnosisModalProps> = ({
  isOpen,
  onClose,
  resumeData,
}) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AIDiagnosisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      handleDiagnose();
    }
  }, [isOpen]);

  const handleDiagnose = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/ai/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeData }),
      });
      if (!res.ok) throw new Error('诊断请求失败');
      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || '简历深度诊断失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 px-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-6 h-6" />
            <div>
              <h2 className="font-bold text-base">AI 简历深度体检与ATS评分</h2>
              <p className="text-xs text-blue-100">
                模拟大厂HR初筛与ATS自动化筛选算法，全面扫描漏洞与提升空间
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

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {loading ? (
            <div className="py-16 flex flex-col items-center justify-center text-slate-500 space-y-3">
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
              <p className="font-bold text-slate-800 text-sm">正在深度诊断简历结构、词汇、数据量化与匹配度...</p>
              <p className="text-slate-400 text-xs">扫描工作经历 · 检测错别字 · 评估STAR法则覆盖率</p>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 text-center space-y-2">
              <p>{error}</p>
              <button
                onClick={handleDiagnose}
                className="px-4 py-1.5 bg-red-600 text-white rounded-lg font-medium cursor-pointer"
              >
                重试诊断
              </button>
            </div>
          ) : result ? (
            <div className="space-y-6">
              {/* Score Header Card */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
                <div className="flex items-center gap-5">
                  <div className="relative flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full border-4 border-blue-400 flex flex-col items-center justify-center bg-slate-950">
                      <span className="text-2xl font-black text-white">{result.score}</span>
                      <span className="text-[10px] text-blue-300 font-semibold">综合得分</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs bg-blue-500/30 text-blue-300 border border-blue-400/40 px-2 py-0.5 rounded font-bold">
                        评级: {result.grade} 级
                      </span>
                      <span className="text-xs text-slate-300">
                        {result.score >= 85 ? '🌟 大厂面试通过率极高' : result.score >= 70 ? '👍 良好，仍有优化空间' : '⚠️ 建议重点优化'}
                      </span>
                    </div>
                    <p className="text-slate-200 text-xs leading-relaxed max-w-md">{result.summary}</p>
                  </div>
                </div>

                {/* Dimension progress bars */}
                <div className="w-full sm:w-64 space-y-2 text-[11px] bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                  <div>
                    <div className="flex justify-between text-slate-300 mb-0.5">
                      <span>完整度 (Completeness)</span>
                      <strong className="text-white">{result.dimensions.completeness}%</strong>
                    </div>
                    <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-blue-400 h-full rounded-full" style={{ width: `${result.dimensions.completeness}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-300 mb-0.5">
                      <span>ATS 友好度 (Keywords)</span>
                      <strong className="text-white">{result.dimensions.atsFriendliness}%</strong>
                    </div>
                    <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-indigo-400 h-full rounded-full" style={{ width: `${result.dimensions.atsFriendliness}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-300 mb-0.5">
                      <span>成果量化度 (Impact)</span>
                      <strong className="text-white">{result.dimensions.impactQuantification}%</strong>
                    </div>
                    <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${result.dimensions.impactQuantification}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-300 mb-0.5">
                      <span>语言精炼度 (Conciseness)</span>
                      <strong className="text-white">{result.dimensions.conciseness}%</strong>
                    </div>
                    <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-amber-400 h-full rounded-full" style={{ width: `${result.dimensions.conciseness}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Strengths & Improvements Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Strengths */}
                <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 space-y-2.5">
                  <h3 className="font-bold text-emerald-900 text-xs flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    已具备的核心优势亮点
                  </h3>
                  <ul className="space-y-1.5 text-slate-700">
                    {result.strengths.map((s, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-emerald-600 font-bold">✓</span>
                        <span className="leading-relaxed">{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Improvements */}
                <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 space-y-2.5">
                  <h3 className="font-bold text-amber-900 text-xs flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-amber-600" />
                    需重点改进的缺陷与建议
                  </h3>
                  <ul className="space-y-1.5 text-slate-700">
                    {result.improvements.map((imp, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-amber-600 font-bold">→</span>
                        <span className="leading-relaxed">{imp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Typos and Phrasing suggestions */}
              {result.typosAndPhrasing?.length > 0 && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                  <h3 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    文字措辞 & 语法规范修改建议
                  </h3>
                  <div className="space-y-2">
                    {result.typosAndPhrasing.map((item, idx) => (
                      <div key={idx} className="bg-white p-3 rounded-lg border border-slate-200 text-xs space-y-1">
                        <div className="flex items-center gap-2 font-mono">
                          <span className="line-through text-red-500 bg-red-50 px-1.5 py-0.5 rounded">{item.original}</span>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                          <span className="font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">{item.suggestion}</span>
                        </div>
                        <p className="text-slate-500 text-[11px]">{item.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl cursor-pointer text-xs shadow-xs"
          >
            知道了，去优化简历
          </button>
        </div>
      </div>
    </div>
  );
};
