/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import TreatmentDetails from "./pages/TreatmentDetails";
import DashboardRoute from "./pages/dashboard/DashboardRoute";
import ScrollToTop from "./components/ScrollToTop";
import BackgroundSystem from "./components/BackgroundSystem";

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <BackgroundSystem />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/treatments/:id" element={<TreatmentDetails />} />
        <Route path="/dashboard" element={<DashboardRoute />} />
      </Routes>
    </BrowserRouter>
  );
}


