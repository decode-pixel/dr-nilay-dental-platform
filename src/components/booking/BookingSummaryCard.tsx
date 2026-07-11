import React from 'react';
import { MapPin, Sparkles, Calendar, Clock, User, Phone, FileText, Edit3 } from 'lucide-react';
import { BookingState, BookingStepIndex } from './types';
import { treatmentsData } from '../../data/treatments';

interface BookingSummaryCardProps {
  state: BookingState;
  onEditStep?: (step: BookingStepIndex) => void;
}

const CLINIC_NAMES: Record<string, { name: string; address: string }> = {
  belerhat: {
    name: 'Saha Dental Clinic — Belerhat',
    address: 'Belerhat Station Road, Purbasthali, Purba Bardhaman',
  },
  parulia: {
    name: 'Saha Dental Clinic — Parulia',
    address: 'Parulia Main Road, Purba Bardhaman',
  },
  nabadwip: {
    name: 'Saha Dental Clinic — Nabadwip',
    address: 'Near Nabadwip Station, Nadia',
  },
};

export default function BookingSummaryCard({
  state,
  onEditStep,
}: BookingSummaryCardProps) {
  const clinicInfo =
    CLINIC_NAMES[state.clinicId] || {
      name: 'Selected Clinic',
      address: '',
    };

  const treatmentInfo =
    treatmentsData.find((t) => t.id === state.treatmentId) || {
      name: state.treatmentId || 'Selected Treatment',
      desc: '',
    };

  const formattedDate = state.preferredDate
    ? new Date(state.preferredDate).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Not Selected';

  return (
    <div className="bg-gradient-to-br from-white/10 via-white/5 to-white/10 border border-white/15 rounded-3xl p-5 sm:p-7 shadow-[0_15px_35px_rgba(0,0,0,0.4)] space-y-5">
      {/* Clinic Section */}
      <div className="flex items-start justify-between pb-4 border-b border-white/10">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-violet-500/20 text-violet-300 border border-violet-500/30 flex items-center justify-center shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Clinic Location
            </span>
            <h4 className="font-heading font-bold text-base sm:text-lg text-white mt-0.5">
              {clinicInfo.name}
            </h4>
            <p className="text-xs text-gray-300 mt-0.5">
              {clinicInfo.address}
            </p>
          </div>
        </div>
        {onEditStep && (
          <button
            type="button"
            onClick={() => onEditStep(1)}
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Edit Clinic"
          >
            <Edit3 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Treatment Section */}
      <div className="flex items-start justify-between pb-4 border-b border-white/10">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Selected Treatment
            </span>
            <h4 className="font-heading font-bold text-base sm:text-lg text-white mt-0.5">
              {treatmentInfo.name}
            </h4>
            <p className="text-xs text-gray-300 mt-0.5 line-clamp-1">
              {treatmentInfo.desc}
            </p>
          </div>
        </div>
        {onEditStep && (
          <button
            type="button"
            onClick={() => onEditStep(2)}
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Edit Treatment"
          >
            <Edit3 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Schedule Section */}
      <div className="flex items-start justify-between pb-4 border-b border-white/10">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-violet-500/20 text-violet-300 border border-violet-500/30 flex items-center justify-center shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Preferred Schedule
            </span>
            <h4 className="font-heading font-bold text-base sm:text-lg text-white mt-0.5">
              {formattedDate}
            </h4>
            <div className="flex items-center gap-2 mt-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-violet-500/20 text-violet-300 border border-violet-500/30">
                <Clock className="w-3.5 h-3.5" />
                {state.preferredSession} Session
              </span>
            </div>
          </div>
        </div>
        {onEditStep && (
          <button
            type="button"
            onClick={() => onEditStep(3)}
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Edit Schedule"
          >
            <Edit3 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Patient Details Section */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3.5 w-full">
          <div className="w-10 h-10 rounded-2xl bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center justify-center shrink-0">
            <User className="w-5 h-5" />
          </div>
          <div className="w-full">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Patient Information
            </span>
            <div className="flex items-center justify-between mt-0.5">
              <h4 className="font-heading font-bold text-base sm:text-lg text-white">
                {state.patientName}
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 text-xs text-gray-300">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-violet-400" />
                <span>{state.patientPhone}</span>
              </div>

              {(state.patientAge || state.patientGender) && (
                <div className="text-gray-400">
                  {state.patientAge ? `${state.patientAge} yrs` : ''}
                  {state.patientAge && state.patientGender ? ' • ' : ''}
                  {state.patientGender}
                </div>
              )}
            </div>

            {state.chiefComplaint && (
              <div className="mt-3 bg-black/30 border border-white/10 rounded-2xl p-3 text-xs text-gray-300">
                <span className="font-semibold text-violet-300 block mb-1">
                  Symptoms / Notes:
                </span>
                {state.chiefComplaint}
              </div>
            )}
          </div>
        </div>
        {onEditStep && (
          <button
            type="button"
            onClick={() => onEditStep(4)}
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors shrink-0"
            aria-label="Edit Patient Details"
          >
            <Edit3 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
