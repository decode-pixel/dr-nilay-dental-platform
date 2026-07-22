import React, { useState } from "react";
import { Sparkles, CalendarDays, ChevronRight, CheckCircle2, Award, Star } from "lucide-react";
import TagPill from "./TagPill";
import OptimizedImage from "./OptimizedImage";

interface GalleryCase {
  id: string;
  category: "alignment" | "whitening" | "crowns" | "implants";
  title: string;
  subtitle: string;
  beforeImg: string;
  afterImg: string;
  duration: string;
  doctorNote: string;
  technique: string;
  rating: number;
}

const GALLERY_CASES: GalleryCase[] = [
  {
    id: "case-1",
    category: "alignment",
    title: "Full Arch Aesthetic Smile Redesign",
    subtitle: "Corrected severe midline misalignment and chipped enamel with 3D digital smile planning.",
    beforeImg: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80",
    afterImg: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=800&q=80",
    duration: "2 Clinical Visits",
    doctorNote: "Utilized ultra-thin porcelain veneers preserving 95% natural tooth structure.",
    technique: "Digital Smile Design (DSD) + Ultra-Thin Veneers",
    rating: 5.0,
  },
  {
    id: "case-2",
    category: "whitening",
    title: "In-Clinic Laser Enamel Brightening",
    subtitle: "Lifted deep tea & coffee staining by 8 shades in a single pain-free 45-minute session.",
    beforeImg: "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&w=800&q=80",
    afterImg: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80",
    duration: "45 Minutes (Single Sitting)",
    doctorNote: "Applied desensitizing gel post-laser for 100% comfortable, sensitivity-free whitening.",
    technique: "Advanced Laser LED Acceleration",
    rating: 5.0,
  },
  {
    id: "case-3",
    category: "crowns",
    title: "Zirconia Metal-Free Crown Restoration",
    subtitle: "Replaced old dark metal-fused crown with translucent CAD/CAM monolithic zirconia.",
    beforeImg: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80",
    afterImg: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80",
    duration: "2 Visits (5 Days)",
    doctorNote: "Computer-milled 3D zirconia crown perfectly matched adjacent enamel translucency.",
    technique: "German CAD/CAM Monolithic Zirconia",
    rating: 5.0,
  },
  {
    id: "case-4",
    category: "implants",
    title: "Single Tooth Immediate Implant",
    subtitle: "Painless keyhole implant placement restoring full chewing functionality post extraction.",
    beforeImg: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80",
    afterImg: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=800&q=80",
    duration: "Single Surgery + Crown",
    doctorNote: "Titanium grade-5 implant integrated seamlessly with optimal gingival contour.",
    technique: "Flapless Keyhole Implant Surgery",
    rating: 5.0,
  },
];

type CategoryFilter = "all" | "alignment" | "whitening" | "crowns" | "implants";

export default function BeforeAfterGallery() {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("all");
  const [sliderPositions, setSliderPositions] = useState<Record<string, number>>({
    "case-1": 50,
    "case-2": 50,
    "case-3": 50,
    "case-4": 50,
  });

  const filteredCases = GALLERY_CASES.filter(
    (item) => activeCategory === "all" || item.category === activeCategory
  );

  const handleSliderChange = (id: string, val: number) => {
    setSliderPositions((prev) => ({ ...prev, [id]: val }));
  };

  const handleOpenBooking = (caseTitle: string) => {
    window.dispatchEvent(
      new CustomEvent("openContactModal", { detail: { note: `Inquiry regarding: ${caseTitle}` } })
    );
  };

  return (
    <section id="gallery" className="py-20 sm:py-28 bg-white font-sans border-b border-slate-100 relative overflow-hidden">
      {/* Subtle background ambient light */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-r from-sky-400/10 via-teal-400/10 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <TagPill icon={Sparkles} text="Clinical Excellence • Verified Case Studies" />
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-[#0F172A] tracking-tight mt-4 mb-4 leading-tight">
            Smile Transformations <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0284C7] to-[#0EA5E9]">
              Real Patient Before & After
            </span>
          </h2>
          <p className="text-base sm:text-lg text-[#475569] leading-relaxed max-w-2xl mx-auto font-normal">
            Drag the comparison slider on each clinical case to see natural smile transformations achieved by Dr. Nilay Saha using precision digital dentistry.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 mb-12" role="tablist">
          {[
            { id: "all", label: "All Transformations" },
            { id: "alignment", label: "Smile Design" },
            { id: "whitening", label: "Laser Whitening" },
            { id: "crowns", label: "Zirconia Crowns" },
            { id: "implants", label: "Dental Implants" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id as CategoryFilter)}
              role="tab"
              aria-selected={activeCategory === tab.id}
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 cursor-pointer ${
                activeCategory === tab.id
                  ? "bg-[#0284C7] text-white shadow-md shadow-sky-500/20 scale-105"
                  : "bg-slate-100 text-[#475569] hover:bg-slate-200/80 hover:text-[#0F172A]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Gallery Case Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10">
          {filteredCases.map((item) => {
            const pos = sliderPositions[item.id] ?? 50;
            return (
              <div
                key={item.id}
                className="bg-white rounded-[24px] border border-slate-200/80 shadow-[0_10px_35px_rgba(15,23,42,0.05)] hover:shadow-[0_20px_50px_rgba(2,132,199,0.12)] transition-all duration-300 overflow-hidden flex flex-col justify-between group"
              >
                {/* Before & After Interactive Image Container */}
                <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-slate-900 select-none">
                  {/* After Image (Full background) */}
                  <OptimizedImage
                    src={item.afterImg}
                    alt={`${item.title} After`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-emerald-600/90 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md z-10 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>AFTER</span>
                  </div>

                  {/* Before Image (Clipped overlay) */}
                  <div
                    className="absolute inset-0 overflow-hidden border-r-2 border-white shadow-2xl z-10"
                    style={{ width: `${pos}%` }}
                  >
                    <OptimizedImage
                      src={item.beforeImg}
                      alt={`${item.title} Before`}
                      className="w-full h-full object-cover max-w-none"
                      style={{ width: "100%", height: "100%" }}
                    />
                    <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md">
                      BEFORE
                    </div>
                  </div>

                  {/* Slider Control Line & Thumb */}
                  <div
                    className="absolute top-0 bottom-0 z-20 pointer-events-none flex items-center justify-center"
                    style={{ left: `calc(${pos}% - 16px)` }}
                  >
                    <div className="w-8 h-8 rounded-full bg-white text-[#0284C7] shadow-lg border border-slate-200 flex items-center justify-center text-xs font-bold pointer-events-auto cursor-ew-resize">
                      ↔
                    </div>
                  </div>

                  {/* Range Input Overlay */}
                  <input
                    type="range"
                    min="5"
                    max="95"
                    value={pos}
                    onChange={(e) => handleSliderChange(item.id, Number(e.target.value))}
                    className="absolute inset-0 w-full h-full opacity-0 z-30 cursor-ew-resize"
                    aria-label={`Compare Before and After for ${item.title}`}
                  />
                </div>

                {/* Case Info Body */}
                <div className="p-6 sm:p-7 space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#0284C7] bg-sky-50 px-3 py-1 rounded-lg border border-sky-200/70">
                      {item.technique}
                    </span>
                    <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{item.rating.toFixed(1)}</span>
                    </div>
                  </div>

                  <h3 className="text-xl font-display font-bold text-[#0F172A] leading-snug group-hover:text-[#0284C7] transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                    {item.subtitle}
                  </p>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-start gap-2.5 text-xs text-[#334155]">
                    <Award className="w-4 h-4 text-[#0284C7] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-[#0F172A] block">Clinical Duration: {item.duration}</span>
                      <span className="text-slate-600 block mt-0.5">{item.doctorNote}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => handleOpenBooking(item.title)}
                      className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#0284C7] hover:text-[#0369A1] transition-colors cursor-pointer"
                    >
                      <CalendarDays className="w-4 h-4" />
                      <span>Book Consultation For Similar Case</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Clinical Assurance Strip */}
        <div className="mt-14 max-w-4xl mx-auto p-6 rounded-[20px] bg-gradient-to-r from-sky-50 via-white to-sky-50 border border-sky-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#0284C7] text-white flex items-center justify-center shrink-0 shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-display font-bold text-base text-[#0F172A]">
                Want to preview your smile before starting treatment?
              </h4>
              <p className="text-xs text-[#475569] mt-0.5">
                Schedule a 3D digital smile simulation session with Dr. Nilay Saha today.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent("openContactModal"))}
            className="btn-primary-premium py-3 px-6 text-xs font-bold shrink-0 cursor-pointer"
          >
            <span>Request Smile Consultation</span>
          </button>
        </div>

      </div>
    </section>
  );
}
