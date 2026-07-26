"use client";

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getTutors, bookSession } from '@/services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarClock, User as UserIcon, Loader2 } from 'lucide-react';
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

  const { data: tutorsResponse, isLoading: isLoadingTutors } = useQuery({
    queryKey: ['tutors'],
    queryFn: getTutors,
  });

  const tutors = tutorsResponse?.data || [];

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

    // Combine date and time strings into valid ISO Date strings
    const startDateTime = new Date(`${date}T${startTime}`);
    const endDateTime = new Date(`${date}T${endTime}`);

    bookMutation.mutate({
      tutorId,
      startTime: startDateTime.toISOString(),
      endTime: endDateTime.toISOString(),
      notes,
    });
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
            Select a tutor and a time that works for you.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 p-8">
          {errorMsg && (
            <div className="bg-destructive/10 text-destructive p-3 rounded-lg text-sm font-medium">
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
                onChange={(e) => setTutorId(e.target.value)}
                className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:ring-2 focus:ring-blue-600 outline-none"
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

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-900">Date <span className="text-red-500">*</span></label>
            <input 
              type="date" 
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:ring-2 focus:ring-blue-600 outline-none"
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-900">Start Time <span className="text-red-500">*</span></label>
              <input 
                type="time" 
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:ring-2 focus:ring-blue-600 outline-none"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-900">End Time <span className="text-red-500">*</span></label>
              <input 
                type="time" 
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:ring-2 focus:ring-blue-600 outline-none"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-900">What would you like to learn? (Optional)</label>
            <textarea 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="E.g., I need help with Algebra 2 homework..."
              className="w-full min-h-[120px] p-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:ring-2 focus:ring-blue-600 outline-none resize-y"
            />
          </div>
        </CardContent>
        <CardFooter className="bg-slate-50 border-t border-slate-100 p-8">
          <Button 
            type="submit" 
            className="w-full md:w-auto ml-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl h-12 px-8 shadow-md shadow-blue-500/20"
            disabled={bookMutation.isPending || isLoadingTutors}
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
      <Suspense fallback={<div className="p-12 text-center animate-pulse">Loading booking form...</div>}>
        <BookingForm />
      </Suspense>
    </div>
  );
}
