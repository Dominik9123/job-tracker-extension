import { createPortal } from 'react-dom';
import { useRef } from 'react';

import { shouldCloseOverlay } from '../utils';
import type { DashboardLang, JobApplication } from '../types';

interface ConfirmDeleteModalProps {
  applications: JobApplication[];
  lang: DashboardLang;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ConfirmDeleteModal({
  applications,
  lang,
  onCancel,
  onConfirm,
}: ConfirmDeleteModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  return createPortal(
    <div
      className="modal-overlay fade-in"
      onClick={(event) => {
        if (shouldCloseOverlay(event, modalRef.current)) {
          onCancel();
        }
      }}
    >
      <div
        ref={modalRef}
        className="confirm-modal"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <button
          type="button"
          className="close-modal confirm-modal-close"
          onClick={onCancel}
          aria-label={lang === 'pl' ? 'Zamknij modal usuwania' : 'Close delete modal'}
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

        <div className="confirm-modal-icon" aria-hidden="true">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
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
            {applications.length === 1
              ? lang === 'pl'
                ? 'Usunac te oferte?'
                : 'Delete this application?'
              : lang === 'pl'
                ? `Usunac ${applications.length} ofert?`
                : `Delete ${applications.length} applications?`}
          </h3>
          <p>
            {applications.length === 1
              ? lang === 'pl'
                ? `Oferta ${applications[0].company} - ${applications[0].position} zostanie usunieta z dashboardu.`
                : `${applications[0].company} - ${applications[0].position} will be removed from your dashboard.`
              : lang === 'pl'
                ? 'Wszystkie zaznaczone oferty zostana usuniete z dashboardu.'
                : 'All selected applications will be removed from your dashboard.'}
          </p>
        </div>

        <div className="confirm-modal-card">
          {applications.length === 1 ? (
            <>
              <span className="confirm-modal-company">{applications[0].company}</span>
              <span className="confirm-modal-position">{applications[0].position}</span>
              <span className="confirm-modal-portal">{applications[0].portal}</span>
            </>
          ) : (
            <>
              <span className="confirm-modal-company">
                {lang === 'pl'
                  ? `${applications.length} zaznaczonych ofert`
                  : `${applications.length} selected applications`}
              </span>
              <span className="confirm-modal-position">
                {applications
                  .slice(0, 3)
                  .map((app) => app.company)
                  .join(', ')}
                {applications.length > 3 ? '...' : ''}
              </span>
              <span className="confirm-modal-portal">
                {lang === 'pl' ? 'Akcja grupowa' : 'Bulk action'}
              </span>
            </>
          )}
        </div>

        <div className="confirm-modal-actions">
          <button type="button" className="form-secondary-btn" onClick={onCancel}>
            {lang === 'pl' ? 'Anuluj' : 'Cancel'}
          </button>
          <button type="button" className="confirm-delete-btn" onClick={onConfirm}>
            {lang === 'pl' ? 'Usun oferte' : 'Delete job'}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
