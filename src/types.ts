export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  department?: string;
  city?: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  achievements?: string;
}

export interface ProjectExperience {
  id: string;
  projectName: string;
  role: string;
  startDate: string;
  endDate: string;
  current: boolean;
  techStack?: string;
  description: string;
  results?: string;
  projectUrl?: string;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  major: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  courses?: string;
  honors?: string;
}

export interface SkillItem {
  id: string;
  name: string;
  level: number; // 1 - 5
  category?: string;
}

export interface CertificateItem {
  id: string;
  name: string;
  date: string;
  authority?: string;
}

export interface LanguageItem {
  id: string;
  language: string;
  proficiency: string; // 如 "母语", "流利 (CET-6 620)", "商务熟练 (雅思7.5)"
}

export interface CustomSectionItem {
  id: string;
  title: string;
  subtitle?: string;
  date?: string;
  description: string;
}

export interface CustomSection {
  id: string;
  title: string;
  items: CustomSectionItem[];
}

export interface JobIntent {
  targetPosition: string;
  targetCity: string;
  targetSalary: string;
  targetIndustry: string;
  availableTime: string;
}

export interface UserProfile {
  name: string;
  title: string;
  avatar: string;
  showAvatar: boolean;
  phone: string;
  email: string;
  wechat?: string;
  location: string;
  age?: string;
  gender?: string;
  workYears?: string;
  highestDegree?: string;
  website?: string;
  github?: string;
  linkedin?: string;
  status?: string; // 如 "在职-暂不考虑", "离职-随时到岗", "应届生求职"
}

export interface ResumeData {
  profile: UserProfile;
  jobIntent: JobIntent;
  summary: string;
  workExperiences: WorkExperience[];
  projectExperiences: ProjectExperience[];
  educations: Education[];
  skills: SkillItem[];
  certificates: CertificateItem[];
  languages: LanguageItem[];
  customSections: CustomSection[];
  sectionOrder: string[]; // ['jobIntent', 'summary', 'work', 'project', 'education', 'skills', 'certificates', 'languages', 'custom']
  hiddenSections: string[];
}

export type TemplateId = 'classic' | 'modern' | 'sidebar' | 'minimal' | 'executive' | 'academic';

export type FontFamily = 'sans' | 'serif' | 'mono';
export type SpacingLevel = 'compact' | 'normal' | 'relaxed';
export type AvatarShape = 'square' | 'rounded' | 'circle';

export interface ThemeConfig {
  templateId: TemplateId;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: FontFamily;
  fontSize: 'small' | 'medium' | 'large';
  lineHeight: SpacingLevel;
  sectionSpacing: SpacingLevel;
  pagePadding: SpacingLevel;
  avatarShape: AvatarShape;
  showIcons: boolean;
  showDividers: boolean;
}

export interface AIDiagnosisResult {
  score: number;
  grade: 'S' | 'A' | 'B' | 'C';
  summary: string;
  dimensions: {
    completeness: number; // 0-100
    atsFriendliness: number;
    impactQuantification: number;
    conciseness: number;
  };
  strengths: string[];
  improvements: string[];
  typosAndPhrasing: Array<{
    original: string;
    suggestion: string;
    reason: string;
  }>;
}

export interface AIJDMatchResult {
  matchPercentage: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  keyAdvice: string[];
  recommendedPitch: string;
}
