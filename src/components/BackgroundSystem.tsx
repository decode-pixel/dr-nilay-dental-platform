import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { ToothIcon } from "./Icons";
import { Shield, MessageSquare, MapPin, Calendar, Quote, Map, Sparkles, Activity } from "lucide-react";

export default function BackgroundSystem() {
  const { pathname } = useLocation();
  const [activeTheme, setActiveTheme] = useState('home');
  const [treatmentId, setTreatmentId] = useState<string | null>(null);

  useEffect(() => {
    if (pathname.includes('/treatments/')) {
      setActiveTheme('treatmentDetail');
      setTreatmentId(pathname.split('/').pop() || null);
    } else {
      const handleScroll = () => {
        const sections = ['home', 'about', 'treatments', 'locations', 'faq', 'testimonials', 'contact'];
        let current = 'home';
        
        for (const section of sections) {
          const element = document.getElementById(section);
          if (element) {
            const rect = element.getBoundingClientRect();
            // Trigger earlier to make transition smoother
            if (rect.top <= window.innerHeight * 0.5 && rect.bottom >= window.innerHeight * 0.3) {
              current = section;
            }
          }
        }
        
        if (document.body.style.overflow === 'hidden' && document.querySelector('[role="dialog"]')) {
           setActiveTheme('appointment');
           return;
        }

        setActiveTheme(current);
      };

      window.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll(); 
      
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, [pathname]);

  const renderContent = () => {
    if (activeTheme === 'home') {
      return (
        <motion.div
          key="home"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="https://res.cloudinary.com/tud0sobq/video/upload/v1783340594/REFERENCE__Use_the_uploaded_im_x6cc5m.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
        </motion.div>
      );
    }

    return (
      <motion.div
        key={`theme-${activeTheme}-${treatmentId}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        className="absolute inset-0 bg-[#030512] overflow-hidden"
      >
        {/* Layer 1: Deep Animated Gradient */}
        <motion.div 
          animate={{ 
            backgroundPosition: ["0% 0%", "100% 100%", "0% 100%", "0% 0%"] 
          }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 opacity-50 mix-blend-screen"
          style={{
            background: "radial-gradient(circle at center, rgba(44, 18, 89, 0.4) 0%, rgba(19, 15, 47, 0.8) 50%, rgba(3, 5, 18, 1) 100%)",
            backgroundSize: "200% 200%"
          }}
        />

        {/* Layer 2: Noise Texture */}
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] pointer-events-none"></div>

        {activeTheme === 'about' && (
          <>
            <motion.div 
              animate={{ opacity: [0.1, 0.3, 0.1], scale: [1, 1.1, 1] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] rounded-full bg-violet-600/10 blur-[120px]"
            />
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/hexellence.png')] opacity-[0.02]"></div>
            <motion.div 
              animate={{ y: [-20, 20, -20] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.02] scale-[4]"
            >
              <ToothIcon className="w-96 h-96" />
            </motion.div>
          </>
        )}

        {activeTheme === 'treatments' && (
          <>
            <motion.div 
              animate={{ opacity: [0.15, 0.25, 0.15] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-1/4 right-1/4 w-[50vw] h-[50vw] rounded-full bg-[#1a1642] blur-[150px]"
            />
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.02]"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/connectwork.png')] opacity-[0.02]"></div>
            
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={`treat-icon-${i}`}
                initial={{ y: "100vh", opacity: 0 }}
                animate={{ y: "-20vh", opacity: [0, 0.1, 0] }}
                transition={{ duration: 15 + (i % 3) * 3, repeat: Infinity, delay: i * 2, ease: "linear" }}
                className="absolute"
                style={{ left: `${10 + i * 15}%` }}
              >
                {i % 2 === 0 ? <ToothIcon className="w-16 h-16 text-violet-300" /> : <Sparkles className="w-12 h-12 text-blue-300" />}
              </motion.div>
            ))}
          </>
        )}

        {activeTheme === 'locations' && (
          <>
            <motion.div 
              animate={{ opacity: [0.1, 0.2, 0.1], scale: [1, 1.2, 1] }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/3 left-1/3 w-[60vw] h-[60vw] rounded-full bg-indigo-900/20 blur-[130px]"
            />
            <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/cartographer.png')]"></div>
            <motion.div 
              animate={{ y: [-30, 30, -30], rotate: [0, 5, 0] }}
              transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
              className="absolute right-1/4 top-1/4 opacity-[0.03] scale-[3]"
            >
               <Map className="w-96 h-96" />
            </motion.div>
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={`pin-${i}`}
                animate={{ 
                  y: [0, -10, 0],
                  opacity: [0.1, 0.3, 0.1]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: i }}
                className="absolute"
                style={{ 
                  left: `${20 + i * 20}%`,
                  top: `${30 + (i % 2) * 20}%`
                }}
              >
                <MapPin className="w-12 h-12 text-violet-400" />
              </motion.div>
            ))}
          </>
        )}

        {activeTheme === 'faq' && (
          <>
             <motion.div 
              animate={{ opacity: [0.1, 0.2, 0.1] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] rounded-full bg-purple-900/10 blur-[150px]"
            />
            <motion.div 
              animate={{ y: [-15, 15, -15] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-1/4 left-1/4 opacity-[0.03] scale-[2]"
            >
               <Shield className="w-96 h-96" />
            </motion.div>
          </>
        )}

        {activeTheme === 'testimonials' && (
          <>
            <motion.div 
              animate={{ opacity: [0.1, 0.3, 0.1], rotate: [0, 90, 180] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 bg-gradient-to-tr from-violet-900/10 to-indigo-900/10 blur-[100px]"
            />
            <motion.div 
              animate={{ y: [-20, 20, -20] }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/3 right-1/4 opacity-[0.03] scale-[3]"
            >
               <Quote className="w-96 h-96" />
            </motion.div>
            {/* Soft wave patterns */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/wavecut.png')] opacity-[0.03]"></div>
          </>
        )}

        {activeTheme === 'contact' && (
          <>
            <motion.div 
              animate={{ opacity: [0.1, 0.2, 0.1] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-0 w-full h-[60vh] bg-gradient-to-t from-violet-900/20 to-transparent blur-[80px]"
            />
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/connectwork.png')] opacity-[0.03]"></div>
            <motion.div 
              animate={{ y: [-10, 10, -10], scale: [1, 1.05, 1] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              className="absolute left-1/4 bottom-1/4 opacity-[0.03] scale-[2]"
            >
               <MessageSquare className="w-64 h-64" />
            </motion.div>
          </>
        )}

        {activeTheme === 'appointment' && (
          <>
            <motion.div 
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 bg-gradient-to-br from-[#130f2f]/80 to-[#030512]/90"
            />
            <motion.div 
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.02] scale-[4]"
            >
               <Calendar className="w-96 h-96" />
            </motion.div>
          </>
        )}

        {activeTheme === 'treatmentDetail' && (
          <>
            <motion.div 
               animate={{ y: [0, -50, 0], opacity: [0.1, 0.25, 0.1] }} 
               transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
               className="absolute top-0 left-0 w-[60vw] h-[60vw] bg-violet-600/10 rounded-full blur-[150px]"
            />
            <motion.div 
               animate={{ y: [0, 50, 0], opacity: [0.1, 0.2, 0.1] }} 
               transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
               className="absolute bottom-0 right-0 w-[50vw] h-[50vw] bg-indigo-600/10 rounded-full blur-[150px]"
            />
            
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/hexellence.png')] opacity-[0.04]"></div>
            
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={`particle-${i}`}
                animate={{ 
                  y: [0, -100, 0], 
                  x: [0, Math.random() * 50 - 25, 0],
                  opacity: [0.1, 0.4, 0.1],
                  scale: [1, Math.random() + 0.5, 1]
                }}
                transition={{ duration: 10 + i * 2, repeat: Infinity, ease: "easeInOut", delay: i }}
                className="absolute w-2 h-2 rounded-full bg-violet-400 blur-[2px]"
                style={{ 
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`
                }}
              />
            ))}
            
            <motion.div 
              animate={{ rotate: [0, 10, 0] }}
              transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/4 right-1/4 opacity-[0.02] scale-[3]"
            >
               <Activity className="w-96 h-96" />
            </motion.div>
          </>
        )}

      </motion.div>
    );
  };

  return (
    <div className="fixed inset-0 z-[-2] pointer-events-none bg-[#030512]">
      <AnimatePresence>
        {renderContent()}
      </AnimatePresence>
    </div>
  );
}
