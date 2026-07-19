import React from "react";
import { motion } from "motion/react";

export default function BackgroundSystem() {
  return (
    <div className="fixed inset-0 z-[-2] pointer-events-none bg-[#0A0A0F] overflow-hidden">
      {/* Gradient Orb 1 */}
      <motion.div
        animate={{
          x: [-30, 30, -30],
          y: [-20, 20, -20],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-[20%] left-[20%] w-[600px] h-[600px] rounded-full opacity-60 pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(139,123,247,0.06) 0%, transparent 70%)",
          willChange: "transform",
        }}
      />

      {/* Gradient Orb 2 */}
      <motion.div
        animate={{
          x: [30, -30, 30],
          y: [20, -20, 20],
        }}
        transition={{
          duration: 40,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-[15%] right-[15%] w-[500px] h-[500px] rounded-full opacity-60 pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(99,102,241,0.05) 0%, transparent 70%)",
          willChange: "transform",
        }}
      />

      {/* Static Subtle Noise Overlay (pure CSS/inline SVG) */}
      <div 
        className="absolute inset-0 opacity-[0.015] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
