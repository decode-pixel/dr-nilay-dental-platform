-- Migration: 013_add_dashboard_rls_policies.sql
-- Description: Add RLS policies for authenticated users to view bookings, patients, history and notifications.

-- 1. booking_requests RLS Select policy
DROP POLICY IF EXISTS "Authenticated select bookings" ON public.booking_requests;
CREATE POLICY "Authenticated select bookings" ON public.booking_requests
    FOR SELECT TO authenticated USING (true);

-- 2. patients RLS Select policy
DROP POLICY IF EXISTS "Authenticated select patients" ON public.patients;
CREATE POLICY "Authenticated select patients" ON public.patients
    FOR SELECT TO authenticated USING (true);

-- 3. appointment_status_history RLS Select policy
DROP POLICY IF EXISTS "Authenticated select status history" ON public.appointment_status_history;
CREATE POLICY "Authenticated select status history" ON public.appointment_status_history
    FOR SELECT TO authenticated USING (true);

-- 4. notifications RLS Select & Update policies
DROP POLICY IF EXISTS "Authenticated select notifications" ON public.notifications;
CREATE POLICY "Authenticated select notifications" ON public.notifications
    FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Authenticated update notifications" ON public.notifications;
CREATE POLICY "Authenticated update notifications" ON public.notifications
    FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
