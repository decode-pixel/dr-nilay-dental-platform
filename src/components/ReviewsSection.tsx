import React from "react";
import { Star, Quote, CheckCircle2 } from "lucide-react";
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
];

export default function ReviewsSection() {
  return (
    <section id="reviews" className="py-20 sm:py-28 bg-[#F8FAFC] font-sans border-b border-slate-200/60 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-18">
          <TagPill icon={Quote} text="Patient Experiences" />
          <h2 className="h2-premium mt-3 mb-4">
            Trusted by Over <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10B981] to-[#059669]">
              5,000+ Happy Patients
            </span>
          </h2>
          <p className="body-premium max-w-2xl mx-auto">
            Read what patients across Purba Bardhaman and Nadia say about our painless treatments, precision diagnostics, and compassionate clinical care.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {reviews.map((review, idx) => (
            <div
              key={idx}
              className="card-premium p-7 sm:p-9 bg-white flex flex-col justify-between group hover:-translate-y-1 transition-all duration-300 relative"
            >
              <div>
                {/* Rating Stars & Verified Badge */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
                    ))}
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#10B981] bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/80 uppercase tracking-wide">
                    <CheckCircle2 className="w-3 h-3" />
                    Verified Patient
                  </span>
                </div>

                {/* Treatment Tag */}
                <div className="mb-3">
                  <span className="text-xs font-semibold text-[#4B6358] uppercase tracking-wider block">
                    Procedure: <span className="text-[#122820] font-bold">{review.treatment}</span>
                  </span>
                </div>

                {/* Review Comment */}
                <p className="text-sm sm:text-[15px] text-[#2C4238] leading-relaxed mb-8 italic">
                  "{review.comment}"
                </p>
              </div>

              {/* Patient Profile Footer */}
              <div className="pt-5 border-t border-slate-100 flex items-center justify-between mt-auto">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#10B981] to-[#059669] text-white font-bold font-display flex items-center justify-center text-sm shadow-sm shrink-0">
                    {review.initials}
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-sm text-[#122820] leading-snug">
                      {review.name}
                    </h4>
                    <span className="text-xs text-[#4B6358] block">
                      {review.location}
                    </span>
                  </div>
                </div>
                <span className="text-[11px] font-medium text-slate-400">
                  {review.date}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Overall Rating Banner */}
        <div className="mt-14 max-w-xl mx-auto card-premium p-6 bg-white flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left border-emerald-200/60 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-amber-500 text-lg font-bold">
              <Star className="w-6 h-6 fill-amber-500 text-amber-500" />
              <span className="font-display text-2xl text-[#122820] ml-1">4.9</span>
              <span className="text-xs text-slate-400 font-normal mt-1">/ 5.0</span>
            </div>
            <div className="h-8 w-px bg-slate-200 mx-2 hidden sm:block" />
            <div>
              <p className="font-bold text-sm text-[#122820]">Google & Direct Reviews</p>
              <p className="text-xs text-[#4B6358]">Based on 500+ verified appointments</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent("openContactModal"))}
            className="text-xs font-bold text-[#10B981] hover:text-[#059669] underline underline-offset-4 cursor-pointer shrink-0"
          >
            Leave Feedback or Consult →
          </button>
        </div>

      </div>
    </section>
  );
}
