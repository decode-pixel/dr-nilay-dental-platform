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
  const [expandedTimetables, setExpandedTimetables] = useState<Record<string, boolean>>({
    belerhat: true,
    nabadwip: true,
    parulia: false,
  });

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

  const toggleTimetable = (slug: string) => {
    setExpandedTimetables((prev) => ({ ...prev, [slug]: !prev[slug] }));
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
        doctorStatus: `Back when ${dynamicOverride.statusInfo.status.toLowerCase()} ends`
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
        doctorStatus: "Consulting Here Today"
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
      doctorStatus: `Next Available on ${nextDayName}`
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
    <section id="locations" className="py-20 sm:py-28 bg-[#F8FAFC] font-sans border-b border-slate-200/60 scroll-mt-24 relative overflow-hidden">
      {/* Navigation anchor alias */}
      <span id="clinics" className="sr-only" />

      {/* Ambient Crystal Glow Backgrounds */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-emerald-500/5 via-teal-500/5 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <TagPill icon={MapPin} text="Website V3.2 • Multi-Location Architecture" />
          <h2 className="h2-premium mt-3 mb-4">
            Premium Healthcare Locations <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10B981] to-[#059669]">
              Most Convenient For You
            </span>
          </h2>
          <p className="body-premium max-w-2xl mx-auto">
            Experience world-class dental care across Purba Bardhaman and Nadia with live opening schedules, attending doctor status, and 1-tap frictionless booking.
          </p>
        </div>

        {/* Location Selector Tabs */}
        <div className="flex justify-center mb-12 sm:mb-16">
          <div className="inline-flex overflow-x-auto sm:overflow-visible max-w-full no-scrollbar rounded-full p-2 bg-white border border-slate-200/80 shadow-sm gap-1.5">
            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className={`px-6 py-3 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                activeTab === "all"
                  ? "bg-[#10B981] text-white shadow-md"
                  : "text-[#4B6358] hover:text-[#122820]"
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>All Locations ({clinicsList.length})</span>
            </button>
            {clinicsList.map((c) => {
              const isActive = activeTab === c.slug;
              return (
                <button
                  key={c.slug}
                  type="button"
                  onClick={() => setActiveTab(c.slug)}
                  className={`px-6 py-3 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                    isActive
                      ? "bg-[#10B981] text-white shadow-md"
                      : "text-[#4B6358] hover:text-[#122820]"
                  }`}
                >
                  <MapPin className="w-4 h-4" />
                  <span>{c.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Clinics Grid (Desktop side-by-side, Tablet balanced, Mobile single-column) */}
        <div className={`grid grid-cols-1 ${activeTab === "all" ? "lg:grid-cols-2" : "max-w-4xl mx-auto"} gap-8 lg:gap-10`}>
          {filteredClinics.map((clinic) => {
            const dynamicData = dynamicStatusMap[clinic.slug];
            const live = computeLiveAvailability(clinic, dynamicData);
            const currentDayName = getDayName(new Date().getDay());
            const whatsappText = `Hello Doctor, I would like to book an appointment at ${clinic.name}.`;

            return (
              <div
                key={clinic.slug}
                className="glass-card-floating bg-white rounded-[2rem] border border-slate-200/80 shadow-[0_20px_50px_rgba(18,40,32,0.06)] hover:shadow-[0_30px_70px_rgba(16,185,129,0.12)] transition-all duration-500 flex flex-col justify-between overflow-hidden relative group"
              >
                <div>
                  {/* Top Cover Image & Floating Live Badges */}
                  <div className="relative h-56 sm:h-64 w-full overflow-hidden bg-slate-900">
                    <OptimizedImage
                      src={clinic.coverImage}
                      alt={clinic.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#122820] via-transparent to-black/40" />

                    {/* Top Status Strip */}
                    <div className="absolute top-4 inset-x-4 flex items-center justify-between gap-2 z-10 flex-wrap">
                      <span className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold border shadow-md backdrop-blur-md ${live.badgeClass}`}>
                        <span className={`w-2 h-2 rounded-full ${live.isOpen ? "bg-emerald-500 animate-pulse" : "bg-slate-500"}`} />
                        {live.statusLabel}
                      </span>

                      <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-bold text-white bg-black/60 backdrop-blur-md border border-white/20 shadow-md">
                        <Clock className="w-3.5 h-3.5 text-[#10B981]" />
                        {live.chipLabel}
                      </span>
                    </div>

                    {/* Bottom Title inside Cover */}
                    <div className="absolute bottom-4 inset-x-5 z-10 flex items-end justify-between gap-4">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-300 block mb-1">
                          {clinic.slug === 'belerhat' ? 'CLINIC 01 • PRIMARY CENTER' : clinic.slug === 'nabadwip' ? 'CLINIC 02 • CITY CHAMBER' : 'REGIONAL CONSULTATION SUITE'}
                        </span>
                        <h3 className="text-2xl sm:text-3xl font-display font-bold text-white leading-tight">
                          {clinic.name}
                        </h3>
                      </div>
                      <div className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 bg-white/95 text-[#122820] rounded-xl shadow-md shrink-0">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                        <span>{clinic.googleRating}</span>
                        <span className="text-slate-400 font-normal">({clinic.reviewCount})</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Content Body */}
                  <div className="p-6 sm:p-8 space-y-7">
                    
                    {/* Today's Consulting Doctor Premium Mini-Card */}
                    <div className="glass-crystal p-4 rounded-2xl bg-gradient-to-br from-emerald-50/70 via-white to-white border border-emerald-200/80 flex items-center justify-between gap-4 shadow-xs">
                      <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-2xl bg-[#122820] text-white flex items-center justify-center font-display font-bold text-lg shrink-0 shadow-sm border border-white/10">
                          <ToothIcon className="w-6 h-6 text-[#10B981]" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-display font-bold text-base text-[#122820] leading-snug">
                              {clinic.doctorName}
                            </h4>
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-[#10B981]/15 text-[#10B981]">
                              Surgeon
                            </span>
                          </div>
                          <p className="text-xs text-[#4B6358] font-medium mt-0.5">
                            {clinic.doctorSpecialization}
                          </p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className={`inline-block px-2.5 py-1 rounded-lg text-[11px] font-bold font-mono ${
                          live.isOpen 
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                            : "bg-slate-100 text-slate-600 border border-slate-200"
                        }`}>
                          {live.doctorStatus}
                        </span>
                      </div>
                    </div>

                    {/* Landmark & Address Experience */}
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-[#10B981] shrink-0 mt-0.5">
                          <MapPin className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#10B981] bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/70">
                              <Sparkles className="w-3 h-3" />
                              {clinic.landmark}
                            </span>
                            <span className="text-xs font-semibold text-[#4B6358]">
                              {clinic.landmarkSub}
                            </span>
                          </div>
                          <p className="text-sm text-[#2C4238] leading-relaxed mt-2 font-normal">
                            {clinic.address}
                          </p>
                        </div>
                      </div>

                      {/* Clickable Phones Summary Row */}
                      <div className="flex items-center gap-4 pl-13 flex-wrap">
                        <a 
                          href={`tel:${clinic.primaryPhone}`}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#122820] hover:text-[#10B981] transition-colors"
                        >
                          <Phone className="w-3.5 h-3.5 text-[#10B981]" />
                          <span>{clinic.primaryPhoneDisplay}</span>
                        </a>
                        {clinic.alternatePhone && (
                          <a 
                            href={`tel:${clinic.alternatePhone}`}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#122820] hover:text-[#10B981] transition-colors border-l border-slate-200 pl-4"
                          >
                            <Phone className="w-3.5 h-3.5 text-[#10B981]" />
                            <span>{clinic.alternatePhoneDisplay}</span>
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Premium Weekly Timetable (Expandable / Readable) */}
                    <div className="bg-slate-50/90 rounded-2xl border border-slate-200/80 overflow-hidden">
                      <button
                        type="button"
                        onClick={() => toggleTimetable(clinic.slug)}
                        aria-expanded={expandedTimetables[clinic.slug]}
                        className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-100/60 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <Clock className="w-4 h-4 text-[#10B981]" />
                          <div>
                            <span className="text-sm font-bold font-display text-[#122820] block">
                              Weekly Timetable & Session Slots
                            </span>
                            <span className="text-xs text-[#10B981] font-semibold block mt-0.5">
                              {live.nextAvailable}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-[#4B6358]">
                          <span>{expandedTimetables[clinic.slug] ? "Hide" : "View Schedule"}</span>
                          <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${expandedTimetables[clinic.slug] ? "rotate-180 text-[#10B981]" : ""}`} />
                        </div>
                      </button>

                      {expandedTimetables[clinic.slug] && (
                        <div className="p-4 pt-0 border-t border-slate-200/60 space-y-2 animate-fadeIn">
                          <div className="grid grid-cols-12 gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 pb-1 border-b border-slate-200/60">
                            <div className="col-span-3">Day</div>
                            <div className="col-span-5">Morning Session</div>
                            <div className="col-span-4 text-right">Evening Session</div>
                          </div>

                          {clinic.schedule.map((slot) => {
                            const isToday = slot.day === currentDayName;
                            return (
                              <div
                                key={slot.day}
                                className={`grid grid-cols-12 gap-2 items-center py-2 px-2.5 rounded-xl text-xs transition-all ${
                                  isToday
                                    ? "bg-emerald-50/90 border border-emerald-300 font-bold text-[#122820] shadow-2xs"
                                    : "text-[#4B6358] hover:bg-white"
                                }`}
                              >
                                <div className="col-span-3 flex items-center gap-1.5">
                                  {isToday && <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-ping" />}
                                  <span className={isToday ? "text-[#122820] font-bold" : "font-medium text-[#122820]"}>
                                    {slot.day}
                                  </span>
                                </div>

                                <div className="col-span-5 text-[#2C4238]">
                                  {slot.isClosed ? (
                                    <span className="text-slate-400 italic">Closed</span>
                                  ) : slot.morning ? (
                                    slot.morning
                                  ) : (
                                    <span className="text-slate-400 font-normal">—</span>
                                  )}
                                </div>

                                <div className="col-span-4 text-right text-[#2C4238]">
                                  {slot.isClosed ? (
                                    <span className="text-slate-400 italic">Closed</span>
                                  ) : slot.evening ? (
                                    slot.evening
                                  ) : (
                                    <span className="text-slate-400 font-normal">—</span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Google Map Mini Card & Transit Guidance */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <a
                        href={clinic.googleMapLink}
                        target="_blank"
                        rel="noreferrer"
                        className="glass-crystal p-3.5 rounded-2xl bg-white hover:bg-emerald-50/50 border border-slate-200/80 hover:border-emerald-300 transition-all flex items-center justify-between group/map"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-[#10B981]/15 text-[#10B981] flex items-center justify-center shrink-0 group-hover/map:bg-[#10B981] group-hover/map:text-white transition-colors">
                            <Navigation className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-[#122820] block">GPS Navigation</span>
                            <span className="text-[11px] text-[#4B6358]">Open in Google Maps</span>
                          </div>
                        </div>
                        <ExternalLink className="w-4 h-4 text-slate-400 group-hover/map:text-[#10B981] transition-colors" />
                      </a>

                      <div className="glass-crystal p-3.5 rounded-2xl bg-white border border-slate-200/80 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                          <Car className="w-4 h-4 text-[#10B981]" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-[#122820] block">Easy Parking</span>
                          <span className="text-[11px] text-[#4B6358] line-clamp-1">{clinic.parkingInfo}</span>
                        </div>
                      </div>
                    </div>

                    {/* Future Ready Components Placeholders Banner */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-400">
                      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                        <span>Future Ready Modules:</span>
                        {FUTURE_MODULES.slice(0, 3).map((mod, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 whitespace-nowrap">
                            ✓ {mod.label}
                          </span>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>

                {/* Sticky Action Buttons Strip */}
                <div className="p-6 sm:p-8 pt-5 bg-slate-50/80 border-t border-slate-200/70 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 mt-auto">
                  {/* Primary Book Appointment (Pre-selects exact clinic Slug!) */}
                  <button
                    type="button"
                    onClick={() => window.dispatchEvent(new CustomEvent("openContactModal", { detail: { clinicSlug: clinic.slug } }))}
                    className="btn-primary-premium shadow-md flex items-center justify-center gap-2 py-3.5 cursor-pointer w-full"
                  >
                    <CalendarDays className="w-4 h-4" />
                    <span>Book Appointment</span>
                  </button>

                  {/* Call Now Button */}
                  <a
                    href={`tel:${clinic.primaryPhone}`}
                    className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200/90 text-[#122820] text-xs sm:text-sm font-bold transition-all shadow-xs"
                  >
                    <Phone className="w-4 h-4 text-[#10B981]" />
                    <span>Call Now</span>
                  </a>

                  {/* WhatsApp Button with Pre-filled Text */}
                  <a
                    href={`https://wa.me/${clinic.whatsappDigits}?text=${encodeURIComponent(whatsappText)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-emerald-50 hover:bg-[#10B981] border border-emerald-200 text-[#10B981] hover:text-white text-xs sm:text-sm font-bold transition-all shadow-xs"
                  >
                    <WhatsAppIcon className="w-4 h-4" />
                    <span>WhatsApp</span>
                  </a>

                  {/* Get Directions */}
                  <a
                    href={clinic.googleMapLink}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200/90 text-[#122820] text-xs sm:text-sm font-bold transition-all shadow-xs"
                  >
                    <Navigation className="w-4 h-4 text-[#10B981]" />
                    <span>Directions</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dynamic CMS Notice Or Verification Footer */}
        <div className="mt-14 max-w-4xl mx-auto glass-card-floating p-6 bg-white/95 rounded-3xl border border-emerald-200/70 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#10B981] shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-display font-bold text-sm text-[#122820]">
                Hospital-Grade WHO Autoclave & Class-B Sterilization
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
            Request Urgent Care / Consultation →
          </button>
        </div>

      </div>
    </section>
  );
}
