"use client";

import { Suspense, useState, useEffect, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getTutors, bookSession, getTutorAvailability } from '@/services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarClock, User as UserIcon, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

function BookingForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedTutorId = searchParams.get('tutor');
  const { user } = useAuth();
  
  const [tutorId, setTutorId] = useState(preselectedTutorId || '');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Fetch tutors
  const { data: tutorsResponse, isLoading: isLoadingTutors } = useQuery({
    queryKey: ['tutors'],
    queryFn: getTutors,
  });
  const tutors = tutorsResponse?.data || [];

  // Fetch selected tutor's availability
  const { data: availabilityResponse, isLoading: isLoadingAvailability } = useQuery({
    queryKey: ['availability', tutorId],
    queryFn: () => getTutorAvailability(tutorId),
    enabled: !!tutorId,
  });
  const availability = availabilityResponse?.data || [];

  // Calculate day of week from selected date
  const selectedDayOfWeek = useMemo(() => {
    if (!date) return '';
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[d.getDay()];
  }, [date]);

  // Filter slots for the selected day
  const slotsForSelectedDay = useMemo(() => {
    if (!selectedDayOfWeek) return [];
    return availability.filter((slot: any) => slot.dayOfWeek === selectedDayOfWeek);
  }, [availability, selectedDayOfWeek]);

  const bookMutation = useMutation({
    mutationFn: bookSession,
    onSuccess: () => {
      router.push('/student/sessions');
    },
    onError: (error: any) => {
      setErrorMsg(error.response?.data?.message || 'Failed to book session. Please try again.');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    
    if (!tutorId || !date || !startTime || !endTime) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    if (startTime >= endTime) {
      setErrorMsg('End time must be after start time.');
      return;
    }

    if (slotsForSelectedDay.length === 0) {
      setErrorMsg('Tutor is not available on this day.');
      return;
    }

    const startDateTime = new Date(`${date}T${startTime}`);
    const endDateTime = new Date(`${date}T${endTime}`);

    // Send local time components explicitly to avoid UTC shift bugs in backend
    bookMutation.mutate({
      tutorId,
      startTime: startDateTime.toISOString(),
      endTime: endDateTime.toISOString(),
      notes,
      localStartTime: startTime,
      localEndTime: endTime,
      localDayOfWeek: selectedDayOfWeek
    } as any); // cast as any because api.ts type isn't fully strict here
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="bg-white shadow-xl shadow-blue-900/5 border border-slate-100 rounded-3xl overflow-hidden">
        <CardHeader className="bg-slate-50 border-b border-slate-100 p-8">
          <CardTitle className="text-2xl flex items-center gap-2 font-bold text-slate-900">
            <div className="bg-blue-100 text-blue-600 p-2 rounded-xl">
              <CalendarClock className="h-6 w-6" />
            </div>
            Book a New Session
          </CardTitle>
          <CardDescription className="text-slate-500 font-medium">
            Select a tutor and a time that fits their working hours.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6 p-8">
          {errorMsg && (
            <div className="bg-red-50 text-red-600 p-4 rounded-2xl border border-red-100 font-medium text-sm flex gap-2 items-start">
              <AlertCircle className="h-5 w-5 shrink-0" />
              {errorMsg}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-900">Select Tutor <span className="text-red-500">*</span></label>
            {isLoadingTutors ? (
              <div className="h-12 flex items-center text-slate-500 text-sm">Loading tutors...</div>
            ) : (
              <select 
                value={tutorId} 
                onChange={(e) => { setTutorId(e.target.value); setDate(''); setStartTime(''); setEndTime(''); }}
                className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:ring-2 focus:ring-blue-600 outline-none font-medium"
                required
              >
                <option value="" disabled>Choose a tutor</option>
                {tutors.map((tutor: any) => (
                  <option key={tutor.id} value={tutor.userId}>
                    {tutor.name} - {tutor.subjects.join(', ')} (₹{tutor.hourlyRate}/hr)
                  </option>
                ))}
              </select>
            )}
          </div>

          {tutorId && (
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-900">Date <span className="text-red-500">*</span></label>
              <input 
                type="date" 
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:ring-2 focus:ring-blue-600 outline-none font-medium"
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
          )}

          {date && (
            <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-3">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <CalendarClock className="h-4 w-4 text-blue-600" />
                Tutor Availability on {selectedDayOfWeek}
              </h4>
              
              {isLoadingAvailability ? (
                <div className="text-sm text-slate-500 flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin"/> Loading availability...</div>
              ) : slotsForSelectedDay.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {slotsForSelectedDay.map((slot: any) => (
                    <span key={slot._id} className="px-3 py-1.5 bg-white text-blue-700 border border-blue-200 rounded-lg text-sm font-bold shadow-sm flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                      {slot.startTime} – {slot.endTime}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm font-medium text-amber-600 bg-amber-50 p-3 rounded-xl border border-amber-100">
                  This tutor does not have any working hours scheduled for {selectedDayOfWeek}s.
                </p>
              )}
            </div>
          )}

          {date && slotsForSelectedDay.length > 0 && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-900">Start Time <span className="text-red-500">*</span></label>
                <input 
                  type="time" 
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:ring-2 focus:ring-blue-600 outline-none font-medium"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-900">End Time <span className="text-red-500">*</span></label>
                <input 
                  type="time" 
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:ring-2 focus:ring-blue-600 outline-none font-medium"
                  required
                />
              </div>
            </div>
          )}

          {date && slotsForSelectedDay.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-900">What would you like to learn? (Optional)</label>
              <textarea 
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="E.g., I need help with Algebra 2 homework..."
                className="w-full min-h-25 p-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:ring-2 focus:ring-blue-600 outline-none resize-y font-medium text-sm"
              />
            </div>
          )}

        </CardContent>
        <CardFooter className="bg-slate-50 border-t border-slate-100 p-8">
          <Button 
            type="submit" 
            className="w-full md:w-auto ml-auto bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl h-12 px-8 shadow-md shadow-blue-500/20"
            disabled={bookMutation.isPending || isLoadingTutors || isLoadingAvailability || (Boolean(date) && slotsForSelectedDay.length === 0)}
          >
            {bookMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Booking...
              </>
            ) : (
              'Confirm Booking'
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}

export default function BookSessionPage() {
  return (
    <div className="max-w-2xl mx-auto py-4">
      <Suspense fallback={<div className="p-12 text-center animate-pulse font-medium text-slate-500">Loading booking form...</div>}>
        <BookingForm />
      </Suspense>
    </div>
  );
}
