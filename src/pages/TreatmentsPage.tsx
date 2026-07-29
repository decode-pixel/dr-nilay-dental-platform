import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Treatments from "../components/Treatments";
import ContactModal from "../components/ContactModal";
import SEO from "../components/SEO";
import { WhatsAppIcon } from "../components/Icons";
import { buildWhatsAppUrl } from "../lib/constants";
import { Sparkles, ShieldCheck, Clock, Award, Stethoscope } from "lucide-react";

export default function TreatmentsPage() {
  return (
    <div className="min-h-screen font-sans bg-slate-50 text-slate-900 overflow-x-hidden selection:bg-teal-500/30">
      <SEO 
        title="Dental Treatments & Clinical Procedures — Dr. Nilay Saha" 
        description="Explore comprehensive dental care procedures by Dr. Nilay Saha (BDS): Painless Root Canals, Laser Whitening, Tooth Extractions, Cosmetic Smile Design, Dental Implants, and Scaling across Belerhat & Nabadwip."
      />
      <Navbar />

      <main className="pt-28 pb-16 sm:pt-32 sm:pb-24">
        {/* Editorial Treatments Header */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 sm:mb-16">
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#07241C] via-[#0D4033] to-[#041913] text-white relative overflow-hidden shadow-2xl border border-teal-500/20">
            <div className="absolute -right-20 -top-20 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-3xl relative z-10 space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-semibold uppercase tracking-wider">
                <Stethoscope className="w-3.5 h-3.5" />
                <span>Specialized Clinical Procedures</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-display font-extrabold tracking-tight text-white leading-tight">
                Advanced Endodontics &amp; Comprehensive Dental Care
              </h1>
              <p className="text-base sm:text-lg text-teal-100/90 leading-relaxed font-light">
                From pain-free single-visit root canals to modern digital RVG X-ray diagnostics and cosmetic smile restoration, explore our full suite of verified dental treatments.
              </p>
            </div>
          </div>
        </section>

        {/* Treatments Component with Filter Tabs & Full Catalog */}
        <Treatments />
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
