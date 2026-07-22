import React from "react";

/**
 * BackgroundSystem — Animated Crystal Aurora & Medical Ambient Light Matrix
 * Clean white canvas with subtle medical blue and cyan ambient gradients
 * Rendered purely via CSS transforms and gradients for 120fps zero-scroll-lag performance.
 */
export default function BackgroundSystem() {
  return (
    <div
      className="fixed inset-0 z-[-2] pointer-events-none overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* Base clean white canvas */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#FFFFFF] via-[#F8FAFC] to-[#F1F5F9]" />

      {/* Subtle luxury dot matrix texture for depth */}
      <div 
        className="absolute inset-0 opacity-[0.18] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(rgba(2, 132, 199, 0.20) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />

      {/* Primary Top-Right Aurora Sphere (Medical Blue/Sky Blue glow) */}
      <div
        className="absolute -top-40 -right-20 w-[750px] h-[750px] rounded-full opacity-60 pointer-events-none animate-pulse duration-10000"
        style={{
          background: "radial-gradient(circle, rgba(2,132,199,0.12) 0%, rgba(14,165,233,0.08) 40%, rgba(255,255,255,0) 70%)",
        }}
      />

      {/* Mid-Left Cyan Glass Refraction Orb */}
      <div
        className="absolute top-[28%] -left-40 w-[680px] h-[680px] rounded-full opacity-50 pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(16,185,129,0.08) 0%, rgba(2,132,199,0.05) 45%, rgba(255,255,255,0) 75%)",
        }}
      />

      {/* Mid-Right Subtle Sky Blue Accent Highlight */}
      <div
        className="absolute top-[58%] right-0 w-[620px] h-[620px] rounded-full opacity-40 pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(14,165,233,0.08) 0%, rgba(2,132,199,0.05) 50%, rgba(255,255,255,0) 75%)",
        }}
      />

      {/* Bottom Center Soft Medical Blue Wash */}
      <div
        className="absolute -bottom-32 left-1/3 w-[800px] h-[500px] rounded-full opacity-45 pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(2,132,199,0.09) 0%, rgba(16,185,129,0.04) 55%, rgba(255,255,255,0) 80%)",
        }}
      />
    </div>
  );
}
