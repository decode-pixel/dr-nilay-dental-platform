import React from 'react';
import { motion } from 'motion/react';
import { Check, MapPin, Sparkles, Calendar, User, FileText, CheckCircle2 } from 'lucide-react';
import { BookingStepIndex, STEP_NAMES } from './types';

interface BookingProgressProps {
  currentStep: BookingStepIndex;
  onStepClick?: (step: BookingStepIndex) => void;
}

const STEP_ICONS: Record<BookingStepIndex, React.ElementType> = {
  1: MapPin,
  2: Sparkles,
  3: Calendar,
  4: User,
  5: FileText,
  6: CheckCircle2,
};

export default function BookingProgress({ currentStep, onStepClick }: BookingProgressProps) {
  const steps: BookingStepIndex[] = [1, 2, 3, 4, 5, 6];

  return (
    <div className="w-full">
      {/* Desktop / Tablet Progress Indicator */}
      <div className="hidden sm:flex items-center justify-between relative px-2 py-4">
        {/* Background track line */}
        <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-0.5 bg-white/10 z-0" />
        
        {/* Animated filled track line */}
        <motion.div
          className="absolute left-8 top-1/2 -translate-y-1/2 h-0.5 bg-gradient-to-r from-violet-500 to-blue-500 z-0"
          initial={{ width: '0%' }}
          animate={{
            width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
          }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        />

        {steps.map((step) => {
          const Icon = STEP_ICONS[step];
          const isCompleted = step < currentStep;
          const isCurrent = step === currentStep;
          const isClickable = isCompleted && onStepClick;

          return (
            <div
              key={step}
              className="relative z-10 flex flex-col items-center group"
            >
              <button
                type="button"
                disabled={!isClickable}
                onClick={() => isClickable && onStepClick(step)}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isClickable ? 'cursor-pointer' : 'cursor-default'
                } ${
                  isCurrent
                    ? 'bg-gradient-to-br from-violet-600 to-blue-600 text-white shadow-[0_0_20px_rgba(139,92,246,0.6)] ring-2 ring-white/30 scale-110'
                    : isCompleted
                    ? 'bg-violet-500/20 text-violet-400 border border-violet-500/40 hover:bg-violet-500/30'
                    : 'bg-white/5 text-gray-500 border border-white/10'
                }`}
                aria-label={`Step ${step}: ${STEP_NAMES[step]}`}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4 text-violet-300" />
                ) : (
                  <Icon className="w-4 h-4" />
                )}
              </button>
              <span
                className={`mt-2 text-xs font-medium tracking-wide uppercase transition-colors duration-300 ${
                  isCurrent
                    ? 'text-white font-semibold'
                    : isCompleted
                    ? 'text-gray-300'
                    : 'text-gray-500'
                }`}
              >
                {STEP_NAMES[step]}
              </span>
            </div>
          );
        })}
      </div>

      {/* Mobile Progress Bar */}
      <div className="sm:hidden flex flex-col gap-2 py-2">
        <div className="flex items-center justify-between text-xs font-medium uppercase tracking-wider">
          <span className="text-violet-400 font-semibold">
            Step {currentStep} of {steps.length}: {STEP_NAMES[currentStep]}
          </span>
          <span className="text-gray-400">
            {Math.round(((currentStep - 1) / (steps.length - 1)) * 100)}%
          </span>
        </div>
        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-violet-500 to-blue-500 rounded-full shadow-[0_0_12px_rgba(139,92,246,0.6)]"
            initial={{ width: '0%' }}
            animate={{
              width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
            }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>
      </div>
    </div>
  );
}
