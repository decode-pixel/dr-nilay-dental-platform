-- Migration: 019_normalize_doctor_schema.sql
-- Description: Normalizes qualifications, awards, certifications, languages, and specializations into dedicated tables.

-- 1. Extend doctors profile table with portal and status fields
ALTER TABLE public.doctors 
ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'Available' CHECK (status IN ('Available', 'On Leave', 'Inactive', 'Retired', 'Visiting', 'Emergency Leave')),
ADD COLUMN IF NOT EXISTS login_enabled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS profile_visibility BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS public_slug VARCHAR(255) UNIQUE,
ADD COLUMN IF NOT EXISTS last_login TIMESTAMPTZ;

-- Update public_slug for existing doctor
UPDATE public.doctors SET public_slug = 'dr-nilay-saha' WHERE name = 'Dr. Nilay Saha' AND public_slug IS NULL;

-- 2. Create doctor_qualifications table
CREATE TABLE IF NOT EXISTS public.doctor_qualifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    doctor_id UUID REFERENCES public.doctors(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    institution VARCHAR(255) NOT NULL,
    description TEXT,
    issue_date DATE,
    display_order INTEGER DEFAULT 0,
    attachment_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Create doctor_awards table
CREATE TABLE IF NOT EXISTS public.doctor_awards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    doctor_id UUID REFERENCES public.doctors(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    institution VARCHAR(255) NOT NULL,
    description TEXT,
    issue_date DATE,
    display_order INTEGER DEFAULT 0,
    attachment_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Create doctor_certifications table
CREATE TABLE IF NOT EXISTS public.doctor_certifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    doctor_id UUID REFERENCES public.doctors(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    institution VARCHAR(255) NOT NULL,
    description TEXT,
    issue_date DATE,
    display_order INTEGER DEFAULT 0,
    attachment_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Language catalog & mapping tables
CREATE TABLE IF NOT EXISTS public.language_catalog (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.doctor_languages (
    doctor_id UUID REFERENCES public.doctors(id) ON DELETE CASCADE,
    language_id UUID REFERENCES public.language_catalog(id) ON DELETE CASCADE,
    PRIMARY KEY (doctor_id, language_id)
);

-- 6. Specialization catalog & mapping tables
CREATE TABLE IF NOT EXISTS public.specialization_catalog (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.doctor_specializations (
    doctor_id UUID REFERENCES public.doctors(id) ON DELETE CASCADE,
    specialization_id UUID REFERENCES public.specialization_catalog(id) ON DELETE CASCADE,
    PRIMARY KEY (doctor_id, specialization_id)
);

-- 7. Extend doctor_documents with compliance properties
ALTER TABLE public.doctor_documents
ADD COLUMN IF NOT EXISTS expiry_date DATE,
ADD COLUMN IF NOT EXISTS verification_status VARCHAR(50) DEFAULT 'Pending' CHECK (verification_status IN ('Pending', 'Verified', 'Rejected')),
ADD COLUMN IF NOT EXISTS verified_by UUID,
ADD COLUMN IF NOT EXISTS verified_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS is_required BOOLEAN DEFAULT false;

-- Enable RLS on all newly created tables
ALTER TABLE public.doctor_qualifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctor_awards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctor_certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.language_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctor_languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.specialization_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctor_specializations ENABLE ROW LEVEL SECURITY;

-- SELECT policies
CREATE POLICY "Allow public select doctor_qualifications" ON public.doctor_qualifications FOR SELECT USING (true);
CREATE POLICY "Allow public select doctor_awards" ON public.doctor_awards FOR SELECT USING (true);
CREATE POLICY "Allow public select doctor_certifications" ON public.doctor_certifications FOR SELECT USING (true);
CREATE POLICY "Allow public select language_catalog" ON public.language_catalog FOR SELECT USING (true);
CREATE POLICY "Allow public select doctor_languages" ON public.doctor_languages FOR SELECT USING (true);
CREATE POLICY "Allow public select specialization_catalog" ON public.specialization_catalog FOR SELECT USING (true);
CREATE POLICY "Allow public select doctor_specializations" ON public.doctor_specializations FOR SELECT USING (true);

-- WRITE policies
CREATE POLICY "Allow authenticated write doctor_qualifications" ON public.doctor_qualifications FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated write doctor_awards" ON public.doctor_awards FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated write doctor_certifications" ON public.doctor_certifications FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated write language_catalog" ON public.language_catalog FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated write doctor_languages" ON public.doctor_languages FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated write specialization_catalog" ON public.specialization_catalog FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated write doctor_specializations" ON public.doctor_specializations FOR ALL TO authenticated USING (true);

-- Create Indexes
CREATE INDEX IF NOT EXISTS idx_doctor_qualifications_doc ON public.doctor_qualifications(doctor_id);
CREATE INDEX IF NOT EXISTS idx_doctor_awards_doc ON public.doctor_awards(doctor_id);
CREATE INDEX IF NOT EXISTS idx_doctor_certifications_doc ON public.doctor_certifications(doctor_id);
CREATE INDEX IF NOT EXISTS idx_doctor_languages_doc ON public.doctor_languages(doctor_id);
CREATE INDEX IF NOT EXISTS idx_doctor_specializations_doc ON public.doctor_specializations(doctor_id);

-- 8. Seed Initial Data
-- Languages catalog
INSERT INTO public.language_catalog (code, name) VALUES
('en', 'English'),
('bn', 'Bengali'),
('hi', 'Hindi')
ON CONFLICT (code) DO NOTHING;

-- Specializations catalog
INSERT INTO public.specialization_catalog (name, description) VALUES
('Orthodontics', 'Specialty focused on correcting bites, occlusions, and teeth alignment.'),
('Endodontics', 'Specialty focused on dental pulp and root canal therapies.'),
('General Dentistry', 'Preventive care, cleanings, and common restorations.')
ON CONFLICT (name) DO NOTHING;

-- Seed Dr. Nilay Saha's qualifications
INSERT INTO public.doctor_qualifications (doctor_id, title, institution, description, issue_date, display_order)
SELECT 
    d.id,
    'Bachelor of Dental Surgery (BDS)',
    'West Bengal University of Health Sciences',
    'Completed standard dental surgery license.',
    '2014-06-01',
    1
FROM public.doctors d
WHERE d.name = 'Dr. Nilay Saha'
ON CONFLICT DO NOTHING;

INSERT INTO public.doctor_qualifications (doctor_id, title, institution, description, issue_date, display_order)
SELECT 
    d.id,
    'Master of Dental Surgery (MDS)',
    'West Bengal University of Health Sciences',
    'Specialized in Orthodontics and Digital Dentistry.',
    '2017-06-01',
    2
FROM public.doctors d
WHERE d.name = 'Dr. Nilay Saha'
ON CONFLICT DO NOTHING;

-- Seed Dr. Nilay Saha's specializations
INSERT INTO public.doctor_specializations (doctor_id, specialization_id)
SELECT d.id, s.id
FROM public.doctors d, public.specialization_catalog s
WHERE d.name = 'Dr. Nilay Saha' AND s.name IN ('Orthodontics', 'Endodontics')
ON CONFLICT DO NOTHING;

-- Seed Dr. Nilay Saha's languages
INSERT INTO public.doctor_languages (doctor_id, language_id)
SELECT d.id, l.id
FROM public.doctors d, public.language_catalog l
WHERE d.name = 'Dr. Nilay Saha' AND l.name IN ('English', 'Bengali', 'Hindi')
ON CONFLICT DO NOTHING;
