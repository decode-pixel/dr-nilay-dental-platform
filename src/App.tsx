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
const ErrorPages = lazy(() => import("./pages/ErrorPages"));
const LegalPage = lazy(() => import("./pages/LegalPage"));

function PageSuspenseFallback() {
  return (
    <div className="min-h-screen bg-[#F4F7F4] flex flex-col items-center justify-center relative font-sans">
      <RefreshCw className="w-7 h-7 animate-spin text-[#10B981] mb-3" />
      <span className="text-xs text-[#7E968B] font-medium tracking-wide uppercase">Loading…</span>
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
