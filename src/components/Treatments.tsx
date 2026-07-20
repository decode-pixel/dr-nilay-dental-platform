import React, { useState, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { ToothIcon } from "./Icons";
import { Link } from "react-router-dom";
import TagPill from "./TagPill";
import { treatmentsData } from "../data/treatments";

const getIcon = (iconName: string) => {
  if (iconName === "ToothIcon") return ToothIcon;
  const IconComponent = (LucideIcons as any)[iconName];
  return IconComponent || LucideIcons.HelpCircle;
};

const trustFeatures = [
  "Modern Technology",
  "Pain-Free Care",
  "Root Canal Specialist",
  "Digital Dentistry",
  "Personalized Treatment"
];

export default function Treatments() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth < 640;
  const isTablet = windowWidth >= 640 && windowWidth < 1024;

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % treatmentsData.length);
  }, []);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + treatmentsData.length) % treatmentsData.length);
  }, []);

  const getCardStyle = (index: number) => {
    const len = treatmentsData.length;
    let diff = index - currentIndex;
    
    if (diff > len / 2) diff -= len;
    if (diff < -len / 2) diff += len;

    const absDiff = Math.abs(diff);

    const baseOffset = isMobile ? 280 : isTablet ? 340 : 420;
    
    const visibleCards = isMobile ? 1 : 2;
    if (absDiff > visibleCards) {
      return {
        x: diff > 0 ? baseOffset * (visibleCards + 1) : -baseOffset * (visibleCards + 1),
        scale: 0.7,
        opacity: 0,
        zIndex: -1,
        pointerEvents: "none" as any,
        filter: "blur(10px)",
      };
    }

    return {
      x: diff * baseOffset,
      scale: absDiff === 0 ? 1 : 1 - (absDiff * 0.15),
      opacity: absDiff === 0 ? 1 : 1 - (absDiff * 0.4),
      zIndex: 10 - absDiff,
      pointerEvents: absDiff === 0 ? "auto" as any : "auto" as any,
      filter: absDiff === 0 ? "blur(0px)" : "blur(4px)",
    };
  };

  const handleDragEnd = (e: any, { offset, velocity }: any) => {
    const swipePower = Math.abs(offset.x) * velocity.x;
    if (swipePower < -5000 || offset.x < -100) {
      handleNext();
    } else if (swipePower > 5000 || offset.x > 100) {
      handlePrev();
    }
  };

  return (
    <section id="treatments" className="relative py-24 sm:py-32 z-10 overflow-hidden font-sans">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center max-w-3xl mx-auto mb-16 sm:mb-24"
        >
          <TagPill icon={ToothIcon} text="Our Services" />
          <h2 className="text-[36px] sm:text-[48px] lg:text-[56px] font-display font-bold text-[#0F172A] tracking-tight leading-[1.12] mb-5">
            Our <span className="text-[#2563EB]">Treatments</span>
          </h2>
          <p className="text-[#475569] text-base sm:text-lg leading-[1.65] max-w-2xl mx-auto font-normal">
            Comprehensive dental care delivered with modern technology, gentle techniques, and over 10 years of clinical excellence.
          </p>
        </motion.div>

        {/* Carousel Container */}
        <div className="relative w-full h-[550px] flex items-center justify-center perspective-1000">
          <div className="absolute inset-0 flex items-center justify-center">
            {treatmentsData.map((treatment, index) => {
              const style = getCardStyle(index);
              const isActive = index === currentIndex;
              const Icon = getIcon(treatment.iconName);

              return (
                <motion.div
                  key={treatment.id}
                  initial={false}
                  animate={{
                    x: style.x,
                    scale: style.scale,
                    opacity: style.opacity,
                    zIndex: style.zIndex,
                    filter: style.filter
                  }}
                  transition={{ type: "spring", stiffness: 200, damping: 25, mass: 1 }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragEnd={handleDragEnd}
                  onClick={() => !isActive && setCurrentIndex(index)}
                  className={`absolute w-[300px] sm:w-[360px] h-[460px] cursor-grab active:cursor-grabbing ${!isActive ? 'hover:scale-[0.87] transition-transform duration-300' : ''}`}
                  style={{ pointerEvents: style.pointerEvents }}
                >
                  <div className={`w-full h-full rounded-[2.2rem] p-8 flex flex-col relative group transition-all duration-500 overflow-hidden ${
                    isActive 
                      ? 'glass-3 border-blue-500/40 shadow-[0_20px_60px_rgba(37,99,235,0.12)] bg-white/95' 
                      : 'glass-2 border-white/70 shadow-sm hover:border-blue-300/60'
                  }`}>
                    
                    {/* Active Glow */}
                    {isActive && (
                      <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-transparent via-[#10B981] to-transparent pointer-events-none" />
                    )}
                    
                    {/* Card Content */}
                    <div className="relative z-10 flex flex-col h-full">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-colors duration-300 shadow-sm ${
                        isActive ? 'bg-[#10B981]/15 border border-[#10B981]/30 text-[#10B981]' : 'bg-[#F4F7F4] border border-emerald-900/10 text-[#4B6358] group-hover:bg-emerald-50 group-hover:text-[#10B981]'
                      }`}>
                        <Icon className="w-7 h-7" />
                      </div>
                      
                      <h3 className={`text-2xl font-bold font-display mb-3 transition-colors duration-300 ${
                        isActive ? 'text-[#122820]' : 'text-[#2C4238] group-hover:text-[#10B981]'
                      }`}>
                        {treatment.name}
                      </h3>
                      
                      <p className={`leading-[1.65] text-sm flex-1 transition-colors duration-300 ${
                        isActive ? 'text-[#2C4238]' : 'text-[#4B6358]'
                      }`}>
                        {treatment.desc}
                      </p>
                      
                      <Link to={`/treatments/${treatment.id}`} className={`mt-auto w-full py-3.5 rounded-full font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                        isActive 
                          ? 'bg-gradient-to-r from-[#10B981] to-[#059669] text-white shadow-[0_4px_16px_rgba(16,185,129,0.35)] hover:shadow-[0_6px_24px_rgba(16,185,129,0.5)] active:scale-[0.98]' 
                          : 'glass-1 border border-emerald-900/10 text-[#122820] hover:bg-white active:scale-[0.98] shadow-sm'
                      }`}>
                        <span>Learn More</span>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Navigation Controls */}
          <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between pointer-events-none px-2 sm:px-6 z-30">
            <button 
              onClick={handlePrev}
              aria-label="Previous Treatment"
              className="pointer-events-auto w-14 h-14 rounded-full glass-3 border border-white/90 flex items-center justify-center text-[#2563EB] hover:bg-white hover:scale-105 active:scale-95 transition-all shadow-[0_8px_30px_rgba(15,23,42,0.12)]"
            >
              <ChevronLeft className="w-6 h-6 mr-0.5" strokeWidth={2} />
            </button>
            <button 
              onClick={handleNext}
              aria-label="Next Treatment"
              className="pointer-events-auto w-14 h-14 rounded-full glass-3 border border-white/90 flex items-center justify-center text-[#2563EB] hover:bg-white hover:scale-105 active:scale-95 transition-all shadow-[0_8px_30px_rgba(15,23,42,0.12)]"
            >
              <ChevronRight className="w-6 h-6 ml-0.5" strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* Pagination Indicators (Mobile) */}
        <div className="flex justify-center gap-2 mt-6 sm:hidden">
          {treatmentsData.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                idx === currentIndex ? 'w-6 bg-[#2563EB] shadow-[0_0_10px_rgba(37,99,235,0.4)]' : 'w-1.5 bg-slate-300'
              }`}
              aria-label={`Go to treatment ${idx + 1}`}
            />
          ))}
        </div>

        {/* Trust Strip */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="mt-16 sm:mt-24 flex flex-wrap justify-center gap-x-8 gap-y-4 border-t border-slate-200/70 pt-10"
        >
          {trustFeatures.map((feature, idx) => (
            <div key={idx} className="flex items-center gap-2.5 text-[#475569]">
              <div className="w-5 h-5 rounded-full bg-blue-100/80 border border-blue-200 flex items-center justify-center shrink-0">
                <Check className="w-3.5 h-3.5 text-[#2563EB]" strokeWidth={2.5} />
              </div>
              <span className="text-xs sm:text-sm font-bold tracking-wider uppercase text-[#0F172A]">{feature}</span>
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
