import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [showRestored, setShowRestored] = useState(false);

  useEffect(() => {
    const handleOffline = () => {
      setIsOffline(true);
      setShowRestored(false);
    };

    const handleOnline = () => {
      setIsOffline(false);
      setShowRestored(true);
      const timer = setTimeout(() => setShowRestored(false), 3000);
      return () => clearTimeout(timer);
    };

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[999999] max-w-sm w-full px-4 pointer-events-none">
      <AnimatePresence>
        {isOffline && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="pointer-events-auto flex items-center justify-between gap-3 p-4 rounded-2xl border border-red-500/20 bg-[#0f0707]/95 backdrop-blur-md shadow-2xl"
          >
            <div className="flex items-center gap-2.5">
              <WifiOff className="w-5 h-5 text-red-400 shrink-0" />
              <div className="text-xs font-semibold text-white leading-normal">
                You are currently offline. Checking connection...
              </div>
            </div>
          </motion.div>
        )}

        {showRestored && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="pointer-events-auto flex items-center justify-between gap-3 p-4 rounded-2xl border border-green-500/20 bg-[#050c05]/95 backdrop-blur-md shadow-2xl"
          >
            <div className="flex items-center gap-2.5">
              <Wifi className="w-5 h-5 text-green-400 shrink-0" />
              <div className="text-xs font-semibold text-white leading-normal">
                Connection restored! Back online.
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
