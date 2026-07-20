import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowLeft, Shield, FileText, Sparkles, CheckCircle2 } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { PRIVACY_POLICY_DRAFT, TERMS_AND_CONDITIONS_DRAFT } from "../data/legalDrafts";

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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const getContent = () => {
    switch (type) {
      case "privacy":
        return {
          title: "Privacy Policy",
          subtitle: "Clinical confidentiality and secure handling of patient scheduling records.",
          icon: Shield,
          text: PRIVACY_POLICY_DRAFT
        };
      case "terms":
        return {
          title: "Terms & Conditions",
          subtitle: "Guidelines governing appointment scheduling, patient notifications, and medical disclaimers.",
          icon: FileText,
          text: TERMS_AND_CONDITIONS_DRAFT
        };
      case "tips":
        return {
          title: "Dental Tips & Hygiene Guides",
          subtitle: "Expert dental health recommendations from Dr. Nilay Saha for premium home care.",
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

  // Simple parser to render markdown-like drafts into beautifully formatted HTML paragraphs/sections
  const renderFormattedDraft = (text: string) => {
    return text.split("\n\n").map((paragraph, index) => {
      if (paragraph.startsWith("##")) {
        return (
          <h2 key={index} className="text-xl sm:text-2xl font-display font-bold text-[#0F172A] mt-8 mb-4 border-b border-slate-200/50 pb-2">
            {paragraph.replace("##", "").trim()}
          </h2>
        );
      } else if (paragraph.startsWith("#")) {
        return null; // Suppress main title since we render it in the hero header
      } else {
        return (
          <p key={index} className="text-sm sm:text-base text-[#475569] leading-[1.7] mb-4 font-normal">
            {paragraph.trim()}
          </p>
        );
      }
    });
  };

  return (
    <div className="min-h-screen text-[#0F172A] font-sans bg-[#F8FBFF] flex flex-col justify-between">
      <div>
        <Navbar />
        
        {/* Main Content Area */}
        <main className="pt-32 sm:pt-36 pb-24 relative z-10 px-5 sm:px-8 max-w-4xl mx-auto w-full">
          
          {/* Back Navigation */}
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-sm text-[#2563EB] hover:text-[#1D4ED8] font-semibold transition-all mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            <span>Back to Home</span>
          </Link>

          {/* Page Title Card */}
          <div className="glass-3 rounded-[2rem] border border-white/80 p-8 sm:p-12 shadow-[0_16px_48px_rgba(15,23,42,0.04)] mb-10 flex flex-col sm:flex-row sm:items-center gap-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.02] to-transparent pointer-events-none" />
            <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200 text-[#2563EB] flex items-center justify-center shrink-0 shadow-sm">
              <PageIcon className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-display font-bold text-[#0F172A] tracking-tight">{pageData.title}</h1>
              <p className="text-sm sm:text-base text-[#64748B] leading-relaxed mt-2 font-normal">{pageData.subtitle}</p>
            </div>
          </div>

          {/* Render Body */}
          <div className="glass-3 rounded-[2rem] border border-white/80 p-8 sm:p-12 shadow-[0_16px_48px_rgba(15,23,42,0.04)] relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.01] to-transparent pointer-events-none" />
            
            {type === "tips" ? (
              <div className="space-y-10">
                <p className="text-sm sm:text-base text-[#475569] leading-relaxed mb-6 font-normal">
                  Maintaining pristine dental hygiene at home is the foundation of a lifelong, radiant smile. Follow these clinical recommendations curated by Dr. Nilay Saha:
                </p>
                <div className="grid grid-cols-1 gap-8">
                  {DENTAL_TIPS.map((tip, idx) => (
                    <div key={idx} className="flex gap-4 items-start border-l-2 border-blue-500/30 pl-4 sm:pl-6 py-1">
                      <CheckCircle2 className="w-5 h-5 text-[#2563EB] shrink-0 mt-1" />
                      <div>
                        <h3 className="text-lg font-display font-bold text-[#0F172A] mb-2">{tip.title}</h3>
                        <p className="text-sm sm:text-base text-[#475569] leading-[1.7] font-normal">{tip.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="prose max-w-none text-[#475569]">
                {renderFormattedDraft(pageData.text)}
              </div>
            )}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
