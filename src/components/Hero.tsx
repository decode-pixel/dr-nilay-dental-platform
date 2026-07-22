import React from "react";
import { CalendarDays, Star, Award, Clock, CheckCircle2 } from "lucide-react";
import { WhatsAppIcon } from "./Icons";
import { PRIMARY_PHONE_NUMBER, PRIMARY_WHATSAPP_DIGITS } from "../lib/constants";

const HERO_DOCTOR_IMG = "https://res.cloudinary.com/tud0sobq/image/upload/v1784740273/ChatGPT_Image_Jul_19_2026_11_25_20_PM_c6ffsk.png";

const STATS = [
  { value: "5K+", label: "Happy Patients" },
  { value: "10+", label: "Years Practice" },
  { value: "98%", label: "Pain-Free Rate" },
];

export default function Hero() {
  const handleBooking = (e: React.MouseEvent) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent("openContactModal"));
  };

  const whatsappUrl = `https://wa.me/${PRIMARY_WHATSAPP_DIGITS}?text=${encodeURIComponent("Hello Doctor, I would like to book a dental consultation.")}`;

  return (
    <section id="home" className="relative font-sans overflow-hidden bg-white">
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#0284C7] to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-12 pb-0">
        <div className="flex flex-col lg:flex-row items-stretch gap-8 lg:gap-12">

          <div className="w-full lg:w-[52%] flex flex-col justify-center pt-6 sm:pt-8 pb-10">

            <div className="inline-flex self-start items-center gap-2 px-3.5 py-1.5 rounded-full mb-5 bg-sky-50 border border-sky-200">
              <div className="flex items-center gap-0.5 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-amber-400" />
                ))}
              </div>
              <span className="text-xs font-bold text-[#0284C7]">4.9 Google Rating</span>
              <span className="text-xs text-[#64748B]">• 200+ Reviews</span>
            </div>

            <h1 className="text-[38px] sm:text-[52px] lg:text-[58px] font-display font-extrabold tracking-tight text-[#0F172A] leading-[1.06] mb-5">
              West Bengal&apos;s<br />
              Premier{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0284C7] to-[#0EA5E9]">
                Dental&nbsp;Care
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[#475569] leading-relaxed max-w-lg mb-7 font-normal">
              Experience 100% pain-free dental care with Dr. Nilay Saha — BDS Gold Medalist. Advanced endodontics, smile design, and laser care at Belerhat, Nabadwip &amp; Parulia.
            </p>

            <div className="flex flex-wrap gap-2 mb-7">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold bg-sky-50 text-[#0284C7] border border-sky-200">
                <CheckCircle2 className="w-3.5 h-3.5" />
                BDS Gold Medalist
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold bg-teal-50 text-teal-700 border border-teal-200">
                <CheckCircle2 className="w-3.5 h-3.5" />
                WHO Sterilization
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold bg-slate-100 text-[#334155] border border-slate-200">
                WBDC Reg 4858-A
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mb-7">
              <button
                type="button"
                onClick={handleBooking}
                className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold text-sm shadow-[0_6px_20px_rgba(2,132,199,0.35)] hover:shadow-[0_10px_28px_rgba(2,132,199,0.5)] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
              >
                <CalendarDays className="w-4 h-4" />
                Book Appointment
              </button>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm shadow-[0_6px_20px_rgba(16,185,129,0.3)] hover:-translate-y-0.5 transition-all duration-200"
              >
                <WhatsAppIcon className="w-4 h-4 fill-white" />
                WhatsApp Chat
              </a>
            </div>

            <div className="inline-flex self-start items-center gap-2 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-4 py-2 rounded-full">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              Dental Emergency? Call:{" "}
              <a href={`tel:${PRIMARY_PHONE_NUMBER}`} className="font-extrabold underline text-rose-800">
                {PRIMARY_PHONE_NUMBER}
              </a>
            </div>
          </div>

          <div className="w-full lg:w-[48%] relative flex items-end justify-center">
            <div className="relative w-full max-w-sm lg:max-w-none mx-auto">
              <div className="absolute inset-0 bg-gradient-to-t from-[#F0F9FF] via-[#E0F2FE] to-transparent rounded-t-[32px]" />

              <img
                src={HERO_DOCTOR_IMG}
                alt="Dr. Nilay Saha — BDS Gold Medalist, Dental Surgeon"
                loading="eager"
                className="relative z-10 w-full object-cover object-top rounded-t-[32px] max-h-[480px] sm:max-h-[540px] lg:max-h-[600px]"
              />

              <div className="absolute top-5 left-4 z-20 bg-white/95 backdrop-blur-sm border border-slate-200 rounded-2xl px-3.5 py-2.5 shadow-lg">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-500" />
                  <div>
                    <div className="text-[10px] text-[#64748B] font-semibold uppercase tracking-wide">Qualification</div>
                    <div className="text-xs font-extrabold text-[#0F172A]">BDS Gold Medalist</div>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-6 right-4 z-20 bg-[#0284C7] rounded-2xl px-3.5 py-2.5 shadow-lg">
                <div className="text-[10px] text-sky-200 font-semibold uppercase tracking-wide">Experience</div>
                <div className="text-lg font-extrabold text-white leading-none">10+ yrs</div>
              </div>

              <div className="absolute bottom-6 left-4 z-20 bg-white/95 backdrop-blur-sm border border-slate-200 rounded-2xl px-3.5 py-2.5 shadow-lg">
                <div className="text-[10px] text-[#64748B] font-semibold uppercase tracking-wide">Patients</div>
                <div className="text-lg font-extrabold text-[#0F172A] leading-none">5,000+</div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <div className="border-t border-slate-200/80 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-0 divide-y sm:divide-y-0 sm:divide-x divide-slate-200/80">
            {STATS.map((s) => (
              <div key={s.label} className="flex-1 flex flex-col items-center justify-center py-4 sm:py-5 px-4">
                <span className="text-2xl sm:text-3xl font-display font-extrabold text-[#0284C7] leading-none">{s.value}</span>
                <span className="text-xs text-[#64748B] font-semibold mt-1 uppercase tracking-wider">{s.label}</span>
              </div>
            ))}

            <div className="flex-1 flex items-center justify-center gap-3 py-4 sm:py-5 px-4">
              <div className="w-8 h-8 rounded-full bg-sky-50 border border-sky-200 flex items-center justify-center text-[#0284C7]">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[11px] text-[#64748B] font-semibold uppercase tracking-wide">Clinic Hours</div>
                <div className="text-sm font-bold text-[#0F172A]">Mon-Sat, 10AM-8:30PM</div>
              </div>
            </div>

            <div className="flex items-center justify-center py-4 sm:py-5 px-4 sm:px-6">
              <button
                type="button"
                onClick={handleBooking}
                className="px-5 py-2.5 rounded-full bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors"
              >
                Book Visit
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
