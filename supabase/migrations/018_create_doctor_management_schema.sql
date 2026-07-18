-- Migration: 018_create_doctor_management_schema.sql
-- Description: Creates join tables, weekly timings, and document records for doctor profiles with indexes and RLS.

-- 1. Add doctor_id column to booking_requests
ALTER TABLE public.booking_requests 
ADD COLUMN IF NOT EXISTS doctor_id UUID REFERENCES public.doctors(id) ON DELETE SET NULL;

-- 2. Add supplementary fields to doctors profile
ALTER TABLE public.doctors 
ADD COLUMN IF NOT EXISTS cover_image TEXT,
ADD COLUMN IF NOT EXISTS signature_image TEXT,
ADD COLUMN IF NOT EXISTS qualifications TEXT[], -- Array of qualifications
ADD COLUMN IF NOT EXISTS awards TEXT[],         -- Array of awards
ADD COLUMN IF NOT EXISTS certificates TEXT[];   -- Array of certification details

-- 3. Doctor-to-Clinic Assignment Join Table
CREATE TABLE IF NOT EXISTS public.doctor_clinics (
    doctor_id UUID REFERENCES public.doctors(id) ON DELETE CASCADE,
    clinic_id UUID REFERENCES public.clinics(id) ON DELETE CASCADE,
    PRIMARY KEY (doctor_id, clinic_id)
);

-- 4. Doctor-to-Treatment (Service) Join Table
CREATE TABLE IF NOT EXISTS public.doctor_treatments (
    doctor_id UUID REFERENCES public.doctors(id) ON DELETE CASCADE,
    service_id UUID REFERENCES public.services(id) ON DELETE CASCADE,
    PRIMARY KEY (doctor_id, service_id)
);

-- 5. Doctor Weekly Availability Table
CREATE TABLE IF NOT EXISTS public.doctor_weekly_availability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    doctor_id UUID REFERENCES public.doctors(id) ON DELETE CASCADE,
    clinic_id UUID REFERENCES public.clinics(id) ON DELETE CASCADE,
    day_of_week VARCHAR(32) NOT NULL, -- 'Monday', 'Tuesday', ...
    session VARCHAR(32) NOT NULL,    -- 'Morning', 'Evening'
    start_time TIME,
    end_time TIME,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT unique_doctor_weekly_slot UNIQUE (doctor_id, clinic_id, day_of_week, session)
);

-- 6. Doctor Documents / Licensing Table
CREATE TABLE IF NOT EXISTS public.doctor_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    doctor_id UUID REFERENCES public.doctors(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    document_type VARCHAR(100) NOT NULL, -- 'Degree', 'Registration', 'Certificate', 'Other'
    uploaded_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.doctor_clinics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctor_treatments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctor_weekly_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctor_documents ENABLE ROW LEVEL SECURITY;

-- SELECT policies
CREATE POLICY "Allow public select doctor_clinics" ON public.doctor_clinics FOR SELECT USING (true);
CREATE POLICY "Allow public select doctor_treatments" ON public.doctor_treatments FOR SELECT USING (true);
CREATE POLICY "Allow public select doctor_weekly_availability" ON public.doctor_weekly_availability FOR SELECT USING (true);
CREATE POLICY "Allow public select doctor_documents" ON public.doctor_documents FOR SELECT USING (true);

-- WRITE policies
CREATE POLICY "Allow authenticated write doctor_clinics" ON public.doctor_clinics FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated write doctor_treatments" ON public.doctor_treatments FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated write doctor_weekly_availability" ON public.doctor_weekly_availability FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated write doctor_documents" ON public.doctor_documents FOR ALL TO authenticated USING (true);

-- Create optimized Indexes
CREATE INDEX IF NOT EXISTS idx_doctor_clinics_doc ON public.doctor_clinics(doctor_id);
CREATE INDEX IF NOT EXISTS idx_doctor_treatments_doc ON public.doctor_treatments(doctor_id);
CREATE INDEX IF NOT EXISTS idx_doctor_weekly_availability_doc ON public.doctor_weekly_availability(doctor_id);
CREATE INDEX IF NOT EXISTS idx_doctor_documents_doc ON public.doctor_documents(doctor_id);

-- Seed default assignments only if tables are empty
-- Seed Dr. Nilay Saha's clinic assignments (link to Belerhat, Parulia, Nabadwip)
INSERT INTO public.doctor_clinics (doctor_id, clinic_id)
SELECT d.id, c.id 
FROM public.doctors d, public.clinics c
WHERE d.name = 'Dr. Nilay Saha'
ON CONFLICT DO NOTHING;

-- Seed Dr. Nilay Saha's treatment assignments (link to all existing treatments)
INSERT INTO public.doctor_treatments (doctor_id, service_id)
SELECT d.id, s.id
FROM public.doctors d, public.services s
WHERE d.name = 'Dr. Nilay Saha'
ON CONFLICT DO NOTHING;

-- Seed Dr. Nilay Saha's weekly availability slots matching standard clinic operations
INSERT INTO public.doctor_weekly_availability (doctor_id, clinic_id, day_of_week, session, start_time, end_time)
SELECT d.id, c.id, s.day_of_week, s.session, s.start_time, s.end_time
FROM public.doctors d, public.clinics c
JOIN public.clinic_schedule s ON s.clinic_id = c.id
WHERE d.name = 'Dr. Nilay Saha' AND s.doctor_available = true
ON CONFLICT DO NOTHING;

-- 7. Redefine create_booking_request_tx to accept p_doctor_id
CREATE OR REPLACE FUNCTION public.create_booking_request_tx(
    p_clinic_slug character varying,
    p_service_slug character varying,
    p_preferred_date date,
    p_preferred_session character varying,
    p_patient_name character varying,
    p_patient_phone character varying,
    p_chief_complaint text,
    p_patient_age integer,
    p_patient_gender character varying,
    p_status character varying DEFAULT 'new_request'::character varying,
    p_doctor_id uuid DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_clinic_id UUID;
    v_service_id UUID;
    v_patient_id UUID;
    v_booking_id UUID;
    v_reference_code VARCHAR;
    v_service_name VARCHAR;
    v_target_status public.booking_lifecycle_status;
BEGIN
    -- Cast p_status safely
    v_target_status := p_status::public.booking_lifecycle_status;

    -- 1. Find clinic_id by slug
    SELECT id INTO v_clinic_id FROM public.clinics WHERE slug = p_clinic_slug LIMIT 1;
    IF v_clinic_id IS NULL THEN
        RAISE EXCEPTION 'Clinic location with slug % not found', p_clinic_slug;
    END IF;

    -- 2. Find service_id and name by slug
    SELECT id, name INTO v_service_id, v_service_name FROM public.services WHERE slug = p_service_slug LIMIT 1;
    IF v_service_id IS NULL THEN
        RAISE EXCEPTION 'Service/Treatment with slug % not found', p_service_slug;
    END IF;

    -- 3. Find or create patient by phone number
    SELECT id INTO v_patient_id FROM public.patients WHERE phone = p_patient_phone LIMIT 1;
    IF v_patient_id IS NULL THEN
        -- Insert new patient record
        INSERT INTO public.patients (full_name, phone, gender, is_active)
        VALUES (p_patient_name, p_patient_phone, p_patient_gender, true)
        RETURNING id INTO v_patient_id;
    ELSE
        -- Update existing patient fields if they are empty
        UPDATE public.patients
        SET full_name = COALESCE(full_name, p_patient_name),
            gender = COALESCE(gender, p_patient_gender)
        WHERE id = v_patient_id;
    END IF;

    -- 4. Create the booking request
    INSERT INTO public.booking_requests (
        patient_id,
        clinic_id,
        service_id,
        chief_complaint,
        preferred_date,
        appointment_slot,
        status,
        doctor_id
    )
    VALUES (
        v_patient_id,
        v_clinic_id,
        v_service_id,
        p_chief_complaint,
        p_preferred_date,
        p_preferred_session,
        v_target_status,
        p_doctor_id
    )
    RETURNING id, reference_code INTO v_booking_id, v_reference_code;

    -- 5. Create status history entry (audit trail)
    INSERT INTO public.appointment_status_history (
        booking_id,
        old_status,
        new_status,
        notes
    )
    VALUES (
        v_booking_id,
        NULL,
        v_target_status,
        'Booking request created via web portal.'
    );

    -- 6. Create assistant notification
    INSERT INTO public.notifications (
        title,
        message,
        type,
        target_role
    )
    VALUES (
        'New Appointment Request',
        'New booking request (' || v_reference_code || ') from ' || p_patient_name || ' for ' || v_service_name || ' (Status: ' || p_status || ').',
        'booking_request',
        'assistant'
    );

    -- 7. Return success details
    RETURN json_build_object(
        'success', true,
        'booking_id', v_booking_id,
        'reference_code', v_reference_code,
        'patient_id', v_patient_id,
        'patient_name', p_patient_name,
        'clinic_name', (SELECT name FROM public.clinics WHERE id = v_clinic_id),
        'treatment_name', v_service_name
    );
EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object(
            'success', false,
            'error', SQLERRM
        );
END;
$$;
