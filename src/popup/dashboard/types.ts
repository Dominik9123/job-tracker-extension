export type DashboardStatus = 'sent' | 'interview' | 'rejected' | 'offered';
export type SalaryCurrency = 'PLN' | 'EUR' | 'USD' | 'GBP' | 'CHF';
export type EmploymentType = 'B2B' | 'UoP' | 'UZ' | 'UoD' | 'Internship';
export type SalaryMode = 'net' | 'gross';
export type WorkMode = 'remote' | 'hybrid' | 'onsite';
export type Seniority = 'junior' | 'mid' | 'senior' | 'lead';
export type BulkStatusAction = DashboardStatus | 'placeholder';
export type FilterStatus = 'all' | DashboardStatus;
export type FilterPortal = 'all' | string;
export type FilterEmployment = 'all' | EmploymentType;
export type DashboardLang = 'pl' | 'en';

export interface JobApplication {
  id: number;
  date: string;
  portal: string;
  company: string;
  position: string;
  salary: string;
  salaryFrom?: string;
  salaryTo?: string;
  currency?: SalaryCurrency;
  salaryMode?: SalaryMode;
  employmentType: EmploymentType;
  workMode?: WorkMode;
  seniority?: Seniority;
  nextStepDate?: string;
  status: DashboardStatus;
  link: string;
  notes?: string;
}

export interface DashboardProps {
  lang: DashboardLang;
  setLang: (lang: DashboardLang) => void;
  onBack: () => void;
}

export interface SelectOption<T extends string> {
  value: T;
  label: string;
}

export interface CustomSelectProps<T extends string> {
  value: T;
  options: Array<SelectOption<T>>;
  onChange: (value: T) => void;
  className?: string;
  align?: 'left' | 'right';
  getOptionClassName?: (value: T) => string;
}

export interface NewApplicationForm {
  company: string;
  position: string;
  portal: string;
  salaryFrom: string;
  salaryTo: string;
  currency: SalaryCurrency;
  employmentType: EmploymentType;
  salaryMode: SalaryMode;
  workMode: WorkMode;
  seniority: Seniority;
  nextStepDate: string;
  link: string;
}

export interface ToastState {
  id: number;
  message: string;
  tone: 'success' | 'info' | 'error';
  actionLabel?: string;
  durationMs?: number;
  onAction?: () => void;
}
