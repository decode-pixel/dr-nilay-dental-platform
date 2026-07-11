import React, { useState, useEffect } from 'react';
import { supabase, getDashboardBookings, getBookingStatusHistory, getPatientBookingHistory, getUnreadNotificationsCount } from '../../lib/supabase';
import { AppointmentService } from '../../lib/appointmentService';
import { logger } from '../../lib/logger';
import { APPOINTMENT_STATUS, STATUS_LABELS } from '../../lib/constants';
import { useToast } from '../../components/ToastNotification';
import SkeletonLoader, { SkeletonBase } from '../../components/SkeletonLoader';
import EmptyState from '../../components/EmptyState';
import {
  LogOut,
  Calendar,
  Clock,
  User,
  Phone,
  Search,
  Filter,
  X,
  Sparkles,
  MapPin,
  FileText,
  History,
  Activity,
  Bell,
  RefreshCw,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  Stethoscope,
  CheckCircle,
  XCircle,
  CalendarDays,
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  Send,
  Copy,
  Check,
  Users,
} from 'lucide-react';
import { WhatsAppIcon } from '../../components/Icons';
import { motion, AnimatePresence } from 'motion/react';
import DashboardPatients from './DashboardPatients';
import DashboardClinics from './DashboardClinics';

interface DashboardHomeProps {
  onSignOut: () => void;
}

const STATUS_STYLES: Record<
  string,
  { label: string; bg: string; text: string; border: string; glow: string }
> = {
  [APPOINTMENT_STATUS.NEW_REQUEST]: {
    label: 'New Request',
    bg: 'bg-amber-500/10',
    text: 'text-amber-300',
    border: 'border-amber-500/20',
    glow: 'shadow-[0_0_12px_rgba(245,158,11,0.2)]',
  },
  [APPOINTMENT_STATUS.PENDING_REVIEW]: {
    label: 'Pending Review',
    bg: 'bg-yellow-500/10',
    text: 'text-yellow-300',
    border: 'border-yellow-500/20',
    glow: 'shadow-[0_0_12px_rgba(234,179,8,0.2)]',
  },
  [APPOINTMENT_STATUS.CONFIRMED]: {
    label: 'Confirmed',
    bg: 'bg-blue-500/10',
    text: 'text-blue-300',
    border: 'border-blue-500/20',
    glow: 'shadow-[0_0_12px_rgba(59,130,246,0.2)]',
  },
  [APPOINTMENT_STATUS.CHECKED_IN]: {
    label: 'Checked In',
    bg: 'bg-indigo-500/10',
    text: 'text-indigo-300',
    border: 'border-indigo-500/20',
    glow: 'shadow-[0_0_12px_rgba(99,102,241,0.2)]',
  },
  [APPOINTMENT_STATUS.IN_TREATMENT]: {
    label: 'In Treatment',
    bg: 'bg-purple-500/10',
    text: 'text-purple-300',
    border: 'border-purple-500/20',
    glow: 'shadow-[0_0_12px_rgba(168,85,247,0.2)]',
  },
  [APPOINTMENT_STATUS.COMPLETED]: {
    label: 'Completed',
    bg: 'bg-green-500/10',
    text: 'text-green-300',
    border: 'border-green-500/20',
    glow: 'shadow-[0_0_12px_rgba(34,197,94,0.2)]',
  },
  [APPOINTMENT_STATUS.CANCELLED]: {
    label: 'Cancelled',
    bg: 'bg-red-500/10',
    text: 'text-red-300',
    border: 'border-red-500/20',
    glow: 'shadow-[0_0_12px_rgba(239,68,68,0.2)]',
  },
  [APPOINTMENT_STATUS.RESCHEDULED]: {
    label: 'Rescheduled',
    bg: 'bg-cyan-500/10',
    text: 'text-cyan-300',
    border: 'border-cyan-500/20',
    glow: 'shadow-[0_0_12px_rgba(6,182,212,0.2)]',
  },
  [APPOINTMENT_STATUS.NO_SHOW]: {
    label: 'No Show',
    bg: 'bg-slate-500/10',
    text: 'text-slate-300',
    border: 'border-slate-500/20',
    glow: 'shadow-[0_0_12px_rgba(100,116,139,0.2)]',
  },
};

export default function DashboardHome({ onSignOut }: DashboardHomeProps) {
  const { showToast } = useToast();

  // Navigation tabs state
  const [activeTab, setActiveTab] = useState<'bookings' | 'patients' | 'clinics'>('bookings');
  const [navigatedPatientId, setNavigatedPatientId] = useState<string | null>(null);

  // Coordinator Identity
  const [userEmail, setUserEmail] = useState('coordinator@sahadental.com');
  const [userId, setUserId] = useState<string | undefined>(undefined);

  // Data loading states
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Notification states
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  // Search & Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [clinicFilter, setClinicFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Selected Booking Drawer state
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const [drawerHistory, setDrawerHistory] = useState<any[]>([]);
  const [drawerAuditLogs, setDrawerAuditLogs] = useState<any[]>([]);
  const [loadingDrawerData, setLoadingDrawerData] = useState(false);
  const [copied, setCopied] = useState(false);

  // Patient Visit Summary statistics
  const [patientStats, setPatientStats] = useState({
    total: 0,
    completed: 0,
    cancelled: 0,
  });

  // Action Panel states
  const [actionPanel, setActionPanel] = useState<'confirm' | 'reschedule' | 'cancel' | 'generic_notes' | null>(null);
  const [actionNotes, setActionNotes] = useState('');
  const [actionError, setActionError] = useState<string | null>(null);
  const [isActionSubmitting, setIsActionSubmitting] = useState(false);

  // Form states
  const [confirmForm, setConfirmForm] = useState({
    date: '',
    slot: '',
    time: '',
    serial: '',
  });
  const [rescheduleForm, setRescheduleForm] = useState({
    date: '',
    slot: '',
  });
  const [cancelForm, setCancelForm] = useState({
    reason: 'Patient requested cancellation',
  });
  const [genericTargetStatus, setGenericTargetStatus] = useState<'checked_in' | 'in_treatment' | 'completed' | null>(null);

  // Intelligent Serial Helper state
  const [confirmedSerials, setConfirmedSerials] = useState<Array<{ serial: number; patientName: string }>>([]);
  const [suggestedSerial, setSuggestedSerial] = useState<number | null>(null);

  // Load user session details on mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUserEmail(session.user.email || 'coordinator@sahadental.com');
        setUserId(session.user.id);
      }
    });
  }, []);

  // Load bookings and notifications count
  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const bookingsRes = await getDashboardBookings();
      if (bookingsRes.error) {
        setError(bookingsRes.error.message);
        showToast('Error fetching appointment records.', 'error');
      } else if (bookingsRes.data) {
        setBookings(bookingsRes.data);
      }

      const notifsCount = await getUnreadNotificationsCount();
      setUnreadNotifications(notifsCount);
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard data.');
      logger.error('Failed to load dashboard statistics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Fetch detail drawer data when an appointment is selected
  const handleSelectBooking = async (booking: any) => {
    setSelectedBooking(booking);
    setLoadingDrawerData(true);
    setDrawerHistory([]);
    setDrawerAuditLogs([]);
    setActionPanel(null);
    setActionNotes('');
    setActionError(null);

    // Default form states based on booking
    setConfirmForm({
      date: booking.preferred_date || '',
      slot: booking.appointment_slot || '',
      time: booking.appointment_time || '10:00:00',
      serial: booking.appointment_serial ? String(booking.appointment_serial) : '',
    });
    setRescheduleForm({
      date: booking.preferred_date || '',
      slot: booking.appointment_slot || '',
    });

    try {
      if (booking.patient_id) {
        const historyRes = await getPatientBookingHistory(booking.patient_id);
        if (historyRes.data) {
          setDrawerHistory(historyRes.data);
          
          // Calculate patient summary counts
          const total = historyRes.data.length;
          const completed = historyRes.data.filter((b) => b.status === APPOINTMENT_STATUS.COMPLETED).length;
          const cancelled = historyRes.data.filter((b) => b.status === APPOINTMENT_STATUS.CANCELLED).length;
          setPatientStats({ total, completed, cancelled });
        }
      }

      const auditRes = await getBookingStatusHistory(booking.id);
      if (auditRes.data) {
        setDrawerAuditLogs(auditRes.data);
      }

      // Fetch confirmed serials for preselected date
      if (booking.preferred_date) {
        fetchConfirmedSerials(booking.preferred_date);
      }
    } catch (err) {
      logger.error('Failed to load drawer audit logs/history:', err);
    } finally {
      setLoadingDrawerData(false);
    }
  };

  // Helper to refresh only the active drawer details
  const refreshDrawerData = async (bookingId: string) => {
    try {
      const { data, error: fetchErr } = await supabase
        .from('booking_requests')
        .select(`
          *,
          patient:patients(*),
          clinic:clinics(*),
          service:services(*)
        `)
        .eq('id', bookingId)
        .single();
      if (data && !fetchErr) {
        // Update selectedBooking reference and drawer info
        handleSelectBooking(data);
      }
    } catch (err) {
      logger.error('Error refreshing drawer details:', err);
    }
  };

  // Fetch confirmed serials and suggest the next available number
  const fetchConfirmedSerials = async (dateStr: string) => {
    const list = await AppointmentService.getConfirmedSerialsForDate(dateStr);
    setConfirmedSerials(list);

    // Suggest next integer serial number
    if (list.length === 0) {
      setSuggestedSerial(1);
    } else {
      const serials = list.map((item) => item.serial);
      const maxSerial = Math.max(...serials);
      setSuggestedSerial(maxSerial + 1);
    }
  };

  // 1. Confirm Submission
  const handleConfirmSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBooking) return;
    if (!confirmForm.date || !confirmForm.slot || !confirmForm.serial) {
      setActionError('Date, Session Slot, and Serial Number are required.');
      return;
    }

    setIsActionSubmitting(true);
    setActionError(null);

    try {
      await AppointmentService.confirmAppointment(
        selectedBooking.id,
        confirmForm.date,
        confirmForm.slot,
        confirmForm.time,
        parseInt(confirmForm.serial, 10),
        actionNotes,
        userId
      );

      showToast('Appointment successfully confirmed and scheduled!', 'success');
      setActionPanel(null);
      await loadDashboardData();
      await refreshDrawerData(selectedBooking.id);
    } catch (err: any) {
      setActionError(err.message || 'Confirmation failed.');
      showToast('Appointment confirmation failed.', 'error');
    } finally {
      setIsActionSubmitting(false);
    }
  };

  // 2. Reschedule Submission
  const handleRescheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBooking) return;
    if (!rescheduleForm.date || !rescheduleForm.slot) {
      setActionError('Date and Session Slot are required.');
      return;
    }

    setIsActionSubmitting(true);
    setActionError(null);

    try {
      await AppointmentService.rescheduleAppointment(
        selectedBooking.id,
        rescheduleForm.date,
        rescheduleForm.slot,
        actionNotes,
        userId
      );

      showToast('Appointment request rescheduled.', 'info');
      setActionPanel(null);
      await loadDashboardData();
      await refreshDrawerData(selectedBooking.id);
    } catch (err: any) {
      setActionError(err.message || 'Rescheduling failed.');
      showToast('Appointment rescheduling failed.', 'error');
    } finally {
      setIsActionSubmitting(false);
    }
  };

  // 3. Cancel Submission
  const handleCancelSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBooking) return;

    setIsActionSubmitting(true);
    setActionError(null);

    try {
      await AppointmentService.cancelAppointment(
        selectedBooking.id,
        cancelForm.reason,
        actionNotes,
        userId
      );

      showToast('Appointment cancelled successfully.', 'warning');
      setActionPanel(null);
      await loadDashboardData();
      await refreshDrawerData(selectedBooking.id);
    } catch (err: any) {
      setActionError(err.message || 'Cancellation failed.');
      showToast('Failed to cancel appointment.', 'error');
    } finally {
      setIsActionSubmitting(false);
    }
  };

  // 4. Generic Transition Submission (Checked-In, In-Treatment, Completed)
  const handleGenericTransitionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBooking || !genericTargetStatus) return;

    setIsActionSubmitting(true);
    setActionError(null);

    try {
      await AppointmentService.transitionStatus(
        selectedBooking.id,
        genericTargetStatus,
        actionNotes,
        userId
      );

      showToast(`Appointment status updated to ${STATUS_LABELS[genericTargetStatus]}`, 'success');
      setActionPanel(null);
      setGenericTargetStatus(null);
      await loadDashboardData();
      await refreshDrawerData(selectedBooking.id);
    } catch (err: any) {
      setActionError(err.message || 'Status transition failed.');
      showToast('Status change failed.', 'error');
    } finally {
      setIsActionSubmitting(false);
    }
  };

  // Copy Summary to clipboard
  const handleCopySummary = () => {
    if (!selectedBooking) return;
    const formattedDate = new Date(selectedBooking.preferred_date).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
    const summary = `APPOINTMENT SUMMARY
Reference: ${selectedBooking.reference_code}
Patient: ${selectedBooking.patient?.full_name} (${selectedBooking.patient?.phone})
Clinic: ${selectedBooking.clinic?.name}
Treatment: ${selectedBooking.service?.name || selectedBooking.service_name_fallback}
Date: ${formattedDate}
Session: ${selectedBooking.appointment_slot} Session
Serial Number: ${selectedBooking.appointment_serial ? '#' + selectedBooking.appointment_serial : 'Pending'}
Status: ${selectedBooking.status.replace('_', ' ').toUpperCase()}`;

    navigator.clipboard.writeText(summary);
    setCopied(true);
    showToast('Summary copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  // Manual WhatsApp update notification generation
  const handleWhatsAppStatusUpdate = () => {
    if (!selectedBooking) return;

    const patientName = selectedBooking.patient?.full_name || 'Patient';
    const refCode = selectedBooking.reference_code;
    const phone = selectedBooking.patient?.phone || '';
    const treatment = selectedBooking.service?.name || selectedBooking.service_name_fallback || 'Dental Treatment';
    const clinic = selectedBooking.clinic?.name || 'Dr. Nilay Saha Dental Clinic';
    const date = new Date(selectedBooking.preferred_date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
    const slot = selectedBooking.appointment_slot;
    const serial = selectedBooking.appointment_serial;
    const status = selectedBooking.status;

    let text = '';
    if (status === APPOINTMENT_STATUS.CONFIRMED) {
      text = `Hello ${patientName}, your appointment [${refCode}] for ${treatment} at ${clinic} is confirmed on ${date} (${slot} session). Your Serial Number is #${serial}. Please arrive 15 minutes before the session starts. - Dr. Nilay Saha Dental Clinic`;
    } else if (status === APPOINTMENT_STATUS.RESCHEDULED) {
      text = `Hello ${patientName}, your appointment [${refCode}] for ${treatment} has been rescheduled to ${date} (${slot} session). Please let us know if this works. - Dr. Nilay Saha Dental Clinic`;
    } else if (status === APPOINTMENT_STATUS.CANCELLED) {
      text = `Hello ${patientName}, your appointment [${refCode}] for ${treatment} has been cancelled. If you have questions, please contact us. - Dr. Nilay Saha Dental Clinic`;
    } else {
      text = `Hello ${patientName}, your appointment [${refCode}] status has been updated to ${status.replace('_', ' ')}. - Dr. Nilay Saha Dental Clinic`;
    }

    const cleanNumber = phone.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${cleanNumber}?text=${text}`, '_blank');
  };

  const handleSignOut = () => {
    onSignOut();
    showToast('Signed out successfully.', 'info');
  };

  // Compute stats
  const totalCount = bookings.length;
  const pendingCount = bookings.filter(
    (b) => b.status === APPOINTMENT_STATUS.NEW_REQUEST || b.status === APPOINTMENT_STATUS.PENDING_REVIEW
  ).length;
  const confirmedCount = bookings.filter((b) => b.status === APPOINTMENT_STATUS.CONFIRMED).length;
  const completedCount = bookings.filter((b) => b.status === APPOINTMENT_STATUS.COMPLETED).length;

  // Filtered and sorted bookings
  const processedBookings = React.useMemo(() => {
    return bookings
      .filter((booking) => {
        // Search filter
        const patientName = booking.patient?.full_name || '';
        const phone = booking.patient?.phone || '';
        const refCode = booking.reference_code || '';
        const complaint = booking.chief_complaint || '';
        const matchSearch =
          patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
          refCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
          complaint.toLowerCase().includes(searchQuery.toLowerCase());

        // Clinic filter
        const matchClinic =
          clinicFilter === 'All' || booking.clinic?.slug === clinicFilter;

        // Status filter
        const matchStatus =
          statusFilter === 'All' || booking.status === statusFilter;

        return matchSearch && matchClinic && matchStatus;
      })
      .sort((a, b) => {
        const dateA = new Date(a.preferred_date).getTime();
        const dateB = new Date(b.preferred_date).getTime();
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      });
  }, [bookings, searchQuery, clinicFilter, statusFilter, sortOrder]);

  return (
    <div className="min-h-screen bg-[#02020a] flex font-sans text-white relative overflow-hidden">
      {/* Dynamic Background Auras */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-violet-600/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />

      {/* 1. Sidebar Navigation (Desktop) */}
      <aside className="hidden md:flex flex-col w-64 bg-[#050614]/90 border-r border-white/10 p-6 relative z-10 shrink-0">
        <div className="flex items-center gap-3 mb-10 pb-4 border-b border-white/5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center border border-white/10 shadow-[0_0_12px_rgba(139,92,246,0.3)]">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-heading font-bold text-sm tracking-wide text-white uppercase">
              Saha Dental
            </h2>
            <span className="text-[10px] font-medium text-violet-400">
              Coordinator Panel
            </span>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          {/* Appointments Trigger Button */}
          <button
            type="button"
            onClick={() => setActiveTab('bookings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl border text-sm font-semibold transition-all duration-200 ${
              activeTab === 'bookings'
                ? 'bg-white/5 border-white/10 text-white shadow-sm'
                : 'border-transparent text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Calendar className="w-4 h-4 text-violet-400" />
            Appointments
          </button>

          {/* Patients List Trigger Button */}
          <button
            type="button"
            onClick={() => setActiveTab('patients')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl border text-sm font-semibold transition-all duration-200 ${
              activeTab === 'patients'
                ? 'bg-white/5 border-white/10 text-white shadow-sm'
                : 'border-transparent text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Users className="w-4 h-4 text-blue-400" />
            Patients list
          </button>

          {/* Clinics Management Button */}
          <button
            type="button"
            onClick={() => setActiveTab('clinics')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl border text-sm font-semibold transition-all duration-200 ${
              activeTab === 'clinics'
                ? 'bg-white/5 border-white/10 text-white shadow-sm'
                : 'border-transparent text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <MapPin className="w-4 h-4 text-emerald-400" />
            Clinic Centers
          </button>

          <div className="pt-4 px-4 text-xs text-gray-500 uppercase tracking-widest font-semibold">
            COMING SOON
          </div>
          <button disabled className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-gray-500 text-sm font-medium cursor-not-allowed opacity-50">
            <TrendingUp className="w-4 h-4" />
            Analytics
          </button>
        </nav>

        <div className="pt-6 border-t border-white/5 flex flex-col gap-2">
          <div className="px-4 text-[10px] text-gray-500 truncate" title={userEmail}>
            User: {userEmail.split('@')[0]}
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-400 hover:text-red-300 text-sm font-semibold transition-all duration-200"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* 2. Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative z-10">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-5 sm:px-8 border-b border-white/10 bg-[#050614]/40 backdrop-blur-md shrink-0">
          <div>
            <h1 className="font-heading font-bold text-xl sm:text-2xl text-white">
              {activeTab === 'bookings' ? 'Appointment Requests' : activeTab === 'patients' ? 'Patient Registry' : 'Clinic Centers'}
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Live coordinator dashboard • Saha Dental Clinic
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Refresh Indicator */}
            {activeTab === 'bookings' && (
              <button
                type="button"
                onClick={loadDashboardData}
                disabled={loading}
                className="p-2.5 rounded-xl border border-white/10 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                aria-label="Refresh Data"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            )}

            {/* Notification Badge */}
            <div className="relative">
              <div className="p-2.5 rounded-xl border border-white/10 bg-white/5 text-gray-300">
                <Bell className="w-4 h-4" />
              </div>
              {unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 border border-[#02020a] flex items-center justify-center text-[10px] font-bold text-white shadow-lg">
                  {unreadNotifications}
                </span>
              )}
            </div>

            {/* Mobile Sign Out Button */}
            <button
              type="button"
              onClick={handleSignOut}
              className="md:hidden p-2.5 rounded-xl border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-400 transition-colors"
              aria-label="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Tab view routing */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'patients' ? (
            <DashboardPatients
              selectedPatientId={navigatedPatientId}
              onClearNavigation={() => setNavigatedPatientId(null)}
            />
          ) : activeTab === 'clinics' ? (
            <DashboardClinics />
          ) : (
            <div className="p-6 sm:p-8 space-y-6">
              {/* Top Statistics Row */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Total Requests', val: totalCount, desc: 'Overall requests received' },
                  { label: 'Pending Review', val: pendingCount, desc: 'Awaiting scheduling' },
                  { label: 'Confirmed Today', val: confirmedCount, desc: 'Slots scheduled' },
                  { label: 'Completed Visits', val: completedCount, desc: 'Archived cases' },
                ].map((stat, idx) => (
                  <div
                    key={idx}
                    className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5 flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-xs text-gray-400 font-medium uppercase tracking-wider block">
                        {stat.label}
                      </span>
                      <span className="text-2xl sm:text-3xl font-heading font-extrabold text-white mt-1 block">
                        {stat.val}
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-500 mt-2">{stat.desc}</p>
                  </div>
                ))}
              </div>

              {/* Search, Sort and Filter Toolbar */}
              <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-5 flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {/* Search Bar */}
                  <div className="relative col-span-1 sm:col-span-2">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="text"
                      placeholder="Search by name, ref, phone, complaint..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 focus:border-violet-500/50 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Clinic Filter */}
                  <div>
                    <select
                      value={clinicFilter}
                      onChange={(e) => setClinicFilter(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 focus:border-violet-500/50 rounded-2xl text-sm text-white focus:outline-none appearance-none cursor-pointer"
                      style={{ colorScheme: 'dark' }}
                    >
                      <option value="All">All Locations</option>
                      <option value="belerhat">Belerhat Center</option>
                      <option value="parulia">Parulia Center</option>
                      <option value="nabadwip">Nabadwip Center</option>
                    </select>
                  </div>

                  {/* Status Filter */}
                  <div>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 focus:border-violet-500/50 rounded-2xl text-sm text-white focus:outline-none appearance-none cursor-pointer"
                      style={{ colorScheme: 'dark' }}
                    >
                      <option value="All">All Statuses</option>
                      {Object.entries(STATUS_STYLES).map(([key, item]) => (
                        <option key={key} value={key}>
                          {item.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Sort Order Action */}
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>
                    Showing <strong>{processedBookings.length}</strong> of <strong>{totalCount}</strong> requests
                  </span>
                  <button
                    type="button"
                    onClick={() => setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
                    className="hover:text-white flex items-center gap-1 font-semibold transition-colors"
                  >
                    Sort Date: {sortOrder === 'asc' ? 'Oldest First' : 'Newest First'}
                  </button>
                </div>
              </div>

              {/* Table / List View */}
              {error && (
                <div className="p-5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Error loading database records</p>
                    <p className="mt-1 font-mono text-xs">{error}</p>
                  </div>
                </div>
              )}

              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <SkeletonLoader key={i} variant="row" />
                  ))}
                </div>
              ) : processedBookings.length === 0 ? (
                <EmptyState
                  title="No appointment requests found"
                  description="Try modifying your search query or filter controls to find matching slots."
                  Icon={Calendar}
                  actionLabel="Reset Search Filters"
                  onAction={() => {
                    setSearchQuery('');
                    setClinicFilter('All');
                    setStatusFilter('All');
                  }}
                />
              ) : (
                <div className="space-y-3">
                  {processedBookings.map((booking) => {
                    const statusInfo = STATUS_STYLES[booking.status] || {
                      label: booking.status,
                      bg: 'bg-white/10',
                      text: 'text-white',
                      border: 'border-white/10',
                      glow: '',
                    };

                    return (
                      <motion.div
                        key={booking.id}
                        onClick={() => handleSelectBooking(booking)}
                        className="group relative rounded-2xl p-4 sm:p-5 bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-200"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-xl bg-violet-600/20 text-violet-400 border border-violet-500/20 flex items-center justify-center shrink-0">
                            <User className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2.5 flex-wrap">
                              <h4 className="font-heading font-bold text-base text-white">
                                {booking.patient?.full_name || 'Anonymous Patient'}
                              </h4>
                              <span className="text-xs text-gray-400 font-semibold tracking-wider font-mono">
                                {booking.reference_code}
                              </span>
                            </div>
                            <p className="text-xs text-gray-400 mt-1 flex items-center gap-2">
                              <span>{booking.patient?.phone}</span>
                              {booking.patient?.gender && (
                                <>
                                  <span className="text-gray-600">•</span>
                                  <span>{booking.patient.gender}</span>
                                </>
                              )}
                              {booking.patient?.age && (
                                <>
                                  <span className="text-gray-600">•</span>
                                  <span>{booking.patient.age} yrs</span>
                                </>
                              )}
                            </p>

                            <div className="flex items-center gap-3 mt-3 flex-wrap">
                              <span className="inline-flex items-center gap-1 text-[11px] text-gray-300">
                                <Stethoscope className="w-3.5 h-3.5 text-violet-400" />
                                {booking.service?.name || booking.service_name_fallback || 'Dental Visit'}
                              </span>
                              <span className="text-gray-600 text-[10px]">•</span>
                              <span className="inline-flex items-center gap-1 text-[11px] text-gray-300">
                                <MapPin className="w-3.5 h-3.5 text-blue-400" />
                                {booking.clinic?.name.split('—')[1] || booking.clinic?.name || 'Clinic'}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-start sm:items-end justify-between sm:flex-col gap-2.5">
                          <div className="flex items-center gap-2 text-xs text-right sm:text-right">
                            <div className="hidden sm:block">
                              <p className="font-bold text-white">
                                {new Date(booking.preferred_date).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                })}
                              </p>
                              <p className="text-[10px] text-gray-400 mt-0.5">
                                {booking.appointment_slot} Session
                                {booking.appointment_serial ? ` • Serial #${booking.appointment_serial}` : ''}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusInfo.bg} ${statusInfo.text} ${statusInfo.border} ${statusInfo.glow}`}
                            >
                              {statusInfo.label}
                            </span>
                            <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* 3. Detail Drawer Component (AnimatePresence) */}
      <AnimatePresence>
        {selectedBooking && (
          <>
            {/* Drawer Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedBooking(null)}
              className="fixed inset-0 z-40 bg-black/75 backdrop-blur-sm"
            />

            {/* Slide-out Drawer Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-xl bg-[#050614]/95 border-l border-white/10 shadow-2xl overflow-y-auto flex flex-col font-sans text-white"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/[0.01]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center border border-white/10 shadow-md">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-lg text-white">
                      Appointment Details
                    </h3>
                    <p className="text-xs font-mono text-violet-400">
                      {selectedBooking.reference_code}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedBooking(null)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                  aria-label="Close details drawer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 p-6 space-y-6">
                
                {/* 1. Visit Stats Summary */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white/5 border border-white/5 rounded-2xl p-3 text-center">
                    <span className="text-[10px] text-gray-500 uppercase font-semibold">Prior Bookings</span>
                    <p className="text-xl font-bold text-white mt-0.5">{patientStats.total}</p>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/10 rounded-2xl p-3 text-center">
                    <span className="text-[10px] text-green-500 uppercase font-semibold">Completed</span>
                    <p className="text-xl font-bold text-green-400 mt-0.5">{patientStats.completed}</p>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/10 rounded-2xl p-3 text-center">
                    <span className="text-[10px] text-red-500 uppercase font-semibold">Cancelled</span>
                    <p className="text-xl font-bold text-red-400 mt-0.5">{patientStats.cancelled}</p>
                  </div>
                </div>

                {/* 2. Main Booking Details Card */}
                <div className="bg-white/5 border border-white/10 rounded-3xl p-5 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <User className="w-5 h-5 text-violet-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] text-gray-500 uppercase font-semibold">
                          Patient Identity
                        </span>
                        <h4 className="font-bold text-white text-base mt-0.5">
                          {selectedBooking.patient?.full_name}
                        </h4>
                        
                        {/* Navigation link from booking drawer to patient profile */}
                        <button
                          type="button"
                          onClick={() => {
                            setNavigatedPatientId(selectedBooking.patient_id);
                            setActiveTab('patients');
                            setSelectedBooking(null); // Close drawer
                          }}
                          className="mt-1.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-violet-600/15 border border-violet-500/20 text-[10px] font-semibold text-violet-300 hover:text-white transition-colors"
                        >
                          <User className="w-3 h-3 text-violet-400" />
                          View Patient Profile →
                        </button>

                        <p className="text-xs text-gray-300 mt-2.5 flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 text-gray-400 inline" />
                          <span>{selectedBooking.patient?.phone}</span>
                        </p>
                      </div>
                    </div>

                    {/* Quick Call & Copy Links */}
                    <div className="flex items-center gap-2">
                      <a
                        href={`tel:${selectedBooking.patient?.phone}`}
                        className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                        title="Call Patient"
                      >
                        <Phone className="w-4 h-4 text-violet-400" />
                      </a>
                      <button
                        type="button"
                        onClick={handleCopySummary}
                        className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                        title="Copy Summary"
                      >
                        {copied ? (
                          <Check className="w-4 h-4 text-green-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="border-t border-white/5 pt-4 grid grid-cols-2 gap-4">
                    <div className="flex items-start gap-2.5">
                      <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] text-gray-500 uppercase font-semibold">
                          Clinic Center
                        </span>
                        <p className="text-xs text-white font-semibold mt-0.5">
                          {selectedBooking.clinic?.name}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <Sparkles className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] text-gray-500 uppercase font-semibold">
                          Procedure
                        </span>
                        <p className="text-xs text-white font-semibold mt-0.5">
                          {selectedBooking.service?.name || selectedBooking.service_name_fallback}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-white/5 pt-4 grid grid-cols-2 gap-4">
                    <div className="flex items-start gap-2.5">
                      <Calendar className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] text-gray-500 uppercase font-semibold">
                          Date
                        </span>
                        <p className="text-xs text-white font-semibold mt-0.5">
                          {new Date(selectedBooking.preferred_date).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <Clock className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] text-gray-500 uppercase font-semibold">
                          Session Slot
                        </span>
                        <p className="text-xs text-white font-semibold mt-0.5">
                          {selectedBooking.appointment_slot} Session
                          {selectedBooking.appointment_serial ? ` • Serial #${selectedBooking.appointment_serial}` : ''}
                        </p>
                      </div>
                    </div>
                  </div>

                  {selectedBooking.chief_complaint && (
                    <div className="border-t border-white/5 pt-4">
                      <span className="text-[10px] text-gray-500 uppercase font-semibold block mb-1">
                        Symptoms / Chief Complaint
                      </span>
                      <p className="text-xs text-gray-200 bg-black/40 rounded-xl p-3 border border-white/5 leading-relaxed">
                        {selectedBooking.chief_complaint}
                      </p>
                    </div>
                  )}

                  {selectedBooking.assistant_notes && (
                    <div className="border-t border-white/5 pt-4">
                      <span className="text-[10px] text-gray-500 uppercase font-semibold block mb-1">
                        Coordinator Notes
                      </span>
                      <p className="text-xs text-gray-200 bg-violet-600/5 rounded-xl p-3 border border-violet-500/15 leading-relaxed">
                        {selectedBooking.assistant_notes}
                      </p>
                    </div>
                  )}
                </div>

                {/* 3. Action Panel & Buttons */}
                <div className="bg-white/5 border border-white/10 rounded-3xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                      Appointment Actions
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-violet-500/20 text-violet-300 border border-violet-500/30 font-semibold">
                      Status: {selectedBooking.status}
                    </span>
                  </div>

                  {/* Operational Action Form Panels (Confirm, Reschedule, Cancel, Generic Transitions) */}
                  <AnimatePresence mode="wait">
                    {actionPanel && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-black/40 border border-white/10 rounded-2xl p-4 space-y-4 overflow-hidden"
                      >
                        {actionError && (
                          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <span>{actionError}</span>
                          </div>
                        )}

                        {/* CONFIRM APPOINTMENT FORM */}
                        {actionPanel === 'confirm' && (
                          <form onSubmit={handleConfirmSubmit} className="space-y-3">
                            <h5 className="text-sm font-semibold text-white flex items-center gap-1.5">
                              <CheckCircle className="w-4 h-4 text-green-400" />
                              Confirm Booking Schedule
                            </h5>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-[10px] text-gray-400 font-semibold mb-1">Date</label>
                                <input
                                  type="date"
                                  value={confirmForm.date}
                                  onChange={(e) => {
                                    setConfirmForm({ ...confirmForm, date: e.target.value });
                                    fetchConfirmedSerials(e.target.value);
                                  }}
                                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] text-gray-400 font-semibold mb-1">Slot</label>
                                <select
                                  value={confirmForm.slot}
                                  onChange={(e) => setConfirmForm({ ...confirmForm, slot: e.target.value })}
                                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none"
                                >
                                  <option value="Morning">Morning</option>
                                  <option value="Afternoon">Afternoon</option>
                                  <option value="Evening">Evening</option>
                                </select>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-[10px] text-gray-400 font-semibold mb-1">Time Slot</label>
                                <input
                                  type="time"
                                  value={confirmForm.time}
                                  onChange={(e) => setConfirmForm({ ...confirmForm, time: e.target.value })}
                                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] text-gray-400 font-semibold mb-1">Serial Number</label>
                                <input
                                  type="number"
                                  value={confirmForm.serial}
                                  onChange={(e) => setConfirmForm({ ...confirmForm, serial: e.target.value })}
                                  placeholder="e.g. 5"
                                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none"
                                />
                              </div>
                            </div>

                            {/* Intelligent Serial Helper Badge */}
                            {suggestedSerial !== null && (
                              <div className="bg-violet-600/10 border border-violet-500/20 rounded-xl p-2.5 text-[11px] text-violet-300">
                                <span className="font-semibold block mb-1">Intelligent Serial Helper</span>
                                {confirmedSerials.length > 0 ? (
                                  <p>
                                    Assigned on this date: {confirmedSerials.map((s) => `#${s.serial} (${s.patientName})`).join(', ')}.
                                  </p>
                                ) : (
                                  <p>No serials assigned on this date yet.</p>
                                )}
                                <button
                                  type="button"
                                  onClick={() => setConfirmForm({ ...confirmForm, serial: String(suggestedSerial) })}
                                  className="mt-1 text-white underline hover:text-violet-200 block text-left"
                                >
                                  Use Suggested Serial: <strong>#{suggestedSerial}</strong>
                                </button>
                              </div>
                            )}

                            <div>
                              <label className="block text-[10px] text-gray-400 font-semibold mb-1">Notes / Instructions</label>
                              <textarea
                                value={actionNotes}
                                onChange={(e) => setActionNotes(e.target.value)}
                                placeholder="Add instructions or coordinator notes..."
                                rows={2}
                                className="w-full bg-white/5 border border-white/10 rounded-xl p-2 text-xs focus:outline-none resize-none"
                              />
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                              <button
                                type="button"
                                onClick={() => setActionPanel(null)}
                                className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold"
                              >
                                Cancel
                              </button>
                              <button
                                type="submit"
                                disabled={isActionSubmitting}
                                className="px-4 py-2 rounded-xl bg-green-600 hover:bg-green-500 text-white text-xs font-semibold transition-colors"
                              >
                                {isActionSubmitting ? 'Confirming...' : 'Confirm Appointment'}
                              </button>
                            </div>
                          </form>
                        )}

                        {/* RESCHEDULE APPOINTMENT FORM */}
                        {actionPanel === 'reschedule' && (
                          <form onSubmit={handleRescheduleSubmit} className="space-y-3">
                            <h5 className="text-sm font-semibold text-white flex items-center gap-1.5">
                              <CalendarDays className="w-4 h-4 text-cyan-400" />
                              Reschedule Request
                            </h5>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-[10px] text-gray-400 font-semibold mb-1">New Date</label>
                                <input
                                  type="date"
                                  value={rescheduleForm.date}
                                  onChange={(e) => setRescheduleForm({ ...rescheduleForm, date: e.target.value })}
                                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] text-gray-400 font-semibold mb-1">New Slot</label>
                                <select
                                  value={rescheduleForm.slot}
                                  onChange={(e) => setRescheduleForm({ ...rescheduleForm, slot: e.target.value })}
                                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none"
                                >
                                  <option value="Morning">Morning</option>
                                  <option value="Afternoon">Afternoon</option>
                                  <option value="Evening">Evening</option>
                                </select>
                              </div>
                            </div>

                            <div>
                              <label className="block text-[10px] text-gray-400 font-semibold mb-1">Reschedule Notes / Reason</label>
                              <textarea
                                value={actionNotes}
                                onChange={(e) => setActionNotes(e.target.value)}
                                placeholder="State the reason or patient notes..."
                                rows={2}
                                className="w-full bg-white/5 border border-white/10 rounded-xl p-2 text-xs focus:outline-none resize-none"
                              />
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                              <button
                                type="button"
                                onClick={() => setActionPanel(null)}
                                className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold"
                              >
                                Cancel
                              </button>
                              <button
                                type="submit"
                                disabled={isActionSubmitting}
                                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold transition-colors"
                              >
                                {isActionSubmitting ? 'Rescheduling...' : 'Submit Reschedule'}
                              </button>
                            </div>
                          </form>
                        )}

                        {/* CANCEL APPOINTMENT FORM */}
                        {actionPanel === 'cancel' && (
                          <form onSubmit={handleCancelSubmit} className="space-y-3">
                            <h5 className="text-sm font-semibold text-white flex items-center gap-1.5">
                              <XCircle className="w-4 h-4 text-red-400" />
                              Cancel Appointment Request
                            </h5>
                            <div>
                              <label className="block text-[10px] text-gray-400 font-semibold mb-1">Cancellation Reason</label>
                              <select
                                value={cancelForm.reason}
                                onChange={(e) => setCancelForm({ ...cancelForm, reason: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none"
                              >
                                <option value="Patient requested cancellation">Patient requested cancellation</option>
                                <option value="No show - patient did not arrive">No show - patient did not arrive</option>
                                <option value="Clinic closed / reschedule unavailable">Clinic closed / reschedule unavailable</option>
                                <option value="Duplicate booking request">Duplicate booking request</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-[10px] text-gray-400 font-semibold mb-1">Cancel Notes</label>
                              <textarea
                                value={actionNotes}
                                onChange={(e) => setActionNotes(e.target.value)}
                                placeholder="Describe why this appointment is cancelled..."
                                rows={2}
                                className="w-full bg-white/5 border border-white/10 rounded-xl p-2 text-xs focus:outline-none resize-none"
                              />
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                              <button
                                type="button"
                                onClick={() => setActionPanel(null)}
                                className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold"
                              >
                                Back
                              </button>
                              <button
                                type="submit"
                                disabled={isActionSubmitting}
                                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold transition-colors"
                              >
                                {isActionSubmitting ? 'Cancelling...' : 'Cancel Appointment'}
                              </button>
                            </div>
                          </form>
                        )}

                        {/* GENERIC STATUS TRANSITIONS FORM (CHECKED-IN, IN-TREATMENT, COMPLETED) */}
                        {actionPanel === 'generic_notes' && genericTargetStatus && (
                          <form onSubmit={handleGenericTransitionSubmit} className="space-y-3">
                            <h5 className="text-sm font-semibold text-white flex items-center gap-1.5">
                              <UserCheck className="w-4 h-4 text-violet-400" />
                              Change Status to: {STATUS_STYLES[genericTargetStatus]?.label}
                            </h5>
                            <div>
                              <label className="block text-[10px] text-gray-400 font-semibold mb-1">Coordinator Notes</label>
                              <textarea
                                value={actionNotes}
                                onChange={(e) => setActionNotes(e.target.value)}
                                placeholder="Add audit notes or clinical observations..."
                                rows={2}
                                className="w-full bg-white/5 border border-white/10 rounded-xl p-2 text-xs focus:outline-none resize-none"
                              />
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setActionPanel(null);
                                  setGenericTargetStatus(null);
                                }}
                                className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold"
                              >
                                Back
                              </button>
                              <button
                                type="submit"
                                disabled={isActionSubmitting}
                                className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold transition-colors"
                              >
                                {isActionSubmitting ? 'Submitting...' : 'Commit Status'}
                              </button>
                            </div>
                          </form>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Primary Trigger Buttons Grid */}
                  {!actionPanel && (
                    <div className="flex flex-col gap-2">
                      <div className="grid grid-cols-2 gap-2">
                        {/* Confirm Appointment Trigger */}
                        {(selectedBooking.status === APPOINTMENT_STATUS.NEW_REQUEST ||
                          selectedBooking.status === APPOINTMENT_STATUS.PENDING_REVIEW ||
                          selectedBooking.status === APPOINTMENT_STATUS.RESCHEDULED) && (
                          <button
                            type="button"
                            onClick={() => setActionPanel('confirm')}
                            className="flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl bg-green-600/10 hover:bg-green-600/20 border border-green-500/30 text-green-400 font-bold text-xs transition-colors"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            Confirm Slot
                          </button>
                        )}

                        {/* Mark Checked-In Trigger */}
                        {selectedBooking.status === APPOINTMENT_STATUS.CONFIRMED && (
                          <button
                            type="button"
                            onClick={() => {
                              setGenericTargetStatus('checked_in');
                              setActionPanel('generic_notes');
                            }}
                            className="flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl bg-violet-600/15 hover:bg-violet-600/25 border border-violet-500/30 text-violet-300 font-bold text-xs transition-colors"
                          >
                            <UserCheck className="w-4 h-4" />
                            Mark Checked-In
                          </button>
                        )}

                        {/* Mark In Treatment Trigger */}
                        {selectedBooking.status === APPOINTMENT_STATUS.CHECKED_IN && (
                          <button
                            type="button"
                            onClick={() => {
                              setGenericTargetStatus('in_treatment');
                              setActionPanel('generic_notes');
                            }}
                            className="flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl bg-indigo-600/15 hover:bg-indigo-600/25 border border-indigo-500/30 text-indigo-300 font-bold text-xs transition-colors"
                          >
                            <Activity className="w-4 h-4" />
                            In Treatment
                          </button>
                        )}

                        {/* Mark Completed Trigger */}
                        {selectedBooking.status === APPOINTMENT_STATUS.IN_TREATMENT && (
                          <button
                            type="button"
                            onClick={() => {
                              setGenericTargetStatus('completed');
                              setActionPanel('generic_notes');
                            }}
                            className="flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl bg-green-600/15 hover:bg-green-600/25 border border-green-500/30 text-green-400 font-bold text-xs transition-colors"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Mark Completed
                          </button>
                        )}

                        {/* Reschedule Trigger */}
                        {selectedBooking.status !== APPOINTMENT_STATUS.COMPLETED &&
                          selectedBooking.status !== APPOINTMENT_STATUS.CANCELLED && (
                            <button
                              type="button"
                              onClick={() => setActionPanel('reschedule')}
                              className="flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl bg-cyan-600/10 hover:bg-cyan-600/20 border border-cyan-500/30 text-cyan-400 font-bold text-xs transition-colors"
                            >
                              <CalendarDays className="w-4 h-4" />
                              Reschedule
                            </button>
                          )}

                        {/* Cancel Appointment Trigger */}
                        {selectedBooking.status !== APPOINTMENT_STATUS.COMPLETED &&
                          selectedBooking.status !== APPOINTMENT_STATUS.CANCELLED && (
                            <button
                              type="button"
                              onClick={() => setActionPanel('cancel')}
                              className="flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-bold text-xs transition-colors"
                            >
                              <XCircle className="w-4 h-4" />
                              Cancel Visit
                            </button>
                          )}
                      </div>

                      {/* Manual WhatsApp update & call triggers */}
                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5">
                        <button
                          type="button"
                          onClick={handleWhatsAppStatusUpdate}
                          className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-green-600 hover:bg-green-500 text-white font-semibold text-xs transition-colors"
                        >
                          <WhatsAppIcon className="w-4 h-4" />
                          WhatsApp Update
                        </button>
                        <a
                          href={`tel:${selectedBooking.patient?.phone}`}
                          className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-semibold text-xs transition-colors"
                        >
                          <Phone className="w-4 h-4 text-violet-400" />
                          Call Patient
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                {/* 4. Visual Status Timeline (Audit trail logs) */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-bold text-white">
                    <History className="w-4 h-4 text-violet-400" />
                    <span>Status Timeline & Logs</span>
                  </div>

                  {loadingDrawerData ? (
                    <div className="flex items-center justify-center py-6 text-xs text-gray-500">
                      <RefreshCw className="w-4 h-4 animate-spin text-violet-400 mr-2" />
                      <span>Checking audit logs...</span>
                    </div>
                  ) : drawerAuditLogs.length === 0 ? (
                    <div className="text-xs text-gray-500 bg-white/[0.02] border border-white/5 rounded-2xl p-4 text-center">
                      No status transitions recorded yet.
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                      {drawerAuditLogs.map((log) => {
                        const statusObj = STATUS_STYLES[log.new_status] || {
                          label: log.new_status,
                          text: 'text-white',
                        };
                        return (
                          <div
                            key={log.id}
                            className="relative pl-5 border-l-2 border-white/10 text-xs space-y-1 py-0.5"
                          >
                            <span className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-violet-500 border border-[#02020a]" />
                            <div className="flex items-center justify-between text-[10px] text-gray-400">
                              <span>
                                {new Date(log.changed_at).toLocaleString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                              <span>System</span>
                            </div>
                            <p className="text-gray-300">
                              Status changed to{' '}
                              <strong className={`${statusObj.text}`}>{statusObj.label}</strong>
                            </p>
                            {log.notes && (
                              <p className="text-[10px] text-gray-400 italic">
                                Note: {log.notes}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* 5. Patient Booking History (Read-only) */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-bold text-white">
                    <History className="w-4 h-4 text-blue-400" />
                    <span>Prior Booking History</span>
                  </div>

                  {loadingDrawerData ? (
                    <div className="flex items-center justify-center py-6 text-xs text-gray-500">
                      <RefreshCw className="w-4 h-4 animate-spin text-blue-400 mr-2" />
                      <span>Checking prior bookings...</span>
                    </div>
                  ) : drawerHistory.length === 0 ? (
                    <div className="text-xs text-gray-500 bg-white/[0.02] border border-white/5 rounded-2xl p-4 text-center">
                      No previous bookings found for this patient.
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                      {drawerHistory.map((hist) => (
                        <div
                          key={hist.id}
                          className="bg-white/5 border border-white/5 rounded-xl p-3 flex items-center justify-between text-xs"
                        >
                          <div>
                            <p className="font-semibold text-white">
                              {hist.service?.name || hist.service_name_fallback || 'Dental Visit'}
                            </p>
                            <p className="text-[10px] text-gray-400 mt-0.5">
                              {new Date(hist.preferred_date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}{' '}
                              • {hist.appointment_slot}
                            </p>
                          </div>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-gray-300">
                            {hist.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
