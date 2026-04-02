import type {
  DashboardLang,
  DashboardStatus,
  EmploymentType,
  JobApplication,
  SalaryCurrency,
  SalaryMode,
} from './types';
import { salaryModeLabels } from './labels';

export interface ModalTheme {
  color: string;
  title: string;
}

export interface SalaryBadgeData {
  amount: string;
  employmentType: EmploymentType;
  salaryModeLabel: string;
}

export const getModalTheme = (
  lang: DashboardLang,
  modalType: DashboardStatus | null,
): ModalTheme => {
  switch (modalType) {
    case 'sent':
      return {
        title: lang === 'pl' ? 'Wyslane aplikacje' : 'Sent applications',
        color: 'var(--primary-cyan)',
      };
    case 'interview':
      return {
        title: lang === 'pl' ? 'Zaplanowane rozmowy' : 'Scheduled interviews',
        color: '#ffaa00',
      };
    case 'offered':
      return {
        title: lang === 'pl' ? 'Otrzymane oferty' : 'Job offers',
        color: '#34d399',
      };
    case 'rejected':
      return {
        title: lang === 'pl' ? 'Odrzucone aplikacje' : 'Rejected applications',
        color: '#ff4d4d',
      };
    default:
      return { title: '', color: '#fff' };
  }
};

export const getReminderTone = (nextStepDate: string) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const target = new Date(nextStepDate);
  target.setHours(0, 0, 0, 0);

  if (target.getTime() < today.getTime()) return 'overdue';
  if (target.getTime() === today.getTime()) return 'today';
  return 'upcoming';
};

export const formatCardDate = (date: string, lang: DashboardLang) =>
  new Intl.DateTimeFormat(lang === 'pl' ? 'pl-PL' : 'en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date));

export const getRelativeDate = (daysFromNow: number) => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().split('T')[0];
};

export const formatSalary = (
  salaryFrom: string,
  salaryTo: string,
  currency: SalaryCurrency,
  lang: DashboardLang,
) => {
  const formatAmount = (value: string) => {
    const digitsOnly = value.replace(/[^\d]/g, '');
    if (!digitsOnly) return '';

    return new Intl.NumberFormat(lang === 'pl' ? 'pl-PL' : 'en-US').format(Number(digitsOnly));
  };

  const from = formatAmount(salaryFrom);
  const to = formatAmount(salaryTo);

  if (from && to) return `${from} - ${to} ${currency}`;
  if (from) return `${from} ${currency}`;
  if (to) return `${to} ${currency}`;
  return lang === 'pl' ? `Nie podano ${currency}` : `Not specified ${currency}`;
};

export const parseSalary = (salary: string) => {
  const [rangePart = '', employmentPart = 'B2B', modePart = 'Netto'] = salary
    .split('•')
    .map((part) => part.trim());
  const currencyMatch = rangePart.match(/\b(PLN|EUR|USD|GBP|CHF)\b/);
  const currency = (currencyMatch?.[1] as SalaryCurrency | undefined) ?? 'PLN';
  const cleanedRange = rangePart.replace(currency, '').trim();
  const [rawFrom = '', rawTo = ''] = cleanedRange
    .split('-')
    .map((part) => part.replace(/[^\d]/g, ''));

  return {
    salaryFrom: rawFrom,
    salaryTo: rawTo,
    currency,
    employmentType: (employmentPart as EmploymentType) || 'B2B',
    salaryMode:
      modePart.toLowerCase().includes('brutto') || modePart.toLowerCase().includes('gross')
        ? ('gross' as SalaryMode)
        : ('net' as SalaryMode),
  };
};

export const getDisplaySalary = (app: JobApplication, lang: DashboardLang) => {
  if (app.salaryFrom || app.salaryTo || app.currency || app.salaryMode) {
    return `${formatSalary(
      app.salaryFrom ?? '',
      app.salaryTo ?? '',
      app.currency ?? 'PLN',
      lang,
    )} • ${app.employmentType} • ${salaryModeLabels[lang][app.salaryMode ?? 'net']}`;
  }

  return app.salary;
};

export const getSalaryBadgeData = (
  app: JobApplication,
  lang: DashboardLang,
): SalaryBadgeData => {
  const parsedSalary = parseSalary(app.salary);
  const salaryFrom = app.salaryFrom ?? parsedSalary.salaryFrom;
  const salaryTo = app.salaryTo ?? parsedSalary.salaryTo;
  const currency = app.currency ?? parsedSalary.currency;
  const employmentType = app.employmentType ?? parsedSalary.employmentType;
  const salaryMode = app.salaryMode ?? parsedSalary.salaryMode;

  return {
    amount: formatSalary(salaryFrom, salaryTo, currency, lang),
    employmentType,
    salaryModeLabel: salaryModeLabels[lang][salaryMode],
  };
};

export const getNextStepDate = (app: JobApplication) => {
  if (app.nextStepDate) return app.nextStepDate;
  if (app.company === 'Google') return getRelativeDate(1);
  if (app.company === 'Revolut') return getRelativeDate(3);
  if (app.status === 'interview') return getRelativeDate(2);
  if (app.status === 'sent') return getRelativeDate(6);
  return '';
};

export const getDaysUntil = (date: string) => {
  if (!date) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const target = new Date(date);
  target.setHours(0, 0, 0, 0);

  return Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
};

export const getNextStepBadgeLabel = (app: JobApplication, lang: DashboardLang) => {
  const nextStepDate = getNextStepDate(app);
  const diff = getDaysUntil(nextStepDate);

  if (diff === null) {
    return lang === 'pl' ? 'Brak terminu' : 'No due date';
  }

  if (diff < 0) {
    return lang === 'pl' ? `${Math.abs(diff)}d po terminie` : `${Math.abs(diff)}d overdue`;
  }

  if (diff === 0) {
    return lang === 'pl' ? 'Dzisiaj' : 'Today';
  }

  return lang === 'pl' ? `Za ${diff}d` : `In ${diff}d`;
};
