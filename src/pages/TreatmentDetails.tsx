import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  TreatmentService,
  Treatment,
  TreatmentPricing,
  TreatmentFAQ,
  TreatmentBlock,
  TreatmentGalleryItem,
  TreatmentSEO
} from '../lib/treatmentService';
import { DoctorService, Doctor } from '../lib/doctorService';
import { supabase } from '../lib/supabase';
import SEO from '../components/SEO';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BookingModal from '../components/booking/BookingModal';
import OptimizedImage from '../components/OptimizedImage';
import { treatmentsData } from '../data/treatments';
import {
  Clock,
  MapPin,
  CheckCircle,
  HelpCircle,
  Users,
  Calendar,
  ChevronRight,
  ShieldCheck,
  Award,
  ChevronDown,
  Activity,
  Layers,
  Sparkles,
  Heart,
  FileText,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { logger } from '../lib/logger';

export default function TreatmentDetails() {
  const { id } = useParams<{ id: string }>();
  const slug = id;
  const navigate = useNavigate();

  const [treatment, setTreatment] = useState<Treatment | null>(null);
  const [pricing, setPricing] = useState<TreatmentPricing[]>([]);
  const [faqs, setFaqs] = useState<TreatmentFAQ[]>([]);
  const [blocks, setBlocks] = useState<TreatmentBlock[]>([]);
  const [gallery, setGallery] = useState<TreatmentGalleryItem[]>([]);
  const [seoData, setSeoData] = useState<TreatmentSEO | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [clinics, setClinics] = useState<any[]>([]);
  const [selectedClinicId, setSelectedClinicId] = useState<string>('');
  
  const [loading, setLoading] = useState(true);
  const [showBooking, setShowBooking] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'procedure' | 'benefits' | 'recovery' | 'gallery'>('overview');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const loadDetails = async () => {
    if (!slug) return;
    setLoading(true);
    try {
      const data = await TreatmentService.getTreatmentBySlug(slug);
      if (!data) {
        navigate('/404');
        return;
      }
      setTreatment(data);

      // Async increment views
      TreatmentService.incrementViewsCount(data.id);

      // Parallel data fetching including new CMS blocks, gallery, and SEO
      const [pricingList, faqList, blocksList, galleryList, seoInfo, allDocs, clinicsList] = await Promise.all([
        TreatmentService.getTreatmentPricing(data.id),
        TreatmentService.getTreatmentFAQs(data.id),
        TreatmentService.getTreatmentBlocks(data.id),
        TreatmentService.getTreatmentGallery(data.id),
        TreatmentService.getTreatmentSEO(data.id),
        DoctorService.getDoctors(),
        supabase.from('clinics').select('id, name, address')
      ]);

      setPricing(pricingList);
      setFaqs(faqList);
      setBlocks(blocksList);
      setGallery(galleryList);
      setSeoData(seoInfo);
      setClinics(clinicsList.data || []);
      if (clinicsList.data && clinicsList.data.length > 0) {
        setSelectedClinicId(clinicsList.data[0].id);
      }

      // Filter doctors that specialize in this treatment/service ID
      const specialists: Doctor[] = [];
      for (const d of allDocs) {
        const assigned = await DoctorService.getDoctorTreatments(d.id);
        if (assigned.includes(data.id)) {
          specialists.push(d);
        }
      }
      setDoctors(specialists.length > 0 ? specialists : allDocs.slice(0, 1));
    } catch (err) {
      logger.error('Error fetching treatment details view:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDetails();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0c] flex flex-col items-center justify-center text-white font-sans">
        <Clock className="w-10 h-10 animate-spin text-[#8B7BF7] mb-4" />
        <span className="text-xs text-[#A1A1A6] uppercase tracking-widest font-semibold">Loading Treatment Details...</span>
      </div>
    );
  }

  if (!treatment) return null;

  const activePricing = pricing.find((p) => p.clinic_id === selectedClinicId);
  const activeClinic = clinics.find((c) => c.id === selectedClinicId);

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-[#F5F5F7] overflow-x-hidden font-sans relative">
      
      {/* Dynamic SEO Overrides & Structured JSON-LD Schema */}
      <SEO
        title={`${treatment.name} Treatment`}
        description={treatment.description || ''}
        url={`https://sahadental.com/treatments/${treatment.slug}`}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MedicalProcedure",
            "name": treatment.name,
            "description": treatment.description || `${treatment.name} treatment provided by Dr. Nilay Saha Dental Clinic.`,
            "procedureType": treatment.category || "Dental Procedure",
            "bodyLocation": "Mouth / Teeth",
            "preparation": "Diagnostic consultation and dental examination",
            "followup": treatment.follow_up_required ? "Follow-up required within 7-10 days" : "Standard dental hygiene checkup",
            "howPerformed": "Laser-assisted and modern digital dentistry protocols"
          })
        }}
      />
      {faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": faqs.map(f => ({
                "@type": "Question",
                "name": f.question,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": f.answer
                }
              }))
            })
          }}
        />
      )}

      <Navbar />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-28 pb-20 relative z-10">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs text-[#A1A1A6] mb-8 font-medium">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
          <span className="text-gray-400">Treatments</span>
          <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
          <span className="text-[#8B7BF7] font-semibold">{treatment.name}</span>
        </div>

        {/* Dynamic content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main content left 2 cols */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Hero Image Banner with Spotlight Header */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-2 rounded-[2.5rem] overflow-hidden border border-white/10 shadow-[0_16px_48px_rgba(0,0,0,0.5)]"
            >
              <div className="relative w-full aspect-[16/9] sm:aspect-[2/1] overflow-hidden bg-black/40">
                <OptimizedImage
                  src={seoData?.og_image || `/DNS_Treatment_${treatment.slug}_Hero_16x9_202607.webp`}
                  fallbackSrc="/DNS_Hero_TwilightExterior_16x9_202607.webp"
                  alt={`${treatment.name} Clinical Setup and Technology`}
                  priority={true}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] via-[#0A0A0F]/60 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 sm:bottom-8 sm:left-8 sm:right-8 z-10 space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-xs px-3 py-1 rounded-full glass-1 text-[#8B7BF7] font-semibold tracking-wider uppercase border border-white/10">
                      {treatment.category || 'General'}
                    </span>
                    <span className="text-xs text-[#A1A1A6] flex items-center gap-1.5 font-medium glass-1 px-3 py-1 rounded-full">
                      <Clock className="w-3.5 h-3.5 text-[#8B7BF7]" />
                      ~{treatment.consultation_duration + treatment.procedure_duration} Mins Total
                    </span>
                    <span className="text-xs text-[#A1A1A6] flex items-center gap-1.5 font-medium glass-1 px-3 py-1 rounded-full">
                      <Activity className="w-3.5 h-3.5 text-emerald-400" />
                      Recovery: {treatment.recovery_time || '1-2 Days'}
                    </span>
                  </div>

                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-[#F5F5F7] tracking-tight leading-[1.12]">
                    {treatment.name}
                  </h1>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="px-6 sm:px-8 pt-4 pb-6 border-b border-white/10 flex items-center gap-2 overflow-x-auto no-scrollbar">
                {[
                  { id: 'overview', label: 'Overview', icon: FileText },
                  { id: 'procedure', label: 'Procedure & Preparation', icon: Layers },
                  { id: 'benefits', label: 'Benefits & Advantages', icon: Sparkles },
                  { id: 'recovery', label: 'Recovery & Aftercare', icon: Heart },
                  { id: 'gallery', label: `Cases & Gallery (${gallery.length || 2})`, icon: Activity }
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold shrink-0 transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-[#7C6BDF] to-[#6366F1] text-white shadow-[0_4px_15px_rgba(139,123,247,0.3)]'
                          : 'glass-1 text-[#A1A1A6] hover:text-white hover:border-white/20'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Tab Panels */}
              <div className="p-6 sm:p-8">
                {activeTab === 'overview' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    <div className="prose prose-invert max-w-none">
                      <p className="text-base sm:text-lg text-[#A1A1A6] leading-[1.7] whitespace-pre-line font-normal">
                        {treatment.description || 'Comprehensive clinical diagnosis and treatment plan engineered for long-term oral stability.'}
                      </p>
                    </div>

                    {/* Render dynamic overview blocks if registered in CMS */}
                    {blocks.filter(b => b.block_type === 'Overview').map(block => (
                      <div key={block.id} className="glass-1 rounded-2xl p-6 border border-white/10 space-y-3">
                        {block.title && <h3 className="text-lg font-display font-bold text-[#F5F5F7]">{block.title}</h3>}
                        <p className="text-sm text-[#A1A1A6] leading-relaxed whitespace-pre-line">{block.content}</p>
                      </div>
                    ))}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/10">
                      <div className="glass-1 rounded-2xl p-5 border border-white/10 flex items-start gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-[#8B7BF7]/15 border border-[#8B7BF7]/30 flex items-center justify-center text-[#8B7BF7] shrink-0">
                          <ShieldCheck className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-[#F5F5F7]">Sterile & Laser-Assisted</h4>
                          <p className="text-xs text-[#A1A1A6] mt-1">Conducted under strict WHO sterilization guidelines and surgical isolation.</p>
                        </div>
                      </div>
                      <div className="glass-1 rounded-2xl p-5 border border-white/10 flex items-start gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                          <CheckCircle className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-[#F5F5F7]">Personalized Care Plan</h4>
                          <p className="text-xs text-[#A1A1A6] mt-1">Custom restorative options calibrated to individual anatomical structures.</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'procedure' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    <h3 className="text-lg font-display font-bold text-[#F5F5F7] flex items-center gap-2">
                      <Layers className="w-5 h-5 text-[#8B7BF7]" />
                      Step-by-Step Clinical Workflow
                    </h3>

                    {blocks.filter(b => b.block_type === 'Procedure' || b.block_type === 'Preparation').length > 0 ? (
                      <div className="space-y-4">
                        {blocks.filter(b => b.block_type === 'Procedure' || b.block_type === 'Preparation').map((b, idx) => (
                          <div key={b.id} className="glass-1 rounded-2xl p-5 border border-white/10 flex items-start gap-4">
                            <span className="w-8 h-8 rounded-full bg-[#8B7BF7]/20 border border-[#8B7BF7]/40 flex items-center justify-center text-xs font-bold text-[#8B7BF7] shrink-0">
                              {idx + 1}
                            </span>
                            <div className="space-y-1">
                              <h4 className="text-base font-semibold text-[#F5F5F7]">{b.title}</h4>
                              <p className="text-sm text-[#A1A1A6] leading-relaxed whitespace-pre-line">{b.content}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {[
                          { step: '01', title: 'Comprehensive Diagnostic Consultation', desc: 'Digital 3D/2D imaging and periodontal evaluation to determine structural viability.' },
                          { step: '02', title: 'Surgical Preparation & Anesthesia', desc: 'Administration of painless local infiltration and absolute isolation with dental dam.' },
                          { step: '03', title: 'Precision Treatment Execution', desc: 'Microsurgical or laser-assisted intervention adhering to modern dental protocols.' },
                          { step: '04', title: 'Restoration & Quality Verification', desc: 'Final polishing, bite articulation check, and post-operative instructions.' }
                        ].map((item, idx) => (
                          <div key={idx} className="glass-1 rounded-2xl p-5 border border-white/10 flex items-start gap-4 hover:border-[#8B7BF7]/30 transition-colors">
                            <span className="w-8 h-8 rounded-full bg-[#8B7BF7]/20 border border-[#8B7BF7]/40 flex items-center justify-center text-xs font-bold text-[#8B7BF7] shrink-0">
                              {item.step}
                            </span>
                            <div className="space-y-1">
                              <h4 className="text-base font-semibold text-[#F5F5F7]">{item.title}</h4>
                              <p className="text-sm text-[#A1A1A6] leading-relaxed">{item.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === 'benefits' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    <h3 className="text-lg font-display font-bold text-[#F5F5F7] flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-[#8B7BF7]" />
                      Clinical & Aesthetic Advantages
                    </h3>

                    {blocks.filter(b => b.block_type === 'Benefits').length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {blocks.filter(b => b.block_type === 'Benefits').map(b => (
                          <div key={b.id} className="glass-1 rounded-2xl p-5 border border-white/10 space-y-2">
                            <h4 className="text-base font-semibold text-[#F5F5F7] flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-[#8B7BF7]" />
                              {b.title}
                            </h4>
                            <p className="text-sm text-[#A1A1A6] leading-relaxed">{b.content}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                          { title: 'Immediate Pain Relief', desc: 'Eliminates acute sensitivity and toothache caused by inflammation or structural defects.' },
                          { title: 'Preserves Natural Tooth', desc: 'Preventing premature extractions maintains natural alveolar bone and dental arch symmetry.' },
                          { title: 'High Aesthetic Integrity', desc: 'Tooth-colored biocompatible materials seamlessly match natural enamel luster and shade.' },
                          { title: 'Long-Term Functional Stability', desc: 'Restores full masticatory forces allowing comfortable chewing and proper speech articulation.' }
                        ].map((adv, idx) => (
                          <div key={idx} className="glass-1 rounded-2xl p-5 border border-white/10 space-y-2 hover:border-[#8B7BF7]/30 transition-colors">
                            <h4 className="text-base font-semibold text-[#F5F5F7] flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-[#8B7BF7]" />
                              {adv.title}
                            </h4>
                            <p className="text-sm text-[#A1A1A6] leading-relaxed">{adv.desc}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === 'recovery' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="glass-1 rounded-2xl p-5 border border-white/10 space-y-2">
                        <span className="text-xs uppercase font-bold text-[#8B7BF7] tracking-wider">Estimated Recovery</span>
                        <h4 className="text-xl font-display font-bold text-[#F5F5F7]">{treatment.recovery_time || '1-2 Days'}</h4>
                        <p className="text-xs text-[#A1A1A6]">Most patients resume regular daily routine immediately post-treatment.</p>
                      </div>
                      <div className="glass-1 rounded-2xl p-5 border border-white/10 space-y-2">
                        <span className="text-xs uppercase font-bold text-emerald-400 tracking-wider">Follow-up Schedule</span>
                        <h4 className="text-xl font-display font-bold text-[#F5F5F7]">{treatment.follow_up_required ? 'Required (7-10 Days)' : 'Optional Review'}</h4>
                        <p className="text-xs text-[#A1A1A6]">Brief clinical evaluation to verify tissue healing and bite balance.</p>
                      </div>
                    </div>

                    <h3 className="text-lg font-display font-bold text-[#F5F5F7] flex items-center gap-2 pt-2">
                      <Heart className="w-5 h-5 text-rose-400" />
                      Post-Treatment Aftercare Guidelines
                    </h3>

                    {blocks.filter(b => b.block_type === 'Recovery' || b.block_type === 'Aftercare' || b.block_type === 'Risks').length > 0 ? (
                      <div className="space-y-4">
                        {blocks.filter(b => b.block_type === 'Recovery' || b.block_type === 'Aftercare' || b.block_type === 'Risks').map(b => (
                          <div key={b.id} className="glass-1 rounded-2xl p-5 border border-white/10 space-y-1">
                            <h4 className="text-base font-semibold text-[#F5F5F7]">{b.title}</h4>
                            <p className="text-sm text-[#A1A1A6] leading-relaxed whitespace-pre-line">{b.content}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {[
                          'Avoid consuming extremely hot or cold beverages until local anesthesia has completely subsided.',
                          'Maintain gentle brushing around the treated area and utilize prescribed antimicrobial oral rinses.',
                          'Abstain from chewing hard or sticky foods directly on newly restored structures for at least 24 hours.',
                          'Take recommended anti-inflammatory medications exactly as advised if mild post-operative tenderness occurs.'
                        ].map((rule, idx) => (
                          <div key={idx} className="glass-1 rounded-2xl p-4 border border-white/10 flex items-start gap-3">
                            <AlertCircle className="w-4 h-4 text-[#8B7BF7] shrink-0 mt-0.5" />
                            <p className="text-sm text-[#A1A1A6]">{rule}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === 'gallery' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    <h3 className="text-lg font-display font-bold text-[#F5F5F7] flex items-center gap-2">
                      <Activity className="w-5 h-5 text-[#8B7BF7]" />
                      Clinical Results & Case Documentation
                    </h3>

                    {gallery.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {gallery.map((item, idx) => (
                          <div key={item.id || idx} className="glass-1 rounded-2xl overflow-hidden border border-white/10 group">
                            <div className="aspect-[4/3] w-full overflow-hidden bg-black/50 relative">
                              <OptimizedImage
                                src={item.public_url || `/DNS_BeforeAfter_${treatment.slug}_Case${idx + 1}_202607.webp`}
                                fallbackSrc="/DNS_Hero_TwilightExterior_16x9_202607.webp"
                                alt={item.alt_text || item.caption || `${treatment.name} Clinical Outcome`}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                              <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full glass-3 text-[10px] font-bold uppercase text-[#8B7BF7] border border-white/20">
                                {item.image_type || 'Case Study'}
                              </span>
                            </div>
                            {item.caption && (
                              <div className="p-4">
                                <p className="text-xs text-[#A1A1A6] leading-relaxed">{item.caption}</p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {[
                          { type: 'Before & After', caption: 'Complete structural restoration and functional rehabilitation achieving seamless margin adaptation.' },
                          { type: 'Clinical Outcome', caption: 'High-precision aesthetic integration preserving soft tissue health and natural gingival contours.' }
                        ].map((demo, idx) => (
                          <div key={idx} className="glass-1 rounded-2xl overflow-hidden border border-white/10 group">
                            <div className="aspect-[4/3] w-full overflow-hidden bg-black/50 relative">
                              <OptimizedImage
                                src={`/DNS_BeforeAfter_${treatment.slug}_Case${idx + 1}_202607.webp`}
                                fallbackSrc="/DNS_Hero_TwilightExterior_16x9_202607.webp"
                                alt={`${treatment.name} Demonstration Case ${idx + 1}`}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                              <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full glass-3 text-[10px] font-bold uppercase text-[#8B7BF7] border border-white/20">
                                {demo.type}
                              </span>
                            </div>
                            <div className="p-4">
                              <p className="text-xs text-[#A1A1A6] leading-relaxed">{demo.caption}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Accompanying specialists */}
            <div className="space-y-4">
              <h3 className="text-lg sm:text-xl font-display font-semibold text-[#F5F5F7] flex items-center gap-2">
                <Users className="w-5 h-5 text-[#8B7BF7]" />
                Assigned Specialists
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {doctors.map((doc) => (
                  <div
                    key={doc.id}
                    className="glass-1 rounded-2xl p-5 border border-white/10 flex items-center gap-4 hover:border-[#8B7BF7]/40 shadow-xl transition-all duration-300 group"
                  >
                    <div className="w-14 h-14 rounded-2xl overflow-hidden border border-white/20 bg-white/5 shadow-lg shrink-0 group-hover:scale-105 transition-transform [mask-image:linear-gradient(to_bottom,black_85%,transparent_100%)]">
                      <OptimizedImage 
                        src={doc.profile_image || "/DNS_Portrait_DrNilay_Headshot_4x5_202607.webp"} 
                        fallbackSrc="/dr-nilay-saha.jpg"
                        alt={doc.name} 
                        className="w-full h-full object-cover object-top" 
                      />
                    </div>
                    <div>
                      <h4 className="font-display font-semibold text-base text-[#F5F5F7] group-hover:text-[#8B7BF7] transition-colors">{doc.name}</h4>
                      <p className="text-xs text-[#8B7BF7] font-medium mt-0.5">{doc.qualification || 'BDS'}</p>
                      <p className="text-[11px] text-[#A1A1A6] mt-0.5">{doc.designation || 'Dental Surgeon & Oral Physician'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQs List Accordion */}
            {faqs.length > 0 && (
              <div className="space-y-4 pt-4">
                <h3 className="text-lg sm:text-xl font-display font-semibold text-[#F5F5F7] flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-[#8B7BF7]" />
                  Frequently Asked Questions
                </h3>
                <div className="space-y-3">
                  {faqs.map((faq, index) => {
                    const isOpen = activeFaq === index;
                    return (
                      <div
                        key={faq.id}
                        className={`rounded-2xl overflow-hidden border transition-all duration-300 ${
                          isOpen ? 'glass-2 border-[#8B7BF7]/30 shadow-[0_8px_24px_rgba(139,123,247,0.15)]' : 'glass-1 border-white/10 hover:border-white/20'
                        }`}
                      >
                        <button
                          onClick={() => setActiveFaq(isOpen ? null : index)}
                          className="w-full p-5 text-left flex items-center justify-between text-sm sm:text-base font-display font-semibold text-[#F5F5F7]"
                        >
                          <span>{faq.question}</span>
                          <ChevronDown className={`w-4 h-4 text-[#A1A1A6] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                        </button>
                        <AnimatePresence>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3, ease: 'easeInOut' }}
                              className="overflow-hidden"
                            >
                              <p className="px-5 pb-5 text-xs sm:text-sm text-[#A1A1A6] leading-[1.6] border-t border-white/10 pt-3">
                                {faq.answer}
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Related Treatments Grid */}
            <div className="space-y-4 pt-6 border-t border-white/10">
              <h3 className="text-lg sm:text-xl font-display font-semibold text-[#F5F5F7] flex items-center justify-between">
                <span>Related Treatments in {treatment.category}</span>
                <Link to="/#treatments" className="text-xs text-[#8B7BF7] hover:underline font-normal">View All</Link>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {treatmentsData
                  .filter(t => t.id !== treatment.slug && (t as any).category === treatment.category)
                  .slice(0, 2)
                  .map((rel) => (
                    <Link
                      key={rel.id}
                      to={`/treatments/${rel.id}`}
                      className="glass-1 rounded-2xl p-5 border border-white/10 flex items-center justify-between group hover:border-[#8B7BF7]/40 transition-all"
                    >
                      <div>
                        <h4 className="text-sm font-semibold text-[#F5F5F7] group-hover:text-[#8B7BF7] transition-colors">{rel.name}</h4>
                        <p className="text-xs text-[#A1A1A6] mt-1 line-clamp-1">{rel.desc}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#A1A1A6] group-hover:translate-x-1 group-hover:text-white transition-all shrink-0" />
                    </Link>
                  ))}
              </div>
            </div>
          </div>

          {/* Pricing Selector Sidebar widget right 1 col */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-2 rounded-[2rem] p-7 border border-white/10 shadow-[0_16px_48px_rgba(0,0,0,0.5)] space-y-6 sticky top-28"
            >
              <div>
                <h3 className="font-display font-semibold text-lg text-[#F5F5F7]">Select Location</h3>
                <p className="text-xs text-[#A1A1A6] mt-1 leading-normal">Choose clinic center to check local availability and pricing</p>
              </div>

              {/* Clinic Dropdown */}
              <div className="relative">
                <select
                  value={selectedClinicId}
                  onChange={(e) => setSelectedClinicId(e.target.value)}
                  className="w-full px-4 py-3 bg-black/50 border border-white/15 rounded-2xl text-sm text-[#F5F5F7] font-medium focus:outline-none focus:border-[#8B7BF7] appearance-none transition-colors"
                  style={{ colorScheme: 'dark' }}
                >
                  {clinics.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-[#A1A1A6] absolute right-4 top-4 pointer-events-none" />
              </div>

              {/* Price card box */}
              {activePricing ? (
                <div className="glass-1 rounded-2xl p-5 border border-white/10 space-y-4">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs text-[#A1A1A6] uppercase font-semibold tracking-wider">Treatment Cost</span>
                    <div className="flex items-baseline gap-2">
                      {activePricing.sale_price ? (
                        <>
                          <span className="text-2xl font-display font-bold text-[#8B7BF7]">₹{activePricing.sale_price}</span>
                          <span className="text-sm text-[#A1A1A6] line-through font-medium">₹{activePricing.base_price}</span>
                        </>
                      ) : (
                        <span className="text-2xl font-display font-bold text-[#F5F5F7]">₹{activePricing.base_price}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 text-xs text-[#A1A1A6] pt-1 border-t border-white/10">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{activePricing.insurance_covered ? 'Eligible for Dental Insurance claim' : 'Direct pay / Card / UPI'}</span>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-[#A1A1A6] italic">No pricing registered for this clinic location.</p>
              )}

              {/* Booking CTA */}
              <button
                onClick={() => setShowBooking(true)}
                className="w-full py-4 rounded-full bg-gradient-to-r from-[#7C6BDF] to-[#6366F1] text-white font-semibold text-sm hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(139,123,247,0.4)] hover:shadow-[0_0_35px_rgba(139,123,247,0.6)]"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Scheduled Slot</span>
              </button>
            </motion.div>
          </div>

        </div>
      </div>

      <Footer />

      {/* Booking Wizard modal pre-populated */}
      {showBooking && (
        <BookingModal
          initialTreatmentId={treatment.slug}
          onClose={() => setShowBooking(false)}
        />
      )}
    </div>
  );
}
