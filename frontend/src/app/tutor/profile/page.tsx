"use client";

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getCurrentUser, updateUserProfile, getTutorAvailability, addTutorAvailability, uploadProfilePicture } from '@/services/api';
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { User, BookOpen, Clock, Check, AlertCircle, CalendarClock, Camera, Loader2, CheckCircle2, IndianRupee } from 'lucide-react';

export default function TutorProfilePage() {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: userResponse, isLoading: isUserLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: getCurrentUser,
  });

  const user = userResponse?.data;

  const { data: availabilityResponse, isLoading: isAvailabilityLoading } = useQuery({
    queryKey: ['availability', user?.id],
    queryFn: () => getTutorAvailability(user?.id as string),
    enabled: !!user?.id,
  });

  const availabilitySlots = availabilityResponse?.data || [];

  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [subjects, setSubjects] = useState('');
  const [rate, setRate] = useState(30);
  const [experience, setExperience] = useState(1);
  const [avatar, setAvatar] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [dayOfWeek, setDayOfWeek] = useState('Monday');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [isAddingSlot, setIsAddingSlot] = useState(false);
  const [slotError, setSlotError] = useState('');
  const [slotSuccess, setSlotSuccess] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setBio(user.bio || user.profile?.bio || '');
      setSubjects(user.profile?.subjects?.join(', ') || '');
      setRate(user.profile?.hourlyRate || 30);
      setExperience(user.profile?.experienceYears || 1);
      setAvatar(user.avatar || '');
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMessage('');
    setSuccessMessage('');
    try {
      const res = await updateUserProfile({
        name,
        bio,
        subjects: subjects.split(',').map(s => s.trim()).filter(Boolean),
        hourlyRate: rate,
        experienceYears: experience,
      });
      if (res.success) {
        setSuccessMessage('Profile saved successfully!');
        queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      } else {
        setErrorMessage(res.message || 'Failed to update profile.');
      }
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Failed to update profile details.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    setErrorMessage('');
    setSuccessMessage('');
    const formData = new FormData();
    formData.append('picture', file);
    try {
      const res = await uploadProfilePicture(formData);
      if (res.success) {
        setAvatar(res.profilePicture);
        setSuccessMessage('Profile picture updated!');
        queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      } else {
        setErrorMessage(res.message || 'Failed to upload image.');
      }
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Upload failed.');
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileInput = () => fileInputRef.current?.click();

  const handleAddSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAddingSlot(true);
    setSlotError('');
    setSlotSuccess('');
    try {
      const res = await addTutorAvailability({ dayOfWeek, startTime, endTime });
      if (res.success) {
        setSlotSuccess('Slot added!');
        queryClient.invalidateQueries({ queryKey: ['availability', user?.id] });
      } else {
        setSlotError(res.message || 'Failed to add availability.');
      }
    } catch (err: any) {
      setSlotError(err.response?.data?.message || 'This slot already exists.');
    } finally {
      setIsAddingSlot(false);
    }
  };

  const handleQuickSeed = async () => {
    setIsAddingSlot(true);
    setSlotError('');
    setSlotSuccess('');
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    for (const day of days) {
      try {
        await addTutorAvailability({ dayOfWeek: day, startTime: '08:00', endTime: '22:00' });
      } catch (err) {
        console.warn(`Day ${day} already exists.`);
      }
    }
    setIsAddingSlot(false);
    setSlotSuccess('Configured 8 AM – 10 PM for all 7 days!');
    queryClient.invalidateQueries({ queryKey: ['availability', user?.id] });
  };

  const isLoading = isUserLoading || isAvailabilityLoading;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-20 bg-slate-100 rounded-3xl animate-pulse" />
        <div className="grid md:grid-cols-5 gap-6">
          <div className="md:col-span-3 h-96 bg-slate-100 rounded-3xl animate-pulse" />
          <div className="md:col-span-2 h-96 bg-slate-100 rounded-3xl animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Profile & Availability</h1>
        <p className="text-slate-500 mt-1">Customize your tutor photo, bio, hourly fee, and availability schedule.</p>
      </div>

      <div className="grid md:grid-cols-5 gap-6">
        {/* Profile Settings */}
        <div className="md:col-span-3 space-y-0">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            {/* Avatar Header */}
            <div className="bg-linear-to-br from-blue-600 to-indigo-600 p-8 flex flex-col items-center">
              <div className="relative group cursor-pointer mb-4" onClick={triggerFileInput}>
                <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-xl bg-blue-100 flex items-center justify-center">
                  {avatar ? (
                    <img src={avatar} alt="Avatar Preview" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-12 h-12 text-white" />
                  )}
                </div>
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  {isUploading ? <Loader2 className="w-6 h-6 text-white animate-spin" /> : <Camera className="w-6 h-6 text-white" />}
                </div>
              </div>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
              <h2 className="text-xl font-bold text-white">{user?.name || 'Your Name'}</h2>
              <p className="text-blue-200 text-sm mt-0.5">{user?.email}</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={triggerFileInput}
                disabled={isUploading}
                className="mt-3 text-white/80 hover:text-white hover:bg-white/10 border border-white/20 rounded-xl"
              >
                {isUploading ? 'Uploading...' : 'Change Photo'}
              </Button>
            </div>

            {/* Form */}
            <div className="p-6">
              {successMessage && (
                <div className="flex items-center gap-3 bg-emerald-50 text-emerald-700 p-4 rounded-2xl font-semibold border border-emerald-100 mb-5">
                  <CheckCircle2 className="h-5 w-5 shrink-0" /> {successMessage}
                </div>
              )}
              {errorMessage && (
                <div className="bg-red-50 text-red-700 text-sm p-4 rounded-2xl border border-red-100 font-medium mb-5">{errorMessage}</div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-semibold text-slate-900">Public Full Name</label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required className="h-12 rounded-xl border-slate-200 bg-slate-50" />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="rate" className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
                      <IndianRupee className="h-4 w-4 text-slate-400" /> Hourly Rate (₹)
                    </label>
                    <Input id="rate" type="number" min={1} value={rate} onChange={(e) => setRate(Number(e.target.value))} required className="h-12 rounded-xl border-slate-200 bg-slate-50" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="experience" className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
                      <Clock className="h-4 w-4 text-slate-400" /> Years of Experience
                    </label>
                    <Input id="experience" type="number" min={0} value={experience} onChange={(e) => setExperience(Number(e.target.value))} required className="h-12 rounded-xl border-slate-200 bg-slate-50" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="subjects" className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
                    <BookOpen className="h-4 w-4 text-slate-400" /> Subjects <span className="text-slate-400 font-normal">(comma-separated)</span>
                  </label>
                  <Input id="subjects" placeholder="e.g. Mathematics, Calculus, Algebra" value={subjects} onChange={(e) => setSubjects(e.target.value)} required className="h-12 rounded-xl border-slate-200 bg-slate-50" />
                </div>

                <div className="space-y-2">
                  <label htmlFor="bio" className="text-sm font-semibold text-slate-900">Public Bio / Introduction</label>
                  <Textarea
                    id="bio"
                    placeholder="Tell students about your qualifications, teaching style, and experience..."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    required
                    className="rounded-xl border-slate-200 bg-slate-50 min-h-27.5"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md shadow-blue-500/20"
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving Changes...' : 'Save Public Profile'}
                </Button>
              </form>
            </div>
          </div>
        </div>

        {/* Availability Settings */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center gap-2">
              <div className="bg-blue-50 p-2 rounded-xl text-blue-600"><CalendarClock className="h-5 w-5" /></div>
              <div>
                <h2 className="font-bold text-slate-900">Working Hours</h2>
                <p className="text-slate-500 text-xs mt-0.5">Configure when you're available for bookings.</p>
              </div>
            </div>

            <div className="p-5 space-y-5">
              {slotSuccess && (
                <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 p-3 rounded-xl text-sm font-semibold border border-emerald-100">
                  <CheckCircle2 className="h-4 w-4 shrink-0" /> {slotSuccess}
                </div>
              )}
              {slotError && (
                <div className="bg-red-50 text-red-700 text-xs p-3 rounded-xl border border-red-100 font-medium">{slotError}</div>
              )}

              {/* Quick seed when empty */}
              {availabilitySlots.length === 0 && (
                <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl space-y-3">
                  <p className="text-xs text-amber-700 leading-relaxed font-medium flex gap-2 items-start">
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-amber-500" />
                    No working hours set yet. Students can't book until you add availability.
                  </p>
                  <Button onClick={handleQuickSeed} className="w-full text-xs h-9 bg-amber-500 hover:bg-amber-600 text-white rounded-xl" disabled={isAddingSlot}>
                    Quick Setup: Mon–Sun (8 AM – 10 PM)
                  </Button>
                </div>
              )}

              {/* Add slot form */}
              <form onSubmit={handleAddSlot} className="space-y-3 pb-5 border-b border-slate-100">
                <h3 className="font-bold text-sm text-slate-900">Add a Slot</h3>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500">Day of Week</label>
                  <select
                    value={dayOfWeek}
                    onChange={(e) => setDayOfWeek(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 focus:ring-2 focus:ring-blue-600 outline-none"
                  >
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500">From</label>
                    <Input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} required className="h-10 rounded-xl border-slate-200 bg-slate-50 text-sm" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500">To</label>
                    <Input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} required className="h-10 rounded-xl border-slate-200 bg-slate-50 text-sm" />
                  </div>
                </div>

                <Button type="submit" className="w-full h-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-md shadow-blue-500/20" disabled={isAddingSlot}>
                  {isAddingSlot ? 'Adding...' : 'Add Availability'}
                </Button>
              </form>

              {/* Active Slots */}
              <div className="space-y-3">
                <h3 className="font-bold text-sm text-slate-900">Active Schedule</h3>
                {availabilitySlots.length > 0 ? (
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {availabilitySlots.map((slot: any) => (
                      <div key={slot._id} className="flex justify-between items-center text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <span className="font-bold text-slate-900">{slot.dayOfWeek}</span>
                        <span className="text-slate-500 flex items-center gap-1.5">
                          <Check className="h-3.5 w-3.5 text-emerald-500" /> {slot.startTime} – {slot.endTime}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic text-center py-4">No availability slots set yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
