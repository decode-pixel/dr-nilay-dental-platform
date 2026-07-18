-- Migration: 020_create_treatment_cms_schema.sql
-- Description: Sets up normalized categories, pricing, clinic mappings, FAQs, and galleries for treatments.

-- 1. Create Treatment Categories
CREATE TABLE IF NOT EXISTS public.treatment_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    icon VARCHAR(100),
    description TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Link services to categories
ALTER TABLE public.services 
ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES public.treatment_categories(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS views_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS bookings_count INTEGER DEFAULT 0;

-- 3. Clinic-Specific Pricing Table
CREATE TABLE IF NOT EXISTS public.treatment_pricing (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_id UUID REFERENCES public.services(id) ON DELETE CASCADE,
    clinic_id UUID REFERENCES public.clinics(id) ON DELETE CASCADE,
    base_price NUMERIC(10,2) NOT NULL,
    sale_price NUMERIC(10,2),
    insurance_covered BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT unique_treatment_clinic_price UNIQUE (service_id, clinic_id)
);

-- 4. Clinic-to-Treatment Mapping Join Table
CREATE TABLE IF NOT EXISTS public.clinic_treatments (
    clinic_id UUID REFERENCES public.clinics(id) ON DELETE CASCADE,
    service_id UUID REFERENCES public.services(id) ON DELETE CASCADE,
    PRIMARY KEY (clinic_id, service_id)
);

-- 5. Treatment Before/After Media Gallery Join Table
CREATE TABLE IF NOT EXISTS public.treatment_gallery (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_id UUID REFERENCES public.services(id) ON DELETE CASCADE,
    media_file_id UUID REFERENCES public.media_files(id) ON DELETE CASCADE,
    caption VARCHAR(255),
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Treatment Frequently Asked Questions
CREATE TABLE IF NOT EXISTS public.treatment_faqs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_id UUID REFERENCES public.services(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.treatment_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.treatment_pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinic_treatments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.treatment_gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.treatment_faqs ENABLE ROW LEVEL SECURITY;

-- SELECT policies
CREATE POLICY "Allow public select treatment_categories" ON public.treatment_categories FOR SELECT USING (true);
CREATE POLICY "Allow public select treatment_pricing" ON public.treatment_pricing FOR SELECT USING (true);
CREATE POLICY "Allow public select clinic_treatments" ON public.clinic_treatments FOR SELECT USING (true);
CREATE POLICY "Allow public select treatment_gallery" ON public.treatment_gallery FOR SELECT USING (true);
CREATE POLICY "Allow public select treatment_faqs" ON public.treatment_faqs FOR SELECT USING (true);

-- WRITE policies
CREATE POLICY "Allow authenticated write treatment_categories" ON public.treatment_categories FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated write treatment_pricing" ON public.treatment_pricing FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated write clinic_treatments" ON public.clinic_treatments FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated write treatment_gallery" ON public.treatment_gallery FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated write treatment_faqs" ON public.treatment_faqs FOR ALL TO authenticated USING (true);

-- Create Indexes
CREATE INDEX IF NOT EXISTS idx_services_category_id ON public.services(category_id);
CREATE INDEX IF NOT EXISTS idx_treatment_pricing_service ON public.treatment_pricing(service_id);
CREATE INDEX IF NOT EXISTS idx_treatment_pricing_clinic ON public.treatment_pricing(clinic_id);
CREATE INDEX IF NOT EXISTS idx_clinic_treatments_service ON public.clinic_treatments(service_id);
CREATE INDEX IF NOT EXISTS idx_treatment_gallery_service ON public.treatment_gallery(service_id);
CREATE INDEX IF NOT EXISTS idx_treatment_faqs_service ON public.treatment_faqs(service_id);

-- 7. Seed Categories
INSERT INTO public.treatment_categories (slug, name, description) VALUES
('orthodontics', 'Orthodontics', 'Correcting bites, occlusions, and teeth alignment.'),
('pediatric', 'Pediatric', 'Dental care for children and young patients.'),
('prosthodontics', 'Prosthodontics', 'Dental prosthetics, crowns, bridges, and dentures.'),
('implantology', 'Implantology', 'Dental implants and surgical replacements.'),
('surgery', 'Surgery', 'Oral surgeries and extractions.'),
('restorative', 'Restorative', 'Fillings, inlays, and general teeth repair.'),
('emergency', 'Emergency', 'Urgent dental care and pain management.'),
('preventive', 'Preventive', 'Cleanings, sealants, and cavity preventions.'),
('endodontics', 'Endodontics', 'Root canal therapies and pulp procedures.'),
('diagnostics', 'Diagnostics', 'X-rays, examinations, and scans.'),
('cosmetic', 'Cosmetic', 'Teeth whitening and veneers.'),
('general', 'General', 'Common consultations and checkups.'),
('periodontics', 'Periodontics', 'Gum therapies and periodontal care.')
ON CONFLICT (slug) DO NOTHING;

-- Map existing services to seeded categories
UPDATE public.services s
SET category_id = (SELECT id FROM public.treatment_categories c WHERE c.name = s.category)
WHERE category_id IS NULL;

-- Link all existing services to all existing clinics (backwards compatibility safety net)
INSERT INTO public.clinic_treatments (clinic_id, service_id)
SELECT c.id, s.id
FROM public.clinics c, public.services s
ON CONFLICT DO NOTHING;

-- Seed default pricing for existing treatments across all clinics (base: 1500, sale: 1200)
INSERT INTO public.treatment_pricing (service_id, clinic_id, base_price, sale_price, insurance_covered)
SELECT s.id, c.id, 1500.00, 1200.00, true
FROM public.services s, public.clinics c
ON CONFLICT DO NOTHING;

-- 8. Add increment views RPC function
CREATE OR REPLACE FUNCTION public.increment_service_views(p_service_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE public.services
    SET views_count = views_count + 1
    WHERE id = p_service_id;
END;
$$;
