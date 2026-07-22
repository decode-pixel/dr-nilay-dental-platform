import React from "react";
import { Award, ShieldCheck, Cpu, Heart, Search, Layers, Sparkles, ChevronRight } from "lucide-react";
import TagPill from "./TagPill";

export default function WhyChooseUsBento() {
  const advantages = [
    {
      title: "Root Canal & Endodontic Specialist",
      desc: "Fellowship-trained endodontic precision focused on preserving natural teeth. Specializing in single-visit root canal treatments that are precise, pain-free, and built for permanent clinical durability.",
      icon: Award,
      span: "col-span-1 md:col-span-2 lg:col-span-2 lg:row-span-2 bg-gradient-to-br from-sky-50/70 via-white to-white border-sky-300/60",
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
      span: "col-span-1 md:col-span-2 lg:col-span-2 bg-gradient-to-tr from-white via-white to-sky-50/40"
    }
  ];

  const [expandedIndex, setExpandedIndex] = React.useState<number | null>(0);

  const toggleExpand = (idx: number) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  return (
    <section id="why-choose-us" className="py-14 sm:py-20 bg-[#F8FAFC] font-sans border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <TagPill icon={Sparkles} text="Why Dr. Nilay Saha" />
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-[#0F172A] tracking-tight mt-3 mb-4 leading-tight">
            Why Patients Trust <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0284C7] to-[#0EA5E9]">
              Our Advanced Dental Studio
            </span>
          </h2>
          <p className="text-base sm:text-lg text-[#475569] leading-relaxed max-w-2xl mx-auto font-normal">
            Combining surgical excellence with empathetic patient care, modern dental technology, and unwavering sterilization standards.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {advantages.map((item, idx) => {
            const Icon = item.icon;
            const isExpanded = expandedIndex === idx;

            return (
              <div
                key={idx}
                className={`p-6 sm:p-7 flex flex-col justify-between group rounded-[20px] transition-all duration-300 border border-slate-200/80 hover:border-sky-300 hover:shadow-[0_15px_35px_rgba(2,132,199,0.09)] ${item.span} ${
                  isExpanded ? "ring-2 ring-sky-400/30 shadow-lg" : ""
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-11 h-11 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center text-[#0284C7] group-hover:bg-[#0284C7] group-hover:text-white group-hover:scale-105 transition-all duration-300 shrink-0 shadow-2xs">
                      <Icon className="w-5 h-5" />
                    </div>
                    {item.featured && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 border border-sky-200 text-[10px] uppercase font-bold tracking-widest text-[#0284C7]">
                        <Sparkles className="w-3 h-3" />
                        Specialty
                      </span>
                    )}
                  </div>

                  <h3 className={`font-display font-bold text-[#0F172A] group-hover:text-[#0284C7] transition-colors mb-2.5 leading-snug ${
                    item.featured ? "text-xl sm:text-2xl" : "text-lg sm:text-xl"
                  }`}>
                    {item.title}
                  </h3>

                  <p className={`text-sm text-[#475569] leading-relaxed transition-all duration-300 ${
                    isExpanded ? "" : "line-clamp-2"
                  }`}>
                    {item.desc}
                  </p>

                  <button
                    type="button"
                    onClick={() => toggleExpand(idx)}
                    className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[#0284C7] hover:text-[#0369A1] focus:outline-none cursor-pointer"
                  >
                    {isExpanded ? "Show Less" : "Read More ↓"}
                  </button>
                </div>

                <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => window.dispatchEvent(new CustomEvent("openContactModal"))}
                    className="flex items-center gap-1.5 text-xs font-bold text-[#0284C7] hover:text-[#0369A1] transition-all duration-300 cursor-pointer focus-visible:outline-none"
                  >
                    <span>Learn more</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">
                    0{idx + 1}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
