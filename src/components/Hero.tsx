import React from "react";
import { motion } from "motion/react";
import { CalendarDays, Phone, ShieldCheck, Smile, Activity, MapPin, ArrowRight, Microchip, HeartHandshake, Bell, Sparkles } from "lucide-react";
import { ToothIcon, WhatsAppIcon } from "./Icons";
import { PRIMARY_PHONE_NUMBER, buildWhatsAppUrl } from "../lib/constants";

const DOCTOR_PHOTO_PATH = "/DNS_Portrait_DrNilay_Headshot_4x5_202607.webp";

export default function Hero() {
  const handleBooking = (e: React.MouseEvent) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent("openContactModal"));
  };

  return (
    <section id="home" className="relative font-sans overflow-hidden bg-gradient-to-b from-slate-50/80 via-[#F2F8F6] to-white pt-4 pb-12 sm:pb-16 lg:pb-20">
      {/* ── Abstract Translucent Glowing 3D Tooth Background Aura ── */}
      <div className="absolute top-1/4 right-[10%] w-[500px] h-[500px] bg-gradient-to-br from-teal-300/20 via-cyan-200/15 to-emerald-200/10 rounded-full blur-[100px] pointer-events-none z-0" />
      <div className="absolute top-10 left-[5%] w-[350px] h-[350px] bg-gradient-to-tr from-cyan-300/15 via-emerald-200/10 to-transparent rounded-full blur-[90px] pointer-events-none z-0" />

      {/* Subtle Tooth SVG watermark in the center background */}
      <div className="absolute top-1/3 right-[22%] opacity-[0.07] pointer-events-none z-0 hidden lg:block transform rotate-6">
        <svg width="340" height="380" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8" className="text-teal-600">
          <path d="M12 2C7.5 2 4 4.5 4 8.5C4 11.5 5.5 14 6.5 16.5C7.5 19 8.5 22 10.5 22C11.5 22 12 20 12 18C12 20 12.5 22 13.5 22C15.5 22 16.5 19 17.5 16.5C18.5 14 20 11.5 20 8.5C20 4.5 16.5 2 12 2Z" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* ── Main Split Hero Layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

          {/* ── LEFT COLUMN ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 flex flex-col justify-center pt-2 sm:pt-4"
          >
            {/* Registered Practitioner Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full glass-pill-chip mb-6 self-start shadow-sm border border-white/80 bg-white/80 backdrop-blur-xl">
              <div className="w-6 h-6 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-600">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs sm:text-sm font-semibold text-slate-700 tracking-tight">
                WBDC Reg. No. 4858-A &bull; Registered Dental Practitioner
              </span>
            </div>

            {/* Editorial Headline */}
            <h1 className="text-[40px] sm:text-[56px] lg:text-[68px] font-display font-extrabold tracking-tight text-[#0F172A] leading-[1.08] mb-6">
              Specialized Care.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00A896] via-[#028090] to-[#059669]">
                Confident Smiles.
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-xl mb-8">
              Expert root canal care and advanced dentistry with precision, technology, and a gentle touch.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row flex-wrap items-center gap-3 sm:gap-4 mb-10">
              <button
                type="button"
                onClick={handleBooking}
                className="btn-crystal w-full sm:w-auto justify-center px-7 py-4 rounded-full text-base font-bold text-white flex items-center gap-3 shadow-[0_10px_30px_rgba(0,168,150,0.35)] hover:shadow-[0_15px_40px_rgba(0,168,150,0.5)] transition-all duration-300 cursor-pointer active:scale-98"
              >
                <CalendarDays className="w-5 h-5 text-emerald-100" />
                <span>Book Appointment</span>
                <ArrowRight className="w-4 h-4 ml-1 text-emerald-100" />
              </button>

              <a
                href={`tel:${PRIMARY_PHONE_NUMBER}`}
                className="w-full sm:w-auto justify-center px-7 py-4 rounded-full bg-white/80 hover:bg-white border border-white/90 backdrop-blur-xl text-slate-800 font-bold text-base shadow-[0_8px_25px_rgba(15,23,42,0.06)] hover:shadow-[0_12px_32px_rgba(15,23,42,0.1)] transition-all duration-300 flex items-center gap-2.5 active:scale-98"
              >
                <Phone className="w-4 h-4 text-[#00A896]" />
                <span>Call Now</span>
              </a>

              <a
                href={buildWhatsAppUrl()}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto justify-center px-6 py-4 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-800 font-bold text-base shadow-xs transition-all duration-300 flex items-center gap-2 active:scale-98"
              >
                <WhatsAppIcon className="w-5 h-5 text-[#25D366]" />
                <span>WhatsApp</span>
              </a>
            </div>

            {/* ── 4 Stats Pill Bar ── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded-3xl bg-white/70 backdrop-blur-2xl border border-white/90 shadow-[0_12px_40px_rgba(15,23,42,0.05)]">
              <div className="flex items-center gap-2.5 p-2.5 rounded-2xl hover:bg-white/80 transition-colors">
                <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200/60 flex items-center justify-center text-[#00A896] shrink-0">
                  <Smile className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-base font-extrabold text-slate-900 leading-tight">5,000+</div>
                  <div className="text-[11px] text-slate-500 font-medium leading-tight">Happy Patients</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-2.5 rounded-2xl hover:bg-white/80 transition-colors">
                <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200/60 flex items-center justify-center text-[#00A896] shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-base font-extrabold text-slate-900 leading-tight">10+</div>
                  <div className="text-[11px] text-slate-500 font-medium leading-tight">Years of Practice</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-2.5 rounded-2xl hover:bg-white/80 transition-colors">
                <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200/60 flex items-center justify-center text-[#00A896] shrink-0">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-base font-extrabold text-slate-900 leading-tight">98%</div>
                  <div className="text-[11px] text-slate-500 font-medium leading-tight">Pain-Free Rate</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-2.5 rounded-2xl hover:bg-white/80 transition-colors">
                <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200/60 flex items-center justify-center text-[#00A896] shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-base font-extrabold text-slate-900 leading-tight">2</div>
                  <div className="text-[11px] text-slate-500 font-medium leading-tight">Clinic Locations</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── RIGHT COLUMN (Doctor Image / Logo Space & Quote Card) ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative flex flex-col items-center justify-center"
          >
            {/* Glowing Backdrop Frame */}
            <div className="relative w-full max-w-md lg:max-w-none aspect-[4/5] rounded-[36px] overflow-hidden bg-gradient-to-b from-white/90 via-teal-50/50 to-white/80 backdrop-blur-2xl border border-white shadow-[0_20px_60px_rgba(0,168,150,0.12)] p-2">
              
              {/* Doctor Image Container / Placeholder */}
              <div className="relative w-full h-full rounded-[30px] overflow-hidden bg-slate-100 flex items-center justify-center group">
                <img
                  src={DOCTOR_PHOTO_PATH}
                  alt="Dr. Nilay Saha — BDS Endodontics Specialist"
                  className="w-full h-full object-cover object-top filter contrast-[1.03] transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    // Fallback to placeholder if image fails
                    const target = e.target as HTMLElement;
                    target.style.display = "none";
                  }}
                />
                
                {/* Subtle gradient overlay at bottom of doctor photo */}
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent pointer-events-none" />

                {/* Doctor Designation Badge Overlay (Top Left) */}
                <div className="absolute top-4 left-4 glass-crystal px-4 py-2.5 rounded-2xl border border-white/90 shadow-md">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-xl bg-teal-500/15 flex items-center justify-center text-[#00A896]">
                      <ToothIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[11px] font-extrabold text-slate-900 leading-tight">DR. NILAY SAHA</div>
                      <div className="text-[9px] font-semibold text-teal-700 uppercase tracking-wider">Root Canal Specialist</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Quote Card Overlay (Bottom Right) */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="absolute bottom-6 right-6 max-w-[210px] p-4 rounded-2xl glass-crystal border border-white/95 shadow-[0_12px_36px_rgba(15,23,42,0.12)] z-20 backdrop-blur-xl"
              >
                <span className="text-2xl text-[#00A896] font-serif leading-none block mb-1">“</span>
                <p className="text-xs font-medium text-slate-700 italic leading-snug mb-2">
                  Your comfort. My priority.
                </p>
                <div className="text-right text-xs font-semibold text-[#00A896] font-display">
                  &mdash; Dr. Nilay Saha
                </div>
              </motion.div>
            </div>
          </motion.div>

        </div>

        {/* ── Hero Bottom Feature Pill Cards Bar (4 Cards) ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <div className="p-5 rounded-3xl bg-white/80 backdrop-blur-xl border border-white/90 shadow-[0_10px_30px_rgba(15,23,42,0.04)] hover:shadow-[0_16px_40px_rgba(0,168,150,0.1)] transition-all duration-300 flex items-start gap-4 group">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-[#00A896] shrink-0 group-hover:scale-110 transition-transform">
              <ToothIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-slate-900 mb-1">Pain-Free Treatment</h3>
              <p className="text-xs text-slate-600 leading-relaxed">Gentle techniques for a comfortable experience.</p>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white/80 backdrop-blur-xl border border-white/90 shadow-[0_10px_30px_rgba(15,23,42,0.04)] hover:shadow-[0_16px_40px_rgba(0,168,150,0.1)] transition-all duration-300 flex items-start gap-4 group">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-[#00A896] shrink-0 group-hover:scale-110 transition-transform">
              <Microchip className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-slate-900 mb-1">Advanced Technology</h3>
              <p className="text-xs text-slate-600 leading-relaxed">Modern equipment for accurate &amp; safe treatment.</p>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white/80 backdrop-blur-xl border border-white/90 shadow-[0_10px_30px_rgba(15,23,42,0.04)] hover:shadow-[0_16px_40px_rgba(0,168,150,0.1)] transition-all duration-300 flex items-start gap-4 group">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-[#00A896] shrink-0 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-slate-900 mb-1">Hygiene Promise</h3>
              <p className="text-xs text-slate-600 leading-relaxed">Strict sterilization protocols for your safety.</p>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white/80 backdrop-blur-xl border border-white/90 shadow-[0_10px_30px_rgba(15,23,42,0.04)] hover:shadow-[0_16px_40px_rgba(0,168,150,0.1)] transition-all duration-300 flex items-start gap-4 group">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-[#00A896] shrink-0 group-hover:scale-110 transition-transform">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-slate-900 mb-1">Patient First Approach</h3>
              <p className="text-xs text-slate-600 leading-relaxed">We listen, we explain, we care.</p>
            </div>
          </div>
        </motion.div>

        {/* ── Emergency Floating Glass Pill Banner ── */}
        <div className="mt-8 flex justify-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/90 backdrop-blur-2xl border border-rose-200/80 shadow-[0_8px_30px_rgba(244,63,94,0.08)]">
            <div className="w-8 h-8 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-500 animate-pulse">
              <Bell className="w-4 h-4" />
            </div>
            <span className="text-xs sm:text-sm font-bold text-rose-600">Dental Emergency?</span>
            <a
              href={`tel:${PRIMARY_PHONE_NUMBER}`}
              className="text-xs sm:text-sm font-extrabold text-slate-900 hover:text-rose-600 transition-colors flex items-center gap-1.5"
            >
              <span>Call Now</span>
              <span className="text-[#00A896] underline font-mono">{PRIMARY_PHONE_NUMBER}</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
