import React from 'react';

interface SkeletonProps {
  className?: string;
}

export function SkeletonBase({ className = '' }: SkeletonProps) {
  return (
    <div className={`animate-pulse bg-white/5 rounded-xl ${className}`} />
  );
}

export default function SkeletonLoader({ variant }: { variant: 'card' | 'row' | 'stats' | 'profile' }) {
  if (variant === 'stats') {
    return (
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col justify-between">
        <SkeletonBase className="h-3 w-2/3 mb-4" />
        <SkeletonBase className="h-8 w-1/2" />
        <SkeletonBase className="h-2 w-full mt-4" />
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
        <div className="flex items-center gap-3">
          <SkeletonBase className="w-10 h-10 rounded-xl" />
          <div className="flex-1 space-y-2">
            <SkeletonBase className="h-4 w-3/4" />
            <SkeletonBase className="h-3 w-1/2" />
          </div>
        </div>
        <SkeletonBase className="h-16 w-full" />
        <div className="flex justify-between pt-2">
          <SkeletonBase className="h-4 w-1/3" />
          <SkeletonBase className="h-4 w-1/4" />
        </div>
      </div>
    );
  }

  if (variant === 'profile') {
    return (
      <div className="bg-[#050614]/60 border border-white/10 rounded-3xl p-6 space-y-6">
        <div className="flex items-center gap-4">
          <SkeletonBase className="w-16 h-16 rounded-2xl" />
          <div className="flex-1 space-y-2">
            <SkeletonBase className="h-5 w-1/3" />
            <SkeletonBase className="h-3.5 w-1/4" />
          </div>
        </div>
        <div className="border-t border-white/5 pt-4 space-y-3">
          <SkeletonBase className="h-4 w-full" />
          <SkeletonBase className="h-4 w-5/6" />
          <SkeletonBase className="h-4 w-4/5" />
        </div>
      </div>
    );
  }

  // Default: 'row' list element
  return (
    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 flex-1">
        <SkeletonBase className="w-10 h-10 rounded-xl" />
        <div className="flex-1 space-y-2">
          <SkeletonBase className="h-4 w-1/3" />
          <SkeletonBase className="h-3 w-1/4" />
        </div>
      </div>
      <div className="space-y-2 w-24">
        <SkeletonBase className="h-3.5 w-full ml-auto" />
        <SkeletonBase className="h-3 w-2/3 ml-auto" />
      </div>
    </div>
  );
}
