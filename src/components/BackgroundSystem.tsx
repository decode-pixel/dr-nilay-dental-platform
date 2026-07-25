import React from "react";

/**
 * BackgroundSystem — Liquid Glass Medical Ambient Light Matrix
 * Clean clinic white canvas with soft teal and cyan ambient refractions
 */
export default function BackgroundSystem() {
  return (
    <div
      className="fixed inset-0 z-[-2] pointer-events-none overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* Base clean white canvas */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#FAFDFD] via-[#F3F9F8] to-[#EEF5F4]" />

      {/* Subtle luxury dot matrix texture for depth */}
      <div 
        className="absolute inset-0 opacity-[0.14] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(rgba(0, 168, 150, 0.18) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />

      {/* Primary Top-Right Aurora Sphere (Teal/Cyan glow) */}
      <div
        className="absolute -top-40 -right-20 w-[800px] h-[800px] rounded-full opacity-60 pointer-events-none animate-pulse duration-10000"
        style={{
          background: "radial-gradient(circle, rgba(0,168,150,0.12) 0%, rgba(2,128,144,0.08) 40%, rgba(255,255,255,0) 70%)",
        }}
      />

      {/* Mid-Left Cyan Glass Refraction Orb */}
      <div
        className="absolute top-[28%] -left-40 w-[700px] h-[700px] rounded-full opacity-50 pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(5,150,105,0.08) 0%, rgba(0,168,150,0.06) 45%, rgba(255,255,255,0) 75%)",
        }}
      />

      {/* Mid-Right Accent Highlight */}
      <div
        className="absolute top-[58%] right-0 w-[650px] h-[650px] rounded-full opacity-40 pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(2,128,144,0.08) 0%, rgba(0,168,150,0.05) 50%, rgba(255,255,255,0) 75%)",
        }}
      />

      {/* Bottom Center Soft Teal Wash */}
      <div
        className="absolute -bottom-32 left-1/3 w-[850px] h-[550px] rounded-full opacity-45 pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(0,168,150,0.09) 0%, rgba(5,150,105,0.04) 55%, rgba(255,255,255,0) 80%)",
        }}
      />
    </div>
  );
}
