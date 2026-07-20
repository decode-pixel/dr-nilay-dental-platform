import React, { useState, useEffect, lazy, Suspense } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import LoadingScreen from "../components/LoadingScreen";
import ContactModal from "../components/ContactModal";
import { WhatsAppIcon } from "../components/Icons";
import { Play } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import LazySection from "../components/LazySection";
import SkeletonLoader from "../components/SkeletonLoader";

// Lazy load below-the-fold components
const MeetDrNilaySaha = lazy(() => import("../components/MeetDrNilaySaha"));
const WhyChooseUsBento = lazy(() => import("../components/WhyChooseUsBento"));
const Treatments = lazy(() => import("../components/Treatments"));
const Clinics = lazy(() => import("../components/Clinics"));
const FAQ = lazy(() => import("../components/FAQ"));
const Testimonials = lazy(() => import("../components/Testimonials"));
const Footer = lazy(() => import("../components/Footer"));

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); // reduced loading screen to 1.5 seconds for snappier FCP/LCP
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen text-white font-sans overflow-x-hidden selection:bg-blue-500/30 relative bg-[#F8FBFF]">
      <AnimatePresence>
        {isLoading && <LoadingScreen />}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10" id="home">
        {/* Ambient Background Glows */}
        <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-blue-500/[0.04] rounded-full blur-[130px] pointer-events-none z-0" />
        <div className="absolute top-[40%] right-[-10%] w-[30rem] h-[30rem] bg-sky-500/[0.04] rounded-full blur-[130px] pointer-events-none z-0" />

        <Navbar />
        <main className="pt-28 sm:pt-32 pb-24 relative z-10">
          <Hero />
          
          <div id="about">
            <LazySection minHeight="450px" fallback={<SkeletonLoader variant="profile" />}>
              <Suspense fallback={<SkeletonLoader variant="profile" />}>
                <MeetDrNilaySaha />
              </Suspense>
            </LazySection>
            
            <LazySection minHeight="500px" fallback={<SkeletonLoader variant="card" />}>
              <Suspense fallback={<SkeletonLoader variant="card" />}>
                <WhyChooseUsBento />
              </Suspense>
            </LazySection>
          </div>
          
          {/* Watch Clinic Tour Action */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
            className="mt-12 flex justify-center"
          >
            <button className="group flex items-center justify-center gap-3 px-8 py-4 rounded-full glass-2 text-[#0F172A] border border-slate-200 hover:border-blue-300/60 shadow-sm hover:shadow-md hover:bg-slate-50 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300">
              <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-[#2563EB] group-hover:scale-110 transition-transform">
                <Play className="w-4 h-4 text-[#2563EB] fill-[#2563EB]/10 ml-0.5" />
              </div>
              <span className="font-semibold text-base">Watch Clinic Tour</span>
            </button>
          </motion.div>
        </main>
      </div>

      <LazySection minHeight="450px" fallback={<SkeletonLoader variant="card" />}>
        <Suspense fallback={<SkeletonLoader variant="card" />}>
          <Treatments />
        </Suspense>
      </LazySection>

      <LazySection minHeight="450px" fallback={<SkeletonLoader variant="card" />}>
        <Suspense fallback={<SkeletonLoader variant="card" />}>
          <Clinics />
        </Suspense>
      </LazySection>

      <LazySection minHeight="350px" fallback={<SkeletonLoader variant="row" />}>
        <Suspense fallback={<SkeletonLoader variant="row" />}>
          <FAQ />
        </Suspense>
      </LazySection>

      <LazySection minHeight="400px" fallback={<SkeletonLoader variant="card" />}>
        <Suspense fallback={<SkeletonLoader variant="card" />}>
          <Testimonials />
        </Suspense>
      </LazySection>

      <div id="contact">
        <LazySection minHeight="300px">
          <Suspense fallback={<div className="h-60 bg-[#050614] animate-pulse" />}>
            <Footer />
          </Suspense>
        </LazySection>
      </div>

      <ContactModal />

      {/* Floating WhatsApp Button */}
      <a 
        href="https://wa.me/919609180979" 
        target="_blank" 
        rel="noreferrer" 
        className="fixed btn-sweep overflow-hidden bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-green-500 text-white rounded-full shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:shadow-[0_0_30px_rgba(34,197,94,0.6)] hover:-translate-y-1 transition-all duration-300"
        aria-label="Contact via WhatsApp"
      >
        <WhatsAppIcon className="w-8 h-8 ml-0.5 mb-0.5" />
      </a>
    </div>
  );
}
