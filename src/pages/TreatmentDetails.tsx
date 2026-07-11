import React, { useEffect, useState } from "react";
import { useParams, Link, Navigate, useNavigate } from "react-router-dom";
import { treatmentsData } from "../data/treatments";
import { motion, AnimatePresence, useScroll, useSpring } from "motion/react";
import Clinics from "../components/Clinics";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import ContactModal from "../components/ContactModal";
import SEO from "../components/SEO";
import { 
  ChevronRight, CalendarDays, ArrowRight, ShieldCheck, 
  Stethoscope, MapPin, Phone, Star, Activity, Plus, Minus,
  AlertCircle, CheckCircle, Flame, Droplet, Zap, HeartPulse
} from "lucide-react";
import { WhatsAppIcon, ToothIcon } from "../components/Icons";
import * as LucideIcons from "lucide-react";

// Helper to render dynamic icon
const getIcon = (iconName: string) => {
  if (iconName === "ToothIcon") return ToothIcon;
  const IconComponent = (LucideIcons as any)[iconName];
  return IconComponent || LucideIcons.HelpCircle;
};

// Map some random icons for symptoms
const symptomIcons = [Flame, Zap, AlertCircle, HeartPulse, Droplet, Activity];

export default function TreatmentDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const treatment = treatmentsData.find(t => t.id === id);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!treatment) {
    return <Navigate to="/" />;
  }

  const Icon = getIcon(treatment.iconName);

  // Get related treatments objects
  const relatedTreatments = treatmentsData.filter(t => treatment.relatedTreatments.includes(t.id));

  const handleBook = () => {
    window.dispatchEvent(new CustomEvent('openContactModal'));
  };

  const pageUrl = `${window.location.origin}/treatments/${treatment.id}`;
  
  const schemaData = [
    {
      "@context": "https://schema.org",
      "@type": "MedicalBusiness",
      "name": "Dr. Nilay Saha Dental Clinic",
      "image": "https://res.cloudinary.com/tud0sobq/image/upload/v1731674400/og_image.jpg",
      "url": window.location.origin,
      "telephone": "+919609180979"
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": window.location.origin
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Treatments",
          "item": `${window.location.origin}/#treatments`
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": treatment.name,
          "item": pageUrl
        }
      ]
    }
  ];

  if (treatment.faqs && treatment.faqs.length > 0) {
    schemaData.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": treatment.faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    } as any);
  }

  return (
    <div className="min-h-screen text-white font-sans overflow-x-hidden selection:bg-violet-500/30 relative">
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 to-blue-500 transform origin-left z-[100]"
        style={{ scaleX }}
      />
      <SEO 
        title={treatment.name} 
        description={treatment.desc} 
        url={pageUrl} 
        schemaData={schemaData} 
      />
      
      <Navbar />

      <main className="pt-24 pb-0 relative z-10">
        
        {/* SECTION 1: Premium Hero */}
        <section className="relative pt-12 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-8 mt-8">
            <Link to="/" className="hover:text-violet-400 transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link to="/" onClick={(e) => { e.preventDefault(); navigate('/'); setTimeout(()=>document.getElementById('treatments')?.scrollIntoView(), 100);}} className="hover:text-violet-400 transition-colors">Treatments</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white font-medium">{treatment.name}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl mb-6 shadow-[0_0_20px_rgba(139,92,246,0.15)]">
                <Icon className="w-4 h-4 text-violet-400" />
                <span className="text-sm font-medium text-gray-200 uppercase tracking-wider">Premium Care</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-heading font-bold text-white mb-6 leading-tight">
                {treatment.name}
              </h1>
              <p className="text-xl text-gray-300 mb-10 leading-relaxed">
                {treatment.desc}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={handleBook} className="btn-sweep flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-violet-600 to-blue-600 text-white font-medium border border-white/10 shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:shadow-[0_0_40px_rgba(139,92,246,0.7)] hover:-translate-y-1 transition-all duration-300">
                  <CalendarDays className="w-5 h-5" />
                  Schedule Visit
                </button>
                <a href="https://wa.me/919609180979" target="_blank" rel="noreferrer" className="btn-sweep flex items-center justify-center gap-3 px-8 py-4 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm text-white font-medium hover:bg-white/10 hover:-translate-y-1 transition-all duration-300">
                  <WhatsAppIcon className="w-5 h-5" />
                  WhatsApp
                </a>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-violet-600/20 to-blue-600/20 rounded-[3rem] blur-3xl"></div>
              <div className="glass-panel relative aspect-square rounded-[3rem] overflow-hidden flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                <Icon className="w-48 h-48 text-white/20 drop-shadow-[0_0_50px_rgba(139,92,246,0.5)]" strokeWidth={1} />
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-blue-500/10 pointer-events-none"></div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* SECTION 2: What Is This Treatment? */}
        <section className="py-24 bg-black/40 border-y border-white/5">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-5xl font-heading font-bold mb-8">
              What is <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-blue-400">{treatment.name}?</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
              {treatment.longDescription}
            </p>
          </div>
        </section>

        {/* SECTION 3: When Do You Need This Treatment? */}
        <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="absolute top-1/2 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>
          
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Common Symptoms</h2>
            <p className="text-gray-400 text-lg">Signs you might need this treatment</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {treatment.symptoms.map((symptom, idx) => {
              const SymptomIcon = symptomIcons[idx % symptomIcons.length];
              return (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="glass-panel p-6 rounded-2xl hover:bg-white/5 hover:-translate-y-1 transition-all duration-300 flex items-start gap-4 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center shrink-0 group-hover:bg-violet-500/20 transition-colors border border-violet-500/20">
                    <SymptomIcon className="w-6 h-6 text-violet-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-violet-300 transition-colors">{symptom}</h3>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </section>

        {/* SECTION 4: Treatment Benefits */}
        <section className="py-24 bg-white/[0.02] border-y border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Treatment Benefits</h2>
              <p className="text-gray-400 text-lg">Why choose this procedure</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {treatment.benefits.map((benefit, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-center gap-4 p-6 glass-panel bg-gradient-to-r from-white/5 to-transparent rounded-2xl border border-white/10 hover:border-violet-500/30 transition-colors duration-300"
                >
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center shrink-0 border border-green-500/30">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  </div>
                  <span className="text-lg text-gray-200 font-medium">{benefit}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 5: Treatment Process */}
        <section className="py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Treatment Process</h2>
            <p className="text-gray-400 text-lg">What to expect during your visit</p>
          </div>
          
          <div className="relative border-l border-white/10 ml-6 md:ml-12 space-y-16">
            {treatment.process.map((step, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="relative pl-10 md:pl-16"
              >
                <div className="absolute -left-6 w-12 h-12 rounded-full bg-[#130f2f] border-2 border-violet-500 flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.5)] z-10">
                  <span className="font-heading font-bold text-violet-400 text-lg">{idx + 1}</span>
                </div>
                <div className="glass-panel p-6 md:p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors duration-300">
                  <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* SECTION 6: Why Choose Dr. Nilay Saha */}
        <section className="py-24 bg-gradient-to-b from-transparent via-violet-900/10 to-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Why Choose Us</h2>
              <p className="text-gray-400 text-lg">Premium care you can trust</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {[
                { title: "10+ Years", sub: "Experience", icon: Star },
                { title: "BDS, FIE", sub: "Qualifications", icon: ShieldCheck },
                { title: "Pain-Free", sub: "Dentistry", icon: HeartPulse },
                { title: "3 Clinics", sub: "Locations", icon: MapPin },
              ].map((item, idx) => (
                <div key={idx} className="glass-panel p-6 rounded-2xl bg-black/40 border border-white/10 text-center hover:-translate-y-1 transition-transform duration-300">
                  <div className="w-12 h-12 mx-auto rounded-full bg-violet-500/20 flex items-center justify-center mb-4 border border-violet-500/30">
                    <item.icon className="w-6 h-6 text-violet-400" />
                  </div>
                  <h4 className="font-heading font-bold text-white text-xl mb-1">{item.title}</h4>
                  <p className="text-sm text-gray-400 uppercase tracking-wider">{item.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 7: FAQs */}
        {treatment.faqs.length > 0 && (
          <section className="py-24 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-gray-400 text-lg">Common questions about {treatment.name}</p>
            </div>
            
            <div className="space-y-4">
              {treatment.faqs.map((faq, idx) => (
                <div key={idx} className="glass-panel border border-white/10 rounded-2xl overflow-hidden bg-black/40">
                  <button 
                    onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                    className="w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition-colors"
                  >
                    <span className="font-semibold text-white text-lg pr-4">{faq.question}</span>
                    {activeFaq === idx ? (
                      <Minus className="w-5 h-5 text-violet-400 shrink-0" />
                    ) : (
                      <Plus className="w-5 h-5 text-gray-400 shrink-0" />
                    )}
                  </button>
                  <AnimatePresence>
                    {activeFaq === idx && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-6 pt-0 text-gray-400 leading-relaxed border-t border-white/5 mt-2">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SECTION 8: Related Treatments */}
        {relatedTreatments.length > 0 && (
          <section className="py-24 border-t border-white/5 relative overflow-hidden">
             <div className="absolute top-0 right-1/4 w-96 h-96 bg-violet-600/5 rounded-full blur-[100px] pointer-events-none"></div>
             
             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-12">
                  <h2 className="text-2xl md:text-3xl font-heading font-bold text-white mb-2">Related Treatments</h2>
                  <p className="text-gray-400">Explore other services you might need</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedTreatments.map((rt) => {
                    const RtIcon = getIcon(rt.iconName);
                    return (
                      <Link key={rt.id} to={`/treatments/${rt.id}`} className="block group">
                        <div className="glass-panel p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-violet-500/30 transition-all duration-300 h-full flex flex-col">
                          <div className="w-12 h-12 rounded-xl bg-black/40 flex items-center justify-center mb-4 border border-white/10 group-hover:border-violet-500/30 transition-colors">
                            <RtIcon className="w-6 h-6 text-gray-300 group-hover:text-violet-400" />
                          </div>
                          <h3 className="text-lg font-bold text-white mb-2">{rt.name}</h3>
                          <p className="text-sm text-gray-400 mb-6 flex-1 line-clamp-2">{rt.desc}</p>
                          <div className="flex items-center text-sm font-medium text-violet-400 group-hover:text-violet-300 mt-auto">
                            Learn More <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
             </div>
          </section>
        )}

        {/* SECTION 9: Call To Action */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto relative z-20">
          <div className="glass-panel p-8 md:p-12 rounded-[2.5rem] bg-gradient-to-br from-violet-900/40 to-blue-900/40 border border-white/20 text-center shadow-[0_20px_50px_rgba(139,92,246,0.15)] overflow-hidden relative">
            <div className="absolute inset-0 bg-noise opacity-[0.03] mix-blend-overlay"></div>
            
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-6 relative z-10">
              Still have questions?
            </h2>
            <p className="text-lg text-gray-300 mb-10 max-w-2xl mx-auto relative z-10">
              Book your consultation today and take the first step towards a healthier, brighter smile.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
              <button onClick={handleBook} className="btn-sweep w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white text-black font-semibold shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] hover:-translate-y-1 transition-all duration-300">
                <CalendarDays className="w-5 h-5" />
                Schedule Visit
              </button>
              <a href="https://wa.me/919609180979" target="_blank" rel="noreferrer" className="btn-sweep w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-white/20 bg-black/40 text-white font-medium hover:bg-white/10 hover:-translate-y-1 transition-all duration-300">
                <WhatsAppIcon className="w-5 h-5" />
                WhatsApp
              </a>
              <a href="tel:+919609180979" className="btn-sweep w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-white/10 bg-black/60 text-gray-300 font-medium hover:text-white hover:bg-black/80 hover:-translate-y-1 transition-all duration-300">
                <Phone className="w-5 h-5" />
                Call Clinic
              </a>
            </div>
          </div>
        </section>

        {/* SECTION 10: Location Availability */}
        <section className="pt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center">
            <h2 className="text-3xl font-heading font-bold mb-2">Available At</h2>
            <p className="text-gray-400">Find a clinic near you for this treatment</p>
          </div>
          <Clinics />
        </section>
        
      </main>

      <Footer />
      <ContactModal />
    </div>
  );
}
