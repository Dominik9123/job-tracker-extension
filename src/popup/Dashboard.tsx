import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import './Dashboard.css';
import { CustomSelect } from './dashboard/components/CustomSelect';
import { DASHBOARD_STORAGE_KEY, INITIAL_NEW_APP, getInitialApplications } from './dashboard/data';
import {
  getPortalIcon,
  getSeniority,
  getWorkMode,
  sanitizeAmountInput,
  shouldCloseOverlay,
} from './dashboard/utils';
import type {
  BulkStatusAction,
  DashboardLang,
  DashboardProps,
  DashboardStatus,
  EmploymentType,
  FilterEmployment,
  FilterPortal,
  FilterStatus,
  JobApplication,
  NewApplicationForm,
  SalaryCurrency,
  SalaryMode,
  Seniority,
  SelectOption,
  ToastState,
  WorkMode,
} from './dashboard/types';
const Dashboard: React.FC<DashboardProps> = ({ lang, setLang, onBack }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [activeNoteId, setActiveNoteId] = useState<number | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isHintActive, setIsHintActive] = useState(false);
  const [modalType, setModalType] = useState<DashboardStatus | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [portalFilter, setPortalFilter] = useState<FilterPortal>('all');
  const [employmentFilter, setEmploymentFilter] = useState<FilterEmployment>('all');
  const [sortBy] = useState<'date' | 'company' | 'portal'>('date');
  const [formError, setFormError] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [pendingDeleteApps, setPendingDeleteApps] = useState<JobApplication[] | null>(null);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [bulkStatusValue, setBulkStatusValue] = useState<BulkStatusAction>('placeholder');

  const dropdownRef = useRef<HTMLDivElement>(null);
  const addFormRef = useRef<HTMLFormElement>(null);
  const notesModalRef = useRef<HTMLDivElement>(null);
  const confirmModalRef = useRef<HTMLDivElement>(null);
  const statusModalRef = useRef<HTMLDivElement>(null);

  const [applications, setApplications] = useState<JobApplication[]>(getInitialApplications);

  const [newApp, setNewApp] = useState<NewApplicationForm>(INITIAL_NEW_APP);

  const statusLabels: Record<DashboardLang, Record<DashboardStatus | 'all' | 'total', string>> = {
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

  const employmentLabels: Record<DashboardLang, Record<EmploymentType, string>> = {
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

  const salaryModeLabels: Record<DashboardLang, Record<SalaryMode, string>> = {
    pl: {
      net: 'Netto',
      gross: 'Brutto',
    },
    en: {
      net: 'Net',
      gross: 'Gross',
    },
  };

  const workModeLabels: Record<DashboardLang, Record<WorkMode, string>> = {
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

  const seniorityLabels: Record<DashboardLang, Record<Seniority, string>> = {
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

  const statusFilterOptions: Array<SelectOption<FilterStatus>> = [
    { value: 'all', label: statusLabels[lang].all },
    { value: 'sent', label: statusLabels[lang].sent },
    { value: 'interview', label: statusLabels[lang].interview },
    { value: 'offered', label: statusLabels[lang].offered },
    { value: 'rejected', label: statusLabels[lang].rejected },
  ];

  const portalFilterOptions: Array<SelectOption<FilterPortal>> = [
    { value: 'all', label: lang === 'pl' ? 'Wszystkie portale' : 'All portals' },
    { value: 'LinkedIn', label: 'LinkedIn' },
    { value: 'Pracuj.pl', label: 'Pracuj.pl' },
    { value: 'OLX', label: 'OLX' },
    { value: 'JustJoin.it', label: 'JustJoin.it' },
    { value: 'NoFluffJobs', label: 'NoFluffJobs' },
  ];

  const employmentFilterOptions: Array<SelectOption<FilterEmployment>> = [
    { value: 'all', label: lang === 'pl' ? 'Wszystkie umowy' : 'All contracts' },
    { value: 'B2B', label: employmentLabels[lang].B2B },
    { value: 'UoP', label: employmentLabels[lang].UoP },
    { value: 'UZ', label: employmentLabels[lang].UZ },
    { value: 'UoD', label: employmentLabels[lang].UoD },
    { value: 'Internship', label: employmentLabels[lang].Internship },
  ];

  const portalOptions: Array<SelectOption<string>> = [
    { value: 'LinkedIn', label: 'LinkedIn' },
    { value: 'Pracuj.pl', label: 'Pracuj.pl' },
    { value: 'OLX', label: 'OLX' },
    { value: 'JustJoin.it', label: 'JustJoin.it' },
    { value: 'NoFluffJobs', label: 'NoFluffJobs' },
  ];

  const currencyOptions: Array<SelectOption<SalaryCurrency>> = [
    { value: 'PLN', label: 'PLN' },
    { value: 'EUR', label: 'EUR' },
    { value: 'USD', label: 'USD' },
    { value: 'GBP', label: 'GBP' },
    { value: 'CHF', label: 'CHF' },
  ];

  const employmentOptions: Array<SelectOption<EmploymentType>> = [
    { value: 'B2B', label: employmentLabels[lang].B2B },
    { value: 'UoP', label: employmentLabels[lang].UoP },
    { value: 'UZ', label: employmentLabels[lang].UZ },
    { value: 'UoD', label: employmentLabels[lang].UoD },
    { value: 'Internship', label: employmentLabels[lang].Internship },
  ];

  const salaryModeOptions: Array<SelectOption<SalaryMode>> = [
    { value: 'net', label: salaryModeLabels[lang].net },
    { value: 'gross', label: salaryModeLabels[lang].gross },
  ];

  const workModeOptions: Array<SelectOption<WorkMode>> = [
    { value: 'remote', label: workModeLabels[lang].remote },
    { value: 'hybrid', label: workModeLabels[lang].hybrid },
    { value: 'onsite', label: workModeLabels[lang].onsite },
  ];

  const seniorityOptions: Array<SelectOption<Seniority>> = [
    { value: 'junior', label: seniorityLabels[lang].junior },
    { value: 'mid', label: seniorityLabels[lang].mid },
    { value: 'senior', label: seniorityLabels[lang].senior },
    { value: 'lead', label: seniorityLabels[lang].lead },
  ];

  const getStatusOptionClassName = (value: FilterStatus | DashboardStatus) => {
    if (value === 'sent') return 'status-option-sent';
    if (value === 'interview') return 'status-option-interview';
    if (value === 'offered') return 'status-option-offered';
    if (value === 'rejected') return 'status-option-rejected';
    return 'status-option-all';
  };

  const getBulkStatusOptionClassName = (value: BulkStatusAction) => {
    if (value === 'placeholder') return 'status-option-all';
    return getStatusOptionClassName(value);
  };

  const cardStatusOptions: Array<SelectOption<DashboardStatus>> = [
    { value: 'sent', label: statusLabels[lang].sent },
    { value: 'interview', label: statusLabels[lang].interview },
    { value: 'offered', label: statusLabels[lang].offered },
    { value: 'rejected', label: statusLabels[lang].rejected },
  ];

  const bulkStatusOptions: Array<SelectOption<BulkStatusAction>> = [
    { value: 'placeholder', label: lang === 'pl' ? 'Zmien status zaznaczonych' : 'Change selected status' },
    ...cardStatusOptions,
  ];

  const stats = useMemo(
    () => ({
      total: applications.length,
      sent: applications.filter((app) => app.status === 'sent').length,
      interviews: applications.filter((app) => app.status === 'interview').length,
      offered: applications.filter((app) => app.status === 'offered').length,
      rejected: applications.filter((app) => app.status === 'rejected').length,
    }),
    [applications],
  );

  const filteredAndSortedApps = useMemo(() => {
    return applications
      .filter((app) => {
        const query = searchTerm.toLowerCase();
        const matchesSearch =
          app.company.toLowerCase().includes(query) ||
          app.position.toLowerCase().includes(query);
        const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
        const matchesPortal = portalFilter === 'all' || app.portal === portalFilter;
        const matchesEmployment = employmentFilter === 'all' || app.employmentType === employmentFilter;

        return matchesSearch && matchesStatus && matchesPortal && matchesEmployment;
      })
      .sort((a, b) => {
        if (sortBy === 'date') return new Date(b.date).getTime() - new Date(a.date).getTime();
        if (sortBy === 'portal') return a.portal.localeCompare(b.portal);
        return a.company.localeCompare(b.company);
      });
  }, [applications, employmentFilter, portalFilter, searchTerm, sortBy, statusFilter]);

  const filteredModalJobs = useMemo(() => {
    if (!modalType) return [];
    return applications.filter((app) => app.status === modalType);
  }, [applications, modalType]);

  const activeNoteApp = useMemo(() => {
    if (activeNoteId === null) return null;
    return applications.find((app) => app.id === activeNoteId) ?? null;
  }, [activeNoteId, applications]);

  const selectedApplications = useMemo(
    () => applications.filter((app) => selectedIds.includes(app.id)),
    [applications, selectedIds],
  );

  const visibleSelectedCount = useMemo(
    () => filteredAndSortedApps.filter((app) => selectedIds.includes(app.id)).length,
    [filteredAndSortedApps, selectedIds],
  );

  const getModalTheme = () => {
    switch (modalType) {
      case 'sent':
        return { title: lang === 'pl' ? 'Wyslane aplikacje' : 'Sent applications', color: 'var(--primary-cyan)' };
      case 'interview':
        return { title: lang === 'pl' ? 'Zaplanowane rozmowy' : 'Scheduled interviews', color: '#ffaa00' };
      case 'offered':
        return { title: lang === 'pl' ? 'Otrzymane oferty' : 'Job offers', color: '#34d399' };
      case 'rejected':
        return { title: lang === 'pl' ? 'Odrzucone aplikacje' : 'Rejected applications', color: '#ff4d4d' };
      default:
        return { title: '', color: '#fff' };
    }
  };

  const getReminderTone = (nextStepDate: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const target = new Date(nextStepDate);
    target.setHours(0, 0, 0, 0);

    if (target.getTime() < today.getTime()) return 'overdue';
    if (target.getTime() === today.getTime()) return 'today';
    return 'upcoming';
  };

  const formatCardDate = (date: string) =>
    new Intl.DateTimeFormat(lang === 'pl' ? 'pl-PL' : 'en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(new Date(date));

  const getRelativeDate = (daysFromNow: number) => {
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    return date.toISOString().split('T')[0];
  };

  const formatSalary = (salaryFrom: string, salaryTo: string, currency: SalaryCurrency) => {
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

  const parseSalary = (salary: string) => {
    const [rangePart = '', employmentPart = 'B2B', modePart = 'Netto'] = salary.split('•').map((part) => part.trim());
    const currencyMatch = rangePart.match(/\b(PLN|EUR|USD|GBP|CHF)\b/);
    const currency = (currencyMatch?.[1] as SalaryCurrency | undefined) ?? 'PLN';
    const cleanedRange = rangePart.replace(currency, '').trim();
    const [rawFrom = '', rawTo = ''] = cleanedRange.split('-').map((part) => part.replace(/[^\d]/g, ''));

    return {
      salaryFrom: rawFrom,
      salaryTo: rawTo,
      currency,
      employmentType: (employmentPart as EmploymentType) || 'B2B',
      salaryMode: modePart.toLowerCase().includes('brutto') || modePart.toLowerCase().includes('gross') ? 'gross' as SalaryMode : 'net' as SalaryMode,
    };
  };

  const getDisplaySalary = (app: JobApplication) => {
    if (app.salaryFrom || app.salaryTo || app.currency || app.salaryMode) {
      return `${formatSalary(app.salaryFrom ?? '', app.salaryTo ?? '', app.currency ?? 'PLN')} • ${app.employmentType} • ${salaryModeLabels[lang][app.salaryMode ?? 'net']}`;
    }

    return app.salary;
  };

  const getSalaryBadgeData = (targetApp: JobApplication) => {
    const parsedSalary = parseSalary(targetApp.salary);
    const salaryFrom = targetApp.salaryFrom ?? parsedSalary.salaryFrom;
    const salaryTo = targetApp.salaryTo ?? parsedSalary.salaryTo;
    const currency = targetApp.currency ?? parsedSalary.currency;
    const employmentType = targetApp.employmentType ?? parsedSalary.employmentType;
    const salaryMode = targetApp.salaryMode ?? parsedSalary.salaryMode;

    return {
      amount: formatSalary(salaryFrom, salaryTo, currency),
      employmentType,
      salaryModeLabel: salaryModeLabels[lang][salaryMode],
    };
  };

  const getNextStepDate = (app: JobApplication) => {
    if (app.nextStepDate) return app.nextStepDate;
    if (app.company === 'Google') return getRelativeDate(1);
    if (app.company === 'Revolut') return getRelativeDate(3);
    if (app.status === 'interview') return getRelativeDate(2);
    if (app.status === 'sent') return getRelativeDate(6);
    return '';
  };

  const getDaysUntil = (date: string) => {
    if (!date) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const target = new Date(date);
    target.setHours(0, 0, 0, 0);

    return Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  };

  const getNextStepBadgeLabel = (app: JobApplication) => {
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

  const getNotesPlaceholder = () =>
    lang === 'pl'
      ? 'Dodaj notatki po rozmowie, dane rekrutera lub kolejne kroki...'
      : 'Add interview notes, recruiter details or next steps...';

  const getNoteTemplates = (app: JobApplication) => {
    const today = new Intl.DateTimeFormat(lang === 'pl' ? 'pl-PL' : 'en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(new Date());

    return [
      {
        label: lang === 'pl' ? 'Rekruter' : 'Recruiter',
        text:
          lang === 'pl'
            ? `[${today}] Kontakt z rekruterem (${app.company})\n- Imie:\n- Ustalenia:\n`
            : `[${today}] Recruiter contact (${app.company})\n- Name:\n- Notes:\n`,
      },
      {
        label: lang === 'pl' ? 'Rozmowa' : 'Interview',
        text:
          lang === 'pl'
            ? `[${today}] Notatki po rozmowie\n- Pytania:\n- Feedback:\n`
            : `[${today}] Interview notes\n- Questions:\n- Feedback:\n`,
      },
      {
        label: lang === 'pl' ? 'Follow-up' : 'Follow-up',
        text:
          lang === 'pl'
            ? `[${today}] Kolejny krok\n- Termin:\n- Co przygotowac:\n`
            : `[${today}] Next step\n- Due date:\n- Prepare:\n`,
      },
    ];
  };

  const upcomingReminders = useMemo(() => {
    return applications
      .filter((app) => getNextStepDate(app))
      .sort((a, b) => new Date(getNextStepDate(a)).getTime() - new Date(getNextStepDate(b)).getTime())
      .slice(0, 3);
  }, [applications]);

  const resetForm = () => {
    setNewApp(INITIAL_NEW_APP);
    setEditingId(null);
    setFormError('');
  };

  const showToast = (
    message: string,
    tone: ToastState['tone'] = 'info',
    options?: Omit<Partial<ToastState>, 'id' | 'message' | 'tone'>,
  ) => {
    setToast({
      id: Date.now(),
      message,
      tone,
      actionLabel: options?.actionLabel,
      durationMs: options?.durationMs,
      onAction: options?.onAction,
    });
  };

  const openFreshApplicationForm = () => {
    setNewApp(INITIAL_NEW_APP);
    setEditingId(null);
    setFormError('');
    setIsFormOpen(true);
  };

  const clearSelection = () => {
    setSelectedIds([]);
  };

  const toggleSelectionMode = () => {
    setIsSelectionMode((prev) => {
      if (prev) {
        clearSelection();
      }

      return !prev;
    });
  };

  const toggleSelectedApplication = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((selectedId) => selectedId !== id) : [...prev, id],
    );
  };

  const selectVisibleApplications = () => {
    setSelectedIds((prev) => {
      const nextIds = new Set(prev);
      filteredAndSortedApps.forEach((app) => nextIds.add(app.id));
      return Array.from(nextIds);
    });
  };

  const handleAddApplication = (e: React.FormEvent) => {
    e.preventDefault();

    const salaryFrom = Number(newApp.salaryFrom || '0');
    const salaryTo = Number(newApp.salaryTo || '0');

    if (newApp.salaryFrom && newApp.salaryTo && salaryTo < salaryFrom) {
      setFormError(
        lang === 'pl'
          ? 'Gorna granica wynagrodzenia nie moze byc mniejsza niz dolna.'
          : 'The upper salary range cannot be lower than the lower range.',
      );
      return;
    }

    if (!newApp.salaryFrom && !newApp.salaryTo) {
      setFormError(
        lang === 'pl'
          ? 'Podaj przynajmniej jedna kwote wynagrodzenia.'
          : 'Enter at least one salary amount.',
      );
      return;
    }

    if (editingId !== null) {
      setApplications((prev) =>
        prev.map((app) =>
          app.id === editingId
            ? {
                ...app,
                company: newApp.company,
                position: newApp.position,
                portal: newApp.portal,
                salaryFrom: newApp.salaryFrom,
                salaryTo: newApp.salaryTo,
                currency: newApp.currency,
                salaryMode: newApp.salaryMode,
                employmentType: newApp.employmentType,
                workMode: newApp.workMode,
                seniority: newApp.seniority,
                nextStepDate: newApp.nextStepDate,
                link: newApp.link || '#',
                salary: `${formatSalary(newApp.salaryFrom, newApp.salaryTo, newApp.currency)} • ${newApp.employmentType} • ${salaryModeLabels[lang][newApp.salaryMode]}`,
              }
            : app,
        ),
      );
      setIsFormOpen(false);
      resetForm();
      showToast(
        lang === 'pl' ? 'Oferta zostala zaktualizowana.' : 'Application updated successfully.',
        'success',
      );
      return;
    }

    const application: JobApplication = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      company: newApp.company,
      position: newApp.position,
      portal: newApp.portal,
      salaryFrom: newApp.salaryFrom,
      salaryTo: newApp.salaryTo,
      currency: newApp.currency,
      salaryMode: newApp.salaryMode,
      employmentType: newApp.employmentType,
      workMode: newApp.workMode,
      seniority: newApp.seniority,
      nextStepDate: newApp.nextStepDate,
      link: newApp.link || '#',
      salary: `${formatSalary(newApp.salaryFrom, newApp.salaryTo, newApp.currency)} • ${newApp.employmentType} • ${salaryModeLabels[lang][newApp.salaryMode]}`,
      status: 'sent',
      notes: '',
    };

    setApplications((prev) => [application, ...prev]);
    setIsFormOpen(false);
    resetForm();
    showToast(
      lang === 'pl' ? 'Nowa oferta zostala dodana.' : 'New application added successfully.',
      'success',
    );
  };

  const handleStatusChange = (id: number, newStatus: DashboardStatus) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: newStatus } : app)),
    );
    showToast(
      lang === 'pl'
        ? `Status zmieniono na ${statusLabels.pl[newStatus].toLowerCase()}.`
        : `Status changed to ${statusLabels.en[newStatus].toLowerCase()}.`,
      'info',
    );
  };

  const handleBulkStatusChange = (newStatus: DashboardStatus) => {
    if (selectedIds.length === 0) return;

    setApplications((prev) =>
      prev.map((app) => (selectedIds.includes(app.id) ? { ...app, status: newStatus } : app)),
    );

    showToast(
      lang === 'pl'
        ? `Zmieniono status ${selectedIds.length} ofert na ${statusLabels.pl[newStatus].toLowerCase()}.`
        : `Updated ${selectedIds.length} applications to ${statusLabels.en[newStatus].toLowerCase()}.`,
      'info',
    );
  };

  const handleBulkStatusSelect = (value: BulkStatusAction) => {
    setBulkStatusValue(value);

    if (value === 'placeholder') return;

    handleBulkStatusChange(value);
    setBulkStatusValue('placeholder');
  };

  const handleNoteUpdate = (id: number, text: string) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, notes: text } : app)),
    );
  };

  const appendNoteTemplate = (id: number, template: string) => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id !== id) return app;

        const currentNote = app.notes?.trim() ?? '';
        const joinedNote = currentNote ? `${currentNote}\n\n${template.trimEnd()}` : template.trimEnd();

        return {
          ...app,
          notes: joinedNote,
        };
      }),
    );
  };

  const handleDeleteApplication = (id: number) => {
    const targetApp = applications.find((app) => app.id === id);
    if (!targetApp) return;

    setPendingDeleteApps([targetApp]);
  };

  const handleBulkDeleteApplications = () => {
    if (selectedApplications.length === 0) return;

    setPendingDeleteApps(selectedApplications);
  };

  const confirmDeleteApplication = () => {
    if (!pendingDeleteApps || pendingDeleteApps.length === 0) return;

    const deletedEntries = pendingDeleteApps.map((app) => ({
      app,
      index: applications.findIndex((item) => item.id === app.id),
    }));
    const deletedIds = deletedEntries.map((entry) => entry.app.id);
    const deletedCount = deletedEntries.length;

    setApplications((prev) => prev.filter((app) => !deletedIds.includes(app.id)));
    setSelectedIds((prev) => prev.filter((id) => !deletedIds.includes(id)));
    setActiveNoteId((prev) => (prev !== null && deletedIds.includes(prev) ? null : prev));
    showToast(deletedCount === 1
      ? lang === 'pl' ? 'Oferta zostala usunieta.' : 'Application deleted.'
      : lang === 'pl' ? `Usunieto ${deletedCount} ofert.` : `Deleted ${deletedCount} applications.`, 'error', {
      actionLabel: lang === 'pl' ? 'Cofnij' : 'Undo',
      durationMs: 5200,
      onAction: () => {
        setApplications((prev) => {
          const restored = [...prev];

          deletedEntries
            .slice()
            .sort((a, b) => a.index - b.index)
            .forEach(({ app, index }) => {
              if (restored.some((item) => item.id === app.id)) return;
              restored.splice(index >= 0 ? index : restored.length, 0, app);
            });

          return restored;
        });

        showToast(
          deletedCount === 1
            ? lang === 'pl' ? 'Oferta zostala przywrocona.' : 'Application restored.'
            : lang === 'pl' ? `Przywrocono ${deletedCount} ofert.` : `Restored ${deletedCount} applications.`,
          'success',
        );
      },
    });

    if (editingId !== null && deletedIds.includes(editingId)) {
      setIsFormOpen(false);
      resetForm();
    }

    setPendingDeleteApps(null);
  };

  const handleEditApplication = (app: JobApplication) => {
    const parsedSalary = parseSalary(app.salary);

    setEditingId(app.id);
    setFormError('');
    setIsFormOpen(true);
    setNewApp({
      company: app.company,
      position: app.position,
      portal: app.portal,
      salaryFrom: app.salaryFrom ?? parsedSalary.salaryFrom,
      salaryTo: app.salaryTo ?? parsedSalary.salaryTo,
      currency: app.currency ?? parsedSalary.currency,
      employmentType: app.employmentType ?? parsedSalary.employmentType,
      salaryMode: app.salaryMode ?? parsedSalary.salaryMode,
      workMode: getWorkMode(app),
      seniority: getSeniority(app),
      nextStepDate: getNextStepDate(app),
      link: app.link === '#' ? '' : app.link,
    });
  };

  const handleExit = () => {
    setIsLeaving(true);
    setTimeout(() => onBack(), 1000);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!isFormOpen || !addFormRef.current) return;

    addFormRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  }, [isFormOpen, editingId]);

  useEffect(() => {
    window.localStorage.setItem(DASHBOARD_STORAGE_KEY, JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    setSelectedIds((prev) => prev.filter((id) => applications.some((app) => app.id === id)));
  }, [applications]);

  useEffect(() => {
    if (!toast) return;

    const timer = window.setTimeout(() => {
      setToast(null);
    }, toast.durationMs ?? 2800);

    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;

      if (activeNoteId !== null) {
        setActiveNoteId(null);
        return;
      }

      if (pendingDeleteApps) {
        setPendingDeleteApps(null);
        return;
      }

      if (modalType) {
        setModalType(null);
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [activeNoteId, modalType, pendingDeleteApps]);

  const theme = getModalTheme();

  if (isLeaving) {
    return (
      <div className="loader-container">
        <div className="dot-loader">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
        <p className="loader-text">{lang === 'pl' ? 'Wylogowywanie...' : 'Logging out...'}</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container fade-in">
      {toast &&
        createPortal(
          <div className={`toast-alert ${toast.tone}`} key={toast.id}>
            <span className="toast-indicator" aria-hidden="true"></span>
            <span className="toast-message">{toast.message}</span>
            {toast.actionLabel && toast.onAction && (
              <button
                type="button"
                className="toast-action-btn"
                onClick={() => {
                  const action = toast.onAction;
                  if (!action) return;
                  setToast(null);
                  action();
                }}
              >
                {toast.actionLabel}
              </button>
            )}
            <button type="button" className="toast-close-btn" onClick={() => setToast(null)} aria-label="Close toast">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>,
          document.body,
        )}

      <header className="dashboard-header">
        <div className="header-left">
          <h1 className="brand-logo dashboard-logo">
            JobTracker<span>.</span>
          </h1>
        </div>

        <div className="header-right">
          <div className="lang-switcher dashboard-lang">
            <button className={`lang-btn ${lang === 'pl' ? 'active' : ''}`} onClick={() => setLang('pl')}>
              <svg width="24" height="16" viewBox="0 0 16 10">
                <rect width="16" height="10" fill="#fff" />
                <rect width="16" height="5" y="5" fill="#dc143c" />
              </svg>
              <span>PL</span>
            </button>

            <button className={`lang-btn ${lang === 'en' ? 'active' : ''}`} onClick={() => setLang('en')}>
              <svg width="24" height="16" viewBox="0 0 60 30">
                <path d="M0,0H60V30H0Z" fill="#012169" />
                <path d="M0,0L60,30M60,0L0,30" stroke="#fff" strokeWidth="6" />
                <path d="M0,0L60,30M60,0L0,30" stroke="#C8102E" strokeWidth="4" />
                <path d="M30,0V30M0,15H60" stroke="#fff" strokeWidth="10" />
                <path d="M30,0V30M0,15H60" stroke="#C8102E" strokeWidth="6" />
              </svg>
              <span>EN</span>
            </button>
          </div>

          <div className="user-profile" ref={dropdownRef}>
            <button className="home-icon-btn" onClick={handleExit}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </button>

            <div className="avatar-wrapper" style={{ position: 'relative' }}>
              <div className={`avatar-circle ${isDropdownOpen ? 'active' : ''}`} onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>

              {isDropdownOpen && (
                <div className="profile-dropdown">
                  <div className="dropdown-user-info">
                    <p className="user-name">Dominik Skutecki</p>
                    <p className="user-email">demo@jobtracker.pl</p>
                  </div>

                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item">👤 {lang === 'pl' ? 'Moj profil' : 'My Profile'}</button>
                  <button className="dropdown-item">⚙️ {lang === 'pl' ? 'Ustawienia' : 'Settings'}</button>
                  <button className="dropdown-item">📊 {lang === 'pl' ? 'Raporty' : 'Reports'}</button>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item logout-item" onClick={handleExit}>
                    🚪 {lang === 'pl' ? 'Wyloguj sie' : 'Log out'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="dashboard-content">
        <div className="demo-welcome-section">
          <h2 className="welcome-title">
            {lang === 'pl' ? 'Witaj w wersji ' : 'Welcome to '}
            <span>{lang === 'pl' ? 'demonstracyjnej!' : 'demo version!'}</span>
          </h2>
          <p className="welcome-subtitle">
            {lang === 'pl' ? 'Twoja kariera pod kontrola.' : 'Your career under control.'}
          </p>
        </div>

        {upcomingReminders.length > 0 && (
          <section className="reminder-strip fade-in">
            <div className="reminder-strip-header">
              <div className="reminder-strip-icon" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="20" height="14" rx="3" ry="3" />
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
              </div>
              <div className="reminder-strip-copy">
                <span className="reminder-strip-kicker">REMINDER</span>
                <h3>{lang === 'pl' ? 'Nadchodzace etapy rekrutacji' : 'Upcoming hiring steps'}</h3>
              </div>
            </div>

            <div className="reminder-list">
              {upcomingReminders.map((app) => (
                <article key={app.id} className={`reminder-card ${getReminderTone(getNextStepDate(app))}`}>
                  <div className="reminder-card-main">
                    <div className="reminder-card-portal">
                      <span className="reminder-portal-logo">
                        <img src={getPortalIcon(app.portal)} alt={app.portal} className="reminder-portal-image" />
                      </span>
                      <div className="reminder-card-copy">
                        <span className="reminder-company">{app.company}</span>
                        <span className="reminder-position">{app.position}</span>
                      </div>
                    </div>
                  </div>
                  <div className="reminder-card-meta">
                    <span className="reminder-tag">{statusLabels[lang][app.status]}</span>
                    <span className="reminder-date">{formatCardDate(getNextStepDate(app))}</span>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        <p className={`summary-hint fade-in ${isHintActive ? 'active' : ''}`}>
          {lang === 'pl'
            ? '💡 Kliknij w status, aby wyswietlic liste przypisanych ofert'
            : '💡 Click on a status to view assigned jobs'}
        </p>

        <div className="summary-bar fade-in">
          <div className="summary-item">
            <span className="summary-label">{statusLabels[lang].total}:</span>
            <span className="summary-value">{stats.total}</span>
          </div>

          <div className="summary-divider"></div>

          <div
            className="summary-item sent clickable"
            onClick={() => stats.sent > 0 && setModalType('sent')}
            onMouseEnter={() => setIsHintActive(true)}
            onMouseLeave={() => setIsHintActive(false)}
          >
            <span className="summary-dot"></span>
            <span className="summary-label">{statusLabels[lang].sent}:</span>
            <span className="summary-value">{stats.sent}</span>
          </div>

          <div
            className="summary-item interview clickable"
            onClick={() => stats.interviews > 0 && setModalType('interview')}
            onMouseEnter={() => setIsHintActive(true)}
            onMouseLeave={() => setIsHintActive(false)}
          >
            <span className="summary-dot"></span>
            <span className="summary-label">{statusLabels[lang].interview}:</span>
            <span className="summary-value">{stats.interviews}</span>
          </div>

          <div
            className="summary-item offered clickable"
            onClick={() => stats.offered > 0 && setModalType('offered')}
            onMouseEnter={() => setIsHintActive(true)}
            onMouseLeave={() => setIsHintActive(false)}
          >
            <span className="summary-dot"></span>
            <span className="summary-label">{statusLabels[lang].offered}:</span>
            <span className="summary-value">{stats.offered}</span>
          </div>

          <div
            className="summary-item rejected clickable"
            onClick={() => stats.rejected > 0 && setModalType('rejected')}
            onMouseEnter={() => setIsHintActive(true)}
            onMouseLeave={() => setIsHintActive(false)}
          >
            <span className="summary-dot"></span>
            <span className="summary-label">{statusLabels[lang].rejected}:</span>
            <span className="summary-value">{stats.rejected}</span>
          </div>
        </div>

        <div className="dashboard-controls">
          <div className="search-container">
            <label className="search-label">
              {lang === 'pl'
                ? 'Wyszukaj oferte po slowach kluczowych (firma, stanowisko...)'
                : 'Search for jobs by keywords (company, position...)'}
            </label>
            <div className="search-box">
              <input
                type="text"
                placeholder={lang === 'pl' ? 'Szukaj...' : 'Search...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="filter-group">
            <CustomSelect
              value={statusFilter}
              options={statusFilterOptions}
              onChange={setStatusFilter}
              className="filter-select"
              align="right"
              getOptionClassName={getStatusOptionClassName}
            />

            <CustomSelect
              value={portalFilter}
              options={portalFilterOptions}
              onChange={setPortalFilter}
              className="filter-select"
              align="right"
            />

            <CustomSelect
              value={employmentFilter}
              options={employmentFilterOptions}
              onChange={setEmploymentFilter}
              className="filter-select"
              align="right"
            />

            <button
              type="button"
              className={`add-job-btn ${isFormOpen && editingId === null ? 'close-btn' : ''}`}
              onClick={() => {
                if (isFormOpen && editingId === null) {
                  setIsFormOpen(false);
                  resetForm();
                  return;
                }

                openFreshApplicationForm();
              }}
            >
              {isFormOpen && editingId === null ? 'X' : lang === 'pl' ? '+ Dodaj' : '+ Add'}
            </button>

            <button
              type="button"
              className={`bulk-mode-btn ${isSelectionMode ? 'active' : ''}`}
              onClick={toggleSelectionMode}
            >
              {isSelectionMode
                ? lang === 'pl' ? 'Zakoncz zaznaczanie' : 'Exit selection'
                : lang === 'pl' ? 'Zaznacz wiele' : 'Select multiple'}
            </button>
          </div>
        </div>

        {isSelectionMode && (
          <div className={`bulk-actions-bar fade-in ${selectedIds.length > 0 ? 'has-selection' : ''}`}>
            <div className="bulk-actions-copy">
              <span className="bulk-actions-kicker">{lang === 'pl' ? 'Akcje zbiorcze' : 'Bulk actions'}</span>
             <p>
              {lang === 'pl' ? (
                <>
                  Zaznaczono <span className="bulk-count">{selectedIds.length}</span> ofert.
                  Widocznych zaznaczeń: <span className="bulk-count">{visibleSelectedCount}</span>.
                </>
              ) : (
                <>
                  <span className="bulk-count">{selectedIds.length}</span> applications selected.
                  Visible selected: <span className="bulk-count">{visibleSelectedCount}</span>.
                </>
              )}
            </p>
            </div>

            <div className="bulk-actions-buttons">
              <button type="button" className="bulk-action-btn highlight" onClick={selectVisibleApplications}>
                {lang === 'pl' ? 'Zaznacz widoczne' : 'Select visible'}
              </button>
              <button type="button" className="bulk-action-btn" onClick={clearSelection}>
                {lang === 'pl' ? 'Wyczysc' : 'Clear'}
              </button>
              <CustomSelect
                value={bulkStatusValue}
                options={bulkStatusOptions}
                onChange={handleBulkStatusSelect}
                className={`bulk-status-select ${selectedIds.length === 0 ? 'disabled' : ''}`}
                align="right"
                getOptionClassName={getBulkStatusOptionClassName}
              />
              <button type="button" className="bulk-action-btn danger" disabled={selectedIds.length === 0} onClick={handleBulkDeleteApplications}>
                {lang === 'pl' ? 'Usun zaznaczone' : 'Delete selected'}
              </button>
            </div>
          </div>
        )}

        {isFormOpen && (
          <form ref={addFormRef} className="add-job-form fade-in" onSubmit={handleAddApplication}>
            <div className="form-header">
              <div>
                <span className="form-kicker">{editingId !== null ? 'EDIT MODE' : 'NEW ENTRY'}</span>
                <h3 className="form-title">
                  {editingId !== null
                    ? lang === 'pl'
                      ? 'Edytuj istniejaca oferte'
                      : 'Edit existing application'
                    : lang === 'pl'
                      ? 'Dodaj nowa oferte recznie'
                      : 'Add a new application manually'}
                </h3>
                <p className="form-subtitle">
                  {lang === 'pl'
                    ? 'Uzupelnij najwazniejsze dane, a karta od razu zaktualizuje sie w dashboardzie.'
                    : 'Fill in the key details and the card will update instantly in the dashboard.'}
                </p>
              </div>
            </div>

            <div className="form-grid">
              <label className="form-field">
                <span className="form-label">{lang === 'pl' ? 'Firma' : 'Company'}</span>
                <input
                  type="text"
                  placeholder={lang === 'pl' ? 'np. Allegro' : 'e.g. Allegro'}
                  required
                  value={newApp.company}
                  onChange={(e) => setNewApp({ ...newApp, company: e.target.value })}
                />
              </label>

              <label className="form-field">
                <span className="form-label">{lang === 'pl' ? 'Stanowisko' : 'Position'}</span>
                <input
                  type="text"
                  placeholder={lang === 'pl' ? 'np. Frontend Developer' : 'e.g. Frontend Developer'}
                  required
                  value={newApp.position}
                  onChange={(e) => setNewApp({ ...newApp, position: e.target.value })}
                />
              </label>

              <label className="form-field">
                <span className="form-label">{lang === 'pl' ? 'Portal' : 'Portal'}</span>
                <CustomSelect
                  value={newApp.portal}
                  options={portalOptions}
                  onChange={(value) => setNewApp({ ...newApp, portal: value })}
                  className="form-select"
                />
              </label>

              <label className="form-field">
                <span className="form-label">{lang === 'pl' ? 'Tryb pracy' : 'Work mode'}</span>
                <CustomSelect
                  value={newApp.workMode}
                  options={workModeOptions}
                  onChange={(value) => setNewApp({ ...newApp, workMode: value })}
                  className="form-select"
                />
              </label>

              <label className="form-field">
                <span className="form-label">{lang === 'pl' ? 'Poziom' : 'Seniority'}</span>
                <CustomSelect
                  value={newApp.seniority}
                  options={seniorityOptions}
                  onChange={(value) => setNewApp({ ...newApp, seniority: value })}
                  className="form-select"
                />
              </label>

              <div className="form-field form-field-wide">
                <span className="form-label">{lang === 'pl' ? 'Widelki wynagrodzenia' : 'Salary range'}</span>
                <div className="salary-range-group">
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder={lang === 'pl' ? 'Od, np. 12000' : 'From, e.g. 12000'}
                    value={newApp.salaryFrom}
                    onChange={(e) => {
                      setFormError('');
                      setNewApp({ ...newApp, salaryFrom: sanitizeAmountInput(e.target.value) });
                    }}
                  />
                  <span className="salary-range-separator">-</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder={lang === 'pl' ? 'Do, np. 18000' : 'To, e.g. 18000'}
                    value={newApp.salaryTo}
                    onChange={(e) => {
                      setFormError('');
                      setNewApp({ ...newApp, salaryTo: sanitizeAmountInput(e.target.value) });
                    }}
                  />
                </div>
              </div>

              <label className="form-field">
                <span className="form-label">{lang === 'pl' ? 'Waluta' : 'Currency'}</span>
                <CustomSelect
                  value={newApp.currency}
                  options={currencyOptions}
                  onChange={(value) => setNewApp({ ...newApp, currency: value })}
                  className="form-select"
                />
              </label>

              <label className="form-field">
                <span className="form-label">{lang === 'pl' ? 'Typ umowy' : 'Contract type'}</span>
                <CustomSelect
                  value={newApp.employmentType}
                  options={employmentOptions}
                  onChange={(value) => setNewApp({ ...newApp, employmentType: value })}
                  className="form-select"
                />
              </label>

              <label className="form-field">
                <span className="form-label">{lang === 'pl' ? 'Rodzaj stawki' : 'Salary mode'}</span>
                <CustomSelect
                  value={newApp.salaryMode}
                  options={salaryModeOptions}
                  onChange={(value) => setNewApp({ ...newApp, salaryMode: value })}
                  className="form-select"
                />
              </label>

              <label className="form-field">
                <span className="form-label">{lang === 'pl' ? 'Data kolejnego etapu' : 'Next step date'}</span>
                <input
                  type="date"
                  value={newApp.nextStepDate}
                  onChange={(e) => setNewApp({ ...newApp, nextStepDate: e.target.value })}
                />
              </label>

              <label className="form-field form-field-wide">
                <span className="form-label">{lang === 'pl' ? 'Link do oferty' : 'Job link'}</span>
                <input
                  type="url"
                  placeholder="https://..."
                  value={newApp.link}
                  onChange={(e) => setNewApp({ ...newApp, link: e.target.value })}
                />
              </label>

              <div className="form-actions">
                <button
                  type="button"
                  className="form-secondary-btn"
                  onClick={() => {
                    setIsFormOpen(false);
                    resetForm();
                  }}
                >
                  {lang === 'pl' ? 'Anuluj' : 'Cancel'}
                </button>

                <button type="submit" className="submit-job-btn">
                  {editingId !== null
                    ? lang === 'pl'
                      ? 'Zapisz zmiany'
                      : 'Save changes'
                    : lang === 'pl'
                      ? 'Zapisz oferte'
                      : 'Save application'}
                </button>
              </div>
            </div>

            {formError && <p className="form-error">{formError}</p>}
          </form>
        )}

        <div className="applications-grid fade-in">
          {filteredAndSortedApps.map((app, index) => {
            const salaryBadge = getSalaryBadgeData(app);

            return (
            <div
              key={app.id}
              className={`job-card ${app.status} ${selectedIds.includes(app.id) ? 'selected' : ''} fade-in-stagger`}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="card-topbar">
                <div className="card-topbar-left">
                  {isSelectionMode && (
                    <button
                      type="button"
                      className={`card-select-toggle ${selectedIds.includes(app.id) ? 'selected' : ''}`}
                      onClick={() => toggleSelectedApplication(app.id)}
                      aria-label={lang === 'pl' ? 'Zaznacz oferte' : 'Select application'}
                    >
                      <span className="card-select-toggle-mark" aria-hidden="true">
                        {selectedIds.includes(app.id) ? '✓' : ''}
                      </span>
                    </button>
                  )}
                  <span className={`card-status-pill ${app.status}`}>{statusLabels[lang][app.status]}</span>
                </div>

                <div className="card-actions-overlay">
                  <button
                    type="button"
                    className="edit-card-btn"
                    onClick={() => handleEditApplication(app)}
                    aria-label={lang === 'pl' ? 'Edytuj oferte' : 'Edit job'}
                    data-tooltip={lang === 'pl' ? 'Edytuj oferte' : 'Edit application'}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z" /></svg>
                  </button>

                  <button
                    type="button"
                    className="remove-card-btn"
                    onClick={() => handleDeleteApplication(app.id)}
                    aria-label={lang === 'pl' ? 'Usun oferte' : 'Delete job'}
                    data-tooltip={lang === 'pl' ? 'Usun oferte' : 'Delete application'}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                  </button>

                  <button
                    type="button"
                    className={`note-toggle-btn ${app.notes ? 'has-note' : ''} ${activeNoteId === app.id ? 'open' : ''}`}
                    onClick={() => setActiveNoteId(activeNoteId === app.id ? null : app.id)}
                    aria-label={lang === 'pl' ? 'Pokaz notatki' : 'Show notes'}
                    data-tooltip={lang === 'pl' ? 'Pokaz notatki' : 'Show notes'}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </button>

                  <a
                    href={app.link}
                    className="link-icon"
                    target="_blank"
                    rel="noreferrer"
                    aria-label={lang === 'pl' ? 'Otworz oferte' : 'Open application'}
                    data-tooltip={lang === 'pl' ? 'Otworz oferte' : 'Open application'}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </a>
                </div>
              </div>

              <div className="card-header">
                <div className="card-company-logo">
                  <img className="card-logo-image" src={getPortalIcon(app.portal)} alt={app.portal} />
                </div>
                <span className="card-salary" title={getDisplaySalary(app)}>
                  <span className="card-salary-amount">{salaryBadge.amount}</span>
                  <span className="card-salary-meta">
                    <span>{salaryBadge.employmentType}</span>
                    <span className="card-salary-dot">•</span>
                    <span>{salaryBadge.salaryModeLabel}</span>
                  </span>
                </span>
              </div>

              <div className="card-body-main">
                <p className="card-portal-name">{app.portal}</p>
                <h3 className="card-company-name">{app.company}</h3>
                <p className="card-position-name job-position-name">{app.position}</p>

                <div className="card-tags">
                  <span className="card-tag">{workModeLabels[lang][getWorkMode(app)]}</span>
                  <span className="card-tag subtle">{employmentLabels[lang][app.employmentType]}</span>
                  <span className="card-tag accent">{seniorityLabels[lang][getSeniority(app)]}</span>
                </div>
              </div>

              <div className="card-meta">
                <div className="card-meta-item">
                  <span className="card-meta-label">{lang === 'pl' ? 'Dodano' : 'Added'}</span>
                  <span className="card-meta-value">{formatCardDate(app.date)}</span>
                </div>
                <div className="card-meta-item">
                  <span className="card-meta-label">{lang === 'pl' ? 'Kolejny etap' : 'Next step'}</span>
                  <span className="card-meta-value">{getNextStepDate(app) ? formatCardDate(getNextStepDate(app)) : '---'}</span>
                </div>
              </div>

              <div className="card-footer">
                <div className="card-status-copy">
                  <span className="card-footer-label">{lang === 'pl' ? 'Zmien status' : 'Update status'}</span>
                </div>

                <CustomSelect
                  value={app.status}
                  options={cardStatusOptions}
                  onChange={(value) => handleStatusChange(app.id, value)}
                  className={`card-status-dropdown ${app.status}`}
                  align="right"
                  getOptionClassName={getStatusOptionClassName}
                />
              </div>

            </div>
          );
          })}
        </div>

        {activeNoteApp &&
          createPortal(
            <div
              className="modal-overlay fade-in"
              onClick={(e) => {
                if (shouldCloseOverlay(e, notesModalRef.current)) {
                  setActiveNoteId(null);
                }
              }}
            >
              <div ref={notesModalRef} className="notes-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
                <div className="notes-modal-header">
                  <div className="notes-modal-main">
                    <span className="notes-modal-logo">
                      <img src={getPortalIcon(activeNoteApp.portal)} alt={activeNoteApp.portal} className="notes-modal-logo-image" />
                    </span>
                    <div className="notes-modal-copy">
                      <span className="notes-kicker">{lang === 'pl' ? 'Prywatne notatki' : 'Private notes'}</span>
                      <h3>{activeNoteApp.company}</h3>
                      <p>
                        {activeNoteApp.position} · {activeNoteApp.portal}
                      </p>
                    </div>
                  </div>

                  <div className="notes-modal-actions">
                    <div className="notes-meta">
                      <span className="notes-saved-badge">{lang === 'pl' ? 'Auto zapis' : 'Auto save'}</span>
                      {getNextStepDate(activeNoteApp) && (
                        <span className="notes-deadline-badge">{getNextStepBadgeLabel(activeNoteApp)}</span>
                      )}
                    </div>
                    <button type="button" className="close-modal" onClick={() => setActiveNoteId(null)}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                    </button>
                  </div>
                </div>

                <div className="notes-modal-body">
                  <p className="notes-helper notes-modal-helper">
                    {lang === 'pl'
                      ? 'Zapis odbywa sie automatycznie. Zbieraj ustalenia z rekruterem, feedback po rozmowie i kolejne kroki w jednym miejscu.'
                      : 'Saved automatically. Capture recruiter context, interview feedback and next steps in one place.'}
                  </p>

                  <div className="note-shortcuts">
                    {getNoteTemplates(activeNoteApp).map((template) => (
                      <button
                        key={template.label}
                        type="button"
                        className="note-shortcut-btn"
                        onClick={() => appendNoteTemplate(activeNoteApp.id, template.text)}
                      >
                        + {template.label}
                      </button>
                    ))}
                  </div>

                  <textarea
                    className="notes-textarea notes-textarea-modal"
                    value={activeNoteApp.notes || ''}
                    onChange={(e) => handleNoteUpdate(activeNoteApp.id, e.target.value)}
                    placeholder={getNotesPlaceholder()}
                  />

                  <div className="notes-footer">
                    <span className="notes-count">
                      {(activeNoteApp.notes || '').trim().length} {lang === 'pl' ? 'znakow' : 'chars'}
                    </span>
                    <span className="notes-status-copy">
                      {lang === 'pl' ? 'Widoczne tylko w Twoim demo dashboardzie.' : 'Visible only in your demo dashboard.'}
                    </span>
                  </div>
                </div>
              </div>
            </div>,
            document.body,
          )}

        {pendingDeleteApps && pendingDeleteApps.length > 0 &&
          createPortal(
            <div
              className="modal-overlay fade-in"
              onClick={(e) => {
                if (shouldCloseOverlay(e, confirmModalRef.current)) {
                  setPendingDeleteApps(null);
                }
              }}
            >
              <div ref={confirmModalRef} className="confirm-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
                <div className="confirm-modal-icon" aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 6h18" />
                    <path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2" />
                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                    <line x1="10" y1="11" x2="10" y2="17" />
                    <line x1="14" y1="11" x2="14" y2="17" />
                  </svg>
                </div>

                <div className="confirm-modal-copy">
                  <span className="confirm-kicker">{lang === 'pl' ? 'Potwierdzenie' : 'Confirmation'}</span>
                  <h3>
                    {pendingDeleteApps.length === 1
                      ? lang === 'pl' ? 'Usunac te oferte?' : 'Delete this application?'
                      : lang === 'pl' ? `Usunac ${pendingDeleteApps.length} ofert?` : `Delete ${pendingDeleteApps.length} applications?`}
                  </h3>
                  <p>
                    {pendingDeleteApps.length === 1
                      ? lang === 'pl'
                        ? `Oferta ${pendingDeleteApps[0].company} - ${pendingDeleteApps[0].position} zostanie usunieta z dashboardu.`
                        : `${pendingDeleteApps[0].company} - ${pendingDeleteApps[0].position} will be removed from your dashboard.`
                      : lang === 'pl'
                        ? 'Wszystkie zaznaczone oferty zostana usuniete z dashboardu.'
                        : 'All selected applications will be removed from your dashboard.'}
                  </p>
                </div>

                <div className="confirm-modal-card">
                  {pendingDeleteApps.length === 1 ? (
                    <>
                      <span className="confirm-modal-company">{pendingDeleteApps[0].company}</span>
                      <span className="confirm-modal-position">{pendingDeleteApps[0].position}</span>
                      <span className="confirm-modal-portal">{pendingDeleteApps[0].portal}</span>
                    </>
                  ) : (
                    <>
                      <span className="confirm-modal-company">
                        {lang === 'pl'
                          ? `${pendingDeleteApps.length} zaznaczonych ofert`
                          : `${pendingDeleteApps.length} selected applications`}
                      </span>
                      <span className="confirm-modal-position">
                        {pendingDeleteApps
                          .slice(0, 3)
                          .map((app) => app.company)
                          .join(', ')}
                        {pendingDeleteApps.length > 3 ? '...' : ''}
                      </span>
                      <span className="confirm-modal-portal">
                        {lang === 'pl' ? 'Akcja grupowa' : 'Bulk action'}
                      </span>
                    </>
                  )}
                </div>

                <div className="confirm-modal-actions">
                  <button type="button" className="form-secondary-btn" onClick={() => setPendingDeleteApps(null)}>
                    {lang === 'pl' ? 'Anuluj' : 'Cancel'}
                  </button>
                  <button type="button" className="confirm-delete-btn" onClick={confirmDeleteApplication}>
                    {lang === 'pl' ? 'Usun oferte' : 'Delete job'}
                  </button>
                </div>
              </div>
            </div>,
            document.body,
          )}

        {modalType &&
          createPortal(
            <div
              className="modal-overlay fade-in"
              onClick={(e) => {
                if (shouldCloseOverlay(e, statusModalRef.current)) {
                  setModalType(null);
                }
              }}
            >
              <div
                ref={statusModalRef}
                className="interview-modal"
                onClick={(e) => e.stopPropagation()}
                style={{ borderColor: theme.color }}
                role="dialog"
                aria-modal="true"
              >
                <div className="modal-header">
                  <div className="modal-header-main">
                    <div className="modal-status-icon" style={{ color: theme.color, borderColor: theme.color }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="7" width="20" height="14" rx="3" ry="3" />
                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                      </svg>
                    </div>

                    <div className="modal-header-copy">
                      <span className="modal-kicker">{lang === 'pl' ? 'Przeglad statusu' : 'Status overview'}</span>
                      <h3 style={{ color: theme.color }}>{theme.title}</h3>
                    </div>
                  </div>

                  <div className="modal-header-actions">
                    <span className="modal-count-badge">
                      {filteredModalJobs.length} {lang === 'pl' ? 'ofert' : 'jobs'}
                    </span>
                    <button type="button" className="close-modal" onClick={() => setModalType(null)}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                    </button>
                  </div>
                </div>

                <div className="modal-body">
                  {filteredModalJobs.length > 0 ? (
                    filteredModalJobs.map((job) => (
                      <article key={job.id} className="modal-job-item" style={{ borderLeft: `4px solid ${theme.color}` }}>
                        <div className="modal-job-portal-logo">
                          <img src={getPortalIcon(job.portal)} alt={job.portal} className="modal-job-portal-image" />
                        </div>

                        <div className="job-info-main">
                          <div className="modal-job-topline">
                            <span className="job-company">{job.company}</span>
                            <span className="modal-job-portal">{job.portal}</span>
                          </div>
                          <span className="job-position">{job.position}</span>
                        </div>

                        <div className="modal-job-meta">
                          <div className="job-info-date">{formatCardDate(job.date)}</div>
                          {job.link !== '#' && (
                            <a href={job.link} className="modal-job-link" target="_blank" rel="noreferrer">
                              {lang === 'pl' ? 'Otworz' : 'Open'}
                            </a>
                          )}
                        </div>
                      </article>
                    ))
                  ) : (
                    <div className="modal-empty-state">
                      <div className="modal-empty-icon" aria-hidden="true">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10" />
                          <line x1="15" y1="9" x2="9" y2="15" />
                          <line x1="9" y1="9" x2="15" y2="15" />
                        </svg>
                      </div>
                      <p>{lang === 'pl' ? 'Brak ofert o tym statusie.' : 'No jobs with this status.'}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>,
            document.body,
          )}
      </main>
    </div>
  );
};

export default Dashboard;

