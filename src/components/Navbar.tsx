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
  { name: "Home",         id: "home" },
  { name: "About",        id: "about" },
  { name: "Treatments",   id: "treatments" },
  { name: "Clinics",      id: "locations" },
  { name: "Testimonials", id: "reviews" },
  { name: "FAQ",          id: "faq" },
  { name: "Contact",      id: "contact" },
] as const;

/**
 * ID resolution map — maps a nav ID to all element IDs to try in order.
 * This handles aliasing (e.g. "locations" → ["locations", "clinics"]) and
 * sections that have their ID on a parent wrapper vs the inner section tag.
 */
const ID_ALIASES: Record<string, string[]> = {
  home:         ["home"],
  about:        ["about", "doctor-profile"],
  credentials:  ["credentials", "trust", "about", "doctor-profile"],
  experience:   ["experience", "trust", "about", "doctor-profile"],
  treatments:   ["treatments", "treatments-wrapper"],
  locations:    ["locations", "clinics", "locations-wrapper"],
  clinics:      ["locations", "clinics", "locations-wrapper"],
  reviews:      ["reviews", "reviews-wrapper", "testimonials"],
  testimonials: ["reviews", "reviews-wrapper", "testimonials"],
  faq:          ["faq", "faq-wrapper"],
  contact:      ["contact", "contact-info"],
};

const NAV_OFFSET = 110; // px — accounts for fixed floating pill navbar height

// ─────────────────────────────────────────────────────────────────────────────
// Interruptible Custom Smooth Scroll Engine
// ─────────────────────────────────────────────────────────────────────────────

let currentScrollAnimId: number | null = null;
let isProgrammaticScrolling = false;
let programmaticScrollTimeout: ReturnType<typeof setTimeout> | null = null;

function cancelCurrentScroll() {
  if (currentScrollAnimId !== null) {
    cancelAnimationFrame(currentScrollAnimId);
    currentScrollAnimId = null;
  }
  if (programmaticScrollTimeout !== null) {
    clearTimeout(programmaticScrollTimeout);
    programmaticScrollTimeout = null;
  }
}

function performSmoothScroll(targetTop: number, onComplete?: () => void) {
  cancelCurrentScroll();
  isProgrammaticScrolling = true;

  const startTop = window.pageYOffset;
  const distance = targetTop - startTop;

  if (Math.abs(distance) < 4) {
    window.scrollTo(0, targetTop);
    isProgrammaticScrolling = false;
    onComplete?.();
    return;
  }

  const duration = Math.min(550, Math.max(280, Math.abs(distance) * 0.35));
  let startTime: number | null = null;

  function step(timestamp: number) {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Cubic ease-out for smooth acceleration & deceleration
    const ease = 1 - Math.pow(1 - progress, 3);

    window.scrollTo(0, startTop + distance * ease);

    if (progress < 1) {
      currentScrollAnimId = requestAnimationFrame(step);
    } else {
      currentScrollAnimId = null;
      programmaticScrollTimeout = setTimeout(() => {
        isProgrammaticScrolling = false;
        programmaticScrollTimeout = null;
        onComplete?.();
      }, 80);
    }
  }

  currentScrollAnimId = requestAnimationFrame(step);
}

function resolveElement(navId: string): HTMLElement | null {
  const aliases = ID_ALIASES[navId] ?? [navId];
  for (const id of aliases) {
    const el = document.getElementById(id);
    if (el) return el;
  }
  return null;
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

    document.documentElement.classList.add("mobile-menu-open");

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const handlePop = () => onClose();

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
              className="w-10 h-10 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/20 transition-all duration-150 active:scale-95 cursor-pointer"
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
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onNavClick(item.id)}
                  className={`w-full text-left text-xl sm:text-2xl font-display font-bold py-3.5 px-5 rounded-2xl flex items-center justify-between group transition-all duration-150 border active:scale-[0.98] cursor-pointer ${
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
              className="w-full py-4 rounded-full bg-gradient-to-r from-[#10B981] to-[#059669] text-white font-semibold text-base shadow-lg flex items-center justify-center gap-2.5 active:scale-[0.98] transition-transform cursor-pointer"
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

  // ── Scroll position listener for sticky navbar blur background ───────────
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ── Interrupt scroll if user manually interacts (wheel / touch) ─────────
  useEffect(() => {
    const handleUserInterrupt = () => {
      if (isProgrammaticScrolling) {
        cancelCurrentScroll();
        isProgrammaticScrolling = false;
      }
    };

    window.addEventListener("wheel", handleUserInterrupt, { passive: true });
    window.addEventListener("touchstart", handleUserInterrupt, { passive: true });
    return () => {
      window.removeEventListener("wheel", handleUserInterrupt);
      window.removeEventListener("touchstart", handleUserInterrupt);
    };
  }, []);

  // ── Active Section Tracking via IntersectionObserver ─────────────────────
  useEffect(() => {
    if (location.pathname !== "/") return;

    const handleIntersect = () => {
      // Ignore scroll-spy updates during explicit programmatic smooth scroll
      if (isProgrammaticScrolling) return;

      // Handle top of page edge case
      if (window.scrollY < 100) {
        setActiveSection("home");
        return;
      }

      // Handle bottom of page edge case
      const scrollBottom = window.scrollY + window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      if (scrollBottom >= docHeight - 40) {
        setActiveSection("contact");
        return;
      }

      // Find section closest to the top viewport focus area
      let currentActive = "home";
      let minDistance = Infinity;

      NAV_ITEMS.forEach((item) => {
        const el = resolveElement(item.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          // Distance from navbar offset
          const dist = Math.abs(rect.top - NAV_OFFSET);
          if (rect.top <= window.innerHeight * 0.5 && rect.bottom >= 100) {
            if (dist < minDistance) {
              minDistance = dist;
              currentActive = item.id;
            }
          }
        }
      });

      setActiveSection(currentActive);
    };

    const observer = new IntersectionObserver(
      () => {
        handleIntersect();
      },
      {
        root: null,
        rootMargin: "-20% 0px -45% 0px",
        threshold: [0, 0.15, 0.5, 0.75, 1.0],
      }
    );

    NAV_ITEMS.forEach((item) => {
      const el = resolveElement(item.id);
      if (el) observer.observe(el);
    });

    // Also run on scroll passive fallback
    window.addEventListener("scroll", handleIntersect, { passive: true });
    handleIntersect();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleIntersect);
    };
  }, [location.pathname]);

  // ── Close mobile menu on route change ────────────────────────────────────
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const closeMobileMenu = useCallback(() => setIsMobileMenuOpen(false), []);

  // ── Nav click handler (Immediate state update + cancellable scroll) ──────
  const handleNavClick = useCallback(
    (navId: string) => {
      setIsMobileMenuOpen(false);

      if (navId === "schedule") {
        window.dispatchEvent(new CustomEvent("openContactModal"));
        return;
      }

      // Synchronously update active section so highlight pill moves IMMEDIATELY
      setActiveSection(navId);

      if (location.pathname !== "/") {
        navigate("/");
        // Retry scroll once target page mounts
        setTimeout(() => {
          const el = resolveElement(navId);
          if (el) {
            const top = navId === "home" ? 0 : Math.max(0, el.getBoundingClientRect().top + window.pageYOffset - NAV_OFFSET);
            performSmoothScroll(top);
          }
        }, 120);
        return;
      }

      if (navId === "home") {
        performSmoothScroll(0);
      } else {
        const el = resolveElement(navId);
        if (el) {
          const top = Math.max(0, el.getBoundingClientRect().top + window.pageYOffset - NAV_OFFSET);
          performSmoothScroll(top);
        }
      }
    },
    [location.pathname, navigate]
  );

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
          {/* Brand logo */}
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
          <div className="hidden lg:flex items-center gap-1.5 xl:gap-2 text-[14px] xl:text-[14.5px] font-medium bg-slate-100/60 p-1.5 rounded-full border border-slate-200/60 shrink-0">
            {NAV_ITEMS.map((item) => {
              const isActive = isHomePage && activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={`/#${item.id}`}
                  onClick={(e) => handleAnchorClick(e, item.id)}
                  aria-current={isActive ? "page" : undefined}
                  className={`relative py-1.5 px-3.5 sm:px-4 rounded-full transition-all duration-200 flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10B981] group cursor-pointer ${
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
                      transition={{ type: "spring", stiffness: 450, damping: 35 }}
                    />
                  )}
                </a>
              );
            })}
          </div>

          {/* Right: CTA buttons + mobile hamburger */}
          <div className="flex items-center gap-1 xs:gap-1.5 sm:gap-3 shrink-0">
            <a
              href={`tel:${PRIMARY_PHONE_NUMBER}`}
              aria-label={`Call clinic: ${PRIMARY_PHONE_NUMBER}`}
              className="w-8 h-8 xs:w-9 xs:h-9 sm:w-11 sm:h-11 rounded-full bg-white/90 border border-emerald-500/20 hover:border-emerald-500/60 flex items-center justify-center text-[#10B981] hover:bg-emerald-50 shadow-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10B981] shrink-0"
            >
              <Phone className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5" />
            </a>

            <button
              type="button"
              onClick={() => handleNavClick("schedule")}
              aria-label="Book Appointment"
              className="flex btn-crystal px-2.5 xs:px-3.5 sm:px-6 py-1.5 xs:py-2 sm:py-3 text-[11px] xs:text-xs sm:text-sm font-bold shrink-0 items-center justify-center cursor-pointer"
            >
              <CalendarDays className="w-3.5 h-3.5 xs:w-4 xs:h-4 text-emerald-100 shrink-0" />
              <span className="hidden sm:inline">Book Appointment</span>
              <span className="inline sm:hidden">Book</span>
            </button>

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
        onClose={closeMobileMenu}
        activeSection={activeSection}
        onNavClick={handleNavClick}
      />
    </>
  );
}
