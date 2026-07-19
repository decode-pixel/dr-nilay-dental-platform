import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, MessageCircleQuestion } from "lucide-react";

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
    <section id="faq" className="relative py-20 sm:py-24 z-10 overflow-hidden font-sans">
      <div className="max-w-4xl mx-auto px-5 sm:px-8">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16 sm:mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-1 mb-4 text-[#8B7BF7] text-xs font-semibold uppercase tracking-widest">
            <MessageCircleQuestion className="w-4 h-4 text-[#8B7BF7]" />
            <span>FAQ</span>
          </div>
          <h2 className="text-[36px] sm:text-[48px] lg:text-[56px] font-display font-bold text-[#F5F5F7] tracking-tight leading-[1.12] mb-5">
            Frequently Asked <span className="text-[#8B7BF7]">Questions</span>
          </h2>
          <p className="text-[#A1A1A6] text-base sm:text-lg leading-[1.6] max-w-2xl mx-auto font-normal">
            Find answers to common questions about our treatments, appointments, and dental care.
          </p>
        </motion.div>

        {/* Accordion */}
        <div className="space-y-4">
          {faqData.map((faq, index) => {
            const isOpen = openIndex === index;
            
            return (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`rounded-2xl sm:rounded-3xl overflow-hidden border transition-all duration-300 ${
                  isOpen ? 'glass-2 border-[#8B7BF7]/30 shadow-[0_12px_32px_rgba(139,123,247,0.15)]' : 'glass-1 border-white/10 hover:border-white/20'
                }`}
              >
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full flex items-center justify-between p-6 sm:p-8 text-left focus:outline-none group"
                >
                  <h3 className={`text-base sm:text-lg lg:text-xl font-display font-semibold pr-8 transition-colors duration-300 ${isOpen ? 'text-[#F5F5F7]' : 'text-gray-300 group-hover:text-white'}`}>
                    {faq.question}
                  </h3>
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300 ${isOpen ? 'bg-[#8B7BF7]/20 border-[#8B7BF7]/30 text-[#8B7BF7]' : 'bg-white/5 border-white/10 text-gray-400 group-hover:bg-white/10'}`}>
                    <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`} />
                  </div>
                </button>
                
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 sm:px-8 pb-8 pt-0">
                        <div className="w-full h-px bg-white/10 mb-6" />
                        <p className="text-[#A1A1A6] text-sm sm:text-base leading-[1.6]">
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
