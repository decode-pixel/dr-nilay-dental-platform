import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  TreatmentService,
  Treatment,
  TreatmentPricing,
  TreatmentFAQ
} from '../lib/treatmentService';
import { DoctorService, Doctor } from '../lib/doctorService';
import { supabase } from '../lib/supabase';
import SEO from '../components/SEO';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BookingModal from '../components/booking/BookingModal';
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
  ChevronDown
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
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [clinics, setClinics] = useState<any[]>([]);
  const [selectedClinicId, setSelectedClinicId] = useState<string>('');
  
  const [loading, setLoading] = useState(true);
  const [showBooking, setShowBooking] = useState(false);
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

      // Parallel data fetching
      const [pricingList, faqList, allDocs, clinicsList] = await Promise.all([
        TreatmentService.getTreatmentPricing(data.id),
        TreatmentService.getTreatmentFAQs(data.id),
        DoctorService.getDoctors(),
        supabase.from('clinics').select('id, name, address')
      ]);

      setPricing(pricingList);
      setFaqs(faqList);
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
      
      {/* Dynamic SEO Overrides */}
      <SEO
        title={`${treatment.name} Treatment`}
        description={treatment.description || ''}
        url={`https://sahadental.com/treatments/${treatment.slug}`}
      />

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
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-2 rounded-[2.5rem] p-8 sm:p-10 border border-white/10 shadow-[0_16px_48px_rgba(0,0,0,0.5)] space-y-6"
            >
              <div className="flex items-center gap-3">
                <span className="text-xs px-3 py-1 rounded-full glass-1 text-[#8B7BF7] font-semibold tracking-wider uppercase border border-white/10">
                  {treatment.category || 'General'}
                </span>
                <span className="text-xs text-[#A1A1A6] flex items-center gap-1.5 font-medium">
                  <Clock className="w-3.5 h-3.5 text-[#8B7BF7]" />
                  ~{treatment.estimated_duration} Mins
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-[#F5F5F7] tracking-tight leading-[1.12]">
                {treatment.name}
              </h1>

              <p className="text-base sm:text-lg text-[#A1A1A6] leading-[1.6] whitespace-pre-line font-normal">
                {treatment.description || 'Treatment details catalogue information.'}
              </p>
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
                      {doc.profile_image ? (
                        <img src={doc.profile_image} alt={doc.name} className="w-full h-full object-cover object-top" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500">
                          <Users className="w-5 h-5" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-display font-semibold text-base text-[#F5F5F7] group-hover:text-[#8B7BF7] transition-colors">{doc.name}</h4>
                      <p className="text-xs text-[#8B7BF7] font-medium mt-0.5">{doc.qualification || 'BDS, FIE'}</p>
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
