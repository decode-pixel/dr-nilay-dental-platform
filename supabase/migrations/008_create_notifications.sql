-- Migration: 008_create_notifications.sql
-- Description: Create notifications table supporting Assistant, Doctor, Patient, and Admin notifications.

CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(128) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(64) NOT NULL,
    target_role VARCHAR(32) NOT NULL,
    target_user_id UUID,
    is_read BOOLEAN DEFAULT false NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

COMMENT ON TABLE public.notifications IS 'Notifications table for Assistant, Doctor, Patient, and Admin roles.';
