import React, { useState, useEffect } from "react";
import { CalendarDays, Menu, X, Phone, ChevronRight, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { WhatsAppIcon } from "./Icons";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { PRIMARY_PHONE_NUMBER, PRIMARY_WHATSAPP_DIGITS } from "../lib/constants";

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
    { name: "FAQ", id: "faq" },
    { name: "Contact", id: "contact" }
  ];

  const secondaryItems: { name: string; type: "tel" | "route"; to: string }[] = [
    { name: "Emergency Care", type: "tel", to: `tel:${PRIMARY_PHONE_NUMBER}` },
    { name: "Privacy Policy", type: "route", to: "/privacy" },
    { name: "Terms & Conditions", type: "route", to: "/terms" }
  ];

  useEffect(() => {
    let ticking = false;

    const updateScrollProgress = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 20);

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
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollProgress);
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    updateScrollProgress();
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
          ? "glass-4 py-3 sm:py-3.5 shadow-sm" 
          : "bg-transparent border-b border-transparent py-5 sm:py-6 shadow-none"
      }`}
    >
      {/* Scroll Progress Bar */}
      <div className="absolute top-0 inset-x-0 h-[3px] bg-transparent overflow-hidden pointer-events-none z-[110]">
        <motion.div 
          className="h-full bg-gradient-to-r from-[#2563EB] to-sky-400 shadow-[0_0_12px_rgba(37,99,235,0.6)]"
          style={{ width: `${scrollProgress}%` }}
          transition={{ ease: "linear", duration: 0.05 }}
        />
      </div>

      <nav className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between relative z-10 font-sans" aria-label="Main Navigation">
        
        {/* Logo Area */}
        <a 
          href="#home" 
          onClick={(e) => handleSmoothScroll(e, 'home')} 
          className="flex items-center gap-3.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] rounded-xl transition-all"
        >
          <div className="relative flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 shrink-0">
            <div className="absolute inset-0 bg-blue-500/15 rounded-full blur-[14px] pointer-events-none transition-all duration-500 group-hover:bg-blue-500/30" />
            
            <img 
              src="https://res.cloudinary.com/tud0sobq/image/upload/v1783343231/ChatGPT_Image_Jul_6_2026_06_28_47_PM_1_ipilq6.png" 
              alt="Dr. Nilay Saha Logo" 
              className="w-full h-full object-contain relative z-10 mix-blend-multiply drop-shadow-sm transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.src = "https://api.dicebear.com/7.x/shapes/svg?seed=tooth&backgroundColor=000000";
              }}
            />
          </div>
          <div className="flex flex-col justify-center">
            <span className="font-display font-bold text-lg sm:text-xl leading-tight tracking-tight flex items-center gap-1.5 text-[#0F172A] group-hover:text-[#2563EB] transition-colors">
              DR. <span className="text-[#2563EB]">Nilay Saha</span>
            </span>
            <span className="text-[10px] sm:text-[11px] tracking-[0.16em] text-[#64748B] font-semibold uppercase mt-0.5">
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
                aria-current={isActive ? "page" : undefined}
                className={`relative px-3.5 py-2 rounded-lg transition-all duration-200 flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] group ${
                  isActive
                    ? "text-[#0F172A] font-bold"
                    : "text-[#475569] hover:text-[#2563EB]"
                }`}
              >
                <span>{item.name}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeNavTab"
                    className="absolute -bottom-1 left-3 right-3 h-[2.5px] bg-[#2563EB] rounded-full shadow-[0_2px_8px_rgba(37,99,235,0.4)]"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <span className={`absolute -bottom-1 left-3 right-3 h-[2.5px] bg-[#2563EB]/40 rounded-full transition-transform duration-300 origin-center scale-x-0 group-hover:scale-x-100 ${isActive ? 'hidden' : 'block'}`} />
              </a>
            );
          })}

          {/* Overflow Menu Dropdown */}
          <div className="relative group cursor-pointer h-full flex items-center ml-1">
            <button 
              type="button" 
              aria-label="More options"
              className="w-9 h-9 rounded-full flex items-center justify-center bg-slate-100/80 border border-slate-200 hover:bg-white hover:border-blue-300 transition-all text-[#475569] hover:text-[#2563EB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="1"></circle>
                <circle cx="12" cy="5" r="1"></circle>
                <circle cx="12" cy="19" r="1"></circle>
              </svg>
            </button>
            
            <div className="absolute top-full right-0 mt-3 w-56 bg-white/95 backdrop-blur-2xl border border-slate-200/90 rounded-2xl shadow-[0_16px_56px_rgba(15,23,42,0.15)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 overflow-hidden z-50 transform origin-top-right group-hover:translate-y-0 translate-y-2">
              <div className="py-2 flex flex-col">
                {secondaryItems.map((item) =>
                  item.type === "tel" ? (
                    <a
                      key={item.name}
                      href={item.to}
                      className="px-4 py-2.5 text-sm text-[#475569] hover:text-[#0F172A] hover:bg-slate-100/80 transition-colors flex items-center justify-between group/sub font-medium"
                    >
                      <span>{item.name}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8] group-hover/sub:text-[#2563EB] group-hover/sub:translate-x-0.5 transition-all" />
                    </a>
                  ) : (
                    <Link
                      key={item.name}
                      to={item.to}
                      className="px-4 py-2.5 text-sm text-[#475569] hover:text-[#0F172A] hover:bg-slate-100/80 transition-colors flex items-center justify-between group/sub font-medium"
                    >
                      <span>{item.name}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8] group-hover/sub:text-[#2563EB] group-hover/sub:translate-x-0.5 transition-all" />
                    </Link>
                  )
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Book Appointment CTA & Mobile Hamburger Button */}
        <div className="flex items-center gap-3.5">
          <button 
            onClick={(e) => handleSmoothScroll(e, 'schedule')} 
            aria-label="Book Appointment"
            className="hidden sm:flex relative group items-center gap-2 px-7 py-3 rounded-full font-semibold text-[15px] text-white bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] shadow-[0_4px_16px_rgba(37,99,235,0.3)] transition-all duration-300 hover:shadow-[0_6px_24px_rgba(37,99,235,0.5)] hover:-translate-y-0.5 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
          >
            <CalendarDays className="w-4 h-4 text-blue-100 shrink-0" />
            <span>Book Appointment</span>
          </button>

          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open navigation menu"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
            className="lg:hidden text-[#0F172A] w-11 h-11 flex items-center justify-center hover:bg-slate-100/80 rounded-xl border border-slate-200 transition-colors relative z-[60] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
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
              id="mobile-menu"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation Menu"
              className="fixed inset-0 bg-slate-950/98 backdrop-blur-3xl z-[150] lg:hidden flex flex-col justify-between overflow-y-auto text-white"
            >
              <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/[0.02]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-white/10 border border-white/20 flex items-center justify-center p-1">
                    <img 
                      src="https://res.cloudinary.com/tud0sobq/image/upload/v1783343231/ChatGPT_Image_Jul_6_2026_06_28_47_PM_1_ipilq6.png" 
                      alt="Logo" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <span className="font-display font-bold text-base text-white block">DR. Nilay Saha</span>
                    <span className="text-[10px] uppercase tracking-widest text-blue-400 font-semibold">Advanced Dental Clinic</span>
                  </div>
                </div>

                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-label="Close menu"
                  className="w-11 h-11 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/20 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 flex flex-col justify-center px-6 py-8 space-y-3 max-w-md mx-auto w-full font-sans">
                <div className="text-xs font-semibold uppercase tracking-widest text-blue-400 mb-2 px-2 flex items-center gap-1.5">
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
                          ? "text-white bg-white/10 border-white/20 pl-5"
                          : "text-slate-400 hover:text-white hover:bg-white/[0.05] hover:pl-5"
                      }`}
                    >
                      <span>{item.name}</span>
                      <ChevronRight className={`w-6 h-6 transition-transform group-hover:translate-x-1 ${isActive ? 'text-blue-400' : 'text-slate-600 group-hover:text-blue-400'}`} />
                    </motion.a>
                  );
                })}
                
                {/* Secondary/Legal Items in Mobile Menu */}
                <div className="pt-4 border-t border-white/10 flex flex-wrap gap-x-4 gap-y-2 px-4 justify-center text-xs">
                  {secondaryItems.map((item) => (
                    item.type === "tel" ? (
                      <a
                        key={item.name}
                        href={item.to}
                        className="text-slate-400 hover:text-white font-medium transition-colors"
                      >
                        {item.name}
                      </a>
                    ) : (
                      <Link
                        key={item.name}
                        to={item.to}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-slate-400 hover:text-white font-medium transition-colors"
                      >
                        {item.name}
                      </Link>
                    )
                  ))}
                </div>
              </div>

              <div className="p-6 border-t border-white/10 bg-white/[0.02] space-y-3 mt-auto font-sans">
                <button 
                  onClick={(e) => handleSmoothScroll(e, 'schedule')} 
                  className="w-full py-4 rounded-full bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] text-white font-semibold text-base shadow-[0_4px_20px_rgba(37,99,235,0.4)] flex items-center justify-center gap-2.5 active:scale-[0.98] transition-all"
                >
                  <CalendarDays className="w-5 h-5 text-blue-100" />
                  <span>Book Appointment Now</span>
                </button>

                <div className="grid grid-cols-2 gap-3">
                  <a 
                    href={`https://wa.me/${PRIMARY_WHATSAPP_DIGITS}`} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="py-3.5 rounded-full border border-white/15 bg-white/[0.06] hover:bg-white/10 text-white font-semibold text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
                  >
                    <WhatsAppIcon className="w-4 h-4 text-[#25D366]" />
                    <span>WhatsApp</span>
                  </a>

                  <a 
                    href={`tel:${PRIMARY_PHONE_NUMBER}`} 
                    className="py-3.5 rounded-full border border-white/15 bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
                  >
                    <Phone className="w-4 h-4 text-blue-400" />
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
