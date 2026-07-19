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

// CountUp Component for viewport anim
function CountUp({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const [ref, setRef] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (!ref) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let start = 0;
          const end = value;
          const duration = 1800;
          const startTime = performance.now();

          const animate = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const ease = progress * (2 - progress); // easeOutQuad
            setCount(Math.floor(ease * end));

            if (progress < 1) {
              requestAnimationFrame(animate);
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
      color: "from-[#8B7BF7]/20 to-transparent",
      borderColor: "hover:border-[#8B7BF7]/40",
      iconColor: "text-[#8B7BF7]",
      bgIcon: "bg-[#8B7BF7]/10",
      span: "col-span-1 md:col-span-2 lg:col-span-2 lg:row-span-2"
    },
    {
      title: "Advanced Sterilization Protocols",
      desc: "Hospital-grade autoclave systems and strict multi-tier sterilization protocols ensuring a sterile, safe, and hygienic surgical environment for every treatment.",
      icon: ShieldCheck,
      color: "from-emerald-500/10 to-transparent",
      borderColor: "hover:border-emerald-500/35",
      iconColor: "text-emerald-400",
      bgIcon: "bg-emerald-500/10",
      span: "col-span-1"
    },
    {
      title: "Modern Dental Technology",
      desc: "Utilizing advanced intraoral cameras, digital radiography, and modern endodontic motors to provide highly accurate, evidence-based diagnostics.",
      icon: Cpu,
      color: "from-blue-500/10 to-transparent",
      borderColor: "hover:border-blue-500/35",
      iconColor: "text-blue-400",
      bgIcon: "bg-blue-500/10",
      span: "col-span-1"
    },
    {
      title: "Gentle Patient Care & Comfort",
      desc: "A warm, empathetic approach tailored for anxious patients. Offering sedation options and pain-relief techniques in a reassuring clinical setup.",
      icon: Heart,
      color: "from-rose-500/10 to-transparent",
      borderColor: "hover:border-rose-500/35",
      iconColor: "text-rose-400",
      bgIcon: "bg-rose-500/10",
      span: "col-span-1"
    },
    {
      title: "Precision Diagnostics",
      desc: "Rigorous diagnostic processes using electronic pulp testing and digital imaging to identify root causes and avoid unnecessary overtreatment.",
      icon: Search,
      color: "from-indigo-500/10 to-transparent",
      borderColor: "hover:border-indigo-500/35",
      iconColor: "text-indigo-400",
      bgIcon: "bg-indigo-500/10",
      span: "col-span-1"
    },
    {
      title: "Personalized Treatment Plans",
      desc: "Customized dental mapping outlining clear treatment phases, timeline, and prognosis based on your physical health and unique cosmetic needs.",
      icon: Layers,
      color: "from-purple-500/10 to-transparent",
      borderColor: "hover:border-purple-500/35",
      iconColor: "text-purple-400",
      bgIcon: "bg-purple-500/10",
      span: "col-span-1"
    },
    {
      title: "Transparent Consultation",
      desc: "Honest clinical advice with detailed breakdown of treatment alternatives, pricing structure, and insurance coverage beforehand.",
      icon: Eye,
      color: "from-amber-500/10 to-transparent",
      borderColor: "hover:border-amber-500/35",
      iconColor: "text-amber-400",
      bgIcon: "bg-amber-500/10",
      span: "col-span-1"
    },
    {
      title: "Patient Education & Preventive Focus",
      desc: "Equipping patients with clinical scans walkthroughs, preventive strategies, and home-care kits to secure lifetime dental health and prevent secondary decay.",
      icon: BookOpen,
      color: "from-violet-500/10 to-transparent",
      borderColor: "hover:border-violet-500/35",
      iconColor: "text-violet-400",
      bgIcon: "bg-violet-500/10",
      span: "col-span-1 md:col-span-2"
    }
  ];

  return (
    <section className="py-20 sm:py-24 relative overflow-hidden font-sans" id="why-choose-us">
      {/* Restrained Cinematic Background Effects */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 -right-32 w-80 h-80 bg-[#8B7BF7]/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 -left-32 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-1 mb-4 text-[#8B7BF7] text-xs font-semibold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Why Dr. Nilay Saha</span>
          </div>
          <h2 className="text-[36px] sm:text-[48px] lg:text-[56px] font-display font-bold text-[#F5F5F7] tracking-tight leading-[1.12]">
            Why Patients Choose <span className="text-[#8B7BF7]">Dr. Nilay Saha</span>
          </h2>
          <p className="mt-4 text-[#A1A1A6] text-base sm:text-lg max-w-2xl mx-auto font-normal leading-[1.6]">
            A dedication to advanced clinical technology, patient safety, and pain-free endodontic therapy across our regional clinics.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bentoCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={idx}
                tabIndex={0}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, ease: "easeOut", delay: Math.min(0.3, idx * 0.05) }}
                className={`group relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-b ${card.color} to-[#08080C]/40 backdrop-blur-xl p-6 sm:p-8 flex flex-col justify-between shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B7BF7] transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${card.borderColor} ${card.span}`}
              >
                {/* Micro reflection sweep */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.01] via-white/[0.05] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />

                <div>
                  {/* Icon Block */}
                  <div className={`w-12 h-12 rounded-2xl ${card.bgIcon} flex items-center justify-center shrink-0 mb-6 group-hover:scale-105 transition-transform duration-300 shadow-md`}>
                    <Icon className={`w-6 h-6 ${card.iconColor}`} />
                  </div>

                  {/* Header Title */}
                  <h3 className="text-lg sm:text-xl font-display font-semibold text-[#F5F5F7] group-hover:text-white transition-colors">
                    {card.title}
                  </h3>

                  {/* Supporting Copy */}
                  <p className="mt-3 text-sm text-[#A1A1A6] leading-[1.6] font-normal group-hover:text-gray-300 transition-colors">
                    {card.desc}
                  </p>
                </div>

                {/* Subtly animated explore indicator for bento rhythm */}
                <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-[#8B7BF7] opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0 cursor-default">
                  <span>Learn more</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Trust Statistics Strip */}
        <div className="mt-20 pt-12 border-t border-white/10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((item, idx) => (
              <div 
                key={idx} 
                className="glass-1 p-5 rounded-2xl flex items-center gap-4 hover:border-[#8B7BF7]/20 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#8B7BF7]/10 flex items-center justify-center shrink-0 border border-white/5 shadow-md">
                  <item.icon className="w-6 h-6 text-[#8B7BF7]" />
                </div>
                <div>
                  <span className="text-[10px] sm:text-xs font-semibold text-[#A1A1A6] uppercase tracking-wider block">
                    {item.label}
                  </span>
                  <span className="text-xl sm:text-2xl font-display font-extrabold text-[#F5F5F7] mt-0.5 block">
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
