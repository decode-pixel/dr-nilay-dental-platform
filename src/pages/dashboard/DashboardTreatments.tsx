import React, { useState, useEffect } from 'react';
import {
  TreatmentService,
  TreatmentCategory,
  Treatment,
  TreatmentPricing,
  TreatmentFAQ,
  TreatmentGalleryItem,
  TreatmentBlock,
  TreatmentSEO
} from '../../lib/treatmentService';
import { DoctorService, Doctor } from '../../lib/doctorService';
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
  Info,
  Users,
  LayoutGrid,
  ShieldCheck,
  Stethoscope
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function DashboardTreatments() {
  const { showToast } = useToast();
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [categories, setCategories] = useState<TreatmentCategory[]>([]);
  const [selectedTreatment, setSelectedTreatment] = useState<Treatment | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<'treatments' | 'categories'>('treatments');

  // Sub-Navigation tabs inside treatments workspace
  const [workspaceTab, setWorkspaceTab] = useState<'profile' | 'pricing' | 'clinics' | 'doctors' | 'gallery' | 'faqs' | 'blocks' | 'seo'>('profile');

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

  const handleCreateNewTreatment = async () => {
    const title = prompt('Enter new treatment title:');
    if (!title) return;
    const newT = await TreatmentService.createTreatment({
      name: title,
      status: 'Published',
      consultation_duration: 15,
      procedure_duration: 45
    });
    if (newT) {
      showToast('Treatment created successfully!', 'success');
      await loadTreatmentsData();
      setSelectedTreatment(newT);
    } else {
      showToast('Failed to create treatment.', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-white py-20 bg-transparent">
        <Clock className="w-10 h-10 animate-spin text-violet-400 mb-4" />
        <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Loading Treatment CMS Catalogue...</span>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-80px)] overflow-hidden font-sans bg-transparent">
      {/* Top Header Toggle Bar */}
      <div className="px-6 py-3 border-b border-white/10 flex items-center justify-between bg-[#050614]/60 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-4">
          <h2 className="text-base font-heading font-bold text-white flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-violet-400" />
            Treatment Management CMS
          </h2>
          <div className="flex bg-black/40 border border-white/10 rounded-xl p-1">
            <button
              onClick={() => setActiveView('treatments')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeView === 'treatments' ? 'bg-violet-600 text-white shadow' : 'text-gray-400 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Treatments ({treatments.length})
            </button>
            <button
              onClick={() => setActiveView('categories')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeView === 'categories' ? 'bg-violet-600 text-white shadow' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Categories ({categories.length})
            </button>
          </div>
        </div>

        {activeView === 'treatments' && (
          <button
            onClick={handleCreateNewTreatment}
            className="px-3.5 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-lg shadow-violet-600/25"
          >
            <Plus className="w-4 h-4" />
            New Treatment
          </button>
        )}
      </div>

      {activeView === 'categories' ? (
        <TreatmentCategoriesManager categories={categories} onUpdate={loadTreatmentsData} />
      ) : (
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0">
          {/* Left Sidebar: Treatments list */}
          <div className="w-full lg:w-72 border-r border-white/10 flex flex-col bg-[#050614]/40 backdrop-blur-md shrink-0 h-full">
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <h3 className="font-heading font-bold text-xs text-gray-400 uppercase tracking-wider">
                Select Procedure
              </h3>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {treatments.map((t) => {
                const isSelected = selectedTreatment?.id === t.id;
                return (
                  <div
                    key={t.id}
                    onClick={() => setSelectedTreatment(t)}
                    className={`group rounded-2xl p-3.5 cursor-pointer border transition-all ${
                      isSelected
                        ? 'bg-gradient-to-br from-violet-600/15 to-blue-600/15 border-violet-400/50 shadow-md'
                        : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-heading font-bold text-xs text-white group-hover:text-violet-300 transition-colors line-clamp-1">
                        {t.name}
                      </span>
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                          t.status === 'Published'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : t.status === 'Draft'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                        }`}
                      >
                        {t.status}
                      </span>
                    </div>

                    <p className="text-[10px] text-gray-400 line-clamp-1 mb-2">
                      {t.description || 'No description provided.'}
                    </p>

                    <div className="flex items-center gap-3 text-[10px] text-gray-500 pt-2 border-t border-white/5">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-violet-400" />
                        {t.consultation_duration + t.procedure_duration}m
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3 text-blue-400" />
                        {t.views_count}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Workspace: Selected Treatment Editor */}
          {selectedTreatment ? (
            <div className="flex-1 flex flex-col bg-[#050614]/20 overflow-hidden h-full">
              {/* Workspace Header */}
              <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between shrink-0 bg-white/[0.01]">
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="font-heading font-bold text-lg text-white">
                      {selectedTreatment.name}
                    </h1>
                    <span className="text-xs text-gray-500">/treatments/{selectedTreatment.slug}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Configure clinical profiles, location pricing, doctor availability, gallery assets, and SEO metadata.
                  </p>
                </div>
              </div>

              {/* Workspace Navigation Tabs */}
              <div className="px-6 border-b border-white/10 flex items-center gap-6 overflow-x-auto shrink-0 bg-black/20">
                {[
                  { id: 'profile', label: 'Overview & Profile', icon: FileText },
                  { id: 'pricing', label: 'Pricing Engine', icon: DollarSign },
                  { id: 'clinics', label: 'Clinic Availability', icon: MapPin },
                  { id: 'doctors', label: 'Doctor Assignments', icon: Users },
                  { id: 'gallery', label: 'Before / After Gallery', icon: ImageIcon },
                  { id: 'faqs', label: 'FAQs List', icon: HelpCircle },
                  { id: 'blocks', label: 'Content Blocks', icon: LayoutGrid },
                  { id: 'seo', label: 'SEO & Schema', icon: Settings }
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setWorkspaceTab(tab.id as any)}
                      className={`py-3.5 border-b-2 transition-all whitespace-nowrap flex items-center gap-1.5 text-xs font-bold ${
                        workspaceTab === tab.id
                          ? 'border-violet-500 text-white'
                          : 'border-transparent text-gray-400 hover:text-white'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {tab.label}
                    </button>
                  );
                })}
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

                  {workspaceTab === 'doctors' && (
                    <TreatmentDoctorMapping
                      key={`doctors-${selectedTreatment.id}`}
                      treatment={selectedTreatment}
                    />
                  )}

                  {workspaceTab === 'gallery' && (
                    <TreatmentGalleryForm
                      key={`gallery-${selectedTreatment.id}`}
                      treatment={selectedTreatment}
                    />
                  )}

                  {workspaceTab === 'faqs' && (
                    <TreatmentFaqsForm
                      key={`faqs-${selectedTreatment.id}`}
                      treatment={selectedTreatment}
                    />
                  )}

                  {workspaceTab === 'blocks' && (
                    <TreatmentBlocksForm
                      key={`blocks-${selectedTreatment.id}`}
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
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
              <FileText className="w-12 h-12 text-gray-600 mb-2" />
              <p className="text-sm font-bold">Select a treatment from the catalogue to get started.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ==========================================
   SUB-COMPONENT: CATEGORIES MANAGER
   ========================================== */
function TreatmentCategoriesManager({ categories, onUpdate }: { categories: TreatmentCategory[]; onUpdate: () => void }) {
  const { showToast } = useToast();
  const [list, setList] = useState<TreatmentCategory[]>(categories);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setList(categories);
  }, [categories]);

  const handleAdd = () => {
    setList([
      ...list,
      {
        id: '',
        name: 'New Category',
        slug: 'new-category',
        description: '',
        display_order: list.length + 1,
        is_active: true
      }
    ]);
  };

  const handleChange = (idx: number, field: keyof TreatmentCategory, val: any) => {
    const next = [...list];
    next[idx] = { ...next[idx], [field]: val };
    setList(next);
  };

  const handleSave = async () => {
    setSaving(true);
    let success = true;
    for (const cat of list) {
      const ok = await TreatmentService.saveCategory(cat);
      if (!ok) success = false;
    }
    setSaving(false);
    if (success) {
      showToast('All categories saved successfully!', 'success');
      onUpdate();
    } else {
      showToast('Some categories failed to save.', 'error');
    }
  };

  const handleDelete = async (cat: TreatmentCategory, idx: number) => {
    if (!cat.id) {
      setList(list.filter((_, i) => i !== idx));
      return;
    }
    if (confirm(`Delete category "${cat.name}"?`)) {
      const ok = await TreatmentService.deleteCategory(cat.id);
      if (ok) {
        showToast('Category deleted', 'success');
        onUpdate();
      } else {
        showToast('Failed to delete category', 'error');
      }
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 max-w-4xl space-y-6">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <h3 className="font-heading font-bold text-base text-white">Clinical Treatment Categories</h3>
          <p className="text-xs text-gray-400">Organize treatments into coherent dental categories displayed in the booking wizard.</p>
        </div>
        <button
          onClick={handleAdd}
          className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold flex items-center gap-1.5 transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Category
        </button>
      </div>

      <div className="space-y-3">
        {list.map((cat, idx) => (
          <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col md:flex-row items-center gap-4">
            <div className="w-full md:w-48">
              <label className="block text-[9px] text-gray-500 uppercase font-bold mb-1">Name</label>
              <input
                type="text"
                value={cat.name}
                onChange={(e) => handleChange(idx, 'name', e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
              />
            </div>
            <div className="w-full md:w-40">
              <label className="block text-[9px] text-gray-500 uppercase font-bold mb-1">Slug</label>
              <input
                type="text"
                value={cat.slug}
                onChange={(e) => handleChange(idx, 'slug', e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
              />
            </div>
            <div className="flex-1 w-full">
              <label className="block text-[9px] text-gray-500 uppercase font-bold mb-1">Description</label>
              <input
                type="text"
                value={cat.description || ''}
                onChange={(e) => handleChange(idx, 'description', e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
              />
            </div>
            <div className="w-20">
              <label className="block text-[9px] text-gray-500 uppercase font-bold mb-1">Order</label>
              <input
                type="number"
                value={cat.display_order}
                onChange={(e) => handleChange(idx, 'display_order', parseInt(e.target.value) || 0)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-3 pt-4 md:pt-0">
              <label className="flex items-center gap-1 text-xs text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={cat.is_active}
                  onChange={(e) => handleChange(idx, 'is_active', e.target.checked)}
                  className="accent-violet-500 w-4 h-4 cursor-pointer"
                />
                Active
              </label>
              <button
                onClick={() => handleDelete(cat, idx)}
                className="p-2 text-gray-500 hover:text-red-400 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end border-t border-white/10 pt-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-lg shadow-violet-600/25"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving Categories...' : 'Save Categories Catalog'}
        </button>
      </div>
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
    consultation_duration: String(treatment.consultation_duration ?? 15),
    procedure_duration: String(treatment.procedure_duration ?? 45),
    recovery_time: treatment.recovery_time || '1-2 days',
    follow_up_required: treatment.follow_up_required ?? false,
    description: treatment.description || '',
    featured: treatment.featured,
    category_id: treatment.category_id || '',
    status: treatment.status || (treatment.is_active ? 'Published' : 'Hidden')
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const resolvedCat = categories.find((c) => c.id === form.category_id);
    const ok = await TreatmentService.updateTreatmentProfile(treatment.id, {
      name: form.name,
      slug: form.slug,
      consultation_duration: parseInt(form.consultation_duration, 10) || 15,
      procedure_duration: parseInt(form.procedure_duration, 10) || 45,
      recovery_time: form.recovery_time,
      follow_up_required: form.follow_up_required,
      description: form.description,
      featured: form.featured,
      category_id: form.category_id || undefined,
      category: resolvedCat ? resolvedCat.name : treatment.category,
      status: form.status as any,
      is_active: form.status === 'Published'
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
        Clinical Procedure Overview & Parameters
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

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="sm:col-span-2">
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
          <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">Publishing Status</label>
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value as any })}
            className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none"
            style={{ colorScheme: 'dark' }}
          >
            <option value="Published">Published</option>
            <option value="Draft">Draft (Internal)</option>
            <option value="Hidden">Hidden</option>
            <option value="Archived">Archived</option>
          </select>
        </div>

        <div className="flex flex-col justify-end pb-2">
          <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              className="accent-violet-500 w-4 h-4 cursor-pointer"
            />
            Featured Procedure
          </label>
        </div>
      </div>

      {/* Duration and Clinical Metrics */}
      <div className="grid grid-cols-3 gap-4 p-4 rounded-2xl bg-black/30 border border-white/5">
        <div>
          <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">Consultation Time (m)</label>
          <input
            type="number"
            value={form.consultation_duration}
            onChange={(e) => setForm({ ...form, consultation_duration: e.target.value })}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">Procedure Time (m)</label>
          <input
            type="number"
            value={form.procedure_duration}
            onChange={(e) => setForm({ ...form, procedure_duration: e.target.value })}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">Recovery Window</label>
          <input
            type="text"
            value={form.recovery_time}
            onChange={(e) => setForm({ ...form, recovery_time: e.target.value })}
            placeholder="e.g. 1-2 days"
            className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">Short Description & Patient Summary</label>
        <textarea
          rows={3}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Brief clinical description displayed on service cards and wizard steps..."
          className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none resize-none"
        />
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        <button
          type="button"
          onClick={async () => {
            if (confirm(`Are you sure you want to delete ${treatment.name}?`)) {
              await TreatmentService.deleteTreatment(treatment.id);
              showToast('Treatment deleted', 'success');
              onSave();
            }
          }}
          className="px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold transition-all flex items-center gap-1.5"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Delete Treatment
        </button>

        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-lg shadow-violet-600/25"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving changes...' : 'Save Profile Settings'}
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
      supabase.from('clinics').select('id, name, address'),
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
          treatment_id: treatment.id,
          clinic_id: clinicId,
          consultation_fee: 500,
          base_price: 1500,
          offer_price: 0,
          sale_price: 0,
          currency: 'INR',
          emi_available: false,
          insurance_supported: true,
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
        Configure Dynamic Pricing & Insurance per Location
      </h3>

      <div className="space-y-4">
        {clinics.map((c) => {
          const row: any = pricingList.find((p) => p.clinic_id === c.id) || {
            consultation_fee: 500,
            base_price: 1500,
            offer_price: 1200,
            sale_price: 1200,
            insurance_supported: true,
            insurance_covered: true,
            emi_available: false
          };

          return (
            <div
              key={c.id}
              className="bg-black/20 border border-white/5 p-4 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="md:w-36">
                <span className="text-xs font-bold text-white block">{c.name}</span>
                <span className="text-[10px] text-gray-500 line-clamp-1">{c.address}</span>
              </div>

              <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[9px] text-gray-500 uppercase font-bold mb-1">Consult Fee (INR)</label>
                  <input
                    type="number"
                    value={row.consultation_fee ?? 500}
                    onChange={(e) => handlePriceChange(c.id, 'consultation_fee', parseFloat(e.target.value) || 0)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[9px] text-gray-500 uppercase font-bold mb-1">Base Price (INR)</label>
                  <input
                    type="number"
                    value={row.base_price || 0}
                    onChange={(e) => handlePriceChange(c.id, 'base_price', parseFloat(e.target.value) || 0)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[9px] text-gray-500 uppercase font-bold mb-1">Offer Price (INR)</label>
                  <input
                    type="number"
                    value={row.offer_price || row.sale_price || ''}
                    placeholder="None"
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || undefined;
                      handlePriceChange(c.id, 'offer_price', val);
                      handlePriceChange(c.id, 'sale_price', val);
                    }}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none"
                  />
                </div>

                <div className="flex flex-col justify-center space-y-1 pt-3">
                  <label className="flex items-center gap-1.5 text-[11px] text-gray-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={row.insurance_supported ?? row.insurance_covered ?? true}
                      onChange={(e) => {
                        handlePriceChange(c.id, 'insurance_supported', e.target.checked);
                        handlePriceChange(c.id, 'insurance_covered', e.target.checked);
                      }}
                      className="accent-violet-500 w-3.5 h-3.5 cursor-pointer"
                    />
                    Insurance
                  </label>
                  <label className="flex items-center gap-1.5 text-[11px] text-gray-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={row.emi_available ?? false}
                      onChange={(e) => handlePriceChange(c.id, 'emi_available', e.target.checked)}
                      className="accent-violet-500 w-3.5 h-3.5 cursor-pointer"
                    />
                    EMI Option
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
              className={`p-3.5 rounded-2xl border cursor-pointer flex items-center justify-between transition-colors ${
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
   SUB-COMPONENT 4: DOCTOR MAPPING
   ========================================== */
function TreatmentDoctorMapping({ treatment }: PricingProps) {
  const { showToast } = useToast();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [assignedDoctorIds, setAssignedDoctorIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([
      DoctorService.getDoctors(),
      TreatmentService.getTreatmentDoctors(treatment.id)
    ]).then(([docList, ids]) => {
      setDoctors(docList);
      setAssignedDoctorIds(ids);
      setLoading(false);
    });
  }, [treatment.id]);

  const handleToggle = (docId: string) => {
    setAssignedDoctorIds((prev) =>
      prev.includes(docId) ? prev.filter((id) => id !== docId) : [...prev, docId]
    );
  };

  const handleSave = async () => {
    setSaving(true);
    const ok = await TreatmentService.saveTreatmentDoctors(treatment.id, assignedDoctorIds);
    setSaving(false);
    if (ok) showToast('Assigned doctors updated successfully!', 'success');
    else showToast('Failed to save doctor mappings.', 'error');
  };

  if (loading) return <div className="text-xs text-gray-500">Loading doctor roster...</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 max-w-2xl bg-white/5 border border-white/10 rounded-3xl p-6"
    >
      <h3 className="font-heading font-bold text-sm text-white flex items-center gap-2">
        <Users className="w-4 h-4 text-violet-400" />
        Assign Specialists Performing This Procedure
      </h3>

      <div className="grid grid-cols-1 gap-3">
        {doctors.map((doc) => {
          const isChecked = assignedDoctorIds.includes(doc.id);
          return (
            <div
              key={doc.id}
              onClick={() => handleToggle(doc.id)}
              className={`p-3.5 rounded-2xl border cursor-pointer flex items-center justify-between transition-colors ${
                isChecked
                  ? 'bg-violet-600/10 border-violet-500/30 text-white'
                  : 'bg-white/5 border-white/5 hover:bg-white/10 text-gray-400'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-violet-600/20 overflow-hidden flex items-center justify-center font-bold text-xs text-violet-300">
                  {doc.profile_image ? (
                    <img src={doc.profile_image} alt={doc.name} className="w-full h-full object-cover" />
                  ) : (
                    doc.name.charAt(0)
                  )}
                </div>
                <div>
                  <p className="text-xs font-bold text-white">{doc.name}</p>
                  <p className="text-[10px] text-gray-400">{doc.designation || doc.qualification || 'Specialist'}</p>
                </div>
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
          {saving ? 'Saving...' : 'Save Doctor Assignments'}
        </button>
      </div>
    </motion.div>
  );
}

/* ==========================================
   SUB-COMPONENT 5: GALLERY FORM
   ========================================== */
function TreatmentGalleryForm({ treatment }: PricingProps) {
  const { showToast } = useToast();
  const [gallery, setGallery] = useState<TreatmentGalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    TreatmentService.getTreatmentGallery(treatment.id).then((items) => {
      setGallery(items);
      setLoading(false);
    });
  }, [treatment.id]);

  const handleAdd = () => {
    const url = prompt('Enter media file URL or asset UUID:');
    if (!url) return;
    setGallery([
      ...gallery,
      {
        service_id: treatment.id,
        treatment_id: treatment.id,
        media_file_id: url,
        caption: `${treatment.name} Before & After`,
        image_type: 'Before',
        display_order: gallery.length
      }
    ]);
  };

  const handleRemove = (idx: number) => {
    setGallery(gallery.filter((_, i) => i !== idx));
  };

  const handleChange = (idx: number, field: keyof TreatmentGalleryItem, val: any) => {
    const next = [...gallery];
    next[idx] = { ...next[idx], [field]: val };
    setGallery(next);
  };

  const handleSave = async () => {
    setSaving(true);
    const ok = await TreatmentService.saveTreatmentGallery(treatment.id, gallery);
    setSaving(false);
    if (ok) showToast('Gallery updated successfully!', 'success');
    else showToast('Failed to save gallery.', 'error');
  };

  if (loading) return <div className="text-xs text-gray-500">Loading gallery...</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 max-w-3xl bg-white/5 border border-white/10 rounded-3xl p-6"
    >
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <h3 className="font-heading font-bold text-sm text-white flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-violet-400" />
          Procedure Before / After & Visual Assets
        </h3>
        <button
          onClick={handleAdd}
          className="px-3 py-1 rounded bg-white/10 hover:bg-white/15 text-[10px] text-white flex items-center gap-1 font-bold"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Image Item
        </button>
      </div>

      {gallery.length === 0 ? (
        <div className="text-center py-10 text-xs text-gray-500 border border-dashed border-white/10 rounded-2xl">
          No gallery images assigned to this procedure yet. Click Add Image Item above to include clinical photos.
        </div>
      ) : (
        <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
          {gallery.map((item, idx) => (
            <div key={idx} className="bg-black/30 border border-white/5 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4 relative">
              <div className="w-full sm:w-32 h-20 bg-black/60 rounded-xl overflow-hidden shrink-0 flex items-center justify-center border border-white/5">
                {item.public_url || item.media_file_id.startsWith('http') ? (
                  <img src={item.public_url || item.media_file_id} alt="asset" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-6 h-6 text-gray-600" />
                )}
              </div>

              <div className="flex-1 grid grid-cols-2 gap-3 w-full">
                <div>
                  <label className="block text-[9px] text-gray-500 uppercase font-bold mb-1">Media UUID / URL</label>
                  <input
                    type="text"
                    value={item.media_file_id}
                    onChange={(e) => handleChange(idx, 'media_file_id', e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-2.5 py-1 text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[9px] text-gray-500 uppercase font-bold mb-1">Image Classification</label>
                  <select
                    value={item.image_type || 'Before'}
                    onChange={(e) => handleChange(idx, 'image_type', e.target.value as any)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-2.5 py-1 text-xs text-white focus:outline-none"
                    style={{ colorScheme: 'dark' }}
                  >
                    <option value="Before">Before Treatment</option>
                    <option value="After">After Treatment</option>
                    <option value="Procedure">During Procedure</option>
                    <option value="Illustration">Medical Illustration</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-[9px] text-gray-500 uppercase font-bold mb-1">Caption / Alt Text</label>
                  <input
                    type="text"
                    value={item.caption || ''}
                    onChange={(e) => handleChange(idx, 'caption', e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-2.5 py-1 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <button
                onClick={() => handleRemove(idx)}
                className="p-2 text-gray-500 hover:text-red-400 sm:self-start"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-end gap-2 pt-2 border-t border-white/5">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition-all flex items-center gap-1.5"
        >
          <Save className="w-3.5 h-3.5" />
          Save Gallery
        </button>
      </div>
    </motion.div>
  );
}

/* ==========================================
   SUB-COMPONENT 6: FAQS FORM
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
    setFaqs([...faqs, { service_id: treatment.id, treatment_id: treatment.id, question: '', answer: '', display_order: faqs.length }]);
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
   SUB-COMPONENT 7: CONTENT BLOCKS FORM
   ========================================== */
function TreatmentBlocksForm({ treatment }: PricingProps) {
  const { showToast } = useToast();
  const [blocks, setBlocks] = useState<TreatmentBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const BLOCK_TYPES: Array<TreatmentBlock['block_type']> = [
    'Overview',
    'Benefits',
    'Procedure',
    'Preparation',
    'Recovery',
    'Risks',
    'Aftercare'
  ];

  useEffect(() => {
    TreatmentService.getTreatmentBlocks(treatment.id).then((data) => {
      // Ensure all 7 standard block types exist in state
      const initialized = BLOCK_TYPES.map((type, idx) => {
        const found = data.find((b) => b.block_type === type);
        return found || {
          treatment_id: treatment.id,
          service_id: treatment.id,
          block_type: type,
          title: type,
          content: '',
          display_order: idx
        };
      });
      setBlocks(initialized);
      setLoading(false);
    });
  }, [treatment.id]);

  const handleChange = (type: string, val: string) => {
    setBlocks((prev) =>
      prev.map((b) => (b.block_type === type ? { ...b, content: val } : b))
    );
  };

  const handleSave = async () => {
    setSaving(true);
    const activeBlocks = blocks.filter((b) => b.content.trim().length > 0);
    const ok = await TreatmentService.saveTreatmentBlocks(treatment.id, activeBlocks);
    setSaving(false);
    if (ok) showToast('Content blocks saved successfully!', 'success');
    else showToast('Failed to save content blocks.', 'error');
  };

  if (loading) return <div className="text-xs text-gray-500">Loading structured content blocks...</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 max-w-3xl bg-white/5 border border-white/10 rounded-3xl p-6"
    >
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <h3 className="font-heading font-bold text-sm text-white flex items-center gap-2">
          <LayoutGrid className="w-4 h-4 text-violet-400" />
          Structured Medical Procedure Content Blocks
        </h3>
      </div>

      <div className="space-y-4 max-h-[440px] overflow-y-auto pr-1">
        {blocks.map((block) => (
          <div key={block.block_type} className="bg-black/30 border border-white/5 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-violet-300 uppercase tracking-wider">{block.block_type} Section</span>
              <span className="text-[10px] text-gray-500">Structured CMS Block</span>
            </div>
            <textarea
              rows={3}
              value={block.content}
              onChange={(e) => handleChange(block.block_type, e.target.value)}
              placeholder={`Enter detailed clinical notes and instructions for ${block.block_type}...`}
              className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none resize-none"
            />
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
          Save Content Blocks
        </button>
      </div>
    </motion.div>
  );
}

/* ==========================================
   SUB-COMPONENT 8: SEO OVERRIDES FORM
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
    Promise.all([
      SettingsService.getSeoForPath(targetPath),
      TreatmentService.getTreatmentSEO(treatment.id)
    ]).then(([settingsSeo, treatmentSeo]) => {
      if (treatmentSeo) {
        setForm({
          title: treatmentSeo.meta_title || settingsSeo?.title || '',
          meta_description: treatmentSeo.meta_description || settingsSeo?.meta_description || '',
          canonical_url: treatmentSeo.canonical_url || settingsSeo?.canonical_url || `https://sahadental.com/treatments/${treatment.slug}`,
          og_title: settingsSeo?.og_title || `${treatment.name} | Saha Dental Clinics`,
          og_description: settingsSeo?.og_description || `Learn more about our premium orthodontic and endodontic ${treatment.name} surgery procedures.`
        });
      } else if (settingsSeo) {
        setForm({
          title: settingsSeo.title || '',
          meta_description: settingsSeo.meta_description || '',
          canonical_url: settingsSeo.canonical_url || '',
          og_title: settingsSeo.og_title || '',
          og_description: settingsSeo.og_description || ''
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
  }, [treatment.id, targetPath]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await TreatmentService.saveTreatmentSEO(treatment.id, {
      meta_title: form.title,
      meta_description: form.meta_description,
      canonical_url: form.canonical_url
    });
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

      <div>
        <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">Canonical URL</label>
        <input
          type="text"
          value={form.canonical_url}
          onChange={(e) => setForm({ ...form, canonical_url: e.target.value })}
          className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
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
          className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-lg shadow-violet-600/25"
        >
          <Save className="w-3.5 h-3.5" />
          Save SEO Meta
        </button>
      </div>
    </motion.form>
  );
}
