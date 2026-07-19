import React, { useState, useEffect } from "react";
import { CalendarDays, Star, Shield, Award, CheckCircle2, ChevronRight, Activity, Smile } from "lucide-react";
import { motion } from "motion/react";
import { ToothIcon, WhatsAppIcon } from "./Icons";
import { CmsService } from "../lib/cmsService";
import { SettingsService } from "../lib/settingsService";
import { DoctorService } from "../lib/doctorService";
import { logger } from "../lib/logger";
import OptimizedImage from "./OptimizedImage";
import OptimizedVideo from "./OptimizedVideo";

// CountUp Component for Trust Bar animation on enter viewport
function CountUp({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const [ref, setRef] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (!ref) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let start = 0;
          const end = value;
          const duration = 1600;
          const startTime = performance.now();

          const animate = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // easeOutQuad
            const ease = progress * (2 - progress);
            setCount(Math.floor(ease * end));

            if (progress < 1) {
              requestAnimationFrame(animate);
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
  const [heroContent, setHeroContent] = useState({
    title: "Healthy Smile\nStarts\nHere",
    subtitle: "Modern dental care with advanced technology, gentle treatment, and over 10 years of clinical experience for patients of every age.",
    cta_text: "Book Appointment"
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
        <div key={idx} className="glass-1 p-4 rounded-2xl flex flex-col justify-between group hover:border-[#8B7BF7]/30 transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#A1A1A6] tracking-wide uppercase">{item.label}</span>
            <item.icon className="w-4 h-4 text-[#8B7BF7]" />
          </div>
          <span className="text-2xl sm:text-3xl font-display font-extrabold text-[#F5F5F7]">
            <CountUp value={item.val} suffix={item.suffix} />
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="relative pt-16 sm:pt-20 pb-20 lg:pb-24 font-sans overflow-hidden">
      
      {/* TASK 1: Cinematic Background Glows & Floating Particles */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Ambient Video Reel Loop Layer (Phase 4 integration) */}
        <div className="absolute inset-0 opacity-15 [mask-image:radial-gradient(ellipse_at_top_right,black_30%,transparent_75%)]">
          <OptimizedVideo
            src="/DNS_Hero_Loop_4K_202607.mp4"
            poster="/DNS_Hero_TwilightExterior_16x9_202607.webp"
            alt="Dr. Nilay Saha Dental Platform Background Reel"
            isBackgroundLoop={true}
            aspectRatio="aspect-auto h-full w-full"
            className="w-full h-full object-cover border-0 rounded-none"
          />
        </div>

        {/* Cinematic gradient spotlight */}
        <motion.div 
          animate={{ scale: [1, 1.05, 1], opacity: [0.4, 0.6, 0.4] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-32 left-1/3 w-[500px] h-[500px] bg-gradient-to-br from-[#8B7BF7]/20 via-[#6366F1]/10 to-transparent rounded-full blur-[100px]"
        />
        <motion.div 
          animate={{ scale: [1, 1.08, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-1/3 -left-20 w-[400px] h-[400px] bg-gradient-to-tr from-[#3B82F6]/15 via-[#8B7BF7]/10 to-transparent rounded-full blur-[90px]"
        />

        {/* Subtle Floating Light Particles (GPU-Accelerated) */}
        {[
          { top: "12%", left: "15%", delay: 0, size: "w-2 h-2" },
          { top: "35%", left: "45%", delay: 2, size: "w-3 h-3" },
          { top: "72%", left: "25%", delay: 4, size: "w-2 h-2" },
          { top: "20%", left: "80%", delay: 1, size: "w-2.5 h-2.5" },
          { top: "55%", left: "75%", delay: 3, size: "w-2 h-2" }
        ].map((pt, idx) => (
          <motion.div 
            key={idx}
            animate={{ y: [0, -25, 0], opacity: [0.2, 0.7, 0.2] }}
            transition={{ duration: 7 + idx, repeat: Infinity, ease: "easeInOut", delay: pt.delay }}
            className={`absolute ${pt.size} rounded-full bg-[#8B7BF7]/40 blur-[2px] ${pt.top} ${pt.left}`}
          />
        ))}

        {/* Diagonal Soft Glass Reflection Line */}
        <div className="absolute top-[-20%] left-[-10%] w-[120%] h-[40%] bg-gradient-to-b from-white/[0.02] to-transparent rotate-[15deg]" />
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-10 relative z-20">
        
        {/* Left Column (55% width on desktop) */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full lg:w-[55%] flex flex-col items-start order-1"
        >
          {/* Tag Pill */}
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full glass-1 mb-6 transition-colors cursor-default">
            <Star className="w-4 h-4 text-[#8B7BF7] fill-[#8B7BF7]/20" />
            <span className="text-[13px] sm:text-sm font-semibold text-[#F5F5F7] tracking-wide">Healthy Smile, Happy Life</span>
          </motion.div>

          {/* TASK 2: Refined Typography & Headline */}
          <motion.h1 variants={itemVariants} className="text-[44px] sm:text-[60px] lg:text-[68px] font-display font-extrabold leading-[1.05] tracking-tight text-[#F5F5F7] mb-6 whitespace-pre-line">
            {heroContent.title.split('\n').map((line, idx) => (
              <span key={idx} className="block last:text-transparent last:bg-clip-text last:bg-gradient-to-r last:from-[#8B7BF7] last:to-[#6366F1]">
                {line}
              </span>
            ))}
          </motion.h1>

          {/* Refined Supporting Paragraph */}
          <motion.p variants={itemVariants} className="text-[#A1A1A6] text-base sm:text-lg max-w-xl mb-8 leading-[1.6] font-normal">
            {heroContent.subtitle}
          </motion.p>

          {/* TASK 3: CTAs with Premium Hover Effects */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-4 mb-8 w-full sm:w-auto">
            {/* Primary CTA */}
            <button 
              onClick={(e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent('openContactModal')); }} 
              className="group w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-gradient-to-r from-[#7C6BDF] to-[#6366F1] text-white font-semibold text-base shadow-[0_0_25px_rgba(139,123,247,0.35)] hover:shadow-[0_0_40px_rgba(139,123,247,0.55)] hover:-translate-y-1 active:scale-[0.98] transition-all duration-300"
            >
              <CalendarDays className="w-5 h-5 text-violet-200 shrink-0 group-hover:rotate-12 transition-transform duration-300" />
              <span>{heroContent.cta_text}</span>
            </button>

            {/* Secondary CTA */}
            <a 
              href="#treatments"
              onClick={(e) => handleSmoothScroll(e, 'treatments')}
              className="group w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-full glass-2 text-[#F5F5F7] font-semibold text-base hover:bg-white/[0.08] hover:-translate-y-1 active:scale-[0.98] transition-all duration-300"
            >
              <span>Explore Treatments</span>
              <ChevronRight className="w-4 h-4 text-[#A1A1A6] group-hover:translate-x-1 group-hover:text-white transition-all duration-300" />
            </a>
          </motion.div>

          {/* Emergency Quick Link */}
          <motion.div variants={itemVariants} className="mb-10 flex items-center gap-3 px-5 py-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 backdrop-blur-md w-full sm:w-auto justify-center sm:justify-start">
            <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span className="text-sm text-[#A1A1A6]">
              Dental Emergency?{" "}
              <a href={`tel:${contactContent.primary_phone.replace(/[^0-9+]/g, '')}`} className="text-rose-400 font-semibold hover:text-rose-300 transition-colors">
                Call Now {contactContent.primary_phone}
              </a>
            </span>
          </motion.div>

          {/* TASK 4 & 8: Trust Bar (Desktop Position - Hidden on Mobile) */}
          <motion.div variants={itemVariants} className="w-full hidden lg:block">
            <TrustBar />
          </motion.div>
        </motion.div>

        {/* Right Column: Doctor Portrait Showcase (order-2 on desktop, order-3 on mobile) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="w-full lg:w-[45%] flex flex-col items-center justify-center lg:items-end relative mt-6 lg:mt-0 order-3 lg:order-2"
        >
          {/* TASK 1 & 5: Portrait Spotlight Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] sm:w-[450px] sm:h-[450px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#8B7BF7]/25 via-[#8B7BF7]/5 to-transparent rounded-full blur-[50px] pointer-events-none z-0" />

          {/* Portrait Container with Float Animation */}
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="relative w-full max-w-md sm:max-w-lg lg:max-w-none flex flex-col items-center z-10"
          >
            {/* Portrait Frame with Spotlight Border */}
            <div className="relative w-full overflow-hidden rounded-[2.5rem] border border-white/15 bg-gradient-to-b from-white/[0.08] to-transparent shadow-[0_30px_70px_rgba(0,0,0,0.65)] group">
              <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#8B7BF7] to-transparent z-20 pointer-events-none" />

              <div className="relative w-full aspect-[4/5] sm:aspect-[3/3.6] overflow-hidden [mask-image:linear-gradient(to_bottom,black_80%,transparent_100%)]">
                <OptimizedImage 
                  src="/DNS_Portrait_DrNilay_Headshot_4x5_202607.webp" 
                  fallbackSrc="/dr-nilay-saha.jpg"
                  alt={aboutContent.title}
                  priority={true}
                  className="w-full h-full transition-transform duration-700 group-hover:scale-103"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] via-transparent to-transparent opacity-50 pointer-events-none" />
              </div>

              {/* TASK 5 & 6: Interactive Glass Overlay details inside frame */}
              <div className="absolute bottom-6 left-6 right-6 z-20 p-4 sm:p-5 rounded-2xl glass-3 border border-white/20 shadow-2xl">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#8B7BF7]/25 border border-[#8B7BF7]/40 flex items-center justify-center text-[#8B7BF7] shrink-0">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-[#F5F5F7] font-display font-bold text-base sm:text-lg leading-tight">
                        {aboutContent.title}
                      </h3>
                      <p className="text-xs text-[#8B7BF7] font-semibold mt-0.5">
                        Dental Surgeon & Oral Physician
                      </p>
                    </div>
                  </div>
                  <div className="hidden sm:flex flex-col items-end text-right">
                    <span className="text-[9px] uppercase font-bold text-[#A1A1A6] tracking-wider">Reg. No.</span>
                    <span className="text-xs font-mono font-bold text-[#F5F5F7]">4858-A</span>
                  </div>
                </div>
              </div>
            </div>

            {/* TASK 6: Floating Glass Cards / Credentials around portrait */}
            {/* Top-Left: BDS Credential */}
            <div className="absolute -top-3 -left-3 z-30 glass-3 rounded-2xl px-4 py-2 border border-white/20 shadow-lg flex items-center gap-2 hover:border-[#8B7BF7]/40 transition-colors pointer-events-none sm:pointer-events-auto">
              <Activity className="w-4 h-4 text-[#8B7BF7]" />
              <span className="text-xs font-bold text-[#F5F5F7]">BDS, FIE</span>
            </div>

            {/* Top-Right: Reg Badge */}
            <div className="absolute -top-3 -right-3 z-30 glass-3 rounded-2xl px-4 py-2 border border-white/20 shadow-lg flex items-center gap-2 hover:border-[#8B7BF7]/40 transition-colors pointer-events-none sm:pointer-events-auto">
              <Shield className="w-4 h-4 text-[#8B7BF7]" />
              <span className="text-xs font-bold text-[#F5F5F7]">Reg. 4858-A</span>
            </div>

            {/* Bottom Floating Credentials Panel */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full mt-4">
              {/* Modern Dental Care card */}
              <div className="glass-2 rounded-2xl p-4 flex items-start gap-3 group hover:border-[#8B7BF7]/40 transition-all duration-300">
                <div className="w-9 h-9 rounded-xl bg-[#8B7BF7]/15 border border-[#8B7BF7]/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <ToothIcon className="w-5 h-5 text-[#8B7BF7]" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#F5F5F7] group-hover:text-white transition-colors">Modern Dental Care</h4>
                  <p className="text-xs text-[#A1A1A6] mt-0.5">Equipped with digital diagnostics and laser dental technology.</p>
                </div>
              </div>

              {/* Gentle Treatment card */}
              <div className="glass-2 rounded-2xl p-4 flex items-start gap-3 group hover:border-emerald-500/40 transition-all duration-300">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Shield className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#F5F5F7] group-hover:text-white transition-colors">Gentle Treatment</h4>
                  <p className="text-xs text-[#A1A1A6] mt-0.5">Maximum comfort and preservation of natural tooth structures.</p>
                </div>
              </div>
            </div>

          </motion.div>
        </motion.div>

        {/* TASK 4 & 8: Trust Bar (Mobile Position - Hidden on Desktop) */}
        <div className="w-full block lg:hidden order-4 mt-4">
          <TrustBar />
        </div>
      </div>

      {/* TASK 7: Scroll Indicator (Hidden on Mobile) */}
      <div 
        className="absolute bottom-2 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-1.5 opacity-50 hover:opacity-100 transition-opacity cursor-pointer z-30" 
        onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
      >
        <span className="text-[10px] uppercase tracking-[0.2em] text-[#A1A1A6] font-semibold">Explore Clinic</span>
        <motion.div 
          animate={{ y: [0, 6, 0] }} 
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-5 h-8 rounded-full border border-white/20 flex justify-center p-1"
        >
          <div className="w-1 h-2 bg-[#8B7BF7] rounded-full" />
        </motion.div>
      </div>

    </div>
  );
}
