import React, { lazy, Suspense } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import TrustIndicators from "../components/TrustIndicators";
import ContactModal from "../components/ContactModal";
import { WhatsAppIcon } from "../components/Icons";
import LazySection from "../components/LazySection";
import SkeletonLoader from "../components/SkeletonLoader";
import { PRIMARY_WHATSAPP_DIGITS } from "../lib/constants";

// Lazy load below-the-fold components for fast initial load
const Treatments        = lazy(() => import("../components/Treatments"));
const WhyChooseUsBento  = lazy(() => import("../components/WhyChooseUsBento"));
const MeetDrNilaySaha   = lazy(() => import("../components/MeetDrNilaySaha"));
const BeforeAfterGallery = lazy(() => import("../components/BeforeAfterGallery"));
const ReviewsSection    = lazy(() => import("../components/ReviewsSection"));
const Clinics           = lazy(() => import("../components/Clinics"));
const FAQ               = lazy(() => import("../components/FAQ"));
const ContactSection    = lazy(() => import("../components/ContactSection"));
const Footer            = lazy(() => import("../components/Footer"));

export default function HomePage() {
  return (
    <div
      id="home"
      className="min-h-screen font-sans overflow-x-hidden selection:bg-sky-500/30 bg-white"
    >
      {/* ── Navbar (fixed, floats above page, z-[100]) ───────────────────── */}
      <Navbar />

      {/* ── Hero & Trust Pillars (Synchronous Above-The-Fold) ────────────── */}
      <main className="pt-24 sm:pt-28">
        <Hero />
        <TrustIndicators />
      </main>

      {/* ── Treatments Grid ──────────────────────────────────────────────── */}
      <div id="treatments-wrapper">
        <LazySection minHeight="500px" fallback={<SkeletonLoader variant="card" />}>
          <Suspense fallback={<SkeletonLoader variant="card" />}>
            <Treatments />
          </Suspense>
        </LazySection>
      </div>

      {/* ── Why Choose Us & Doctor Authority Profile (#about & #why-choose-us) ─ */}
      <div id="about">
        <LazySection minHeight="450px" fallback={<SkeletonLoader variant="card" />}>
          <Suspense fallback={<SkeletonLoader variant="card" />}>
            <WhyChooseUsBento />
          </Suspense>
        </LazySection>

        <LazySection minHeight="450px" fallback={<SkeletonLoader variant="profile" />}>
          <Suspense fallback={<SkeletonLoader variant="profile" />}>
            <MeetDrNilaySaha />
          </Suspense>
        </LazySection>
      </div>

      {/* ── Before & After Smile Gallery (#gallery) ──────────────────────── */}
      <div id="gallery">
        <LazySection minHeight="500px" fallback={<SkeletonLoader variant="card" />}>
          <Suspense fallback={<SkeletonLoader variant="card" />}>
            <BeforeAfterGallery />
          </Suspense>
        </LazySection>
      </div>

      {/* ── Patient Experiences / Reviews (#reviews) ─────────────────────── */}
      <div id="reviews-wrapper">
        <LazySection minHeight="450px" fallback={<SkeletonLoader variant="card" />}>
          <Suspense fallback={<SkeletonLoader variant="card" />}>
            <ReviewsSection />
          </Suspense>
        </LazySection>
      </div>

      {/* ── Regional Clinics / Locations (#locations) ────────────────────── */}
      <div id="locations-wrapper">
        <LazySection minHeight="450px" fallback={<SkeletonLoader variant="card" />}>
          <Suspense fallback={<SkeletonLoader variant="card" />}>
            <Clinics />
          </Suspense>
        </LazySection>
      </div>

      {/* ── FAQ (#faq) ───────────────────────────────────────────────────── */}
      <div id="faq-wrapper">
        <LazySection minHeight="350px" fallback={<SkeletonLoader variant="row" />}>
          <Suspense fallback={<SkeletonLoader variant="row" />}>
            <FAQ />
          </Suspense>
        </LazySection>
      </div>

      {/* ── Contact & Footer (#contact) ──────────────────────────────────── */}
      <div id="contact">
        <LazySection minHeight="450px" fallback={<SkeletonLoader variant="row" />}>
          <Suspense fallback={<SkeletonLoader variant="row" />}>
            <ContactSection />
          </Suspense>
        </LazySection>
        <LazySection minHeight="300px">
          <Suspense fallback={<div className="h-60 bg-[#122820] animate-pulse" />}>
            <Footer />
          </Suspense>
        </LazySection>
      </div>

      {/* ── Global Booking / Contact Modal (z-[200]) ─────────────────────── */}
      <ContactModal />

      {/* ── Floating WhatsApp FAB (z-[90]) ───────────────────────────────── */}
      <a
        href={`https://wa.me/${PRIMARY_WHATSAPP_DIGITS}`}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-[90] flex items-center justify-center w-14 h-14 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full shadow-[0_0_20px_rgba(37,211,102,0.4)] hover:shadow-[0_0_30px_rgba(37,211,102,0.6)] hover:-translate-y-1 active:scale-95 transition-all duration-200"
        aria-label="Contact via WhatsApp"
      >
        <WhatsAppIcon className="w-8 h-8" />
      </a>
    </div>
  );
}
