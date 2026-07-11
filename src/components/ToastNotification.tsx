import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Automatically clear after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const TOAST_STYLES: Record<
    ToastType,
    { bg: string; border: string; text: string; icon: React.ReactNode }
  > = {
    success: {
      bg: 'bg-[#050c14]/90',
      border: 'border-green-500/20',
      text: 'text-green-400',
      icon: <CheckCircle className="w-5 h-5 text-green-400" />,
    },
    error: {
      bg: 'bg-[#0c0514]/90',
      border: 'border-red-500/20',
      text: 'text-red-400',
      icon: <XCircle className="w-5 h-5 text-red-400" />,
    },
    warning: {
      bg: 'bg-[#0c0905]/90',
      border: 'border-amber-500/20',
      text: 'text-amber-400',
      icon: <AlertTriangle className="w-5 h-5 text-amber-400" />,
    },
    info: {
      bg: 'bg-[#050614]/90',
      border: 'border-blue-500/20',
      text: 'text-blue-400',
      icon: <Info className="w-5 h-5 text-blue-400" />,
    },
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Portal Container */}
      <div className="fixed bottom-6 right-6 z-[999999] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => {
            const styles = TOAST_STYLES[toast.type];
            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl border ${styles.bg} ${styles.border} backdrop-blur-md shadow-2xl`}
              >
                <div className="shrink-0 mt-0.5">{styles.icon}</div>
                <div className="flex-1 text-sm font-semibold text-white leading-snug">
                  {toast.message}
                </div>
                <button
                  type="button"
                  onClick={() => removeToast(toast.id)}
                  className="shrink-0 text-gray-500 hover:text-white transition-colors p-0.5 rounded-lg hover:bg-white/5"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
