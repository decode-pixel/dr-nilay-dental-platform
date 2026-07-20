import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { RotateCcw, Sparkles, Check, AlertTriangle, RefreshCw } from 'lucide-react';
import {
  BookingState,
  BookingErrors,
  BookingStepIndex,
  ClinicId,
  SessionType,
} from './types';
import BookingProgress from './BookingProgress';
import ClinicStep from './steps/ClinicStep';
import TreatmentStep from './steps/TreatmentStep';
import ScheduleStep from './steps/ScheduleStep';
import PatientStep from './steps/PatientStep';
import ReviewStep from './steps/ReviewStep';
import SuccessStep from './steps/SuccessStep';
import {
  getClinicSettings,
  submitBookingRequest,
  ClinicSettings,
  BookingPayload,
} from '../../lib/supabase';
import { logger } from '../../lib/logger';
import { useToast } from '../ToastNotification';
import { ClinicService } from '../../lib/clinicService';
import { DoctorService, DoctorAssignmentResolver } from '../../lib/doctorService';
import { TreatmentService } from '../../lib/treatmentService';
import { supabase } from '../../lib/supabase';

const DRAFT_KEY = 'booking_wizard_draft';
const OFFLINE_KEY = 'booking_offline_payload';

interface BookingWizardProps {
  initialTreatmentId?: string;
  onClose?: () => void;
}

const DEFAULT_STATE: BookingState = {
  clinicId: '',
  treatmentId: 'root-canal',
  preferredDate: '',
  preferredSession: '',
  patientName: '',
  patientPhone: '',
  chiefComplaint: '',
  patientAge: '',
  patientGender: '',
  doctorId: '',
};

export default function BookingWizard({
  initialTreatmentId,
  onClose,
}: BookingWizardProps) {
  const { showToast } = useToast();
  const [step, setStep] = useState<BookingStepIndex>(1);
  const [state, setState] = useState<BookingState>(() => {
    return {
      ...DEFAULT_STATE,
      treatmentId: initialTreatmentId || DEFAULT_STATE.treatmentId,
    };
  });
  const [errors, setErrors] = useState<BookingErrors>({});
  
  // Settings & Submission states
  const [settings, setSettings] = useState<ClinicSettings | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submissionResult, setSubmissionResult] = useState<{
    referenceCode: string;
    clinicName?: string;
    treatmentName?: string;
    isOffline: boolean;
  } | null>(null);

  // Restore states
  const [showRestoreBanner, setShowRestoreBanner] = useState(false);
  const [savedDraft, setSavedDraft] = useState<{
    step: BookingStepIndex;
    state: BookingState;
  } | null>(null);

  // Offline Sync states
  const [offlinePayload, setOfflinePayload] = useState<BookingPayload | null>(null);
  const [showOfflineBanner, setShowOfflineBanner] = useState(false);
  const [clinics, setClinics] = useState<any[]>([]);
  const [dbTreatments, setDbTreatments] = useState<any[]>([]);
  const [clinicTreatments, setClinicTreatments] = useState<any[]>([]);

  // Load clinic settings & check offline cache on mount
  useEffect(() => {
    let isMounted = true;

    getClinicSettings().then((data) => {
      if (isMounted && data) {
        setSettings(data);
      }
    });

    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const todayStr = `${year}-${month}-${day}`;

    ClinicService.getClinicsWithStatus(todayStr).then((data) => {
      if (isMounted) {
        setClinics(data);
      }
    });

    Promise.all([
      TreatmentService.getTreatments(),
      supabase.from('clinic_treatments').select('*')
    ]).then(([treatList, mappingsRes]) => {
      if (isMounted) {
        setDbTreatments(treatList.filter((t) => t.is_active));
        setClinicTreatments(mappingsRes.data || []);
      }
    });

    try {
      const offlineData = localStorage.getItem(OFFLINE_KEY);
      if (offlineData) {
        const parsed = JSON.parse(offlineData);
        if (parsed && parsed.patientName) {
          setOfflinePayload(parsed);
          setShowOfflineBanner(true);
        }
      }
    } catch (err) {
      logger.error('Failed to parse offline payload cache:', err);
    }

    return () => {
      isMounted = false;
    };
  }, []);

  // Check for saved progress in sessionStorage on mount
  useEffect(() => {
    try {
      const draftJson = sessionStorage.getItem(DRAFT_KEY);
      if (draftJson) {
        const parsed = JSON.parse(draftJson);
        if (parsed && parsed.step && parsed.step < 6 && parsed.state) {
          setSavedDraft(parsed);
          setShowRestoreBanner(true);
        }
      }
    } catch (err) {
      logger.error('Failed to parse draft state:', err);
    }
  }, []);

  // Live validation logic
  const validateFields = useCallback((currentState: BookingState) => {
    const newErrors: BookingErrors = {};

    if (currentState.patientName.trim().length > 0) {
      if (currentState.patientName.trim().length < 2) {
        newErrors.patientName = 'Please enter at least 2 characters';
      }
    }

    if (currentState.patientPhone.trim().length > 0) {
      const cleanPhone = currentState.patientPhone.replace(/[\s-]/g, '');
      if (!/^\+?[0-9]{10,14}$/.test(cleanPhone)) {
        newErrors.patientPhone = 'Please enter a valid 10-14 digit phone number';
      }
    }

    if (currentState.chiefComplaint.trim().length > 300) {
      newErrors.chiefComplaint = 'Chief complaint must be under 300 characters';
    }

    setErrors(newErrors);
  }, []);

  // Save draft to sessionStorage whenever step or state changes
  useEffect(() => {
    if (step < 6) {
      try {
        sessionStorage.setItem(
          DRAFT_KEY,
          JSON.stringify({
            step,
            state,
          })
        );
      } catch (err) {
        logger.error('Failed to save draft state:', err);
      }
    }
  }, [step, state]);

  // Handle restoring a saved draft
  const handleRestoreDraft = () => {
    if (savedDraft) {
      setState(savedDraft.state);
      setStep(savedDraft.step);
      setShowRestoreBanner(false);
      showToast('Booking progress restored successfully!', 'success');
      logger.info('Restored booking draft from sessionStorage.');
    }
  };

  // Discard saved draft
  const handleDiscardDraft = () => {
    sessionStorage.removeItem(DRAFT_KEY);
    setShowRestoreBanner(false);
    showToast('Saved draft discarded.', 'info');
    logger.info('Discarded draft from sessionStorage.');
  };

  // Clear offline cache
  const handleDiscardOffline = () => {
    localStorage.removeItem(OFFLINE_KEY);
    setShowOfflineBanner(false);
    setOfflinePayload(null);
    showToast('Offline cache cleared.', 'info');
  };

  // Field change handler
  const handleFieldChange = (field: keyof BookingState, value: string) => {
    setState((prev) => {
      const next = { ...prev, [field]: value };
      validateFields(next);
      return next;
    });
  };

  const isPatientStepValid =
    state.patientName.trim().length >= 2 &&
    /^\+?[0-9]{10,14}$/.test(state.patientPhone.replace(/[\s-]/g, '')) &&
    state.chiefComplaint.trim().length > 0 &&
    state.chiefComplaint.trim().length <= 300 &&
    !errors.patientName &&
    !errors.patientPhone &&
    !errors.chiefComplaint;

  // Filter treatments offered at selected clinic
  const getFilteredTreatments = () => {
    if (!state.clinicId) return dbTreatments;
    const selectedClinic = clinics.find((c) => c.slug === state.clinicId);
    if (!selectedClinic) return dbTreatments;
    const allowedIds = clinicTreatments
      .filter((ct) => ct.clinic_id === selectedClinic.id)
      .map((ct) => ct.service_id);
    return dbTreatments.filter((t) => allowedIds.includes(t.id));
  };

  // Resolve and assign available doctor based on selections
  const resolveAndAssignDoctor = async (clinicSlug: string, date: string, session: string) => {
    if (!clinicSlug || !date || !session) return;
    const selectedClinic = clinics.find((c) => c.slug === clinicSlug);
    if (!selectedClinic) return;
    try {
      const assignedDoc = await DoctorAssignmentResolver.resolveAssignedDoctor(
        selectedClinic.id,
        date,
        session,
        state.treatmentId
      );
      if (assignedDoc) {
        setState((p) => ({ ...p, doctorId: assignedDoc.id }));
      } else {
        setState((p) => ({ ...p, doctorId: '' }));
      }
    } catch (err) {
      logger.error('Failed to resolve doctor during booking step:', err);
    }
  };

  // Real-time backend submission handler
  const handleSubmitBooking = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    const selectedClinic = clinics.find((c) => c.slug === state.clinicId);
    const isClosed = selectedClinic?.statusInfo?.status !== 'Open';
    const bookingStatus = isClosed ? 'pending_manual_scheduling' : 'new_request';

    const payload: BookingPayload = {
      clinicSlug: state.clinicId,
      serviceSlug: state.treatmentId,
      preferredDate: state.preferredDate,
      preferredSession: state.preferredSession,
      patientName: state.patientName,
      patientPhone: state.patientPhone.replace(/[\s-]/g, ''),
      chiefComplaint: state.chiefComplaint,
      patientAge: state.patientAge ? parseInt(state.patientAge, 10) : null,
      patientGender: state.patientGender || null,
      status: bookingStatus,
      doctorId: state.doctorId || null,
    };

    const res = await submitBookingRequest(payload);

    if (res.success && res.reference_code) {
      setSubmissionResult({
        referenceCode: res.reference_code,
        clinicName: res.clinic_name,
        treatmentName: res.treatment_name,
        isOffline: false,
      });
      localStorage.removeItem(OFFLINE_KEY);
      setOfflinePayload(null);
      showToast('Booking submitted successfully!', 'success');
      setStep(6);
    } else {
      // Check if it is a network error or connection interruption
      const isNetworkInterrupted =
        !navigator.onLine ||
        res.error?.toLowerCase().includes('network') ||
        res.error?.toLowerCase().includes('fetch') ||
        res.error?.toLowerCase().includes('failed to fetch');

      if (isNetworkInterrupted) {
        // Save failed submission locally for future reconnect/retry
        try {
          localStorage.setItem(OFFLINE_KEY, JSON.stringify(payload));
          setOfflinePayload(payload);
        } catch (e) {
          logger.error('Failed to write offline cache:', e);
        }

        setSubmissionResult({
          referenceCode: 'PENDING_OFFLINE',
          clinicName: undefined,
          treatmentName: undefined,
          isOffline: true,
        });
        showToast('Offline mode active. Booking saved locally to sync later.', 'warning');
        setStep(6);
      } else {
        setSubmitError(res.error || 'Server error occurred. Please try again.');
        showToast('Booking submission failed.', 'error');
      }
    }
    setIsSubmitting(false);
  };

  // Retry submission from the success screen in offline mode
  const handleOfflineRetry = async () => {
    const stored = localStorage.getItem(OFFLINE_KEY);
    if (!stored) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const payload = JSON.parse(stored) as BookingPayload;
      const res = await submitBookingRequest(payload);

      if (res.success && res.reference_code) {
        setSubmissionResult({
          referenceCode: res.reference_code,
          clinicName: res.clinic_name,
          treatmentName: res.treatment_name,
          isOffline: false,
        });
        localStorage.removeItem(OFFLINE_KEY);
        setOfflinePayload(null);
        showToast('Booking synced successfully!', 'success');
      } else {
        setSubmitError(res.error || 'Sync retry failed. Connection still offline.');
        showToast('Sync failed. Please check internet connection.', 'error');
      }
    } catch (err) {
      logger.error('Sync parsing error:', err);
      setSubmitError('Invalid offline data. Discarding.');
      localStorage.removeItem(OFFLINE_KEY);
      setOfflinePayload(null);
      showToast('Offline cache discarded due to invalid data.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartNew = () => {
    sessionStorage.removeItem(DRAFT_KEY);
    setState(DEFAULT_STATE);
    setStep(1);
    setSubmissionResult(null);
    setSubmitError(null);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden font-sans">
      {/* Restore Progress Banner */}
      <AnimatePresence>
        {showRestoreBanner && savedDraft && !showOfflineBanner && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-violet-600/20 border-b border-violet-500/30 px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs"
          >
            <div className="flex items-center gap-2 text-violet-200">
              <Sparkles className="w-4 h-4 text-violet-400 shrink-0" />
              <span>We saved your booking progress. Continue where you left off?</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleRestoreDraft}
                className="px-3.5 py-1.5 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-semibold transition-colors flex items-center gap-1"
              >
                <Check className="w-3.5 h-3.5" />
                Yes, Continue
              </button>
              <button
                type="button"
                onClick={handleDiscardDraft}
                className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              >
                Discard
              </button>
            </div>
          </motion.div>
        )}

        {/* Offline Queue Sync Banner */}
        {showOfflineBanner && offlinePayload && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-amber-600/20 border-b border-amber-500/30 px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs"
          >
            <div className="flex items-center gap-2 text-amber-200">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>You have a pending booking saved offline. Try to sync it now?</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleOfflineRetry}
                disabled={isSubmitting}
                className="px-3.5 py-1.5 rounded-full bg-amber-600 hover:bg-amber-500 text-white font-semibold transition-colors flex items-center gap-1"
              >
                {isSubmitting ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Check className="w-3.5 h-3.5" />
                )}
                Sync Now
              </button>
              <button
                type="button"
                onClick={handleDiscardOffline}
                className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              >
                Clear Cache
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress Stepper Section */}
      <div className="shrink-0 p-6 border-b border-white/10 bg-white/[0.01]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-heading font-extrabold text-lg text-white tracking-wide">
              Book Appointment
            </h3>
            <p className="text-[11px] text-gray-400 mt-0.5">
              Secure orthodontic scheduling dashboard
            </p>
          </div>
          {step < 6 && (
            <button
              onClick={handleStartNew}
              className="p-2 rounded-xl border border-white/5 bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
              title="Reset Wizard Form"
              aria-label="Reset booking form"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>

        <BookingProgress currentStep={step} />
      </div>

      {/* Step Container */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <ClinicStep
              key="step-1"
              selectedClinicId={state.clinicId}
              onSelectClinic={(id: ClinicId) => setState((p) => ({ ...p, clinicId: id }))}
              onContinue={() => setStep(2)}
            />
          )}

          {step === 2 && (
            <TreatmentStep
              key="step-2"
              selectedTreatmentId={state.treatmentId}
              onSelectTreatment={(id) => setState((p) => ({ ...p, treatmentId: id }))}
              onBack={() => setStep(1)}
              onContinue={() => setStep(3)}
              availableTreatments={getFilteredTreatments()}
            />
          )}

          {step === 3 && (
            <ScheduleStep
              key="step-3"
              selectedDate={state.preferredDate}
              selectedSession={state.preferredSession}
              clinicId={state.clinicId}
              onSelectDate={(date) => setState((p) => ({ ...p, preferredDate: date }))}
              onSelectSession={(session: SessionType) =>
                setState((p) => ({ ...p, preferredSession: session }))
              }
              onBack={() => setStep(2)}
              onContinue={() => {
                resolveAndAssignDoctor(state.clinicId, state.preferredDate, state.preferredSession);
                setStep(4);
              }}
            />
          )}

          {step === 4 && (
            <PatientStep
              key="step-4"
              state={state}
              errors={errors}
              onChange={handleFieldChange}
              onBack={() => setStep(3)}
              onContinue={() => setStep(5)}
              isValid={isPatientStepValid}
            />
          )}

          {step === 5 && (
            <ReviewStep
              key="step-5"
              state={state}
              onEditStep={(targetStep) => setStep(targetStep)}
              onBack={() => setStep(4)}
              onSubmit={handleSubmitBooking}
            />
          )}

          {step === 6 && submissionResult && (
            <SuccessStep
              key="step-6"
              state={state}
              referenceCode={submissionResult.referenceCode}
              isOffline={submissionResult.isOffline}
              submitError={submitError}
              isRetrying={isSubmitting}
              onRetry={handleOfflineRetry}
              onClose={onClose}
              onStartNew={handleStartNew}
              whatsappNumber={settings?.whatsapp_number}
              primaryPhone={settings?.primary_phone}
              clinicName={submissionResult.clinicName || settings?.clinic_name}
            />
          )}
        </AnimatePresence>

        {/* Global Submit Error Message for Step 5 */}
        {step === 5 && submitError && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-start gap-2.5"
          >
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Submission Failed</p>
              <p className="mt-0.5">{submitError}</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
