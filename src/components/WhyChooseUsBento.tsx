import React from "react";
import { Award, ShieldCheck, Cpu, Heart, Search, Layers, Sparkles, ChevronRight } from "lucide-react";
import TagPill from "./TagPill";

/**
 * WhyChooseUsBento — 6 Curated Clinical Advantages
 * Apple / Linear aesthetic, 24px radius cards, #FFFFFF background
 */

export default function WhyChooseUsBento() {
  const advantages = [
    {
      title: "Root Canal & Endodontic Specialist",
      desc: "Fellowship-trained endodontic precision focused on preserving natural teeth. Specializing in single-visit root canal treatments that are precise, pain-free, and built for permanent clinical durability.",
      icon: Award,
      span: "col-span-1 md:col-span-2 lg:col-span-2 lg:row-span-2 bg-gradient-to-br from-emerald-50/70 via-white to-white border-emerald-300/60",
      featured: true
    },
    {
      title: "Hospital-Grade Autoclave Sterilization",
      desc: "Strict multi-tier WHO compliant sterilization and Class-B autoclave protocols ensuring a pristine, sterile surgical environment for every patient.",
      icon: ShieldCheck,
      span: "col-span-1 bg-white"
    },
    {
      title: "Digital RVG & Intraoral Mapping",
      desc: "High-definition intraoral sensors and low-radiation digital radiography for instant, crystal-clear diagnostic accuracy.",
      icon: Cpu,
      span: "col-span-1 bg-white"
    },
    {
      title: "Gentle, Empathetic Patient Care",
      desc: "A calm, reassuring clinical setup tailored for anxious patients. Offering gentle local anesthesia and pain-relief techniques that put you at ease.",
      icon: Heart,
      span: "col-span-1 bg-white"
    },
    {
      title: "Evidence-Based Diagnostics",
      desc: "Rigorous clinical testing and digital pulp evaluations to identify root causes early and avoid unnecessary overtreatment.",
      icon: Search,
      span: "col-span-1 bg-white"
    },
    {
      title: "Transparent & Customized Plans",
      desc: "Clear treatment mapping with honest clinical advice, detailed cost breakdowns, and structured care phases discussed before any procedure begins.",
      icon: Layers,
      span: "col-span-1 md:col-span-2 lg:col-span-2 bg-gradient-to-tr from-white via-white to-emerald-50/40"
    }
  ];

  return (
    <section id="why-choose-us" className="py-20 sm:py-28 bg-white font-sans border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-18">
          <TagPill icon={Sparkles} text="Why Dr. Nilay Saha" />
          <h2 className="h2-premium mt-3 mb-4">
            Why Patients Trust <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10B981] to-[#059669]">
              Our Advanced Studio
            </span>
          </h2>
          <p className="body-premium max-w-2xl mx-auto">
            Combining surgical excellence with empathetic patient care, modern dental technology, and unwavering sterilization standards.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {advantages.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className={`card-premium p-7 sm:p-9 flex flex-col justify-between group hover:-translate-y-1 transition-all duration-300 ${item.span}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-13 h-13 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-[#10B981] group-hover:bg-[#10B981] group-hover:text-white transition-colors duration-300 shrink-0 shadow-sm">
                      <Icon className="w-6 h-6" />
                    </div>
                    {item.featured && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 border border-emerald-300/80 text-[11px] uppercase font-bold tracking-widest text-[#10B981]">
                        <Sparkles className="w-3.5 h-3.5" />
                        Clinical Distinction
                      </span>
                    )}
                  </div>

                  <h3 className={`font-display font-bold text-[#122820] group-hover:text-[#10B981] transition-colors mb-3 leading-snug ${
                    item.featured ? "text-2xl sm:text-3xl" : "text-xl sm:text-[22px]"
                  }`}>
                    {item.title}
                  </h3>

                  <p className="small-premium text-xs sm:text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => window.dispatchEvent(new CustomEvent("openContactModal"))}
                  className="mt-8 flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#10B981] group-hover:text-[#059669] transition-all duration-300 cursor-pointer w-fit focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10B981] rounded"
                >
                  <span>Inquire about this standard</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
