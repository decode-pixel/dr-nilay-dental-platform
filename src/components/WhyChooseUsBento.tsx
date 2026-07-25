import React from "react";
import { Award, ShieldCheck, Cpu, Heart, Search, Layers, Sparkles, ChevronRight } from "lucide-react";
import TagPill from "./TagPill";

export default function WhyChooseUsBento() {
  const advantages = [
    {
      title: "Root Canal & Endodontic Specialist",
      desc: "Fellowship-trained endodontic precision focused on preserving natural teeth. Specializing in single-visit root canal treatments that are precise, pain-free, and built for permanent clinical durability.",
      icon: Award,
      span: "col-span-1 md:col-span-2 lg:col-span-2 lg:row-span-2 bg-gradient-to-br from-teal-50/70 via-white/80 to-white/90 border-teal-200/80",
      featured: true
    },
    {
      title: "Hospital-Grade Autoclave Sterilization",
      desc: "Strict multi-tier WHO compliant sterilization and Class-B autoclave protocols ensuring a pristine, sterile surgical environment for every patient.",
      icon: ShieldCheck,
      span: "col-span-1 bg-white/80"
    },
    {
      title: "Digital RVG & Intraoral Mapping",
      desc: "High-definition intraoral sensors and low-radiation digital radiography for instant, crystal-clear diagnostic accuracy.",
      icon: Cpu,
      span: "col-span-1 bg-white/80"
    },
    {
      title: "Gentle, Empathetic Patient Care",
      desc: "A calm, reassuring clinical setup tailored for anxious patients. Offering gentle local anesthesia and pain-relief techniques that put you at ease.",
      icon: Heart,
      span: "col-span-1 bg-white/80"
    },
    {
      title: "Evidence-Based Diagnostics",
      desc: "Rigorous clinical testing and digital pulp evaluations to identify root causes early and avoid unnecessary overtreatment.",
      icon: Search,
      span: "col-span-1 bg-white/80"
    },
    {
      title: "Transparent & Customized Plans",
      desc: "Clear treatment mapping with honest clinical advice, detailed cost breakdowns, and structured care phases discussed before any procedure begins.",
      icon: Layers,
      span: "col-span-1 md:col-span-2 lg:col-span-2 bg-gradient-to-tr from-white/80 via-white/90 to-teal-50/40"
    }
  ];

  const [expandedIndex, setExpandedIndex] = React.useState<number | null>(0);

  const toggleExpand = (idx: number) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  return (
    <section id="why-choose-us" className="py-16 sm:py-24 bg-[#F5F9F8] font-sans border-b border-teal-100/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <TagPill icon={Sparkles} text="Why Dr. Nilay Saha" />
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-[#0F172A] tracking-tight mt-3 mb-4 leading-tight">
            Why Patients Trust <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00A896] via-[#028090] to-[#059669]">
              Our Advanced Dental Studio
            </span>
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto font-normal">
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
                className={`p-6 sm:p-7 flex flex-col justify-between group rounded-[28px] transition-all duration-300 backdrop-blur-2xl border border-white/90 hover:border-teal-300 shadow-[0_10px_35px_rgba(15,23,42,0.04)] hover:shadow-[0_20px_45px_rgba(0,168,150,0.1)] ${item.span} ${
                  isExpanded ? "ring-2 ring-[#00A896]/30 shadow-lg" : ""
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-11 h-11 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-[#00A896] group-hover:bg-[#00A896] group-hover:text-white group-hover:scale-105 transition-all duration-300 shrink-0 shadow-xs">
                      <Icon className="w-5 h-5" />
                    </div>
                    {item.featured && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-[10px] uppercase font-bold tracking-widest text-[#00A896]">
                        <Sparkles className="w-3 h-3" />
                        Specialty
                      </span>
                    )}
                  </div>

                  <h3 className={`font-display font-extrabold text-[#0F172A] group-hover:text-[#00A896] transition-colors mb-2.5 leading-snug ${
                    item.featured ? "text-xl sm:text-2xl" : "text-lg sm:text-xl"
                  }`}>
                    {item.title}
                  </h3>

                  <p className={`text-sm text-slate-600 leading-relaxed font-normal transition-all duration-300 ${
                    isExpanded ? "" : "line-clamp-2"
                  }`}>
                    {item.desc}
                  </p>

                  <button
                    type="button"
                    onClick={() => toggleExpand(idx)}
                    className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[#00A896] hover:text-[#028090] focus:outline-none cursor-pointer"
                  >
                    {isExpanded ? "Show Less" : "Read More ↓"}
                  </button>
                </div>

                <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => window.dispatchEvent(new CustomEvent("openContactModal"))}
                    className="flex items-center gap-1.5 text-xs font-bold text-[#00A896] hover:text-[#028090] transition-all duration-300 cursor-pointer focus-visible:outline-none"
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
