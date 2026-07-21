import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Check, ChevronLeft, ArrowRight } from "lucide-react";
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

export default function Treatments() {
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const sliderRef = useRef<HTMLDivElement>(null);

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

  return (
    <section id="treatments" className="relative py-20 sm:py-28 bg-[#F8FAFC] z-10 font-sans border-b border-slate-200/60 overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        
        {/* Section Header & Navigation Controls */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-10 sm:mb-14">
          <div className="text-center lg:text-left max-w-2xl">
            <TagPill icon={ToothIcon} text="Comprehensive Services" />
            <h2 className="h2-premium mt-3 mb-3">
              Advanced Clinical <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10B981] to-[#059669]">
                Treatments & Procedures
              </span>
            </h2>
            <p className="body-premium">
              From pain-free root canals and precision dental implants to gentle pediatric care, we deliver world-class dental treatments tailored to your unique smile. Swipe or click to explore.
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

        {/* V2 Horizontal Snap Slider Container */}
        <div 
          ref={sliderRef}
          className="slider-snap-x no-scrollbar pb-6 -mx-5 px-5 sm:mx-0 sm:px-0"
        >
          {filteredTreatments.map((treatment) => {
            const Icon = getIcon(treatment.iconName);
            return (
              <div
                key={treatment.id}
                className="w-[310px] sm:w-[360px] shrink-0 glass-card-floating p-7 sm:p-8 flex flex-col justify-between group rounded-3xl relative overflow-hidden"
              >
                <div>
                  {/* Icon & Featured Badge */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-emerald-500/15 to-emerald-500/5 border border-emerald-500/30 flex items-center justify-center text-[#10B981] group-hover:scale-110 group-hover:bg-[#10B981] group-hover:text-white transition-all duration-300 shrink-0 shadow-sm">
                      <Icon className="w-6 h-6" />
                    </div>
                    {treatment.featured && (
                      <span className="px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-bold tracking-wider uppercase shadow-2xs">
                        Most Requested
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-xl sm:text-[22px] font-display font-bold text-[#122820] group-hover:text-[#10B981] transition-colors mb-2.5 leading-snug">
                    {treatment.name}
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-[#4B6358] leading-relaxed mb-6 line-clamp-3">
                    {treatment.desc}
                  </p>
                </div>

                {/* Footer Link */}
                <div className="pt-5 border-t border-slate-100 flex items-center justify-between mt-auto">
                  <Link
                    to={`/treatments/${treatment.id}`}
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#10B981] group-hover:text-[#059669] transition-colors"
                  >
                    <span>Learn Procedure</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <span className="text-[10px] font-bold font-mono text-[#A2C7B7] uppercase tracking-wider">
                    Dr. Saha Studio
                  </span>
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
