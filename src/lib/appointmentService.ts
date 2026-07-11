import { supabase } from './supabase';

export interface BookingDetails {
  id: string;
  reference_code: string;
  patient_id: string;
  patient_name: string;
  patient_phone: string;
  service_name: string;
}

export class AppointmentService {
  /**
   * Helper to fetch booking details for logging/notifications.
   */
  private static async getBookingDetails(bookingId: string): Promise<BookingDetails | null> {
    const { data, error } = await supabase
      .from('booking_requests')
      .select(`
        id,
        reference_code,
        patient_id,
        chief_complaint,
        patient:patients(full_name, phone),
        service:services(name),
        service_name_fallback
      `)
      .eq('id', bookingId)
      .single();

    if (error || !data) return null;

    const raw = data as any;
    return {
      id: raw.id,
      reference_code: raw.reference_code,
      patient_id: raw.patient_id,
      patient_name: raw.patient?.full_name || 'Anonymous',
      patient_phone: raw.patient?.phone || '',
      service_name: raw.service?.name || raw.service_name_fallback || 'Dental Visit',
    };
  }

  /**
   * Fetches all serial numbers and patient names already confirmed for a specific date
   * to assist the coordinator in assigning the next serial number.
   */
  static async getConfirmedSerialsForDate(dateStr: string): Promise<Array<{ serial: number; patientName: string }>> {
    try {
      const { data, error } = await supabase
        .from('booking_requests')
        .select(`
          appointment_serial,
          patient:patients(full_name)
        `)
        .eq('preferred_date', dateStr)
        .eq('status', 'confirmed')
        .eq('is_deleted', false)
        .not('appointment_serial', 'is', null);

      if (error || !data) return [];
      
      return data.map((d: any) => ({
        serial: d.appointment_serial,
        patientName: d.patient?.full_name || 'Patient',
      })).sort((a, b) => a.serial - b.serial);
    } catch (err) {
      console.error('Error fetching confirmed serials:', err);
      return [];
    }
  }

  /**
   * Confirms a booking request and schedules the slot/serial.
   */
  static async confirmAppointment(
    bookingId: string,
    confirmedDate: string,
    slot: string,
    time: string,
    serialNumber: number,
    notes: string,
    coordinatorId?: string
  ) {
    const details = await this.getBookingDetails(bookingId);
    if (!details) throw new Error('Booking request not found.');

    // 1. Update booking request record
    const { error: updateError } = await supabase
      .from('booking_requests')
      .update({
        status: 'confirmed',
        preferred_date: confirmedDate,
        appointment_slot: slot,
        appointment_time: time || null,
        appointment_serial: serialNumber,
        assistant_notes: notes || null,
      })
      .eq('id', bookingId);

    if (updateError) throw updateError;

    // 2. Insert audit trail history entry
    const { error: historyError } = await supabase
      .from('appointment_status_history')
      .insert({
        booking_id: bookingId,
        old_status: null, // Fetching old status is bypassed for simplicity, database permits null
        new_status: 'confirmed',
        changed_by: coordinatorId || null,
        notes: `Appointment confirmed for ${confirmedDate} in ${slot} session. Serial #${serialNumber}. Notes: ${notes}`,
      });

    if (historyError) console.error('Status history logging failed:', historyError);

    // 3. Insert notification entry
    const { error: notifError } = await supabase
      .from('notifications')
      .insert({
        title: 'Appointment Scheduled',
        message: `Appointment request ${details.reference_code} for ${details.patient_name} has been confirmed for ${confirmedDate} at Serial #${serialNumber}.`,
        type: 'appointment_confirmed',
        target_role: 'patient',
        target_user_id: details.patient_id,
      });

    if (notifError) console.error('Notification creation failed:', notifError);

    return { success: true, details };
  }

  /**
   * Reschedules an existing appointment to a new date/slot.
   */
  static async rescheduleAppointment(
    bookingId: string,
    newDate: string,
    newSlot: string,
    notes: string,
    coordinatorId?: string
  ) {
    const details = await this.getBookingDetails(bookingId);
    if (!details) throw new Error('Booking request not found.');

    const { error: updateError } = await supabase
      .from('booking_requests')
      .update({
        status: 'rescheduled',
        preferred_date: newDate,
        appointment_slot: newSlot,
        appointment_serial: null, // Reset serial, needs re-confirmation of serial
        assistant_notes: notes || null,
      })
      .eq('id', bookingId);

    if (updateError) throw updateError;

    const { error: historyError } = await supabase
      .from('appointment_status_history')
      .insert({
        booking_id: bookingId,
        new_status: 'rescheduled',
        changed_by: coordinatorId || null,
        notes: `Rescheduled to ${newDate} (${newSlot}). Notes: ${notes}`,
      });

    if (historyError) console.error('Status history logging failed:', historyError);

    const { error: notifError } = await supabase
      .from('notifications')
      .insert({
        title: 'Appointment Rescheduled',
        message: `Appointment ${details.reference_code} for ${details.patient_name} has been rescheduled to ${newDate} (${newSlot}).`,
        type: 'appointment_rescheduled',
        target_role: 'patient',
        target_user_id: details.patient_id,
      });

    if (notifError) console.error('Notification creation failed:', notifError);

    return { success: true, details };
  }

  /**
   * Cancels a booking request.
   */
  static async cancelAppointment(
    bookingId: string,
    reason: string,
    notes: string,
    coordinatorId?: string
  ) {
    const details = await this.getBookingDetails(bookingId);
    if (!details) throw new Error('Booking request not found.');

    const { error: updateError } = await supabase
      .from('booking_requests')
      .update({
        status: 'cancelled',
        internal_status_reason: reason || null,
        assistant_notes: notes || null,
      })
      .eq('id', bookingId);

    if (updateError) throw updateError;

    const { error: historyError } = await supabase
      .from('appointment_status_history')
      .insert({
        booking_id: bookingId,
        new_status: 'cancelled',
        changed_by: coordinatorId || null,
        reason: reason,
        notes: notes || `Cancelled. Reason: ${reason}`,
      });

    if (historyError) console.error('Status history logging failed:', historyError);

    const { error: notifError } = await supabase
      .from('notifications')
      .insert({
        title: 'Appointment Cancelled',
        message: `Appointment ${details.reference_code} for ${details.patient_name} has been cancelled. Reason: ${reason}`,
        type: 'appointment_cancelled',
        target_role: 'patient',
        target_user_id: details.patient_id,
      });

    if (notifError) console.error('Notification creation failed:', notifError);

    return { success: true, details };
  }

  /**
   * Transitions a booking request status.
   */
  static async transitionStatus(
    bookingId: string,
    newStatus: 'checked_in' | 'in_treatment' | 'completed',
    notes: string,
    coordinatorId?: string
  ) {
    const details = await this.getBookingDetails(bookingId);
    if (!details) throw new Error('Booking request not found.');

    const { error: updateError } = await supabase
      .from('booking_requests')
      .update({
        status: newStatus,
        assistant_notes: notes || null,
      })
      .eq('id', bookingId);

    if (updateError) throw updateError;

    const { error: historyError } = await supabase
      .from('appointment_status_history')
      .insert({
        booking_id: bookingId,
        new_status: newStatus,
        changed_by: coordinatorId || null,
        notes: notes || `Status changed to ${newStatus}.`,
      });

    if (historyError) console.error('Status history logging failed:', historyError);

    const { error: notifError } = await supabase
      .from('notifications')
      .insert({
        title: `Appointment ${newStatus.replace('_', ' ')}`,
        message: `Appointment ${details.reference_code} status updated to ${newStatus.replace('_', ' ')}.`,
        type: `appointment_${newStatus}`,
        target_role: 'patient',
        target_user_id: details.patient_id,
      });

    if (notifError) console.error('Notification creation failed:', notifError);

    return { success: true, details };
  }
}
