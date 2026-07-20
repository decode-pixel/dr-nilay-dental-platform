/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SpeedInsights } from "@vercel/speed-insights/react";
import ScrollToTop from "./components/ScrollToTop";
import BackgroundSystem from "./components/BackgroundSystem";
import ErrorBoundary from "./components/ErrorBoundary";
import { RefreshCw } from "lucide-react";

// Route-based code splitting
const HomePage = lazy(() => import("./pages/HomePage"));
const TreatmentDetails = lazy(() => import("./pages/TreatmentDetails"));
const DashboardRoute = lazy(() => import("./pages/dashboard/DashboardRoute"));
const ErrorPages = lazy(() => import("./pages/ErrorPages"));
const LegalPage = lazy(() => import("./pages/LegalPage"));

// Premium loading fallback for Suspense loading segments
function PageSuspenseFallback() {
  return (
    <div className="min-h-screen bg-[#02020a] flex flex-col items-center justify-center text-white relative overflow-hidden font-sans">
      <div className="absolute top-0 right-0 w-96 h-96 bg-violet-600/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />
      <RefreshCw className="w-8 h-8 animate-spin text-violet-400 mb-3 relative z-10" />
      <span className="text-xs text-gray-500 font-medium tracking-wide uppercase relative z-10">Loading Platform...</span>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ScrollToTop />
        <BackgroundSystem />
        <Suspense fallback={<PageSuspenseFallback />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/treatments/:id" element={<TreatmentDetails />} />
            <Route path="/privacy" element={<LegalPage type="privacy" />} />
            <Route path="/privacy-policy" element={<LegalPage type="privacy" />} />
            <Route path="/terms" element={<LegalPage type="terms" />} />
            <Route path="/terms-and-conditions" element={<LegalPage type="terms" />} />
            <Route path="/tips" element={<LegalPage type="tips" />} />
            <Route path="/dashboard" element={<DashboardRoute />} />
            
            {/* HTTP Error Pages */}
            <Route path="/401" element={<ErrorPages code={401} />} />
            <Route path="/403" element={<ErrorPages code={403} />} />
            <Route path="/500" element={<ErrorPages code={500} />} />
            <Route path="*" element={<ErrorPages code={404} />} />
          </Routes>
        </Suspense>
        <SpeedInsights />
      </BrowserRouter>
    </ErrorBoundary>
  );
}
