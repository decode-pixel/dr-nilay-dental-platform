import React from "react";
import { CalendarDays, Star, Shield, Award, CheckCircle2, ChevronRight, Activity, Smile, Phone } from "lucide-react";
import { ToothIcon } from "./Icons";
import { DOCTOR_REGISTRATION_NUMBER, PRIMARY_PHONE_NUMBER } from "../lib/constants";

/**
 * Hero — Apple / Linear / Stripe-Caliber Healthcare Experience
 * 
 * DESIGN SPEC:
 * - Clean Soft White (#FCFCFD) background with subtle emerald radial accents
 * - Large bold H1 headline (56-64px) + readable 18px supporting copy
 * - Primary green gradient CTA + Secondary white border CTA
 * - Doctor/Clinic Credentials Card + Floating Trust Cards + Verified Review Snippet
 * - Immediate Emergency contact banner
 * - Zero heavy blur-filter layout shift, instant 60fps mount
 */

const credentialRows = [
  { icon: Award, label: "Degree Qualification", value: "BDS", iconColor: "text-amber-500" },
  { icon: Shield, label: "State Medical License", value: DOCTOR_REGISTRATION_NUMBER, iconColor: "text-[#10B981]" },
  { icon: Activity, label: "Clinical Practice", value: "10+ Years Exp.", iconColor: "text-emerald-600" },
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
    <section
      id="home"
      className="relative pt-24 sm:pt-32 pb-16 sm:pb-24 font-sans overflow-hidden bg-[#FCFCFD]"
    >
      {/* Subtle ambient light gradient accent */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-32 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-emerald-500/10 via-emerald-400/5 to-transparent rounded-full blur-3xl opacity-80" />
        <div className="absolute top-1/3 -right-20 w-[450px] h-[450px] bg-gradient-to-tl from-emerald-500/8 via-teal-400/5 to-transparent rounded-full blur-3xl opacity-70" />
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16 relative z-20 max-w-7xl mx-auto px-5 sm:px-8">

        {/* Left Column: Headline, Copy & CTAs */}
        <div className="w-full lg:w-[54%] flex flex-col items-start order-1" style={{ animation: "heroFadeUp 0.6s ease-out both" }}>

          {/* Trust Banner & Review Snippet */}
          <div className="inline-flex flex-wrap items-center gap-2.5 px-4 py-2 rounded-full mb-8 bg-emerald-50/90 border border-emerald-200/80 shadow-sm cursor-default">
            <div className="flex items-center gap-1 text-amber-500">
              <Star className="w-4 h-4 fill-amber-400" />
              <Star className="w-4 h-4 fill-amber-400" />
              <Star className="w-4 h-4 fill-amber-400" />
              <Star className="w-4 h-4 fill-amber-400" />
              <Star className="w-4 h-4 fill-amber-400" />
            </div>
            <span className="text-xs sm:text-sm font-bold text-[#122820]">4.9 ★★★★★</span>
            <span className="text-xs text-[#4B6358] font-medium border-l border-emerald-200 pl-2.5">
              5,000+ Verified Patient Reviews
            </span>
          </div>

          {/* Large Bold Headline */}
          <h1 className="h1-premium mb-6">
            Advanced, Pain-Free <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10B981] to-[#059669]">
              Dental Care
            </span>{" "}
            You Can Trust
          </h1>

          {/* Supporting Copy */}
          <p className="body-premium max-w-xl mb-8">
            Experience fellowship-trained precision in endodontics, oral surgery, and aesthetic restorations. Tailored, gentle dental treatments delivered with modern technology across 3 regional centers.
          </p>

          {/* Primary & Secondary CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-10 w-full sm:w-auto">
            <button
              onClick={handleBooking}
              className="btn-primary-premium w-full sm:w-auto"
            >
              <CalendarDays className="w-4.5 h-4.5 text-emerald-100 shrink-0" />
              <span>Book Appointment</span>
            </button>

            <a
              href="#treatments"
              onClick={(e) => handleScrollTo(e, "treatments")}
              className="btn-secondary-premium w-full sm:w-auto"
            >
              <span>Explore Treatments</span>
              <ChevronRight className="w-4 h-4 text-[#4B6358]" />
            </a>
          </div>

          {/* Emergency Contact Banner */}
          <div className="w-full sm:w-auto flex items-center gap-3.5 px-5 py-3.5 rounded-2xl bg-rose-50/90 border border-rose-200/80 shadow-sm">
            <div className="w-3 h-3 rounded-full bg-rose-500 animate-pulse shrink-0" />
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-xs sm:text-sm">
              <span className="font-bold text-rose-900">Immediate Dental Emergency?</span>
              <a
                href={`tel:${PRIMARY_PHONE_NUMBER}`}
                className="font-bold text-rose-600 hover:text-rose-700 underline underline-offset-4 flex items-center gap-1.5 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 shrink-0" />
                <span>Call {PRIMARY_PHONE_NUMBER}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Doctor & Clinic Credentials Card + Floating Trust Emblems */}
        <div
          className="w-full lg:w-[46%] flex flex-col items-center justify-center relative order-2 mt-4 lg:mt-0"
          style={{ animation: "heroFadeUp 0.7s ease-out 0.15s both" }}
        >
          <div className="relative w-full max-w-md sm:max-w-lg lg:max-w-[440px] z-10 space-y-5">
            
            {/* Main Clinical Authority Card */}
            <div className="card-premium p-8 relative overflow-hidden">
              {/* Top accent glow */}
              <div className="absolute top-0 inset-x-0 h-[4px] bg-gradient-to-r from-transparent via-[#10B981] to-transparent" />

              {/* Doctor Header */}
              <div className="flex items-center gap-4 border-b border-slate-100 pb-6 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#10B981] shrink-0 shadow-sm">
                  <ToothIcon className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-display font-bold text-[#122820]">Dr. Nilay Saha</h3>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100/80 text-[#10B981] text-[11px] font-bold tracking-wider uppercase">
                      Verified
                    </span>
                  </div>
                  <p className="text-xs text-[#4B6358] font-bold mt-1 uppercase tracking-wider">
                    Principal Dental Surgeon & Oral Physician
                  </p>
                </div>
              </div>

              {/* Credential Rows */}
              <div className="space-y-3 mb-6">
                {credentialRows.map((row, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/60"
                  >
                    <div className="flex items-center gap-3">
                      <row.icon className={`w-4.5 h-4.5 ${row.iconColor} shrink-0`} />
                      <span className="text-xs sm:text-sm font-semibold text-[#2C4238]">{row.label}</span>
                    </div>
                    <span className="text-xs sm:text-sm font-bold font-mono text-[#10B981]">{row.value}</span>
                  </div>
                ))}
              </div>

              {/* Active Regional Centers Footnote */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs text-[#4B6358]">
                <span className="font-semibold text-[#122820]">Active Clinic Locations:</span>
                <span className="font-medium text-[#10B981]">Belerhat • Parulia • Nabadwip</span>
              </div>
            </div>

            {/* Floating Trust Cards Grid */}
            <div className="grid grid-cols-2 gap-3.5">
              <div className="card-premium p-4 flex items-center gap-3 bg-gradient-to-br from-white to-emerald-50/40">
                <div className="w-10 h-10 rounded-xl bg-emerald-100/70 border border-emerald-200/80 flex items-center justify-center shrink-0 text-[#10B981]">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#122820]">100% Painless Care</h4>
                  <p className="text-[11px] text-[#4B6358]">Gentle endodontics</p>
                </div>
              </div>

              <div className="card-premium p-4 flex items-center gap-3 bg-gradient-to-br from-white to-emerald-50/40">
                <div className="w-10 h-10 rounded-xl bg-emerald-100/70 border border-emerald-200/80 flex items-center justify-center shrink-0 text-[#10B981]">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#122820]">Hospital Hygiene</h4>
                  <p className="text-[11px] text-[#4B6358]">WHO sterilization</p>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

      <style>{`
        @keyframes heroFadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
