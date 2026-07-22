import React, { useState } from "react";
import { ChevronDown, MessageCircleQuestion } from "lucide-react";
import TagPill from "./TagPill";

const faqData = [
  {
    question: "How often should I visit Dr. Nilay Saha for a checkup?",
    answer: "For optimal oral health and prevention, we recommend visiting every 6 months for a routine digital RVG checkup and professional scaling. If you have active gum conditions or ongoing restorative work, your tailored schedule will guide you."
  },
  {
    question: "Is single-visit root canal treatment completely painless?",
    answer: "Yes. Using rotary endodontic motors, micro-instrumentation, and modern local anesthetics, single-visit root canal therapy is precise, quick, and virtually painless—typically feeling no more uncomfortable than a standard filling."
  },
  {
    question: "How are surgical and dental instruments sterilized?",
    answer: "We follow strict Class-B autoclaving and multi-tier WHO aseptic sterilization standards. Every instrument is packaged, sterilized under high-pressure steam, and opened directly in front of the patient during the appointment."
  },
  {
    question: "What should I do if I have a severe dental emergency?",
    answer: "In the event of acute toothache, trauma, or swelling, contact our clinic directly via phone. We prioritize urgent clinical cases across Belerhat, Parulia, and Nabadwip to provide fast pain relief."
  },
  {
    question: "Do you accept digital payments and insurance queries?",
    answer: "Yes, we accept all major UPI platforms, debit/credit cards, and cash. We also provide complete itemized clinical receipts and documentation for any corporate or personal health insurance claims."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 sm:py-28 bg-white font-sans border-b border-slate-200/60 scroll-mt-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-18">
          <TagPill icon={MessageCircleQuestion} text="Common Patient Questions" />
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-[#0F172A] tracking-tight mt-3 mb-4 leading-tight">
            Frequently Asked <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0284C7] to-[#0EA5E9]">
              Clinical Questions
            </span>
          </h2>
          <p className="text-base sm:text-lg text-[#475569] leading-relaxed max-w-2xl mx-auto font-normal">
            Find clear answers about our painless endodontic procedures, sterilization protocols, appointments, and regional centers.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4 sm:space-y-5">
          {faqData.map((faq, index) => {
            const isOpen = openIndex === index;
            
            return (
              <div
                key={index}
                className={`transition-all duration-300 rounded-[20px] overflow-hidden ${
                  isOpen
                    ? "border border-sky-300 bg-gradient-to-b from-sky-50/60 via-white to-white shadow-[0_12px_35px_rgba(2,132,199,0.10)]"
                    : "bg-white border border-slate-200/80 hover:border-sky-300 shadow-2xs hover:shadow-md"
                }`}
              >
                <button
                  onClick={() => toggleAccordion(index)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between p-6 sm:p-7 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0284C7] rounded-[20px] group cursor-pointer"
                >
                  <h3 className={`text-lg sm:text-[20px] font-display font-bold pr-6 transition-colors leading-snug ${
                    isOpen ? "text-[#0284C7]" : "text-[#0F172A] group-hover:text-[#0284C7]"
                  }`}>
                    {faq.question}
                  </h3>
                  <div className={`flex-shrink-0 w-11 h-11 rounded-2xl border flex items-center justify-center transition-all duration-300 ${
                    isOpen
                      ? "bg-[#0284C7] border-[#0284C7] text-white rotate-180"
                      : "bg-sky-50 border-sky-200 text-[#0284C7] group-hover:bg-[#0284C7] group-hover:text-white"
                  }`}>
                    <ChevronDown className="w-5 h-5 transition-transform duration-300" />
                  </div>
                </button>
                
                {isOpen && (
                  <div className="px-6 sm:px-7 pb-7 pt-1 animate-fadeIn">
                    <div className="w-full h-px bg-slate-100 mb-4" />
                    <p className="text-xs sm:text-sm text-[#334155] leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still have questions CTA */}
        <div className="mt-12 text-center">
          <p className="text-xs sm:text-sm text-[#475569]">
            Have a specific clinical question not listed above?{" "}
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent("openContactModal"))}
              className="font-extrabold text-[#0284C7] hover:text-[#0369A1] underline underline-offset-4 cursor-pointer"
            >
              Consult directly with our medical team
            </button>
          </p>
        </div>
        
      </div>
    </section>
  );
}
