import type { DashboardLang } from '../types';

interface BulkActionsBarProps {
  lang: DashboardLang;
  onBulkDelete: () => void;
  onClearSelection: () => void;
  onOpenBulkEmploymentPicker: () => void;
  onOpenBulkStatusPicker: () => void;
  onOpenBulkWorkModePicker: () => void;
  onSelectVisible: () => void;
  selectedCount: number;
  visibleSelectedCount: number;
}

export function BulkActionsBar({
  lang,
  onBulkDelete,
  onClearSelection,
  onOpenBulkEmploymentPicker,
  onOpenBulkStatusPicker,
  onOpenBulkWorkModePicker,
  onSelectVisible,
  selectedCount,
  visibleSelectedCount,
}: BulkActionsBarProps) {
  return (
    <div className={`bulk-actions-bar fade-in ${selectedCount > 0 ? 'has-selection' : ''}`}>
      <div className="bulk-actions-copy">
        <span className="bulk-actions-kicker">{lang === 'pl' ? 'Akcje zbiorcze' : 'Bulk actions'}</span>
        <p>
          {lang === 'pl' ? (
            <>
              Zaznaczono <span className="bulk-count">{selectedCount}</span> ofert.
              Widocznych zaznaczen: <span className="bulk-count">{visibleSelectedCount}</span>.
            </>
          ) : (
            <>
              <span className="bulk-count">{selectedCount}</span> applications selected.
              Visible selected: <span className="bulk-count">{visibleSelectedCount}</span>.
            </>
          )}
        </p>
      </div>

      <div className="bulk-actions-buttons">
        <button type="button" className="bulk-action-btn highlight" onClick={onSelectVisible}>
          <span className="bulk-action-btn-icon" aria-hidden="true">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
            </svg>
          </span>
          <span>{lang === 'pl' ? 'Zaznacz widoczne' : 'Select visible'}</span>
        </button>
        <button type="button" className="bulk-action-btn" onClick={onClearSelection}>
          <span className="bulk-action-btn-icon" aria-hidden="true">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </span>
          <span>{lang === 'pl' ? 'Wyczysc' : 'Clear'}</span>
        </button>
        <button
          type="button"
          className="bulk-picker-btn status"
          disabled={selectedCount === 0}
          onClick={onOpenBulkStatusPicker}
        >
          <span className="bulk-picker-btn-icon" aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 2L11 13" />
              <path d="M22 2L15 22L11 13L2 9L22 2Z" />
            </svg>
          </span>
          <span className="bulk-picker-btn-copy">
            <span className="bulk-picker-btn-label">{lang === 'pl' ? 'Zmien status' : 'Change status'}</span>
            <span className="bulk-picker-btn-meta">{lang === 'pl' ? 'Modal wyboru' : 'Open picker'}</span>
          </span>
        </button>
        <button
          type="button"
          className="bulk-picker-btn workmode"
          disabled={selectedCount === 0}
          onClick={onOpenBulkWorkModePicker}
        >
          <span className="bulk-picker-btn-icon" aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 21h18" />
              <path d="M5 21V8l7-5 7 5v13" />
              <path d="M9 12h6" />
            </svg>
          </span>
          <span className="bulk-picker-btn-copy">
            <span className="bulk-picker-btn-label">{lang === 'pl' ? 'Zmien tryb pracy' : 'Change work mode'}</span>
            <span className="bulk-picker-btn-meta">{lang === 'pl' ? 'Remote / Hybrid / Onsite' : 'Remote / Hybrid / Onsite'}</span>
          </span>
        </button>
        <button
          type="button"
          className="bulk-picker-btn employment"
          disabled={selectedCount === 0}
          onClick={onOpenBulkEmploymentPicker}
        >
          <span className="bulk-picker-btn-icon" aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
              <path d="M14 3v5h5" />
              <path d="M9 13h6" />
              <path d="M9 17h4" />
            </svg>
          </span>
          <span className="bulk-picker-btn-copy">
            <span className="bulk-picker-btn-label">{lang === 'pl' ? 'Zmien umowe' : 'Change contract'}</span>
            <span className="bulk-picker-btn-meta">{lang === 'pl' ? 'B2B / UoP / UZ...' : 'B2B / Employment / ...'}</span>
          </span>
        </button>
        <button
          type="button"
          className="bulk-action-btn danger"
          disabled={selectedCount === 0}
          onClick={onBulkDelete}
        >
          <span className="bulk-action-btn-icon" aria-hidden="true">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18" />
              <path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
              <line x1="10" y1="11" x2="10" y2="17" />
              <line x1="14" y1="11" x2="14" y2="17" />
            </svg>
          </span>
          <span>{lang === 'pl' ? 'Usun zaznaczone' : 'Delete selected'}</span>
        </button>
      </div>
    </div>
  );
}
