-- Migration: 007_create_settings.sql
-- Description: Create global settings table for storing clinic configuration and brand identity.

CREATE TABLE IF NOT EXISTS public.settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_name VARCHAR(128) NOT NULL,
    primary_phone VARCHAR(32) NOT NULL,
    whatsapp_number VARCHAR(32) NOT NULL,
    emergency_number VARCHAR(32) NOT NULL,
    email VARCHAR(128) NOT NULL,
    google_review_link TEXT,
    logo_url TEXT,
    business_hours JSONB DEFAULT '{}'::jsonb NOT NULL,
    brand_colors JSONB DEFAULT '{"primary": "#8B5CF6", "accent": "#3B82F6"}'::jsonb NOT NULL,
    default_appointment_duration_minutes INTEGER DEFAULT 30 NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

COMMENT ON TABLE public.settings IS 'Global clinic configuration, contact numbers, and branding constants.';
