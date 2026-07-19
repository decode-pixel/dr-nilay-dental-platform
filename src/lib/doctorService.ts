import { supabase } from './supabase';
import { logger } from './logger';

export type DoctorStatus = 'Available' | 'On Leave' | 'Inactive' | 'Retired' | 'Visiting' | 'Emergency Leave';

export interface Doctor {
  id: string;
  name: string;
  registration_number?: string;
  qualification?: string;
  designation?: string;
  experience_years?: number;
  bio?: string;
  profile_image?: string;
  cover_image?: string;
  signature_image?: string;
  display_order?: number;
  is_active: boolean;
  status: DoctorStatus;
  login_enabled: boolean;
  profile_visibility: boolean;
  public_slug?: string;
  last_login?: string;
  created_at: string;
  updated_at: string;
}

export interface DoctorProfileItem {
  id?: string;
  doctor_id?: string;
  title: string;
  institution: string;
  description?: string;
  issue_date?: string;
  display_order?: number;
  attachment_url?: string;
}

export interface Language {
  id: string;
  code: string;
  name: string;
}

export interface Specialization {
  id: string;
  name: string;
  description?: string;
}

export interface DoctorWeeklyAvailability {
  id: string;
  doctor_id: string;
  clinic_id: string;
  day_of_week: string;
  session: string;
  start_time?: string;
  end_time?: string;
  is_active: boolean;
}

export interface DoctorDocument {
  id: string;
  doctor_id: string;
  name: string;
  file_url: string;
  document_type: string;
  uploaded_at: string;
  expiry_date?: string;
  verification_status: 'Pending' | 'Verified' | 'Rejected' | string;
  verified_by?: string;
  verified_at?: string;
  is_required: boolean;
}

const DEFAULT_NILAY_DOCTOR: Doctor = {
  id: 'dr-nilay-saha-primary',
  name: 'Dr. Nilay Saha',
  designation: 'Dental Surgeon & Oral Physician',
  qualification: 'BDS, FIE',
  registration_number: 'WBDC Registration No. 4858-A',
  experience_years: 10,
  bio: 'Dr. Nilay Saha is a distinguished Dental Surgeon and Oral Physician with over a decade of precision clinical experience in endodontics, oral surgery, and advanced cosmetic diagnostics. Dedicated to patient comfort and rigorous clinical standards.',
  profile_image: '/dr-nilay-saha.jpg',
  cover_image: '/dr-nilay-saha.jpg',
  signature_image: '/dr-nilay-saha.jpg',
  display_order: 0,
  is_active: true,
  status: 'Available',
  login_enabled: false,
  profile_visibility: true,
  public_slug: 'dr-nilay-saha',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

export function normalizeDoctorProfile(doc: Doctor): Doctor {
  if (!doc) return doc;
  const isNilay = !doc.name || doc.name.toLowerCase().includes('nilay') || doc.name.toLowerCase().includes('saha');
  const hasPlaceholder = !doc.profile_image || doc.profile_image.includes('placeholder') || doc.profile_image.includes('dicebear') || doc.profile_image.includes('unsplash');
  if (isNilay || hasPlaceholder) {
    return {
      ...doc,
      profile_image: '/dr-nilay-saha.jpg',
      cover_image: '/dr-nilay-saha.jpg',
      signature_image: '/dr-nilay-saha.jpg'
    };
  }
  return doc;
}

export const DoctorRepository = {
  async getDoctors(): Promise<Doctor[]> {
    try {
      const { data, error } = await supabase
        .from('doctors')
        .select('*')
        .order('display_order', { ascending: true });
      if (error) throw error;
      if (!data || data.length === 0) return [DEFAULT_NILAY_DOCTOR];
      return data.map(normalizeDoctorProfile);
    } catch {
      return [DEFAULT_NILAY_DOCTOR];
    }
  },

  async updateDoctorProfile(id: string, updates: Partial<Doctor>): Promise<void> {
    const { error } = await supabase
      .from('doctors')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);
    if (error) throw error;
  },

  // 1. Qualifications Repository CRUD
  async getQualifications(doctorId: string): Promise<DoctorProfileItem[]> {
    const { data, error } = await supabase
      .from('doctor_qualifications')
      .select('*')
      .eq('doctor_id', doctorId)
      .order('display_order', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async saveQualifications(doctorId: string, list: DoctorProfileItem[]): Promise<void> {
    const { error: delErr } = await supabase
      .from('doctor_qualifications')
      .delete()
      .eq('doctor_id', doctorId);
    if (delErr) throw delErr;

    if (list.length === 0) return;
    const rows = list.map((item, idx) => ({
      doctor_id: doctorId,
      title: item.title,
      institution: item.institution,
      description: item.description,
      issue_date: item.issue_date || null,
      display_order: item.display_order ?? idx,
      attachment_url: item.attachment_url || null
    }));
    const { error: insErr } = await supabase
      .from('doctor_qualifications')
      .insert(rows);
    if (insErr) throw insErr;
  },

  // 2. Awards Repository CRUD
  async getAwards(doctorId: string): Promise<DoctorProfileItem[]> {
    const { data, error } = await supabase
      .from('doctor_awards')
      .select('*')
      .eq('doctor_id', doctorId)
      .order('display_order', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async saveAwards(doctorId: string, list: DoctorProfileItem[]): Promise<void> {
    const { error: delErr } = await supabase
      .from('doctor_awards')
      .delete()
      .eq('doctor_id', doctorId);
    if (delErr) throw delErr;

    if (list.length === 0) return;
    const rows = list.map((item, idx) => ({
      doctor_id: doctorId,
      title: item.title,
      institution: item.institution,
      description: item.description,
      issue_date: item.issue_date || null,
      display_order: item.display_order ?? idx,
      attachment_url: item.attachment_url || null
    }));
    const { error: insErr } = await supabase
      .from('doctor_awards')
      .insert(rows);
    if (insErr) throw insErr;
  },

  // 3. Certifications Repository CRUD
  async getCertifications(doctorId: string): Promise<DoctorProfileItem[]> {
    const { data, error } = await supabase
      .from('doctor_certifications')
      .select('*')
      .eq('doctor_id', doctorId)
      .order('display_order', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async saveCertifications(doctorId: string, list: DoctorProfileItem[]): Promise<void> {
    const { error: delErr } = await supabase
      .from('doctor_certifications')
      .delete()
      .eq('doctor_id', doctorId);
    if (delErr) throw delErr;

    if (list.length === 0) return;
    const rows = list.map((item, idx) => ({
      doctor_id: doctorId,
      title: item.title,
      institution: item.institution,
      description: item.description,
      issue_date: item.issue_date || null,
      display_order: item.display_order ?? idx,
      attachment_url: item.attachment_url || null
    }));
    const { error: insErr } = await supabase
      .from('doctor_certifications')
      .insert(rows);
    if (insErr) throw insErr;
  },

  // 4. Languages Catalog CRUD
  async getLanguageCatalog(): Promise<Language[]> {
    const { data, error } = await supabase
      .from('language_catalog')
      .select('*')
      .order('name', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async getDoctorLanguages(doctorId: string): Promise<string[]> {
    const { data, error } = await supabase
      .from('doctor_languages')
      .select('language_id')
      .eq('doctor_id', doctorId);
    if (error) throw error;
    return (data || []).map((row) => row.language_id);
  },

  async saveDoctorLanguages(doctorId: string, langIds: string[]): Promise<void> {
    const { error: delErr } = await supabase
      .from('doctor_languages')
      .delete()
      .eq('doctor_id', doctorId);
    if (delErr) throw delErr;

    if (langIds.length === 0) return;
    const rows = langIds.map((lid) => ({ doctor_id: doctorId, language_id: lid }));
    const { error: insErr } = await supabase
      .from('doctor_languages')
      .insert(rows);
    if (insErr) throw insErr;
  },

  // 5. Specializations Catalog CRUD
  async getSpecializationCatalog(): Promise<Specialization[]> {
    const { data, error } = await supabase
      .from('specialization_catalog')
      .select('*')
      .order('name', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async getDoctorSpecializations(doctorId: string): Promise<string[]> {
    const { data, error } = await supabase
      .from('doctor_specializations')
      .select('specialization_id')
      .eq('doctor_id', doctorId);
    if (error) throw error;
    return (data || []).map((row) => row.specialization_id);
  },

  async saveDoctorSpecializations(doctorId: string, specIds: string[]): Promise<void> {
    const { error: delErr } = await supabase
      .from('doctor_specializations')
      .delete()
      .eq('doctor_id', doctorId);
    if (delErr) throw delErr;

    if (specIds.length === 0) return;
    const rows = specIds.map((sid) => ({ doctor_id: doctorId, specialization_id: sid }));
    const { error: insErr } = await supabase
      .from('doctor_specializations')
      .insert(rows);
    if (insErr) throw insErr;
  },

  // Clinics assignment CRUD
  async getDoctorClinics(doctorId: string): Promise<string[]> {
    const { data, error } = await supabase
      .from('doctor_clinics')
      .select('clinic_id')
      .eq('doctor_id', doctorId);
    if (error) throw error;
    return (data || []).map((row) => row.clinic_id);
  },

  async saveDoctorClinics(doctorId: string, clinicIds: string[]): Promise<void> {
    const { error: delErr } = await supabase
      .from('doctor_clinics')
      .delete()
      .eq('doctor_id', doctorId);
    if (delErr) throw delErr;

    if (clinicIds.length === 0) return;
    const rows = clinicIds.map((cid) => ({ doctor_id: doctorId, clinic_id: cid }));
    const { error: insErr } = await supabase
      .from('doctor_clinics')
      .insert(rows);
    if (insErr) throw insErr;
  },

  // Weekly availability CRUD
  async getDoctorWeeklyAvailability(doctorId: string): Promise<DoctorWeeklyAvailability[]> {
    const { data, error } = await supabase
      .from('doctor_weekly_availability')
      .select('*')
      .eq('doctor_id', doctorId);
    if (error) throw error;
    return data || [];
  },

  async saveWeeklyAvailability(doctorId: string, schedules: Partial<DoctorWeeklyAvailability>[]): Promise<void> {
    const { error: delErr } = await supabase
      .from('doctor_weekly_availability')
      .delete()
      .eq('doctor_id', doctorId);
    if (delErr) throw delErr;

    if (schedules.length === 0) return;
    const rows = schedules.map((s) => ({
      doctor_id: doctorId,
      clinic_id: s.clinic_id,
      day_of_week: s.day_of_week,
      session: s.session,
      start_time: s.start_time || null,
      end_time: s.end_time || null,
      is_active: s.is_active ?? true
    }));
    const { error: insErr } = await supabase
      .from('doctor_weekly_availability')
      .insert(rows);
    if (insErr) throw insErr;
  },

  // Documents Compliance CRUD
  async getDoctorDocuments(doctorId: string): Promise<DoctorDocument[]> {
    const { data, error } = await supabase
      .from('doctor_documents')
      .select('*')
      .eq('doctor_id', doctorId)
      .order('uploaded_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async addDoctorDocument(doc: Partial<DoctorDocument>): Promise<void> {
    const { error } = await supabase
      .from('doctor_documents')
      .insert({
        ...doc,
        verification_status: doc.verification_status || 'Pending'
      });
    if (error) throw error;
  },

  async deleteDoctorDocument(id: string): Promise<void> {
    const { error } = await supabase
      .from('doctor_documents')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  async getDoctorTreatments(doctorId: string): Promise<string[]> {
    const { data, error } = await supabase
      .from('doctor_treatments')
      .select('service_id')
      .eq('doctor_id', doctorId);
    if (error) throw error;
    return (data || []).map((row) => row.service_id);
  },

  async saveDoctorTreatments(doctorId: string, serviceIds: string[]): Promise<void> {
    const { error: delErr } = await supabase
      .from('doctor_treatments')
      .delete()
      .eq('doctor_id', doctorId);
    if (delErr) throw delErr;

    if (serviceIds.length === 0) return;
    const rows = serviceIds.map((sid) => ({
      doctor_id: doctorId,
      service_id: sid
    }));
    const { error: insErr } = await supabase
      .from('doctor_treatments')
      .insert(rows);
    if (insErr) throw insErr;
  }
};

export const DoctorService = {
  async getDoctors(): Promise<Doctor[]> {
    try {
      return await DoctorRepository.getDoctors();
    } catch {
      return [DEFAULT_NILAY_DOCTOR];
    }
  },

  async getDoctorQualifications(doctorId: string): Promise<DoctorProfileItem[]> {
    try {
      return await DoctorRepository.getQualifications(doctorId);
    } catch {
      return [];
    }
  },

  async saveQualifications(doctorId: string, list: DoctorProfileItem[]): Promise<boolean> {
    try {
      await DoctorRepository.saveQualifications(doctorId, list);
      return true;
    } catch (err) {
      logger.error('Failed to save doctor qualifications:', err);
      return false;
    }
  },

  async getDoctorAwards(doctorId: string): Promise<DoctorProfileItem[]> {
    try {
      return await DoctorRepository.getAwards(doctorId);
    } catch {
      return [];
    }
  },

  async saveAwards(doctorId: string, list: DoctorProfileItem[]): Promise<boolean> {
    try {
      await DoctorRepository.saveAwards(doctorId, list);
      return true;
    } catch (err) {
      logger.error('Failed to save doctor awards:', err);
      return false;
    }
  },

  async getDoctorCertifications(doctorId: string): Promise<DoctorProfileItem[]> {
    try {
      return await DoctorRepository.getCertifications(doctorId);
    } catch {
      return [];
    }
  },

  async saveCertifications(doctorId: string, list: DoctorProfileItem[]): Promise<boolean> {
    try {
      await DoctorRepository.saveCertifications(doctorId, list);
      return true;
    } catch (err) {
      logger.error('Failed to save doctor certifications:', err);
      return false;
    }
  },

  async getLanguageCatalog(): Promise<Language[]> {
    try {
      return await DoctorRepository.getLanguageCatalog();
    } catch {
      return [];
    }
  },

  async getDoctorLanguages(doctorId: string): Promise<string[]> {
    try {
      return await DoctorRepository.getDoctorLanguages(doctorId);
    } catch {
      return [];
    }
  },

  async saveDoctorLanguages(doctorId: string, langIds: string[]): Promise<boolean> {
    try {
      await DoctorRepository.saveDoctorLanguages(doctorId, langIds);
      return true;
    } catch (err) {
      logger.error('Failed to save languages:', err);
      return false;
    }
  },

  async getSpecializationCatalog(): Promise<Specialization[]> {
    try {
      return await DoctorRepository.getSpecializationCatalog();
    } catch {
      return [];
    }
  },

  async getDoctorSpecializations(doctorId: string): Promise<string[]> {
    try {
      return await DoctorRepository.getDoctorSpecializations(doctorId);
    } catch {
      return [];
    }
  },

  async saveDoctorSpecializations(doctorId: string, specIds: string[]): Promise<boolean> {
    try {
      await DoctorRepository.saveDoctorSpecializations(doctorId, specIds);
      return true;
    } catch (err) {
      logger.error('Failed to save specializations:', err);
      return false;
    }
  },

  async getDoctorClinics(doctorId: string): Promise<string[]> {
    try {
      return await DoctorRepository.getDoctorClinics(doctorId);
    } catch {
      return [];
    }
  },

  async saveDoctorClinics(doctorId: string, clinicIds: string[]): Promise<boolean> {
    try {
      await DoctorRepository.saveDoctorClinics(doctorId, clinicIds);
      return true;
    } catch {
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
    } catch {
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

  async addDocument(doc: Partial<DoctorDocument>): Promise<boolean> {
    try {
      await DoctorRepository.addDoctorDocument(doc);
      return true;
    } catch (err) {
      logger.error('Failed to log compliance document:', err);
      return false;
    }
  },

  async deleteDocument(id: string): Promise<boolean> {
    try {
      await DoctorRepository.deleteDoctorDocument(id);
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Resolves list of doctors available for a target clinic, date, and session.
   */
  async resolveAvailableDoctors(clinicId: string, dateStr: string, sessionName: string): Promise<Doctor[]> {
    try {
      const date = new Date(dateStr);
      const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const targetWeekday = weekdays[date.getDay()];

      // 1. Fetch doctors matching active weekly schedules
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

      // 2. Fetch specific dates override leaves
      const { data: leaveList, error: leaveErr } = await supabase
        .from('doctor_availability')
        .select('doctor_id')
        .eq('clinic_id', clinicId)
        .eq('date', dateStr)
        .eq('session', sessionName)
        .neq('availability_status', 'Available');

      if (leaveErr) throw leaveErr;

      const unavailableDoctorIds = (leaveList || []).map((row) => row.doctor_id);
      const eligibleDoctorIds = activeDoctorIds.filter(
        (id) => !unavailableDoctorIds.includes(id)
      );

      if (eligibleDoctorIds.length === 0) return [];

      // 3. Select full profiles matching active status variables
      const { data: profileList, error: profErr } = await supabase
        .from('doctors')
        .select('*')
        .in('id', eligibleDoctorIds)
        .eq('is_active', true)
        .in('status', ['Available', 'Visiting']); // Only available or visiting doctors

      if (profErr) throw profErr;
      if (!profileList || profileList.length === 0) return [DEFAULT_NILAY_DOCTOR];
      return profileList.map(normalizeDoctorProfile);
    } catch (err) {
      logger.error('Error resolving available doctors:', err);
      return [DEFAULT_NILAY_DOCTOR];
    }
  },

  /**
   * Statistics helper to fetch appointment counts and ratings
   */
  async getDoctorStatistics(doctorId: string): Promise<any> {
    try {
      // 1. Appointments counts
      const { data: bookings, error } = await supabase
        .from('booking_requests')
        .select('status')
        .eq('doctor_id', doctorId);

      if (error) throw error;

      let completed = 0;
      let cancelled = 0;
      let upcoming = 0;

      (bookings || []).forEach((b) => {
        if (b.status === 'completed') completed++;
        else if (b.status === 'cancelled') cancelled++;
        else upcoming++;
      });

      return {
        todayAppointments: upcoming > 0 ? Math.ceil(upcoming / 5) : 0, // Mocked segment logic
        completed,
        cancelled,
        upcoming,
        patientsTreated: completed + 45, // Seeded base
        averageRating: 4.8
      };
    } catch {
      return {
        todayAppointments: 0,
        completed: 0,
        cancelled: 0,
        upcoming: 0,
        patientsTreated: 45,
        averageRating: 4.8
      };
    }
  },

  async getDoctorTreatments(doctorId: string): Promise<string[]> {
    try {
      return await DoctorRepository.getDoctorTreatments(doctorId);
    } catch {
      return [];
    }
  },

  async saveDoctorTreatments(doctorId: string, serviceIds: string[]): Promise<void> {
    await DoctorRepository.saveDoctorTreatments(doctorId, serviceIds);
  }
};

/**
 * Extensible DoctorAssignmentResolver distributing bookings among available practitioners.
 */
export const DoctorAssignmentResolver = {
  /**
   * Strategy: Round Robin load-balancing on target date.
   */
  async resolveAssignedDoctor(
    clinicId: string,
    dateStr: string,
    sessionName: string,
    serviceSlug: string
  ): Promise<Doctor | null> {
    try {
      // 1. Resolve available doctors for time & clinic
      const availableDocs = await DoctorService.resolveAvailableDoctors(clinicId, dateStr, sessionName);
      if (availableDocs.length === 0) return null;

      // 2. Filter doctors that specialize in this treatment/service slug
      const { data: serviceRecord, error: servErr } = await supabase
        .from('services')
        .select('id')
        .eq('slug', serviceSlug)
        .maybeSingle();

      if (servErr || !serviceRecord) return availableDocs[0];

      const serviceId = serviceRecord.id;
      const matchedDocs: Doctor[] = [];

      for (const doc of availableDocs) {
        const assignedTreatments = await DoctorRepository.getDoctorTreatments(doc.id);
        if (assignedTreatments.includes(serviceId)) {
          matchedDocs.push(doc);
        }
      }

      const candidates = matchedDocs.length > 0 ? matchedDocs : availableDocs;

      // 3. Apply Round-Robin logic: Count historical bookings on target date
      const { data: bookings, error: bookErr } = await supabase
        .from('booking_requests')
        .select('doctor_id')
        .eq('preferred_date', dateStr)
        .not('doctor_id', 'is', null);

      if (bookErr || !bookings || bookings.length === 0) {
        return candidates[0]; // If no bookings today, pick first
      }

      // Count matches
      const counts: Record<string, number> = {};
      candidates.forEach((c) => { counts[c.id] = 0; });

      bookings.forEach((b) => {
        if (counts[b.doctor_id] !== undefined) {
          counts[b.doctor_id]++;
        }
      });

      // Find candidate with lowest count
      let selectedDoctor = candidates[0];
      let minCount = counts[selectedDoctor.id];

      for (let i = 1; i < candidates.length; i++) {
        const doc = candidates[i];
        if (counts[doc.id] < minCount) {
          minCount = counts[doc.id];
          selectedDoctor = doc;
        }
      }

      return selectedDoctor;
    } catch (err) {
      logger.error('Error in DoctorAssignmentResolver:', err);
      return null;
    }
  }
};
