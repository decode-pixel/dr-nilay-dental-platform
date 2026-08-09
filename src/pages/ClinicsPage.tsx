import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Clinics from "../components/Clinics";
import ContactModal from "../components/ContactModal";
import SEO from "../components/SEO";
import { WhatsAppIcon } from "../components/Icons";
import { buildWhatsAppUrl } from "../lib/constants";
import { MapPin, Navigation, Clock, ShieldCheck } from "lucide-react";

export default function ClinicsPage() {
  return (
    <div className="min-h-screen font-sans bg-[#F6F9F8] text-slate-900 overflow-x-hidden selection:bg-teal-500/30">
      <SEO 
        title="Our Regional Dental Clinics — Nabadwip & Belerhat Centers" 
        description="Visit Dr. Nilay Saha Dental Care centers in Nabadwip (Bhumi Apartment 2, Oladebitala Bazar) and Belerhat (Main Road, Opp. Railway Station). Check timings, directions, and pre-book consultations."
      />
      <Navbar />

      <main className="pt-28 pb-16 sm:pt-32 sm:pb-24">
        {/* Editorial Clinics Header */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 sm:mb-16">
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#062920] via-[#0B3B2F] to-[#041A14] text-white relative overflow-hidden shadow-2xl border border-teal-500/20">
            <div className="absolute -right-20 -top-20 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-3xl relative z-10 space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-semibold uppercase tracking-wider">
                <MapPin className="w-3.5 h-3.5" />
                <span>Regional Clinical Practice Centers</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-display font-extrabold tracking-tight text-white leading-tight">
                State-of-the-Art Dental Studios in Nabadwip &amp; Belerhat
              </h1>
              <p className="text-base sm:text-lg text-teal-100/90 leading-relaxed font-light">
                Both centers strictly adhere to WHO Class-B autoclave sterilization protocols, digital RVG diagnostics, and pre-booked patient consultations.
              </p>
            </div>
          </div>
        </section>

        {/* Full Clinics Component */}
        <Clinics />
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
