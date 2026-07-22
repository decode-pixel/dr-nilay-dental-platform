import React, { useState, useEffect } from "react";
import { 
  MapPin, Clock, Phone, Navigation, CalendarDays, 
  Car, Wind, Droplet, CreditCard, Users, CalendarCheck, ShieldCheck, UserCheck, Stethoscope,
  ShieldAlert, Star, ChevronDown, Bus, ExternalLink, Sparkles, AlertCircle
} from "lucide-react";
import { WhatsAppIcon, ToothIcon } from "./Icons";
import { ClinicService } from "../lib/clinicService";
import { logger } from "../lib/logger";
import TagPill from "./TagPill";
import OptimizedImage from "./OptimizedImage";

interface ScheduleSlot {
  day: string;
  morning: string | null;
  evening: string | null;
  isClosed: boolean;
}

interface ClinicMasterData {
  slug: string;
  name: string;
  doctorName: string;
  doctorSpecialization: string;
  doctorPortrait: string;
  address: string;
  landmark: string;
  landmarkSub: string;
  primaryPhone: string;
  primaryPhoneDisplay: string;
  alternatePhone?: string;
  alternatePhoneDisplay?: string;
  whatsappDigits: string;
  googleMapLink: string;
  coverImage: string;
  googleRating: number;
  reviewCount: number;
  schedule: ScheduleSlot[];
  parkingInfo: string;
  transitInfo: string;
  paymentInfo: string;
}

const MASTER_CLINICS: Record<string, ClinicMasterData> = {
  belerhat: {
    slug: "belerhat",
    name: "Saha Dental Care",
    doctorName: "Dr. Nilay Saha, BDS",
    doctorSpecialization: "Dental Surgeon & Oral Physician",
    doctorPortrait: "/doctor-profile.jpg",
    address: "New Saha Pharmacy (Upstairs), Near Belerhat Rail Gate, Purbasthali, Purba Bardhaman, West Bengal",
    landmark: "Above New Saha Pharmacy",
    landmarkSub: "Near Belerhat Rail Gate • Purbasthali",
    primaryPhone: "+917319526106",
    primaryPhoneDisplay: "+91 73195 26106",
    whatsappDigits: "917319526106",
    googleMapLink: "https://maps.google.com/?q=New+Saha+Pharmacy+Belerhat+Rail+Gate+Purbasthali",
    coverImage: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80",
    googleRating: 4.9,
    reviewCount: 140,
    parkingInfo: "Dedicated two-wheeler and street vehicle parking right outside pharmacy entrance.",
    transitInfo: "2-minute walking distance directly from Belerhat Railway Station & Bus Stop.",
    paymentInfo: "All major UPI apps (GPay, PhonePe, Paytm), Cash, and Visa/Mastercard accepted.",
    schedule: [
      { day: "Monday", morning: null, evening: null, isClosed: true },
      { day: "Tuesday", morning: "09:00 AM – 11:00 AM", evening: "05:00 PM – 08:00 PM", isClosed: false },
      { day: "Wednesday", morning: null, evening: null, isClosed: true },
      { day: "Thursday", morning: "09:00 AM – 11:00 AM", evening: "05:00 PM – 08:00 PM", isClosed: false },
      { day: "Friday", morning: null, evening: null, isClosed: true },
      { day: "Saturday", morning: "09:00 AM – 11:00 AM", evening: "05:00 PM – 08:00 PM", isClosed: false },
      { day: "Sunday", morning: "09:00 AM – 01:00 PM", evening: null, isClosed: false },
    ]
  },
  nabadwip: {
    slug: "nabadwip",
    name: "Dr. Nilay Saha Dental Chamber",
    doctorName: "Dr. Nilay Saha",
    doctorSpecialization: "Dental Surgeon & Oral Physician",
    doctorPortrait: "/doctor-profile.jpg",
    address: "Ground Floor, Anandebitala Bazar, Nabadwip, Nadia, West Bengal",
    landmark: "Ground Floor Suite",
    landmarkSub: "Anandebitala Bazar • Nabadwip",
    primaryPhone: "+917319526106",
    primaryPhoneDisplay: "+91 73195 26106",
    alternatePhone: "+919609180979",
    alternatePhoneDisplay: "+91 96091 80979",
    whatsappDigits: "917319526106",
    googleMapLink: "https://maps.google.com/?q=Anandebitala+Bazar+Nabadwip+Nadia",
    coverImage: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=1200&q=80",
    googleRating: 4.9,
    reviewCount: 95,
    parkingInfo: "Convenient parking zone near Anandebitala market square.",
    transitInfo: "Easily reachable from Nabadwip Ghat and central bus terminus.",
    paymentInfo: "Digital UPI transactions (GPay, PhonePe), Net Banking, and Cash accepted.",
    schedule: [
      { day: "Monday", morning: "09:00 AM – 11:00 AM", evening: "04:00 PM – 08:00 PM", isClosed: false },
      { day: "Tuesday", morning: null, evening: null, isClosed: true },
      { day: "Wednesday", morning: null, evening: "04:00 PM – 08:00 PM", isClosed: false },
      { day: "Thursday", morning: null, evening: null, isClosed: true },
      { day: "Friday", morning: "09:00 AM – 11:00 AM", evening: "04:00 PM – 08:00 PM", isClosed: false },
      { day: "Saturday", morning: null, evening: null, isClosed: true },
      { day: "Sunday", morning: null, evening: "04:00 PM – 08:00 PM", isClosed: false },
    ]
  },
  parulia: {
    slug: "parulia",
    name: "Parulia Consultation Studio",
    doctorName: "Dr. Nilay Saha",
    doctorSpecialization: "Dental Surgeon & Oral Physician",
    doctorPortrait: "/doctor-profile.jpg",
    address: "Parulia Regional Center, Near Parulia Bazar, Purba Bardhaman, West Bengal",
    landmark: "Parulia Bazar Hub",
    landmarkSub: "Regional Consultation Suite",
    primaryPhone: "+917319526106",
    primaryPhoneDisplay: "+91 73195 26106",
    alternatePhone: "+919609180979",
    alternatePhoneDisplay: "+91 96091 80979",
    whatsappDigits: "917319526106",
    googleMapLink: "https://maps.google.com/?q=Parulia+Bazar+Purba+Bardhaman",
    coverImage: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=1200&q=80",
    googleRating: 4.8,
    reviewCount: 48,
    parkingInfo: "Open parking space adjacent to the regional market center.",
    transitInfo: "Located right on the main Parulia transit corridor.",
    paymentInfo: "UPI payments and Cash accepted.",
    schedule: [
      { day: "Monday", morning: "By Appointment", evening: null, isClosed: false },
      { day: "Tuesday", morning: "By Appointment", evening: null, isClosed: false },
      { day: "Wednesday", morning: "By Appointment", evening: null, isClosed: false },
      { day: "Thursday", morning: "By Appointment", evening: null, isClosed: false },
      { day: "Friday", morning: "By Appointment", evening: null, isClosed: false },
      { day: "Saturday", morning: "By Appointment", evening: null, isClosed: false },
      { day: "Sunday", morning: null, evening: null, isClosed: true },
    ]
  }
};

const FUTURE_MODULES = [
  { label: "Google Reviews Stream", status: "Active" },
  { label: "360° Clinic Virtual Tour", status: "Ready" },
  { label: "Class-B Sterilization Suite", status: "Active" },
  { label: "Before & After Case Gallery", status: "Ready" },
  { label: "Dedicated Parking Guidance", status: "Active" },
  { label: "Visiting Specialist Roster", status: "Updated" },
];

export default function Clinics() {
  const [dynamicStatusMap, setDynamicStatusMap] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("all");
  // Requirement #3: Allow only one expanded clinic at a time (`accordion` behavior)
  const [expandedClinicSlug, setExpandedClinicSlug] = useState<string | null>("belerhat");

  useEffect(() => {
    let isMounted = true;
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];

    ClinicService.getClinicsWithStatus(todayStr).then((data) => {
      if (isMounted) {
        const map: Record<string, any> = {};
        data.forEach((c) => {
          if (c.slug) map[c.slug] = c;
        });
        setDynamicStatusMap(map);
        setLoading(false);
      }
    }).catch((err) => {
      logger.error("Failed to fetch dynamic clinic status:", err);
      if (isMounted) setLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const toggleClinicExpansion = (slug: string) => {
    setExpandedClinicSlug((prev) => (prev === slug ? null : slug));
  };

  const getDayName = (dayIdx: number): string => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return days[dayIdx % 7];
  };

  const computeLiveAvailability = (clinicMaster: ClinicMasterData, dynamicOverride: any) => {
    const now = new Date();
    const currentDayIdx = now.getDay(); // 0 is Sunday
    const currentDayName = getDayName(currentDayIdx);

    const todaySlot = clinicMaster.schedule.find(s => s.day === currentDayName) || {
      day: currentDayName,
      morning: null,
      evening: null,
      isClosed: true
    };

    // Check dynamic CMS emergency/holiday closure override first
    if (dynamicOverride?.statusInfo?.status === "Holiday" || dynamicOverride?.statusInfo?.status === "Temporary Closure") {
      return {
        isOpen: false,
        statusLabel: dynamicOverride.statusInfo.status,
        badgeClass: "bg-rose-100 text-rose-800 border-rose-300",
        chipLabel: `Closed (${dynamicOverride.statusInfo.reason || "Holiday"})`,
        nextAvailable: "Schedule resuming post-closure",
        doctorStatus: `Back when ${dynamicOverride.statusInfo.status.toLowerCase()} ends`,
        todayMorning: null,
        todayEvening: null,
        todayClosed: true
      };
    }

    if (!todaySlot.isClosed && (todaySlot.morning || todaySlot.evening)) {
      return {
        isOpen: true,
        statusLabel: "Open Today",
        badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-300",
        chipLabel: todaySlot.morning && todaySlot.evening 
          ? "Consulting Today • Morning & Evening" 
          : todaySlot.morning 
          ? "Consulting Today • Morning Session" 
          : "Consulting Today • Evening Session",
        nextAvailable: `Today: ${todaySlot.morning ? todaySlot.morning : ''} ${todaySlot.morning && todaySlot.evening ? ' & ' : ''} ${todaySlot.evening ? todaySlot.evening : ''}`.trim(),
        doctorStatus: "Consulting Here Today",
        todayMorning: todaySlot.morning,
        todayEvening: todaySlot.evening,
        todayClosed: false
      };
    }

    // Find next available day
    let nextDayName = "Tomorrow";
    let nextSlotTime = "09:00 AM";
    for (let offset = 1; offset <= 7; offset++) {
      const nextIdx = (currentDayIdx + offset) % 7;
      const targetDay = getDayName(nextIdx);
      const targetSlot = clinicMaster.schedule.find(s => s.day === targetDay);
      if (targetSlot && !targetSlot.isClosed && (targetSlot.morning || targetSlot.evening)) {
        nextDayName = offset === 1 ? "Tomorrow" : targetDay;
        nextSlotTime = (targetSlot.morning || targetSlot.evening || "09:00 AM").split("–")[0].trim();
        break;
      }
    }

    return {
      isOpen: false,
      statusLabel: "Closed Today",
      badgeClass: "bg-slate-100 text-slate-700 border-slate-300",
      chipLabel: `Closed Today • Next Visit ${nextDayName}`,
      nextAvailable: `Next Consultation: ${nextDayName} at ${nextSlotTime}`,
      doctorStatus: `Next Available on ${nextDayName}`,
      todayMorning: null,
      todayEvening: null,
      todayClosed: true
    };
  };

  const clinicsList = [
    MASTER_CLINICS.belerhat,
    MASTER_CLINICS.nabadwip,
    MASTER_CLINICS.parulia
  ];

  const filteredClinics = activeTab === "all" 
    ? clinicsList 
    : clinicsList.filter(c => c.slug === activeTab);

  return (
    <section id="locations" className="py-16 sm:py-24 bg-white font-sans border-b border-slate-200/60 scroll-mt-24 relative overflow-hidden">
      {/* Navigation anchor alias */}
      <span id="clinics" className="sr-only" />

      {/* Ambient Glow Backgrounds */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-sky-500/5 via-teal-500/5 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <TagPill icon={MapPin} text="Multi-Location Dental Chambers" />
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-[#0F172A] tracking-tight mt-3 mb-4 leading-tight">
            Premium Healthcare Locations <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0284C7] to-[#0EA5E9]">
              Convenient &amp; Accessible
            </span>
          </h2>
          <p className="text-base sm:text-lg text-[#475569] leading-relaxed max-w-2xl mx-auto font-normal">
            Explore our dental clinics across Purba Bardhaman and Nadia. Check real-time doctor availability and book your slot effortlessly.
          </p>
        </div>

        {/* Location Selector Tabs */}
        <div className="flex justify-center mb-10 sm:mb-12">
          <div className="inline-flex overflow-x-auto sm:overflow-visible max-w-full no-scrollbar rounded-full p-1.5 bg-slate-100 border border-slate-200/85 shadow-2xs gap-1">
            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                activeTab === "all"
                  ? "bg-[#0284C7] text-white shadow-md shadow-sky-500/20"
                  : "text-[#475569] hover:text-[#0F172A]"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>All Locations ({clinicsList.length})</span>
            </button>
            {clinicsList.map((c) => {
              const isActive = activeTab === c.slug;
              return (
                <button
                  key={c.slug}
                  type="button"
                  onClick={() => setActiveTab(c.slug)}
                  className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                    isActive
                      ? "bg-[#0284C7] text-white shadow-md shadow-sky-500/20"
                      : "text-[#475569] hover:text-[#0F172A]"
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{c.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Compact Clinics Grid (Requirement #3 & #4) */}
        <div className={`grid grid-cols-1 ${activeTab === "all" ? "lg:grid-cols-2" : "max-w-3xl mx-auto"} gap-6 sm:gap-8`}>
          {filteredClinics.map((clinic) => {
            const dynamicData = dynamicStatusMap[clinic.slug];
            const live = computeLiveAvailability(clinic, dynamicData);
            const currentDayName = getDayName(new Date().getDay());
            const isExpanded = expandedClinicSlug === clinic.slug;
            const whatsappText = `Hello Doctor, I would like to book an appointment at ${clinic.name}.`;

            return (
              <div
                key={clinic.slug}
                className={`glass-card-floating bg-white rounded-[24px] sm:rounded-[28px] border border-slate-200/85 shadow-[0_12px_35px_rgba(18,40,32,0.05)] transition-all duration-350 flex flex-col justify-between overflow-hidden relative ${
                  isExpanded ? "ring-2 ring-emerald-500/30" : "hover:border-emerald-300"
                }`}
              >
                {/* Compact Card Header Strip (~50% height reduction compared to large 260px banner) */}
                <div className="p-5 sm:p-6 bg-gradient-to-br from-slate-900 via-[#122820] to-slate-900 text-white relative overflow-hidden">
                  <div className="absolute inset-0 opacity-20 pointer-events-none">
                    <OptimizedImage src={clinic.coverImage} alt={clinic.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0 overflow-hidden">
                        <OptimizedImage src={clinic.coverImage} alt={clinic.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                            {clinic.slug === 'belerhat' ? 'PRIMARY CENTER' : clinic.slug === 'nabadwip' ? 'CITY CHAMBER' : 'STUDIO'}
                          </span>
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 bg-white/20 rounded-md">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            {clinic.googleRating}
                          </span>
                        </div>
                        <h3 className="text-lg sm:text-xl font-display font-bold text-white truncate mt-0.5">
                          {clinic.name}
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border shadow-xs backdrop-blur-md ${live.badgeClass}`}>
                        <span className={`w-2 h-2 rounded-full ${live.isOpen ? "bg-emerald-500 animate-pulse" : "bg-slate-500"}`} />
                        {live.statusLabel}
                      </span>
                    </div>
                  </div>

                  {/* Compact Status Bar: Address + Today's Hours Summary */}
                  <div className="relative z-10 mt-4 pt-3 border-t border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-200">
                    <div className="flex items-center gap-2 min-w-0">
                      <MapPin className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                      <span className="truncate">{clinic.landmarkSub}</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-semibold text-[#34D399] shrink-0">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{live.chipLabel}</span>
                    </div>
                  </div>
                </div>

                {/* Compact Body summary when collapsed vs Full Details when expanded */}
                <div className="p-5 sm:p-6 space-y-5">
                  {/* Always Visible Summary Row: Address details + Quick contact actions */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-1 max-w-md">
                      <p className="text-xs sm:text-sm text-[#2C4238] leading-relaxed">
                        {clinic.address}
                      </p>
                      <div className="flex items-center gap-3 pt-1 text-xs font-bold text-[#122820]">
                        <a href={`tel:${clinic.primaryPhone}`} className="hover:text-[#10B981] transition-colors flex items-center gap-1">
                          <Phone className="w-3 h-3 text-[#10B981]" />
                          <span>{clinic.primaryPhoneDisplay}</span>
                        </a>
                        {clinic.alternatePhone && (
                          <a href={`tel:${clinic.alternatePhone}`} className="hover:text-[#10B981] transition-colors flex items-center gap-1 border-l pl-3 border-slate-200">
                            <Phone className="w-3 h-3 text-[#10B981]" />
                            <span>{clinic.alternatePhoneDisplay}</span>
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Quick CTA Actions right in compact card */}
                    <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0">
                      <button
                        type="button"
                        onClick={() => window.dispatchEvent(new CustomEvent("openContactModal", { detail: { clinicSlug: clinic.slug } }))}
                        className="btn-primary-premium py-2.5 px-4 text-xs font-bold w-full sm:w-auto shadow-xs"
                      >
                        <CalendarDays className="w-3.5 h-3.5" />
                        <span>Book</span>
                      </button>
                      <a
                        href={clinic.googleMapLink}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-secondary-premium py-2.5 px-3.5 text-xs font-bold shrink-0"
                      >
                        <Navigation className="w-3.5 h-3.5 text-[#10B981]" />
                        <span>Directions</span>
                      </a>
                    </div>
                  </div>

                  {/* Expand / Collapse Button (Only one expanded at a time) */}
                  <button
                    type="button"
                    onClick={() => toggleClinicExpansion(clinic.slug)}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-50 hover:bg-emerald-50/70 border border-slate-200/80 hover:border-emerald-300 text-xs font-bold text-[#122820] flex items-center justify-between transition-all"
                  >
                    <span className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#10B981]" />
                      <span>{isExpanded ? "Hide Timetable & Landmark Details" : "View Weekly Timetable & Facilities"}</span>
                    </span>
                    <span className="flex items-center gap-1 text-[#10B981]">
                      <span>{isExpanded ? "Collapse" : "Expand"}</span>
                      <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} />
                    </span>
                  </button>

                  {/* EXPANDED SECTION (Requirement #4: Premium Schedule + Chips + Landmarks) */}
                  {isExpanded && (
                    <div className="pt-2 border-t border-slate-100 space-y-6 animate-fadeIn">
                      {/* Highlight Chips (Requirement #4) */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        <div className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-200/70">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">Today's Availability</span>
                          <span className="text-xs font-bold text-[#122820] mt-0.5 block">
                            {live.todayClosed ? "Closed Today" : `${live.todayMorning || ""} ${live.todayMorning && live.todayEvening ? " & " : ""} ${live.todayEvening || ""}`.trim()}
                          </span>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 block">Current Status</span>
                          <span className="text-xs font-bold text-[#122820] mt-0.5 block">{live.statusLabel}</span>
                        </div>
                        <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/70">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block">Next Available Slot</span>
                          <span className="text-xs font-bold text-[#122820] mt-0.5 block">{live.nextAvailable}</span>
                        </div>
                      </div>

                      {/* Doctor Profile Mini-Card inside expanded view */}
                      <div className="glass-crystal p-3.5 rounded-2xl bg-gradient-to-br from-emerald-50/60 to-white border border-emerald-200/70 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[#122820] text-white flex items-center justify-center font-bold text-sm shrink-0">
                            <ToothIcon className="w-5 h-5 text-[#10B981]" />
                          </div>
                          <div>
                            <h4 className="font-display font-bold text-sm text-[#122820]">{clinic.doctorName}</h4>
                            <p className="text-[11px] text-[#4B6358]">{clinic.doctorSpecialization}</p>
                          </div>
                        </div>
                        <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-emerald-100/80 text-emerald-800 border border-emerald-200">
                          {live.doctorStatus}
                        </span>
                      </div>

                      {/* Compact Weekly Schedule Timeline Table */}
                      <div className="bg-slate-50/90 rounded-2xl border border-slate-200/80 p-4 space-y-2">
                        <div className="text-xs font-bold text-[#122820] pb-2 border-b border-slate-200/70 flex items-center justify-between">
                          <span>Full Weekly Schedule</span>
                          <span className="text-[11px] text-[#10B981] font-normal">🟢 Active Session Highlighted</span>
                        </div>
                        <div className="space-y-1.5">
                          {clinic.schedule.map((slot) => {
                            const isToday = slot.day === currentDayName;
                            return (
                              <div
                                key={slot.day}
                                className={`grid grid-cols-12 gap-2 items-center py-1.5 px-2.5 rounded-xl text-xs transition-all ${
                                  isToday
                                    ? "bg-emerald-100/70 border border-emerald-300 font-bold text-[#122820]"
                                    : "text-[#4B6358] hover:bg-white"
                                }`}
                              >
                                <div className="col-span-3 flex items-center gap-1.5">
                                  {isToday && <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />}
                                  <span>{slot.day}</span>
                                </div>
                                <div className="col-span-5 text-[#2C4238]">
                                  {slot.isClosed ? <span className="text-slate-400 italic">Closed</span> : slot.morning || "—"}
                                </div>
                                <div className="col-span-4 text-right text-[#2C4238]">
                                  {slot.isClosed ? <span className="text-slate-400 italic">Closed</span> : slot.evening || "—"}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* GPS Parking & Facilities Info */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 flex items-center gap-3">
                          <Car className="w-4 h-4 text-[#10B981] shrink-0" />
                          <div>
                            <span className="text-xs font-bold text-[#122820] block">Parking Notes</span>
                            <span className="text-[11px] text-[#4B6358]">{clinic.parkingInfo}</span>
                          </div>
                        </div>
                        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 flex items-center gap-3">
                          <ShieldCheck className="w-4 h-4 text-[#10B981] shrink-0" />
                          <div>
                            <span className="text-xs font-bold text-[#122820] block">Class-B Sterilization</span>
                            <span className="text-[11px] text-[#4B6358]">WHO Aseptic Standard</span>
                          </div>
                        </div>
                      </div>

                      {/* Full CTA Footer inside Expanded */}
                      <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-2">
                        <button
                          type="button"
                          onClick={() => window.dispatchEvent(new CustomEvent("openContactModal", { detail: { clinicSlug: clinic.slug } }))}
                          className="btn-primary-premium py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 col-span-2 sm:col-span-1"
                        >
                          <CalendarDays className="w-3.5 h-3.5" />
                          <span>Book Slot</span>
                        </button>
                        <a
                          href={`tel:${clinic.primaryPhone}`}
                          className="btn-secondary-premium py-2.5 text-xs font-bold flex items-center justify-center gap-1.5"
                        >
                          <Phone className="w-3.5 h-3.5 text-[#10B981]" />
                          <span>Call</span>
                        </a>
                        <a
                          href={`https://wa.me/${clinic.whatsappDigits}?text=${encodeURIComponent(whatsappText)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="py-2.5 px-3 rounded-xl bg-emerald-50 hover:bg-[#10B981] border border-emerald-200 text-[#10B981] hover:text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <WhatsAppIcon className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </a>
                        <a
                          href={clinic.googleMapLink}
                          target="_blank"
                          rel="noreferrer"
                          className="btn-secondary-premium py-2.5 text-xs font-bold flex items-center justify-center gap-1.5"
                        >
                          <Navigation className="w-3.5 h-3.5 text-[#10B981]" />
                          <span>Map</span>
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Hospital-Grade Verification Footer */}
        <div className="mt-12 max-w-4xl mx-auto glass-card-floating p-6 bg-white/95 rounded-[24px] sm:rounded-[28px] border border-emerald-200/70 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#10B981] shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-display font-bold text-sm text-[#122820]">
                Hospital-Grade WHO Autoclave &amp; Class-B Sterilization
              </h4>
              <p className="text-xs text-[#4B6358] mt-0.5">
                Multi-tier aseptic protocols and digital diagnostics standard across Belerhat, Nabadwip, and Parulia.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent("openContactModal", { detail: { clinicSlug: "belerhat" } }))}
            className="text-xs font-bold text-[#10B981] hover:text-[#059669] underline underline-offset-4 cursor-pointer shrink-0"
          >
            Request Consultation →
          </button>
        </div>

      </div>
    </section>
  );
}
