-- Migration: 004_create_services.sql
-- Description: Create services table for dental treatments with slugs, icons, duration, and CMS attributes.

CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(64) UNIQUE NOT NULL,
    name VARCHAR(128) NOT NULL,
    description TEXT,
    icon VARCHAR(64),
    featured BOOLEAN DEFAULT false NOT NULL,
    category VARCHAR(64) DEFAULT 'General' NOT NULL,
    estimated_duration INTEGER DEFAULT 30 NOT NULL,
    display_order INTEGER DEFAULT 1 NOT NULL,
    learn_more_slug VARCHAR(64),
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

COMMENT ON TABLE public.services IS 'Stores dental services/treatments with full CMS support.';
