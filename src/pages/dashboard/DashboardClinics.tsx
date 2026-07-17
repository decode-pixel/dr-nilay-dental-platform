import React, { useState, useEffect } from 'react';
import {
  ClinicRepository,
  ClinicService,
  Clinic,
  ClinicSchedule,
  ClinicHoliday,
  ClinicClosure,
  ClinicNotice,
  Facility,
  Doctor,
  DoctorAvailability
} from '../../lib/clinicService';
import { useToast } from '../../components/ToastNotification';
import { logger } from '../../lib/logger';
import {
  MapPin,
  Clock,
  Phone,
  Navigation,
  Calendar,
  Sparkles,
  ShieldCheck,
  CheckCircle,
  XCircle,
  Edit2,
  Trash2,
  Plus,
  Save,
  Bell,
  Activity,
  AlertTriangle,
  User,
  Coffee,
  Heart,
  Car,
  Wind,
  Droplet,
  CreditCard,
  CalendarCheck,
  UserCheck,
  Users,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const FACILITY_ICONS: Record<string, any> = {
  Users,
  CreditCard,
  Car,
  Wind,
  Droplet,
  ShieldCheck,
  CalendarCheck,
  UserCheck
};

export default function DashboardClinics() {
  const { showToast } = useToast();
  const [clinics, setClinics] = useState<any[]>([]);
  const [selectedClinic, setSelectedClinic] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Sub-Navigation tabs inside clinics editor
  const [editorTab, setEditorTab] = useState<'profile' | 'schedule' | 'facilities' | 'holidays' | 'closures' | 'availability' | 'notices'>('profile');

  // Today Date Helper
  const getTodayStr = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const loadClinicsData = async () => {
    setLoading(true);
    try {
      const list = await ClinicService.getClinicsWithStatus(getTodayStr());
      setClinics(list);
      if (list.length > 0) {
        // Keep active selection or select first
        setSelectedClinic((prev: any) => list.find((c) => c.id === prev?.id) || list[0]);
      }
    } catch (err) {
      logger.error('Failed to load clinics data inside dashboard:', err);
      showToast('Error loading clinic schedules.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClinicsData();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-white py-20">
        <Clock className="w-10 h-10 animate-spin text-violet-400 mb-4" />
        <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Loading Clinic Records...</span>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col lg:flex-row h-[calc(100vh-80px)] overflow-hidden font-sans bg-transparent">
      {/* 1. Left Sidebar: Clinic Selectors List */}
      <div className="w-full lg:w-80 border-r border-white/10 flex flex-col bg-[#050614]/40 backdrop-blur-md shrink-0 h-full">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <h3 className="font-heading font-bold text-sm text-white uppercase tracking-wider">
            Active Locations
          </h3>
          <span className="text-[10px] px-2 py-0.5 rounded bg-violet-600/10 text-violet-400 border border-violet-500/20 font-bold">
            {clinics.length} Centers
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
          {clinics.map((clinic) => {
            const isSelected = selectedClinic?.id === clinic.id;
            const status = clinic.statusInfo?.status || 'Closed';
            const isOpen = status === 'Open';

            return (
              <div
                key={clinic.id}
                onClick={() => setSelectedClinic(clinic)}
                className={`group rounded-2xl p-4 cursor-pointer border transition-all ${
                  isSelected
                    ? 'bg-gradient-to-br from-violet-600/15 to-blue-600/15 border-violet-400/50 shadow-md'
                    : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-heading font-bold text-sm text-white group-hover:text-violet-200 truncate">
                    {clinic.name.split('—')[1] || clinic.name}
                  </h4>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                    isOpen ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                  }`}>
                    {status}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1 truncate">{clinic.address}</p>

                <div className="flex items-center justify-between mt-3 text-[10px] text-gray-500">
                  <span>Today's Sessions:</span>
                  <span className="text-white font-medium">
                    {isOpen ? clinic.statusInfo.session_times.split('&')[0] : 'None'}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-1 text-[10px] text-gray-500">
                  <span>Appointments Today:</span>
                  <span className="text-violet-400 font-bold">{clinic.appointmentsToday || 0}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Right Workspace: Selected Clinic Editor Details */}
      {selectedClinic && (
        <div className="flex-1 flex flex-col h-full bg-white/[0.01]">
          {/* Header */}
          <div className="px-6 py-4 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/[0.01]">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="font-heading font-bold text-lg text-white">{selectedClinic.name}</h2>
                {selectedClinic.is_featured && (
                  <span className="text-[9px] px-2 py-0.5 rounded bg-violet-600/20 text-violet-300 border border-violet-500/30 font-bold">
                    Primary
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-0.5">{selectedClinic.address}</p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] text-gray-500">Active status:</span>
              <button
                onClick={async () => {
                  const targetState = !selectedClinic.is_active;
                  const ok = await ClinicService.updateClinicProfile(selectedClinic.id, { is_active: targetState });
                  if (ok) {
                    showToast(`Location status updated to ${targetState ? 'Active' : 'Deactivated'}.`, 'success');
                    loadClinicsData();
                  } else {
                    showToast('Failed to toggle active state.', 'error');
                  }
                }}
                className={`px-3 py-1.5 rounded-xl border text-[10px] font-bold transition-all ${
                  selectedClinic.is_active
                    ? 'bg-green-600/10 text-green-400 border-green-500/30'
                    : 'bg-red-600/10 text-red-400 border-red-500/30'
                }`}
              >
                {selectedClinic.is_active ? 'Active' : 'Closed'}
              </button>
            </div>
          </div>

          {/* Sub Navigation Editor tabs */}
          <div className="px-6 border-b border-white/10 bg-white/[0.005] overflow-x-auto flex gap-6 shrink-0 text-xs font-semibold">
            {[
              { id: 'profile', label: 'General Profile' },
              { id: 'schedule', label: 'Weekly Schedule' },
              { id: 'facilities', label: 'Facilities' },
              { id: 'availability', label: 'Doctor Availability' },
              { id: 'holidays', label: 'Holiday Registry' },
              { id: 'closures', label: 'Emergency Closures' },
              { id: 'notices', label: 'Clinic Notices' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setEditorTab(tab.id as any)}
                className={`py-3.5 border-b-2 transition-all whitespace-nowrap ${
                  editorTab === tab.id
                    ? 'border-violet-500 text-white'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Scrollable Form Body Container */}
          <div className="flex-1 overflow-y-auto p-6">
            <AnimatePresence mode="wait">
              {/* TAB 1: GENERAL PROFILE EDIT */}
              {editorTab === 'profile' && (
                <ClinicProfileForm
                  key={`profile-${selectedClinic.id}`}
                  clinic={selectedClinic}
                  onSave={loadClinicsData}
                />
              )}

              {/* TAB 2: WEEKLY SCHEDULE EDITOR */}
              {editorTab === 'schedule' && (
                <ClinicScheduleEditor
                  key={`sched-${selectedClinic.id}`}
                  clinic={selectedClinic}
                  onSave={loadClinicsData}
                />
              )}

              {/* TAB 3: FACILITIES MANAGER */}
              {editorTab === 'facilities' && (
                <ClinicFacilitiesManager
                  key={`fac-${selectedClinic.id}`}
                  clinic={selectedClinic}
                  onSave={loadClinicsData}
                />
              )}

              {/* TAB 4: DOCTOR AVAILABILITY */}
              {editorTab === 'availability' && (
                <ClinicDoctorAvailability
                  key={`avail-${selectedClinic.id}`}
                  clinic={selectedClinic}
                />
              )}

              {/* TAB 5: HOLIDAYS REGISTRY */}
              {editorTab === 'holidays' && (
                <ClinicHolidaysList
                  key={`hol-${selectedClinic.id}`}
                  clinic={selectedClinic}
                />
              )}

              {/* TAB 6: EMERGENCY CLOSURES */}
              {editorTab === 'closures' && (
                <ClinicClosuresLog
                  key={`clos-${selectedClinic.id}`}
                  clinic={selectedClinic}
                />
              )}

              {/* TAB 7: CLINIC NOTICES */}
              {editorTab === 'notices' && (
                <ClinicNoticesManager
                  key={`notice-${selectedClinic.id}`}
                  clinic={selectedClinic}
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
   SUB-COMPONENT 1: CLINIC PROFILE FORM
   ========================================== */
interface ProfileFormProps extends React.Attributes {
  clinic: Clinic;
  onSave: () => void;
}
function ClinicProfileForm({ clinic, onSave }: ProfileFormProps) {
  const { showToast } = useToast();
  const [form, setForm] = useState({
    name: clinic.name || '',
    address: clinic.address || '',
    landmark: clinic.landmark || '',
    phone: clinic.phone || '',
    whatsapp_phone: clinic.whatsapp_phone || '',
    emergency_phone: clinic.emergency_phone || '',
    google_map_link: clinic.google_map_link || '',
    visiting_note: clinic.visiting_note || '',
    google_rating: String(clinic.google_rating || 4.8),
    review_count: String(clinic.review_count || 120),
    is_featured: clinic.is_featured || false,
    cover_image: clinic.cover_image || '',
    logo_url: clinic.logo_url || ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const success = await ClinicService.updateClinicProfile(clinic.id, {
        name: form.name,
        address: form.address,
        landmark: form.landmark,
        phone: form.phone,
        whatsapp_phone: form.whatsapp_phone,
        emergency_phone: form.emergency_phone || null,
        google_map_link: form.google_map_link || null,
        visiting_note: form.visiting_note || null,
        google_rating: parseFloat(form.google_rating) || 4.8,
        review_count: parseInt(form.review_count, 10) || 120,
        is_featured: form.is_featured,
        cover_image: form.cover_image || null,
        logo_url: form.logo_url || null
      });

      if (success) {
        showToast('Clinic profile updated successfully!', 'success');
        onSave();
      } else {
        showToast('Failed to update clinic profile.', 'error');
      }
    } catch (err) {
      logger.error('Error saving clinic general profile details:', err);
    } finally {
      setSubmitting(false);
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
        <Edit2 className="w-4 h-4 text-violet-400" />
        General Coordinates & Info
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1.5">Clinic Name</label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full bg-black/40 border border-white/10 focus:border-violet-500/50 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1.5">Primary Phone</label>
          <input
            type="text"
            required
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full bg-black/40 border border-white/10 focus:border-violet-500/50 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1.5">WhatsApp Contact</label>
          <input
            type="text"
            required
            value={form.whatsapp_phone}
            onChange={(e) => setForm({ ...form, whatsapp_phone: e.target.value })}
            className="w-full bg-black/40 border border-white/10 focus:border-violet-500/50 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1.5">Emergency Contact</label>
          <input
            type="text"
            value={form.emergency_phone}
            onChange={(e) => setForm({ ...form, emergency_phone: e.target.value })}
            className="w-full bg-black/40 border border-white/10 focus:border-violet-500/50 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1.5">Street Address</label>
        <textarea
          rows={2}
          required
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          className="w-full bg-black/40 border border-white/10 focus:border-violet-500/50 rounded-xl p-3 text-xs text-white focus:outline-none resize-none"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1.5">Landmark Notice</label>
          <input
            type="text"
            value={form.landmark}
            onChange={(e) => setForm({ ...form, landmark: e.target.value })}
            className="w-full bg-black/40 border border-white/10 focus:border-violet-500/50 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1.5">Google Maps URL</label>
          <input
            type="text"
            value={form.google_map_link}
            onChange={(e) => setForm({ ...form, google_map_link: e.target.value })}
            className="w-full bg-black/40 border border-white/10 focus:border-violet-500/50 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1.5">Google Rating</label>
          <input
            type="number"
            step="0.1"
            value={form.google_rating}
            onChange={(e) => setForm({ ...form, google_rating: e.target.value })}
            className="w-full bg-black/40 border border-white/10 focus:border-violet-500/50 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1.5">Google Reviews Count</label>
          <input
            type="number"
            value={form.review_count}
            onChange={(e) => setForm({ ...form, review_count: e.target.value })}
            className="w-full bg-black/40 border border-white/10 focus:border-violet-500/50 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
          />
        </div>

        <div className="flex items-center h-full pt-6">
          <label className="inline-flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
            <input
              type="checkbox"
              checked={form.is_featured}
              onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
              className="accent-violet-500 w-4 h-4 rounded"
            />
            Primary Featured Center
          </label>
        </div>
      </div>

      {/* Future CMS Media Assets placeholders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/5">
        <div>
          <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1.5">Logo URL (Future CMS)</label>
          <input
            type="text"
            disabled
            value={form.logo_url}
            placeholder="Logo image upload will be enabled in Sprint 4.0"
            className="w-full bg-black/20 border border-white/5 rounded-xl px-3 py-2 text-xs text-gray-500 cursor-not-allowed focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1.5">Cover Image (Future CMS)</label>
          <input
            type="text"
            disabled
            value={form.cover_image}
            placeholder="Clinic cover image upload will be enabled in Sprint 4.0"
            className="w-full bg-black/20 border border-white/5 rounded-xl px-3 py-2 text-xs text-gray-500 cursor-not-allowed focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1.5">Operating Notes / General Info</label>
        <textarea
          rows={3}
          value={form.visiting_note}
          onChange={(e) => setForm({ ...form, visiting_note: e.target.value })}
          className="w-full bg-black/40 border border-white/10 focus:border-violet-500/50 rounded-xl p-3 text-xs text-white focus:outline-none resize-none"
        />
      </div>

      <div className="flex justify-end gap-2 pt-2 border-t border-white/5">
        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition-all flex items-center gap-1.5"
        >
          <Save className="w-3.5 h-3.5" />
          {submitting ? 'Saving changes...' : 'Save Profile'}
        </button>
      </div>
    </motion.form>
  );
}

/* ==========================================
   SUB-COMPONENT 2: WEEKLY SCHEDULE EDITOR
   ========================================== */
interface ScheduleEditorProps extends React.Attributes {
  clinic: Clinic;
  onSave: () => void;
}
function ClinicScheduleEditor({ clinic, onSave }: ScheduleEditorProps) {
  const { showToast } = useToast();
  const [schedules, setSchedules] = useState<ClinicSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    ClinicRepository.getSchedules(clinic.id).then((data) => {
      // Filter schedules belonging to this clinic
      const filtered = data.filter((s) => s.clinic_id === clinic.id);
      setSchedules(filtered);
      setLoading(false);
    });
  }, [clinic.id]);

  const handleUpdateField = (id: string, field: keyof ClinicSchedule, value: any) => {
    setSchedules((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const handleSave = async () => {
    setSaving(true);
    const ok = await ClinicService.saveClinicSchedule(schedules);
    setSaving(false);
    if (ok) {
      showToast('Weekly session timings saved successfully!', 'success');
      onSave();
    } else {
      showToast('Error saving schedules.', 'error');
    }
  };

  if (loading) return <div className="text-xs text-gray-500">Loading schedule...</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 max-w-4xl bg-white/5 border border-white/10 rounded-3xl p-6"
    >
      <h3 className="font-heading font-bold text-sm text-white flex items-center gap-2">
        <Clock className="w-4 h-4 text-violet-400" />
        Weekly Session Timings & Doctor Availability
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-white/10 text-gray-500 font-bold">
              <th className="py-2.5">Day of Week</th>
              <th className="py-2.5">Session Name</th>
              <th className="py-2.5">Start Time</th>
              <th className="py-2.5">End Time</th>
              <th className="py-2.5 text-center">Doctor Available</th>
              <th className="py-2.5 text-center">Active Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-gray-300">
            {schedules.map((sched) => (
              <tr key={sched.id} className="hover:bg-white/[0.02]">
                <td className="py-3 font-semibold text-white">{sched.day_of_week}</td>
                <td className="py-3 font-medium text-gray-400">{sched.session}</td>
                <td className="py-3">
                  <input
                    type="time"
                    value={sched.start_time || '00:00:00'}
                    onChange={(e) => handleUpdateField(sched.id, 'start_time', e.target.value)}
                    className="bg-black/40 border border-white/10 rounded-lg px-2 py-1 text-xs text-white focus:outline-none"
                  />
                </td>
                <td className="py-3">
                  <input
                    type="time"
                    value={sched.end_time || '00:00:00'}
                    onChange={(e) => handleUpdateField(sched.id, 'end_time', e.target.value)}
                    className="bg-black/40 border border-white/10 rounded-lg px-2 py-1 text-xs text-white focus:outline-none"
                  />
                </td>
                <td className="py-3 text-center">
                  <input
                    type="checkbox"
                    checked={sched.doctor_available}
                    onChange={(e) => handleUpdateField(sched.id, 'doctor_available', e.target.checked)}
                    className="accent-violet-500 w-4 h-4 rounded cursor-pointer"
                  />
                </td>
                <td className="py-3 text-center">
                  <input
                    type="checkbox"
                    checked={sched.is_active}
                    onChange={(e) => handleUpdateField(sched.id, 'is_active', e.target.checked)}
                    className="accent-violet-500 w-4 h-4 rounded cursor-pointer"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end gap-2 pt-2 border-t border-white/5">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition-all flex items-center gap-1.5"
        >
          <Save className="w-3.5 h-3.5" />
          {saving ? 'Saving weekly schedule...' : 'Save Weekly Schedule'}
        </button>
      </div>
    </motion.div>
  );
}

/* ==========================================
   SUB-COMPONENT 3: FACILITIES MANAGER
   ========================================== */
interface FacilitiesProps extends React.Attributes {
  clinic: Clinic;
  onSave: () => void;
}
function ClinicFacilitiesManager({ clinic, onSave }: FacilitiesProps) {
  const { showToast } = useToast();
  const [catalog, setCatalog] = useState<Facility[]>([]);
  const [activeIds, setActiveIds] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([
      ClinicRepository.getFacilityCatalog(),
      ClinicRepository.getClinicFacilities(clinic.id)
    ]).then(([catList, activeList]) => {
      setCatalog(catList);
      
      const idMap: Record<string, boolean> = {};
      activeList.forEach((link) => {
        if (link.is_enabled) {
          idMap[link.facility_id] = true;
        }
      });
      setActiveIds(idMap);
      setLoading(false);
    });
  }, [clinic.id]);

  const handleToggle = (facilityId: string) => {
    setActiveIds((prev) => ({ ...prev, [facilityId]: !prev[facilityId] }));
  };

  const handleSave = async () => {
    setSaving(true);
    const ok = await ClinicService.saveClinicFacilities(clinic.id, activeIds);
    setSaving(false);
    if (ok) {
      showToast('Clinic facilities updated successfully!', 'success');
      onSave();
    } else {
      showToast('Failed to update facilities catalog links.', 'error');
    }
  };

  if (loading) return <div className="text-xs text-gray-500">Loading facilities catalog...</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5 max-w-2xl bg-white/5 border border-white/10 rounded-3xl p-6"
    >
      <h3 className="font-heading font-bold text-sm text-white flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-violet-400" />
        Configure Clinic Facilities Checklist
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {catalog.map((fac) => {
          const isChecked = !!activeIds[fac.id];
          return (
            <div
              key={fac.id}
              onClick={() => handleToggle(fac.id)}
              className={`p-3 rounded-2xl border cursor-pointer flex items-center justify-between transition-colors ${
                isChecked
                  ? 'bg-violet-600/10 border-violet-500/30 text-white shadow-sm'
                  : 'bg-white/5 border-white/5 hover:bg-white/10 text-gray-400'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${isChecked ? 'bg-violet-600 text-white' : 'bg-white/5 text-gray-500'}`}>
                  <CheckCircle className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold">{fac.name}</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">{fac.description || 'Facility amenity'}</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => {}} // Swallowed by container click handler
                className="accent-violet-500 cursor-pointer w-4 h-4 rounded"
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
          {saving ? 'Updating facilities...' : 'Save Facilities'}
        </button>
      </div>
    </motion.div>
  );
}

/* ==========================================
   SUB-COMPONENT 4: DOCTOR AVAILABILITY
   ========================================== */
interface AvailProps extends React.Attributes {
  clinic: Clinic;
}
function ClinicDoctorAvailability({ clinic }: AvailProps) {
  const { showToast } = useToast();
  const [list, setList] = useState<DoctorAvailability[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [form, setForm] = useState({
    doctor_id: '',
    date: '',
    session: 'Morning',
    availability_status: 'Leave',
    notes: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const loadAvailabilityLogs = async () => {
    setLoading(true);
    try {
      const [availLogs, docs] = await Promise.all([
        ClinicRepository.getDoctorAvailability(clinic.id),
        ClinicRepository.getDoctors()
      ]);
      setList(availLogs);
      setDoctors(docs);
      if (docs.length > 0) {
        setForm((prev) => ({ ...prev, doctor_id: docs[0].id }));
      }
    } catch (err) {
      logger.error('Error fetching availability logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAvailabilityLogs();
  }, [clinic.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.doctor_id || !form.date) {
      showToast('Doctor and Date are required.', 'warning');
      return;
    }
    setSubmitting(true);

    try {
      await ClinicRepository.saveDoctorAvailability({
        doctor_id: form.doctor_id,
        clinic_id: clinic.id,
        date: form.date,
        session: form.session,
        availability_status: form.availability_status,
        notes: form.notes || undefined
      });
      showToast('Doctor availability override saved successfully!', 'success');
      loadAvailabilityLogs();
      setForm((prev) => ({ ...prev, notes: '' }));
    } catch (err) {
      logger.error('Error saving availability override:', err);
      showToast('Failed to save doctor availability record.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this availability override?')) return;
    try {
      await ClinicRepository.deleteDoctorAvailability(id);
      showToast('Availability override deleted.', 'info');
      loadAvailabilityLogs();
    } catch (err) {
      logger.error('Error deleting availability:', err);
    }
  };

  if (loading) return <div className="text-xs text-gray-500">Checking availability rules...</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl"
    >
      {/* List Availability rules */}
      <div className="bg-white/5 border border-white/10 rounded-3xl p-5 space-y-4 h-fit">
        <h3 className="font-heading font-bold text-sm text-white flex items-center gap-2">
          <Activity className="w-4 h-4 text-violet-400 animate-pulse" />
          Doctor Outage & Availability Overrides
        </h3>

        {list.length === 0 ? (
          <div className="text-xs text-gray-500 p-4 border border-dashed border-white/10 rounded-2xl text-center">
            No availability overrides registered. Doctor rotates according to standard schedule.
          </div>
        ) : (
          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {list.map((item) => {
              const doc = doctors.find((d) => d.id === item.doctor_id);
              return (
                <div
                  key={item.id}
                  className="bg-white/5 border border-white/5 hover:border-white/10 rounded-2xl p-3 flex items-center justify-between text-xs transition-colors"
                >
                  <div className="space-y-1">
                    <p className="font-semibold text-white">{doc?.name || 'Doctor'}</p>
                    <p className="text-[10px] text-gray-400">
                      Date: {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}{' '}
                      • Session: {item.session}
                    </p>
                    <p className="text-[10px] font-bold text-rose-400">
                      Status: {item.availability_status}
                    </p>
                    {item.notes && <p className="text-[10px] text-gray-500 italic">Notes: {item.notes}</p>}
                  </div>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 rounded-lg border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-400"
                    title="Remove availability override"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add availability form */}
      <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-3xl p-5 space-y-4 h-fit">
        <h3 className="font-heading font-bold text-sm text-white">Log Outage / Availability Override</h3>

        <div>
          <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">Select Doctor</label>
          <select
            value={form.doctor_id}
            onChange={(e) => setForm({ ...form, doctor_id: e.target.value })}
            className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none"
            style={{ colorScheme: 'dark' }}
          >
            {doctors.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} ({d.designation || d.qualification || ''})
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">Date</label>
            <input
              type="date"
              required
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
              style={{ colorScheme: 'dark' }}
            />
          </div>

          <div>
            <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">Session Slot</label>
            <select
              value={form.session}
              onChange={(e) => setForm({ ...form, session: e.target.value })}
              className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none"
              style={{ colorScheme: 'dark' }}
            >
              <option value="Morning">Morning</option>
              <option value="Evening">Evening</option>
              <option value="All Day">All Day</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">Availability Status</label>
          <select
            value={form.availability_status}
            onChange={(e) => setForm({ ...form, availability_status: e.target.value })}
            className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none"
            style={{ colorScheme: 'dark' }}
          >
            <option value="Leave">On Leave / Leave</option>
            <option value="Holiday">Weekly Off / Holiday</option>
            <option value="Training">Training Program</option>
            <option value="Conference">Medical Conference</option>
            <option value="Emergency">Emergency</option>
            <option value="Available">Available (Override Open)</option>
          </select>
        </div>

        <div>
          <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">Outage Notes</label>
          <input
            type="text"
            placeholder="e.g. Attending annual endodontic summit"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          {submitting ? 'Registering Override...' : 'Add Outage Block'}
        </button>
      </form>
    </motion.div>
  );
}

/* ==========================================
   SUB-COMPONENT 5: HOLIDAYS REGISTRY
   ========================================== */
interface HolidaysProps extends React.Attributes {
  clinic: Clinic;
}
function ClinicHolidaysList({ clinic }: HolidaysProps) {
  const { showToast } = useToast();
  const [list, setList] = useState<ClinicHoliday[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [form, setForm] = useState({
    holiday_date: '',
    reason: '',
    closed_flag: true,
    notes: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const loadHolidays = async () => {
    setLoading(true);
    try {
      const data = await ClinicRepository.getHolidays(clinic.id);
      setList(data);
    } catch (err) {
      logger.error('Error fetching holidays list:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHolidays();
  }, [clinic.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.holiday_date || !form.reason) return;
    setSubmitting(true);

    try {
      await ClinicRepository.insertHoliday({
        clinic_id: clinic.id,
        holiday_date: form.holiday_date,
        reason: form.reason,
        closed_flag: form.closed_flag,
        notes: form.notes || undefined
      });
      showToast('Holiday registered successfully!', 'success');
      loadHolidays();
      setForm({ holiday_date: '', reason: '', closed_flag: true, notes: '' });
    } catch (err) {
      logger.error('Error adding clinic holiday:', err);
      showToast('Error registering holiday.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this holiday?')) return;
    try {
      await ClinicRepository.deleteHoliday(id);
      showToast('Holiday record deleted.', 'info');
      loadHolidays();
    } catch (err) {
      logger.error('Error deleting holiday:', err);
    }
  };

  if (loading) return <div className="text-xs text-gray-500">Checking holiday list...</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl"
    >
      {/* Holidays List */}
      <div className="bg-white/5 border border-white/10 rounded-3xl p-5 space-y-4 h-fit">
        <h3 className="font-heading font-bold text-sm text-white flex items-center gap-2">
          <Calendar className="w-4 h-4 text-violet-400" />
          Upcoming Holidays & Custom Closures
        </h3>

        {list.length === 0 ? (
          <div className="text-xs text-gray-500 p-4 border border-dashed border-white/10 rounded-2xl text-center">
            No holidays registered. Clinic is open according to standard schedule.
          </div>
        ) : (
          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {list.map((item) => (
              <div
                key={item.id}
                className="bg-white/5 border border-white/5 hover:border-white/10 rounded-2xl p-3 flex items-center justify-between text-xs transition-colors"
              >
                <div className="space-y-1">
                  <p className="font-semibold text-white">{item.reason}</p>
                  <p className="text-[10px] text-gray-400">
                    Date: {new Date(item.holiday_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>
                  {item.notes && <p className="text-[10px] text-gray-500 italic">Notes: {item.notes}</p>}
                </div>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 rounded-lg border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-400"
                  title="Remove Holiday"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Holiday Form */}
      <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-3xl p-5 space-y-4 h-fit">
        <h3 className="font-heading font-bold text-sm text-white">Add Clinic Holiday</h3>

        <div>
          <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">Holiday Date</label>
          <input
            type="date"
            required
            value={form.holiday_date}
            onChange={(e) => setForm({ ...form, holiday_date: e.target.value })}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
            style={{ colorScheme: 'dark' }}
          />
        </div>

        <div>
          <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">Reason / Festival Name</label>
          <input
            type="text"
            required
            placeholder="e.g. Independence Day, Durga Puja"
            value={form.reason}
            onChange={(e) => setForm({ ...form, reason: e.target.value })}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">Holidays Notes</label>
          <input
            type="text"
            placeholder="e.g. All outpatient departments closed"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          {submitting ? 'Registering...' : 'Add Holiday'}
        </button>
      </form>
    </motion.div>
  );
}

/* ==========================================
   SUB-COMPONENT 6: EMERGENCY CLOSURES
   ========================================== */
interface ClosureProps extends React.Attributes {
  clinic: Clinic;
}
function ClinicClosuresLog({ clinic }: ClosureProps) {
  const { showToast } = useToast();
  const [list, setList] = useState<ClinicClosure[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [form, setForm] = useState({
    closure_date: '',
    reason_category: 'Power Failure',
    details: '',
    closed_flag: true
  });
  const [submitting, setSubmitting] = useState(false);

  const loadClosures = async () => {
    setLoading(true);
    try {
      const data = await ClinicRepository.getClosures(clinic.id);
      setList(data);
    } catch (err) {
      logger.error('Error fetching closures list:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClosures();
  }, [clinic.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.closure_date || !form.reason_category) return;
    setSubmitting(true);

    try {
      await ClinicRepository.insertClosure({
        clinic_id: clinic.id,
        closure_date: form.closure_date,
        reason_category: form.reason_category,
        details: form.details,
        closed_flag: form.closed_flag
      });
      showToast('Temporary closure registered successfully!', 'success');
      loadClosures();
      setForm({ closure_date: '', reason_category: 'Power Failure', details: '', closed_flag: true });
    } catch (err) {
      logger.error('Error adding closure:', err);
      showToast('Error registering closure.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this closure?')) return;
    try {
      await ClinicRepository.deleteClosure(id);
      showToast('Closure log deleted.', 'info');
      loadClosures();
    } catch (err) {
      logger.error('Error deleting closure:', err);
    }
  };

  if (loading) return <div className="text-xs text-gray-500">Checking closures log...</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl"
    >
      {/* Closures list */}
      <div className="bg-white/5 border border-white/10 rounded-3xl p-5 space-y-4 h-fit">
        <h3 className="font-heading font-bold text-sm text-white flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-violet-400" />
          Emergency & Temporary Outage Closures
        </h3>

        {list.length === 0 ? (
          <div className="text-xs text-gray-500 p-4 border border-dashed border-white/10 rounded-2xl text-center">
            No emergency closures logged. Clinic is active.
          </div>
        ) : (
          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {list.map((item) => (
              <div
                key={item.id}
                className="bg-white/5 border border-white/5 hover:border-white/10 rounded-2xl p-3 flex items-center justify-between text-xs transition-colors"
              >
                <div className="space-y-1">
                  <p className="font-semibold text-white">{item.reason_category}</p>
                  <p className="text-[10px] text-gray-400">
                    Date: {new Date(item.closure_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>
                  {item.details && <p className="text-[10px] text-gray-500">Detail: {item.details}</p>}
                </div>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 rounded-lg border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-400"
                  title="Remove Log"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Closure form */}
      <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-3xl p-5 space-y-4 h-fit">
        <h3 className="font-heading font-bold text-sm text-white">Log Emergency Outage Closure</h3>

        <div>
          <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">Closure Date</label>
          <input
            type="date"
            required
            value={form.closure_date}
            onChange={(e) => setForm({ ...form, closure_date: e.target.value })}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
            style={{ colorScheme: 'dark' }}
          />
        </div>

        <div>
          <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">Outage Category</label>
          <select
            value={form.reason_category}
            onChange={(e) => setForm({ ...form, reason_category: e.target.value })}
            className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none"
            style={{ colorScheme: 'dark' }}
          >
            <option value="Power Failure">Power Failure</option>
            <option value="Doctor Leave">Doctor Leave</option>
            <option value="Emergency">Emergency</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">Closure Details</label>
          <input
            type="text"
            placeholder="e.g. Scheduled CESC grid maintenance"
            value={form.details}
            onChange={(e) => setForm({ ...form, details: e.target.value })}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          {submitting ? 'Registering closure...' : 'Submit Closure Log'}
        </button>
      </form>
    </motion.div>
  );
}

/* ==========================================
   SUB-COMPONENT 7: CLINIC NOTICES MANAGER
   ========================================== */
interface NoticesProps extends React.Attributes {
  clinic: Clinic;
}
function ClinicNoticesManager({ clinic }: NoticesProps) {
  const { showToast } = useToast();
  const [list, setList] = useState<ClinicNotice[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: 'normal',
    start_date: '',
    end_date: '',
    is_active: true
  });
  const [submitting, setSubmitting] = useState(false);

  const loadNotices = async () => {
    setLoading(true);
    try {
      const data = await ClinicRepository.getNotices(clinic.id);
      setList(data);
    } catch (err) {
      logger.error('Error fetching notices list:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotices();
  }, [clinic.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.start_date || !form.end_date) return;
    setSubmitting(true);

    try {
      await ClinicRepository.insertNotice({
        clinic_id: clinic.id,
        title: form.title,
        description: form.description,
        priority: form.priority,
        start_date: form.start_date,
        end_date: form.end_date,
        is_active: form.is_active
      });
      showToast('Notice created successfully!', 'success');
      loadNotices();
      setForm({ title: '', description: '', priority: 'normal', start_date: '', end_date: '', is_active: true });
    } catch (err) {
      logger.error('Error adding notice:', err);
      showToast('Error registering notice.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this notice?')) return;
    try {
      await ClinicRepository.deleteNotice(id);
      showToast('Notice deleted.', 'info');
      loadNotices();
    } catch (err) {
      logger.error('Error deleting notice:', err);
    }
  };

  if (loading) return <div className="text-xs text-gray-500">Checking notices board...</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl"
    >
      {/* Notices list */}
      <div className="bg-white/5 border border-white/10 rounded-3xl p-5 space-y-4 h-fit">
        <h3 className="font-heading font-bold text-sm text-white flex items-center gap-2">
          <Bell className="w-4 h-4 text-violet-400" />
          Active Clinic Notices Board
        </h3>

        {list.length === 0 ? (
          <div className="text-xs text-gray-500 p-4 border border-dashed border-white/10 rounded-2xl text-center">
            No notices registered.
          </div>
        ) : (
          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {list.map((item) => (
              <div
                key={item.id}
                className="bg-white/5 border border-white/5 hover:border-white/10 rounded-2xl p-3 flex items-center justify-between text-xs transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-white">{item.title}</p>
                    <span className={`text-[8px] font-extrabold uppercase px-1 rounded ${
                      item.priority === 'critical'
                        ? 'bg-red-500/20 text-red-400'
                        : item.priority === 'high'
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'bg-white/10 text-gray-400'
                    }`}>
                      {item.priority}
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-400">{item.description}</p>
                  <p className="text-[9px] text-gray-500 font-mono">
                    Validity: {item.start_date} to {item.end_date}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 rounded-lg border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-400 shrink-0"
                  title="Remove Notice"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Notice form */}
      <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-3xl p-5 space-y-4 h-fit">
        <h3 className="font-heading font-bold text-sm text-white">Create Notice Announcement</h3>

        <div>
          <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">Notice Title</label>
          <input
            type="text"
            required
            placeholder="e.g. Temporary power maintenance scheduled"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">Description</label>
          <textarea
            rows={2}
            placeholder="Enter notice description..."
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full bg-black/40 border border-white/10 focus:border-violet-500/50 rounded-xl p-3 text-xs text-white focus:outline-none resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">Start Date</label>
            <input
              type="date"
              required
              value={form.start_date}
              onChange={(e) => setForm({ ...form, start_date: e.target.value })}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
              style={{ colorScheme: 'dark' }}
            />
          </div>

          <div>
            <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">End Date</label>
            <input
              type="date"
              required
              value={form.end_date}
              onChange={(e) => setForm({ ...form, end_date: e.target.value })}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
              style={{ colorScheme: 'dark' }}
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">Priority Level</label>
          <select
            value={form.priority}
            onChange={(e) => setForm({ ...form, priority: e.target.value })}
            className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none"
            style={{ colorScheme: 'dark' }}
          >
            <option value="low">Low Priority</option>
            <option value="normal">Normal Priority</option>
            <option value="high">High Priority</option>
            <option value="critical">Critical Warning</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          {submitting ? 'Registering notice...' : 'Add Notice'}
        </button>
      </form>
    </motion.div>
  );
}
