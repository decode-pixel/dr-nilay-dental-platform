import React from "react";
import { motion } from "motion/react";
import { Phone, Mail, MapPin, Clock, CalendarDays } from "lucide-react";
import { WhatsAppIcon } from "./Icons";
import { 
  PRIMARY_PHONE_NUMBER, 
  PRIMARY_PHONE_DISPLAY,
  PRIMARY_WHATSAPP_DIGITS 
} from "../lib/constants";

export default function ContactSection() {
  const contactChannels = [
    {
      icon: Phone,
      title: "Call Clinic",
      value: PRIMARY_PHONE_DISPLAY,
      link: `tel:${PRIMARY_PHONE_NUMBER}`,
      description: "Direct reception line",
      actionText: "Call Now",
      bgClass: "bg-blue-50 border-blue-200 text-[#2563EB]"
    },
    {
      icon: WhatsAppIcon,
      title: "WhatsApp Chat",
      value: "Quick Consultation",
      link: `https://wa.me/${PRIMARY_WHATSAPP_DIGITS}`,
      description: "Reply within 15 minutes",
      actionText: "Message Us",
      bgClass: "bg-emerald-50 border-emerald-200 text-emerald-600"
    },
    {
      icon: Mail,
      title: "Email Inquiry",
      value: "contact@sahadental.com",
      link: "mailto:contact@sahadental.com",
      description: "Support & coordination",
      actionText: "Send Email",
      bgClass: "bg-purple-50 border-purple-200 text-purple-600"
    }
  ];

  const clinicsCoords = [
    {
      name: "Belerhat Center",
      location: "Belerhat, Burdwan, West Bengal",
      hours: "10:00 AM - 1:30 PM, 5:00 PM - 8:30 PM",
      days: "Mon - Sat (Sunday Closed)"
    },
    {
      name: "Parulia Center",
      location: "Parulia (Visiting Clinic), Purba Bardhaman",
      hours: "Visiting schedule updating soon",
      days: "Consultation by pre-booking"
    },
    {
      name: "Nabadwip Center",
      location: "Nabadwip (Visiting Clinic), Nadia",
      hours: "Visiting schedule updating soon",
      days: "Consultation by pre-booking"
    }
  ];

  return (
    <section id="contact-info" className="py-24 sm:py-32 relative z-10 overflow-hidden font-sans bg-[#F8FBFF]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-1 mb-4 text-[#2563EB] text-xs font-semibold uppercase tracking-widest border border-blue-500/20 shadow-sm">
            <CalendarDays className="w-4 h-4" />
            <span>Connect With Us</span>
          </div>
          <h2 className="text-[36px] sm:text-[48px] lg:text-[56px] font-display font-bold text-[#0F172A] tracking-tight leading-[1.12] mb-5">
            We are always here <span className="text-[#2563EB]">to care for your smile.</span>
          </h2>
          <p className="text-[#475569] text-base sm:text-lg leading-[1.65] max-w-xl mx-auto font-normal">
            Reach out via our direct communications or drop by Dr. Nilay Saha's clinic coordinates.
          </p>
        </div>

        {/* Channels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {contactChannels.map((channel, index) => {
            const Icon = channel.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-3 rounded-[2rem] p-8 border border-white/80 shadow-[0_12px_40px_rgba(15,23,42,0.04)] flex flex-col justify-between hover:shadow-[0_16px_48px_rgba(15,23,42,0.06)] hover:-translate-y-0.5 transition-all duration-300"
              >
                <div>
                  <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center mb-6 shrink-0 shadow-sm ${channel.bgClass}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-display font-bold text-[#0F172A] mb-2">{channel.title}</h3>
                  <p className="text-xs text-[#64748B] font-semibold uppercase tracking-wider mb-4">{channel.description}</p>
                  <p className="text-base sm:text-lg font-semibold text-[#0F172A] mb-8">{channel.value}</p>
                </div>
                <a
                  href={channel.link}
                  target={channel.link.startsWith("http") ? "_blank" : undefined}
                  rel={channel.link.startsWith("http") ? "noreferrer" : undefined}
                  className="w-full py-3.5 rounded-xl bg-slate-100 hover:bg-[#2563EB] text-[#0F172A] hover:text-white font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm"
                >
                  <span>{channel.actionText}</span>
                </a>
              </motion.div>
            );
          })}
        </div>

        {/* Location Grid */}
        <div className="glass-3 rounded-[2.5rem] overflow-hidden border border-white/80 shadow-[0_20px_60px_rgba(15,23,42,0.06)] p-8 sm:p-12">
          <h3 className="text-2xl sm:text-3xl font-display font-bold text-[#0F172A] mb-8 pb-4 border-b border-slate-200/60 flex items-center gap-3">
            <MapPin className="w-6 h-6 text-[#2563EB]" />
            <span>Clinic Coordinates & Hours</span>
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {clinicsCoords.map((coord, index) => (
              <div key={index} className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB]" />
                  <h4 className="font-display font-bold text-lg text-[#0F172A]">{coord.name}</h4>
                </div>
                <div className="space-y-2.5 text-sm text-[#475569] font-normal pl-4.5">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-[#64748B] shrink-0 mt-0.5" />
                    <span>{coord.location}</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Clock className="w-4 h-4 text-[#64748B] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-[#0F172A]">{coord.hours}</p>
                      <p className="text-xs text-[#64748B] mt-0.5">{coord.days}</p>
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
