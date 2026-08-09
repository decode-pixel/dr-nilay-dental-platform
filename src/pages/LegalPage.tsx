import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowLeft, Shield, FileText, Sparkles, CheckCircle2, ChevronRight } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { PRIVACY_POLICY_TEXT, TERMS_AND_CONDITIONS_TEXT } from "../data/legalDrafts";

interface LegalPageProps {
  type: "privacy" | "terms" | "tips";
}

const DENTAL_TIPS = [
  {
    title: "1. Advanced Brushing Technique",
    content: "Hold your brush at a 45-degree angle to your gums and use gentle, circular motions instead of harsh sawing back and forth. Clean the outer, inner, and chewing surfaces of every tooth. Brush for a full two minutes twice daily."
  },
  {
    title: "2. Consistent Daily Flossing",
    content: "Flossing removes plaque, bacteria, and food particles from tight interdental spaces that standard toothbrush bristles cannot reach. Use clean segments of floss daily, curved in a C-shape around each tooth."
  },
  {
    title: "3. Hydration & Saliva Production",
    content: "Drink plenty of water throughout the day, especially after meals. Water rinses away food debris and stimulates saliva production—your mouth's natural defense mechanism against acids and tooth decay."
  },
  {
    title: "4. Preventive Dental Inspections",
    content: "Clinical checkups and professional scaling every 6 months are crucial for detecting underlying micro-cavities and keeping gums healthy. Early diagnostic care prevents complex procedures later."
  },
  {
    title: "5. Mindful Sugar & Acid Intake",
    content: "Limit carbonated drinks, sticky candies, and acidic juices. If consumed, rinse your mouth with water immediately, and wait at least 30 minutes before brushing to allow your tooth enamel to re-mineralize."
  }
];

export default function LegalPage({ type }: LegalPageProps) {
  const { pathname } = useLocation();
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const getContent = () => {
    switch (type) {
      case "privacy":
        return {
          title: "Privacy Policy",
          subtitle: "Clinical confidentiality and secure handling of patient records.",
          icon: Shield,
          text: PRIVACY_POLICY_TEXT
        };
      case "terms":
        return {
          title: "Terms & Conditions",
          subtitle: "Guidelines governing appointments, billing, and medical disclaimers.",
          icon: FileText,
          text: TERMS_AND_CONDITIONS_TEXT
        };
      case "tips":
        return {
          title: "Dental Hygiene Guides",
          subtitle: "Expert dental health recommendations for premium home care.",
          icon: Sparkles,
          text: ""
        };
      default:
        return {
          title: "Legal Information",
          subtitle: "Dr. Nilay Saha Dental Platform policy guidelines.",
          icon: FileText,
          text: ""
        };
    }
  };

  const pageData = getContent();
  const PageIcon = pageData.icon;

  // Extract sections for the Table of Contents
  const sections = type === "tips" 
    ? DENTAL_TIPS.map(tip => tip.title)
    : pageData.text
        .split("\n\n")
        .filter(p => p.startsWith("## "))
        .map(p => p.replace("## ", "").trim());

  useEffect(() => {
    if (sections.length > 0 && !activeSection) {
      setActiveSection(sections[0]);
    }
  }, [sections, activeSection]);

  const handleScrollToSection = (sectionTitle: string) => {
    setActiveSection(sectionTitle);
    const element = document.getElementById("section-" + sectionTitle.replace(/\s+/g, '-').toLowerCase());
    if (element) {
      const yOffset = -120; 
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const renderFormattedDraft = (text: string) => {
    return text.split("\n\n").map((paragraph, index) => {
      if (paragraph.startsWith("## ")) {
        const title = paragraph.replace("## ", "").trim();
        const id = "section-" + title.replace(/\s+/g, '-').toLowerCase();
        return (
          <h2 id={id} key={index} className="text-xl sm:text-2xl font-display font-bold text-[#0F172A] mt-10 mb-4 tracking-tight">
            {title}
          </h2>
        );
      } else {
        return (
          <p key={index} className="text-[16px] sm:text-[17px] text-slate-600 leading-[1.8] mb-5 font-normal">
            {paragraph.trim()}
          </p>
        );
      }
    });
  };

  return (
    <div className="min-h-screen text-[#0F172A] font-sans bg-[#F6F9F8] flex flex-col justify-between">
      <div>
        <Navbar />
        
        {/* Main Content Area */}
        <main className="pt-32 sm:pt-40 pb-24 relative z-10 px-5 sm:px-8 max-w-6xl mx-auto w-full">
          
          {/* Back Navigation */}
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-sm text-[#10B981] hover:text-[#059669] font-bold transition-all mb-8 group bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to Home</span>
          </Link>

          {/* Page Title Card (Liquid Glass style) */}
          <div className="rounded-[32px] bg-white/70 backdrop-blur-xl border border-white p-8 sm:p-12 shadow-[0_8px_32px_rgba(0,0,0,0.04)] mb-12 flex flex-col sm:flex-row sm:items-center gap-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-100/40 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/3" />
            
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 text-[#10B981] flex items-center justify-center shrink-0 shadow-sm relative z-10">
              <PageIcon className="w-7 h-7" />
            </div>
            <div className="relative z-10">
              <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-[#0F172A] tracking-tight">{pageData.title}</h1>
              <p className="text-base sm:text-lg text-slate-500 leading-relaxed mt-3 font-medium max-w-xl">{pageData.subtitle}</p>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-10">
            {/* Sidebar Table of Contents */}
            <aside className="lg:w-[320px] shrink-0">
              <div className="sticky top-32 rounded-[24px] bg-white/60 backdrop-blur-md border border-slate-200/60 p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 px-2">Table of Contents</h3>
                <nav className="flex flex-col gap-1">
                  {sections.map((section, idx) => {
                    const isActive = activeSection === section;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleScrollToSection(section)}
                        className={"flex items-center justify-between text-left px-3 py-2.5 rounded-xl transition-all duration-200 " + (isActive ? "bg-emerald-50 text-[#10B981] font-bold" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium")}
                      >
                        <span className="text-[14px]">{section}</span>
                        {isActive && <ChevronRight className="w-4 h-4 text-[#10B981]" />}
                      </button>
                    );
                  })}
                </nav>
              </div>
            </aside>

            {/* Content Body */}
            <article className="flex-1 rounded-[32px] bg-white border border-slate-200/50 p-8 sm:p-12 shadow-[0_8px_32px_rgba(0,0,0,0.03)] relative overflow-hidden">
              <div className="prose max-w-none">
                {type === "tips" ? (
                  <div className="space-y-12">
                    <p className="text-[16px] sm:text-[18px] text-slate-600 leading-relaxed mb-8 font-medium">
                      Maintaining pristine dental hygiene at home is the foundation of a lifelong, radiant smile. Follow these clinical recommendations curated by Dr. Nilay Saha:
                    </p>
                    <div className="grid grid-cols-1 gap-10">
                      {DENTAL_TIPS.map((tip, idx) => {
                        const id = "section-" + tip.title.replace(/\s+/g, '-').toLowerCase();
                        return (
                          <div id={id} key={idx} className="flex gap-4 sm:gap-6 items-start">
                            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center shrink-0 border border-emerald-100 mt-1">
                              <CheckCircle2 className="w-5 h-5 text-[#10B981]" />
                            </div>
                            <div>
                              <h3 className="text-xl sm:text-2xl font-display font-bold text-[#0F172A] mb-3 tracking-tight">{tip.title}</h3>
                              <p className="text-[16px] sm:text-[17px] text-slate-600 leading-[1.8] font-normal">{tip.content}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-8 pb-4 border-b border-slate-100">
                      Last Updated: July 2026
                    </p>
                    {renderFormattedDraft(pageData.text)}
                  </div>
                )}
              </div>
            </article>
          </div>

        </main>
      </div>

      <Footer />
    </div>
  );
}
