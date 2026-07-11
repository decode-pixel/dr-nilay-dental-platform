import { createClient } from '@supabase/supabase-js';
import { logger } from './logger';

// Retrieve credentials from Vite env or fallback to seed project credentials
const SUPABASE_URL = (import.meta.env?.VITE_SUPABASE_URL as string) || 'https://pwtfhbzyspktnwtgupbc.supabase.co';
const SUPABASE_ANON_KEY = (import.meta.env?.VITE_SUPABASE_ANON_KEY as string) || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3dGZoYnp5c3BrdG53dGd1cGJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM2OTI1OTQsImV4cCI6MjA5OTI2ODU5NH0.TF5nAZNX4LHGdr4lqzyvgegDZW8gzKOWCWB5_qo3yDs';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export interface ClinicSettings {
  id: string;
  clinic_name: string;
  primary_phone: string;
  whatsapp_number: string;
  emergency_number: string;
  email: string;
  google_review_link?: string;
  logo_url?: string;
  business_hours: Record<string, any>;
  brand_colors: {
    primary: string;
    accent: string;
  };
}

/**
 * Utility wrapper to execute a promise-returning query with automatic retries on network failures.
 */
export async function executeWithRetry<T>(
  fn: () => Promise<T>,
  retries = 3,
  delayMs = 1000
): Promise<T> {
  try {
    return await fn();
  } catch (err: any) {
    const isNetworkError =
      !navigator.onLine ||
      err.message?.includes('FetchError') ||
      err.message?.includes('Failed to fetch') ||
      err.message?.includes('network');

    if (isNetworkError && retries > 0) {
      logger.warn(`Network connection query failure. Retrying query in ${delayMs}ms... (${retries} retries left)`);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
      return executeWithRetry(fn, retries - 1, delayMs * 2);
    }
    throw err;
  }
}

/**
 * Fetch global clinic settings.
 */
export async function getClinicSettings(): Promise<ClinicSettings | null> {
  return executeWithRetry(async () => {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (error) {
        logger.error('Error fetching clinic settings:', error);
        return null;
      }
      return data as ClinicSettings;
    } catch (err) {
      logger.error('Network error fetching clinic settings:', err);
      return null;
    }
  });
}

export interface BookingPayload {
  clinicSlug: string;
  serviceSlug: string;
  preferredDate: string;
  preferredSession: string;
  patientName: string;
  patientPhone: string;
  chiefComplaint: string;
  patientAge?: number | null;
  patientGender?: string | null;
}

export interface BookingResponse {
  success: boolean;
  booking_id?: string;
  reference_code?: string;
  patient_id?: string;
  patient_name?: string;
  clinic_name?: string;
  treatment_name?: string;
  error?: string;
}

/**
 * Submits a new booking request within a database transaction.
 */
export async function submitBookingRequest(payload: BookingPayload): Promise<BookingResponse> {
  return executeWithRetry(async () => {
    try {
      const { data, error } = await supabase.rpc('create_booking_request_tx', {
        p_clinic_slug: payload.clinicSlug,
        p_service_slug: payload.serviceSlug,
        p_preferred_date: payload.preferredDate,
        p_preferred_session: payload.preferredSession,
        p_patient_name: payload.patientName,
        p_patient_phone: payload.patientPhone,
        p_chief_complaint: payload.chiefComplaint,
        p_patient_age: payload.patientAge || null,
        p_patient_gender: payload.patientGender || null,
      });

      if (error) {
        logger.error('Booking submission RPC error:', error);
        return { success: false, error: error.message };
      }

      const res = data as any;
      if (res && res.success === false) {
        logger.warn('Booking transaction failed:', res.error);
        return { success: false, error: res.error || 'Failed to create booking request' };
      }

      logger.info('Booking transaction submitted successfully:', res.reference_code);
      return {
        success: true,
        booking_id: res.booking_id,
        reference_code: res.reference_code,
        patient_id: res.patient_id,
        patient_name: res.patient_name,
        clinic_name: res.clinic_name,
        treatment_name: res.treatment_name,
      };
    } catch (err: any) {
      logger.error('Unhandled booking submit exception:', err);
      return {
        success: false,
        error: err.message || 'Network connectivity error occurred.',
      };
    }
  });
}

/**
 * Fetch all active booking requests with joined details.
 */
export async function getDashboardBookings() {
  return executeWithRetry(async () => {
    const res = await supabase
      .from('booking_requests')
      .select(`
        *,
        patient:patients(*),
        clinic:clinics(*),
        service:services(*)
      `)
      .eq('is_deleted', false)
      .order('preferred_date', { ascending: true });
    
    if (res.error) {
      logger.error('Error fetching dashboard bookings:', res.error);
    }
    return res;
  });
}

/**
 * Fetch status transition history audit trail for a booking.
 */
export async function getBookingStatusHistory(bookingId: string) {
  return executeWithRetry(async () => {
    const res = await supabase
      .from('appointment_status_history')
      .select('*')
      .eq('booking_id', bookingId)
      .order('changed_at', { ascending: false });

    if (res.error) {
      logger.error(`Error fetching status history for ${bookingId}:`, res.error);
    }
    return res;
  });
}

/**
 * Fetch all prior bookings for a specific patient.
 */
export async function getPatientBookingHistory(patientId: string) {
  return executeWithRetry(async () => {
    const res = await supabase
      .from('booking_requests')
      .select(`
        *,
        service:services(name),
        clinic:clinics(name)
      `)
      .eq('patient_id', patientId)
      .eq('is_deleted', false)
      .order('preferred_date', { ascending: false });

    if (res.error) {
      logger.error(`Error fetching patient history for ${patientId}:`, res.error);
    }
    return res;
  });
}

/**
 * Fetch total unread notifications count for assistant dashboard.
 */
export async function getUnreadNotificationsCount(): Promise<number> {
  return executeWithRetry(async () => {
    try {
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('is_read', false)
        .eq('target_role', 'assistant');

      if (error) {
        logger.error('Error fetching unread count:', error);
        return 0;
      }
      return count || 0;
    } catch (err) {
      logger.error('Network error fetching unread count:', err);
      return 0;
    }
  });
}

/**
 * Fetch all patient records for Patient Management.
 */
export async function getDashboardPatients() {
  return executeWithRetry(async () => {
    const res = await supabase
      .from('patients')
      .select('*')
      .eq('is_active', true)
      .order('full_name', { ascending: true });

    if (res.error) {
      logger.error('Error fetching dashboard patients:', res.error);
    }
    return res;
  });
}

/**
 * Updates patient profile fields (e.g. coordinator notes, tags).
 */
export async function updatePatientProfile(
  patientId: string,
  updates: { tags?: string[]; coordinator_notes?: string; metadata?: Record<string, any> }
) {
  return executeWithRetry(async () => {
    const res = await supabase
      .from('patients')
      .update(updates)
      .eq('id', patientId);

    if (res.error) {
      logger.error(`Error updating patient profile for ${patientId}:`, res.error);
    }
    return res;
  });
}
