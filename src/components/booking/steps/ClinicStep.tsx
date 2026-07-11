import React from 'react';
import { motion } from 'motion/react';
import { MapPin, Clock, CheckCircle2, Sparkles } from 'lucide-react';
import { ClinicId } from '../types';
import BookingStepLayout from '../BookingStepLayout';

interface ClinicStepProps {
  selectedClinicId: ClinicId | '';
  onSelectClinic: (clinicId: ClinicId) => void;
  onContinue: () => void;
}

const CLINICS: Array<{
  id: ClinicId;
  name: string;
  shortAddress: string;
  currentSession: string;
  badge?: string;
}> = [
  {
    id: 'belerhat',
    name: 'Saha Dental Clinic — Belerhat',
    shortAddress: 'Belerhat Station Road, Purbasthali, Purba Bardhaman',
    currentSession: 'Mon–Sun: 10:00 AM – 2:00 PM & 5:00 PM – 8:00 PM',
    badge: 'Primary Center',
  },
  {
    id: 'parulia',
    name: 'Saha Dental Clinic — Parulia',
    shortAddress: 'Parulia Main Road, Purba Bardhaman',
    currentSession: 'Upcoming Schedule • By Appointment',
  },
  {
    id: 'nabadwip',
    name: 'Saha Dental Clinic — Nabadwip',
    shortAddress: 'Near Nabadwip Station, Nadia',
    currentSession: 'Upcoming Schedule • By Appointment',
  },
];

export default function ClinicStep({
  selectedClinicId,
  onSelectClinic,
  onContinue,
}: ClinicStepProps) {
  return (
    <BookingStepLayout
      title="Select Clinic Location"
      subtitle="Choose the healthcare center most convenient for your visit."
      badge="Step 1 • Location"
      showBack={false}
      onContinue={onContinue}
      isContinueDisabled={!selectedClinicId}
    >
      <div className="grid grid-cols-1 gap-4">
        {CLINICS.map((clinic, idx) => {
          const isSelected = selectedClinicId === clinic.id;

          return (
            <motion.div
              key={clinic.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08, duration: 0.35 }}
              onClick={() => onSelectClinic(clinic.id)}
              onDoubleClick={() => {
                onSelectClinic(clinic.id);
                onContinue();
              }}
              role="radio"
              aria-checked={isSelected}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectClinic(clinic.id);
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
                      {clinic.badge && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide bg-violet-500/20 text-violet-300 border border-violet-500/30">
                          <Sparkles className="w-3 h-3" />
                          {clinic.badge}
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-gray-300 mt-1">
                      {clinic.shortAddress}
                    </p>

                    <div className="flex items-center gap-2 mt-3 text-xs text-gray-400">
                      <Clock className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                      <span>{clinic.currentSession}</span>
                    </div>
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
          );
        })}
      </div>
    </BookingStepLayout>
  );
}
