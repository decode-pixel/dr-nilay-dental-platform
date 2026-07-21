import React from "react";

/**
 * BackgroundSystem — Animated Luxury Mesh & Ambient Glow
 * Lightweight CSS radial gradients with subtle cyan/emerald ambient glows
 */
export default function BackgroundSystem() {
  return (
    <div
      className="fixed inset-0 z-[-2] pointer-events-none overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* Base luxury canvas */}
      <div className="absolute inset-0 bg-[#FCFCFD]" />

      {/* Top right cyan/emerald ambient glow */}
      <div
        className="absolute -top-32 -right-32 w-[650px] h-[650px] rounded-full opacity-60 pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(6,182,212,0.12) 0%, rgba(16,185,129,0.08) 45%, transparent 70%)",
        }}
      />

      {/* Top left emerald mesh wash */}
      <div
        className="absolute top-1/4 -left-32 w-[550px] h-[550px] rounded-full opacity-50 pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(16,185,129,0.09) 0%, rgba(13,148,136,0.04) 50%, transparent 75%)",
        }}
      />

      {/* Center page luxury ambient glow */}
      <div
        className="absolute top-2/3 right-10 w-[600px] h-[600px] rounded-full opacity-40 pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(34,211,238,0.07) 0%, rgba(16,185,129,0.05) 55%, transparent 75%)",
        }}
      />
    </div>
  );
}
