-- Migration: 016_create_clinic_management_schema.sql
-- Description: Expand clinics schema with logo, cover, ratings; create doctors, availability, facility catalog, notices, holidays, and closures tables.

-- 1. Add status to booking_lifecycle_status enum
-- In Postgres, enum value additions cannot run in transactions, so we run this safely.
ALTER TYPE public.booking_lifecycle_status ADD VALUE IF NOT EXISTS 'pending_manual_scheduling';

-- 2. Enhance clinics table
ALTER TABLE public.clinics ADD COLUMN IF NOT EXISTS logo_url TEXT;
ALTER TABLE public.clinics ADD COLUMN IF NOT EXISTS gallery_cover TEXT;
ALTER TABLE public.clinics ADD COLUMN IF NOT EXISTS google_rating NUMERIC(3,2) DEFAULT 4.8;
ALTER TABLE public.clinics ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 120;
ALTER TABLE public.clinics ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;

-- 3. Create Doctors Profile table
CREATE TABLE IF NOT EXISTS public.doctors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    registration_number VARCHAR(255),
    qualification VARCHAR(255),
    designation VARCHAR(255),
    experience_years INTEGER DEFAULT 0,
    languages VARCHAR(255) DEFAULT 'English, Bengali, Hindi',
    bio TEXT,
    profile_image TEXT,
    display_order INTEGER DEFAULT 1,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Create Doctor Availability table
CREATE TABLE IF NOT EXISTS public.doctor_availability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    doctor_id UUID REFERENCES public.doctors(id) ON DELETE CASCADE,
    clinic_id UUID REFERENCES public.clinics(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    session VARCHAR(64) NOT NULL, -- Morning, Afternoon, Evening, Custom
    availability_status VARCHAR(64) NOT NULL DEFAULT 'Available', -- Available, Leave, Holiday, Training, Conference, Emergency
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT unique_doctor_avail_slot UNIQUE (doctor_id, clinic_id, date, session)
);

-- 5. Create Facility Catalog
CREATE TABLE IF NOT EXISTS public.facility_catalog (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) UNIQUE NOT NULL,
    icon_name VARCHAR(64) DEFAULT 'Check',
    description TEXT,
    display_order INTEGER DEFAULT 1,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Create Clinic Facilities link table
CREATE TABLE IF NOT EXISTS public.clinic_facilities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID REFERENCES public.clinics(id) ON DELETE CASCADE,
    facility_id UUID REFERENCES public.facility_catalog(id) ON DELETE CASCADE,
    is_enabled BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT unique_clinic_facility_link UNIQUE (clinic_id, facility_id)
);

-- 7. Create Clinic Notices table
CREATE TABLE IF NOT EXISTS public.clinic_notices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID REFERENCES public.clinics(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    priority VARCHAR(32) DEFAULT 'normal', -- low, normal, high, critical
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 8. Create Clinic Holidays table
CREATE TABLE IF NOT EXISTS public.clinic_holidays (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID REFERENCES public.clinics(id) ON DELETE CASCADE,
    holiday_date DATE NOT NULL,
    reason VARCHAR(255) NOT NULL,
    closed_flag BOOLEAN NOT NULL DEFAULT true,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT unique_clinic_holiday_date UNIQUE (clinic_id, holiday_date)
);

-- 9. Create Temporary Closures table
CREATE TABLE IF NOT EXISTS public.clinic_closures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID REFERENCES public.clinics(id) ON DELETE CASCADE,
    closure_date DATE NOT NULL,
    reason_category VARCHAR(64) NOT NULL, -- Power Failure, Doctor Leave, Emergency, Maintenance, Other
    details TEXT,
    closed_flag BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 10. Enable Row Level Security (RLS)
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctor_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.facility_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinic_facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinic_notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinic_holidays ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinic_closures ENABLE ROW LEVEL SECURITY;

-- 11. Public read permissions
DROP POLICY IF EXISTS "Public read doctors" ON public.doctors;
CREATE POLICY "Public read doctors" ON public.doctors FOR SELECT TO public, authenticated USING (is_active = true);

DROP POLICY IF EXISTS "Public read doctor_availability" ON public.doctor_availability;
CREATE POLICY "Public read doctor_availability" ON public.doctor_availability FOR SELECT TO public, authenticated USING (true);

DROP POLICY IF EXISTS "Public read facility_catalog" ON public.facility_catalog;
CREATE POLICY "Public read facility_catalog" ON public.facility_catalog FOR SELECT TO public, authenticated USING (is_active = true);

DROP POLICY IF EXISTS "Public read clinic_facilities" ON public.clinic_facilities;
CREATE POLICY "Public read clinic_facilities" ON public.clinic_facilities FOR SELECT TO public, authenticated USING (is_enabled = true);

DROP POLICY IF EXISTS "Public read clinic_notices" ON public.clinic_notices;
CREATE POLICY "Public read clinic_notices" ON public.clinic_notices FOR SELECT TO public, authenticated USING (is_active = true);

DROP POLICY IF EXISTS "Public read clinic_holidays" ON public.clinic_holidays;
CREATE POLICY "Public read clinic_holidays" ON public.clinic_holidays FOR SELECT TO public, authenticated USING (true);

DROP POLICY IF EXISTS "Public read clinic_closures" ON public.clinic_closures;
CREATE POLICY "Public read clinic_closures" ON public.clinic_closures FOR SELECT TO public, authenticated USING (true);

-- 12. Authenticated write/manage permissions for assistant dashboard
DROP POLICY IF EXISTS "Authenticated write doctors" ON public.doctors;
CREATE POLICY "Authenticated write doctors" ON public.doctors FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated write doctor_availability" ON public.doctor_availability;
CREATE POLICY "Authenticated write doctor_availability" ON public.doctor_availability FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated write facility_catalog" ON public.facility_catalog;
CREATE POLICY "Authenticated write facility_catalog" ON public.facility_catalog FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated write clinic_facilities" ON public.clinic_facilities;
CREATE POLICY "Authenticated write clinic_facilities" ON public.clinic_facilities FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated write clinic_notices" ON public.clinic_notices;
CREATE POLICY "Authenticated write clinic_notices" ON public.clinic_notices FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated write clinic_holidays" ON public.clinic_holidays;
CREATE POLICY "Authenticated write clinic_holidays" ON public.clinic_holidays FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated write clinic_closures" ON public.clinic_closures;
CREATE POLICY "Authenticated write clinic_closures" ON public.clinic_closures FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 13. Seed default doctor profiles
INSERT INTO public.doctors (name, registration_number, qualification, designation, experience_years, bio)
VALUES (
    'Dr. Nilay Saha',
    'WB-DENT-2026-987',
    'BDS, MDS (Endodontics)',
    'Senior Endodontist & Oral Surgeon',
    10,
    'Dr. Nilay Saha is a highly experienced endodontist specializing in advanced rotary root canal procedures, implants, and painless extractions.'
)
ON CONFLICT DO NOTHING;

-- 14. Seed default facility catalog
INSERT INTO public.facility_catalog (name, icon_name, description)
VALUES 
('Waiting Area', 'Users', 'Comfortable lobby for patients and guardians'),
('Air Conditioning', 'Wind', 'Full climate controlled treatment zones'),
('Parking', 'Car', 'Complimentary parking slots'),
('Digital Payment', 'CreditCard', 'Supports UPI, Cards, and Netbanking'),
('Digital Appointment', 'CalendarCheck', 'Live online queue booking system'),
('Washroom', 'Droplet', 'Clean washroom facilities'),
('Digital X-Ray', 'Camera', 'Instant low radiation dental scans'),
('Sterilization Room', 'ShieldCheck', 'Ultra hygienic autoclave equipment area'),
('Drinking Water', 'Droplet', 'Purified mineral drinking water')
ON CONFLICT (name) DO NOTHING;

-- 15. Create clinic schedule defaults if table is empty
INSERT INTO public.clinic_schedule (clinic_id, day_of_week, session, start_time, end_time)
SELECT c.id, d.day, s.session_name, s.start_t, s.end_t
FROM public.clinics c
CROSS JOIN (
  VALUES 
  ('Monday'), ('Tuesday'), ('Wednesday'), ('Thursday'), ('Friday'), ('Saturday'), ('Sunday')
) d(day)
CROSS JOIN (
  VALUES 
  ('Morning', '10:00:00'::TIME, '14:00:00'::TIME),
  ('Evening', '17:00:00'::TIME, '20:00:00'::TIME)
) s(session_name, start_t, end_t)
WHERE NOT EXISTS (SELECT 1 FROM public.clinic_schedule);
