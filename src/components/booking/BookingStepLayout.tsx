import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface BookingStepLayoutProps {
  title: string;
  subtitle: string;
  badge?: string;
  children: React.ReactNode;
  onBack?: () => void;
  onContinue?: () => void;
  continueText?: string;
  isContinueDisabled?: boolean;
  showBack?: boolean;
  showContinue?: boolean;
}

export default function BookingStepLayout({
  title,
  subtitle,
  badge,
  children,
  onBack,
  onContinue,
  continueText = 'Continue',
  isContinueDisabled = false,
  showBack = true,
  showContinue = true,
}: BookingStepLayoutProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="flex flex-col h-full"
    >
      {/* Step Header */}
      <div className="mb-6 text-center sm:text-left">
        {badge && (
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/20 bg-violet-500/10 text-violet-300 text-xs font-semibold tracking-wider uppercase mb-3 shadow-[0_0_15px_rgba(139,92,246,0.15)]">
            {badge}
          </div>
        )}
        <h3 className="text-2xl sm:text-3xl font-heading font-bold text-white mb-1">
          {title}
        </h3>
        <p className="text-sm sm:text-base text-gray-400">
          {subtitle}
        </p>
      </div>

      {/* Step Content */}
      <div className="flex-1 my-2">
        {children}
      </div>

      {/* Step Footer Actions */}
      {(showBack || showContinue) && (
        <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between gap-4">
          <div>
            {showBack && onBack && (
              <button
                type="button"
                onClick={onBack}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-sm font-medium transition-all duration-200"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
            )}
          </div>

          <div>
            {showContinue && onContinue && (
              <button
                type="button"
                onClick={onContinue}
                disabled={isContinueDisabled}
                className={`inline-flex items-center gap-2 px-7 py-3 rounded-full font-medium text-sm transition-all duration-300 ${
                  isContinueDisabled
                    ? 'bg-white/10 text-gray-500 border border-white/5 cursor-not-allowed'
                    : 'btn-sweep bg-gradient-to-r from-violet-600 to-blue-600 text-white shadow-[0_0_25px_rgba(139,92,246,0.4)] hover:shadow-[0_0_35px_rgba(139,92,246,0.7)] hover:-translate-y-0.5 border border-white/10'
                }`}
              >
                {continueText}
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}
