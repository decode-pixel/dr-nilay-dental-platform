import React, { useState, useEffect } from 'react';
import {
  TreatmentService,
  TreatmentCategory,
  Treatment,
  TreatmentPricing,
  TreatmentFAQ,
  TreatmentGalleryItem
} from '../../lib/treatmentService';
import { SettingsService } from '../../lib/settingsService';
import { useToast } from '../../components/ToastNotification';
import { logger } from '../../lib/logger';
import { supabase } from '../../lib/supabase';
import {
  FileText,
  Save,
  Plus,
  Trash2,
  DollarSign,
  MapPin,
  Clock,
  Layers,
  HelpCircle,
  Image as ImageIcon,
  CheckCircle,
  Eye,
  TrendingUp,
  Settings,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function DashboardTreatments() {
  const { showToast } = useToast();
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [categories, setCategories] = useState<TreatmentCategory[]>([]);
  const [selectedTreatment, setSelectedTreatment] = useState<Treatment | null>(null);
  const [loading, setLoading] = useState(true);

  // Sub-Navigation tabs inside treatments workspace
  const [workspaceTab, setWorkspaceTab] = useState<'profile' | 'pricing' | 'clinics' | 'faqs' | 'seo'>('profile');

  const loadTreatmentsData = async () => {
    setLoading(true);
    try {
      const [list, cats] = await Promise.all([
        TreatmentService.getTreatments(),
        TreatmentService.getCategories()
      ]);
      setTreatments(list);
      setCategories(cats);
      if (list.length > 0) {
        setSelectedTreatment((p) => list.find((t) => t.id === p?.id) || list[0]);
      }
    } catch (err) {
      logger.error('Error loading treatments data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTreatmentsData();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-white py-20 bg-transparent">
        <Clock className="w-10 h-10 animate-spin text-violet-400 mb-4" />
        <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Loading Treatment CMS Catalogue...</span>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col lg:flex-row h-[calc(100vh-80px)] overflow-hidden font-sans bg-transparent">
      
      {/* 1. Left Sidebar: Treatments list */}
      <div className="w-full lg:w-72 border-r border-white/10 flex flex-col bg-[#050614]/40 backdrop-blur-md shrink-0 h-full">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <h3 className="font-heading font-bold text-sm text-white uppercase tracking-wider">
            Treatments
          </h3>
          <span className="text-[10px] px-2 py-0.5 rounded bg-violet-600/10 text-violet-400 border border-violet-500/20 font-bold">
            {treatments.length} Services
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
          {treatments.map((t) => {
            const isSelected = selectedTreatment?.id === t.id;
            return (
              <div
                key={t.id}
                onClick={() => setSelectedTreatment(t)}
                className={`group rounded-2xl p-4 cursor-pointer border transition-all ${
                  isSelected
                    ? 'bg-gradient-to-br from-violet-600/15 to-blue-600/15 border-violet-400/50 shadow-md'
                    : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="truncate">
                    <h4 className="font-heading font-bold text-sm text-white group-hover:text-violet-200 truncate">
                      {t.name}
                    </h4>
                    <p className="text-[10px] text-gray-400 truncate">{t.category}</p>
                  </div>
                  {t.featured && (
                    <span className="text-[8px] px-1.5 py-0.5 rounded bg-violet-600 text-white font-bold shrink-0">
                      Featured
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Right Workspace: Selected Treatment Editor */}
      {selectedTreatment && (
        <div className="flex-1 flex flex-col h-full bg-white/[0.01]">
          {/* Header */}
          <div className="px-6 py-4 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/[0.01] shrink-0">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="font-heading font-bold text-lg text-white">{selectedTreatment.name}</h2>
                <span className={`text-[9px] px-2 py-0.5 rounded font-bold border ${
                  selectedTreatment.is_active
                    ? 'bg-green-500/10 text-green-400 border-green-500/20'
                    : 'bg-red-500/10 text-red-400 border-red-500/20'
                }`}>
                  {selectedTreatment.is_active ? 'Active Status' : 'Inactive'}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">Slug: <strong className="text-violet-300">/treatments/{selectedTreatment.slug}</strong> • Duration: {selectedTreatment.estimated_duration} mins</p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] text-gray-500 flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                {selectedTreatment.views_count} Views
              </span>
            </div>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="px-6 border-b border-white/10 bg-white/[0.005] overflow-x-auto flex gap-6 shrink-0 text-xs font-semibold">
            {[
              { id: 'profile', label: 'Treatment Profile' },
              { id: 'pricing', label: 'Clinic Pricing' },
              { id: 'clinics', label: 'Clinic mappings' },
              { id: 'faqs', label: 'FAQs' },
              { id: 'seo', label: 'SEO tags' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setWorkspaceTab(tab.id as any)}
                className={`py-3.5 border-b-2 transition-all whitespace-nowrap ${
                  workspaceTab === tab.id
                    ? 'border-violet-500 text-white'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Scrollable workspace form body */}
          <div className="flex-1 overflow-y-auto p-6 min-h-0">
            <AnimatePresence mode="wait">
              {workspaceTab === 'profile' && (
                <TreatmentProfileForm
                  key={`profile-${selectedTreatment.id}`}
                  treatment={selectedTreatment}
                  categories={categories}
                  onSave={loadTreatmentsData}
                />
              )}

              {workspaceTab === 'pricing' && (
                <TreatmentPricingForm
                  key={`pricing-${selectedTreatment.id}`}
                  treatment={selectedTreatment}
                />
              )}

              {workspaceTab === 'clinics' && (
                <TreatmentClinicMapping
                  key={`clinics-${selectedTreatment.id}`}
                  treatment={selectedTreatment}
                />
              )}

              {workspaceTab === 'faqs' && (
                <TreatmentFaqsForm
                  key={`faqs-${selectedTreatment.id}`}
                  treatment={selectedTreatment}
                />
              )}

              {workspaceTab === 'seo' && (
                <TreatmentSeoForm
                  key={`seo-${selectedTreatment.id}`}
                  treatment={selectedTreatment}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}

/* ==========================================
   SUB-COMPONENT 1: TREATMENT PROFILE FORM
   ========================================== */
interface ProfileProps {
  treatment: Treatment;
  categories: TreatmentCategory[];
  onSave: () => void;
}
function TreatmentProfileForm({ treatment, categories, onSave }: ProfileProps) {
  const { showToast } = useToast();
  const [form, setForm] = useState({
    name: treatment.name || '',
    slug: treatment.slug || '',
    estimated_duration: String(treatment.estimated_duration || 30),
    description: treatment.description || '',
    featured: treatment.featured,
    category_id: treatment.category_id || '',
    is_active: treatment.is_active
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const resolvedCat = categories.find((c) => c.id === form.category_id);
    const ok = await TreatmentService.updateTreatmentProfile(treatment.id, {
      name: form.name,
      slug: form.slug,
      estimated_duration: parseInt(form.estimated_duration, 10) || 30,
      description: form.description,
      featured: form.featured,
      category_id: form.category_id || null,
      category: resolvedCat ? resolvedCat.name : treatment.category,
      is_active: form.is_active
    });
    setSaving(false);
    if (ok) {
      showToast('Treatment profile updated successfully!', 'success');
      onSave();
    } else {
      showToast('Failed to save profile.', 'error');
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="space-y-5 max-w-2xl bg-white/5 border border-white/10 rounded-3xl p-6 text-gray-200"
    >
      <h3 className="font-heading font-bold text-sm text-white flex items-center gap-2 mb-3">
        <FileText className="w-4 h-4 text-violet-400" />
        Treatment Basic Settings
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">Treatment Name</label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">URL Slug</label>
          <input
            type="text"
            required
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">Category Classification</label>
          <select
            value={form.category_id}
            onChange={(e) => setForm({ ...form, category_id: e.target.value })}
            className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none"
            style={{ colorScheme: 'dark' }}
          >
            <option value="">No Category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">Duration (Mins)</label>
          <input
            type="number"
            required
            value={form.estimated_duration}
            onChange={(e) => setForm({ ...form, estimated_duration: e.target.value })}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
          />
        </div>

        <div className="flex flex-col justify-end pb-2">
          <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              className="accent-violet-500 w-4 h-4 cursor-pointer"
            />
            Featured Treatment
          </label>
        </div>
      </div>

      <div>
        <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">Description</label>
        <textarea
          rows={4}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none resize-none"
        />
      </div>

      <div className="flex justify-end gap-2 pt-2 border-t border-white/5">
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition-all flex items-center gap-1.5"
        >
          <Save className="w-3.5 h-3.5" />
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </motion.form>
  );
}

/* ==========================================
   SUB-COMPONENT 2: CLINIC PRICING FORM
   ========================================== */
interface PricingProps {
  treatment: Treatment;
}
function TreatmentPricingForm({ treatment }: PricingProps) {
  const { showToast } = useToast();
  const [clinics, setClinics] = useState<any[]>([]);
  const [pricingList, setPricingList] = useState<TreatmentPricing[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([
      supabase.from('clinics').select('id, name'),
      TreatmentService.getTreatmentPricing(treatment.id)
    ]).then(([clinRes, list]) => {
      setClinics(clinRes.data || []);
      setPricingList(list);
      setLoading(false);
    });
  }, [treatment.id]);

  const handlePriceChange = (clinicId: string, field: keyof TreatmentPricing, value: any) => {
    setPricingList((prev) => {
      const existsIndex = prev.findIndex((p) => p.clinic_id === clinicId);
      const next = [...prev];

      if (existsIndex > -1) {
        next[existsIndex] = { ...next[existsIndex], [field]: value };
      } else {
        next.push({
          service_id: treatment.id,
          clinic_id: clinicId,
          base_price: 1500,
          sale_price: 0,
          insurance_covered: true,
          [field]: value
        });
      }
      return next;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    const ok = await TreatmentService.saveTreatmentPricing(treatment.id, pricingList);
    setSaving(false);
    if (ok) showToast('Clinic-specific prices updated successfully!', 'success');
    else showToast('Failed to save prices.', 'error');
  };

  if (loading) return <div className="text-xs text-gray-500">Checking pricing catalogs...</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 max-w-3xl bg-white/5 border border-white/10 rounded-3xl p-6"
    >
      <h3 className="font-heading font-bold text-sm text-white flex items-center gap-2">
        <DollarSign className="w-4 h-4 text-violet-400" />
        Configure Dynamic Pricing per Location
      </h3>

      <div className="space-y-4">
        {clinics.map((c) => {
          const row = pricingList.find((p) => p.clinic_id === c.id) || {
            base_price: 1500,
            sale_price: 1200,
            insurance_covered: true
          };

          return (
            <div
              key={c.id}
              className="bg-black/20 border border-white/5 p-4 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <span className="text-xs font-bold text-white md:w-40">{c.name}</span>

              <div className="flex-1 grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-[9px] text-gray-500 uppercase font-bold mb-1">Base Price (INR)</label>
                  <input
                    type="number"
                    value={row.base_price}
                    onChange={(e) => handlePriceChange(c.id, 'base_price', parseFloat(e.target.value) || 0)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[9px] text-gray-500 uppercase font-bold mb-1">Promo Sale Price (INR)</label>
                  <input
                    type="number"
                    value={row.sale_price || ''}
                    placeholder="None"
                    onChange={(e) => handlePriceChange(c.id, 'sale_price', parseFloat(e.target.value) || undefined)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none"
                  />
                </div>

                <div className="flex flex-col justify-end pb-2">
                  <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={row.insurance_covered}
                      onChange={(e) => handlePriceChange(c.id, 'insurance_covered', e.target.checked)}
                      className="accent-violet-500 w-4 h-4 cursor-pointer"
                    />
                    Insurance covered
                  </label>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-end gap-2 pt-2 border-t border-white/5">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition-all flex items-center gap-1.5"
        >
          <Save className="w-3.5 h-3.5" />
          {saving ? 'Updating catalog...' : 'Save Price List'}
        </button>
      </div>
    </motion.div>
  );
}

/* ==========================================
   SUB-COMPONENT 3: CLINIC MAPPING
   ========================================== */
function TreatmentClinicMapping({ treatment }: PricingProps) {
  const { showToast } = useToast();
  const [clinics, setClinics] = useState<any[]>([]);
  const [mappedIds, setMappedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([
      supabase.from('clinics').select('id, name, address'),
      TreatmentService.getClinicTreatments(treatment.id)
    ]).then(([clinRes, ids]) => {
      setClinics(clinRes.data || []);
      setMappedIds(ids);
      setLoading(false);
    });
  }, [treatment.id]);

  const handleToggle = (clinicId: string) => {
    setMappedIds((prev) =>
      prev.includes(clinicId) ? prev.filter((id) => id !== clinicId) : [...prev, clinicId]
    );
  };

  const handleSave = async () => {
    setSaving(true);
    const ok = await TreatmentService.saveClinicTreatments(treatment.id, mappedIds);
    setSaving(false);
    if (ok) showToast('Clinics mapping updated successfully!', 'success');
    else showToast('Failed to save mappings.', 'error');
  };

  if (loading) return <div className="text-xs text-gray-500">Checking location mappings...</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 max-w-2xl bg-white/5 border border-white/10 rounded-3xl p-6"
    >
      <h3 className="font-heading font-bold text-sm text-white flex items-center gap-2">
        <MapPin className="w-4 h-4 text-violet-400" />
        Map Service to Active Clinics
      </h3>

      <div className="grid grid-cols-1 gap-3">
        {clinics.map((c) => {
          const isChecked = mappedIds.includes(c.id);
          return (
            <div
              key={c.id}
              onClick={() => handleToggle(c.id)}
              className={`p-3 rounded-2xl border cursor-pointer flex items-center justify-between transition-colors ${
                isChecked
                  ? 'bg-violet-600/10 border-violet-500/30 text-white'
                  : 'bg-white/5 border-white/5 hover:bg-white/10 text-gray-400'
              }`}
            >
              <div>
                <p className="text-xs font-bold text-white">{c.name}</p>
                <p className="text-[10px] text-gray-500 mt-0.5">{c.address}</p>
              </div>
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => {}}
                className="accent-violet-500 cursor-pointer w-4 h-4"
              />
            </div>
          );
        })}
      </div>

      <div className="flex justify-end gap-2 pt-2 border-t border-white/5">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition-all flex items-center gap-1.5"
        >
          <Save className="w-3.5 h-3.5" />
          {saving ? 'Updating mappings...' : 'Save Mappings'}
        </button>
      </div>
    </motion.div>
  );
}

/* ==========================================
   SUB-COMPONENT 4: FAQS FORM
   ========================================== */
function TreatmentFaqsForm({ treatment }: PricingProps) {
  const { showToast } = useToast();
  const [faqs, setFaqs] = useState<TreatmentFAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    TreatmentService.getTreatmentFAQs(treatment.id).then((data) => {
      setFaqs(data);
      setLoading(false);
    });
  }, [treatment.id]);

  const handleAdd = () => {
    setFaqs([...faqs, { service_id: treatment.id, question: '', answer: '', display_order: faqs.length }]);
  };

  const handleRemove = (index: number) => {
    setFaqs(faqs.filter((_, i) => i !== index));
  };

  const handleChange = (index: number, field: keyof TreatmentFAQ, value: any) => {
    const updated = [...faqs];
    updated[index] = { ...updated[index], [field]: value };
    setFaqs(updated);
  };

  const handleSave = async () => {
    setSaving(true);
    const ok = await TreatmentService.saveTreatmentFAQs(treatment.id, faqs);
    setSaving(false);
    if (ok) showToast('FAQs list saved successfully!', 'success');
    else showToast('Failed to save FAQs.', 'error');
  };

  if (loading) return <div className="text-xs text-gray-500">Checking FAQs list...</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 max-w-3xl bg-white/5 border border-white/10 rounded-3xl p-6"
    >
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <h3 className="font-heading font-bold text-sm text-white flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-violet-400" />
          Treatment Frequently Asked Questions
        </h3>
        <button
          onClick={handleAdd}
          className="px-2.5 py-1 rounded bg-white/5 border border-white/10 hover:bg-white/10 text-[10px] text-white flex items-center gap-1 font-bold"
        >
          <Plus className="w-3.5 h-3.5" />
          Add FAQ
        </button>
      </div>

      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
        {faqs.map((faq, idx) => (
          <div key={idx} className="bg-black/30 border border-white/5 rounded-2xl p-4 relative space-y-3">
            <button
              onClick={() => handleRemove(idx)}
              className="absolute top-4 right-4 text-gray-500 hover:text-red-400"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <div>
              <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">Question</label>
              <input
                type="text"
                required
                value={faq.question}
                placeholder="e.g. Is Root Canal treatment painful?"
                onChange={(e) => handleChange(idx, 'question', e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">Answer Summary</label>
              <textarea
                rows={2}
                required
                value={faq.answer}
                placeholder="Provide clean answer details..."
                onChange={(e) => handleChange(idx, 'answer', e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none resize-none"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-2 pt-2 border-t border-white/5">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition-all flex items-center gap-1.5"
        >
          <Save className="w-3.5 h-3.5" />
          Save FAQs
        </button>
      </div>
    </motion.div>
  );
}

/* ==========================================
   SUB-COMPONENT 5: SEO OVERRIDES FORM
   ========================================== */
function TreatmentSeoForm({ treatment }: PricingProps) {
  const { showToast } = useToast();
  const [form, setForm] = useState({
    title: '',
    meta_description: '',
    canonical_url: '',
    og_title: '',
    og_description: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const targetPath = `/treatments/${treatment.slug}`;

  useEffect(() => {
    SettingsService.getSeoForPath(targetPath).then((data) => {
      if (data) {
        setForm({
          title: data.title || '',
          meta_description: data.meta_description || '',
          canonical_url: data.canonical_url || '',
          og_title: data.og_title || '',
          og_description: data.og_description || ''
        });
      } else {
        setForm({
          title: `${treatment.name} Treatment Details`,
          meta_description: `Learn more about our premium orthodontic and endodontic ${treatment.name} surgery procedures.`,
          canonical_url: `https://sahadental.com/treatments/${treatment.slug}`,
          og_title: `${treatment.name} | Saha Dental Clinics`,
          og_description: `Learn more about our premium orthodontic and endodontic ${treatment.name} surgery procedures.`
        });
      }
      setLoading(false);
    });
  }, [treatment.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const ok = await SettingsService.saveSeoForPath(targetPath, form);
    setSaving(false);
    if (ok) showToast('SEO Meta configurations saved!', 'success');
    else showToast('Failed to save SEO config.', 'error');
  };

  if (loading) return <div className="text-xs text-gray-500">Checking SEO configs...</div>;

  return (
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="space-y-4 max-w-2xl bg-white/5 border border-white/10 rounded-3xl p-6 text-gray-200"
    >
      <h3 className="font-heading font-bold text-sm text-white flex items-center gap-2">
        <Settings className="w-4 h-4 text-violet-400" />
        SEO Metadata & Open Graph Tags Overrides
      </h3>

      <div>
        <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">Page Document Title</label>
        <input
          type="text"
          required
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">Meta Description Override</label>
        <textarea
          rows={3}
          required
          value={form.meta_description}
          onChange={(e) => setForm({ ...form, meta_description: e.target.value })}
          className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none resize-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4 pt-3 border-t border-white/5">
        <div>
          <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">OG Share Title</label>
          <input
            type="text"
            value={form.og_title}
            onChange={(e) => setForm({ ...form, og_title: e.target.value })}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">OG Share Description</label>
          <input
            type="text"
            value={form.og_description}
            onChange={(e) => setForm({ ...form, og_description: e.target.value })}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2 border-t border-white/5">
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition-all flex items-center gap-1.5"
        >
          <Save className="w-3.5 h-3.5" />
          Save SEO Meta
        </button>
      </div>
    </motion.form>
  );
}
