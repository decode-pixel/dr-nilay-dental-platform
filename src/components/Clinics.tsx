import React, { useState, useEffect } from "react";
import { 
  MapPin, Clock, Phone, Navigation, CalendarDays, 
  Car, Wind, Droplet, CreditCard, Users, CalendarCheck, ShieldCheck, UserCheck, Stethoscope,
  ShieldAlert, Star, ChevronDown, Bus
} from "lucide-react";
import { WhatsAppIcon, ToothIcon } from "./Icons";
import { ClinicService } from "../lib/clinicService";
import { logger } from "../lib/logger";
import TagPill from "./TagPill";

const FACILITY_ICONS: Record<string, any> = {
  Users,
  CreditCard,
  Car,
  Wind,
  Droplet,
  ShieldCheck,
  CalendarCheck,
  UserCheck,
  Camera: Stethoscope,
};

const STATUS_BADGES: Record<string, { text: string; bg: string; border: string }> = {
  'Open': { text: 'text-emerald-700', bg: 'bg-emerald-100/90', border: 'border-emerald-300' },
  'Closed': { text: 'text-rose-700', bg: 'bg-rose-100/90', border: 'border-rose-300' },
  'Holiday': { text: 'text-amber-700', bg: 'bg-amber-100/90', border: 'border-amber-300' },
  'Temporary Closure': { text: 'text-rose-700', bg: 'bg-rose-100/90', border: 'border-rose-300' },
  'Doctor Unavailable': { text: 'text-amber-700', bg: 'bg-amber-100/90', border: 'border-amber-300' },
};

export default function Clinics() {
  const [clinics, setClinics] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [showWeeklySchedule, setShowWeeklySchedule] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const todayStr = `${year}-${month}-${day}`;

    ClinicService.getClinicsWithStatus(todayStr).then((data) => {
      if (isMounted) {
        setClinics(data);
        if (data.length > 0) {
          setActiveTab(data[0].slug);
        }
        setLoading(false);
      }
    }).catch((err) => {
      logger.error('Failed to load dynamic clinics for public landing page:', err);
      if (isMounted) setLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const activeClinic = clinics.find((c) => c.slug === activeTab);

  if (loading) {
    return (
      <div className="min-h-[450px] flex flex-col items-center justify-center text-[#122820] font-sans">
        <Clock className="w-8 h-8 animate-spin text-[#10B981] mb-3" />
        <span className="text-xs text-[#4B6358] uppercase font-semibold tracking-widest">Loading clinic locations...</span>
      </div>
    );
  }

  if (clinics.length === 0) {
    return null;
  }

  const getTreatmentsList = (slug: string) => {
    if (slug === 'belerhat') {
      return ["Root Canal Treatment", "Dental Filling", "Scaling", "Crown & Bridge", "Denture", "Tooth Extraction", "Oral Surgery", "Consultation"];
    } else if (slug === 'parulia') {
      return ["Consultation", "Dental Filling", "Scaling"];
    } else {
      return ["Consultation", "Tooth Extraction", "Root Canal Treatment"];
    }
  };

  return (
    <section id="locations" className="py-20 sm:py-28 bg-white font-sans border-b border-slate-200/60 scroll-mt-24">
      {/* Anchor alias for #clinics navigation */}
      <span id="clinics" className="sr-only" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-18">
          <TagPill icon={MapPin} text="Our Clinics" />
          <h2 className="h2-premium mt-3 mb-4">
            Choose The Location <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10B981] to-[#059669]">
              Most Convenient For You
            </span>
          </h2>
          <p className="body-premium max-w-xl mx-auto">
            Explore Dr. Nilay Saha's clinical studios across West Bengal with real-time opening status and direct contact details.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex justify-center mb-14 sm:mb-16">
          <div className="inline-flex overflow-x-auto sm:overflow-visible max-w-full no-scrollbar rounded-full p-2 bg-slate-100/90 border border-slate-200 shadow-sm">
            {clinics.map((clinic) => {
              const isActive = activeTab === clinic.slug;
              return (
                <button
                  key={clinic.id}
                  onClick={() => setActiveTab(clinic.slug)}
                  className={`relative px-6 sm:px-8 py-3 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 whitespace-nowrap shrink-0 flex items-center gap-2 cursor-pointer ${
                    isActive
                      ? "bg-[#10B981] text-white shadow-md"
                      : "text-[#4B6358] hover:text-[#122820]"
                  }`}
                >
                  <MapPin className={`w-4 h-4 ${isActive ? "text-white" : "text-[#10B981]"}`} />
                  <span>{clinic.slug.charAt(0).toUpperCase() + clinic.slug.slice(1)}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Clinic Container */}
        {activeClinic && (
          <div className="card-premium p-0 bg-white border border-slate-200/80 shadow-md flex flex-col lg:flex-row overflow-hidden">
            
            {/* Left Brand Panel */}
            <div className="w-full lg:w-5/12 bg-gradient-to-br from-[#122820] via-[#163026] to-[#0f221b] text-white p-8 sm:p-12 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-emerald-900/30">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider text-[#10B981] bg-emerald-950/80 border border-emerald-500/40">
                    Verified Healthcare Center
                  </span>
                  <MapPin className="w-6 h-6 text-[#10B981]" />
                </div>

                <div className="space-y-2 pt-4">
                  <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">Clinical Location</span>
                  <h3 className="text-3xl sm:text-4xl font-display font-bold text-white leading-tight">{activeClinic.name}</h3>
                  <p className="text-sm text-emerald-100/80 leading-relaxed pt-2">
                    {activeClinic.address}
                  </p>
                </div>
              </div>

              <div className="pt-8 border-t border-emerald-800/40 flex items-center gap-3.5 mt-8">
                <div className="w-11 h-11 rounded-2xl bg-[#10B981]/20 border border-[#10B981]/40 flex items-center justify-center text-[#10B981] shrink-0">
                  <ToothIcon className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-emerald-400 uppercase tracking-wider font-bold block">Attending Surgeon</span>
                  <span className="text-sm font-display font-bold text-white">{activeClinic.statusInfo?.available_doctor || "Dr. Nilay Saha"}</span>
                </div>
              </div>
            </div>

            {/* Right Information Details */}
            <div className="w-full lg:w-7/12 p-8 sm:p-12 flex flex-col justify-between bg-white">
              <div>
                {/* Header & Status Badge */}
                <div className="mb-8 pb-8 border-b border-slate-100 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="text-2xl sm:text-3xl font-display font-bold text-[#122820] leading-tight">{activeClinic.name}</h3>
                      {activeClinic.google_rating && (
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200/80 rounded-full shadow-sm">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                          {activeClinic.google_rating} ({activeClinic.review_count || (activeClinic.slug === 'belerhat' ? 120 : activeClinic.slug === 'parulia' ? 48 : 32)} reviews)
                        </span>
                      )}
                    </div>
                    <p className="text-sm sm:text-[15px] text-[#4B6358] leading-relaxed max-w-2xl mt-3">
                      {activeClinic.visiting_note || "Premium modern dental care, advanced Class-B sterilization, and comprehensive family diagnostics."}
                    </p>
                  </div>

                  <div className="shrink-0">
                    <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold border shadow-sm ${
                      STATUS_BADGES[activeClinic.statusInfo?.status]?.text || 'text-slate-700 bg-slate-100'
                    } ${
                      STATUS_BADGES[activeClinic.statusInfo?.status]?.bg || ''
                    } ${
                      STATUS_BADGES[activeClinic.statusInfo?.status]?.border || 'border-slate-300'
                    }`}>
                      <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
                      {activeClinic.statusInfo?.status || "Open"}
                    </span>
                  </div>
                </div>

                {/* Notices Alert Box */}
                {activeClinic.notice && (
                  <div className="mb-8 p-4.5 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-[#122820] text-xs flex items-start gap-3.5 shadow-sm">
                    <ShieldAlert className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-[#122820] text-sm">{activeClinic.notice.title}</p>
                      <p className="mt-1 leading-[1.6] text-[#4B6358]">{activeClinic.notice.description}</p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 mb-8">
                  {/* Address & Hours */}
                  <div className="space-y-7">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0 shadow-sm">
                        <MapPin className="w-5 h-5 text-[#10B981]" />
                      </div>
                      <div>
                        <h4 className="text-[#122820] font-bold mb-1.5 text-base font-display">Address</h4>
                        <p className="text-sm text-[#4B6358] leading-relaxed">
                          {activeClinic.address}
                        </p>
                        {activeClinic.landmark && (
                          <p className="text-xs text-[#10B981] mt-2.5 font-bold px-3 py-1 bg-emerald-50 rounded-xl inline-block border border-emerald-200/60">
                            Landmark: {activeClinic.landmark}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0 shadow-sm">
                        <Clock className="w-5 h-5 text-[#10B981]" />
                      </div>
                      <div className="w-full">
                        <h4 className="text-[#122820] font-bold mb-1.5 text-base font-display">Timings & Schedule</h4>
                        <p className="text-sm text-[#122820] font-semibold leading-[1.6]">
                          {activeClinic.statusInfo?.session_times === 'Visiting schedule updating soon.' || activeClinic.visiting_note === 'Visiting schedule updating soon.'
                            ? 'Visiting schedule updating soon.'
                            : activeClinic.statusInfo?.status === 'Open'
                            ? `Open today: ${activeClinic.statusInfo.session_times}`
                            : `Closed today: ${activeClinic.statusInfo?.reason_detail || activeClinic.statusInfo?.reason || 'Scheduled Off'}`}
                        </p>

                        {activeClinic.statusInfo?.session_times !== 'Visiting schedule updating soon.' && activeClinic.visiting_note !== 'Visiting schedule updating soon.' && (
                          <>
                            <button
                              type="button"
                              onClick={() => setShowWeeklySchedule(!showWeeklySchedule)}
                              className="mt-2 text-xs text-[#10B981] hover:underline flex items-center gap-1 font-bold cursor-pointer"
                            >
                              <span>{showWeeklySchedule ? 'Hide Weekly Timings' : 'View Weekly Timings'}</span>
                              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showWeeklySchedule ? 'rotate-180' : ''}`} />
                            </button>

                            {showWeeklySchedule && (
                              <div className="mt-3 bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2 text-xs animate-fadeIn">
                                {[
                                  { day: 'Mon - Fri', hours: '10:00 AM - 1:30 PM, 5:00 PM - 8:30 PM' },
                                  { day: 'Saturday', hours: '10:00 AM - 2:00 PM, 6:00 PM - 9:00 PM' },
                                  { day: 'Sunday', hours: 'By Appointment / Emergency' }
                                ].map((slot, idx) => (
                                  <div key={idx} className="flex justify-between items-center text-[#4B6358] py-1 border-b border-slate-200/60 last:border-0">
                                    <span className="font-bold text-[#122820]">{slot.day}</span>
                                    <span>{slot.hours}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Treatments & Facilities Available */}
                  <div className="space-y-7">
                    <div>
                      <h4 className="text-xs text-[#4B6358] uppercase tracking-wider font-bold mb-3.5">Procedures Available</h4>
                      <div className="flex flex-wrap gap-2">
                        {getTreatmentsList(activeClinic.slug).map((treatment, idx) => (
                          <span key={idx} className="px-3 py-1.5 text-xs font-semibold text-[#122820] bg-slate-50 border border-slate-200 rounded-full hover:bg-emerald-50 hover:border-emerald-300 hover:text-[#10B981] transition-colors cursor-default">
                            {treatment}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs text-[#4B6358] uppercase tracking-wider font-bold mb-3.5">Clinic Facilities</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4">
                        {activeClinic.facilities && activeClinic.facilities.length > 0 ? (
                          activeClinic.facilities.map((facName: string, idx: number) => {
                            const matchingIcon = Object.keys(FACILITY_ICONS).find(
                              (key) => key.toLowerCase() === facName.replace(/\s+/g, '').toLowerCase()
                            );
                            const Icon = matchingIcon ? FACILITY_ICONS[matchingIcon] : ShieldCheck;

                            return (
                              <div key={idx} className="flex items-center gap-2.5 text-[#4B6358] hover:text-[#122820] transition-colors cursor-default group">
                                <Icon className="w-4 h-4 shrink-0 text-[#10B981] group-hover:scale-110 transition-transform" />
                                <span className="text-xs sm:text-sm font-medium">{facName}</span>
                              </div>
                            );
                          })
                        ) : (
                          <p className="text-xs text-[#4B6358]">No facilities listed.</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Patient Guidance Banner */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-100 mb-8">
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-1.5">
                    <div className="flex items-center gap-2 text-[#10B981]">
                      <Car className="w-4 h-4" />
                      <h5 className="text-xs font-bold uppercase tracking-wider text-[#122820]">Parking Facility</h5>
                    </div>
                    <p className="text-xs text-[#4B6358] leading-relaxed">
                      {activeClinic.parking_info || 'Dedicated two-wheeler and street parking available outside.'}
                    </p>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-1.5">
                    <div className="flex items-center gap-2 text-[#10B981]">
                      <Bus className="w-4 h-4" />
                      <h5 className="text-xs font-bold uppercase tracking-wider text-[#122820]">Public Transit</h5>
                    </div>
                    <p className="text-xs text-[#4B6358] leading-relaxed">
                      {activeClinic.transit_info || 'Accessible within 2-minute walk from major local bus stops.'}
                    </p>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-1.5">
                    <div className="flex items-center gap-2 text-[#10B981]">
                      <CreditCard className="w-4 h-4" />
                      <h5 className="text-xs font-bold uppercase tracking-wider text-[#122820]">Payments Accepted</h5>
                    </div>
                    <p className="text-xs text-[#4B6358] leading-relaxed">
                      {activeClinic.payment_info || 'UPI (GPay/PhonePe), Cash, Visa/Mastercard Cards accepted.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-7 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <button
                  type="button"
                  onClick={() => window.dispatchEvent(new CustomEvent('openContactModal'))}
                  className="flex items-center justify-center gap-2 px-5 py-4 rounded-xl bg-[#122820] hover:bg-[#10B981] text-white text-sm font-bold shadow-sm transition-all duration-200 cursor-pointer"
                >
                  <CalendarDays className="w-4 h-4" />
                  <span>Schedule Visit</span>
                </button>
                <a
                  href={`https://wa.me/${activeClinic.whatsapp_phone?.replace(/[^0-9]/g, '') || '919064039116'}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 px-5 py-4 rounded-xl bg-emerald-50 hover:bg-[#10B981] text-[#10B981] hover:text-white text-sm font-bold border border-emerald-200 transition-all duration-200"
                >
                  <WhatsAppIcon className="w-4 h-4" />
                  <span>WhatsApp</span>
                </a>
                <a
                  href={`tel:${activeClinic.phone?.replace(/[^0-9+]/g, '') || '+919064039116'}`}
                  className="flex items-center justify-center gap-2 px-5 py-4 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[#122820] text-sm font-bold transition-all shadow-sm"
                >
                  <Phone className="w-4 h-4 text-[#10B981]" />
                  <span>Call Clinic</span>
                </a>
                <a
                  href={activeClinic.google_map_link || '#'}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 px-5 py-4 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[#122820] text-sm font-bold transition-all shadow-sm"
                >
                  <Navigation className="w-4 h-4 text-[#10B981]" />
                  <span>Get Directions</span>
                </a>
              </div>

            </div>

          </div>
        )}

      </div>
    </section>
  );
}
