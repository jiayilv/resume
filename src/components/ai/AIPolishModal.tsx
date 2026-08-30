import React, { useState, useEffect } from 'react';
import { Sparkles, X, Check, Loader2, RefreshCw, AlertCircle } from 'lucide-react';

interface AIPolishModalProps {
  isOpen: boolean;
  onClose: () => void;
  originalText: string;
  contextRole?: string;
  onApply: (newText: string) => void;
}

interface PolishVersion {
  name: string;
  text: string;
  highlights: string;
}

export const AIPolishModal: React.FC<AIPolishModalProps> = ({
  isOpen,
  onClose,
  originalText,
  contextRole,
  onApply,
}) => {
  const [loading, setLoading] = useState(false);
  const [versions, setVersions] = useState<PolishVersion[]>([]);
  const [advice, setAdvice] = useState<string>('');
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && originalText) {
      handleGenerate();
    }
  }, [isOpen, originalText]);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/ai/polish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originalText,
          roleContext: contextRole || '职场专家',
        }),
      });

      if (!res.ok) throw new Error('AI 润色请求失败');
      const data = await res.json();
      if (data.versions && data.versions.length > 0) {
        setVersions(data.versions);
        setAdvice(data.advice || '');
        setSelectedIdx(0);
      } else {
        throw new Error('未能生成有效版本');
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.message || '生成失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 px-5 bg-gradient-to-r from-amber-500 to-amber-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            <div>
              <h2 className="font-bold text-base">AI STAR法则与量化润色</h2>
              <p className="text-xs text-amber-100">
                结合情境(S)、任务(T)、行动(A)、成果(R)与数据量化重塑经历
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
        <div className="p-5 overflow-y-auto space-y-4 flex-1 text-xs">
          {/* Original Text comparison */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
            <span className="font-semibold text-slate-500 block mb-1">【原描述内容】</span>
            <p className="text-slate-700 whitespace-pre-line leading-relaxed">{originalText || '（无内容）'}</p>
          </div>

          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center text-slate-500 space-y-3">
              <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
              <p className="font-semibold text-slate-700">Gemini AI 正在运用 STAR 法则重构经历并量化成果...</p>
              <p className="text-slate-400 text-[11px]">提取动词、提炼业务价值与性能指标</p>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center justify-between">
              <span>{error}</span>
              <button
                onClick={handleGenerate}
                className="px-3 py-1 bg-red-600 text-white rounded font-medium flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" /> 重试
              </button>
            </div>
          ) : (
            <>
              {/* Generated Version Tabs */}
              <div className="space-y-3">
                <div className="flex gap-2 border-b border-slate-200 pb-1">
                  {versions.map((ver, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedIdx(idx)}
                      className={`px-3 py-1.5 font-bold rounded-lg transition-all cursor-pointer ${
                        selectedIdx === idx
                          ? 'bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {ver.name}
                    </button>
                  ))}
                </div>

                {versions[selectedIdx] && (
                  <div className="space-y-3">
                    <div className="bg-amber-50/50 border border-amber-200/80 rounded-xl p-4 space-y-2">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="font-bold text-amber-900">版本亮点：{versions[selectedIdx].highlights}</span>
                      </div>
                      <textarea
                        rows={6}
                        value={versions[selectedIdx].text}
                        onChange={(e) => {
                          const updated = [...versions];
                          updated[selectedIdx].text = e.target.value;
                          setVersions(updated);
                        }}
                        className="w-full p-3 bg-white border border-amber-200 rounded-lg text-slate-900 font-sans leading-relaxed text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    {advice && (
                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-blue-900 flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="font-semibold block">HR 进阶建议:</strong>
                          <span>{advice}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading}
            className="px-3 py-2 text-slate-600 hover:text-slate-800 font-medium rounded-lg flex items-center gap-1.5 cursor-pointer text-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            重新生成
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-medium rounded-xl cursor-pointer text-xs"
            >
              取消
            </button>
            <button
              type="button"
              disabled={loading || !versions[selectedIdx]}
              onClick={() => {
                if (versions[selectedIdx]) {
                  onApply(versions[selectedIdx].text);
                  onClose();
                }
              }}
              className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs text-xs disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              采纳当前版本并填入
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
