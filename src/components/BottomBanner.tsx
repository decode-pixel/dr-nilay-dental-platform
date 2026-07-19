import { Calendar, Leaf, Shield } from "lucide-react";
import { motion } from "motion/react";
import { ToothIcon } from "./Icons";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
} as const;

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
} as const;

export default function BottomBanner() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
      className="w-full glass-1 rounded-3xl p-6 sm:p-8 mt-12 font-sans"
    >
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4 xl:gap-8 divide-y md:divide-y-0 md:divide-x divide-white/10"
      >
        
        {/* Item 1 */}
        <motion.div variants={itemVariants} className="flex items-start gap-4 pt-4 md:pt-0 pl-0 group cursor-default">
          <div className="w-12 h-12 rounded-2xl bg-[#8B7BF7]/15 border border-[#8B7BF7]/30 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(139,123,247,0.2)] group-hover:bg-[#8B7BF7]/25 group-hover:scale-105 transition-all duration-300">
             <ToothIcon className="w-6 h-6 text-[#8B7BF7]" />
          </div>
          <div>
            <h4 className="text-[#F5F5F7] font-semibold text-sm mb-1 group-hover:text-white transition-colors">Advanced Technology</h4>
            <p className="text-xs text-[#A1A1A6] leading-[1.6] group-hover:text-gray-300 transition-colors">State-of-the-art equipment<br/>for the best results.</p>
          </div>
        </motion.div>

        {/* Item 2 */}
        <motion.div variants={itemVariants} className="flex items-start gap-4 pt-4 md:pt-0 md:pl-6 xl:pl-8 group cursor-default">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(59,130,246,0.2)] group-hover:bg-blue-500/25 group-hover:scale-105 transition-all duration-300">
            <Shield className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h4 className="text-[#F5F5F7] font-semibold text-sm mb-1 group-hover:text-white transition-colors">Expert Dentists</h4>
            <p className="text-xs text-[#A1A1A6] leading-[1.6] group-hover:text-gray-300 transition-colors">Highly skilled professionals<br/>you can trust.</p>
          </div>
        </motion.div>

        {/* Item 3 */}
        <motion.div variants={itemVariants} className="flex items-start gap-4 pt-4 md:pt-0 lg:pl-6 xl:pl-8 group cursor-default">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(16,185,129,0.2)] group-hover:bg-emerald-500/25 group-hover:scale-105 transition-all duration-300">
            <Leaf className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h4 className="text-[#F5F5F7] font-semibold text-sm mb-1 group-hover:text-white transition-colors">Personalized Care</h4>
            <p className="text-xs text-[#A1A1A6] leading-[1.6] group-hover:text-gray-300 transition-colors">Tailored treatment for<br/>your unique needs.</p>
          </div>
        </motion.div>

        {/* Item 4 */}
        <motion.div variants={itemVariants} className="flex items-start gap-4 pt-4 md:pt-0 lg:pl-6 xl:pl-8 group cursor-default">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(245,158,11,0.2)] group-hover:bg-amber-500/25 group-hover:scale-105 transition-all duration-300">
            <Calendar className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h4 className="text-[#F5F5F7] font-semibold text-sm mb-1 group-hover:text-white transition-colors">Flexible Scheduling</h4>
            <p className="text-xs text-[#A1A1A6] leading-[1.6] group-hover:text-gray-300 transition-colors">Easy appointment booking<br/>that fits your life.</p>
          </div>
        </motion.div>

      </motion.div>
    </motion.div>
  );
}
