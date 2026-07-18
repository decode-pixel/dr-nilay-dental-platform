import React, { useState, useEffect } from 'react';
import {
  DoctorService,
  DoctorRepository,
  Doctor,
  DoctorWeeklyAvailability,
  DoctorDocument
} from '../../lib/doctorService';
import { useToast } from '../../components/ToastNotification';
import { logger } from '../../lib/logger';
import { supabase } from '../../lib/supabase';
import {
  User,
  Phone,
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
  Smile
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function DashboardDoctors() {
  const { showToast } = useToast();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);

  // Sub-Navigation tabs inside doctors workspace
  const [workspaceTab, setWorkspaceTab] = useState<'profile' | 'clinics' | 'treatments' | 'schedule' | 'documents'>('profile');

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
      <div className="flex-1 flex flex-col items-center justify-center text-white py-20">
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
          <div className="px-6 py-4 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/[0.01]">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="font-heading font-bold text-lg text-white">{selectedDoctor.name}</h2>
                <span className={`text-[9px] px-2 py-0.5 rounded font-bold border ${
                  selectedDoctor.is_active
                    ? 'bg-green-500/10 text-green-400 border-green-500/20'
                    : 'bg-red-500/10 text-red-400 border-red-500/20'
                }`}>
                  {selectedDoctor.is_active ? 'Active Status' : 'Inactive'}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">{selectedDoctor.qualification} • {selectedDoctor.registration_number}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={async () => {
                  const targetState = !selectedDoctor.is_active;
                  await DoctorRepository.updateDoctorProfile(selectedDoctor.id, { is_active: targetState });
                  showToast(`Doctor status toggled to ${targetState ? 'Active' : 'Inactive'}.`, 'info');
                  loadDoctorsData();
                }}
                className="px-3 py-1.5 rounded-xl border border-white/10 hover:bg-white/10 text-[10px] font-bold text-gray-300"
              >
                Toggle Status
              </button>
            </div>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="px-6 border-b border-white/10 bg-white/[0.005] overflow-x-auto flex gap-6 shrink-0 text-xs font-semibold">
            {[
              { id: 'profile', label: 'Doctor Profile' },
              { id: 'clinics', label: 'Clinics Assignment' },
              { id: 'treatments', label: 'Treatments list' },
              { id: 'schedule', label: 'Weekly availability' },
              { id: 'documents', label: 'Licensing credentials' }
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
          <div className="flex-1 overflow-y-auto p-6">
            <AnimatePresence mode="wait">
              {/* TAB 1: DOCTOR PROFILE EDIT */}
              {workspaceTab === 'profile' && (
                <DoctorProfileForm
                  key={`profile-${selectedDoctor.id}`}
                  doctor={selectedDoctor}
                  onSave={loadDoctorsData}
                />
              )}

              {/* TAB 2: CLINIC ASSIGNMENT */}
              {workspaceTab === 'clinics' && (
                <DoctorClinicAssignment
                  key={`clinics-${selectedDoctor.id}`}
                  doctor={selectedDoctor}
                />
              )}

              {/* TAB 3: TREATMENTS ASSIGNMENT */}
              {workspaceTab === 'treatments' && (
                <DoctorTreatmentAssignment
                  key={`treatments-${selectedDoctor.id}`}
                  doctor={selectedDoctor}
                />
              )}

              {/* TAB 4: WEEKLY AVAILABILITY */}
              {workspaceTab === 'schedule' && (
                <DoctorScheduleEditor
                  key={`sched-${selectedDoctor.id}`}
                  doctor={selectedDoctor}
                />
              )}

              {/* TAB 5: DOCUMENT MANAGERS */}
              {workspaceTab === 'documents' && (
                <DoctorDocumentsManager
                  key={`docs-${selectedDoctor.id}`}
                  doctor={selectedDoctor}
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
    languages: doctor.languages || 'English, Bengali, Hindi',
    bio: doctor.bio || '',
    profile_image: doctor.profile_image || '',
    cover_image: doctor.cover_image || '',
    signature_image: doctor.signature_image || ''
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
        languages: form.languages,
        bio: form.bio,
        profile_image: form.profile_image || null,
        cover_image: form.cover_image || null,
        signature_image: form.signature_image || null
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
      className="space-y-5 max-w-2xl bg-white/5 border border-white/10 rounded-3xl p-6"
    >
      <h3 className="font-heading font-bold text-sm text-white flex items-center gap-2 mb-3">
        <Award className="w-4 h-4 text-violet-400" />
        Professional Details & Profile
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
          <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">Qualifications</label>
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
        <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">Languages Spoken</label>
        <input
          type="text"
          value={form.languages}
          onChange={(e) => setForm({ ...form, languages: e.target.value })}
          className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">Biography Description</label>
        <textarea
          rows={3}
          value={form.bio}
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
          className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none resize-none"
        />
      </div>

      {/* Picture Upload URLs placeholders */}
      <div className="grid grid-cols-2 gap-4 pt-3 border-t border-white/5">
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
          <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">Prescription Signature URL</label>
          <input
            type="text"
            value={form.signature_image}
            onChange={(e) => setForm({ ...form, signature_image: e.target.value })}
            placeholder="Signature image public link"
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
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </div>
    </motion.form>
  );
}

/* ==========================================
   SUB-COMPONENT 2: CLINIC ASSIGNMENT
   ========================================== */
interface AssignProps {
  doctor: Doctor;
}
function DoctorClinicAssignment({ doctor }: AssignProps) {
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
        <MapPin className="w-4 h-4 text-violet-400" />
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
          {saving ? 'Updating assignments...' : 'Save Assignments'}
        </button>
      </div>
    </motion.div>
  );
}

/* ==========================================
   SUB-COMPONENT 3: TREATMENTS ASSIGNMENT
   ========================================== */
interface TreatmentProps {
  doctor: Doctor;
}
function DoctorTreatmentAssignment({ doctor }: TreatmentProps) {
  const { showToast } = useToast();
  const [treatments, setTreatments] = useState<any[]>([]);
  const [assignedIds, setAssignedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([
      supabase.from('services').select('id, name, description'),
      DoctorService.getDoctorTreatments(doctor.id)
    ]).then(([treatRes, ids]) => {
      setTreatments(treatRes.data || []);
      setAssignedIds(ids);
      setLoading(false);
    });
  }, [doctor.id]);

  const handleToggle = (treatmentId: string) => {
    setAssignedIds((prev) =>
      prev.includes(treatmentId) ? prev.filter((id) => id !== treatmentId) : [...prev, treatmentId]
    );
  };

  const handleSave = async () => {
    setSaving(true);
    const ok = await DoctorService.saveDoctorTreatments(doctor.id, assignedIds);
    setSaving(false);
    if (ok) showToast('Treatment specializations updated!', 'success');
    else showToast('Failed to save treatments.', 'error');
  };

  if (loading) return <div className="text-xs text-gray-500">Checking treatments mapping...</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 max-w-2xl bg-white/5 border border-white/10 rounded-3xl p-6"
    >
      <h3 className="font-heading font-bold text-sm text-white flex items-center gap-2">
        <Stethoscope className="w-4 h-4 text-violet-400" />
        Configure Specialization Services
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {treatments.map((t) => {
          const isChecked = assignedIds.includes(t.id);
          return (
            <div
              key={t.id}
              onClick={() => handleToggle(t.id)}
              className={`p-3 rounded-2xl border cursor-pointer flex items-center justify-between transition-colors ${
                isChecked
                  ? 'bg-violet-600/10 border-violet-500/30 text-white'
                  : 'bg-white/5 border-white/5 hover:bg-white/10 text-gray-400'
              }`}
            >
              <div className="truncate pr-2">
                <p className="text-xs font-bold text-white truncate" title={t.name}>{t.name}</p>
                <p className="text-[10px] text-gray-500 mt-0.5 truncate" title={t.description}>{t.description || 'Dental treatment'}</p>
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
          {saving ? 'Updating treatments...' : 'Save Specializations'}
        </button>
      </div>
    </motion.div>
  );
}

/* ==========================================
   SUB-COMPONENT 4: WEEKLY AVAILABILITY
   ========================================== */
interface SchedProps {
  doctor: Doctor;
}
function DoctorScheduleEditor({ doctor }: SchedProps) {
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
      // Remove slot
      setSchedules((prev) => prev.filter((_, idx) => idx !== existsIndex));
    } else {
      // Add slot
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
        Configure Weekly Session Timings
      </h3>

      <div className="space-y-6">
        {clinics.map((clinic) => (
          <div key={clinic.id} className="border-b border-white/5 pb-4 last:border-0 last:pb-0">
            <h4 className="text-xs font-bold text-violet-300 mb-3 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              {clinic.name} Location
            </h4>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-gray-500 font-bold">
                    <th className="py-2">Session Slot</th>
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
          {saving ? 'Updating slots...' : 'Save Weekly timings'}
        </button>
      </div>
    </motion.div>
  );
}

/* ==========================================
   SUB-COMPONENT 5: DOCUMENTS MANAGEMENT
   ========================================== */
interface DocProps {
  doctor: Doctor;
}
function DoctorDocumentsManager({ doctor }: DocProps) {
  const { showToast } = useToast();
  const [docs, setDocs] = useState<DoctorDocument[]>([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: '',
    file_url: '',
    type: 'Degree'
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
    const ok = await DoctorService.addDocument(doctor.id, form.name, form.file_url, form.type);
    setSaving(false);
    if (ok) {
      showToast('Document record logged!', 'success');
      setForm({ name: '', file_url: '', type: 'Degree' });
      loadDocuments();
    } else {
      showToast('Failed to add document.', 'error');
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
      {/* Documents log */}
      <div className="bg-white/5 border border-white/10 rounded-3xl p-5 space-y-4 h-fit">
        <h3 className="font-heading font-bold text-sm text-white flex items-center gap-2">
          <FileText className="w-4 h-4 text-violet-400 animate-pulse" />
          Degrees & Certifications Catalog
        </h3>

        {docs.length === 0 ? (
          <p className="text-xs text-gray-500 p-4 border border-dashed border-white/10 rounded-2xl text-center">
            No licensing credentials cataloged.
          </p>
        ) : (
          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {docs.map((doc) => (
              <div
                key={doc.id}
                className="bg-white/5 border border-white/5 hover:border-white/10 p-3 rounded-2xl flex items-center justify-between text-xs transition-colors"
              >
                <div>
                  <p className="font-bold text-white">{doc.name}</p>
                  <p className="text-[10px] text-violet-400 mt-0.5">{doc.document_type}</p>
                  <a
                    href={doc.file_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[9px] text-gray-500 underline truncate block max-w-xs"
                  >
                    {doc.file_url}
                  </a>
                </div>
                <button
                  onClick={() => handleDelete(doc.id)}
                  className="p-1.5 rounded-lg border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-400 shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Document form */}
      <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-3xl p-5 space-y-4 h-fit">
        <h3 className="font-heading font-bold text-sm text-white">Log License Credentials Document</h3>

        <div>
          <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">Document Name</label>
          <input
            type="text"
            required
            placeholder="e.g. Master of Dental Surgery Degree"
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
            placeholder="Paste public document file URL"
            value={form.file_url}
            onChange={(e) => setForm({ ...form, file_url: e.target.value })}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">Document Type</label>
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none"
            style={{ colorScheme: 'dark' }}
          >
            <option value="Degree">Educational Degree</option>
            <option value="Registration">Dental Council Registration</option>
            <option value="Certificate">Advanced Training Certificate</option>
            <option value="Other">Other License</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          {saving ? 'Adding...' : 'Attach Document'}
        </button>
      </form>
    </motion.div>
  );
}
