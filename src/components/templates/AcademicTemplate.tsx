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

export const AcademicTemplate: React.FC<TemplateProps> = ({ data, theme }) => {
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
          <div key="jobIntent" className="text-center italic text-xs text-slate-600 mb-4 pb-2 border-b border-slate-200 avoid-break" style={{ marginBottom: density.sectionGap }}>
            <strong>{getSectionTitle(data, 'jobIntent')}:</strong> {jobIntent.targetPosition}
            {jobIntent.targetCity && ` · ${jobIntent.targetCity}`}
            {jobIntent.targetSalary && ` · ${jobIntent.targetSalary}`}
          </div>
        );

      case 'summary':
        if (!summary) return null;
        return (
          <section key="summary" className="avoid-break" style={{ marginBottom: density.sectionGap }}>
            <SectionHeader
              title={getSectionTitle(data, 'summary')}
              primaryColor={primaryColor}
              headerStyle={theme.headerStyle || 'academic'}
            />
            <p className="text-slate-700 leading-relaxed font-serif text-justify" style={{ fontSize: density.bodySize }}>
              {summary}
            </p>
          </section>
        );

      case 'education':
        if (educations.length === 0) return null;
        return (
          <section key="education" className="avoid-break" style={{ marginBottom: density.sectionGap }}>
            <SectionHeader
              title={getSectionTitle(data, 'education')}
              primaryColor={primaryColor}
              headerStyle={theme.headerStyle || 'academic'}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: density.itemGap }}>
              {educations.map((edu) => (
                <div key={edu.id} className="font-serif">
                  <div className="flex justify-between font-bold text-slate-900" style={{ fontSize: density.subTitleSize }}>
                    <span>{edu.school}</span>
                    <span className="font-normal font-mono text-xs">{edu.startDate} – {edu.endDate}</span>
                  </div>
                  <div className="italic text-slate-700" style={{ fontSize: density.bodySize }}>{edu.degree} in {edu.major}</div>
                  {(edu.gpa || edu.honors || edu.courses) && (
                    <div className="text-xs text-slate-600 mt-0.5">
                      {edu.gpa && <span>GPA: {edu.gpa} </span>}
                      {edu.honors && <span>| Honors: {edu.honors} </span>}
                      {edu.courses && <span>| Key Courses: {edu.courses}</span>}
                    </div>
                  )}
                  {edu.customPoints && edu.customPoints.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {edu.customPoints.map((pt, pIdx) => (
                        <span key={pIdx} className="text-slate-800 text-[11px] font-sans border border-slate-300 px-1.5 py-0.5 rounded">
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

      case 'work':
        if (workExperiences.length === 0) return null;
        return (
          <section key="work" className="avoid-break" style={{ marginBottom: density.sectionGap }}>
            <SectionHeader
              title={getSectionTitle(data, 'work')}
              primaryColor={primaryColor}
              headerStyle={theme.headerStyle || 'academic'}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: density.itemGap }}>
              {workExperiences.map((w) => (
                <div key={w.id} className="font-serif">
                  <div className="flex justify-between font-bold text-slate-900" style={{ fontSize: density.subTitleSize }}>
                    <span>{w.company}</span>
                    <span className="font-normal font-mono text-xs">{w.startDate} – {w.current ? 'Present' : w.endDate}</span>
                  </div>
                  <div className="italic text-slate-800 mb-1" style={{ fontSize: density.bodySize }}>{w.position} {w.department && `(${w.department})`}</div>
                  {w.description && <p className="text-slate-700 mb-1 leading-relaxed font-sans" style={{ fontSize: density.bodySize }}>{w.description}</p>}
                  {w.achievements && (
                    <div className="text-slate-700 whitespace-pre-line leading-relaxed font-sans pl-2 border-l border-slate-300" style={{ fontSize: density.bodySize }}>
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
              headerStyle={theme.headerStyle || 'academic'}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: density.itemGap }}>
              {projectExperiences.map((p) => (
                <div key={p.id} className="font-serif">
                  <div className="flex justify-between font-bold text-slate-900" style={{ fontSize: density.subTitleSize }}>
                    <span>{p.projectName}</span>
                    <span className="font-normal font-mono text-xs">{p.startDate} – {p.current ? 'Present' : p.endDate}</span>
                  </div>
                  <div className="italic text-slate-700 mb-1" style={{ fontSize: density.bodySize }}>
                    {p.role} {p.techStack && <span className="font-sans text-slate-600 text-xs">| {p.techStack}</span>}
                  </div>
                  {p.description && <p className="text-slate-700 mb-1 leading-relaxed font-sans" style={{ fontSize: density.bodySize }}>{p.description}</p>}
                  {p.results && (
                    <div className="text-slate-700 whitespace-pre-line leading-relaxed font-sans pl-2 border-l border-slate-300" style={{ fontSize: density.bodySize }}>
                      {p.results}
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
              headerStyle={theme.headerStyle || 'academic'}
            />
            <div className="text-xs text-slate-800 font-sans space-y-1">
              <div className="flex flex-wrap gap-x-4 gap-y-1">
                {skills.map((s) => (
                  <span key={s.id}>
                    <strong>{s.name}</strong> ({s.level === 5 ? 'Expert' : s.level >= 4 ? 'Advanced' : 'Proficient'})
                  </span>
                ))}
              </div>
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
                  headerStyle={theme.headerStyle || 'academic'}
                />
                <div className="space-y-1 text-xs font-serif text-slate-700">
                  {certificates.map((c) => (
                    <div key={c.id} className="flex justify-between">
                      <span>{c.name}</span>
                      <span className="font-mono text-slate-500">{c.date}</span>
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
                  headerStyle={theme.headerStyle || 'academic'}
                />
                <div className="space-y-1 text-xs font-serif text-slate-700">
                  {languages.map((l) => (
                    <div key={l.id} className="flex justify-between">
                      <span>{l.language}</span>
                      <span className="italic text-slate-600">{l.proficiency}</span>
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
                    headerStyle={theme.headerStyle || 'academic'}
                  />
                  <div className="space-y-2 font-serif">
                    {sec.items.map((item) => (
                      <div key={item.id} className="text-xs">
                        <div className="flex justify-between font-bold text-slate-900">
                          <span>{item.title}</span>
                          {item.date && <span className="text-slate-500 font-mono">{item.date}</span>}
                        </div>
                        {item.subtitle && <div className="italic text-slate-700">{item.subtitle}</div>}
                        <p className="text-slate-700 font-sans mt-0.5">{item.description}</p>
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
      className="bg-white text-slate-900 w-full box-border font-serif transition-all"
      style={density.containerStyle}
    >
      {/* Centered Academic Heading */}
      <header className="border-b-2 border-slate-900 pb-4 mb-4 flex items-center justify-between gap-4">
        <div className="flex-1 text-center">
          <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-normal uppercase text-slate-950 mb-1">
            {profile.name || 'FULL NAME'}
          </h1>
          {profile.title && (
            <p className="text-xs font-serif italic text-slate-700 mb-2">
              {profile.title}
            </p>
          )}

          <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-1 text-xs text-slate-700 font-serif">
            {profile.phone && <span>{profile.phone}</span>}
            {profile.email && <span>• {profile.email}</span>}
            {profile.location && <span>• {profile.location}</span>}
            {profile.website && <span>• {profile.website}</span>}
            {profile.github && <span>• {profile.github}</span>}
          </div>
        </div>

        {/* Profile Avatar - Standard 1-inch 25mm x 35mm */}
        {profile.showAvatar && (
          <ResumeAvatar profile={profile} theme={theme} />
        )}
      </header>

      {/* Dynamic Ordered Content */}
      <div>
        {order.map((key) => renderSection(key))}
      </div>
    </div>
  );
};
