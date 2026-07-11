import React, { useState, useEffect } from "react";
import { CalendarDays, Menu, X, Phone } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { WhatsAppIcon } from "./Icons";
import { useLocation, useNavigate } from "react-router-dom";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMobileMenuOpen]);

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, targetId: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    
    if (targetId === 'schedule') {
      window.dispatchEvent(new CustomEvent('openContactModal'));
      return;
    }
    
    if (location.pathname !== '/') {
      navigate(`/#${targetId}`);
      return;
    }

    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navItems = [
    { name: "🏠 Home", id: "home" },
    { name: "👨‍⚕️ About", id: "about" },
    { name: "🦷 Treatments", id: "treatments" },
    { name: "📍 Our Clinics", id: "locations" },
    { name: "🖼 Gallery", id: "gallery" },
    { name: "⭐ Testimonials", id: "testimonials" },
    { name: "☎ Contact", id: "contact" }
  ];

  const secondaryItems = [
    { name: "❓ FAQ", link: "#" },
    { name: "📰 Dental Tips", link: "#" },
    { name: "🚨 Emergency Care", link: "#" },
    { name: "🔒 Privacy Policy", link: "#" },
    { name: "📜 Terms & Conditions", link: "#" }
  ];

  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="flex items-center justify-between py-6 relative z-50"
    >
      <div className="flex items-center gap-3">
        <div className="relative flex items-center justify-center w-12 h-12 lg:w-14 lg:h-14 mr-2 shrink-0">
          {/* Logo ambient glow to enhance the neon effects */}
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 rounded-full blur-[15px] pointer-events-none transition-all duration-500 group-hover:blur-[20px] group-hover:from-blue-500/30 group-hover:to-purple-500/30"></div>
          
          {/* Logo Image */}
          <img 
            src="https://res.cloudinary.com/tud0sobq/image/upload/v1783343231/ChatGPT_Image_Jul_6_2026_06_28_47_PM_1_ipilq6.png" 
            alt="Dr. Nilay Saha Logo" 
            className="w-full h-full object-contain relative z-10 mix-blend-screen drop-shadow-[0_0_10px_rgba(139,92,246,0.3)]"
            onError={(e) => {
              e.currentTarget.src = "https://api.dicebear.com/7.x/shapes/svg?seed=tooth&backgroundColor=000000";
              e.currentTarget.style.mixBlendMode = "screen";
            }}
          />
        </div>
        <div className="flex flex-col justify-center">
          <span className="font-heading font-bold text-xl leading-tight tracking-wide flex items-center gap-1 text-white">
            DR. <span className="text-violet-400">Nilay Saha</span>
          </span>
          <span className="text-[10px] tracking-[0.2em] text-gray-400 font-medium uppercase mt-0.5">Dental Clinic</span>
          <span className="text-[9px] text-violet-400 mt-0.5">Healthy Smile, Happy Life</span>
        </div>
      </div>

      <div className="hidden lg:flex items-center gap-8 text-sm font-medium text-gray-300">
        <a href="#home" onClick={(e) => handleSmoothScroll(e, 'home')} className="text-white relative group">
          Home
          <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-violet-500 rounded-full transition-all group-hover:w-full"></span>
        </a>
        <a href="#about" onClick={(e) => handleSmoothScroll(e, 'about')} className="relative group hover:text-white transition-colors">
          About
          <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-violet-500/50 rounded-full transition-all group-hover:w-full"></span>
        </a>
        <a href="#treatments" onClick={(e) => handleSmoothScroll(e, 'treatments')} className="relative group hover:text-white transition-colors">
          Treatments
          <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-violet-500/50 rounded-full transition-all group-hover:w-full"></span>
        </a>
        <a href="#locations" onClick={(e) => handleSmoothScroll(e, 'locations')} className="relative group hover:text-white transition-colors">
          Our Clinics
          <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-violet-500/50 rounded-full transition-all group-hover:w-full"></span>
        </a>
        <a href="#gallery" onClick={(e) => handleSmoothScroll(e, 'gallery')} className="relative group hover:text-white transition-colors">
          Gallery
          <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-violet-500/50 rounded-full transition-all group-hover:w-full"></span>
        </a>
        <a href="#testimonials" onClick={(e) => handleSmoothScroll(e, 'testimonials')} className="relative group hover:text-white transition-colors">
          Testimonials
          <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-violet-500/50 rounded-full transition-all group-hover:w-full"></span>
        </a>
        <a href="#contact" onClick={(e) => handleSmoothScroll(e, 'contact')} className="relative group hover:text-white transition-colors">
          Contact
          <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-violet-500/50 rounded-full transition-all group-hover:w-full"></span>
        </a>

        {/* Overflow Menu */}
        <div className="relative group cursor-pointer h-full flex items-center ml-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300 group-hover:text-white transition-colors">
              <circle cx="12" cy="12" r="1"></circle>
              <circle cx="12" cy="5" r="1"></circle>
              <circle cx="12" cy="19" r="1"></circle>
            </svg>
          </div>
          
          <div className="absolute top-full right-0 mt-4 w-52 bg-[#0a0a0a]/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 overflow-hidden z-50">
            <div className="py-2 flex flex-col">
              <a href="#" className="px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors">FAQ</a>
              <a href="#" className="px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors">Dental Tips</a>
              <a href="#" className="px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors">Privacy Policy</a>
              <a href="#" className="px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors">Terms & Conditions</a>
              <a href="#" className="px-4 py-2 text-sm text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors">Emergency Care</a>
              <div className="px-4 py-2 text-xs text-gray-500 cursor-not-allowed border-t border-white/5 mt-1 pt-3 uppercase tracking-wider font-semibold">Coming Soon</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button onClick={(e) => handleSmoothScroll(e, 'schedule')} className="hidden md:flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-violet-600 to-blue-600 text-white font-medium text-sm border border-white/10 shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_35px_rgba(139,92,246,0.6)] hover:scale-105 transition-all duration-300 btn-sweep">
          Book Appointment
          <CalendarDays className="w-4 h-4" />
        </button>
        <button 
          onClick={() => setIsMobileMenuOpen(true)}
          className="lg:hidden text-white p-2 hover:bg-white/10 rounded-full transition-colors relative z-[60]"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/40 z-[60] lg:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-[100dvh] w-full sm:w-[400px] bg-white/[0.03] backdrop-blur-2xl border-l border-white/10 shadow-[-10px_0_30px_rgba(0,0,0,0.5)] z-[70] lg:hidden flex flex-col overflow-y-auto"
            >
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <span className="font-heading font-bold text-lg text-white">Menu</span>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 flex flex-col px-6 py-8">
                <div className="flex flex-col gap-2 mb-8">
                  {navItems.map((item, idx) => (
                    <motion.a
                      key={item.id}
                      href={`#${item.id}`}
                      onClick={(e) => handleSmoothScroll(e, item.id)}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + idx * 0.05 }}
                      className="text-xl font-medium text-gray-200 hover:text-white py-3 border-b border-white/5 last:border-0"
                    >
                      {item.name}
                    </motion.a>
                  ))}
                </div>

                <div className="w-full h-px bg-white/10 mb-8" />

                <div className="flex flex-col gap-4 mb-10">
                  {secondaryItems.map((item, idx) => (
                    <motion.a
                      key={item.name}
                      href={item.link}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + idx * 0.05 }}
                      className="text-sm font-medium text-gray-400 hover:text-white"
                    >
                      {item.name}
                    </motion.a>
                  ))}
                </div>
              </div>

              <div className="p-6 border-t border-white/10 bg-white/[0.02] mt-auto">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-col gap-3 mb-6"
                >
                  <button onClick={(e) => handleSmoothScroll(e, 'schedule')} className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white text-sm font-medium border border-white/10 shadow-[0_0_15px_rgba(139,92,246,0.3)] btn-sweep hover:-translate-y-0.5 transition-all duration-300">
                    <CalendarDays className="w-4 h-4" />
                    Schedule Visit
                  </button>
                  <a href="https://wa.me/919609180979" target="_blank" rel="noreferrer" className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl border border-white/20 bg-white/5 text-white text-sm font-medium btn-sweep hover:bg-white/10 hover:-translate-y-0.5 transition-all duration-300">
                    <WhatsAppIcon className="w-4 h-4" />
                    WhatsApp
                  </a>
                  <a href="tel:+919609180979" className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl border border-white/10 bg-black/40 text-gray-300 text-sm font-medium btn-sweep hover:text-white hover:bg-black/60 transition-colors duration-300">
                    <Phone className="w-4 h-4" />
                    Call Clinic
                  </a>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-center"
                >
                  <p className="text-sm font-heading font-medium text-gray-300">Dr. Nilay Saha Dental Clinic</p>
                  <p className="text-[10px] text-violet-400 mt-1 uppercase tracking-wider">Healthy Smile, Happy Life</p>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
