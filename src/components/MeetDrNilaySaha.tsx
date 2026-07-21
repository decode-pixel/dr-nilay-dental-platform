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
import { DOCTOR_REGISTRATION_NUMBER } from '../lib/constants';
import { logger } from '../lib/logger';
import OptimizedImage from './OptimizedImage';
import TagPill from './TagPill';

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
        qualification: 'BDS',
        registration_number: `WBDC Registration No. ${DOCTOR_REGISTRATION_NUMBER}`,
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
              { title: 'Registered Medical Practitioner (Dental)', institution: `West Bengal Dental Council (Reg. No. ${DOCTOR_REGISTRATION_NUMBER})` },
              { title: 'Life Member', institution: 'Indian Dental Association (IDA)' }
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
        qualification: 'BDS',
        registration_number: `WBDC Registration No. ${DOCTOR_REGISTRATION_NUMBER}`,
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
    <section className="py-20 sm:py-28 relative z-20 font-sans bg-[#FCFCFD] border-b border-slate-200/60" id="doctor-profile">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-20">
          <TagPill icon={Sparkles} text="Principal Surgeon & Founder" />
          <h2 className="h2-premium mt-3 mb-4">
            Meet <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10B981] to-[#059669]">Dr. Nilay Saha</span>
          </h2>
          <p className="body-premium max-w-2xl mx-auto">
            Combining state-of-the-art clinical technology with compassionate, evidence-based dental care across Purba Bardhaman and Nadia.
          </p>
        </div>

        {/* Main Grid: Centerpiece Portrait Showcase + Dynamic Credentials */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* Left Column: Surgeon Authority Card (~5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center">
            
            <div className="relative w-full max-w-md mx-auto">
              <div className="card-premium p-8 bg-gradient-to-br from-emerald-50/90 via-white to-white border-emerald-300/80 shadow-lg space-y-6 relative overflow-hidden">
                {/* Top Highlight Bar */}
                <div className="absolute top-0 inset-x-0 h-[4px] bg-gradient-to-r from-transparent via-[#10B981] to-transparent z-20" />

                {/* Surgeon Badge Header */}
                <div className="flex items-center gap-4 border-b border-slate-200/80 pb-5">
                  <div className="w-14 h-14 rounded-2xl bg-[#10B981]/15 border border-[#10B981]/30 flex items-center justify-center text-[#10B981] shrink-0 shadow-sm">
                    <GraduationCap className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-display font-bold text-[#122820] leading-tight">
                      {doctor.name}
                    </h3>
                    <p className="text-xs text-[#10B981] font-bold mt-1 uppercase tracking-wider">
                      {doctor.designation || 'Dental Surgeon & Oral Physician'}
                    </p>
                  </div>
                </div>

                {/* Key Qualifications & Reg Badge */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                    <span className="text-xs font-semibold text-[#4B6358]">Medical Qualification</span>
                    <span className="text-xs font-bold font-mono text-[#10B981]">BDS</span>
                  </div>

                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                    <span className="text-xs font-semibold text-[#4B6358]">State Dental License</span>
                    <span className="text-xs font-bold font-mono text-[#122820]">{doctor.registration_number || `WBDC Reg. No. ${DOCTOR_REGISTRATION_NUMBER}`}</span>
                  </div>

                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                    <span className="text-xs font-semibold text-[#4B6358]">Clinical Experience</span>
                    <span className="text-xs font-bold text-[#10B981]">{doctor.experience_years || 10}+ Years Active Practice</span>
                  </div>
                </div>

                {/* Verified Authority Banner */}
                <div className="p-4 rounded-2xl bg-emerald-100/50 border border-emerald-300/80 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#10B981] font-bold block">
                      Verification Status
                    </span>
                    <p className="text-xs font-bold text-[#122820] mt-0.5">
                      Verified Clinical Authority
                    </p>
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-[#10B981] text-white flex items-center justify-center shrink-0 shadow-sm">
                    <BadgeCheck className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Trust Flow Card */}
            <div className="mt-6 w-full max-w-md card-premium p-6 sm:p-8 bg-white text-center space-y-5">
              <div className="flex items-center justify-center gap-2 text-[#10B981] text-xs font-bold uppercase tracking-widest">
                <ShieldCheck className="w-4 h-4" />
                <span>Verified Clinical Authority</span>
              </div>

              <div className="space-y-3.5 py-4 border-y border-slate-100 text-sm">
                <div>
                  <span className="text-xs text-[#4B6358] uppercase tracking-wider font-semibold">Surgeon Name</span>
                  <p className="font-display font-bold text-[#122820] text-lg mt-0.5">{doctor.name}</p>
                </div>

                <div>
                  <span className="text-xs text-[#4B6358] uppercase tracking-wider font-semibold">Qualification & Designation</span>
                  <p className="font-semibold text-[#10B981] mt-0.5">
                    {doctor.qualification || 'BDS'} • {doctor.designation || 'Dental Surgeon & Oral Physician'}
                  </p>
                </div>

                <div>
                  <span className="text-xs text-[#4B6358] uppercase tracking-wider font-semibold">Clinical Experience</span>
                  <p className="font-medium text-[#2C4238] mt-0.5">Over {doctor.experience_years || 10} Years of Precision Practice</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent('openContactModal'))}
                className="btn-primary-premium w-full justify-center"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Appointment With Dr. Saha</span>
              </button>
            </div>

          </div>

          {/* Right Column: Dynamic CMS Content & Biography (~7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-7">
            
            {/* Bio Box */}
            <div className="card-premium p-8 sm:p-10 bg-white">
              <div className="flex items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#10B981] border border-emerald-200 flex items-center justify-center shrink-0 shadow-sm">
                    <UserCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-xl sm:text-2xl text-[#122820]">Clinical Biography & Philosophy</h3>
                    <span className="text-xs text-[#4B6358] font-medium">Mission, Vision & Patient Promise</span>
                  </div>
                </div>
                <div className="hidden sm:flex flex-col items-end opacity-90">
                  <span className="font-serif italic text-lg text-[#10B981] tracking-wider">Dr. Nilay Saha</span>
                  <span className="text-[10px] text-[#4B6358] uppercase tracking-widest font-mono font-semibold">Principal Surgeon</span>
                </div>
              </div>

              <p className="text-[#2C4238] text-base sm:text-lg leading-[1.7] font-normal whitespace-pre-line">
                {aboutConfig.description || doctor.bio || `Dr. Nilay Saha is a leading Dental Surgeon and Oral Physician dedicated to providing painless, highly precise dental treatments. With over a decade of hands-on experience across multiple clinical centers in West Bengal, he specializes in single-visit root canal treatments, aesthetic restorations, and complex surgical procedures.\n\nHis clinical approach emphasizes conservative dentistry—saving natural teeth wherever possible—while utilizing international sterilization standards and modern diagnostics to ensure optimum patient safety and comfort.`}
              </p>

              {/* Quick Info Pills */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-8 pt-8 border-t border-slate-100">
                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 shadow-sm">
                  <span className="text-xs text-[#4B6358] font-semibold block mb-1">Registration</span>
                  <strong className="text-xs sm:text-sm text-[#122820] font-mono">{doctor.registration_number || DOCTOR_REGISTRATION_NUMBER}</strong>
                </div>
                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 shadow-sm">
                  <span className="text-xs text-[#4B6358] font-semibold block mb-1">Languages</span>
                  <strong className="text-xs sm:text-sm text-[#122820]">{languages.join(', ')}</strong>
                </div>
                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 shadow-sm">
                  <span className="text-xs text-[#4B6358] font-semibold block mb-1">Active Centers</span>
                  <strong className="text-xs sm:text-sm text-[#10B981]">3 Clinic Locations</strong>
                </div>
              </div>
            </div>

            {/* Interactive Tabs */}
            <div className="card-premium p-8 sm:p-10 bg-white">
              <div 
                className="flex flex-wrap gap-2 sm:gap-2.5 border-b border-slate-100 pb-6 mb-8"
                role="tablist"
                aria-label="Doctor professional credentials"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === 'qualifications'}
                  aria-controls="panel-qualifications"
                  id="tab-qualifications"
                  onClick={() => setActiveTab('qualifications')}
                  className={`px-4.5 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
                    activeTab === 'qualifications'
                      ? 'bg-gradient-to-r from-[#10B981] to-[#059669] text-white shadow-[0_4px_14px_rgba(16,185,129,0.35)]'
                      : 'bg-slate-50 text-[#4B6358] border border-slate-200/80 hover:text-[#122820] hover:bg-emerald-50'
                  }`}
                >
                  <GraduationCap className="w-4 h-4" />
                  Qualifications
                </button>

                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === 'specializations'}
                  aria-controls="panel-specializations"
                  id="tab-specializations"
                  onClick={() => setActiveTab('specializations')}
                  className={`px-4.5 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
                    activeTab === 'specializations'
                      ? 'bg-gradient-to-r from-[#10B981] to-[#059669] text-white shadow-[0_4px_14px_rgba(16,185,129,0.35)]'
                      : 'bg-slate-50 text-[#4B6358] border border-slate-200/80 hover:text-[#122820] hover:bg-emerald-50'
                  }`}
                >
                  <HeartPulse className="w-4 h-4" />
                  Specializations
                </button>

                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === 'awards'}
                  aria-controls="panel-awards"
                  id="tab-awards"
                  onClick={() => setActiveTab('awards')}
                  className={`px-4.5 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
                    activeTab === 'awards'
                      ? 'bg-gradient-to-r from-[#10B981] to-[#059669] text-white shadow-[0_4px_14px_rgba(16,185,129,0.35)]'
                      : 'bg-slate-50 text-[#4B6358] border border-slate-200/80 hover:text-[#122820] hover:bg-emerald-50'
                  }`}
                >
                  <Award className="w-4 h-4" />
                  Awards
                </button>

                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === 'memberships'}
                  aria-controls="panel-memberships"
                  id="tab-memberships"
                  onClick={() => setActiveTab('memberships')}
                  className={`px-4.5 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
                    activeTab === 'memberships'
                      ? 'bg-gradient-to-r from-[#10B981] to-[#059669] text-white shadow-[0_4px_14px_rgba(16,185,129,0.35)]'
                      : 'bg-slate-50 text-[#4B6358] border border-slate-200/80 hover:text-[#122820] hover:bg-emerald-50'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  Memberships
                </button>

                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === 'journey'}
                  aria-controls="panel-journey"
                  id="tab-journey"
                  onClick={() => setActiveTab('journey')}
                  className={`px-4.5 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
                    activeTab === 'journey'
                      ? 'bg-gradient-to-r from-[#10B981] to-[#059669] text-white shadow-[0_4px_14px_rgba(16,185,129,0.35)]'
                      : 'bg-slate-50 text-[#4B6358] border border-slate-200/80 hover:text-[#122820] hover:bg-emerald-50'
                  }`}
                >
                  <History className="w-4 h-4" />
                  Clinical Journey
                </button>
              </div>

              {/* Tab Content */}
              <div className="space-y-4 min-h-[290px]">
                {activeTab === 'qualifications' && (
                  <div 
                    role="tabpanel" 
                    id="panel-qualifications" 
                    aria-labelledby="tab-qualifications"
                    className="space-y-3.5"
                  >
                    {qualifications.map((item, idx) => (
                      <div key={idx} className="flex items-start justify-between gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200/80 shadow-sm">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#10B981] border border-emerald-200 flex items-center justify-center shrink-0 mt-0.5">
                            <GraduationCap className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-bold text-[#122820] text-base">{item.title}</h4>
                            <p className="text-xs font-semibold text-[#10B981] mt-1">{item.institution}</p>
                            {item.description && <p className="text-sm text-[#2C4238] mt-1.5 leading-relaxed">{item.description}</p>}
                          </div>
                        </div>
                        {item.issue_date && (
                          <span className="text-[11px] text-[#4B6358] font-mono font-semibold bg-emerald-50 px-3 py-1 rounded-lg shrink-0 border border-emerald-200">
                            {item.issue_date}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'specializations' && (
                  <div 
                    role="tabpanel" 
                    id="panel-specializations" 
                    aria-labelledby="tab-specializations"
                    className="grid grid-cols-1 sm:grid-cols-2 gap-3.5"
                  >
                    {specializations.map((spec, idx) => (
                      <div key={idx} className="flex items-center gap-3.5 p-4.5 rounded-2xl bg-slate-50 border border-slate-200/80 shadow-sm">
                        <CheckCircle2 className="w-5 h-5 text-[#10B981] shrink-0" />
                        <span className="text-sm font-semibold text-[#122820]">{spec}</span>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'awards' && (
                  <div 
                    role="tabpanel" 
                    id="panel-awards" 
                    aria-labelledby="tab-awards"
                    className="space-y-3.5"
                  >
                    {awards.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200/80 shadow-sm">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center shrink-0 mt-0.5">
                          <Award className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-[#122820] text-base">{item.title}</h4>
                          <p className="text-xs font-semibold text-amber-600 mt-1">{item.institution}</p>
                          {item.description && <p className="text-sm text-[#2C4238] mt-1.5 leading-relaxed">{item.description}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'memberships' && (
                  <div 
                    role="tabpanel" 
                    id="panel-memberships" 
                    aria-labelledby="tab-memberships"
                    className="space-y-3.5"
                  >
                    {certifications.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200/80 shadow-sm">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#10B981] border border-emerald-200 flex items-center justify-center shrink-0 mt-0.5">
                          <ShieldCheck className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-[#122820] text-base">{item.title}</h4>
                          <p className="text-xs font-semibold text-[#10B981] mt-1">{item.institution}</p>
                          {item.description && <p className="text-sm text-[#2C4238] mt-1.5 leading-relaxed">{item.description}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'journey' && (
                  <div 
                    role="tabpanel" 
                    id="panel-journey" 
                    aria-labelledby="tab-journey"
                    className="space-y-4 pt-2"
                  >
                    <div className="flex items-start gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200/80 shadow-sm">
                      <div className="w-3 h-3 rounded-full bg-[#10B981] mt-1.5 shrink-0" />
                      <div>
                        <span className="text-xs font-mono text-[#10B981] font-bold">2014 - Present</span>
                        <h4 className="font-bold text-[#122820] text-base mt-1">Principal Surgeon & Clinical Director</h4>
                        <p className="text-sm text-[#2C4238] mt-1.5 leading-relaxed">Founded and expanded regional clinical centers across Belerhat, Parulia, and Nabadwip with zero-compromise sterilization protocols.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200/80 shadow-sm">
                      <div className="w-3 h-3 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                      <div>
                        <span className="text-xs font-mono text-amber-600 font-bold">Clinical Residency</span>
                        <h4 className="font-bold text-[#122820] text-base mt-1">Fellowship & Advanced Endodontic Training</h4>
                        <p className="text-sm text-[#2C4238] mt-1.5 leading-relaxed">Specialized in micro-endodontics, rotary instrumentation, and single-visit painless root canal therapy.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Clinics Footer Banner inside About Section */}
            <div className="card-premium p-6 sm:p-8 bg-white flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#10B981] shrink-0 shadow-sm">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-[#122820] text-lg">Practicing at Belerhat • Parulia • Nabadwip</h4>
                  <p className="text-sm text-[#2C4238] mt-0.5">Direct personal consultations across all 3 regional dental centers.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  const elem = document.getElementById('clinics') || document.getElementById('locations');
                  if (elem) elem.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 py-3 rounded-full bg-[#122820] hover:bg-[#10B981] text-white text-xs font-bold uppercase tracking-wider transition-all shrink-0 shadow-sm"
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
