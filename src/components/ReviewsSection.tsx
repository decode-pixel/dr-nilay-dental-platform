import React, { useRef } from "react";
import { Star, Quote, CheckCircle2, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import TagPill from "./TagPill";

/**
 * ReviewsSection — Verified Patient Testimonials
 * Clean #F8FAFC background, 24px radius cards, Apple/Linear aesthetic
 */

interface Review {
  name: string;
  location: string;
  treatment: string;
  rating: number;
  date: string;
  comment: string;
  initials: string;
}

const reviews: Review[] = [
  {
    name: "Subrata Mukherjee",
    location: "Purba Bardhaman",
    treatment: "Single-Visit Root Canal",
    rating: 5,
    date: "2 weeks ago",
    comment:
      "I was terrified of having a root canal done after a terrible past experience elsewhere. Dr. Nilay Saha explained every step using digital X-rays and completed the procedure in a single visit without a drop of pain. The clinic is exceptionally sterile and state-of-the-art.",
    initials: "SM",
  },
  {
    name: "Ananya Ghosh",
    location: "Nabadwip, Nadia",
    treatment: "Zirconia Crown & Smile Design",
    rating: 5,
    date: "1 month ago",
    comment:
      "Dr. Saha's attention to detail is remarkable. He designed my zirconia crown to match my natural teeth perfectly. The staff is courteous, the appointment started right on time, and the hygiene standards felt like an international hospital.",
    initials: "AG",
  },
  {
    name: "Dr. Rajesh Bhattacharya",
    location: "Belerhat",
    treatment: "Wisdom Tooth Extraction",
    rating: 5,
    date: "3 weeks ago",
    comment:
      "As a fellow healthcare professional, I paid close attention to their sterilization protocols. Their Class-B autoclaving and aseptic techniques are spotless. The surgical extraction of my impacted wisdom tooth was smooth and the recovery was rapid.",
    initials: "RB",
  },
  {
    name: "Sushmita Banerjee",
    location: "Parulia Center",
    treatment: "Painless Cosmetic Fillings",
    rating: 5,
    date: "1 month ago",
    comment:
      "The entire experience at the Parulia clinic feels world-class right from the moment you step inside. Dr. Saha is gentle, patient, and uses ultra-modern instruments. My dental sensitivity is completely gone after just one consultation.",
    initials: "SB",
  },
  {
    name: "Alok Ranjan Sen",
    location: "Nabadwip Center",
    treatment: "Complete Oral Rehabilitation",
    rating: 5,
    date: "2 months ago",
    comment:
      "Finding a dental surgeon of this caliber in regional West Bengal is a blessing. The transparent treatment planning, precise diagnostics, and zero-compromise hygiene make Dr. Nilay Saha's clinic superior even to top metro city dental setups.",
    initials: "AS",
  }
];

export default function ReviewsSection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.8;
      scrollRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="reviews" className="py-20 sm:py-28 bg-white font-sans border-b border-slate-200/60 scroll-mt-24 relative overflow-hidden">
      
      {/* Background Subtle Gradient Accents */}
      <div className="absolute top-1/3 left-0 w-[500px] h-[500px] bg-sky-500/5 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-0 w-[400px] h-[400px] bg-teal-500/5 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header with Navigation Controls */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div className="max-w-3xl">
            <TagPill icon={Quote} text="Patient Experiences" />
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-[#0F172A] tracking-tight mt-3 mb-4 leading-tight">
              Trusted by Over <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0284C7] to-[#0EA5E9]">
                5,000+ Happy Patients
              </span>
            </h2>
            <p className="text-base sm:text-lg text-[#475569] leading-relaxed max-w-2xl font-normal">
              Read what patients across Purba Bardhaman and Nadia say about our painless treatments, precision diagnostics, and compassionate clinical care.
            </p>
          </div>

          {/* Slider Controls */}
          <div className="flex items-center gap-3 shrink-0 self-start lg:self-end">
            <button
              type="button"
              onClick={() => scroll('left')}
              aria-label="Previous testimonials"
              className="w-12 h-12 rounded-full border border-slate-200 bg-white hover:bg-sky-50 text-[#0F172A] hover:text-[#0284C7] hover:border-[#0284C7] flex items-center justify-center transition-all shadow-sm cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => scroll('right')}
              aria-label="Next testimonials"
              className="w-12 h-12 rounded-full border border-slate-200 bg-white hover:bg-sky-50 text-[#0F172A] hover:text-[#0284C7] hover:border-[#0284C7] flex items-center justify-center transition-all shadow-sm cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Horizontal Snap Slider Grid */}
        <div 
          ref={scrollRef}
          className="slider-snap-x pb-6 pt-2 -mx-4 px-4 sm:-mx-8 sm:px-8 flex gap-6 sm:gap-8 overflow-x-auto scrollbar-none snap-x snap-mandatory"
        >
          {reviews.map((review, idx) => (
            <div
              key={idx}
              className="p-7 sm:p-8 bg-white flex flex-col justify-between group rounded-[20px] shrink-0 w-[88%] sm:w-[420px] lg:w-[450px] snap-start border border-slate-200/90 shadow-[0_10px_30px_rgba(15,23,42,0.04)] hover:shadow-[0_20px_50px_rgba(2,132,199,0.12)] hover:border-sky-300 transition-all duration-300"
            >
              <div>
                {/* Rating Stars & Verified Badge */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0284C7] bg-sky-50 px-3 py-1 rounded-full border border-sky-200 uppercase tracking-wider">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Verified Patient
                  </span>
                </div>

                {/* Treatment Tag */}
                <div className="mb-4">
                  <span className="inline-block text-xs font-bold text-[#0F172A] bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200/80">
                    Procedure: <span className="text-[#0284C7]">{review.treatment}</span>
                  </span>
                </div>

                {/* Review Comment */}
                <p className="text-sm sm:text-[15px] text-[#334155] leading-[1.7] mb-8 font-normal italic">
                  "{review.comment}"
                </p>
              </div>

              {/* Patient Profile Footer */}
              <div className="pt-5 border-t border-slate-100 flex items-center justify-between mt-auto">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#0284C7] to-[#0369A1] text-white font-bold font-display flex items-center justify-center text-sm shadow-xs shrink-0">
                    {review.initials}
                  </div>
                  <div>
                    <h4 className="font-display font-extrabold text-sm text-[#0F172A] leading-snug">
                      {review.name}
                    </h4>
                    <span className="text-xs text-[#475569] font-medium block mt-0.5">
                      {review.location}
                    </span>
                  </div>
                </div>
                <span className="text-[11px] font-semibold font-mono text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                  {review.date}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Overall Rating Banner */}
        <div className="mt-12 sm:mt-16 max-w-4xl mx-auto p-6 sm:p-8 bg-gradient-to-br from-sky-50 via-white to-white rounded-[20px] border border-sky-200/80 shadow-[0_15px_40px_rgba(2,132,199,0.08)] flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-14 h-14 rounded-2xl bg-[#0284C7]/15 border border-[#0284C7]/30 flex items-center justify-center text-[#0284C7] shrink-0 shadow-2xs">
              <Sparkles className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-1.5">
                <div className="flex items-center text-amber-400">
                  <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                  <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
                  <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
                  <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
                  <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
                </div>
                <span className="font-display font-bold text-xl text-[#122820] ml-1">4.9</span>
                <span className="text-xs text-slate-400 font-normal">/ 5.0</span>
              </div>
              <p className="font-bold text-sm text-[#122820] mt-1">Google & Direct Clinical Reviews</p>
              <p className="text-xs text-[#4B6358]">Consistently rated 5 stars across Purba Bardhaman & Nadia clinics</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent("openContactModal"))}
            className="btn-primary-premium shadow-md shrink-0 cursor-pointer"
          >
            <span>Leave Feedback or Consult</span>
          </button>
        </div>

      </div>
    </section>
  );
}
