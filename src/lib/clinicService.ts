import { supabase, executeWithRetry } from './supabase';
import { logger } from './logger';

export interface Doctor {
  id: string;
  name: string;
  registration_number?: string;
  qualification?: string;
  designation?: string;
  experience_years?: number;
  languages?: string;
  bio?: string;
  profile_image?: string;
  display_order: number;
  is_active: boolean;
}

export interface DoctorAvailability {
  id: string;
  doctor_id: string;
  clinic_id: string;
  date: string;
  session: string;
  availability_status: string; // 'Available', 'Leave', 'Holiday', 'Training', 'Conference', 'Emergency'
  notes?: string;
}

export interface Facility {
  id: string;
  name: string;
  icon_name: string;
  description?: string;
  display_order: number;
  is_active: boolean;
}

export interface ClinicFacilityLink {
  id: string;
  clinic_id: string;
  facility_id: string;
  is_enabled: boolean;
  facility?: Facility;
}

export interface ClinicNotice {
  id: string;
  clinic_id: string;
  title: string;
  description?: string;
  priority: string; // 'low', 'normal', 'high', 'critical'
  start_date: string;
  end_date: string;
  is_active: boolean;
}

export interface ClinicHoliday {
  id: string;
  clinic_id: string;
  holiday_date: string;
  reason: string;
  closed_flag: boolean;
  notes?: string;
}

export interface ClinicClosure {
  id: string;
  clinic_id: string;
  closure_date: string;
  reason_category: string; // 'Power Failure', 'Doctor Leave', 'Emergency', 'Maintenance', 'Other'
  details?: string;
  closed_flag: boolean;
}

export interface ClinicSchedule {
  id: string;
  clinic_id: string;
  day_of_week: string;
  session: string;
  start_time?: string;
  end_time?: string;
  doctor_available: boolean;
  is_active: boolean;
}

export interface Clinic {
  id: string;
  slug: string;
  name: string;
  address: string;
  landmark?: string;
  phone: string;
  whatsapp_phone: string;
  emergency_phone?: string;
  google_map_link?: string;
  cover_image?: string;
  visiting_note?: string;
  logo_url?: string;
  gallery_cover?: string;
  // TODO(confirm-before-deploy): verify verified Google rating and review count per clinic location (belerhat, parulia, nabadwip) before production deploy.
  google_rating: number;
  review_count: number;
  is_featured: boolean;
  display_order: number;
  is_active: boolean;
}

export interface ClinicResolvedStatus {
  status: 'Open' | 'Closed' | 'Holiday' | 'Temporary Closure' | 'Doctor Unavailable';
  reason?: string;
  reason_detail?: string;
  session_times?: string;
  available_doctor?: string;
  active_sessions: Array<{ session: string; start_time?: string; end_time?: string }>;
}

// 1. REPOSITORY LAYER: Handles direct database transactions and operations
export class ClinicRepository {
  static async getClinics(): Promise<Clinic[]> {
    return executeWithRetry(async () => {
      const { data, error } = await supabase
        .from('clinics')
        .select('*')
        .order('display_order', { ascending: true });
      if (error) throw error;
      return data || [];
    });
  }

  static async updateClinic(clinicId: string, updates: Partial<Clinic>): Promise<void> {
    return executeWithRetry(async () => {
      const { error } = await supabase
        .from('clinics')
        .update(updates)
        .eq('id', clinicId);
      if (error) throw error;
    });
  }

  static async getSchedules(clinicId?: string): Promise<ClinicSchedule[]> {
    return executeWithRetry(async () => {
      let query = supabase.from('clinic_schedule').select('*');
      if (clinicId) {
        query = query.eq('clinic_id', clinicId);
      }
      const { data, error } = await supabase.from('clinic_schedule').select('*');
      if (error) throw error;
      return data || [];
    });
  }

  static async updateSchedule(scheduleId: string, updates: Partial<ClinicSchedule>): Promise<void> {
    return executeWithRetry(async () => {
      const { error } = await supabase
        .from('clinic_schedule')
        .update(updates)
        .eq('id', scheduleId);
      if (error) throw error;
    });
  }

  static async insertSchedule(schedule: Omit<ClinicSchedule, 'id'>): Promise<void> {
    return executeWithRetry(async () => {
      const { error } = await supabase
        .from('clinic_schedule')
        .insert(schedule);
      if (error) throw error;
    });
  }

  static async deleteSchedule(scheduleId: string): Promise<void> {
    return executeWithRetry(async () => {
      const { error } = await supabase
        .from('clinic_schedule')
        .delete()
        .eq('id', scheduleId);
      if (error) throw error;
    });
  }

  static async getHolidays(clinicId?: string): Promise<ClinicHoliday[]> {
    return executeWithRetry(async () => {
      let query = supabase.from('clinic_holidays').select('*').order('holiday_date', { ascending: true });
      if (clinicId) query = query.eq('clinic_id', clinicId);
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    });
  }

  static async insertHoliday(holiday: Omit<ClinicHoliday, 'id'>): Promise<void> {
    return executeWithRetry(async () => {
      const { error } = await supabase
        .from('clinic_holidays')
        .insert(holiday);
      if (error) throw error;
    });
  }

  static async deleteHoliday(holidayId: string): Promise<void> {
    return executeWithRetry(async () => {
      const { error } = await supabase
        .from('clinic_holidays')
        .delete()
        .eq('id', holidayId);
      if (error) throw error;
    });
  }

  static async getClosures(clinicId?: string): Promise<ClinicClosure[]> {
    return executeWithRetry(async () => {
      let query = supabase.from('clinic_closures').select('*').order('closure_date', { ascending: true });
      if (clinicId) query = query.eq('clinic_id', clinicId);
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    });
  }

  static async insertClosure(closure: Omit<ClinicClosure, 'id'>): Promise<void> {
    return executeWithRetry(async () => {
      const { error } = await supabase
        .from('clinic_closures')
        .insert(closure);
      if (error) throw error;
    });
  }

  static async deleteClosure(closureId: string): Promise<void> {
    return executeWithRetry(async () => {
      const { error } = await supabase
        .from('clinic_closures')
        .delete()
        .eq('id', closureId);
      if (error) throw error;
    });
  }

  static async getNotices(clinicId?: string): Promise<ClinicNotice[]> {
    return executeWithRetry(async () => {
      let query = supabase.from('clinic_notices').select('*').order('start_date', { ascending: true });
      if (clinicId) query = query.eq('clinic_id', clinicId);
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    });
  }

  static async insertNotice(notice: Omit<ClinicNotice, 'id'>): Promise<void> {
    return executeWithRetry(async () => {
      const { error } = await supabase
        .from('clinic_notices')
        .insert(notice);
      if (error) throw error;
    });
  }

  static async updateNotice(noticeId: string, updates: Partial<ClinicNotice>): Promise<void> {
    return executeWithRetry(async () => {
      const { error } = await supabase
        .from('clinic_notices')
        .update(updates)
        .eq('id', noticeId);
      if (error) throw error;
    });
  }

  static async deleteNotice(noticeId: string): Promise<void> {
    return executeWithRetry(async () => {
      const { error } = await supabase
        .from('clinic_notices')
        .delete()
        .eq('id', noticeId);
      if (error) throw error;
    });
  }

  static async getDoctors(): Promise<Doctor[]> {
    return executeWithRetry(async () => {
      const { data, error } = await supabase
        .from('doctors')
        .select('*')
        .order('display_order', { ascending: true });
      if (error) throw error;
      return data || [];
    });
  }

  static async getDoctorAvailability(clinicId?: string, date?: string): Promise<DoctorAvailability[]> {
    return executeWithRetry(async () => {
      let query = supabase.from('doctor_availability').select('*');
      if (clinicId) query = query.eq('clinic_id', clinicId);
      if (date) query = query.eq('date', date);
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    });
  }

  static async saveDoctorAvailability(avail: Omit<DoctorAvailability, 'id'>): Promise<void> {
    return executeWithRetry(async () => {
      const { error } = await supabase
        .from('doctor_availability')
        .upsert(avail, { onConflict: 'doctor_id,clinic_id,date,session' });
      if (error) throw error;
    });
  }

  static async deleteDoctorAvailability(id: string): Promise<void> {
    return executeWithRetry(async () => {
      const { error } = await supabase
        .from('doctor_availability')
        .delete()
        .eq('id', id);
      if (error) throw error;
    });
  }

  static async getClinicFacilities(clinicId?: string): Promise<ClinicFacilityLink[]> {
    return executeWithRetry(async () => {
      let query = supabase
        .from('clinic_facilities')
        .select(`
          *,
          facility:facility_catalog(*)
        `);
      if (clinicId) query = query.eq('clinic_id', clinicId);
      const { data, error } = await query;
      if (error) throw error;
      return (data as any) || [];
    });
  }

  static async getFacilityCatalog(): Promise<Facility[]> {
    return executeWithRetry(async () => {
      const { data, error } = await supabase
        .from('facility_catalog')
        .select('*')
        .order('display_order', { ascending: true });
      if (error) throw error;
      return data || [];
    });
  }

  static async saveClinicFacility(clinicId: string, facilityId: string, isEnabled: boolean): Promise<void> {
    return executeWithRetry(async () => {
      const { error } = await supabase
        .from('clinic_facilities')
        .upsert(
          { clinic_id: clinicId, facility_id: facilityId, is_enabled: isEnabled },
          { onConflict: 'clinic_id,facility_id' }
        );
      if (error) throw error;
    });
  }
}

// 2. STATUS RESOLVER LAYER: Standardizes status evaluations (Open, Closed, Holiday, Emergency)
export class ClinicStatusResolver {
  static resolveStatus(
    clinicId: string,
    targetDateStr: string,
    schedules: ClinicSchedule[],
    holidays: ClinicHoliday[],
    closures: ClinicClosure[],
    availability: DoctorAvailability[],
    doctorsList: Doctor[],
    slug?: string
  ): ClinicResolvedStatus {
    const isExpandingCenter = clinicId === 'parulia' || clinicId === 'nabadwip' || slug === 'parulia' || slug === 'nabadwip';
    if (isExpandingCenter) {
      return {
        status: 'Open',
        reason: 'Schedule Updating Soon',
        reason_detail: 'Visiting schedule updating soon.',
        session_times: 'Visiting schedule updating soon.',
        available_doctor: 'Dr. Nilay Saha',
        active_sessions: [],
      };
    }

    // A. Check for Emergency/Temporary Closures
    const activeClosure = closures.find(
      (c) => c.clinic_id === clinicId && c.closure_date === targetDateStr && c.closed_flag
    );
    if (activeClosure) {
      return {
        status: 'Temporary Closure',
        reason: activeClosure.reason_category,
        reason_detail: activeClosure.details,
        active_sessions: [],
      };
    }

    // B. Check for Holiday
    const activeHoliday = holidays.find(
      (h) => h.clinic_id === clinicId && h.holiday_date === targetDateStr && h.closed_flag
    );
    if (activeHoliday) {
      return {
        status: 'Holiday',
        reason: 'Holiday',
        reason_detail: activeHoliday.reason,
        active_sessions: [],
      };
    }

    // C. Get target weekday
    // Note: use local date string parsing to avoid offset mismatches
    const dateObj = new Date(targetDateStr + 'T00:00:00');
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const weekday = weekdays[dateObj.getDay()];

    // D. Filter weekly schedule sessions for this weekday
    const daySessions = schedules.filter(
      (s) => s.clinic_id === clinicId && s.day_of_week === weekday && s.is_active
    );

    if (daySessions.length === 0) {
      return {
        status: 'Closed',
        reason: 'No session scheduled',
        active_sessions: [],
      };
    }

    // E. Evaluate session timings and doctor availability
    const resolvedSessions: Array<{ session: string; start_time?: string; end_time?: string }> = [];
    let clinicHasAvailableSession = false;
    let availableDoctorName = 'Dr. Nilay Saha'; // Seed fallback

    daySessions.forEach((sched) => {
      // Check if there is an availability block for this doctor, date, and session
      // For Dr. Nilay, we fetch id or fallback to any matching seed doctor
      const primaryDoc = doctorsList[0];
      const docAvail = availability.find(
        (a) =>
          a.clinic_id === clinicId &&
          a.date === targetDateStr &&
          a.session.toLowerCase() === sched.session.toLowerCase()
      );

      let isDocPresent = sched.doctor_available;
      if (docAvail) {
        isDocPresent = docAvail.availability_status === 'Available';
      }

      if (isDocPresent) {
        clinicHasAvailableSession = true;
        resolvedSessions.push({
          session: sched.session,
          start_time: sched.start_time,
          end_time: sched.end_time,
        });
        if (primaryDoc) {
          availableDoctorName = primaryDoc.name;
        }
      }
    });

    if (!clinicHasAvailableSession) {
      return {
        status: 'Doctor Unavailable',
        reason: 'Doctor Unavailable',
        reason_detail: 'Doctor on leave / out of station today',
        active_sessions: [],
      };
    }

    const sessionTexts = resolvedSessions
      .map((s) => `${s.session} (${s.start_time?.slice(0, 5)} - ${s.end_time?.slice(0, 5)})`)
      .join(' & ');

    return {
      status: 'Open',
      session_times: sessionTexts,
      available_doctor: availableDoctorName,
      active_sessions: resolvedSessions,
    };
  }
}

// 3. SERVICE LAYER: Orchestrates models and coordinates workflows
export class ClinicService {
  static async getClinicsWithStatus(dateStr: string) {
    try {
      const [
        clinics,
        schedules,
        holidays,
        closures,
        availability,
        notices,
        doctors,
        facilitiesLink,
      ] = await Promise.all([
        ClinicRepository.getClinics(),
        ClinicRepository.getSchedules(),
        ClinicRepository.getHolidays(),
        ClinicRepository.getClosures(),
        ClinicRepository.getDoctorAvailability(undefined, dateStr),
        ClinicRepository.getNotices(),
        ClinicRepository.getDoctors(),
        ClinicRepository.getClinicFacilities(),
      ]);

      // Calculate total appointments today dynamically for dashboard metrics
      const { data: bookingsToday } = await supabase
        .from('booking_requests')
        .select('clinic_id, id')
        .eq('preferred_date', dateStr)
        .eq('is_deleted', false);

      return clinics.map((clinic) => {
        const resolved = ClinicStatusResolver.resolveStatus(
          clinic.id,
          dateStr,
          schedules,
          holidays,
          closures,
          availability,
          doctors,
          clinic.slug
        );

        // Filter facilities and notices for this clinic
        const clinicFacilities = facilitiesLink
          .filter((f) => f.clinic_id === clinic.id && f.is_enabled && f.facility?.is_active)
          .map((f) => f.facility?.name || '');

        const activeNotice = notices.find(
          (n) =>
            n.clinic_id === clinic.id &&
            n.is_active &&
            dateStr >= n.start_date &&
            dateStr <= n.end_date
        );

        const clinicBookingsCount = bookingsToday
          ? bookingsToday.filter((b) => b.clinic_id === clinic.id).length
          : 0;

        return {
          ...clinic,
          statusInfo: resolved,
          facilities: clinicFacilities,
          notice: activeNotice || null,
          appointmentsToday: clinicBookingsCount,
        };
      });
    } catch (err) {
      logger.error('Failed to load dynamic clinic statuses:', err);
      return [];
    }
  }

  static async updateClinicProfile(clinicId: string, updates: Partial<Clinic>): Promise<boolean> {
    try {
      await ClinicRepository.updateClinic(clinicId, updates);
      return true;
    } catch (err) {
      logger.error(`Error updating clinic profile for ${clinicId}:`, err);
      return false;
    }
  }

  static async saveClinicSchedule(schedules: ClinicSchedule[]): Promise<boolean> {
    try {
      await Promise.all(
        schedules.map((s) =>
          ClinicRepository.updateSchedule(s.id, {
            start_time: s.start_time,
            end_time: s.end_time,
            doctor_available: s.doctor_available,
            is_active: s.is_active,
          })
        )
      );
      return true;
    } catch (err) {
      logger.error('Error saving weekly schedules:', err);
      return false;
    }
  }

  static async saveClinicFacilities(clinicId: string, activeCatalogIds: Record<string, boolean>): Promise<boolean> {
    try {
      const catalog = await ClinicRepository.getFacilityCatalog();
      await Promise.all(
        catalog.map((f) =>
          ClinicRepository.saveClinicFacility(clinicId, f.id, !!activeCatalogIds[f.id])
        )
      );
      return true;
    } catch (err) {
      logger.error('Error saving clinic facilities links:', err);
      return false;
    }
  }
}
