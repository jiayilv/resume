import React from 'react';
import { ResumeData, ThemeConfig } from '../../types';
import { 
  Mail, Phone, MapPin, Globe, Github, 
  Award, BookOpen, Briefcase, FolderGit2, Wrench, Languages, Sparkles, Tag
} from 'lucide-react';
import { getDensityStyles, getSectionTitle, DEFAULT_SECTION_ORDER } from '../../utils/templateHelpers';

interface TemplateProps {
  data: ResumeData;
  theme: ThemeConfig;
}

export const ClassicTemplate: React.FC<TemplateProps> = ({ data, theme }) => {
  const { profile, jobIntent, summary, workExperiences, projectExperiences, educations, skills, certificates, languages, customSections } = data;
  const primaryColor = theme.primaryColor || '#1e40af';
  const density = getDensityStyles(theme);

  const avatarRadiusClass = 
    theme.avatarShape === 'circle' ? 'rounded-full' :
    theme.avatarShape === 'rounded' ? 'rounded-xl' : 'rounded-none';

  const order = data.sectionOrder && data.sectionOrder.length > 0 ? data.sectionOrder : DEFAULT_SECTION_ORDER;

  // Render individual sections dynamically
  const renderSection = (sectionKey: string) => {
    if (data.hiddenSections.includes(sectionKey)) return null;

    switch (sectionKey) {
      case 'jobIntent':
        if (!jobIntent.targetPosition) return null;
        return (
          <div 
            key="jobIntent"
            className="bg-slate-50 border border-slate-200/80 rounded-md p-2 px-3 flex flex-wrap items-center justify-between text-xs avoid-break"
            style={{ marginBottom: density.sectionGap }}
          >
            <span className="font-semibold text-slate-700">求职意向：</span>
            <span className="font-bold text-slate-900">{jobIntent.targetPosition}</span>
            {jobIntent.targetCity && <span className="text-slate-600">期望城市: {jobIntent.targetCity}</span>}
            {jobIntent.targetSalary && <span className="text-slate-600">期望薪资: {jobIntent.targetSalary}</span>}
            {jobIntent.availableTime && <span className="text-slate-600">到岗时间: {jobIntent.availableTime}</span>}
          </div>
        );

      case 'summary':
        if (!summary) return null;
        return (
          <section key="summary" className="avoid-break" style={{ marginBottom: density.sectionGap }}>
            <div className="flex items-center gap-2 border-b pb-1 mb-2" style={{ borderColor: `${primaryColor}40` }}>
              <Sparkles className="w-4 h-4" style={{ color: primaryColor }} />
              <h2 className="font-bold text-sm tracking-wide uppercase" style={{ color: primaryColor }}>
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
            <div className="flex items-center gap-2 border-b pb-1 mb-2.5" style={{ borderColor: `${primaryColor}40` }}>
              <Briefcase className="w-4 h-4" style={{ color: primaryColor }} />
              <h2 className="font-bold text-sm tracking-wide uppercase" style={{ color: primaryColor }}>
                {getSectionTitle(data, 'work')}
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: density.itemGap }}>
              {workExperiences.map((item) => (
                <div key={item.id}>
                  <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900" style={{ fontSize: density.subTitleSize }}>{item.company}</span>
                      {item.department && <span className="text-slate-500 text-xs">({item.department})</span>}
                    </div>
                    <span className="font-semibold text-slate-800" style={{ fontSize: density.bodySize }}>{item.position}</span>
                    <span className="text-slate-500 text-xs tabular-nums">
                      {item.startDate} - {item.current ? '至今' : item.endDate}
                    </span>
                  </div>

                  {item.description && (
                    <p className="text-slate-700 mb-1 leading-relaxed" style={{ fontSize: density.bodySize }}>{item.description}</p>
                  )}

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
            <div className="flex items-center gap-2 border-b pb-1 mb-2.5" style={{ borderColor: `${primaryColor}40` }}>
              <FolderGit2 className="w-4 h-4" style={{ color: primaryColor }} />
              <h2 className="font-bold text-sm tracking-wide uppercase" style={{ color: primaryColor }}>
                {getSectionTitle(data, 'project')}
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: density.itemGap }}>
              {projectExperiences.map((proj) => (
                <div key={proj.id}>
                  <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
                    <span className="font-bold text-slate-900" style={{ fontSize: density.subTitleSize }}>{proj.projectName}</span>
                    <span className="font-medium text-slate-800" style={{ fontSize: density.bodySize }}>{proj.role}</span>
                    <span className="text-slate-500 text-xs tabular-nums">
                      {proj.startDate} - {proj.current ? '至今' : proj.endDate}
                    </span>
                  </div>

                  {proj.techStack && (
                    <div className="mb-1 text-xs text-slate-500 font-mono">
                      <span className="font-semibold text-slate-700">技术栈: </span>
                      {proj.techStack}
                    </div>
                  )}

                  {proj.description && (
                    <p className="text-slate-700 mb-1 leading-relaxed" style={{ fontSize: density.bodySize }}>{proj.description}</p>
                  )}

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

      case 'education':
        if (educations.length === 0) return null;
        return (
          <section key="education" className="avoid-break" style={{ marginBottom: density.sectionGap }}>
            <div className="flex items-center gap-2 border-b pb-1 mb-2.5" style={{ borderColor: `${primaryColor}40` }}>
              <BookOpen className="w-4 h-4" style={{ color: primaryColor }} />
              <h2 className="font-bold text-sm tracking-wide uppercase" style={{ color: primaryColor }}>
                {getSectionTitle(data, 'education')}
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: density.itemGap }}>
              {educations.map((edu) => (
                <div key={edu.id}>
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="font-bold text-slate-900" style={{ fontSize: density.subTitleSize }}>{edu.school}</span>
                    <span className="font-medium text-slate-800" style={{ fontSize: density.bodySize }}>{edu.major} · {edu.degree}</span>
                    <span className="text-slate-500 text-xs tabular-nums">{edu.startDate} - {edu.endDate}</span>
                  </div>

                  {(edu.gpa || edu.honors || edu.courses) && (
                    <div className="text-slate-600 mt-1 flex flex-wrap gap-x-4" style={{ fontSize: density.metaSize }}>
                      {edu.gpa && <span>GPA: {edu.gpa}</span>}
                      {edu.honors && <span>荣誉: {edu.honors}</span>}
                      {edu.courses && <span>主修: {edu.courses}</span>}
                    </div>
                  )}

                  {/* Custom points like CET-4, scholarships, etc. */}
                  {edu.customPoints && edu.customPoints.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {edu.customPoints.map((pt, pIdx) => (
                        <span 
                          key={pIdx}
                          className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[11px] font-medium border"
                          style={{ backgroundColor: `${primaryColor}0c`, borderColor: `${primaryColor}30`, color: primaryColor }}
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
            <div className="flex items-center gap-2 border-b pb-1 mb-2.5" style={{ borderColor: `${primaryColor}40` }}>
              <Wrench className="w-4 h-4" style={{ color: primaryColor }} />
              <h2 className="font-bold text-sm tracking-wide uppercase" style={{ color: primaryColor }}>
                {getSectionTitle(data, 'skills')}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {skills.map((skill) => (
                <div key={skill.id} className="flex items-center justify-between bg-slate-50/80 px-2.5 py-1.5 rounded border border-slate-100">
                  <span className="font-medium text-slate-800" style={{ fontSize: density.bodySize }}>{skill.name}</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span 
                        key={star} 
                        className={`w-2 h-2 rounded-full ${star <= skill.level ? 'opacity-100' : 'opacity-20'}`}
                        style={{ backgroundColor: star <= skill.level ? primaryColor : '#94a3b8' }}
                      />
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
            {certificates.length > 0 && !data.hiddenSections.includes('certificates') && (
              <section>
                <div className="flex items-center gap-2 border-b pb-1 mb-2" style={{ borderColor: `${primaryColor}40` }}>
                  <Award className="w-4 h-4" style={{ color: primaryColor }} />
                  <h2 className="font-bold text-xs tracking-wide uppercase" style={{ color: primaryColor }}>
                    {getSectionTitle(data, 'certificates')}
                  </h2>
                </div>
                <div className="space-y-1.5 text-xs text-slate-700">
                  {certificates.map((c) => (
                    <div key={c.id} className="flex justify-between">
                      <span className="font-medium">{c.name}</span>
                      <span className="text-slate-500 tabular-nums">{c.date}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {languages.length > 0 && !data.hiddenSections.includes('languages') && (
              <section>
                <div className="flex items-center gap-2 border-b pb-1 mb-2" style={{ borderColor: `${primaryColor}40` }}>
                  <Languages className="w-4 h-4" style={{ color: primaryColor }} />
                  <h2 className="font-bold text-xs tracking-wide uppercase" style={{ color: primaryColor }}>
                    {getSectionTitle(data, 'languages')}
                  </h2>
                </div>
                <div className="space-y-1.5 text-xs text-slate-700">
                  {languages.map((lang) => (
                    <div key={lang.id} className="flex justify-between">
                      <span className="font-medium">{lang.language}</span>
                      <span className="text-slate-600">{lang.proficiency}</span>
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
                  <div className="flex items-center gap-2 border-b pb-1 mb-2" style={{ borderColor: `${primaryColor}40` }}>
                    <h2 className="font-bold text-sm tracking-wide uppercase" style={{ color: primaryColor }}>
                      {sec.title}
                    </h2>
                  </div>
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
      className="bg-white text-slate-800 leading-relaxed w-full box-border transition-all"
      style={density.containerStyle}
    >
      {/* Header Profile - Protected from print hiding */}
      <header className="border-b-2 pb-5 mb-5 flex items-center justify-between gap-6" style={{ borderColor: primaryColor }}>
        <div className="flex-1">
          <div className="flex items-baseline gap-3 mb-1.5">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">{profile.name || '求职者姓名'}</h1>
            {profile.title && (
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded text-white" style={{ backgroundColor: primaryColor }}>
                {profile.title}
              </span>
            )}
          </div>

          {/* Quick tags */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600 mb-2">
            {profile.gender && <span>{profile.gender}</span>}
            {profile.age && <span>{profile.age}</span>}
            {profile.workYears && <span>{profile.workYears}</span>}
            {profile.highestDegree && <span>{profile.highestDegree}</span>}
            {profile.status && <span className="text-emerald-700 font-medium">{profile.status}</span>}
          </div>

          {/* Contact Details */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-600">
            {profile.phone && (
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5" style={{ color: primaryColor }} />
                {profile.phone}
              </span>
            )}
            {profile.email && (
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5" style={{ color: primaryColor }} />
                {profile.email}
              </span>
            )}
            {profile.wechat && (
              <span className="flex items-center gap-1">
                <span className="font-semibold" style={{ color: primaryColor }}>微信:</span>
                {profile.wechat}
              </span>
            )}
            {profile.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" style={{ color: primaryColor }} />
                {profile.location}
              </span>
            )}
            {profile.website && (
              <span className="flex items-center gap-1">
                <Globe className="w-3.5 h-3.5" style={{ color: primaryColor }} />
                {profile.website}
              </span>
            )}
            {profile.github && (
              <span className="flex items-center gap-1">
                <Github className="w-3.5 h-3.5" style={{ color: primaryColor }} />
                {profile.github}
              </span>
            )}
          </div>
        </div>

        {/* Profile Avatar - Standard 1-inch 25mm x 35mm */}
        {profile.showAvatar && (
          <div className="shrink-0" style={{ width: '25mm', height: '35mm' }}>
            {profile.avatar ? (
              <img 
                src={profile.avatar} 
                alt={profile.name} 
                className={`w-full h-full object-cover border shadow-2xs ${avatarRadiusClass}`}
                style={{ borderColor: primaryColor }}
              />
            ) : (
              <div 
                className={`w-full h-full border border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center text-slate-400 p-1 text-center select-none ${avatarRadiusClass}`}
              >
                <span className="text-[9px] font-medium text-slate-500">1寸照片</span>
                <span className="text-[7.5px] text-slate-400">25×35mm</span>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Render Main Content Ordered */}
      <div>
        {order.map((key) => renderSection(key))}
      </div>
    </div>
  );
};
