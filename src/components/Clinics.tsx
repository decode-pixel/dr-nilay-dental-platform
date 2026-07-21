import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  MapPin, Clock, Phone, Navigation, CalendarDays, 
  Car, Wind, Droplet, CreditCard, Users, CalendarCheck, ShieldCheck, UserCheck, Stethoscope,
  AlertTriangle, Info, ShieldAlert, Sparkles, Star, ChevronDown, Bus
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
      <div className="min-h-[500px] flex flex-col items-center justify-center text-[#0F172A] font-sans">
        <Clock className="w-8 h-8 animate-spin text-[#2563EB] mb-3" />
        <span className="text-xs text-[#64748B] uppercase font-semibold tracking-widest">Loading clinics info...</span>
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
    <section id="locations" className="relative py-24 sm:py-32 z-10 overflow-hidden font-sans">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center max-w-3xl mx-auto mb-16 sm:mb-20"
        >
          <TagPill icon={MapPin} text="Our Clinics" />
          <h2 className="text-[36px] sm:text-[48px] lg:text-[56px] font-display font-bold text-[#0F172A] tracking-tight leading-[1.12] mb-5">
            Choose the location <span className="text-[#2563EB]">most convenient for you.</span>
          </h2>
        </motion.div>

        {/* Tab Selector */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          className="flex justify-center mb-16 sm:mb-20"
        >
          <div className="inline-flex overflow-x-auto sm:overflow-visible max-w-full no-scrollbar rounded-full p-2 glass-2 border border-white/80 shadow-md">
            {clinics.map((clinic) => (
              <button
                key={clinic.id}
                onClick={() => setActiveTab(clinic.slug)}
                className={`relative px-7 py-3.5 rounded-full text-sm font-semibold transition-all duration-300 whitespace-nowrap shrink-0 ${
                  activeTab === clinic.slug ? 'text-white shadow-md' : 'text-[#475569] hover:text-[#0F172A]'
                }`}
              >
                {activeTab === clinic.slug && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-[#2563EB] rounded-full shadow-[0_4px_16px_rgba(37,99,235,0.35)]"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <MapPin className={`w-4 h-4 ${activeTab === clinic.slug ? 'text-white' : 'text-[#2563EB]'}`} />
                  {clinic.slug.charAt(0).toUpperCase() + clinic.slug.slice(1)}
                </span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Clinic Content */}
        {activeClinic && (
          <div className="glass-3 rounded-[2.5rem] overflow-hidden border border-white/80 shadow-[0_20px_60px_rgba(15,23,42,0.08)] flex flex-col lg:flex-row relative group min-h-[640px]">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.03] via-transparent to-sky-500/[0.03] opacity-100 pointer-events-none" />

            {/* Left Column: Prominent Clinic Vector Presentation */}
            <div className="w-full lg:w-5/12 flex flex-col bg-[#09281D] text-[#F4F7F4] p-8 sm:p-10 justify-between border-b lg:border-b-0 lg:border-r border-emerald-900/20 relative">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider text-[#34D399] bg-[#061D15] border border-emerald-500/30">
                    Verified Healthcare Center
                  </span>
                  <MapPin className="w-6 h-6 text-[#10B981]" />
                </div>

                <div className="space-y-2 pt-4">
                  <span className="text-xs font-mono font-bold text-[#C5A059] uppercase tracking-wider">Clinical Location</span>
                  <h3 className="text-3xl sm:text-4xl font-display font-bold text-[#F4F7F4]">{activeClinic.name}</h3>
                  <p className="text-sm text-[#A2C7B7] leading-relaxed pt-2">
                    {activeClinic.address}
                  </p>
                </div>
              </div>

              <div className="pt-8 border-t border-emerald-900/40 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#10B981]/20 border border-[#10B981]/40 flex items-center justify-center text-[#10B981] shrink-0">
                  <ToothIcon className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-[#34D399] uppercase tracking-wider font-bold block">Attending Surgeon</span>
                  <span className="text-sm font-display font-bold text-[#F4F7F4]">{activeClinic.statusInfo?.available_doctor || "Dr. Nilay Saha"}</span>
                </div>
              </div>
            </div>

            {/* Right Column: Clean Hierarchy & Metadata */}
            <div className="w-full lg:w-7/12 p-8 sm:p-12 lg:p-14 flex flex-col relative z-10">
              <div className="flex-1">
                {/* Title & Description & Rating */}
                <div className="mb-8 pb-8 border-b border-slate-200/70 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-[#0F172A] leading-tight">{activeClinic.name}</h3>
                      {/* TODO(confirm-before-deploy): verify verified Google rating and review count per clinic location before production deploy */}
                      {activeClinic.google_rating && (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200/80 rounded-full shadow-sm">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                          {activeClinic.google_rating} ({activeClinic.review_count || (activeClinic.slug === 'belerhat' ? 120 : activeClinic.slug === 'parulia' ? 48 : 32)} reviews)
                        </span>
                      )}
                    </div>
                    <p className="text-sm sm:text-base text-[#475569] leading-[1.65] max-w-2xl mt-3 font-normal">
                      {activeClinic.visiting_note || "Premium modern dental care, advanced sterilization standards, and comprehensive family diagnostics."}
                    </p>
                  </div>

                  {/* Status Badge */}
                  <div className="shrink-0">
                    <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold border shadow-sm ${
                      STATUS_BADGES[activeClinic.statusInfo?.status]?.text || 'text-slate-700 bg-slate-100'
                    } ${
                      STATUS_BADGES[activeClinic.statusInfo?.status]?.bg || ''
                    } ${
                      STATUS_BADGES[activeClinic.statusInfo?.status]?.border || 'border-slate-300'
                    }`}>
                      <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
                      {activeClinic.statusInfo?.status}
                    </span>
                  </div>
                </div>

                {/* Notices Alert Box (if active) */}
                {activeClinic.notice && (
                  <div className="mb-8 p-4.5 rounded-2xl bg-blue-50/90 border border-blue-200 text-[#0F172A] text-xs flex items-start gap-3.5 shadow-sm">
                    <ShieldAlert className="w-5 h-5 text-[#2563EB] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-[#0F172A] text-sm">{activeClinic.notice.title}</p>
                      <p className="mt-1 leading-[1.6] text-[#475569]">{activeClinic.notice.description}</p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 mb-8">
                  {/* Location & Timings */}
                  <div className="space-y-8">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-blue-100/70 border border-blue-200 flex items-center justify-center shrink-0 shadow-sm">
                        <MapPin className="w-5 h-5 text-[#2563EB]" />
                      </div>
                      <div>
                        <h4 className="text-[#0F172A] font-semibold mb-1.5 text-base font-display">Address</h4>
                        <p className="text-sm text-[#475569] leading-[1.65] font-normal">
                          {activeClinic.address}
                        </p>
                        {activeClinic.landmark && (
                          <p className="text-xs text-[#2563EB] mt-3 font-medium px-3 py-1.5 bg-blue-50 rounded-xl inline-block border border-blue-200/60">
                            Landmark: {activeClinic.landmark}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-sky-100/70 border border-sky-200 flex items-center justify-center shrink-0 shadow-sm">
                        <Clock className="w-5 h-5 text-sky-600" />
                      </div>
                      <div className="w-full">
                        <h4 className="text-[#0F172A] font-semibold mb-1.5 text-base font-display">Opening Status & Hours</h4>
                        <p className="text-sm text-[#0F172A] font-semibold leading-[1.6]">
                          {activeClinic.statusInfo?.session_times === 'Visiting schedule updating soon.' || activeClinic.visiting_note === 'Visiting schedule updating soon.'
                            ? 'Visiting schedule updating soon.'
                            : activeClinic.statusInfo?.status === 'Open'
                            ? `Open today: ${activeClinic.statusInfo.session_times}`
                            : `Closed today: ${activeClinic.statusInfo?.reason_detail || activeClinic.statusInfo?.reason || 'Scheduled Off'}`}
                        </p>

                        {activeClinic.statusInfo?.session_times !== 'Visiting schedule updating soon.' && activeClinic.visiting_note !== 'Visiting schedule updating soon.' && (
                          <>
                            <button
                              onClick={() => setShowWeeklySchedule(!showWeeklySchedule)}
                              className="mt-2.5 text-xs text-[#2563EB] hover:underline flex items-center gap-1 font-semibold"
                            >
                              <span>{showWeeklySchedule ? 'Hide Weekly Timings' : 'View Weekly Timings'}</span>
                              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showWeeklySchedule ? 'rotate-180' : ''}`} />
                            </button>

                            <AnimatePresence>
                              {showWeeklySchedule && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="overflow-hidden mt-3"
                                >
                                  <div className="glass-2 rounded-2xl p-4 border border-slate-200/80 space-y-2 text-xs shadow-sm">
                                    {[
                                      { day: 'Mon - Fri', hours: '10:00 AM - 1:30 PM, 5:00 PM - 8:30 PM' },
                                      { day: 'Saturday', hours: '10:00 AM - 2:00 PM, 6:00 PM - 9:00 PM' },
                                      { day: 'Sunday', hours: 'By Appointment Only / Emergency' }
                                    ].map((slot, idx) => (
                                      <div key={idx} className="flex justify-between items-center text-[#475569] py-1 border-b border-slate-200/50 last:border-0">
                                        <span className="font-semibold text-[#0F172A]">{slot.day}</span>
                                        <span>{slot.hours}</span>
                                      </div>
                                    ))}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </>
                        )}

                        <div className="mt-5 flex items-center gap-3.5 p-3 rounded-2xl bg-[#FAFDFB] border border-emerald-900/10 max-w-sm shadow-sm">
                          <div className="w-10 h-10 rounded-xl bg-[#10B981]/20 border border-[#10B981]/40 flex items-center justify-center text-[#10B981] shrink-0 shadow-sm">
                            <ToothIcon className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-[10px] text-[#10B981] uppercase tracking-wider font-bold block">Attending Surgeon</span>
                            <span className="text-sm font-display font-bold text-[#122820]">{activeClinic.statusInfo?.available_doctor || "Dr. Nilay Saha"}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Treatments & Facilities */}
                  <div className="space-y-8">
                    {/* Treatments */}
                    <div>
                      <h4 className="text-xs text-[#64748B] uppercase tracking-wider font-semibold mb-3.5">Treatments Available</h4>
                      <div className="flex flex-wrap gap-2">
                        {getTreatmentsList(activeClinic.slug).map((treatment, idx) => (
                          <span key={idx} className="px-3 py-1.5 text-xs font-medium text-[#0F172A] bg-slate-100/90 border border-slate-200/80 rounded-full hover:bg-blue-50 hover:border-blue-200 hover:text-[#2563EB] transition-colors cursor-default">
                            {treatment}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Facilities */}
                    <div>
                      <h4 className="text-xs text-[#64748B] uppercase tracking-wider font-semibold mb-3.5">Clinic Facilities</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4">
                        {activeClinic.facilities && activeClinic.facilities.length > 0 ? (
                          activeClinic.facilities.map((facName: string, idx: number) => {
                            const matchingIcon = Object.keys(FACILITY_ICONS).find(
                              (key) => key.toLowerCase() === facName.replace(/\s+/g, '').toLowerCase()
                            );
                            const Icon = matchingIcon ? FACILITY_ICONS[matchingIcon] : ShieldCheck;

                            return (
                              <div key={idx} className="flex items-center gap-2.5 text-[#475569] hover:text-[#0F172A] transition-colors cursor-default group">
                                <Icon className="w-4 h-4 shrink-0 text-[#2563EB] group-hover:scale-110 transition-transform" />
                                <span className="text-xs sm:text-sm font-medium">{facName}</span>
                              </div>
                            );
                          })
                        ) : (
                          <p className="text-xs text-[#64748B]">No facilities listed.</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Patient Guidance Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-200/70 mb-6">
                  <div className="glass-2 rounded-2xl p-4 border border-slate-200/70 space-y-1.5 shadow-sm">
                    <div className="flex items-center gap-2 text-[#2563EB]">
                      <Car className="w-4 h-4" />
                      <h5 className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">Parking Facility</h5>
                    </div>
                    <p className="text-xs text-[#475569] leading-relaxed">
                      {activeClinic.parking_info || 'Dedicated two-wheeler and street parking available directly outside.'}
                    </p>
                  </div>

                  <div className="glass-2 rounded-2xl p-4 border border-slate-200/70 space-y-1.5 shadow-sm">
                    <div className="flex items-center gap-2 text-sky-600">
                      <Bus className="w-4 h-4" />
                      <h5 className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">Public Transit</h5>
                    </div>
                    <p className="text-xs text-[#475569] leading-relaxed">
                      {activeClinic.transit_info || 'Accessible within a 2-minute walk from major local bus stops and toto stands.'}
                    </p>
                  </div>

                  <div className="glass-2 rounded-2xl p-4 border border-slate-200/70 space-y-1.5 shadow-sm">
                    <div className="flex items-center gap-2 text-emerald-600">
                      <CreditCard className="w-4 h-4" />
                      <h5 className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">Payment Accepted</h5>
                    </div>
                    <p className="text-xs text-[#475569] leading-relaxed">
                      {activeClinic.payment_info || 'UPI (GPay/PhonePe), Cash, Visa/Mastercard Debit & Credit Cards accepted.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-auto pt-8 border-t border-slate-200/70 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <button onClick={() => window.dispatchEvent(new CustomEvent('openContactModal'))} className="flex items-center justify-center gap-2 px-5 py-4 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] text-white text-sm font-semibold border border-blue-600 shadow-[0_4px_16px_rgba(37,99,235,0.3)] hover:shadow-[0_6px_24px_rgba(37,99,235,0.5)] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300">
                  <CalendarDays className="w-4 h-4" />
                  <span>Schedule Visit</span>
                </button>
                <a href={`https://wa.me/${activeClinic.whatsapp_phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 px-5 py-4 rounded-xl bg-white text-[#0F172A] text-sm font-semibold border border-slate-200/90 shadow-sm hover:bg-slate-50 hover:border-slate-300 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300">
                  <WhatsAppIcon className="w-4 h-4 text-emerald-500" />
                  <span>WhatsApp</span>
                </a>
                <a href={`tel:${activeClinic.phone.replace(/[^0-9+]/g, '')}`} className="flex items-center justify-center gap-2 px-5 py-4 rounded-xl glass-2 border border-slate-200/80 text-[#0F172A] text-sm font-semibold hover:bg-white hover:border-blue-300 transition-all shadow-sm">
                  <Phone className="w-4 h-4 text-[#2563EB]" />
                  <span>Call Clinic</span>
                </a>
                <a href={activeClinic.google_map_link || '#'} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 px-5 py-4 rounded-xl glass-2 border border-slate-200/80 text-[#0F172A] text-sm font-semibold hover:bg-white hover:border-blue-300 transition-all shadow-sm">
                  <Navigation className="w-4 h-4 text-sky-600" />
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
