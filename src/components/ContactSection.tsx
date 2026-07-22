import React from "react";
import { Phone, Mail, MapPin, Clock, CalendarDays, ChevronRight } from "lucide-react";
import { WhatsAppIcon } from "./Icons";
import { 
  PRIMARY_PHONE_NUMBER, 
  PRIMARY_PHONE_DISPLAY,
  PRIMARY_WHATSAPP_DIGITS 
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
      bgClass: "bg-sky-50 border-sky-200 text-[#0284C7]"
    },
    {
      icon: WhatsAppIcon,
      title: "WhatsApp Consultation",
      value: "Quick Digital Chat",
      link: `https://wa.me/${PRIMARY_WHATSAPP_DIGITS}`,
      description: "Typically reply within 15 mins",
      actionText: "Message Us",
      bgClass: "bg-emerald-50 border-emerald-200 text-emerald-600"
    },
    {
      icon: Mail,
      title: "Email Coordination",
      value: "contact@sahadental.com",
      link: "mailto:contact@sahadental.com",
      description: "Clinical records & support",
      actionText: "Send Email",
      bgClass: "bg-sky-50 border-sky-200 text-[#0284C7]"
    }
  ];

  const clinicsCoords = [
    {
      name: "Belerhat Main Center",
      location: "Belerhat, Purba Bardhaman, West Bengal",
      hours: "10:00 AM – 1:30 PM | 5:00 PM – 8:30 PM",
      days: "Mon – Sat (Sunday Closed)"
    },
    {
      name: "Parulia Regional Clinic",
      location: "Parulia (Visiting Consultation), Purba Bardhaman",
      hours: "Visiting hours by appointment",
      days: "Pre-booked clinical consultations"
    },
    {
      name: "Nabadwip Studio",
      location: "Nabadwip (Visiting Clinic), Nadia",
      hours: "Visiting hours by appointment",
      days: "Pre-booked clinical consultations"
    }
  ];

  return (
    <section id="contact" className="py-20 sm:py-28 bg-white font-sans border-b border-slate-200/60 scroll-mt-24">
      {/* Anchor alias for dual compatibility */}
      <span id="contact-info" className="sr-only" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-18">
          <TagPill icon={CalendarDays} text="Connect With Us" />
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-[#0F172A] tracking-tight mt-3 mb-4 leading-tight">
            We Are Always Here <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0284C7] to-[#0EA5E9]">
              To Care For Your Smile
            </span>
          </h2>
          <p className="text-base sm:text-lg text-[#475569] leading-relaxed max-w-xl mx-auto font-normal">
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
                className="p-7 sm:p-8 bg-white flex flex-col justify-between group rounded-[20px] border border-slate-200/90 shadow-[0_10px_30px_rgba(15,23,42,0.04)] hover:shadow-[0_20px_50px_rgba(2,132,199,0.12)] hover:border-sky-300 transition-all duration-300"
              >
                <div>
                  <div className={`w-13 h-13 rounded-2xl border flex items-center justify-center mb-6 shrink-0 shadow-2xs group-hover:bg-[#0284C7] group-hover:text-white transition-colors duration-300 ${channel.bgClass}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-display font-extrabold text-[#0F172A] mb-1.5">{channel.title}</h3>
                  <p className="text-xs text-[#475569] font-bold uppercase tracking-wider mb-4">{channel.description}</p>
                  <p className="text-base sm:text-lg font-extrabold text-[#0F172A] mb-8">{channel.value}</p>
                </div>

                <a
                  href={channel.link}
                  target={channel.link.startsWith("http") ? "_blank" : undefined}
                  rel={channel.link.startsWith("http") ? "noreferrer" : undefined}
                  className="w-full py-3.5 rounded-full bg-slate-100 border border-slate-200 group-hover:bg-[#0284C7] group-hover:border-[#0284C7] text-[#0F172A] group-hover:text-white font-bold text-sm transition-all duration-200 flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <span>{channel.actionText}</span>
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            );
          })}
        </div>

        {/* Coordinates Grid Box */}
        <div className="p-8 sm:p-12 bg-gradient-to-br from-sky-50/50 via-white to-white rounded-[20px] border border-slate-200/90 shadow-[0_15px_40px_rgba(2,132,199,0.06)]">
          <h3 className="text-xl sm:text-2xl font-display font-extrabold text-[#0F172A] mb-8 pb-5 border-b border-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-[#0284C7] shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <span>Regional Clinic Coordinates &amp; Hours</span>
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {clinicsCoords.map((coord, index) => (
              <div key={index} className="space-y-4">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#0284C7]" />
                  <h4 className="font-display font-extrabold text-lg text-[#0F172A]">{coord.name}</h4>
                </div>
                <div className="space-y-3 text-sm text-[#475569] font-normal pl-5">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-[#0284C7] shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{coord.location}</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Clock className="w-4 h-4 text-[#0284C7] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-[#0F172A]">{coord.hours}</p>
                      <p className="text-xs text-[#475569] mt-0.5">{coord.days}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
