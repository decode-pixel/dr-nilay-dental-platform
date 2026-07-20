import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, MessageCircleQuestion } from "lucide-react";
import TagPill from "./TagPill";

const faqData = [
  {
    question: "How often should I visit the dentist?",
    answer: "For optimal oral health, we recommend visiting the dentist every 6 months for a routine checkup and professional cleaning. However, if you have specific dental conditions, we may suggest more frequent visits."
  },
  {
    question: "Is root canal treatment painful?",
    answer: "With modern techniques and advanced local anesthesia, a root canal is typically no more uncomfortable than getting a standard filling. Our clinic specializes in gentle, pain-free endodontic care."
  },
  {
    question: "What should I do in a dental emergency?",
    answer: "In case of a dental emergency—such as a severe toothache, knocked-out tooth, or broken restoration—please call our clinic immediately. We prioritize urgent cases to provide fast relief and care."
  },
  {
    question: "Do you accept digital payments?",
    answer: "Yes, we accept all major digital payments, UPI, and major credit/debit cards for your convenience."
  },
  {
    question: "At what age should a child first visit the dentist?",
    answer: "We recommend that a child's first dental visit should occur within six months after their first tooth erupts, or no later than their first birthday, to establish good oral hygiene habits early."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="relative py-24 sm:py-32 z-10 overflow-hidden font-sans">
      <div className="max-w-4xl mx-auto px-5 sm:px-8">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16 sm:mb-24"
        >
          <TagPill icon={MessageCircleQuestion} text="FAQ" />
          <h2 className="text-[36px] sm:text-[48px] lg:text-[56px] font-display font-bold text-[#0F172A] tracking-tight leading-[1.12] mb-5">
            Frequently Asked <span className="text-[#2563EB]">Questions</span>
          </h2>
          <p className="text-[#475569] text-base sm:text-lg leading-[1.65] max-w-2xl mx-auto font-normal">
            Find answers to common questions about our clinical treatments, appointments, hygiene standards, and dental care.
          </p>
        </motion.div>

        {/* Accordion */}
        <div className="space-y-4 sm:space-y-5">
          {faqData.map((faq, index) => {
            const isOpen = openIndex === index;
            
            return (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className={`rounded-2xl sm:rounded-[2rem] overflow-hidden transition-all duration-300 border ${
                  isOpen 
                    ? 'glass-3 border-blue-500/40 shadow-[0_16px_48px_rgba(37,99,235,0.08)] bg-white/95' 
                    : 'glass-2 border-white/70 hover:border-blue-400/50 shadow-sm hover:shadow-md'
                }`}
              >
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full flex items-center justify-between p-6 sm:p-8 text-left focus:outline-none group"
                >
                  <h3 className={`text-base sm:text-lg lg:text-xl font-display font-semibold pr-8 transition-colors duration-300 ${isOpen ? 'text-[#2563EB]' : 'text-[#0F172A] group-hover:text-[#2563EB]'}`}>
                    {faq.question}
                  </h3>
                  <div className={`flex-shrink-0 w-10 h-10 rounded-2xl border flex items-center justify-center transition-all duration-300 ${isOpen ? 'bg-blue-500/15 border-blue-500/30 text-[#2563EB]' : 'bg-slate-100/80 border-slate-200/80 text-slate-500 group-hover:bg-blue-50 group-hover:text-[#2563EB]'}`}>
                    <ChevronDown className={`w-5 h-5 transition-transform duration-350 ease-out ${isOpen ? 'rotate-180' : 'rotate-0'}`} />
                  </div>
                </button>
                
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div className="px-6 sm:px-8 pb-8 pt-0">
                        <div className="w-full h-px bg-slate-200/70 mb-6" />
                        <p className="text-[#475569] text-base sm:text-lg leading-[1.65]">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
        
      </div>
    </section>
  );
}
