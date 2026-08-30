import React from 'react';
import { ResumeData, ThemeConfig } from '../../types';
import { 
  Mail, Phone, MapPin, Globe, Github, Linkedin, 
  Award, BookOpen, Briefcase, FolderGit2, Wrench, Languages, Sparkles, User, Target
} from 'lucide-react';

interface TemplateProps {
  data: ResumeData;
  theme: ThemeConfig;
}

export const SidebarEliteTemplate: React.FC<TemplateProps> = ({ data, theme }) => {
  const { profile, jobIntent, summary, workExperiences, projectExperiences, educations, skills, certificates, languages, customSections } = data;
  const primaryColor = theme.primaryColor || '#1e293b';

  return (
    <div 
      className="bg-white text-slate-800 max-w-[800px] mx-auto min-h-[1050px] flex flex-col md:flex-row transition-all shadow-sm"
      style={{
        fontFamily: theme.fontFamily === 'serif' ? '"Noto Serif SC", serif' : theme.fontFamily === 'mono' ? '"Fira Code", monospace' : '"Noto Sans SC", sans-serif',
        fontSize: theme.fontSize === 'small' ? '13px' : theme.fontSize === 'large' ? '15px' : '14px',
        lineHeight: theme.lineHeight === 'compact' ? 1.4 : theme.lineHeight === 'relaxed' ? 1.7 : 1.55,
      }}
    >
      {/* Left Sidebar */}
      <aside 
        className="w-full md:w-[260px] p-6 text-white shrink-0 flex flex-col justify-between"
        style={{ backgroundColor: primaryColor }}
      >
        <div className="space-y-6">
          {/* Avatar & Name */}
          <div className="text-center">
            {profile.showAvatar && profile.avatar && (
              <img 
                src={profile.avatar} 
                alt={profile.name} 
                className="w-24 h-28 mx-auto object-cover rounded-xl border-2 border-white/30 shadow-md mb-3"
              />
            )}
            <h1 className="text-xl font-bold tracking-tight text-white mb-1">{profile.name || '求职者姓名'}</h1>
            {profile.title && (
              <p className="text-xs text-slate-200 font-medium px-2 py-0.5 rounded bg-white/10 inline-block">
                {profile.title}
              </p>
            )}
          </div>

          {/* Quick Attributes */}
          <div className="bg-black/15 rounded-xl p-3 text-xs space-y-1.5 border border-white/10 text-slate-200">
            {profile.workYears && <div className="flex justify-between"><span>经验</span><strong className="text-white">{profile.workYears}</strong></div>}
            {profile.highestDegree && <div className="flex justify-between"><span>学历</span><strong className="text-white">{profile.highestDegree}</strong></div>}
            {profile.age && <div className="flex justify-between"><span>年龄</span><strong className="text-white">{profile.age}</strong></div>}
            {profile.status && <div className="flex justify-between"><span>状态</span><span className="text-emerald-300 font-semibold">{profile.status}</span></div>}
          </div>

          {/* Contact Details */}
          <div className="space-y-2.5 text-xs text-slate-200">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white/70 border-b border-white/20 pb-1 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5" /> 联系方式
            </h3>
            {profile.phone && <div className="flex items-center gap-2 break-all"><Phone className="w-3.5 h-3.5 opacity-70 shrink-0" /> {profile.phone}</div>}
            {profile.email && <div className="flex items-center gap-2 break-all"><Mail className="w-3.5 h-3.5 opacity-70 shrink-0" /> {profile.email}</div>}
            {profile.wechat && <div className="flex items-center gap-2 break-all"><span className="opacity-70 font-bold shrink-0">微</span> {profile.wechat}</div>}
            {profile.location && <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 opacity-70 shrink-0" /> {profile.location}</div>}
            {profile.github && <div className="flex items-center gap-2 break-all"><Github className="w-3.5 h-3.5 opacity-70 shrink-0" /> {profile.github}</div>}
            {profile.website && <div className="flex items-center gap-2 break-all"><Globe className="w-3.5 h-3.5 opacity-70 shrink-0" /> {profile.website}</div>}
          </div>

          {/* Education in Sidebar */}
          {educations.length > 0 && !data.hiddenSections.includes('education') && (
            <div className="space-y-2.5 text-xs text-slate-200">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white/70 border-b border-white/20 pb-1 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" /> 教育背景
              </h3>
              {educations.map((edu) => (
                <div key={edu.id} className="space-y-0.5">
                  <div className="font-bold text-white text-xs">{edu.school}</div>
                  <div className="text-slate-300">{edu.major} · {edu.degree}</div>
                  <div className="text-[11px] text-white/60 font-mono">{edu.startDate} - {edu.endDate}</div>
                  {edu.gpa && <div className="text-[11px] text-emerald-300">GPA: {edu.gpa}</div>}
                </div>
              ))}
            </div>
          )}

          {/* Skills in Sidebar */}
          {skills.length > 0 && !data.hiddenSections.includes('skills') && (
            <div className="space-y-2.5 text-xs text-slate-200">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white/70 border-b border-white/20 pb-1 flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5" /> 核心技能
              </h3>
              <div className="space-y-2">
                {skills.map((skill) => (
                  <div key={skill.id} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>{skill.name}</span>
                    </div>
                    <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-emerald-400 h-full rounded-full" 
                        style={{ width: `${(skill.level / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {languages.length > 0 && !data.hiddenSections.includes('languages') && (
            <div className="space-y-2 text-xs text-slate-200">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white/70 border-b border-white/20 pb-1 flex items-center gap-1.5">
                <Languages className="w-3.5 h-3.5" /> 语言水平
              </h3>
              {languages.map((l) => (
                <div key={l.id} className="flex justify-between text-xs">
                  <span>{l.language}</span>
                  <span className="text-slate-300">{l.proficiency}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </aside>

      {/* Right Main Flow */}
      <main className="flex-1 p-7 space-y-5">
        {/* Job Intent Bar */}
        {jobIntent.targetPosition && !data.hiddenSections.includes('jobIntent') && (
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex flex-wrap items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-slate-700" />
              <span className="font-bold text-slate-900">求职意向：</span>
              <span className="font-semibold text-slate-800">{jobIntent.targetPosition}</span>
            </div>
            <div className="flex gap-3 text-slate-600 text-xs">
              {jobIntent.targetCity && <span>{jobIntent.targetCity}</span>}
              {jobIntent.targetSalary && <span className="font-semibold text-slate-800">{jobIntent.targetSalary}</span>}
            </div>
          </div>
        )}

        {/* Summary */}
        {summary && !data.hiddenSections.includes('summary') && (
          <section className="avoid-break">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-1.5 mb-2.5">
              <Sparkles className="w-4 h-4" style={{ color: primaryColor }} />
              <h2 className="font-bold text-sm tracking-wide text-slate-900 uppercase">
                个人优势与核心概览
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
            <div className="flex items-center gap-2 border-b border-slate-200 pb-1.5 mb-3">
              <Briefcase className="w-4 h-4" style={{ color: primaryColor }} />
              <h2 className="font-bold text-sm tracking-wide text-slate-900 uppercase">
                工作履历
              </h2>
            </div>

            <div className="space-y-4">
              {workExperiences.map((w) => (
                <div key={w.id} className="text-xs sm:text-sm">
                  <div className="flex flex-wrap justify-between items-baseline gap-2 mb-1">
                    <span className="font-bold text-slate-900 text-sm">{w.company}</span>
                    <span className="font-semibold text-slate-800">{w.position}</span>
                    <span className="text-slate-500 text-xs font-mono">{w.startDate} - {w.current ? '至今' : w.endDate}</span>
                  </div>

                  {w.description && <p className="text-slate-700 mb-1 leading-relaxed">{w.description}</p>}
                  {w.achievements && (
                    <div className="text-slate-700 whitespace-pre-line leading-relaxed text-xs pl-2.5 border-l-2 border-slate-300">
                      {w.achievements}
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
            <div className="flex items-center gap-2 border-b border-slate-200 pb-1.5 mb-3">
              <FolderGit2 className="w-4 h-4" style={{ color: primaryColor }} />
              <h2 className="font-bold text-sm tracking-wide text-slate-900 uppercase">
                主要项目经历
              </h2>
            </div>

            <div className="space-y-4">
              {projectExperiences.map((p) => (
                <div key={p.id} className="text-xs sm:text-sm">
                  <div className="flex flex-wrap justify-between items-baseline gap-2 mb-1">
                    <span className="font-bold text-slate-900 text-sm">{p.projectName}</span>
                    <span className="font-medium text-slate-800">{p.role}</span>
                    <span className="text-slate-500 text-xs font-mono">{p.startDate} - {p.current ? '至今' : p.endDate}</span>
                  </div>

                  {p.techStack && (
                    <div className="text-xs text-slate-500 mb-1">
                      <strong className="text-slate-700">技术栈:</strong> {p.techStack}
                    </div>
                  )}

                  {p.description && <p className="text-slate-700 mb-1 leading-relaxed">{p.description}</p>}
                  {p.results && (
                    <div className="text-slate-700 whitespace-pre-line leading-relaxed text-xs pl-2.5 border-l-2 border-slate-300">
                      {p.results}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certificates */}
        {certificates.length > 0 && !data.hiddenSections.includes('certificates') && (
          <section className="avoid-break">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-1.5 mb-2.5">
              <Award className="w-4 h-4" style={{ color: primaryColor }} />
              <h2 className="font-bold text-sm tracking-wide text-slate-900 uppercase">
                证书与专业资质
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {certificates.map((c) => (
                <div key={c.id} className="bg-slate-50 p-2 rounded border border-slate-100 flex justify-between">
                  <span className="font-medium text-slate-800">{c.name}</span>
                  <span className="text-slate-500">{c.date}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};
