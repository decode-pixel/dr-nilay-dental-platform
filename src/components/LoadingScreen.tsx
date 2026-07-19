import { motion } from "motion/react";
import { ToothIcon } from "./Icons";

export default function LoadingScreen() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0a0a0c] font-sans"
    >
      {/* Ambient background glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30rem] h-[30rem] bg-[#8B7BF7]/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col items-center"
      >
        <div className="relative mb-6">
          <motion.div 
            animate={{ 
              boxShadow: ["0 0 20px rgba(139,123,247,0.2)", "0 0 40px rgba(139,123,247,0.6)", "0 0 20px rgba(139,123,247,0.2)"] 
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-20 h-20 rounded-[1.5rem] bg-[#8B7BF7]/15 border border-[#8B7BF7]/30 flex items-center justify-center backdrop-blur-xl"
          >
            <ToothIcon className="w-10 h-10 text-[#8B7BF7]" />
          </motion.div>
        </div>
        
        <h2 className="text-2xl font-display font-bold text-[#F5F5F7] mb-3 tracking-tight">
          Dr. Nilay Saha
        </h2>
        
        <div className="flex items-center gap-1.5 mb-8">
          <div className="w-1.5 h-1.5 rounded-full bg-[#8B7BF7] animate-pulse" style={{ animationDelay: "0ms" }} />
          <div className="w-1.5 h-1.5 rounded-full bg-[#8B7BF7] animate-pulse" style={{ animationDelay: "150ms" }} />
          <div className="w-1.5 h-1.5 rounded-full bg-[#8B7BF7] animate-pulse" style={{ animationDelay: "300ms" }} />
        </div>
      </motion.div>
    </motion.div>
  );
}
