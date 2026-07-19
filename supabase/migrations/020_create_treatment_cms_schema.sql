-- Migration: 020_create_treatment_cms_schema.sql
-- Description: Sets up Treatment Management CMS as the primary business entity with full publishing workflows,
-- duration parameters, comprehensive pricing, gallery, FAQs, SEO, and CMS blocks. Ensures 100% synchronization with legacy services.

-- 1. Create Treatment Categories
CREATE TABLE IF NOT EXISTS public.treatment_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    icon VARCHAR(100),
    description TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Seed Categories Idempotently
INSERT INTO public.treatment_categories (slug, name, description, display_order) VALUES
('orthodontics', 'Orthodontics', 'Correcting bites, occlusions, and teeth alignment.', 1),
('pediatric', 'Pediatric', 'Dental care for children and young patients.', 2),
('prosthodontics', 'Prosthodontics', 'Dental prosthetics, crowns, bridges, and dentures.', 3),
('implantology', 'Implantology', 'Dental implants and surgical replacements.', 4),
('surgery', 'Surgery', 'Oral surgeries and extractions.', 5),
('restorative', 'Restorative', 'Fillings, inlays, and general teeth repair.', 6),
('emergency', 'Emergency', 'Urgent dental care and pain management.', 7),
('preventive', 'Preventive', 'Cleanings, sealants, and cavity preventions.', 8),
('endodontics', 'Endodontics', 'Root canal therapies and pulp procedures.', 9),
('diagnostics', 'Diagnostics', 'X-rays, examinations, and scans.', 10),
('cosmetic', 'Cosmetic', 'Teeth whitening and veneers.', 11),
('general', 'General', 'Common consultations and checkups.', 12),
('periodontics', 'Periodontics', 'Gum therapies and periodontal care.', 13)
ON CONFLICT (slug) DO NOTHING;

-- 2. Create Treatments Table (Primary Business Entity)
CREATE TABLE IF NOT EXISTS public.treatments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(100),
    featured BOOLEAN DEFAULT false,
    category_id UUID REFERENCES public.treatment_categories(id) ON DELETE SET NULL,
    required_specialization_id UUID REFERENCES public.specialization_catalog(id) ON DELETE SET NULL,
    status VARCHAR(50) DEFAULT 'Published' CHECK (status IN ('Draft', 'Published', 'Hidden', 'Archived')),
    consultation_duration INTEGER DEFAULT 15,
    procedure_duration INTEGER DEFAULT 45,
    recovery_time VARCHAR(100) DEFAULT '1-2 days',
    follow_up_required BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    views_count INTEGER DEFAULT 0,
    bookings_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Populate treatments from existing legacy services table (Idempotent mirror)
INSERT INTO public.treatments (
    id, slug, name, description, icon, featured, category_id, status, 
    consultation_duration, procedure_duration, display_order, views_count, bookings_count, created_at, updated_at
)
SELECT 
    s.id, s.slug, s.name, s.description, s.icon, s.featured,
    (SELECT c.id FROM public.treatment_categories c WHERE c.name = s.category OR c.slug = lower(s.category) LIMIT 1),
    CASE WHEN s.is_active = false THEN 'Hidden' ELSE 'Published' END,
    15,
    COALESCE(s.estimated_duration, 45),
    s.display_order,
    COALESCE(s.views_count, 0),
    COALESCE(s.bookings_count, 0),
    s.created_at,
    s.updated_at
FROM public.services s
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    category_id = COALESCE(EXCLUDED.category_id, public.treatments.category_id);

-- Ensure services table columns exist and mirror treatments
ALTER TABLE public.services 
ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES public.treatment_categories(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS views_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS bookings_count INTEGER DEFAULT 0;

-- Map legacy category_id on services
UPDATE public.services s
SET category_id = (SELECT id FROM public.treatment_categories c WHERE c.name = s.category OR c.slug = lower(s.category) LIMIT 1)
WHERE category_id IS NULL;

-- Create Synchronization Triggers to keep services <-> treatments 100% identical in ID/Slug/Name
CREATE OR REPLACE FUNCTION public.sync_treatments_to_services()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO public.services (id, slug, name, description, icon, featured, category, category_id, estimated_duration, display_order, is_active, views_count, bookings_count, created_at, updated_at)
    VALUES (
        NEW.id, NEW.slug, NEW.name, NEW.description, NEW.icon, NEW.featured,
        COALESCE((SELECT name FROM public.treatment_categories WHERE id = NEW.category_id), 'General'),
        NEW.category_id, NEW.procedure_duration, NEW.display_order,
        CASE WHEN NEW.status = 'Published' THEN true ELSE false END,
        NEW.views_count, NEW.bookings_count, NEW.created_at, NEW.updated_at
    )
    ON CONFLICT (id) DO UPDATE SET
        slug = EXCLUDED.slug,
        name = EXCLUDED.name,
        description = EXCLUDED.description,
        icon = EXCLUDED.icon,
        featured = EXCLUDED.featured,
        category = EXCLUDED.category,
        category_id = EXCLUDED.category_id,
        estimated_duration = EXCLUDED.estimated_duration,
        display_order = EXCLUDED.display_order,
        is_active = EXCLUDED.is_active,
        views_count = EXCLUDED.views_count,
        bookings_count = EXCLUDED.bookings_count,
        updated_at = EXCLUDED.updated_at;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_sync_treatments_to_services ON public.treatments;
CREATE TRIGGER trg_sync_treatments_to_services
AFTER INSERT OR UPDATE ON public.treatments
FOR EACH ROW EXECUTE FUNCTION public.sync_treatments_to_services();

-- 3. Enhance Treatment Pricing (Support all required fields)
ALTER TABLE public.treatment_pricing
ADD COLUMN IF NOT EXISTS treatment_id UUID REFERENCES public.treatments(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS consultation_fee NUMERIC(10,2) DEFAULT 500.00,
ADD COLUMN IF NOT EXISTS minimum_price NUMERIC(10,2),
ADD COLUMN IF NOT EXISTS maximum_price NUMERIC(10,2),
ADD COLUMN IF NOT EXISTS offer_price NUMERIC(10,2),
ADD COLUMN IF NOT EXISTS currency VARCHAR(10) DEFAULT 'INR',
ADD COLUMN IF NOT EXISTS emi_available BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS insurance_supported BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS price_notes TEXT,
ADD COLUMN IF NOT EXISTS effective_from DATE,
ADD COLUMN IF NOT EXISTS effective_to DATE;

-- Populate treatment_id from service_id if empty
UPDATE public.treatment_pricing SET treatment_id = service_id WHERE treatment_id IS NULL;
UPDATE public.treatment_pricing SET offer_price = sale_price WHERE offer_price IS NULL AND sale_price IS NOT NULL;
UPDATE public.treatment_pricing SET insurance_supported = insurance_covered WHERE insurance_supported IS NULL AND insurance_covered IS NOT NULL;

-- 4. Clinic-to-Treatment Mapping Join Table
CREATE TABLE IF NOT EXISTS public.clinic_treatments (
    clinic_id UUID REFERENCES public.clinics(id) ON DELETE CASCADE,
    service_id UUID REFERENCES public.services(id) ON DELETE CASCADE,
    treatment_id UUID REFERENCES public.treatments(id) ON DELETE CASCADE,
    PRIMARY KEY (clinic_id, service_id)
);

ALTER TABLE public.clinic_treatments ADD COLUMN IF NOT EXISTS treatment_id UUID REFERENCES public.treatments(id) ON DELETE CASCADE;
UPDATE public.clinic_treatments SET treatment_id = service_id WHERE treatment_id IS NULL;

-- Ensure all treatments are mapped to all clinics by default for continuity
INSERT INTO public.clinic_treatments (clinic_id, service_id, treatment_id)
SELECT c.id, t.id, t.id
FROM public.clinics c, public.treatments t
ON CONFLICT DO NOTHING;

-- 5. Enhance Treatment Gallery
ALTER TABLE public.treatment_gallery
ADD COLUMN IF NOT EXISTS treatment_id UUID REFERENCES public.treatments(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS alt_text VARCHAR(255),
ADD COLUMN IF NOT EXISTS image_type VARCHAR(50) DEFAULT 'Before' CHECK (image_type IN ('Before', 'After', 'Illustration', 'Procedure', 'Clinic'));

UPDATE public.treatment_gallery SET treatment_id = service_id WHERE treatment_id IS NULL;

-- 6. Enhance Treatment FAQs
ALTER TABLE public.treatment_faqs
ADD COLUMN IF NOT EXISTS treatment_id UUID REFERENCES public.treatments(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS category VARCHAR(100) DEFAULT 'General',
ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS visibility VARCHAR(50) DEFAULT 'Public' CHECK (visibility IN ('Public', 'Patients Only', 'Hidden'));

UPDATE public.treatment_faqs SET treatment_id = service_id WHERE treatment_id IS NULL;

-- 7. Create Treatment SEO Support
CREATE TABLE IF NOT EXISTS public.treatment_seo (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    treatment_id UUID REFERENCES public.treatments(id) ON DELETE CASCADE UNIQUE,
    service_id UUID REFERENCES public.services(id) ON DELETE CASCADE,
    meta_title VARCHAR(255),
    meta_description TEXT,
    canonical_url VARCHAR(500),
    og_image VARCHAR(500),
    schema JSONB,
    robots VARCHAR(100) DEFAULT 'index, follow',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 8. Create Content Blocks Table
CREATE TABLE IF NOT EXISTS public.treatment_blocks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    treatment_id UUID REFERENCES public.treatments(id) ON DELETE CASCADE,
    service_id UUID REFERENCES public.services(id) ON DELETE CASCADE,
    block_type VARCHAR(50) NOT NULL CHECK (block_type IN ('Overview', 'Benefits', 'Procedure', 'Preparation', 'Recovery', 'Risks', 'Aftercare')),
    title VARCHAR(255),
    content TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT unique_treatment_block_type UNIQUE (treatment_id, block_type)
);

-- Enable RLS on all tables
ALTER TABLE public.treatment_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.treatments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.treatment_pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinic_treatments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.treatment_gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.treatment_faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.treatment_seo ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.treatment_blocks ENABLE ROW LEVEL SECURITY;

-- Idempotent Policy Drops & Creations
DROP POLICY IF EXISTS "Allow public select treatment_categories" ON public.treatment_categories;
DROP POLICY IF EXISTS "Allow public select treatments" ON public.treatments;
DROP POLICY IF EXISTS "Allow public select treatment_pricing" ON public.treatment_pricing;
DROP POLICY IF EXISTS "Allow public select clinic_treatments" ON public.clinic_treatments;
DROP POLICY IF EXISTS "Allow public select treatment_gallery" ON public.treatment_gallery;
DROP POLICY IF EXISTS "Allow public select treatment_faqs" ON public.treatment_faqs;
DROP POLICY IF EXISTS "Allow public select treatment_seo" ON public.treatment_seo;
DROP POLICY IF EXISTS "Allow public select treatment_blocks" ON public.treatment_blocks;

DROP POLICY IF EXISTS "Allow authenticated write treatment_categories" ON public.treatment_categories;
DROP POLICY IF EXISTS "Allow authenticated write treatments" ON public.treatments;
DROP POLICY IF EXISTS "Allow authenticated write treatment_pricing" ON public.treatment_pricing;
DROP POLICY IF EXISTS "Allow authenticated write clinic_treatments" ON public.clinic_treatments;
DROP POLICY IF EXISTS "Allow authenticated write treatment_gallery" ON public.treatment_gallery;
DROP POLICY IF EXISTS "Allow authenticated write treatment_faqs" ON public.treatment_faqs;
DROP POLICY IF EXISTS "Allow authenticated write treatment_seo" ON public.treatment_seo;
DROP POLICY IF EXISTS "Allow authenticated write treatment_blocks" ON public.treatment_blocks;

CREATE POLICY "Allow public select treatment_categories" ON public.treatment_categories FOR SELECT USING (true);
CREATE POLICY "Allow public select treatments" ON public.treatments FOR SELECT USING (true);
CREATE POLICY "Allow public select treatment_pricing" ON public.treatment_pricing FOR SELECT USING (true);
CREATE POLICY "Allow public select clinic_treatments" ON public.clinic_treatments FOR SELECT USING (true);
CREATE POLICY "Allow public select treatment_gallery" ON public.treatment_gallery FOR SELECT USING (true);
CREATE POLICY "Allow public select treatment_faqs" ON public.treatment_faqs FOR SELECT USING (true);
CREATE POLICY "Allow public select treatment_seo" ON public.treatment_seo FOR SELECT USING (true);
CREATE POLICY "Allow public select treatment_blocks" ON public.treatment_blocks FOR SELECT USING (true);

CREATE POLICY "Allow authenticated write treatment_categories" ON public.treatment_categories FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated write treatments" ON public.treatments FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated write treatment_pricing" ON public.treatment_pricing FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated write clinic_treatments" ON public.clinic_treatments FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated write treatment_gallery" ON public.treatment_gallery FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated write treatment_faqs" ON public.treatment_faqs FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated write treatment_seo" ON public.treatment_seo FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated write treatment_blocks" ON public.treatment_blocks FOR ALL TO authenticated USING (true);

-- Create Indexes for performance
CREATE INDEX IF NOT EXISTS idx_treatments_category_id ON public.treatments(category_id);
CREATE INDEX IF NOT EXISTS idx_treatments_status ON public.treatments(status);
CREATE INDEX IF NOT EXISTS idx_treatments_slug ON public.treatments(slug);
CREATE INDEX IF NOT EXISTS idx_services_category_id ON public.services(category_id);
CREATE INDEX IF NOT EXISTS idx_treatment_pricing_service ON public.treatment_pricing(service_id);
CREATE INDEX IF NOT EXISTS idx_treatment_pricing_treatment ON public.treatment_pricing(treatment_id);
CREATE INDEX IF NOT EXISTS idx_treatment_pricing_clinic ON public.treatment_pricing(clinic_id);
CREATE INDEX IF NOT EXISTS idx_clinic_treatments_service ON public.clinic_treatments(service_id);
CREATE INDEX IF NOT EXISTS idx_clinic_treatments_treatment ON public.clinic_treatments(treatment_id);
CREATE INDEX IF NOT EXISTS idx_treatment_gallery_service ON public.treatment_gallery(service_id);
CREATE INDEX IF NOT EXISTS idx_treatment_gallery_treatment ON public.treatment_gallery(treatment_id);
CREATE INDEX IF NOT EXISTS idx_treatment_faqs_service ON public.treatment_faqs(service_id);
CREATE INDEX IF NOT EXISTS idx_treatment_faqs_treatment ON public.treatment_faqs(treatment_id);
CREATE INDEX IF NOT EXISTS idx_treatment_seo_treatment ON public.treatment_seo(treatment_id);
CREATE INDEX IF NOT EXISTS idx_treatment_blocks_treatment ON public.treatment_blocks(treatment_id);

-- 9. Add increment views RPC function
CREATE OR REPLACE FUNCTION public.increment_service_views(p_service_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE public.services SET views_count = COALESCE(views_count, 0) + 1 WHERE id = p_service_id;
    UPDATE public.treatments SET views_count = COALESCE(views_count, 0) + 1 WHERE id = p_service_id;
END;
$$;
