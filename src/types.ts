import { LucideIcon } from "lucide-react";
import React from "react";

export interface TreatmentSEO {
  title: string;
  description: string;
  keywords: string[];
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface TreatmentProcessStep {
  title: string;
  description: string;
}

export interface TreatmentData {
  id: string;
  name: string;
  desc: string;
  iconName: string; 
  featured?: boolean;
  
  // Details Page Data
  longDescription: string;
  symptoms: string[];
  benefits: string[];
  process: TreatmentProcessStep[];
  faqs: FAQItem[];
  relatedTreatments: string[];
}
