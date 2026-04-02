import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';

import { shouldCloseOverlay } from '../utils';

export interface OptionPickerItem<T extends string> {
  value: T;
  label: string;
  badge?: string;
  description?: string;
  icon?: ReactNode;
  iconSrc?: string;
  toneClassName?: string;
}

interface OptionPickerModalProps<T extends string> {
  closeLabel?: string;
  options: Array<OptionPickerItem<T>>;
  onClose: () => void;
  onSelect: (value: T) => void;
  selectedValue: T;
  subtitle?: string;
  title: string;
}

export function OptionPickerModal<T extends string>({
  closeLabel,
  options,
  onClose,
  onSelect,
  selectedValue,
  subtitle,
  title,
}: OptionPickerModalProps<T>) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

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
        className="picker-modal"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="picker-modal-header">
          <div className="picker-modal-copy">
            <span className="picker-modal-kicker">PICKER</span>
            <h3>{title}</h3>
            {subtitle ? <p>{subtitle}</p> : null}
          </div>
          <button
            type="button"
            className="close-modal picker-modal-close"
            onClick={onClose}
            aria-label={closeLabel ?? 'Close picker'}
            title={closeLabel ?? 'Close'}
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

        <div className="picker-modal-body">
          {options.map((option) => {
            const isSelected = option.value === selectedValue;

            return (
              <button
                key={option.value}
                type="button"
                className={`picker-option ${isSelected ? 'selected' : ''} ${option.toneClassName ?? ''}`.trim()}
                onClick={() => {
                  onSelect(option.value);
                  onClose();
                }}
              >
                <span className="picker-option-main">
                  {option.iconSrc ? (
                    <span className="picker-option-icon">
                      <img src={option.iconSrc} alt="" className="picker-option-image" />
                    </span>
                  ) : option.icon ? (
                    <span className="picker-option-icon custom" aria-hidden="true">
                      {option.icon}
                    </span>
                  ) : (
                    <span className="picker-option-dot" aria-hidden="true" />
                  )}
                  <span className="picker-option-copy">
                    <span className="picker-option-label">{option.label}</span>
                    {option.description ? (
                      <span className="picker-option-description">{option.description}</span>
                    ) : null}
                  </span>
                </span>

                <span className="picker-option-side">
                  {option.badge ? <span className="picker-option-badge">{option.badge}</span> : null}
                  <span className={`picker-option-check ${isSelected ? 'visible' : ''}`} aria-hidden="true">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>,
    document.body,
  );
}
