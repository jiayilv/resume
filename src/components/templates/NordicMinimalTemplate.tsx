import React from 'react';
import { ResumeData, ThemeConfig } from '../../types';
import { Mail, Phone, MapPin, Globe, Github, Tag } from 'lucide-react';
import { getDensityStyles, getSectionTitle, DEFAULT_SECTION_ORDER } from '../../utils/templateHelpers';

interface TemplateProps {
  data: ResumeData;
  theme: ThemeConfig;
}

export const NordicMinimalTemplate: React.FC<TemplateProps> = ({ data, theme }) => {
  const { profile, jobIntent, summary, workExperiences, projectExperiences, educations, skills, certificates, languages, customSections } = data;
  const primaryColor = theme.primaryColor || '#0f172a';
  const density = getDensityStyles(theme);

  const order = data.sectionOrder && data.sectionOrder.length > 0 ? data.sectionOrder : DEFAULT_SECTION_ORDER;

  const renderSection = (sectionKey: string) => {
    if (data.hiddenSections.includes(sectionKey)) return null;

    switch (sectionKey) {
      case 'jobIntent':
        if (!jobIntent.targetPosition) return null;
        return (
          <div key="jobIntent" className="pb-2 border-b border-slate-100 flex justify-between text-xs text-slate-600 avoid-break" style={{ marginBottom: density.sectionGap }}>
            <span><strong className="font-semibold text-slate-800">{getSectionTitle(data, 'jobIntent')}:</strong> {jobIntent.targetPosition}</span>
            {jobIntent.targetCity && <span>期望城市: {jobIntent.targetCity}</span>}
            {jobIntent.targetSalary && <span>期望薪资: {jobIntent.targetSalary}</span>}
          </div>
        );

      case 'summary':
        if (!summary) return null;
        return (
          <section key="summary" className="avoid-break" style={{ marginBottom: density.sectionGap }}>
            <h2 className="text-xs font-semibold tracking-widest uppercase text-slate-400 mb-2">
              {getSectionTitle(data, 'summary')}
            </h2>
            <p className="text-slate-700 leading-relaxed text-justify" style={{ fontSize: density.bodySize }}>
              {summary}
            </p>
          </section>
        );

      case 'work':
        if (workExperiences.length === 0) return null;
        return (
          <section key="work" className="avoid-break" style={{ marginBottom: density.sectionGap }}>
            <h2 className="text-xs font-semibold tracking-widest uppercase text-slate-400 mb-3 border-b border-slate-100 pb-1">
              {getSectionTitle(data, 'work')}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: density.itemGap }}>
              {workExperiences.map((w) => (
                <div key={w.id}>
                  <div className="flex justify-between items-baseline mb-1">
                    <div>
                      <span className="font-semibold text-slate-900" style={{ fontSize: density.subTitleSize }}>{w.company}</span>
                      {w.department && <span className="text-slate-500 font-light ml-2 text-xs">({w.department})</span>}
                    </div>
                    <span className="text-slate-400 text-xs font-mono">{w.startDate} — {w.current ? '至今' : w.endDate}</span>
                  </div>
                  <div className="font-medium text-slate-700 mb-1" style={{ fontSize: density.bodySize }}>{w.position}</div>
                  {w.description && <p className="text-slate-600 mb-1 leading-relaxed" style={{ fontSize: density.bodySize }}>{w.description}</p>}
                  {w.achievements && (
                    <div className="text-slate-600 whitespace-pre-line leading-relaxed pl-2 border-l border-slate-200" style={{ fontSize: density.bodySize }}>
                      {w.achievements}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        );

      case 'project':
        if (projectExperiences.length === 0) return null;
        return (
          <section key="project" className="avoid-break" style={{ marginBottom: density.sectionGap }}>
            <h2 className="text-xs font-semibold tracking-widest uppercase text-slate-400 mb-3 border-b border-slate-100 pb-1">
              {getSectionTitle(data, 'project')}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: density.itemGap }}>
              {projectExperiences.map((p) => (
                <div key={p.id}>
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="font-semibold text-slate-900" style={{ fontSize: density.subTitleSize }}>{p.projectName}</span>
                    <span className="text-slate-400 text-xs font-mono">{p.startDate} — {p.current ? '至今' : p.endDate}</span>
                  </div>
                  <div className="text-slate-600 mb-1 font-medium" style={{ fontSize: density.bodySize }}>
                    {p.role} {p.techStack && <span className="text-slate-400 font-mono text-[11px]">| {p.techStack}</span>}
                  </div>
                  {p.description && <p className="text-slate-600 mb-1 leading-relaxed" style={{ fontSize: density.bodySize }}>{p.description}</p>}
                  {p.results && (
                    <div className="text-slate-600 whitespace-pre-line leading-relaxed pl-2 border-l border-slate-200" style={{ fontSize: density.bodySize }}>
                      {p.results}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        );

      case 'education':
        if (educations.length === 0) return null;
        return (
          <section key="education" className="avoid-break" style={{ marginBottom: density.sectionGap }}>
            <h2 className="text-xs font-semibold tracking-widest uppercase text-slate-400 mb-2 border-b border-slate-100 pb-1">
              {getSectionTitle(data, 'education')}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: density.itemGap }}>
              {educations.map((edu) => (
                <div key={edu.id}>
                  <div className="flex justify-between font-semibold text-slate-900" style={{ fontSize: density.subTitleSize }}>
                    <span>{edu.school}</span>
                    <span className="text-slate-400 font-mono text-xs">{edu.startDate} - {edu.endDate}</span>
                  </div>
                  <div className="text-slate-600" style={{ fontSize: density.bodySize }}>{edu.major} · {edu.degree}</div>
                  {edu.gpa && <div className="text-slate-500 text-xs">GPA: {edu.gpa}</div>}
                  {edu.customPoints && edu.customPoints.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {edu.customPoints.map((pt, pIdx) => (
                        <span key={pIdx} className="border border-slate-200 px-2 py-0.5 rounded text-slate-600 text-[11px]">
                          {pt}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        );

      case 'skills':
        if (skills.length === 0) return null;
        return (
          <section key="skills" className="avoid-break" style={{ marginBottom: density.sectionGap }}>
            <h2 className="text-xs font-semibold tracking-widest uppercase text-slate-400 mb-2 border-b border-slate-100 pb-1">
              {getSectionTitle(data, 'skills')}
            </h2>
            <div className="flex flex-wrap gap-1.5 text-xs">
              {skills.map((s) => (
                <span key={s.id} className="border border-slate-200 px-2 py-0.5 rounded text-slate-700 text-[11px]">
                  {s.name}
                </span>
              ))}
            </div>
          </section>
        );

      case 'certs':
      case 'certificates':
      case 'languages':
        if (certificates.length === 0 && languages.length === 0) return null;
        return (
          <div key="certs_group" className="grid grid-cols-1 sm:grid-cols-2 gap-4 avoid-break" style={{ marginBottom: density.sectionGap }}>
            {certificates.length > 0 && (
              <div>
                <h2 className="text-xs font-semibold tracking-widest uppercase text-slate-400 mb-1 border-b border-slate-100 pb-1">
                  {getSectionTitle(data, 'certificates')}
                </h2>
                <div className="space-y-1 text-xs text-slate-600">
                  {certificates.map((c) => (
                    <div key={c.id} className="flex justify-between">
                      <span>{c.name}</span>
                      <span className="text-slate-400 font-mono">{c.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {languages.length > 0 && (
              <div>
                <h2 className="text-xs font-semibold tracking-widest uppercase text-slate-400 mb-1 border-b border-slate-100 pb-1">
                  {getSectionTitle(data, 'languages')}
                </h2>
                <div className="space-y-1 text-xs text-slate-600">
                  {languages.map((l) => (
                    <div key={l.id} className="flex justify-between">
                      <span>{l.language}</span>
                      <span>{l.proficiency}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 'custom':
        if (!customSections || customSections.length === 0) return null;
        return (
          <div key="custom_group" style={{ marginBottom: density.sectionGap }}>
            {customSections.map((sec) => (
              !data.hiddenSections.includes(sec.id) && (
                <section key={sec.id} className="avoid-break" style={{ marginBottom: density.sectionGap }}>
                  <h2 className="text-xs font-semibold tracking-widest uppercase text-slate-400 mb-2 border-b border-slate-100 pb-1">
                    {sec.title}
                  </h2>
                  <div className="space-y-2">
                    {sec.items.map((item) => (
                      <div key={item.id} className="text-xs">
                        <div className="flex justify-between font-semibold text-slate-900">
                          <span>{item.title}</span>
                          {item.date && <span className="text-slate-400 font-mono">{item.date}</span>}
                        </div>
                        {item.subtitle && <div className="text-slate-600">{item.subtitle}</div>}
                        <p className="text-slate-600 mt-0.5">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div 
      className="bg-white text-slate-800 max-w-[800px] mx-auto transition-all"
      style={density.containerStyle}
    >
      {/* Minimal Header */}
      <header className="border-b border-slate-200 pb-5 mb-5">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-light tracking-widest text-slate-900 mb-1">
              {profile.name || '求职者姓名'}
            </h1>
            {profile.title && (
              <p className="text-xs font-medium text-slate-600 tracking-wider uppercase mb-2">
                {profile.title}
              </p>
            )}
            
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 font-light">
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
              className="w-20 h-24 object-cover grayscale contrast-125 border border-slate-300 shadow-xs"
            />
          )}
        </div>
      </header>

      {/* Main Ordered Content */}
      <div>
        {order.map((key) => renderSection(key))}
      </div>
    </div>
  );
};
