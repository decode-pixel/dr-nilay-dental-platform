-- Migration: 003_create_clinic_schedule.sql
-- Description: Create clinic_schedule table for managing sessions (Morning/Afternoon/Evening) and exact timings.

CREATE TABLE IF NOT EXISTS public.clinic_schedule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES public.clinics(id) ON DELETE RESTRICT,
    day_of_week VARCHAR(16) NOT NULL,
    session VARCHAR(32) NOT NULL,
    start_time TIME,
    end_time TIME,
    doctor_available BOOLEAN DEFAULT true NOT NULL,
    effective_from DATE,
    effective_to DATE,
    display_order INTEGER DEFAULT 1 NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

COMMENT ON TABLE public.clinic_schedule IS 'Stores clinic schedule sessions and exact timings per day of week.';
