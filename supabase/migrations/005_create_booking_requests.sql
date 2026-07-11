-- Migration: 005_create_booking_requests.sql
-- Description: Create booking_lifecycle_status enum, sequential reference generator, and booking_requests table.

DO $$ BEGIN
    CREATE TYPE public.booking_lifecycle_status AS ENUM (
        'new_request',
        'pending_review',
        'confirmed',
        'checked_in',
        'in_treatment',
        'completed',
        'cancelled',
        'rescheduled',
        'no_show'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE SEQUENCE IF NOT EXISTS public.booking_ref_seq START WITH 1 INCREMENT BY 1;

CREATE TABLE IF NOT EXISTS public.booking_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reference_code VARCHAR(32) UNIQUE NOT NULL DEFAULT ('DNS-' || to_char(now(), 'YYYY') || '-' || lpad(nextval('public.booking_ref_seq')::text, 6, '0')),
    patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE RESTRICT,
    clinic_id UUID NOT NULL REFERENCES public.clinics(id) ON DELETE RESTRICT,
    service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
    service_name_fallback VARCHAR(128),
    chief_complaint TEXT,
    preferred_date DATE NOT NULL,
    appointment_slot VARCHAR(64) NOT NULL,
    appointment_time TIME,
    appointment_serial INTEGER,
    status public.booking_lifecycle_status NOT NULL DEFAULT 'new_request',
    assistant_notes TEXT,
    internal_status_reason TEXT,
    created_by UUID,
    updated_by UUID,
    is_deleted BOOLEAN DEFAULT false NOT NULL,
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

COMMENT ON TABLE public.booking_requests IS 'Stores normalized booking requests with sequential reference codes and clinical lifecycle status.';
