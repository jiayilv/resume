import React from 'react';
import { ResumeData, ThemeConfig } from '../../types';
import { 
  Mail, Phone, MapPin, Globe, Github, Linkedin, 
  Award, BookOpen, Briefcase, FolderGit2, Wrench, Languages, Sparkles, CheckCircle2, ChevronRight
} from 'lucide-react';

interface TemplateProps {
  data: ResumeData;
  theme: ThemeConfig;
}

export const ModernTechTemplate: React.FC<TemplateProps> = ({ data, theme }) => {
  const { profile, jobIntent, summary, workExperiences, projectExperiences, educations, skills, certificates, languages, customSections } = data;
  const primaryColor = theme.primaryColor || '#0284c7';

  const avatarRadiusClass = 
    theme.avatarShape === 'circle' ? 'rounded-full' :
    theme.avatarShape === 'rounded' ? 'rounded-2xl' : 'rounded-lg';

  return (
    <div 
      className="p-8 bg-white text-slate-800 max-w-[800px] mx-auto transition-all"
      style={{
        fontFamily: theme.fontFamily === 'serif' ? '"Noto Serif SC", serif' : theme.fontFamily === 'mono' ? '"Fira Code", monospace' : '"Noto Sans SC", sans-serif',
        fontSize: theme.fontSize === 'small' ? '13px' : theme.fontSize === 'large' ? '15px' : '14px',
        lineHeight: theme.lineHeight === 'compact' ? 1.4 : theme.lineHeight === 'relaxed' ? 1.7 : 1.55,
      }}
    >
      {/* Modern Banner Profile */}
      <header className="relative bg-slate-900 text-white rounded-2xl p-6 mb-6 overflow-hidden shadow-sm">
        <div 
          className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ backgroundColor: primaryColor }}
        />
        
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="flex-1">
            <div className="flex flex-wrap items-baseline gap-3 mb-1.5">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">{profile.name || '求职者姓名'}</h1>
              {profile.title && (
                <span 
                  className="text-xs font-semibold px-2.5 py-1 rounded-full text-white tracking-wide"
                  style={{ backgroundColor: primaryColor }}
                >
                  {profile.title}
                </span>
              )}
            </div>

            {/* Sub attributes */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-300 mb-3">
              {profile.gender && <span>{profile.gender}</span>}
              {profile.age && <span>{profile.age}</span>}
              {profile.workYears && <span>{profile.workYears}</span>}
              {profile.highestDegree && <span>{profile.highestDegree}</span>}
              {profile.status && (
                <span className="text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded text-[11px] border border-emerald-800/60">
                  {profile.status}
                </span>
              )}
            </div>

            {/* Contact Pills */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
              {profile.phone && (
                <span className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
                  <Phone className="w-3 h-3" style={{ color: primaryColor }} />
                  {profile.phone}
                </span>
              )}
              {profile.email && (
                <span className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
                  <Mail className="w-3 h-3" style={{ color: primaryColor }} />
                  {profile.email}
                </span>
              )}
              {profile.wechat && (
                <span className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
                  <span className="font-semibold text-emerald-400">微</span>
                  {profile.wechat}
                </span>
              )}
              {profile.location && (
                <span className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
                  <MapPin className="w-3 h-3" style={{ color: primaryColor }} />
                  {profile.location}
                </span>
              )}
              {profile.github && (
                <span className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
                  <Github className="w-3 h-3" style={{ color: primaryColor }} />
                  {profile.github}
                </span>
              )}
            </div>
          </div>

          {profile.showAvatar && profile.avatar && (
            <div className="shrink-0">
              <img 
                src={profile.avatar} 
                alt={profile.name} 
                className={`w-24 h-28 object-cover border-2 border-slate-700 shadow-md ${avatarRadiusClass}`}
              />
            </div>
          )}
        </div>
      </header>

      {/* Target Job Intent */}
      {jobIntent.targetPosition && !data.hiddenSections.includes('jobIntent') && (
        <div 
          className="mb-6 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs border"
          style={{ backgroundColor: `${primaryColor}08`, borderColor: `${primaryColor}25` }}
        >
          <div className="flex items-center gap-2">
            <span className="font-bold px-2 py-0.5 rounded text-white text-[11px]" style={{ backgroundColor: primaryColor }}>
              求职意向
            </span>
            <span className="font-bold text-slate-900 text-sm">{jobIntent.targetPosition}</span>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-slate-600">
            {jobIntent.targetCity && <span>期望城市: <strong className="text-slate-800">{jobIntent.targetCity}</strong></span>}
            {jobIntent.targetSalary && <span>期望薪资: <strong className="text-slate-800">{jobIntent.targetSalary}</strong></span>}
            {jobIntent.availableTime && <span>到岗时间: <strong className="text-slate-800">{jobIntent.availableTime}</strong></span>}
          </div>
        </div>
      )}

      {/* Content Stream */}
      <div className="space-y-6">
        {/* Summary */}
        {summary && !data.hiddenSections.includes('summary') && (
          <section className="avoid-break">
            <div className="flex items-center gap-2 mb-2.5">
              <span className="p-1 rounded-md text-white" style={{ backgroundColor: primaryColor }}>
                <Sparkles className="w-3.5 h-3.5" />
              </span>
              <h2 className="font-bold text-sm text-slate-900 tracking-tight">核心竞争力与个人优势</h2>
            </div>
            <div className="bg-slate-50/70 border border-slate-200/70 rounded-xl p-3.5 text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line text-justify">
              {summary}
            </div>
          </section>
        )}

        {/* Work Experiences */}
        {workExperiences.length > 0 && !data.hiddenSections.includes('work') && (
          <section className="avoid-break">
            <div className="flex items-center gap-2 mb-4">
              <span className="p-1 rounded-md text-white" style={{ backgroundColor: primaryColor }}>
                <Briefcase className="w-3.5 h-3.5" />
              </span>
              <h2 className="font-bold text-sm text-slate-900 tracking-tight">工作履历</h2>
            </div>

            <div className="relative pl-5 border-l-2 space-y-5" style={{ borderColor: `${primaryColor}30` }}>
              {workExperiences.map((item) => (
                <div key={item.id} className="relative text-xs sm:text-sm">
                  {/* Timeline bullet */}
                  <span 
                    className="absolute -left-[27px] top-1 w-3.5 h-3.5 rounded-full border-2 border-white"
                    style={{ backgroundColor: primaryColor }}
                  />

                  <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{item.company}</span>
                      {item.department && <span className="text-slate-500 text-xs font-normal">· {item.department}</span>}
                    </div>
                    <span className="font-semibold text-slate-800">{item.position}</span>
                    <span className="text-slate-500 text-xs font-mono bg-slate-100 px-2 py-0.5 rounded">
                      {item.startDate} - {item.current ? '至今' : item.endDate}
                    </span>
                  </div>

                  {item.description && (
                    <p className="text-slate-700 mb-2 leading-relaxed">{item.description}</p>
                  )}

                  {item.achievements && (
                    <div 
                      className="text-slate-700 whitespace-pre-line leading-relaxed text-xs p-3 rounded-lg border"
                      style={{ backgroundColor: `${primaryColor}05`, borderColor: `${primaryColor}15` }}
                    >
                      {item.achievements}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Project Experiences */}
        {projectExperiences.length > 0 && !data.hiddenSections.includes('project') && (
          <section className="avoid-break">
            <div className="flex items-center gap-2 mb-4">
              <span className="p-1 rounded-md text-white" style={{ backgroundColor: primaryColor }}>
                <FolderGit2 className="w-3.5 h-3.5" />
              </span>
              <h2 className="font-bold text-sm text-slate-900 tracking-tight">项目经验</h2>
            </div>

            <div className="relative pl-5 border-l-2 space-y-5" style={{ borderColor: `${primaryColor}30` }}>
              {projectExperiences.map((proj) => (
                <div key={proj.id} className="relative text-xs sm:text-sm">
                  <span 
                    className="absolute -left-[27px] top-1 w-3.5 h-3.5 rounded-full border-2 border-white"
                    style={{ backgroundColor: primaryColor }}
                  />

                  <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
                    <span className="font-bold text-slate-900 text-sm">{proj.projectName}</span>
                    <span className="font-medium text-slate-800">{proj.role}</span>
                    <span className="text-slate-500 text-xs font-mono bg-slate-100 px-2 py-0.5 rounded">
                      {proj.startDate} - {proj.current ? '至今' : proj.endDate}
                    </span>
                  </div>

                  {proj.techStack && (
                    <div className="mb-1.5 flex flex-wrap items-center gap-1.5 text-xs">
                      <span className="font-semibold text-slate-500">Tech Stack:</span>
                      <span className="font-mono text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[11px] border border-slate-200">
                        {proj.techStack}
                      </span>
                    </div>
                  )}

                  {proj.description && (
                    <p className="text-slate-700 mb-1.5 leading-relaxed">{proj.description}</p>
                  )}

                  {proj.results && (
                    <div 
                      className="text-slate-700 whitespace-pre-line leading-relaxed text-xs p-3 rounded-lg border"
                      style={{ backgroundColor: `${primaryColor}05`, borderColor: `${primaryColor}15` }}
                    >
                      {proj.results}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education & Skills Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 avoid-break">
          {/* Education */}
          {educations.length > 0 && !data.hiddenSections.includes('education') && (
            <section>
              <div className="flex items-center gap-2 mb-3">
                <span className="p-1 rounded-md text-white" style={{ backgroundColor: primaryColor }}>
                  <BookOpen className="w-3.5 h-3.5" />
                </span>
                <h2 className="font-bold text-sm text-slate-900 tracking-tight">教育背景</h2>
              </div>
              <div className="space-y-3">
                {educations.map((edu) => (
                  <div key={edu.id} className="bg-slate-50/80 border border-slate-200/60 rounded-xl p-3 text-xs">
                    <div className="flex justify-between font-bold text-slate-900">
                      <span>{edu.school}</span>
                      <span className="font-mono text-slate-500 font-normal">{edu.startDate} - {edu.endDate}</span>
                    </div>
                    <div className="text-slate-700 font-medium mt-0.5">{edu.major} · {edu.degree}</div>
                    {(edu.gpa || edu.honors) && (
                      <div className="text-slate-500 mt-1 text-[11px]">
                        {edu.gpa && <span>GPA: {edu.gpa} </span>}
                        {edu.honors && <span>· 荣誉: {edu.honors}</span>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Skills */}
          {skills.length > 0 && !data.hiddenSections.includes('skills') && (
            <section>
              <div className="flex items-center gap-2 mb-3">
                <span className="p-1 rounded-md text-white" style={{ backgroundColor: primaryColor }}>
                  <Wrench className="w-3.5 h-3.5" />
                </span>
                <h2 className="font-bold text-sm text-slate-900 tracking-tight">专业技能栈</h2>
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                {skills.map((skill) => (
                  <div 
                    key={skill.id} 
                    className="flex items-center gap-2 px-2.5 py-1 rounded-lg border text-xs font-medium"
                    style={{ backgroundColor: `${primaryColor}08`, borderColor: `${primaryColor}20` }}
                  >
                    <span className="text-slate-800">{skill.name}</span>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: primaryColor }} />
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Certificates & Languages */}
        {((certificates.length > 0 && !data.hiddenSections.includes('certificates')) || 
          (languages.length > 0 && !data.hiddenSections.includes('languages'))) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 avoid-break pt-2 border-t border-slate-100">
            {certificates.length > 0 && !data.hiddenSections.includes('certificates') && (
              <div className="text-xs">
                <div className="font-bold text-slate-900 mb-1.5 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5" style={{ color: primaryColor }} />
                  荣誉证书
                </div>
                <div className="space-y-1 text-slate-700">
                  {certificates.map((c) => (
                    <div key={c.id} className="flex justify-between">
                      <span>{c.name}</span>
                      <span className="text-slate-500 font-mono">{c.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {languages.length > 0 && !data.hiddenSections.includes('languages') && (
              <div className="text-xs">
                <div className="font-bold text-slate-900 mb-1.5 flex items-center gap-1.5">
                  <Languages className="w-3.5 h-3.5" style={{ color: primaryColor }} />
                  语言能力
                </div>
                <div className="space-y-1 text-slate-700">
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
        )}
      </div>
    </div>
  );
};
