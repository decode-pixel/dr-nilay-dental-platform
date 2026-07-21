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
      <div className="mx-3 sm:mx-6 lg:mx-8 bg-gradient-to-b from-[#06131E] via-[#091D2A] to-[#07241B] text-white arch-hero-top pt-32 sm:pt-40 pb-32 sm:pb-40 px-5 sm:px-10 lg:px-14 relative overflow-hidden shadow-[0_28px_90px_rgba(6,19,30,0.45)] border border-white/12">
        
        {/* Subtle 3D Crystal Tooth Vector Accent */}
        <div className="absolute top-10 right-10 opacity-15 pointer-events-none hidden lg:block animate-pulse duration-7000">
          <div className="w-80 h-80 rounded-full border border-emerald-500/35 flex items-center justify-center glow-cyan">
            <ToothIcon className="w-44 h-44 text-emerald-400" />
          </div>
        </div>

        {/* Soft Ambient Radial Lights */}
        <div className="absolute top-0 left-1/4 w-[550px] h-[550px] bg-emerald-500/12 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[480px] h-[480px] bg-cyan-500/12 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16 relative z-10">

          {/* Left Column: Headline & Primary Action */}
          <div className="w-full lg:w-[55%] flex flex-col items-start text-left">
            
            {/* Trust Snippet Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full mb-6 glass-dark-crystal cursor-default border border-white/20 shadow-sm hover:border-emerald-500/40 transition-colors">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                ))}
              </div>
              <span className="text-xs font-bold text-white tracking-wide">4.9 ★★★★★</span>
              <span className="text-xs text-emerald-200/80 font-medium border-l border-white/15 pl-2.5">
                5,000+ Verified Patient Reviews
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-[42px] sm:text-[58px] lg:text-[66px] font-display font-bold tracking-tight text-white leading-[1.06] mb-6">
              Advanced, Pain-Free <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10B981] via-teal-300 to-cyan-400 drop-shadow-sm">
                Dental Care
              </span>{" "}
              You Can Trust
            </h1>

            {/* Subtext */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl mb-7">
              Experience fellowship-trained precision in endodontics, oral surgery, and aesthetic restorations. Tailored, gentle dental treatments delivered with modern technology across 3 regional centers.
            </p>

            {/* Floating Crystal Chips Row */}
            <div className="flex flex-wrap gap-2.5 mb-8">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-white/10 text-emerald-300 border border-emerald-500/30 backdrop-blur-md">
                <span>🎓 BDS & Endodontic Specialist</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-white/10 text-cyan-300 border border-cyan-500/30 backdrop-blur-md">
                <span>🏆 FIE Fellow</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-white/10 text-emerald-200 border border-white/15 backdrop-blur-md">
                <span>🛡️ WBDC Reg 4858-A</span>
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-6">
              <button
                type="button"
                onClick={handleBooking}
                className="w-full sm:w-auto btn-crystal px-8 py-4 text-sm font-bold shadow-[0_8px_30px_rgba(16,185,129,0.4)] cursor-pointer"
              >
                <CalendarDays className="w-4.5 h-4.5 text-emerald-100" />
                <span>Book Appointment</span>
              </button>

              <a
                href="#treatments"
                onClick={(e) => handleScrollTo(e, "treatments")}
                className="w-full sm:w-auto px-8 py-4 rounded-full glass-dark-crystal text-white font-semibold text-sm hover:bg-white/20 transition-all duration-300 flex items-center justify-center gap-2 border border-white/20"
              >
                <span>Explore Treatments</span>
                <ChevronRight className="w-4 h-4 text-emerald-300" />
              </a>
            </div>

            {/* Emergency Line */}
            <div className="inline-flex items-center gap-2.5 text-xs text-rose-300 bg-rose-950/50 border border-rose-500/40 px-4.5 py-2 rounded-full shadow-sm">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              <span>Dental Emergency? Call <a href={`tel:${PRIMARY_PHONE_NUMBER}`} className="font-bold underline text-rose-200">{PRIMARY_PHONE_NUMBER}</a></span>
            </div>

          </div>

          {/* Right Column: Floating Doctor Credentials Card */}
          <div className="w-full lg:w-[42%] relative z-10">
            <div className="glass-dark-crystal rounded-3xl p-7 sm:p-8 border border-white/20 shadow-[0_25px_75px_rgba(0,0,0,0.6)] relative overflow-hidden group hover:border-emerald-500/40 transition-all duration-300">
              
              <div className="flex items-center gap-4 border-b border-white/12 pb-5 mb-5 relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/30 to-emerald-500/10 border border-emerald-400/50 flex items-center justify-center text-[#10B981] shrink-0 shadow-inner group-hover:scale-105 transition-transform">
                  <ToothIcon className="w-7 h-7 text-emerald-400" />
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
              <div className="space-y-3 mb-5 relative z-10">
                {credentialRows.map((row, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.06] border border-white/10 hover:bg-white/[0.09] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <row.icon className={`w-4.5 h-4.5 ${row.iconColor} shrink-0`} />
                      <span className="text-xs sm:text-sm font-medium text-slate-200">{row.label}</span>
                    </div>
                    <span className="text-xs sm:text-sm font-bold font-mono text-emerald-300">{row.value}</span>
                  </div>
                ))}
              </div>

              <div className="pt-3.5 border-t border-white/12 flex items-center justify-between text-xs text-slate-300 relative z-10">
                <span className="font-semibold text-slate-400">Centers:</span>
                <span className="font-bold text-emerald-300 tracking-wide">Belerhat • Parulia • Nabadwip</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── Overlapping Floating Appointment Bar (V2 Crystal Glass) ── */}
      <div className="-mt-14 sm:-mt-18 max-w-5xl mx-auto px-5 relative z-30">
        <div className="glass-crystal rounded-2xl sm:rounded-full p-4 sm:p-5 border border-white/95 shadow-[0_25px_65px_rgba(6,19,30,0.11)] flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Item 1: Service */}
          <div className="flex items-center gap-3.5 px-3 py-1 text-left w-full sm:w-auto">
            <div className="w-11 h-11 rounded-full bg-emerald-50 border border-emerald-200/90 flex items-center justify-center text-[#10B981] shrink-0 shadow-sm">
              <ToothIcon className="w-5.5 h-5.5" />
            </div>
            <div>
              <span className="text-[11px] text-[#4B6358] uppercase font-bold tracking-wider block">Clinical Service</span>
              <span className="text-sm font-bold text-[#122820]">Root Canal & Aesthetic Dentistry</span>
            </div>
          </div>

          <div className="hidden md:block w-px h-8 bg-slate-200/80" />

          {/* Item 2: Working Hours */}
          <div className="flex items-center gap-3.5 px-3 py-1 text-left w-full sm:w-auto">
            <div className="w-11 h-11 rounded-full bg-cyan-50 border border-cyan-200/90 flex items-center justify-center text-cyan-600 shrink-0 shadow-sm">
              <Clock className="w-5.5 h-5.5" />
            </div>
            <div>
              <span className="text-[11px] text-[#4B6358] uppercase font-bold tracking-wider block">Consultation Hours</span>
              <span className="text-sm font-bold text-[#122820]">10:00 AM – 8:30 PM (Mon-Sat)</span>
            </div>
          </div>

          <div className="hidden md:block w-px h-8 bg-slate-200/80" />

          {/* Item 3: Direct Phone */}
          <div className="flex items-center gap-3.5 px-3 py-1 text-left w-full sm:w-auto">
            <div className="w-11 h-11 rounded-full bg-emerald-50 border border-emerald-200/90 flex items-center justify-center text-[#10B981] shrink-0 shadow-sm">
              <Phone className="w-5.5 h-5.5" />
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
            className="w-full sm:w-auto btn-crystal px-7 py-4 text-xs font-bold uppercase tracking-wider shrink-0 cursor-pointer shadow-md"
          >
            <span>Book Appointment</span>
          </button>

        </div>
      </div>

    </section>
  );
}
