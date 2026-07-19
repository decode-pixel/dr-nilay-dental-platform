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
    text: "Excellent experience at Saha Dental Clinic. Dr. Nilay is very professional and explains every step of the treatment. The clinic is extremely clean and hygienic. Highly recommend for any dental issues."
  },
  {
    id: 2,
    name: "Sneha Ghosh",
    date: "1 month ago",
    rating: 5,
    treatment: "Full Mouth Rehabilitation",
    avatar: "/DNS_Patient_Avatar_2_202607.webp",
    text: "Got my root canal done here. I was very nervous, but the procedure was completely painless. The staff is polite, and the ambiance is very calming. Premium service at reasonable rates."
  },
  {
    id: 3,
    name: "Arijit Das",
    date: "3 months ago",
    rating: 5,
    treatment: "Orthodontic & Aligner Care",
    avatar: "/DNS_Patient_Avatar_3_202607.webp",
    text: "One of the best dental clinics in the area. The equipment is modern, and they maintain high standards of sterilization. The doctor takes time to listen to your problems. Very satisfied with the treatment."
  },
  {
    id: 4,
    name: "Priya Sharma",
    date: "4 months ago",
    rating: 5,
    treatment: "Pediatric Preventive Checkup",
    avatar: "/DNS_Patient_Avatar_4_202607.webp",
    text: "Took my 6-year-old for a checkup. Dr. Nilay is very good with kids, made my child feel completely comfortable. The clinic setup is wonderful. Thank you for the great service!"
  },
  {
    id: 5,
    name: "Souvik Mukherjee",
    date: "5 months ago",
    rating: 5,
    treatment: "Painless Wisdom Tooth Surgery",
    avatar: "/DNS_Patient_Avatar_5_202607.webp",
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
      x: direction > 0 ? 100 : -100,
      opacity: 0,
      scale: 0.95
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
      x: direction < 0 ? 100 : -100,
      opacity: 0,
      scale: 0.95,
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
    <section id="testimonials" className="relative py-20 sm:py-24 z-10 overflow-hidden font-sans">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16 sm:mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-1 mb-4 text-[#8B7BF7] text-xs font-semibold uppercase tracking-widest">
            <Star className="w-4 h-4 text-[#8B7BF7] fill-[#8B7BF7]" />
            <span>Testimonials</span>
          </div>
          <h2 className="text-[36px] sm:text-[48px] lg:text-[56px] font-display font-bold text-[#F5F5F7] tracking-tight leading-[1.12] mb-5">
            Patient <span className="text-[#8B7BF7]">Stories</span>
          </h2>
          <p className="text-[#A1A1A6] text-base sm:text-lg leading-[1.6] max-w-2xl mx-auto font-normal">
            Discover what our patients have to say about their experience and care at our clinic.
          </p>
        </motion.div>

        {/* Carousel Container */}
        <div className="relative max-w-4xl mx-auto flex items-center justify-center min-h-[420px]">
          
          <div className="absolute w-full h-full flex items-center justify-center overflow-hidden px-4 sm:px-12">
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
                className="absolute w-full max-w-2xl cursor-grab active:cursor-grabbing"
              >
                <div className="glass-2 rounded-[2.5rem] p-8 sm:p-12 border border-white/10 shadow-[0_16px_48px_rgba(0,0,0,0.5)] relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#8B7BF7]/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-[2.5rem]" />
                  
                  <Quote className="absolute top-8 right-8 w-12 h-12 text-white/5 transform rotate-180 pointer-events-none" />

                  <div className="flex flex-col gap-6 relative z-10">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex gap-1">
                        {[...Array(testimonialsData[currentIndex].rating)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.4)]" />
                        ))}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-semibold px-3 py-1 rounded-full glass-1 text-[#8B7BF7] border border-white/10">
                          {testimonialsData[currentIndex].treatment}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          Verified Review
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-lg sm:text-xl text-[#F5F5F7] leading-[1.6] font-medium italic">
                      "{testimonialsData[currentIndex].text}"
                    </p>
                    
                    <div className="mt-4 pt-6 border-t border-white/10 flex items-center justify-between">
                      <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-2xl overflow-hidden bg-[#8B7BF7]/15 flex items-center justify-center border border-[#8B7BF7]/30 shadow-[0_0_15px_rgba(139,123,247,0.2)] shrink-0">
                          <OptimizedImage
                            src={testimonialsData[currentIndex].avatar}
                            fallbackSrc=""
                            alt={testimonialsData[currentIndex].name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="text-[#F5F5F7] font-display font-semibold text-lg">{testimonialsData[currentIndex].name}</h4>
                          <p className="text-xs text-[#A1A1A6] mt-0.5">{testimonialsData[currentIndex].date} • Google Reviews</p>
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
              className="pointer-events-auto w-12 h-12 rounded-full glass-2 flex items-center justify-center text-[#F5F5F7] hover:bg-white/[0.12] active:scale-95 transition-all shadow-[0_0_20px_rgba(0,0,0,0.5)] -ml-4 sm:ml-0"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-6 h-6 mr-0.5 text-violet-300" />
            </button>
            <button 
              onClick={() => paginate(1)}
              className="pointer-events-auto w-12 h-12 rounded-full glass-2 flex items-center justify-center text-[#F5F5F7] hover:bg-white/[0.12] active:scale-95 transition-all shadow-[0_0_20px_rgba(0,0,0,0.5)] -mr-4 sm:mr-0"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-6 h-6 ml-0.5 text-violet-300" />
            </button>
          </div>

        </div>
        
        {/* Indicators */}
        <div className="flex justify-center gap-2 mt-8">
          {testimonialsData.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setDirection(idx > currentIndex ? 1 : -1);
                setCurrentIndex(idx);
              }}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                idx === currentIndex ? 'w-8 bg-[#8B7BF7] shadow-[0_0_10px_rgba(139,123,247,0.6)]' : 'w-2 bg-white/20 hover:bg-white/40'
              }`}
              aria-label={`Go to testimonial ${idx + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
