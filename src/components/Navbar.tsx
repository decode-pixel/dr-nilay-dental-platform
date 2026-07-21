import React, { useState, useEffect } from "react";
import { CalendarDays, Menu, X, Phone, ChevronRight, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { WhatsAppIcon, ToothIcon } from "./Icons";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { PRIMARY_PHONE_NUMBER, PRIMARY_WHATSAPP_DIGITS } from "../lib/constants";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { name: "Home", id: "home" },
    { name: "About", id: "about" },
    { name: "Treatments", id: "treatments" },
    { name: "Clinics", id: "locations" },
    { name: "Reviews", id: "reviews" },
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
      setIsScrolled(currentScrollY > 15);

      if (location.pathname === '/') {
        const sectionCheckMap: { id: string; targets: string[] }[] = [
          { id: "home", targets: ["home"] },
          { id: "about", targets: ["about", "doctor-profile"] },
          { id: "treatments", targets: ["treatments"] },
          { id: "locations", targets: ["locations", "clinics"] },
          { id: "reviews", targets: ["reviews", "why-choose-us"] },
          { id: "faq", targets: ["faq"] },
          { id: "contact", targets: ["contact", "contact-info"] }
        ];

        let foundSection = "home";
        for (const item of sectionCheckMap) {
          for (const targetId of item.targets) {
            const el = document.getElementById(targetId);
            if (el) {
              const rect = el.getBoundingClientRect();
              if (rect.top <= window.innerHeight * 0.45 && rect.bottom >= 120) {
                foundSection = item.id;
                break;
              }
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

    if (targetId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setActiveSection('home');
      return;
    }

    let resolvedIds = [targetId];
    if (targetId === 'locations') resolvedIds = ['locations', 'clinics'];
    if (targetId === 'reviews') resolvedIds = ['reviews', 'why-choose-us'];
    if (targetId === 'contact') resolvedIds = ['contact', 'contact-info'];

    let target: HTMLElement | null = null;
    for (const id of resolvedIds) {
      const el = document.getElementById(id);
      if (el) {
        target = el;
        break;
      }
    }

    if (target) {
      const headerOffset = 110;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: Math.max(0, offsetPosition),
        behavior: 'smooth'
      });
      setActiveSection(targetId);
    }
  };

  return (
    <header className="fixed top-3 sm:top-5 inset-x-0 z-[100] px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto transition-all duration-300 pointer-events-none font-sans">
      <nav 
        className={`w-full flex items-center justify-between px-3.5 sm:px-6 py-2 sm:py-2.5 rounded-full pointer-events-auto transition-all duration-300 ${
          isScrolled 
            ? "bg-white/95 backdrop-blur-2xl border border-white/90 shadow-[0_12px_40px_rgba(18,40,32,0.1)]" 
            : "bg-white/90 backdrop-blur-xl border border-white/80 shadow-[0_8px_32px_rgba(18,40,32,0.06)]"
        }`}
        aria-label="Main Navigation"
      >
        {/* Left: Brand Logo Area matching requested design */}
        <a 
          href="#home" 
          onClick={(e) => handleSmoothScroll(e, 'home')} 
          className="flex items-center gap-2.5 sm:gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10B981] rounded-2xl transition-all shrink-0"
        >
          <div className="relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 shrink-0 rounded-2xl bg-[#E8F5F1] border border-[#10B981]/25 shadow-sm group-hover:scale-105 transition-transform duration-300">
            <ToothIcon className="w-5 h-5 sm:w-6 sm:h-6 text-[#10B981]" />
          </div>
          <div className="flex flex-col justify-center">
            <span className="font-display font-bold text-[16px] sm:text-[18px] lg:text-[20px] leading-none tracking-tight text-[#122820] flex items-center gap-1 group-hover:text-[#10B981] transition-colors">
              DR. <span className="text-[#10B981]">Nilay Saha</span>
            </span>
            <span className="text-[8.5px] sm:text-[10px] tracking-[0.2em] text-[#4B6358] font-bold uppercase mt-1">
              ADVANCED DENTAL STUDIO
            </span>
          </div>
        </a>

        {/* Center: Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-5 xl:gap-7 text-[14.5px] xl:text-[15px] font-medium">
          {navItems.map((item) => {
            const isActive = activeSection === item.id && location.pathname === '/';
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => handleSmoothScroll(e, item.id)}
                aria-current={isActive ? "page" : undefined}
                className={`relative py-1 px-1 transition-all duration-200 flex flex-col items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10B981] rounded-md group ${
                  isActive
                    ? "text-[#10B981] font-semibold"
                    : "text-[#2C4238] hover:text-[#10B981]"
                }`}
              >
                <span>{item.name}</span>
                {isActive ? (
                  <motion.div
                    layoutId="activeNavTabPill"
                    className="absolute -bottom-1 w-6 h-[2.5px] bg-[#10B981] rounded-full shadow-[0_2px_8px_rgba(16,185,129,0.5)]"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                ) : (
                  <span className="absolute -bottom-1 w-6 h-[2.5px] bg-[#10B981]/40 rounded-full transition-transform duration-300 origin-center scale-x-0 group-hover:scale-x-100" />
                )}
              </a>
            );
          })}
        </div>

        {/* Right: Call Button & Book Appointment CTA & Mobile Hamburger Button */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <a
            href={`tel:${PRIMARY_PHONE_NUMBER}`}
            aria-label="Call Clinic directly"
            className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#F4F7F4] border border-emerald-900/10 hover:border-[#10B981]/40 flex items-center justify-center text-[#10B981] hover:bg-emerald-50 shadow-sm transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10B981]"
          >
            <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
          </a>

          <button 
            type="button"
            onClick={(e) => handleSmoothScroll(e, 'schedule')} 
            aria-label="Book Appointment"
            className="hidden sm:flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full font-semibold text-xs sm:text-sm text-white bg-[#122820] hover:bg-[#10B981] shadow-[0_4px_16px_rgba(18,40,32,0.25)] hover:shadow-[0_6px_22px_rgba(16,185,129,0.4)] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10B981]"
          >
            <CalendarDays className="w-4 h-4 text-emerald-300 shrink-0" />
            <span>Book Appointment</span>
          </button>

          {/* Mobile Hamburger Button */}
          <button 
            type="button"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open mobile menu"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
            className="lg:hidden w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#122820] text-white flex items-center justify-center hover:bg-[#1C3A30] shadow-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10B981]"
          >
            <Menu className="w-5 h-5" />
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
              className="fixed inset-0 bg-[#071F17]/98 backdrop-blur-3xl z-[200] lg:hidden flex flex-col justify-between overflow-y-auto text-white pointer-events-auto"
            >
              <div className="flex items-center justify-between p-5 sm:p-6 border-b border-white/10 bg-white/[0.02]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#10B981]/20 border border-[#10B981]/40 flex items-center justify-center p-2">
                    <ToothIcon className="w-6 h-6 text-[#34D399]" />
                  </div>
                  <div>
                    <span className="font-display font-bold text-base text-white block">DR. Nilay Saha</span>
                    <span className="text-[10px] uppercase tracking-widest text-[#34D399] font-semibold">Advanced Dental Studio</span>
                  </div>
                </div>

                <button 
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-label="Close menu"
                  className="w-10 h-10 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/20 transition-all duration-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 flex flex-col justify-center px-6 py-8 space-y-2.5 max-w-md mx-auto w-full font-sans">
                <div className="text-xs font-semibold uppercase tracking-widest text-[#34D399] mb-3 px-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Navigation & Protocol</span>
                </div>

                {navItems.map((item, idx) => {
                  const isActive = activeSection === item.id && location.pathname === '/';
                  return (
                    <motion.a
                      key={item.id}
                      href={`#${item.id}`}
                      onClick={(e) => handleSmoothScroll(e, item.id)}
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.04 + idx * 0.03, type: "spring", damping: 24 }}
                      className={`text-xl sm:text-2xl font-display font-bold py-3.5 px-4.5 rounded-2xl flex items-center justify-between group transition-all duration-200 border ${
                        isActive
                          ? "text-white bg-[#10B981]/20 border-[#10B981]/40 pl-6 shadow-sm"
                          : "text-slate-300 hover:text-white hover:bg-white/[0.06] border-transparent hover:pl-6"
                      }`}
                    >
                      <span>{item.name}</span>
                      <ChevronRight className={`w-5 h-5 transition-transform group-hover:translate-x-1 ${isActive ? 'text-[#34D399]' : 'text-slate-500 group-hover:text-[#34D399]'}`} />
                    </motion.a>
                  );
                })}
                
                <div className="pt-5 border-t border-white/10 flex flex-wrap gap-x-5 gap-y-2.5 px-3 justify-center text-xs">
                  {secondaryItems.map((item) => (
                    item.type === "tel" ? (
                      <a
                        key={item.name}
                        href={item.to}
                        className="text-slate-400 hover:text-[#34D399] font-medium transition-colors"
                      >
                        {item.name}
                      </a>
                    ) : (
                      <Link
                        key={item.name}
                        to={item.to}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-slate-400 hover:text-[#34D399] font-medium transition-colors"
                      >
                        {item.name}
                      </Link>
                    )
                  ))}
                </div>
              </div>

              <div className="p-6 border-t border-white/10 bg-white/[0.02] space-y-3 mt-auto font-sans">
                <button 
                  type="button"
                  onClick={(e) => handleSmoothScroll(e, 'schedule')} 
                  className="w-full py-4 rounded-full bg-gradient-to-r from-[#10B981] to-[#059669] text-white font-semibold text-base shadow-[0_4px_20px_rgba(16,185,129,0.4)] flex items-center justify-center gap-2.5 active:scale-[0.98] transition-all"
                >
                  <CalendarDays className="w-5 h-5 text-emerald-100" />
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
                    className="py-3.5 rounded-full border border-white/15 bg-[#122820] hover:bg-[#1C3A30] text-slate-200 font-semibold text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
                  >
                    <Phone className="w-4 h-4 text-[#34D399]" />
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
