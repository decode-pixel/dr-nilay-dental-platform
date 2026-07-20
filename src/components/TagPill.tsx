import React from "react";

interface TagPillProps {
  icon: React.ComponentType<{ className?: string }>;
  text: string;
  className?: string;
}

export default function TagPill({ icon: Icon, text, className = "" }: TagPillProps) {
  return (
    <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-1 mb-4 text-[#2563EB] text-xs font-semibold uppercase tracking-widest border border-blue-500/20 shadow-sm cursor-default ${className}`}>
      <Icon className="w-3.5 h-3.5 text-[#2563EB]" />
      <span>{text}</span>
    </div>
  );
}
