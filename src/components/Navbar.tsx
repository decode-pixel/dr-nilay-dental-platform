import React, { useState, useEffect, useCallback, useRef } from "react";
import { CalendarDays, Menu, X, Phone, ChevronRight, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { WhatsAppIcon, ToothIcon } from "./Icons";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { PRIMARY_PHONE_NUMBER, PRIMARY_WHATSAPP_DIGITS } from "../lib/constants";

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { name: "Home",       id: "home" },
  { name: "About",      id: "about" },
  { name: "Treatments", id: "treatments" },
  { name: "Gallery",    id: "gallery" },
  { name: "Clinics",    id: "locations" },
  { name: "Reviews",    id: "reviews" },
  { name: "FAQ",        id: "faq" },
  { name: "Contact",    id: "contact" },
] as const;

/**
 * ID resolution map — maps a nav ID to all element IDs to try in order.
 * This handles aliasing (e.g. "locations" → ["locations", "clinics"]) and
 * sections that have their ID on a parent wrapper vs the inner section tag.
 */
const ID_ALIASES: Record<string, string[]> = {
  home:       ["home"],
  about:      ["about", "doctor-profile"],
  treatments: ["treatments"],
  gallery:    ["gallery", "smile-gallery"],
  locations:  ["locations", "clinics"],
  reviews:    ["reviews", "why-choose-us"],
  faq:        ["faq"],
  contact:    ["contact", "contact-info"],
};

const NAV_OFFSET = 110; // px — accounts for fixed floating pill navbar height

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function resolveElement(navId: string): HTMLElement | null {
  const aliases = ID_ALIASES[navId] ?? [navId];
  for (const id of aliases) {
    const el = document.getElementById(id);
    if (el) return el;
  }
  return null;
}

function scrollToSection(navId: string) {
  if (navId === "home") {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  const el = resolveElement(navId);
  if (el) {
    const top = el.getBoundingClientRect().top + window.pageYOffset - NAV_OFFSET;
    window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  }
}

/**
 * Retry scrolling to a section up to `maxAttempts` times (for lazy-loaded
 * sections that haven't mounted yet when a cross-route hash navigation lands).
 */
function scrollToSectionWithRetry(navId: string, maxAttempts = 16, delayMs = 60) {
  let attempts = 0;
  const attempt = () => {
    const el = resolveElement(navId);
    if (el) {
      const top = el.getBoundingClientRect().top + window.pageYOffset - NAV_OFFSET;
      window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
    } else if (attempts < maxAttempts) {
      attempts++;
      setTimeout(attempt, delayMs);
    }
  };
  setTimeout(attempt, 80); // tiny paint delay before first try
}

// ─────────────────────────────────────────────────────────────────────────────
// MobileMenu — Rendered as a React Portal sibling (outside <nav>)
// so it is NOT constrained by nav's stacking context.
// ─────────────────────────────────────────────────────────────────────────────

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  activeSection: string;
  onNavClick: (id: string) => void;
}

function MobileMenu({ isOpen, onClose, activeSection, onNavClick }: MobileMenuProps) {
  // Trap focus — close on Escape / Android Back (popstate)
  useEffect(() => {
    if (!isOpen) return;

    // Lock body scroll — use class to avoid inline style fights
    document.documentElement.classList.add("mobile-menu-open");

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const handlePop = () => onClose(); // Android back button

    window.addEventListener("keydown", handleKey);
    window.addEventListener("popstate", handlePop);

    return () => {
      document.documentElement.classList.remove("mobile-menu-open");
      window.removeEventListener("keydown", handleKey);
      window.removeEventListener("popstate", handlePop);
    };
  }, [isOpen, onClose]);

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
          // FIXED: rendered outside <nav> so no stacking context conflict.
          // z-[999] ensures it always covers everything on every browser.
          style={{ position: "fixed", inset: 0, zIndex: 999 }}
          className="bg-[#071F17] flex flex-col justify-between overflow-y-auto text-white font-sans"
        >
          {/* Header row */}
          <div className="flex items-center justify-between px-5 py-5 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#10B981]/20 border border-[#10B981]/40 flex items-center justify-center">
                <ToothIcon className="w-5 h-5 text-[#34D399]" />
              </div>
              <div>
                <span className="font-display font-bold text-base text-white block leading-tight">DR. Nilay Saha</span>
                <span className="text-[10px] uppercase tracking-widest text-[#34D399] font-semibold">Advanced Dental Studio</span>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close menu"
              className="w-10 h-10 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/20 transition-all duration-150 active:scale-95"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav links */}
          <div className="flex-1 flex flex-col justify-center px-6 py-8 space-y-1.5 max-w-md mx-auto w-full">
            <div className="text-xs font-semibold uppercase tracking-widest text-[#34D399] mb-4 px-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Navigation</span>
            </div>

            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                // Use <button> not <a> to avoid any browser default anchor behaviour
                // that could interfere with our custom scroll logic
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onNavClick(item.id)}
                  className={`w-full text-left text-xl sm:text-2xl font-display font-bold py-3.5 px-5 rounded-2xl flex items-center justify-between group transition-all duration-150 border active:scale-[0.98] ${
                    isActive
                      ? "text-white bg-[#10B981]/20 border-[#10B981]/40 shadow-sm"
                      : "text-slate-300 hover:text-white hover:bg-white/[0.06] border-transparent"
                  }`}
                >
                  <span>{item.name}</span>
                  <ChevronRight
                    className={`w-5 h-5 transition-transform group-hover:translate-x-1 ${
                      isActive ? "text-[#34D399]" : "text-slate-500 group-hover:text-[#34D399]"
                    }`}
                  />
                </button>
              );
            })}

            {/* Secondary links */}
            <div className="pt-5 border-t border-white/10 flex flex-wrap gap-x-5 gap-y-2.5 px-3 justify-center text-xs">
              <a
                href={`tel:${PRIMARY_PHONE_NUMBER}`}
                onClick={onClose}
                className="text-slate-400 hover:text-[#34D399] font-medium transition-colors py-1"
              >
                Emergency Care
              </a>
              <Link
                to="/privacy"
                onClick={onClose}
                className="text-slate-400 hover:text-[#34D399] font-medium transition-colors py-1"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                onClick={onClose}
                className="text-slate-400 hover:text-[#34D399] font-medium transition-colors py-1"
              >
                Terms &amp; Conditions
              </Link>
            </div>
          </div>

          {/* CTA footer */}
          <div className="p-5 border-t border-white/10 space-y-3">
            <button
              type="button"
              onClick={() => {
                onClose();
                window.dispatchEvent(new CustomEvent("openContactModal"));
              }}
              className="w-full py-4 rounded-full bg-gradient-to-r from-[#10B981] to-[#059669] text-white font-semibold text-base shadow-lg flex items-center justify-center gap-2.5 active:scale-[0.98] transition-transform"
            >
              <CalendarDays className="w-5 h-5 text-emerald-100" />
              <span>Book Appointment Now</span>
            </button>

            <div className="grid grid-cols-2 gap-3">
              <a
                href={`https://wa.me/${PRIMARY_WHATSAPP_DIGITS}`}
                target="_blank"
                rel="noreferrer"
                onClick={onClose}
                className="py-3.5 rounded-full border border-white/15 bg-white/[0.06] text-white font-semibold text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
              >
                <WhatsAppIcon className="w-4 h-4 text-[#25D366]" />
                <span>WhatsApp</span>
              </a>
              <a
                href={`tel:${PRIMARY_PHONE_NUMBER}`}
                onClick={onClose}
                className="py-3.5 rounded-full border border-white/15 bg-[#122820] text-slate-200 font-semibold text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
              >
                <Phone className="w-4 h-4 text-[#34D399]" />
                <span>Call Clinic</span>
              </a>
            </div>
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
  const [activeSection, setActiveSection] = useState<string>("home");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const tickingRef = useRef(false);

  // ── Active section tracker (scroll spy) ──────────────────────────────────
  useEffect(() => {
    const update = () => {
      setIsScrolled(window.scrollY > 15);

      if (location.pathname === "/") {
        let found = "home";
        for (const item of NAV_ITEMS) {
          const el = resolveElement(item.id);
          if (el) {
            const rect = el.getBoundingClientRect();
            if (rect.top <= window.innerHeight * 0.45 && rect.bottom >= 100) {
              found = item.id;
              break;
            }
          }
        }
        setActiveSection(found);
      }
      tickingRef.current = false;
    };

    const onScroll = () => {
      if (!tickingRef.current) {
        requestAnimationFrame(update);
        tickingRef.current = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    update(); // run once on mount / route change
    return () => window.removeEventListener("scroll", onScroll);
  }, [location.pathname]);

  // ── Close mobile menu on route change (e.g. navigate to /privacy) ────────
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // ── Click-outside handler to close mobile menu ────────────────────────────
  const closeMobileMenu = useCallback(() => setIsMobileMenuOpen(false), []);

  // ── Nav click handler (works from any route) ──────────────────────────────
  const handleNavClick = useCallback(
    (navId: string) => {
      setIsMobileMenuOpen(false);

      if (navId === "schedule") {
        window.dispatchEvent(new CustomEvent("openContactModal"));
        return;
      }

      if (location.pathname !== "/") {
        // Navigate to home, then scroll once sections are mounted
        navigate("/");
        scrollToSectionWithRetry(navId, 20, 80);
        return;
      }

      scrollToSection(navId);
      setActiveSection(navId);
    },
    [location.pathname, navigate]
  );

  // ── Anchor tag wrapper (preserves href for SEO / right-click) ─────────────
  const handleAnchorClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, navId: string) => {
      e.preventDefault();
      handleNavClick(navId);
    },
    [handleNavClick]
  );

  const isHomePage = location.pathname === "/";

  return (
    <>
      {/* ── Floating pill header ─────────────────────────────────────────── */}
      <header
        className="fixed top-2 xs:top-3 sm:top-5 inset-x-0 z-[100] px-2 xs:px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto pointer-events-none font-sans transition-all duration-300"
        aria-label="Site header"
      >
        <nav
          className={`w-full flex items-center justify-between px-2.5 xs:px-3.5 sm:px-7 py-2 xs:py-2.5 sm:py-3.5 rounded-full pointer-events-auto transition-all duration-300 ${
            isScrolled
              ? "glass-crystal border border-white/95 shadow-[0_16px_50px_rgba(6,19,30,0.12)]"
              : "bg-white/85 backdrop-blur-2xl border border-white/85 shadow-[0_10px_35px_rgba(6,19,30,0.06)]"
          }`}
          aria-label="Main navigation"
        >
          {/* Brand logo — automatically adapts and shrinks on ultra-narrow mobile */}
          <a
            href="/#home"
            onClick={(e) => handleAnchorClick(e, "home")}
            className="flex items-center gap-1.5 xs:gap-2.5 sm:gap-3.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10B981] rounded-2xl min-w-0 shrink"
          >
            <div className="relative w-8 h-8 xs:w-9 xs:h-9 sm:w-12 sm:h-12 shrink-0 rounded-xl sm:rounded-2xl bg-gradient-to-br from-emerald-500/15 to-emerald-500/5 border border-emerald-500/30 shadow-sm group-hover:scale-105 transition-all duration-300 flex items-center justify-center">
              <ToothIcon className="w-4 h-4 xs:w-4.5 xs:h-4.5 sm:w-6 sm:h-6 text-[#10B981]" />
            </div>
            <div className="flex flex-col justify-center min-w-0 truncate">
              <span className="font-display font-bold text-[13.5px] xs:text-[15px] sm:text-[19px] leading-none tracking-tight text-[#122820] flex items-center gap-1 truncate group-hover:text-[#10B981] transition-colors">
                DR. <span className="text-[#10B981] truncate">Nilay Saha</span>
              </span>
              <span className="text-[7px] xs:text-[8px] sm:text-[10px] tracking-[0.16em] xs:tracking-[0.2em] sm:tracking-[0.22em] text-[#4B6358] font-bold uppercase mt-0.5 sm:mt-1 truncate hidden xs:block">
                ADVANCED DENTAL STUDIO
              </span>
            </div>
          </a>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-3 text-[14.5px] xl:text-[15px] font-medium bg-slate-100/60 p-1.5 rounded-full border border-slate-200/60 shrink-0">
            {NAV_ITEMS.map((item) => {
              const isActive = isHomePage && activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={`/#${item.id}`}
                  onClick={(e) => handleAnchorClick(e, item.id)}
                  aria-current={isActive ? "page" : undefined}
                  className={`relative py-1.5 px-4 rounded-full transition-all duration-200 flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10B981] group ${
                    isActive
                      ? "text-[#10B981] font-bold bg-white shadow-sm border border-emerald-500/20"
                      : "text-[#2C4238] hover:text-[#10B981] hover:bg-white/60"
                  }`}
                >
                  <span className="relative z-10">{item.name}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeNavPill"
                      className="absolute inset-0 bg-white rounded-full border border-emerald-500/30 shadow-sm z-0"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                </a>
              );
            })}
          </div>

          {/* Right: CTA buttons + mobile hamburger (Adapts intelligently across 320px-414px+) */}
          <div className="flex items-center gap-1 xs:gap-1.5 sm:gap-3 shrink-0">
            {/* Phone button — shrinks intelligently on small screens */}
            <a
              href={`tel:${PRIMARY_PHONE_NUMBER}`}
              aria-label={`Call clinic: ${PRIMARY_PHONE_NUMBER}`}
              className="w-8 h-8 xs:w-9 xs:h-9 sm:w-11 sm:h-11 rounded-full bg-white/90 border border-emerald-500/20 hover:border-emerald-500/60 flex items-center justify-center text-[#10B981] hover:bg-emerald-50 shadow-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10B981] shrink-0"
            >
              <Phone className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5" />
            </a>

            {/* Book Appointment CTA — Adapts width and text for mobile vs desktop without clipping */}
            <button
              type="button"
              onClick={() => handleNavClick("schedule")}
              aria-label="Book Appointment"
              className="flex btn-crystal px-2.5 xs:px-3.5 sm:px-6 py-1.5 xs:py-2 sm:py-3 text-[11px] xs:text-xs sm:text-sm font-bold shrink-0 items-center justify-center"
            >
              <CalendarDays className="w-3.5 h-3.5 xs:w-4 xs:h-4 text-emerald-100 shrink-0" />
              <span className="hidden sm:inline">Book Appointment</span>
              <span className="inline sm:hidden">Book</span>
            </button>

            {/* Mobile hamburger — visible only on <lg */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              className="lg:hidden w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 rounded-full bg-[#122820] text-white flex items-center justify-center hover:bg-[#10B981] shadow-sm transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10B981] shrink-0"
            >
              <Menu className="w-4 h-4 xs:w-4.5 xs:h-4.5 sm:w-5 sm:h-5" />
            </button>
          </div>
        </nav>
      </header>

      {/* ── Mobile overlay — rendered as a sibling to <header>, NOT inside it ── */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={closeMobileMenu}
        activeSection={activeSection}
        onNavClick={handleNavClick}
      />
    </>
  );
}
