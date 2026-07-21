import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Check } from "lucide-react";
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

  const filteredTreatments = treatmentsData.filter((t) => {
    if (activeCategory === "all") return true;
    return categoryMap[t.id] === activeCategory;
  });

  return (
    <section id="treatments" className="relative py-20 sm:py-28 bg-[#F8FAFC] z-10 font-sans border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <TagPill icon={ToothIcon} text="Comprehensive Services" />
          <h2 className="h2-premium mt-3 mb-4">
            Advanced Clinical <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10B981] to-[#059669]">
              Treatments & Procedures
            </span>
          </h2>
          <p className="body-premium max-w-2xl mx-auto">
            From pain-free root canals and precision dental implants to gentle pediatric care, we deliver world-class dental treatments tailored to your unique smile.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-12" role="tablist" aria-label="Treatment categories">
          {filterTabs.map((tab) => {
            const isActive = activeCategory === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => setActiveCategory(tab.value)}
                role="tab"
                aria-selected={isActive}
                className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10B981] ${
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

        {/* Treatments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {filteredTreatments.map((treatment) => {
            const Icon = getIcon(treatment.iconName);
            return (
              <div
                key={treatment.id}
                className="glass-card-floating p-7 sm:p-8 flex flex-col justify-between group bg-white rounded-3xl"
              >
                <div>
                  {/* Icon & Featured Badge */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-13 h-13 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-[#10B981] group-hover:bg-[#10B981] group-hover:text-white transition-colors duration-300 shrink-0 shadow-sm">
                      <Icon className="w-6 h-6" />
                    </div>
                    {treatment.featured && (
                      <span className="px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-[11px] font-bold tracking-wide uppercase">
                        Most Requested
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-xl sm:text-[22px] font-display font-bold text-[#122820] group-hover:text-[#10B981] transition-colors mb-2.5 leading-snug">
                    {treatment.name}
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-[#4B6358] leading-relaxed mb-6">
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
                  <span className="text-[11px] font-bold font-mono text-[#A2C7B7] uppercase">
                    Dr. Saha Studio
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Clinical Trust Strip */}
        <div className="mt-16 sm:mt-20 flex flex-wrap justify-center items-center gap-x-8 gap-y-4 pt-10 border-t border-slate-200/80">
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
