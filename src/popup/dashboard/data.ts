import type {
  DashboardStatus,
  EmploymentType,
  JobApplication,
  NewApplicationForm,
  Seniority,
} from './types';

export const DASHBOARD_STORAGE_KEY = 'job-tracker-demo-applications-v1';

export const INITIAL_NEW_APP: NewApplicationForm = {
  company: '',
  position: '',
  portal: 'LinkedIn',
  salaryFrom: '',
  salaryTo: '',
  currency: 'PLN',
  employmentType: 'B2B',
  salaryMode: 'net',
  workMode: 'remote',
  seniority: 'mid',
  nextStepDate: '',
  link: '',
};

export const DEFAULT_APPLICATIONS: JobApplication[] = [
  { id: 1, date: '2024-03-01', portal: 'LinkedIn', company: 'Google', position: 'Frontend Developer', salary: '18,000 - 24,000 PLN • B2B • Netto', employmentType: 'B2B', status: 'interview', link: '#', notes: 'Rekruter: Anna Nowak.' },
  { id: 2, date: '2024-03-02', portal: 'Pracuj.pl', company: 'Allegro', position: 'React Engineer', salary: '14,000 - 19,000 PLN • UoP • Brutto', employmentType: 'UoP', status: 'sent', link: '#' },
  { id: 3, date: '2024-02-28', portal: 'JustJoin.it', company: 'Netflix', position: 'Senior Web Dev', salary: '30,000 PLN • B2B • Netto', employmentType: 'B2B', status: 'rejected', link: '#' },
  { id: 4, date: '2024-02-25', portal: 'NoFluffJobs', company: 'Revolut', position: 'Software Architect', salary: '25,000 - 35,000 PLN • B2B • Netto', employmentType: 'B2B', status: 'offered', link: '#' },
  { id: 5, date: '2024-02-20', portal: 'OLX', company: 'InPost', position: 'UI Designer', salary: '10,000 - 15,000 PLN • UZ • Brutto', employmentType: 'UZ', status: 'sent', link: '#' },
];

const isStoredStatus = (value: unknown): value is DashboardStatus =>
  value === 'sent' || value === 'interview' || value === 'rejected' || value === 'offered';

const isStoredEmploymentType = (value: unknown): value is EmploymentType =>
  value === 'B2B' || value === 'UoP' || value === 'UZ' || value === 'UoD' || value === 'Internship';

const isStoredSeniority = (value: unknown): value is Seniority =>
  value === 'junior' || value === 'mid' || value === 'senior' || value === 'lead';

const isValidStoredApplication = (value: unknown): value is JobApplication => {
  if (!value || typeof value !== 'object') return false;

  const candidate = value as Partial<JobApplication>;

  return (
    typeof candidate.id === 'number' &&
    typeof candidate.date === 'string' &&
    typeof candidate.portal === 'string' &&
    typeof candidate.company === 'string' &&
    typeof candidate.position === 'string' &&
    typeof candidate.salary === 'string' &&
    typeof candidate.link === 'string' &&
    isStoredStatus(candidate.status) &&
    isStoredEmploymentType(candidate.employmentType) &&
    (candidate.seniority === undefined || isStoredSeniority(candidate.seniority))
  );
};

export const getInitialApplications = (): JobApplication[] => {
  if (typeof window === 'undefined') return DEFAULT_APPLICATIONS;

  try {
    const storedApplications = window.localStorage.getItem(DASHBOARD_STORAGE_KEY);

    if (!storedApplications) return DEFAULT_APPLICATIONS;

    const parsedApplications = JSON.parse(storedApplications);
    if (!Array.isArray(parsedApplications)) return DEFAULT_APPLICATIONS;

    const validApplications = parsedApplications.filter(isValidStoredApplication);
    return validApplications.length > 0 ? validApplications : DEFAULT_APPLICATIONS;
  } catch {
    return DEFAULT_APPLICATIONS;
  }
};
