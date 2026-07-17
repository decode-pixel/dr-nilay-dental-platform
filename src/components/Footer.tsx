import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Facebook, Instagram, Twitter, Phone, Mail, MapPin } from "lucide-react";
import { WhatsAppIcon, ToothIcon } from "./Icons";
import { Link } from "react-router-dom";
import { CmsService } from "../lib/cmsService";
import { SettingsService } from "../lib/settingsService";
import { logger } from "../lib/logger";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const [footerContent, setFooterContent] = useState({
    copyright_text: "© 2026 Dr. Nilay Saha Dental Clinics. All Rights Reserved.",
    terms_link_label: "Terms of Service",
    privacy_link_label: "Privacy Policy"
  });

  const [contactContent, setContactContent] = useState({
    primary_phone: "+919609180979",
    whatsapp_number: "+919609180979",
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
    <footer className="relative z-10 bg-transparent backdrop-blur-3xl border-t border-white/10 pt-16 pb-8 overflow-hidden font-sans">
      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-600/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Info */}
          <div className="flex flex-col gap-6">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-blue-500/20 flex items-center justify-center border border-white/10 shadow-[0_0_15px_rgba(139,92,246,0.15)]">
                <ToothIcon className="w-5 h-5 text-violet-400" />
              </div>
              <div>
                <h3 className="text-xl font-heading font-bold text-white tracking-tight leading-none mb-1">Dr. Nilay Saha</h3>
                <p className="text-[10px] text-violet-400 uppercase tracking-widest font-medium">Dental Clinic</p>
              </div>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Modern dental care providing advanced, comfortable, and hygienic treatments for patients of every age.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 hover:-translate-y-1 transition-all duration-300">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 hover:-translate-y-1 transition-all duration-300">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 hover:-translate-y-1 transition-all duration-300">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-6">
            <h4 className="text-lg font-heading font-semibold text-white">Quick Links</h4>
            <div className="grid grid-cols-2 gap-3">
              <Link to="/#home" className="text-sm text-gray-400 hover:text-violet-300 transition-colors">Home</Link>
              <Link to="/#about" className="text-sm text-gray-400 hover:text-violet-300 transition-colors">About Us</Link>
              <Link to="/#treatments" className="text-sm text-gray-400 hover:text-violet-300 transition-colors">Treatments</Link>
              <Link to="/#locations" className="text-sm text-gray-400 hover:text-violet-300 transition-colors">Our Clinics</Link>
              <Link to="/#gallery" className="text-sm text-gray-400 hover:text-violet-300 transition-colors">Gallery</Link>
              <Link to="/#testimonials" className="text-sm text-gray-400 hover:text-violet-300 transition-colors">Testimonials</Link>
              <Link to="/#contact" className="text-sm text-gray-400 hover:text-violet-300 transition-colors">Contact</Link>
            </div>
          </div>

          {/* Patient Resources */}
          <div className="flex flex-col gap-6">
            <h4 className="text-lg font-heading font-semibold text-white">Resources</h4>
            <div className="flex flex-col gap-3">
              <a href="#" className="text-sm text-gray-400 hover:text-violet-300 transition-colors">FAQ</a>
              <a href="#" className="text-sm text-gray-400 hover:text-violet-300 transition-colors">Dental Tips</a>
              <a href="#" className="text-sm text-rose-400 hover:text-rose-300 transition-colors font-medium">Emergency Care</a>
              <a href="#" className="text-sm text-gray-400 hover:text-violet-300 transition-colors">{footerContent.privacy_link_label}</a>
              <a href="#" className="text-sm text-gray-400 hover:text-violet-300 transition-colors">{footerContent.terms_link_label}</a>
            </div>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col gap-6">
            <h4 className="text-lg font-heading font-semibold text-white">Contact Us</h4>
            <div className="flex flex-col gap-4">
              <a href={`tel:${contactContent.primary_phone.replace(/[^0-9+]/g, '')}`} className="flex items-start gap-3 group">
                <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-violet-500/20 group-hover:border-violet-500/30 transition-colors">
                  <Phone className="w-3.5 h-3.5 text-gray-400 group-hover:text-violet-300 transition-colors" />
                </div>
                <div className="flex flex-col pt-1.5">
                  <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{contactContent.primary_phone}</span>
                </div>
              </a>
              <a href={`https://wa.me/${contactContent.whatsapp_number.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="flex items-start gap-3 group">
                <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-green-500/20 group-hover:border-green-500/30 transition-colors">
                  <WhatsAppIcon className="w-4 h-4 text-gray-400 group-hover:text-green-400 transition-colors" />
                </div>
                <div className="flex flex-col pt-1.5">
                  <span className="text-sm text-gray-300 group-hover:text-white transition-colors">WhatsApp Chat</span>
                </div>
              </a>
              <div className="flex items-start gap-3 group cursor-default">
                <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-blue-500/20 group-hover:border-blue-500/30 transition-colors">
                  <MapPin className="w-3.5 h-3.5 text-gray-400 group-hover:text-blue-300 transition-colors" />
                </div>
                <div className="flex flex-col pt-1">
                  <span className="text-sm text-gray-300 group-hover:text-white transition-colors">Belerhat • Parulia • Nabadwip</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8"></div>

        {/* Copyright */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            {footerContent.copyright_text}
          </p>
          <p className="text-xs text-gray-600">
            Healthy Smile, Happy Life
          </p>
        </div>
      </div>
    </footer>
  );
}
