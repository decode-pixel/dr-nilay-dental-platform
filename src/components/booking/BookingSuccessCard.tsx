import React, { useState } from 'react';
import { PRIMARY_PHONE_DISPLAY } from '../../lib/constants';
import {
  CheckCircle2,
  Phone,
  Copy,
  Check,
  Download,
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  Printer,
  X,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';
import { BookingState } from './types';
import { treatmentsData } from '../../data/treatments';
import { WhatsAppIcon } from '../Icons';
import { motion, AnimatePresence } from 'motion/react';

interface BookingSuccessCardProps {
  state: BookingState;
  referenceCode?: string;
  isOffline?: boolean;
  submitError?: string | null;
  isRetrying?: boolean;
  onRetry?: () => void;
  onCloseWizard?: () => void;
  whatsappNumber?: string;
  primaryPhone?: string;
  clinicNameOverride?: string;
}

export default function BookingSuccessCard({
  state,
  referenceCode = 'DNS-2026-PREVIEW',
  isOffline = false,
  submitError = null,
  isRetrying = false,
  onRetry,
  onCloseWizard,
  whatsappNumber = PRIMARY_PHONE_DISPLAY,
  primaryPhone = PRIMARY_PHONE_DISPLAY,
  clinicNameOverride,
}: BookingSuccessCardProps) {
  const [copied, setCopied] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);

  const clinicNames: Record<string, string> = {
    belerhat: 'Saha Dental Clinic — Belerhat',
    parulia: 'Saha Dental Clinic — Parulia',
    nabadwip: 'Saha Dental Clinic — Nabadwip',
  };

  const resolvedClinicName =
    clinicNameOverride || clinicNames[state.clinicId] || 'Dr. Nilay Saha Dental Clinic';
  const treatmentObj = treatmentsData.find((t) => t.id === state.treatmentId);
  const treatmentName = treatmentObj?.name || state.treatmentId;

  const formattedDate = state.preferredDate
    ? new Date(state.preferredDate).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Pending Confirmation';

  const summaryText = `APPOINTMENT REQUEST SUMMARY
Reference: ${referenceCode}
Clinic: ${resolvedClinicName}
Treatment: ${treatmentName}
Preferred Date: ${formattedDate}
Preferred Session: ${state.preferredSession}
Patient Name: ${state.patientName}
Patient Phone: ${state.patientPhone}
Symptoms: ${state.chiefComplaint}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenWhatsApp = () => {
    const text = encodeURIComponent(
      `Hello Dr. Nilay Saha Dental Clinic, I have requested an appointment [${referenceCode}] for ${treatmentName} at ${resolvedClinicName} on ${formattedDate} (${state.preferredSession}). Patient Name: ${state.patientName}, Phone: ${state.patientPhone}. Symptoms: ${state.chiefComplaint}`
    );
    
    // Clean raw number for wa.me link
    const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${cleanNumber}?text=${text}`, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Offline Alert Box */}
      {isOffline && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-start gap-3 text-xs text-amber-200"
        >
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold text-amber-300">Offline Mode Active</p>
            <p>
              Your appointment request was saved locally because the server was unreachable.
              We will submit it to our database once connection is restored.
            </p>
            {submitError && <p className="text-red-300 mt-1 font-mono">Error: {submitError}</p>}
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                disabled={isRetrying}
                className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/35 border border-amber-400/40 text-amber-200 font-semibold transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRetrying ? 'animate-spin' : ''}`} />
                {isRetrying ? 'Retrying...' : 'Retry Submission'}
              </button>
            )}
          </div>
        </motion.div>
      )}

      {/* Premium Appointment Card */}
      <div className={`bg-gradient-to-br from-[#0a0a1a]/90 via-[#0e0e24]/90 to-[#0a0a1a]/90 border rounded-3xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(139,92,246,0.25)] relative overflow-hidden ${
        isOffline ? 'border-amber-500/30' : 'border-violet-500/30'
      }`}>
        {/* Glow corner aura */}
        <div className="absolute top-[-20%] right-[-10%] w-60 h-60 bg-violet-600/20 rounded-full blur-[80px] pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <span className="text-xs font-semibold text-violet-400 uppercase tracking-widest">
              Reference Code
            </span>
            <div className="flex items-center gap-3 mt-1">
              <h3 className="text-2xl sm:text-3xl font-heading font-extrabold text-white tracking-wide">
                {referenceCode}
              </h3>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                isOffline 
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                  : 'bg-green-500/20 text-green-300 border-green-500/30'
              }`}>
                {isOffline ? 'Pending Sync' : 'Registered'}
              </span>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs text-gray-400">
              {isOffline ? 'Offline Draft' : 'Real-time Verified'}
            </span>
            <p className="text-xs font-medium text-violet-300 mt-0.5">
              {isOffline ? 'Saved in local cache' : 'Database commit confirmed'}
            </p>
          </div>
        </div>

        {/* Appointment Grid Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-6 border-b border-white/10">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-violet-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-xs text-gray-400 block">Clinic Location</span>
              <p className="font-semibold text-white mt-0.5">{resolvedClinicName}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-xs text-gray-400 block">Treatment</span>
              <p className="font-semibold text-white mt-0.5">{treatmentName}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-violet-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-xs text-gray-400 block">Preferred Date</span>
              <p className="font-semibold text-white mt-0.5">{formattedDate}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-xs text-gray-400 block">Preferred Session</span>
              <p className="font-semibold text-white mt-0.5">
                {state.preferredSession} Session
              </p>
            </div>
          </div>
        </div>

        <div className="pt-5 text-xs text-gray-300 flex items-center justify-between">
          <span>
            Patient: <strong className="text-white">{state.patientName}</strong> ({state.patientPhone})
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          type="button"
          onClick={handleOpenWhatsApp}
          className="btn-sweep flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-green-600 hover:bg-green-500 text-white font-semibold text-sm shadow-[0_0_20px_rgba(34,197,94,0.4)] transition-all duration-200"
        >
          <WhatsAppIcon className="w-5 h-5" />
          Open WhatsApp
        </button>

        <a
          href={`tel:${primaryPhone.replace(/[^0-9+]/g, '')}`}
          className="flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl border border-white/20 bg-white/5 hover:bg-white/10 text-white font-semibold text-sm transition-all duration-200"
        >
          <Phone className="w-4 h-4 text-violet-400" />
          Call Clinic
        </a>

        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center justify-center gap-2.5 px-6 py-3 rounded-2xl border border-white/15 bg-white/5 hover:bg-white/10 text-gray-200 text-sm font-medium transition-all duration-200"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-green-400" />
              Copied Summary!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-gray-400" />
              Copy Summary
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() => setShowPrintModal(true)}
          className="flex items-center justify-center gap-2.5 px-6 py-3 rounded-2xl border border-white/15 bg-white/5 hover:bg-white/10 text-gray-200 text-sm font-medium transition-all duration-200"
        >
          <Download className="w-4 h-4 text-violet-400" />
          Download Appointment Card
        </button>
      </div>

      {/* PDF-ready Printable Summary Modal */}
      <AnimatePresence>
        {showPrintModal && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPrintModal(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative z-10 w-full max-w-xl bg-white text-black rounded-3xl p-8 shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <div className="flex items-center justify-between border-b pb-4 mb-6">
                <div>
                  <h3 className="font-heading font-extrabold text-2xl text-violet-900">
                    {resolvedClinicName}
                  </h3>
                  <p className="text-xs text-gray-500">
                    Official Appointment Request Card
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPrintModal(false)}
                  className="p-2 text-gray-500 hover:text-black"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-sm border border-gray-200 rounded-2xl p-6 bg-gray-50">
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="font-semibold text-gray-600">Reference Number:</span>
                  <span className="font-mono font-bold text-lg text-violet-700">
                    {referenceCode}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="font-semibold text-gray-600">Clinic Center:</span>
                  <span>{resolvedClinicName}</span>
                </div>

                <div className="flex justify-between">
                  <span className="font-semibold text-gray-600">Treatment:</span>
                  <span>{treatmentName}</span>
                </div>

                <div className="flex justify-between">
                  <span className="font-semibold text-gray-600">Preferred Date:</span>
                  <span>{formattedDate}</span>
                </div>

                <div className="flex justify-between">
                  <span className="font-semibold text-gray-600">Session Window:</span>
                  <span>{state.preferredSession} Session</span>
                </div>

                <div className="flex justify-between">
                  <span className="font-semibold text-gray-600">Patient Name:</span>
                  <span>{state.patientName}</span>
                </div>

                <div className="flex justify-between">
                  <span className="font-semibold text-gray-600">Phone Contact:</span>
                  <span>{state.patientPhone}</span>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowPrintModal(false)}
                  className="px-5 py-2.5 rounded-full border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-100"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-6 py-2.5 rounded-full bg-violet-600 text-white text-sm font-medium hover:bg-violet-700 flex items-center gap-2 shadow-lg"
                >
                  <Printer className="w-4 h-4" />
                  Print / Save PDF
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
