import { useEffect, useRef, useState } from 'react';

import type { CustomSelectProps } from '../types';

export function CustomSelect<T extends string>({
  value,
  options,
  onChange,
  className = '',
  align = 'left',
  getOptionClassName,
}: CustomSelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find((option) => option.value === value) ?? options[0];

  return (
    <div
      ref={selectRef}
      className={`custom-select ${isOpen ? 'open' : ''} ${align === 'right' ? 'align-right' : ''} ${className}`.trim()}
    >
      <button
        type="button"
        className="custom-select-trigger"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span className="custom-select-value">{selectedOption.label}</span>
        <span className="custom-select-chevron" aria-hidden="true">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </button>

      {isOpen && (
        <div className="custom-select-menu">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`custom-select-option ${option.value === value ? 'selected' : ''} ${getOptionClassName ? getOptionClassName(option.value) : ''}`.trim()}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
