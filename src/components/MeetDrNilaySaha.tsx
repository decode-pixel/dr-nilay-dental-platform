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
  BookOpen,
  Languages,
  BadgeCheck,
  HeartPulse,
  UserCheck
} from 'lucide-react';
import { DoctorService, Doctor, DoctorProfileItem, Language, Specialization } from '../lib/doctorService';
import { CmsService } from '../lib/cmsService';
import { logger } from '../lib/logger';

export default function MeetDrNilaySaha() {
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [qualifications, setQualifications] = useState<DoctorProfileItem[]>([]);
  const [awards, setAwards] = useState<DoctorProfileItem[]>([]);
  const [certifications, setCertifications] = useState<DoctorProfileItem[]>([]);
  const [languages, setLanguages] = useState<string[]>(['English', 'Bengali', 'Hindi']);
  const [specializations, setSpecializations] = useState<string[]>([]);
  const [aboutConfig, setAboutConfig] = useState<{ title?: string; description?: string }>({});
  const [activeTab, setActiveTab] = useState<'qualifications' | 'specializations' | 'awards' | 'memberships'>('qualifications');

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
          'Single-Visit Root Canal Treatment',
          'Painless Tooth Extractions & Oral Surgery',
          'Cosmetic Smile Design & Veneers',
          'Orthodontic Alignment & Aligners',
          'Pediatric & Preventive Dental Care',
          'Periodontal Therapy & Gum Health'
        ]);
      }
    } catch (err) {
      logger.error('Error loading Meet Dr Nilay Saha section:', err);
    }
  };

  useEffect(() => {
    loadDoctorProfile();
    window.addEventListener('onCmsUpdate', loadDoctorProfile);
    return () => window.removeEventListener('onCmsUpdate', loadDoctorProfile);
  }, []);

  if (!doctor) return null;

  return (
    <section className="py-24 relative z-20 overflow-hidden" id="doctor-profile">
      {/* Subtle Background Glows */}
      <div className="absolute top-1/3 -left-48 w-96 h-96 bg-violet-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 -right-48 w-96 h-96 bg-blue-600/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 backdrop-blur-md mb-4 text-violet-300 text-xs font-semibold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Principal Surgeon & Founder</span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-extrabold text-white tracking-tight">
            Meet <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-300 to-blue-400">Dr. Nilay Saha</span>
          </h2>
          <p className="mt-4 text-gray-400 text-base sm:text-lg max-w-2xl mx-auto font-light leading-relaxed">
            Combining state-of-the-art clinical technology with compassionate, evidence-based dental care across Purba Bardhaman and Nadia.
          </p>
        </div>

        {/* Main Grid: Centerpiece Portrait Showcase + Dynamic CMS Credentials */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Centerpiece Portrait & Trust Visual Hierarchy (~5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center">
            
            {/* Portrait Frame */}
            <div className="relative w-full max-w-md mx-auto group">
              {/* Glowing back aura */}
              <motion.div 
                animate={{ scale: [1, 1.04, 1], opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -inset-2 bg-gradient-to-tr from-violet-600/40 via-blue-600/30 to-purple-600/40 rounded-[2.5rem] blur-2xl pointer-events-none"
              />

              <div className="relative overflow-hidden rounded-[2.2rem] border border-white/20 bg-gradient-to-b from-white/10 via-white/[0.05] to-[#080816] shadow-2xl">
                {/* Top Highlight Bar */}
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-violet-400 to-transparent z-20" />

                <div className="relative aspect-[3.8/4.8] sm:aspect-[4/5] w-full overflow-hidden [mask-image:linear-gradient(to_bottom,black_80%,transparent_100%)]">
                  <img
                    src="/dr-nilay-saha.jpg"
                    alt={doctor.name}
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a1a] via-transparent to-transparent opacity-60" />
                </div>

                {/* Floating Experience Badge */}
                <div className="absolute top-5 right-5 z-20 bg-black/70 backdrop-blur-xl border border-white/20 rounded-2xl px-3.5 py-2 flex items-center gap-2 shadow-lg">
                  <Award className="w-4 h-4 text-violet-400 shrink-0" />
                  <span className="text-xs font-bold text-white tracking-wide">
                    {doctor.experience_years || 10}+ Years Exp.
                  </span>
                </div>

                {/* Verified Registration Pill */}
                <div className="absolute bottom-6 inset-x-6 z-20 p-4 rounded-2xl bg-[#080818]/90 backdrop-blur-2xl border border-white/20 shadow-2xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[11px] uppercase tracking-wider text-violet-400 font-semibold block">
                        Official Registration
                      </span>
                      <p className="text-sm font-mono font-bold text-white mt-0.5">
                        {doctor.registration_number || 'WBDC Reg. No. 4858-A'}
                      </p>
                    </div>
                    <div className="w-9 h-9 rounded-xl bg-green-500/20 border border-green-500/30 flex items-center justify-center text-green-400 shrink-0">
                      <BadgeCheck className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* TRUST IMPROVEMENTS: Visual Trust Flow Card */}
            <div className="mt-8 w-full max-w-md bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/15 rounded-3xl p-6 sm:p-7 backdrop-blur-xl shadow-xl text-center space-y-4">
              <div className="flex items-center justify-center gap-2 text-violet-300 text-xs font-semibold uppercase tracking-widest">
                <ShieldCheck className="w-4 h-4 text-violet-400" />
                <span>Verified Clinical Authority</span>
              </div>

              <div className="space-y-3 py-2 border-y border-white/10 text-sm">
                <div>
                  <span className="text-xs text-gray-400 uppercase tracking-wider">Surgeon Name</span>
                  <p className="font-heading font-extrabold text-white text-lg mt-0.5">{doctor.name}</p>
                </div>

                <div>
                  <span className="text-xs text-gray-400 uppercase tracking-wider">Qualification & Designation</span>
                  <p className="font-medium text-violet-300 mt-0.5">
                    {doctor.qualification || 'BDS, FIE'} • {doctor.designation || 'Dental Surgeon & Oral Physician'}
                  </p>
                </div>

                <div>
                  <span className="text-xs text-gray-400 uppercase tracking-wider">Clinical Experience</span>
                  <p className="font-medium text-gray-200 mt-0.5">Over {doctor.experience_years || 10} Years of Precision Practice</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent('openContactModal'))}
                className="w-full btn-sweep py-3.5 px-6 rounded-2xl bg-gradient-to-r from-violet-600 to-blue-600 text-white font-semibold text-sm shadow-[0_0_25px_rgba(139,92,246,0.4)] hover:shadow-[0_0_40px_rgba(139,92,246,0.6)] transition-all flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Appointment With Dr. Nilay Saha</span>
              </button>
            </div>

          </div>

          {/* Right Column: Dynamic CMS Content & Biography (~7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-8">
            
            {/* Bio Box */}
            <div className="bg-white/[0.04] border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-violet-500/20 text-violet-300 border border-violet-500/30 flex items-center justify-center shrink-0">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-xl text-white">Clinical Biography</h3>
                  <span className="text-xs text-gray-400">Philosophy of care & expertise</span>
                </div>
              </div>

              <p className="text-gray-300 text-base sm:text-lg leading-relaxed font-light whitespace-pre-line">
                {aboutConfig.description || doctor.bio || `Dr. Nilay Saha is a leading Dental Surgeon and Oral Physician dedicated to providing painless, highly precise dental treatments. With over a decade of hands-on experience across multiple clinical centers in West Bengal, he specializes in single-visit root canal treatments, aesthetic restorations, and complex surgical procedures.\n\nHis clinical approach emphasizes conservative dentistry—saving natural teeth wherever possible—while utilizing international sterilization standards and modern diagnostics to ensure optimum patient safety and comfort.`}
              </p>

              {/* Quick Info Pills */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-6 border-t border-white/10">
                <div className="bg-black/30 border border-white/10 rounded-2xl p-3.5">
                  <span className="text-xs text-gray-400 block mb-1">Registration</span>
                  <strong className="text-xs sm:text-sm text-white font-mono">{doctor.registration_number || '4858-A'}</strong>
                </div>
                <div className="bg-black/30 border border-white/10 rounded-2xl p-3.5">
                  <span className="text-xs text-gray-400 block mb-1">Languages</span>
                  <strong className="text-xs sm:text-sm text-white">{languages.join(', ')}</strong>
                </div>
                <div className="bg-black/30 border border-white/10 rounded-2xl p-3.5">
                  <span className="text-xs text-gray-400 block mb-1">Active Centers</span>
                  <strong className="text-xs sm:text-sm text-violet-300">3 Clinic Locations</strong>
                </div>
              </div>
            </div>

            {/* Interactive Tabs for Qualifications, Specializations, Awards, Memberships */}
            <div className="bg-white/[0.04] border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-xl">
              <div className="flex flex-wrap gap-2 border-b border-white/10 pb-4 mb-6">
                <button
                  type="button"
                  onClick={() => setActiveTab('qualifications')}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
                    activeTab === 'qualifications'
                      ? 'bg-violet-600 text-white shadow-[0_0_15px_rgba(139,92,246,0.5)]'
                      : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <GraduationCap className="w-4 h-4" />
                  Qualifications
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('specializations')}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
                    activeTab === 'specializations'
                      ? 'bg-violet-600 text-white shadow-[0_0_15px_rgba(139,92,246,0.5)]'
                      : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <HeartPulse className="w-4 h-4" />
                  Specializations
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('awards')}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
                    activeTab === 'awards'
                      ? 'bg-violet-600 text-white shadow-[0_0_15px_rgba(139,92,246,0.5)]'
                      : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Award className="w-4 h-4" />
                  Awards
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('memberships')}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
                    activeTab === 'memberships'
                      ? 'bg-violet-600 text-white shadow-[0_0_15px_rgba(139,92,246,0.5)]'
                      : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  Memberships
                </button>
              </div>

              {/* Tab Content */}
              <div className="space-y-4">
                {activeTab === 'qualifications' && (
                  <div className="space-y-3">
                    {qualifications.map((item, idx) => (
                      <div key={idx} className="flex items-start justify-between gap-4 p-4 rounded-2xl bg-black/25 border border-white/10">
                        <div className="flex items-start gap-3.5">
                          <div className="w-9 h-9 rounded-xl bg-violet-500/20 text-violet-300 border border-violet-500/30 flex items-center justify-center shrink-0 mt-0.5">
                            <GraduationCap className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-white text-sm sm:text-base">{item.title}</h4>
                            <p className="text-xs text-violet-300 mt-0.5">{item.institution}</p>
                            {item.description && <p className="text-xs text-gray-400 mt-1">{item.description}</p>}
                          </div>
                        </div>
                        {item.issue_date && (
                          <span className="text-[11px] text-gray-500 font-mono bg-white/5 px-2.5 py-1 rounded-lg shrink-0">
                            {item.issue_date}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'specializations' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {specializations.map((spec, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-4 rounded-2xl bg-black/25 border border-white/10">
                        <CheckCircle2 className="w-4 h-4 text-violet-400 shrink-0" />
                        <span className="text-sm font-medium text-gray-200">{spec}</span>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'awards' && (
                  <div className="space-y-3">
                    {awards.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3.5 p-4 rounded-2xl bg-black/25 border border-white/10">
                        <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center justify-center shrink-0 mt-0.5">
                          <Award className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-white text-sm sm:text-base">{item.title}</h4>
                          <p className="text-xs text-blue-300 mt-0.5">{item.institution}</p>
                          {item.description && <p className="text-xs text-gray-400 mt-1">{item.description}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'memberships' && (
                  <div className="space-y-3">
                    {certifications.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3.5 p-4 rounded-2xl bg-black/25 border border-white/10">
                        <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5">
                          <ShieldCheck className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-white text-sm sm:text-base">{item.title}</h4>
                          <p className="text-xs text-emerald-300 mt-0.5">{item.institution}</p>
                          {item.description && <p className="text-xs text-gray-400 mt-1">{item.description}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Clinics Footer Banner inside About Section */}
            <div className="bg-gradient-to-r from-violet-900/40 via-[#0e0e24] to-blue-900/40 border border-white/15 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white shrink-0">
                  <MapPin className="w-6 h-6 text-violet-400" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-white text-base">Practicing at Belerhat • Parulia • Nabadwip</h4>
                  <p className="text-xs text-gray-300 mt-0.5">Direct personal consultations across all 3 regional dental centers.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  const elem = document.getElementById('clinics');
                  if (elem) elem.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-5 py-2.5 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold transition-all shrink-0"
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
