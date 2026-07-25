import React, { useState, useEffect, useMemo, useRef } from "react";
import { X, Calendar, Clock, MapPin, User, Phone, CheckCircle2, Sparkles, Send, Navigation, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { WhatsAppIcon, ToothIcon } from "./Icons";
import {
  PRIMARY_PHONE_NUMBER,
  CLINIC_NAMES,
  CLINIC_SCHEDULES,
  CLINIC_SLUGS,
  buildWhatsAppUrl
} from "../lib/constants";

export interface ContactModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  initialServiceSlug?: string;
  initialClinicSlug?: string;
}

export default function ContactModal({
  isOpen: externalIsOpen,
  onClose: externalOnClose,
  initialServiceSlug = "consultation",
  initialClinicSlug = CLINIC_SLUGS.BELERHAT
}: ContactModalProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isChangingClinic, setIsChangingClinic] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const getTodayStr = () => new Date().toISOString().split("T")[0];

  const getNextAvailableDate = (clinicSlug: string, startFromDateStr?: string): string => {
    const config = CLINIC_SCHEDULES[clinicSlug] || CLINIC_SCHEDULES[CLINIC_SLUGS.BELERHAT];
    const curr = startFromDateStr ? new Date(startFromDateStr + "T00:00:00") : new Date();
    for (let i = 0; i < 14; i++) {
      if (config.openDays.includes(curr.getDay())) return curr.toISOString().split("T")[0];
      curr.setDate(curr.getDate() + 1);
    }
    return startFromDateStr || getTodayStr();
  };

  const [clinic, setClinic] = useState(initialClinicSlug);
  const [service, setService] = useState(initialServiceSlug);
  const [date, setDate] = useState(() => getNextAvailableDate(initialClinicSlug));
  const [sessionTime, setSessionTime] = useState("");
  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [bookingRef, setBookingRef] = useState("");

  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;

  const activeConfig = useMemo(
    () => CLINIC_SCHEDULES[clinic] || CLINIC_SCHEDULES[CLINIC_SLUGS.BELERHAT],
    [clinic]
  );

  const selectedDayOfWeek = useMemo(() => {
    if (!date) return 1;
    return new Date(date + "T00:00:00").getDay();
  }, [date]);

  const isDateOpen = useMemo(
    () => activeConfig.openDays.includes(selectedDayOfWeek),
    [activeConfig, selectedDayOfWeek]
  );

  const availableSlots = useMemo(() => {
    if (!isDateOpen) return [];
    return activeConfig.slotsByDay[selectedDayOfWeek] || [];
  }, [activeConfig, selectedDayOfWeek, isDateOpen]);

  const handleClinicChange = (newClinicSlug: string) => {
    setIsChangingClinic(true);
    setClinic(newClinicSlug);
    setDate(getNextAvailableDate(newClinicSlug, date));
    setTimeout(() => setIsChangingClinic(false), 200);
  };

  useEffect(() => {
    if (availableSlots.length > 0) {
      if (!availableSlots.some(s => s.value === sessionTime)) {
        setSessionTime(availableSlots[0].value);
      }
    } else {
      setSessionTime("");
    }
  }, [availableSlots, sessionTime]);

  const handleClose = () => {
    if (externalOnClose) externalOnClose();
    else setInternalIsOpen(false);
    setTimeout(() => setIsSubmitted(false), 400);
  };

  useEffect(() => {
    const handleOpenEvent = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.serviceSlug) setService(customEvent.detail.serviceSlug);
      if (customEvent.detail?.clinicSlug) {
        const targetClinic = customEvent.detail.clinicSlug;
        setClinic(targetClinic);
        setDate(getNextAvailableDate(targetClinic));
      }
      setInternalIsOpen(true);
      setIsSubmitted(false);
      // Scroll form to top when reopening
      setTimeout(() => scrollRef.current?.scrollTo(0, 0), 50);
    };
    window.addEventListener("openContactModal", handleOpenEvent);
    window.addEventListener("openBookingModal", handleOpenEvent);
    return () => {
      window.removeEventListener("openContactModal", handleOpenEvent);
      window.removeEventListener("openBookingModal", handleOpenEvent);
    };
  }, []);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      if (scrollY) window.scrollTo(0, -parseInt(scrollY || "0"));
    }
    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isDateOpen) return;
    setBookingRef(`NS-${Math.floor(1000 + Math.random() * 9000)}`);
    setIsSubmitted(true);
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getWhatsAppUrl = () =>
    buildWhatsAppUrl({
      name: patientName,
      clinic: CLINIC_NAMES[clinic] || activeConfig.name,
      date,
      time: sessionTime,
      service,
      refCode: bookingRef
    });

  const inputCls = "w-full px-4 rounded-2xl bg-white border border-slate-200 text-[16px] font-medium text-[#122820] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-transparent transition-all";
  const selectCls = "w-full px-4 rounded-2xl bg-white border border-slate-200 text-[16px] font-medium text-[#122820] focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-transparent transition-all appearance-none";
  const labelCls = "block text-[11px] font-bold text-[#2C4238] uppercase tracking-widest mb-2 flex items-center gap-1.5";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* ── Backdrop ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={handleClose}
            className="fixed inset-0 z-[199] bg-black/60 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* ── Bottom Sheet (mobile) / Centered Modal (desktop) ── */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Book Appointment"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 340, mass: 0.9 }}
            style={{
              // Explicit pixel height on mobile so it never overflows the viewport
              maxHeight: "calc(var(--vh, 1vh) * 90)",
            }}
            className={[
              // Positioning: anchored to bottom on all screens, max-width centered on desktop
              "fixed bottom-0 left-0 right-0 z-[200]",
              "sm:relative sm:bottom-auto sm:left-auto sm:right-auto sm:m-auto",
              // Shape: pill bottom-sheet on mobile, rounded card on desktop
              "rounded-t-[24px] sm:rounded-3xl",
              // Sizing
              "w-full sm:max-w-lg sm:max-h-[88vh]",
              // Layout: flex column so header is pinned and body scrolls
              "flex flex-col",
              // Surface
              "bg-[#F7FAF8] font-sans shadow-[0_-8px_40px_rgba(0,0,0,0.18)]",
              // Overflow must be HIDDEN on the container — scroll is on inner div
              "overflow-hidden",
            ].join(" ")}
          >
            {/* ── Drag Handle (mobile only) ── */}
            <div className="flex justify-center pt-2.5 pb-0 shrink-0 sm:hidden">
              <div className="w-10 h-1 rounded-full bg-slate-300/80" />
            </div>

            {/* ── Pinned Header ── */}
            <div className="bg-[#122820] text-white px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between shrink-0 relative overflow-hidden">
              <div className="absolute -top-6 -right-6 w-28 h-28 bg-[#10B981]/20 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center gap-2.5 relative z-10 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-[#10B981]/25 border border-[#10B981]/40 flex items-center justify-center text-[#34D399] shrink-0">
                  <ToothIcon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h2 className="font-display font-bold text-base leading-tight">Book Appointment</h2>
                  <p className="text-[11px] text-emerald-300/90 font-medium truncate">Dr. Nilay Saha • Advanced Dental Studio</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleClose}
                aria-label="Close booking form"
                className="ml-3 w-10 h-10 min-w-[40px] rounded-full bg-white/10 hover:bg-white/20 active:scale-90 text-white flex items-center justify-center transition-all shrink-0 cursor-pointer relative z-10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* ── Scrollable Body ── Only this div scrolls ── */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto overscroll-contain"
              style={{ WebkitOverflowScrolling: "touch" } as React.CSSProperties}
            >
              <div className="px-4 sm:px-6 py-5 space-y-5 pb-safe-bottom" style={{ paddingBottom: "max(24px, env(safe-area-inset-bottom))" }}>

                {!isSubmitted ? (
                  <form onSubmit={handleSubmit} className="space-y-5" noValidate>

                    {/* ── 1. Select Clinic ── */}
                    <div>
                      <label className={labelCls}>
                        <MapPin className="w-3.5 h-3.5 text-[#10B981]" />
                        1. Select Clinic
                      </label>
                      <div className="relative">
                        <select
                          value={clinic}
                          onChange={(e) => handleClinicChange(e.target.value)}
                          className={selectCls + " h-[52px] pr-10"}
                        >
                          <option value={CLINIC_SLUGS.NABADWIP}>Dr. Nilay Saha Dental Care (Nabadwip)</option>
                          <option value={CLINIC_SLUGS.BELERHAT}>Nilay Saha Dental Care (Belerhat)</option>
                        </select>
                        <MapPin className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#10B981]" />
                      </div>
                    </div>

                    {/* ── Clinic Info Card ── */}
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={clinic}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: isChangingClinic ? 0.5 : 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.15 }}
                        className="rounded-2xl bg-teal-50 border border-teal-200/70 p-3 space-y-2"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5 flex-1 min-w-0">
                            <MapPin className="w-3.5 h-3.5 text-[#00A896] shrink-0" />
                            <span className="truncate">{activeConfig.name}</span>
                          </p>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800 shrink-0 whitespace-nowrap">
                            {activeConfig.openDaysText}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 flex items-start gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-[#00A896] shrink-0 mt-[1px]" />
                          {activeConfig.timingsText}
                        </p>
                        <div className="grid grid-cols-2 gap-2 pt-1 border-t border-teal-100">
                          <a
                            href={activeConfig.mapLink}
                            target="_blank"
                            rel="noreferrer"
                            className="h-9 rounded-xl bg-white border border-teal-200 text-[#00A896] font-bold text-[11px] flex items-center justify-center gap-1 transition-colors hover:bg-teal-600 hover:text-white active:scale-95"
                          >
                            <Navigation className="w-3 h-3" />
                            Directions
                          </a>
                          <a
                            href={`tel:${PRIMARY_PHONE_NUMBER}`}
                            className="h-9 rounded-xl bg-white border border-teal-200 text-slate-700 font-bold text-[11px] flex items-center justify-center gap-1 transition-colors hover:text-[#00A896] active:scale-95"
                          >
                            <Phone className="w-3 h-3 text-[#00A896]" />
                            Call Clinic
                          </a>
                        </div>
                      </motion.div>
                    </AnimatePresence>

                    {/* ── 2. Treatment ── */}
                    <div>
                      <label className={labelCls}>
                        <Sparkles className="w-3.5 h-3.5 text-[#10B981]" />
                        2. Treatment Type
                      </label>
                      <div className="relative">
                        <select
                          value={service}
                          onChange={(e) => setService(e.target.value)}
                          className={selectCls + " h-[52px] pr-10"}
                        >
                          <option value="consultation">General Dental Consultation</option>
                          <option value="root-canal">Root Canal Treatment (Single-Visit)</option>
                          <option value="fillings">Tooth-Colored Dental Filling</option>
                          <option value="scaling">Teeth Cleaning & Scaling</option>
                          <option value="wisdom-tooth">Wisdom Tooth Removal</option>
                          <option value="crowns">Dental Crowns & Bridges</option>
                          <option value="smile-design">Smile Designing & Cosmetics</option>
                        </select>
                        <Sparkles className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#10B981]" />
                      </div>
                    </div>

                    {/* ── 3. Date ── */}
                    <div>
                      <label className={labelCls}>
                        <Calendar className="w-3.5 h-3.5 text-[#10B981]" />
                        3. Preferred Date
                      </label>
                      <input
                        type="date"
                        required
                        min={getTodayStr()}
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className={inputCls + " h-[52px] " + (isDateOpen ? "" : "border-rose-300 bg-rose-50/60 focus:ring-rose-400")}
                      />
                      {!isDateOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="mt-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800"
                        >
                          <div className="flex items-start gap-2">
                            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                            <div className="text-xs">
                              <p className="font-bold">Clinic closed on this date</p>
                              <p className="text-rose-700 mt-0.5">Open on: <strong>{activeConfig.openDaysText}</strong></p>
                              <button
                                type="button"
                                onClick={() => setDate(getNextAvailableDate(clinic, date))}
                                className="mt-1.5 text-[11px] font-bold text-rose-900 underline underline-offset-2"
                              >
                                Pick next available date →
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>

                    {/* ── 4. Time Slot ── */}
                    <div>
                      <label className={labelCls}>
                        <Clock className="w-3.5 h-3.5 text-[#10B981]" />
                        4. Time Slot
                      </label>
                      <div className="relative">
                        <select
                          value={sessionTime}
                          onChange={(e) => setSessionTime(e.target.value)}
                          disabled={!isDateOpen || availableSlots.length === 0}
                          className={selectCls + " h-[52px] pr-10 disabled:opacity-50 disabled:cursor-not-allowed"}
                        >
                          {availableSlots.length > 0
                            ? availableSlots.map((slot, i) => (
                                <option key={i} value={slot.value}>{slot.label}</option>
                              ))
                            : <option value="">Clinic closed on selected date</option>
                          }
                        </select>
                        <Clock className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#10B981]" />
                      </div>
                    </div>

                    {/* ── 5. Patient Name ── */}
                    <div>
                      <label className={labelCls}>
                        <User className="w-3.5 h-3.5 text-[#10B981]" />
                        5. Your Name
                      </label>
                      <input
                        type="text"
                        required
                        autoComplete="name"
                        placeholder="Enter your full name"
                        value={patientName}
                        onChange={(e) => setPatientName(e.target.value)}
                        className={inputCls + " h-[52px]"}
                      />
                    </div>

                    {/* ── 6. Phone Number ── */}
                    <div>
                      <label className={labelCls}>
                        <Phone className="w-3.5 h-3.5 text-[#10B981]" />
                        6. Mobile Number
                      </label>
                      <input
                        type="tel"
                        required
                        autoComplete="tel"
                        inputMode="numeric"
                        placeholder="10-digit mobile number"
                        value={patientPhone}
                        onChange={(e) => setPatientPhone(e.target.value)}
                        className={inputCls + " h-[52px]"}
                      />
                    </div>

                    {/* ── Submit ── */}
                    <button
                      type="submit"
                      disabled={!isDateOpen || !sessionTime || !patientName || !patientPhone}
                      className="w-full h-[56px] rounded-2xl bg-[#122820] text-white font-bold text-[15px] flex items-center justify-center gap-2.5 shadow-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#10B981] active:scale-[0.98] transition-all duration-200 cursor-pointer"
                    >
                      <Send className="w-4.5 h-4.5 text-emerald-300" />
                      Confirm Appointment
                    </button>

                  </form>
                ) : (

                  /* ── Success Screen ── */
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center space-y-5 py-4"
                  >
                    <div className="w-20 h-20 rounded-full bg-emerald-100 border-2 border-emerald-300 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                      <CheckCircle2 className="w-11 h-11" />
                    </div>

                    <div className="space-y-2">
                      <span className="inline-block px-4 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold tracking-widest uppercase">
                        Ref: {bookingRef}
                      </span>
                      <h3 className="text-xl font-display font-bold text-[#122820]">
                        Appointment Requested!
                      </h3>
                      <p className="text-sm text-[#4B6358] leading-relaxed max-w-xs mx-auto">
                        Thank you, <span className="font-semibold text-[#122820]">{patientName || "Patient"}</span>. Our receptionist at{" "}
                        <span className="font-bold text-slate-900">{CLINIC_NAMES[clinic]}</span> will call to confirm your slot.
                      </p>
                    </div>

                    <div className="space-y-3 pt-2">
                      <a
                        href={getWhatsAppUrl()}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center gap-2.5 w-full h-[52px] rounded-2xl bg-[#25D366] hover:bg-[#22c55e] text-white font-bold text-[15px] shadow-md active:scale-[0.98] transition-all"
                      >
                        <WhatsAppIcon className="w-5 h-5" />
                        Confirm via WhatsApp
                      </a>
                      <a
                        href={`tel:${PRIMARY_PHONE_NUMBER}`}
                        className="flex items-center justify-center gap-2.5 w-full h-[52px] rounded-2xl bg-white border border-slate-200 text-[#122820] font-bold text-[15px] active:scale-[0.98] transition-all hover:border-teal-300"
                      >
                        <Phone className="w-4.5 h-4.5 text-[#10B981]" />
                        Call Clinic
                      </a>
                      <button
                        type="button"
                        onClick={handleClose}
                        className="w-full py-3 text-sm text-slate-500 hover:text-slate-700 font-medium transition-colors cursor-pointer"
                      >
                        Close
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>

          {/* ── On desktop, center the sheet ── */}
          <style>{`
            @media (min-width: 640px) {
              [aria-label="Book Appointment"] {
                position: fixed !important;
                bottom: auto !important;
                top: 50% !important;
                left: 50% !important;
                transform: translateY(-50%) translateX(-50%) !important;
              }
            }
          `}</style>
        </>
      )}
    </AnimatePresence>
  );
}

export const BookingModal = ContactModal;
