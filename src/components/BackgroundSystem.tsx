import React from "react";

/**
 * BackgroundSystem — V2 Animated Crystal Aurora & Ambient Light Matrix
 * Ultra-premium Apple/Stripe-caliber ambient lighting and subtle geometry
 * Rendered purely via CSS transforms and gradients for 120fps zero-scroll-lag performance.
 */
export default function BackgroundSystem() {
  return (
    <div
      className="fixed inset-0 z-[-2] pointer-events-none overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* Base crystal canvas */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#F8FAFC] via-[#FCFCFD] to-[#F3F8F6]" />

      {/* Subtle luxury dot matrix texture for depth */}
      <div 
        className="absolute inset-0 opacity-[0.22] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(rgba(16, 185, 129, 0.25) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Primary Top-Right Aurora Sphere (Cyan/Emerald crystal reflection) */}
      <div
        className="absolute -top-40 -right-20 w-[750px] h-[750px] rounded-full opacity-65 pointer-events-none animate-pulse duration-10000"
        style={{
          background: "radial-gradient(circle, rgba(16,185,129,0.14) 0%, rgba(6,182,212,0.1) 40%, rgba(255,255,255,0) 70%)",
        }}
      />

      {/* Mid-Left Emerald Glass Refraction Orb */}
      <div
        className="absolute top-[28%] -left-40 w-[680px] h-[680px] rounded-full opacity-55 pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(16,185,129,0.12) 0%, rgba(5,150,105,0.06) 45%, rgba(255,255,255,0) 75%)",
        }}
      />

      {/* Mid-Right Warm Crystal Gold / Teal Highlight */}
      <div
        className="absolute top-[58%] right-0 w-[620px] h-[620px] rounded-full opacity-45 pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(6,182,212,0.09) 0%, rgba(16,185,129,0.07) 50%, rgba(255,255,255,0) 75%)",
        }}
      />

      {/* Bottom Center Deep Crystal Wash */}
      <div
        className="absolute -bottom-32 left-1/3 w-[800px] h-[500px] rounded-full opacity-50 pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(16,185,129,0.11) 0%, rgba(13,148,136,0.05) 55%, rgba(255,255,255,0) 80%)",
        }}
      />
    </div>
  );
}
