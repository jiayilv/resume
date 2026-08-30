import React from 'react';
import { ResumeData, ThemeConfig } from '../../types';
import { 
  Mail, Phone, MapPin, Globe, Github, Award, BookOpen, 
  Briefcase, FolderGit2, Wrench, Languages, Sparkles, Tag 
} from 'lucide-react';
import { getDensityStyles, getSectionTitle, DEFAULT_SECTION_ORDER } from '../../utils/templateHelpers';

interface TemplateProps {
  data: ResumeData;
  theme: ThemeConfig;
}

export const SidebarEliteTemplate: React.FC<TemplateProps> = ({ data, theme }) => {
  const { profile, jobIntent, summary, workExperiences, projectExperiences, educations, skills, certificates, languages, customSections } = data;
  const primaryColor = theme.primaryColor || '#1e293b';
  const density = getDensityStyles(theme);

  const order = data.sectionOrder && data.sectionOrder.length > 0 ? data.sectionOrder : DEFAULT_SECTION_ORDER;

  // Filter sections for main column vs sidebar
  const renderMainSection = (sectionKey: string) => {
    if (data.hiddenSections.includes(sectionKey)) return null;

    switch (sectionKey) {
      case 'summary':
        if (!summary) return null;
        return (
          <section key="summary" className="avoid-break" style={{ marginBottom: density.sectionGap }}>
            <h2 className="font-bold text-sm tracking-wide uppercase text-slate-900 border-b pb-1 mb-2" style={{ borderColor: `${primaryColor}40` }}>
              {getSectionTitle(data, 'summary')}
            </h2>
            <p className="text-slate-700 leading-relaxed whitespace-pre-line text-justify" style={{ fontSize: density.bodySize }}>
              {summary}
            </p>
          </section>
        );

      case 'work':
        if (workExperiences.length === 0) return null;
        return (
          <section key="work" className="avoid-break" style={{ marginBottom: density.sectionGap }}>
            <h2 className="font-bold text-sm tracking-wide uppercase text-slate-900 border-b pb-1 mb-2.5" style={{ borderColor: `${primaryColor}40` }}>
              {getSectionTitle(data, 'work')}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: density.itemGap }}>
              {workExperiences.map((item) => (
                <div key={item.id}>
                  <div className="flex flex-wrap justify-between items-baseline gap-1 mb-1">
                    <span className="font-bold text-slate-900" style={{ fontSize: density.subTitleSize }}>
                      {item.company} {item.department && <span className="font-normal text-slate-500 text-xs">({item.department})</span>}
                    </span>
                    <span className="text-slate-500 text-xs font-mono">{item.startDate} - {item.current ? '至今' : item.endDate}</span>
                  </div>
                  <div className="font-semibold text-slate-700 mb-1" style={{ fontSize: density.bodySize }}>{item.position}</div>
                  {item.description && <p className="text-slate-600 mb-1 leading-relaxed" style={{ fontSize: density.bodySize }}>{item.description}</p>}
                  {item.achievements && (
                    <div className="text-slate-700 whitespace-pre-line leading-relaxed pl-2 border-l-2 border-slate-200" style={{ fontSize: density.bodySize }}>
                      {item.achievements}
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
            <h2 className="font-bold text-sm tracking-wide uppercase text-slate-900 border-b pb-1 mb-2.5" style={{ borderColor: `${primaryColor}40` }}>
              {getSectionTitle(data, 'project')}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: density.itemGap }}>
              {projectExperiences.map((proj) => (
                <div key={proj.id}>
                  <div className="flex flex-wrap justify-between items-baseline gap-1 mb-1">
                    <span className="font-bold text-slate-900" style={{ fontSize: density.subTitleSize }}>{proj.projectName}</span>
                    <span className="text-slate-500 text-xs font-mono">{proj.startDate} - {proj.current ? '至今' : proj.endDate}</span>
                  </div>
                  <div className="font-medium text-slate-700 mb-1" style={{ fontSize: density.bodySize }}>
                    {proj.role} {proj.techStack && <span className="text-slate-500 font-mono text-[11px]">| {proj.techStack}</span>}
                  </div>
                  {proj.description && <p className="text-slate-600 mb-1 leading-relaxed" style={{ fontSize: density.bodySize }}>{proj.description}</p>}
                  {proj.results && (
                    <div className="text-slate-700 whitespace-pre-line leading-relaxed pl-2 border-l-2 border-slate-200" style={{ fontSize: density.bodySize }}>
                      {proj.results}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        );

      case 'custom':
        if (!customSections || customSections.length === 0) return null;
        return (
          <div key="custom_group" style={{ marginBottom: density.sectionGap }}>
            {customSections.map((sec) => (
              !data.hiddenSections.includes(sec.id) && (
                <section key={sec.id} className="avoid-break" style={{ marginBottom: density.sectionGap }}>
                  <h2 className="font-bold text-sm tracking-wide uppercase text-slate-900 border-b pb-1 mb-2" style={{ borderColor: `${primaryColor}40` }}>
                    {sec.title}
                  </h2>
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
      className="bg-white text-slate-800 w-full box-border transition-all flex flex-row min-h-[297mm]"
      style={{
        fontFamily: density.fontFamily,
        fontSize: density.fontSize,
        lineHeight: density.lineHeight,
      }}
    >
      {/* Left Sidebar (Preserved in print) */}
      <div 
        className="w-[230px] text-white shrink-0 space-y-5"
        style={{ backgroundColor: primaryColor, padding: '24px 18px' }}
      >
        {/* Avatar */}
        {profile.showAvatar && profile.avatar && (
          <div className="flex justify-center">
            <img 
              src={profile.avatar} 
              alt={profile.name} 
              className="w-24 h-28 object-cover rounded-xl border-2 border-white/40 shadow-md"
            />
          </div>
        )}

        <div className="text-center sm:text-left">
          <h1 className="text-xl font-bold tracking-tight text-white">{profile.name || '姓名'}</h1>
          {profile.title && <p className="text-xs text-white/80 font-medium mt-0.5">{profile.title}</p>}
        </div>

        {/* Contact Info */}
        <div className="space-y-2 text-xs text-white/85 border-t border-white/20 pt-3">
          {profile.phone && <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-white/70" /> <span>{profile.phone}</span></div>}
          {profile.email && <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-white/70" /> <span className="break-all">{profile.email}</span></div>}
          {profile.location && <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-white/70" /> <span>{profile.location}</span></div>}
          {profile.website && <div className="flex items-center gap-2"><Globe className="w-3.5 h-3.5 text-white/70" /> <span className="break-all">{profile.website}</span></div>}
          {profile.github && <div className="flex items-center gap-2"><Github className="w-3.5 h-3.5 text-white/70" /> <span className="break-all">{profile.github}</span></div>}
        </div>

        {/* Education in Sidebar */}
        {educations.length > 0 && !data.hiddenSections.includes('education') && (
          <div className="border-t border-white/20 pt-3 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white/90">
              {getSectionTitle(data, 'education')}
            </h3>
            {educations.map((edu) => (
              <div key={edu.id} className="text-xs text-white/80 space-y-0.5">
                <div className="font-semibold text-white">{edu.school}</div>
                <div>{edu.major} · {edu.degree}</div>
                <div className="text-white/60 font-mono text-[11px]">{edu.startDate} - {edu.endDate}</div>
                {edu.gpa && <div className="text-white/70 text-[11px]">GPA: {edu.gpa}</div>}
                {edu.customPoints && edu.customPoints.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {edu.customPoints.map((pt, idx) => (
                      <span key={idx} className="bg-white/15 text-white px-1.5 py-0.5 rounded text-[10px]">
                        {pt}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Skills in Sidebar */}
        {skills.length > 0 && !data.hiddenSections.includes('skills') && (
          <div className="border-t border-white/20 pt-3 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white/90">
              {getSectionTitle(data, 'skills')}
            </h3>
            <div className="space-y-1.5">
              {skills.map((s) => (
                <div key={s.id} className="text-xs">
                  <div className="flex justify-between text-white/90 mb-0.5">
                    <span>{s.name}</span>
                  </div>
                  <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-white h-full rounded-full" style={{ width: `${(s.level / 5) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certs & Languages in Sidebar */}
        {certificates.length > 0 && !data.hiddenSections.includes('certificates') && (
          <div className="border-t border-white/20 pt-3 space-y-1.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white/90">
              {getSectionTitle(data, 'certificates')}
            </h3>
            {certificates.map((c) => (
              <div key={c.id} className="text-xs text-white/80">
                <div className="font-medium text-white">{c.name}</div>
                <div className="text-white/60 text-[10px]">{c.date}</div>
              </div>
            ))}
          </div>
        )}

        {languages.length > 0 && !data.hiddenSections.includes('languages') && (
          <div className="border-t border-white/20 pt-3 space-y-1.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white/90">
              {getSectionTitle(data, 'languages')}
            </h3>
            {languages.map((l) => (
              <div key={l.id} className="text-xs text-white/80">
                <span className="font-medium text-white">{l.language}</span>: {l.proficiency}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right Main Content */}
      <div className="flex-1 space-y-4" style={{ padding: density.pagePadding }}>
        {jobIntent.targetPosition && !data.hiddenSections.includes('jobIntent') && (
          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex justify-between text-xs text-slate-700">
            <span><strong>{getSectionTitle(data, 'jobIntent')}:</strong> {jobIntent.targetPosition}</span>
            {jobIntent.targetCity && <span>地点: {jobIntent.targetCity}</span>}
            {jobIntent.targetSalary && <span>薪资: {jobIntent.targetSalary}</span>}
          </div>
        )}

        {/* Dynamic Ordered Main Sections */}
        {order.map((key) => renderMainSection(key))}
      </div>
    </div>
  );
};
