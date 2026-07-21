import React from "react";
import { Award, ShieldCheck, Smile } from "lucide-react";
import { ToothIcon } from "./Icons";

/**
 * TrustIndicators — Circular Progress Rings & Clinical Guarantees
 * Inspired by circular percentage widgets in reference design layout.
 */

export default function TrustIndicators() {
  const statsWidgets = [
    {
      percentage: "98%",
      label: "Pain-Free Comfort Rate",
      desc: "Gentle local anesthesia & rotary endodontics",
      ringColor: "stroke-[#10B981]",
      bgGlow: "bg-emerald-50 border-emerald-200/80"
    },
    {
      percentage: "99%",
      label: "Patient Satisfaction",
      desc: "Based on 5,000+ verified regional treatments",
      ringColor: "stroke-[#06B6D4]",
      bgGlow: "bg-cyan-50 border-cyan-200/80"
    },
    {
      percentage: "100%",
      label: "WHO Autoclave Sterilization",
      desc: "Hospital-grade multi-tier aseptic standards",
      ringColor: "stroke-emerald-600",
      bgGlow: "bg-emerald-50 border-emerald-200/80"
    }
  ];

  const pillars = [
    {
      icon: ToothIcon,
      title: "Advanced RVG Diagnostics",
      desc: "Digital intraoral imaging & precision 3D mapping.",
      iconColor: "text-[#10B981]",
    },
    {
      icon: Award,
      title: "10+ Years Mastery",
      desc: "Fellowship-trained endodontic & surgical excellence.",
      iconColor: "text-amber-500",
    },
    {
      icon: ShieldCheck,
      title: "Hospital Hygiene",
      desc: "Multi-tier WHO compliant autoclave sterilization.",
      iconColor: "text-cyan-600",
    },
    {
      icon: Smile,
      title: "Painless Patient Care",
      desc: "Gentle local anesthesia tailored for anxious patients.",
      iconColor: "text-emerald-600",
    }
  ];

  return (
    <section className="py-14 sm:py-20 bg-[#FCFCFD] border-b border-slate-200/60 font-sans relative z-10">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 space-y-12 sm:space-y-16">
        
        {/* ── Circular Progress Percentage Rings (Reference Inspired) ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {statsWidgets.map((widget, idx) => (
            <div
              key={idx}
              className="glass-card-floating p-7 rounded-3xl flex items-center gap-5 bg-gradient-to-br from-white via-white to-emerald-50/40 border border-slate-200/80 shadow-[0_12px_35px_rgba(18,40,32,0.05)] hover:shadow-[0_20px_45px_rgba(16,185,129,0.1)] transition-all duration-300"
            >
              {/* Circular SVG Ring */}
              <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
                <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-100"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className={`${widget.ringColor}`}
                    strokeDasharray="95, 100"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <span className="absolute font-display font-bold text-lg text-[#122820]">
                  {widget.percentage}
                </span>
              </div>

              {/* Stat Text */}
              <div>
                <h4 className="font-display font-bold text-base text-[#122820] leading-snug mb-1">
                  {widget.label}
                </h4>
                <p className="text-xs text-[#4B6358] leading-relaxed">
                  {widget.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ── 4 Core Clinical Pillars Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="glass-card-floating p-6 flex items-start gap-4 bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-[0_15px_35px_rgba(16,185,129,0.08)] transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center shrink-0 shadow-sm">
                  <Icon className={`w-6 h-6 ${pillar.iconColor}`} />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-[#122820] mb-1">
                    {pillar.title}
                  </h3>
                  <p className="small-premium text-xs sm:text-[13px] text-[#2C4238]">
                    {pillar.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
