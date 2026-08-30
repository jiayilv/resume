import { ResumeData, ThemeConfig } from '../types';

export const DEFAULT_SECTION_TITLES: Record<string, string> = {
  jobIntent: '求职意向',
  summary: '自我评价', // user preferred 自我评价
  work: '工作经历',
  project: '项目经验',
  education: '教育背景',
  skills: '专业技能',
  certs: '荣誉证书与语言',
  certificates: '荣誉证书',
  languages: '语言能力',
  custom: '其他项目/亮点',
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
  if (data.sectionTitles && data.sectionTitles[sectionKey]) {
    return data.sectionTitles[sectionKey];
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
      ? '"Noto Serif SC", serif'
      : theme.fontFamily === 'mono'
      ? '"Fira Code", monospace'
      : '"Noto Sans SC", sans-serif';

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
