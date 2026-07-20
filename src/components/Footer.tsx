import React, { useState, useEffect } from "react";
import { Phone, MapPin, CalendarDays, Facebook, Instagram, Twitter } from "lucide-react";
import { WhatsAppIcon, ToothIcon } from "./Icons";
import { Link } from "react-router-dom";
import { CmsService } from "../lib/cmsService";
import { SettingsService } from "../lib/settingsService";
import { PRIMARY_PHONE_NUMBER, PRIMARY_WHATSAPP_NUMBER } from "../lib/constants";
import { logger } from "../lib/logger";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const [footerContent, setFooterContent] = useState({
    copyright_text: "© 2026 Dr. Nilay Saha Dental Clinics. All Rights Reserved.",
    terms_link_label: "Terms of Service",
    privacy_link_label: "Privacy Policy"
  });

  const [contactContent, setContactContent] = useState({
    primary_phone: PRIMARY_PHONE_NUMBER,
    whatsapp_number: PRIMARY_WHATSAPP_NUMBER,
    office_email: "contact@sahadental.com"
  });

  const loadData = async () => {
    try {
      const [footer, contact] = await Promise.all([
        CmsService.getPublishedContent("footer"),
        SettingsService.getSettingsGroup("contact")
      ]);
      if (footer && footer.footer_config) {
        setFooterContent((p) => ({ ...p, ...footer.footer_config }));
      }
      if (contact && Object.keys(contact).length > 0) {
        setContactContent((p) => ({ ...p, ...contact }));
      }
    } catch (err) {
      logger.error("Failed to load footer CMS values:", err);
    }
  };

  useEffect(() => {
    loadData();

    const handleCmsUpdate = () => loadData();
    const handleSettingsUpdate = () => loadData();

    window.addEventListener("onCmsUpdate", handleCmsUpdate);
    window.addEventListener("onSettingsUpdate", handleSettingsUpdate);

    return () => {
      window.removeEventListener("onCmsUpdate", handleCmsUpdate);
      window.removeEventListener("onSettingsUpdate", handleSettingsUpdate);
    };
  }, []);

  return (
    <footer className="relative z-10 bg-[#061D15] border-t border-[#10B981]/20 pt-16 sm:pt-20 pb-8 sm:pb-12 overflow-hidden font-sans text-[#F4F7F4]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">
        
        {/* CTA Band */}
        <div className="bg-gradient-to-br from-[#0B2E22] via-[#071F17] to-[#051811] rounded-[2.5rem] p-8 sm:p-12 mb-16 sm:mb-20 border border-[#10B981]/30 shadow-[0_24px_64px_rgba(0,0,0,0.6)] flex flex-col lg:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#10B981] to-transparent pointer-events-none" />
          <div className="max-w-2xl text-center lg:text-left">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#34D399] block mb-2">Next Step</span>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-[#F4F7F4] mb-3 tracking-tight">Ready for your healthiest smile?</h3>
            <p className="text-sm sm:text-base text-[#94B0A3] leading-[1.65]">
              Book an appointment online in under 60 seconds or message us on WhatsApp directly for immediate consultation.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3.5 shrink-0 w-full lg:w-auto">
            <button 
              onClick={() => window.dispatchEvent(new CustomEvent('openContactModal'))}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-gradient-to-r from-[#10B981] to-[#059669] text-white font-semibold text-sm shadow-[0_4px_20px_rgba(16,185,129,0.4)] hover:shadow-[0_6px_30px_rgba(16,185,129,0.6)] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300"
            >
              <CalendarDays className="w-4 h-4 text-emerald-100" />
              <span>Schedule Visit</span>
            </button>
            <a 
              href={`https://wa.me/${contactContent.whatsapp_number.replace(/[^0-9]/g, '')}`} 
              target="_blank" 
              rel="noreferrer" 
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-white/[0.08] text-white font-semibold text-sm hover:bg-white/[0.15] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 border border-white/20 shadow-sm"
            >
              <WhatsAppIcon className="w-4 h-4 text-[#34D399]" />
              <span>WhatsApp Us</span>
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          
          {/* Brand Info */}
          <div className="flex flex-col gap-6">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#10B981]/20 flex items-center justify-center border border-[#10B981]/40 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                <ToothIcon className="w-5 h-5 text-[#34D399]" />
              </div>
              <div>
                <h3 className="text-xl font-display font-bold text-white tracking-tight leading-none mb-1">Dr. Nilay Saha</h3>
                <p className="text-[10px] text-[#34D399] uppercase tracking-widest font-semibold">Dental Studio</p>
              </div>
            </Link>
            <p className="text-sm text-[#94B0A3] leading-[1.65]">
              Modern dental care providing advanced, comfortable, and hygienic treatments for patients of every age.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-5">
            <h4 className="text-base font-display font-semibold text-white tracking-wide">Quick Links</h4>
            <div className="grid grid-cols-2 gap-3.5">
              <Link to="/#home" className="text-sm text-[#94B0A3] hover:text-white transition-colors">Home</Link>
              <Link to="/#about" className="text-sm text-[#94B0A3] hover:text-white transition-colors">About Us</Link>
              <Link to="/#treatments" className="text-sm text-[#94B0A3] hover:text-white transition-colors">Treatments</Link>
              <Link to="/#locations" className="text-sm text-[#94B0A3] hover:text-white transition-colors">Our Clinics</Link>
              <Link to="/#contact" className="text-sm text-[#94B0A3] hover:text-white transition-colors">Contact</Link>
            </div>
          </div>

          {/* Patient Resources */}
          <div className="flex flex-col gap-5">
            <h4 className="text-base font-display font-semibold text-white tracking-wide">Resources</h4>
            <div className="flex flex-col gap-3.5">
              <Link to="/#faq" className="text-sm text-[#94B0A3] hover:text-white transition-colors">FAQ</Link>
              <Link to="/tips" className="text-sm text-[#94B0A3] hover:text-white transition-colors">Dental Tips</Link>
              <a
                href={`tel:${contactContent.primary_phone.replace(/[^0-9+]/g, '')}`}
                className="text-sm text-rose-400 hover:text-rose-300 transition-colors font-semibold flex items-center gap-1.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                <span>Emergency Care</span>
              </a>
              <Link to="/privacy" className="text-sm text-[#94B0A3] hover:text-white transition-colors">{footerContent.privacy_link_label}</Link>
              <Link to="/terms" className="text-sm text-[#94B0A3] hover:text-white transition-colors">{footerContent.terms_link_label}</Link>
            </div>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col gap-5">
            <h4 className="text-base font-display font-semibold text-white tracking-wide">Contact Us</h4>
            <div className="flex flex-col gap-4">
              <a href={`tel:${contactContent.primary_phone.replace(/[^0-9+]/g, '')}`} className="flex items-start gap-3 group">
                <div className="w-8 h-8 rounded-2xl bg-white/[0.06] border border-white/15 flex items-center justify-center shrink-0 group-hover:bg-[#10B981]/25 group-hover:border-[#10B981]/40 transition-colors">
                  <Phone className="w-3.5 h-3.5 text-[#94B0A3] group-hover:text-[#34D399] transition-colors" />
                </div>
                <div className="flex flex-col pt-1.5">
                  <span className="text-sm text-gray-300 group-hover:text-white transition-colors font-medium">{contactContent.primary_phone}</span>
                </div>
              </a>
              <a href={`https://wa.me/${contactContent.whatsapp_number.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="flex items-start gap-3 group">
                <div className="w-8 h-8 rounded-2xl bg-white/[0.06] border border-white/15 flex items-center justify-center shrink-0 group-hover:bg-emerald-500/25 group-hover:border-emerald-500/40 transition-colors">
                  <WhatsAppIcon className="w-4 h-4 text-[#94B0A3] group-hover:text-emerald-400 transition-colors" />
                </div>
                <div className="flex flex-col pt-1.5">
                  <span className="text-sm text-gray-300 group-hover:text-white transition-colors font-medium">WhatsApp Chat</span>
                </div>
              </a>
              <div className="flex items-start gap-3 group cursor-default">
                <div className="w-8 h-8 rounded-2xl bg-white/[0.06] border border-white/15 flex items-center justify-center shrink-0 group-hover:bg-emerald-500/25 group-hover:border-emerald-500/40 transition-colors">
                  <MapPin className="w-3.5 h-3.5 text-[#94B0A3] group-hover:text-[#34D399] transition-colors" />
                </div>
                <div className="flex flex-col pt-1">
                  <span className="text-sm text-gray-300 group-hover:text-white transition-colors font-medium">Belerhat • Parulia • Nabadwip</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Divider */}
        <div className="w-full h-px bg-white/10 mb-8" />

        {/* Copyright */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#94B0A3]">
            {footerContent.copyright_text}
          </p>
          <p className="text-xs text-[#94B0A3] font-medium">
            Healthy Smile, Happy Life
          </p>
        </div>
      </div>
    </footer>
  );
}
