import React from "react";

/**
 * BackgroundSystem — Performance-First Version
 * 
 * REMOVED: All animated motion.div blobs (infinite GPU-heavy scale/translate/opacity animations)
 * REMOVED: CSS filter: blur() on large divs (triggers compositing layer explosion on mobile)
 * REMOVED: Large SVG (1440x3200) with continuous repaint
 * 
 * REPLACED WITH: Pure CSS static gradients — zero JS, zero compositing layers, zero repaints.
 * Renders once, paints once, costs nothing during scroll.
 */
export default function BackgroundSystem() {
  return (
    <div
      className="fixed inset-0 z-[-2] pointer-events-none overflow-hidden"
      style={{ backgroundColor: "#F8FBFF" }}
      aria-hidden="true"
    >
      {/* Top-right ambient — pure CSS radial, no blur, no animation */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "55vw",
          height: "55vh",
          background: "radial-gradient(circle at 80% 15%, rgba(16,185,129,0.06) 0%, rgba(239,246,255,0.3) 50%, transparent 75%)",
          willChange: "auto",
        }}
      />
      {/* Top-left ambient */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          left: "-5%",
          width: "45vw",
          height: "45vh",
          background: "radial-gradient(circle at 30% 30%, rgba(16,185,129,0.04) 0%, rgba(248,251,255,0.4) 60%, transparent 80%)",
          willChange: "auto",
        }}
      />
      {/* Mid-page subtle wash */}
      <div
        style={{
          position: "absolute",
          top: "40%",
          right: "5%",
          width: "50vw",
          height: "50vh",
          background: "radial-gradient(circle, rgba(16,185,129,0.04) 0%, rgba(239,246,255,0.25) 60%, transparent 80%)",
          willChange: "auto",
        }}
      />
      {/* Bottom wash */}
      <div
        style={{
          position: "absolute",
          bottom: "5%",
          left: "10%",
          width: "60vw",
          height: "50vh",
          background: "radial-gradient(circle, rgba(239,246,255,0.8) 0%, rgba(16,185,129,0.03) 55%, transparent 80%)",
          willChange: "auto",
        }}
      />
    </div>
  );
}
