import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  MapPin, Clock, Phone, Navigation, CalendarDays, 
  Car, Wind, Droplet, CreditCard, Users, CalendarCheck, ShieldCheck, UserCheck, Stethoscope
} from "lucide-react";
import { WhatsAppIcon } from "./Icons";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

const clinicsData = {
  belerhat: {
    id: 'belerhat',
    tabLabel: 'Belerhat',
    name: "Saha Dental Clinic",
    description: "Modern dental clinic providing advanced, comfortable and hygienic treatment for patients of every age.",
    address: "New Saha Pharmacy\nBelerhat Station Road\nUkhra Sarangpur\nPurbasthali\nPurba Bardhaman\nWest Bengal – 713513",
    landmark: "Near Belerhat Rail Gate",
    hours: "Monday – Sunday\n10:00 AM – 2:00 PM\n5:00 PM – 8:00 PM",
    phone: "+91 9609180979",
    whatsapp: "+91 9609180979",
    emergency: "+91 9609180979",
    mapsUrl: "https://maps.app.goo.gl/MV8tYqxGJCsAYmbx9?g_st=ac",
    treatments: [
      "Root Canal Treatment", 
      "Dental Filling", 
      "Scaling", 
      "Crown & Bridge", 
      "Denture", 
      "Tooth Extraction", 
      "Oral Surgery", 
      "Consultation"
    ],
    facilities: [
      { name: "Waiting Area", icon: Users },
      { name: "Digital Payment", icon: CreditCard },
      { name: "Parking", icon: Car },
      { name: "Air Conditioning", icon: Wind },
      { name: "Drinking Water", icon: Droplet },
      { name: "Washroom", icon: Droplet },
      { name: "Sterilization Room", icon: ShieldCheck },
      { name: "Online Appointment Booking", icon: CalendarCheck },
      { name: "Walk-in Consultation", icon: UserCheck }
    ],
    image: null
  },
  parulia: {
    id: 'parulia',
    tabLabel: 'Parulia',
    name: "Saha Dental Clinic",
    description: "Our premium dental facility in Parulia offering comprehensive oral health care services.",
    address: "Parulia Main Road\nPurba Bardhaman\nWest Bengal",
    landmark: "Near Parulia Market",
    hours: "Information updating soon.",
    phone: "+91 9609180979",
    whatsapp: "+91 9609180979",
    emergency: "+91 9609180979",
    mapsUrl: "#",
    treatments: [
      "Consultation",
      "Dental Filling",
      "Scaling"
    ],
    facilities: [
      { name: "Waiting Area", icon: Users },
      { name: "Air Conditioning", icon: Wind }
    ],
    image: null
  },
  nabadwip: {
    id: 'nabadwip',
    tabLabel: 'Nabadwip',
    name: "Saha Dental Clinic",
    description: "State-of-the-art dental care center in Nabadwip providing expert treatments.",
    address: "Nabadwip Town\nNadia\nWest Bengal",
    landmark: "Near Nabadwip Station",
    hours: "Information updating soon.",
    phone: "+91 9609180979",
    whatsapp: "+91 9609180979",
    emergency: "+91 9609180979",
    mapsUrl: "#",
    treatments: [
      "Consultation",
      "Tooth Extraction",
      "Root Canal Treatment"
    ],
    facilities: [
      { name: "Waiting Area", icon: Users },
      { name: "Parking", icon: Car }
    ],
    image: null
  }
};

type ClinicKey = keyof typeof clinicsData;

export default function Clinics() {
  const [activeTab, setActiveTab] = useState<ClinicKey>('belerhat');
  const activeClinic = clinicsData[activeTab];

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
            {(Object.keys(clinicsData) as ClinicKey[]).map((key) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`relative px-6 py-2.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap shrink-0 ${
                  activeTab === key ? 'text-white' : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                {activeTab === key && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-white/10 rounded-full border border-white/20"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {clinicsData[key].tabLabel}
                </span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Clinic Content */}
        <div className="glass-panel rounded-[2rem] overflow-hidden border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex flex-col lg:flex-row relative group min-h-[600px]">
          {/* Subtle glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

          <AnimatePresence mode="wait">
            <motion.div 
              key={activeTab}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="w-full lg:w-5/12 flex flex-col"
            >
              {activeClinic.image ? (
                <div className="w-full h-64 lg:h-full relative overflow-hidden bg-black/40 flex items-center justify-center border-b lg:border-b-0 lg:border-r border-white/5">
                  <img src={activeClinic.image} alt={activeClinic.name} className="w-full h-full object-cover" />
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
            </motion.div>
          </AnimatePresence>

          <div className="w-full lg:w-7/12 p-6 sm:p-10 flex flex-col relative z-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="flex-1"
              >
                {/* Title & Description */}
                <div className="mb-8 pb-8 border-b border-white/10">
                  <h3 className="text-3xl sm:text-4xl font-heading font-bold text-white mb-4">{activeClinic.name}</h3>
                  <p className="text-base text-gray-400 leading-relaxed max-w-2xl">
                    {activeClinic.description}
                  </p>
                </div>

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
                        <p className="text-xs text-violet-300 mt-3 font-medium px-3 py-1.5 bg-violet-500/10 rounded-md inline-block border border-violet-500/20">
                          Landmark: {activeClinic.landmark}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                        <Clock className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <h4 className="text-white font-medium mb-2 text-lg">Opening Hours</h4>
                        <p className="text-sm text-gray-400 leading-relaxed whitespace-pre-line">
                          {activeClinic.hours}
                        </p>
                        <p className="text-[11px] text-gray-500 mt-3 italic border-l-2 border-white/10 pl-2">
                          Doctor's visiting schedule may vary between clinic locations.
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
                        {activeClinic.treatments.map((treatment, idx) => (
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
                        {activeClinic.facilities.map((facility, idx) => {
                          const Icon = facility.icon;
                          return (
                            <div key={idx} className="flex items-center gap-2.5 text-gray-400 hover:text-gray-200 transition-colors cursor-default group">
                              <Icon className="w-4 h-4 shrink-0 text-gray-500 group-hover:text-violet-400 transition-colors" />
                              <span className="text-xs sm:text-sm">{facility.name}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Actions (Fixed position at bottom of the right panel) */}
            <div className="mt-auto pt-8 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <button onClick={() => window.dispatchEvent(new CustomEvent('openContactModal'))} className="flex btn-sweep items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white text-sm font-medium border border-white/10 shadow-[0_0_15px_rgba(139,92,246,0.3)] hover:shadow-[0_0_25px_rgba(139,92,246,0.5)] hover:-translate-y-0.5 transition-all duration-300">
                <CalendarDays className="w-4 h-4" />
                Schedule Visit
              </button>
              <a href={`https://wa.me/${activeClinic.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="flex btn-sweep items-center justify-center gap-2 px-4 py-3.5 rounded-xl border border-white/20 bg-white/5 text-white text-sm font-medium hover:bg-white/10 hover:-translate-y-0.5 transition-all duration-300">
                <WhatsAppIcon className="w-4 h-4" />
                WhatsApp
              </a>
              <a href={`tel:${activeClinic.phone.replace(/[^0-9+]/g, '')}`} className="flex btn-sweep items-center justify-center gap-2 px-4 py-3.5 rounded-xl border border-white/10 bg-black/40 text-gray-300 text-sm font-medium hover:text-white hover:bg-black/60 transition-colors">
                <Phone className="w-4 h-4" />
                Call Clinic
              </a>
              <a href={activeClinic.mapsUrl} target="_blank" rel="noreferrer" className="flex btn-sweep items-center justify-center gap-2 px-4 py-3.5 rounded-xl border border-white/10 bg-black/40 text-gray-300 text-sm font-medium hover:text-white hover:bg-black/60 transition-colors">
                <Navigation className="w-4 h-4" />
                Get Directions
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

