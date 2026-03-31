import React from 'react';

import type { JobApplication, Seniority, WorkMode } from './types';

export const sanitizeAmountInput = (value: string) => value.replace(/[^\d]/g, '');

export const inferSeniority = (position: string): Seniority => {
  const normalizedPosition = position.toLowerCase();

  if (
    normalizedPosition.includes('lead') ||
    normalizedPosition.includes('architect') ||
    normalizedPosition.includes('principal')
  ) {
    return 'lead';
  }

  if (normalizedPosition.includes('senior')) {
    return 'senior';
  }

  if (normalizedPosition.includes('junior') || normalizedPosition.includes('intern')) {
    return 'junior';
  }

  return 'mid';
};

export const getSeniority = (app: JobApplication): Seniority =>
  app.seniority ?? inferSeniority(app.position);

export const getWorkMode = (app: JobApplication): WorkMode => {
  if (app.workMode) return app.workMode;
  if (app.company === 'Allegro' || app.company === 'Revolut') return 'hybrid';
  if (app.company === 'InPost') return 'onsite';
  return 'remote';
};

export const getPortalIcon = (portal: string) => {
  const normalizedPortal = portal.toLowerCase();

  if (normalizedPortal.includes('linkedin')) return 'https://www.google.com/s2/favicons?domain=linkedin.com&sz=64';
  if (normalizedPortal.includes('pracuj')) return 'https://www.google.com/s2/favicons?domain=pracuj.pl&sz=64';
  if (normalizedPortal.includes('olx')) return 'https://www.google.com/s2/favicons?domain=olx.pl&sz=64';
  if (normalizedPortal.includes('justjoin')) return 'https://www.google.com/s2/favicons?domain=justjoin.it&sz=64';
  if (normalizedPortal.includes('nofluff')) return 'https://www.google.com/s2/favicons?domain=nofluffjobs.com&sz=64';

  return 'https://www.google.com/s2/favicons?sz=64';
};

export const shouldCloseOverlay = (
  event: React.MouseEvent<HTMLDivElement>,
  modalElement: HTMLDivElement | null,
) => {
  if (event.target !== event.currentTarget) return false;
  if (!modalElement) return true;

  const safeDistance = 64;
  const rect = modalElement.getBoundingClientRect();
  const { clientX, clientY } = event;

  const dx = Math.max(rect.left - clientX, 0, clientX - rect.right);
  const dy = Math.max(rect.top - clientY, 0, clientY - rect.bottom);
  const distanceToModal = Math.hypot(dx, dy);

  return distanceToModal > safeDistance;
};
