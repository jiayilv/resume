import React, { useState, useEffect } from 'react';
import { SlicedResumePage, printResumeCanvas, openPrintWindow, exportToPdf } from '../utils/exportUtils';
import { Printer, Download, ExternalLink, X, Check, Loader2, FileText, Sparkles, Layers } from 'lucide-react';

interface PrintPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  pages: SlicedResumePage[];
  isLoading: boolean;
  docTitle: string;
}

export const PrintPreviewModal: React.FC<PrintPreviewModalProps> = ({
  isOpen,
  onClose,
  pages,
  isLoading,
  docTitle,
}) => {
  const [activePageIndex, setActivePageIndex] = useState<number>(0);
  const [isPrinting, setIsPrinting] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setActivePageIndex(0);
      setActionMessage(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePrintNow = async () => {
    setIsPrinting(true);
    setActionMessage('正在准备打印...');
    try {
      await printResumeCanvas('resume-canvas', docTitle);
      setActionMessage('已唤起系统打印窗口');
      setTimeout(() => setActionMessage(null), 3000);
    } catch (error) {
      console.error(error);
      openPrintWindow(pages, docTitle);
    } finally {
      setIsPrinting(false);
    }
  };

  const handleOpenNewTab = () => {
    openPrintWindow(pages, docTitle);
  };

  const handleDownloadPdf = async () => {
    setIsExporting(true);
    setActionMessage('正在生成高分辨率 A4 PDF...');
    try {
      await exportToPdf('resume-canvas', `${docTitle}.pdf`);
      setActionMessage('PDF 下载已开始');
      setTimeout(() => setActionMessage(null), 3000);
    } catch (error) {
      console.error(error);
      alert('导出 PDF 失败，请使用新标签页打印另存为 PDF');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-xs no-print animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-5xl h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-600 flex items-center justify-center">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-800">A4 截图高保真打印预览</h3>
                <span className="px-2 py-0.5 text-xs font-semibold bg-emerald-100 text-emerald-700 rounded-full flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  已完成 A4 智能分片 (共 {pages.length} 页)
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                基于右侧 A4 真实渲染截图切片，超出第一页已自动添加规范上边距 (22mm)，所见即所得
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-slate-100/70">
          {/* Left Thumbnails & Page Controls */}
          <div className="w-full md:w-64 p-4 border-b md:border-b-0 md:border-r border-slate-200 bg-white flex flex-col shrink-0 overflow-y-auto">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              页面列表 (标准 A4)
            </span>

            <div className="space-y-3 flex-1">
              {isLoading ? (
                <div className="py-12 flex flex-col items-center justify-center text-slate-400 gap-2">
                  <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                  <span className="text-xs">正在渲染 A4 截图切片...</span>
                </div>
              ) : (
                pages.map((page, idx) => (
                  <div
                    key={idx}
                    onClick={() => setActivePageIndex(idx)}
                    className={`group relative p-2 rounded-xl border-2 cursor-pointer transition-all ${
                      activePageIndex === idx
                        ? 'border-blue-600 bg-blue-50/50 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50'
                    }`}
                  >
                    <div className="aspect-[210/297] bg-white rounded-lg overflow-hidden border border-slate-200 shadow-2xs">
                      <img
                        src={page.dataUrl}
                        alt={`第 ${page.pageNumber} 页`}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className={`text-xs font-bold ${activePageIndex === idx ? 'text-blue-700' : 'text-slate-700'}`}>
                        第 {page.pageNumber} 页
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {page.pageNumber === 1 ? '首屏包含照片' : '+22mm 上边距'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Quick Tips */}
            <div className="mt-4 p-3 bg-blue-50/60 rounded-xl border border-blue-100 text-[11px] text-blue-800 space-y-1">
              <div className="font-semibold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-blue-600" />
                打印小贴士
              </div>
              <p className="text-blue-700/90 leading-relaxed">
                在浏览器打印窗口中，建议将“边距”设置为<b>“无”</b>，并勾选<b>“背景图形”</b>。
              </p>
            </div>
          </div>

          {/* Right Main Page Preview */}
          <div className="flex-1 p-6 overflow-y-auto flex flex-col items-center justify-start bg-slate-200/60">
            {isLoading ? (
              <div className="my-auto flex flex-col items-center justify-center text-slate-500 gap-3">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
                <p className="text-sm font-medium">正在生成超清截图切片，请稍候...</p>
              </div>
            ) : pages[activePageIndex] ? (
              <div className="flex flex-col items-center max-w-full">
                <div className="mb-2 text-xs font-medium text-slate-500 flex items-center gap-2">
                  <span>当前预览：第 {pages[activePageIndex].pageNumber} 页 / 共 {pages.length} 页</span>
                  <span className="text-slate-300">|</span>
                  <span>尺寸：210mm × 297mm (A4)</span>
                </div>

                <div className="relative bg-white shadow-xl rounded-lg overflow-hidden border border-slate-300 w-full max-w-[580px] aspect-[210/297] flex items-center justify-center transition-all">
                  <img
                    src={pages[activePageIndex].dataUrl}
                    alt={`Page ${pages[activePageIndex].pageNumber}`}
                    className="w-full h-full object-contain select-none"
                  />
                </div>
              </div>
            ) : (
              <div className="my-auto text-slate-400 text-sm">暂无页面数据</div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-200 bg-white flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-500">
            {actionMessage ? (
              <span className="text-blue-600 font-medium flex items-center gap-1.5 animate-in fade-in">
                <Sparkles className="w-3.5 h-3.5" />
                {actionMessage}
              </span>
            ) : (
              <span>✨ 截图切片已就绪，可直接打印或下载 A4 矢量级 PDF</span>
            )}
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              onClick={handleOpenNewTab}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
              title="在新浏览器标签页中打开纯净打印页面"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>新标签页纯净打印</span>
            </button>

            <button
              onClick={handleDownloadPdf}
              disabled={isExporting || isLoading}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-medium rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-all disabled:opacity-50"
            >
              {isExporting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              <span>下载 A4 PDF</span>
            </button>

            <button
              onClick={handlePrintNow}
              disabled={isPrinting || isLoading}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition-all disabled:opacity-50 hover:shadow-lg"
            >
              {isPrinting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
              ) : (
                <Printer className="w-3.5 h-3.5" />
              )}
              <span>立即调用打印</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
