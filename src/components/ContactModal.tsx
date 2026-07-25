import React, { useState, useEffect, useMemo, useRef } from "react";
import { X, Calendar, Clock, MapPin, User, Phone, CheckCircle2, Sparkles, Send, Navigation, AlertCircle, ChevronDown } from "lucide-react";
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
  const [showClinicDetails, setShowClinicDetails] = useState(false);
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
    setTimeout(() => {
      setIsSubmitted(false);
      setShowClinicDetails(false);
    }, 400);
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
      setShowClinicDetails(false);
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

  /* ── Compact styling tokens ── */
  const inputH = "h-11"; // 44px — compact but still touch-friendly
  const inputCls = `w-full px-3 rounded-xl bg-white border border-slate-200/80 text-[16px] font-medium text-[#122820] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#10B981]/60 focus:border-transparent transition-all ${inputH}`;
  const selectCls = `w-full px-3 rounded-xl bg-white border border-slate-200/80 text-[16px] font-medium text-[#122820] focus:outline-none focus:ring-2 focus:ring-[#10B981]/60 focus:border-transparent transition-all appearance-none ${inputH}`;
  const labelCls = "flex items-center gap-1 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* ── Backdrop ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleClose}
            className="fixed inset-0 z-[199] bg-black/50 backdrop-blur-[6px]"
            aria-hidden="true"
          />

          {/* ── Floating Card ── */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Book Appointment"
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 30 }}
            transition={{ type: "spring", damping: 26, stiffness: 320, mass: 0.8 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="pointer-events-auto w-full max-w-[400px] rounded-[20px] bg-[#FAFCFA] shadow-[0_12px_48px_rgba(0,0,0,0.22),0_0_0_1px_rgba(0,0,0,0.04)] flex flex-col overflow-hidden"
              style={{ maxHeight: "calc(var(--vh, 1vh) * 82)" }}
            >

              {/* ── Compact Header ── */}
              <div className="bg-[#122820] text-white px-4 py-2.5 flex items-center justify-between shrink-0 relative overflow-hidden">
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-[#10B981]/20 rounded-full blur-2xl pointer-events-none" />
                <div className="flex items-center gap-2 relative z-10 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-[#10B981]/25 border border-[#10B981]/40 flex items-center justify-center text-[#34D399] shrink-0">
                    <ToothIcon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="font-display font-bold text-sm leading-tight">Book Appointment</h2>
                    <p className="text-[10px] text-emerald-300/80 font-medium truncate">Dr. Nilay Saha</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleClose}
                  aria-label="Close booking form"
                  className="ml-2 w-8 h-8 min-w-[32px] rounded-full bg-white/10 hover:bg-white/20 active:scale-90 text-white flex items-center justify-center transition-all shrink-0 cursor-pointer relative z-10"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* ── Scrollable Body ── */}
              <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto overscroll-contain"
                style={{ WebkitOverflowScrolling: "touch" } as React.CSSProperties}
              >
                <div className="px-3.5 py-3.5 space-y-3" style={{ paddingBottom: "max(16px, env(safe-area-inset-bottom))" }}>

                  {!isSubmitted ? (
                    <form onSubmit={handleSubmit} className="space-y-3" noValidate>

                      {/* ── 1. Select Clinic ── */}
                      <div>
                        <label className={labelCls}>
                          <MapPin className="w-3 h-3 text-[#10B981]" />
                          Clinic
                        </label>
                        <div className="relative">
                          <select
                            value={clinic}
                            onChange={(e) => handleClinicChange(e.target.value)}
                            className={selectCls + " pr-8 text-[14px]"}
                          >
                            <option value={CLINIC_SLUGS.NABADWIP}>Dr. Nilay Saha Dental Care (Nabadwip)</option>
                            <option value={CLINIC_SLUGS.BELERHAT}>Nilay Saha Dental Care (Belerhat)</option>
                          </select>
                          <MapPin className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#10B981]/60" />
                        </div>
                      </div>

                      {/* ── Clinic Info Toggle ── */}
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={clinic}
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: isChangingClinic ? 0.5 : 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          transition={{ duration: 0.12 }}
                        >
                          <button
                            type="button"
                            onClick={() => setShowClinicDetails(!showClinicDetails)}
                            className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-teal-50/70 border border-teal-200/50 cursor-pointer"
                          >
                            <span className="text-[11px] font-semibold text-teal-800 flex items-center gap-1">
                              <Clock className="w-3 h-3 text-teal-600" />
                              {activeConfig.openDaysText}
                            </span>
                            <ChevronDown className={`w-3 h-3 text-teal-600 transition-transform ${showClinicDetails ? "rotate-180" : ""}`} />
                          </button>
                          <AnimatePresence>
                            {showClinicDetails && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.15 }}
                                className="overflow-hidden"
                              >
                                <div className="mt-1.5 p-2.5 rounded-xl bg-teal-50 border border-teal-200/60 space-y-1.5">
                                  <p className="text-[10px] text-slate-600 flex items-center gap-1">
                                    <Clock className="w-3 h-3 text-teal-600 shrink-0" />
                                    {activeConfig.timingsText}
                                  </p>
                                  <div className="grid grid-cols-2 gap-1.5">
                                    <a href={activeConfig.mapLink} target="_blank" rel="noreferrer" className="h-7 rounded-lg bg-white border border-teal-200/80 text-teal-700 font-bold text-[10px] flex items-center justify-center gap-1 active:scale-95 transition-transform">
                                      <Navigation className="w-2.5 h-2.5" /> Directions
                                    </a>
                                    <a href={`tel:${PRIMARY_PHONE_NUMBER}`} className="h-7 rounded-lg bg-white border border-teal-200/80 text-slate-700 font-bold text-[10px] flex items-center justify-center gap-1 active:scale-95 transition-transform">
                                      <Phone className="w-2.5 h-2.5 text-teal-600" /> Call
                                    </a>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      </AnimatePresence>

                      {/* ── 2. Treatment ── */}
                      <div>
                        <label className={labelCls}>
                          <Sparkles className="w-3 h-3 text-[#10B981]" />
                          Treatment
                        </label>
                        <div className="relative">
                          <select
                            value={service}
                            onChange={(e) => setService(e.target.value)}
                            className={selectCls + " pr-8 text-[14px]"}
                          >
                            <option value="consultation">General Consultation</option>
                            <option value="root-canal">Root Canal (Single-Visit)</option>
                            <option value="fillings">Tooth-Colored Filling</option>
                            <option value="scaling">Teeth Cleaning & Scaling</option>
                            <option value="wisdom-tooth">Wisdom Tooth Removal</option>
                            <option value="crowns">Crowns & Bridges</option>
                            <option value="smile-design">Smile Designing</option>
                          </select>
                          <Sparkles className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#10B981]/60" />
                        </div>
                      </div>

                      {/* ── 3 & 4. Date + Time (side-by-side) ── */}
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className={labelCls}>
                            <Calendar className="w-3 h-3 text-[#10B981]" />
                            Date
                          </label>
                          <input
                            type="date"
                            required
                            min={getTodayStr()}
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className={inputCls + " text-[13px] " + (!isDateOpen ? "border-rose-300 bg-rose-50/50" : "")}
                          />
                        </div>
                        <div>
                          <label className={labelCls}>
                            <Clock className="w-3 h-3 text-[#10B981]" />
                            Time
                          </label>
                          <div className="relative">
                            <select
                              value={sessionTime}
                              onChange={(e) => setSessionTime(e.target.value)}
                              disabled={!isDateOpen || availableSlots.length === 0}
                              className={selectCls + " pr-7 text-[13px] disabled:opacity-40"}
                            >
                              {availableSlots.length > 0
                                ? availableSlots.map((slot, i) => (
                                    <option key={i} value={slot.value}>{slot.label}</option>
                                  ))
                                : <option value="">Closed</option>
                              }
                            </select>
                            <Clock className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-[#10B981]/50" />
                          </div>
                        </div>
                      </div>

                      {/* Closed warning (compact inline) */}
                      {!isDateOpen && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg bg-rose-50 border border-rose-200">
                          <AlertCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                          <p className="text-[11px] text-rose-800">
                            Closed · Open <strong>{activeConfig.openDaysText}</strong>
                            <button type="button" onClick={() => setDate(getNextAvailableDate(clinic, date))} className="ml-1 font-bold underline text-rose-900">Fix →</button>
                          </p>
                        </motion.div>
                      )}

                      {/* ── 5 & 6. Name + Phone (side-by-side) ── */}
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className={labelCls}>
                            <User className="w-3 h-3 text-[#10B981]" />
                            Name
                          </label>
                          <input
                            type="text"
                            required
                            autoComplete="name"
                            placeholder="Full name"
                            value={patientName}
                            onChange={(e) => setPatientName(e.target.value)}
                            className={inputCls + " text-[14px]"}
                          />
                        </div>
                        <div>
                          <label className={labelCls}>
                            <Phone className="w-3 h-3 text-[#10B981]" />
                            Phone
                          </label>
                          <input
                            type="tel"
                            required
                            autoComplete="tel"
                            inputMode="numeric"
                            placeholder="Mobile no."
                            value={patientPhone}
                            onChange={(e) => setPatientPhone(e.target.value)}
                            className={inputCls + " text-[14px]"}
                          />
                        </div>
                      </div>

                      {/* ── Submit ── */}
                      <button
                        type="submit"
                        disabled={!isDateOpen || !sessionTime || !patientName || !patientPhone}
                        className="w-full h-12 rounded-xl bg-[#122820] text-white font-bold text-[14px] flex items-center justify-center gap-2 shadow-md disabled:opacity-35 disabled:cursor-not-allowed hover:bg-[#10B981] active:scale-[0.97] transition-all duration-200 cursor-pointer"
                      >
                        <Send className="w-4 h-4 text-emerald-300" />
                        Confirm Appointment
                      </button>

                    </form>
                  ) : (

                    /* ── Success Screen ── */
                    <motion.div
                      initial={{ opacity: 0, scale: 0.94 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center space-y-4 py-3"
                    >
                      <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-300 text-emerald-600 flex items-center justify-center mx-auto">
                        <CheckCircle2 className="w-9 h-9" />
                      </div>

                      <div className="space-y-1.5">
                        <span className="inline-block px-3 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold tracking-widest uppercase">
                          Ref: {bookingRef}
                        </span>
                        <h3 className="text-lg font-display font-bold text-[#122820]">
                          Appointment Requested!
                        </h3>
                        <p className="text-xs text-[#4B6358] leading-relaxed max-w-[260px] mx-auto">
                          Thank you, <span className="font-semibold text-[#122820]">{patientName || "Patient"}</span>. Our team at{" "}
                          <span className="font-bold text-slate-900">{CLINIC_NAMES[clinic]}</span> will confirm your slot.
                        </p>
                      </div>

                      <div className="space-y-2 pt-1">
                        <a
                          href={getWhatsAppUrl()}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-center gap-2 w-full h-11 rounded-xl bg-[#25D366] hover:bg-[#22c55e] text-white font-bold text-[14px] shadow-sm active:scale-[0.97] transition-all"
                        >
                          <WhatsAppIcon className="w-4.5 h-4.5" />
                          Confirm via WhatsApp
                        </a>
                        <a
                          href={`tel:${PRIMARY_PHONE_NUMBER}`}
                          className="flex items-center justify-center gap-2 w-full h-11 rounded-xl bg-white border border-slate-200 text-[#122820] font-bold text-[14px] active:scale-[0.97] transition-all"
                        >
                          <Phone className="w-4 h-4 text-[#10B981]" />
                          Call Clinic
                        </a>
                        <button
                          type="button"
                          onClick={handleClose}
                          className="w-full py-2 text-xs text-slate-500 hover:text-slate-700 font-medium cursor-pointer"
                        >
                          Close
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export const BookingModal = ContactModal;
