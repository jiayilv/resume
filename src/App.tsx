import React, { useState, useRef, useEffect } from 'react';
import {
  ResumeData,
  ThemeConfig,
} from './types';
import {
  sampleFrontendResume,
  sampleProductManagerResume,
  sampleDesignerResume,
  sampleFreshGradResume,
} from './data/sampleResumes';
import { ProfileEditor } from './components/editor/ProfileEditor';
import { JobIntentEditor } from './components/editor/JobIntentEditor';
import { WorkExperienceEditor } from './components/editor/WorkExperienceEditor';
import { ProjectExperienceEditor } from './components/editor/ProjectExperienceEditor';
import { EducationEditor } from './components/editor/EducationEditor';
import { SkillsEditor } from './components/editor/SkillsEditor';
import { CertificatesLanguagesEditor } from './components/editor/CertificatesLanguagesEditor';
import { SummaryEditor } from './components/editor/SummaryEditor';
import { ResumePreview } from './components/ResumePreview';
import { ThemeSelector } from './components/ThemeSelector';
import {
  exportToPdf,
  exportToJson,
  printResumeCanvas,
  sliceResumeCanvasToPages,
  openPrintWindow,
  SlicedResumePage,
} from './utils/exportUtils';
import { PrintPreviewModal } from './components/PrintPreviewModal';
import {
  Printer,
  Download,
  Upload,
  FileText,
  Palette,
  ZoomIn,
  ZoomOut,
  Briefcase,
  FolderGit2,
  GraduationCap,
  Wrench,
  Award,
  User,
  Compass,
  FileCheck2,
  ChevronRight,
  Eye,
  Sparkles,
  Loader2,
  ExternalLink,
} from 'lucide-react';

const STORAGE_KEY = 'jianliben_resume_data_v1';
const THEME_KEY = 'jianliben_theme_data_v1';

export function App() {
  // Load saved state or default to sampleFrontendResume
  const [resumeData, setResumeData] = useState<ResumeData>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          sectionTitles: {
            summary: '自我评价',
            ...parsed.sectionTitles,
          },
        };
      } catch (e) {
        console.error('Failed to parse saved resume data', e);
      }
    }
    return {
      ...sampleFrontendResume,
      sectionTitles: {
        summary: '自我评价',
      },
    };
  });

  const [theme, setTheme] = useState<ThemeConfig>(() => {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved theme', e);
      }
    }
    return {
      templateId: 'modern',
      primaryColor: '#1e40af',
      fontFamily: 'sans',
      fontSize: 'medium',
      lineHeight: 'normal',
      sectionSpacing: 'normal',
      pagePadding: 'normal',
      autoFitA4: false,
    };
  });

  // Editor Navigation Tab
  const [activeTab, setActiveTab] = useState<string>('profile');
  const [showThemePanel, setShowThemePanel] = useState<boolean>(true);
  const [previewScale, setPreviewScale] = useState<number>(0.85);
  const [isPrinting, setIsPrinting] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  // Print Slicing Modal state
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);
  const [slicedPages, setSlicedPages] = useState<SlicedResumePage[]>([]);
  const [isSlicing, setIsSlicing] = useState<boolean>(false);

  const previewRef = useRef<HTMLDivElement>(null);
  const importInputRef = useRef<HTMLInputElement>(null);

  // Auto save to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(resumeData));
  }, [resumeData]);

  useEffect(() => {
    localStorage.setItem(THEME_KEY, JSON.stringify(theme));
  }, [theme]);

  // Adjust preview scale for smaller screens automatically
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setPreviewScale(0.48);
      } else if (window.innerWidth < 1200) {
        setPreviewScale(0.7);
      } else {
        setPreviewScale(0.85);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Section toggle
  const handleToggleSection = (sectionKey: string) => {
    setResumeData((prev) => {
      const hidden = prev.hiddenSections.includes(sectionKey)
        ? prev.hiddenSections.filter((k) => k !== sectionKey)
        : [...prev.hiddenSections, sectionKey];
      return { ...prev, hiddenSections: hidden };
    });
  };

  // Preset Template loader
  const handleLoadSample = (type: 'frontend' | 'pm' | 'designer' | 'grad') => {
    if (confirm('载入范例将覆盖当前编辑内容，是否继续？')) {
      if (type === 'frontend') {
        setResumeData({
          ...sampleFrontendResume,
          sectionTitles: { summary: '自我评价' },
        });
        setTheme((t) => ({ ...t, templateId: 'modern', primaryColor: '#1e40af' }));
      } else if (type === 'pm') {
        setResumeData({
          ...sampleProductManagerResume,
          sectionTitles: { summary: '自我评价' },
        });
        setTheme((t) => ({ ...t, templateId: 'classic', primaryColor: '#0f172a' }));
      } else if (type === 'designer') {
        setResumeData({
          ...sampleDesignerResume,
          sectionTitles: { summary: '自我评价' },
        });
        setTheme((t) => ({ ...t, templateId: 'minimal', primaryColor: '#4f46e5' }));
      } else if (type === 'grad') {
        setResumeData({
          ...sampleFreshGradResume,
          sectionTitles: { summary: '自我评价' },
        });
        setTheme((t) => ({ ...t, templateId: 'sidebar', primaryColor: '#0e7490' }));
      }
    }
  };

  const docTitle = `${resumeData.profile.name || '个人简历'}_${resumeData.profile.title || '求职'}`;

  // Open Print and Slicing Preview Modal with instant snapshot
  const handleOpenPrintModal = async () => {
    if (isSlicing) return;
    setIsSlicing(true);
    try {
      const pages = await sliceResumeCanvasToPages('resume-canvas');
      setSlicedPages(pages);
      setIsPrintModalOpen(true);
    } catch (error) {
      console.error('截图分片渲染异常:', error);
      alert('生成打印切片失败，请重试');
    } finally {
      setIsSlicing(false);
    }
  };

  // Direct print action
  const handlePrintDirect = async () => {
    if (isPrinting) return;
    setIsPrinting(true);
    try {
      await printResumeCanvas('resume-canvas', docTitle);
    } catch (error) {
      console.error('打印执行异常:', error);
      window.print();
    } finally {
      setIsPrinting(false);
    }
  };

  const handleExportPdf = async () => {
    if (isExporting) return;
    setIsExporting(true);
    try {
      await exportToPdf(
        'resume-canvas',
        `${docTitle}.pdf`
      );
    } catch (error) {
      console.error('PDF导出异常:', error);
      alert('导出 PDF 失败，请使用打印窗口另存为 PDF');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportJson = () => {
    exportToJson(resumeData, `${resumeData.profile.name || '我的'}_简历数据备份.json`);
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed && parsed.profile) {
            setResumeData(parsed);
            alert('简历数据导入成功！');
          } else {
            alert('导入失败：文件格式不符合规范');
          }
        } catch (err) {
          alert('解析 JSON 失败');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleToggleAutoFitA4 = () => {
    const nextState = !theme.autoFitA4;
    setTheme((t) => ({
      ...t,
      autoFitA4: nextState,
      lineHeight: nextState ? 'fill-a4' : 'normal',
      sectionSpacing: nextState ? 'fill-a4' : 'normal',
      pagePadding: nextState ? 'fill-a4' : 'normal',
    }));
  };

  const summaryLabel = resumeData.sectionTitles?.summary || '自我评价';

  const editorTabs = [
    { id: 'profile', label: '基本信息', icon: User },
    { id: 'jobIntent', label: '求职意向', icon: Compass },
    { id: 'work', label: '工作经历', icon: Briefcase, count: resumeData.workExperiences.length },
    { id: 'project', label: '项目经验', icon: FolderGit2, count: resumeData.projectExperiences.length },
    { id: 'education', label: '教育背景', icon: GraduationCap, count: resumeData.educations.length },
    { id: 'skills', label: '专业技能', icon: Wrench, count: resumeData.skills.length },
    { id: 'certs', label: '证书语言', icon: Award },
    { id: 'summary', label: summaryLabel, icon: FileCheck2 },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col text-slate-900 selection:bg-blue-100">
      {/* Top Main Navigation Header */}
      <header className="no-print bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-[1700px] mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-black text-lg shadow-sm tracking-tighter">
              简
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-slate-900">
                  简历本 <span className="text-blue-600 text-xs font-semibold px-1.5 py-0.5 bg-blue-50 rounded-md border border-blue-200">专业排版</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                所见即所得标准 A4 简历生成器 · 自由模块排序 · 精准防跨页
              </p>
            </div>
          </div>

          {/* Center Action: One-Click A4 Spread */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleAutoFitA4}
              className={`px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1.5 cursor-pointer shadow-xs text-xs transition-all ${
                theme.autoFitA4
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white ring-2 ring-emerald-400'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white'
              }`}
              title="根据内容量自动调节行高、段落间距和内边距，使整份简历刚好均匀填满一张标准A4纸"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{theme.autoFitA4 ? '已开启：内容均匀铺满A4纸' : '一键内容均匀铺满A4纸'}</span>
            </button>
          </div>

          {/* Export & Actions */}
          <div className="flex items-center gap-2">
            {/* Quick Sample Selector */}
            <div className="hidden lg:flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-medium">
              <span className="text-slate-500 text-[11px] pl-1.5">范例:</span>
              <button
                onClick={() => handleLoadSample('frontend')}
                className="px-2 py-1 rounded-lg hover:bg-white text-slate-700 hover:text-blue-600 transition-colors cursor-pointer text-[11px]"
              >
                前端全栈
              </button>
              <button
                onClick={() => handleLoadSample('pm')}
                className="px-2 py-1 rounded-lg hover:bg-white text-slate-700 hover:text-blue-600 transition-colors cursor-pointer text-[11px]"
              >
                产品经理
              </button>
              <button
                onClick={() => handleLoadSample('designer')}
                className="px-2 py-1 rounded-lg hover:bg-white text-slate-700 hover:text-blue-600 transition-colors cursor-pointer text-[11px]"
              >
                UI设计
              </button>
              <button
                onClick={() => handleLoadSample('grad')}
                className="px-2 py-1 rounded-lg hover:bg-white text-slate-700 hover:text-blue-600 transition-colors cursor-pointer text-[11px]"
              >
                应届毕业生
              </button>
            </div>

            {/* Print & PDF Button (Opens A4 Sliced Snapshot Modal) */}
            <button
              onClick={handleOpenPrintModal}
              disabled={isSlicing || isPrinting}
              className={`px-3.5 py-1.5 font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs text-xs transition-all ${
                isSlicing
                  ? 'bg-blue-400 text-white cursor-wait'
                  : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-md'
              }`}
              title="生成 A4 高清截图切片预览，智能分页并保留上边距"
            >
              {isSlicing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>截图切片中...</span>
                </>
              ) : (
                <>
                  <Printer className="w-4 h-4" />
                  <span>打印 / 存为PDF</span>
                </>
              )}
            </button>

            {/* More export dropdown */}
            <div className="flex items-center gap-1">
              <button
                onClick={handleExportPdf}
                disabled={isExporting}
                className={`p-2 border rounded-xl shadow-2xs transition-colors ${
                  isExporting
                    ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-wait'
                    : 'bg-white border-slate-300 hover:bg-slate-50 text-slate-700 cursor-pointer'
                }`}
                title="直接下载 PDF 文件（标准 A4 多页智能分页）"
              >
                {isExporting ? (
                  <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
              </button>

              <button
                onClick={handleOpenPrintModal}
                className="p-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl cursor-pointer shadow-2xs hidden md:flex"
                title="在新标签页纯净打印 / 预览"
              >
                <ExternalLink className="w-4 h-4" />
              </button>

              <button
                onClick={handleExportJson}
                className="p-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl cursor-pointer shadow-2xs hidden sm:flex"
                title="导出 JSON 数据备份"
              >
                <FileText className="w-4 h-4" />
              </button>

              <input
                type="file"
                ref={importInputRef}
                onChange={handleImportJson}
                accept=".json"
                className="hidden"
              />
              <button
                onClick={() => importInputRef.current?.click()}
                className="p-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl cursor-pointer shadow-2xs hidden sm:flex"
                title="从 JSON 文件恢复数据"
              >
                <Upload className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Secondary Bar: Template & Theme Quick Toggle */}
        <div className="border-t border-slate-100 bg-slate-50/70 px-4 py-1.5 flex items-center justify-between max-w-[1700px] mx-auto text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowThemePanel(!showThemePanel)}
              className="font-bold text-slate-700 hover:text-blue-600 flex items-center gap-1 cursor-pointer"
            >
              <Palette className="w-3.5 h-3.5 text-blue-600" />
              {showThemePanel ? '收起模版与模块排版设置' : '展开模版与模块排版设置'}
              <ChevronRight className={`w-3.5 h-3.5 transition-transform ${showThemePanel ? 'rotate-90' : ''}`} />
            </button>
            <span className="text-slate-400">|</span>
            <span className="text-slate-600 font-medium hidden sm:inline">
              当前模版: <strong>{theme.templateId}</strong> · 基调色: <span className="inline-block w-2.5 h-2.5 rounded-full align-middle ml-1" style={{ backgroundColor: theme.primaryColor }} />
            </span>
          </div>

          {/* Canvas Zoom Controls */}
          <div className="flex items-center gap-1.5 text-slate-600 font-mono text-[11px]">
            <span>缩放:</span>
            <button
              onClick={() => setPreviewScale((s) => Math.max(0.4, Number((s - 0.05).toFixed(2))))}
              className="p-1 hover:bg-slate-200 rounded cursor-pointer"
              title="缩小"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="w-12 text-center font-bold">{Math.round(previewScale * 100)}%</span>
            <button
              onClick={() => setPreviewScale((s) => Math.min(1.2, Number((s + 0.05).toFixed(2))))}
              className="p-1 hover:bg-slate-200 rounded cursor-pointer"
              title="放大"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setPreviewScale(0.85)}
              className="px-1.5 py-0.5 bg-slate-200 hover:bg-slate-300 rounded text-[10px] cursor-pointer"
            >
              重置
            </button>
          </div>
        </div>

        {/* Collapsible Theme & Section Order Selector */}
        {showThemePanel && (
          <ThemeSelector
            theme={theme}
            onChangeTheme={setTheme}
            resumeData={resumeData}
            onChangeResumeData={setResumeData}
            onToggleSection={handleToggleSection}
          />
        )}
      </header>

      {/* Main Workspace Split Layout */}
      <main className="flex-1 flex flex-col lg:flex-row max-w-[1700px] w-full mx-auto p-4 gap-6 items-start">
        {/* Left Side: Modular Form Editor Panel */}
        <section className="no-print w-full lg:w-[480px] xl:w-[540px] bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col shrink-0 overflow-hidden">
          {/* Navigation Tab Bar */}
          <div className="p-2 border-b border-slate-200 bg-slate-50/90 flex gap-1 overflow-x-auto no-scrollbar">
            {editorTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                        isActive ? 'bg-blue-800 text-white' : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Form Content Area */}
          <div className="p-4 sm:p-5 overflow-y-auto max-h-[calc(100vh-220px)]">
            {activeTab === 'profile' && (
              <ProfileEditor
                profile={resumeData.profile}
                onChange={(profile) => setResumeData({ ...resumeData, profile })}
              />
            )}

            {activeTab === 'jobIntent' && (
              <JobIntentEditor
                jobIntent={resumeData.jobIntent}
                onChange={(jobIntent) => setResumeData({ ...resumeData, jobIntent })}
              />
            )}

            {activeTab === 'work' && (
              <WorkExperienceEditor
                workExperiences={resumeData.workExperiences}
                onChange={(workExperiences) => setResumeData({ ...resumeData, workExperiences })}
              />
            )}

            {activeTab === 'project' && (
              <ProjectExperienceEditor
                projectExperiences={resumeData.projectExperiences}
                onChange={(projectExperiences) =>
                  setResumeData({ ...resumeData, projectExperiences })
                }
              />
            )}

            {activeTab === 'education' && (
              <EducationEditor
                educations={resumeData.educations}
                onChange={(educations) => setResumeData({ ...resumeData, educations })}
              />
            )}

            {activeTab === 'skills' && (
              <SkillsEditor
                skills={resumeData.skills}
                onChange={(skills) => setResumeData({ ...resumeData, skills })}
              />
            )}

            {activeTab === 'certs' && (
              <CertificatesLanguagesEditor
                certificates={resumeData.certificates}
                languages={resumeData.languages}
                onChangeCertificates={(certificates) =>
                  setResumeData({ ...resumeData, certificates })
                }
                onChangeLanguages={(languages) => setResumeData({ ...resumeData, languages })}
              />
            )}

            {activeTab === 'summary' && (
              <SummaryEditor
                summary={resumeData.summary}
                sectionTitle={resumeData.sectionTitles?.summary || '自我评价'}
                resumeData={resumeData}
                onChange={(summary) => setResumeData({ ...resumeData, summary })}
                onChangeTitle={(newTitle) =>
                  setResumeData({
                    ...resumeData,
                    sectionTitles: {
                      ...resumeData.sectionTitles,
                      summary: newTitle,
                    },
                  })
                }
              />
            )}
          </div>
        </section>

        {/* Right Side: Real-time Live A4 Preview Canvas */}
        <section className="flex-1 w-full flex flex-col items-center justify-start overflow-hidden min-h-[600px]">
          <div className="w-full flex justify-between items-center mb-2 no-print px-2">
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <Eye className="w-4 h-4 text-slate-400" />
              <span>实时所见即所得 A4 纸张排版预览</span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              标准 A4 尺寸 (210mm × 297mm)
            </div>
          </div>

          {/* Canvas Wrapper */}
          <div className="w-full flex justify-center items-start overflow-auto p-2 bg-slate-200/60 rounded-2xl border border-slate-300/80 shadow-inner">
            <ResumePreview
              ref={previewRef}
              data={resumeData}
              theme={theme}
              scale={previewScale}
              showPageBreakLine={true}
            />
          </div>
        </section>
      </main>

      {/* A4 Snapshot & Sliced Pages Print Preview Modal */}
      <PrintPreviewModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        pages={slicedPages}
        isLoading={isSlicing}
        docTitle={docTitle}
      />
    </div>
  );
}

export default App;
