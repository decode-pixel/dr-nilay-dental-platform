// Centralized Constants for Dr. Nilay Dental Platform

export const ROUTES = {
  HOME: '/',
  TREATMENTS_DETAIL: '/treatments/:id',
  DASHBOARD: '/dashboard',
};

export const CLINIC_SLUGS = {
  BELERHAT: 'belerhat',
  PARULIA: 'parulia',
  NABADWIP: 'nabadwip',
};

export const CLINIC_NAMES: Record<string, string> = {
  [CLINIC_SLUGS.BELERHAT]: 'Belerhat Center',
  [CLINIC_SLUGS.PARULIA]: 'Parulia Center',
  [CLINIC_SLUGS.NABADWIP]: 'Nabadwip Center',
};

export const SESSION_SLOTS = {
  MORNING: 'Morning',
  AFTERNOON: 'Afternoon',
  EVENING: 'Evening',
};

export const APPOINTMENT_STATUS = {
  NEW_REQUEST: 'new_request',
  PENDING_REVIEW: 'pending_review',
  CONFIRMED: 'confirmed',
  CHECKED_IN: 'checked_in',
  IN_TREATMENT: 'in_treatment',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  RESCHEDULED: 'rescheduled',
  NO_SHOW: 'no_show',
  PENDING_MANUAL_SCHEDULING: 'pending_manual_scheduling',
};

export const STATUS_LABELS: Record<string, string> = {
  [APPOINTMENT_STATUS.NEW_REQUEST]: 'New Request',
  [APPOINTMENT_STATUS.PENDING_REVIEW]: 'Pending Review',
  [APPOINTMENT_STATUS.CONFIRMED]: 'Confirmed',
  [APPOINTMENT_STATUS.CHECKED_IN]: 'Checked In',
  [APPOINTMENT_STATUS.IN_TREATMENT]: 'In Treatment',
  [APPOINTMENT_STATUS.COMPLETED]: 'Completed',
  [APPOINTMENT_STATUS.CANCELLED]: 'Cancelled',
  [APPOINTMENT_STATUS.RESCHEDULED]: 'Rescheduled',
  [APPOINTMENT_STATUS.NO_SHOW]: 'No Show',
  [APPOINTMENT_STATUS.PENDING_MANUAL_SCHEDULING]: 'Pending Manual Scheduling',
};

// Single Source of Truth: Clinical Credentials & Contact Numbers
// TODO(confirm-before-deploy): confirm whether 4858-A or WB-DENT-2026-987 is the exact current WBDC registration number before production deploy.
export const DOCTOR_REGISTRATION_NUMBER = '4858-A';

// TODO(confirm-before-deploy): confirm whether +919609180979 or +916290000000 should be the final primary phone and WhatsApp contact number before deploy.
export const PRIMARY_PHONE_NUMBER = '+919609180979';
export const PRIMARY_PHONE_DISPLAY = '+91 9609180979';
export const PRIMARY_PHONE_DIGITS = '9609180979';

export const PRIMARY_WHATSAPP_NUMBER = '+919609180979';
export const PRIMARY_WHATSAPP_DIGITS = '919609180979';

