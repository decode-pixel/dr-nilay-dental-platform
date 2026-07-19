import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Search, Sparkles, CheckCircle2, Clock, ShieldPlus } from 'lucide-react';
import { treatmentsData } from '../../../data/treatments';
import BookingStepLayout from '../BookingStepLayout';
import * as LucideIcons from 'lucide-react';
import { ToothIcon } from '../../Icons';

interface TreatmentStepProps extends React.Attributes {
  selectedTreatmentId: string;
  onSelectTreatment: (treatmentId: string) => void;
  onBack: () => void;
  onContinue: () => void;
  availableTreatments?: any[];
}

const getTreatmentIcon = (iconName: string) => {
  if (iconName === 'ToothIcon') return ToothIcon;
  const IconComponent = (LucideIcons as any)[iconName];
  return IconComponent || LucideIcons.HelpCircle;
};

const CATEGORIES = [
  'All',
  'Featured & Endodontics',
  'Restorative & Preventive',
  'Cosmetic & Ortho',
  'Surgery & Prosthetic',
];

const CATEGORY_MAP: Record<string, string> = {
  'root-canal': 'Featured & Endodontics',
  're-root-canal': 'Featured & Endodontics',
  'fillings': 'Restorative & Preventive',
  'scaling': 'Restorative & Preventive',
  'preventive': 'Restorative & Preventive',
  'xray': 'Restorative & Preventive',
  'consultation': 'Restorative & Preventive',
  'smile-design': 'Cosmetic & Ortho',
  'whitening': 'Cosmetic & Ortho',
  'braces': 'Cosmetic & Ortho',
  'crowns': 'Surgery & Prosthetic',
  'bridges': 'Surgery & Prosthetic',
  'dentures': 'Surgery & Prosthetic',
  'extraction': 'Surgery & Prosthetic',
  'wisdom-tooth': 'Surgery & Prosthetic',
  'implants': 'Surgery & Prosthetic',
  'oral-surgery': 'Surgery & Prosthetic',
  'gum-treatment': 'Restorative & Preventive',
  'pediatric': 'Restorative & Preventive',
  'emergency': 'Featured & Endodontics',
};

const ESTIMATED_DURATION_MAP: Record<string, string> = {
  'root-canal': '60 mins',
  're-root-canal': '90 mins',
  'fillings': '30 mins',
  'scaling': '30 mins',
  'crowns': '45 mins',
  'bridges': '60 mins',
  'extraction': '30 mins',
  'wisdom-tooth': '45 mins',
  'dentures': '45 mins',
  'gum-treatment': '45 mins',
  'pediatric': '30 mins',
  'implants': '60 mins',
  'braces': '30 mins',
  'smile-design': '60 mins',
  'whitening': '45 mins',
  'oral-surgery': '60 mins',
  'xray': '15 mins',
  'emergency': '30 mins',
  'preventive': '30 mins',
  'consultation': '30 mins',
};

export default function TreatmentStep({
  selectedTreatmentId,
  onSelectTreatment,
  onBack,
  onContinue,
  availableTreatments,
}: TreatmentStepProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const resolvedTreatments = useMemo(() => {
    const list = availableTreatments && availableTreatments.length > 0 ? availableTreatments : [];
    if (list.length === 0) {
      return treatmentsData.map((t) => ({
        id: t.id,
        name: t.name,
        desc: t.desc,
        iconName: t.iconName,
        category: (t as any).category || CATEGORY_MAP[t.id] || 'General'
      }));
    }
    return list.map((t) => ({
      id: t.slug,
      name: t.name,
      desc: t.description || '',
      iconName: t.icon || 'ToothIcon',
      category: t.category || CATEGORY_MAP[t.slug] || 'General'
    }));
  }, [availableTreatments]);

  const featuredTreatment = useMemo(
    () => resolvedTreatments.find((t) => t.id === 'root-canal'),
    [resolvedTreatments]
  );

  const filteredTreatments = useMemo(() => {
    return resolvedTreatments.filter((t) => {
      if (t.id === 'root-canal' && !searchQuery && selectedCategory === 'All') {
        return false;
      }
      const matchesSearch =
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.desc.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === 'All' ||
        CATEGORY_MAP[t.id] === selectedCategory ||
        t.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory, resolvedTreatments]);

  return (
    <BookingStepLayout
      title="Select Treatment"
      subtitle="Choose the clinical procedure or consultation you need."
      badge="Step 2 • Clinical Procedure"
      onBack={onBack}
      onContinue={onContinue}
      isContinueDisabled={!selectedTreatmentId}
    >
      <div className="space-y-6">
        {/* Featured Treatment Card (Root Canal) */}
        {!searchQuery && selectedCategory === 'All' && featuredTreatment && (
          <div>
            <div className="flex items-center gap-2 mb-2 px-1">
              <Sparkles className="w-4 h-4 text-violet-400" />
              <span className="text-xs font-semibold text-violet-300 uppercase tracking-wider">
                Featured Treatment
              </span>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => onSelectTreatment(featuredTreatment.id)}
              onDoubleClick={() => {
                onSelectTreatment(featuredTreatment.id);
                onContinue();
              }}
              className={`group relative rounded-[1.75rem] p-5 sm:p-6 cursor-pointer border overflow-hidden transition-all duration-300 ${
                selectedTreatmentId === featuredTreatment.id
                  ? 'bg-gradient-to-br from-violet-600/20 via-white/10 to-blue-600/20 border-violet-400/80 shadow-[0_0_35px_rgba(139,92,246,0.3)]'
                  : 'bg-gradient-to-br from-violet-500/10 to-blue-500/10 border-violet-500/30 hover:border-violet-400/60'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border transition-all duration-300 ${
                      selectedTreatmentId === featuredTreatment.id
                        ? 'bg-gradient-to-br from-violet-600 to-blue-600 text-white border-white/20 shadow-[0_0_15px_rgba(139,92,246,0.6)]'
                        : 'bg-violet-500/20 text-violet-300 border-violet-500/30'
                    }`}
                  >
                    {React.createElement(getTreatmentIcon(featuredTreatment.iconName), {
                      className: 'w-6 h-6',
                    })}
                  </div>

                  <div>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h4 className="font-heading font-bold text-lg text-white">
                        {featuredTreatment.name}
                      </h4>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wide bg-violet-500/20 text-violet-300 border border-violet-500/30">
                        Most Requested
                      </span>
                    </div>
                    <p className="text-sm text-gray-300 mt-1">
                      {featuredTreatment.desc}
                    </p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-violet-300">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{ESTIMATED_DURATION_MAP[featuredTreatment.id] || '45 mins'}</span>
                    </div>
                  </div>
                </div>

                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border transition-all duration-300 ${
                    selectedTreatmentId === featuredTreatment.id
                      ? 'bg-violet-500 border-violet-400 text-white scale-110 shadow-[0_0_12px_rgba(139,92,246,0.8)]'
                      : 'border-white/20 text-transparent'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Search & Category Filter Bar */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search treatments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl pl-11 pr-4 py-3 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-violet-500/60 focus:bg-white/10 transition-all duration-200"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-white text-black font-semibold shadow-[0_0_15px_rgba(255,255,255,0.3)]'
                    : 'bg-white/5 text-gray-400 border border-white/10 hover:text-white hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Treatment Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[340px] overflow-y-auto pr-1">
          {filteredTreatments.map((treatment, idx) => {
            const isSelected = selectedTreatmentId === treatment.id;
            const IconComponent = getTreatmentIcon(treatment.iconName);

            return (
              <motion.div
                key={treatment.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(idx * 0.03, 0.2), duration: 0.25 }}
                onClick={() => onSelectTreatment(treatment.id)}
                onDoubleClick={() => {
                  onSelectTreatment(treatment.id);
                  onContinue();
                }}
                className={`group relative rounded-2xl p-4 cursor-pointer border transition-all duration-200 flex flex-col justify-between ${
                  isSelected
                    ? 'bg-gradient-to-br from-violet-500/20 via-white/10 to-blue-500/20 border-violet-400/80 shadow-[0_0_20px_rgba(139,92,246,0.25)]'
                    : 'bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-colors ${
                        isSelected
                          ? 'bg-violet-600 text-white border-violet-400'
                          : 'bg-white/5 text-gray-400 border-white/10 group-hover:text-white group-hover:bg-white/10'
                      }`}
                    >
                      <IconComponent className="w-5 h-5" />
                    </div>

                    <div>
                      <h5 className="font-heading font-semibold text-sm text-white group-hover:text-violet-200 transition-colors">
                        {treatment.name}
                      </h5>
                      <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                        {treatment.desc}
                      </p>
                    </div>
                  </div>

                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border transition-all duration-200 ${
                      isSelected
                        ? 'bg-violet-500 border-violet-400 text-white scale-110'
                        : 'border-white/20 text-transparent'
                    }`}
                  >
                    <CheckCircle2 className="w-3 h-3" />
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/5 text-[11px] text-gray-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-violet-400" />
                    {ESTIMATED_DURATION_MAP[treatment.id] || '30 mins'}
                  </span>
                  <span className="text-violet-300 font-medium">Select</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </BookingStepLayout>
  );
}
