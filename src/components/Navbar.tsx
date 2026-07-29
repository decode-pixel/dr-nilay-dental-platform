import React, { useState, useEffect } from "react";
import { CalendarDays, Menu, X, Phone, ChevronRight, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { WhatsAppIcon, ToothIcon } from "./Icons";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { PRIMARY_PHONE_NUMBER } from "../lib/constants";

// ─────────────────────────────────────────────────────────────────────────────
// Constants — Multi-Page Navigation Architecture
// ─────────────────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { name: "Home",         path: "/" },
  { name: "About",        path: "/about" },
  { name: "Treatments",   path: "/treatments" },
  { name: "Clinics",      path: "/clinics" },
  { name: "Reviews",      path: "/reviews" },
  { name: "FAQ",          path: "/faq" },
  { name: "Contact",      path: "/contact" },
] as const;

// ─────────────────────────────────────────────────────────────────────────────
// MobileMenu Component
// ─────────────────────────────────────────────────────────────────────────────

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  currentPath: string;
}

function MobileMenu({ isOpen, onClose, currentPath }: MobileMenuProps) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="mobile-menu-overlay"
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation Menu"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          style={{ position: "fixed", inset: 0, zIndex: 999 }}
          className="bg-[#071F17] flex flex-col justify-between overflow-y-auto text-white font-sans"
        >
          {/* Header row */}
          <div className="flex items-center justify-between px-5 py-5 border-b border-white/10">
            <Link to="/" onClick={onClose} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#10B981]/20 border border-[#10B981]/40 flex items-center justify-center">
                <ToothIcon className="w-5 h-5 text-[#34D399]" />
              </div>
              <div>
                <span className="font-display font-bold text-base text-white block leading-tight">DR. Nilay Saha</span>
                <span className="text-[10px] uppercase tracking-widest text-[#34D399] font-semibold">Advanced Dental Studio</span>
              </div>
            </Link>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close menu"
              className="w-10 h-10 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/20 transition-all duration-150 active:scale-95 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav links */}
          <div className="flex-1 flex flex-col justify-center px-6 py-8 space-y-1.5 max-w-md mx-auto w-full">
            <div className="text-xs font-semibold uppercase tracking-widest text-[#34D399] mb-4 px-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Navigation Pages</span>
            </div>

            {NAV_ITEMS.map((item) => {
              const isActive = item.path === "/" ? currentPath === "/" : currentPath.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={`flex items-center justify-between w-full px-4 py-3.5 rounded-2xl text-base font-medium transition-all duration-150 active:scale-[0.98] ${
                    isActive
                      ? "bg-[#10B981] text-slate-950 font-bold shadow-[0_0_20px_rgba(16,185,129,0.35)]"
                      : "text-slate-200 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <span>{item.name}</span>
                  <ChevronRight className={`w-4 h-4 ${isActive ? "text-slate-950" : "text-white/40"}`} />
                </Link>
              );
            })}
          </div>

          {/* Bottom CTAs */}
          <div className="p-6 border-t border-white/10 space-y-3 max-w-md mx-auto w-full">
            <Link
              to="/book-appointment"
              onClick={onClose}
              className="w-full h-12 rounded-2xl bg-[#10B981] text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)] active:scale-95 transition-all"
            >
              <CalendarDays className="w-4 h-4 text-slate-950" />
              <span>Book Appointment</span>
            </Link>

            <a
              href={`tel:${PRIMARY_PHONE_NUMBER}`}
              className="w-full h-11 rounded-2xl bg-white/10 border border-white/15 text-white font-semibold text-xs flex items-center justify-center gap-2 hover:bg-white/20 transition-all"
            >
              <Phone className="w-3.5 h-3.5 text-[#34D399]" />
              <span>Call Reception</span>
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Navbar Component
// ─────────────────────────────────────────────────────────────────────────────

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 pointer-events-none ${
          isScrolled ? "py-2 sm:py-3" : "py-3 sm:py-5"
        }`}
      >
        <nav
          className={`pointer-events-auto transition-all duration-300 flex items-center justify-between ${
            isScrolled
              ? "apple-liquid-glass-scrolled px-3 sm:px-7 py-2 sm:py-2.5 max-w-[94%] sm:max-w-6xl mx-auto"
              : "apple-liquid-glass px-3.5 sm:px-8 py-2.5 sm:py-3.5 max-w-[96%] sm:max-w-7xl mx-auto"
          }`}
          aria-label="Main navigation"
        >
          {/* Brand logo */}
          <Link
            to="/"
            className="flex items-center gap-1.5 xs:gap-2.5 sm:gap-3.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00A896] rounded-2xl min-w-0 shrink"
          >
            <div className="relative w-8 h-8 xs:w-9 xs:h-9 sm:w-11 sm:h-11 shrink-0 rounded-full bg-gradient-to-br from-teal-500/15 to-teal-500/5 border border-teal-500/30 shadow-xs flex items-center justify-center">
              <ToothIcon className="w-5 h-5 xs:w-5.5 xs:h-5.5 sm:w-6.5 sm:h-6.5 text-[#00A896]" />
            </div>
            <div className="flex flex-col justify-center min-w-0 truncate">
              <span className="font-display font-extrabold text-[13.5px] xs:text-[15px] sm:text-[18px] leading-none tracking-tight text-slate-900 flex items-center gap-1 truncate group-hover:text-[#00A896] transition-colors">
                DR. <span className="text-[#00A896] truncate">Nilay Saha</span>
              </span>
              <span className="text-[7px] xs:text-[8px] sm:text-[9.5px] tracking-[0.18em] text-slate-500 font-bold uppercase mt-0.5 sm:mt-1 truncate hidden xs:block">
                ADVANCED DENTAL STUDIO
              </span>
            </div>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-1 text-[13.5px] xl:text-[14px] font-medium bg-slate-200/40 p-1.5 rounded-full border border-white/60 backdrop-blur-md shrink-0 relative">
            {NAV_ITEMS.map((item) => {
              const isActive = item.path === "/" ? location.pathname === "/" : location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  aria-current={isActive ? "page" : undefined}
                  className={`relative py-1.5 px-3.5 sm:px-4 rounded-full transition-colors duration-200 flex items-center justify-center focus-visible:outline-none group cursor-pointer ${
                    isActive
                      ? "text-[#00A896] font-extrabold"
                      : "text-slate-700 hover:text-[#00A896] hover:bg-white/40"
                  }`}
                >
                  <span className="relative z-10">{item.name}</span>
                  {isActive && (
                    <motion.div
                      layoutId="appleActiveTabIndicator"
                      className="absolute inset-0 bg-white/95 rounded-full border border-teal-500/25 shadow-[0_2px_10px_rgba(0,168,150,0.14)] z-0 pointer-events-none"
                      transition={{ type: "spring", stiffness: 350, damping: 30, mass: 0.8 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right: CTA buttons + mobile hamburger */}
          <div className="flex items-center gap-1.5 xs:gap-2 sm:gap-3 shrink-0">
            <a
              href={`tel:${PRIMARY_PHONE_NUMBER}`}
              aria-label={`Call clinic: ${PRIMARY_PHONE_NUMBER}`}
              className="w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 rounded-full bg-white/90 border border-teal-500/20 hover:border-teal-500/60 flex items-center justify-center text-[#00A896] hover:bg-teal-50 shadow-xs transition-all duration-200 focus-visible:outline-none shrink-0"
            >
              <Phone className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-4.5 sm:h-4.5" />
            </a>

            <Link
              to="/book-appointment"
              aria-label="Book Appointment"
              className="flex btn-crystal px-2.5 xs:px-3.5 sm:px-6 py-1.5 xs:py-2 sm:py-3 text-[11px] xs:text-xs sm:text-sm font-bold shrink-0 items-center justify-center cursor-pointer"
            >
              <CalendarDays className="w-3.5 h-3.5 xs:w-4 xs:h-4 text-emerald-100 shrink-0" />
              <span className="hidden sm:inline">Book Appointment</span>
              <span className="inline sm:hidden">Book</span>
            </Link>

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              className="lg:hidden w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 rounded-full bg-[#122820] text-white flex items-center justify-center hover:bg-[#10B981] shadow-sm transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10B981] shrink-0 cursor-pointer"
            >
              <Menu className="w-4 h-4 xs:w-4.5 xs:h-4.5 sm:w-5 sm:h-5" />
            </button>
          </div>
        </nav>
      </header>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        currentPath={location.pathname}
      />
    </>
  );
}
