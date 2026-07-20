import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Star, ChevronLeft, ChevronRight, Quote, ShieldCheck } from "lucide-react";
import OptimizedImage from "./OptimizedImage";

const testimonialsData = [
  {
    id: 1,
    name: "Rahul Banerjee",
    date: "2 weeks ago",
    rating: 5,
    treatment: "Laser Root Canal & Crown",
    avatar: "/DNS_Patient_Avatar_1_202607.webp",
    fallback: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul",
    text: "Excellent experience at Saha Dental Clinic. Dr. Nilay is very professional and explains every step of the treatment. The clinic is extremely clean and hygienic. Highly recommend for any dental issues."
  },
  {
    id: 2,
    name: "Sneha Ghosh",
    date: "1 month ago",
    rating: 5,
    treatment: "Full Mouth Rehabilitation",
    avatar: "/DNS_Patient_Avatar_2_202607.webp",
    fallback: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha",
    text: "Got my root canal done here. I was very nervous, but the procedure was completely painless. The staff is polite, and the ambiance is very calming. Premium service at reasonable rates."
  },
  {
    id: 3,
    name: "Arijit Das",
    date: "3 months ago",
    rating: 5,
    treatment: "Orthodontic & Aligner Care",
    avatar: "/DNS_Patient_Avatar_3_202607.webp",
    fallback: "https://api.dicebear.com/7.x/avataaars/svg?seed=Arijit",
    text: "One of the best dental clinics in the area. The equipment is modern, and they maintain high standards of sterilization. The doctor takes time to listen to your problems. Very satisfied with the treatment."
  },
  {
    id: 4,
    name: "Priya Sharma",
    date: "4 months ago",
    rating: 5,
    treatment: "Pediatric Preventive Checkup",
    avatar: "/DNS_Patient_Avatar_4_202607.webp",
    fallback: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
    text: "Took my 6-year-old for a checkup. Dr. Nilay is very good with kids, made my child feel completely comfortable. The clinic setup is wonderful. Thank you for the great service!"
  },
  {
    id: 5,
    name: "Souvik Mukherjee",
    date: "5 months ago",
    rating: 5,
    treatment: "Painless Wisdom Tooth Surgery",
    avatar: "/DNS_Patient_Avatar_5_202607.webp",
    fallback: "https://api.dicebear.com/7.x/avataaars/svg?seed=Souvik",
    text: "Very transparent with the treatment plan and pricing. No hidden charges. The tooth extraction was quick and I healed perfectly. Best dental care I have received so far."
  }
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 80 : -80,
      opacity: 0,
      scale: 0.96
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 80 : -80,
      opacity: 0,
      scale: 0.96,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }
    })
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    if (newDirection === 1) {
      setCurrentIndex((prev) => (prev === testimonialsData.length - 1 ? 0 : prev + 1));
    } else {
      setCurrentIndex((prev) => (prev === 0 ? testimonialsData.length - 1 : prev - 1));
    }
  };

  return (
    <section id="testimonials" className="relative py-24 sm:py-32 z-10 overflow-hidden font-sans">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16 sm:mb-24"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-1 mb-4 text-[#2563EB] text-xs font-semibold uppercase tracking-widest border border-blue-500/20 shadow-sm">
            <Star className="w-4 h-4 text-[#2563EB] fill-[#2563EB]" />
            <span>Testimonials</span>
          </div>
          <h2 className="text-[36px] sm:text-[48px] lg:text-[56px] font-display font-bold text-[#0F172A] tracking-tight leading-[1.12] mb-5">
            Patient <span className="text-[#2563EB]">Stories</span>
          </h2>
          <p className="text-[#475569] text-base sm:text-lg leading-[1.65] max-w-2xl mx-auto font-normal">
            Discover what our patients have to say about their exceptional care, comfort, and clinical experience at our practice.
          </p>
        </motion.div>

        {/* Carousel Container */}
        <div className="relative max-w-5xl mx-auto flex items-center justify-center min-h-[460px] sm:min-h-[480px]">
          
          <div className="absolute w-full h-full flex items-center justify-center overflow-hidden px-4 sm:px-16">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={1}
                onDragEnd={(e, { offset, velocity }) => {
                  const swipe = swipePower(offset.x, velocity.x);
                  if (swipe < -swipeConfidenceThreshold) {
                    paginate(1);
                  } else if (swipe > swipeConfidenceThreshold) {
                    paginate(-1);
                  }
                }}
                className="absolute w-full max-w-3xl cursor-grab active:cursor-grabbing"
              >
                <div className="glass-3 rounded-[2.5rem] p-8 sm:p-14 border border-white/80 shadow-[0_20px_60px_rgba(15,23,42,0.08)] relative group overflow-hidden transition-all duration-500">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.04] via-transparent to-sky-500/[0.04] opacity-100 pointer-events-none rounded-[2.5rem]" />
                  
                  {/* Decorative Large Quote Mark */}
                  <Quote className="absolute top-8 right-8 sm:top-10 sm:right-12 w-16 h-16 sm:w-20 sm:h-20 text-[#2563EB]/15 transform rotate-180 pointer-events-none transition-transform duration-500 group-hover:scale-105" />

                  <div className="flex flex-col gap-8 relative z-10">
                    <div className="flex items-center justify-between flex-wrap gap-3 border-b border-slate-200/60 pb-6">
                      <div className="flex gap-1.5 items-center">
                        {[...Array(testimonialsData[currentIndex].rating)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400 drop-shadow-[0_2px_4px_rgba(251,191,36,0.3)]" />
                        ))}
                      </div>
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="text-xs font-semibold px-3.5 py-1 rounded-full bg-blue-50/80 text-[#2563EB] border border-blue-200/60">
                          {testimonialsData[currentIndex].treatment}
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50/90 px-3 py-1 rounded-full border border-emerald-200/70 shadow-sm">
                          <ShieldCheck className="w-4 h-4 text-emerald-600" />
                          Verified Patient
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-xl sm:text-2xl lg:text-[26px] text-[#0F172A] leading-[1.6] font-display font-normal tracking-tight">
                      "{testimonialsData[currentIndex].text}"
                    </p>
                    
                    <div className="pt-4 flex items-center justify-between flex-wrap gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl overflow-hidden bg-blue-100/60 flex items-center justify-center border border-blue-200/80 shadow-[0_4px_12px_rgba(37,99,235,0.12)] shrink-0">
                          <OptimizedImage
                            src={testimonialsData[currentIndex].avatar}
                            fallbackSrc={testimonialsData[currentIndex].fallback}
                            alt={testimonialsData[currentIndex].name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="text-[#0F172A] font-display font-bold text-lg sm:text-xl leading-tight">{testimonialsData[currentIndex].name}</h4>
                          <p className="text-xs sm:text-sm text-[#64748B] mt-1 font-medium">{testimonialsData[currentIndex].date} • Google Reviews</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Buttons */}
          <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between pointer-events-none z-20">
            <button 
              onClick={() => paginate(-1)}
              className="pointer-events-auto w-14 h-14 rounded-full glass-3 border border-white/90 flex items-center justify-center text-[#2563EB] hover:bg-white hover:scale-105 active:scale-95 transition-all shadow-[0_8px_30px_rgba(15,23,42,0.12)] -ml-2 sm:-ml-4 lg:-ml-6"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-6 h-6 mr-0.5" strokeWidth={2} />
            </button>
            <button 
              onClick={() => paginate(1)}
              className="pointer-events-auto w-14 h-14 rounded-full glass-3 border border-white/90 flex items-center justify-center text-[#2563EB] hover:bg-white hover:scale-105 active:scale-95 transition-all shadow-[0_8px_30px_rgba(15,23,42,0.12)] -mr-2 sm:-mr-4 lg:-mr-6"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-6 h-6 ml-0.5" strokeWidth={2} />
            </button>
          </div>

        </div>
        
        {/* Indicators */}
        <div className="flex justify-center gap-2.5 mt-12">
          {testimonialsData.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setDirection(idx > currentIndex ? 1 : -1);
                setCurrentIndex(idx);
              }}
              className={`h-2 rounded-full transition-all duration-500 ${
                idx === currentIndex ? 'w-10 bg-[#2563EB] shadow-[0_2px_10px_rgba(37,99,235,0.4)]' : 'w-2.5 bg-slate-300 hover:bg-slate-400'
              }`}
              aria-label={`Go to testimonial ${idx + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
