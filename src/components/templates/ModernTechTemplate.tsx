import React from 'react';
import { ResumeData, ThemeConfig } from '../../types';
import { 
  Mail, Phone, MapPin, Globe, Github, 
  Award, BookOpen, Briefcase, FolderGit2, Wrench, Languages, Sparkles, Tag, Terminal
} from 'lucide-react';
import { getDensityStyles, getSectionTitle, DEFAULT_SECTION_ORDER } from '../../utils/templateHelpers';

interface TemplateProps {
  data: ResumeData;
  theme: ThemeConfig;
}

export const ModernTechTemplate: React.FC<TemplateProps> = ({ data, theme }) => {
  const { profile, jobIntent, summary, workExperiences, projectExperiences, educations, skills, certificates, languages, customSections } = data;
  const primaryColor = theme.primaryColor || '#0e7490';
  const density = getDensityStyles(theme);

  const avatarRadiusClass = 
    theme.avatarShape === 'circle' ? 'rounded-full' :
    theme.avatarShape === 'rounded' ? 'rounded-xl' : 'rounded-none';

  const order = data.sectionOrder && data.sectionOrder.length > 0 ? data.sectionOrder : DEFAULT_SECTION_ORDER;

  const renderSection = (sectionKey: string) => {
    if (data.hiddenSections.includes(sectionKey)) return null;

    switch (sectionKey) {
      case 'jobIntent':
        if (!jobIntent.targetPosition) return null;
        return (
          <div 
            key="jobIntent"
            className="p-2.5 rounded-lg border flex flex-wrap justify-between items-center text-xs font-mono avoid-break"
            style={{ 
              backgroundColor: `${primaryColor}0a`, 
              borderColor: `${primaryColor}30`,
              marginBottom: density.sectionGap 
            }}
          >
            <span><strong style={{ color: primaryColor }}>TARGET_ROLE:</strong> {jobIntent.targetPosition}</span>
            {jobIntent.targetCity && <span>CITY: {jobIntent.targetCity}</span>}
            {jobIntent.targetSalary && <span>SALARY: {jobIntent.targetSalary}</span>}
            {jobIntent.availableTime && <span>STATUS: {jobIntent.availableTime}</span>}
          </div>
        );

      case 'summary':
        if (!summary) return null;
        return (
          <section key="summary" className="avoid-break" style={{ marginBottom: density.sectionGap }}>
            <div className="flex items-center gap-2 mb-2 pb-1 border-b border-slate-100">
              <span className="w-2.5 h-2.5 rounded-xs" style={{ backgroundColor: primaryColor }} />
              <h2 className="font-bold text-sm tracking-wide uppercase text-slate-900">
                {getSectionTitle(data, 'summary')}
              </h2>
            </div>
            <p className="text-slate-700 leading-relaxed whitespace-pre-line text-justify" style={{ fontSize: density.bodySize }}>
              {summary}
            </p>
          </section>
        );

      case 'work':
        if (workExperiences.length === 0) return null;
        return (
          <section key="work" className="avoid-break" style={{ marginBottom: density.sectionGap }}>
            <div className="flex items-center gap-2 mb-2.5 pb-1 border-b border-slate-100">
              <span className="w-2.5 h-2.5 rounded-xs" style={{ backgroundColor: primaryColor }} />
              <h2 className="font-bold text-sm tracking-wide uppercase text-slate-900">
                {getSectionTitle(data, 'work')}
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: density.itemGap }}>
              {workExperiences.map((w) => (
                <div key={w.id} className="relative pl-3 border-l-2" style={{ borderColor: `${primaryColor}40` }}>
                  <div className="flex flex-wrap justify-between items-baseline gap-2 mb-1">
                    <span className="font-bold text-slate-900" style={{ fontSize: density.subTitleSize }}>
                      {w.company} {w.department && <span className="font-normal text-slate-500 text-xs">/ {w.department}</span>}
                    </span>
                    <span className="font-semibold" style={{ color: primaryColor, fontSize: density.bodySize }}>{w.position}</span>
                    <span className="text-slate-400 font-mono text-xs">{w.startDate} - {w.current ? 'PRESENT' : w.endDate}</span>
                  </div>
                  {w.description && <p className="text-slate-700 mb-1 leading-relaxed" style={{ fontSize: density.bodySize }}>{w.description}</p>}
                  {w.achievements && (
                    <div className="text-slate-700 whitespace-pre-line leading-relaxed" style={{ fontSize: density.bodySize }}>
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
            <div className="flex items-center gap-2 mb-2.5 pb-1 border-b border-slate-100">
              <span className="w-2.5 h-2.5 rounded-xs" style={{ backgroundColor: primaryColor }} />
              <h2 className="font-bold text-sm tracking-wide uppercase text-slate-900">
                {getSectionTitle(data, 'project')}
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: density.itemGap }}>
              {projectExperiences.map((p) => (
                <div key={p.id} className="relative pl-3 border-l-2" style={{ borderColor: `${primaryColor}40` }}>
                  <div className="flex flex-wrap justify-between items-baseline gap-2 mb-1">
                    <span className="font-bold text-slate-900" style={{ fontSize: density.subTitleSize }}>{p.projectName}</span>
                    <span className="font-medium text-slate-700" style={{ fontSize: density.bodySize }}>{p.role}</span>
                    <span className="text-slate-400 font-mono text-xs">{p.startDate} - {p.current ? 'PRESENT' : p.endDate}</span>
                  </div>
                  {p.techStack && (
                    <div className="text-xs font-mono mb-1" style={{ color: primaryColor }}>
                      STACK: {p.techStack}
                    </div>
                  )}
                  {p.description && <p className="text-slate-700 mb-1 leading-relaxed" style={{ fontSize: density.bodySize }}>{p.description}</p>}
                  {p.results && (
                    <div className="text-slate-700 whitespace-pre-line leading-relaxed" style={{ fontSize: density.bodySize }}>
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
            <div className="flex items-center gap-2 mb-2.5 pb-1 border-b border-slate-100">
              <span className="w-2.5 h-2.5 rounded-xs" style={{ backgroundColor: primaryColor }} />
              <h2 className="font-bold text-sm tracking-wide uppercase text-slate-900">
                {getSectionTitle(data, 'education')}
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: density.itemGap }}>
              {educations.map((edu) => (
                <div key={edu.id} className="relative pl-3 border-l-2" style={{ borderColor: `${primaryColor}40` }}>
                  <div className="flex flex-wrap justify-between items-baseline gap-2">
                    <span className="font-bold text-slate-900" style={{ fontSize: density.subTitleSize }}>{edu.school}</span>
                    <span className="font-medium text-slate-700" style={{ fontSize: density.bodySize }}>{edu.major} · {edu.degree}</span>
                    <span className="text-slate-400 font-mono text-xs">{edu.startDate} - {edu.endDate}</span>
                  </div>
                  {(edu.gpa || edu.honors || edu.courses) && (
                    <div className="text-slate-500 mt-0.5 flex flex-wrap gap-x-4" style={{ fontSize: density.metaSize }}>
                      {edu.gpa && <span>GPA: {edu.gpa}</span>}
                      {edu.honors && <span>HONOR: {edu.honors}</span>}
                      {edu.courses && <span>COURSES: {edu.courses}</span>}
                    </div>
                  )}

                  {/* Custom points like CET-4 */}
                  {edu.customPoints && edu.customPoints.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {edu.customPoints.map((pt, pIdx) => (
                        <span 
                          key={pIdx}
                          className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[11px] font-mono border"
                          style={{ backgroundColor: `${primaryColor}0a`, borderColor: `${primaryColor}30`, color: primaryColor }}
                        >
                          <Tag className="w-2.5 h-2.5" />
                          {pt}
                        </span>
                      ))}
                    </div>
                  )}

                  {edu.additionalInfo && (
                    <p className="text-slate-600 text-xs mt-1 leading-relaxed">{edu.additionalInfo}</p>
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
            <div className="flex items-center gap-2 mb-2.5 pb-1 border-b border-slate-100">
              <span className="w-2.5 h-2.5 rounded-xs" style={{ backgroundColor: primaryColor }} />
              <h2 className="font-bold text-sm tracking-wide uppercase text-slate-900">
                {getSectionTitle(data, 'skills')}
              </h2>
            </div>

            <div className="flex flex-wrap gap-2 text-xs font-mono">
              {skills.map((s) => (
                <span 
                  key={s.id}
                  className="px-2.5 py-1 rounded-md border font-medium flex items-center gap-1.5"
                  style={{ backgroundColor: `${primaryColor}08`, borderColor: `${primaryColor}25`, color: '#0f172a' }}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: primaryColor }} />
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
            {certificates.length > 0 && !data.hiddenSections.includes('certificates') && (
              <section>
                <div className="flex items-center gap-2 mb-2 pb-1 border-b border-slate-100">
                  <span className="w-2 h-2 rounded-xs" style={{ backgroundColor: primaryColor }} />
                  <h2 className="font-bold text-xs tracking-wide uppercase text-slate-900">
                    {getSectionTitle(data, 'certificates')}
                  </h2>
                </div>
                <div className="space-y-1 text-xs font-mono">
                  {certificates.map((c) => (
                    <div key={c.id} className="flex justify-between">
                      <span>{c.name}</span>
                      <span className="text-slate-400">{c.date}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {languages.length > 0 && !data.hiddenSections.includes('languages') && (
              <section>
                <div className="flex items-center gap-2 mb-2 pb-1 border-b border-slate-100">
                  <span className="w-2 h-2 rounded-xs" style={{ backgroundColor: primaryColor }} />
                  <h2 className="font-bold text-xs tracking-wide uppercase text-slate-900">
                    {getSectionTitle(data, 'languages')}
                  </h2>
                </div>
                <div className="space-y-1 text-xs font-mono">
                  {languages.map((l) => (
                    <div key={l.id} className="flex justify-between">
                      <span>{l.language}</span>
                      <span className="text-slate-500">{l.proficiency}</span>
                    </div>
                  ))}
                </div>
              </section>
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
                  <div className="flex items-center gap-2 mb-2 pb-1 border-b border-slate-100">
                    <span className="w-2.5 h-2.5 rounded-xs" style={{ backgroundColor: primaryColor }} />
                    <h2 className="font-bold text-sm tracking-wide uppercase text-slate-900">
                      {sec.title}
                    </h2>
                  </div>
                  <div className="space-y-2">
                    {sec.items.map((item) => (
                      <div key={item.id} className="text-xs">
                        <div className="flex justify-between font-medium text-slate-900">
                          <span>{item.title}</span>
                          {item.date && <span className="text-slate-400 font-mono">{item.date}</span>}
                        </div>
                        {item.subtitle && <div className="text-slate-600 font-mono text-[11px]">{item.subtitle}</div>}
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
      className="bg-white text-slate-800 leading-relaxed max-w-[800px] mx-auto transition-all"
      style={density.containerStyle}
    >
      {/* Modern Tech Header */}
      <header className="border-b pb-5 mb-5 flex justify-between items-center gap-6" style={{ borderColor: `${primaryColor}30` }}>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 font-mono">
              {profile.name || 'DEVELOPER'}
            </h1>
            {profile.title && (
              <span className="px-2.5 py-0.5 text-xs font-mono rounded font-semibold text-white" style={{ backgroundColor: primaryColor }}>
                {profile.title}
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-600 font-mono mt-2">
            {profile.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" style={{ color: primaryColor }} /> {profile.phone}</span>}
            {profile.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" style={{ color: primaryColor }} /> {profile.email}</span>}
            {profile.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" style={{ color: primaryColor }} /> {profile.location}</span>}
            {profile.github && <span className="flex items-center gap-1"><Github className="w-3 h-3" style={{ color: primaryColor }} /> {profile.github}</span>}
            {profile.website && <span className="flex items-center gap-1"><Globe className="w-3 h-3" style={{ color: primaryColor }} /> {profile.website}</span>}
          </div>
        </div>

        {profile.showAvatar && profile.avatar && (
          <img 
            src={profile.avatar} 
            alt={profile.name} 
            className={`w-20 h-24 object-cover border-2 shadow-sm ${avatarRadiusClass}`}
            style={{ borderColor: primaryColor }}
          />
        )}
      </header>

      {/* Main Ordered List */}
      <div>
        {order.map((key) => renderSection(key))}
      </div>
    </div>
  );
};
