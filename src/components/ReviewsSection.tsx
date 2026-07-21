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
    <section id="reviews" className="py-20 sm:py-28 bg-[#F8FAFC] font-sans border-b border-slate-200/60 scroll-mt-24 relative overflow-hidden">
      
      {/* Background Subtle Gradient Accents */}
      <div className="absolute top-1/3 left-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-0 w-[400px] h-[400px] bg-teal-500/5 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        
        {/* Header with Navigation Controls */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div className="max-w-3xl">
            <TagPill icon={Quote} text="Patient Experiences" />
            <h2 className="h2-premium mt-3 mb-4">
              Trusted by Over <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10B981] to-[#059669]">
                5,000+ Happy Patients
              </span>
            </h2>
            <p className="body-premium max-w-2xl">
              Read what patients across Purba Bardhaman and Nadia say about our painless treatments, precision diagnostics, and compassionate clinical care.
            </p>
          </div>

          {/* Slider Controls */}
          <div className="flex items-center gap-3 shrink-0 self-start lg:self-end">
            <button
              type="button"
              onClick={() => scroll('left')}
              aria-label="Previous testimonials"
              className="w-12 h-12 rounded-2xl glass-crystal border border-slate-200/80 bg-white/90 hover:bg-[#10B981] text-[#122820] hover:text-white hover:border-[#10B981] flex items-center justify-center transition-all shadow-sm cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => scroll('right')}
              aria-label="Next testimonials"
              className="w-12 h-12 rounded-2xl glass-crystal border border-slate-200/80 bg-white/90 hover:bg-[#10B981] text-[#122820] hover:text-white hover:border-[#10B981] flex items-center justify-center transition-all shadow-sm cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Horizontal Snap Slider Grid */}
        <div 
          ref={scrollRef}
          className="slider-snap-x pb-6 pt-2 -mx-5 px-5 sm:-mx-8 sm:px-8 flex gap-6 sm:gap-8 overflow-x-auto scrollbar-none snap-x snap-mandatory"
        >
          {reviews.map((review, idx) => (
            <div
              key={idx}
              className="glass-card-floating p-7 sm:p-9 bg-white/95 flex flex-col justify-between group rounded-3xl relative shrink-0 w-[88%] sm:w-[420px] lg:w-[450px] snap-start border border-slate-200/80 shadow-[0_15px_40px_rgba(18,40,32,0.06)] hover:shadow-[0_25px_60px_rgba(16,185,129,0.12)] transition-all duration-300"
            >
              <div>
                {/* Rating Stars & Verified Badge */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
                    ))}
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#10B981] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/80 uppercase tracking-wider">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Verified Patient
                  </span>
                </div>

                {/* Treatment Tag */}
                <div className="mb-4">
                  <span className="inline-block text-xs font-bold text-[#122820] bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200/60">
                    Procedure: <span className="text-[#10B981]">{review.treatment}</span>
                  </span>
                </div>

                {/* Review Comment */}
                <p className="text-sm sm:text-[15px] text-[#2C4238] leading-[1.7] mb-8 font-normal italic">
                  "{review.comment}"
                </p>
              </div>

              {/* Patient Profile Footer */}
              <div className="pt-5 border-t border-slate-100/80 flex items-center justify-between mt-auto">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#10B981] to-[#059669] text-white font-bold font-display flex items-center justify-center text-sm shadow-sm shrink-0">
                    {review.initials}
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-sm text-[#122820] leading-snug">
                      {review.name}
                    </h4>
                    <span className="text-xs text-[#4B6358] font-medium block mt-0.5">
                      {review.location}
                    </span>
                  </div>
                </div>
                <span className="text-[11px] font-semibold font-mono text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/60">
                  {review.date}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Overall Rating Banner */}
        <div className="mt-12 sm:mt-16 max-w-4xl mx-auto glass-card-floating p-6 sm:p-8 bg-gradient-to-br from-emerald-50/90 via-white to-white rounded-3xl border border-emerald-300/80 shadow-[0_20px_50px_rgba(16,185,129,0.1)] flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-14 h-14 rounded-2xl bg-[#10B981]/15 border border-[#10B981]/30 flex items-center justify-center text-[#10B981] shrink-0 shadow-sm">
              <Sparkles className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-1.5">
                <div className="flex items-center text-amber-500">
                  <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
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
