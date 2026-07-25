import React, { useState, useEffect, useMemo } from "react";
import { X, Calendar, Clock, MapPin, User, Phone, CheckCircle2, Sparkles, Send, Navigation, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { WhatsAppIcon, ToothIcon } from "./Icons";
import { 
  PRIMARY_PHONE_NUMBER, 
  PRIMARY_WHATSAPP_DIGITS, 
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
  
  // Helper: Today's date string YYYY-MM-DD
  const getTodayStr = () => {
    const d = new Date();
    return d.toISOString().split("T")[0];
  };

  // Helper: Next available open date for a clinic
  const getNextAvailableDate = (clinicSlug: string, startFromDateStr?: string): string => {
    const config = CLINIC_SCHEDULES[clinicSlug] || CLINIC_SCHEDULES[CLINIC_SLUGS.BELERHAT];
    const curr = startFromDateStr ? new Date(startFromDateStr + "T00:00:00") : new Date();
    
    // Check up to 14 days ahead
    for (let i = 0; i < 14; i++) {
      const dayOfWeek = curr.getDay();
      if (config.openDays.includes(dayOfWeek)) {
        return curr.toISOString().split("T")[0];
      }
      curr.setDate(curr.getDate() + 1);
    }
    return startFromDateStr || getTodayStr();
  };

  // Form State
  const [clinic, setClinic] = useState(initialClinicSlug);
  const [service, setService] = useState(initialServiceSlug);
  const [date, setDate] = useState(() => getNextAvailableDate(initialClinicSlug));
  const [sessionTime, setSessionTime] = useState("");
  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [bookingRef, setBookingRef] = useState("");

  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;

  // Active Schedule Config for selected clinic
  const activeConfig = useMemo(() => {
    return CLINIC_SCHEDULES[clinic] || CLINIC_SCHEDULES[CLINIC_SLUGS.BELERHAT];
  }, [clinic]);

  // Selected date day-of-week
  const selectedDayOfWeek = useMemo(() => {
    if (!date) return 1;
    const d = new Date(date + "T00:00:00");
    return d.getDay();
  }, [date]);

  // Check if selected date is open
  const isDateOpen = useMemo(() => {
    return activeConfig.openDays.includes(selectedDayOfWeek);
  }, [activeConfig, selectedDayOfWeek]);

  // Available slots for selected date
  const availableSlots = useMemo(() => {
    if (!isDateOpen) return [];
    return activeConfig.slotsByDay[selectedDayOfWeek] || [];
  }, [activeConfig, selectedDayOfWeek, isDateOpen]);

  // Sync date & sessionTime when clinic changes
  const handleClinicChange = (newClinicSlug: string) => {
    setIsChangingClinic(true);
    setClinic(newClinicSlug);

    // Auto-adjust date if current date is invalid for new clinic
    const validDate = getNextAvailableDate(newClinicSlug, date);
    setDate(validDate);

    setTimeout(() => {
      setIsChangingClinic(false);
    }, 200);
  };

  // Auto-set sessionTime whenever availableSlots change
  useEffect(() => {
    if (availableSlots.length > 0) {
      const exists = availableSlots.some(s => s.value === sessionTime);
      if (!exists) {
        setSessionTime(availableSlots[0].value);
      }
    } else {
      setSessionTime("");
    }
  }, [availableSlots, sessionTime]);

  const handleClose = () => {
    if (externalOnClose) {
      externalOnClose();
    } else {
      setInternalIsOpen(false);
    }
    setTimeout(() => {
      setIsSubmitted(false);
    }, 300);
  };

  useEffect(() => {
    const handleOpenEvent = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.serviceSlug) {
        setService(customEvent.detail.serviceSlug);
      }
      if (customEvent.detail?.clinicSlug) {
        const targetClinic = customEvent.detail.clinicSlug;
        setClinic(targetClinic);
        setDate(getNextAvailableDate(targetClinic));
      }
      setInternalIsOpen(true);
      setIsSubmitted(false);
    };

    window.addEventListener("openContactModal", handleOpenEvent);
    window.addEventListener("openBookingModal", handleOpenEvent);
    return () => {
      window.removeEventListener("openContactModal", handleOpenEvent);
      window.removeEventListener("openBookingModal", handleOpenEvent);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isDateOpen) return;
    const refCode = `NS-${Math.floor(1000 + Math.random() * 9000)}`;
    setBookingRef(refCode);
    setIsSubmitted(true);
  };

  const getWhatsAppUrl = () => {
    const clinicName = CLINIC_NAMES[clinic] || activeConfig.name;
    return buildWhatsAppUrl({
      name: patientName,
      clinic: clinicName,
      date,
      time: sessionTime,
      service,
      refCode: bookingRef
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-6 overflow-y-auto font-sans">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-[#071F17]/80 backdrop-blur-md"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="relative w-full max-w-lg bg-[#FAFDFB] border border-emerald-900/10 rounded-3xl shadow-2xl overflow-hidden z-10 text-[#122820]"
          >
            {/* Header */}
            <div className="bg-[#122820] text-white px-6 py-4.5 flex items-center justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#10B981]/15 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex items-center gap-3 relative z-10">
                <div className="w-10 h-10 rounded-xl bg-[#10B981]/20 border border-[#10B981]/40 flex items-center justify-center text-[#34D399]">
                  <ToothIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg leading-tight">Book Appointment</h3>
                  <p className="text-xs text-emerald-300 font-medium mt-0.5">Dr. Nilay Saha • Advanced Dental Studio</p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleClose}
                aria-label="Close modal"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors relative z-10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 max-h-[85vh] overflow-y-auto">
              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Step 1: Select Clinic Center */}
                  <div>
                    <label className="block text-xs font-bold text-[#2C4238] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#10B981]" />
                      1. Select Clinic Center
                    </label>
                    <select
                      value={clinic}
                      onChange={(e) => handleClinicChange(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#F4F7F4] border border-emerald-900/15 text-sm font-bold text-[#122820] focus:outline-none focus:ring-2 focus:ring-[#10B981] transition-all"
                    >
                      <option value={CLINIC_SLUGS.NABADWIP}>Dr. Nilay Saha Dental Care (Nabadwip)</option>
                      <option value={CLINIC_SLUGS.BELERHAT}>Nilay Saha Dental Care (Belerhat)</option>
                    </select>
                  </div>

                  {/* BONUS DYNAMIC CLINIC INFO CARD */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={clinic}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: isChangingClinic ? 0.4 : 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.18 }}
                      className="p-3.5 rounded-2xl bg-teal-50/80 border border-teal-200/80 space-y-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#00A896] shrink-0" />
                          <span className="truncate">{activeConfig.name}</span>
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#00A896]/10 text-[#00A896] shrink-0">
                          {activeConfig.openDaysText}
                        </span>
                      </div>

                      <div className="flex items-start gap-1.5 text-[11px] text-slate-600 font-medium">
                        <Clock className="w-3.5 h-3.5 text-[#00A896] shrink-0 mt-0.5" />
                        <span>{activeConfig.timingsText}</span>
                      </div>

                      <div className="flex items-center gap-2 pt-1 border-t border-teal-100/80">
                        <a
                          href={activeConfig.mapLink}
                          target="_blank"
                          rel="noreferrer"
                          className="flex-1 py-1.5 px-3 rounded-lg bg-white border border-teal-200 text-[#00A896] hover:bg-[#00A896] hover:text-white font-bold text-[11px] flex items-center justify-center gap-1 transition-colors shadow-2xs"
                        >
                          <Navigation className="w-3 h-3" />
                          <span>View Location</span>
                        </a>
                        <a
                          href={`tel:${PRIMARY_PHONE_NUMBER}`}
                          className="flex-1 py-1.5 px-3 rounded-lg bg-white border border-teal-200 text-slate-700 hover:text-[#00A896] font-bold text-[11px] flex items-center justify-center gap-1 transition-colors shadow-2xs"
                        >
                          <Phone className="w-3 h-3 text-[#00A896]" />
                          <span>Call Clinic</span>
                        </a>
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  {/* Treatment Select */}
                  <div>
                    <label className="block text-xs font-bold text-[#2C4238] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#10B981]" />
                      2. Treatment / Consultation
                    </label>
                    <select
                      value={service}
                      onChange={(e) => setService(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#F4F7F4] border border-emerald-900/10 text-sm font-semibold text-[#122820] focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                    >
                      <option value="root-canal">Root Canal Treatment (Single-Visit)</option>
                      <option value="consultation">General Dental Consultation</option>
                      <option value="fillings">Tooth-Colored Dental Filling</option>
                      <option value="scaling">Teeth Cleaning & Scaling</option>
                      <option value="wisdom-tooth">Wisdom Tooth Removal</option>
                      <option value="crowns">Dental Crowns & Bridges</option>
                      <option value="smile-design">Smile Designing & Cosmetics</option>
                    </select>
                  </div>

                  {/* Date & Time Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Step 3: Preferred Date */}
                    <div>
                      <label className="block text-xs font-bold text-[#2C4238] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#10B981]" />
                        3. Preferred Date
                      </label>
                      <input
                        type="date"
                        required
                        min={getTodayStr()}
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className={`w-full px-3.5 py-2.5 rounded-xl bg-[#F4F7F4] border text-sm font-semibold focus:outline-none focus:ring-2 ${
                          isDateOpen
                            ? "border-emerald-900/10 text-[#122820] focus:ring-[#10B981]"
                            : "border-rose-300 bg-rose-50/50 text-rose-900 focus:ring-rose-400"
                        }`}
                      />
                    </div>

                    {/* Step 4: Session Time */}
                    <div>
                      <label className="block text-xs font-bold text-[#2C4238] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#10B981]" />
                        4. Available Time Slot
                      </label>
                      <select
                        value={sessionTime}
                        onChange={(e) => setSessionTime(e.target.value)}
                        disabled={!isDateOpen || availableSlots.length === 0}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4F7F4] border border-emerald-900/10 text-sm font-semibold text-[#122820] focus:outline-none focus:ring-2 focus:ring-[#10B981] disabled:opacity-60"
                      >
                        {availableSlots.length > 0 ? (
                          availableSlots.map((slot, idx) => (
                            <option key={idx} value={slot.value}>
                              {slot.label}
                            </option>
                          ))
                        ) : (
                          <option value="">Clinic Closed on Selected Date</option>
                        )}
                      </select>
                    </div>
                  </div>

                  {/* Validation Feedback Warning */}
                  {!isDateOpen && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold">Clinic Closed on Selected Date</p>
                        <p className="text-[11px] text-rose-700 mt-0.5">
                          {activeConfig.name} is open on <strong>{activeConfig.openDaysText}</strong>. Please pick an open date.
                        </p>
                        <button
                          type="button"
                          onClick={() => setDate(getNextAvailableDate(clinic, date))}
                          className="mt-1.5 text-[11px] font-bold text-rose-900 underline hover:text-rose-950"
                        >
                          Auto-select next open date
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Patient Name & Phone Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#2C4238] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-[#10B981]" />
                        Patient Name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Enter full name"
                        value={patientName}
                        onChange={(e) => setPatientName(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#F4F7F4] border border-emerald-900/10 text-sm font-medium text-[#122820] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#2C4238] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-[#10B981]" />
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="10-digit mobile no."
                        value={patientPhone}
                        onChange={(e) => setPatientPhone(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#F4F7F4] border border-emerald-900/10 text-sm font-medium text-[#122820] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={!isDateOpen || !sessionTime}
                    className="w-full mt-2 py-3.5 rounded-2xl bg-[#122820] hover:bg-[#10B981] disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold text-sm shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all duration-300 active:scale-[0.99] cursor-pointer"
                  >
                    <Send className="w-4 h-4 text-emerald-300" />
                    <span>Confirm Appointment Request</span>
                  </button>
                </form>
              ) : (
                /* Success Confirmation Display View */
                <div className="text-center py-4 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-300 text-[#10B981] flex items-center justify-center mx-auto shadow-sm">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>

                  <div>
                    <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
                      Request Reference: {bookingRef}
                    </span>
                    <h4 className="text-xl font-display font-bold text-[#122820]">
                      Appointment Requested Successfully!
                    </h4>
                    <p className="text-xs text-[#4B6358] mt-1 max-w-sm mx-auto">
                      Thank you <span className="font-semibold text-[#122820]">{patientName || "Patient"}</span>. Our receptionist at <span className="font-bold text-slate-900">{CLINIC_NAMES[clinic]}</span> will contact you to confirm your visit time.
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 space-y-2.5">
                    <a
                      href={getWhatsAppUrl()}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
                    >
                      <WhatsAppIcon className="w-5 h-5 text-white" />
                      <span>Instant Confirmation via WhatsApp</span>
                    </a>

                    <a
                      href={`tel:${PRIMARY_PHONE_NUMBER}`}
                      className="w-full py-3 rounded-xl bg-[#F4F7F4] hover:bg-emerald-50 border border-emerald-900/10 text-[#122820] font-semibold text-sm flex items-center justify-center gap-2 transition-all"
                    >
                      <Phone className="w-4 h-4 text-[#10B981]" />
                      <span>Call Clinic Directly ({PRIMARY_PHONE_NUMBER})</span>
                    </a>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export const BookingModal = ContactModal;
