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
    <section className="py-16 sm:py-24 relative z-20 font-sans bg-[#F5F9F8] border-b border-teal-100/50" id="doctor-profile">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12 sm:mb-16">
          <div>
            <TagPill icon={Sparkles} text="Principal Surgeon & Founder" />
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-[#0F172A] tracking-tight mt-3 leading-tight">
              Meet{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00A896] via-[#028090] to-[#059669]">
                Dr. Nilay Saha
              </span>
            </h2>
            <p className="text-base text-slate-600 mt-2 max-w-lg font-normal">
              Combining advanced clinical technology with compassionate, evidence-based dental care across West Bengal.
            </p>
          </div>
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent("openContactModal"))}
            className="self-start sm:self-end flex-shrink-0 btn-crystal px-6 py-3 rounded-full text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-md"
          >
            <Calendar className="w-4 h-4 text-emerald-100" />
            Book Appointment
          </button>
        </div>

        {/* Main 2-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">

          {/* LEFT: Doctor Photo */}
          <div className="lg:col-span-4">
            <div className="relative rounded-[32px] overflow-hidden bg-gradient-to-b from-white to-teal-50/40 border border-white/90 shadow-[0_16px_50px_rgba(0,168,150,0.08)] p-2 backdrop-blur-xl">
              <div className="rounded-[26px] overflow-hidden bg-slate-100">
                <img
                  src={ABOUT_DOCTOR_IMG}
                  alt="Dr. Nilay Saha — Dental Surgeon & Oral Physician"
                  loading="lazy"
                  className="w-full object-cover object-top"
                  style={{ maxHeight: "420px", objectPosition: "center 10%" }}
                />
              </div>

              <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-3">
                <div className="glass-crystal px-3.5 py-2.5 rounded-2xl border border-white/90 shadow-md">
                  <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wide">Qualification</div>
                  <div className="text-xs font-extrabold text-slate-900">BDS, FIE</div>
                </div>
                <div className="bg-[#00A896] rounded-2xl px-3.5 py-2.5 shadow-md">
                  <div className="text-[10px] text-teal-100 font-semibold uppercase tracking-wide">Reg. No.</div>
                  <div className="text-xs font-extrabold text-white">{DOCTOR_REGISTRATION_NUMBER}</div>
                </div>
              </div>
            </div>

            {/* Quick stats below photo */}
            <div className="mt-4 grid grid-cols-3 gap-3">
              {[
                { label: "Experience", value: `${doctor.experience_years || 10}+ yrs` },
                { label: "Languages", value: languages.slice(0, 2).join(", ") },
                { label: "Centers", value: "2 Clinics" },
              ].map((stat) => (
                <div key={stat.label} className="bg-white/80 backdrop-blur-xl border border-white/90 rounded-[20px] p-3.5 text-center shadow-[0_4px_20px_rgba(15,23,42,0.03)]">
                  <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wide">{stat.label}</div>
                  <div className="text-xs font-extrabold text-slate-900 mt-0.5">{stat.value}</div>
                </div>
              ))}
            </div>

            {/* Clinics strip */}
            <div className="mt-4 bg-white/80 backdrop-blur-xl border border-white/90 rounded-[20px] p-4 flex items-center gap-3 shadow-[0_4px_20px_rgba(15,23,42,0.03)]">
              <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-[#00A896] shrink-0">
                <MapPin className="w-4.5 h-4.5" />
              </div>
              <div>
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">Consulting Clinics</div>
                <div className="text-xs font-extrabold text-slate-900">Belerhat &bull; Nabadwip</div>
              </div>
            </div>
          </div>

          {/* RIGHT: Bio + Tabs */}
          <div className="lg:col-span-8 flex flex-col gap-6">

            {/* Bio */}
            <div className="bg-white/80 backdrop-blur-2xl border border-white/90 rounded-[28px] p-6 sm:p-8 shadow-[0_10px_35px_rgba(15,23,42,0.04)]">
              <div className="flex items-center gap-2 mb-4">
                <BadgeCheck className="w-5 h-5 text-[#00A896]" />
                <h3 className="font-display font-extrabold text-lg text-slate-900">Clinical Biography &amp; Philosophy</h3>
              </div>
              <p className={`text-slate-600 text-sm sm:text-base leading-[1.75] font-normal transition-all duration-300 ${bioExpanded ? "" : "line-clamp-4"}`}>
                {aboutConfig.description || doctor.bio || "Dr. Nilay Saha is a leading Dental Surgeon and Oral Physician dedicated to providing painless, highly precise dental treatments. With over a decade of hands-on experience across clinical centers in West Bengal, he specializes in single-visit root canal treatments, aesthetic restorations, and complex surgical procedures. His clinical approach emphasizes conservative dentistry—saving natural teeth wherever possible—while utilizing international sterilization standards and modern diagnostics to ensure optimum patient safety and comfort."}
              </p>
              <button
                type="button"
                onClick={() => setBioExpanded(!bioExpanded)}
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-[#00A896] hover:text-[#028090] cursor-pointer"
              >
                {bioExpanded ? "Show Less" : "Read Full Biography"}
                {bioExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5 pt-5 border-t border-slate-100">
                <div className="bg-teal-50/50 border border-teal-100 rounded-[16px] p-3">
                  <span className="text-[10px] text-slate-500 font-semibold block uppercase tracking-wide">Registration</span>
                  <strong className="text-xs text-slate-900 font-mono">{DOCTOR_REGISTRATION_NUMBER}</strong>
                </div>
                <div className="bg-teal-50/50 border border-teal-100 rounded-[16px] p-3">
                  <span className="text-[10px] text-slate-500 font-semibold block uppercase tracking-wide">Languages</span>
                  <strong className="text-xs text-slate-900">{languages.join(", ")}</strong>
                </div>
                <div className="bg-teal-50/50 border border-teal-100 rounded-[16px] p-3">
                  <span className="text-[10px] text-slate-500 font-semibold block uppercase tracking-wide">Active Centers</span>
                  <strong className="text-xs text-[#00A896]">2 Clinic Locations</strong>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white/80 backdrop-blur-2xl border border-white/90 rounded-[28px] p-6 sm:p-8 shadow-[0_10px_35px_rgba(15,23,42,0.04)]">
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
                      className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                        activeTab === tab.id
                          ? "bg-gradient-to-r from-[#00A896] to-[#028090] text-white shadow-md shadow-teal-500/20"
                          : "bg-slate-100/80 text-slate-600 hover:text-slate-900 hover:bg-teal-50"
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
                  <div key={idx} className="flex items-start gap-3 p-4 rounded-[20px] bg-slate-50/80 border border-slate-100">
                    <div className="w-9 h-9 rounded-xl bg-teal-50 text-[#00A896] border border-teal-100 flex items-center justify-center shrink-0">
                      <GraduationCap className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{item.title}</h4>
                      <p className="text-xs font-semibold text-[#00A896] mt-0.5">{item.institution}</p>
                    </div>
                  </div>
                ))}

                {activeTab === "specializations" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {specializations.map((spec, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-4 rounded-[20px] bg-slate-50/80 border border-slate-100">
                        <CheckCircle2 className="w-4.5 h-4.5 text-[#00A896] shrink-0" />
                        <span className="text-sm font-semibold text-slate-900">{spec}</span>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === "awards" && awards.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-4 rounded-[20px] bg-slate-50/80 border border-slate-100">
                    <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center shrink-0">
                      <Award className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{item.title}</h4>
                      <p className="text-xs font-semibold text-amber-600 mt-0.5">{item.institution}</p>
                    </div>
                  </div>
                ))}

                {activeTab === "memberships" && certifications.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-4 rounded-[20px] bg-slate-50/80 border border-slate-100">
                    <div className="w-9 h-9 rounded-xl bg-teal-50 text-[#00A896] border border-teal-100 flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{item.title}</h4>
                      <p className="text-xs font-semibold text-[#00A896] mt-0.5">{item.institution}</p>
                    </div>
                  </div>
                ))}

                {activeTab === "journey" && (
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-4 rounded-[20px] bg-slate-50/80 border border-slate-100">
                      <div className="w-3 h-3 rounded-full bg-[#00A896] mt-1 shrink-0" />
                      <div>
                        <span className="text-xs font-mono text-[#00A896] font-bold">2014 - Present</span>
                        <h4 className="font-bold text-slate-900 text-sm mt-0.5">Principal Surgeon &amp; Clinical Director</h4>
                        <p className="text-xs text-slate-600 mt-1">Founded and expanded regional clinical centers across Belerhat and Nabadwip with zero-compromise sterilization protocols.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 rounded-[20px] bg-slate-50/80 border border-slate-100">
                      <div className="w-3 h-3 rounded-full bg-amber-500 mt-1 shrink-0" />
                      <div>
                        <span className="text-xs font-mono text-amber-600 font-bold">Clinical Residency</span>
                        <h4 className="font-bold text-slate-900 text-sm mt-0.5">Fellowship &amp; Advanced Endodontic Training</h4>
                        <p className="text-xs text-slate-600 mt-1">Specialized in micro-endodontics, rotary instrumentation, and single-visit painless root canal therapy.</p>
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
