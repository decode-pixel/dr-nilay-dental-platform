import React, { useState, useEffect } from 'react';
import {
  supabase,
  getDashboardPatients,
  getPatientBookingHistory,
  updatePatientProfile,
} from '../../lib/supabase';
import {
  Search,
  Filter,
  User,
  Phone,
  Mail,
  Calendar,
  MapPin,
  Tag,
  FileText,
  Clock,
  History,
  ArrowLeft,
  Settings,
  Plus,
  X,
  ShieldAlert,
  FolderOpen,
  Merge,
  Sparkles,
  CheckCircle,
  Clock3,
  AlertCircle,
  FileCode,
  RefreshCw,
  TrendingUp,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DashboardPatientsProps {
  selectedPatientId?: string | null;
  onClearNavigation?: () => void;
}

const POPULAR_TAGS = ['VIP', 'Frequent', 'Ortho', 'Special Care', 'Sensitive Teeth', 'Surgical'];

const GENDER_COLORS: Record<string, string> = {
  Male: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  Female: 'text-pink-400 bg-pink-500/10 border-pink-500/20',
  Other: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
};

export default function DashboardPatients({
  selectedPatientId,
  onClearNavigation,
}: DashboardPatientsProps) {
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [genderFilter, setGenderFilter] = useState('All');
  const [tagFilter, setTagFilter] = useState('All');

  // Selected Patient state
  const [selectedPatient, setSelectedPatient] = useState<any | null>(null);
  const [patientHistory, setPatientHistory] = useState<any[]>([]);
  const [loadingProfileData, setLoadingProfileData] = useState(false);

  // Editor states
  const [notesText, setNotesText] = useState('');
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Custom Tag input
  const [customTag, setCustomTag] = useState('');

  // Modals state
  const [showMergeModal, setShowMergeModal] = useState(false);
  const [mergeTargetId, setMergeTargetId] = useState('');
  const [isMerging, setIsMerging] = useState(false);
  const [mergeSuccess, setMergeSuccess] = useState(false);

  // Active Profile Tab
  const [activeTab, setActiveTab] = useState<'timeline' | 'appointments' | 'attachments'>('timeline');

  // Load all patients on mount
  const loadPatientsData = async (targetId?: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getDashboardPatients();
      if (res.error) {
        setError(res.error.message);
      } else if (res.data) {
        setPatients(res.data);
        
        // Auto-select patient if navigating from elsewhere
        const idToSelect = targetId || selectedPatientId;
        if (idToSelect) {
          const matched = res.data.find((p) => p.id === idToSelect);
          if (matched) {
            handleSelectPatient(matched);
          }
        } else if (res.data.length > 0 && !selectedPatient) {
          handleSelectPatient(res.data[0]);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load patients.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPatientsData();
  }, [selectedPatientId]);

  // Handle patient selection
  const handleSelectPatient = async (patient: any) => {
    setSelectedPatient(patient);
    setNotesText(patient.coordinator_notes || '');
    setLoadingProfileData(true);
    setPatientHistory([]);
    setSaveSuccess(false);
    setActionError(null);

    try {
      const historyRes = await getPatientBookingHistory(patient.id);
      if (historyRes.data) {
        setPatientHistory(historyRes.data);
      }
    } catch (err) {
      console.error('Failed to load patient history:', err);
    } finally {
      setLoadingProfileData(false);
    }
  };

  // Save coordinator notes
  const handleSaveNotes = async () => {
    if (!selectedPatient) return;
    setIsSavingNotes(true);
    setSaveSuccess(false);
    try {
      const res = await updatePatientProfile(selectedPatient.id, {
        coordinator_notes: notesText,
      });

      if (res.error) {
        console.error(res.error);
      } else {
        setSaveSuccess(true);
        // Update local state record
        selectedPatient.coordinator_notes = notesText;
        setPatients((prev) =>
          prev.map((p) => (p.id === selectedPatient.id ? { ...p, coordinator_notes: notesText } : p))
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSavingNotes(false);
    }
  };

  // Add tag to patient
  const handleAddTag = async (tag: string) => {
    if (!selectedPatient) return;
    const cleanTag = tag.trim();
    if (!cleanTag) return;
    if (selectedPatient.tags?.includes(cleanTag)) return;

    const newTags = [...(selectedPatient.tags || []), cleanTag];
    try {
      const res = await updatePatientProfile(selectedPatient.id, { tags: newTags });
      if (!res.error) {
        setSelectedPatient((prev: any) => ({ ...prev, tags: newTags }));
        setPatients((prev) =>
          prev.map((p) => (p.id === selectedPatient.id ? { ...p, tags: newTags } : p))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Remove tag from patient
  const handleRemoveTag = async (tag: string) => {
    if (!selectedPatient) return;
    const newTags = (selectedPatient.tags || []).filter((t: string) => t !== tag);
    try {
      const res = await updatePatientProfile(selectedPatient.id, { tags: newTags });
      if (!res.error) {
        setSelectedPatient((prev: any) => ({ ...prev, tags: newTags }));
        setPatients((prev) =>
          prev.map((p) => (p.id === selectedPatient.id ? { ...p, tags: newTags } : p))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCustomTagSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAddTag(customTag);
    setCustomTag('');
  };

  // Mock duplicate patient merge submission
  const handleMergeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mergeTargetId) return;
    setIsMerging(true);

    setTimeout(() => {
      setIsMerging(false);
      setMergeSuccess(true);
      setTimeout(() => {
        setShowMergeModal(false);
        setMergeSuccess(false);
        setMergeTargetId('');
        // Reload patients list and update select
        loadPatientsData(selectedPatient.id);
      }, 1500);
    }, 1200);
  };

  const [actionError, setActionError] = useState<string | null>(null);

  // Compute stat aggregates
  const totalVisits = patientHistory.length;
  const completedVisits = patientHistory.filter((b) => b.status === 'completed').length;
  const cancelledVisits = patientHistory.filter((b) => b.status === 'cancelled').length;

  // Filtered patients list
  const filteredPatients = patients.filter((patient) => {
    const name = patient.full_name || '';
    const phone = patient.phone || '';
    const email = patient.email || '';
    const tags = patient.tags || [];
    
    const matchSearch =
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tags.some((t: string) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchGender = genderFilter === 'All' || patient.gender === genderFilter;
    const matchTag = tagFilter === 'All' || tags.includes(tagFilter);

    return matchSearch && matchGender && matchTag;
  });

  // Compile timeline data chronologically
  const timelineEvents = React.useMemo(() => {
    if (!selectedPatient) return [];
    
    const events: Array<{
      id: string;
      title: string;
      type: 'registration' | 'booking_created' | 'status_change';
      date: string;
      details: string;
      icon: any;
      color: string;
    }> = [];

    // Registration event
    events.push({
      id: 'reg-' + selectedPatient.id,
      title: 'Patient Account Created',
      type: 'registration',
      date: selectedPatient.created_at,
      details: 'Patient registry initialized via web portal signup.',
      icon: User,
      color: 'text-violet-400 border-violet-500/30 bg-violet-500/10',
    });

    // Booking creation and changes
    patientHistory.forEach((booking) => {
      const formattedDate = new Date(booking.preferred_date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
      events.push({
        id: 'book-' + booking.id,
        title: `Appointment Request (${booking.reference_code})`,
        type: 'booking_created',
        date: booking.created_at,
        details: `Requested ${booking.service?.name || booking.service_name_fallback} at ${booking.clinic?.name.split('—')[1] || booking.clinic?.name || 'Clinic'} for preferred date ${formattedDate} (${booking.appointment_slot} Session).`,
        icon: FileText,
        color: 'text-blue-400 border-blue-500/30 bg-blue-500/10',
      });

      if (booking.status !== 'new_request') {
        events.push({
          id: 'status-' + booking.id,
          title: `Appointment Status updated: ${booking.status.replace('_', ' ').toUpperCase()}`,
          type: 'status_change',
          date: booking.updated_at || booking.created_at,
          details: `Appointment reference ${booking.reference_code} moved to state "${booking.status}". notes: ${booking.assistant_notes || 'None'}`,
          icon: Clock,
          color: booking.status === 'completed'
            ? 'text-green-400 border-green-500/30 bg-green-500/10'
            : booking.status === 'cancelled'
            ? 'text-red-400 border-red-500/30 bg-red-500/10'
            : 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10',
        });
      }
    });

    // Sort newest first
    return events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [selectedPatient, patientHistory]);

  return (
    <div className="flex-1 flex flex-col md:flex-row h-[calc(100vh-80px)] overflow-hidden relative">
      {/* 1. Left Column: Patient Selector List */}
      <div className={`w-full md:w-80 border-r border-white/10 flex flex-col bg-[#050614]/40 backdrop-blur-md shrink-0 h-full ${
        selectedPatient && 'hidden md:flex'
      }`}>
        {/* List Search & Filters */}
        <div className="p-4 border-b border-white/10 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search patients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 focus:border-violet-500/50 rounded-2xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none placeholder-gray-500 transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
              className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-[11px] text-white focus:outline-none appearance-none cursor-pointer"
              style={{ colorScheme: 'dark' }}
            >
              <option value="All">All Genders</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>

            <select
              value={tagFilter}
              onChange={(e) => setTagFilter(e.target.value)}
              className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-[11px] text-white focus:outline-none appearance-none cursor-pointer"
              style={{ colorScheme: 'dark' }}
            >
              <option value="All">All Tags</option>
              {POPULAR_TAGS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Patient Selection ledger */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <RefreshCw className="w-6 h-6 animate-spin text-violet-400 mb-2" />
              <span className="text-xs">Loading patient registry...</span>
            </div>
          ) : filteredPatients.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              <User className="w-8 h-8 text-gray-600 mx-auto mb-2" />
              <p className="text-xs font-semibold">No patients found</p>
            </div>
          ) : (
            filteredPatients.map((patient) => {
              const isSelected = selectedPatient?.id === patient.id;
              return (
                <div
                  key={patient.id}
                  onClick={() => handleSelectPatient(patient)}
                  className={`group rounded-2xl p-4 cursor-pointer border transition-all ${
                    isSelected
                      ? 'bg-gradient-to-br from-violet-600/15 to-blue-600/15 border-violet-400/50 shadow-md'
                      : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <h5 className="font-heading font-bold text-sm text-white group-hover:text-violet-200 transition-colors truncate">
                      {patient.full_name}
                    </h5>
                    {patient.gender && (
                      <span className="text-[9px] uppercase tracking-wide px-1.5 py-0.5 rounded border bg-white/5 border-white/10 text-gray-400 shrink-0">
                        {patient.gender}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{patient.phone}</p>
                  
                  {/* Small tag pills in list */}
                  {patient.tags && patient.tags.length > 0 && (
                    <div className="flex items-center gap-1 mt-2.5 flex-wrap">
                      {patient.tags.slice(0, 2).map((t: string) => (
                        <span
                          key={t}
                          className="text-[9px] px-1.5 py-0.5 rounded bg-violet-500/15 text-violet-300 border border-violet-500/20"
                        >
                          {t}
                        </span>
                      ))}
                      {patient.tags.length > 2 && (
                        <span className="text-[9px] text-gray-500 font-semibold">
                          +{patient.tags.length - 2} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 2. Right Column: Patient Profile Details Panel */}
      <div className={`flex-1 flex flex-col h-full bg-white/[0.01] ${
        !selectedPatient && 'hidden md:flex'
      }`}>
        <AnimatePresence mode="wait">
          {selectedPatient ? (
            <motion.div
              key={selectedPatient.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              className="flex-1 flex flex-col h-full overflow-hidden"
            >
              {/* Profile Header bar */}
              <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between gap-4 bg-white/[0.01] shrink-0">
                <div className="flex items-center gap-3">
                  {/* Mobile Back button */}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPatient(null);
                      if (onClearNavigation) onClearNavigation();
                    }}
                    className="md:hidden p-2 rounded-xl border border-white/10 bg-white/5 text-gray-300"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>

                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 text-white flex items-center justify-center border border-white/10 shadow-md">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-heading font-bold text-lg text-white">
                        {selectedPatient.full_name}
                      </h3>
                      {selectedPatient.tags?.map((t: string) => (
                        <span
                          key={t}
                          className="inline-flex items-center gap-0.5 text-[9px] font-semibold bg-violet-500/10 text-violet-300 border border-violet-500/20 px-2 py-0.5 rounded-full"
                        >
                          {t}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(t)}
                            className="hover:text-red-400 ml-0.5 shrink-0"
                          >
                            <X className="w-2.5 h-2.5" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <p className="text-[10px] text-gray-500">
                      Patient record ID: {selectedPatient.id}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowMergeModal(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-gray-200 text-xs font-semibold transition-colors"
                  >
                    <Merge className="w-3.5 h-3.5 text-violet-400" />
                    Merge Record
                  </button>
                </div>
              </div>

              {/* Profile Body (Scrollable area) */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                
                {/* Statistics Row */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white/5 border border-white/5 rounded-2xl p-3 text-center">
                    <span className="text-[10px] text-gray-500 uppercase font-semibold">Total Bookings</span>
                    <p className="text-xl font-bold text-white mt-0.5">{totalVisits}</p>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/10 rounded-2xl p-3 text-center">
                    <span className="text-[10px] text-green-500 uppercase font-semibold">Completed</span>
                    <p className="text-xl font-bold text-green-400 mt-0.5">{completedVisits}</p>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/10 rounded-2xl p-3 text-center">
                    <span className="text-[10px] text-red-500 uppercase font-semibold">Cancelled</span>
                    <p className="text-xl font-bold text-red-400 mt-0.5">{cancelledVisits}</p>
                  </div>
                </div>

                {/* Demographics details card */}
                <div className="bg-white/5 border border-white/10 rounded-3xl p-5 space-y-4">
                  <h4 className="font-heading font-bold text-sm text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-violet-400" />
                    Patient Demographics
                  </h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-gray-300">
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-violet-400 shrink-0" />
                      <div>
                        <span className="text-[9px] text-gray-500 uppercase block">Phone</span>
                        <a href={`tel:${selectedPatient.phone}`} className="hover:underline font-medium text-white">{selectedPatient.phone}</a>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-violet-400 shrink-0" />
                      <div>
                        <span className="text-[9px] text-gray-500 uppercase block">Email Address</span>
                        <span className="font-medium text-white">{selectedPatient.email || 'No email provided'}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-violet-400 shrink-0" />
                      <div>
                        <span className="text-[9px] text-gray-500 uppercase block">Date of Birth</span>
                        <span className="font-medium text-white">
                          {selectedPatient.date_of_birth
                            ? new Date(selectedPatient.date_of_birth).toLocaleDateString('en-US', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric',
                              })
                            : 'Not entered'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <User className="w-4 h-4 text-violet-400 shrink-0" />
                      <div>
                        <span className="text-[9px] text-gray-500 uppercase block">Gender Category</span>
                        <span className="font-medium text-white">{selectedPatient.gender || 'Not entered'}</span>
                      </div>
                    </div>
                  </div>

                  {selectedPatient.address && (
                    <div className="border-t border-white/5 pt-3.5 flex items-start gap-3 text-xs">
                      <MapPin className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[9px] text-gray-500 uppercase block">Residential Address</span>
                        <p className="text-gray-300 mt-0.5">{selectedPatient.address}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Coordinator Notes Editor Section */}
                <div className="bg-white/5 border border-white/10 rounded-3xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-heading font-bold text-sm text-white flex items-center gap-2">
                      <FileText className="w-4 h-4 text-violet-400" />
                      Clinical & Coordinator Notes
                    </h4>
                    {saveSuccess && (
                      <span className="text-[10px] text-green-400 font-semibold flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" />
                        Notes saved!
                      </span>
                    )}
                  </div>

                  <textarea
                    rows={3}
                    placeholder="Enter coordinator logs, appointment preferences, scheduling alerts, or clinical indicators regarding patient..."
                    value={notesText}
                    onChange={(e) => setNotesText(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 focus:border-violet-500/50 rounded-2xl p-3 text-xs text-white placeholder-gray-500 focus:outline-none resize-none transition-colors"
                  />

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1 border-t border-white/5">
                    {/* Add Quick Tag list */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] text-gray-500 font-semibold">Quick Tags:</span>
                      {POPULAR_TAGS.map((tag) => {
                        const hasTag = selectedPatient.tags?.includes(tag);
                        return (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => (hasTag ? handleRemoveTag(tag) : handleAddTag(tag))}
                            className={`px-2 py-0.5 rounded text-[10px] font-medium border transition-colors ${
                              hasTag
                                ? 'bg-violet-600/20 text-violet-300 border-violet-500/30'
                                : 'bg-white/5 text-gray-400 border-white/10 hover:text-white'
                            }`}
                          >
                            {tag}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      type="button"
                      onClick={handleSaveNotes}
                      disabled={isSavingNotes}
                      className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold transition-colors shrink-0"
                    >
                      {isSavingNotes ? 'Saving...' : 'Save Notes'}
                    </button>
                  </div>

                  {/* Custom tag input form */}
                  <form onSubmit={handleCustomTagSubmit} className="flex items-center gap-2 pt-2 border-t border-white/5">
                    <input
                      type="text"
                      placeholder="Add custom tag..."
                      value={customTag}
                      onChange={(e) => setCustomTag(e.target.value)}
                      className="bg-black/40 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none placeholder-gray-500 flex-1"
                    />
                    <button
                      type="submit"
                      className="p-1.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </form>
                </div>

                {/* Tabs Selector for Drawer-like details */}
                <div className="border-b border-white/10 flex items-center gap-6 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setActiveTab('timeline')}
                    className={`pb-3 border-b-2 transition-colors ${
                      activeTab === 'timeline'
                        ? 'border-violet-500 text-white'
                        : 'border-transparent text-gray-400 hover:text-white'
                    }`}
                  >
                    Journey Timeline
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('appointments')}
                    className={`pb-3 border-b-2 transition-colors ${
                      activeTab === 'appointments'
                        ? 'border-violet-500 text-white'
                        : 'border-transparent text-gray-400 hover:text-white'
                    }`}
                  >
                    Appointments List ({patientHistory.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('attachments')}
                    className={`pb-3 border-b-2 transition-colors ${
                      activeTab === 'attachments'
                        ? 'border-violet-500 text-white'
                        : 'border-transparent text-gray-400 hover:text-white'
                    }`}
                  >
                    Attachments (Mock)
                  </button>
                </div>

                {/* Active Tab Panel */}
                <div className="min-h-40">
                  {/* JOURNEY TIMELINE TAB */}
                  {activeTab === 'timeline' && (
                    <div className="space-y-4">
                      {loadingProfileData ? (
                        <div className="flex items-center justify-center py-8 text-xs text-gray-500">
                          <RefreshCw className="w-4 h-4 animate-spin text-violet-400 mr-2" />
                          <span>Compiling patient history timeline...</span>
                        </div>
                      ) : timelineEvents.length === 0 ? (
                        <div className="text-center py-6 text-xs text-gray-500 bg-white/[0.02] border border-white/5 rounded-2xl p-4">
                          No events recorded for this patient.
                        </div>
                      ) : (
                        <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/10">
                          {timelineEvents.map((ev) => {
                            const Icon = ev.icon;
                            return (
                              <div key={ev.id} className="relative text-xs space-y-1">
                                <span className={`absolute -left-[22px] top-1.5 w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${ev.color}`}>
                                  <Icon className="w-3 h-3" />
                                </span>
                                <div className="flex items-center justify-between text-[10px] text-gray-500">
                                  <span>
                                    {new Date(ev.date).toLocaleString('en-US', {
                                      month: 'short',
                                      day: 'numeric',
                                      year: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })}
                                  </span>
                                </div>
                                <h5 className="font-bold text-white text-sm">{ev.title}</h5>
                                <p className="text-gray-300 leading-relaxed">{ev.details}</p>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}

                  {/* APPOINTMENT LIST TAB */}
                  {activeTab === 'appointments' && (
                    <div className="space-y-3">
                      {loadingProfileData ? (
                        <div className="flex items-center justify-center py-8 text-xs text-gray-500">
                          <RefreshCw className="w-4 h-4 animate-spin text-violet-400 mr-2" />
                          <span>Fetching appointments ledger...</span>
                        </div>
                      ) : patientHistory.length === 0 ? (
                        <div className="text-center py-6 text-xs text-gray-500 bg-white/[0.02] border border-white/5 rounded-2xl p-4">
                          No appointments scheduled.
                        </div>
                      ) : (
                        patientHistory.map((hist) => (
                          <div
                            key={hist.id}
                            className="bg-white/5 border border-white/5 hover:border-white/10 rounded-2xl p-4 flex items-center justify-between gap-4 text-xs transition-colors"
                          >
                            <div className="space-y-1">
                              <h5 className="font-bold text-white">
                                {hist.service?.name || hist.service_name_fallback || 'Dental Procedure'}
                              </h5>
                              <p className="text-gray-400">
                                {new Date(hist.preferred_date).toLocaleDateString('en-US', {
                                  weekday: 'short',
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                })}
                              </p>
                              <div className="flex items-center gap-3 text-[10px] text-gray-500">
                                <span>{hist.clinic?.name.split('—')[1] || hist.clinic?.name}</span>
                                <span>•</span>
                                <span>{hist.appointment_slot} Session</span>
                                {hist.appointment_serial && (
                                  <>
                                    <span>•</span>
                                    <span>Serial #{hist.appointment_serial}</span>
                                  </>
                                )}
                              </div>
                            </div>

                            <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-white/10 text-gray-300 border border-white/5">
                              {hist.status}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {/* ATTACHMENTS PLACEHOLDER TAB */}
                  {activeTab === 'attachments' && (
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 text-center space-y-4">
                      <FolderOpen className="w-12 h-12 text-violet-400/50 mx-auto" />
                      <div>
                        <h5 className="text-white font-bold text-sm">Patient Clinical Attachments</h5>
                        <p className="text-xs text-gray-400 mt-1.5 max-w-xs mx-auto leading-relaxed">
                          prescriptions, clinical record sheets, dental scans and digitised digital X-Rays (RVG) uploads will be supported in Sprint 4.0.
                        </p>
                      </div>
                      <div className="pt-2">
                        <button
                          type="button"
                          disabled
                          className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-gray-500 text-xs font-semibold cursor-not-allowed opacity-50 flex items-center gap-1.5 mx-auto"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Upload Scan (Sprint 4.0)
                        </button>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </motion.div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-500 p-8 text-center bg-white/[0.01]">
              <User className="w-16 h-16 text-gray-700 mb-4" />
              <h4 className="text-base font-bold text-white">Select a Patient</h4>
              <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
                Choose a patient profile from the list to view demographics, tags, journals, and status histories.
              </p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* 3. Duplicate Merge Dialog Overlay */}
      <AnimatePresence>
        {showMergeModal && selectedPatient && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMergeModal(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative z-10 w-full max-w-lg bg-[#050614] text-white rounded-3xl p-6 sm:p-8 border border-white/15 shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                <div>
                  <h3 className="font-heading font-extrabold text-xl text-white">
                    Merge Duplicate Record
                  </h3>
                  <p className="text-xs text-gray-400">
                    Consolidate bookings & histories under a single identity
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowMergeModal(false)}
                  className="p-2 text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {mergeSuccess ? (
                <div className="text-center py-8 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto shadow-lg">
                    <CheckCircle className="w-8 h-8 text-green-400" />
                  </div>
                  <h4 className="font-heading font-bold text-lg text-white">
                    Profiles Merged Successfully!
                  </h4>
                  <p className="text-xs text-gray-400 max-w-xs mx-auto">
                    Duplicate records consolidated. All logs have been assigned to the parent profile.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleMergeSubmit} className="space-y-5">
                  <div className="bg-violet-600/10 border border-violet-500/20 rounded-2xl p-4 text-xs text-violet-300">
                    <span className="font-semibold block mb-1">Parent Profile (Kept)</span>
                    <strong>{selectedPatient.full_name}</strong> ({selectedPatient.phone})
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                      Select Duplicate Patient to Merge (Deleted)
                    </label>
                    <select
                      value={mergeTargetId}
                      onChange={(e) => setMergeTargetId(e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-xs text-white focus:outline-none appearance-none cursor-pointer"
                      style={{ colorScheme: 'dark' }}
                    >
                      <option value="" disabled className="text-gray-500">
                        Choose duplicate record...
                      </option>
                      {patients
                        .filter((p) => p.id !== selectedPatient.id)
                        .map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.full_name} ({p.phone})
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 text-xs text-amber-300 flex items-start gap-2.5">
                    <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <p>
                      <strong>Warning:</strong> This action is permanent. The duplicate patient profile
                      will be deleted, and all booking requests, history audits, and logs will be permanently reassigned to the parent.
                    </p>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowMergeModal(false)}
                      className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isMerging || !mergeTargetId}
                      className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
                    >
                      {isMerging ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          Consolidating...
                        </>
                      ) : (
                        'Confirm Merge'
                      )}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
