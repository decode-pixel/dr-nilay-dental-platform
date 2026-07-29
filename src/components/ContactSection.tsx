import React from "react";
import { Phone, Mail, MapPin, Clock, CalendarDays, ChevronRight } from "lucide-react";
import { WhatsAppIcon } from "./Icons";
import { 
  PRIMARY_PHONE_NUMBER, 
  PRIMARY_PHONE_DISPLAY,
  PRIMARY_WHATSAPP_DIGITS,
  CLINIC_MAP_LINKS,
  buildWhatsAppUrl
} from "../lib/constants";
import TagPill from "./TagPill";

export default function ContactSection() {
  const contactChannels = [
    {
      icon: Phone,
      title: "Call Clinic Reception",
      value: PRIMARY_PHONE_DISPLAY,
      link: `tel:${PRIMARY_PHONE_NUMBER}`,
      description: "Direct priority phone line",
      actionText: "Call Now",
      bgClass: "bg-teal-50 border-teal-100 text-[#00A896]"
    },
    {
      icon: WhatsAppIcon,
      title: "WhatsApp Consultation",
      value: "Quick Digital Chat",
      link: buildWhatsAppUrl(),
      description: "Typically reply within 15 mins",
      actionText: "Message Us",
      bgClass: "bg-emerald-50 border-emerald-100 text-emerald-600"
    },
    {
      icon: Mail,
      title: "Email Coordination",
      value: "contact@sahadental.com",
      link: "mailto:contact@sahadental.com",
      description: "Clinical records & support",
      actionText: "Send Email",
      bgClass: "bg-teal-50 border-teal-100 text-[#00A896]"
    }
  ];

  const clinicsCoords = [
    {
      name: "Dr. Nilay Saha Dental Care",
      location: "Bhumi Apartment 2, Oladebitala Bazar, Nabadwip, Nadia, West Bengal",
      hours: "Mon, Wed, Fri & Sun",
      mapLink: CLINIC_MAP_LINKS.nabadwip
    },
    {
      name: "Nilay Saha Dental Care (Belerhat)",
      location: "Belerhat Main Road, Near Station, Purba Bardhaman",
      hours: "Mon – Sat (10:00 AM – 1:30 PM | 5:00 PM – 8:30 PM)",
      mapLink: CLINIC_MAP_LINKS.belerhat
    }
  ];

  return (
    <section id="contact" className="py-20 sm:py-28 bg-[#F5F9F8] font-sans border-b border-teal-100/50 scroll-mt-24">
      {/* Anchor alias for dual compatibility */}
      <span id="contact-info" className="sr-only" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-18">
          <TagPill icon={CalendarDays} text="Connect With Us" />
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-[#0F172A] tracking-tight mt-3 mb-4 leading-tight">
            We Are Always Here <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00A896] via-[#028090] to-[#059669]">
              To Care For Your Smile
            </span>
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl mx-auto font-normal">
            Reach out via our direct communication channels or visit Dr. Nilay Saha's clinical studios across West Bengal.
          </p>
        </div>

        {/* 3-Column Channels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-7 mb-14 sm:mb-16">
          {contactChannels.map((channel, index) => {
            const Icon = channel.icon;
            return (
              <div
                key={index}
                className="p-7 sm:p-8 bg-white/80 backdrop-blur-2xl flex flex-col justify-between group rounded-[28px] border border-white/90 shadow-[0_10px_35px_rgba(15,23,42,0.04)] hover:shadow-[0_20px_50px_rgba(0,168,150,0.12)] transition-all duration-300"
              >
                <div>
                  <div className={`w-13 h-13 rounded-2xl border flex items-center justify-center mb-6 shrink-0 shadow-xs group-hover:bg-[#00A896] group-hover:text-white transition-colors duration-300 ${channel.bgClass}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-display font-extrabold text-slate-900 mb-1.5">{channel.title}</h3>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-4">{channel.description}</p>
                  <p className="text-base sm:text-lg font-extrabold text-slate-900 mb-8">{channel.value}</p>
                </div>

                <a
                  href={channel.link}
                  target={channel.link.startsWith("http") ? "_blank" : undefined}
                  rel={channel.link.startsWith("http") ? "noreferrer" : undefined}
                  className="w-full py-3.5 rounded-full btn-crystal text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm active:scale-98 transition-transform cursor-pointer"
                >
                  <span>{channel.actionText}</span>
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            );
          })}
        </div>

        {/* 2 Regional Clinics Contact Grid */}
        <div className="p-8 sm:p-10 rounded-[32px] bg-white/80 backdrop-blur-2xl border border-white/90 shadow-[0_15px_45px_rgba(15,23,42,0.05)]">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-extrabold tracking-widest text-[#00A896] uppercase block mb-1">Clinic Locations</span>
            <h3 className="text-2xl font-display font-extrabold text-slate-900">Visiting Hours &amp; Locations</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {clinicsCoords.map((c, i) => (
              <div key={i} className="p-5 rounded-2xl bg-teal-50/50 border border-teal-100/70 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-[#00A896] shrink-0" />
                    <h4 className="font-display font-extrabold text-slate-900 text-sm sm:text-base leading-tight">{c.name}</h4>
                  </div>
                  <p className="text-xs text-slate-600 mb-3 font-normal leading-relaxed">{c.location}</p>
                </div>
                <div className="pt-3 border-t border-teal-100 flex items-center justify-between gap-2 text-xs font-semibold text-slate-700">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <Clock className="w-3.5 h-3.5 text-[#00A896] shrink-0" />
                    <span className="truncate">{c.hours}</span>
                  </div>
                  <a
                    href={c.mapLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white border border-teal-200/80 text-[#00A896] hover:bg-[#00A896] hover:text-white transition-colors text-[11px] font-bold shrink-0 shadow-2xs"
                  >
                    <span>Get Directions</span>
                    <ChevronRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent("openContactModal"))}
              className="btn-crystal px-8 py-4 rounded-full text-white font-bold text-sm shadow-md cursor-pointer inline-flex items-center gap-2"
            >
              <CalendarDays className="w-4 h-4 text-emerald-100" />
              <span>Book Appointment At Any Location</span>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
