import type {
  BulkStatusAction,
  DashboardLang,
  DashboardStatus,
  EmploymentType,
  SalaryMode,
  Seniority,
  WorkMode,
} from './types';

export const statusLabels: Record<
  DashboardLang,
  Record<DashboardStatus | 'all' | 'total', string>
> = {
  pl: {
    sent: 'WYSLANE',
    interview: 'ROZMOWA',
    offered: 'OFERTA',
    rejected: 'ODRZUCONE',
    all: 'Wszystkie statusy',
    total: 'Suma ofert',
  },
  en: {
    sent: 'SENT',
    interview: 'INTERVIEW',
    offered: 'OFFERED',
    rejected: 'REJECTED',
    all: 'All statuses',
    total: 'Total Jobs',
  },
};

export const employmentLabels: Record<DashboardLang, Record<EmploymentType, string>> = {
  pl: {
    B2B: 'B2B',
    UoP: 'UoP',
    UZ: 'Umowa zlecenie',
    UoD: 'Umowa o dzielo',
    Internship: 'Staz',
  },
  en: {
    B2B: 'B2B',
    UoP: 'Employment',
    UZ: 'Mandate',
    UoD: 'Contract work',
    Internship: 'Internship',
  },
};

export const salaryModeLabels: Record<DashboardLang, Record<SalaryMode, string>> = {
  pl: {
    net: 'Netto',
    gross: 'Brutto',
  },
  en: {
    net: 'Net',
    gross: 'Gross',
  },
};

export const workModeLabels: Record<DashboardLang, Record<WorkMode, string>> = {
  pl: {
    remote: 'Remote',
    hybrid: 'Hybrid',
    onsite: 'Onsite',
  },
  en: {
    remote: 'Remote',
    hybrid: 'Hybrid',
    onsite: 'Onsite',
  },
};

export const seniorityLabels: Record<DashboardLang, Record<Seniority, string>> = {
  pl: {
    junior: 'Junior',
    mid: 'Mid',
    senior: 'Senior',
    lead: 'Lead',
  },
  en: {
    junior: 'Junior',
    mid: 'Mid',
    senior: 'Senior',
    lead: 'Lead',
  },
};

export const getStatusOptionClassName = (value: DashboardStatus | 'all') => {
  if (value === 'sent') return 'status-option-sent';
  if (value === 'interview') return 'status-option-interview';
  if (value === 'offered') return 'status-option-offered';
  if (value === 'rejected') return 'status-option-rejected';
  return 'status-option-all';
};

export const getBulkStatusOptionClassName = (value: BulkStatusAction) => {
  if (value === 'placeholder') return 'status-option-all';
  return getStatusOptionClassName(value);
};
