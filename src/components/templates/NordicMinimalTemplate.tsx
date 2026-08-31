import React from 'react';
import { ResumeData, ThemeConfig } from '../../types';
import { Mail, Phone, MapPin, Globe, Github, Tag } from 'lucide-react';
import { getDensityStyles, getSectionTitle, DEFAULT_SECTION_ORDER } from '../../utils/templateHelpers';
import { SectionHeader } from './SectionHeader';
import { ResumeAvatar } from '../ResumeAvatar';

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
          <div key="jobIntent" className="pb-2 border-b border-slate-100 flex flex-wrap justify-between items-center text-xs text-slate-600 avoid-break gap-2" style={{ marginBottom: density.sectionGap }}>
            <div className="flex items-center gap-1.5 whitespace-nowrap break-keep">
              <strong className="font-semibold text-slate-800">{getSectionTitle(data, 'jobIntent')}:</strong>
              <span className="text-slate-900 font-medium">{jobIntent.targetPosition}</span>
            </div>
            <div className="flex flex-wrap items-center gap-x-3">
              {jobIntent.targetCity && <span className="whitespace-nowrap break-keep">期望城市: {jobIntent.targetCity}</span>}
              {jobIntent.targetSalary && <span className="whitespace-nowrap break-keep">期望薪资: {jobIntent.targetSalary}</span>}
            </div>
          </div>
        );

      case 'summary':
        if (!summary) return null;
        return (
          <section key="summary" className="avoid-break" style={{ marginBottom: density.sectionGap }}>
            <SectionHeader
              title={getSectionTitle(data, 'summary')}
              primaryColor={primaryColor}
              headerStyle={theme.headerStyle || 'minimal'}
            />
            <p className="text-slate-700 leading-relaxed text-justify" style={{ fontSize: density.bodySize }}>
              {summary}
            </p>
          </section>
        );

      case 'work':
        if (workExperiences.length === 0) return null;
        return (
          <section key="work" className="avoid-break" style={{ marginBottom: density.sectionGap }}>
            <SectionHeader
              title={getSectionTitle(data, 'work')}
              primaryColor={primaryColor}
              headerStyle={theme.headerStyle || 'minimal'}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: density.itemGap }}>
              {workExperiences.map((w) => (
                <div key={w.id}>
                  <div className="flex justify-between items-baseline gap-2 mb-1 min-w-0">
                    <div className="flex items-baseline gap-2 min-w-0 flex-1">
                      <span className="font-semibold text-slate-900 whitespace-nowrap break-keep shrink-0" style={{ fontSize: density.subTitleSize }}>{w.company}</span>
                      {w.department && <span className="text-slate-500 font-light text-xs whitespace-nowrap break-keep shrink-0">({w.department})</span>}
                      <span className="font-medium text-slate-700 ml-2 whitespace-nowrap break-keep shrink-0" style={{ fontSize: density.bodySize }}>{w.position}</span>
                    </div>
                    <span className="text-slate-400 text-xs font-mono whitespace-nowrap break-keep shrink-0 text-right">{w.startDate} — {w.current ? '至今' : w.endDate}</span>
                  </div>
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
            <SectionHeader
              title={getSectionTitle(data, 'project')}
              primaryColor={primaryColor}
              headerStyle={theme.headerStyle || 'minimal'}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: density.itemGap }}>
              {projectExperiences.map((p) => (
                <div key={p.id}>
                  <div className="flex justify-between items-baseline gap-2 mb-1 min-w-0">
                    <div className="flex items-baseline gap-2 min-w-0 flex-1">
                      <span className="font-semibold text-slate-900 whitespace-nowrap break-keep shrink-0" style={{ fontSize: density.subTitleSize }}>{p.projectName}</span>
                      <span className="text-slate-600 ml-2 font-medium whitespace-nowrap break-keep shrink-0" style={{ fontSize: density.bodySize }}>
                        {p.role} {p.techStack && <span className="text-slate-400 font-mono text-[11px]">| {p.techStack}</span>}
                      </span>
                    </div>
                    <span className="text-slate-400 text-xs font-mono whitespace-nowrap break-keep shrink-0 text-right">{p.startDate} — {p.current ? '至今' : p.endDate}</span>
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
            <SectionHeader
              title={getSectionTitle(data, 'education')}
              primaryColor={primaryColor}
              headerStyle={theme.headerStyle || 'minimal'}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: density.itemGap }}>
              {educations.map((edu) => (
                <div key={edu.id}>
                  <div className="flex justify-between items-baseline gap-2 min-w-0">
                    <div className="flex items-baseline gap-2 min-w-0 flex-1">
                      <span className="font-semibold text-slate-900 whitespace-nowrap break-keep shrink-0" style={{ fontSize: density.subTitleSize }}>{edu.school}</span>
                      <span className="text-slate-600 text-xs ml-2 whitespace-nowrap break-keep shrink-0">{edu.major} · {edu.degree}</span>
                    </div>
                    <span className="text-slate-400 text-xs font-mono whitespace-nowrap break-keep shrink-0 text-right">{edu.startDate} — {edu.endDate}</span>
                  </div>
                  {(edu.gpa || edu.honors || edu.courses) && (
                    <div className="text-slate-500 text-[11px] mt-0.5" style={{ fontSize: density.metaSize }}>
                      {edu.gpa && <span className="whitespace-nowrap break-keep">GPA: {edu.gpa} </span>}
                      {edu.honors && <span className="whitespace-nowrap break-keep">荣誉: {edu.honors} </span>}
                      {edu.courses && <span className="whitespace-nowrap break-keep">主修: {edu.courses}</span>}
                    </div>
                  )}
                  {edu.customPoints && edu.customPoints.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {edu.customPoints.map((pt, idx) => (
                        <span key={idx} className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-[10px] whitespace-nowrap break-keep">
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
            <SectionHeader
              title={getSectionTitle(data, 'skills')}
              primaryColor={primaryColor}
              headerStyle={theme.headerStyle || 'minimal'}
            />
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs">
              {skills.map((s) => (
                <div key={s.id} className="flex items-center gap-2">
                  <span className="text-slate-800">{s.name}</span>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((dot) => (
                      <span key={dot} className={`w-1.5 h-1.5 rounded-full ${dot <= s.level ? 'bg-slate-800' : 'bg-slate-200'}`} />
                    ))}
                  </div>
                </div>
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
                <SectionHeader
                  title={getSectionTitle(data, 'certificates')}
                  primaryColor={primaryColor}
                  headerStyle={theme.headerStyle || 'minimal'}
                />
                <div className="space-y-1 text-xs text-slate-600">
                  {certificates.map((c) => (
                    <div key={c.id} className="flex justify-between">
                      <span>{c.name}</span>
                      <span className="text-slate-400">{c.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {languages.length > 0 && (
              <div>
                <SectionHeader
                  title={getSectionTitle(data, 'languages')}
                  primaryColor={primaryColor}
                  headerStyle={theme.headerStyle || 'minimal'}
                />
                <div className="space-y-1 text-xs text-slate-600">
                  {languages.map((l) => (
                    <div key={l.id} className="flex justify-between">
                      <span>{l.language}</span>
                      <span className="text-slate-400">{l.proficiency}</span>
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
                  <SectionHeader
                    title={sec.title}
                    primaryColor={primaryColor}
                    headerStyle={theme.headerStyle || 'minimal'}
                  />
                  <div className="space-y-2">
                    {sec.items.map((item) => (
                      <div key={item.id} className="text-xs">
                        <div className="flex justify-between font-medium text-slate-900">
                          <span>{item.title}</span>
                          {item.date && <span className="text-slate-400">{item.date}</span>}
                        </div>
                        {item.subtitle && <div className="text-slate-600 text-xs">{item.subtitle}</div>}
                        <p className="text-slate-700 whitespace-pre-line mt-0.5">{item.description}</p>
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
      className="bg-white text-slate-800 w-full box-border transition-all"
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

          {/* Profile Avatar - Standard 1-inch 25mm x 35mm */}
          {profile.showAvatar && (
            <ResumeAvatar profile={profile} theme={theme} />
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
