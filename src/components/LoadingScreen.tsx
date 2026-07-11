import { motion } from "motion/react";
import { ToothIcon } from "./Icons";

export default function LoadingScreen() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#030512]"
    >
      
      
      {/* Ambient background glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30rem] h-[30rem] bg-violet-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col items-center"
      >
        <div className="relative mb-6">
          <motion.div 
            animate={{ 
              boxShadow: ["0 0 20px rgba(139,92,246,0.2)", "0 0 40px rgba(139,92,246,0.6)", "0 0 20px rgba(139,92,246,0.2)"] 
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-xl"
          >
            <ToothIcon className="w-10 h-10 text-violet-400" />
          </motion.div>
        </div>
        
        <h2 className="text-2xl font-heading font-bold text-white mb-2 tracking-tight">
          Dr. Nilay Saha
        </h2>
        
        <div className="flex items-center gap-1 mb-8">
          <div className="w-1 h-1 rounded-full bg-violet-500 animate-pulse" style={{ animationDelay: "0ms" }}></div>
          <div className="w-1 h-1 rounded-full bg-violet-500 animate-pulse" style={{ animationDelay: "150ms" }}></div>
          <div className="w-1 h-1 rounded-full bg-violet-500 animate-pulse" style={{ animationDelay: "300ms" }}></div>
        </div>
      </motion.div>
    </motion.div>
  );
}
