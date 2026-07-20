import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  Award, 
  ShieldCheck, 
  Cpu, 
  Heart, 
  Eye, 
  BookOpen, 
  Smile, 
  Layers,
  Sparkles,
  Search,
  ChevronRight
} from "lucide-react";
import TagPill from "./TagPill";

// CountUp Component for viewport anim without glitching mid-load
function CountUp({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(value);
  const [ref, setRef] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (!ref) return;
    if (typeof window !== "undefined" && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCount(value);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const end = value;
          const start = Math.floor(value * 0.75); // Start close to target for smooth 500ms transition
          const duration = 500;
          const startTime = performance.now();

          const animate = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(start + (end - start) * ease));

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setCount(end);
            }
          };

          requestAnimationFrame(animate);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(ref);
    return () => observer.disconnect();
  }, [ref, value]);

  return <span ref={setRef}>{count.toLocaleString()}{suffix}</span>;
}

export default function WhyChooseUsBento() {
  const stats = [
    { label: "Happy Patients", val: 5000, suffix: "+", icon: Smile },
    { label: "Years Experience", val: 10, suffix: "+", icon: Award },
    { label: "Digital Technologies", val: 12, suffix: "+", icon: Cpu },
    { label: "Success Rate", val: 99.4, suffix: "%", icon: ShieldCheck }
  ];

  const bentoCards = [
    {
      title: "Root Canal & Endodontic Specialist",
      desc: "Fellowship-trained endodontic precision focused on preserving natural teeth. Specializing in single-visit root canal treatments that are highly precise, pain-free, and designed for long-term clinical durability.",
      icon: Award,
      color: "from-blue-500/[0.08] via-white/95 to-white/90",
      borderColor: "hover:border-blue-400/60",
      iconColor: "text-[#2563EB]",
      bgIcon: "bg-blue-50/90 border border-blue-200/80",
      span: "col-span-1 md:col-span-2 lg:col-span-2 lg:row-span-2"
    },
    {
      title: "Advanced Sterilization Protocols",
      desc: "Hospital-grade autoclave systems and strict multi-tier sterilization protocols ensuring a sterile, safe, and hygienic surgical environment for every patient.",
      icon: ShieldCheck,
      color: "from-emerald-500/[0.08] via-white/95 to-white/90",
      borderColor: "hover:border-emerald-400/60",
      iconColor: "text-emerald-600",
      bgIcon: "bg-emerald-50/90 border border-emerald-200/80",
      span: "col-span-1"
    },
    {
      title: "Modern Dental Technology",
      desc: "Utilizing high-definition intraoral cameras, digital radiography, and modern endodontic motors to provide highly accurate, evidence-based diagnostics.",
      icon: Cpu,
      color: "from-sky-500/[0.08] via-white/95 to-white/90",
      borderColor: "hover:border-sky-400/60",
      iconColor: "text-sky-600",
      bgIcon: "bg-sky-50/90 border border-sky-200/80",
      span: "col-span-1"
    },
    {
      title: "Gentle Patient Care & Comfort",
      desc: "A warm, empathetic approach tailored for anxious patients. Offering sedation options and gentle pain-relief techniques in a reassuring setup.",
      icon: Heart,
      color: "from-rose-500/[0.08] via-white/95 to-white/90",
      borderColor: "hover:border-rose-400/60",
      iconColor: "text-rose-600",
      bgIcon: "bg-rose-50/90 border border-rose-200/80",
      span: "col-span-1"
    },
    {
      title: "Precision Diagnostics",
      desc: "Rigorous diagnostic processes using electronic pulp testing and digital imaging to identify root causes early and avoid unnecessary overtreatment.",
      icon: Search,
      color: "from-indigo-500/[0.08] via-white/95 to-white/90",
      borderColor: "hover:border-indigo-400/60",
      iconColor: "text-indigo-600",
      bgIcon: "bg-indigo-50/90 border border-indigo-200/80",
      span: "col-span-1"
    },
    {
      title: "Personalized Treatment Plans",
      desc: "Customized dental mapping outlining clear treatment phases, timeline, and prognosis based on your physical health and unique cosmetic goals.",
      icon: Layers,
      color: "from-purple-500/[0.08] via-white/95 to-white/90",
      borderColor: "hover:border-purple-400/60",
      iconColor: "text-purple-600",
      bgIcon: "bg-purple-50/90 border border-purple-200/80",
      span: "col-span-1"
    },
    {
      title: "Transparent Consultation",
      desc: "Honest clinical advice with detailed breakdown of treatment alternatives, pricing structure, and care phases discussed clearly beforehand.",
      icon: Eye,
      color: "from-amber-500/[0.08] via-white/95 to-white/90",
      borderColor: "hover:border-amber-400/60",
      iconColor: "text-amber-600",
      bgIcon: "bg-amber-50/90 border border-amber-200/80",
      span: "col-span-1"
    },
    {
      title: "Patient Education & Preventive Focus",
      desc: "Equipping patients with clinical scans walkthroughs, preventive hygiene strategies, and home-care guidance to secure lifetime dental health and prevent decay.",
      icon: BookOpen,
      color: "from-violet-500/[0.08] via-white/95 to-white/90",
      borderColor: "hover:border-violet-400/60",
      iconColor: "text-violet-600",
      bgIcon: "bg-violet-50/90 border border-violet-200/80",
      span: "col-span-1 md:col-span-2"
    }
  ];

  return (
    <section className="py-24 sm:py-32 relative overflow-hidden font-sans" id="why-choose-us">
      {/* Soft Cinematic Background Ambient */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 -right-32 w-96 h-96 bg-blue-500/[0.03] rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 -left-32 w-96 h-96 bg-sky-500/[0.03] rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-24">
          <TagPill icon={Sparkles} text="Why Dr. Nilay Saha" />
          <h2 className="text-[36px] sm:text-[48px] lg:text-[56px] font-display font-bold text-[#0F172A] tracking-tight leading-[1.12]">
            Why Patients Choose <span className="text-[#2563EB]">Dr. Nilay Saha</span>
          </h2>
          <p className="mt-4 text-[#475569] text-base sm:text-lg max-w-2xl mx-auto font-normal leading-[1.65]">
            A dedication to advanced clinical technology, rigorous sterilization protocols, and gentle endodontic therapy across our clinics.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {bentoCards.map((card, idx) => {
            const Icon = card.icon;
            
            // Visual shadow variations for asymmetric depth
            let shadowClass = "shadow-[0_12px_40px_rgba(15,23,42,0.06)]";
            let hoverShadowClass = "hover:shadow-[0_20px_50px_rgba(37,99,235,0.12)]";
            if (idx === 0) {
              shadowClass = "shadow-[0_16px_48px_rgba(37,99,235,0.08)]";
              hoverShadowClass = "hover:shadow-[0_24px_64px_rgba(37,99,235,0.18)]";
            } else if (idx === 2 || idx === 5) {
              shadowClass = "shadow-[0_18px_44px_rgba(15,23,42,0.09)]";
              hoverShadowClass = "hover:shadow-[0_24px_56px_rgba(15,23,42,0.14)]";
            }

            return (
              <motion.div
                key={idx}
                tabIndex={0}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, ease: "easeOut", delay: Math.min(0.3, idx * 0.04) }}
                className={`group relative overflow-hidden rounded-[2rem] border border-white/80 bg-gradient-to-b ${card.color} backdrop-blur-xl p-8 sm:p-10 flex flex-col justify-between ${shadowClass} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] transition-all duration-300 hover:-translate-y-1.5 ${hoverShadowClass} ${card.borderColor} ${card.span}`}
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                {idx === 7 ? (
                  // Wide Card (Card 8) Layout: Horizontal flex layout on desktop/tablet to break vertical repetition
                  <div className="flex flex-col md:flex-row md:items-start gap-6">
                    <div className={`w-14 h-14 rounded-2xl ${card.bgIcon} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300 shadow-sm`}>
                      <Icon className={`w-6 h-6 ${card.iconColor}`} strokeWidth={2.2} />
                    </div>
                    <div>
                      <h3 className="text-xl sm:text-2xl font-display font-bold text-[#0F172A] group-hover:text-[#2563EB] transition-colors leading-tight">
                        {card.title}
                      </h3>
                      <p className="mt-3.5 text-sm sm:text-base text-[#475569] leading-[1.65] font-normal group-hover:text-[#334155] transition-colors">
                        {card.desc}
                      </p>
                    </div>
                  </div>
                ) : (
                  // Standard / Centerpiece layouts
                  <div>
                    <div className={`w-14 h-14 rounded-2xl ${card.bgIcon} flex items-center justify-center shrink-0 mb-6 group-hover:scale-105 transition-transform duration-300 shadow-sm`}>
                      <Icon className={`w-6 h-6 ${card.iconColor}`} strokeWidth={2.2} />
                    </div>

                    {idx === 0 && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[10px] uppercase font-bold tracking-widest text-[#2563EB] mb-4.5 cursor-default">
                        <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
                        Clinical Specialty
                      </span>
                    )}

                    <h3 className={`${idx === 0 ? "text-2xl sm:text-3xl lg:text-[28px] leading-tight" : "text-xl sm:text-2xl leading-tight"} font-display font-bold text-[#0F172A] group-hover:text-[#2563EB] transition-colors`}>
                      {card.title}
                    </h3>

                    <p className="mt-3.5 text-sm sm:text-base text-[#475569] leading-[1.65] font-normal group-hover:text-[#334155] transition-colors">
                      {card.desc}
                    </p>
                  </div>
                )}

                {/* Explore indicator */}
                <div className="mt-8 flex items-center gap-1.5 text-xs font-bold text-[#2563EB] opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0 cursor-default">
                  <span>Learn more</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Trust Statistics Strip */}
        <div className="mt-24 pt-14 border-t border-slate-200/70">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {stats.map((item, idx) => (
              <div 
                key={idx} 
                className="glass-2 p-6 rounded-[2rem] flex items-center gap-4 border border-white/80 shadow-sm hover:shadow-md hover:border-blue-300/60 transition-all duration-300 group"
              >
                <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                  <item.icon className="w-6 h-6 text-[#2563EB]" strokeWidth={2.2} />
                </div>
                <div>
                  <span className="text-[11px] sm:text-xs font-bold text-[#64748B] uppercase tracking-wider block">
                    {item.label}
                  </span>
                  <span className="text-2xl sm:text-3xl font-display font-extrabold text-[#0F172A] mt-1 block">
                    <CountUp value={item.val} suffix={item.suffix} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
