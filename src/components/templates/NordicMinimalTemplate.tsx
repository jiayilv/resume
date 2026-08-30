import React from 'react';
import { ResumeData, ThemeConfig } from '../../types';
import { Mail, Phone, MapPin, Globe, Github } from 'lucide-react';

interface TemplateProps {
  data: ResumeData;
  theme: ThemeConfig;
}

export const NordicMinimalTemplate: React.FC<TemplateProps> = ({ data, theme }) => {
  const { profile, jobIntent, summary, workExperiences, projectExperiences, educations, skills, certificates, languages } = data;
  const primaryColor = theme.primaryColor || '#0f172a';

  return (
    <div 
      className="p-10 bg-white text-slate-800 max-w-[800px] mx-auto transition-all"
      style={{
        fontFamily: theme.fontFamily === 'serif' ? '"Noto Serif SC", serif' : theme.fontFamily === 'mono' ? '"Fira Code", monospace' : '"Noto Sans SC", sans-serif',
        fontSize: theme.fontSize === 'small' ? '13px' : theme.fontSize === 'large' ? '15px' : '14px',
        lineHeight: theme.lineHeight === 'compact' ? 1.45 : theme.lineHeight === 'relaxed' ? 1.75 : 1.6,
      }}
    >
      {/* Minimal Header */}
      <header className="border-b border-slate-200 pb-6 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-light tracking-widest text-slate-900 mb-1">
              {profile.name || '求职者姓名'}
            </h1>
            {profile.title && (
              <p className="text-sm font-medium text-slate-600 tracking-wider uppercase mb-3">
                {profile.title}
              </p>
            )}
            
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-slate-500 font-light">
              {profile.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {profile.phone}</span>}
              {profile.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {profile.email}</span>}
              {profile.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {profile.location}</span>}
              {profile.website && <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> {profile.website}</span>}
              {profile.github && <span className="flex items-center gap-1"><Github className="w-3 h-3" /> {profile.github}</span>}
            </div>
          </div>

          {profile.showAvatar && profile.avatar && (
            <img 
              src={profile.avatar} 
              alt={profile.name} 
              className="w-20 h-24 object-cover grayscale contrast-125 border border-slate-300 shadow-sm"
            />
          )}
        </div>
      </header>

      {/* Target Job Intent */}
      {jobIntent.targetPosition && !data.hiddenSections.includes('jobIntent') && (
        <div className="mb-6 pb-2 border-b border-slate-100 flex justify-between text-xs text-slate-600">
          <span><strong className="font-semibold text-slate-800">求职意向:</strong> {jobIntent.targetPosition}</span>
          {jobIntent.targetCity && <span>期望城市: {jobIntent.targetCity}</span>}
          {jobIntent.targetSalary && <span>期望薪资: {jobIntent.targetSalary}</span>}
        </div>
      )}

      {/* Summary */}
      {summary && !data.hiddenSections.includes('summary') && (
        <section className="mb-6 avoid-break">
          <h2 className="text-xs font-semibold tracking-widest uppercase text-slate-400 mb-2">
            PROFILE / 个人总结
          </h2>
          <p className="text-slate-700 text-xs sm:text-sm leading-relaxed text-justify">
            {summary}
          </p>
        </section>
      )}

      {/* Work Experiences */}
      {workExperiences.length > 0 && !data.hiddenSections.includes('work') && (
        <section className="mb-6 avoid-break">
          <h2 className="text-xs font-semibold tracking-widest uppercase text-slate-400 mb-3 border-b border-slate-100 pb-1">
            EXPERIENCE / 工作经历
          </h2>
          <div className="space-y-4">
            {workExperiences.map((w) => (
              <div key={w.id} className="text-xs sm:text-sm">
                <div className="flex justify-between items-baseline mb-1">
                  <div>
                    <span className="font-semibold text-slate-900">{w.company}</span>
                    {w.department && <span className="text-slate-500 font-light ml-2">({w.department})</span>}
                  </div>
                  <span className="text-slate-400 text-xs font-mono">{w.startDate} — {w.current ? '至今' : w.endDate}</span>
                </div>
                <div className="text-xs font-medium text-slate-700 mb-1">{w.position}</div>
                {w.description && <p className="text-slate-600 mb-1 leading-relaxed text-xs">{w.description}</p>}
                {w.achievements && (
                  <div className="text-slate-600 whitespace-pre-line text-xs leading-relaxed pl-2 border-l border-slate-200">
                    {w.achievements}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projectExperiences.length > 0 && !data.hiddenSections.includes('project') && (
        <section className="mb-6 avoid-break">
          <h2 className="text-xs font-semibold tracking-widest uppercase text-slate-400 mb-3 border-b border-slate-100 pb-1">
            PROJECTS / 项目经验
          </h2>
          <div className="space-y-4">
            {projectExperiences.map((p) => (
              <div key={p.id} className="text-xs sm:text-sm">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="font-semibold text-slate-900">{p.projectName}</span>
                  <span className="text-slate-400 text-xs font-mono">{p.startDate} — {p.current ? '至今' : p.endDate}</span>
                </div>
                <div className="text-xs text-slate-600 mb-1 font-medium">{p.role} {p.techStack && <span className="text-slate-400 font-mono text-[11px]">| {p.techStack}</span>}</div>
                {p.description && <p className="text-slate-600 mb-1 leading-relaxed text-xs">{p.description}</p>}
                {p.results && (
                  <div className="text-slate-600 whitespace-pre-line text-xs leading-relaxed pl-2 border-l border-slate-200">
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
            <h2 className="text-xs font-semibold tracking-widest uppercase text-slate-400 mb-2 border-b border-slate-100 pb-1">
              EDUCATION / 教育背景
            </h2>
            <div className="space-y-2">
              {educations.map((edu) => (
                <div key={edu.id} className="text-xs">
                  <div className="flex justify-between font-semibold text-slate-900">
                    <span>{edu.school}</span>
                    <span className="text-slate-400 font-mono text-[11px]">{edu.startDate} - {edu.endDate}</span>
                  </div>
                  <div className="text-slate-600">{edu.major} · {edu.degree}</div>
                  {edu.gpa && <div className="text-slate-500 text-[11px]">GPA: {edu.gpa}</div>}
                </div>
              ))}
            </div>
          </section>
        )}

        {skills.length > 0 && !data.hiddenSections.includes('skills') && (
          <section>
            <h2 className="text-xs font-semibold tracking-widest uppercase text-slate-400 mb-2 border-b border-slate-100 pb-1">
              SKILLS / 专业技能
            </h2>
            <div className="flex flex-wrap gap-1.5 text-xs">
              {skills.map((s) => (
                <span key={s.id} className="border border-slate-200 px-2 py-0.5 rounded text-slate-700 text-[11px]">
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
