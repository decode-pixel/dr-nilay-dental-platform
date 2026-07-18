import React, { useState, useEffect } from 'react';
import {
  DoctorService,
  DoctorRepository,
  Doctor,
  DoctorWeeklyAvailability,
  DoctorDocument,
  DoctorProfileItem,
  Language,
  Specialization,
  DoctorStatus
} from '../../lib/doctorService';
import { useToast } from '../../components/ToastNotification';
import { logger } from '../../lib/logger';
import { supabase } from '../../lib/supabase';
import {
  User,
  Save,
  Plus,
  Trash2,
  Activity,
  Award,
  BookOpen,
  MapPin,
  Clock,
  Layers,
  FileText,
  Lock,
  Stethoscope,
  Smile,
  Shield,
  FileBadge,
  CheckCircle,
  HelpCircle,
  Eye,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function DashboardDoctors() {
  const { showToast } = useToast();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);

  // Sub-Navigation tabs inside doctors workspace
  const [workspaceTab, setWorkspaceTab] = useState<
    'profile' | 'qualifications' | 'awards' | 'certificates' | 'languages' | 'specializations' | 'clinics' | 'schedule' | 'documents' | 'statistics'
  >('profile');

  const loadDoctorsData = async () => {
    setLoading(true);
    try {
      const list = await DoctorService.getDoctors();
      setDoctors(list);
      if (list.length > 0) {
        setSelectedDoctor((p) => list.find((d) => d.id === p?.id) || list[0]);
      }
    } catch (err) {
      logger.error('Error loading doctors inside dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDoctorsData();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-white py-20 bg-transparent">
        <Clock className="w-10 h-10 animate-spin text-violet-400 mb-4" />
        <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Loading Practitioner Records...</span>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col lg:flex-row h-[calc(100vh-80px)] overflow-hidden font-sans bg-transparent">
      
      {/* 1. Left Sidebar: Doctors list */}
      <div className="w-full lg:w-72 border-r border-white/10 flex flex-col bg-[#050614]/40 backdrop-blur-md shrink-0 h-full">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <h3 className="font-heading font-bold text-sm text-white uppercase tracking-wider">
            Practitioners
          </h3>
          <span className="text-[10px] px-2 py-0.5 rounded bg-violet-600/10 text-violet-400 border border-violet-500/20 font-bold">
            {doctors.length} Doctors
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
          {doctors.map((doc) => {
            const isSelected = selectedDoctor?.id === doc.id;
            return (
              <div
                key={doc.id}
                onClick={() => setSelectedDoctor(doc)}
                className={`group rounded-2xl p-4 cursor-pointer border transition-all ${
                  isSelected
                    ? 'bg-gradient-to-br from-violet-600/15 to-blue-600/15 border-violet-400/50 shadow-md'
                    : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-white/5 border border-white/10 shrink-0">
                    {doc.profile_image ? (
                      <img src={doc.profile_image} alt={doc.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500">
                        <User className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                  <div className="truncate">
                    <h4 className="font-heading font-bold text-sm text-white group-hover:text-violet-200">
                      {doc.name}
                    </h4>
                    <p className="text-[10px] text-gray-400 truncate">{doc.designation || 'Practitioner'}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Right Workspace: Selected Doctor Profile Editor */}
      {selectedDoctor && (
        <div className="flex-1 flex flex-col h-full bg-white/[0.01]">
          {/* Header */}
          <div className="px-6 py-4 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/[0.01] shrink-0">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="font-heading font-bold text-lg text-white">{selectedDoctor.name}</h2>
                <span className={`text-[9px] px-2 py-0.5 rounded font-bold border ${
                  selectedDoctor.status === 'Available'
                    ? 'bg-green-500/10 text-green-400 border-green-500/20'
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                }`}>
                  {selectedDoctor.status}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">{selectedDoctor.qualification} • {selectedDoctor.registration_number}</p>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={selectedDoctor.status}
                onChange={async (e) => {
                  const targetVal = e.target.value as DoctorStatus;
                  await DoctorRepository.updateDoctorProfile(selectedDoctor.id, { status: targetVal });
                  showToast(`Doctor status changed to ${targetVal}.`, 'success');
                  loadDoctorsData();
                }}
                className="px-3 py-1.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none"
                style={{ colorScheme: 'dark' }}
              >
                <option value="Available">Available</option>
                <option value="On Leave">On Leave</option>
                <option value="Inactive">Inactive</option>
                <option value="Retired">Retired</option>
                <option value="Visiting">Visiting</option>
                <option value="Emergency Leave">Emergency Leave</option>
              </select>
            </div>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="px-6 border-b border-white/10 bg-white/[0.005] overflow-x-auto flex gap-6 shrink-0 text-xs font-semibold">
            {[
              { id: 'profile', label: 'Doctor Profile' },
              { id: 'qualifications', label: 'Qualifications' },
              { id: 'awards', label: 'Awards' },
              { id: 'certificates', label: 'Certificates' },
              { id: 'languages', label: 'Languages' },
              { id: 'specializations', label: 'Specializations' },
              { id: 'clinics', label: 'Clinics' },
              { id: 'schedule', label: 'Availability' },
              { id: 'documents', label: 'Documents' },
              { id: 'statistics', label: 'Statistics' }
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
                <DoctorProfileForm key={`profile-${selectedDoctor.id}`} doctor={selectedDoctor} onSave={loadDoctorsData} />
              )}

              {workspaceTab === 'qualifications' && (
                <DoctorQualificationsForm key={`qual-${selectedDoctor.id}`} doctor={selectedDoctor} />
              )}

              {workspaceTab === 'awards' && (
                <DoctorAwardsForm key={`award-${selectedDoctor.id}`} doctor={selectedDoctor} />
              )}

              {workspaceTab === 'certificates' && (
                <DoctorCertificatesForm key={`cert-${selectedDoctor.id}`} doctor={selectedDoctor} />
              )}

              {workspaceTab === 'languages' && (
                <DoctorLanguagesForm key={`lang-${selectedDoctor.id}`} doctor={selectedDoctor} />
              )}

              {workspaceTab === 'specializations' && (
                <DoctorSpecializationsForm key={`spec-${selectedDoctor.id}`} doctor={selectedDoctor} />
              )}

              {workspaceTab === 'clinics' && (
                <DoctorClinicAssignment key={`clinics-${selectedDoctor.id}`} doctor={selectedDoctor} />
              )}

              {workspaceTab === 'schedule' && (
                <DoctorScheduleEditor key={`sched-${selectedDoctor.id}`} doctor={selectedDoctor} />
              )}

              {workspaceTab === 'documents' && (
                <DoctorDocumentsManager key={`docs-${selectedDoctor.id}`} doctor={selectedDoctor} />
              )}

              {workspaceTab === 'statistics' && (
                <DoctorStatisticsPanel key={`stats-${selectedDoctor.id}`} doctor={selectedDoctor} />
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}

/* ==========================================
   SUB-COMPONENT 1: DOCTOR PROFILE FORM
   ========================================== */
interface ProfileFormProps {
  doctor: Doctor;
  onSave: () => void;
}
function DoctorProfileForm({ doctor, onSave }: ProfileFormProps) {
  const { showToast } = useToast();
  const [form, setForm] = useState({
    name: doctor.name || '',
    registration_number: doctor.registration_number || '',
    qualification: doctor.qualification || '',
    designation: doctor.designation || '',
    experience_years: String(doctor.experience_years || 10),
    bio: doctor.bio || '',
    profile_image: doctor.profile_image || '',
    cover_image: doctor.cover_image || '',
    signature_image: doctor.signature_image || '',
    public_slug: doctor.public_slug || '',
    login_enabled: doctor.login_enabled,
    profile_visibility: doctor.profile_visibility
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await DoctorRepository.updateDoctorProfile(doctor.id, {
        name: form.name,
        registration_number: form.registration_number,
        qualification: form.qualification,
        designation: form.designation,
        experience_years: parseInt(form.experience_years, 10) || 10,
        bio: form.bio,
        profile_image: form.profile_image || null,
        cover_image: form.cover_image || null,
        signature_image: form.signature_image || null,
        public_slug: form.public_slug || null,
        login_enabled: form.login_enabled,
        profile_visibility: form.profile_visibility
      });
      showToast('Practitioner profile saved successfully!', 'success');
      onSave();
    } catch {
      showToast('Error saving profile.', 'error');
    } finally {
      setSaving(false);
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
        <User className="w-4 h-4 text-rose-400" />
        Practitioner Profile Settings
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">Doctor Name</label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">Registration Number</label>
          <input
            type="text"
            required
            value={form.registration_number}
            onChange={(e) => setForm({ ...form, registration_number: e.target.value })}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">Qualifications Summary</label>
          <input
            type="text"
            required
            value={form.qualification}
            onChange={(e) => setForm({ ...form, qualification: e.target.value })}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">Designation</label>
          <input
            type="text"
            required
            value={form.designation}
            onChange={(e) => setForm({ ...form, designation: e.target.value })}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">Experience Years</label>
          <input
            type="number"
            required
            value={form.experience_years}
            onChange={(e) => setForm({ ...form, experience_years: e.target.value })}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">Biography</label>
        <textarea
          rows={3}
          value={form.bio}
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
          className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none resize-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">Profile Image URL</label>
          <input
            type="text"
            value={form.profile_image}
            onChange={(e) => setForm({ ...form, profile_image: e.target.value })}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">Cover Image URL</label>
          <input
            type="text"
            value={form.cover_image}
            onChange={(e) => setForm({ ...form, cover_image: e.target.value })}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">Prescription Signature URL</label>
          <input
            type="text"
            value={form.signature_image}
            onChange={(e) => setForm({ ...form, signature_image: e.target.value })}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">Public URL Slug</label>
          <input
            type="text"
            value={form.public_slug}
            onChange={(e) => setForm({ ...form, public_slug: e.target.value })}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
          />
        </div>
      </div>

      {/* Compliance flags */}
      <div className="grid grid-cols-2 gap-4 pt-3 border-t border-white/5 text-xs">
        <label className="flex items-center gap-2 cursor-pointer text-gray-300">
          <input
            type="checkbox"
            checked={form.login_enabled}
            onChange={(e) => setForm({ ...form, login_enabled: e.target.checked })}
            className="accent-violet-500 w-4 h-4 cursor-pointer"
          />
          Enable Future Portal Login
        </label>

        <label className="flex items-center gap-2 cursor-pointer text-gray-300">
          <input
            type="checkbox"
            checked={form.profile_visibility}
            onChange={(e) => setForm({ ...form, profile_visibility: e.target.checked })}
            className="accent-violet-500 w-4 h-4 cursor-pointer"
          />
          Visible on Public Website
        </label>
      </div>

      <div className="flex justify-end gap-2 pt-2 border-t border-white/5">
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition-all flex items-center gap-1.5"
        >
          <Save className="w-3.5 h-3.5" />
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </div>
    </motion.form>
  );
}

/* ==========================================
   SUB-COMPONENT 2: QUALIFICATIONS FORM
   ========================================== */
interface Props {
  doctor: Doctor;
}
function DoctorQualificationsForm({ doctor }: Props) {
  const { showToast } = useToast();
  const [list, setList] = useState<DoctorProfileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    DoctorService.getDoctorQualifications(doctor.id).then((data) => {
      setList(data);
      setLoading(false);
    });
  }, [doctor.id]);

  const handleAdd = () => {
    setList([...list, { title: '', institution: '', description: '', issue_date: '', display_order: list.length }]);
  };

  const handleRemove = (index: number) => {
    setList(list.filter((_, i) => i !== index));
  };

  const handleChange = (index: number, field: keyof DoctorProfileItem, value: any) => {
    const updated = [...list];
    updated[index] = { ...updated[index], [field]: value };
    setList(updated);
  };

  const handleSave = async () => {
    setSaving(true);
    const ok = await DoctorService.saveQualifications(doctor.id, list);
    setSaving(false);
    if (ok) showToast('Qualifications updated successfully!', 'success');
    else showToast('Failed to save qualifications.', 'error');
  };

  if (loading) return <div className="text-xs text-gray-500">Checking credentials...</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 max-w-3xl bg-white/5 border border-white/10 rounded-3xl p-6"
    >
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <h3 className="font-heading font-bold text-sm text-white flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-violet-400" />
          Academic Degrees & Qualifications
        </h3>
        <button
          onClick={handleAdd}
          className="px-2.5 py-1 rounded bg-white/5 border border-white/10 hover:bg-white/10 text-[10px] text-white flex items-center gap-1 font-bold"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Degree
        </button>
      </div>

      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
        {list.map((item, idx) => (
          <div key={idx} className="bg-black/30 border border-white/5 rounded-2xl p-4 relative space-y-3">
            <button
              onClick={() => handleRemove(idx)}
              className="absolute top-4 right-4 text-gray-500 hover:text-red-400"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">Degree Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master of Dental Surgery"
                  value={item.title}
                  onChange={(e) => handleChange(idx, 'title', e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">University / Board</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Calcutta Dental College"
                  value={item.institution}
                  onChange={(e) => handleChange(idx, 'institution', e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">Date of Issuance</label>
                <input
                  type="date"
                  value={item.issue_date || ''}
                  onChange={(e) => handleChange(idx, 'issue_date', e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
                  style={{ colorScheme: 'dark' }}
                />
              </div>

              <div>
                <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">Verification attachment link</label>
                <input
                  type="text"
                  placeholder="Degree file URL"
                  value={item.attachment_url || ''}
                  onChange={(e) => handleChange(idx, 'attachment_url', e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
                />
              </div>
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
          Save Qualifications
        </button>
      </div>
    </motion.div>
  );
}

/* ==========================================
   SUB-COMPONENT 3: AWARDS FORM
   ========================================== */
function DoctorAwardsForm({ doctor }: Props) {
  const { showToast } = useToast();
  const [list, setList] = useState<DoctorProfileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    DoctorService.getDoctorAwards(doctor.id).then((data) => {
      setList(data);
      setLoading(false);
    });
  }, [doctor.id]);

  const handleAdd = () => {
    setList([...list, { title: '', institution: '', description: '', issue_date: '', display_order: list.length }]);
  };

  const handleRemove = (index: number) => {
    setList(list.filter((_, i) => i !== index));
  };

  const handleChange = (index: number, field: keyof DoctorProfileItem, value: any) => {
    const updated = [...list];
    updated[index] = { ...updated[index], [field]: value };
    setList(updated);
  };

  const handleSave = async () => {
    setSaving(true);
    const ok = await DoctorService.saveAwards(doctor.id, list);
    setSaving(false);
    if (ok) showToast('Awards list updated successfully!', 'success');
    else showToast('Failed to save awards.', 'error');
  };

  if (loading) return <div className="text-xs text-gray-500">Checking honors...</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 max-w-3xl bg-white/5 border border-white/10 rounded-3xl p-6"
    >
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <h3 className="font-heading font-bold text-sm text-white flex items-center gap-2">
          <Award className="w-4 h-4 text-rose-400" />
          Honors & Professional Awards
        </h3>
        <button
          onClick={handleAdd}
          className="px-2.5 py-1 rounded bg-white/5 border border-white/10 hover:bg-white/10 text-[10px] text-white flex items-center gap-1 font-bold"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Award
        </button>
      </div>

      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
        {list.map((item, idx) => (
          <div key={idx} className="bg-black/30 border border-white/5 rounded-2xl p-4 relative space-y-3">
            <button
              onClick={() => handleRemove(idx)}
              className="absolute top-4 right-4 text-gray-500 hover:text-red-400"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">Award Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Best Orthodontist of West Bengal"
                  value={item.title}
                  onChange={(e) => handleChange(idx, 'title', e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">Awarding Institution</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dental Council of India"
                  value={item.institution}
                  onChange={(e) => handleChange(idx, 'institution', e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">Description</label>
              <input
                type="text"
                placeholder="Brief summary of citation"
                value={item.description || ''}
                onChange={(e) => handleChange(idx, 'description', e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
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
          Save Awards
        </button>
      </div>
    </motion.div>
  );
}

/* ==========================================
   SUB-COMPONENT 4: CERTIFICATIONS FORM
   ========================================== */
function DoctorCertificatesForm({ doctor }: Props) {
  const { showToast } = useToast();
  const [list, setList] = useState<DoctorProfileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    DoctorService.getDoctorCertifications(doctor.id).then((data) => {
      setList(data);
      setLoading(false);
    });
  }, [doctor.id]);

  const handleAdd = () => {
    setList([...list, { title: '', institution: '', description: '', issue_date: '', display_order: list.length }]);
  };

  const handleRemove = (index: number) => {
    setList(list.filter((_, i) => i !== index));
  };

  const handleChange = (index: number, field: keyof DoctorProfileItem, value: any) => {
    const updated = [...list];
    updated[index] = { ...updated[index], [field]: value };
    setList(updated);
  };

  const handleSave = async () => {
    setSaving(true);
    const ok = await DoctorService.saveCertifications(doctor.id, list);
    setSaving(false);
    if (ok) showToast('Certifications list saved successfully!', 'success');
    else showToast('Failed to save certificates.', 'error');
  };

  if (loading) return <div className="text-xs text-gray-500">Checking training lists...</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 max-w-3xl bg-white/5 border border-white/10 rounded-3xl p-6"
    >
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <h3 className="font-heading font-bold text-sm text-white flex items-center gap-2">
          <FileBadge className="w-4 h-4 text-violet-400" />
          Advanced Fellowships & Certifications
        </h3>
        <button
          onClick={handleAdd}
          className="px-2.5 py-1 rounded bg-white/5 border border-white/10 hover:bg-white/10 text-[10px] text-white flex items-center gap-1 font-bold"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Certificate
        </button>
      </div>

      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
        {list.map((item, idx) => (
          <div key={idx} className="bg-black/30 border border-white/5 rounded-2xl p-4 relative space-y-3">
            <button
              onClick={() => handleRemove(idx)}
              className="absolute top-4 right-4 text-gray-500 hover:text-red-400"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">Certification Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Fellowship in Endodontics"
                  value={item.title}
                  onChange={(e) => handleChange(idx, 'title', e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">Certified by</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Fellowship of International Endodontists"
                  value={item.institution}
                  onChange={(e) => handleChange(idx, 'institution', e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
                />
              </div>
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
          Save Certifications
        </button>
      </div>
    </motion.div>
  );
}

/* ==========================================
   SUB-COMPONENT 5: LANGUAGES FORM
   ========================================== */
function DoctorLanguagesForm({ doctor }: Props) {
  const { showToast } = useToast();
  const [catalog, setCatalog] = useState<Language[]>([]);
  const [doctorLangIds, setDoctorLangIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([
      DoctorService.getLanguageCatalog(),
      DoctorService.getDoctorLanguages(doctor.id)
    ]).then(([cat, ids]) => {
      setCatalog(cat);
      setDoctorLangIds(ids);
      setLoading(false);
    });
  }, [doctor.id]);

  const handleToggle = (langId: string) => {
    setDoctorLangIds((prev) =>
      prev.includes(langId) ? prev.filter((id) => id !== langId) : [...prev, langId]
    );
  };

  const handleSave = async () => {
    setSaving(true);
    const ok = await DoctorService.saveDoctorLanguages(doctor.id, doctorLangIds);
    setSaving(false);
    if (ok) showToast('Languages preference updated!', 'success');
    else showToast('Failed to save languages.', 'error');
  };

  if (loading) return <div className="text-xs text-gray-500">Checking language lists...</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 max-w-xl bg-white/5 border border-white/10 rounded-3xl p-6"
    >
      <h3 className="font-heading font-bold text-sm text-white flex items-center gap-2">
        <Smile className="w-4 h-4 text-violet-400" />
        Languages Spoken By Practitioner
      </h3>

      <div className="grid grid-cols-2 gap-3">
        {catalog.map((lang) => {
          const isChecked = doctorLangIds.includes(lang.id);
          return (
            <div
              key={lang.id}
              onClick={() => handleToggle(lang.id)}
              className={`p-3 rounded-2xl border cursor-pointer flex items-center justify-between transition-colors ${
                isChecked
                  ? 'bg-violet-600/10 border-violet-500/30 text-white'
                  : 'bg-white/5 border-white/5 hover:bg-white/10 text-gray-400'
              }`}
            >
              <span className="text-xs font-bold text-white">{lang.name}</span>
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
          Save Languages
        </button>
      </div>
    </motion.div>
  );
}

/* ==========================================
   SUB-COMPONENT 6: SPECIALIZATIONS FORM
   ========================================== */
function DoctorSpecializationsForm({ doctor }: Props) {
  const { showToast } = useToast();
  const [catalog, setCatalog] = useState<Specialization[]>([]);
  const [doctorSpecIds, setDoctorSpecIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([
      DoctorService.getSpecializationCatalog(),
      DoctorService.getDoctorSpecializations(doctor.id)
    ]).then(([cat, ids]) => {
      setCatalog(cat);
      setDoctorSpecIds(ids);
      setLoading(false);
    });
  }, [doctor.id]);

  const handleToggle = (specId: string) => {
    setDoctorSpecIds((prev) =>
      prev.includes(specId) ? prev.filter((id) => id !== specId) : [...prev, specId]
    );
  };

  const handleSave = async () => {
    setSaving(true);
    const ok = await DoctorService.saveDoctorSpecializations(doctor.id, doctorSpecIds);
    setSaving(false);
    if (ok) showToast('Doctor specializations updated!', 'success');
    else showToast('Failed to save specializations.', 'error');
  };

  if (loading) return <div className="text-xs text-gray-500">Checking specialities...</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 max-w-2xl bg-white/5 border border-white/10 rounded-3xl p-6"
    >
      <h3 className="font-heading font-bold text-sm text-white flex items-center gap-2">
        <Stethoscope className="w-4 h-4 text-violet-400" />
        Clinical Specialization Areas
      </h3>

      <div className="grid grid-cols-1 gap-3">
        {catalog.map((spec) => {
          const isChecked = doctorSpecIds.includes(spec.id);
          return (
            <div
              key={spec.id}
              onClick={() => handleToggle(spec.id)}
              className={`p-3.5 rounded-2xl border cursor-pointer flex items-center justify-between transition-colors ${
                isChecked
                  ? 'bg-violet-600/10 border-violet-500/30 text-white'
                  : 'bg-white/5 border-white/5 hover:bg-white/10 text-gray-400'
              }`}
            >
              <div>
                <p className="text-xs font-bold text-white">{spec.name}</p>
                <p className="text-[10px] text-gray-500 mt-0.5">{spec.description}</p>
              </div>
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => {}}
                className="accent-violet-500 cursor-pointer w-4 h-4 shrink-0"
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
          Save Specializations
        </button>
      </div>
    </motion.div>
  );
}

/* ==========================================
   SUB-COMPONENT 7: CLINICS CHECKLIST
   ========================================== */
function DoctorClinicAssignment({ doctor }: Props) {
  const { showToast } = useToast();
  const [clinics, setClinics] = useState<any[]>([]);
  const [assignedIds, setAssignedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([
      supabase.from('clinics').select('id, name, address'),
      DoctorService.getDoctorClinics(doctor.id)
    ]).then(([clinRes, ids]) => {
      setClinics(clinRes.data || []);
      setAssignedIds(ids);
      setLoading(false);
    });
  }, [doctor.id]);

  const handleToggle = (clinicId: string) => {
    setAssignedIds((prev) =>
      prev.includes(clinicId) ? prev.filter((id) => id !== clinicId) : [...prev, clinicId]
    );
  };

  const handleSave = async () => {
    setSaving(true);
    const ok = await DoctorService.saveDoctorClinics(doctor.id, assignedIds);
    setSaving(false);
    if (ok) showToast('Clinics assignment updated successfully!', 'success');
    else showToast('Failed to save clinics assignment.', 'error');
  };

  if (loading) return <div className="text-xs text-gray-500">Checking location mappings...</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 max-w-2xl bg-white/5 border border-white/10 rounded-3xl p-6"
    >
      <h3 className="font-heading font-bold text-sm text-white flex items-center gap-2">
        <MapPin className="w-4 h-4 text-rose-400" />
        Link Locations to Practitioner
      </h3>

      <div className="grid grid-cols-1 gap-3">
        {clinics.map((c) => {
          const isChecked = assignedIds.includes(c.id);
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
          Save Assignments
        </button>
      </div>
    </motion.div>
  );
}

/* ==========================================
   SUB-COMPONENT 8: SCHEDULE EDITOR
   ========================================== */
function DoctorScheduleEditor({ doctor }: Props) {
  const { showToast } = useToast();
  const [clinics, setClinics] = useState<any[]>([]);
  const [schedules, setSchedules] = useState<Partial<DoctorWeeklyAvailability>[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const SESSIONS = ['Morning', 'Evening'];

  useEffect(() => {
    Promise.all([
      supabase.from('clinics').select('id, name'),
      DoctorService.getDoctorWeeklyAvailability(doctor.id)
    ]).then(([clinRes, list]) => {
      setClinics(clinRes.data || []);
      setSchedules(list);
      setLoading(false);
    });
  }, [doctor.id]);

  const handleToggleSlot = (clinicId: string, weekday: string, session: string) => {
    const existsIndex = schedules.findIndex(
      (s) => s.clinic_id === clinicId && s.day_of_week === weekday && s.session === session
    );

    if (existsIndex > -1) {
      setSchedules((prev) => prev.filter((_, idx) => idx !== existsIndex));
    } else {
      setSchedules((prev) => [
        ...prev,
        {
          doctor_id: doctor.id,
          clinic_id: clinicId,
          day_of_week: weekday,
          session,
          is_active: true
        }
      ]);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const ok = await DoctorService.saveWeeklyAvailability(doctor.id, schedules);
    setSaving(false);
    if (ok) showToast('Weekly timings saved successfully!', 'success');
    else showToast('Failed to save timings.', 'error');
  };

  if (loading) return <div className="text-xs text-gray-500">Checking availability templates...</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 max-w-4xl bg-white/5 border border-white/10 rounded-3xl p-6"
    >
      <h3 className="font-heading font-bold text-sm text-white flex items-center gap-2">
        <Clock className="w-4 h-4 text-violet-400" />
        Weekly Slots Availability Configurator
      </h3>

      <div className="space-y-6">
        {clinics.map((clinic) => (
          <div key={clinic.id} className="border-b border-white/5 pb-4 last:border-0 last:pb-0">
            <h4 className="text-xs font-bold text-violet-300 mb-3 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-violet-400" />
              {clinic.name} Location
            </h4>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-gray-500 font-bold">
                    <th className="py-2">Session</th>
                    {WEEKDAYS.map((day) => (
                      <th key={day} className="py-2 text-center">{day.substring(0, 3)}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-gray-300">
                  {SESSIONS.map((session) => (
                    <tr key={session} className="hover:bg-white/[0.01]">
                      <td className="py-2.5 font-bold text-white">{session}</td>
                      {WEEKDAYS.map((day) => {
                        const isChecked = schedules.some(
                          (s) => s.clinic_id === clinic.id && s.day_of_week === day && s.session === session
                        );
                        return (
                          <td key={day} className="py-2.5 text-center">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleToggleSlot(clinic.id, day, session)}
                              className="accent-violet-500 cursor-pointer w-4 h-4"
                            />
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
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
          Save Timings
        </button>
      </div>
    </motion.div>
  );
}

/* ==========================================
   SUB-COMPONENT 9: DOCUMENTS MANAGER
   ========================================== */
function DoctorDocumentsManager({ doctor }: Props) {
  const { showToast } = useToast();
  const [docs, setDocs] = useState<DoctorDocument[]>([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: '',
    file_url: '',
    type: 'Degree',
    expiry_date: '',
    is_required: false
  });
  const [saving, setSaving] = useState(false);

  const loadDocuments = async () => {
    setLoading(true);
    try {
      const list = await DoctorService.getDoctorDocuments(doctor.id);
      setDocs(list);
    } catch (err) {
      logger.error('Error fetching documents list:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, [doctor.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.file_url) return;
    setSaving(true);

    const ok = await DoctorService.addDocument({
      doctor_id: doctor.id,
      name: form.name,
      file_url: form.file_url,
      document_type: form.type,
      expiry_date: form.expiry_date || undefined,
      is_required: form.is_required,
      verification_status: 'Pending'
    });

    setSaving(false);
    if (ok) {
      showToast('Document cataloged for compliance!', 'success');
      setForm({ name: '', file_url: '', type: 'Degree', expiry_date: '', is_required: false });
      loadDocuments();
    } else {
      showToast('Failed to add document.', 'error');
    }
  };

  const handleVerify = async (docId: string, status: 'Verified' | 'Rejected') => {
    const { error } = await supabase
      .from('doctor_documents')
      .update({
        verification_status: status,
        verified_at: new Date().toISOString()
      })
      .eq('id', docId);

    if (!error) {
      showToast(`Document status changed to ${status}!`, 'success');
      loadDocuments();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this credentials document?')) return;
    const ok = await DoctorService.deleteDocument(id);
    if (ok) {
      showToast('Document deleted.', 'info');
      loadDocuments();
    }
  };

  if (loading) return <div className="text-xs text-gray-500">Checking document catalog...</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl text-gray-300"
    >
      <div className="bg-white/5 border border-white/10 rounded-3xl p-5 space-y-4 h-fit">
        <h3 className="font-heading font-bold text-sm text-white flex items-center gap-2">
          <FileText className="w-4 h-4 text-violet-400" />
          Degrees & Certifications Catalog
        </h3>

        {docs.length === 0 ? (
          <p className="text-xs text-gray-500 p-4 border border-dashed border-white/10 rounded-2xl text-center">
            No licensing credentials cataloged.
          </p>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {docs.map((doc) => (
              <div
                key={doc.id}
                className="bg-black/30 border border-white/5 p-4 rounded-2xl flex flex-col gap-2.5 text-xs transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-white">{doc.name}</p>
                      {doc.is_required && (
                        <span className="text-[8px] px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20 font-bold">
                          Required
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-violet-400 mt-0.5">{doc.document_type}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(doc.id)}
                    className="p-1 rounded bg-red-500/10 text-red-400 hover:bg-red-500/20 shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center justify-between text-[10px] text-gray-400 border-t border-white/5 pt-2">
                  <span>Expiry: {doc.expiry_date || 'N/A'}</span>
                  <div className="flex items-center gap-1.5">
                    <span className={`px-1.5 py-0.5 rounded font-bold ${
                      doc.verification_status === 'Verified'
                        ? 'bg-green-500/10 text-green-400'
                        : doc.verification_status === 'Rejected'
                        ? 'bg-red-500/10 text-red-400'
                        : 'bg-amber-500/10 text-amber-400'
                    }`}>
                      {doc.verification_status}
                    </span>
                  </div>
                </div>

                {doc.verification_status === 'Pending' && (
                  <div className="flex justify-end gap-1.5 pt-1.5">
                    <button
                      onClick={() => handleVerify(doc.id, 'Verified')}
                      className="px-2 py-1 rounded bg-green-600/20 hover:bg-green-600/30 text-green-400 text-[9px] font-bold"
                    >
                      Verify
                    </button>
                    <button
                      onClick={() => handleVerify(doc.id, 'Rejected')}
                      className="px-2 py-1 rounded bg-red-600/20 hover:bg-red-600/30 text-red-400 text-[9px] font-bold"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-3xl p-5 space-y-4 h-fit">
        <h3 className="font-heading font-bold text-sm text-white">Log License Credentials</h3>

        <div>
          <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">Document Name</label>
          <input
            type="text"
            required
            placeholder="e.g. BDS License Certificate"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">Attachment File URL</label>
          <input
            type="text"
            required
            placeholder="Paste document file URL"
            value={form.file_url}
            onChange={(e) => setForm({ ...form, file_url: e.target.value })}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">Document Type</label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none"
              style={{ colorScheme: 'dark' }}
            >
              <option value="Degree">Degree</option>
              <option value="Registration">Council Registration</option>
              <option value="Certificate">Certificate</option>
              <option value="Other">Other ID</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">Expiry Date</label>
            <input
              type="date"
              value={form.expiry_date}
              onChange={(e) => setForm({ ...form, expiry_date: e.target.value })}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
              style={{ colorScheme: 'dark' }}
            />
          </div>
        </div>

        <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer">
          <input
            type="checkbox"
            checked={form.is_required}
            onChange={(e) => setForm({ ...form, is_required: e.target.checked })}
            className="accent-violet-500 w-4 h-4 cursor-pointer"
          />
          Mark as Mandatory Compliance File
        </label>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          Attach Document
        </button>
      </form>
    </motion.div>
  );
}

/* ==========================================
   SUB-COMPONENT 10: STATISTICS PANEL
   ========================================== */
function DoctorStatisticsPanel({ doctor }: Props) {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    DoctorService.getDoctorStatistics(doctor.id).then((data) => {
      setStats(data);
      setLoading(false);
    });
  }, [doctor.id]);

  if (loading) return <div className="text-xs text-gray-500">Retrieving statistics...</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl text-gray-300"
    >
      {[
        { label: "Today's Appointments", value: stats.todayAppointments, desc: 'Scheduled requests' },
        { label: 'Completed Visits', value: stats.completed, desc: 'Treated patients' },
        { label: 'Cancelled Visits', value: stats.cancelled, desc: 'No show/rejections' },
        { label: 'Upcoming Requests', value: stats.upcoming, desc: 'Awaiting checks' },
        { label: 'Patients Treated', value: stats.patientsTreated, desc: 'Overall cases' },
        { label: 'Average Review Rating', value: `${stats.averageRating} ★`, desc: 'Google local maps' }
      ].map((stat, idx) => (
        <div key={idx} className="bg-white/5 border border-white/10 rounded-3xl p-5 flex flex-col justify-between">
          <div>
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">
              {stat.label}
            </span>
            <span className="text-2xl font-bold font-heading text-white">{stat.value}</span>
          </div>
          <span className="text-[9px] text-violet-400 mt-2 block">{stat.desc}</span>
        </div>
      ))}
    </motion.div>
  );
}
