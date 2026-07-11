-- Migration: 002_create_clinics.sql
-- Description: Create clinics table for clinic locations and future CMS features.

CREATE TABLE IF NOT EXISTS public.clinics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(64) UNIQUE NOT NULL,
    name VARCHAR(128) NOT NULL,
    address TEXT NOT NULL,
    landmark VARCHAR(128),
    phone VARCHAR(32) NOT NULL,
    whatsapp_phone VARCHAR(32) NOT NULL,
    emergency_phone VARCHAR(32),
    google_map_link TEXT,
    cover_image TEXT,
    visiting_note TEXT,
    display_order INTEGER DEFAULT 1 NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

COMMENT ON TABLE public.clinics IS 'Stores clinic locations with Google Maps, cover image, and visiting notes for CMS support.';
