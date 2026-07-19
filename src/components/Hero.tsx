import React, { useState, useEffect } from "react";
import { CalendarDays, Star, Shield, Award, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";
import { ToothIcon, WhatsAppIcon } from "./Icons";
import { CmsService } from "../lib/cmsService";
import { SettingsService } from "../lib/settingsService";
import { DoctorService } from "../lib/doctorService";
import { logger } from "../lib/logger";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const itemVariants = {
  hidden: { y: 24, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
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
    <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-10 pt-16 sm:pt-20 pb-12 relative z-20 font-sans">
      {/* Left Content (55% width on desktop) */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex-1 flex flex-col items-start w-full lg:w-[55%]"
      >
        {/* Tag Pill */}
        <motion.div variants={itemVariants} className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full glass-1 mb-6 sm:mb-8 transition-colors cursor-default">
          <Star className="w-4 h-4 text-[#8B7BF7]" />
          <span className="text-[13px] sm:text-sm font-medium text-[#F5F5F7] tracking-wide">Healthy Smile, Happy Life</span>
        </motion.div>

        {/* Headline */}
        <motion.h1 variants={itemVariants} className="text-[42px] sm:text-[56px] lg:text-[64px] font-display font-bold leading-[1.08] tracking-[-0.02em] text-[#F5F5F7] mb-6 whitespace-pre-line">
          {heroContent.title}
        </motion.h1>

        {/* Subtitle */}
        <motion.p variants={itemVariants} className="text-[#A1A1A6] text-base sm:text-lg max-w-xl mb-10 leading-[1.6] font-normal">
          {heroContent.subtitle}
        </motion.p>

        {/* CTAs */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-4 mb-8 w-full sm:w-auto">
          <button 
            onClick={(e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent('openContactModal')); }} 
            className="group w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-gradient-to-r from-[#7C6BDF] to-[#6366F1] text-white font-semibold text-base shadow-[0_0_25px_rgba(139,123,247,0.35)] hover:shadow-[0_0_40px_rgba(139,123,247,0.55)] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300"
          >
            <CalendarDays className="w-5 h-5 relative z-10 text-violet-200" />
            <span className="relative z-10">{heroContent.cta_text}</span>
          </button>
          <a 
            href={`https://wa.me/${contactContent.whatsapp_number.replace(/[^0-9]/g, '')}`} 
            target="_blank" 
            rel="noreferrer" 
            className="group w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-full glass-2 text-[#F5F5F7] font-semibold text-base hover:bg-white/[0.08] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300"
          >
            <div className="w-6 h-6 rounded-full flex items-center justify-center">
              <WhatsAppIcon className="w-5 h-5 text-[#25D366]" />
            </div>
            <span>WhatsApp Now</span>
          </a>
        </motion.div>

        {/* Emergency Callout */}
        <motion.div variants={itemVariants} className="mb-12 flex items-center gap-3 px-5 py-3 rounded-full bg-rose-500/10 border border-rose-500/20 backdrop-blur-md w-full sm:w-auto justify-center sm:justify-start">
          <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          <span className="text-sm text-[#A1A1A6]">
            Dental Emergency?{" "}
            <a href={`tel:${contactContent.primary_phone.replace(/[^0-9+]/g, '')}`} className="text-rose-400 font-semibold hover:text-rose-300 transition-colors">
              Call Now {contactContent.primary_phone}
            </a>
          </span>
        </motion.div>

        {/* Premium Trust Strip */}
        <motion.div variants={itemVariants} className="w-full grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { text: "10+ Years Experience" },
            { text: "WBDC Registered" },
            { text: "3 Clinic Locations" },
            { text: "4.8★ Google Rating" }
          ].map((item, idx) => (
            <div key={idx} className="flex items-center justify-center sm:justify-start gap-2.5 px-3.5 py-3 rounded-xl glass-1 hover:bg-white/[0.06] transition-colors cursor-default">
              <CheckCircle2 className="w-4 h-4 text-[#8B7BF7] shrink-0" />
              <span className="text-xs sm:text-[13px] font-medium text-[#F5F5F7] whitespace-nowrap">{item.text}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Right Content: Official Portrait & Floating Feature Cards (~45% of Hero Area) */}
      <motion.div 
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        className="w-full lg:w-[45%] flex flex-col items-center justify-center lg:items-end relative mt-6 lg:mt-0"
      >
        {/* Studio Ambient Glow */}
        <motion.div 
          animate={{ scale: [1, 1.06, 1], opacity: [0.35, 0.6, 0.35] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-10 -right-6 w-80 sm:w-96 h-80 sm:h-96 bg-gradient-to-tr from-[#8B7BF7]/25 via-blue-600/15 to-purple-600/25 rounded-full blur-[80px] pointer-events-none"
        />

        <div className="relative w-full max-w-md sm:max-w-lg lg:max-w-none flex flex-col items-center">
          {/* Main Portrait Container with Soft Edge Masking */}
          <div className="relative w-full overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-b from-white/[0.06] to-transparent shadow-[0_24px_64px_rgba(0,0,0,0.5)] group">
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#8B7BF7]/50 to-transparent z-20 pointer-events-none" />

            <div className="relative w-full aspect-[4/5] sm:aspect-[3/3.6] overflow-hidden [mask-image:linear-gradient(to_bottom,black_78%,transparent_100%)]">
              <img 
                src="/dr-nilay-saha.jpg" 
                alt={aboutContent.title}
                className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] via-transparent to-transparent opacity-60" />
            </div>

            {/* Doctor Title Badge inside portrait bottom area */}
            <div className="absolute bottom-6 left-6 right-6 z-20 p-4 sm:p-5 rounded-2xl glass-3 border border-white/20 shadow-2xl">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-[#8B7BF7]/20 border border-[#8B7BF7]/40 flex items-center justify-center text-[#8B7BF7] shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-[#F5F5F7] font-display font-bold text-base sm:text-lg tracking-wide">
                      {aboutContent.title}
                    </h3>
                    <p className="text-xs text-[#8B7BF7] font-medium">
                      {aboutContent.description.split('\n')[0] || "Dental Surgeon & Oral Physician"}
                    </p>
                  </div>
                </div>
                <div className="hidden sm:flex flex-col items-end text-right">
                  <span className="text-[10px] uppercase font-bold text-[#A1A1A6] tracking-wider">Reg. No.</span>
                  <span className="text-xs font-mono font-semibold text-[#F5F5F7]">4858-A</span>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Glass Feature Cards underneath */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full mt-4 z-20">
            {/* Feature: Root Canal Specialist */}
            <div className="glass-2 rounded-2xl p-4 flex items-start gap-3.5 group hover:border-[#8B7BF7]/40 transition-all duration-300">
              <div className="w-10 h-10 rounded-xl bg-[#8B7BF7]/15 border border-[#8B7BF7]/30 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <ToothIcon className="w-5 h-5 text-[#8B7BF7]" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[#F5F5F7] group-hover:text-white transition-colors">Root Canal Specialist</h4>
                <p className="text-xs text-[#A1A1A6] mt-0.5 line-clamp-2">Fellowship-trained endodontic precision preserving natural teeth.</p>
              </div>
            </div>

            {/* Feature: Advanced Sterilization */}
            <div className="glass-2 rounded-2xl p-4 flex items-start gap-3.5 group hover:border-emerald-500/40 transition-all duration-300">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Shield className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[#F5F5F7] group-hover:text-white transition-colors">Advanced Sterilization</h4>
                <p className="text-xs text-[#A1A1A6] mt-0.5 line-clamp-2">Strict sterilization protocols for a safe, hygienic environment.</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
