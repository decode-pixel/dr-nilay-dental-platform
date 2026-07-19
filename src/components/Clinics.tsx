import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  MapPin, Clock, Phone, Navigation, CalendarDays, 
  Car, Wind, Droplet, CreditCard, Users, CalendarCheck, ShieldCheck, UserCheck, Stethoscope,
  AlertTriangle, Info, ShieldAlert, Sparkles, Star
} from "lucide-react";
import { WhatsAppIcon } from "./Icons";
import { ClinicService } from "../lib/clinicService";
import { logger } from "../lib/logger";

const FACILITY_ICONS: Record<string, any> = {
  Users,
  CreditCard,
  Car,
  Wind,
  Droplet,
  ShieldCheck,
  CalendarCheck,
  UserCheck,
  Camera: Stethoscope, // Map Camera to Stethoscope for look
};

const STATUS_BADGES: Record<string, { text: string; bg: string; border: string }> = {
  'Open': { text: 'text-emerald-400', bg: 'bg-emerald-500/15', border: 'border-emerald-500/30' },
  'Closed': { text: 'text-rose-400', bg: 'bg-rose-500/15', border: 'border-rose-500/30' },
  'Holiday': { text: 'text-amber-400', bg: 'bg-amber-500/15', border: 'border-amber-500/30' },
  'Temporary Closure': { text: 'text-rose-400', bg: 'bg-rose-500/15', border: 'border-rose-500/30' },
  'Doctor Unavailable': { text: 'text-yellow-400', bg: 'bg-yellow-500/15', border: 'border-yellow-500/30' },
};

export default function Clinics() {
  const [clinics, setClinics] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    // Calculate today's local date string YYYY-MM-DD
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
      <div className="min-h-[500px] flex flex-col items-center justify-center text-[#F5F5F7] font-sans">
        <Clock className="w-8 h-8 animate-spin text-[#8B7BF7] mb-3" />
        <span className="text-xs text-[#A1A1A6] uppercase font-semibold tracking-widest">Loading clinics info...</span>
      </div>
    );
  }

  if (clinics.length === 0) {
    return null;
  }

  // Define static fallback treatments mapping per clinic if not fully seeded
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
    <section id="locations" className="relative py-20 sm:py-24 z-10 overflow-hidden font-sans">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center max-w-3xl mx-auto mb-12 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-1 mb-4 text-[#8B7BF7] text-xs font-semibold uppercase tracking-widest">
            <MapPin className="w-4 h-4 text-[#8B7BF7]" />
            <span>Our Clinics</span>
          </div>
          <h2 className="text-[36px] sm:text-[48px] lg:text-[56px] font-display font-bold text-[#F5F5F7] tracking-tight leading-[1.12] mb-5">
            Choose the location <span className="text-[#8B7BF7]">most convenient for you.</span>
          </h2>
        </motion.div>

        {/* Tab Selector */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          className="flex justify-center mb-12 sm:mb-16"
        >
          <div className="inline-flex overflow-x-auto sm:overflow-visible max-w-full no-scrollbar rounded-full p-1.5 glass-1 border border-white/10">
            {clinics.map((clinic) => (
              <button
                key={clinic.id}
                onClick={() => setActiveTab(clinic.slug)}
                className={`relative px-6 py-3 rounded-full text-sm font-semibold transition-colors whitespace-nowrap shrink-0 ${
                  activeTab === clinic.slug ? 'text-[#F5F5F7]' : 'text-[#A1A1A6] hover:text-[#F5F5F7]'
                }`}
              >
                {activeTab === clinic.slug && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-white/10 rounded-full border border-white/20 shadow-[0_0_20px_rgba(139,123,247,0.2)]"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#8B7BF7]" />
                  {clinic.slug.charAt(0).toUpperCase() + clinic.slug.slice(1)}
                </span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Clinic Content */}
        {activeClinic && (
          <div className="glass-2 rounded-[2.5rem] overflow-hidden border border-white/10 shadow-[0_16px_48px_rgba(0,0,0,0.5)] flex flex-col lg:flex-row relative group min-h-[600px]">
            {/* Subtle glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#8B7BF7]/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            <div className="w-full lg:w-5/12 flex flex-col">
              {activeClinic.cover_image ? (
                <div className="w-full h-64 lg:h-full relative overflow-hidden bg-black/40 flex items-center justify-center border-b lg:border-b-0 lg:border-r border-white/10">
                  <img src={activeClinic.cover_image} alt={activeClinic.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                </div>
              ) : (
                <div className="w-full h-64 lg:h-full relative overflow-hidden bg-transparent flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-white/10 p-8 text-center group/placeholder">
                  <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent" />
                  
                  <div className="w-20 h-20 rounded-2xl glass-1 border border-white/10 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(255,255,255,0.05)] relative z-10">
                    <Stethoscope className="w-8 h-8 text-[#A1A1A6]" />
                  </div>
                  <h3 className="text-xl font-display font-semibold text-[#F5F5F7] mb-2 relative z-10">Clinic Photos</h3>
                  <p className="text-xs text-[#A1A1A6] uppercase tracking-widest font-semibold relative z-10">Coming Soon</p>
                </div>
              )}
            </div>

            <div className="w-full lg:w-7/12 p-6 sm:p-10 lg:p-12 flex flex-col relative z-10">
              <div className="flex-1">
                {/* Title & Description & Rating */}
                <div className="mb-8 pb-8 border-b border-white/10 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-[#F5F5F7]">{activeClinic.name}</h3>
                      {activeClinic.google_rating && (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 bg-yellow-500/15 border border-yellow-500/30 text-yellow-300 rounded-full">
                          <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                          {activeClinic.google_rating} ({activeClinic.review_count || 120} reviews)
                        </span>
                      )}
                    </div>
                    <p className="text-sm sm:text-base text-[#A1A1A6] leading-[1.6] max-w-2xl mt-3 font-normal">
                      {activeClinic.visiting_note || "Premium modern dental care, sterilization standards, and orthodontic diagnostics."}
                    </p>
                  </div>

                  {/* Resolved Status Badge */}
                  <div className="shrink-0">
                    <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold border ${
                      STATUS_BADGES[activeClinic.statusInfo?.status]?.text || 'text-white bg-white/10'
                    } ${
                      STATUS_BADGES[activeClinic.statusInfo?.status]?.bg || ''
                    } ${
                      STATUS_BADGES[activeClinic.statusInfo?.status]?.border || 'border-white/10'
                    }`}>
                      <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
                      {activeClinic.statusInfo?.status}
                    </span>
                  </div>
                </div>

                {/* Notices Alert Box (if active) */}
                {activeClinic.notice && (
                  <div className="mb-8 p-4 rounded-2xl glass-3 border-[#8B7BF7]/30 text-[#F5F5F7] text-xs flex items-start gap-3.5 shadow-lg">
                    <ShieldAlert className="w-5 h-5 text-[#8B7BF7] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-[#F5F5F7] text-sm">{activeClinic.notice.title}</p>
                      <p className="mt-1 leading-[1.6] text-[#A1A1A6]">{activeClinic.notice.description}</p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 mb-10">
                  {/* Location & Timings */}
                  <div className="space-y-8">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-[#8B7BF7]/15 border border-[#8B7BF7]/30 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(139,123,247,0.2)]">
                        <MapPin className="w-5 h-5 text-[#8B7BF7]" />
                      </div>
                      <div>
                        <h4 className="text-[#F5F5F7] font-semibold mb-1.5 text-base font-display">Address</h4>
                        <p className="text-sm text-[#A1A1A6] leading-[1.6] whitespace-pre-line font-normal">
                          {activeClinic.address}
                        </p>
                        {activeClinic.landmark && (
                          <p className="text-xs text-[#8B7BF7] mt-3 font-medium px-3 py-1.5 bg-[#8B7BF7]/15 rounded-xl inline-block border border-[#8B7BF7]/30">
                            Landmark: {activeClinic.landmark}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                        <Clock className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <h4 className="text-[#F5F5F7] font-semibold mb-1.5 text-base font-display">Opening Status & Hours</h4>
                        <p className="text-sm text-[#F5F5F7] font-semibold leading-[1.6]">
                          {activeClinic.statusInfo?.status === 'Open'
                            ? `Open today: ${activeClinic.statusInfo.session_times}`
                            : `Closed today: ${activeClinic.statusInfo?.reason_detail || activeClinic.statusInfo?.reason || 'Scheduled Off'}`}
                        </p>
                        <div className="mt-3.5 flex items-center gap-3 p-3 rounded-2xl glass-1 border border-white/10 max-w-sm">
                          <div className="w-11 h-11 rounded-xl overflow-hidden border border-white/20 shrink-0 shadow-md">
                            <img src="/dr-nilay-saha.jpg" alt="Dr. Nilay Saha" className="w-full h-full object-cover object-top" />
                          </div>
                          <div>
                            <span className="text-[10px] text-[#8B7BF7] uppercase tracking-wider font-bold block">Attending Surgeon</span>
                            <span className="text-xs sm:text-sm font-display font-bold text-[#F5F5F7]">{activeClinic.statusInfo?.available_doctor || "Dr. Nilay Saha"}</span>
                          </div>
                        </div>
                        <p className="text-[11px] text-[#A1A1A6] mt-3 italic border-l-2 border-white/10 pl-2.5">
                          Weekly hours and doctor schedules can be configured dynamically in the dashboard.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Treatments & Facilities */}
                  <div className="space-y-8">
                    {/* Treatments */}
                    <div>
                      <h4 className="text-xs text-[#A1A1A6] uppercase tracking-wider font-semibold mb-4">Treatments Available</h4>
                      <div className="flex flex-wrap gap-2">
                        {getTreatmentsList(activeClinic.slug).map((treatment, idx) => (
                          <span key={idx} className="px-3 py-1.5 text-xs font-medium text-[#F5F5F7] glass-1 border border-white/10 rounded-full hover:bg-white/10 transition-colors cursor-default">
                            {treatment}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Facilities */}
                    <div>
                      <h4 className="text-xs text-[#A1A1A6] uppercase tracking-wider font-semibold mb-4">Clinic Facilities</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4">
                        {activeClinic.facilities && activeClinic.facilities.length > 0 ? (
                          activeClinic.facilities.map((facName: string, idx: number) => {
                            const matchingIcon = Object.keys(FACILITY_ICONS).find(
                              (key) => key.toLowerCase() === facName.replace(/\s+/g, '').toLowerCase()
                            );
                            const Icon = matchingIcon ? FACILITY_ICONS[matchingIcon] : ShieldCheck;

                            return (
                              <div key={idx} className="flex items-center gap-2.5 text-[#A1A1A6] hover:text-[#F5F5F7] transition-colors cursor-default group">
                                <Icon className="w-4 h-4 shrink-0 text-[#8B7BF7] group-hover:scale-110 transition-transform" />
                                <span className="text-xs sm:text-sm">{facName}</span>
                              </div>
                            );
                          })
                        ) : (
                          <p className="text-xs text-[#A1A1A6]">No facilities listed.</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions (Fixed position at bottom of the right panel) */}
              <div className="mt-auto pt-8 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <button onClick={() => window.dispatchEvent(new CustomEvent('openContactModal'))} className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-gradient-to-r from-[#7C6BDF] to-[#6366F1] text-white text-sm font-semibold border border-white/10 shadow-[0_0_20px_rgba(139,123,247,0.4)] hover:shadow-[0_0_30px_rgba(139,123,247,0.6)] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300">
                  <CalendarDays className="w-4 h-4" />
                  <span>Schedule Visit</span>
                </button>
                <a href={`https://wa.me/${activeClinic.whatsapp_phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl glass-2 text-[#F5F5F7] text-sm font-semibold hover:bg-white/[0.08] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300">
                  <WhatsAppIcon className="w-4 h-4 text-emerald-400" />
                  <span>WhatsApp</span>
                </a>
                <a href={`tel:${activeClinic.phone.replace(/[^0-9+]/g, '')}`} className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl glass-1 border border-white/10 text-[#F5F5F7] text-sm font-semibold hover:bg-white/[0.08] transition-colors">
                  <Phone className="w-4 h-4 text-[#8B7BF7]" />
                  <span>Call Clinic</span>
                </a>
                <a href={activeClinic.google_map_link || '#'} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl glass-1 border border-white/10 text-[#F5F5F7] text-sm font-semibold hover:bg-white/[0.08] transition-colors">
                  <Navigation className="w-4 h-4 text-blue-400" />
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
