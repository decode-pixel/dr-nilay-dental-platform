import React, { useState, useEffect } from "react";
import { CalendarDays, Star, Shield, Award, CheckCircle2, ChevronRight, Activity, Smile } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { ToothIcon, WhatsAppIcon } from "./Icons";
import { CmsService } from "../lib/cmsService";
import { SettingsService } from "../lib/settingsService";
import { DoctorService } from "../lib/doctorService";
import { DOCTOR_REGISTRATION_NUMBER, PRIMARY_PHONE_NUMBER, PRIMARY_WHATSAPP_NUMBER } from "../lib/constants";
import { logger } from "../lib/logger";
import OptimizedImage from "./OptimizedImage";
import OptimizedVideo from "./OptimizedVideo";

// CountUp Component for Trust Bar animation on enter viewport without glitching mid-load
function CountUp({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(value);
  const [ref, setRef] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (!ref) return;
    if (typeof window !== "undefined" && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCount(value);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const end = value;
          const start = Math.floor(value * 0.75); // Start close to target for smooth 500ms transition
          const duration = 500;
          const startTime = performance.now();

          const animate = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(start + (end - start) * ease));

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setCount(end);
            }
          };

          requestAnimationFrame(animate);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(ref);
    return () => observer.disconnect();
  }, [ref, value]);

  return <span ref={setRef}>{count.toLocaleString()}{suffix}</span>;
}

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
  const shouldReduceMotion = useReducedMotion();
  const [heroContent, setHeroContent] = useState({
    title: "Healthy Smile\nStarts\nHere",
    subtitle: "Modern dental care with advanced technology, gentle treatment, and over 10 years of clinical experience for patients of every age.",
    cta_text: "Book Appointment"
  });

  const [aboutContent, setAboutContent] = useState({
    title: "Dr. Nilay Saha",
    description: `BDS\nDental Surgeon & Oral Physician\nWBDC Registration No. ${DOCTOR_REGISTRATION_NUMBER}`,
    doctor_signature: "Dr. Nilay Saha"
  });

  const [contactContent, setContactContent] = useState({
    primary_phone: PRIMARY_PHONE_NUMBER,
    whatsapp_number: PRIMARY_WHATSAPP_NUMBER,
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
      logger.error("Failed to load hero configurations:", err);
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

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, targetId: string) => {
    e.preventDefault();
    const target = document.getElementById(targetId) || document.getElementById(targetId === 'locations' ? 'clinics' : targetId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Shared Trust Bar items
  const trustBarItems = [
    { label: "Happy Patients", val: 5000, suffix: "+", icon: Smile },
    { label: "Years Experience", val: 10, suffix: "+", icon: Award },
    { label: "Clinic Locations", val: 3, suffix: "", icon: CheckCircle2 },
    { label: "Digital Dentistry", val: 100, suffix: "%", icon: Shield }
  ];

  const TrustBar = ({ className = "" }: { className?: string }) => (
    <div className={`grid grid-cols-2 sm:grid-cols-4 gap-4 ${className}`}>
      {trustBarItems.map((item, idx) => (
        <div key={idx} className="glass-2 p-4.5 rounded-2xl flex flex-col justify-between border border-emerald-500/25 shadow-lg hover:shadow-xl hover:border-emerald-400/50 transition-all duration-300 group bg-[#0A261D]/80">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#A2C7B7] tracking-wide uppercase">{item.label}</span>
            <item.icon className="w-4 h-4 text-[#10B981]" />
          </div>
          <span className="text-2xl sm:text-3xl font-display font-extrabold text-[#F4F7F4]">
            <CountUp value={item.val} suffix={item.suffix} />
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="relative pt-12 sm:pt-16 pb-20 lg:pb-24 font-sans overflow-hidden bg-gradient-to-b from-[#061D15] via-[#09281D] to-[#0C3326] text-[#F4F7F4]">
      
      {/* Urban Dental Studio Warm Organic Ambient Layers */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Ambient Warm Clinic Interior Background Overlay */}
        <div className="absolute inset-0 opacity-15 mix-blend-overlay [mask-image:radial-gradient(ellipse_at_top_right,black_50%,transparent_85%)]">
          <OptimizedImage
            src="/DNS_Hero_TwilightExterior_16x9_202607.webp"
            alt="Dr. Nilay Saha Clinic Atmosphere Background"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Warm Gold & Emerald Lighting Spotlights */}
        <motion.div 
          initial={{ scale: 1, opacity: 0.4 }}
          whileInView={shouldReduceMotion ? {} : { scale: [1, 1.05, 1], opacity: [0.4, 0.65, 0.4] }}
          viewport={{ once: false }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-32 left-1/3 w-[550px] h-[550px] bg-gradient-to-br from-[#10B981]/20 via-[#C5A059]/10 to-transparent rounded-full blur-[120px]"
        />
        <motion.div 
          initial={{ scale: 1, opacity: 0.3 }}
          whileInView={shouldReduceMotion ? {} : { scale: [1, 1.08, 1], opacity: [0.3, 0.55, 0.3] }}
          viewport={{ once: false }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-1/3 -left-20 w-[450px] h-[450px] bg-gradient-to-tr from-[#34D399]/15 via-[#C5A059]/15 to-transparent rounded-full blur-[100px]"
        />

        {/* Floating Organic Warm Particles */}
        {!shouldReduceMotion && [
          { top: "12%", left: "15%", delay: 0, size: "w-2 h-2" },
          { top: "35%", left: "45%", delay: 2, size: "w-3 h-3" },
          { top: "72%", left: "25%", delay: 4, size: "w-2 h-2" },
          { top: "20%", left: "80%", delay: 1, size: "w-2.5 h-2.5" },
          { top: "55%", left: "75%", delay: 3, size: "w-2 h-2" }
        ].map((pt, idx) => (
          <motion.div 
            key={idx}
            initial={{ y: 0, opacity: 0.25 }}
            whileInView={{ y: [0, -25, 0], opacity: [0.25, 0.75, 0.25] }}
            viewport={{ once: false }}
            transition={{ duration: 7 + idx, repeat: Infinity, ease: "easeInOut", delay: pt.delay }}
            className={`absolute ${pt.size} rounded-full bg-[#10B981]/40 blur-[2px] ${pt.top} ${pt.left}`}
          />
        ))}

        <div className="absolute top-[-20%] left-[-10%] w-[120%] h-[40%] bg-gradient-to-b from-white/5 to-transparent rotate-[15deg]" />
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-10 relative z-20 max-w-7xl mx-auto px-5 sm:px-8">
        
        {/* Left Column (55% width on desktop) */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full lg:w-[55%] flex flex-col items-start order-1"
        >
          {/* Tag Pill */}
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-2 mb-6 border border-[#10B981]/30 shadow-md cursor-default bg-[#0A291E]/90 text-[#34D399]">
            <Star className="w-3.5 h-3.5 text-[#C5A059] fill-[#C5A059]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#F4F7F4]">Urban Dental Studio Experience</span>
          </motion.div>

          {/* Refined Serif Typography & Headline */}
          <motion.h1 variants={itemVariants} className="text-[44px] sm:text-[60px] lg:text-[68px] font-display font-extrabold leading-[1.06] tracking-tight text-[#F4F7F4] mb-6 whitespace-pre-line">
            {heroContent.title.split('\n').map((line, idx) => (
              <span key={idx} className="block last:text-transparent last:bg-clip-text last:bg-gradient-to-r last:from-[#10B981] last:via-[#34D399] last:to-[#C5A059]">
                {line}
              </span>
            ))}
          </motion.h1>

          {/* Refined Supporting Paragraph */}
          <motion.p variants={itemVariants} className="text-[#A2C7B7] text-base sm:text-lg max-w-xl mb-8 leading-[1.7] font-normal">
            {heroContent.subtitle}
          </motion.p>

          {/* CTAs with Premium Hover Effects */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-4 mb-8 w-full sm:w-auto">
            {/* Primary CTA */}
            <button 
              onClick={(e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent('openContactModal')); }} 
              className="group w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-gradient-to-r from-[#10B981] to-[#059669] text-white font-semibold text-base shadow-[0_4px_24px_rgba(16,185,129,0.4)] hover:shadow-[0_6px_32px_rgba(16,185,129,0.6)] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300"
            >
              <CalendarDays className="w-5 h-5 text-emerald-100 shrink-0 group-hover:rotate-12 transition-transform duration-300" />
              <span>{heroContent.cta_text}</span>
            </button>

            {/* Secondary CTA */}
            <a 
              href="#treatments"
              onClick={(e) => handleSmoothScroll(e, 'treatments')}
              className="group w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-full glass-2 text-[#F4F7F4] border border-[#10B981]/30 hover:border-[#10B981]/60 font-semibold text-base hover:bg-[#0A291E]/90 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300"
            >
              <span>Explore Treatments</span>
              <ChevronRight className="w-4 h-4 text-[#A2C7B7] group-hover:translate-x-1 group-hover:text-[#10B981] transition-all duration-300" />
            </a>
          </motion.div>

          {/* Emergency Quick Link */}
          <motion.div variants={itemVariants} className="mb-10 flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-[#1D0C12]/80 border border-rose-500/30 w-full sm:w-auto justify-center sm:justify-start">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
            <span className="text-sm font-semibold text-rose-200">
              Dental Emergency?{" "}
              <a href={`tel:${contactContent.primary_phone.replace(/[^0-9+]/g, '')}`} className="text-rose-400 font-bold hover:text-rose-300 transition-colors">
                Call Now {contactContent.primary_phone}
              </a>
            </span>
          </motion.div>

          {/* Trust Bar (Desktop Position - Hidden on Mobile) */}
          <motion.div variants={itemVariants} className="w-full hidden lg:block">
            <TrustBar />
          </motion.div>
        </motion.div>

        {/* Right Column: Doctor Portrait Showcase */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="w-full lg:w-[45%] flex flex-col items-center justify-center lg:items-end relative mt-6 lg:mt-0 order-3 lg:order-2"
        >
          {/* Portrait Spotlight Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] sm:w-[450px] sm:h-[450px] bg-gradient-to-tr from-[#10B981]/20 via-[#C5A059]/10 to-transparent rounded-full blur-[60px] pointer-events-none z-0" />

          {/* Portrait Container with Float Animation */}
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="relative w-full max-w-md sm:max-w-lg lg:max-w-[420px] flex flex-col items-center z-10"
          >
            {/* Portrait Frame with Spotlight Border */}
            <div className="relative w-full overflow-hidden rounded-[2.5rem] border border-[#10B981]/40 bg-[#071F17] shadow-[0_24px_64px_rgba(0,0,0,0.5)] group">
              <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-transparent via-[#10B981] to-transparent z-20 pointer-events-none" />

              <div className="relative w-full aspect-[3/4] overflow-hidden">
                <OptimizedImage 
                  src="/DNS_Portrait_DrNilay_Headshot_4x5_202607.webp" 
                  fallbackSrc="/dr-nilay-saha.jpg"
                  alt={aboutContent.title}
                  priority={true}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#061D15]/80 via-transparent to-transparent opacity-70 pointer-events-none" />
              </div>

              {/* Interactive Glass Overlay details inside frame */}
              <div className="absolute bottom-6 left-6 right-6 z-20 p-4 sm:p-5 rounded-2xl glass-3 border border-emerald-500/30 shadow-xl bg-[#09281D]/90 text-[#F4F7F4]">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#10B981]/20 border border-[#10B981]/40 flex items-center justify-center text-[#10B981] shrink-0">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-[#F4F7F4] font-display font-bold text-base sm:text-lg leading-tight">
                        {aboutContent.title}
                      </h3>
                      <p className="text-xs text-[#34D399] font-bold mt-0.5">
                        Dental Surgeon & Oral Physician
                      </p>
                    </div>
                  </div>
                  <div className="hidden sm:flex flex-col items-end text-right">
                    <span className="text-[9px] uppercase font-bold text-[#A2C7B7] tracking-wider">Reg. No.</span>
                    <span className="text-xs font-mono font-bold text-[#F4F7F4]">{DOCTOR_REGISTRATION_NUMBER}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Glass Cards / Credentials around portrait */}
            {/* Top-Left: BDS Credential */}
            <div className="absolute -top-3 -left-3 z-30 glass-3 rounded-2xl px-4 py-2.5 border border-emerald-500/30 shadow-lg flex items-center gap-2 bg-[#09281D]/90 text-[#F4F7F4]">
              <Activity className="w-4 h-4 text-[#10B981]" />
              <span className="text-xs font-bold">BDS</span>
            </div>

            {/* Top-Right: Reg Badge */}
            <div className="absolute -top-3 -right-3 z-30 glass-3 rounded-2xl px-4 py-2.5 border border-emerald-500/30 shadow-lg flex items-center gap-2 bg-[#09281D]/90 text-[#F4F7F4]">
              <Shield className="w-4 h-4 text-[#10B981]" />
              <span className="text-xs font-bold">Reg. {DOCTOR_REGISTRATION_NUMBER}</span>
            </div>

            {/* Bottom Floating Credentials Panel */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full mt-4">
              <div className="glass-2 rounded-2xl p-4.5 flex items-start gap-3.5 border border-emerald-500/25 shadow-md bg-[#0A261D]/80 text-[#F4F7F4] group hover:border-emerald-400 transition-all duration-300">
                <div className="w-9 h-9 rounded-xl bg-[#10B981]/20 border border-[#10B981]/40 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-sm">
                  <ToothIcon className="w-5 h-5 text-[#10B981]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#F4F7F4] group-hover:text-[#34D399] transition-colors">Modern Dental Care</h4>
                  <p className="text-xs text-[#A2C7B7] mt-0.5">Equipped with digital diagnostics and laser dental technology.</p>
                </div>
              </div>

              {/* Gentle Treatment card */}
              <div className="glass-2 rounded-2xl p-4.5 flex items-start gap-3.5 border border-emerald-500/25 shadow-md bg-[#0A261D]/80 text-[#F4F7F4] group hover:border-emerald-400 transition-all duration-300">
                <div className="w-9 h-9 rounded-xl bg-[#10B981]/20 border border-[#10B981]/40 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-sm">
                  <Shield className="w-5 h-5 text-[#10B981]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#F4F7F4] group-hover:text-[#34D399] transition-colors">Gentle Treatment</h4>
                  <p className="text-xs text-[#A2C7B7] mt-0.5">Maximum comfort and preservation of natural tooth structures.</p>
                </div>
              </div>
            </div>

          </motion.div>
        </motion.div>

        {/* Trust Bar (Mobile Position - Hidden on Desktop) */}
        <div className="w-full block lg:hidden order-4 mt-4">
          <TrustBar />
        </div>
      </div>

      {/* Scroll Indicator (Hidden on Mobile) */}
      <div 
        className="absolute bottom-2 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-1.5 opacity-70 hover:opacity-100 transition-opacity cursor-pointer z-30" 
        onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
      >
        <span className="text-[10px] uppercase tracking-[0.2em] text-[#A2C7B7] font-bold">Explore Clinic</span>
        <motion.div 
          animate={{ y: [0, 6, 0] }} 
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-5 h-8 rounded-full border border-emerald-500/40 flex justify-center p-1 bg-[#0A261D]/60"
        >
          <div className="w-1 h-2 bg-[#10B981] rounded-full" />
        </motion.div>
      </div>

    </div>
  );
}
