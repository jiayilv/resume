import React from 'react';
import { ResumeData, ThemeConfig } from '../../types';
import { Mail, Phone, MapPin, Globe, Briefcase, Award, BookOpen, FolderGit2, Wrench, Languages, Sparkles } from 'lucide-react';

interface TemplateProps {
  data: ResumeData;
  theme: ThemeConfig;
}

export const ExecutiveTemplate: React.FC<TemplateProps> = ({ data, theme }) => {
  const { profile, jobIntent, summary, workExperiences, projectExperiences, educations, skills, certificates, languages } = data;
  const primaryColor = theme.primaryColor || '#831843'; // Deep Burgundy / Executive Wine

  return (
    <div 
      className="p-8 bg-white text-slate-800 max-w-[800px] mx-auto transition-all"
      style={{
        fontFamily: theme.fontFamily === 'serif' ? '"Noto Serif SC", serif' : theme.fontFamily === 'mono' ? '"Fira Code", monospace' : '"Noto Sans SC", sans-serif',
        fontSize: theme.fontSize === 'small' ? '13px' : theme.fontSize === 'large' ? '15px' : '14px',
        lineHeight: theme.lineHeight === 'compact' ? 1.4 : theme.lineHeight === 'relaxed' ? 1.7 : 1.55,
      }}
    >
      {/* Top Header with Solid Accent Bar */}
      <header className="border-b-4 pb-5 mb-5 flex justify-between items-center gap-6" style={{ borderColor: primaryColor }}>
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-950 mb-1">
            {profile.name || '求职者姓名'}
          </h1>
          <p className="text-sm font-semibold tracking-wide uppercase mb-3" style={{ color: primaryColor }}>
            {profile.title || '高级管理 / 行业专家'}
          </p>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-600">
            {profile.phone && <span className="flex items-center gap-1 font-medium"><Phone className="w-3.5 h-3.5" style={{ color: primaryColor }} /> {profile.phone}</span>}
            {profile.email && <span className="flex items-center gap-1 font-medium"><Mail className="w-3.5 h-3.5" style={{ color: primaryColor }} /> {profile.email}</span>}
            {profile.location && <span className="flex items-center gap-1 font-medium"><MapPin className="w-3.5 h-3.5" style={{ color: primaryColor }} /> {profile.location}</span>}
            {profile.workYears && <span>工作年限: {profile.workYears}</span>}
            {profile.highestDegree && <span>最高学历: {profile.highestDegree}</span>}
          </div>
        </div>

        {profile.showAvatar && profile.avatar && (
          <img 
            src={profile.avatar} 
            alt={profile.name} 
            className="w-24 h-28 object-cover rounded shadow-md border-2"
            style={{ borderColor: primaryColor }}
          />
        )}
      </header>

      {/* Target Intent */}
      {jobIntent.targetPosition && !data.hiddenSections.includes('jobIntent') && (
        <div 
          className="mb-5 p-2.5 px-4 rounded text-xs flex justify-between items-center font-medium border"
          style={{ backgroundColor: `${primaryColor}08`, borderColor: `${primaryColor}20` }}
        >
          <span style={{ color: primaryColor }}><strong>求职意向：</strong>{jobIntent.targetPosition}</span>
          {jobIntent.targetCity && <span>期望地点: {jobIntent.targetCity}</span>}
          {jobIntent.targetSalary && <span>期望薪资: {jobIntent.targetSalary}</span>}
          {jobIntent.availableTime && <span>到岗时间: {jobIntent.availableTime}</span>}
        </div>
      )}

      {/* Summary */}
      {summary && !data.hiddenSections.includes('summary') && (
        <section className="mb-5 avoid-break">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-4 rounded" style={{ backgroundColor: primaryColor }} />
            <h2 className="font-bold text-sm tracking-wide uppercase text-slate-900">
              职业概述与核心价值
            </h2>
          </div>
          <p className="text-slate-700 text-xs sm:text-sm leading-relaxed whitespace-pre-line text-justify pl-3.5 border-l-2 border-slate-200">
            {summary}
          </p>
        </section>
      )}

      {/* Work Experiences */}
      {workExperiences.length > 0 && !data.hiddenSections.includes('work') && (
        <section className="mb-5 avoid-break">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1.5 h-4 rounded" style={{ backgroundColor: primaryColor }} />
            <h2 className="font-bold text-sm tracking-wide uppercase text-slate-900">
              主要任职经历
            </h2>
          </div>

          <div className="space-y-4">
            {workExperiences.map((w) => (
              <div key={w.id} className="text-xs sm:text-sm">
                <div className="flex flex-wrap justify-between items-baseline gap-2 mb-1">
                  <div className="font-bold text-slate-900 text-sm">
                    {w.company} <span className="font-normal text-slate-600">({w.department || '核心部门'})</span>
                  </div>
                  <span className="font-bold" style={{ color: primaryColor }}>{w.position}</span>
                  <span className="text-slate-500 text-xs font-mono">{w.startDate} - {w.current ? '至今' : w.endDate}</span>
                </div>
                {w.description && <p className="text-slate-700 mb-1 leading-relaxed">{w.description}</p>}
                {w.achievements && (
                  <div className="text-slate-700 whitespace-pre-line text-xs leading-relaxed pl-3 border-l-2" style={{ borderColor: `${primaryColor}40` }}>
                    {w.achievements}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Project Experiences */}
      {projectExperiences.length > 0 && !data.hiddenSections.includes('project') && (
        <section className="mb-5 avoid-break">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1.5 h-4 rounded" style={{ backgroundColor: primaryColor }} />
            <h2 className="font-bold text-sm tracking-wide uppercase text-slate-900">
              重大项目与业务战果
            </h2>
          </div>

          <div className="space-y-4">
            {projectExperiences.map((p) => (
              <div key={p.id} className="text-xs sm:text-sm">
                <div className="flex flex-wrap justify-between items-baseline gap-2 mb-1">
                  <span className="font-bold text-slate-900 text-sm">{p.projectName}</span>
                  <span className="font-medium text-slate-700">{p.role}</span>
                  <span className="text-slate-500 text-xs font-mono">{p.startDate} - {p.current ? '至今' : p.endDate}</span>
                </div>
                {p.techStack && <div className="text-xs text-slate-500 mb-1 font-mono">架构/技术: {p.techStack}</div>}
                {p.description && <p className="text-slate-700 mb-1 leading-relaxed">{p.description}</p>}
                {p.results && (
                  <div className="text-slate-700 whitespace-pre-line text-xs leading-relaxed pl-3 border-l-2" style={{ borderColor: `${primaryColor}40` }}>
                    {p.results}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education & Skills */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 avoid-break">
        {educations.length > 0 && !data.hiddenSections.includes('education') && (
          <section>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1.5 h-4 rounded" style={{ backgroundColor: primaryColor }} />
              <h2 className="font-bold text-sm tracking-wide uppercase text-slate-900">
                教育背景
              </h2>
            </div>
            <div className="space-y-2">
              {educations.map((edu) => (
                <div key={edu.id} className="text-xs">
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>{edu.school}</span>
                    <span className="text-slate-500 font-mono">{edu.startDate} - {edu.endDate}</span>
                  </div>
                  <div className="text-slate-700">{edu.major} · {edu.degree}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {skills.length > 0 && !data.hiddenSections.includes('skills') && (
          <section>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1.5 h-4 rounded" style={{ backgroundColor: primaryColor }} />
              <h2 className="font-bold text-sm tracking-wide uppercase text-slate-900">
                管理与专业技能
              </h2>
            </div>
            <div className="flex flex-wrap gap-1.5 text-xs">
              {skills.map((s) => (
                <span 
                  key={s.id} 
                  className="px-2.5 py-1 rounded text-xs font-medium border"
                  style={{ backgroundColor: `${primaryColor}08`, borderColor: `${primaryColor}20`, color: '#1e293b' }}
                >
                  {s.name}
                </span>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
