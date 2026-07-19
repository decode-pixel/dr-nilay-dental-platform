import React, { useState, useEffect } from 'react';
import { SettingsService, SettingsRepository, SeoSetting, NotificationTemplate } from '../../lib/settingsService';
import { useToast } from '../../components/ToastNotification';
import { logger } from '../../lib/logger';
import {
  Save,
  Globe,
  Settings,
  Phone,
  Calendar,
  Layers,
  Bell,
  Eye,
  FileText,
  AlertTriangle,
  Sparkles,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function DashboardSettings() {
  const { showToast } = useToast();
  const [activeSubTab, setActiveSubTab] = useState<'general' | 'contact' | 'booking' | 'appearance' | 'notifications' | 'seo'>('general');
  const [loading, setLoading] = useState(true);

  // Form states
  const [generalConfig, setGeneralConfig] = useState({
    clinic_name: 'Saha Dental Clinic',
    clinic_tagline: 'Advanced Dentistry & Orthodontics'
  });
  const [contactConfig, setContactConfig] = useState({
    primary_phone: '+916290000000',
    whatsapp_number: '+916290000000',
    office_email: 'contact@sahadental.com'
  });
  const [bookingConfig, setBookingConfig] = useState({
    slot_duration_minutes: 30,
    advance_booking_days_limit: 30,
    booking_reference_prefix: 'SDC',
    cancellation_cutoff_hours: 4
  });
  const [appearanceConfig, setAppearanceConfig] = useState({
    primary_accent_color: '#8b5cf6',
    glassmorphism_opacity: 0.7
  });

  const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [templateForm, setTemplateForm] = useState({
    template_body: '',
    enabled: true,
    timing_offset_minutes: 0
  });

  const [seoSettings, setSeoSettings] = useState<SeoSetting[]>([]);
  const [selectedSeoPath, setSelectedSeoPath] = useState<string>('/');
  const [seoForm, setSeoForm] = useState({
    title: '',
    meta_description: '',
    og_title: '',
    og_description: '',
    canonical_url: '',
    robots_index: true,
    robots_follow: true,
    schema_type: 'Dentist'
  });

  const [saving, setSaving] = useState(false);

  const loadAllConfigs = async () => {
    setLoading(true);
    try {
      const [gen, con, book, app, tempUrls, seoList] = await Promise.all([
        SettingsService.getSettingsGroup('general'),
        SettingsService.getSettingsGroup('contact'),
        SettingsService.getSettingsGroup('booking'),
        SettingsService.getSettingsGroup('appearance'),
        SettingsService.getTemplates(),
        SettingsService.saveSeoForPath('/', { title: 'Dr. Nilay Saha Dental Clinic — Advanced Dentistry' }).then(() =>
          SettingsRepository.getSeoSettings()
        )
      ]);

      if (Object.keys(gen).length > 0) setGeneralConfig((p) => ({ ...p, ...gen }));
      if (Object.keys(con).length > 0) setContactConfig((p) => ({ ...p, ...con }));
      if (Object.keys(book).length > 0) setBookingConfig((p) => ({ ...p, ...book }));
      if (Object.keys(app).length > 0) setAppearanceConfig((p) => ({ ...p, ...app }));

      setTemplates(tempUrls);
      if (tempUrls.length > 0) {
        setSelectedTemplateId(tempUrls[0].id);
        setTemplateForm({
          template_body: tempUrls[0].template_body,
          enabled: tempUrls[0].enabled,
          timing_offset_minutes: tempUrls[0].timing_offset_minutes
        });
      }

      setSeoSettings(seoList);
      const homeSeo = seoList.find((s) => s.path === '/') || seoList[0];
      if (homeSeo) {
        setSelectedSeoPath(homeSeo.path);
        setSeoForm({
          title: homeSeo.title,
          meta_description: homeSeo.meta_description || '',
          og_title: homeSeo.og_title || '',
          og_description: homeSeo.og_description || '',
          canonical_url: homeSeo.canonical_url || '',
          robots_index: homeSeo.robots_index,
          robots_follow: homeSeo.robots_follow,
          schema_type: homeSeo.schema_type
        });
      }
    } catch (err) {
      logger.error('Error loading dashboard settings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllConfigs();
  }, []);

  // Update Template Form when selected template changes
  useEffect(() => {
    const matched = templates.find((t) => t.id === selectedTemplateId);
    if (matched) {
      setTemplateForm({
        template_body: matched.template_body,
        enabled: matched.enabled,
        timing_offset_minutes: matched.timing_offset_minutes
      });
    }
  }, [selectedTemplateId, templates]);

  // Update SEO Form when selected path changes
  useEffect(() => {
    const matched = seoSettings.find((s) => s.path === selectedSeoPath);
    if (matched) {
      setSeoForm({
        title: matched.title,
        meta_description: matched.meta_description || '',
        og_title: matched.og_title || '',
        og_description: matched.og_description || '',
        canonical_url: matched.canonical_url || '',
        robots_index: matched.robots_index,
        robots_follow: matched.robots_follow,
        schema_type: matched.schema_type
      });
    }
  }, [selectedSeoPath, seoSettings]);

  const handleSaveGeneral = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const ok = await SettingsService.saveSettingsGroup('general', generalConfig);
    setSaving(false);
    if (ok) showToast('General settings saved successfully!', 'success');
    else showToast('Failed to save general settings.', 'error');
  };

  const handleSaveContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const ok = await SettingsService.saveSettingsGroup('contact', contactConfig);
    setSaving(false);
    if (ok) {
      showToast('Contact parameters updated successfully!', 'success');
      // Trigger event to refresh global references
      window.dispatchEvent(new CustomEvent('onSettingsUpdate'));
    } else {
      showToast('Failed to save contact settings.', 'error');
    }
  };

  const handleSaveBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const ok = await SettingsService.saveSettingsGroup('booking', bookingConfig);
    setSaving(false);
    if (ok) showToast('Booking rules updated successfully!', 'success');
    else showToast('Failed to save booking rules.', 'error');
  };

  const handleSaveAppearance = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const ok = await SettingsService.saveSettingsGroup('appearance', appearanceConfig);
    setSaving(false);
    if (ok) showToast('Appearance theme variables saved!', 'success');
    else showToast('Failed to save appearance settings.', 'error');
  };

  const handleSaveTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const ok = await SettingsService.saveTemplate(selectedTemplateId, templateForm);
    setSaving(false);
    if (ok) {
      showToast('Notification template updated!', 'success');
      // Reload templates list
      const tempUrls = await SettingsService.getTemplates();
      setTemplates(tempUrls);
    } else {
      showToast('Failed to update template.', 'error');
    }
  };

  const handleSaveSeo = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const ok = await SettingsService.saveSeoForPath(selectedSeoPath, seoForm);
    setSaving(false);
    if (ok) {
      showToast(`SEO parameters for path "${selectedSeoPath}" updated!`, 'success');
      const seoList = await SettingsRepository.getSeoSettings();
      setSeoSettings(seoList);
    } else {
      showToast('Failed to save SEO configuration.', 'error');
    }
  };

  if (loading) {
    return (
      <div className="text-xs text-gray-500 py-10 flex flex-col items-center justify-center">
        <Globe className="w-8 h-8 animate-spin text-violet-400 mb-2" />
        <span>Loading Platform settings...</span>
      </div>
    );
  }

  const selectedTemplate = templates.find((t) => t.id === selectedTemplateId);

  return (
    <div className="space-y-6 max-w-5xl font-sans text-gray-200">
      {/* 1. Sub-tab headers layout */}
      <div className="flex gap-4 border-b border-white/10 overflow-x-auto pb-2 shrink-0 text-xs font-semibold">
        {[
          { id: 'general', label: 'General', icon: Settings },
          { id: 'contact', label: 'Contact Defaults', icon: Phone },
          { id: 'booking', label: 'Booking Rules', icon: Calendar },
          { id: 'appearance', label: 'Appearance', icon: Layers },
          { id: 'notifications', label: 'Templates', icon: Bell },
          { id: 'seo', label: 'SEO tags', icon: Globe }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex items-center gap-1.5 py-2 px-3 border-b-2 transition-all whitespace-nowrap ${
                activeSubTab === tab.id
                  ? 'border-violet-500 text-white bg-white/5 rounded-t-xl'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* 2. Main forms workspace */}
      <div className="bg-white/5 border border-white/10 rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.01] to-transparent pointer-events-none" />

        <AnimatePresence mode="wait">
          {/* TAB 1: GENERAL */}
          {activeSubTab === 'general' && (
            <motion.form
              key="general"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onSubmit={handleSaveGeneral}
              className="space-y-4 max-w-xl"
            >
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Settings className="w-4 h-4 text-violet-400" />
                Configure General Site Info
              </h3>
              
              <div>
                <label className="block text-[10px] text-gray-400 uppercase font-bold mb-1.5">Clinic Brand Name</label>
                <input
                  type="text"
                  required
                  value={generalConfig.clinic_name}
                  onChange={(e) => setGeneralConfig({ ...generalConfig, clinic_name: e.target.value })}
                  className="w-full bg-black/40 border border-white/10 focus:border-violet-500/50 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] text-gray-400 uppercase font-bold mb-1.5">Brand Tagline</label>
                <input
                  type="text"
                  required
                  value={generalConfig.clinic_tagline}
                  onChange={(e) => setGeneralConfig({ ...generalConfig, clinic_tagline: e.target.value })}
                  className="w-full bg-black/40 border border-white/10 focus:border-violet-500/50 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="flex justify-end pt-3">
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
          )}

          {/* TAB 2: CONTACT */}
          {activeSubTab === 'contact' && (
            <motion.form
              key="contact"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onSubmit={handleSaveContact}
              className="space-y-4 max-w-xl"
            >
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-violet-400" />
                Configure Global Contact Details
              </h3>

              <div>
                <label className="block text-[10px] text-gray-400 uppercase font-bold mb-1.5">Primary Office Phone</label>
                <input
                  type="text"
                  required
                  value={contactConfig.primary_phone}
                  onChange={(e) => setContactConfig({ ...contactConfig, primary_phone: e.target.value })}
                  className="w-full bg-black/40 border border-white/10 focus:border-violet-500/50 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] text-gray-400 uppercase font-bold mb-1.5">Global WhatsApp defaults</label>
                <input
                  type="text"
                  required
                  value={contactConfig.whatsapp_number}
                  onChange={(e) => setContactConfig({ ...contactConfig, whatsapp_number: e.target.value })}
                  className="w-full bg-black/40 border border-white/10 focus:border-violet-500/50 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] text-gray-400 uppercase font-bold mb-1.5">Official Support Email</label>
                <input
                  type="email"
                  required
                  value={contactConfig.office_email}
                  onChange={(e) => setContactConfig({ ...contactConfig, office_email: e.target.value })}
                  className="w-full bg-black/40 border border-white/10 focus:border-violet-500/50 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="flex justify-end pt-3">
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
          )}

          {/* TAB 3: BOOKING RULES */}
          {activeSubTab === 'booking' && (
            <motion.form
              key="booking"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onSubmit={handleSaveBooking}
              className="space-y-4 max-w-xl"
            >
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-violet-400" />
                Configure Booking Policies
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] text-gray-400 uppercase font-bold mb-1.5">Slot duration (Minutes)</label>
                  <input
                    type="number"
                    required
                    value={bookingConfig.slot_duration_minutes}
                    onChange={(e) => setBookingConfig({ ...bookingConfig, slot_duration_minutes: parseInt(e.target.value, 10) || 30 })}
                    className="w-full bg-black/40 border border-white/10 focus:border-violet-500/50 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-gray-400 uppercase font-bold mb-1.5">Advance limit (Days)</label>
                  <input
                    type="number"
                    required
                    value={bookingConfig.advance_booking_days_limit}
                    onChange={(e) => setBookingConfig({ ...bookingConfig, advance_booking_days_limit: parseInt(e.target.value, 10) || 30 })}
                    className="w-full bg-black/40 border border-white/10 focus:border-violet-500/50 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] text-gray-400 uppercase font-bold mb-1.5">Reference Prefix</label>
                  <input
                    type="text"
                    required
                    value={bookingConfig.booking_reference_prefix}
                    onChange={(e) => setBookingConfig({ ...bookingConfig, booking_reference_prefix: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 focus:border-violet-500/50 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-gray-400 uppercase font-bold mb-1.5">Cancellation limit (Hours)</label>
                  <input
                    type="number"
                    required
                    value={bookingConfig.cancellation_cutoff_hours}
                    onChange={(e) => setBookingConfig({ ...bookingConfig, cancellation_cutoff_hours: parseInt(e.target.value, 10) || 4 })}
                    className="w-full bg-black/40 border border-white/10 focus:border-violet-500/50 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-3">
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
          )}

          {/* TAB 4: APPEARANCE */}
          {activeSubTab === 'appearance' && (
            <motion.form
              key="appearance"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onSubmit={handleSaveAppearance}
              className="space-y-4 max-w-xl"
            >
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-violet-400" />
                Customize Branding & Theme Variables
              </h3>

              <div>
                <label className="block text-[10px] text-gray-400 uppercase font-bold mb-1.5">Primary Accent Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={appearanceConfig.primary_accent_color}
                    onChange={(e) => setAppearanceConfig({ ...appearanceConfig, primary_accent_color: e.target.value })}
                    className="w-12 h-10 bg-transparent border-0 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={appearanceConfig.primary_accent_color}
                    onChange={(e) => setAppearanceConfig({ ...appearanceConfig, primary_accent_color: e.target.value })}
                    className="bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-gray-400 uppercase font-bold mb-1.5">
                  Glassmorphism Opacity ({appearanceConfig.glassmorphism_opacity})
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="0.9"
                  step="0.05"
                  value={appearanceConfig.glassmorphism_opacity}
                  onChange={(e) => setAppearanceConfig({ ...appearanceConfig, glassmorphism_opacity: parseFloat(e.target.value) })}
                  className="w-full h-1.5 bg-black/40 rounded-lg appearance-none cursor-pointer accent-violet-500"
                />
              </div>

              <div className="flex justify-end pt-3">
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
          )}

          {/* TAB 5: NOTIFICATION TEMPLATES */}
          {activeSubTab === 'notifications' && (
            <motion.form
              key="notifications"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onSubmit={handleSaveTemplate}
              className="space-y-4 max-w-2xl"
            >
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Bell className="w-4 h-4 text-violet-400" />
                Configure Messaging Templates Defaults
              </h3>

              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <label className="block text-[10px] text-gray-400 uppercase font-bold mb-1.5">Trigger Template</label>
                  <select
                    value={selectedTemplateId}
                    onChange={(e) => setSelectedTemplateId(e.target.value)}
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none"
                    style={{ colorScheme: 'dark' }}
                  >
                    {templates.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.id.replace(/_/g, ' ').toUpperCase()} ({t.channel})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="pt-6">
                  <label className="inline-flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={templateForm.enabled}
                      onChange={(e) => setTemplateForm({ ...templateForm, enabled: e.target.checked })}
                      className="accent-violet-500 w-4 h-4 rounded"
                    />
                    Template Active
                  </label>
                </div>
              </div>

              {selectedTemplate && (
                <div className="p-3 bg-violet-600/10 border border-violet-500/20 rounded-2xl text-[11px] text-violet-300">
                  <span className="font-bold">Variables supported:</span>{' '}
                  <span className="font-mono">{selectedTemplate.placeholders.map((v) => `{${v}}`).join(', ')}</span>
                </div>
              )}

              <div>
                <label className="block text-[10px] text-gray-400 uppercase font-bold mb-1.5">Template Body Message</label>
                <textarea
                  rows={4}
                  required
                  value={templateForm.template_body}
                  onChange={(e) => setTemplateForm({ ...templateForm, template_body: e.target.value })}
                  className="w-full bg-black/40 border border-white/10 focus:border-violet-500/50 rounded-xl p-3 text-xs text-white focus:outline-none resize-none font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] text-gray-400 uppercase font-bold mb-1.5">Timing Offset (Minutes)</label>
                <input
                  type="number"
                  value={templateForm.timing_offset_minutes}
                  onChange={(e) => setTemplateForm({ ...templateForm, timing_offset_minutes: parseInt(e.target.value, 10) || 0 })}
                  className="w-48 bg-black/40 border border-white/10 focus:border-violet-500/50 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                />
                <span className="text-[10px] text-gray-500 ml-3 italic">
                  Offset minutes relative to event trigger (e.g. 1440 for 24h reminders)
                </span>
              </div>

              <div className="flex justify-end pt-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  {saving ? 'Saving...' : 'Update Template'}
                </button>
              </div>
            </motion.form>
          )}

          {/* TAB 6: SEO SETTINGS */}
          {activeSubTab === 'seo' && (
            <motion.form
              key="seo"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onSubmit={handleSaveSeo}
              className="space-y-4 max-w-2xl"
            >
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-violet-400" />
                Configure Page SEO Meta Attributes
              </h3>

              <div>
                <label className="block text-[10px] text-gray-400 uppercase font-bold mb-1.5">Select Route Page Path</label>
                <select
                  value={selectedSeoPath}
                  onChange={(e) => setSelectedSeoPath(e.target.value)}
                  className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none"
                  style={{ colorScheme: 'dark' }}
                >
                  {seoSettings.map((s) => (
                    <option key={s.path} value={s.path}>
                      {s.path === '/' ? 'Home Page (/) ' : s.path}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] text-gray-400 uppercase font-bold mb-1.5">Browser Document Title</label>
                <input
                  type="text"
                  required
                  value={seoForm.title}
                  onChange={(e) => setSeoForm({ ...seoForm, title: e.target.value })}
                  className="w-full bg-black/40 border border-white/10 focus:border-violet-500/50 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] text-gray-400 uppercase font-bold mb-1.5">Meta Description Tag</label>
                <textarea
                  rows={2}
                  required
                  value={seoForm.meta_description}
                  onChange={(e) => setSeoForm({ ...seoForm, meta_description: e.target.value })}
                  className="w-full bg-black/40 border border-white/10 focus:border-violet-500/50 rounded-xl p-3 text-xs text-white focus:outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] text-gray-400 uppercase font-bold mb-1.5">Open Graph Title</label>
                  <input
                    type="text"
                    value={seoForm.og_title}
                    onChange={(e) => setSeoForm({ ...seoForm, og_title: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 focus:border-violet-500/50 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-gray-400 uppercase font-bold mb-1.5">Canonical URL</label>
                  <input
                    type="text"
                    value={seoForm.canonical_url}
                    onChange={(e) => setSeoForm({ ...seoForm, canonical_url: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 focus:border-violet-500/50 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] text-gray-400 uppercase font-bold mb-1.5">Structured Schema.org Type</label>
                  <input
                    type="text"
                    value={seoForm.schema_type}
                    onChange={(e) => setSeoForm({ ...seoForm, schema_type: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 focus:border-violet-500/50 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>

                <div className="flex gap-4 pt-6">
                  <label className="inline-flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={seoForm.robots_index}
                      onChange={(e) => setSeoForm({ ...seoForm, robots_index: e.target.checked })}
                      className="accent-violet-500 w-4 h-4 rounded"
                    />
                    Search Indexing (robots_index)
                  </label>

                  <label className="inline-flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={seoForm.robots_follow}
                      onChange={(e) => setSeoForm({ ...seoForm, robots_follow: e.target.checked })}
                      className="accent-violet-500 w-4 h-4 rounded"
                    />
                    Follow links (robots_follow)
                  </label>
                </div>
              </div>

              <div className="flex justify-end pt-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  {saving ? 'Saving...' : 'Save SEO Configuration'}
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
