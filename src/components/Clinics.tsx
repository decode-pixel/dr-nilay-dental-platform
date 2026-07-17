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
  'Open': { text: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20' },
  'Closed': { text: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
  'Holiday': { text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
  'Temporary Closure': { text: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20' },
  'Doctor Unavailable': { text: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
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
      <div className="min-h-[500px] flex flex-col items-center justify-center text-white">
        <Clock className="w-8 h-8 animate-spin text-violet-400 mb-3" />
        <span className="text-xs text-gray-500 uppercase font-semibold">Loading clinics info...</span>
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
    <section id="locations" className="relative py-24 z-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl mb-6 shadow-[0_0_20px_rgba(139,92,246,0.15)]">
            <MapPin className="w-4 h-4 text-violet-400" />
            <span className="text-sm font-medium text-gray-200 uppercase tracking-wider">Our Clinics</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6">
            Choose the clinic location <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-blue-400">most convenient for you.</span>
          </h2>
        </motion.div>

        {/* Tab Selector */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          className="flex justify-center mb-12"
        >
          <div className="inline-flex overflow-x-auto sm:overflow-visible max-w-full no-scrollbar rounded-full p-1.5 glass-panel">
            {clinics.map((clinic) => (
              <button
                key={clinic.id}
                onClick={() => setActiveTab(clinic.slug)}
                className={`relative px-6 py-2.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap shrink-0 ${
                  activeTab === clinic.slug ? 'text-white' : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                {activeTab === clinic.slug && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-white/10 rounded-full border border-white/20"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {clinic.slug.charAt(0).toUpperCase() + clinic.slug.slice(1)}
                </span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Clinic Content */}
        {activeClinic && (
          <div className="glass-panel rounded-[2rem] overflow-hidden border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex flex-col lg:flex-row relative group min-h-[600px]">
            {/* Subtle glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

            <div className="w-full lg:w-5/12 flex flex-col">
              {activeClinic.cover_image ? (
                <div className="w-full h-64 lg:h-full relative overflow-hidden bg-black/40 flex items-center justify-center border-b lg:border-b-0 lg:border-r border-white/5">
                  <img src={activeClinic.cover_image} alt={activeClinic.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                </div>
              ) : (
                <div className="w-full h-64 lg:h-full relative overflow-hidden bg-transparent flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-white/10 p-8 text-center group/placeholder">
                  <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent"></div>
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-violet-900/20 via-transparent to-transparent opacity-0 group-hover/placeholder:opacity-100 transition-opacity duration-700"></div>
                  
                  <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(255,255,255,0.05)] relative z-10">
                    <Stethoscope className="w-8 h-8 text-gray-500" />
                  </div>
                  <h3 className="text-xl font-heading font-semibold text-gray-300 mb-2 relative z-10">Clinic Photos</h3>
                  <p className="text-sm text-gray-500 uppercase tracking-widest font-medium relative z-10">Coming Soon</p>
                </div>
              )}
            </div>

            <div className="w-full lg:w-7/12 p-6 sm:p-10 flex flex-col relative z-10">
              <div className="flex-1">
                {/* Title & Description & Rating */}
                <div className="mb-8 pb-8 border-b border-white/10 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="text-3xl sm:text-4xl font-heading font-bold text-white">{activeClinic.name}</h3>
                      {activeClinic.google_rating && (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 rounded-lg">
                          <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                          {activeClinic.google_rating} ({activeClinic.review_count || 120} reviews)
                        </span>
                      )}
                    </div>
                    <p className="text-base text-gray-400 leading-relaxed max-w-2xl mt-2">
                      {activeClinic.visiting_note || "Premium modern dental care, sterilization standards, and orthodontic diagnostics."}
                    </p>
                  </div>

                  {/* Resolved Status Badge */}
                  <div className="shrink-0">
                    <span className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold border ${
                      STATUS_BADGES[activeClinic.statusInfo?.status]?.text || 'text-white bg-white/10'
                    } ${
                      STATUS_BADGES[activeClinic.statusInfo?.status]?.bg || ''
                    } ${
                      STATUS_BADGES[activeClinic.statusInfo?.status]?.border || 'border-white/10'
                    }`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                      {activeClinic.statusInfo?.status}
                    </span>
                  </div>
                </div>

                {/* Notices Alert Box (if active) */}
                {activeClinic.notice && (
                  <div className="mb-8 p-4 rounded-2xl bg-violet-600/10 border border-violet-500/20 text-violet-300 text-xs flex items-start gap-3 shadow-lg">
                    <ShieldAlert className="w-5 h-5 text-violet-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-white">{activeClinic.notice.title}</p>
                      <p className="mt-1 leading-relaxed text-gray-300">{activeClinic.notice.description}</p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
                  {/* Location & Timings */}
                  <div className="space-y-8">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-violet-500/10 flex items-center justify-center shrink-0 border border-violet-500/20 shadow-[0_0_15px_rgba(139,92,246,0.1)]">
                        <MapPin className="w-5 h-5 text-violet-400" />
                      </div>
                      <div>
                        <h4 className="text-white font-medium mb-2 text-lg">Address</h4>
                        <p className="text-sm text-gray-400 leading-relaxed whitespace-pre-line">
                          {activeClinic.address}
                        </p>
                        {activeClinic.landmark && (
                          <p className="text-xs text-violet-300 mt-3 font-medium px-3 py-1.5 bg-violet-500/10 rounded-md inline-block border border-violet-500/20">
                            Landmark: {activeClinic.landmark}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                        <Clock className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <h4 className="text-white font-medium mb-2 text-lg">Opening Status & Hours</h4>
                        <p className="text-sm text-gray-300 font-semibold leading-relaxed">
                          {activeClinic.statusInfo?.status === 'Open'
                            ? `Open today: ${activeClinic.statusInfo.session_times}`
                            : `Closed today: ${activeClinic.statusInfo?.reason_detail || activeClinic.statusInfo?.reason || 'Scheduled Off'}`}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          Available Doctor: {activeClinic.statusInfo?.available_doctor || "Dr. Nilay Saha"}
                        </p>
                        <p className="text-[11px] text-gray-500 mt-3 italic border-l-2 border-white/10 pl-2">
                          Weekly hours and doctor schedules can be configured dynamically in the dashboard.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Treatments & Facilities */}
                  <div className="space-y-8">
                    {/* Treatments */}
                    <div>
                      <h4 className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-4">Treatments Available</h4>
                      <div className="flex flex-wrap gap-2">
                        {getTreatmentsList(activeClinic.slug).map((treatment, idx) => (
                          <span key={idx} className="px-3 py-1.5 text-[11px] sm:text-xs font-medium text-gray-300 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 hover:text-white transition-colors cursor-default">
                            {treatment}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Facilities */}
                    <div>
                      <h4 className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-4">Clinic Facilities</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4">
                        {activeClinic.facilities && activeClinic.facilities.length > 0 ? (
                          activeClinic.facilities.map((facName: string, idx: number) => {
                            // Find matching catalog icon
                            const matchingIcon = Object.keys(FACILITY_ICONS).find(
                              (key) => key.toLowerCase() === facName.replace(/\s+/g, '').toLowerCase()
                            );
                            const Icon = matchingIcon ? FACILITY_ICONS[matchingIcon] : ShieldCheck;

                            return (
                              <div key={idx} className="flex items-center gap-2.5 text-gray-400 hover:text-gray-200 transition-colors cursor-default group">
                                <Icon className="w-4 h-4 shrink-0 text-gray-500 group-hover:text-violet-400 transition-colors" />
                                <span className="text-xs sm:text-sm">{facName}</span>
                              </div>
                            );
                          })
                        ) : (
                          <p className="text-xs text-gray-500">No facilities listed.</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions (Fixed position at bottom of the right panel) */}
              <div className="mt-auto pt-8 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <button onClick={() => window.dispatchEvent(new CustomEvent('openContactModal'))} className="flex btn-sweep items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white text-sm font-medium border border-white/10 shadow-[0_0_15px_rgba(139,92,246,0.3)] hover:shadow-[0_0_25px_rgba(139,92,246,0.5)] hover:-translate-y-0.5 transition-all duration-300">
                  <CalendarDays className="w-4 h-4" />
                  Schedule Visit
                </button>
                <a href={`https://wa.me/${activeClinic.whatsapp_phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="flex btn-sweep items-center justify-center gap-2 px-4 py-3.5 rounded-xl border border-white/20 bg-white/5 text-white text-sm font-medium hover:bg-white/10 hover:-translate-y-0.5 transition-all duration-300">
                  <WhatsAppIcon className="w-4 h-4" />
                  WhatsApp
                </a>
                <a href={`tel:${activeClinic.phone.replace(/[^0-9+]/g, '')}`} className="flex btn-sweep items-center justify-center gap-2 px-4 py-3.5 rounded-xl border border-white/10 bg-black/40 text-gray-300 text-sm font-medium hover:text-white hover:bg-black/60 transition-colors">
                  <Phone className="w-4 h-4" />
                  Call Clinic
                </a>
                <a href={activeClinic.google_map_link || '#'} target="_blank" rel="noreferrer" className="flex btn-sweep items-center justify-center gap-2 px-4 py-3.5 rounded-xl border border-white/10 bg-black/40 text-gray-300 text-sm font-medium hover:text-white hover:bg-black/60 transition-colors">
                  <Navigation className="w-4 h-4" />
                  Get Directions
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
