import React, { useState, useEffect } from "react";
import { X, Calendar, Clock, MapPin, User, Phone, CheckCircle2, Sparkles, Send } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { WhatsAppIcon, ToothIcon } from "./Icons";
import { PRIMARY_PHONE_NUMBER, PRIMARY_WHATSAPP_DIGITS, CLINIC_NAMES } from "../lib/constants";

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
  initialClinicSlug = "belerhat"
}: ContactModalProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Form State
  const [clinic, setClinic] = useState(initialClinicSlug);
  const [service, setService] = useState(initialServiceSlug);
  const [date, setDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  });
  const [sessionTime, setSessionTime] = useState("Morning (10:00 AM - 1:30 PM)");
  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [bookingRef, setBookingRef] = useState("");

  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;

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
        setClinic(customEvent.detail.clinicSlug);
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
    const refCode = `NS-${Math.floor(1000 + Math.random() * 9000)}`;
    setBookingRef(refCode);
    setIsSubmitted(true);
  };

  const getWhatsAppUrl = () => {
    const clinicName = CLINIC_NAMES[clinic] || "Belerhat Center";
    const text = `Hello Dr. Nilay Saha Clinic,\n\nI would like to request an appointment:\n• Ref Code: ${bookingRef}\n• Patient: ${patientName || "Patient"}\n• Contact: ${patientPhone || "N/A"}\n• Clinic: ${clinicName}\n• Treatment: ${service}\n• Date: ${date}\n• Time Slot: ${sessionTime}\n\nPlease confirm availability. Thank you!`;
    return `https://wa.me/${PRIMARY_WHATSAPP_DIGITS}?text=${encodeURIComponent(text)}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 overflow-y-auto font-sans">
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
            <div className="bg-[#122820] text-white px-6 py-5 flex items-center justify-between relative overflow-hidden">
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
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors relative z-10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Clinic Select */}
                  <div>
                    <label className="block text-xs font-bold text-[#2C4238] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#10B981]" />
                      Select Clinic Center
                    </label>
                    <select
                      value={clinic}
                      onChange={(e) => setClinic(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#F4F7F4] border border-emerald-900/10 text-sm font-semibold text-[#122820] focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                    >
                      <option value="belerhat">Saha Dental Clinic - Belerhat Center (Flagship)</option>
                      <option value="parulia">Saha Dental Clinic - Parulia Center</option>
                      <option value="nabadwip">Saha Dental Clinic - Nabadwip Center</option>
                    </select>
                  </div>

                  {/* Treatment Select */}
                  <div>
                    <label className="block text-xs font-bold text-[#2C4238] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#10B981]" />
                      Treatment / Consultation
                    </label>
                    <select
                      value={service}
                      onChange={(e) => setService(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#F4F7F4] border border-emerald-900/10 text-sm font-semibold text-[#122820] focus:outline-none focus:ring-2 focus:ring-[#10B981]"
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
                    <div>
                      <label className="block text-xs font-bold text-[#2C4238] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#10B981]" />
                        Preferred Date
                      </label>
                      <input
                        type="date"
                        required
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#F4F7F4] border border-emerald-900/10 text-sm font-semibold text-[#122820] focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#2C4238] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#10B981]" />
                        Session Time
                      </label>
                      <select
                        value={sessionTime}
                        onChange={(e) => setSessionTime(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#F4F7F4] border border-emerald-900/10 text-sm font-semibold text-[#122820] focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                      >
                        <option value="Morning (10:00 AM - 1:30 PM)">Morning: 10:00 AM - 1:30 PM</option>
                        <option value="Evening (5:00 PM - 8:30 PM)">Evening: 5:00 PM - 8:30 PM</option>
                      </select>
                    </div>
                  </div>

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
                    className="w-full mt-2 py-3.5 rounded-2xl bg-[#122820] hover:bg-[#10B981] text-white font-semibold text-sm shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all duration-300 active:scale-[0.99]"
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
                      Thank you <span className="font-semibold text-[#122820]">{patientName || "Patient"}</span>. Our clinic receptionist will contact you shortly to confirm your visit time.
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
