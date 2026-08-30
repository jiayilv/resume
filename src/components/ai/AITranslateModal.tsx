import React, { useState } from 'react';
import { Languages, X, Loader2, Check, ArrowRightLeft } from 'lucide-react';
import { ResumeData } from '../../types';

interface AITranslateModalProps {
  isOpen: boolean;
  onClose: () => void;
  resumeData: ResumeData;
  onApplyTranslated: (translatedData: ResumeData) => void;
}

export const AITranslateModal: React.FC<AITranslateModalProps> = ({
  isOpen,
  onClose,
  resumeData,
  onApplyTranslated,
}) => {
  const [targetLang, setTargetLang] = useState<'en' | 'zh'>('en');
  const [loading, setLoading] = useState(false);
  const [translatedData, setTranslatedData] = useState<ResumeData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTranslate = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/ai/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeData, targetLanguage: targetLang }),
      });
      if (!res.ok) throw new Error('翻译失败');
      const data = await res.json();
      setTranslatedData(data);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || '一键智能翻译失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 px-5 bg-gradient-to-r from-blue-700 to-indigo-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Languages className="w-5 h-5" />
            <div>
              <h2 className="font-bold text-base">AI 简历一键双语互译</h2>
              <p className="text-xs text-blue-100">
                保持专业行业术语与排版格式，一键生成地道英文 / 中文简历
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
          <div className="space-y-2">
            <label className="block text-slate-700 font-semibold">选择目标翻译语言：</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setTargetLang('en')}
                className={`p-3 rounded-xl border text-center font-bold transition-all cursor-pointer ${
                  targetLang === 'en'
                    ? 'border-blue-600 bg-blue-50/70 text-blue-700 ring-2 ring-blue-500/20'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                🇺🇸 翻译为 专业英文简历 (English CV)
              </button>
              <button
                type="button"
                onClick={() => setTargetLang('zh')}
                className={`p-3 rounded-xl border text-center font-bold transition-all cursor-pointer ${
                  targetLang === 'zh'
                    ? 'border-blue-600 bg-blue-50/70 text-blue-700 ring-2 ring-blue-500/20'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                🇨🇳 翻译为 中文标准简历 (Chinese)
              </button>
            </div>
          </div>

          {loading ? (
            <div className="py-10 flex flex-col items-center justify-center text-slate-500 space-y-3">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              <p className="font-bold text-slate-800">Gemini 正在逐段转换专业术语与行文句式...</p>
              <p className="text-slate-400 text-[11px]">转换动词词态、校正学术与行业专有名词</p>
            </div>
          ) : error ? (
            <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-xl text-center">
              {error}
            </div>
          ) : translatedData ? (
            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl space-y-2">
              <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                <Check className="w-4 h-4 text-emerald-600" />
                翻译转换完成！
              </div>
              <p className="text-slate-700 text-xs leading-relaxed">
                已生成对应的 {targetLang === 'en' ? '英文' : '中文'} 简历版本。点击下方应用按钮将自动载入编辑器与预览面板。
              </p>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-medium rounded-xl cursor-pointer text-xs"
          >
            取消
          </button>

          {translatedData ? (
            <button
              type="button"
              onClick={() => {
                onApplyTranslated(translatedData);
                onClose();
              }}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center gap-1.5 cursor-pointer text-xs shadow-xs"
            >
              <Check className="w-4 h-4" />
              载入并应用翻译版本
            </button>
          ) : (
            <button
              type="button"
              disabled={loading}
              onClick={handleTranslate}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex items-center gap-1.5 cursor-pointer text-xs shadow-xs disabled:opacity-50"
            >
              开始智能翻译
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
