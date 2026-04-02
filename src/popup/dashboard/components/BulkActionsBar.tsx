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
          {lang === 'pl' ? 'Zaznacz widoczne' : 'Select visible'}
        </button>
        <button type="button" className="bulk-action-btn" onClick={onClearSelection}>
          {lang === 'pl' ? 'Wyczysc' : 'Clear'}
        </button>
        <button
          type="button"
          className="bulk-picker-btn"
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
          className="bulk-picker-btn"
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
          className="bulk-picker-btn"
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
          {lang === 'pl' ? 'Usun zaznaczone' : 'Delete selected'}
        </button>
      </div>
    </div>
  );
}
