import React from 'react';
import { BookingState } from '../types';
import BookingStepLayout from '../BookingStepLayout';
import BookingSuccessCard from '../BookingSuccessCard';

interface SuccessStepProps {
  state: BookingState;
  referenceCode: string;
  isOffline: boolean;
  submitError: string | null;
  isRetrying: boolean;
  onRetry: () => void;
  onClose?: () => void;
  onStartNew?: () => void;
  whatsappNumber?: string;
  primaryPhone?: string;
  clinicName?: string;
}

export default function SuccessStep({
  state,
  referenceCode,
  isOffline,
  submitError,
  isRetrying,
  onRetry,
  onClose,
  onStartNew,
  whatsappNumber,
  primaryPhone,
  clinicName,
}: SuccessStepProps) {
  return (
    <BookingStepLayout
      title={isOffline ? 'Appointment Request Cached' : 'Appointment Request Received'}
      subtitle={
        isOffline
          ? 'Saved locally. We will automatically sync this request when you come back online.'
          : 'Our clinical coordinator will confirm your exact slot shortly.'
      }
      badge="Step 6 • Request Complete"
      showBack={false}
      showContinue={true}
      continueText="Done"
      onContinue={onClose}
    >
      <div className="space-y-6">
        <BookingSuccessCard
          state={state}
          referenceCode={referenceCode}
          isOffline={isOffline}
          submitError={submitError}
          isRetrying={isRetrying}
          onRetry={onRetry}
          onCloseWizard={onClose}
          whatsappNumber={whatsappNumber}
          primaryPhone={primaryPhone}
          clinicNameOverride={clinicName}
        />

        {onStartNew && (
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={onStartNew}
              className="text-xs text-gray-400 hover:text-white underline transition-colors"
            >
              Book another appointment request
            </button>
          </div>
        )}
      </div>
    </BookingStepLayout>
  );
}
