-- Migration: 011_create_indexes.sql
-- Description: Create indexes and partial indexes for high-performance querying and soft-delete filtering.

CREATE INDEX IF NOT EXISTS idx_patients_phone ON public.patients(phone);
CREATE INDEX IF NOT EXISTS idx_patients_is_active ON public.patients(is_active);

CREATE INDEX IF NOT EXISTS idx_clinics_slug ON public.clinics(slug);
CREATE INDEX IF NOT EXISTS idx_clinics_is_active ON public.clinics(is_active);

CREATE INDEX IF NOT EXISTS idx_clinic_schedule_clinic_id ON public.clinic_schedule(clinic_id);
CREATE INDEX IF NOT EXISTS idx_clinic_schedule_is_active ON public.clinic_schedule(is_active);

CREATE INDEX IF NOT EXISTS idx_services_slug ON public.services(slug);
CREATE INDEX IF NOT EXISTS idx_services_category ON public.services(category);
CREATE INDEX IF NOT EXISTS idx_services_is_active ON public.services(is_active);

CREATE INDEX IF NOT EXISTS idx_booking_requests_patient_id ON public.booking_requests(patient_id);
CREATE INDEX IF NOT EXISTS idx_booking_requests_clinic_id ON public.booking_requests(clinic_id);
CREATE INDEX IF NOT EXISTS idx_booking_requests_service_id ON public.booking_requests(service_id);

-- Partial indexes for active (non-deleted) bookings
CREATE INDEX IF NOT EXISTS idx_booking_requests_status_active 
    ON public.booking_requests(status) WHERE is_deleted = false;
CREATE INDEX IF NOT EXISTS idx_booking_requests_preferred_date_active 
    ON public.booking_requests(preferred_date) WHERE is_deleted = false;

CREATE INDEX IF NOT EXISTS idx_status_history_booking_id ON public.appointment_status_history(booking_id);

CREATE INDEX IF NOT EXISTS idx_notifications_target_role_read 
    ON public.notifications(target_role, is_read);
