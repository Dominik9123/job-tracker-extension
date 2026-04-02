import type {
  DashboardLang,
  EmploymentType,
  JobApplication,
} from '../types';

interface SalaryBadgeData {
  amount: string;
  employmentType: EmploymentType;
  salaryModeLabel: string;
}

interface JobCardProps {
  activeNoteId: number | null;
  animationDelay: string;
  app: JobApplication;
  displaySalary: string;
  employmentLabel: string;
  formatCardDate: (date: string) => string;
  lang: DashboardLang;
  nextStepDate: string;
  onDelete: (id: number) => void;
  onEdit: (app: JobApplication) => void;
  onOpenStatusPicker: (app: JobApplication) => void;
  onToggleNote: (id: number) => void;
  onToggleSelection: (id: number) => void;
  portalIcon: string;
  salaryBadge: SalaryBadgeData;
  selected: boolean;
  selectionMode: boolean;
  seniorityLabel: string;
  statusLabel: string;
  workModeLabel: string;
}

export function JobCard({
  activeNoteId,
  animationDelay,
  app,
  displaySalary,
  employmentLabel,
  formatCardDate,
  lang,
  nextStepDate,
  onDelete,
  onEdit,
  onOpenStatusPicker,
  onToggleNote,
  onToggleSelection,
  portalIcon,
  salaryBadge,
  selected,
  selectionMode,
  seniorityLabel,
  statusLabel,
  workModeLabel,
}: JobCardProps) {
  return (
    <div
      className={`job-card ${app.status} ${selected ? 'selected' : ''} fade-in-stagger`}
      style={{ animationDelay }}
    >
      <div className="card-topbar">
        <div className="card-topbar-left">
          {selectionMode && (
            <button
              type="button"
              className={`card-select-toggle ${selected ? 'selected' : ''}`}
              onClick={() => onToggleSelection(app.id)}
              aria-label={lang === 'pl' ? 'Zaznacz oferte' : 'Select application'}
            >
              <span className="card-select-toggle-mark" aria-hidden="true">
                {selected ? '✓' : ''}
              </span>
            </button>
          )}
          <span className={`card-status-pill ${app.status}`}>{statusLabel}</span>
        </div>

        <div className="card-actions-overlay">
          <button
            type="button"
            className="edit-card-btn"
            onClick={() => onEdit(app)}
            aria-label={lang === 'pl' ? 'Edytuj oferte' : 'Edit job'}
            data-tooltip={lang === 'pl' ? 'Edytuj oferte' : 'Edit application'}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.12 2.12 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
            </svg>
          </button>

          <button
            type="button"
            className="remove-card-btn"
            onClick={() => onDelete(app.id)}
            aria-label={lang === 'pl' ? 'Usun oferte' : 'Delete job'}
            data-tooltip={lang === 'pl' ? 'Usun oferte' : 'Delete application'}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          <button
            type="button"
            className={`note-toggle-btn ${app.notes ? 'has-note' : ''} ${activeNoteId === app.id ? 'open' : ''}`}
            onClick={() => onToggleNote(app.id)}
            aria-label={lang === 'pl' ? 'Pokaz notatki' : 'Show notes'}
            data-tooltip={lang === 'pl' ? 'Pokaz notatki' : 'Show notes'}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
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
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </a>
        </div>
      </div>

      <div className="card-header">
        <div className="card-company-logo">
          <img className="card-logo-image" src={portalIcon} alt={app.portal} />
        </div>
        <span className="card-salary" title={displaySalary}>
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
          <span className="card-tag">{workModeLabel}</span>
          <span className="card-tag subtle">{employmentLabel}</span>
          <span className="card-tag accent">{seniorityLabel}</span>
        </div>
      </div>

      <div className="card-meta">
        <div className="card-meta-item">
          <span className="card-meta-label">{lang === 'pl' ? 'Dodano' : 'Added'}</span>
          <span className="card-meta-value">{formatCardDate(app.date)}</span>
        </div>
        <div className="card-meta-item">
          <span className="card-meta-label">{lang === 'pl' ? 'Kolejny etap' : 'Next step'}</span>
          <span className="card-meta-value">{nextStepDate ? formatCardDate(nextStepDate) : '---'}</span>
        </div>
      </div>

      <div className="card-footer">
        <div className="card-status-copy">
          <span className="card-footer-label">{lang === 'pl' ? 'Zmien status' : 'Update status'}</span>
        </div>

        <button
          type="button"
          className={`card-status-picker ${app.status}`}
          onClick={() => onOpenStatusPicker(app)}
        >
          <span className="card-status-picker-label">{statusLabel}</span>
          <span className="card-status-picker-chevron" aria-hidden="true">
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
      </div>
    </div>
  );
}
