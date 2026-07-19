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
    { name: "About", id: "about" },
    { name: "Treatments", id: "treatments" },
    { name: "Clinics", id: "locations" },
    { name: "Reviews", id: "testimonials" },
    { name: "FAQ", id: "faq" },
    { name: "Contact", id: "contact" }
  ];

  const secondaryItems = [
    { name: "Dental Tips", id: "tips", link: "#" },
    { name: "Emergency Care", id: "emergency", link: "tel:+919609180979" },
    { name: "Privacy Policy", id: "privacy", link: "#" },
    { name: "Terms & Conditions", id: "terms", link: "#" }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 25);

      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        const progress = (currentScrollY / docHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, progress)));
      } else {
        setScrollProgress(0);
      }

      if (location.pathname === '/') {
        const sectionIds = navItems.map(item => item.id);
        let foundSection = "home";
        for (const id of sectionIds) {
          const el = document.getElementById(id);
          if (el) {
            const rect = el.getBoundingClientRect();
            if (rect.top <= window.innerHeight * 0.4 && rect.bottom >= 100) {
              foundSection = id;
            }
          }
        }
        setActiveSection(foundSection);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
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

    const target = document.getElementById(targetId) || document.getElementById(targetId === 'locations' ? 'clinics' : targetId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header 
      className={`fixed top-0 inset-x-0 z-[100] transition-all duration-300 ease-out ${
        isScrolled 
          ? "glass-4 py-3 sm:py-3.5" 
          : "bg-transparent border-b border-transparent py-5 sm:py-6 shadow-none"
      }`}
    >
      {/* Scroll Progress Bar */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-transparent overflow-hidden pointer-events-none z-[110]">
        <motion.div 
          className="h-full bg-gradient-to-r from-[#8B7BF7] to-[#C9A96E] shadow-[0_0_12px_rgba(139,123,247,0.8)]"
          style={{ width: `${scrollProgress}%` }}
          transition={{ ease: "linear", duration: 0.05 }}
        />
      </div>

      <nav className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between relative z-10 font-sans" aria-label="Main Navigation">
        
        {/* Logo Area */}
        <a 
          href="#home" 
          onClick={(e) => handleSmoothScroll(e, 'home')} 
          className="flex items-center gap-3.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B7BF7] rounded-xl transition-all"
        >
          <div className="relative flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 shrink-0">
            <div className="absolute inset-0 bg-[#8B7BF7]/20 rounded-full blur-[14px] pointer-events-none transition-all duration-500 group-hover:bg-[#8B7BF7]/35" />
            
            <img 
              src="https://res.cloudinary.com/tud0sobq/image/upload/v1783343231/ChatGPT_Image_Jul_6_2026_06_28_47_PM_1_ipilq6.png" 
              alt="Dr. Nilay Saha Logo" 
              className="w-full h-full object-contain relative z-10 mix-blend-screen drop-shadow-[0_0_12px_rgba(139,123,247,0.35)] transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.src = "https://api.dicebear.com/7.x/shapes/svg?seed=tooth&backgroundColor=000000";
                e.currentTarget.style.mixBlendMode = "screen";
              }}
            />
          </div>
          <div className="flex flex-col justify-center">
            <span className="font-display font-bold text-lg sm:text-xl leading-tight tracking-tight flex items-center gap-1.5 text-[#F5F5F7] group-hover:text-white transition-colors">
              DR. <span className="text-[#8B7BF7]">Nilay Saha</span>
            </span>
            <span className="text-[10px] sm:text-[11px] tracking-[0.16em] text-[#A1A1A6] font-medium uppercase mt-0.5">
              Advanced Dental Clinic
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-6 text-[15px] font-medium">
          {navItems.map((item) => {
            const isActive = activeSection === item.id && location.pathname === '/';
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => handleSmoothScroll(e, item.id)}
                className={`relative px-3 py-2 rounded-lg transition-all duration-200 flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B7BF7] group ${
                  isActive
                    ? "text-[#F5F5F7] font-semibold"
                    : "text-[#A1A1A6] hover:text-[#F5F5F7]"
                }`}
              >
                <span>{item.name}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeNavTab"
                    className="absolute -bottom-1 left-2 right-2 h-[2px] bg-[#8B7BF7] rounded-full shadow-[0_0_8px_rgba(139,123,247,0.8)]"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <span className={`absolute -bottom-1 left-2 right-2 h-[2px] bg-[#8B7BF7]/50 rounded-full transition-transform duration-300 origin-center scale-x-0 group-hover:scale-x-100 ${isActive ? 'hidden' : 'block'}`} />
              </a>
            );
          })}

          {/* Overflow Menu Dropdown */}
          <div className="relative group cursor-pointer h-full flex items-center ml-1">
            <button 
              type="button" 
              aria-label="More options"
              className="w-9 h-9 rounded-full flex items-center justify-center bg-white/[0.03] border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-[#A1A1A6] hover:text-[#F5F5F7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B7BF7]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="1"></circle>
                <circle cx="12" cy="5" r="1"></circle>
                <circle cx="12" cy="19" r="1"></circle>
              </svg>
            </button>
            
            <div className="absolute top-full right-0 mt-3 w-56 bg-[#111116]/95 backdrop-blur-2xl border border-white/15 rounded-2xl shadow-[0_16px_56px_rgba(0,0,0,0.6)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 overflow-hidden z-50 transform origin-top-right group-hover:translate-y-0 translate-y-2">
              <div className="py-2 flex flex-col">
                {secondaryItems.map((item) => (
                  <a 
                    key={item.name}
                    href={item.link} 
                    onClick={(e) => item.id !== 'emergency' && handleSmoothScroll(e, item.id)}
                    className="px-4 py-2.5 text-sm text-[#A1A1A6] hover:text-[#F5F5F7] hover:bg-white/[0.06] transition-colors flex items-center justify-between group/sub"
                  >
                    <span>{item.name}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-[#6E6E73] group-hover/sub:text-[#8B7BF7] group-hover/sub:translate-x-0.5 transition-all" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Book Appointment CTA & Mobile Hamburger Button */}
        <div className="flex items-center gap-3.5">
          <button 
            onClick={(e) => handleSmoothScroll(e, 'schedule')} 
            aria-label="Book Appointment"
            className="hidden sm:flex relative group items-center gap-2 px-7 py-3 rounded-full font-semibold text-[15px] text-white bg-gradient-to-r from-[#7C6BDF] to-[#6366F1] shadow-[0_0_25px_rgba(139,123,247,0.35)] transition-all duration-300 hover:shadow-[0_0_40px_rgba(139,123,247,0.55)] hover:-translate-y-0.5 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B7BF7]"
          >
            <CalendarDays className="w-4 h-4 text-violet-200 shrink-0" />
            <span>Book Appointment</span>
          </button>

          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open navigation menu"
            className="lg:hidden text-[#F5F5F7] w-11 h-11 flex items-center justify-center hover:bg-white/10 rounded-xl border border-white/10 transition-colors relative z-[60] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B7BF7]"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Fullscreen Mobile Navigation Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-[#0A0A0F]/95 backdrop-blur-3xl z-[150] lg:hidden flex flex-col justify-between overflow-y-auto"
            >
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
                    <span className="font-display font-bold text-base text-[#F5F5F7] block">DR. Nilay Saha</span>
                    <span className="text-[10px] uppercase tracking-widest text-[#8B7BF7] font-semibold">Advanced Dental Clinic</span>
                  </div>
                </div>

                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-label="Close menu"
                  className="w-11 h-11 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-[#A1A1A6] hover:text-[#F5F5F7] hover:bg-white/20 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B7BF7]"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 flex flex-col justify-center px-6 py-8 space-y-3 max-w-md mx-auto w-full font-sans">
                <div className="text-xs font-semibold uppercase tracking-widest text-[#8B7BF7] mb-2 px-2 flex items-center gap-1.5">
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
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 + idx * 0.03, type: "spring", damping: 24 }}
                      className={`text-2xl sm:text-3xl font-display font-bold py-3.5 px-4 rounded-xl flex items-center justify-between group transition-all duration-200 border border-transparent ${
                        isActive
                          ? "text-[#F5F5F7] bg-white/[0.06] border-white/15 pl-5"
                          : "text-[#A1A1A6] hover:text-[#F5F5F7] hover:bg-white/[0.03] hover:pl-5"
                      }`}
                    >
                      <span>{item.name}</span>
                      <ChevronRight className={`w-6 h-6 transition-transform group-hover:translate-x-1 ${isActive ? 'text-[#8B7BF7]' : 'text-[#6E6E73] group-hover:text-[#8B7BF7]'}`} />
                    </motion.a>
                  );
                })}
              </div>

              <div className="p-6 border-t border-white/10 bg-white/[0.02] space-y-3 mt-auto font-sans">
                <button 
                  onClick={(e) => handleSmoothScroll(e, 'schedule')} 
                  className="w-full py-4 rounded-full bg-gradient-to-r from-[#7C6BDF] to-[#6366F1] text-white font-semibold text-base shadow-[0_0_25px_rgba(139,123,247,0.35)] flex items-center justify-center gap-2.5 active:scale-[0.98] transition-all"
                >
                  <CalendarDays className="w-5 h-5 text-violet-200" />
                  <span>Book Appointment Now</span>
                </button>

                <div className="grid grid-cols-2 gap-3">
                  <a 
                    href="https://wa.me/919609180979" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="py-3.5 rounded-full border border-white/15 bg-white/[0.04] hover:bg-white/[0.08] text-[#F5F5F7] font-semibold text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
                  >
                    <WhatsAppIcon className="w-4 h-4 text-[#25D366]" />
                    <span>WhatsApp</span>
                  </a>

                  <a 
                    href="tel:+919609180979" 
                    className="py-3.5 rounded-full border border-white/15 bg-[#111116] hover:bg-white/[0.06] text-[#A1A1A6] font-semibold text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
                  >
                    <Phone className="w-4 h-4 text-[#8B7BF7]" />
                    <span>Call Clinic</span>
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
