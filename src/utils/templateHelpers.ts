import { ResumeData, ThemeConfig } from '../types';

export const DEFAULT_SECTION_TITLES: Record<string, string> = {
  jobIntent: '求职意向',
  summary: '自我评价',
  work: '工作经历',
  project: '项目经验',
  education: '教育背景',
  skills: '专业技能',
  certs: '荣誉证书与语言',
  certificates: '荣誉证书',
  languages: '语言能力',
  custom: '其他项目/亮点',
};

export const SECTION_TITLE_PRESETS: Record<string, string[]> = {
  work: ['工作经历', '实践经历', '工作/实习经历', '社会实践', '教学经历', '科研经历', '专业经历', '任职经历'],
  jobIntent: ['求职意向', '求职目标', '期望职位', '职业意向', '应聘意向', '意向岗位', '求职方向'],
  project: ['项目经验', '项目经历', '科研成果', '研发项目', '作品集/代表作', '实践项目', '课题研究'],
  education: ['教育背景', '教育经历', '学历学位', '求学经历', '学习履历', '学术背景'],
  summary: ['自我评价', '个人总结', '关于我', '个人优势', '职业素养', '核心亮点', '个人简介'],
  skills: ['专业技能', '核心技能', '技术栈', '专业特长', '技能清单', '专业能力', '技术能力'],
  certs: ['荣誉证书与语言', '资质与语言', '证书及技能', '荣誉及外语', '资质认证'],
  certificates: ['荣誉证书', '资质证书', '获奖荣誉', '资格认证', '荣誉奖项', '专业证书'],
  languages: ['语言能力', '外语水平', '语言技能', '语言与沟通', '外语专长'],
  custom: ['其他项目/亮点', '社团经历', '志愿活动', '代表成果', '个人作品', '发表论文'],
};

export const DEFAULT_SECTION_ORDER = [
  'jobIntent',
  'summary',
  'work',
  'project',
  'education',
  'skills',
  'certs',
  'custom',
];

export function getSectionTitle(data: ResumeData, sectionKey: string): string {
  if (data.sectionTitles && data.sectionTitles[sectionKey]?.trim()) {
    return data.sectionTitles[sectionKey].trim();
  }
  return DEFAULT_SECTION_TITLES[sectionKey] || sectionKey;
}

export function getDensityStyles(theme: ThemeConfig) {
  const isAutoFit = theme.autoFitA4 || theme.lineHeight === 'fill-a4' || theme.sectionSpacing === 'fill-a4';

  // Base font size
  let fontSize = '13.5px';
  let titleSize = '1.15rem';
  let subTitleSize = '0.95rem';
  let bodySize = '0.85rem';
  let metaSize = '0.75rem';

  if (theme.fontSize === 'small') {
    fontSize = '12px';
    titleSize = '1.05rem';
    subTitleSize = '0.88rem';
    bodySize = '0.78rem';
    metaSize = '0.7rem';
  } else if (theme.fontSize === 'large') {
    fontSize = '15px';
    titleSize = '1.25rem';
    subTitleSize = '1.02rem';
    bodySize = '0.92rem';
    metaSize = '0.82rem';
  }

  if (isAutoFit) {
    fontSize = '14px';
    bodySize = '0.88rem';
  }

  // Line height
  let lineHeight = 1.55;
  if (theme.lineHeight === 'compact') lineHeight = 1.35;
  else if (theme.lineHeight === 'relaxed') lineHeight = 1.75;
  else if (isAutoFit) lineHeight = 1.68;

  // Section gap (margin bottom)
  let sectionGap = '18px';
  if (theme.sectionSpacing === 'compact') sectionGap = '10px';
  else if (theme.sectionSpacing === 'relaxed') sectionGap = '26px';
  else if (isAutoFit) sectionGap = '24px';

  // Item gap (space between items inside section)
  let itemGap = '12px';
  if (theme.sectionSpacing === 'compact') itemGap = '6px';
  else if (theme.sectionSpacing === 'relaxed') itemGap = '16px';
  else if (isAutoFit) itemGap = '14px';

  // Outer container padding
  let pagePadding = '32px';
  if (theme.pagePadding === 'compact') pagePadding = '18px';
  else if (theme.pagePadding === 'relaxed') pagePadding = '42px';
  else if (isAutoFit) pagePadding = '36px';

  const fontFamily =
    theme.fontFamily === 'serif'
      ? '"Noto Serif SC", "Source Han Serif SC", "Songti SC", "SimSun", STSong, "Times New Roman", Georgia, serif'
      : theme.fontFamily === 'mono'
      ? '"Fira Code", "JetBrains Mono", "Cascadia Code", Consolas, "PingFang SC", "Noto Sans SC", monospace'
      : '"Noto Sans SC", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Plus Jakarta Sans", sans-serif';

  return {
    containerStyle: {
      fontFamily,
      fontSize,
      lineHeight,
      padding: pagePadding,
    },
    fontFamily,
    fontSize,
    lineHeight,
    sectionGap,
    itemGap,
    pagePadding,
    titleSize,
    subTitleSize,
    bodySize,
    metaSize,
    isAutoFit,
  };
}
