-- Migration: 001_create_patients.sql
-- Description: Create patients table for storing normalized patient identity records.

CREATE TABLE IF NOT EXISTS public.patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(128) NOT NULL,
    phone VARCHAR(32) UNIQUE NOT NULL,
    email VARCHAR(128),
    date_of_birth DATE,
    gender VARCHAR(32),
    address TEXT,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

COMMENT ON TABLE public.patients IS 'Stores normalized patient records. Phone number is unique for repeat patient matching.';
