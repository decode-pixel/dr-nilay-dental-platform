import React, { useState, useEffect } from "react";
import { CalendarDays, Star, Shield, Award, CheckCircle2, ChevronRight, Activity, Smile } from "lucide-react";
import { ToothIcon, WhatsAppIcon } from "./Icons";
import { DOCTOR_REGISTRATION_NUMBER, PRIMARY_PHONE_NUMBER, PRIMARY_WHATSAPP_DIGITS } from "../lib/constants";

/**
 * Hero — Performance-First Rebuild
 * 
 * REMOVED:
 * - All motion.div infinite animations (particles, spotlights, background blobs)
 * - backdrop-blur-xl on credentials card (GPU-heavy on mobile)
 * - 4 concurrent Supabase network calls on mount (CmsService, SettingsService, DoctorService x2)
 * - motion.div stagger animation container (causes layout thrashing on low-end phones)
 * - OptimizedImage / OptimizedVideo imports (unused)
 * 
 * REPLACED WITH:
 * - CSS-only fade-in animation via @keyframes (zero JS, 60fps)
 * - Static hardcoded content from constants (instant render, no loading flash)
 * - Pure div backgrounds (no filter: blur)
 */

const trustBarItems = [
  { label: "Happy Patients", val: "5000+", icon: Smile },
  { label: "Years Experience", val: "10+", icon: Award },
  { label: "Clinic Locations", val: "3", icon: CheckCircle2 },
  { label: "Digital Dentistry", val: "100%", icon: Shield }
];

const credentialRows = [
  { icon: Award, label: "Degree Qualification", value: "BDS", iconColor: "text-[#C5A059]" },
  { icon: Shield, label: "State Medical License", value: DOCTOR_REGISTRATION_NUMBER, iconColor: "text-[#10B981]" },
  { icon: Activity, label: "Clinical Practice", value: "10+ Years Exp.", iconColor: "text-[#34D399]" },
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
    <div
      className="relative pt-12 sm:pt-16 pb-20 lg:pb-24 font-sans overflow-hidden"
      style={{ background: "linear-gradient(160deg, #061D15 0%, #09281D 55%, #0C3326 100%)", color: "#F4F7F4" }}
    >
      {/* Static ambient background — no motion, no blur filter */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        <div style={{
          position: "absolute", top: "-10%", left: "30%",
          width: "500px", height: "500px",
          background: "radial-gradient(circle, rgba(16,185,129,0.18) 0%, rgba(197,160,89,0.08) 50%, transparent 75%)",
          borderRadius: "50%",
        }} />
        <div style={{
          position: "absolute", top: "30%", left: "-5%",
          width: "380px", height: "380px",
          background: "radial-gradient(circle, rgba(52,211,153,0.12) 0%, transparent 70%)",
          borderRadius: "50%",
        }} />
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: "40%",
          background: "linear-gradient(180deg, rgba(255,255,255,0.04) 0%, transparent 100%)",
        }} />
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-10 relative z-20 max-w-7xl mx-auto px-5 sm:px-8">

        {/* Left Column */}
        <div className="w-full lg:w-[55%] flex flex-col items-start order-1" style={{ animation: "heroFadeUp 0.6s ease-out both" }}>

          {/* Tag Pill */}
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 border border-[#10B981]/30 cursor-default"
            style={{ background: "rgba(10,41,30,0.9)" }}
          >
            <Star className="w-3.5 h-3.5 text-[#C5A059] fill-[#C5A059]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#F4F7F4]">Urban Dental Studio Experience</span>
          </div>

          {/* Headline */}
          <h1 className="text-[42px] sm:text-[58px] lg:text-[66px] font-display font-extrabold leading-[1.06] tracking-tight mb-6">
            <span className="block text-[#F4F7F4]">Healthy Smile</span>
            <span className="block text-[#F4F7F4]">Starts</span>
            <span
              className="block"
              style={{ WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", backgroundImage: "linear-gradient(90deg, #10B981, #34D399, #C5A059)" }}
            >
              Here
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-[#A2C7B7] text-base sm:text-lg max-w-xl mb-8 leading-[1.7] font-normal">
            Modern dental care with advanced technology, gentle treatment, and over 10 years of clinical experience for patients of every age.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-8 w-full sm:w-auto">
            <button
              onClick={handleBooking}
              className="group w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-full text-white font-semibold text-base active:scale-[0.98] transition-transform duration-150"
              style={{ background: "linear-gradient(135deg, #10B981, #059669)", boxShadow: "0 4px 20px rgba(16,185,129,0.38)" }}
            >
              <CalendarDays className="w-5 h-5 text-emerald-100 shrink-0" />
              <span>Book Appointment</span>
            </button>

            <a
              href="#treatments"
              onClick={(e) => handleScrollTo(e, "treatments")}
              className="group w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-base border border-[#10B981]/30 text-[#F4F7F4] transition-colors duration-200 hover:border-[#10B981]/60"
              style={{ background: "rgba(10,41,30,0.5)" }}
            >
              <span>Explore Treatments</span>
              <ChevronRight className="w-4 h-4 text-[#A2C7B7]" />
            </a>
          </div>

          {/* Emergency Banner */}
          <div
            className="mb-10 flex items-center gap-3 px-5 py-3.5 rounded-2xl w-full sm:w-auto justify-center sm:justify-start border border-rose-500/30"
            style={{ background: "rgba(29,12,18,0.8)" }}
          >
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse flex-shrink-0" />
            <span className="text-sm font-semibold text-rose-200">
              Dental Emergency?{" "}
              <a href={`tel:${PRIMARY_PHONE_NUMBER}`} className="text-rose-400 font-bold hover:text-rose-300 transition-colors">
                Call Now {PRIMARY_PHONE_NUMBER}
              </a>
            </span>
          </div>

          {/* Trust Bar — Desktop Only */}
          <div className="w-full hidden lg:grid grid-cols-4 gap-4">
            {trustBarItems.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl flex flex-col justify-between border border-emerald-500/25"
                style={{ background: "rgba(10,38,29,0.8)" }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-[#A2C7B7] tracking-wide uppercase">{item.label}</span>
                  <item.icon className="w-4 h-4 text-[#10B981]" />
                </div>
                <span className="text-2xl sm:text-3xl font-display font-extrabold text-[#F4F7F4]">{item.val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Credentials Card — NO backdrop-blur */}
        <div
          className="w-full lg:w-[45%] flex flex-col items-center justify-center lg:items-end relative mt-6 lg:mt-0 order-3 lg:order-2"
          style={{ animation: "heroFadeUp 0.7s ease-out 0.15s both" }}
        >
          <div className="relative w-full max-w-md sm:max-w-lg lg:max-w-[420px] z-10 space-y-4">
            {/* Credentials Card — solid bg, no blur */}
            <div
              className="relative w-full rounded-[2.2rem] border border-[#10B981]/30 p-7 space-y-6"
              style={{ background: "rgba(9,40,29,0.98)", boxShadow: "0 20px 60px rgba(0,0,0,0.35)" }}
            >
              {/* Top accent line */}
              <div className="absolute top-0 inset-x-0 h-[3px] rounded-t-[2.2rem]" style={{ background: "linear-gradient(90deg, transparent, #10B981, transparent)" }} />

              {/* Doctor Header */}
              <div className="flex items-center gap-4 border-b border-[#10B981]/20 pb-5">
                <div className="w-14 h-14 rounded-2xl bg-[#10B981]/20 border border-[#10B981]/40 flex items-center justify-center text-[#10B981] shrink-0">
                  <ToothIcon className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-xl font-display font-bold text-[#F4F7F4] leading-tight">Dr. Nilay Saha</h3>
                  <p className="text-xs text-[#34D399] font-bold mt-1 uppercase tracking-wider">Dental Surgeon & Oral Physician</p>
                </div>
              </div>

              {/* Credential Rows */}
              <div className="space-y-3">
                {credentialRows.map((row, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3.5 rounded-xl border border-emerald-900/40"
                    style={{ background: "rgba(6,29,21,1)" }}
                  >
                    <div className="flex items-center gap-3">
                      <row.icon className={`w-4 h-4 ${row.iconColor} shrink-0`} />
                      <span className="text-xs font-semibold text-[#F4F7F4]">{row.label}</span>
                    </div>
                    <span className="text-xs font-bold font-mono text-[#34D399]">{row.value}</span>
                  </div>
                ))}
              </div>

              {/* Active Centers */}
              <div className="pt-2 border-t border-[#10B981]/20 flex items-center justify-between text-xs text-[#A2C7B7]">
                <span className="font-medium">Active Centers:</span>
                <span className="font-bold text-[#F4F7F4]">Belerhat • Parulia • Nabadwip</span>
              </div>
            </div>

            {/* Feature Mini Cards */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: ToothIcon, title: "Digital Care", sub: "Modern Tech" },
                { icon: Shield, title: "Painless Care", sub: "Gentle Dental" }
              ].map((card, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl p-4 border border-emerald-500/25 flex items-center gap-3"
                  style={{ background: "rgba(9,40,29,0.8)" }}
                >
                  <div className="w-8 h-8 rounded-xl bg-[#10B981]/20 border border-[#10B981]/40 flex items-center justify-center shrink-0">
                    <card.icon className="w-4 h-4 text-[#10B981]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#F4F7F4]">{card.title}</h4>
                    <p className="text-[10px] text-[#A2C7B7]">{card.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Trust Bar — Mobile Only */}
        <div className="w-full block lg:hidden order-4 mt-4 grid grid-cols-2 gap-3">
          {trustBarItems.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl flex flex-col justify-between border border-emerald-500/25"
              style={{ background: "rgba(10,38,29,0.8)" }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-[#A2C7B7] tracking-wide uppercase">{item.label}</span>
                <item.icon className="w-4 h-4 text-[#10B981]" />
              </div>
              <span className="text-2xl font-display font-extrabold text-[#F4F7F4]">{item.val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll Indicator — Desktop only, minimal CSS */}
      <div
        className="absolute bottom-2 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-1.5 opacity-60 cursor-pointer z-30"
        onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
        role="button"
        aria-label="Scroll to About section"
      >
        <span className="text-[10px] uppercase tracking-[0.2em] text-[#A2C7B7] font-bold">Explore Clinic</span>
        <div className="w-5 h-8 rounded-full border border-emerald-500/40 flex justify-center p-1" style={{ background: "rgba(10,38,29,0.6)" }}>
          <div className="w-1 h-2 bg-[#10B981] rounded-full" style={{ animation: "scrollBob 2s ease-in-out infinite" }} />
        </div>
      </div>

      <style>{`
        @keyframes heroFadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes scrollBob {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(5px); }
        }
      `}</style>
    </div>
  );
}
