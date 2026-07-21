import React from "react";
import { CalendarDays, Star, Shield, Award, Activity, ChevronRight, Phone, Clock, MapPin } from "lucide-react";
import { ToothIcon } from "./Icons";
import { DOCTOR_REGISTRATION_NUMBER, PRIMARY_PHONE_NUMBER } from "../lib/constants";

/**
 * Hero — Awwwards Luxury Architecture & Floating Glass Booking Pill
 * Preserving 100% existing text, copy, data, buttons, and booking handlers.
 */

const credentialRows = [
  { icon: Award, label: "Degree Qualification", value: "BDS", iconColor: "text-amber-400" },
  { icon: Shield, label: "State Medical License", value: DOCTOR_REGISTRATION_NUMBER, iconColor: "text-[#10B981]" },
  { icon: Activity, label: "Clinical Mastery", value: "10+ Years Exp.", iconColor: "text-cyan-400" },
];

export default function Hero() {
  const handleBooking = (e: React.MouseEvent) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent("openContactModal"));
  };

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      const offset = 110;
      const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
    }
  };

  return (
    <section id="home" className="relative font-sans pt-2 sm:pt-4 pb-16 sm:pb-24">
      
      {/* ── Top Arched Dark Luxury Container (Reference Design Inspired) ──── */}
      <div className="mx-3 sm:mx-6 lg:mx-8 bg-gradient-to-b from-[#06131E] via-[#091D2A] to-[#07241B] text-white arch-hero-top pt-28 sm:pt-36 pb-28 sm:pb-36 px-5 sm:px-10 relative overflow-hidden shadow-[0_24px_80px_rgba(6,19,30,0.4)] border border-white/10">
        
        {/* Subtle 3D Crystal Tooth Vector Accent */}
        <div className="absolute top-12 right-12 opacity-15 pointer-events-none hidden lg:block animate-pulse">
          <div className="w-72 h-72 rounded-full border border-emerald-500/30 flex items-center justify-center glow-cyan">
            <ToothIcon className="w-40 h-40 text-emerald-400" />
          </div>
        </div>

        {/* Soft Ambient Radial Lights */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[450px] h-[450px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16 relative z-10">

          {/* Left Column: Headline & Primary Action */}
          <div className="w-full lg:w-[54%] flex flex-col items-start text-left">
            
            {/* Trust Snippet Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full mb-6 glass-dark-luxury cursor-default">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                ))}
              </div>
              <span className="text-xs font-bold text-white">4.9 ★★★★★</span>
              <span className="text-xs text-emerald-200/80 font-medium border-l border-white/15 pl-2.5">
                5,000+ Verified Patient Reviews
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-[40px] sm:text-[56px] lg:text-[64px] font-display font-bold tracking-tight text-white leading-[1.08] mb-6">
              Advanced, Pain-Free <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10B981] via-teal-300 to-cyan-400">
                Dental Care
              </span>{" "}
              You Can Trust
            </h1>

            {/* Subtext */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl mb-8">
              Experience fellowship-trained precision in endodontics, oral surgery, and aesthetic restorations. Tailored, gentle dental treatments delivered with modern technology across 3 regional centers.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-6">
              <button
                type="button"
                onClick={handleBooking}
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-[#10B981] to-[#059669] text-white font-semibold text-sm shadow-[0_4px_25px_rgba(16,185,129,0.4)] hover:shadow-[0_6px_35px_rgba(16,185,129,0.6)] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <CalendarDays className="w-4.5 h-4.5 text-emerald-100" />
                <span>Book Appointment</span>
              </button>

              <a
                href="#treatments"
                onClick={(e) => handleScrollTo(e, "treatments")}
                className="w-full sm:w-auto px-8 py-4 rounded-full glass-dark-luxury text-white font-semibold text-sm hover:bg-white/20 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <span>Explore Treatments</span>
                <ChevronRight className="w-4 h-4 text-emerald-300" />
              </a>
            </div>

            {/* Emergency Line */}
            <div className="inline-flex items-center gap-2.5 text-xs text-rose-300 bg-rose-950/40 border border-rose-500/30 px-4 py-2 rounded-full">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              <span>Dental Emergency? Call <a href={`tel:${PRIMARY_PHONE_NUMBER}`} className="font-bold underline text-rose-200">{PRIMARY_PHONE_NUMBER}</a></span>
            </div>

          </div>

          {/* Right Column: Floating Doctor Credentials Card */}
          <div className="w-full lg:w-[42%] relative z-10">
            <div className="glass-dark-luxury rounded-3xl p-7 border border-white/15 shadow-2xl relative">
              <div className="flex items-center gap-4 border-b border-white/10 pb-5 mb-5">
                <div className="w-13 h-13 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-[#10B981] shrink-0">
                  <ToothIcon className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-display font-bold text-white">Dr. Nilay Saha</h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[10px] font-bold uppercase tracking-wider">
                      Verified
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 font-medium mt-0.5">
                    Principal Dental Surgeon & Oral Physician
                  </p>
                </div>
              </div>

              {/* Credentials Grid */}
              <div className="space-y-2.5 mb-5">
                {credentialRows.map((row, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-xl bg-white/[0.05] border border-white/10"
                  >
                    <div className="flex items-center gap-2.5">
                      <row.icon className={`w-4 h-4 ${row.iconColor} shrink-0`} />
                      <span className="text-xs font-medium text-slate-200">{row.label}</span>
                    </div>
                    <span className="text-xs font-bold font-mono text-emerald-300">{row.value}</span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
                <span className="font-semibold text-slate-400">Centers:</span>
                <span className="font-medium text-emerald-300">Belerhat • Parulia • Nabadwip</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── Overlapping Floating Appointment Bar (Reference Design Layout) ── */}
      <div className="-mt-14 sm:-mt-16 max-w-5xl mx-auto px-5 relative z-30">
        <div className="glass-luxury rounded-2xl sm:rounded-full p-4 sm:p-5 border border-white/90 shadow-[0_20px_50px_rgba(6,19,30,0.12)] flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Item 1: Service */}
          <div className="flex items-center gap-3.5 px-3 py-1 text-left w-full sm:w-auto">
            <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-[#10B981] shrink-0">
              <ToothIcon className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-[#4B6358] uppercase font-bold tracking-wider block">Clinical Service</span>
              <span className="text-sm font-bold text-[#122820]">Root Canal & Aesthetic Dentistry</span>
            </div>
          </div>

          <div className="hidden md:block w-px h-8 bg-slate-200" />

          {/* Item 2: Working Hours */}
          <div className="flex items-center gap-3.5 px-3 py-1 text-left w-full sm:w-auto">
            <div className="w-10 h-10 rounded-full bg-cyan-50 border border-cyan-200/80 flex items-center justify-center text-cyan-600 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-[#4B6358] uppercase font-bold tracking-wider block">Consultation Hours</span>
              <span className="text-sm font-bold text-[#122820]">10:00 AM – 8:30 PM (Mon-Sat)</span>
            </div>
          </div>

          <div className="hidden md:block w-px h-8 bg-slate-200" />

          {/* Item 3: Direct Phone */}
          <div className="flex items-center gap-3.5 px-3 py-1 text-left w-full sm:w-auto">
            <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-[#10B981] shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-[#4B6358] uppercase font-bold tracking-wider block">Priority Line</span>
              <span className="text-sm font-bold text-[#122820]">{PRIMARY_PHONE_NUMBER}</span>
            </div>
          </div>

          {/* Action */}
          <button
            type="button"
            onClick={handleBooking}
            className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-[#122820] hover:bg-[#10B981] text-white font-bold text-xs uppercase tracking-wider transition-all duration-300 shrink-0 shadow-sm cursor-pointer"
          >
            Book Appointment
          </button>

        </div>
      </div>

    </section>
  );
}
