import React, { useState, useRef, useEffect } from 'react';
import {
  ResumeData,
  ThemeConfig,
  UserProfile,
  JobIntent,
  WorkExperience,
  ProjectExperience,
  Education,
  SkillItem,
  CertificateItem,
  LanguageItem,
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
import { AIPolishModal } from './components/ai/AIPolishModal';
import { AIDiagnosisModal } from './components/ai/AIDiagnosisModal';
import { AIJDMatchModal } from './components/ai/AIJDMatchModal';
import { AITranslateModal } from './components/ai/AITranslateModal';
import { exportToPdf, exportToJson, exportToImage } from './utils/exportUtils';
import {
  Sparkles,
  ShieldCheck,
  Target,
  Languages,
  Printer,
  Download,
  Upload,
  FileText,
  RotateCcw,
  Palette,
  ZoomIn,
  ZoomOut,
  Maximize2,
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
  SlidersHorizontal,
} from 'lucide-react';

const STORAGE_KEY = 'jianliben_resume_data_v1';
const THEME_KEY = 'jianliben_theme_data_v1';

export function App() {
  // Load saved state or default to sampleFrontendResume
  const [resumeData, setResumeData] = useState<ResumeData>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved resume data', e);
      }
    }
    return sampleFrontendResume;
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
    };
  });

  // Editor Navigation Tab
  const [activeTab, setActiveTab] = useState<string>('profile');
  const [showThemePanel, setShowThemePanel] = useState<boolean>(true);
  const [previewScale, setPreviewScale] = useState<number>(0.85);

  // AI Modal States
  const [polishModalOpen, setPolishModalOpen] = useState(false);
  const [polishText, setPolishText] = useState('');
  const [polishRoleContext, setPolishRoleContext] = useState('');
  const [polishApplyCallback, setPolishApplyCallback] = useState<((newText: string) => void) | null>(null);

  const [diagnosisModalOpen, setDiagnosisModalOpen] = useState(false);
  const [jdMatchModalOpen, setJdMatchModalOpen] = useState(false);
  const [translateModalOpen, setTranslateModalOpen] = useState(false);

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
    if (confirm('载入样例将覆盖当前编辑内容，是否继续？')) {
      if (type === 'frontend') {
        setResumeData(sampleFrontendResume);
        setTheme((t) => ({ ...t, templateId: 'modern', primaryColor: '#1e40af' }));
      } else if (type === 'pm') {
        setResumeData(sampleProductManagerResume);
        setTheme((t) => ({ ...t, templateId: 'classic', primaryColor: '#0f172a' }));
      } else if (type === 'designer') {
        setResumeData(sampleDesignerResume);
        setTheme((t) => ({ ...t, templateId: 'minimal', primaryColor: '#4f46e5' }));
      } else if (type === 'grad') {
        setResumeData(sampleFreshGradResume);
        setTheme((t) => ({ ...t, templateId: 'sidebar', primaryColor: '#0e7490' }));
      }
    }
  };

  // Open single text item polish modal
  const handleOpenPolish = (text: string, onApply: (newText: string) => void, contextRole?: string) => {
    setPolishText(text);
    setPolishRoleContext(contextRole || resumeData.profile.title || '求职者');
    setPolishApplyCallback(() => onApply);
    setPolishModalOpen(true);
  };

  // Export handlers
  const handlePrint = () => {
    window.print();
  };

  const handleExportPdf = () => {
    exportToPdf('resume-canvas', `${resumeData.profile.name || '简历'}_${resumeData.profile.title || '求职'}.pdf`);
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
            alert('简历数据恢复导入成功！');
          } else {
            alert('导入失败：文件格式不符合简历数据规范');
          }
        } catch (err) {
          alert('解析 JSON 失败');
        }
      };
      reader.readAsText(file);
    }
  };

  const editorTabs = [
    { id: 'profile', label: '基本信息', icon: User },
    { id: 'jobIntent', label: '求职意向', icon: Compass },
    { id: 'work', label: '工作经历', icon: Briefcase, count: resumeData.workExperiences.length },
    { id: 'project', label: '项目经验', icon: FolderGit2, count: resumeData.projectExperiences.length },
    { id: 'education', label: '教育背景', icon: GraduationCap, count: resumeData.educations.length },
    { id: 'skills', label: '专业技能', icon: Wrench, count: resumeData.skills.length },
    { id: 'certs', label: '证书语言', icon: Award },
    { id: 'summary', label: '自我评价', icon: FileCheck2 },
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
                  简历本 <span className="text-blue-600 text-xs font-semibold px-1.5 py-0.5 bg-blue-50 rounded-md border border-blue-200">AI 智能版</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                专业高薪求职简历制作平台 · STAR法则量化 · ATS高通过率
              </p>
            </div>
          </div>

          {/* AI Power Suite Buttons */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => setDiagnosisModalOpen(true)}
              className="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs text-xs transition-all hover:shadow-md"
            >
              <ShieldCheck className="w-4 h-4 text-blue-200" />
              <span>AI 深度体检与评分</span>
            </button>

            <button
              onClick={() => setJdMatchModalOpen(true)}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs text-xs transition-all hover:shadow-md"
            >
              <Target className="w-4 h-4 text-emerald-200" />
              <span>AI 职位 JD 匹配</span>
            </button>

            <button
              onClick={() => setTranslateModalOpen(true)}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs text-xs transition-all"
            >
              <Languages className="w-3.5 h-3.5 text-slate-300" />
              <span>双语互译</span>
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

            {/* Print & PDF Button */}
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs text-xs transition-all hover:shadow-md"
              title="高质量直接打印或另存为PDF"
            >
              <Printer className="w-4 h-4" />
              <span>打印 / 存为PDF</span>
            </button>

            {/* More export dropdown */}
            <div className="flex items-center gap-1">
              <button
                onClick={handleExportPdf}
                className="p-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl cursor-pointer shadow-2xs"
                title="直接下载 PDF 文件"
              >
                <Download className="w-4 h-4" />
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
              {showThemePanel ? '收起模版与样式配置' : '展开模版与样式配置'}
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

        {/* Collapsible Theme Selector */}
        {showThemePanel && (
          <ThemeSelector
            theme={theme}
            onChangeTheme={setTheme}
            resumeData={resumeData}
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
                onOpenPolishModal={handleOpenPolish}
              />
            )}

            {activeTab === 'project' && (
              <ProjectExperienceEditor
                projectExperiences={resumeData.projectExperiences}
                onChange={(projectExperiences) =>
                  setResumeData({ ...resumeData, projectExperiences })
                }
                onOpenPolishModal={handleOpenPolish}
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
                resumeData={resumeData}
                onChange={(summary) => setResumeData({ ...resumeData, summary })}
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

      {/* AI Assistant Modals */}
      <AIPolishModal
        isOpen={polishModalOpen}
        onClose={() => setPolishModalOpen(false)}
        originalText={polishText}
        contextRole={polishRoleContext}
        onApply={(newText) => {
          if (polishApplyCallback) {
            polishApplyCallback(newText);
          }
        }}
      />

      <AIDiagnosisModal
        isOpen={diagnosisModalOpen}
        onClose={() => setDiagnosisModalOpen(false)}
        resumeData={resumeData}
      />

      <AIJDMatchModal
        isOpen={jdMatchModalOpen}
        onClose={() => setJdMatchModalOpen(false)}
        resumeData={resumeData}
      />

      <AITranslateModal
        isOpen={translateModalOpen}
        onClose={() => setTranslateModalOpen(false)}
        resumeData={resumeData}
        onApplyTranslated={(translatedData) => setResumeData(translatedData)}
      />
    </div>
  );
}

export default App;
