import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import './Dashboard.css';
import { ApplicationFormModal } from './dashboard/components/ApplicationFormModal';
import { BulkActionsBar } from './dashboard/components/BulkActionsBar';
import { ConfirmDeleteModal } from './dashboard/components/ConfirmDeleteModal';
import {
  formatCardDate,
  formatSalary,
  getDisplaySalary,
  getModalTheme,
  getNextStepBadgeLabel,
  getNextStepDate,
  getReminderTone,
  getSalaryBadgeData,
  parseSalary,
} from './dashboard/helpers';
import { JobCard } from './dashboard/components/JobCard';
import { OptionPickerModal } from './dashboard/components/OptionPickerModal';
import {
  employmentLabels,
  getStatusOptionClassName,
  salaryModeLabels,
  seniorityLabels,
  statusLabels,
  workModeLabels,
} from './dashboard/labels';
import { NotesModal } from './dashboard/components/NotesModal';
import { StatusListModal } from './dashboard/components/StatusListModal';
import { DASHBOARD_STORAGE_KEY, INITIAL_NEW_APP, getInitialApplications } from './dashboard/data';
import {
  getPortalIcon,
  getSeniority,
  getWorkMode,
} from './dashboard/utils';
import type {
  DashboardProps,
  DashboardStatus,
  FilterEmployment,
  FilterPortal,
  FilterStatus,
  JobApplication,
  NewApplicationForm,
  EmploymentType,
  SelectOption,
  ToastState,
  WorkMode,
} from './dashboard/types';

const FilterTriggerIcon = ({
  type,
}: {
  type: 'status' | 'portal' | 'employment';
}) => {
  if (type === 'status') {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 6h16" />
        <path d="M7 12h10" />
        <path d="M10 18h4" />
      </svg>
    );
  }

  if (type === 'portal') {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="14" rx="3" />
        <path d="M8 20h8" />
        <path d="M12 18v2" />
      </svg>
    );
  }

  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 7h-9" />
      <path d="M14 17H5" />
      <circle cx="17" cy="17" r="3" />
      <circle cx="7" cy="7" r="3" />
    </svg>
  );
};

const StatusOptionIcon = ({
  status,
}: {
  status: DashboardStatus | 'all';
}) => {
  if (status === 'sent') {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 2L11 13" />
        <path d="M22 2L15 22L11 13L2 9L22 2Z" />
      </svg>
    );
  }

  if (status === 'interview') {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    );
  }

  if (status === 'offered') {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 7h-9" />
        <path d="M14 17H5" />
        <circle cx="17" cy="17" r="3" />
        <circle cx="7" cy="7" r="3" />
      </svg>
    );
  }

  if (status === 'rejected') {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M9 9l6 6" />
        <path d="M15 9l-6 6" />
      </svg>
    );
  }

  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 6h16" />
      <path d="M7 12h10" />
      <path d="M10 18h4" />
    </svg>
  );
};

const WorkModeOptionIcon = ({
  mode,
}: {
  mode: WorkMode;
}) => {
  if (mode === 'remote') {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="12" rx="2" />
        <path d="M8 20h8" />
        <path d="M12 16v4" />
      </svg>
    );
  }

  if (mode === 'hybrid') {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21h18" />
        <path d="M5 21V8l7-5 7 5v13" />
        <path d="M9 12h6" />
      </svg>
    );
  }

  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21h18" />
      <path d="M5 21V7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v14" />
      <path d="M9 9h6" />
      <path d="M9 13h6" />
    </svg>
  );
};

const EmploymentOptionIcon = ({
  type,
}: {
  type: EmploymentType;
}) => {
  if (type === 'B2B') {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 7h10" />
        <path d="M7 12h6" />
        <path d="M7 17h8" />
        <rect x="4" y="4" width="16" height="16" rx="3" />
      </svg>
    );
  }

  if (type === 'UoP') {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="3" width="14" height="18" rx="2" />
        <path d="M9 7h6" />
        <path d="M9 11h6" />
        <path d="M9 15h4" />
      </svg>
    );
  }

  if (type === 'UZ') {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 7h8" />
        <path d="M8 12h8" />
        <path d="M8 17h5" />
        <path d="M5 4h14v16H5z" />
      </svg>
    );
  }

  if (type === 'UoD') {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
        <path d="M14 3v5h5" />
        <path d="M9 13h6" />
        <path d="M9 17h4" />
      </svg>
    );
  }

  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19h16" />
      <path d="M6 19V8h12v11" />
      <path d="M9 8V5h6v3" />
    </svg>
  );
};

const Dashboard: React.FC<DashboardProps> = ({ lang, setLang, onBack }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [activeNoteId, setActiveNoteId] = useState<number | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isHintActive, setIsHintActive] = useState(false);
  const [modalType, setModalType] = useState<DashboardStatus | null>(null);
  const [activeFilterPicker, setActiveFilterPicker] = useState<'status' | 'portal' | 'employment' | null>(null);
  const [activeStatusPickerId, setActiveStatusPickerId] = useState<number | null>(null);
  const [activeBulkPicker, setActiveBulkPicker] = useState<'status' | 'workMode' | 'employment' | null>(null);
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

  const dropdownRef = useRef<HTMLDivElement>(null);

  const [applications, setApplications] = useState<JobApplication[]>(getInitialApplications);

  const [newApp, setNewApp] = useState<NewApplicationForm>(INITIAL_NEW_APP);

  const matchesSearchTerm = (app: JobApplication) => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return true;

    return (
      app.company.toLowerCase().includes(query) ||
      app.position.toLowerCase().includes(query)
    );
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

  const cardStatusOptions: Array<SelectOption<DashboardStatus>> = [
    { value: 'sent', label: statusLabels[lang].sent },
    { value: 'interview', label: statusLabels[lang].interview },
    { value: 'offered', label: statusLabels[lang].offered },
    { value: 'rejected', label: statusLabels[lang].rejected },
  ];

  const statusPickerOptions = cardStatusOptions.map((option) => ({
    ...option,
    icon: <StatusOptionIcon status={option.value} />,
    description:
      option.value === 'sent'
        ? lang === 'pl'
          ? 'Pula wyslanych.'
          : 'Sent stage.'
        : option.value === 'interview'
          ? lang === 'pl'
            ? 'Etap rozmowy.'
            : 'Interview stage.'
          : option.value === 'offered'
            ? lang === 'pl'
              ? 'Masz oferte.'
              : 'Offer received.'
            : lang === 'pl'
              ? 'Proces zamkniety.'
              : 'Process closed.',
    toneClassName: getStatusOptionClassName(option.value),
  }));

  const bulkStatusPickerOptions = statusPickerOptions.map((option) => ({
    ...option,
    description:
      lang === 'pl'
        ? `Ustaw ${option.label.toLowerCase()} dla zaznaczonych.`
        : `Set ${option.label.toLowerCase()} for selected.`,
  }));

  const workModePickerOptions: Array<{
    value: WorkMode;
    label: string;
    description: string;
    icon: React.JSX.Element;
  }> = [
    {
      value: 'remote',
      label: workModeLabels[lang].remote,
      description: lang === 'pl' ? 'Praca zdalna.' : 'Remote mode.',
      icon: <WorkModeOptionIcon mode="remote" />,
    },
    {
      value: 'hybrid',
      label: workModeLabels[lang].hybrid,
      description: lang === 'pl' ? 'Model hybrydowy.' : 'Hybrid mode.',
      icon: <WorkModeOptionIcon mode="hybrid" />,
    },
    {
      value: 'onsite',
      label: workModeLabels[lang].onsite,
      description: lang === 'pl' ? 'Praca stacjonarna.' : 'Onsite mode.',
      icon: <WorkModeOptionIcon mode="onsite" />,
    },
  ];

  const employmentBulkPickerOptions = employmentFilterOptions
    .filter((option): option is SelectOption<EmploymentType> => option.value !== 'all')
    .map((option) => ({
      ...option,
      description: lang === 'pl' ? `Ustaw ${option.label}.` : `Set ${option.label}.`,
      icon: <EmploymentOptionIcon type={option.value} />,
    }));

  const statusFilterCounts = useMemo(() => {
    return Object.fromEntries(
      statusFilterOptions.map((option) => [
        option.value,
        applications.filter((app) => {
          const matchesStatus = option.value === 'all' || app.status === option.value;
          const matchesPortal = portalFilter === 'all' || app.portal === portalFilter;
          const matchesEmployment = employmentFilter === 'all' || app.employmentType === employmentFilter;

          return matchesSearchTerm(app) && matchesStatus && matchesPortal && matchesEmployment;
        }).length,
      ]),
    ) as Record<FilterStatus, number>;
  }, [applications, employmentFilter, portalFilter, searchTerm, statusFilterOptions]);

  const portalFilterCounts = useMemo(() => {
    return Object.fromEntries(
      portalFilterOptions.map((option) => [
        option.value,
        applications.filter((app) => {
          const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
          const matchesPortal = option.value === 'all' || app.portal === option.value;
          const matchesEmployment = employmentFilter === 'all' || app.employmentType === employmentFilter;

          return matchesSearchTerm(app) && matchesStatus && matchesPortal && matchesEmployment;
        }).length,
      ]),
    ) as Record<string, number>;
  }, [applications, employmentFilter, portalFilterOptions, searchTerm, statusFilter]);

  const employmentFilterCounts = useMemo(() => {
    return Object.fromEntries(
      employmentFilterOptions.map((option) => [
        option.value,
        applications.filter((app) => {
          const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
          const matchesPortal = portalFilter === 'all' || app.portal === portalFilter;
          const matchesEmployment = option.value === 'all' || app.employmentType === option.value;

          return matchesSearchTerm(app) && matchesStatus && matchesPortal && matchesEmployment;
        }).length,
      ]),
    ) as Record<FilterEmployment, number>;
  }, [applications, employmentFilterOptions, portalFilter, searchTerm, statusFilter]);

  const statusFilterPickerOptions = statusFilterOptions.map((option) => ({
    ...option,
    badge: String(statusFilterCounts[option.value] ?? 0),
    icon: <StatusOptionIcon status={option.value} />,
    description:
      option.value === 'all'
        ? lang === 'pl'
          ? 'Wszystkie etapy.'
          : 'Every stage.'
        : lang === 'pl'
          ? `Tylko ${option.label.toLowerCase()}.`
          : `Only ${option.label.toLowerCase()}.`,
    toneClassName:
      option.value === 'all'
        ? 'status-option-all'
        : getStatusOptionClassName(option.value),
  }));

  const portalFilterPickerOptions = portalFilterOptions.map((option) => ({
    ...option,
    badge: String(portalFilterCounts[option.value] ?? 0),
    description:
      option.value === 'all'
        ? lang === 'pl'
          ? 'Wszystkie zrodla.'
          : 'Every source.'
        : lang === 'pl'
          ? `Tylko ${option.label}.`
          : `Only ${option.label}.`,
    iconSrc: option.value === 'all' ? undefined : getPortalIcon(option.value),
    icon: option.value === 'all' ? <FilterTriggerIcon type="portal" /> : undefined,
  }));

  const employmentFilterPickerOptions = employmentFilterOptions.map((option) => ({
    ...option,
    badge: String(employmentFilterCounts[option.value] ?? 0),
    icon: <FilterTriggerIcon type="employment" />,
    description:
      option.value === 'all'
        ? lang === 'pl'
          ? 'Kazdy typ.'
          : 'Any contract.'
        : lang === 'pl'
          ? `Tylko ${option.label}.`
          : `Only ${option.label}.`,
  }));

  const selectedStatusFilterLabel =
    statusFilterOptions.find((option) => option.value === statusFilter)?.label ??
    statusLabels[lang].all;
  const selectedPortalFilterLabel =
    portalFilterOptions.find((option) => option.value === portalFilter)?.label ??
    (lang === 'pl' ? 'Wszystkie portale' : 'All portals');
  const selectedEmploymentFilterLabel =
    employmentFilterOptions.find((option) => option.value === employmentFilter)?.label ??
    (lang === 'pl' ? 'Wszystkie umowy' : 'All contracts');

  const statusFilterToneClass =
    statusFilter === 'all' ? '' : `tone-${statusFilter}`;
  const portalFilterToneClass = portalFilter === 'all' ? '' : 'tone-portal';
  const employmentFilterToneClass =
    employmentFilter === 'all' ? '' : 'tone-employment';

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

  const activeStatusPickerApp = useMemo(() => {
    if (activeStatusPickerId === null) return null;
    return applications.find((app) => app.id === activeStatusPickerId) ?? null;
  }, [activeStatusPickerId, applications]);

  const selectedApplications = useMemo(
    () => applications.filter((app) => selectedIds.includes(app.id)),
    [applications, selectedIds],
  );

  const visibleSelectedCount = useMemo(
    () => filteredAndSortedApps.filter((app) => selectedIds.includes(app.id)).length,
    [filteredAndSortedApps, selectedIds],
  );

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

  const handleSubmitApplication = (e: React.FormEvent) => {
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
                salary: `${formatSalary(newApp.salaryFrom, newApp.salaryTo, newApp.currency, lang)} • ${newApp.employmentType} • ${salaryModeLabels[lang][newApp.salaryMode]}`,
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
      salary: `${formatSalary(newApp.salaryFrom, newApp.salaryTo, newApp.currency, lang)} • ${newApp.employmentType} • ${salaryModeLabels[lang][newApp.salaryMode]}`,
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

  const handleBulkWorkModeChange = (newMode: WorkMode) => {
    if (selectedIds.length === 0) return;

    setApplications((prev) =>
      prev.map((app) => (selectedIds.includes(app.id) ? { ...app, workMode: newMode } : app)),
    );

    showToast(
      lang === 'pl'
        ? `Zmieniono tryb pracy ${selectedIds.length} ofert na ${workModeLabels.pl[newMode].toLowerCase()}.`
        : `Updated ${selectedIds.length} applications to ${workModeLabels.en[newMode].toLowerCase()}.`,
      'info',
    );
  };

  const handleBulkEmploymentChange = (newEmployment: EmploymentType) => {
    if (selectedIds.length === 0) return;

    setApplications((prev) =>
      prev.map((app) =>
        selectedIds.includes(app.id) ? { ...app, employmentType: newEmployment } : app,
      ),
    );

    showToast(
      lang === 'pl'
        ? `Zmieniono typ umowy ${selectedIds.length} ofert na ${employmentLabels.pl[newEmployment].toLowerCase()}.`
        : `Updated ${selectedIds.length} applications to ${employmentLabels.en[newEmployment].toLowerCase()}.`,
      'info',
    );
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

  const theme = getModalTheme(lang, modalType);

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
                    <span className="reminder-date">{formatCardDate(getNextStepDate(app), lang)}</span>
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
            <button
              type="button"
              className={`filter-picker-btn ${statusFilter !== 'all' ? 'active' : ''} ${statusFilterToneClass}`}
              onClick={() => setActiveFilterPicker('status')}
            >
              <span className="filter-picker-icon" aria-hidden="true">
                <FilterTriggerIcon type="status" />
              </span>
              <span className="filter-picker-copy">
                <span className="filter-picker-kicker">{lang === 'pl' ? 'Status' : 'Status'}</span>
                <span className="filter-picker-value">{selectedStatusFilterLabel}</span>
              </span>
              <span className="filter-picker-chevron" aria-hidden="true">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </span>
            </button>

            <button
              type="button"
              className={`filter-picker-btn ${portalFilter !== 'all' ? 'active' : ''} ${portalFilterToneClass}`}
              onClick={() => setActiveFilterPicker('portal')}
            >
              <span className="filter-picker-icon" aria-hidden="true">
                <FilterTriggerIcon type="portal" />
              </span>
              <span className="filter-picker-copy">
                <span className="filter-picker-kicker">{lang === 'pl' ? 'Portal' : 'Portal'}</span>
                <span className="filter-picker-value">{selectedPortalFilterLabel}</span>
              </span>
              <span className="filter-picker-chevron" aria-hidden="true">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </span>
            </button>

            <button
              type="button"
              className={`filter-picker-btn ${employmentFilter !== 'all' ? 'active' : ''} ${employmentFilterToneClass}`}
              onClick={() => setActiveFilterPicker('employment')}
            >
              <span className="filter-picker-icon" aria-hidden="true">
                <FilterTriggerIcon type="employment" />
              </span>
              <span className="filter-picker-copy">
                <span className="filter-picker-kicker">{lang === 'pl' ? 'Umowa' : 'Contract'}</span>
                <span className="filter-picker-value">{selectedEmploymentFilterLabel}</span>
              </span>
              <span className="filter-picker-chevron" aria-hidden="true">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </span>
            </button>

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
          <BulkActionsBar
            lang={lang}
            onBulkDelete={handleBulkDeleteApplications}
            onClearSelection={clearSelection}
            onOpenBulkEmploymentPicker={() => setActiveBulkPicker('employment')}
            onOpenBulkStatusPicker={() => setActiveBulkPicker('status')}
            onOpenBulkWorkModePicker={() => setActiveBulkPicker('workMode')}
            onSelectVisible={selectVisibleApplications}
            selectedCount={selectedIds.length}
            visibleSelectedCount={visibleSelectedCount}
          />
        )}

        <ApplicationFormModal
          editingId={editingId}
          formError={formError}
          isOpen={isFormOpen}
          lang={lang}
          newApp={newApp}
          onClose={() => {
            setIsFormOpen(false);
            resetForm();
          }}
          onSubmit={handleSubmitApplication}
          setFormError={setFormError}
          setNewApp={setNewApp}
        />

        <div className="applications-grid fade-in">
          {filteredAndSortedApps.map((app, index) => {
            const salaryBadge = getSalaryBadgeData(app, lang);
            const nextStepDate = getNextStepDate(app);
            const selected = selectedIds.includes(app.id);

            return (
              <JobCard
                key={app.id}
                activeNoteId={activeNoteId}
                animationDelay={`${index * 0.05}s`}
                app={app}
                displaySalary={getDisplaySalary(app, lang)}
                employmentLabel={employmentLabels[lang][app.employmentType]}
                formatCardDate={(date) => formatCardDate(date, lang)}
                lang={lang}
                nextStepDate={nextStepDate}
                onDelete={handleDeleteApplication}
                onEdit={handleEditApplication}
                onOpenStatusPicker={(targetApp) => setActiveStatusPickerId(targetApp.id)}
                onToggleNote={(id) => setActiveNoteId(activeNoteId === id ? null : id)}
                onToggleSelection={toggleSelectedApplication}
                portalIcon={getPortalIcon(app.portal)}
                salaryBadge={salaryBadge}
                selected={selected}
                selectionMode={isSelectionMode}
                seniorityLabel={seniorityLabels[lang][getSeniority(app)]}
                statusLabel={statusLabels[lang][app.status]}
                workModeLabel={workModeLabels[lang][getWorkMode(app)]}
              />
            );
          })}
        </div>

        {activeNoteApp && (
          <NotesModal
            app={activeNoteApp}
            deadlineLabel={getNextStepDate(activeNoteApp) ? getNextStepBadgeLabel(activeNoteApp, lang) : null}
            lang={lang}
            onAppendTemplate={appendNoteTemplate}
            onClose={() => setActiveNoteId(null)}
            onUpdate={handleNoteUpdate}
          />
        )}

        {pendingDeleteApps && pendingDeleteApps.length > 0 && (
          <ConfirmDeleteModal
            applications={pendingDeleteApps}
            lang={lang}
            onCancel={() => setPendingDeleteApps(null)}
            onConfirm={confirmDeleteApplication}
          />
        )}

        {modalType && (
          <StatusListModal
            formatCardDate={(date) => formatCardDate(date, lang)}
            jobs={filteredModalJobs}
            lang={lang}
            onClose={() => setModalType(null)}
            theme={theme}
          />
        )}

        {activeStatusPickerApp && (
          <OptionPickerModal<DashboardStatus>
            closeLabel={lang === 'pl' ? 'Zamknij wybor statusu' : 'Close status picker'}
            title={lang === 'pl' ? 'Zmien status oferty' : 'Change application status'}
            subtitle={`${activeStatusPickerApp.company} • ${activeStatusPickerApp.position}`}
            options={statusPickerOptions}
            selectedValue={activeStatusPickerApp.status}
            onSelect={(value) => handleStatusChange(activeStatusPickerApp.id, value)}
            onClose={() => setActiveStatusPickerId(null)}
          />
        )}

        {activeBulkPicker === 'status' && (
          <OptionPickerModal<DashboardStatus>
            closeLabel={lang === 'pl' ? 'Zamknij modal akcji zbiorczej' : 'Close bulk action modal'}
            title={lang === 'pl' ? 'Zmien status zaznaczonych' : 'Change selected status'}
            subtitle={
              lang === 'pl'
                ? `${selectedIds.length} ofert otrzyma nowy status.`
                : `${selectedIds.length} applications will receive a new status.`
            }
            options={bulkStatusPickerOptions}
            selectedValue={selectedApplications[0]?.status ?? 'sent'}
            onSelect={handleBulkStatusChange}
            onClose={() => setActiveBulkPicker(null)}
          />
        )}

        {activeBulkPicker === 'workMode' && (
          <OptionPickerModal<WorkMode>
            closeLabel={lang === 'pl' ? 'Zamknij modal akcji zbiorczej' : 'Close bulk action modal'}
            title={lang === 'pl' ? 'Zmien tryb pracy' : 'Change work mode'}
            subtitle={
              lang === 'pl'
                ? `${selectedIds.length} ofert otrzyma nowy tryb pracy.`
                : `${selectedIds.length} applications will receive a new work mode.`
            }
            options={workModePickerOptions}
            selectedValue={selectedApplications[0]?.workMode ?? 'remote'}
            onSelect={handleBulkWorkModeChange}
            onClose={() => setActiveBulkPicker(null)}
          />
        )}

        {activeBulkPicker === 'employment' && (
          <OptionPickerModal<EmploymentType>
            closeLabel={lang === 'pl' ? 'Zamknij modal akcji zbiorczej' : 'Close bulk action modal'}
            title={lang === 'pl' ? 'Zmien typ umowy' : 'Change contract type'}
            subtitle={
              lang === 'pl'
                ? `${selectedIds.length} ofert otrzyma nowy typ umowy.`
                : `${selectedIds.length} applications will receive a new contract type.`
            }
            options={employmentBulkPickerOptions}
            selectedValue={selectedApplications[0]?.employmentType ?? 'B2B'}
            onSelect={handleBulkEmploymentChange}
            onClose={() => setActiveBulkPicker(null)}
          />
        )}

        {activeFilterPicker === 'status' && (
          <OptionPickerModal<FilterStatus>
            closeLabel={lang === 'pl' ? 'Zamknij filtrowanie' : 'Close filter picker'}
            title={lang === 'pl' ? 'Filtruj po statusie' : 'Filter by status'}
            subtitle={
              lang === 'pl'
                ? `Pasuje teraz ${statusFilterCounts[statusFilter]} ofert.`
                : `${statusFilterCounts[statusFilter]} applications match right now.`
            }
            options={statusFilterPickerOptions}
            selectedValue={statusFilter}
            onSelect={setStatusFilter}
            onClose={() => setActiveFilterPicker(null)}
          />
        )}

        {activeFilterPicker === 'portal' && (
          <OptionPickerModal<FilterPortal>
            closeLabel={lang === 'pl' ? 'Zamknij filtrowanie' : 'Close filter picker'}
            title={lang === 'pl' ? 'Filtruj po portalu' : 'Filter by portal'}
            subtitle={
              lang === 'pl'
                ? `Pasuje teraz ${portalFilterCounts[portalFilter] ?? 0} ofert.`
                : `${portalFilterCounts[portalFilter] ?? 0} applications match right now.`
            }
            options={portalFilterPickerOptions}
            selectedValue={portalFilter}
            onSelect={setPortalFilter}
            onClose={() => setActiveFilterPicker(null)}
          />
        )}

        {activeFilterPicker === 'employment' && (
          <OptionPickerModal<FilterEmployment>
            closeLabel={lang === 'pl' ? 'Zamknij filtrowanie' : 'Close filter picker'}
            title={lang === 'pl' ? 'Filtruj po typie umowy' : 'Filter by contract type'}
            subtitle={
              lang === 'pl'
                ? `Pasuje teraz ${employmentFilterCounts[employmentFilter]} ofert.`
                : `${employmentFilterCounts[employmentFilter]} applications match right now.`
            }
            options={employmentFilterPickerOptions}
            selectedValue={employmentFilter}
            onSelect={setEmploymentFilter}
            onClose={() => setActiveFilterPicker(null)}
          />
        )}
      </main>
    </div>
  );
};

export default Dashboard;

