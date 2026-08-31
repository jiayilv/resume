import React from 'react';
import { ResumeData, ThemeConfig } from '../../types';
import { 
  Mail, Phone, MapPin, Globe, Github, 
  Award, BookOpen, Briefcase, FolderGit2, Wrench, Languages, Sparkles, Tag, Terminal
} from 'lucide-react';
import { getDensityStyles, getSectionTitle, DEFAULT_SECTION_ORDER } from '../../utils/templateHelpers';
import { SectionHeader } from './SectionHeader';
import { ResumeAvatar } from '../ResumeAvatar';

interface TemplateProps {
  data: ResumeData;
  theme: ThemeConfig;
}

export const ModernTechTemplate: React.FC<TemplateProps> = ({ data, theme }) => {
  const { profile, jobIntent, summary, workExperiences, projectExperiences, educations, skills, certificates, languages, customSections } = data;
  const primaryColor = theme.primaryColor || '#0e7490';
  const density = getDensityStyles(theme);

  const order = data.sectionOrder && data.sectionOrder.length > 0 ? data.sectionOrder : DEFAULT_SECTION_ORDER;

  const renderSection = (sectionKey: string) => {
    if (data.hiddenSections.includes(sectionKey)) return null;

    switch (sectionKey) {
      case 'jobIntent':
        if (!jobIntent.targetPosition) return null;
        return (
          <div 
            key="jobIntent"
            className="p-2.5 rounded-lg border flex flex-wrap justify-between items-center text-xs font-mono avoid-break gap-2"
            style={{ 
              backgroundColor: `${primaryColor}0a`, 
              borderColor: `${primaryColor}30`,
              marginBottom: density.sectionGap 
            }}
          >
            <div className="flex items-center gap-1.5 whitespace-nowrap break-keep">
              <strong style={{ color: primaryColor }}>{getSectionTitle(data, 'jobIntent').toUpperCase()}:</strong>
              <span>{jobIntent.targetPosition}</span>
            </div>
            <div className="flex flex-wrap items-center gap-x-3">
              {jobIntent.targetCity && <span className="whitespace-nowrap break-keep">CITY: {jobIntent.targetCity}</span>}
              {jobIntent.targetSalary && <span className="whitespace-nowrap break-keep">SALARY: {jobIntent.targetSalary}</span>}
              {jobIntent.availableTime && <span className="whitespace-nowrap break-keep">STATUS: {jobIntent.availableTime}</span>}
            </div>
          </div>
        );

      case 'summary':
        if (!summary) return null;
        return (
          <section key="summary" className="avoid-break" style={{ marginBottom: density.sectionGap }}>
            <SectionHeader
              title={getSectionTitle(data, 'summary')}
              icon={<Sparkles className="w-4 h-4" />}
              primaryColor={primaryColor}
              headerStyle={theme.headerStyle || 'left-bar'}
            />
            <p className="text-slate-700 leading-relaxed whitespace-pre-line text-justify" style={{ fontSize: density.bodySize }}>
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
              icon={<Briefcase className="w-4 h-4" />}
              primaryColor={primaryColor}
              headerStyle={theme.headerStyle || 'left-bar'}
            />

            <div style={{ display: 'flex', flexDirection: 'column', gap: density.itemGap }}>
              {workExperiences.map((w) => (
                <div key={w.id} className="relative pl-3 border-l-2" style={{ borderColor: `${primaryColor}40` }}>
                  <div className="flex justify-between items-baseline gap-2 mb-1 min-w-0">
                    <div className="flex items-baseline gap-2 min-w-0 flex-1">
                      <span className="font-bold text-slate-900 whitespace-nowrap break-keep shrink-0" style={{ fontSize: density.subTitleSize }}>
                        {w.company}
                      </span>
                      {w.department && <span className="font-normal text-slate-500 text-xs whitespace-nowrap break-keep shrink-0">/ {w.department}</span>}
                      <span className="font-semibold ml-2 whitespace-nowrap break-keep shrink-0" style={{ color: primaryColor, fontSize: density.bodySize }}>{w.position}</span>
                    </div>
                    <span className="text-slate-400 font-mono text-xs whitespace-nowrap break-keep shrink-0 text-right">{w.startDate} - {w.current ? 'PRESENT' : w.endDate}</span>
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
            <SectionHeader
              title={getSectionTitle(data, 'project')}
              icon={<FolderGit2 className="w-4 h-4" />}
              primaryColor={primaryColor}
              headerStyle={theme.headerStyle || 'left-bar'}
            />

            <div style={{ display: 'flex', flexDirection: 'column', gap: density.itemGap }}>
              {projectExperiences.map((p) => (
                <div key={p.id} className="relative pl-3 border-l-2" style={{ borderColor: `${primaryColor}40` }}>
                  <div className="flex justify-between items-baseline gap-2 mb-1 min-w-0">
                    <div className="flex items-baseline gap-2 min-w-0 flex-1">
                      <span className="font-bold text-slate-900 whitespace-nowrap break-keep shrink-0" style={{ fontSize: density.subTitleSize }}>{p.projectName}</span>
                      <span className="font-medium ml-2 whitespace-nowrap break-keep shrink-0" style={{ color: primaryColor, fontSize: density.bodySize }}>{p.role}</span>
                    </div>
                    <span className="text-slate-400 font-mono text-xs whitespace-nowrap break-keep shrink-0 text-right">{p.startDate} - {p.current ? 'PRESENT' : p.endDate}</span>
                  </div>
                  {p.techStack && (
                    <div className="mb-1 text-xs text-slate-500 font-mono">
                      <span className="text-slate-700 font-bold">STACK:</span> {p.techStack}
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
            <SectionHeader
              title={getSectionTitle(data, 'education')}
              icon={<BookOpen className="w-4 h-4" />}
              primaryColor={primaryColor}
              headerStyle={theme.headerStyle || 'left-bar'}
            />

            <div style={{ display: 'flex', flexDirection: 'column', gap: density.itemGap }}>
              {educations.map((edu) => (
                <div key={edu.id}>
                  <div className="flex justify-between items-baseline gap-2 min-w-0">
                    <div className="flex items-baseline gap-2 min-w-0 flex-1">
                      <span className="font-bold text-slate-900 whitespace-nowrap break-keep shrink-0" style={{ fontSize: density.subTitleSize }}>{edu.school}</span>
                      <span className="text-slate-700 text-xs ml-2 whitespace-nowrap break-keep shrink-0">{edu.major} · {edu.degree}</span>
                    </div>
                    <span className="text-slate-400 font-mono text-xs whitespace-nowrap break-keep shrink-0 text-right">{edu.startDate} - {edu.endDate}</span>
                  </div>
                  {(edu.gpa || edu.honors || edu.courses) && (
                    <div className="text-slate-500 font-mono mt-0.5" style={{ fontSize: density.metaSize }}>
                      {edu.gpa && <span className="whitespace-nowrap break-keep">GPA: {edu.gpa} </span>}
                      {edu.honors && <span className="whitespace-nowrap break-keep">HONORS: {edu.honors} </span>}
                      {edu.courses && <span className="whitespace-nowrap break-keep">COURSES: {edu.courses}</span>}
                    </div>
                  )}
                  {edu.customPoints && edu.customPoints.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {edu.customPoints.map((pt, idx) => (
                        <span key={idx} className="bg-slate-100 px-1.5 py-0.5 rounded text-[10px] font-mono text-slate-700 whitespace-nowrap break-keep">
                          #{pt}
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
              icon={<Wrench className="w-4 h-4" />}
              primaryColor={primaryColor}
              headerStyle={theme.headerStyle || 'left-bar'}
            />

            <div className="flex flex-wrap gap-1.5">
              {skills.map((s) => (
                <span 
                  key={s.id}
                  className="px-2.5 py-1 rounded text-xs font-mono font-medium border"
                  style={{ backgroundColor: `${primaryColor}08`, borderColor: `${primaryColor}30`, color: primaryColor }}
                >
                  {s.name}
                  <span className="text-slate-400 ml-1">★{s.level}</span>
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
                <SectionHeader
                  title={getSectionTitle(data, 'certificates')}
                  icon={<Award className="w-4 h-4" />}
                  primaryColor={primaryColor}
                  headerStyle={theme.headerStyle || 'left-bar'}
                />
                <div className="space-y-1 text-xs font-mono text-slate-700">
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
                  icon={<Languages className="w-4 h-4" />}
                  primaryColor={primaryColor}
                  headerStyle={theme.headerStyle || 'left-bar'}
                />
                <div className="space-y-1 text-xs font-mono text-slate-700">
                  {languages.map((l) => (
                    <div key={l.id} className="flex justify-between">
                      <span>{l.language}</span>
                      <span className="text-slate-500">{l.proficiency}</span>
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
                    headerStyle={theme.headerStyle || 'left-bar'}
                  />
                  <div className="space-y-2">
                    {sec.items.map((item) => (
                      <div key={item.id} className="text-xs">
                        <div className="flex justify-between font-medium text-slate-900">
                          <span>{item.title}</span>
                          {item.date && <span className="text-slate-400 font-mono">{item.date}</span>}
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
      className="bg-white text-slate-800 leading-relaxed w-full box-border transition-all"
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

        {/* Profile Avatar - Standard 1-inch 25mm x 35mm */}
        {profile.showAvatar && (
          <ResumeAvatar profile={profile} theme={theme} />
        )}
      </header>

      {/* Main Ordered List */}
      <div>
        {order.map((key) => renderSection(key))}
      </div>
    </div>
  );
};
