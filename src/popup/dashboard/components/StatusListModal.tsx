import { createPortal } from 'react-dom';
import { useRef } from 'react';

import { getPortalIcon, shouldCloseOverlay } from '../utils';
import type { DashboardLang, JobApplication } from '../types';

interface StatusListTheme {
  color: string;
  title: string;
}

interface StatusListModalProps {
  formatCardDate: (date: string) => string;
  jobs: JobApplication[];
  lang: DashboardLang;
  onClose: () => void;
  theme: StatusListTheme;
}

export function StatusListModal({
  formatCardDate,
  jobs,
  lang,
  onClose,
  theme,
}: StatusListModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  return createPortal(
    <div
      className="modal-overlay fade-in"
      onClick={(event) => {
        if (shouldCloseOverlay(event, modalRef.current)) {
          onClose();
        }
      }}
    >
      <div
        ref={modalRef}
        className="interview-modal"
        onClick={(event) => event.stopPropagation()}
        style={{ borderColor: theme.color }}
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-header">
          <div className="modal-header-main">
            <div className="modal-status-icon" style={{ color: theme.color, borderColor: theme.color }}>
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
              {jobs.length} {lang === 'pl' ? 'ofert' : 'jobs'}
            </span>
            <button
              type="button"
              className="close-modal"
              onClick={onClose}
              aria-label={lang === 'pl' ? 'Zamknij przeglad statusu' : 'Close status overview'}
              title={lang === 'pl' ? 'Zamknij' : 'Close'}
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
          </div>
        </div>

        <div className="modal-body">
          {jobs.length > 0 ? (
            jobs.map((job) => (
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
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
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
  );
}
