import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Award,
  ShieldCheck,
  GraduationCap,
  Sparkles,
  MapPin,
  Calendar,
  CheckCircle2,
  BadgeCheck,
  HeartPulse,
  UserCheck,
  Clock,
  History
} from 'lucide-react';
import { DoctorService, Doctor, DoctorProfileItem } from '../lib/doctorService';
import { CmsService } from '../lib/cmsService';
import { logger } from '../lib/logger';
import OptimizedImage from './OptimizedImage';

export default function MeetDrNilaySaha() {
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [qualifications, setQualifications] = useState<DoctorProfileItem[]>([]);
  const [awards, setAwards] = useState<DoctorProfileItem[]>([]);
  const [certifications, setCertifications] = useState<DoctorProfileItem[]>([]);
  const [languages, setLanguages] = useState<string[]>(['English', 'Bengali', 'Hindi']);
  const [specializations, setSpecializations] = useState<string[]>([]);
  const [aboutConfig, setAboutConfig] = useState<{ title?: string; description?: string }>({});
  const [activeTab, setActiveTab] = useState<'qualifications' | 'specializations' | 'awards' | 'memberships' | 'journey'>('qualifications');

  const loadDoctorProfile = async () => {
    try {
      const [doctorsList, aboutData, langCatalog, specCatalog] = await Promise.all([
        DoctorService.getDoctors(),
        CmsService.getPublishedContent('about'),
        DoctorService.getLanguageCatalog(),
        DoctorService.getSpecializationCatalog()
      ]);

      const primaryDoc = doctorsList.find((d) => d.name.toLowerCase().includes('nilay')) || doctorsList[0] || {
        id: 'dr-nilay-saha-primary',
        name: 'Dr. Nilay Saha',
        designation: 'Dental Surgeon & Oral Physician',
        qualification: 'BDS, FIE',
        registration_number: 'WBDC Registration No. 4858-A',
        experience_years: 10,
        bio: 'Dr. Nilay Saha is a distinguished Dental Surgeon and Oral Physician with over a decade of clinical excellence in endodontics, oral surgery, and advanced cosmetic diagnostics. Dedicated to gentle, patient-centered care and the highest international sterilization standards.',
        profile_image: '/dr-nilay-saha.jpg',
        is_active: true,
        status: 'Available'
      } as Doctor;

      setDoctor(primaryDoc);

      if (aboutData && aboutData.about_config) {
        setAboutConfig(aboutData.about_config);
      }

      const [quals, awds, certs, docLangs, docSpecs] = await Promise.all([
        DoctorService.getDoctorQualifications(primaryDoc.id),
        DoctorService.getDoctorAwards(primaryDoc.id),
        DoctorService.getDoctorCertifications(primaryDoc.id),
        DoctorService.getDoctorLanguages(primaryDoc.id),
        DoctorService.getDoctorSpecializations(primaryDoc.id)
      ]);

      setQualifications(
        quals.length > 0
          ? quals
          : [
              { title: 'Bachelor of Dental Surgery (BDS)', institution: 'West Bengal University of Health Sciences' },
              { title: 'Fellow of Institution of Engineers (FIE)', institution: 'Fellowship in Dental Engineering & Clinical Innovation' },
              { title: 'Advanced Endodontic Residency', institution: 'Certified Root Canal & Micro-Endodontic Specialist' }
            ]
      );

      setAwards(
        awds.length > 0
          ? awds
          : [
              { title: 'Clinical Excellence Award', institution: 'West Bengal Dental Association' },
              { title: 'Best Patient-Centered Dental Practice', institution: 'Healthcare Innovation Forum' }
            ]
      );

      setCertifications(
        certs.length > 0
          ? certs
          : [
              { title: 'Registered Medical Practitioner (Dental)', institution: 'West Bengal Dental Council (Reg. No. 4858-A)' },
              { title: 'Life Member', institution: 'Indian Dental Association (IDA)' },
              { title: 'Fellow Member', institution: 'Institution of Engineers India' }
            ]
      );

      if (docLangs.length > 0 && langCatalog.length > 0) {
        const names = docLangs
          .map((id) => langCatalog.find((l) => l.id === id)?.name)
          .filter(Boolean) as string[];
        if (names.length > 0) setLanguages(names);
      }

      if (docSpecs.length > 0 && specCatalog.length > 0) {
        const names = docSpecs
          .map((id) => specCatalog.find((s) => s.id === id)?.name)
          .filter(Boolean) as string[];
        if (names.length > 0) setSpecializations(names);
      } else {
        setSpecializations([
          'Single-Visit Painless Root Canal Therapy',
          'Aesthetic & Full Mouth Restorations',
          'Surgical Wisdom Tooth Extractions',
          'Preventive Pediatric & Family Dentistry',
          'Smile Designing & Digital Ceramics'
        ]);
      }
    } catch (error) {
      logger.error('Failed to load doctor profile data:', error);
      setDoctor({
        id: 'dr-nilay-saha-primary',
        name: 'Dr. Nilay Saha',
        designation: 'Dental Surgeon & Oral Physician',
        qualification: 'BDS, FIE',
        registration_number: 'WBDC Registration No. 4858-A',
        experience_years: 10,
        bio: 'Dr. Nilay Saha is a leading Dental Surgeon and Oral Physician with over a decade of clinical excellence in endodontics, oral surgery, and advanced cosmetic diagnostics.',
        profile_image: '/dr-nilay-saha.jpg',
        is_active: true,
        status: 'Available'
      } as Doctor);
      setLanguages(['English', 'Bengali', 'Hindi']);
      setSpecializations([
        'Single-Visit Painless Root Canal Therapy',
        'Aesthetic & Full Mouth Restorations',
        'Surgical Wisdom Tooth Extractions',
        'Preventive Pediatric & Family Dentistry'
      ]);
    }
  };

  useEffect(() => {
    loadDoctorProfile();
  }, []);

  if (!doctor) return null;

  return (
    <section className="py-24 sm:py-32 relative z-20 font-sans" id="doctor-profile">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-24">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-1 mb-4 text-[#2563EB] text-xs font-semibold uppercase tracking-widest border border-blue-500/20 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>Principal Surgeon & Founder</span>
          </div>
          <h2 className="text-[36px] sm:text-[48px] lg:text-[56px] font-display font-bold text-[#0F172A] tracking-tight leading-[1.12]">
            Meet <span className="text-[#2563EB]">Dr. Nilay Saha</span>
          </h2>
          <p className="mt-4 text-[#475569] text-base sm:text-lg max-w-2xl mx-auto font-normal leading-[1.65]">
            Combining state-of-the-art clinical technology with compassionate, evidence-based dental care across Purba Bardhaman and Nadia.
          </p>
        </div>

        {/* Main Grid: Centerpiece Portrait Showcase + Dynamic Credentials */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Centerpiece Portrait & Trust Visual Hierarchy (~5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center">
            
            {/* Portrait Frame */}
            <div className="relative w-full max-w-md mx-auto group">
              <div className="relative overflow-hidden rounded-[2.5rem] border border-slate-300/80 bg-slate-900 shadow-[0_24px_64px_rgba(15,23,42,0.15)]">
                {/* Top Highlight Bar */}
                <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-transparent via-[#2563EB] to-transparent z-20" />

                <div className="relative aspect-[3.8/4.8] sm:aspect-[4/5] w-full overflow-hidden">
                  <OptimizedImage
                    src={doctor.profile_image || "/DNS_Portrait_DrNilay_HalfBody_4x5_202607.webp"}
                    fallbackSrc="/dr-nilay-saha.jpg"
                    alt={doctor.name}
                    priority={true}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-70 pointer-events-none" />
                </div>

                {/* Floating Experience Badge */}
                <div className="absolute top-6 right-6 z-20 glass-3 rounded-2xl px-4 py-2.5 flex items-center gap-2 border border-white/90 shadow-lg bg-white/95">
                  <Award className="w-4 h-4 text-[#2563EB] shrink-0" />
                  <span className="text-xs font-bold text-[#0F172A] tracking-wide">
                    {doctor.experience_years || 10}+ Years Exp.
                  </span>
                </div>

                {/* Verified Registration Pill */}
                <div className="absolute bottom-6 inset-x-6 z-20 p-4.5 rounded-2xl glass-3 border border-white/90 shadow-xl bg-white/95">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-[#2563EB] font-bold block">
                        Official Registration
                      </span>
                      <p className="text-xs sm:text-sm font-mono font-bold text-[#0F172A] mt-0.5">
                        {doctor.registration_number || 'WBDC Reg. No. 4858-A'}
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0 shadow-sm">
                      <BadgeCheck className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Trust Flow Card */}
            <div className="mt-8 w-full max-w-md glass-2 rounded-3xl p-6 sm:p-8 border border-white/80 shadow-md text-center space-y-5">
              <div className="flex items-center justify-center gap-2 text-[#2563EB] text-xs font-bold uppercase tracking-widest">
                <ShieldCheck className="w-4 h-4" />
                <span>Verified Clinical Authority</span>
              </div>

              <div className="space-y-3.5 py-4 border-y border-slate-200/70 text-sm">
                <div>
                  <span className="text-xs text-[#64748B] uppercase tracking-wider font-semibold">Surgeon Name</span>
                  <p className="font-display font-bold text-[#0F172A] text-lg mt-0.5">{doctor.name}</p>
                </div>

                <div>
                  <span className="text-xs text-[#64748B] uppercase tracking-wider font-semibold">Qualification & Designation</span>
                  <p className="font-semibold text-[#2563EB] mt-0.5">
                    {doctor.qualification || 'BDS, FIE'} • {doctor.designation || 'Dental Surgeon & Oral Physician'}
                  </p>
                </div>

                <div>
                  <span className="text-xs text-[#64748B] uppercase tracking-wider font-semibold">Clinical Experience</span>
                  <p className="font-medium text-[#475569] mt-0.5">Over {doctor.experience_years || 10} Years of Precision Practice</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent('openContactModal'))}
                className="w-full py-4 px-6 rounded-full bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] text-white font-semibold text-sm shadow-[0_4px_16px_rgba(37,99,235,0.3)] hover:shadow-[0_6px_24px_rgba(37,99,235,0.5)] transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Appointment With Dr. Nilay Saha</span>
              </button>
            </div>

          </div>

          {/* Right Column: Dynamic CMS Content & Biography (~7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-8">
            
            {/* Bio Box */}
            <div className="glass-2 rounded-3xl p-8 sm:p-10 border border-white/80 shadow-md">
              <div className="flex items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#2563EB] border border-blue-200 flex items-center justify-center shrink-0 shadow-sm">
                    <UserCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-xl sm:text-2xl text-[#0F172A]">Clinical Biography & Philosophy</h3>
                    <span className="text-xs text-[#64748B] font-medium">Mission, Vision & Patient Promise</span>
                  </div>
                </div>
                <div className="hidden sm:flex flex-col items-end opacity-90">
                  <span className="font-serif italic text-lg text-[#2563EB] tracking-wider">Dr. Nilay Saha</span>
                  <span className="text-[10px] text-[#64748B] uppercase tracking-widest font-mono font-semibold">Principal Surgeon</span>
                </div>
              </div>

              <p className="text-[#475569] text-base sm:text-lg leading-[1.65] font-normal whitespace-pre-line">
                {aboutConfig.description || doctor.bio || `Dr. Nilay Saha is a leading Dental Surgeon and Oral Physician dedicated to providing painless, highly precise dental treatments. With over a decade of hands-on experience across multiple clinical centers in West Bengal, he specializes in single-visit root canal treatments, aesthetic restorations, and complex surgical procedures.\n\nHis clinical approach emphasizes conservative dentistry—saving natural teeth wherever possible—while utilizing international sterilization standards and modern diagnostics to ensure optimum patient safety and comfort.`}
              </p>

              {/* Quick Info Pills */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-8 pt-8 border-t border-slate-200/70">
                <div className="bg-white/80 border border-slate-200/80 rounded-2xl p-4 shadow-sm">
                  <span className="text-xs text-[#64748B] font-semibold block mb-1">Registration</span>
                  <strong className="text-xs sm:text-sm text-[#0F172A] font-mono">{doctor.registration_number || '4858-A'}</strong>
                </div>
                <div className="bg-white/80 border border-slate-200/80 rounded-2xl p-4 shadow-sm">
                  <span className="text-xs text-[#64748B] font-semibold block mb-1">Languages</span>
                  <strong className="text-xs sm:text-sm text-[#0F172A]">{languages.join(', ')}</strong>
                </div>
                <div className="bg-white/80 border border-slate-200/80 rounded-2xl p-4 shadow-sm">
                  <span className="text-xs text-[#64748B] font-semibold block mb-1">Active Centers</span>
                  <strong className="text-xs sm:text-sm text-[#2563EB]">3 Clinic Locations</strong>
                </div>
              </div>
            </div>

            {/* Interactive Tabs */}
            <div className="glass-2 rounded-3xl p-8 sm:p-10 border border-white/80 shadow-md">
              <div className="flex flex-wrap gap-2 sm:gap-2.5 border-b border-slate-200/70 pb-6 mb-8">
                <button
                  type="button"
                  onClick={() => setActiveTab('qualifications')}
                  className={`px-4.5 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
                    activeTab === 'qualifications'
                      ? 'bg-[#2563EB] text-white shadow-[0_4px_14px_rgba(37,99,235,0.3)]'
                      : 'bg-slate-100/80 text-[#475569] hover:text-[#0F172A] hover:bg-slate-200/70'
                  }`}
                >
                  <GraduationCap className="w-4 h-4" />
                  Qualifications
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('specializations')}
                  className={`px-4.5 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
                    activeTab === 'specializations'
                      ? 'bg-[#2563EB] text-white shadow-[0_4px_14px_rgba(37,99,235,0.3)]'
                      : 'bg-slate-100/80 text-[#475569] hover:text-[#0F172A] hover:bg-slate-200/70'
                  }`}
                >
                  <HeartPulse className="w-4 h-4" />
                  Specializations
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('awards')}
                  className={`px-4.5 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
                    activeTab === 'awards'
                      ? 'bg-[#2563EB] text-white shadow-[0_4px_14px_rgba(37,99,235,0.3)]'
                      : 'bg-slate-100/80 text-[#475569] hover:text-[#0F172A] hover:bg-slate-200/70'
                  }`}
                >
                  <Award className="w-4 h-4" />
                  Awards
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('memberships')}
                  className={`px-4.5 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
                    activeTab === 'memberships'
                      ? 'bg-[#2563EB] text-white shadow-[0_4px_14px_rgba(37,99,235,0.3)]'
                      : 'bg-slate-100/80 text-[#475569] hover:text-[#0F172A] hover:bg-slate-200/70'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  Memberships
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('journey')}
                  className={`px-4.5 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
                    activeTab === 'journey'
                      ? 'bg-[#2563EB] text-white shadow-[0_4px_14px_rgba(37,99,235,0.3)]'
                      : 'bg-slate-100/80 text-[#475569] hover:text-[#0F172A] hover:bg-slate-200/70'
                  }`}
                >
                  <History className="w-4 h-4" />
                  Clinical Journey
                </button>
              </div>

              {/* Tab Content */}
              <div className="space-y-4">
                {activeTab === 'qualifications' && (
                  <div className="space-y-3.5">
                    {qualifications.map((item, idx) => (
                      <div key={idx} className="flex items-start justify-between gap-4 p-5 rounded-2xl bg-white/80 border border-slate-200/80 shadow-sm">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2563EB] border border-blue-200 flex items-center justify-center shrink-0 mt-0.5">
                            <GraduationCap className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-bold text-[#0F172A] text-base">{item.title}</h4>
                            <p className="text-xs font-semibold text-[#2563EB] mt-1">{item.institution}</p>
                            {item.description && <p className="text-sm text-[#475569] mt-1.5 leading-relaxed">{item.description}</p>}
                          </div>
                        </div>
                        {item.issue_date && (
                          <span className="text-[11px] text-[#64748B] font-mono font-semibold bg-slate-100 px-3 py-1 rounded-lg shrink-0 border border-slate-200">
                            {item.issue_date}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'specializations' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {specializations.map((spec, idx) => (
                      <div key={idx} className="flex items-center gap-3.5 p-4.5 rounded-2xl bg-white/80 border border-slate-200/80 shadow-sm">
                        <CheckCircle2 className="w-5 h-5 text-[#2563EB] shrink-0" />
                        <span className="text-sm font-semibold text-[#0F172A]">{spec}</span>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'awards' && (
                  <div className="space-y-3.5">
                    {awards.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-4 p-5 rounded-2xl bg-white/80 border border-slate-200/80 shadow-sm">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center shrink-0 mt-0.5">
                          <Award className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-[#0F172A] text-base">{item.title}</h4>
                          <p className="text-xs font-semibold text-amber-700 mt-1">{item.institution}</p>
                          {item.description && <p className="text-sm text-[#475569] mt-1.5 leading-relaxed">{item.description}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'memberships' && (
                  <div className="space-y-3.5">
                    {certifications.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-4 p-5 rounded-2xl bg-white/80 border border-slate-200/80 shadow-sm">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shrink-0 mt-0.5">
                          <ShieldCheck className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-[#0F172A] text-base">{item.title}</h4>
                          <p className="text-xs font-semibold text-emerald-700 mt-1">{item.institution}</p>
                          {item.description && <p className="text-sm text-[#475569] mt-1.5 leading-relaxed">{item.description}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'journey' && (
                  <div className="space-y-4 pt-2">
                    <div className="flex items-start gap-4 p-5 rounded-2xl bg-white/80 border border-slate-200/80 shadow-sm">
                      <div className="w-3 h-3 rounded-full bg-[#2563EB] mt-1.5 shrink-0" />
                      <div>
                        <span className="text-xs font-mono text-[#2563EB] font-bold">2014 - Present</span>
                        <h4 className="font-bold text-[#0F172A] text-base mt-1">Principal Surgeon & Clinical Director</h4>
                        <p className="text-sm text-[#475569] mt-1.5 leading-relaxed">Founded and expanded regional clinical centers across Belerhat, Parulia, and Nabadwip with zero-compromise sterilization protocols.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-5 rounded-2xl bg-white/80 border border-slate-200/80 shadow-sm">
                      <div className="w-3 h-3 rounded-full bg-sky-500 mt-1.5 shrink-0" />
                      <div>
                        <span className="text-xs font-mono text-sky-600 font-bold">Clinical Residency</span>
                        <h4 className="font-bold text-[#0F172A] text-base mt-1">Fellowship & Advanced Endodontic Training</h4>
                        <p className="text-sm text-[#475569] mt-1.5 leading-relaxed">Specialized in micro-endodontics, rotary instrumentation, and single-visit painless root canal therapy.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Clinics Footer Banner inside About Section */}
            <div className="glass-3 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 border border-blue-200/80 shadow-md">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#2563EB] shrink-0 shadow-sm">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-[#0F172A] text-lg">Practicing at Belerhat • Parulia • Nabadwip</h4>
                  <p className="text-sm text-[#475569] mt-0.5">Direct personal consultations across all 3 regional dental centers.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  const elem = document.getElementById('clinics') || document.getElementById('locations');
                  if (elem) elem.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 py-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider transition-all shrink-0 shadow-sm"
              >
                View Clinic Schedules
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
