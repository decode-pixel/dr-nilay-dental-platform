-- Migration: 012_create_booking_request_tx.sql
-- Description: Create a secure transaction function for client booking requests.

CREATE OR REPLACE FUNCTION public.create_booking_request_tx(
    p_clinic_slug VARCHAR,
    p_service_slug VARCHAR,
    p_preferred_date DATE,
    p_preferred_session VARCHAR,
    p_patient_name VARCHAR,
    p_patient_phone VARCHAR,
    p_chief_complaint TEXT,
    p_patient_age INTEGER DEFAULT NULL,
    p_patient_gender VARCHAR DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER -- Runs with Postgres privileges to bypass RLS for patient matching/creation
AS $$
DECLARE
    v_clinic_id UUID;
    v_service_id UUID;
    v_patient_id UUID;
    v_booking_id UUID;
    v_reference_code VARCHAR;
    v_service_name VARCHAR;
BEGIN
    -- 1. Find clinic_id by slug
    SELECT id INTO v_clinic_id FROM public.clinics WHERE slug = p_clinic_slug LIMIT 1;
    IF v_clinic_id IS NULL THEN
        RAISE EXCEPTION 'Clinic location with slug % not found', p_clinic_slug;
    END IF;

    -- 2. Find service_id and name by slug
    SELECT id, name INTO v_service_id, v_service_name FROM public.services WHERE slug = p_service_slug LIMIT 1;
    IF v_service_id IS NULL THEN
        RAISE EXCEPTION 'Service/Treatment with slug % not found', p_service_slug;
    END IF;

    -- 3. Find or create patient by phone number
    SELECT id INTO v_patient_id FROM public.patients WHERE phone = p_patient_phone LIMIT 1;
    IF v_patient_id IS NULL THEN
        -- Insert new patient record
        INSERT INTO public.patients (full_name, phone, gender, is_active)
        VALUES (p_patient_name, p_patient_phone, p_patient_gender, true)
        RETURNING id INTO v_patient_id;
    ELSE
        -- Update existing patient fields if they are empty
        UPDATE public.patients
        SET full_name = COALESCE(full_name, p_patient_name),
            gender = COALESCE(gender, p_patient_gender)
        WHERE id = v_patient_id;
    END IF;

    -- 4. Create the booking request
    INSERT INTO public.booking_requests (
        patient_id,
        clinic_id,
        service_id,
        chief_complaint,
        preferred_date,
        appointment_slot,
        status
    )
    VALUES (
        v_patient_id,
        v_clinic_id,
        v_service_id,
        p_chief_complaint,
        p_preferred_date,
        p_preferred_session,
        'new_request'
    )
    RETURNING id, reference_code INTO v_booking_id, v_reference_code;

    -- 5. Create status history entry (audit trail)
    INSERT INTO public.appointment_status_history (
        booking_id,
        old_status,
        new_status,
        notes
    )
    VALUES (
        v_booking_id,
        NULL,
        'new_request',
        'Booking request created via web portal.'
    );

    -- 6. Create assistant notification
    INSERT INTO public.notifications (
        title,
        message,
        type,
        target_role
    )
    VALUES (
        'New Appointment Request',
        'New booking request (' || v_reference_code || ') from ' || p_patient_name || ' for ' || v_service_name || '.',
        'booking_request',
        'assistant'
    );

    -- 7. Return success details
    RETURN json_build_object(
        'success', true,
        'booking_id', v_booking_id,
        'reference_code', v_reference_code,
        'patient_id', v_patient_id,
        'patient_name', p_patient_name,
        'clinic_name', (SELECT name FROM public.clinics WHERE id = v_clinic_id),
        'treatment_name', v_service_name
    );
EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object(
            'success', false,
            'error', SQLERRM
        );
END;
$$;
