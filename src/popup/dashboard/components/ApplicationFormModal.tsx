import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { CustomSelect } from './CustomSelect';
import { getPortalIcon, sanitizeAmountInput, shouldCloseOverlay } from '../utils';
import type {
  DashboardLang,
  EmploymentType,
  NewApplicationForm,
  SalaryCurrency,
  SalaryMode,
  SelectOption,
  Seniority,
  WorkMode,
} from '../types';

interface ApplicationFormModalProps {
  editingId: number | null;
  formError: string;
  isOpen: boolean;
  lang: DashboardLang;
  newApp: NewApplicationForm;
  onClose: () => void;
  onSubmit: (event: React.FormEvent) => void;
  setFormError: (value: string) => void;
  setNewApp: React.Dispatch<React.SetStateAction<NewApplicationForm>>;
}

const PORTAL_OPTIONS = ['LinkedIn', 'Pracuj.pl', 'OLX', 'JustJoin.it', 'NoFluffJobs'] as const;
const STEP_COUNT = 3;

export function ApplicationFormModal({
  editingId,
  formError,
  isOpen,
  lang,
  newApp,
  onClose,
  onSubmit,
  setFormError,
  setNewApp,
}: ApplicationFormModalProps) {
  const [step, setStep] = useState(0);
  const modalRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    setStep(0);

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [editingId, isOpen, onClose]);

  const selectedPortalOption = useMemo(
    () => (PORTAL_OPTIONS.includes(newApp.portal as (typeof PORTAL_OPTIONS)[number]) ? newApp.portal : 'Other'),
    [newApp.portal],
  );

  const stepLabels: Record<DashboardLang, string[]> = {
    pl: ['Podstawy', 'Wynagrodzenie', 'Szczegoly'],
    en: ['Basics', 'Salary', 'Details'],
  };

  const currencyOptions: Array<SelectOption<SalaryCurrency>> = [
    { value: 'PLN', label: 'PLN' },
    { value: 'EUR', label: 'EUR' },
    { value: 'USD', label: 'USD' },
    { value: 'GBP', label: 'GBP' },
    { value: 'CHF', label: 'CHF' },
  ];

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

  const employmentOptions: Array<SelectOption<EmploymentType>> = [
    { value: 'B2B', label: employmentLabels[lang].B2B },
    { value: 'UoP', label: employmentLabels[lang].UoP },
    { value: 'UZ', label: employmentLabels[lang].UZ },
    { value: 'UoD', label: employmentLabels[lang].UoD },
    { value: 'Internship', label: employmentLabels[lang].Internship },
  ];

  const salaryModeLabels: Record<DashboardLang, Record<SalaryMode, string>> = {
    pl: { net: 'Netto', gross: 'Brutto' },
    en: { net: 'Net', gross: 'Gross' },
  };

  const salaryModeOptions: Array<SelectOption<SalaryMode>> = [
    { value: 'net', label: salaryModeLabels[lang].net },
    { value: 'gross', label: salaryModeLabels[lang].gross },
  ];

  const workModeLabels: Record<DashboardLang, Record<WorkMode, string>> = {
    pl: { remote: 'Remote', hybrid: 'Hybrid', onsite: 'Onsite' },
    en: { remote: 'Remote', hybrid: 'Hybrid', onsite: 'Onsite' },
  };

  const workModeOptions: Array<SelectOption<WorkMode>> = [
    { value: 'remote', label: workModeLabels[lang].remote },
    { value: 'hybrid', label: workModeLabels[lang].hybrid },
    { value: 'onsite', label: workModeLabels[lang].onsite },
  ];

  const seniorityOptions: Array<SelectOption<Seniority>> = [
    { value: 'junior', label: 'Junior' },
    { value: 'mid', label: 'Mid' },
    { value: 'senior', label: 'Senior' },
    { value: 'lead', label: 'Lead' },
  ];

  const canGoNext =
    step !== 0 ||
    Boolean(newApp.company.trim() && newApp.position.trim() && newApp.portal.trim());

  if (!isOpen) return null;

  return createPortal(
    <div
      className="modal-overlay fade-in"
      onClick={(event) => {
        if (shouldCloseOverlay(event, modalRef.current)) {
          onClose();
        }
      }}
    >
      <form
        ref={modalRef}
        className="form-modal"
        onClick={(event) => event.stopPropagation()}
        onSubmit={onSubmit}
      >
        <div className="form-modal-header">
          <div>
            <span className="form-kicker">{editingId !== null ? 'EDIT MODE' : 'NEW ENTRY'}</span>
            <h3 className="form-modal-title">
              {editingId !== null
                ? lang === 'pl'
                  ? 'Edytuj oferte krok po kroku'
                  : 'Edit application step by step'
                : lang === 'pl'
                  ? 'Dodaj oferte krok po kroku'
                  : 'Add an application step by step'}
            </h3>
            <p className="form-modal-subtitle">
              {lang === 'pl'
                ? 'Przejdz przez 3 krotkie kroki i zapisz uporzadkowana oferte.'
                : 'Move through 3 short steps and save a cleaner application.'}
            </p>
          </div>

          <button
            type="button"
            className="close-modal"
            onClick={onClose}
            aria-label={lang === 'pl' ? 'Zamknij formularz oferty' : 'Close application form'}
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

        <div className="form-stepper">
          {stepLabels[lang].map((label, index) => (
            <button
              key={label}
              type="button"
              className={`form-step-chip ${step === index ? 'active' : ''} ${step > index ? 'completed' : ''}`}
              onClick={() => setStep(index)}
            >
              <span className="form-step-index">{index + 1}</span>
              <span className="form-step-label">{label}</span>
            </button>
          ))}
        </div>

        <div className="form-modal-body">
          {step === 0 && (
            <div className="form-step-panel">
              <div className="form-grid">
                <label className="form-field">
                  <span className="form-label">{lang === 'pl' ? 'Firma' : 'Company'}</span>
                  <input
                    type="text"
                    placeholder={lang === 'pl' ? 'np. Allegro' : 'e.g. Allegro'}
                    required
                    value={newApp.company}
                    onChange={(event) => setNewApp({ ...newApp, company: event.target.value })}
                  />
                </label>

                <label className="form-field">
                  <span className="form-label">{lang === 'pl' ? 'Stanowisko' : 'Position'}</span>
                  <input
                    type="text"
                    placeholder={lang === 'pl' ? 'np. Frontend Developer' : 'e.g. Frontend Developer'}
                    required
                    value={newApp.position}
                    onChange={(event) => setNewApp({ ...newApp, position: event.target.value })}
                  />
                </label>
              </div>

              <div className="form-field form-field-wide">
                <span className="form-label">{lang === 'pl' ? 'Portal' : 'Portal'}</span>
                <div className="portal-choice-grid">
                  {PORTAL_OPTIONS.map((portal) => (
                    <button
                      key={portal}
                      type="button"
                      className={`portal-choice-card ${selectedPortalOption === portal ? 'active' : ''}`}
                      onClick={() => {
                        setFormError('');
                        setNewApp((prev) => ({ ...prev, portal }));
                      }}
                    >
                      <span className="portal-choice-icon">
                        <img src={getPortalIcon(portal)} alt={portal} className="portal-choice-image" />
                      </span>
                      <span>{portal}</span>
                    </button>
                  ))}

                  <button
                    type="button"
                    className={`portal-choice-card ${selectedPortalOption === 'Other' ? 'active' : ''}`}
                    onClick={() => {
                      setFormError('');
                      setNewApp((prev) => ({
                        ...prev,
                        portal: PORTAL_OPTIONS.includes(prev.portal as (typeof PORTAL_OPTIONS)[number]) ? '' : prev.portal,
                      }));
                    }}
                  >
                    <span className="portal-choice-icon portal-choice-icon-text">+</span>
                    <span>{lang === 'pl' ? 'Inny portal' : 'Other portal'}</span>
                  </button>
                </div>
              </div>

              {selectedPortalOption === 'Other' && (
                <label className="form-field form-field-wide">
                  <span className="form-label">{lang === 'pl' ? 'Nazwa portalu' : 'Portal name'}</span>
                  <input
                    type="text"
                    placeholder={lang === 'pl' ? 'np. Bulldogjob' : 'e.g. Bulldogjob'}
                    required
                    value={PORTAL_OPTIONS.includes(newApp.portal as (typeof PORTAL_OPTIONS)[number]) ? '' : newApp.portal}
                    onChange={(event) => setNewApp({ ...newApp, portal: event.target.value })}
                  />
                </label>
              )}
            </div>
          )}

          {step === 1 && (
            <div className="form-step-panel">
              <div className="form-grid">
                <div className="form-field form-field-wide">
                  <span className="form-label">{lang === 'pl' ? 'Widelki wynagrodzenia' : 'Salary range'}</span>
                  <div className="salary-range-group">
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder={lang === 'pl' ? 'Od, np. 12000' : 'From, e.g. 12000'}
                      value={newApp.salaryFrom}
                      onChange={(event) => {
                        setFormError('');
                        setNewApp({ ...newApp, salaryFrom: sanitizeAmountInput(event.target.value) });
                      }}
                    />
                    <span className="salary-range-separator">-</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder={lang === 'pl' ? 'Do, np. 18000' : 'To, e.g. 18000'}
                      value={newApp.salaryTo}
                      onChange={(event) => {
                        setFormError('');
                        setNewApp({ ...newApp, salaryTo: sanitizeAmountInput(event.target.value) });
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
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="form-step-panel">
              <div className="form-grid">
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

                <label className="form-field">
                  <span className="form-label">{lang === 'pl' ? 'Data kolejnego etapu' : 'Next step date'}</span>
                  <input
                    type="date"
                    value={newApp.nextStepDate}
                    onChange={(event) => setNewApp({ ...newApp, nextStepDate: event.target.value })}
                  />
                </label>

                <label className="form-field">
                  <span className="form-label">{lang === 'pl' ? 'Link do oferty' : 'Job link'}</span>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={newApp.link}
                    onChange={(event) => setNewApp({ ...newApp, link: event.target.value })}
                  />
                </label>
              </div>
            </div>
          )}

          {formError && <p className="form-error form-error-modal">{formError}</p>}
        </div>

        <div className="form-modal-actions">
          <button
            type="button"
            className="form-secondary-btn"
            onClick={step === 0 ? onClose : () => setStep((prev) => prev - 1)}
          >
            {step === 0 ? (lang === 'pl' ? 'Anuluj' : 'Cancel') : lang === 'pl' ? 'Wstecz' : 'Back'}
          </button>

          {step < STEP_COUNT - 1 ? (
            <button
              type="button"
              className="submit-job-btn"
              onClick={() => setStep((prev) => prev + 1)}
              disabled={!canGoNext}
            >
              {lang === 'pl' ? 'Dalej' : 'Next'}
            </button>
          ) : (
            <button type="submit" className="submit-job-btn">
              {editingId !== null
                ? lang === 'pl'
                  ? 'Zapisz zmiany'
                  : 'Save changes'
                : lang === 'pl'
                  ? 'Zapisz oferte'
                  : 'Save application'}
            </button>
          )}
        </div>
      </form>
    </div>,
    document.body,
  );
}
