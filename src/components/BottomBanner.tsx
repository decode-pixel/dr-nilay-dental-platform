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
      className="w-full glass-2 rounded-[2.2rem] p-8 sm:p-10 mt-14 border border-white/80 shadow-[0_12px_40px_rgba(15,23,42,0.06)] font-sans"
    >
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 xl:gap-8 divide-y md:divide-y-0 md:divide-x divide-slate-200/70"
      >
        
        {/* Item 1 */}
        <motion.div variants={itemVariants} className="flex items-start gap-4 pt-4 md:pt-0 pl-0 group cursor-default">
          <div className="w-13 h-13 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0 shadow-sm group-hover:bg-blue-100 group-hover:scale-105 transition-all duration-300">
             <ToothIcon className="w-6 h-6 text-[#2563EB]" />
          </div>
          <div>
            <h4 className="text-[#0F172A] font-display font-bold text-base mb-1 group-hover:text-[#2563EB] transition-colors">Advanced Technology</h4>
            <p className="text-xs sm:text-sm text-[#475569] leading-[1.6]">State-of-the-art diagnostics<br/>for precision results.</p>
          </div>
        </motion.div>

        {/* Item 2 */}
        <motion.div variants={itemVariants} className="flex items-start gap-4 pt-4 md:pt-0 md:pl-6 xl:pl-8 group cursor-default">
          <div className="w-13 h-13 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center shrink-0 shadow-sm group-hover:bg-sky-100 group-hover:scale-105 transition-all duration-300">
            <Shield className="w-5 h-5 text-sky-600" />
          </div>
          <div>
            <h4 className="text-[#0F172A] font-display font-bold text-base mb-1 group-hover:text-sky-600 transition-colors">Expert Surgeon</h4>
            <p className="text-xs sm:text-sm text-[#475569] leading-[1.6]">10+ years of fellowship-trained<br/>endodontic practice.</p>
          </div>
        </motion.div>

        {/* Item 3 */}
        <motion.div variants={itemVariants} className="flex items-start gap-4 pt-4 md:pt-0 lg:pl-6 xl:pl-8 group cursor-default">
          <div className="w-13 h-13 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0 shadow-sm group-hover:bg-emerald-100 group-hover:scale-105 transition-all duration-300">
            <Leaf className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h4 className="text-[#0F172A] font-display font-bold text-base mb-1 group-hover:text-emerald-600 transition-colors">Personalized Care</h4>
            <p className="text-xs sm:text-sm text-[#475569] leading-[1.6]">Tailored treatment phases for<br/>your unique needs.</p>
          </div>
        </motion.div>

        {/* Item 4 */}
        <motion.div variants={itemVariants} className="flex items-start gap-4 pt-4 md:pt-0 lg:pl-6 xl:pl-8 group cursor-default">
          <div className="w-13 h-13 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0 shadow-sm group-hover:bg-amber-100 group-hover:scale-105 transition-all duration-300">
            <Calendar className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h4 className="text-[#0F172A] font-display font-bold text-base mb-1 group-hover:text-amber-600 transition-colors">Flexible Scheduling</h4>
            <p className="text-xs sm:text-sm text-[#475569] leading-[1.6]">Direct appointment booking<br/>across 3 regional centers.</p>
          </div>
        </motion.div>

      </motion.div>
    </motion.div>
  );
}
