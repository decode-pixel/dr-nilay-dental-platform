import { supabase } from './supabase';
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
  cover_image?: string;
  signature_image?: string;
  qualifications?: string[];
  awards?: string[];
  certificates?: string[];
  display_order?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DoctorWeeklyAvailability {
  id: string;
  doctor_id: string;
  clinic_id: string;
  day_of_week: string;
  session: 'Morning' | 'Evening' | string;
  start_time?: string;
  end_time?: string;
  is_active: boolean;
}

export interface DoctorDocument {
  id: string;
  doctor_id: string;
  name: string;
  file_url: string;
  document_type: 'Degree' | 'Registration' | 'Certificate' | 'Other' | string;
  uploaded_at: string;
}

/**
 * DoctorRepository manages direct Supabase calls for doctors profile, weekly slots, and documents.
 */
export const DoctorRepository = {
  async getDoctors(): Promise<Doctor[]> {
    const { data, error } = await supabase
      .from('doctors')
      .select('*')
      .order('display_order', { ascending: true });
    if (error) {
      logger.error('Error loading doctors list from DB:', error);
      throw error;
    }
    return data || [];
  },

  async updateDoctorProfile(id: string, updates: Partial<Doctor>): Promise<void> {
    const { error } = await supabase
      .from('doctors')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);
    if (error) {
      logger.error(`Error saving profile for doctor ${id}:`, error);
      throw error;
    }
  },

  async getDoctorClinics(doctorId: string): Promise<string[]> {
    const { data, error } = await supabase
      .from('doctor_clinics')
      .select('clinic_id')
      .eq('doctor_id', doctorId);
    if (error) {
      logger.error(`Error loading clinics assigned to doctor ${doctorId}:`, error);
      throw error;
    }
    return (data || []).map((row) => row.clinic_id);
  },

  async saveDoctorClinics(doctorId: string, clinicIds: string[]): Promise<void> {
    // Perform synchronizations in sequence
    const { error: deleteErr } = await supabase
      .from('doctor_clinics')
      .delete()
      .eq('doctor_id', doctorId);
    if (deleteErr) throw deleteErr;

    if (clinicIds.length === 0) return;

    const rows = clinicIds.map((cid) => ({ doctor_id: doctorId, clinic_id: cid }));
    const { error: insertErr } = await supabase
      .from('doctor_clinics')
      .insert(rows);
    if (insertErr) throw insertErr;
  },

  async getDoctorTreatments(doctorId: string): Promise<string[]> {
    const { data, error } = await supabase
      .from('doctor_treatments')
      .select('service_id')
      .eq('doctor_id', doctorId);
    if (error) {
      logger.error(`Error loading treatments assigned to doctor ${doctorId}:`, error);
      throw error;
    }
    return (data || []).map((row) => row.service_id);
  },

  async saveDoctorTreatments(doctorId: string, serviceIds: string[]): Promise<void> {
    const { error: deleteErr } = await supabase
      .from('doctor_treatments')
      .delete()
      .eq('doctor_id', doctorId);
    if (deleteErr) throw deleteErr;

    if (serviceIds.length === 0) return;

    const rows = serviceIds.map((sid) => ({ doctor_id: doctorId, service_id: sid }));
    const { error: insertErr } = await supabase
      .from('doctor_treatments')
      .insert(rows);
    if (insertErr) throw insertErr;
  },

  async getDoctorWeeklyAvailability(doctorId: string): Promise<DoctorWeeklyAvailability[]> {
    const { data, error } = await supabase
      .from('doctor_weekly_availability')
      .select('*')
      .eq('doctor_id', doctorId);
    if (error) {
      logger.error(`Error loading weekly timings for doctor ${doctorId}:`, error);
      throw error;
    }
    return data || [];
  },

  async saveWeeklyAvailability(doctorId: string, schedules: Partial<DoctorWeeklyAvailability>[]): Promise<void> {
    // Delete existing weekly timings before inserting new set
    const { error: deleteErr } = await supabase
      .from('doctor_weekly_availability')
      .delete()
      .eq('doctor_id', doctorId);
    if (deleteErr) throw deleteErr;

    if (schedules.length === 0) return;

    const rows = schedules.map((s) => ({
      doctor_id: doctorId,
      clinic_id: s.clinic_id,
      day_of_week: s.day_of_week,
      session: s.session,
      start_time: s.start_time,
      end_time: s.end_time,
      is_active: s.is_active ?? true
    }));

    const { error: insertErr } = await supabase
      .from('doctor_weekly_availability')
      .insert(rows);
    if (insertErr) throw insertErr;
  },

  async getDoctorDocuments(doctorId: string): Promise<DoctorDocument[]> {
    const { data, error } = await supabase
      .from('doctor_documents')
      .select('*')
      .eq('doctor_id', doctorId)
      .order('uploaded_at', { ascending: false });
    if (error) {
      logger.error(`Error loading licensing documents for doctor ${doctorId}:`, error);
      throw error;
    }
    return data || [];
  },

  async addDoctorDocument(document: Partial<DoctorDocument>): Promise<DoctorDocument> {
    const { data, error } = await supabase
      .from('doctor_documents')
      .insert(document)
      .select()
      .single();
    if (error) {
      logger.error('Error inserting document record:', error);
      throw error;
    }
    return data;
  },

  async deleteDoctorDocument(id: string): Promise<void> {
    const { error } = await supabase
      .from('doctor_documents')
      .delete()
      .eq('id', id);
    if (error) {
      logger.error(`Error deleting licensing document ${id}:`, error);
      throw error;
    }
  }
};

/**
 * DoctorService resolves available doctors and syncs profile settings.
 */
export const DoctorService = {
  async getDoctors(): Promise<Doctor[]> {
    try {
      return await DoctorRepository.getDoctors();
    } catch {
      return [];
    }
  },

  async getDoctorClinics(doctorId: string): Promise<string[]> {
    try {
      return await DoctorRepository.getDoctorClinics(doctorId);
    } catch {
      return [];
    }
  },

  async getDoctorTreatments(doctorId: string): Promise<string[]> {
    try {
      return await DoctorRepository.getDoctorTreatments(doctorId);
    } catch {
      return [];
    }
  },

  async saveDoctorClinics(doctorId: string, clinicIds: string[]): Promise<boolean> {
    try {
      await DoctorRepository.saveDoctorClinics(doctorId, clinicIds);
      return true;
    } catch (err) {
      logger.error('Failed to save doctor clinics assignment:', err);
      return false;
    }
  },

  async saveDoctorTreatments(doctorId: string, serviceIds: string[]): Promise<boolean> {
    try {
      await DoctorRepository.saveDoctorTreatments(doctorId, serviceIds);
      return true;
    } catch (err) {
      logger.error('Failed to save doctor treatments mapping:', err);
      return false;
    }
  },

  async getDoctorWeeklyAvailability(doctorId: string): Promise<DoctorWeeklyAvailability[]> {
    try {
      return await DoctorRepository.getDoctorWeeklyAvailability(doctorId);
    } catch {
      return [];
    }
  },

  async saveWeeklyAvailability(doctorId: string, schedules: Partial<DoctorWeeklyAvailability>[]): Promise<boolean> {
    try {
      await DoctorRepository.saveWeeklyAvailability(doctorId, schedules);
      return true;
    } catch (err) {
      logger.error('Failed to save doctor weekly timing slots:', err);
      return false;
    }
  },

  async getDoctorDocuments(doctorId: string): Promise<DoctorDocument[]> {
    try {
      return await DoctorRepository.getDoctorDocuments(doctorId);
    } catch {
      return [];
    }
  },

  async addDocument(doctorId: string, name: string, fileUrl: string, type: string): Promise<boolean> {
    try {
      await DoctorRepository.addDoctorDocument({
        doctor_id: doctorId,
        name,
        file_url: fileUrl,
        document_type: type
      });
      return true;
    } catch (err) {
      logger.error('Failed to insert doctor licensing document:', err);
      return false;
    }
  },

  async deleteDocument(id: string): Promise<boolean> {
    try {
      await DoctorRepository.deleteDoctorDocument(id);
      return true;
    } catch (err) {
      logger.error(`Failed to delete document ${id}:`, err);
      return false;
    }
  },

  /**
   * Resolves list of doctors available for a target clinic, date, and session slot.
   */
  async resolveAvailableDoctors(clinicId: string, dateStr: string, sessionName: string): Promise<Doctor[]> {
    try {
      // 1. Fetch weekday from date
      const date = new Date(dateStr);
      const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const targetWeekday = weekdays[date.getDay()];

      // 2. Fetch doctors active on that weekday & session at that clinic
      const { data: scheduleList, error: schedErr } = await supabase
        .from('doctor_weekly_availability')
        .select('doctor_id')
        .eq('clinic_id', clinicId)
        .eq('day_of_week', targetWeekday)
        .eq('session', sessionName)
        .eq('is_active', true);

      if (schedErr || !scheduleList || scheduleList.length === 0) {
        return [];
      }

      const activeDoctorIds = scheduleList.map((row) => row.doctor_id);

      // 3. Fetch active doctor overrides/leaves on target date & session
      const { data: leaveList, error: leaveErr } = await supabase
        .from('doctor_availability')
        .select('doctor_id')
        .eq('clinic_id', clinicId)
        .eq('date', dateStr)
        .eq('session', sessionName)
        .neq('availability_status', 'Available'); // e.g. status: 'Leave', 'Holiday', etc.

      if (leaveErr) throw leaveErr;

      const unavailableDoctorIds = (leaveList || []).map((row) => row.doctor_id);

      // Filter out unavailable/leaves doctors
      const availableDoctorIds = activeDoctorIds.filter(
        (id) => !unavailableDoctorIds.includes(id)
      );

      if (availableDoctorIds.length === 0) {
        return [];
      }

      // 4. Load full doctor profiles details
      const { data: profileList, error: profErr } = await supabase
        .from('doctors')
        .select('*')
        .in('id', availableDoctorIds)
        .eq('is_active', true);

      if (profErr) throw profErr;

      return profileList || [];
    } catch (err) {
      logger.error(`Error resolving available doctors at clinic ${clinicId} on date ${dateStr}:`, err);
      return [];
    }
  }
};
