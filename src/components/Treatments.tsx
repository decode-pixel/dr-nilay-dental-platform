import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Check, ChevronLeft, ArrowRight, Clock, Banknote, ShieldCheck, CalendarDays } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { ToothIcon } from "./Icons";
import TagPill from "./TagPill";
import { treatmentsData } from "../data/treatments";

const getIcon = (iconName: string) => {
  if (iconName === "ToothIcon") return ToothIcon;
  const IconComponent = (LucideIcons as any)[iconName];
  return IconComponent || LucideIcons.HelpCircle;
};

type Category = "all" | "restorative" | "cosmetic" | "surgical" | "preventive";

const categoryMap: Record<string, Category> = {
  "root-canal": "restorative",
  "re-root-canal": "restorative",
  "fillings": "restorative",
  "crowns": "restorative",
  "bridges": "restorative",
  "dentures": "restorative",
  "smile-design": "cosmetic",
  "whitening": "cosmetic",
  "braces": "cosmetic",
  "implants": "surgical",
  "extraction": "surgical",
  "wisdom-tooth": "surgical",
  "oral-surgery": "surgical",
  "emergency": "surgical",
  "scaling": "preventive",
  "pediatric": "preventive",
  "gum-treatment": "preventive",
  "preventive": "preventive",
  "xray": "preventive",
  "consultation": "preventive",
};

const filterTabs: { label: string; value: Category }[] = [
  { label: "All Treatments", value: "all" },
  { label: "Restorative Care", value: "restorative" },
  { label: "Cosmetic & Smile", value: "cosmetic" },
  { label: "Surgical & Implants", value: "surgical" },
  { label: "Preventive & Checkups", value: "preventive" },
];

const trustFeatures = [
  "Modern Technology",
  "100% Pain-Free Care",
  "Rotary Endodontics",
  "Digital RVG X-Rays",
  "Personalized Plans",
];

const treatmentMetaMap: Record<string, { priceRange: string; duration: string; doctorNote: string }> = {
  "root-canal": { priceRange: "₹2,500 – ₹4,500", duration: "60–90 Mins (1–2 Visits)", doctorNote: "100% Rotary Endodontics & Local Anesthesia for zero discomfort." },
  "re-root-canal": { priceRange: "₹3,500 – ₹6,000", duration: "90 Mins (2 Visits)", doctorNote: "Microscopic disinfection to save previously treated failed teeth." },
  "fillings": { priceRange: "₹800 – ₹2,000", duration: "30–45 Mins (Single Visit)", doctorNote: "Tooth-colored biocompatible composite resin matching exact enamel." },
  "crowns": { priceRange: "₹2,500 – ₹12,000", duration: "2 Visits (Lab Precision)", doctorNote: "Zirconia & E-Max digital CAD/CAM crowns with multi-year warranty." },
  "bridges": { priceRange: "₹6,000 – ₹25,000", duration: "2–3 Visits", doctorNote: "Custom fixed prosthetics to seamlessly bridge missing gaps." },
  "dentures": { priceRange: "₹8,000 – ₹35,000", duration: "3–4 Visits", doctorNote: "High-impact flexible & complete BPS dentures for effortless chewing." },
  "smile-design": { priceRange: "₹15,000 – ₹60,000", duration: "2–3 Visits", doctorNote: "Digital smile preview with porcelain veneers & aesthetic contouring." },
  "whitening": { priceRange: "₹4,000 – ₹10,000", duration: "45 Mins (In-Clinic)", doctorNote: "Advanced laser & LED whitening lifting up to 8 shades in 1 sitting." },
  "braces": { priceRange: "₹25,000 – ₹80,000", duration: "12–18 Months", doctorNote: "Self-ligating metal, ceramic, and invisible aligners tailored for all ages." },
  "implants": { priceRange: "₹20,000 – ₹45,000", duration: "Surgical + Restoration", doctorNote: "Titanium biocompatible implants acting as natural permanent roots." },
  "extraction": { priceRange: "₹500 – ₹2,500", duration: "20–45 Mins", doctorNote: "Atraumatic extraction protocol preserving bone and gum contour." },
  "wisdom-tooth": { priceRange: "₹2,500 – ₹7,000", duration: "45–60 Mins", doctorNote: "Surgical extraction of impacted molars with painless healing protocol." },
  "oral-surgery": { priceRange: "Consultation Based", duration: "Varies by Procedure", doctorNote: "Precision surgical management of cysts, bone grafting, and trauma." },
  "emergency": { priceRange: "₹500 – ₹2,000", duration: "Immediate Attention", doctorNote: "Priority management for acute pain, broken teeth, and infection." },
  "scaling": { priceRange: "₹800 – ₹2,000", duration: "30–45 Mins", doctorNote: "Ultrasonic tartar & plaque removal with gum polishing and protection." },
  "pediatric": { priceRange: "₹500 – ₹3,000", duration: "Child-Friendly Sessions", doctorNote: "Gentle fluoride treatments, pit & fissure sealants, and painless care." },
  "gum-treatment": { priceRange: "₹1,500 – ₹8,000", duration: "1–2 Visits", doctorNote: "Deep curettage, laser flap surgery, and periodontal strengthening." },
  "preventive": { priceRange: "₹500 – ₹1,500", duration: "30 Mins", doctorNote: "Complete oral health screening, cavity prevention, and hygiene coaching." },
  "xray": { priceRange: "₹150 – ₹500", duration: "5 Mins (Instant RVG)", doctorNote: "Low-radiation digital RVG diagnostics with instant chairside imaging." },
  "consultation": { priceRange: "₹300 – ₹500", duration: "20–30 Mins", doctorNote: "1-on-1 evaluation by Dr. Nilay Saha with custom treatment roadmaps." }
};

export default function Treatments() {
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const filteredTreatments = treatmentsData.filter((t) => {
    if (activeCategory === "all") return true;
    return categoryMap[t.id] === activeCategory;
  });

  const scrollSlider = (direction: "left" | "right") => {
    if (sliderRef.current) {
      const scrollAmount = direction === "left" ? -380 : 380;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!sliderRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - sliderRef.current.offsetLeft);
    setScrollLeft(sliderRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !sliderRef.current) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    sliderRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  return (
    <section id="treatments" className="relative py-16 sm:py-24 bg-[#F8FAFC] z-10 font-sans border-b border-slate-200/60 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header & Navigation Controls */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-10 sm:mb-14">
          <div className="text-center lg:text-left max-w-2xl">
            <TagPill icon={ToothIcon} text="Comprehensive Clinical Services" />
            <h2 className="h2-premium mt-3 mb-3">
              Advanced Clinical <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10B981] to-[#059669]">
                Treatments & Procedures
              </span>
            </h2>
            <p className="body-premium">
              Explore our world-class procedures with transparent pricing ranges, estimated clinical durations, and direct doctor guidance. Swipe or drag across cards to browse.
            </p>
          </div>

          {/* Desktop Slider Arrows & Swipe Hint */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => scrollSlider("left")}
              aria-label="Previous treatments"
              className="w-12 h-12 rounded-full bg-white border border-slate-200/80 shadow-sm flex items-center justify-center text-[#122820] hover:bg-emerald-50 hover:border-emerald-500/40 hover:text-[#10B981] active:scale-95 transition-all cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => scrollSlider("right")}
              aria-label="Next treatments"
              className="w-12 h-12 rounded-full bg-[#122820] text-white shadow-sm flex items-center justify-center hover:bg-[#10B981] active:scale-95 transition-all cursor-pointer"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 sm:gap-3 mb-10" role="tablist" aria-label="Treatment categories">
          {filterTabs.map((tab) => {
            const isActive = activeCategory === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => {
                  setActiveCategory(tab.value);
                  if (sliderRef.current) sliderRef.current.scrollTo({ left: 0, behavior: "smooth" });
                }}
                role="tab"
                aria-selected={isActive}
                className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10B981] cursor-pointer ${
                  isActive
                    ? "bg-[#122820] text-white shadow-[0_4px_16px_rgba(18,40,32,0.2)] scale-105"
                    : "bg-white text-[#4B6358] border border-slate-200/80 hover:border-[#10B981]/40 hover:text-[#122820] shadow-sm"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* V2/V3 Horizontal Snap Slider Container with Touch & Drag Support */}
        <div 
          ref={sliderRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
          className={`slider-snap-x no-scrollbar pb-6 -mx-4 px-4 sm:mx-0 sm:px-0 select-none ${
            isDragging ? "cursor-grabbing" : "cursor-grab"
          }`}
        >
          {filteredTreatments.map((treatment) => {
            const Icon = getIcon(treatment.iconName);
            const meta = treatmentMetaMap[treatment.id] || {
              priceRange: "Consultation Based",
              duration: "Personalized Assessment",
              doctorNote: "Expert clinical evaluation and custom treatment planning."
            };

            return (
              <div
                key={treatment.id}
                className="w-[320px] sm:w-[380px] shrink-0 glass-card-floating bg-white p-6 sm:p-7 flex flex-col justify-between group rounded-[26px] border border-slate-200/80 shadow-[0_12px_35px_rgba(18,40,32,0.05)] hover:border-emerald-300 transition-all relative overflow-hidden"
              >
                <div>
                  {/* Icon & Featured Badge */}
                  <div className="flex items-start justify-between mb-5">
                    <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-emerald-500/15 to-emerald-500/5 border border-emerald-500/30 flex items-center justify-center text-[#10B981] group-hover:scale-110 group-hover:bg-[#10B981] group-hover:text-white transition-all duration-300 shrink-0 shadow-xs">
                      <Icon className="w-6 h-6" />
                    </div>
                    {treatment.featured && (
                      <span className="px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-bold tracking-wider uppercase shadow-2xs">
                        Most Requested
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-xl sm:text-[22px] font-display font-bold text-[#122820] group-hover:text-[#10B981] transition-colors mb-2 leading-snug">
                    {treatment.name}
                  </h3>

                  {/* Short Description */}
                  <p className="text-xs sm:text-sm text-[#4B6358] leading-relaxed mb-5 line-clamp-3">
                    {treatment.desc}
                  </p>

                  {/* Price Range & Duration Chips (Requirement #5) */}
                  <div className="grid grid-cols-2 gap-2 mb-5">
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col gap-1">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase text-slate-500">
                        <Banknote className="w-3 h-3 text-[#10B981]" />
                        <span>Price Range</span>
                      </span>
                      <span className="text-xs font-bold font-mono text-[#122820] truncate">
                        {meta.priceRange}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col gap-1">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase text-slate-500">
                        <Clock className="w-3 h-3 text-[#10B981]" />
                        <span>Duration</span>
                      </span>
                      <span className="text-xs font-bold text-[#122820] truncate">
                        {meta.duration}
                      </span>
                    </div>
                  </div>

                  {/* Doctor Note Mini Box */}
                  <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/70 flex items-start gap-2.5 mb-6">
                    <ShieldCheck className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">Doctor Clinical Note</span>
                      <p className="text-[11px] text-[#2C4238] leading-relaxed font-medium mt-0.5">
                        {meta.doctorNote}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons: Book Button & Learn Procedure */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3 mt-auto">
                  <button
                    type="button"
                    onClick={() => window.dispatchEvent(new CustomEvent("openContactModal", { detail: { treatmentId: treatment.id } }))}
                    className="btn-primary-premium py-2.5 px-4 text-xs font-bold flex items-center gap-1.5 shadow-xs shrink-0 cursor-pointer"
                  >
                    <CalendarDays className="w-3.5 h-3.5" />
                    <span>Book Procedure</span>
                  </button>

                  <Link
                    to={`/treatments/${treatment.id}`}
                    className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#10B981] hover:text-[#059669] transition-colors"
                  >
                    <span>Learn Details</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Clinical Trust Strip */}
        <div className="mt-12 sm:mt-16 flex flex-wrap justify-center items-center gap-x-8 gap-y-4 pt-8 border-t border-slate-200/80">
          {trustFeatures.map((feature, idx) => (
            <div key={idx} className="flex items-center gap-2.5">
              <div className="w-5 h-5 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center shrink-0">
                <Check className="w-3.5 h-3.5 text-[#10B981]" strokeWidth={2.5} />
              </div>
              <span className="text-xs sm:text-sm font-bold tracking-wider uppercase text-[#122820]">
                {feature}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
