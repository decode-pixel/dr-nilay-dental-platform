import React from 'react';
import { User, Phone, FileText, AlertCircle, Sparkles } from 'lucide-react';
import { BookingState, BookingErrors } from '../types';
import BookingStepLayout from '../BookingStepLayout';

interface PatientStepProps extends React.Attributes {
  state: BookingState;
  errors: BookingErrors;
  onChange: (field: keyof BookingState, value: string) => void;
  onBack: () => void;
  onContinue: () => void;
  isValid: boolean;
}

export default function PatientStep({
  state,
  errors,
  onChange,
  onBack,
  onContinue,
  isValid,
}: PatientStepProps) {
  const charCount = state.chiefComplaint.length;
  const maxChars = 300;

  return (
    <BookingStepLayout
      title="Patient Details"
      subtitle="Please provide your contact details and a brief note on your symptoms."
      badge="Step 4 • Patient Information"
      onBack={onBack}
      onContinue={onContinue}
      isContinueDisabled={!isValid}
    >
      <div className="space-y-5">
        {/* Full Name & Phone Number Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
              Full Name <span className="text-violet-400">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="e.g. Rahul Sharma"
                value={state.patientName}
                onChange={(e) => onChange('patientName', e.target.value)}
                className={`w-full bg-white/5 border rounded-2xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none transition-all duration-200 ${
                  errors.patientName
                    ? 'border-red-500/80 focus:border-red-500 bg-red-500/5'
                    : 'border-white/10 focus:border-violet-400/80 focus:bg-white/10'
                }`}
              />
            </div>
            {errors.patientName ? (
              <p className="flex items-center gap-1.5 text-xs text-red-400 mt-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.patientName}
              </p>
            ) : (
              <p className="text-[11px] text-gray-400 mt-1.5">
                Enter your full legal name for your dental record.
              </p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
              Phone Number <span className="text-violet-400">*</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="tel"
                placeholder="e.g. 9609180979 or +91 9609180979"
                value={state.patientPhone}
                onChange={(e) => onChange('patientPhone', e.target.value)}
                className={`w-full bg-white/5 border rounded-2xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none transition-all duration-200 ${
                  errors.patientPhone
                    ? 'border-red-500/80 focus:border-red-500 bg-red-500/5'
                    : 'border-white/10 focus:border-violet-400/80 focus:bg-white/10'
                }`}
              />
            </div>
            {errors.patientPhone ? (
              <p className="flex items-center gap-1.5 text-xs text-red-400 mt-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.patientPhone}
              </p>
            ) : (
              <p className="text-[11px] text-gray-400 mt-1.5">
                We will send your appointment confirmation & updates via WhatsApp.
              </p>
            )}
          </div>
        </div>

        {/* Optional Row: Age & Gender */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Age */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
              Age <span className="text-gray-500">(Optional)</span>
            </label>
            <input
              type="number"
              placeholder="e.g. 32"
              value={state.patientAge || ''}
              onChange={(e) => onChange('patientAge', e.target.value)}
              min={1}
              max={120}
              className="w-full bg-white/5 border border-white/10 focus:border-violet-400/80 rounded-2xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:bg-white/10 transition-all duration-200"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
              Gender <span className="text-gray-500">(Optional)</span>
            </label>
            <div className="flex items-center gap-1.5 flex-wrap">
              {(['Male', 'Female', 'Other', 'Prefer not to say'] as const).map(
                (gen) => {
                  const isSelected = state.patientGender === gen;

                  return (
                    <button
                      key={gen}
                      type="button"
                      onClick={() =>
                        onChange('patientGender', isSelected ? '' : gen)
                      }
                      className={`px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 ${
                        isSelected
                          ? 'bg-violet-600 text-white border border-violet-400 shadow-[0_0_12px_rgba(139,92,246,0.4)]'
                          : 'bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10'
                      }`}
                    >
                      {gen}
                    </button>
                  );
                }
              )}
            </div>
          </div>
        </div>

        {/* Chief Complaint */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider">
              Chief Complaint / Symptoms <span className="text-violet-400">*</span>
            </label>
            <span
              className={`text-xs font-medium ${
                charCount > maxChars ? 'text-red-400' : 'text-gray-400'
              }`}
            >
              {charCount} / {maxChars}
            </span>
          </div>

          <div className="relative">
            <textarea
              rows={3}
              maxLength={maxChars}
              placeholder="Briefly describe your toothache, sensitivity, cosmetic goal, or routine check-up notes..."
              value={state.chiefComplaint}
              onChange={(e) => onChange('chiefComplaint', e.target.value)}
              className={`w-full bg-white/5 border rounded-2xl p-4 text-sm text-white placeholder-gray-500 focus:outline-none transition-all duration-200 resize-none ${
                errors.chiefComplaint
                  ? 'border-red-500/80 focus:border-red-500 bg-red-500/5'
                  : 'border-white/10 focus:border-violet-400/80 focus:bg-white/10'
              }`}
            />
          </div>

          {errors.chiefComplaint ? (
            <p className="flex items-center gap-1.5 text-xs text-red-400 mt-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.chiefComplaint}
            </p>
          ) : (
            <p className="text-[11px] text-gray-400 mt-1.5">
              Helps our dental team prepare the required diagnostic instruments before your arrival.
            </p>
          )}
        </div>
      </div>
    </BookingStepLayout>
  );
}
