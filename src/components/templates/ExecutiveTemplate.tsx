import React from 'react';
import { ResumeData, ThemeConfig } from '../../types';
import { Mail, Phone, MapPin, Globe, Award, BookOpen, Briefcase, FolderGit2, Wrench, Languages, Sparkles, Tag } from 'lucide-react';
import { getDensityStyles, getSectionTitle, DEFAULT_SECTION_ORDER } from '../../utils/templateHelpers';
import { SectionHeader } from './SectionHeader';
import { ResumeAvatar } from '../ResumeAvatar';

interface TemplateProps {
  data: ResumeData;
  theme: ThemeConfig;
}

export const ExecutiveTemplate: React.FC<TemplateProps> = ({ data, theme }) => {
  const { profile, jobIntent, summary, workExperiences, projectExperiences, educations, skills, certificates, languages, customSections } = data;
  const primaryColor = theme.primaryColor || '#831843'; // Executive Burgundy
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
            className="p-2.5 px-4 rounded text-xs flex justify-between items-center font-medium border avoid-break"
            style={{ 
              backgroundColor: `${primaryColor}08`, 
              borderColor: `${primaryColor}20`,
              marginBottom: density.sectionGap 
            }}
          >
            <span style={{ color: primaryColor }}><strong>{getSectionTitle(data, 'jobIntent')}：</strong>{jobIntent.targetPosition}</span>
            {jobIntent.targetCity && <span>期望地点: {jobIntent.targetCity}</span>}
            {jobIntent.targetSalary && <span>期望薪资: {jobIntent.targetSalary}</span>}
            {jobIntent.availableTime && <span>到岗时间: {jobIntent.availableTime}</span>}
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
            <p className="text-slate-700 leading-relaxed whitespace-pre-line text-justify pl-3 border-l-2 border-slate-200" style={{ fontSize: density.bodySize }}>
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
                <div key={w.id}>
                  <div className="flex flex-wrap justify-between items-baseline gap-2 mb-1">
                    <div className="font-bold text-slate-900" style={{ fontSize: density.subTitleSize }}>
                      {w.company} <span className="font-normal text-slate-600 text-xs">({w.department || '核心业务部'})</span>
                    </div>
                    <span className="font-bold" style={{ color: primaryColor, fontSize: density.bodySize }}>{w.position}</span>
                    <span className="text-slate-500 text-xs font-mono">{w.startDate} - {w.current ? '至今' : w.endDate}</span>
                  </div>
                  {w.description && <p className="text-slate-700 mb-1 leading-relaxed" style={{ fontSize: density.bodySize }}>{w.description}</p>}
                  {w.achievements && (
                    <div className="text-slate-700 whitespace-pre-line leading-relaxed pl-3 border-l-2" style={{ borderColor: `${primaryColor}40`, fontSize: density.bodySize }}>
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
                <div key={p.id}>
                  <div className="flex flex-wrap justify-between items-baseline gap-2 mb-1">
                    <span className="font-bold text-slate-900" style={{ fontSize: density.subTitleSize }}>{p.projectName}</span>
                    <span className="font-semibold text-slate-700" style={{ fontSize: density.bodySize }}>{p.role}</span>
                    <span className="text-slate-500 text-xs font-mono">{p.startDate} - {p.current ? '至今' : p.endDate}</span>
                  </div>
                  {p.description && <p className="text-slate-700 mb-1 leading-relaxed" style={{ fontSize: density.bodySize }}>{p.description}</p>}
                  {p.results && (
                    <div className="text-slate-700 whitespace-pre-line leading-relaxed pl-3 border-l-2 border-slate-200" style={{ fontSize: density.bodySize }}>
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
              {educations.map((e) => (
                <div key={e.id}>
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-slate-900" style={{ fontSize: density.subTitleSize }}>{e.school}</span>
                    <span className="text-slate-500 text-xs font-mono">{e.startDate} - {e.endDate}</span>
                  </div>
                  <div className="text-slate-700 font-medium text-xs">{e.major} · {e.degree}</div>
                  {(e.gpa || e.honors || e.courses) && (
                    <div className="text-slate-500 text-xs mt-0.5" style={{ fontSize: density.metaSize }}>
                      {e.gpa && <span>GPA: {e.gpa} </span>}
                      {e.honors && <span>荣誉: {e.honors}</span>}
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

            <div className="grid grid-cols-2 gap-2 text-xs">
              {skills.map((s) => (
                <div key={s.id} className="flex justify-between items-center p-2 rounded bg-slate-50 border border-slate-100">
                  <span className="font-medium text-slate-800">{s.name}</span>
                  <span className="font-semibold text-[11px]" style={{ color: primaryColor }}>
                    {s.level === 5 ? '精通 / 专家' : s.level >= 4 ? '熟练掌握' : '良好'}
                  </span>
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
                  icon={<Award className="w-4 h-4" />}
                  primaryColor={primaryColor}
                  headerStyle={theme.headerStyle || 'left-bar'}
                />
                <div className="space-y-1 text-xs text-slate-700">
                  {certificates.map((c) => (
                    <div key={c.id} className="flex justify-between">
                      <span className="font-medium">{c.name}</span>
                      <span className="text-slate-500 font-mono">{c.date}</span>
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
                <div className="space-y-1 text-xs text-slate-700">
                  {languages.map((l) => (
                    <div key={l.id} className="flex justify-between">
                      <span className="font-medium">{l.language}</span>
                      <span className="text-slate-600">{l.proficiency}</span>
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
                          {item.date && <span className="text-slate-500">{item.date}</span>}
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
      {/* Top Header with Solid Accent Bar */}
      <header className="border-b-4 pb-5 mb-5 flex justify-between items-center gap-6" style={{ borderColor: primaryColor }}>
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-950 mb-1">
            {profile.name || '求职者姓名'}
          </h1>
          <p className="text-xs font-semibold tracking-wide uppercase mb-2" style={{ color: primaryColor }}>
            {profile.title || '高级管理 / 行业专家'}
          </p>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
            {profile.phone && <span className="flex items-center gap-1 font-medium"><Phone className="w-3.5 h-3.5" style={{ color: primaryColor }} /> {profile.phone}</span>}
            {profile.email && <span className="flex items-center gap-1 font-medium"><Mail className="w-3.5 h-3.5" style={{ color: primaryColor }} /> {profile.email}</span>}
            {profile.location && <span className="flex items-center gap-1 font-medium"><MapPin className="w-3.5 h-3.5" style={{ color: primaryColor }} /> {profile.location}</span>}
            {profile.workYears && <span>工作年限: {profile.workYears}</span>}
            {profile.highestDegree && <span>最高学历: {profile.highestDegree}</span>}
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
