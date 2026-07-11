import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  Icon: LucideIcon;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({
  title,
  description,
  Icon,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-10 text-center flex flex-col items-center justify-center space-y-4 max-w-lg mx-auto backdrop-blur-sm">
      <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400">
        <Icon className="w-6 h-6" />
      </div>

      <div className="space-y-1">
        <h3 className="text-base font-bold text-white tracking-wide">
          {title}
        </h3>
        <p className="text-xs text-gray-400 leading-relaxed max-w-sm">
          {description}
        </p>
      </div>

      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="px-4 py-2 rounded-xl bg-violet-600/10 hover:bg-violet-600/20 border border-violet-500/20 text-violet-300 text-xs font-semibold transition-all duration-200"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
