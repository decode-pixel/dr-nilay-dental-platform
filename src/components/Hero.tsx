import React, { useState, useEffect } from "react";
import { CalendarDays, Star, Shield, Award, Heart, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";
import { SmileSwoosh, ToothIcon, WhatsAppIcon } from "./Icons";
import { CmsService } from "../lib/cmsService";
import { SettingsService } from "../lib/settingsService";
import { DoctorService } from "../lib/doctorService";
import { logger } from "../lib/logger";

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
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export default function Hero() {
  const [heroContent, setHeroContent] = useState({
    title: "Healthy Smile\nStarts\nHere",
    subtitle: "Modern dental care with advanced technology, gentle treatment, and over 10 years of clinical experience for patients of every age.",
    cta_text: "Schedule Visit"
  });

  const [aboutContent, setAboutContent] = useState({
    title: "Dr. Nilay Saha",
    description: "BDS, FIE\nDental Surgeon & Oral Physician\nWBDC Registration No. 4858-A",
    doctor_signature: "Dr. Nilay Saha"
  });

  const [contactContent, setContactContent] = useState({
    primary_phone: "+919609180979",
    whatsapp_number: "+919609180979",
    office_email: "contact@sahadental.com"
  });

  const loadData = async () => {
    try {
      const [hero, about, contact, doctorsList] = await Promise.all([
        CmsService.getPublishedContent("hero"),
        CmsService.getPublishedContent("about"),
        SettingsService.getSettingsGroup("contact"),
        DoctorService.getDoctors()
      ]);

      if (hero && hero.hero_config) {
        setHeroContent((p) => ({ ...p, ...hero.hero_config }));
      }
      if (doctorsList && doctorsList.length > 0) {
        const primaryDoc = doctorsList[0];
        const quals = await DoctorService.getDoctorQualifications(primaryDoc.id);
        const qualificationsStr = quals.map((q) => q.title).join(', ') || primaryDoc.qualification || '';
        setAboutContent({
          title: primaryDoc.name,
          description: `${qualificationsStr}\n${primaryDoc.designation || ""}\nRegistration No. ${primaryDoc.registration_number || ""}`,
          doctor_signature: primaryDoc.name
        });
      } else if (about && about.about_config) {
        setAboutContent((p) => ({ ...p, ...about.about_config }));
      }
      if (contact && Object.keys(contact).length > 0) {
        setContactContent((p) => ({ ...p, ...contact }));
      }
    } catch (err) {
      logger.error("Failed to load hero dyn configurations:", err);
    }
  };

  useEffect(() => {
    loadData();

    // Hot reloading triggers
    const handleCmsUpdate = () => loadData();
    const handleSettingsUpdate = () => loadData();

    window.addEventListener("onCmsUpdate", handleCmsUpdate);
    window.addEventListener("onSettingsUpdate", handleSettingsUpdate);

    return () => {
      window.removeEventListener("onCmsUpdate", handleCmsUpdate);
      window.removeEventListener("onSettingsUpdate", handleSettingsUpdate);
    };
  }, []);

  return (
    <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8 pt-12 pb-8 relative z-20">
      {/* Left Content */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex-1 flex flex-col items-start w-full"
      >
        {/* Tag Pill */}
        <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl mb-8 shadow-[0_0_20px_rgba(139,92,246,0.15)] hover:bg-white/10 transition-colors cursor-default">
          <Star className="w-4 h-4 text-violet-400" />
          <span className="text-sm font-medium text-gray-200">Healthy Smile, Happy Life</span>
        </motion.div>

        {/* Headline */}
        <motion.h1 variants={itemVariants} className="text-5xl sm:text-6xl lg:text-7xl font-heading font-bold leading-[1.1] tracking-tight text-white mb-6 whitespace-pre-line">
          {heroContent.title}
        </motion.h1>

        {/* Subtitle */}
        <motion.p variants={itemVariants} className="text-gray-400 text-lg sm:text-xl max-w-lg mb-10 leading-relaxed font-light mt-6">
          {heroContent.subtitle}
        </motion.p>

        {/* CTAs */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-4 mb-6 w-full sm:w-auto">
          <button onClick={(e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent('openContactModal')); }} className="group btn-sweep w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-violet-600 to-blue-600 text-white font-medium border border-white/10 shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:shadow-[0_0_40px_rgba(139,92,246,0.7)] hover:-translate-y-1 transition-all duration-300">
            <div className="absolute inset-0 bg-white/20 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-out rounded-full"></div>
            <CalendarDays className="w-5 h-5 relative z-10" />
            <span className="relative z-10">{heroContent.cta_text}</span>
          </button>
          <a href={`https://wa.me/${contactContent.whatsapp_number.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="group btn-sweep w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-3.5 rounded-full border border-white/20 bg-black/20 backdrop-blur-sm text-white font-medium hover:bg-white/10 hover:-translate-y-1 transition-all duration-300">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
              <WhatsAppIcon className="w-4 h-4" />
            </div>
            WhatsApp Now
          </a>
        </motion.div>

        {/* Emergency CTA */}
        <motion.div variants={itemVariants} className="mb-12 flex items-center gap-3 px-5 py-3 rounded-full bg-rose-500/10 border border-rose-500/20 backdrop-blur-md w-full sm:w-auto justify-center sm:justify-start">
           <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></div>
           <span className="text-sm text-gray-300">Dental Emergency? <a href={`tel:${contactContent.primary_phone.replace(/[^0-9+]/g, '')}`} className="text-rose-400 font-semibold hover:text-rose-300 transition-colors">Call Now {contactContent.primary_phone}</a></span>
        </motion.div>

        {/* Premium Trust Strip */}
        <motion.div variants={itemVariants} className="w-full grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {[
            { text: "10+ Years Experience" },
            { text: "WBDC Registered" },
            { text: "3 Clinic Locations" },
            { text: "4.8★ Google Rating" }
          ].map((item, idx) => (
            <div key={idx} className="flex items-center justify-center lg:justify-start gap-2.5 px-4 py-3 rounded-xl border border-white/5 bg-white/[0.02] backdrop-blur-md hover:bg-white/[0.05] transition-colors cursor-default">
              <CheckCircle2 className="w-4 h-4 text-violet-400 shrink-0" />
              <span className="text-xs sm:text-sm font-medium text-gray-300 whitespace-nowrap">{item.text}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Right Content: Official Portrait & Floating Feature Cards (~40-45% of Hero Area) */}
      <motion.div 
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
        className="w-full lg:w-[45%] flex flex-col items-center justify-center lg:items-end relative mt-8 lg:mt-0"
      >
        {/* Studio Ambient Glow & Lighting */}
        <motion.div 
          animate={{ scale: [1, 1.08, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-12 -right-8 w-80 sm:w-96 h-80 sm:h-96 bg-gradient-to-tr from-violet-600/30 via-blue-600/20 to-purple-600/30 rounded-full blur-[90px] pointer-events-none"
        />

        <div className="relative w-full max-w-md sm:max-w-lg lg:max-w-none flex flex-col items-center">
          {/* Main Portrait Container with Soft Edge Masking */}
          <div className="relative w-full overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-b from-white/[0.08] to-transparent shadow-[0_25px_60px_rgba(139,92,246,0.25)] group">
            {/* Top glass highlight bar */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-violet-400/50 to-transparent z-20 pointer-events-none" />

            <div className="relative w-full aspect-[4/5] sm:aspect-[3/3.6] overflow-hidden [mask-image:linear-gradient(to_bottom,black_75%,transparent_100%)]">
              <img 
                src="/dr-nilay-saha.jpg" 
                alt={aboutContent.title}
                className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
              />
              {/* Soft studio vignette overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-60" />
            </div>

            {/* Doctor Title Badge inside portrait bottom area */}
            <div className="absolute bottom-6 left-6 right-6 z-20 p-4 sm:p-5 rounded-2xl backdrop-blur-2xl bg-[#0a0a1a]/85 border border-white/20 shadow-2xl">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-violet-600/25 border border-violet-500/40 flex items-center justify-center text-violet-300 shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-white font-heading font-extrabold text-base sm:text-lg tracking-wide">
                      {aboutContent.title}
                    </h3>
                    <p className="text-xs text-violet-300 font-medium">
                      {aboutContent.description.split('\n')[0] || "Dental Surgeon & Oral Physician"}
                    </p>
                  </div>
                </div>
                <div className="hidden sm:flex flex-col items-end text-right">
                  <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Reg. No.</span>
                  <span className="text-xs font-mono font-semibold text-gray-200">4858-A</span>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Glass Feature Cards underneath/beside */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full mt-4 z-20">
            {/* Feature: Root Canal Specialist */}
            <div className="glass-panel backdrop-blur-2xl bg-[#050505]/70 border border-white/15 rounded-2xl p-4 shadow-xl flex items-start gap-3.5 group hover:border-violet-500/40 transition-all duration-300">
              <div className="w-10 h-10 rounded-xl bg-violet-500/15 border border-violet-500/30 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <ToothIcon className="w-5 h-5 text-violet-400 group-hover:text-violet-300" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white group-hover:text-violet-200 transition-colors">Root Canal Specialist</h4>
                <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">Fellowship-trained endodontic precision preserving natural teeth.</p>
              </div>
            </div>

            {/* Feature: Advanced Sterilization */}
            <div className="glass-panel backdrop-blur-2xl bg-[#050505]/70 border border-white/15 rounded-2xl p-4 shadow-xl flex items-start gap-3.5 group hover:border-emerald-500/40 transition-all duration-300">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Shield className="w-5 h-5 text-emerald-400 group-hover:text-emerald-300" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white group-hover:text-emerald-200 transition-colors">Advanced Sterilization</h4>
                <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">Strict sterilization protocols for a safe, hygienic environment.</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
