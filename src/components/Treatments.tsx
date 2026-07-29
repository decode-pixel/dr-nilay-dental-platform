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

const treatmentMetaMap: Record<string, { duration: string; doctorNote: string }> = {
  "root-canal": { duration: "60–90 Mins (1–2 Visits)", doctorNote: "100% Rotary Endodontics & Local Anesthesia for zero discomfort." },
  "re-root-canal": { duration: "90 Mins (2 Visits)", doctorNote: "Microscopic disinfection to save previously treated failed teeth." },
  "fillings": { duration: "30–45 Mins (Single Visit)", doctorNote: "Tooth-colored biocompatible composite resin matching exact enamel." },
  "crowns": { duration: "2 Visits (Lab Precision)", doctorNote: "Zirconia & E-Max digital CAD/CAM crowns with multi-year warranty." },
  "bridges": { duration: "2–3 Visits", doctorNote: "Custom fixed prosthetics to seamlessly bridge missing gaps." },
  "dentures": { duration: "3–4 Visits", doctorNote: "High-impact flexible & complete BPS dentures for effortless chewing." },
  "smile-design": { duration: "2–3 Visits", doctorNote: "Digital smile preview with porcelain veneers & aesthetic contouring." },
  "whitening": { duration: "45 Mins (In-Clinic)", doctorNote: "Advanced laser & LED whitening lifting up to 8 shades in 1 sitting." },
  "braces": { duration: "12–18 Months", doctorNote: "Self-ligating metal, ceramic, and invisible aligners tailored for all ages." },
  "implants": { duration: "Surgical + Restoration", doctorNote: "Titanium biocompatible implants acting as natural permanent roots." },
  "extraction": { duration: "20–45 Mins", doctorNote: "Atraumatic extraction protocol preserving bone and gum contour." },
  "wisdom-tooth": { duration: "45–60 Mins", doctorNote: "Surgical extraction of impacted molars with painless healing protocol." },
  "oral-surgery": { duration: "Varies by Procedure", doctorNote: "Precision surgical management of cysts, bone grafting, and trauma." },
  "emergency": { duration: "Immediate Attention", doctorNote: "Priority management for acute pain, broken teeth, and infection." },
  "scaling": { duration: "30–45 Mins", doctorNote: "Ultrasonic tartar & plaque removal with gum polishing and protection." },
  "pediatric": { duration: "Child-Friendly Sessions", doctorNote: "Gentle fluoride treatments, pit & fissure sealants, and painless care." },
  "gum-treatment": { duration: "1–2 Visits", doctorNote: "Deep curettage, laser flap surgery, and periodontal strengthening." },
  "preventive": { duration: "30 Mins", doctorNote: "Complete oral health screening, cavity prevention, and hygiene coaching." },
  "xray": { duration: "5 Mins (Instant RVG)", doctorNote: "Low-radiation digital RVG diagnostics with instant chairside imaging." },
  "consultation": { duration: "20–30 Mins", doctorNote: "1-on-1 evaluation by Dr. Nilay Saha with custom treatment roadmaps." }
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
    <section id="treatments" className="relative py-16 sm:py-24 bg-[#F5F9F8] z-10 font-sans border-b border-teal-100/50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header & Navigation Controls */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-10 sm:mb-14">
          <div className="text-center lg:text-left max-w-2xl">
            <TagPill icon={ToothIcon} text="Comprehensive Clinical Services" />
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-[#0F172A] tracking-tight mt-3 mb-3">
              Advanced Clinical <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00A896] via-[#028090] to-[#059669]">
                Treatments &amp; Procedures
              </span>
            </h2>
            <p className="text-base text-slate-600 leading-relaxed font-normal">
              Explore our world-class procedures with transparent pricing ranges, estimated clinical durations, and direct doctor guidance. Swipe or drag across cards to browse.
            </p>
          </div>

          {/* Desktop Slider Arrows */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => scrollSlider("left")}
              aria-label="Previous treatments"
              className="w-12 h-12 rounded-full bg-white/80 border border-white/90 shadow-sm flex items-center justify-center text-slate-900 hover:bg-white hover:text-[#00A896] active:scale-95 transition-all cursor-pointer backdrop-blur-xl"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => scrollSlider("right")}
              aria-label="Next treatments"
              className="w-12 h-12 rounded-full btn-crystal text-white shadow-md flex items-center justify-center active:scale-95 transition-all cursor-pointer"
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
                className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00A896] cursor-pointer ${
                  isActive
                    ? "bg-gradient-to-r from-[#00A896] to-[#028090] text-white shadow-[0_6px_20px_rgba(0,168,150,0.3)] scale-105"
                    : "bg-white/80 backdrop-blur-xl text-slate-600 border border-white/90 hover:border-teal-300 hover:text-slate-900 shadow-xs"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Horizontal Snap Slider Container */}
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
                className="w-[320px] sm:w-[380px] shrink-0 bg-white/80 backdrop-blur-2xl p-6 sm:p-7 flex flex-col justify-between group rounded-[28px] border border-white/90 shadow-[0_10px_35px_rgba(15,23,42,0.04)] hover:shadow-[0_20px_50px_rgba(0,168,150,0.12)] transition-all relative overflow-hidden"
              >
                <div>
                  {/* Icon & Featured Badge */}
                  <div className="flex items-start justify-between mb-5">
                    <div className="w-13 h-13 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-[#00A896] group-hover:scale-110 group-hover:bg-[#00A896] group-hover:text-white transition-all duration-300 shrink-0 shadow-xs">
                      <Icon className="w-6 h-6" />
                    </div>
                    {treatment.featured && (
                      <span className="px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-extrabold tracking-wider uppercase shadow-2xs">
                        Most Requested
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-xl sm:text-[22px] font-display font-extrabold text-[#0F172A] group-hover:text-[#00A896] transition-colors mb-2 leading-snug">
                    {treatment.name}
                  </h3>

                  {/* Short Description */}
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-5 line-clamp-3 font-normal">
                    {treatment.desc}
                  </p>

                  {/* Duration & Care Standard Chips */}
                  <div className="grid grid-cols-2 gap-2 mb-5">
                    <div className="p-2.5 rounded-2xl bg-teal-50/50 border border-teal-100 flex flex-col gap-1">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase text-slate-500">
                        <Clock className="w-3 h-3 text-[#00A896]" />
                        <span>Duration</span>
                      </span>
                      <span className="text-xs font-bold text-slate-900 truncate">
                        {meta.duration}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-2xl bg-emerald-50/50 border border-emerald-100 flex flex-col gap-1">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase text-slate-500">
                        <ShieldCheck className="w-3 h-3 text-[#00A896]" />
                        <span>Care Protocol</span>
                      </span>
                      <span className="text-xs font-bold text-emerald-800 truncate">
                        100% Pain-Free
                      </span>
                    </div>
                  </div>

                  {/* Doctor Note Mini Box */}
                  <div className="p-3 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-start gap-2.5 mb-6">
                    <ShieldCheck className="w-4 h-4 text-[#00A896] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#00A896] block">Doctor Clinical Note</span>
                      <p className="text-[11px] text-slate-700 leading-relaxed font-medium mt-0.5">
                        {meta.doctorNote}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3 mt-auto">
                  <button
                    type="button"
                    onClick={() => window.dispatchEvent(new CustomEvent("openContactModal", { detail: { treatmentId: treatment.id } }))}
                    className="px-4 py-2.5 rounded-full bg-[#00A896] hover:bg-[#028090] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs shrink-0 cursor-pointer transition-colors"
                  >
                    <CalendarDays className="w-3.5 h-3.5" />
                    <span>Book Procedure</span>
                  </button>

                  <Link
                    to={`/treatments/${treatment.id}`}
                    className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#00A896] hover:text-[#028090] transition-colors"
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
        <div className="mt-12 sm:mt-16 flex flex-wrap justify-center items-center gap-x-8 gap-y-4 pt-8 border-t border-teal-100/60">
          {trustFeatures.map((feature, idx) => (
            <div key={idx} className="flex items-center gap-2.5">
              <div className="w-5 h-5 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center shrink-0">
                <Check className="w-3.5 h-3.5 text-emerald-600" strokeWidth={2.5} />
              </div>
              <span className="text-xs sm:text-sm font-bold tracking-wider uppercase text-slate-800">
                {feature}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
