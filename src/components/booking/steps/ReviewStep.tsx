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
      isContinueDisabled={isSubmitting}
    >
      <div className="space-y-6">
        <BookingSummaryCard state={state} onEditStep={onEditStep} />

        <div className="flex items-center gap-3 bg-violet-500/10 border border-violet-500/30 rounded-2xl p-4 text-xs text-gray-300">
          <ShieldCheck className="w-5 h-5 text-violet-400 shrink-0" />
          <div>
            <p className="font-semibold text-white">
              HIPAA & Clinical Privacy Guaranteed
            </p>
            Your details are securely handled by Dr. Nilay Saha Dental Clinic coordinator team. No automated charges apply.
          </div>
        </div>
      </div>
    </BookingStepLayout>
  );
}
