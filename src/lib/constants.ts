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
};
