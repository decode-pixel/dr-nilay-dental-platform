import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CalendarDays } from 'lucide-react';
import BookingWizard from './BookingWizard';

interface BookingModalProps {
  initialTreatmentId?: string;
  onClose?: () => void;
  isOpen?: boolean;
}

export default function BookingModal({
  initialTreatmentId: propInitialTreatmentId,
  onClose: propOnClose,
  isOpen: propIsOpen
}: BookingModalProps = {}) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [preselectedTreatmentId, setPreselectedTreatmentId] = useState<string | undefined>(propInitialTreatmentId);

  const isOpen = propIsOpen !== undefined ? propIsOpen : internalIsOpen;

  useEffect(() => {
    if (propInitialTreatmentId) {
      setPreselectedTreatmentId(propInitialTreatmentId);
    }
  }, [propInitialTreatmentId]);

  useEffect(() => {
    const handleOpen = (e: any) => {
      if (e?.detail?.treatmentId) {
        setPreselectedTreatmentId(e.detail.treatmentId);
      } else {
        setPreselectedTreatmentId(propInitialTreatmentId);
      }
      setInternalIsOpen(true);
    };

    window.addEventListener('openContactModal', handleOpen);
    return () => window.removeEventListener('openContactModal', handleOpen);
  }, []);

  // Lock scroll when open & handle Escape key
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setInternalIsOpen(false);
          propOnClose?.();
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = 'unset';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen, propOnClose]);

  const handleClose = useCallback(() => {
    setInternalIsOpen(false);
    propOnClose?.();
  }, [propOnClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center sm:p-4 md:p-6"
          role="dialog"
          aria-modal="true"
          aria-label="Dental Appointment Booking Wizard"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-md"
          />

          {/* Modal / Sheet Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
            className="relative z-10 w-full max-w-4xl h-[100dvh] sm:h-auto sm:max-h-[90dvh] flex flex-col bg-[#050614]/85 backdrop-blur-3xl sm:rounded-[2.5rem] border border-white/15 shadow-[0_25px_70px_rgba(0,0,0,0.65)] overflow-hidden"
          >
            {/* Subtle glow behind header */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-28 bg-gradient-to-r from-violet-600/15 via-blue-600/15 to-violet-600/15 blur-2xl pointer-events-none" />

            {/* Header */}
            <div className="relative z-10 flex items-center justify-between px-6 py-4 sm:px-8 sm:py-5 border-b border-white/10 shrink-0 bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-500/20 to-blue-500/20 flex items-center justify-center border border-white/10 shadow-[0_0_15px_rgba(139,92,246,0.2)]">
                  <CalendarDays className="w-5 h-5 text-violet-400" />
                </div>
                <div>
                  <h2 className="font-heading font-bold text-lg sm:text-xl text-white">
                    Schedule Your Visit
                  </h2>
                  <p className="text-xs text-gray-400">
                    Dr. Nilay Saha Dental Clinic • Personalized Care
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleClose}
                className="p-2.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-2xl transition-all duration-200"
                aria-label="Close Booking Wizard"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Wizard Body */}
            <div className="flex-1 overflow-hidden">
              <BookingWizard
                initialTreatmentId={preselectedTreatmentId}
                onClose={handleClose}
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
