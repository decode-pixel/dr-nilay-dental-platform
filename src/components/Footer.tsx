import React, { useState, useEffect } from "react";
import { Phone, MapPin, CalendarDays, ShieldCheck, Clock, Mail, ChevronRight, Award } from "lucide-react";
import { WhatsAppIcon, ToothIcon } from "./Icons";
import { Link } from "react-router-dom";
import { CmsService } from "../lib/cmsService";
import { SettingsService } from "../lib/settingsService";
import { 
  PRIMARY_PHONE_NUMBER, 
  PRIMARY_PHONE_DISPLAY, 
  PRIMARY_WHATSAPP_NUMBER,
  DOCTOR_REGISTRATION_NUMBER,
  CLINIC_MAP_LINKS,
  buildWhatsAppUrl
} from "../lib/constants";
import { logger } from "../lib/logger";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const [footerContent, setFooterContent] = useState({
    copyright_text: `© ${currentYear} Dr. Nilay Saha Dental Care. All Rights Reserved.`,
    terms_link_label: "Terms of Service",
    privacy_link_label: "Privacy Policy"
  });

  const [contactContent, setContactContent] = useState({
    primary_phone: PRIMARY_PHONE_DISPLAY,
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
        
        {/* Top CTA Banner */}
        <div className="glass-dark-crystal rounded-[2.5rem] p-8 sm:p-12 mb-16 sm:mb-20 border border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.7)] flex flex-col lg:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#10B981] to-transparent pointer-events-none" />
          
          <div className="max-w-2xl text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10B981]/20 border border-[#10B981]/40 text-[#34D399] text-xs font-extrabold uppercase tracking-widest mb-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Priority Clinical Appointments</span>
            </div>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-[#F4F7F4] mb-3 tracking-tight">
              Ready for your healthiest, confident smile?
            </h3>
            <p className="text-sm sm:text-base text-[#94B0A3] leading-[1.65]">
              Schedule your consultation with Dr. Nilay Saha online in under 60 seconds or reach us directly via call or WhatsApp.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3.5 shrink-0 w-full lg:w-auto">
            <button 
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent('openContactModal'))}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-gradient-to-r from-[#10B981] to-[#059669] text-white font-bold text-sm shadow-[0_4px_20px_rgba(16,185,129,0.4)] hover:shadow-[0_6px_30px_rgba(16,185,129,0.6)] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 cursor-pointer"
            >
              <CalendarDays className="w-4.5 h-4.5 text-emerald-100" />
              <span>Schedule Visit</span>
            </button>
            <a 
              href={`tel:${PRIMARY_PHONE_NUMBER}`}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-white/[0.08] text-white font-bold text-sm hover:bg-white/[0.15] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 border border-white/20 shadow-sm"
            >
              <Phone className="w-4 h-4 text-[#34D399]" />
              <span>{PRIMARY_PHONE_DISPLAY}</span>
            </a>
            <a 
              href={buildWhatsAppUrl()}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-emerald-500/15 hover:bg-emerald-500/25 text-[#34D399] font-bold text-sm hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 border border-emerald-500/30 shadow-sm"
            >
              <WhatsAppIcon className="w-4 h-4 text-emerald-400" />
              <span>WhatsApp Us</span>
            </a>
          </div>
        </div>

        {/* Structured 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 mb-16">
          
          {/* Column 1: Brand & Credentials (lg:col-span-4) */}
          <div className="lg:col-span-4 flex flex-col gap-5">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-11 h-11 rounded-2xl bg-[#10B981]/20 flex items-center justify-center border border-[#10B981]/40 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                <ToothIcon className="w-6 h-6 text-[#34D399]" />
              </div>
              <div>
                <h3 className="text-xl font-display font-extrabold text-white tracking-tight leading-none mb-1 group-hover:text-[#34D399] transition-colors">
                  Dr. Nilay Saha
                </h3>
                <p className="text-[10px] text-[#34D399] uppercase tracking-widest font-bold">
                  Advanced Dental Care &amp; Endodontic Center
                </p>
              </div>
            </Link>

            <p className="text-sm text-[#94B0A3] leading-[1.7]">
              Providing precision endodontics, pain-free root canals, and modern digital dentistry with zero-compromise sterilization across West Bengal.
            </p>

            <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                <Award className="w-4 h-4 text-[#34D399]" />
                <span>Verified Clinical Qualifications</span>
              </div>
              <p className="text-xs text-slate-300 font-medium">
                BDS &bull; Fellowship in Endodontics (FIE)
              </p>
              <p className="text-[11px] text-[#94B0A3] font-mono">
                WBDC Reg. No. {DOCTOR_REGISTRATION_NUMBER}
              </p>
            </div>
          </div>

          {/* Column 2: Clinical Centers & Directions (lg:col-span-3) */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <h4 className="text-base font-display font-bold text-white tracking-wide border-b border-white/10 pb-2">
              Our Clinical Studios
            </h4>
            
            <div className="space-y-4 text-xs">
              {/* Nabadwip */}
              <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/10 space-y-1.5">
                <div className="font-bold text-white text-sm">Dr. Nilay Saha Dental Care</div>
                <p className="text-[#94B0A3] leading-relaxed">Bhumi Apartment 2, Oladebitala Bazar, Nabadwip, Nadia, West Bengal</p>
                <div className="text-[11px] text-emerald-400 font-semibold">Days: Mon, Wed, Fri &amp; Sun</div>
                <a
                  href={CLINIC_MAP_LINKS.nabadwip}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-[#34D399] hover:underline pt-1"
                >
                  <span>Get Directions on Google Maps</span>
                  <ChevronRight className="w-3 h-3" />
                </a>
              </div>

              {/* Belerhat */}
              <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/10 space-y-1.5">
                <div className="font-bold text-white text-sm">Nilay Saha Dental Care (Belerhat)</div>
                <p className="text-[#94B0A3] leading-relaxed">Belerhat Main Road, Near Station, Purba Bardhaman</p>
                <div className="text-[11px] text-emerald-400 font-semibold">Days: Mon – Sat (10 AM - 1:30 PM | 5 - 8:30 PM)</div>
                <a
                  href={CLINIC_MAP_LINKS.belerhat}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-[#34D399] hover:underline pt-1"
                >
                  <span>Get Directions on Google Maps</span>
                  <ChevronRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Column 3: Quick Navigation & Services (lg:col-span-2) */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <h4 className="text-base font-display font-bold text-white tracking-wide border-b border-white/10 pb-2">
              Quick Navigation
            </h4>
            <div className="flex flex-col gap-2.5 text-sm">
              <Link to="/#home" className="text-[#94B0A3] hover:text-white transition-colors">Home</Link>
              <Link to="/#about" className="text-[#94B0A3] hover:text-white transition-colors">About Dr. Nilay</Link>
              <Link to="/#treatments" className="text-[#94B0A3] hover:text-white transition-colors">Treatments</Link>
              <Link to="/#locations" className="text-[#94B0A3] hover:text-white transition-colors">Our Clinics</Link>
              <Link to="/#reviews" className="text-[#94B0A3] hover:text-white transition-colors">Patient Reviews</Link>
              <Link to="/#faq" className="text-[#94B0A3] hover:text-white transition-colors">FAQ</Link>
              <Link to="/privacy" className="text-[#94B0A3] hover:text-white transition-colors">{footerContent.privacy_link_label}</Link>
              <Link to="/terms" className="text-[#94B0A3] hover:text-white transition-colors">{footerContent.terms_link_label}</Link>
            </div>
          </div>

          {/* Column 4: Direct Contact & Hotline (lg:col-span-3) */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <h4 className="text-base font-display font-bold text-white tracking-wide border-b border-white/10 pb-2">
              Direct Contact
            </h4>
            <div className="flex flex-col gap-3.5">
              <a href={`tel:${PRIMARY_PHONE_NUMBER}`} className="flex items-start gap-3 group">
                <div className="w-9 h-9 rounded-xl bg-white/[0.06] border border-white/15 flex items-center justify-center shrink-0 group-hover:bg-[#10B981]/25 group-hover:border-[#10B981]/40 transition-colors">
                  <Phone className="w-4 h-4 text-[#34D399]" />
                </div>
                <div className="flex flex-col pt-0.5">
                  <span className="text-[11px] text-[#94B0A3] font-semibold uppercase tracking-wider">Priority Helpline</span>
                  <span className="text-base text-white font-extrabold group-hover:text-[#34D399] transition-colors">{PRIMARY_PHONE_DISPLAY}</span>
                </div>
              </a>

              <a href={buildWhatsAppUrl()} target="_blank" rel="noreferrer" className="flex items-start gap-3 group">
                <div className="w-9 h-9 rounded-xl bg-white/[0.06] border border-white/15 flex items-center justify-center shrink-0 group-hover:bg-emerald-500/25 group-hover:border-emerald-500/40 transition-colors">
                  <WhatsAppIcon className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="flex flex-col pt-0.5">
                  <span className="text-[11px] text-[#94B0A3] font-semibold uppercase tracking-wider">WhatsApp Consultation</span>
                  <span className="text-sm text-gray-200 font-bold group-hover:text-emerald-400 transition-colors">{PRIMARY_PHONE_DISPLAY}</span>
                </div>
              </a>

              <a href="mailto:contact@sahadental.com" className="flex items-start gap-3 group">
                <div className="w-9 h-9 rounded-xl bg-white/[0.06] border border-white/15 flex items-center justify-center shrink-0 group-hover:bg-emerald-500/25 transition-colors">
                  <Mail className="w-4 h-4 text-[#34D399]" />
                </div>
                <div className="flex flex-col pt-0.5">
                  <span className="text-[11px] text-[#94B0A3] font-semibold uppercase tracking-wider">Email Inquiry</span>
                  <span className="text-xs text-gray-200 font-medium group-hover:text-white transition-colors">contact@sahadental.com</span>
                </div>
              </a>
            </div>
          </div>

        </div>

        {/* Divider */}
        <div className="w-full h-px bg-white/10 mb-8" />

        {/* Bottom Bar: Copyright & Compliance */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#94B0A3]">
          <p>
            {footerContent.copyright_text}
          </p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>WBDC Reg. No. {DOCTOR_REGISTRATION_NUMBER}</span>
            <span>&bull;</span>
            <span>Registered Dental Practitioner</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
