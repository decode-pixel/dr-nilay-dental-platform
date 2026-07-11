-- Migration: 010_enable_rls.sql
-- Description: Enable Row Level Security (RLS) across all tables and configure public read/insert policies.

-- Enable RLS on all tables
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinic_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointment_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- 1. Public Read Policies for Catalog & Configuration
DROP POLICY IF EXISTS "Public read active clinics" ON public.clinics;
CREATE POLICY "Public read active clinics" ON public.clinics
    FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Public read active clinic schedule" ON public.clinic_schedule;
CREATE POLICY "Public read active clinic schedule" ON public.clinic_schedule
    FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Public read active services" ON public.services;
CREATE POLICY "Public read active services" ON public.services
    FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Public read settings" ON public.settings;
CREATE POLICY "Public read settings" ON public.settings
    FOR SELECT USING (true);

-- 2. Public Insert Policies for Patients & Booking Requests
DROP POLICY IF EXISTS "Public insert patients" ON public.patients;
CREATE POLICY "Public insert patients" ON public.patients
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public insert booking requests" ON public.booking_requests;
CREATE POLICY "Public insert booking requests" ON public.booking_requests
    FOR INSERT WITH CHECK (true);

-- 3. Patient Privacy Lookup (Reference Code + Phone verification function)
CREATE OR REPLACE FUNCTION public.lookup_booking_request(p_reference_code VARCHAR, p_phone VARCHAR)
RETURNS TABLE (
    id UUID,
    reference_code VARCHAR,
    status public.booking_lifecycle_status,
    preferred_date DATE,
    appointment_slot VARCHAR,
    appointment_time TIME,
    appointment_serial INTEGER,
    clinic_name VARCHAR,
    service_name VARCHAR,
    patient_name VARCHAR
)
LANGUAGE sql
SECURITY DEFINER
AS $$
    SELECT 
        b.id,
        b.reference_code,
        b.status,
        b.preferred_date,
        b.appointment_slot,
        b.appointment_time,
        b.appointment_serial,
        c.name AS clinic_name,
        COALESCE(s.name, b.service_name_fallback) AS service_name,
        p.full_name AS patient_name
    FROM public.booking_requests b
    JOIN public.patients p ON p.id = b.patient_id
    JOIN public.clinics c ON c.id = b.clinic_id
    LEFT JOIN public.services s ON s.id = b.service_id
    WHERE b.reference_code = p_reference_code
      AND p.phone = p_phone
      AND b.is_deleted = false;
$$;

COMMENT ON FUNCTION public.lookup_booking_request IS 'Securely looks up booking status requiring both Reference Code and Patient Phone Number.';
