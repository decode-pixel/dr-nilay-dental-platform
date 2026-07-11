import { CalendarDays, Star, Shield, Award, Heart, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";
import { SmileSwoosh, ToothIcon, WhatsAppIcon } from "./Icons";

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

export default function Hero() {
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
        <motion.h1 variants={itemVariants} className="text-5xl sm:text-6xl lg:text-7xl font-heading font-bold leading-[1.1] tracking-tight text-white mb-6">
          Healthy Smile <br />
          Starts <br />
          <span className="relative inline-block mt-2">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-blue-400 drop-shadow-[0_0_30px_rgba(139,92,246,0.4)]">
              Here
            </span>
            <motion.div 
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1, duration: 1, type: "spring", bounce: 0.5 }}
              className="absolute -bottom-6 -right-6 pointer-events-none"
            >
               <SmileSwoosh className="w-40 sm:w-48 opacity-80" />
            </motion.div>
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p variants={itemVariants} className="text-gray-400 text-lg sm:text-xl max-w-lg mb-10 leading-relaxed font-light mt-6">
          Modern dental care with advanced technology, gentle treatment, and over 10 years of clinical experience for patients of every age.
        </motion.p>

        {/* CTAs */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-4 mb-6 w-full sm:w-auto">
          <button onClick={(e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent('openContactModal')); }} className="group btn-sweep w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-violet-600 to-blue-600 text-white font-medium border border-white/10 shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:shadow-[0_0_40px_rgba(139,92,246,0.7)] hover:-translate-y-1 transition-all duration-300">
            <div className="absolute inset-0 bg-white/20 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-out rounded-full"></div>
            <CalendarDays className="w-5 h-5 relative z-10" />
            <span className="relative z-10">Schedule Visit</span>
          </button>
          <a href="https://wa.me/919609180979" target="_blank" rel="noreferrer" className="group btn-sweep w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-3.5 rounded-full border border-white/20 bg-black/20 backdrop-blur-sm text-white font-medium hover:bg-white/10 hover:-translate-y-1 transition-all duration-300">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
              <WhatsAppIcon className="w-4 h-4" />
            </div>
            WhatsApp Now
          </a>
        </motion.div>

        {/* Emergency CTA */}
        <motion.div variants={itemVariants} className="mb-12 flex items-center gap-3 px-5 py-3 rounded-full bg-rose-500/10 border border-rose-500/20 backdrop-blur-md w-full sm:w-auto justify-center sm:justify-start">
           <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></div>
           <span className="text-sm text-gray-300">Dental Emergency? <a href="tel:+919609180979" className="text-rose-400 font-semibold hover:text-rose-300 transition-colors">Call Now +91 9609180979</a></span>
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

      {/* Right Content / Feature Cards */}
      <motion.div 
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
        className="flex-1 w-full flex justify-center lg:justify-end relative"
      >
        {/* Glow behind the card */}
        <motion.div 
          animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-gradient-to-b from-blue-500/20 to-violet-500/20 rounded-3xl blur-[50px]"
        ></motion.div>
        
        <div className="glass-panel backdrop-blur-2xl bg-[#050505]/40 rounded-3xl p-6 sm:p-8 w-full max-w-md relative z-10 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
          <div className="flex flex-col gap-6">
            
            {/* Feature 1: Doctor Info */}
            <div className="flex items-start gap-4 group cursor-default">
              <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(59,130,246,0.2)] group-hover:bg-blue-500/20 group-hover:shadow-[0_0_25px_rgba(59,130,246,0.4)] group-hover:scale-110 transition-all duration-300">
                 <Award className="w-6 h-6 text-blue-400 group-hover:text-blue-300 transition-colors" />
              </div>
              <div className="flex flex-col">
                <h3 className="text-white font-semibold mb-1 group-hover:text-blue-200 transition-colors">Dr. Nilay Saha</h3>
                <p className="text-sm text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">BDS, FIE<br/>Dental Surgeon & Oral Physician<br/>WBDC Registration No. 4858-A</p>
              </div>
            </div>

            <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

            {/* Feature 2: Root Canal */}
            <div className="flex items-start gap-4 group cursor-default">
              <div className="w-12 h-12 rounded-full bg-violet-500/10 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(139,92,246,0.2)] group-hover:bg-violet-500/20 group-hover:shadow-[0_0_25px_rgba(139,92,246,0.4)] group-hover:scale-110 transition-all duration-300">
                <ToothIcon className="w-6 h-6 text-violet-400 group-hover:text-violet-300 transition-colors" />
              </div>
              <div className="flex flex-col">
                <h3 className="text-white font-semibold mb-1 group-hover:text-violet-200 transition-colors">Root Canal Specialist (FIE)</h3>
                <p className="text-sm text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">Advanced fellowship-trained endodontic care focused on preserving natural teeth with precision, comfort, and long-term oral health.</p>
              </div>
            </div>

            <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

            {/* Feature 3: Advanced Sterilization */}
            <div className="flex items-start gap-4 group cursor-default">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(16,185,129,0.2)] group-hover:bg-emerald-500/20 group-hover:shadow-[0_0_25px_rgba(16,185,129,0.4)] group-hover:scale-110 transition-all duration-300">
                <Shield className="w-6 h-6 text-emerald-400 group-hover:text-emerald-300 transition-colors" />
              </div>
              <div className="flex flex-col">
                <h3 className="text-white font-semibold mb-1 group-hover:text-emerald-200 transition-colors">Advanced Sterilization</h3>
                <p className="text-sm text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">Strict sterilization protocols ensuring a clean, safe and hygienic treatment environment for every patient.</p>
              </div>
            </div>

            <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

            {/* Feature 4: Gentle & Pain-Free */}
            <div className="flex items-start gap-4 group cursor-default">
              <div className="w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(244,63,94,0.2)] group-hover:bg-rose-500/20 group-hover:shadow-[0_0_25px_rgba(244,63,94,0.4)] group-hover:scale-110 transition-all duration-300">
                <Heart className="w-6 h-6 text-rose-400 group-hover:text-rose-300 transition-colors" />
              </div>
              <div className="flex flex-col">
                <h3 className="text-white font-semibold mb-1 group-hover:text-rose-200 transition-colors">Gentle & Pain-Free Dentistry</h3>
                <p className="text-sm text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">Modern techniques designed to minimize discomfort while providing a calm and stress-free dental experience.</p>
              </div>
            </div>

          </div>
        </div>
      </motion.div>
    </div>
  );
}
