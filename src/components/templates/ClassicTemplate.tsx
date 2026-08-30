import React from 'react';
import { ResumeData, ThemeConfig } from '../../types';
import { 
  Mail, Phone, MapPin, Globe, Github, Linkedin, 
  Calendar, Award, BookOpen, Briefcase, FolderGit2, Wrench, Languages, Sparkles
} from 'lucide-react';

interface TemplateProps {
  data: ResumeData;
  theme: ThemeConfig;
}

export const ClassicTemplate: React.FC<TemplateProps> = ({ data, theme }) => {
  const { profile, jobIntent, summary, workExperiences, projectExperiences, educations, skills, certificates, languages, customSections } = data;
  const primaryColor = theme.primaryColor || '#1e40af';

  const avatarRadiusClass = 
    theme.avatarShape === 'circle' ? 'rounded-full' :
    theme.avatarShape === 'rounded' ? 'rounded-xl' : 'rounded-none';

  return (
    <div 
      className="p-8 bg-white text-slate-800 leading-relaxed max-w-[800px] mx-auto transition-all"
      style={{
        fontFamily: theme.fontFamily === 'serif' ? '"Noto Serif SC", serif' : theme.fontFamily === 'mono' ? '"Fira Code", monospace' : '"Noto Sans SC", sans-serif',
        fontSize: theme.fontSize === 'small' ? '13px' : theme.fontSize === 'large' ? '15px' : '14px',
        lineHeight: theme.lineHeight === 'compact' ? 1.4 : theme.lineHeight === 'relaxed' ? 1.7 : 1.55,
      }}
    >
      {/* Header Profile */}
      <header className="border-b-2 pb-5 mb-5 flex items-center justify-between gap-6" style={{ borderColor: primaryColor }}>
        <div className="flex-1">
          <div className="flex items-baseline gap-3 mb-1.5">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">{profile.name || '求职者姓名'}</h1>
            {profile.title && (
              <span className="text-sm font-semibold px-2.5 py-0.5 rounded text-white" style={{ backgroundColor: primaryColor }}>
                {profile.title}
              </span>
            )}
          </div>

          {/* Quick tags */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 mb-2.5">
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

        {/* Profile Avatar */}
        {profile.showAvatar && profile.avatar && (
          <div className="shrink-0">
            <img 
              src={profile.avatar} 
              alt={profile.name} 
              className={`w-24 h-28 object-cover border-2 shadow-sm ${avatarRadiusClass}`}
              style={{ borderColor: primaryColor }}
            />
          </div>
        )}
      </header>

      {/* Job Intent Bar */}
      {jobIntent.targetPosition && !data.hiddenSections.includes('jobIntent') && (
        <div className="mb-5 bg-slate-50 border border-slate-200/80 rounded-md p-2.5 px-3 flex flex-wrap items-center justify-between text-xs">
          <span className="font-semibold text-slate-700">求职意向：</span>
          <span className="font-medium text-slate-900">{jobIntent.targetPosition}</span>
          {jobIntent.targetCity && <span className="text-slate-600">期望城市: {jobIntent.targetCity}</span>}
          {jobIntent.targetSalary && <span className="text-slate-600">期望薪资: {jobIntent.targetSalary}</span>}
          {jobIntent.availableTime && <span className="text-slate-600">到岗时间: {jobIntent.availableTime}</span>}
        </div>
      )}

      {/* Main Sections Ordered */}
      <div className="space-y-5">
        {/* Summary */}
        {summary && !data.hiddenSections.includes('summary') && (
          <section className="avoid-break">
            <div className="flex items-center gap-2 border-b pb-1 mb-2" style={{ borderColor: `${primaryColor}40` }}>
              <Sparkles className="w-4 h-4" style={{ color: primaryColor }} />
              <h2 className="font-bold text-sm tracking-wide uppercase" style={{ color: primaryColor }}>
                个人优势与亮点
              </h2>
            </div>
            <p className="text-slate-700 text-xs sm:text-sm leading-relaxed whitespace-pre-line text-justify">
              {summary}
            </p>
          </section>
        )}

        {/* Work Experience */}
        {workExperiences.length > 0 && !data.hiddenSections.includes('work') && (
          <section className="avoid-break">
            <div className="flex items-center gap-2 border-b pb-1 mb-3" style={{ borderColor: `${primaryColor}40` }}>
              <Briefcase className="w-4 h-4" style={{ color: primaryColor }} />
              <h2 className="font-bold text-sm tracking-wide uppercase" style={{ color: primaryColor }}>
                工作经历
              </h2>
            </div>

            <div className="space-y-4">
              {workExperiences.map((item) => (
                <div key={item.id} className="text-xs sm:text-sm">
                  <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{item.company}</span>
                      {item.department && <span className="text-slate-500 text-xs">({item.department})</span>}
                    </div>
                    <span className="font-semibold text-slate-800">{item.position}</span>
                    <span className="text-slate-500 text-xs tabular-nums">
                      {item.startDate} - {item.current ? '至今' : item.endDate}
                    </span>
                  </div>

                  {item.description && (
                    <p className="text-slate-700 mb-1.5 leading-relaxed">{item.description}</p>
                  )}

                  {item.achievements && (
                    <div className="text-slate-700 whitespace-pre-line leading-relaxed text-xs pl-2 border-l-2 border-slate-200">
                      {item.achievements}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Project Experience */}
        {projectExperiences.length > 0 && !data.hiddenSections.includes('project') && (
          <section className="avoid-break">
            <div className="flex items-center gap-2 border-b pb-1 mb-3" style={{ borderColor: `${primaryColor}40` }}>
              <FolderGit2 className="w-4 h-4" style={{ color: primaryColor }} />
              <h2 className="font-bold text-sm tracking-wide uppercase" style={{ color: primaryColor }}>
                项目经验
              </h2>
            </div>

            <div className="space-y-4">
              {projectExperiences.map((proj) => (
                <div key={proj.id} className="text-xs sm:text-sm">
                  <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
                    <span className="font-bold text-slate-900 text-sm">{proj.projectName}</span>
                    <span className="font-medium text-slate-800">{proj.role}</span>
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
                    <p className="text-slate-700 mb-1 leading-relaxed">{proj.description}</p>
                  )}

                  {proj.results && (
                    <div className="text-slate-700 whitespace-pre-line leading-relaxed text-xs pl-2 border-l-2 border-slate-200">
                      {proj.results}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {educations.length > 0 && !data.hiddenSections.includes('education') && (
          <section className="avoid-break">
            <div className="flex items-center gap-2 border-b pb-1 mb-3" style={{ borderColor: `${primaryColor}40` }}>
              <BookOpen className="w-4 h-4" style={{ color: primaryColor }} />
              <h2 className="font-bold text-sm tracking-wide uppercase" style={{ color: primaryColor }}>
                教育背景
              </h2>
            </div>

            <div className="space-y-2.5">
              {educations.map((edu) => (
                <div key={edu.id} className="text-xs sm:text-sm">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="font-bold text-slate-900">{edu.school}</span>
                    <span className="font-medium text-slate-800">{edu.major} · {edu.degree}</span>
                    <span className="text-slate-500 text-xs tabular-nums">{edu.startDate} - {edu.endDate}</span>
                  </div>
                  {(edu.gpa || edu.honors || edu.courses) && (
                    <div className="text-xs text-slate-600 mt-1 flex flex-wrap gap-x-4">
                      {edu.gpa && <span>GPA: {edu.gpa}</span>}
                      {edu.honors && <span>荣誉: {edu.honors}</span>}
                      {edu.courses && <span>主修: {edu.courses}</span>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Professional Skills */}
        {skills.length > 0 && !data.hiddenSections.includes('skills') && (
          <section className="avoid-break">
            <div className="flex items-center gap-2 border-b pb-1 mb-2.5" style={{ borderColor: `${primaryColor}40` }}>
              <Wrench className="w-4 h-4" style={{ color: primaryColor }} />
              <h2 className="font-bold text-sm tracking-wide uppercase" style={{ color: primaryColor }}>
                专业技能
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {skills.map((skill) => (
                <div key={skill.id} className="flex items-center justify-between bg-slate-50/80 px-2.5 py-1.5 rounded border border-slate-100">
                  <span className="font-medium text-slate-800">{skill.name}</span>
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
        )}

        {/* Certificates & Languages */}
        {((certificates.length > 0 && !data.hiddenSections.includes('certificates')) || 
          (languages.length > 0 && !data.hiddenSections.includes('languages'))) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 avoid-break">
            {certificates.length > 0 && !data.hiddenSections.includes('certificates') && (
              <section>
                <div className="flex items-center gap-2 border-b pb-1 mb-2" style={{ borderColor: `${primaryColor}40` }}>
                  <Award className="w-4 h-4" style={{ color: primaryColor }} />
                  <h2 className="font-bold text-xs tracking-wide uppercase" style={{ color: primaryColor }}>
                    资格证书 & 荣誉
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
                    语言能力
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
        )}

        {/* Custom Sections */}
        {customSections && customSections.map((sec) => (
          !data.hiddenSections.includes(sec.id) && (
            <section key={sec.id} className="avoid-break">
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
    </div>
  );
};
