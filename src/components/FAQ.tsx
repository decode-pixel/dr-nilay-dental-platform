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
    <section id="faq" className="relative py-24 z-10 overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl mb-6 shadow-[0_0_20px_rgba(139,92,246,0.15)]">
            <MessageCircleQuestion className="w-4 h-4 text-violet-400" />
            <span className="text-sm font-medium text-gray-200 uppercase tracking-wider">FAQ</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6">
            Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-blue-400">Questions</span>
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed max-w-2xl mx-auto">
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
                className={`glass-panel rounded-2xl overflow-hidden border transition-colors duration-300 ${
                  isOpen ? 'border-violet-500/30 shadow-[0_8px_32px_rgba(139,92,246,0.15)]' : 'border-white/10 hover:border-white/20'
                }`}
              >
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full flex items-center justify-between p-6 sm:p-8 text-left focus:outline-none group"
                >
                  <h3 className={`text-lg sm:text-xl font-heading font-semibold pr-8 transition-colors duration-300 ${isOpen ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>
                    {faq.question}
                  </h3>
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300 ${isOpen ? 'bg-violet-500/20 border-violet-500/30 text-violet-300' : 'bg-white/5 border-white/10 text-gray-400 group-hover:bg-white/10'}`}>
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
                        <div className="w-full h-px bg-white/10 mb-6"></div>
                        <p className="text-gray-400 text-base leading-relaxed">
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
