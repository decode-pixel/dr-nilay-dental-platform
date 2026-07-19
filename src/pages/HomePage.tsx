import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import MeetDrNilaySaha from "../components/MeetDrNilaySaha";
import BottomBanner from "../components/BottomBanner";
import Treatments from "../components/Treatments";
import Clinics from "../components/Clinics";
import FAQ from "../components/FAQ";
import Testimonials from "../components/Testimonials";
import LoadingScreen from "../components/LoadingScreen";
import Footer from "../components/Footer";
import ContactModal from "../components/ContactModal";
import { WhatsAppIcon } from "../components/Icons";
import { Play } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // 2 seconds loading screen
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen text-white font-sans overflow-x-hidden selection:bg-violet-500/30 relative">
      <AnimatePresence>
        {isLoading && <LoadingScreen />}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10" id="home">
        <Navbar />
        <main className="pt-28 sm:pt-32 pb-24 relative z-10">
          <Hero />
          <div id="about">
            <MeetDrNilaySaha />
            <BottomBanner />
          </div>
          
          {/* Watch Clinic Tour Action */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
            className="mt-12 flex justify-center"
          >
            <button className="group flex items-center justify-center gap-3 px-8 py-4 rounded-full glass-2 text-[#F5F5F7] font-semibold text-base hover:bg-white/[0.08] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300">
              <div className="w-8 h-8 rounded-full bg-[#8B7BF7]/20 border border-[#8B7BF7]/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Play className="w-4 h-4 text-[#8B7BF7] ml-0.5" />
              </div>
              <span>Watch Clinic Tour</span>
            </button>
          </motion.div>
        </main>
      </div>

      <Treatments />
      <Clinics />
      <FAQ />
      <Testimonials />
      <div id="contact">
        <Footer />
      </div>
      <ContactModal />

      {/* Floating WhatsApp Button */}
      <a 
        href="https://wa.me/919609180979" 
        target="_blank" 
        rel="noreferrer" 
        className="fixed btn-sweep overflow-hidden bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-green-500 text-white rounded-full shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:shadow-[0_0_30px_rgba(34,197,94,0.6)] hover:-translate-y-1 transition-all duration-300"
      >
        <WhatsAppIcon className="w-8 h-8 ml-0.5 mb-0.5" />
      </a>
    </div>
  );
}
