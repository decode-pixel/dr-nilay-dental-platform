import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Calendar as CalendarIcon, Clock, Sun, Sunset, Moon, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { SessionType } from '../types';
import BookingStepLayout from '../BookingStepLayout';

interface ScheduleStepProps extends React.Attributes {
  selectedDate: string;
  selectedSession: SessionType | '';
  onSelectDate: (date: string) => void;
  onSelectSession: (session: SessionType) => void;
  onBack: () => void;
  onContinue: () => void;
}

const SESSIONS: Array<{
  id: SessionType;
  label: string;
  timeRange: string;
  icon: React.ElementType;
  description: string;
}> = [
  {
    id: 'Morning',
    label: 'Morning Session',
    timeRange: '10:00 AM – 1:00 PM',
    icon: Sun,
    description: 'Ideal for consultations, check-ups & diagnostics.',
  },
  {
    id: 'Afternoon',
    label: 'Afternoon Session',
    timeRange: '1:00 PM – 5:00 PM',
    icon: Sunset,
    description: 'Quiet clinical hours for procedures & treatments.',
  },
  {
    id: 'Evening',
    label: 'Evening Session',
    timeRange: '5:00 PM – 8:30 PM',
    icon: Moon,
    description: 'Convenient after-work priority appointments.',
  },
];

export default function ScheduleStep({
  selectedDate,
  selectedSession,
  onSelectDate,
  onSelectSession,
  onBack,
  onContinue,
}: ScheduleStepProps) {
  // Calendar month state
  const today = useMemo(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }, []);

  const [currentMonth, setCurrentMonth] = useState(() => {
    if (selectedDate) {
      const parsed = new Date(selectedDate);
      if (!isNaN(parsed.getTime())) return new Date(parsed.getFullYear(), parsed.getMonth(), 1);
    }
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });

  const formatDateString = (year: number, month: number, day: number) => {
    const y = year.toString();
    const m = (month + 1).toString().padStart(2, '0');
    const d = day.toString().padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const todayStr = useMemo(() => {
    return formatDateString(today.getFullYear(), today.getMonth(), today.getDate());
  }, [today]);

  // Generate calendar days for currentMonth
  const daysInMonth = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0 = Sunday
    const totalDays = new Date(year, month + 1, 0).getDate();

    const days: Array<{ dayNum: number | null; dateStr: string | null; isPast: boolean; isToday: boolean }> = [];

    // Leading empty slots
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push({ dayNum: null, dateStr: null, isPast: true, isToday: false });
    }

    // Days of the month
    for (let d = 1; d <= totalDays; d++) {
      const dateStr = formatDateString(year, month, d);
      const dateObj = new Date(year, month, d);
      const isPast = dateObj < today;
      const isToday = dateStr === todayStr;

      days.push({
        dayNum: d,
        dateStr,
        isPast,
        isToday,
      });
    }

    return days;
  }, [currentMonth, today, todayStr]);

  const monthLabel = currentMonth.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const handlePrevMonth = () => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const isPrevDisabled =
    currentMonth.getFullYear() === today.getFullYear() &&
    currentMonth.getMonth() <= today.getMonth();

  return (
    <BookingStepLayout
      title="Choose Preferred Date & Session"
      subtitle="Select a date and appointment window suitable for your schedule."
      badge="Step 3 • Scheduling"
      onBack={onBack}
      onContinue={onContinue}
      isContinueDisabled={!selectedDate || !selectedSession}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Premium Interactive Calendar */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-5 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-violet-400" />
              <h4 className="font-heading font-semibold text-white text-sm">
                {monthLabel}
              </h4>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handlePrevMonth}
                disabled={isPrevDisabled}
                className={`p-1.5 rounded-xl border transition-colors ${
                  isPrevDisabled
                    ? 'text-gray-600 border-transparent cursor-not-allowed'
                    : 'text-gray-300 border-white/10 hover:bg-white/10 hover:text-white'
                }`}
                aria-label="Previous Month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                className="p-1.5 rounded-xl border border-white/10 text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                aria-label="Next Month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Day of Week Headers */}
          <div className="grid grid-cols-7 text-center text-xs font-semibold text-gray-400 mb-2">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((dayName) => (
              <div key={dayName} className="py-1">
                {dayName}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1.5">
            {daysInMonth.map((slot, idx) => {
              if (slot.dayNum === null || !slot.dateStr) {
                return <div key={`empty-${idx}`} className="h-9" />;
              }

              const isSelected = selectedDate === slot.dateStr;
              const isPast = slot.isPast;

              return (
                <button
                  key={slot.dateStr}
                  type="button"
                  disabled={isPast}
                  onClick={() => !isPast && onSelectDate(slot.dateStr!)}
                  className={`relative h-9 rounded-xl text-xs font-medium transition-all duration-200 flex flex-col items-center justify-center ${
                    isSelected
                      ? 'bg-gradient-to-br from-violet-600 to-blue-600 text-white font-bold shadow-[0_0_15px_rgba(139,92,246,0.6)] scale-105'
                      : isPast
                      ? 'text-gray-600 cursor-not-allowed opacity-50'
                      : 'text-gray-200 hover:bg-white/15 hover:text-white'
                  }`}
                >
                  <span>{slot.dayNum}</span>
                  {slot.isToday && !isSelected && (
                    <span className="absolute bottom-1 w-1 h-1 rounded-full bg-violet-400" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Future Doctor Schedules Architecture Hint */}
          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-gray-400">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-violet-400" />
              Doctor schedules available daily
            </span>
            {selectedDate && (
              <span className="text-violet-300 font-medium">
                Selected: {selectedDate}
              </span>
            )}
          </div>
        </div>

        {/* Right Column: Preferred Session Controls */}
        <div className="flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-violet-400" />
              <h4 className="font-heading font-semibold text-white text-sm">
                Preferred Clinical Session
              </h4>
            </div>

            <div className="space-y-3">
              {SESSIONS.map((session) => {
                const isSelected = selectedSession === session.id;
                const Icon = session.icon;

                return (
                  <motion.div
                    key={session.id}
                    onClick={() => onSelectSession(session.id)}
                    className={`group relative rounded-2xl p-4 cursor-pointer border transition-all duration-200 flex items-center justify-between ${
                      isSelected
                        ? 'bg-gradient-to-br from-violet-600/20 via-white/10 to-blue-600/20 border-violet-400/80 shadow-[0_0_20px_rgba(139,92,246,0.3)]'
                        : 'bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-colors ${
                          isSelected
                            ? 'bg-violet-600 text-white border-violet-400'
                            : 'bg-white/5 text-gray-400 border-white/10 group-hover:text-white group-hover:bg-white/10'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className="font-heading font-semibold text-sm text-white">
                            {session.label}
                          </h5>
                          <span className="text-[11px] font-medium text-violet-300 bg-violet-500/20 px-2 py-0.5 rounded-full">
                            {session.timeRange}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                          {session.description}
                        </p>
                      </div>
                    </div>

                    <div
                      className={`w-4 h-4 rounded-full border-2 transition-all duration-200 shrink-0 ${
                        isSelected
                          ? 'border-violet-400 bg-violet-400 shadow-[0_0_8px_rgba(139,92,246,0.8)]'
                          : 'border-white/30'
                      }`}
                    />
                  </motion.div>
                );
              })}
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 text-xs text-gray-300 leading-relaxed">
            <p className="font-semibold text-violet-300 mb-1">
              Exact Appointment Timing
            </p>
            Upon review by our clinical coordinator, your exact slot and doctor
            serial will be confirmed immediately via WhatsApp or Phone call.
          </div>
        </div>
      </div>
    </BookingStepLayout>
  );
}
