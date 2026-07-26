"use client";

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getCurrentUser, updateUserProfile, uploadProfilePicture } from '@/services/api';
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { User, BookOpen, GraduationCap, Award, Camera, Loader2, CheckCircle2 } from 'lucide-react';

export default function StudentProfilePage() {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: userResponse, isLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: getCurrentUser,
  });

  const user = userResponse?.data;

  const [name, setName] = useState('');
  const [gradeLevel, setGradeLevel] = useState('High School');
  const [subjectsOfInterest, setSubjectsOfInterest] = useState('');
  const [learningGoals, setLearningGoals] = useState('');
  const [avatar, setAvatar] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setGradeLevel(user.profile?.gradeLevel || 'High School');
      setSubjectsOfInterest(user.profile?.subjectsOfInterest?.join(', ') || '');
      setLearningGoals(user.profile?.learningGoals || '');
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
        gradeLevel,
        subjectsOfInterest: subjectsOfInterest.split(',').map(s => s.trim()).filter(Boolean),
        learningGoals,
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
      setErrorMessage(err.response?.data?.message || 'Upload failed. File type might be unsupported.');
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileInput = () => fileInputRef.current?.click();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-20 bg-slate-100 rounded-3xl animate-pulse" />
        <div className="h-96 bg-slate-100 rounded-3xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Edit Profile</h1>
        <p className="text-slate-500 mt-1">Manage your credentials, update your learning goals, and upload a profile photo.</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Avatar Section */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-8 flex flex-col items-center">
          <div className="relative group cursor-pointer mb-4" onClick={triggerFileInput}>
            <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-xl bg-blue-100 flex items-center justify-center">
              {avatar ? (
                <img src={avatar} alt="Avatar Preview" className="w-full h-full object-cover" />
              ) : (
                <User className="w-12 h-12 text-white" />
              )}
            </div>
            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              {isUploading ? (
                <Loader2 className="w-6 h-6 text-white animate-spin" />
              ) : (
                <Camera className="w-6 h-6 text-white" />
              )}
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
              <label htmlFor="name" className="text-sm font-semibold text-slate-900">Full Name</label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required className="h-12 rounded-xl border-slate-200 bg-slate-50" />
            </div>

            <div className="space-y-2">
              <label htmlFor="gradeLevel" className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
                <GraduationCap className="h-4 w-4 text-slate-400" /> Grade Level
              </label>
              <select
                id="gradeLevel"
                value={gradeLevel}
                onChange={(e) => setGradeLevel(e.target.value)}
                className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:ring-2 focus:ring-blue-600 outline-none"
              >
                {['Elementary School', 'Middle School', 'High School', 'Undergraduate', 'Postgraduate', 'Adult Learner'].map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="subjects" className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
                <BookOpen className="h-4 w-4 text-slate-400" /> Subjects of Interest <span className="text-slate-400 font-normal">(comma-separated)</span>
              </label>
              <Input
                id="subjects"
                placeholder="e.g. Algebra, Physics, Chemistry"
                value={subjectsOfInterest}
                onChange={(e) => setSubjectsOfInterest(e.target.value)}
                required
                className="h-12 rounded-xl border-slate-200 bg-slate-50"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="learningGoals" className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
                <Award className="h-4 w-4 text-slate-400" /> My Learning Goals
              </label>
              <Textarea
                id="learningGoals"
                placeholder="What are your goals? e.g. Pass chemistry finals, improve calculus..."
                value={learningGoals}
                onChange={(e) => setLearningGoals(e.target.value)}
                required
                className="rounded-xl border-slate-200 bg-slate-50 min-h-[100px]"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md shadow-blue-500/20 mt-2"
              disabled={isSaving}
            >
              {isSaving ? 'Saving Changes...' : 'Save Profile'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
