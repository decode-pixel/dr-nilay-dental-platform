-- Migration: 006_create_status_history.sql
-- Description: Create appointment_status_history table to track immutable lifecycle status changes.

CREATE TABLE IF NOT EXISTS public.appointment_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES public.booking_requests(id) ON DELETE CASCADE,
    old_status public.booking_lifecycle_status,
    new_status public.booking_lifecycle_status NOT NULL,
    changed_by UUID,
    changed_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    reason TEXT,
    notes TEXT
);

COMMENT ON TABLE public.appointment_status_history IS 'Immutable audit log of all booking lifecycle status transitions.';
