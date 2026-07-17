import React, { useState, useEffect } from 'react';
import { CmsService, WebsiteContent, ContentVersion } from '../../lib/cmsService';
import { useToast } from '../../components/ToastNotification';
import { logger } from '../../lib/logger';
import {
  Save,
  Send,
  Eye,
  RefreshCw,
  FileText,
  Clock,
  Sparkles,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function DashboardCms() {
  const { showToast } = useToast();
  const [selectedSection, setSelectedSection] = useState<'hero' | 'about' | 'footer'>('hero');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form states mapping section contents
  const [heroForm, setHeroForm] = useState({
    title: 'Modern Dental Care for Your Entire Family',
    subtitle: 'Experienced professionals offering premium orthodontic, endodontic, and diagnostic dental solutions across Bengal.',
    cta_text: 'Schedule Online Visit'
  });

  const [aboutForm, setAboutForm] = useState({
    title: 'Meet Dr. Nilay Saha',
    description: 'Dr. Nilay Saha is a certified senior orthodontist and endodontic consultant. With over a decade of clinical excellence, he is dedicated to delivering healthy smiles using modern, advanced digital dentistry techniques.',
    doctor_signature: 'Dr. Nilay Saha, BDS, MDS'
  });

  const [footerForm, setFooterForm] = useState({
    copyright_text: '© 2026 Dr. Nilay Saha Dental Clinics. All Rights Reserved.',
    terms_link_label: 'Terms of Service',
    privacy_link_label: 'Privacy Policy'
  });

  // DB records reference trackers
  const [dbContentRecords, setDbContentRecords] = useState<WebsiteContent[]>([]);
  const [versions, setVersions] = useState<Record<string, ContentVersion[]>>({});

  const loadCmsData = async () => {
    setLoading(true);
    try {
      const list = await CmsService.getRawContentList(selectedSection);
      setDbContentRecords(list);

      // Seed database defaults if section items are absent
      if (list.length === 0) {
        if (selectedSection === 'hero') {
          await CmsService.saveDraft('hero', 'hero_config', heroForm);
        } else if (selectedSection === 'about') {
          await CmsService.saveDraft('about', 'about_config', aboutForm);
        } else if (selectedSection === 'footer') {
          await CmsService.saveDraft('footer', 'footer_config', footerForm);
        }
        const fresh = await CmsService.getRawContentList(selectedSection);
        setDbContentRecords(fresh);
      }

      // Map values to forms
      const draft = await CmsService.getDraftContent(selectedSection);
      if (selectedSection === 'hero' && draft.hero_config) {
        setHeroForm((p) => ({ ...p, ...draft.hero_config }));
      } else if (selectedSection === 'about' && draft.about_config) {
        setAboutForm((p) => ({ ...p, ...draft.about_config }));
      } else if (selectedSection === 'footer' && draft.footer_config) {
        setFooterForm((p) => ({ ...p, ...draft.footer_config }));
      }

      // Fetch version history if record exists
      if (list.length > 0) {
        const hist = await CmsService.getContentVersions(list[0].id);
        setVersions({ [list[0].id]: hist });
      }
    } catch (err) {
      logger.error('Error fetching CMS data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCmsData();
  }, [selectedSection]);

  const handleSaveDraft = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    let key = '';
    let payload = {};

    if (selectedSection === 'hero') {
      key = 'hero_config';
      payload = heroForm;
    } else if (selectedSection === 'about') {
      key = 'about_config';
      payload = aboutForm;
    } else if (selectedSection === 'footer') {
      key = 'footer_config';
      payload = footerForm;
    }

    const ok = await CmsService.saveDraft(selectedSection, key, payload);
    setSaving(false);

    if (ok) {
      showToast('Changes saved as DRAFT. Publish to make them live!', 'info');
      loadCmsData();
    } else {
      showToast('Error saving draft content.', 'error');
    }
  };

  const handlePublish = async () => {
    setSaving(true);
    const ok = await CmsService.publishSection(selectedSection);
    setSaving(false);

    if (ok) {
      showToast('Section content published LIVE!', 'success');
      // Trigger landing page refresh event
      window.dispatchEvent(new CustomEvent('onCmsUpdate'));
      loadCmsData();
    } else {
      showToast('Failed to publish content.', 'error');
    }
  };

  const handleRollback = async (contentId: string, historyPayload: any) => {
    if (!confirm('Are you sure you want to rollback to this content version?')) return;
    setSaving(true);
    const ok = await CmsService.rollbackToVersion(contentId, historyPayload);
    setSaving(false);
    if (ok) {
      showToast('Content rolled back successfully!', 'success');
      window.dispatchEvent(new CustomEvent('onCmsUpdate'));
      loadCmsData();
    } else {
      showToast('Rollback failed.', 'error');
    }
  };

  const isSectionPublished = dbContentRecords.every((r) => r.is_published);

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-160px)] gap-6 text-gray-200 font-sans">
      
      {/* 1. Left Navigation panel */}
      <div className="w-full lg:w-60 bg-white/5 border border-white/10 rounded-3xl p-4 flex flex-col shrink-0">
        <h3 className="text-xs font-bold uppercase tracking-wider text-white border-b border-white/10 pb-3 mb-4 flex items-center gap-1.5">
          <FileText className="w-4 h-4 text-violet-400" />
          CMS Website Sections
        </h3>

        <div className="space-y-1.5">
          {[
            { id: 'hero', label: 'Hero Header' },
            { id: 'about', label: 'Doctor Biography' },
            { id: 'footer', label: 'Footer Coordinate' }
          ].map((sec) => (
            <button
              key={sec.id}
              onClick={() => setSelectedSection(sec.id as any)}
              className={`w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
                selectedSection === sec.id
                  ? 'bg-violet-600/10 border border-violet-500/30 text-white shadow-sm'
                  : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-violet-400" />
              {sec.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Middle Editor Workspace */}
      <div className="flex-1 bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6 shrink-0">
          <div>
            <h3 className="text-sm font-bold text-white uppercase">
              Managing Content Block: <strong className="text-violet-300">{selectedSection}</strong>
            </h3>
            <p className="text-[10px] text-gray-500 mt-0.5">
              Edit the live copy shown on public page. Saving drafts will not impact active website users.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
              isSectionPublished ? 'bg-green-500/10 text-green-400' : 'bg-amber-500/10 text-amber-400'
            }`}>
              {isSectionPublished ? 'Published' : 'Draft / Modified'}
            </span>
          </div>
        </div>

        {loading ? (
          <div className="text-xs text-gray-500 py-10 text-center">Loading content blocks...</div>
        ) : (
          <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-6">
            <form onSubmit={handleSaveDraft} className="space-y-4 max-w-xl">
              {/* HERO FORM */}
              {selectedSection === 'hero' && (
                <>
                  <div>
                    <label className="block text-[10px] text-gray-400 uppercase font-bold mb-1.5">Hero Title Header</label>
                    <textarea
                      rows={2}
                      required
                      value={heroForm.title}
                      onChange={(e) => setHeroForm({ ...heroForm, title: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 focus:border-violet-500/50 rounded-xl p-3 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-gray-400 uppercase font-bold mb-1.5">Subtitle Paragraph</label>
                    <textarea
                      rows={3}
                      required
                      value={heroForm.subtitle}
                      onChange={(e) => setHeroForm({ ...heroForm, subtitle: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 focus:border-violet-500/50 rounded-xl p-3 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-gray-400 uppercase font-bold mb-1.5">CTA Button Label</label>
                    <input
                      type="text"
                      required
                      value={heroForm.cta_text}
                      onChange={(e) => setHeroForm({ ...heroForm, cta_text: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 focus:border-violet-500/50 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                    />
                  </div>
                </>
              )}

              {/* ABOUT FORM */}
              {selectedSection === 'about' && (
                <>
                  <div>
                    <label className="block text-[10px] text-gray-400 uppercase font-bold mb-1.5">Biographical Header</label>
                    <input
                      type="text"
                      required
                      value={aboutForm.title}
                      onChange={(e) => setAboutForm({ ...aboutForm, title: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 focus:border-violet-500/50 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-gray-400 uppercase font-bold mb-1.5">Biographical Description</label>
                    <textarea
                      rows={4}
                      required
                      value={aboutForm.description}
                      onChange={(e) => setAboutForm({ ...aboutForm, description: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 focus:border-violet-500/50 rounded-xl p-3 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-gray-400 uppercase font-bold mb-1.5">Practitioner Designation</label>
                    <input
                      type="text"
                      required
                      value={aboutForm.doctor_signature}
                      onChange={(e) => setAboutForm({ ...aboutForm, doctor_signature: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 focus:border-violet-500/50 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                    />
                  </div>
                </>
              )}

              {/* FOOTER FORM */}
              {selectedSection === 'footer' && (
                <>
                  <div>
                    <label className="block text-[10px] text-gray-400 uppercase font-bold mb-1.5">Copyright Statement</label>
                    <input
                      type="text"
                      required
                      value={footerForm.copyright_text}
                      onChange={(e) => setFooterForm({ ...footerForm, copyright_text: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 focus:border-violet-500/50 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] text-gray-400 uppercase font-bold mb-1.5">Terms Page Label</label>
                      <input
                        type="text"
                        required
                        value={footerForm.terms_link_label}
                        onChange={(e) => setFooterForm({ ...footerForm, terms_link_label: e.target.value })}
                        className="w-full bg-black/40 border border-white/10 focus:border-violet-500/50 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] text-gray-400 uppercase font-bold mb-1.5">Privacy Page Label</label>
                      <input
                        type="text"
                        required
                        value={footerForm.privacy_link_label}
                        onChange={(e) => setFooterForm({ ...footerForm, privacy_link_label: e.target.value })}
                        className="w-full bg-black/40 border border-white/10 focus:border-violet-500/50 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="flex gap-2 pt-4 border-t border-white/5">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  Save Draft
                </button>

                <button
                  type="button"
                  onClick={handlePublish}
                  disabled={saving}
                  className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-violet-950/40"
                >
                  <Send className="w-3.5 h-3.5" />
                  Publish Live
                </button>
              </div>
            </form>

            {/* Version History Table (Rollback prep) */}
            {dbContentRecords.length > 0 && versions[dbContentRecords[0].id] && (
              <div className="mt-8 pt-6 border-t border-white/10 max-w-xl">
                <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5 mb-4">
                  <Clock className="w-4 h-4 text-violet-400 animate-pulse" />
                  Section Rollback Version History
                </h4>

                {versions[dbContentRecords[0].id].length === 0 ? (
                  <p className="text-[10px] text-gray-500 italic">No versions recorded. This page was just created.</p>
                ) : (
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                    {versions[dbContentRecords[0].id].map((ver) => (
                      <div
                        key={ver.id}
                        className="bg-white/5 border border-white/5 hover:border-white/10 p-3 rounded-2xl flex items-center justify-between text-xs transition-colors"
                      >
                        <div>
                          <p className="font-bold text-white">Version #{ver.version}</p>
                          <p className="text-[10px] text-gray-500 font-mono">
                            Published: {new Date(ver.created_at).toLocaleString()}
                          </p>
                        </div>
                        <button
                          onClick={() => handleRollback(dbContentRecords[0].id, ver.published_content)}
                          className="px-2.5 py-1.5 rounded-lg border border-violet-500/30 bg-violet-500/10 hover:bg-violet-500/20 text-violet-300 text-[10px] font-bold transition-all"
                        >
                          Rollback
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
