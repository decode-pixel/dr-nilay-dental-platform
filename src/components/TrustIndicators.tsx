import React from "react";
import { Award, ShieldCheck, Smile } from "lucide-react";
import { ToothIcon } from "./Icons";

export default function TrustIndicators() {
  const statsWidgets = [
    {
      percentage: "98%",
      label: "Pain-Free Comfort Rate",
      desc: "Gentle local anesthesia & rotary endodontics",
      ringColor: "stroke-[#0284C7]",
      bgGlow: "bg-sky-50 border-sky-200/80"
    },
    {
      percentage: "99%",
      label: "Patient Satisfaction",
      desc: "Based on 5,000+ verified regional treatments",
      ringColor: "stroke-[#0EA5E9]",
      bgGlow: "bg-[#F0F9FF] border-sky-200/80"
    },
    {
      percentage: "100%",
      label: "WHO Autoclave Sterilization",
      desc: "Hospital-grade multi-tier aseptic standards",
      ringColor: "stroke-emerald-500",
      bgGlow: "bg-emerald-50 border-emerald-200/80"
    }
  ];

  const pillars = [
    {
      icon: ToothIcon,
      title: "Advanced RVG Diagnostics",
      desc: "Digital intraoral imaging & precision 3D mapping.",
      iconColor: "text-[#0284C7]",
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
      iconColor: "text-teal-600",
    },
    {
      icon: Smile,
      title: "Painless Patient Care",
      desc: "Gentle local anesthesia tailored for anxious patients.",
      iconColor: "text-[#0284C7]",
    }
  ];

  return (
    <section className="py-14 sm:py-20 bg-white border-b border-slate-200/60 font-sans relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
        
        {/* ── Circular Progress Percentage Rings ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {statsWidgets.map((widget, idx) => (
            <div
              key={idx}
              className="p-7 rounded-[20px] flex items-center gap-5 bg-white border border-slate-200/80 shadow-[0_10px_30px_rgba(15,23,42,0.04)] hover:shadow-[0_20px_45px_rgba(2,132,199,0.1)] transition-all duration-300"
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
                <span className="absolute font-display font-extrabold text-lg text-[#0F172A]">
                  {widget.percentage}
                </span>
              </div>

              {/* Stat Text */}
              <div>
                <h4 className="font-display font-extrabold text-base text-[#0F172A] leading-snug mb-1">
                  {widget.label}
                </h4>
                <p className="text-xs text-[#475569] leading-relaxed font-normal">
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
                className="p-6 flex items-start gap-4 bg-slate-50/80 rounded-[20px] border border-slate-200/80 hover:bg-white hover:shadow-[0_15px_35px_rgba(2,132,199,0.08)] hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-110 transition-transform">
                  <Icon className={`w-6 h-6 ${pillar.iconColor}`} />
                </div>
                <div>
                  <h3 className="font-display font-extrabold text-base text-[#0F172A] mb-1">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-[#475569] leading-relaxed">
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
