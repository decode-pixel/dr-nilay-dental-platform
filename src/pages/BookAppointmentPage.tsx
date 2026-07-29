import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SEO from "../components/SEO";
import { WhatsAppIcon } from "../components/Icons";
import {
  CLINIC_SLUGS,
  CLINIC_SCHEDULES,
  PRIMARY_PHONE_NUMBER,
  PRIMARY_PHONE_DISPLAY,
  buildWhatsAppUrl
} from "../lib/constants";
import { treatmentsData } from "../data/treatments";
import {
  CalendarDays,
  Clock,
  MapPin,
  User,
  Phone,
  CheckCircle2,
  Sparkles,
  Send,
  Navigation,
  ShieldCheck,
  Award
} from "lucide-react";

export default function BookAppointmentPage() {
  const [clinic, setClinic] = useState<string>(CLINIC_SLUGS.NABADWIP);
  const [service, setService] = useState<string>("root-canal");
  const [date, setDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [timeSlot, setTimeSlot] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [phoneNum, setPhoneNum] = useState<string>("");
  const [submitted, setSubmitted] = useState<boolean>(false);

  const activeConfig = CLINIC_SCHEDULES[clinic] || CLINIC_SCHEDULES[CLINIC_SLUGS.NABADWIP];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phoneNum.trim()) return;
    setSubmitted(true);
  };

  const handleWhatsAppDirect = () => {
    const selectedTreatmentObj = treatmentsData.find((t) => t.id === service);
    window.open(
      buildWhatsAppUrl({
        name,
        clinic: activeConfig.name,
        date,
        time: timeSlot || "Flexible",
        service: selectedTreatmentObj?.name || service
      }),
      "_blank"
    );
  };

  return (
    <div className="min-h-screen font-sans bg-[#FAFCFA] text-slate-900 overflow-x-hidden selection:bg-teal-500/30">
      <SEO 
        title="Book Appointment — Dr. Nilay Saha Dental Care" 
        description="Book your dental consultation online with Dr. Nilay Saha (BDS). Select Nabadwip or Belerhat clinic, preferred date & time slot, and get fast confirmation."
      />
      <Navbar />

      <main className="pt-28 pb-16 sm:pt-32 sm:pb-24">
        {/* Editorial Booking Banner */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 sm:mb-16">
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#062920] via-[#0B3D30] to-[#041B15] text-white relative overflow-hidden shadow-2xl border border-teal-500/20">
            <div className="absolute -right-20 -top-20 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-3xl relative z-10 space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-semibold uppercase tracking-wider">
                <CalendarDays className="w-3.5 h-3.5" />
                <span>Instant Consultation Booking</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-display font-extrabold tracking-tight text-white leading-tight">
                Schedule Your Consultation with Dr. Nilay Saha
              </h1>
              <p className="text-base sm:text-lg text-teal-100/90 leading-relaxed font-light">
                Select your preferred clinic location, treatment, and consultation time slot for a seamless, zero-wait clinical experience.
              </p>
            </div>
          </div>
        </section>

        {/* Dedicated Booking Interactive Form Section */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xl relative overflow-hidden">
            {submitted ? (
              <div className="text-center py-12 space-y-6">
                <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900">
                  Appointment Request Submitted!
                </h2>
                <p className="text-slate-600 max-w-md mx-auto text-sm sm:text-base">
                  Thank you, <span className="font-semibold text-slate-900">{name}</span>. Our clinic reception team will call you at <span className="font-semibold text-slate-900">{phoneNum}</span> shortly to confirm your slot at {activeConfig.name}.
                </p>

                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={handleWhatsAppDirect}
                    className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95 cursor-pointer"
                  >
                    <WhatsAppIcon className="w-5 h-5" />
                    <span>Send via WhatsApp for Instant Confirmation</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition-colors cursor-pointer"
                  >
                    Book Another Slot
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Clinic Picker */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-teal-600" />
                      Select Clinic Location *
                    </label>
                    <select
                      value={clinic}
                      onChange={(e) => setClinic(e.target.value)}
                      className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-200 font-medium text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/40"
                    >
                      <option value={CLINIC_SLUGS.NABADWIP}>Dr. Nilay Saha Dental Care (Nabadwip)</option>
                      <option value={CLINIC_SLUGS.BELERHAT}>Nilay Saha Dental Care (Belerhat)</option>
                    </select>
                    <p className="mt-1.5 text-[11px] text-teal-700 font-semibold flex items-center gap-1">
                      <Clock className="w-3 h-3 text-teal-600 shrink-0" />
                      {activeConfig.openDaysText}
                    </p>
                  </div>

                  {/* Treatment Picker */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-teal-600" />
                      Treatment Required *
                    </label>
                    <select
                      value={service}
                      onChange={(e) => setService(e.target.value)}
                      className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-200 font-medium text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/40"
                    >
                      {treatmentsData.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Preferred Date */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
                      <CalendarDays className="w-4 h-4 text-teal-600" />
                      Preferred Date *
                    </label>
                    <input
                      type="date"
                      value={date}
                      min={new Date().toISOString().split("T")[0]}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-200 font-medium text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/40"
                      required
                    />
                  </div>

                  {/* Time Slot */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-teal-600" />
                      Preferred Time Window
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Morning (10 AM) or Evening (5 PM)"
                      value={timeSlot}
                      onChange={(e) => setTimeSlot(e.target.value)}
                      className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-200 font-medium text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/40"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Patient Name */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
                      <User className="w-4 h-4 text-teal-600" />
                      Full Name *
                    </label>
                    <input
                      type="text"
                      placeholder="Enter patient full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-200 font-medium text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/40"
                      required
                    />
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
                      <Phone className="w-4 h-4 text-teal-600" />
                      Mobile Phone Number *
                    </label>
                    <input
                      type="tel"
                      placeholder="10-digit mobile number"
                      value={phoneNum}
                      onChange={(e) => setPhoneNum(e.target.value)}
                      className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-200 font-medium text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/40"
                      required
                    />
                  </div>
                </div>

                {/* Submit Action Buttons */}
                <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
                  <button
                    type="submit"
                    className="w-full sm:flex-1 h-13 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-teal-600/20 active:scale-95 transition-all cursor-pointer"
                  >
                    <Send className="w-5 h-5" />
                    <span>Confirm Consultation Request</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleWhatsAppDirect}
                    className="w-full sm:w-auto h-13 px-6 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-base flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all cursor-pointer"
                  >
                    <WhatsAppIcon className="w-5 h-5" />
                    <span>Book via WhatsApp</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>
      </main>

      <Footer />

      {/* Floating WhatsApp FAB */}
      <a
        href={buildWhatsAppUrl()}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-[90] flex items-center justify-center w-14 h-14 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full shadow-[0_0_20px_rgba(37,211,102,0.4)] hover:shadow-[0_0_30px_rgba(37,211,102,0.6)] hover:-translate-y-1 active:scale-95 transition-all duration-200"
        aria-label="Contact via WhatsApp"
      >
        <WhatsAppIcon className="w-8 h-8" />
      </a>
    </div>
  );
}
