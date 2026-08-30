import React from 'react';
import { ResumeData, ThemeConfig } from '../../types';
import { Mail, Phone, MapPin, Globe, Github } from 'lucide-react';

interface TemplateProps {
  data: ResumeData;
  theme: ThemeConfig;
}

export const AcademicTemplate: React.FC<TemplateProps> = ({ data, theme }) => {
  const { profile, jobIntent, summary, educations, workExperiences, projectExperiences, skills, certificates, languages } = data;
  const primaryColor = theme.primaryColor || '#1e3a8a';

  return (
    <div 
      className="p-8 bg-white text-slate-900 max-w-[800px] mx-auto transition-all"
      style={{
        fontFamily: theme.fontFamily === 'sans' ? '"Noto Sans SC", sans-serif' : '"Noto Serif SC", serif',
        fontSize: theme.fontSize === 'small' ? '12.5px' : theme.fontSize === 'large' ? '14.5px' : '13.5px',
        lineHeight: 1.5,
      }}
    >
      {/* Centered Academic Header */}
      <header className="text-center pb-4 mb-4 border-b border-slate-300">
        <h1 className="text-2xl font-bold tracking-tight text-slate-950 mb-1">
          {profile.name || '求职者姓名'}
        </h1>
        {profile.title && <p className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">{profile.title}</p>}

        <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-1 text-xs text-slate-600">
          {profile.phone && <span>{profile.phone}</span>}
          {profile.email && <span>{profile.email}</span>}
          {profile.location && <span>{profile.location}</span>}
          {profile.website && <span>{profile.website}</span>}
          {profile.github && <span>{profile.github}</span>}
        </div>
      </header>

      {/* Education First (Academic Standard) */}
      {educations.length > 0 && !data.hiddenSections.includes('education') && (
        <section className="mb-4 avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-900 pb-0.5 mb-2">
            EDUCATION / 教育背景
          </h2>
          <div className="space-y-2">
            {educations.map((edu) => (
              <div key={edu.id} className="text-xs">
                <div className="flex justify-between font-bold text-slate-950">
                  <span>{edu.school}</span>
                  <span className="font-normal font-mono">{edu.startDate} — {edu.endDate}</span>
                </div>
                <div className="flex justify-between text-slate-800 italic">
                  <span>{edu.degree} · {edu.major}</span>
                  {edu.gpa && <span>GPA: {edu.gpa}</span>}
                </div>
                {edu.honors && <div className="text-slate-600 text-[11px]">荣誉: {edu.honors}</div>}
                {edu.courses && <div className="text-slate-600 text-[11px]">主修: {edu.courses}</div>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Research & Project Experience */}
      {projectExperiences.length > 0 && !data.hiddenSections.includes('project') && (
        <section className="mb-4 avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-900 pb-0.5 mb-2">
            RESEARCH & PROJECTS / 科研与项目经历
          </h2>
          <div className="space-y-3">
            {projectExperiences.map((p) => (
              <div key={p.id} className="text-xs">
                <div className="flex justify-between font-bold text-slate-950">
                  <span>{p.projectName}</span>
                  <span className="font-normal font-mono">{p.startDate} — {p.current ? '至今' : p.endDate}</span>
                </div>
                <div className="italic text-slate-700 mb-1">{p.role} {p.techStack && `[${p.techStack}]`}</div>
                {p.description && <p className="text-slate-800 mb-1 leading-relaxed">{p.description}</p>}
                {p.results && <div className="text-slate-700 whitespace-pre-line text-xs pl-2 border-l border-slate-300">{p.results}</div>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Work / Internship Experience */}
      {workExperiences.length > 0 && !data.hiddenSections.includes('work') && (
        <section className="mb-4 avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-900 pb-0.5 mb-2">
            PROFESSIONAL EXPERIENCE / 工作与实习履历
          </h2>
          <div className="space-y-3">
            {workExperiences.map((w) => (
              <div key={w.id} className="text-xs">
                <div className="flex justify-between font-bold text-slate-950">
                  <span>{w.company}</span>
                  <span className="font-normal font-mono">{w.startDate} — {w.current ? '至今' : w.endDate}</span>
                </div>
                <div className="italic text-slate-700 mb-1">{w.position} {w.department && `(${w.department})`}</div>
                {w.description && <p className="text-slate-800 mb-1 leading-relaxed">{w.description}</p>}
                {w.achievements && <div className="text-slate-700 whitespace-pre-line text-xs pl-2 border-l border-slate-300">{w.achievements}</div>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills, Honors & Languages */}
      <section className="avoid-break text-xs space-y-2">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-900 pb-0.5 mb-1">
          SKILLS, HONORS & OTHERS / 技能与荣誉
        </h2>
        {skills.length > 0 && (
          <div>
            <span className="font-bold text-slate-950">专业技能: </span>
            <span className="text-slate-800">{skills.map((s) => s.name).join(' · ')}</span>
          </div>
        )}
        {certificates.length > 0 && (
          <div>
            <span className="font-bold text-slate-950">荣誉证书: </span>
            <span className="text-slate-800">{certificates.map((c) => `${c.name} (${c.date})`).join('; ')}</span>
          </div>
        )}
        {languages.length > 0 && (
          <div>
            <span className="font-bold text-slate-950">语言水平: </span>
            <span className="text-slate-800">{languages.map((l) => `${l.language} - ${l.proficiency}`).join('; ')}</span>
          </div>
        )}
      </section>
    </div>
  );
};
