import React, { useState } from "react";
import { 
  MapPin, 
  Phone, 
  Clock, 
  Navigation, 
  CalendarDays, 
  CheckCircle2, 
  Building2,
  ShieldCheck
} from "lucide-react";
import TagPill from "./TagPill";
import { WhatsAppIcon } from "./Icons";
import { PRIMARY_PHONE_NUMBER, PRIMARY_PHONE_DISPLAY, buildWhatsAppUrl } from "../lib/constants";

interface ScheduleDay {
  day: string;
  hours: string;
  isClosed?: boolean;
}

interface ClinicLocation {
  id: string;
  badge: string;
  name: string;
  title: string;
  address: string;
  landmark: string;
  phone: string;
  phoneDisplay: string;
  googleMapLink: string;
  timings: string;
  schedule: ScheduleDay[];
  features: string[];
}

const CLINICS: ClinicLocation[] = [
  {
    id: "nabadwip",
    badge: "Clinic 01 • Clinical Studio",
    name: "Dr. Nilay Saha Dental Care (Nabadwip)",
    title: "Dr. Nilay Saha Dental Care (Nabadwip)",
    address: "Anandebitala, Near Bus Stand, Nabadwip, Nadia, West Bengal 741302",
    landmark: "Near Anandebitala Market Square",
    phone: PRIMARY_PHONE_NUMBER,
    phoneDisplay: PRIMARY_PHONE_DISPLAY,
    googleMapLink: "https://maps.app.goo.gl/gPvowvKGbheXV6uTA?g_st=ic",
    timings: "Mon, Wed, Fri & Sun (By Pre-booked Appointment)",
    schedule: [
      { day: "Mon, Wed, Fri", hours: "09:00 AM – 11:00 AM | 04:00 PM – 08:00 PM" },
      { day: "Sunday", hours: "04:00 PM – 08:00 PM" }
    ],
    features: ["Pre-Booked Consultations", "Advanced Cosmetic Dentistry", "Aseptic Instrument Protocol"]
  },
  {
    id: "belerhat",
    badge: "Clinic 02 • Flagship Center",
    name: "Nilay Saha Dental Care (Belerhat)",
    title: "Nilay Saha Dental Care (Belerhat)",
    address: "Belerhat Main Road, Near Railway Station, Purba Bardhaman, West Bengal 713101",
    landmark: "Opposite Belerhat Railway Station",
    phone: PRIMARY_PHONE_NUMBER,
    phoneDisplay: PRIMARY_PHONE_DISPLAY,
    googleMapLink: "https://maps.app.goo.gl/MbD3rFAUdP1krCHJ8?g_st=ic",
    timings: "Mon – Sat: 10:00 AM – 1:30 PM | 5:00 PM – 8:30 PM",
    schedule: [
      { day: "Mon – Sat", hours: "10:00 AM – 1:30 PM | 5:00 PM – 8:30 PM" },
      { day: "Sunday", hours: "Emergency Consultations Only", isClosed: true }
    ],
    features: ["Class-B Autoclave Sterilization", "Digital RVG X-Ray On-Site", "Single-Visit Endodontics"]
  }
];

export default function Clinics() {
  const [selectedClinic, setSelectedClinic] = useState<string>("belerhat");

  const handleBookClinic = (clinicId: string) => {
    window.dispatchEvent(
      new CustomEvent("openContactModal", { detail: { clinicSlug: clinicId } })
    );
  };

  return (
    <section id="clinic-section" className="py-20 sm:py-28 bg-[#F5F9F8] font-sans border-b border-teal-100/50 scroll-mt-24">
      {/* Anchor alias for URL hashing compatibility */}
      <span id="clinic" className="sr-only" />
      <span id="clinics" className="sr-only" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-18">
          <TagPill icon={Building2} text="Clinical Network" />
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-[#0F172A] tracking-tight mt-3 mb-4 leading-tight">
            Our Regional <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00A896] via-[#028090] to-[#059669]">
              Clinical Studios
            </span>
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl mx-auto font-normal">
            Visit Dr. Nilay Saha at our flagship Belerhat center or our specialized Nabadwip clinical studio across West Bengal.
          </p>
        </div>

        {/* 2 Apple-Style Location Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 max-w-6xl mx-auto">
          {CLINICS.map((clinic) => {
            const isSelected = selectedClinic === clinic.id;
            return (
              <div
                key={clinic.id}
                onClick={() => setSelectedClinic(clinic.id)}
                className={`relative p-7 sm:p-9 rounded-[32px] transition-all duration-300 flex flex-col justify-between backdrop-blur-2xl cursor-pointer ${
                  isSelected
                    ? "bg-white/95 border-2 border-[#00A896] shadow-[0_20px_50px_rgba(0,168,150,0.12)]"
                    : "bg-white/80 border border-white/90 hover:border-teal-200/80 shadow-[0_10px_35px_rgba(15,23,42,0.04)]"
                }`}
              >
                <div>
                  {/* Top Badge & Icon */}
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <span className="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-teal-50 text-[#00A896] border border-teal-100/80">
                      {clinic.badge}
                    </span>
                    <div className="w-10 h-10 rounded-2xl bg-teal-50/80 border border-teal-100 text-[#00A896] flex items-center justify-center shrink-0">
                      <Building2 className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Clinic Title & Address */}
                  <h3 className="text-2xl font-display font-extrabold text-slate-900 mb-2 leading-tight">
                    {clinic.name}
                  </h3>
                  
                  <div className="flex items-start gap-2.5 text-slate-600 text-sm mb-6 leading-relaxed">
                    <MapPin className="w-4 h-4 text-[#00A896] shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-slate-800">{clinic.address}</p>
                      <p className="text-xs text-slate-500 mt-0.5 font-normal">Landmark: {clinic.landmark}</p>
                    </div>
                  </div>

                  {/* Timing Matrix */}
                  <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100 mb-6 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-extrabold text-slate-900 mb-1">
                      <Clock className="w-4 h-4 text-[#00A896]" />
                      <span>Chamber Operating Timings</span>
                    </div>
                    {clinic.schedule.map((sch, i) => (
                      <div key={i} className="flex items-center justify-between text-xs text-slate-600">
                        <span className="font-semibold">{sch.day}:</span>
                        <span className={`font-medium ${sch.isClosed ? "text-amber-600" : "text-slate-800"}`}>{sch.hours}</span>
                      </div>
                    ))}
                  </div>

                  {/* Feature Pills */}
                  <div className="flex flex-wrap gap-2 mb-8">
                    {clinic.features.map((feat, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-teal-50/50 text-slate-700 text-xs font-semibold border border-teal-100/60">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#00A896]" />
                        {feat}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBookClinic(clinic.id);
                    }}
                    className="w-full sm:flex-1 py-3 px-5 rounded-full btn-crystal text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm cursor-pointer active:scale-98 transition-transform"
                  >
                    <CalendarDays className="w-4 h-4 text-emerald-100" />
                    <span>Book Appointment</span>
                  </button>

                  <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 flex-wrap">
                    <a
                      href={buildWhatsAppUrl({ clinic: clinic.name })}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex-1 sm:flex-initial py-3 px-3.5 rounded-full bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 text-emerald-800 font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs transition-colors"
                    >
                      <WhatsAppIcon className="w-3.5 h-3.5 text-[#25D366]" />
                      <span>WhatsApp</span>
                    </a>

                    <a
                      href={`tel:${clinic.phone}`}
                      onClick={(e) => e.stopPropagation()}
                      className="flex-1 sm:flex-initial py-3 px-3.5 rounded-full bg-white border border-slate-200 text-slate-800 hover:text-[#00A896] hover:border-teal-200 font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-[#00A896]" />
                      <span>Call</span>
                    </a>

                    <a
                      href={clinic.googleMapLink}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex-1 sm:flex-initial py-3 px-3.5 rounded-full bg-white border border-slate-200 text-slate-800 hover:text-[#00A896] hover:border-teal-200 font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                    >
                      <Navigation className="w-3.5 h-3.5 text-[#00A896]" />
                      <span>Directions</span>
                    </a>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* Bottom Sterilization Assurance Banner */}
        <div className="mt-12 max-w-4xl mx-auto p-5 sm:p-6 rounded-2xl bg-white/80 backdrop-blur-xl border border-white/90 shadow-xs flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 text-[#00A896] flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
            Both Belerhat and Nabadwip clinical centers strictly follow WHO-certified Class-B autoclaving and multi-tier aseptic sterilization protocols for your total safety.
          </p>
        </div>

      </div>
    </section>
  );
}
