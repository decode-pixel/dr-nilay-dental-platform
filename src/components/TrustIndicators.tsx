import React from "react";
import { Smile, Award, ShieldCheck, Cpu } from "lucide-react";
import { ToothIcon } from "./Icons";

/**
 * TrustIndicators — Apple/Stripe-Caliber Clinical Guarantees Bar
 * Placed immediately below Hero to instantly reinforce professional trust.
 */

export default function TrustIndicators() {
  const pillars = [
    {
      icon: ToothIcon,
      title: "Advanced Diagnostics",
      desc: "Digital intraoral imaging & precision 3D mapping.",
      iconColor: "text-[#10B981]",
      bgClass: "bg-emerald-50/90 border-emerald-200/80"
    },
    {
      icon: Award,
      title: "10+ Years Mastery",
      desc: "Fellowship-trained endodontic & surgical excellence.",
      iconColor: "text-amber-500",
      bgClass: "bg-amber-50/90 border-amber-200/80"
    },
    {
      icon: ShieldCheck,
      title: "Hospital-Grade Hygiene",
      desc: "Multi-tier WHO compliant autoclave sterilization.",
      iconColor: "text-blue-600",
      bgClass: "bg-blue-50/90 border-blue-200/80"
    },
    {
      icon: Smile,
      title: "Painless Patient Care",
      desc: "Gentle local anesthesia tailored for anxious patients.",
      iconColor: "text-emerald-600",
      bgClass: "bg-emerald-50/90 border-emerald-200/80"
    }
  ];

  return (
    <section className="py-12 sm:py-16 bg-[#FCFCFD] border-b border-slate-200/60 font-sans relative z-10">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="card-premium p-6 flex items-start gap-4 bg-white/90 hover:bg-white"
              >
                <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 shadow-sm ${pillar.bgClass}`}>
                  <Icon className={`w-6 h-6 ${pillar.iconColor}`} />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-[#122820] mb-1">
                    {pillar.title}
                  </h3>
                  <p className="small-premium text-xs sm:text-[13px]">
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
