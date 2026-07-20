import React, { useState } from 'react';
import { ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import { BookingState, BookingStepIndex } from '../types';
import BookingStepLayout from '../BookingStepLayout';
import BookingSummaryCard from '../BookingSummaryCard';

interface ReviewStepProps extends React.Attributes {
  state: BookingState;
  onEditStep: (step: BookingStepIndex) => void;
  onBack: () => void;
  onSubmit: () => void;
}

export default function ReviewStep({
  state,
  onEditStep,
  onBack,
  onSubmit,
}: ReviewStepProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [consentChecked, setConsentChecked] = useState(false);

  const handleSubmitRequest = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      onSubmit();
    }, 600);
  };

  return (
    <BookingStepLayout
      title="Review Your Appointment"
      subtitle="Please verify your clinical preferences and contact details before submitting."
      badge="Step 5 • Verification"
      onBack={onBack}
      onContinue={handleSubmitRequest}
      continueText={isSubmitting ? 'Finalizing Preview...' : 'Submit Request'}
      isContinueDisabled={isSubmitting || !consentChecked}
    >
      <div className="space-y-6">
        <BookingSummaryCard state={state} onEditStep={onEditStep} />

        <div className="flex items-center gap-3 bg-violet-500/10 border border-violet-500/30 rounded-2xl p-4 text-xs text-gray-300">
          <ShieldCheck className="w-5 h-5 text-violet-400 shrink-0" />
          <div>
            <p className="font-semibold text-white">
              Clinical Privacy & Secure Handling Guaranteed
            </p>
            Your patient information is treated with strict clinical confidentiality and securely managed by Dr. Nilay Saha's coordination team. No automated charges apply.
          </div>
        </div>

        <label className="flex items-start gap-3 p-4 rounded-2xl border border-white/10 bg-white/[0.02] cursor-pointer text-xs text-gray-300 hover:bg-white/[0.04] transition-colors">
          <input
            type="checkbox"
            checked={consentChecked}
            onChange={(e) => setConsentChecked(e.target.checked)}
            className="mt-0.5 w-4 h-4 rounded border-white/20 bg-white/5 accent-violet-500 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
            aria-required="true"
          />
          <span>
            I consent to my patient information being collected and processed as described in the{' '}
            <a
              href="/privacy"
              target="_blank"
              rel="noreferrer"
              className="text-violet-300 hover:text-violet-200 underline font-medium"
              onClick={(e) => e.stopPropagation()}
            >
              Privacy Policy
            </a>
            .
          </span>
        </label>
      </div>
    </BookingStepLayout>
  );
}
