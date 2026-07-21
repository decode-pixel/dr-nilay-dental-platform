import React, { lazy, Suspense } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import ContactModal from "../components/ContactModal";
import { WhatsAppIcon } from "../components/Icons";
import LazySection from "../components/LazySection";
import SkeletonLoader from "../components/SkeletonLoader";
import { PRIMARY_WHATSAPP_DIGITS } from "../lib/constants";

// Lazy load below-the-fold components
const MeetDrNilaySaha   = lazy(() => import("../components/MeetDrNilaySaha"));
const WhyChooseUsBento  = lazy(() => import("../components/WhyChooseUsBento"));
const Treatments        = lazy(() => import("../components/Treatments"));
const Clinics           = lazy(() => import("../components/Clinics"));
const FAQ               = lazy(() => import("../components/FAQ"));
const ContactSection    = lazy(() => import("../components/ContactSection"));
const Footer            = lazy(() => import("../components/Footer"));

export default function HomePage() {
  return (
    <div
      id="home"
      className="min-h-screen font-sans overflow-x-hidden selection:bg-emerald-500/30 bg-[#F4F7F4]"
    >
      {/* ── Navbar (fixed, floats above page) ─────────────────────────────── */}
      <Navbar />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <main className="pt-24 sm:pt-28">
        <Hero />
      </main>

      {/* ── About / Doctor Profile ─────────────────────────────────────────── */}
      {/* 
        IMPORTANT: The #about section id is on this wrapper div, NOT inside
        MeetDrNilaySaha. This ensures scrollTo always finds the element even
        before the lazy component has hydrated.
      */}
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

      {/* ── Treatments ────────────────────────────────────────────────────── */}
      {/*
        The <section id="treatments"> is inside Treatments.tsx.
        LazySection placeholder is a sibling, not a wrapper, so scrollspy
        finds the section element once it mounts.
      */}
      <LazySection minHeight="450px" fallback={<SkeletonLoader variant="card" />}>
        <Suspense fallback={<SkeletonLoader variant="card" />}>
          <Treatments />
        </Suspense>
      </LazySection>

      {/* ── Clinics / Locations ───────────────────────────────────────────── */}
      {/* id="locations" is on the <section> inside Clinics.tsx */}
      <LazySection minHeight="450px" fallback={<SkeletonLoader variant="card" />}>
        <Suspense fallback={<SkeletonLoader variant="card" />}>
          <Clinics />
        </Suspense>
      </LazySection>

      {/* ── FAQ ───────────────────────────────────────────────────────────── */}
      {/* id="faq" is on the <section> inside FAQ.tsx */}
      <LazySection minHeight="350px" fallback={<SkeletonLoader variant="row" />}>
        <Suspense fallback={<SkeletonLoader variant="row" />}>
          <FAQ />
        </Suspense>
      </LazySection>

      {/* ── Contact ───────────────────────────────────────────────────────── */}
      {/*
        FIX: Added id="contact" on this wrapper div so the scroll-spy AND
        the smooth-scroll handler always find #contact immediately, even
        before ContactSection has lazily mounted.
        ContactSection.tsx uses id="contact-info" on its inner <section>,
        which is included as a fallback alias in ID_ALIASES in Navbar.tsx.
      */}
      <div id="contact">
        <LazySection minHeight="450px" fallback={<SkeletonLoader variant="row" />}>
          <Suspense fallback={<SkeletonLoader variant="row" />}>
            <ContactSection />
          </Suspense>
        </LazySection>
        <LazySection minHeight="300px">
          <Suspense fallback={<div className="h-60 bg-[#061D15] animate-pulse" />}>
            <Footer />
          </Suspense>
        </LazySection>
      </div>

      {/* ── Global Booking / Contact Modal ────────────────────────────────── */}
      <ContactModal />

      {/* ── Floating WhatsApp FAB ─────────────────────────────────────────── */}
      {/*
        FIX: z-[90] — below Navbar (z-[100]) and below ContactModal (z-[200]).
        Previous z-50 could appear over modals on some viewport configurations.
      */}
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
