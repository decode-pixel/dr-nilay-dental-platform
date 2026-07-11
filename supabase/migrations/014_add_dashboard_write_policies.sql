-- Migration: 014_add_dashboard_write_policies.sql
-- Description: Add RLS policies for authenticated users (coordinators) to update bookings, insert status history, and notifications.

-- 1. booking_requests RLS Update policy
DROP POLICY IF EXISTS "Authenticated update bookings" ON public.booking_requests;
CREATE POLICY "Authenticated update bookings" ON public.booking_requests
    FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- 2. appointment_status_history RLS Insert policy
DROP POLICY IF EXISTS "Authenticated insert status history" ON public.appointment_status_history;
CREATE POLICY "Authenticated insert status history" ON public.appointment_status_history
    FOR INSERT TO authenticated WITH CHECK (true);

-- 3. notifications RLS Insert policy
DROP POLICY IF EXISTS "Authenticated insert notifications" ON public.notifications;
CREATE POLICY "Authenticated insert notifications" ON public.notifications
    FOR INSERT TO authenticated WITH CHECK (true);
