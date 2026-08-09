import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ContactModal from "../components/ContactModal";
import SEO from "../components/SEO";
import { WhatsAppIcon } from "../components/Icons";
import { buildWhatsAppUrl } from "../lib/constants";
import {
  Star,
  Quote,
  CheckCircle2,
  Sparkles,
  Award,
  ShieldCheck,
  Building2,
  Users,
  ThumbsUp,
  MessageSquarePlus,
  ArrowRight,
  Filter
} from "lucide-react";

interface CombinedReview {
  id: string;
  name: string;
  location: string;
  treatment: string;
  category: "root-canal" | "cosmetic" | "surgical" | "general";
  rating: number;
  date: string;
  comment: string;
  initials: string;
  verified: boolean;
  source: "Google Reviews" | "Verified Patient Story";
}

const allCombinedReviews: CombinedReview[] = [
  {
    id: "1",
    name: "Subrata Mukherjee",
    location: "Purba Bardhaman",
    treatment: "Single-Visit Root Canal",
    category: "root-canal",
    rating: 5,
    date: "2 weeks ago",
    comment:
      "I was terrified of having a root canal done after a terrible past experience elsewhere. Dr. Nilay Saha explained every step using digital X-rays and completed the procedure in a single visit without a drop of pain. The clinic is exceptionally sterile and state-of-the-art.",
    initials: "SM",
    verified: true,
    source: "Google Reviews"
  },
  {
    id: "2",
    name: "Ananya Ghosh",
    location: "Nabadwip, Nadia",
    treatment: "Zirconia Crown & Smile Design",
    category: "cosmetic",
    rating: 5,
    date: "1 month ago",
    comment:
      "Dr. Saha's attention to detail is remarkable. He designed my zirconia crown to match my natural teeth perfectly. The staff is courteous, the appointment started right on time, and the hygiene standards felt like an international hospital.",
    initials: "AG",
    verified: true,
    source: "Verified Patient Story"
  },
  {
    id: "3",
    name: "Dr. Rajesh Bhattacharya",
    location: "Belerhat",
    treatment: "Wisdom Tooth Extraction",
    category: "surgical",
    rating: 5,
    date: "3 weeks ago",
    comment:
      "As a fellow healthcare professional, I paid close attention to their sterilization protocols. Their Class-B autoclaving and aseptic techniques are spotless. The surgical extraction of my impacted wisdom tooth was smooth and the recovery was rapid.",
    initials: "RB",
    verified: true,
    source: "Google Reviews"
  },
  {
    id: "4",
    name: "Sushmita Banerjee",
    location: "Belerhat Center",
    treatment: "Painless Cosmetic Fillings",
    category: "cosmetic",
    rating: 5,
    date: "1 month ago",
    comment:
      "The entire experience at the clinic feels world-class right from the moment you step inside. Dr. Saha is gentle, patient, and uses ultra-modern instruments. My dental sensitivity is completely gone after just one consultation.",
    initials: "SB",
    verified: true,
    source: "Verified Patient Story"
  },
  {
    id: "5",
    name: "Alok Ranjan Sen",
    location: "Nabadwip Center",
    treatment: "Complete Oral Rehabilitation",
    category: "root-canal",
    rating: 5,
    date: "2 months ago",
    comment:
      "Finding a dental surgeon of this caliber in regional West Bengal is a blessing. The transparent treatment planning, precise diagnostics, and zero-compromise hygiene make Dr. Nilay Saha's clinic superior even to top metro city dental setups.",
    initials: "AS",
    verified: true,
    source: "Google Reviews"
  },
  {
    id: "6",
    name: "Priyanka Roy",
    location: "Nabadwip, Nadia",
    treatment: "Laser Teeth Whitening",
    category: "cosmetic",
    rating: 5,
    date: "3 weeks ago",
    comment:
      "My teeth were noticeably brighter in just one sitting of laser whitening! Dr. Nilay Saha ensured I didn't experience any enamel sensitivity after the procedure. Highly recommended!",
    initials: "PR",
    verified: true,
    source: "Google Reviews"
  },
  {
    id: "7",
    name: "Manish Das",
    location: "Belerhat",
    treatment: "Emergency Pain Relief & RCT",
    category: "root-canal",
    rating: 5,
    date: "1 month ago",
    comment:
      "I walked in with excruciating toothache on a Sunday evening. Dr. Saha immediately diagnosed an infected nerve via digital RVG and performed painless rotary root canal treatment within 45 minutes.",
    initials: "MD",
    verified: true,
    source: "Verified Patient Story"
  },
  {
    id: "8",
    name: "Kakoli Chatterjee",
    location: "Purba Bardhaman",
    treatment: "Flexible Complete Dentures",
    category: "surgical",
    rating: 5,
    date: "2 months ago",
    comment:
      "My grandmother got her complete dentures fitted here. She can chew properly after years of difficulty. Dr. Nilay Saha's patience with elderly patients is heartwarming.",
    initials: "KC",
    verified: true,
    source: "Google Reviews"
  }
];

export default function ReviewsPage() {
  const [filter, setFilter] = useState<string>("all");

  const filteredReviews = filter === "all"
    ? allCombinedReviews
    : allCombinedReviews.filter((r) => r.category === filter);

  return (
    <div className="min-h-screen font-sans bg-[#F6F9F8] text-slate-900 overflow-x-hidden selection:bg-teal-500/30">
      <SEO 
        title="Patient Reviews & Verified Testimonials — Dr. Nilay Saha" 
        description="Read 4.9/5 star Google reviews, verified patient stories, and treatment feedback for Dr. Nilay Saha Dental Care across Nabadwip & Belerhat centers."
      />
      <Navbar />

      <main className="pt-28 pb-16 sm:pt-32 sm:pb-24">
        {/* Editorial Reviews Hero Banner */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 sm:mb-16">
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#062920] via-[#0B3C2F] to-[#041A14] text-white relative overflow-hidden shadow-2xl border border-teal-500/20">
            <div className="absolute -right-20 -top-20 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-3xl relative z-10 space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-semibold uppercase tracking-wider">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>Verified Patient Reviews &amp; Testimonials</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-display font-extrabold tracking-tight text-white leading-tight">
                4.9 / 5.0 Rating Across 5,000+ Happy Smiles
              </h1>
              <p className="text-base sm:text-lg text-teal-100/90 leading-relaxed font-light">
                Comprehensive patient stories, verified Google reviews, and real treatment outcome experiences across our Nabadwip and Belerhat dental studios.
              </p>

              {/* Quick Metrics Bar */}
              <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-teal-500/20 mt-6">
                <div>
                  <div className="text-2xl font-extrabold text-white">4.9 / 5.0</div>
                  <div className="text-xs text-teal-300">Google Rating</div>
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-white">5,000+</div>
                  <div className="text-xs text-teal-300">Patients Treated</div>
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-white">99.8%</div>
                  <div className="text-xs text-teal-300">Pain-Free Rate</div>
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-white">100%</div>
                  <div className="text-xs text-teal-300">Class-B Sterile</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Filter Tabs Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                filter === "all"
                  ? "bg-teal-600 text-white shadow-md shadow-teal-600/20"
                  : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              All Reviews ({allCombinedReviews.length})
            </button>
            <button
              onClick={() => setFilter("root-canal")}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                filter === "root-canal"
                  ? "bg-teal-600 text-white shadow-md shadow-teal-600/20"
                  : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              Root Canal Stories
            </button>
            <button
              onClick={() => setFilter("cosmetic")}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                filter === "cosmetic"
                  ? "bg-teal-600 text-white shadow-md shadow-teal-600/20"
                  : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              Cosmetic &amp; Crown Care
            </button>
            <button
              onClick={() => setFilter("surgical")}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                filter === "surgical"
                  ? "bg-teal-600 text-white shadow-md shadow-teal-600/20"
                  : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              Surgical Extractions
            </button>
          </div>
        </section>

        {/* Combined Reviews Cards Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReviews.map((rev) => (
              <div
                key={rev.id}
                className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/80 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-4 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-100">
                      <CheckCircle2 className="w-3 h-3 text-teal-600" />
                      <span>{rev.source}</span>
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic mb-4 font-normal">
                    &ldquo;{rev.comment}&rdquo;
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900">{rev.name}</h3>
                    <p className="text-[11px] text-teal-700 font-semibold mt-0.5">
                      {rev.treatment} • {rev.location}
                    </p>
                  </div>

                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                    {rev.initials}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Submit Review / Direct Action Box */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-teal-50 via-emerald-50 to-teal-50 border border-teal-200/80 shadow-md text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-teal-600 text-white flex items-center justify-center mx-auto">
              <MessageSquarePlus className="w-6 h-6" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900">
              Share Your Dental Care Experience
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
              Have you been treated by Dr. Nilay Saha? We value your feedback and look forward to hearing about your care experience!
            </p>
            <div className="pt-2">
              <a
                href={buildWhatsAppUrl()}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <span>Send Feedback via WhatsApp</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <ContactModal />

      {/* Floating WhatsApp FAB */}
      <a
        href={buildWhatsAppUrl()}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-[90] flex items-center justify-center w-14 h-14 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full shadow-[0_0_20px_rgba(37,211,102,0.4)] hover:shadow-[0_0_30px_rgba(37,211,102,0.6)] hover:-translate-y-1 active:scale-95 transition-all duration-200"
        aria-label="Contact via WhatsApp"
      >
        <WhatsAppIcon className="w-8 h-8" />
      </a>
    </div>
  );
}
