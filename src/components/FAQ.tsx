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
      <div className="max-w-4xl mx-auto px-5 sm:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-18">
          <TagPill icon={MessageCircleQuestion} text="Common Questions" />
          <h2 className="h2-premium mt-3 mb-4">
            Frequently Asked <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10B981] to-[#059669]">
              Clinical Questions
            </span>
          </h2>
          <p className="body-premium max-w-2xl mx-auto">
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
                className={`card-premium transition-all duration-300 ${
                  isOpen
                    ? "border-emerald-400/80 bg-gradient-to-b from-emerald-50/40 via-white to-white shadow-md"
                    : "bg-white hover:border-emerald-300/60 shadow-sm"
                }`}
              >
                <button
                  onClick={() => toggleAccordion(index)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between p-6 sm:p-7 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#10B981] rounded-2xl group cursor-pointer"
                >
                  <h3 className={`text-lg sm:text-[22px] font-display font-semibold pr-6 transition-colors leading-snug ${
                    isOpen ? "text-[#10B981]" : "text-[#122820] group-hover:text-[#10B981]"
                  }`}>
                    {faq.question}
                  </h3>
                  <div className={`flex-shrink-0 w-11 h-11 rounded-2xl border flex items-center justify-center transition-all duration-300 ${
                    isOpen
                      ? "bg-[#10B981] border-[#10B981] text-white rotate-180"
                      : "bg-emerald-50/80 border-emerald-200/80 text-[#10B981] group-hover:bg-[#10B981] group-hover:text-white"
                  }`}>
                    <ChevronDown className="w-5 h-5 transition-transform duration-300" />
                  </div>
                </button>
                
                {isOpen && (
                  <div className="px-6 sm:px-7 pb-7 pt-1 animate-fadeIn">
                    <div className="w-full h-px bg-slate-100 mb-5" />
                    <p className="small-premium text-xs sm:text-sm leading-relaxed">
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
          <p className="text-xs sm:text-sm text-[#4B6358]">
            Have a specific clinical question not listed above?{" "}
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent("openContactModal"))}
              className="font-bold text-[#10B981] hover:text-[#059669] underline underline-offset-4 cursor-pointer"
            >
              Consult directly with our team
            </button>
          </p>
        </div>
        
      </div>
    </section>
  );
}
