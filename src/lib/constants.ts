// Centralized Constants for Dr. Nilay Dental Platform

export const ROUTES = {
  HOME: '/',
  TREATMENTS_DETAIL: '/treatments/:id',
  DASHBOARD: '/dashboard',
};

export const CLINIC_SLUGS = {
  BELERHAT: 'belerhat',
  NABADWIP: 'nabadwip',
};

export const CLINIC_NAMES: Record<string, string> = {
  [CLINIC_SLUGS.NABADWIP]: 'Dr. Nilay Saha Dental Care (Nabadwip)',
  [CLINIC_SLUGS.BELERHAT]: 'Nilay Saha Dental Care (Belerhat)',
};

export const CLINIC_MAP_LINKS: Record<string, string> = {
  [CLINIC_SLUGS.NABADWIP]: 'https://maps.app.goo.gl/gPvowvKGbheXV6uTA?g_st=ic',
  [CLINIC_SLUGS.BELERHAT]: 'https://maps.app.goo.gl/MbD3rFAUdP1krCHJ8?g_st=ic',
};

export interface ClinicScheduleConfig {
  slug: string;
  name: string;
  shortName: string;
  mapLink: string;
  openDays: number[]; // 0=Sun, 1=Mon, ..., 6=Sat
  openDaysText: string;
  timingsText: string;
  slotsByDay: Record<number, Array<{ value: string; label: string }>>;
}

export const CLINIC_SCHEDULES: Record<string, ClinicScheduleConfig> = {
  [CLINIC_SLUGS.NABADWIP]: {
    slug: CLINIC_SLUGS.NABADWIP,
    name: 'Dr. Nilay Saha Dental Care (Nabadwip)',
    shortName: 'Nabadwip Center',
    mapLink: 'https://maps.app.goo.gl/gPvowvKGbheXV6uTA?g_st=ic',
    openDays: [0, 1, 3, 5], // Sun, Mon, Wed, Fri
    openDaysText: 'Mon, Wed, Fri & Sun',
    timingsText: 'Mon, Wed, Fri: 9:00–11:00 AM & 4:00–8:00 PM | Sun: 4:00–8:00 PM',
    slotsByDay: {
      1: [
        { value: 'Morning (9:00 AM - 11:00 AM)', label: 'Morning: 9:00 AM - 11:00 AM' },
        { value: 'Evening (4:00 PM - 8:00 PM)', label: 'Evening: 4:00 PM - 8:00 PM' },
      ],
      3: [
        { value: 'Morning (9:00 AM - 11:00 AM)', label: 'Morning: 9:00 AM - 11:00 AM' },
        { value: 'Evening (4:00 PM - 8:00 PM)', label: 'Evening: 4:00 PM - 8:00 PM' },
      ],
      5: [
        { value: 'Morning (9:00 AM - 11:00 AM)', label: 'Morning: 9:00 AM - 11:00 AM' },
        { value: 'Evening (4:00 PM - 8:00 PM)', label: 'Evening: 4:00 PM - 8:00 PM' },
      ],
      0: [
        { value: 'Evening (4:00 PM - 8:00 PM)', label: 'Evening: 4:00 PM - 8:00 PM' },
      ],
    },
  },
  [CLINIC_SLUGS.BELERHAT]: {
    slug: CLINIC_SLUGS.BELERHAT,
    name: 'Nilay Saha Dental Care (Belerhat)',
    shortName: 'Belerhat Flagship Center',
    mapLink: 'https://maps.app.goo.gl/MbD3rFAUdP1krCHJ8?g_st=ic',
    openDays: [1, 2, 3, 4, 5, 6], // Mon - Sat
    openDaysText: 'Mon – Sat',
    timingsText: 'Mon – Sat: 10:00 AM – 1:30 PM & 5:00 PM – 8:30 PM',
    slotsByDay: {
      1: [
        { value: 'Morning (10:00 AM - 1:30 PM)', label: 'Morning: 10:00 AM - 1:30 PM' },
        { value: 'Evening (5:00 PM - 8:30 PM)', label: 'Evening: 5:00 PM - 8:30 PM' },
      ],
      2: [
        { value: 'Morning (10:00 AM - 1:30 PM)', label: 'Morning: 10:00 AM - 1:30 PM' },
        { value: 'Evening (5:00 PM - 8:30 PM)', label: 'Evening: 5:00 PM - 8:30 PM' },
      ],
      3: [
        { value: 'Morning (10:00 AM - 1:30 PM)', label: 'Morning: 10:00 AM - 1:30 PM' },
        { value: 'Evening (5:00 PM - 8:30 PM)', label: 'Evening: 5:00 PM - 8:30 PM' },
      ],
      4: [
        { value: 'Morning (10:00 AM - 1:30 PM)', label: 'Morning: 10:00 AM - 1:30 PM' },
        { value: 'Evening (5:00 PM - 8:30 PM)', label: 'Evening: 5:00 PM - 8:30 PM' },
      ],
      5: [
        { value: 'Morning (10:00 AM - 1:30 PM)', label: 'Morning: 10:00 AM - 1:30 PM' },
        { value: 'Evening (5:00 PM - 8:30 PM)', label: 'Evening: 5:00 PM - 8:30 PM' },
      ],
      6: [
        { value: 'Morning (10:00 AM - 1:30 PM)', label: 'Morning: 10:00 AM - 1:30 PM' },
        { value: 'Evening (5:00 PM - 8:30 PM)', label: 'Evening: 5:00 PM - 8:30 PM' },
      ],
    },
  },
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
export const DOCTOR_REGISTRATION_NUMBER = '4858-A';

export const PRIMARY_PHONE_NUMBER = '+917319526106';
export const PRIMARY_PHONE_DISPLAY = '+91 73195 26106';
export const PRIMARY_PHONE_DIGITS = '7319526106';

// WhatsApp contact number (Single source of truth)
export const PRIMARY_WHATSAPP_NUMBER = '+919609180979';
export const PRIMARY_WHATSAPP_DIGITS = '919609180979';

export interface WhatsAppBookingDetails {
  name?: string;
  clinic?: string;
  date?: string;
  time?: string;
  service?: string;
  refCode?: string;
}

export function buildWhatsAppUrl(details?: WhatsAppBookingDetails): string {
  const hasDetails = details && (details.name || details.clinic || details.date || details.time || details.service || details.refCode);

  let messageText = '';

  if (hasDetails) {
    messageText = `Hello Dr. Nilay Saha,\n\nI visited your website and would like to book a dental appointment.${details.refCode ? `\n\n• Ref Code: ${details.refCode}` : ''}\n\nHere are my details:\n\n• Name: ${details.name || ''}\n• Preferred Clinic: ${details.clinic || ''}\n• Preferred Date: ${details.date || ''}\n• Preferred Time: ${details.time || ''}\n• Dental Concern: ${details.service || ''}\n\nPlease confirm my appointment.\n\nThank you.`;
  } else {
    messageText = `Hello Dr. Nilay Saha,\n\nI visited your website and would like to book a dental appointment.\n\nHere are my details:\n\n• Name:\n• Preferred Clinic:\n• Preferred Date:\n• Preferred Time:\n• Dental Concern:\n\nPlease let me know the available appointment slots.\n\nThank you.`;
  }

  return `https://wa.me/${PRIMARY_WHATSAPP_DIGITS}?text=${encodeURIComponent(messageText)}`;
}
