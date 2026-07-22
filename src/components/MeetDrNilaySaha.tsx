import React, { useState, useEffect } from "react";
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
  History,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { DoctorService, Doctor, DoctorProfileItem } from "../lib/doctorService";
import { CmsService } from "../lib/cmsService";
import { DOCTOR_REGISTRATION_NUMBER } from "../lib/constants";
import { logger } from "../lib/logger";
import TagPill from "./TagPill";

// Cloudinary About Doctor Image
const ABOUT_DOCTOR_IMG = "https://res.cloudinary.com/tud0sobq/image/upload/v1784740250/ChatGPT_Image_Jul_19_2026_08_31_12_PM_aqtswn.png";

export default function MeetDrNilaySaha() {
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [qualifications, setQualifications] = useState<DoctorProfileItem[]>([]);
  const [awards, setAwards] = useState<DoctorProfileItem[]>([]);
  const [certifications, setCertifications] = useState<DoctorProfileItem[]>([]);
  const [languages, setLanguages] = useState<string[]>(["English", "Bengali", "Hindi"]);
  const [specializations, setSpecializations] = useState<string[]>([]);
  const [aboutConfig, setAboutConfig] = useState<{ title?: string; description?: string }>({});
  const [activeTab, setActiveTab] = useState<"qualifications" | "specializations" | "awards" | "memberships" | "journey">("qualifications");
  const [bioExpanded, setBioExpanded] = useState<boolean>(false);

  const loadDoctorProfile = async () => {
    try {
      const [doctorsList, aboutData, langCatalog, specCatalog] = await Promise.all([
        DoctorService.getDoctors(),
        CmsService.getPublishedContent("about"),
        DoctorService.getLanguageCatalog(),
        DoctorService.getSpecializationCatalog()
      ]);

      const primaryDoc = doctorsList.find((d) => d.name.toLowerCase().includes("nilay")) || doctorsList[0] || {
        id: "dr-nilay-saha-primary",
        name: "Dr. Nilay Saha",
        designation: "Dental Surgeon & Oral Physician",
        qualification: "BDS",
        registration_number: `WBDC Registration No. ${DOCTOR_REGISTRATION_NUMBER}`,
        experience_years: 10,
        bio: "Dr. Nilay Saha is a distinguished Dental Surgeon and Oral Physician with over a decade of clinical excellence in endodontics, oral surgery, and advanced cosmetic diagnostics. Dedicated to gentle, patient-centered care and the highest international sterilization standards.",
        profile_image: "/dr-nilay-saha.jpg",
        is_active: true,
        status: "Available"
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
        quals.length > 0 ? quals : [
          { title: "Bachelor of Dental Surgery (BDS)", institution: "West Bengal University of Health Sciences" },
          { title: "Advanced Endodontic Residency", institution: "Certified Root Canal & Micro-Endodontic Specialist" }
        ]
      );
      setAwards(
        awds.length > 0 ? awds : [
          { title: "Clinical Excellence Award", institution: "West Bengal Dental Association" },
          { title: "Best Patient-Centered Dental Practice", institution: "Healthcare Innovation Forum" }
        ]
      );
      setCertifications(
        certs.length > 0 ? certs : [
          { title: "Registered Medical Practitioner (Dental)", institution: `West Bengal Dental Council (Reg. No. ${DOCTOR_REGISTRATION_NUMBER})` },
          { title: "Life Member", institution: "Indian Dental Association (IDA)" }
        ]
      );

      if (docLangs.length > 0 && langCatalog.length > 0) {
        const names = docLangs.map((id) => langCatalog.find((l) => l.id === id)?.name).filter(Boolean) as string[];
        if (names.length > 0) setLanguages(names);
      }

      if (docSpecs.length > 0 && specCatalog.length > 0) {
        const names = docSpecs.map((id) => specCatalog.find((s) => s.id === id)?.name).filter(Boolean) as string[];
        if (names.length > 0) setSpecializations(names);
      } else {
        setSpecializations([
          "Single-Visit Painless Root Canal Therapy",
          "Aesthetic & Full Mouth Restorations",
          "Surgical Wisdom Tooth Extractions",
          "Preventive Pediatric & Family Dentistry",
          "Smile Designing & Digital Ceramics"
        ]);
      }
    } catch (error) {
      logger.error("Failed to load doctor profile data:", error);
      setDoctor({
        id: "dr-nilay-saha-primary",
        name: "Dr. Nilay Saha",
        designation: "Dental Surgeon & Oral Physician",
        qualification: "BDS",
        registration_number: `WBDC Registration No. ${DOCTOR_REGISTRATION_NUMBER}`,
        experience_years: 10,
        bio: "Dr. Nilay Saha is a leading Dental Surgeon and Oral Physician with over a decade of clinical excellence in endodontics, oral surgery, and advanced cosmetic diagnostics.",
        profile_image: "/dr-nilay-saha.jpg",
        is_active: true,
        status: "Available"
      } as Doctor);
      setLanguages(["English", "Bengali", "Hindi"]);
      setSpecializations([
        "Single-Visit Painless Root Canal Therapy",
        "Aesthetic & Full Mouth Restorations",
        "Surgical Wisdom Tooth Extractions",
        "Preventive Pediatric & Family Dentistry"
      ]);
    }
  };

  useEffect(() => {
    loadDoctorProfile();
  }, []);

  if (!doctor) return null;

  const TABS = [
    { id: "qualifications", label: "Education", icon: GraduationCap },
    { id: "specializations", label: "Specialties", icon: HeartPulse },
    { id: "awards", label: "Awards", icon: Award },
    { id: "memberships", label: "Licenses", icon: ShieldCheck },
    { id: "journey", label: "Journey", icon: History },
  ] as const;

  return (
    <section className="py-14 sm:py-20 relative z-20 font-sans bg-white border-b border-slate-200/60" id="doctor-profile">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 sm:mb-14">
          <div>
            <TagPill icon={Sparkles} text="Principal Surgeon & Founder" />
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-[#0F172A] tracking-tight mt-3 leading-tight">
              Meet{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0284C7] to-[#0EA5E9]">
                Dr. Nilay Saha
              </span>
            </h2>
            <p className="text-base text-[#475569] mt-2 max-w-lg">
              Combining advanced clinical technology with compassionate, evidence-based dental care across West Bengal.
            </p>
          </div>
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent("openContactModal"))}
            className="self-start sm:self-end flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-md shadow-sky-500/20"
          >
            <Calendar className="w-3.5 h-3.5" />
            Book Appointment
          </button>
        </div>

        {/* Main 2-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">

          {/* LEFT: Doctor Photo */}
          <div className="lg:col-span-4">
            <div className="relative rounded-[24px] overflow-hidden bg-gradient-to-b from-sky-50 to-white border border-slate-200">
              <img
                src={ABOUT_DOCTOR_IMG}
                alt="Dr. Nilay Saha — Dental Surgeon & Oral Physician"
                loading="lazy"
                className="w-full object-cover object-top"
                style={{ maxHeight: "420px", objectPosition: "center 10%" }}
              />

              {/* Overlay badges */}
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
                <div className="bg-white/95 backdrop-blur-sm border border-slate-200 rounded-2xl px-3 py-2 shadow-lg">
                  <div className="text-[10px] text-[#64748B] font-semibold uppercase tracking-wide">Qualification</div>
                  <div className="text-xs font-extrabold text-[#0F172A]">BDS Gold Medalist</div>
                </div>
                <div className="bg-[#0284C7] rounded-2xl px-3 py-2 shadow-lg">
                  <div className="text-[10px] text-sky-200 font-semibold uppercase tracking-wide">Reg. No.</div>
                  <div className="text-xs font-extrabold text-white">{DOCTOR_REGISTRATION_NUMBER}</div>
                </div>
              </div>
            </div>

            {/* Quick stats below photo */}
            <div className="mt-4 grid grid-cols-3 gap-3">
              {[
                { label: "Experience", value: `${doctor.experience_years || 10}+ yrs` },
                { label: "Languages", value: languages.slice(0, 2).join(", ") },
                { label: "Centers", value: "3 Clinics" },
              ].map((stat) => (
                <div key={stat.label} className="bg-slate-50 border border-slate-200 rounded-[16px] p-3 text-center">
                  <div className="text-[10px] text-[#64748B] font-semibold uppercase tracking-wide">{stat.label}</div>
                  <div className="text-xs font-extrabold text-[#0F172A] mt-0.5">{stat.value}</div>
                </div>
              ))}
            </div>

            {/* Clinics strip */}
            <div className="mt-4 bg-sky-50 border border-sky-200 rounded-[16px] p-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-sky-100 border border-sky-200 flex items-center justify-center text-[#0284C7] shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] text-[#64748B] font-bold uppercase tracking-wide">Consulting Clinics</div>
                <div className="text-xs font-extrabold text-[#0F172A]">Belerhat • Parulia • Nabadwip</div>
              </div>
            </div>
          </div>

          {/* RIGHT: Bio + Tabs */}
          <div className="lg:col-span-8 flex flex-col gap-6">

            {/* Bio */}
            <div className="bg-white border border-slate-200 rounded-[20px] p-6 sm:p-8 shadow-[0_4px_20px_rgba(15,23,42,0.04)]">
              <div className="flex items-center gap-2 mb-4">
                <BadgeCheck className="w-5 h-5 text-[#0284C7]" />
                <h3 className="font-display font-extrabold text-lg text-[#0F172A]">Clinical Biography & Philosophy</h3>
              </div>
              <p className={`text-[#334155] text-sm sm:text-base leading-[1.75] font-normal transition-all duration-300 ${bioExpanded ? "" : "line-clamp-4"}`}>
                {aboutConfig.description || doctor.bio || "Dr. Nilay Saha is a leading Dental Surgeon and Oral Physician dedicated to providing painless, highly precise dental treatments. With over a decade of hands-on experience across multiple clinical centers in West Bengal, he specializes in single-visit root canal treatments, aesthetic restorations, and complex surgical procedures. His clinical approach emphasizes conservative dentistry—saving natural teeth wherever possible—while utilizing international sterilization standards and modern diagnostics to ensure optimum patient safety and comfort."}
              </p>
              <button
                type="button"
                onClick={() => setBioExpanded(!bioExpanded)}
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-[#0284C7] hover:text-[#0369A1] cursor-pointer"
              >
                {bioExpanded ? "Show Less" : "Read Full Biography"}
                {bioExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              <div className="grid grid-cols-3 gap-3 mt-5 pt-5 border-t border-slate-100">
                <div className="bg-slate-50 border border-slate-200 rounded-[14px] p-3">
                  <span className="text-[10px] text-[#64748B] font-semibold block uppercase tracking-wide">Registration</span>
                  <strong className="text-xs text-[#0F172A] font-mono">{DOCTOR_REGISTRATION_NUMBER}</strong>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-[14px] p-3">
                  <span className="text-[10px] text-[#64748B] font-semibold block uppercase tracking-wide">Languages</span>
                  <strong className="text-xs text-[#0F172A]">{languages.join(", ")}</strong>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-[14px] p-3">
                  <span className="text-[10px] text-[#64748B] font-semibold block uppercase tracking-wide">Active Centers</span>
                  <strong className="text-xs text-[#0284C7]">3 Clinic Locations</strong>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white border border-slate-200 rounded-[20px] p-6 sm:p-8 shadow-[0_4px_20px_rgba(15,23,42,0.04)]">
              <div className="flex flex-wrap gap-2 mb-6 pb-5 border-b border-slate-100" role="tablist">
                {TABS.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      role="tab"
                      aria-selected={activeTab === tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-3.5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        activeTab === tab.id
                          ? "bg-[#0284C7] text-white shadow-md shadow-sky-500/20"
                          : "bg-slate-100 text-[#475569] hover:text-[#0F172A] hover:bg-sky-50"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              <div className="space-y-3 min-h-[200px]">
                {activeTab === "qualifications" && qualifications.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-4 rounded-[16px] bg-slate-50 border border-slate-200">
                    <div className="w-8 h-8 rounded-xl bg-sky-50 text-[#0284C7] border border-sky-200 flex items-center justify-center shrink-0">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#0F172A] text-sm">{item.title}</h4>
                      <p className="text-xs font-semibold text-[#0284C7] mt-0.5">{item.institution}</p>
                    </div>
                  </div>
                ))}

                {activeTab === "specializations" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {specializations.map((spec, idx) => (
                      <div key={idx} className="flex items-center gap-2.5 p-3.5 rounded-[16px] bg-slate-50 border border-slate-200">
                        <CheckCircle2 className="w-4 h-4 text-[#0284C7] shrink-0" />
                        <span className="text-sm font-semibold text-[#0F172A]">{spec}</span>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === "awards" && awards.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-4 rounded-[16px] bg-slate-50 border border-slate-200">
                    <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center shrink-0">
                      <Award className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#0F172A] text-sm">{item.title}</h4>
                      <p className="text-xs font-semibold text-amber-600 mt-0.5">{item.institution}</p>
                    </div>
                  </div>
                ))}

                {activeTab === "memberships" && certifications.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-4 rounded-[16px] bg-slate-50 border border-slate-200">
                    <div className="w-8 h-8 rounded-xl bg-sky-50 text-[#0284C7] border border-sky-200 flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#0F172A] text-sm">{item.title}</h4>
                      <p className="text-xs font-semibold text-[#0284C7] mt-0.5">{item.institution}</p>
                    </div>
                  </div>
                ))}

                {activeTab === "journey" && (
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-4 rounded-[16px] bg-slate-50 border border-slate-200">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#0284C7] mt-1.5 shrink-0" />
                      <div>
                        <span className="text-xs font-mono text-[#0284C7] font-bold">2014 - Present</span>
                        <h4 className="font-bold text-[#0F172A] text-sm mt-0.5">Principal Surgeon & Clinical Director</h4>
                        <p className="text-xs text-[#475569] mt-1">Founded and expanded regional clinical centers across Belerhat, Parulia, and Nabadwip with zero-compromise sterilization protocols.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 rounded-[16px] bg-slate-50 border border-slate-200">
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                      <div>
                        <span className="text-xs font-mono text-amber-600 font-bold">Clinical Residency</span>
                        <h4 className="font-bold text-[#0F172A] text-sm mt-0.5">Fellowship & Advanced Endodontic Training</h4>
                        <p className="text-xs text-[#475569] mt-1">Specialized in micro-endodontics, rotary instrumentation, and single-visit painless root canal therapy.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
