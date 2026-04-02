import { useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';

import { getPortalIcon, shouldCloseOverlay } from '../utils';
import type { DashboardLang, JobApplication } from '../types';

interface NotesModalProps {
  app: JobApplication;
  deadlineLabel?: string | null;
  lang: DashboardLang;
  onAppendTemplate: (id: number, template: string) => void;
  onClose: () => void;
  onUpdate: (id: number, text: string) => void;
}

export function NotesModal({
  app,
  deadlineLabel,
  lang,
  onAppendTemplate,
  onClose,
  onUpdate,
}: NotesModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  const notesPlaceholder =
    lang === 'pl'
      ? 'Dodaj notatki po rozmowie, dane rekrutera lub kolejne kroki...'
      : 'Add interview notes, recruiter details or next steps...';

  const noteTemplates = useMemo(() => {
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
        label: 'Follow-up',
        text:
          lang === 'pl'
            ? `[${today}] Kolejny krok\n- Termin:\n- Co przygotowac:\n`
            : `[${today}] Next step\n- Due date:\n- Prepare:\n`,
      },
    ];
  }, [app.company, lang]);

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
        className="notes-modal"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="notes-modal-header">
          <div className="notes-modal-main">
            <span className="notes-modal-logo">
              <img src={getPortalIcon(app.portal)} alt={app.portal} className="notes-modal-logo-image" />
            </span>
            <div className="notes-modal-copy">
              <span className="notes-kicker">{lang === 'pl' ? 'Prywatne notatki' : 'Private notes'}</span>
              <h3>{app.company}</h3>
              <p>
                {app.position} · {app.portal}
              </p>
            </div>
          </div>

          <button
            type="button"
            className="close-modal notes-modal-close"
            onClick={onClose}
            aria-label={lang === 'pl' ? 'Zamknij notatki' : 'Close notes'}
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

        <div className="notes-modal-actions">
          <div className="notes-meta">
            <span className="notes-saved-badge">{lang === 'pl' ? 'Auto zapis' : 'Auto save'}</span>
            {deadlineLabel && <span className="notes-deadline-badge">{deadlineLabel}</span>}
          </div>
        </div>

        <div className="notes-modal-body">
          <p className="notes-helper notes-modal-helper">
            {lang === 'pl'
              ? 'Zapis odbywa sie automatycznie. Zbieraj ustalenia z rekruterem, feedback po rozmowie i kolejne kroki w jednym miejscu.'
              : 'Saved automatically. Capture recruiter context, interview feedback and next steps in one place.'}
          </p>

          <div className="note-shortcuts">
            {noteTemplates.map((template) => (
              <button
                key={template.label}
                type="button"
                className="note-shortcut-btn"
                onClick={() => onAppendTemplate(app.id, template.text)}
              >
                + {template.label}
              </button>
            ))}
          </div>

          <textarea
            className="notes-textarea notes-textarea-modal"
            value={app.notes || ''}
            onChange={(event) => onUpdate(app.id, event.target.value)}
            placeholder={notesPlaceholder}
          />

          <div className="notes-footer">
            <span className="notes-count">
              {(app.notes || '').trim().length} {lang === 'pl' ? 'znakow' : 'chars'}
            </span>
            <span className="notes-status-copy">
              {lang === 'pl'
                ? 'Widoczne tylko w Twoim demo dashboardzie.'
                : 'Visible only in your demo dashboard.'}
            </span>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
