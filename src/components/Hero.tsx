import React from "react";
import { CalendarDays, Star, Shield, Award, Activity, ChevronRight, Phone, Clock, MessageSquare, CheckCircle2 } from "lucide-react";
import { ToothIcon, WhatsAppIcon } from "./Icons";
import { DOCTOR_REGISTRATION_NUMBER, PRIMARY_PHONE_NUMBER, PRIMARY_WHATSAPP_DIGITS } from "../lib/constants";
import OptimizedImage from "./OptimizedImage";

const credentialRows = [
  { icon: Award, label: "Degree Qualification", value: "BDS (Gold Medalist)", iconColor: "text-amber-500" },
  { icon: Shield, label: "State Medical License", value: DOCTOR_REGISTRATION_NUMBER, iconColor: "text-[#0284C7]" },
  { icon: Activity, label: "Clinical Mastery", value: "10+ Years Exp.", iconColor: "text-emerald-500" },
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

  const whatsappUrl = `https://wa.me/${PRIMARY_WHATSAPP_DIGITS}?text=${encodeURIComponent("Hello Doctor, I would like to book a dental consultation.")}`;

  return (
    <section id="home" className="relative font-sans pt-4 sm:pt-8 pb-16 sm:pb-24 overflow-hidden bg-white">
      
      {/* ── Soft Medical Blue & White Hero Container ──── */}
      <div className="mx-3 sm:mx-6 lg:mx-8 bg-gradient-to-b from-[#F0F9FF] via-[#F8FAFC] to-[#FFFFFF] rounded-[32px] sm:rounded-[40px] pt-16 sm:pt-24 pb-20 sm:pb-28 px-5 sm:px-10 lg:px-14 relative overflow-hidden shadow-[0_20px_50px_rgba(2,132,199,0.06)] border border-slate-200/80">
        
        {/* Subtle Ambient Radial Lights */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-sky-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16 relative z-10">

          {/* Left Column: Headline, Trust Badges & Action CTAs */}
          <div className="w-full lg:w-[58%] flex flex-col items-start text-left">
            
            {/* Trust Rating Pill */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full mb-6 bg-white/90 cursor-default border border-slate-200 shadow-sm">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                ))}
              </div>
              <span className="text-xs font-extrabold text-[#0F172A]">4.9 ★★★★★</span>
              <span className="text-xs text-[#475569] font-medium border-l border-slate-200 pl-2.5">
                5,000+ Happy Smiles Restored
              </span>
            </div>

            {/* Emotional Headline */}
            <h1 className="text-[40px] sm:text-[56px] lg:text-[64px] font-display font-extrabold tracking-tight text-[#0F172A] leading-[1.08] mb-6">
              Crafting Radiant Smiles &amp; <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0284C7] via-[#0EA5E9] to-[#0D9488]">
                Lifelong Confidence
              </span>
            </h1>

            {/* Emotional Subtext */}
            <p className="text-base sm:text-lg text-[#334155] leading-relaxed max-w-xl mb-8 font-normal">
              Experience world-class, 100% pain-free dental care with Dr. Nilay Saha. Advanced digital endodontics, smile transformations, and laser care delivered with warmth, precision, and gentleness.
            </p>

            {/* Key Clinical Trust Chips */}
            <div className="flex flex-wrap gap-2.5 mb-8">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-sky-50 text-[#0284C7] border border-sky-200 shadow-2xs">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>BDS Gold Medalist Specialist</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-teal-50 text-teal-700 border border-teal-200 shadow-2xs">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>10+ Years Clinical Mastery</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-slate-100 text-[#334155] border border-slate-200 shadow-2xs">
                <span>WBDC Reg 4858-A</span>
              </span>
            </div>

            {/* Primary Action Buttons (Book Appointment & WhatsApp) */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-6">
              <button
                type="button"
                onClick={handleBooking}
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-[#0284C7] to-[#0369A1] text-white font-bold text-sm shadow-[0_8px_25px_rgba(2,132,199,0.35)] hover:shadow-[0_12px_32px_rgba(2,132,199,0.5)] hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <CalendarDays className="w-5 h-5 text-white" />
                <span>Book Appointment</span>
              </button>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm shadow-[0_8px_25px_rgba(16,185,129,0.3)] hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2.5"
              >
                <WhatsAppIcon className="w-5 h-5 fill-white" />
                <span>WhatsApp Chat</span>
              </a>
            </div>

            {/* Emergency Hotline Banner */}
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-4 py-2 rounded-full">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              <span>Dental Emergency? Direct Call: <a href={`tel:${PRIMARY_PHONE_NUMBER}`} className="font-extrabold underline text-rose-800">{PRIMARY_PHONE_NUMBER}</a></span>
            </div>

          </div>

          {/* Right Column: Professional Dentist Credentials Card */}
          <div className="w-full lg:w-[40%] relative z-10">
            <div className="bg-white rounded-[24px] p-7 sm:p-8 border border-slate-200/90 shadow-[0_20px_50px_rgba(15,23,42,0.08)] relative overflow-hidden group hover:border-sky-300 transition-all duration-300">
              
              <div className="flex items-center gap-4 border-b border-slate-100 pb-5 mb-5 relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-500 to-sky-600 text-white flex items-center justify-center font-bold text-xl shrink-0 shadow-md">
                  <ToothIcon className="w-7 h-7 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-display font-extrabold text-[#0F172A]">Dr. Nilay Saha</h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-sky-50 border border-sky-200 text-[#0284C7] text-[10px] font-bold uppercase tracking-wider">
                      Verified
                    </span>
                  </div>
                  <p className="text-xs text-[#475569] font-medium mt-0.5">
                    Principal Dental Surgeon &amp; Oral Physician
                  </p>
                </div>
              </div>

              {/* Credentials List */}
              <div className="space-y-3 mb-5 relative z-10">
                {credentialRows.map((row, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 hover:bg-sky-50/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <row.icon className={`w-4.5 h-4.5 ${row.iconColor} shrink-0`} />
                      <span className="text-xs sm:text-sm font-medium text-[#334155]">{row.label}</span>
                    </div>
                    <span className="text-xs sm:text-sm font-bold font-mono text-[#0284C7]">{row.value}</span>
                  </div>
                ))}
              </div>

              <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs text-[#475569] relative z-10">
                <span className="font-bold text-[#0F172A]">Consultation Centers:</span>
                <span className="font-bold text-[#0284C7] tracking-wide">Belerhat • Nabadwip • Parulia</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── Floating Clinical Quick Specs Strip ── */}
      <div className="-mt-12 sm:-mt-14 max-w-5xl mx-auto px-4 relative z-30">
        <div className="bg-white rounded-[20px] p-4 sm:p-5 border border-slate-200/90 shadow-[0_20px_50px_rgba(2,132,199,0.10)] flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Service */}
          <div className="flex items-center gap-3.5 px-3 py-1 text-left w-full sm:w-auto">
            <div className="w-11 h-11 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center text-[#0284C7] shrink-0 shadow-2xs">
              <ToothIcon className="w-5.5 h-5.5" />
            </div>
            <div>
              <span className="text-[11px] text-[#475569] uppercase font-bold tracking-wider block">Clinical Specialty</span>
              <span className="text-sm font-bold text-[#0F172A]">Pain-Free Root Canal &amp; Aesthetic Care</span>
            </div>
          </div>

          <div className="hidden md:block w-px h-8 bg-slate-200" />

          {/* Working Hours */}
          <div className="flex items-center gap-3.5 px-3 py-1 text-left w-full sm:w-auto">
            <div className="w-11 h-11 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-600 shrink-0 shadow-2xs">
              <Clock className="w-5.5 h-5.5" />
            </div>
            <div>
              <span className="text-[11px] text-[#475569] uppercase font-bold tracking-wider block">Clinic Hours</span>
              <span className="text-sm font-bold text-[#0F172A]">10:00 AM – 8:30 PM (Mon-Sat)</span>
            </div>
          </div>

          <div className="hidden md:block w-px h-8 bg-slate-200" />

          {/* Priority Phone */}
          <div className="flex items-center gap-3.5 px-3 py-1 text-left w-full sm:w-auto">
            <div className="w-11 h-11 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center text-[#0284C7] shrink-0 shadow-2xs">
              <Phone className="w-5.5 h-5.5" />
            </div>
            <div>
              <span className="text-[11px] text-[#475569] uppercase font-bold tracking-wider block">Priority Phone</span>
              <span className="text-sm font-bold text-[#0F172A]">{PRIMARY_PHONE_NUMBER}</span>
            </div>
          </div>

          {/* Action */}
          <button
            type="button"
            onClick={handleBooking}
            className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold uppercase tracking-wider shrink-0 cursor-pointer shadow-md shadow-sky-500/20"
          >
            <span>Book Visit</span>
          </button>

        </div>
      </div>

    </section>
  );
}
