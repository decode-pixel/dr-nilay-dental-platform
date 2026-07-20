import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { MapPin, Clock, CheckCircle2, Sparkles, AlertTriangle, UserCheck, ShieldAlert, Info } from 'lucide-react';
import { ClinicId } from '../types';
import BookingStepLayout from '../BookingStepLayout';
import { ClinicService } from '../../../lib/clinicService';
import { logger } from '../../../lib/logger';

interface ClinicStepProps extends React.Attributes {
  selectedClinicId: ClinicId | '';
  onSelectClinic: (clinicId: ClinicId) => void;
  onContinue: () => void;
}

const STATUS_STYLE_BADGES: Record<string, { text: string; bg: string; border: string }> = {
  'Open': { text: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20' },
  'Closed': { text: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
  'Holiday': { text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
  'Temporary Closure': { text: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20' },
  'Doctor Unavailable': { text: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
};

export default function ClinicStep({
  selectedClinicId,
  onSelectClinic,
  onContinue,
}: ClinicStepProps) {
  const [clinics, setClinics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const todayStr = `${year}-${month}-${day}`;

    ClinicService.getClinicsWithStatus(todayStr)
      .then((data) => {
        if (isMounted) {
          setClinics(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        logger.error('Failed to load active clinics in ClinicStep:', err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const anyClinicOpen = clinics.some((c) => c.statusInfo?.status === 'Open');
  const allClinicsClosed = clinics.length > 0 && !anyClinicOpen;

  // Suggest first open clinic's name
  const suggestedClinic = clinics.find((c) => c.statusInfo?.status === 'Open');

  if (loading) {
    return (
      <div className="py-12 flex flex-col items-center justify-center text-white">
        <Clock className="w-8 h-8 animate-spin text-violet-400 mb-3" />
        <span className="text-xs text-gray-500 font-medium uppercase">Loading clinic locations...</span>
      </div>
    );
  }

  return (
    <BookingStepLayout
      title="Select Clinic Location"
      subtitle="Choose the healthcare center most convenient for your visit."
      badge="Step 1 • Location"
      showBack={false}
      onContinue={onContinue}
      isContinueDisabled={!selectedClinicId}
    >
      <div className="space-y-4">
        {/* All Clinics Closed warning notice */}
        {allClinicsClosed && (
          <div className="p-4 rounded-2xl bg-amber-600/15 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-2.5 shadow-md">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-white">All Clinics Closed Today</p>
              <p className="mt-0.5 leading-relaxed">
                You can still submit your request. We will mark your booking as <strong>"Pending Manual Scheduling"</strong> and our coordinator will reach out to organize your session.
              </p>
            </div>
          </div>
        )}

        {clinics.map((clinic, idx) => {
          const isSelected = selectedClinicId === clinic.slug;
          const status = clinic.statusInfo?.status || 'Open';
          const isClosed = status !== 'Open';
          const badgeStyles = STATUS_STYLE_BADGES[status] || { text: 'text-gray-400', bg: 'bg-white/5', border: 'border-white/10' };

          return (
            <div key={clinic.id} className="space-y-2">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08, duration: 0.35 }}
                onClick={() => onSelectClinic(clinic.slug as ClinicId)}
                onDoubleClick={() => {
                  onSelectClinic(clinic.slug as ClinicId);
                  onContinue();
                }}
                role="radio"
                aria-checked={isSelected}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectClinic(clinic.slug as ClinicId);
                  }
                }}
                className={`group relative rounded-[1.75rem] p-5 sm:p-6 transition-all duration-300 cursor-pointer border overflow-hidden ${
                  isSelected
                    ? 'bg-gradient-to-br from-violet-500/15 via-white/10 to-blue-500/15 border-violet-400/60 shadow-[0_0_30px_rgba(139,92,246,0.25)]'
                    : 'bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/20 shadow-sm'
                }`}
              >
                {/* Subtle aura gradient */}
                <div
                  className={`absolute inset-0 bg-gradient-to-r from-violet-600/10 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${
                    isSelected ? 'opacity-100' : ''
                  }`}
                />

                <div className="relative z-10 flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border transition-all duration-300 ${
                        isSelected
                          ? 'bg-gradient-to-br from-violet-600 to-blue-600 text-white border-white/20 shadow-[0_0_15px_rgba(139,92,246,0.5)] scale-105'
                          : 'bg-white/5 text-gray-400 border-white/10 group-hover:text-white group-hover:bg-white/10'
                      }`}
                    >
                      <MapPin className="w-5 h-5" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h4 className="font-heading font-bold text-lg text-white group-hover:text-violet-200 transition-colors">
                          {clinic.name}
                        </h4>
                        
                        {/* Dynamic Status Badge */}
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${badgeStyles.text} ${badgeStyles.bg} ${badgeStyles.border}`}>
                          {status}
                        </span>

                        {clinic.is_featured && (
                          <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-violet-500/20 text-violet-300 border border-violet-500/30">
                            <Sparkles className="w-2.5 h-2.5" />
                            Primary
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-gray-300 mt-1.5">
                        {clinic.address.split(',').slice(0, 2).join(',')}
                      </p>

                      <div className="flex items-center gap-3 mt-3 flex-wrap text-xs text-gray-400">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                          <span>
                            {clinic.statusInfo?.session_times === 'Visiting schedule updating soon.' || clinic.visiting_note === 'Visiting schedule updating soon.'
                              ? 'Schedule: Visiting schedule updating soon.'
                              : status === 'Open'
                              ? `Today: ${clinic.statusInfo?.session_times}`
                              : `Closed: ${clinic.statusInfo?.reason_detail || clinic.statusInfo?.reason || 'Day Off'}`}
                          </span>
                        </div>
                        <span className="text-gray-600">•</span>
                        <span>Doctor: {clinic.statusInfo?.available_doctor || 'Dr. Nilay Saha'}</span>
                      </div>

                      {/* Dynamic Notice Banner per Clinic */}
                      {clinic.notice && (
                        <div className="mt-3.5 p-2.5 rounded-xl bg-violet-600/10 border border-violet-500/20 text-[11px] text-violet-300 flex items-start gap-1.5 max-w-md">
                          <ShieldAlert className="w-3.5 h-3.5 text-violet-400 shrink-0 mt-0.5" />
                          <span>
                            <strong>Notice:</strong> {clinic.notice.title} — {clinic.notice.description}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border transition-all duration-300 ${
                      isSelected
                        ? 'bg-violet-500 border-violet-400 text-white scale-110 shadow-[0_0_12px_rgba(139,92,246,0.8)]'
                        : 'border-white/20 text-transparent group-hover:border-white/40'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>

              {/* Redirection / Suggestion notice if this clinic is closed but another is open */}
              {isClosed && isSelected && anyClinicOpen && suggestedClinic && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-white/5 border border-white/10 rounded-2xl p-3 text-xs text-gray-300 flex items-start gap-2"
                >
                  <Info className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
                  <div>
                    <span>
                      {clinic.name.split('—')[1] || clinic.name} is currently closed due to{' '}
                      <strong>{clinic.statusInfo?.reason_detail || clinic.statusInfo?.reason}</strong>.
                      We suggest scheduling your appointment at{' '}
                      <button
                        type="button"
                        onClick={() => onSelectClinic(suggestedClinic.slug)}
                        className="text-violet-400 hover:underline font-bold"
                      >
                        {suggestedClinic.name}
                      </button>{' '}
                      instead.
                    </span>
                  </div>
                </motion.div>
              )}
            </div>
          );
        })}
      </div>
    </BookingStepLayout>
  );
}
