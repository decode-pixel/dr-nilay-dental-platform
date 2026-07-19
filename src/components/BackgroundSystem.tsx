import React from "react";
import { motion } from "motion/react";

export default function BackgroundSystem() {
  return (
    <div className="fixed inset-0 z-[-2] pointer-events-none bg-[#F8FBFF] overflow-hidden">
      {/* ==========================================
          1. BASE LAYER & DIFFUSED DAYLIGHT
          Pearl White #F8FBFF foundation with architectural daylight entering from large clinic windows
         ========================================== */}
      <div 
        className="absolute top-0 right-0 w-[85vw] h-[85vh] rounded-full opacity-80 pointer-events-none"
        style={{
          background: "radial-gradient(circle at 80% 15%, rgba(37, 99, 235, 0.08) 0%, rgba(239, 246, 255, 0.4) 45%, transparent 75%)",
        }}
      />
      <div 
        className="absolute top-[10%] left-[-10%] w-[60vw] h-[60vh] rounded-full opacity-60 pointer-events-none"
        style={{
          background: "radial-gradient(circle at 30% 30%, rgba(14, 165, 233, 0.06) 0%, rgba(252, 252, 253, 0.5) 60%, transparent 80%)",
        }}
      />

      {/* Soft Ceiling Reflections & Skylight Glow */}
      <div 
        className="absolute top-0 inset-x-0 h-[30vh] opacity-70 pointer-events-none"
        style={{
          background: "linear-gradient(180deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 251, 255, 0.3) 60%, transparent 100%)",
        }}
      />

      {/* ==========================================
          2. ABSTRACT ARCHITECTURAL DEPTH & CURVES
          Minimal clinic-inspired geometry, flowing interior arches, Scandinavian interior curves
         ========================================== */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.45] pointer-events-none"
        viewBox="0 0 1440 3200"
        fill="none"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="archCurve1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(37, 99, 235, 0.12)" />
            <stop offset="50%" stopColor="rgba(14, 165, 233, 0.05)" />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
          </linearGradient>
          <linearGradient id="archCurve2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(37, 99, 235, 0.08)" />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
          </linearGradient>
        </defs>

        {/* Hero & About Architectural Arches */}
        <path
          d="M-200 400 C 300 100, 800 600, 1600 200"
          stroke="url(#archCurve1)"
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d="M-100 800 C 400 500, 1000 900, 1600 600"
          stroke="url(#archCurve2)"
          strokeWidth="1"
          fill="none"
        />
        <path
          d="M0 1400 C 500 1100, 900 1600, 1440 1200"
          stroke="rgba(37, 99, 235, 0.05)"
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d="M-150 2200 C 350 1800, 850 2400, 1500 1900"
          stroke="rgba(14, 165, 233, 0.04)"
          strokeWidth="1"
          fill="none"
        />
      </svg>

      {/* ==========================================
          3. RADIAL LIGHT SYSTEM & SECTION VARIATIONS
          Vertical mapped ambient lighting guiding the eye down the page continuous flow
         ========================================== */}
      {/* Hero Section Variation: Pearl White -> Blue Ambient Glow -> Doctor Spotlight -> Soft Glass Reflection */}
      <motion.div
        animate={{ scale: [1, 1.04, 1], opacity: [0.7, 0.9, 0.7] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[8%] right-[8%] w-[650px] h-[650px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(37, 99, 235, 0.12) 0%, rgba(14, 165, 233, 0.06) 40%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      {/* Doctor Portrait Spotlight & Rim Halo */}
      <div 
        className="absolute top-[18%] right-[12%] w-[480px] h-[550px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(ellipse, rgba(255, 255, 255, 0.95) 0%, rgba(239, 246, 255, 0.6) 50%, transparent 80%)",
          filter: "blur(45px)",
        }}
      />

      {/* About Section Variation: Warm White -> Soft Interior Lighting -> Light Architectural Curves */}
      <div 
        className="absolute top-[22%] left-[5%] w-[700px] h-[600px] rounded-full pointer-events-none opacity-80"
        style={{
          background: "radial-gradient(circle, rgba(252, 252, 253, 0.95) 0%, rgba(248, 251, 255, 0.4) 60%, transparent 85%)",
          filter: "blur(70px)",
        }}
      />

      {/* Treatments Section Variation: Cool White -> Subtle Medical Blue Reflection -> Glass Depth */}
      <motion.div
        animate={{ x: [-20, 20, -20], y: [-15, 15, -15] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[42%] right-[10%] w-[750px] h-[750px] rounded-full pointer-events-none opacity-70"
        style={{
          background: "radial-gradient(circle, rgba(14, 165, 233, 0.08) 0%, rgba(239, 246, 255, 0.5) 50%, transparent 80%)",
          filter: "blur(80px)",
        }}
      />

      {/* Why Choose Section Variation: Very Light Blue Tint -> Ambient Glow -> Floating Soft Blur */}
      <div 
        className="absolute top-[58%] left-[10%] w-[800px] h-[700px] rounded-full pointer-events-none opacity-85"
        style={{
          background: "radial-gradient(circle, rgba(239, 246, 255, 0.9) 0%, rgba(37, 99, 235, 0.05) 55%, transparent 80%)",
          filter: "blur(75px)",
        }}
      />

      {/* Clinics Section Variation: Warm Neutral White -> Natural Daylight Feeling */}
      <div 
        className="absolute top-[72%] right-[15%] w-[650px] h-[650px] rounded-full pointer-events-none opacity-75"
        style={{
          background: "radial-gradient(circle, rgba(252, 252, 253, 0.95) 0%, rgba(248, 251, 255, 0.4) 60%, transparent 80%)",
          filter: "blur(65px)",
        }}
      />

      {/* Testimonials & Booking Section Variation: Bright White -> Soft Blue Gradient -> Gentle Spotlight */}
      <motion.div
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[5%] left-[20%] w-[900px] h-[700px] rounded-full pointer-events-none opacity-80"
        style={{
          background: "radial-gradient(circle, rgba(239, 246, 255, 0.95) 0%, rgba(37, 99, 235, 0.07) 50%, transparent 80%)",
          filter: "blur(85px)",
        }}
      />

      {/* ==========================================
          4. PREMIUM MATERIAL TEXTURES & FROSTED GLASS ATMOSPHERE
          Satin finish, frosted acrylic, 2-3% opacity marble veins and medical composite grain
         ========================================== */}
      <div 
        className="absolute inset-0 opacity-[0.022] pointer-events-none mix-blend-multiply"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
