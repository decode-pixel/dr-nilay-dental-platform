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
      <div className="min-h-screen bg-[#02020a] flex flex-col items-center justify-center text-white">
        <Clock className="w-10 h-10 animate-spin text-violet-400 mb-4" />
        <span className="text-xs text-gray-500 uppercase tracking-widest font-semibold">Loading Service Details...</span>
      </div>
    );
  }

  if (!treatment) return null;

  const activePricing = pricing.find((p) => p.clinic_id === selectedClinicId);
  const activeClinic = clinics.find((c) => c.id === selectedClinicId);

  return (
    <div className="min-h-screen bg-[#02020a] text-gray-200 overflow-x-hidden font-sans relative">
      
      {/* Dynamic SEO Overrides */}
      <SEO
        title={`${treatment.name} Treatment`}
        description={treatment.description || ''}
        url={`https://sahadental.com/treatments/${treatment.slug}`}
      />

      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 relative z-10">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-8">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-gray-400">Treatments</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-violet-400 font-bold">{treatment.name}</span>
        </div>

        {/* Dynamic content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main content left 2 cols */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel border border-white/10 bg-[#050614]/40 backdrop-blur-xl rounded-3xl p-6 sm:p-8 space-y-5"
            >
              <div className="flex items-center gap-3">
                <span className="text-xs px-2.5 py-1 rounded bg-violet-600/10 text-violet-400 font-bold border border-violet-500/20">
                  {treatment.category || 'General'}
                </span>
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  ~{treatment.estimated_duration} Mins
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-white leading-tight">
                {treatment.name}
              </h1>

              <p className="text-sm sm:text-base text-gray-400 leading-relaxed whitespace-pre-line">
                {treatment.description || 'Treatment details catalogue information.'}
              </p>
            </motion.div>

            {/* Accompanying specialists */}
            <div className="space-y-4">
              <h3 className="text-lg font-heading font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-violet-400" />
                Assigned Specialists
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {doctors.map((doc) => (
                  <div
                    key={doc.id}
                    className="glass-panel border border-white/10 bg-[#050614]/40 rounded-2xl p-4 flex items-center gap-4 hover:border-violet-500/40 shadow-xl transition-all duration-300 group"
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
                      <h4 className="font-heading font-bold text-sm text-white group-hover:text-violet-300 transition-colors">{doc.name}</h4>
                      <p className="text-xs text-violet-300 font-medium mt-0.5">{doc.qualification || 'BDS, FIE'}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">{doc.designation || 'Dental Surgeon & Oral Physician'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQs List Accordion */}
            {faqs.length > 0 && (
              <div className="space-y-4 pt-4">
                <h3 className="text-lg font-heading font-bold text-white flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-violet-400" />
                  Frequently Asked Questions
                </h3>
                <div className="space-y-3">
                  {faqs.map((faq, index) => {
                    const isOpen = activeFaq === index;
                    return (
                      <div
                        key={faq.id}
                        className="glass-panel border border-white/5 bg-[#050614]/20 rounded-2xl overflow-hidden transition-all duration-300"
                      >
                        <button
                          onClick={() => setActiveFaq(isOpen ? null : index)}
                          className="w-full p-4 text-left flex items-center justify-between text-xs font-bold text-white"
                        >
                          <span>{faq.question}</span>
                          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                        </button>
                        <AnimatePresence>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height: 'auto' }}
                              exit={{ height: 0 }}
                              className="overflow-hidden"
                            >
                              <p className="px-4 pb-4 text-xs text-gray-400 leading-relaxed border-t border-white/5 pt-2">
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
              className="glass-panel border border-white/10 bg-[#050614]/50 backdrop-blur-xl rounded-3xl p-6 space-y-6 sticky top-28"
            >
              <div>
                <h3 className="font-heading font-bold text-base text-white">Select Location</h3>
                <p className="text-[10px] text-gray-500 mt-0.5">Choose clinic center to resolve localized price list</p>
              </div>

              {/* Clinic Dropdown */}
              <div className="relative">
                <select
                  value={selectedClinicId}
                  onChange={(e) => setSelectedClinicId(e.target.value)}
                  className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none appearance-none"
                  style={{ colorScheme: 'dark' }}
                >
                  {clinics.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-3.5 pointer-events-none" />
              </div>

              {/* Price card box */}
              {activePricing ? (
                <div className="bg-black/30 border border-white/5 rounded-2xl p-4 space-y-4">
                  <div className="flex items-baseline justify-between">
                    <span className="text-[10px] text-gray-500 uppercase font-bold">Treatment Cost</span>
                    <div className="flex items-baseline gap-1.5">
                      {activePricing.sale_price ? (
                        <>
                          <span className="text-xl font-extrabold text-violet-400">₹{activePricing.sale_price}</span>
                          <span className="text-xs text-gray-500 line-through">₹{activePricing.base_price}</span>
                        </>
                      ) : (
                        <span className="text-xl font-extrabold text-white">₹{activePricing.base_price}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-[10px] text-gray-400">
                    <ShieldCheck className="w-4 h-4 text-green-400" />
                    <span>{activePricing.insurance_covered ? 'Eligible for Dental Insurance claim' : 'Direct pay only'}</span>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-gray-500 italic">No pricing registered for this clinic.</p>
              )}

              {/* Booking CTA */}
              <button
                onClick={() => setShowBooking(true)}
                className="w-full py-3.5 rounded-full bg-gradient-to-r from-violet-600 to-blue-600 text-white font-bold text-xs hover:-translate-y-1 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_40px_rgba(139,92,246,0.5)]"
              >
                <Calendar className="w-4 h-4" />
                Book Scheduled Slot
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
