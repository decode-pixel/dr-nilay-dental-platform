import React, { useState, useRef, useEffect } from "react";
import { 
  Award, 
  ShieldCheck, 
  Cpu, 
  Heart, 
  Search, 
  Layers, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight,
  Info,
  X
} from "lucide-react";
import TagPill from "./TagPill";

interface TrustItem {
  id: number;
  title: string;
  shortDesc: string;
  fullDesc: string;
  icon: React.ElementType;
  badge: string;
  highlights: string[];
}

const TRUST_ITEMS: TrustItem[] = [
  {
    id: 1,
    title: "Root Canal & Endodontic Specialist",
    shortDesc: "Fellowship-trained endodontic precision focused on preserving natural teeth with single-visit procedures.",
    fullDesc: "Dr. Nilay Saha specializes in single-visit root canal treatments utilizing rotary endodontic systems, apex locators, and microscopic instrumentation. This conservative approach preserves your natural tooth structure while ensuring zero pain during treatment.",
    icon: Award,
    badge: "Primary Specialty",
    highlights: ["Rotary Endodontics", "Apex Locator Precision", "Natural Tooth Preservation"]
  },
  {
    id: 2,
    title: "Hospital-Grade Autoclave Sterilization",
    shortDesc: "Strict multi-tier WHO compliant sterilization and Class-B autoclaving for a sterile surgical environment.",
    fullDesc: "Your safety is non-negotiable. Every surgical and dental instrument undergoes a 4-step decontamination process ending in high-pressure Class-B vacuum steam autoclaving. Pouches are opened directly in front of the patient.",
    icon: ShieldCheck,
    badge: "Safety Guarantee",
    highlights: ["WHO Aseptic Standard", "Class-B Steam Autoclave", "Sealed Pouch System"]
  },
  {
    id: 3,
    title: "Digital RVG & Intraoral Mapping",
    shortDesc: "High-definition intraoral sensors and low-radiation digital radiography for instant diagnostic clarity.",
    fullDesc: "Digital Radiovisiography (RVG) provides immediate, ultra-low radiation X-ray images directly on chairside screens. Patients can see clear enlarged diagnostics and understand their diagnosis before treatment starts.",
    icon: Cpu,
    badge: "Modern Tech",
    highlights: ["90% Reduced Radiation", "Instant Chairside Imaging", "High-Definition RVG"]
  },
  {
    id: 4,
    title: "Gentle, Empathetic Patient Care",
    shortDesc: "A calm, reassuring clinical setup tailored for anxious patients with gentle local anesthesia.",
    fullDesc: "Dental anxiety is real, and we handle every patient with supreme empathy. From computer-assisted local anesthesia delivery to warm clinical communication, we ensure your comfort at every step.",
    icon: Heart,
    badge: "Patient First",
    highlights: ["Anxiety-Free Dentistry", "Painless Local Anesthesia", "Patient-Centric Care"]
  },
  {
    id: 5,
    title: "Evidence-Based Diagnostics",
    shortDesc: "Rigorous clinical testing and digital pulp evaluations to identify root causes early and avoid overtreatment.",
    fullDesc: "We rely strictly on empirical evidence, thermal testing, and digital pulp vitality metrics to diagnose conditions accurately. No unnecessary procedures—only what is genuinely needed for your oral health.",
    icon: Search,
    badge: "Accurate Diagnosis",
    highlights: ["Pulp Vitality Testing", "Zero Overtreatment", "Evidence-Based Plans"]
  },
  {
    id: 6,
    title: "Transparent & Customized Plans",
    shortDesc: "Clear treatment mapping with honest clinical advice, detailed cost breakdowns, and structured phases.",
    fullDesc: "Before starting any dental work, you receive an itemized treatment schedule with exact timeframes and transparent pricing. You remain in full control of your clinical decisions.",
    icon: Layers,
    badge: "100% Transparency",
    highlights: ["Itemized Cost Breakdowns", "Clear Treatment Timeline", "No Hidden Charges"]
  }
];

export default function WhyChooseUsBento() {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [detailModalItem, setDetailModalItem] = useState<TrustItem | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeftPos = useRef(0);

  const scrollToCard = (index: number) => {
    setActiveIndex(index);
    if (sliderRef.current) {
      const container = sliderRef.current;
      const cardWidth = container.clientWidth / (window.innerWidth >= 1024 ? 3 : window.innerWidth >= 640 ? 2 : 1);
      container.scrollTo({
        left: index * cardWidth,
        behavior: "smooth"
      });
    }
  };

  const handlePrev = () => {
    const newIdx = activeIndex > 0 ? activeIndex - 1 : TRUST_ITEMS.length - 1;
    scrollToCard(newIdx);
  };

  const handleNext = () => {
    const newIdx = activeIndex < TRUST_ITEMS.length - 1 ? activeIndex + 1 : 0;
    scrollToCard(newIdx);
  };

  // Mouse Drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    startX.current = e.pageX - (sliderRef.current?.offsetLeft || 0);
    scrollLeftPos.current = sliderRef.current?.scrollLeft || 0;
  };

  const handleMouseLeave = () => {
    isDragging.current = false;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !sliderRef.current) return;
    e.preventDefault();
    const x = e.pageX - (sliderRef.current.offsetLeft || 0);
    const walk = (x - startX.current) * 1.5;
    sliderRef.current.scrollLeft = scrollLeftPos.current - walk;
  };

  // Update active index on scroll
  const handleScroll = () => {
    if (!sliderRef.current) return;
    const container = sliderRef.current;
    const cardWidth = container.clientWidth / (window.innerWidth >= 1024 ? 3 : window.innerWidth >= 640 ? 2 : 1);
    const newIndex = Math.round(container.scrollLeft / cardWidth);
    if (newIndex >= 0 && newIndex < TRUST_ITEMS.length && newIndex !== activeIndex) {
      setActiveIndex(newIndex);
    }
  };

  useEffect(() => {
    const el = sliderRef.current;
    if (el) {
      el.addEventListener("scroll", handleScroll, { passive: true });
      return () => el.removeEventListener("scroll", handleScroll);
    }
  }, [activeIndex]);

  return (
    <section id="why-choose-us" className="py-16 sm:py-20 bg-[#F5F9F8] font-sans border-b border-teal-100/50 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header + Controls Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <TagPill icon={Sparkles} text="Why Dr. Nilay Saha" />
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-[#0F172A] tracking-tight mt-3 leading-tight">
              Why Patients Trust <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00A896] via-[#028090] to-[#059669]">
                Our Advanced Dental Studio
              </span>
            </h2>
          </div>

          {/* Desktop/Tablet Carousel Controls */}
          <div className="flex items-center gap-4 shrink-0 self-start md:self-end">
            {/* Pagination Dots */}
            <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur-xl px-4 py-2.5 rounded-full border border-white/90 shadow-xs">
              {TRUST_ITEMS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => scrollToCard(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    activeIndex === idx
                      ? "w-6 bg-[#00A896]"
                      : "w-2 bg-slate-300 hover:bg-slate-400"
                  }`}
                />
              ))}
            </div>

            {/* Prev / Next Arrow Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous slide"
                className="w-11 h-11 rounded-full bg-white/90 backdrop-blur-xl border border-white/90 text-slate-800 hover:text-[#00A896] hover:bg-teal-50 flex items-center justify-center shadow-xs active:scale-95 transition-all cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next slide"
                className="w-11 h-11 rounded-full bg-white/90 backdrop-blur-xl border border-white/90 text-slate-800 hover:text-[#00A896] hover:bg-teal-50 flex items-center justify-center shadow-xs active:scale-95 transition-all cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Interactive Horizontal Carousel */}
        <div
          ref={sliderRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          className="flex gap-5 sm:gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-none py-4 px-1 cursor-grab active:cursor-grabbing scroll-smooth select-none"
          style={{ scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch" }}
        >
          {TRUST_ITEMS.map((item, idx) => {
            const Icon = item.icon;
            const isCenter = activeIndex === idx;

            return (
              <div
                key={item.id}
                className={`snap-start shrink-0 w-[85vw] sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] flex flex-col justify-between p-7 rounded-[32px] transition-all duration-300 backdrop-blur-2xl border border-white/90 shadow-[0_10px_35px_rgba(15,23,42,0.04)] hover:shadow-[0_20px_50px_rgba(0,168,150,0.12)] ${
                  isCenter
                    ? "bg-white/95 ring-2 ring-[#00A896]/40 -translate-y-1 shadow-[0_15px_40px_rgba(0,168,150,0.1)]"
                    : "bg-white/80 hover:bg-white/90"
                }`}
              >
                <div>
                  {/* Top Badge & Number */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-[#00A896] shadow-xs shrink-0">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-mono font-extrabold text-slate-400">
                      0{item.id} / 06
                    </span>
                  </div>

                  <span className="inline-block px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-teal-50/80 text-[#00A896] mb-3 border border-teal-100/70">
                    {item.badge}
                  </span>

                  <h3 className="font-display font-extrabold text-slate-900 text-xl mb-3 leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal line-clamp-3 mb-6">
                    {item.shortDesc}
                  </p>
                </div>

                {/* Bottom Trigger Action */}
                <div className="pt-5 border-t border-slate-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDetailModalItem(item);
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#00A896] hover:text-[#028090] cursor-pointer group"
                  >
                    <span>Learn More</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.dispatchEvent(new CustomEvent("openContactModal"));
                    }}
                    className="text-[11px] font-bold text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    Consult &rarr;
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Expandable Details Modal */}
      {detailModalItem && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-lg p-7 sm:p-8 bg-white/95 backdrop-blur-2xl rounded-[32px] border border-white shadow-[0_25px_60px_rgba(0,0,0,0.18)]">
            <button
              type="button"
              onClick={() => setDetailModalItem(null)}
              aria-label="Close modal"
              className="absolute top-6 right-6 w-11 h-11 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center justify-center cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-[#00A896]">
                {React.createElement(detailModalItem.icon, { className: "w-6 h-6" })}
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#00A896] uppercase tracking-wider block">{detailModalItem.badge}</span>
                <h3 className="font-display font-extrabold text-xl text-slate-900 leading-snug">{detailModalItem.title}</h3>
              </div>
            </div>

            <p className="text-sm text-slate-700 leading-relaxed mb-6 font-normal">
              {detailModalItem.fullDesc}
            </p>

            <div className="space-y-2 mb-7">
              <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider block">Key Highlights</span>
              {detailModalItem.highlights.map((h, i) => (
                <div key={i} className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <div className="w-2 h-2 rounded-full bg-[#00A896]" />
                  <span>{h}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setDetailModalItem(null);
                  window.dispatchEvent(new CustomEvent("openContactModal"));
                }}
                className="w-full py-3.5 rounded-full btn-crystal text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <span>Schedule Consultation</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
