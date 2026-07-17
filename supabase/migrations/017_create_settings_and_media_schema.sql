-- Migration: 017_create_settings_and_media_schema.sql
-- Description: Creates Platform Settings, Media Library, Website CMS, and Version History tables with indexes and RLS.

-- Create Media Category ENUM type if not exists
DO $$ BEGIN
    CREATE TYPE public.media_category AS ENUM (
        'Clinic', 'Doctor', 'Treatment', 'Gallery', 'Website', 'Documents', 'Patient Files', 'X-rays'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 1. System Settings Key-Value Table
CREATE TABLE IF NOT EXISTS public.system_settings (
    key VARCHAR(255) PRIMARY KEY,
    value JSONB NOT NULL,
    setting_group VARCHAR(100) NOT NULL, -- 'general', 'contact', 'booking', 'appearance', 'notifications'
    description TEXT,
    updated_at TIMESTAMPTZ DEFAULT now(),
    updated_by UUID
);

-- 2. Media Folders Table
CREATE TABLE IF NOT EXISTS public.media_folders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    parent_id UUID REFERENCES public.media_folders(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Media Files Table
CREATE TABLE IF NOT EXISTS public.media_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    folder_id UUID REFERENCES public.media_folders(id) ON DELETE SET NULL,
    category public.media_category NOT NULL DEFAULT 'Website',
    name VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255),
    storage_bucket VARCHAR(100) NOT NULL DEFAULT 'media-library',
    storage_path TEXT NOT NULL,
    webp_path TEXT,
    thumbnail_path TEXT,
    file_size INTEGER NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    width INTEGER,
    height INTEGER,
    alt_text VARCHAR(255),
    public_url TEXT NOT NULL,
    checksum VARCHAR(64),
    version INTEGER DEFAULT 1,
    is_public BOOLEAN DEFAULT true,
    uploaded_by UUID,
    created_by UUID,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Website Sections Table
CREATE TABLE IF NOT EXISTS public.website_sections (
    id VARCHAR(100) PRIMARY KEY, -- 'hero', 'about', 'treatments', 'testimonials', 'footer'
    title VARCHAR(255) NOT NULL,
    description TEXT,
    is_visible BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0
);

-- 5. Website Section Content Table
CREATE TABLE IF NOT EXISTS public.website_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section_id VARCHAR(100) REFERENCES public.website_sections(id) ON DELETE CASCADE,
    content_key VARCHAR(100) NOT NULL,
    draft_content JSONB NOT NULL,
    published_content JSONB,
    is_published BOOLEAN DEFAULT false,
    published_at TIMESTAMPTZ,
    updated_by UUID,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT unique_section_content_key UNIQUE (section_id, content_key)
);

-- 6. SEO Settings Table
CREATE TABLE IF NOT EXISTS public.seo_settings (
    path VARCHAR(255) PRIMARY KEY, -- '/', '/dashboard', '/treatments/:id'
    title VARCHAR(255) NOT NULL,
    meta_description TEXT,
    meta_keywords TEXT[],
    og_title VARCHAR(255),
    og_description TEXT,
    og_image TEXT,
    twitter_title VARCHAR(255),
    twitter_description TEXT,
    twitter_image TEXT,
    canonical_url VARCHAR(512),
    robots_index BOOLEAN DEFAULT true,
    robots_follow BOOLEAN DEFAULT true,
    schema_type VARCHAR(100) DEFAULT 'Dentist',
    last_generated TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 7. Notification Templates Table
CREATE TABLE IF NOT EXISTS public.notification_templates (
    id VARCHAR(100) PRIMARY KEY, -- 'booking_request_sms', 'reminder_24h_wa'
    channel VARCHAR(50) NOT NULL, -- 'whatsapp', 'email', 'sms'
    language VARCHAR(10) DEFAULT 'en', -- 'en', 'bn', 'hi'
    event_trigger VARCHAR(100) NOT NULL,
    template_body TEXT NOT NULL,
    placeholders VARCHAR(50)[],
    preview TEXT,
    version INTEGER DEFAULT 1,
    enabled BOOLEAN DEFAULT true,
    timing_offset_minutes INTEGER DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 8. Content Version History Table
CREATE TABLE IF NOT EXISTS public.content_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_id UUID REFERENCES public.website_content(id) ON DELETE CASCADE,
    version INTEGER NOT NULL,
    published_content JSONB NOT NULL,
    created_by UUID,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 9. Setting Version History Table
CREATE TABLE IF NOT EXISTS public.setting_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    setting_key VARCHAR(255) REFERENCES public.system_settings(key) ON DELETE CASCADE,
    version INTEGER NOT NULL,
    value JSONB NOT NULL,
    created_by UUID,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create optimized Indexes
CREATE INDEX IF NOT EXISTS idx_system_settings_group ON public.system_settings(setting_group);
CREATE INDEX IF NOT EXISTS idx_media_files_folder ON public.media_files(folder_id);
CREATE INDEX IF NOT EXISTS idx_media_files_category ON public.media_files(category);
CREATE INDEX IF NOT EXISTS idx_website_content_section ON public.website_content(section_id);
CREATE INDEX IF NOT EXISTS idx_content_versions_content ON public.content_versions(content_id);
CREATE INDEX IF NOT EXISTS idx_setting_versions_key ON public.setting_versions(setting_key);

-- Enable RLS
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.setting_versions ENABLE ROW LEVEL SECURITY;

-- SELECT policies: allow public or authenticated to read
CREATE POLICY "Allow public select settings" ON public.system_settings FOR SELECT USING (true);
CREATE POLICY "Allow public select folders" ON public.media_folders FOR SELECT USING (true);
CREATE POLICY "Allow public select files" ON public.media_files FOR SELECT USING (true);
CREATE POLICY "Allow public select website_sections" ON public.website_sections FOR SELECT USING (true);
CREATE POLICY "Allow public select website_content" ON public.website_content FOR SELECT USING (true);
CREATE POLICY "Allow public select seo_settings" ON public.seo_settings FOR SELECT USING (true);
CREATE POLICY "Allow public select notification_templates" ON public.notification_templates FOR SELECT USING (true);
CREATE POLICY "Allow public select content_versions" ON public.content_versions FOR SELECT USING (true);
CREATE POLICY "Allow public select setting_versions" ON public.setting_versions FOR SELECT USING (true);

-- WRITE policies: restrict write access to authenticated users
CREATE POLICY "Allow authenticated write settings" ON public.system_settings FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated write folders" ON public.media_folders FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated write files" ON public.media_files FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated write website_sections" ON public.website_sections FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated write website_content" ON public.website_content FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated write seo_settings" ON public.seo_settings FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated write notification_templates" ON public.notification_templates FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated write content_versions" ON public.content_versions FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated write setting_versions" ON public.setting_versions FOR ALL TO authenticated USING (true);

-- Seed default website sections
INSERT INTO public.website_sections (id, title, description, display_order)
VALUES 
    ('hero', 'Hero Section', 'Top banner section of home page', 1),
    ('about', 'About Section', 'Doctor biography and center details', 2),
    ('testimonials', 'Testimonials Section', 'Patient reviews and feedback', 3),
    ('footer', 'Footer Section', 'Copyright and quick links', 4)
ON CONFLICT (id) DO NOTHING;

-- Seed default settings
INSERT INTO public.system_settings (key, value, setting_group, description)
VALUES
    ('clinic_name', '"Saha Dental Clinic"', 'general', 'Central clinical name'),
    ('clinic_tagline', '"Advanced Dentistry & Orthodontics"', 'general', 'Clinical brand tagline'),
    ('primary_phone', '"+916290000000"', 'contact', 'Main office number'),
    ('whatsapp_number', '"+916290000000"', 'contact', 'Active WhatsApp line'),
    ('office_email', '"contact@sahadental.com"', 'contact', 'Official support email'),
    ('slot_duration_minutes', '30', 'booking', 'Standard slot duration in minutes'),
    ('advance_booking_days_limit', '30', 'booking', 'How far in advance clients can book appointments'),
    ('booking_reference_prefix', '"SDC"', 'booking', 'Reference code string prefix'),
    ('cancellation_cutoff_hours', '4', 'booking', 'Hours limit allowed before session start to cancel booking'),
    ('primary_accent_color', '"#8b5cf6"', 'appearance', 'Global theme primary accent color'),
    ('glassmorphism_opacity', '0.7', 'appearance', 'Global dashboard glass design transparency level')
ON CONFLICT (key) DO NOTHING;

-- Seed default notifications
INSERT INTO public.notification_templates (id, channel, language, event_trigger, template_body, placeholders, timing_offset_minutes)
VALUES
    ('booking_created_sms', 'sms', 'en', 'request_created', 'Dear {patient_name}, we have received your booking request for {date} ({session} session). Ref: {ref_code}. SDC Team.', ARRAY['patient_name', 'date', 'session', 'ref_code'], 0),
    ('booking_confirmed_wa', 'whatsapp', 'en', 'status_confirmed', 'Hello {patient_name}! Your appointment at {clinic_name} has been CONFIRMED for {date} ({session} session). Your serial number is #{serial_number}. We look forward to seeing you.', ARRAY['patient_name', 'clinic_name', 'date', 'session', 'serial_number'], 0),
    ('booking_reminder_email', 'email', 'en', 'reminder_24h', 'Dear {patient_name},\n\nThis is a friendly reminder that you have a dental appointment scheduled tomorrow at {clinic_name}.\n\nDate: {date}\nSession: {session} Session\n\nIf you need to reschedule or cancel, please contact us at least 4 hours in advance.\n\nBest regards,\nSaha Dental Team', ARRAY['patient_name', 'clinic_name', 'date', 'session'], 1440)
ON CONFLICT (id) DO NOTHING;
