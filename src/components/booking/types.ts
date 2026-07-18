export type ClinicId = 'belerhat' | 'parulia' | 'nabadwip';

export type SessionType = 'Morning' | 'Afternoon' | 'Evening';

export type BookingStepIndex = 1 | 2 | 3 | 4 | 5 | 6;

export interface BookingState {
  clinicId: ClinicId | '';
  treatmentId: string;
  preferredDate: string; // YYYY-MM-DD
  preferredSession: SessionType | '';
  patientName: string;
  patientPhone: string;
  chiefComplaint: string;
  patientAge?: string;
  patientGender?: 'Male' | 'Female' | 'Other' | 'Prefer not to say' | '';
  doctorId?: string;
}

export interface BookingErrors {
  clinicId?: string;
  treatmentId?: string;
  preferredDate?: string;
  preferredSession?: string;
  patientName?: string;
  patientPhone?: string;
  chiefComplaint?: string;
}

export const STEP_NAMES: Record<BookingStepIndex, string> = {
  1: 'Clinic',
  2: 'Treatment',
  3: 'Schedule',
  4: 'Patient',
  5: 'Review',
  6: 'Done',
};
