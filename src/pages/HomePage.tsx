import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import TrustIndicators from "../components/TrustIndicators";
import WhyChooseUsBento from "../components/WhyChooseUsBento";
import ContactModal from "../components/ContactModal";
import Footer from "../components/Footer";
import SEO from "../components/SEO";
import { WhatsAppIcon } from "../components/Icons";
import { treatmentsData } from "../data/treatments";
import {
  CLINIC_SCHEDULES,
  CLINIC_SLUGS,
  PRIMARY_PHONE_NUMBER,
  PRIMARY_PHONE_DISPLAY,
  buildWhatsAppUrl
} from "../lib/constants";
import {
  ArrowRight,
  Sparkles,
  Star,
  MapPin,
  Clock,
  Phone,
  Navigation,
  Calendar,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Stethoscope
} from "lucide-react";

export default function HomePage() {
  // 4 Key Featured Treatments for Home Preview
  const featuredTreatments = treatmentsData.slice(0, 4);

  // 3 Featured Testimonials for Home Preview
  const featuredReviews = [
    {
      name: "Subrata Mukherjee",
      location: "Purba Bardhaman",
      treatment: "Single-Visit Root Canal",
      rating: 5,
      comment: "I was terrified of having a root canal done after a past experience. Dr. Nilay Saha explained every step using digital X-rays and completed the procedure in a single visit without a drop of pain.",
      initials: "SM"
    },
    {
      name: "Ananya Ghosh",
      location: "Nabadwip, Nadia",
      treatment: "Zirconia Crown & Smile Design",
      rating: 5,
      comment: "Dr. Saha's attention to detail is remarkable. He designed my zirconia crown to match my natural teeth perfectly. The hygiene standards felt like an international hospital.",
      initials: "AG"
    },
    {
      name: "Dr. Rajesh Bhattacharya",
      location: "Belerhat",
      treatment: "Wisdom Tooth Extraction",
      rating: 5,
      comment: "As a fellow healthcare professional, I paid close attention to their sterilization protocols. Their Class-B autoclaving and aseptic techniques are spotless.",
      initials: "RB"
    }
  ];

  // Compact Clinics Data
  const compactClinics = [
    CLINIC_SCHEDULES[CLINIC_SLUGS.NABADWIP],
    CLINIC_SCHEDULES[CLINIC_SLUGS.BELERHAT]
  ];

  return (
    <div
      id="home"
      className="min-h-screen font-sans overflow-x-hidden selection:bg-teal-500/30 bg-[#F6F9F8]"
    >
      <SEO
        title="Dr. Nilay Saha — Advanced Dental Care & Endodontic Specialist"
        description="Painless root canal therapy, digital RVG X-ray diagnostics, and advanced dental care by Dr. Nilay Saha (BDS), WBDC Reg. No. 4858-A across Nabadwip and Belerhat centers."
      />

      {/* ── 1. Navbar (fixed, floats above page, z-[100]) ───────────────────── */}
      <Navbar />

      {/* ── 1. Premium Hero Section ────────────────────────────────────────── */}
      <main className="pt-24 sm:pt-28">
        <Hero />
      </main>

      {/* ── 2. Trust Statistics ─────────────────────────────────────────────── */}
      <section className="py-12 sm:py-16 bg-[#F8FAF9] border-y border-teal-100/60">
        <TrustIndicators />
      </section>

      {/* ── 3. Why Choose Dr. Nilay Saha (4 Cards) ─────────────────────────── */}
      <section className="py-16 sm:py-24 bg-white">
        <WhyChooseUsBento />
      </section>

      {/* ── 4. Featured Treatments Section ─────────────────────────────────── */}
      <section className="py-16 sm:py-24 bg-slate-50 border-t border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-700 text-xs font-semibold uppercase tracking-wider mb-3">
                <Stethoscope className="w-3.5 h-3.5" />
                <span>Featured Dental Care</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900 tracking-tight">
                Specialized Treatments &amp; Procedures
              </h2>
            </div>
            <Link
              to="/treatments"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md shadow-teal-600/20 transition-all hover:gap-3 active:scale-95 cursor-pointer self-start md:self-auto"
            >
              <span>View All Treatments</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredTreatments.map((treatment) => (
              <div
                key={treatment.id}
                className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mb-4 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-display font-bold text-slate-900 mb-2">
                    {treatment.name}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
                    {treatment.desc}
                  </p>
                </div>
                <Link
                  to={`/treatments/${treatment.id}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:text-teal-900 pt-2 border-t border-slate-100"
                >
                  <span>Learn More &amp; Details</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. Featured Testimonials Section ───────────────────────────────── */}
      <section className="py-16 sm:py-24 bg-white border-t border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-700 text-xs font-semibold uppercase tracking-wider mb-3">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>Patient Feedback</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900 tracking-tight">
                Trusted by 5,000+ Happy Patients
              </h2>
            </div>
            <Link
              to="/reviews"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition-all hover:gap-3 active:scale-95 cursor-pointer self-start md:self-auto"
            >
              <span>View All Reviews</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredReviews.map((rev, idx) => (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed italic mb-4">
                    &ldquo;{rev.comment}&rdquo;
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{rev.name}</h4>
                    <p className="text-[10px] text-teal-700 font-semibold">{rev.treatment} • {rev.location}</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-teal-600 text-white font-bold text-xs flex items-center justify-center">
                    {rev.initials}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. Compact Clinic Preview Section ───────────────────────────────── */}
      <section className="py-16 sm:py-24 bg-slate-50 border-t border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-700 text-xs font-semibold uppercase tracking-wider mb-3">
                <MapPin className="w-3.5 h-3.5" />
                <span>Clinic Centers</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900 tracking-tight">
                Visit Our Clinical Studios
              </h2>
            </div>
            <Link
              to="/clinics"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md transition-all hover:gap-3 active:scale-95 cursor-pointer self-start md:self-auto"
            >
              <span>View All Clinics</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {compactClinics.map((item) => (
              <div
                key={item.slug}
                className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-md flex flex-col justify-between space-y-4"
              >
                <div>
                  <h3 className="text-lg sm:text-xl font-display font-bold text-slate-900 mb-2">
                    {item.name}
                  </h3>
                  <p className="text-xs text-slate-600 mb-2 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-teal-600 shrink-0" />
                    <span>
                      {item.slug === CLINIC_SLUGS.NABADWIP
                        ? "Bhumi Apartment 2, Oladebitala Bazar, Nabadwip, Nadia, West Bengal"
                        : "Belerhat Main Road, Near Railway Station, Purba Bardhaman"}
                    </span>
                  </p>
                  <p className="text-xs text-teal-700 font-semibold flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-teal-600 shrink-0" />
                    <span>{item.openDaysText}</span>
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-3">
                  <a
                    href={`tel:${PRIMARY_PHONE_NUMBER}`}
                    className="flex-1 min-w-[120px] h-10 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-teal-100 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-teal-600" />
                    <span>Call Center</span>
                  </a>
                  <a
                    href={item.mapLink}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 min-w-[120px] h-10 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-slate-800 transition-colors"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Get Directions</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. Final Large Premium CTA Section ─────────────────────────────── */}
      <section className="py-16 sm:py-24 bg-gradient-to-br from-[#062A20] via-[#0B3D30] to-[#041B15] text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-semibold uppercase tracking-wider">
            <Calendar className="w-4 h-4" />
            <span>Prioritize Your Oral Health</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-display font-extrabold tracking-tight text-white leading-tight">
            Ready to Experience Pain-Free Dental Excellence?
          </h2>

          <p className="text-base sm:text-lg text-teal-100/90 max-w-2xl mx-auto leading-relaxed font-light">
            Book your consultation online with Dr. Nilay Saha or contact our reception desk for immediate appointment confirmation.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/book-appointment"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-base shadow-xl shadow-teal-500/20 transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center text-center"
            >
              Book Appointment Online
            </Link>

            <a
              href={`tel:${PRIMARY_PHONE_NUMBER}`}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-base transition-colors flex items-center justify-center gap-2"
            >
              <Phone className="w-5 h-5 text-teal-400" />
              <span>Call Now: {PRIMARY_PHONE_DISPLAY}</span>
            </a>

            <a
              href={buildWhatsAppUrl()}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-base shadow-lg transition-colors flex items-center justify-center gap-2"
            >
              <WhatsAppIcon className="w-5 h-5" />
              <span>WhatsApp Direct</span>
            </a>
          </div>
        </div>
      </section>

      {/* ── 8. Premium Footer ──────────────────────────────────────────────── */}
      <Footer />

      {/* Global Booking Modal & WhatsApp Floating FAB */}
      <ContactModal />

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
