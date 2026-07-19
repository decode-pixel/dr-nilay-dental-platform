import React, { useState, useEffect } from "react";
import { CalendarDays, Menu, X, Phone, ChevronRight, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { WhatsAppIcon } from "./Icons";
import { useLocation, useNavigate } from "react-router-dom";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState("home");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { name: "Home", id: "home" },
    { name: "Treatments", id: "treatments" },
    { name: "Clinics", id: "locations" },
    { name: "About", id: "about" },
    { name: "Gallery", id: "gallery" },
    { name: "Reviews", id: "testimonials" },
    { name: "Contact", id: "contact" }
  ];

  const secondaryItems = [
    { name: "FAQ", id: "faq", link: "#faq" },
    { name: "Dental Tips", id: "tips", link: "#" },
    { name: "Emergency Care", id: "emergency", link: "tel:+919609180979" },
    { name: "Privacy Policy", id: "privacy", link: "#" },
    { name: "Terms & Conditions", id: "terms", link: "#" }
  ];

  useEffect(() => {
    const handleScroll = () => {
      // 1. Check if scrolled for navbar background styling
      const currentScrollY = window.scrollY;
      if (currentScrollY > 25) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // 2. Calculate thin progress bar percentage
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        const progress = (currentScrollY / docHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, progress)));
      } else {
        setScrollProgress(0);
      }

      // 3. Scroll Spy for active navigation item
      if (location.pathname === '/') {
        const sectionIds = navItems.map(item => item.id);
        let foundSection = "home";
        for (const id of sectionIds) {
          const el = document.getElementById(id);
          if (el) {
            const rect = el.getBoundingClientRect();
            // If section top is near upper viewport center or currently filling screen
            if (rect.top <= window.innerHeight * 0.4 && rect.bottom >= 100) {
              foundSection = id;
            }
          }
        }
        setActiveSection(foundSection);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // initial trigger
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

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

    // Handle alias or direct scroll
    const target = document.getElementById(targetId) || document.getElementById(targetId === 'locations' ? 'clinics' : targetId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header 
      className={`fixed top-0 inset-x-0 z-[100] transition-all duration-300 ease-out ${
        isScrolled 
          ? "bg-[#04040e]/85 backdrop-blur-2xl border-b border-white/10 shadow-[0_10px_35px_rgba(0,0,0,0.65)] py-3 sm:py-3.5" 
          : "bg-transparent border-b border-transparent py-5 sm:py-6 shadow-none"
      }`}
    >
      {/* TASK 6: Progress Indicator (Thin elegant bar across very top) */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-transparent overflow-hidden pointer-events-none z-[110]">
        <motion.div 
          className="h-full bg-gradient-to-r from-violet-500 via-purple-400 to-blue-500 shadow-[0_0_12px_rgba(139,92,246,0.9)]"
          style={{ width: `${scrollProgress}%` }}
          transition={{ ease: "linear", duration: 0.05 }}
        />
      </div>

      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between relative z-10" aria-label="Main Navigation">
        
        {/* TASK 2: Logo Area */}
        <a 
          href="#home" 
          onClick={(e) => handleSmoothScroll(e, 'home')} 
          className="flex items-center gap-3.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-2xl p-1 -ml-1 transition-all"
        >
          <div className="relative flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 lg:w-13 lg:h-13 shrink-0">
            {/* Ambient glow behind logo */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/25 to-purple-500/25 rounded-full blur-[16px] pointer-events-none transition-all duration-500 group-hover:blur-[22px] group-hover:from-blue-500/40 group-hover:to-purple-500/40" />
            
            <img 
              src="https://res.cloudinary.com/tud0sobq/image/upload/v1783343231/ChatGPT_Image_Jul_6_2026_06_28_47_PM_1_ipilq6.png" 
              alt="Dr. Nilay Saha Logo" 
              className="w-full h-full object-contain relative z-10 mix-blend-screen drop-shadow-[0_0_12px_rgba(139,92,246,0.35)] transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.src = "https://api.dicebear.com/7.x/shapes/svg?seed=tooth&backgroundColor=000000";
                e.currentTarget.style.mixBlendMode = "screen";
              }}
            />
          </div>
          <div className="flex flex-col justify-center">
            <span className="font-heading font-extrabold text-lg sm:text-xl leading-tight tracking-tight flex items-center gap-1.5 text-white group-hover:text-violet-200 transition-colors">
              DR. <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-blue-400">Nilay Saha</span>
            </span>
            <span className="text-[10px] sm:text-[11px] tracking-[0.18em] text-gray-400 font-semibold uppercase mt-0.5">
              Advanced Dental Clinic
            </span>
            <span className="text-[9px] text-violet-400/90 font-medium mt-0.5 tracking-wide">
              Healthy Smile, Happy Life
            </span>
          </div>
        </a>

        {/* TASK 3 & 7: Desktop Navigation Links with Micro-Interactions */}
        <div className="hidden lg:flex items-center gap-7 text-sm font-medium">
          {navItems.map((item) => {
            const isActive = activeSection === item.id && location.pathname === '/';
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => handleSmoothScroll(e, item.id)}
                className={`relative px-3 py-2 rounded-xl transition-all duration-200 flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 group hover:-translate-y-[1px] ${
                  isActive
                    ? "text-white font-semibold"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                <span>{item.name}</span>
                {/* Active & Hover Underline Animation */}
                {isActive && (
                  <motion.div
                    layoutId="activeNavTab"
                    className="absolute -bottom-1 left-2 right-2 h-[2px] bg-gradient-to-r from-violet-500 via-purple-400 to-blue-400 rounded-full shadow-[0_0_10px_rgba(139,92,246,0.8)]"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <span className={`absolute -bottom-1 left-2 right-2 h-[2px] bg-violet-400/50 rounded-full transition-transform duration-300 origin-center scale-x-0 group-hover:scale-x-100 ${isActive ? 'hidden' : 'block'}`} />
              </a>
            );
          })}

          {/* Overflow Menu Dropdown */}
          <div className="relative group cursor-pointer h-full flex items-center ml-1">
            <button 
              type="button" 
              aria-label="More options"
              className="w-9 h-9 rounded-full flex items-center justify-center bg-white/[0.03] border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-gray-300 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="1"></circle>
                <circle cx="12" cy="5" r="1"></circle>
                <circle cx="12" cy="19" r="1"></circle>
              </svg>
            </button>
            
            <div className="absolute top-full right-0 mt-3 w-56 bg-[#080816]/95 backdrop-blur-2xl border border-white/15 rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.7)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 overflow-hidden z-50 transform origin-top-right group-hover:translate-y-0 translate-y-2">
              <div className="py-2.5 flex flex-col">
                {secondaryItems.map((item) => (
                  <a 
                    key={item.name}
                    href={item.link} 
                    onClick={(e) => item.id !== 'emergency' && handleSmoothScroll(e, item.id)}
                    className="px-4 py-2.5 text-xs sm:text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-between group/sub"
                  >
                    <span>{item.name}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-500 group-hover/sub:text-violet-400 group-hover/sub:translate-x-0.5 transition-all" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* TASK 4: Book Appointment CTA & Mobile Hamburger Button */}
        <div className="flex items-center gap-3.5">
          <button 
            onClick={(e) => handleSmoothScroll(e, 'schedule')} 
            aria-label="Book Appointment"
            className="hidden sm:flex relative group overflow-hidden items-center gap-2.5 px-6 py-2.5 sm:py-3 rounded-full font-semibold text-xs sm:text-sm text-white bg-gradient-to-r from-violet-600 via-purple-600 to-blue-600 border border-white/20 shadow-[0_4px_20px_rgba(139,92,246,0.35)] transition-all duration-300 ease-out hover:scale-[1.04] hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(139,92,246,0.65)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            {/* Shimmer light sweep on hover */}
            <span className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/25 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000 ease-in-out pointer-events-none" />
            
            <CalendarDays className="w-4 h-4 text-violet-200 group-hover:rotate-12 transition-transform duration-300 shrink-0" />
            <span className="tracking-wide">Book Appointment</span>
          </button>

          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open navigation menu"
            className="lg:hidden text-white p-2.5 hover:bg-white/10 rounded-2xl border border-white/10 transition-colors relative z-[60] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* TASK 5: Fullscreen Mobile Navigation Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-[#03030d]/95 backdrop-blur-3xl z-[150] lg:hidden flex flex-col justify-between overflow-y-auto"
            >
              {/* Overlay Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/[0.02]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-white/5 border border-white/15 flex items-center justify-center p-1">
                    <img 
                      src="https://res.cloudinary.com/tud0sobq/image/upload/v1783343231/ChatGPT_Image_Jul_6_2026_06_28_47_PM_1_ipilq6.png" 
                      alt="Logo" 
                      className="w-full h-full object-contain mix-blend-screen"
                    />
                  </div>
                  <div>
                    <span className="font-heading font-extrabold text-base text-white block">DR. Nilay Saha</span>
                    <span className="text-[10px] uppercase tracking-widest text-violet-400 font-semibold">Advanced Dental Clinic</span>
                  </div>
                </div>

                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-label="Close menu"
                  className="w-11 h-11 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/20 hover:rotate-90 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Center Navigation Links with Animated Appearance */}
              <div className="flex-1 flex flex-col justify-center px-6 py-8 space-y-4 max-w-md mx-auto w-full">
                <div className="text-xs font-semibold uppercase tracking-widest text-violet-400/80 mb-2 px-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Navigation Menu</span>
                </div>

                {navItems.map((item, idx) => {
                  const isActive = activeSection === item.id && location.pathname === '/';
                  return (
                    <motion.a
                      key={item.id}
                      href={`#${item.id}`}
                      onClick={(e) => handleSmoothScroll(e, item.id)}
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.08 + idx * 0.04, type: "spring", damping: 22 }}
                      className={`text-2xl sm:text-3xl font-heading font-bold py-3 px-3 rounded-2xl flex items-center justify-between group transition-all duration-200 border border-transparent ${
                        isActive
                          ? "text-white bg-white/10 border-white/15 shadow-lg pl-5"
                          : "text-gray-300 hover:text-white hover:bg-white/5 hover:pl-5"
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        {item.name}
                      </span>
                      <ChevronRight className={`w-6 h-6 transition-transform group-hover:translate-x-1 ${isActive ? 'text-violet-400' : 'text-gray-600 group-hover:text-violet-400'}`} />
                    </motion.a>
                  );
                })}
              </div>

              {/* Bottom Thumb-Reach CTA Section */}
              <div className="p-6 border-t border-white/10 bg-white/[0.02] space-y-3 mt-auto">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex flex-col gap-3"
                >
                  <button 
                    onClick={(e) => handleSmoothScroll(e, 'schedule')} 
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-blue-600 text-white font-bold text-base shadow-[0_0_25px_rgba(139,92,246,0.45)] flex items-center justify-center gap-2.5 active:scale-[0.98] transition-all"
                  >
                    <CalendarDays className="w-5 h-5 text-violet-200" />
                    <span>Book Appointment Now</span>
                  </button>

                  <div className="grid grid-cols-2 gap-3">
                    <a 
                      href="https://wa.me/919609180979" 
                      target="_blank" 
                      rel="noreferrer" 
                      className="py-3.5 rounded-2xl border border-white/20 bg-white/5 hover:bg-white/10 text-white font-semibold text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
                    >
                      <WhatsAppIcon className="w-4 h-4" />
                      <span>WhatsApp</span>
                    </a>

                    <a 
                      href="tel:+919609180979" 
                      className="py-3.5 rounded-2xl border border-white/15 bg-black/40 hover:bg-black/60 text-gray-200 font-semibold text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
                    >
                      <Phone className="w-4 h-4 text-violet-400" />
                      <span>Call Clinic</span>
                    </a>
                  </div>
                </motion.div>

                <div className="text-center pt-3 border-t border-white/5">
                  <p className="text-xs font-semibold text-gray-400">Dr. Nilay Saha Dental Clinic</p>
                  <p className="text-[10px] text-violet-400 uppercase tracking-widest mt-0.5">Healthy Smile, Happy Life</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
