import { Calendar, Leaf, Shield } from "lucide-react";
import { motion } from "motion/react";
import { ToothIcon } from "./Icons";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.8 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export default function BottomBanner() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
      className="w-full glass-panel rounded-3xl p-6 sm:p-8 mt-12"
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
          <div className="w-12 h-12 rounded-full bg-violet-500/10 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(139,92,246,0.2)] group-hover:bg-violet-500/20 group-hover:shadow-[0_0_25px_rgba(139,92,246,0.4)] group-hover:scale-110 transition-all duration-300">
             <ToothIcon className="w-6 h-6 text-violet-400 group-hover:text-violet-300 transition-colors" />
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-1 group-hover:text-violet-200 transition-colors">Advanced Technology</h4>
            <p className="text-xs text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">State-of-the-art equipment<br/>for the best results.</p>
          </div>
        </motion.div>

        {/* Item 2 */}
        <motion.div variants={itemVariants} className="flex items-start gap-4 pt-4 md:pt-0 md:pl-6 xl:pl-8 group cursor-default">
          <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(59,130,246,0.2)] group-hover:bg-blue-500/20 group-hover:shadow-[0_0_25px_rgba(59,130,246,0.4)] group-hover:scale-110 transition-all duration-300">
            <Shield className="w-5 h-5 text-blue-400 group-hover:text-blue-300 transition-colors" />
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-1 group-hover:text-blue-200 transition-colors">Expert Dentists</h4>
            <p className="text-xs text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">Highly skilled professionals<br/>you can trust.</p>
          </div>
        </motion.div>

        {/* Item 3 */}
        <motion.div variants={itemVariants} className="flex items-start gap-4 pt-4 md:pt-0 lg:pl-6 xl:pl-8 group cursor-default">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(16,185,129,0.2)] group-hover:bg-emerald-500/20 group-hover:shadow-[0_0_25px_rgba(16,185,129,0.4)] group-hover:scale-110 transition-all duration-300">
            <Leaf className="w-5 h-5 text-emerald-400 group-hover:text-emerald-300 transition-colors" />
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-1 group-hover:text-emerald-200 transition-colors">Personalized Care</h4>
            <p className="text-xs text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">Tailored treatment for<br/>your unique needs.</p>
          </div>
        </motion.div>

        {/* Item 4 */}
        <motion.div variants={itemVariants} className="flex items-start gap-4 pt-4 md:pt-0 lg:pl-6 xl:pl-8 group cursor-default">
          <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(245,158,11,0.2)] group-hover:bg-amber-500/20 group-hover:shadow-[0_0_25px_rgba(245,158,11,0.4)] group-hover:scale-110 transition-all duration-300">
            <Calendar className="w-5 h-5 text-amber-400 group-hover:text-amber-300 transition-colors" />
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-1 group-hover:text-amber-200 transition-colors">Flexible Scheduling</h4>
            <p className="text-xs text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">Easy appointment booking<br/>that fits your life.</p>
          </div>
        </motion.div>

      </motion.div>
    </motion.div>
  );
}
