"use client";

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getCurrentUser, updateUserProfile } from '@/services/api';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, User, BookOpen, Clock, CheckCircle } from 'lucide-react';

export default function TutorProfilePage() {
  const queryClient = useQueryClient();

  // 1. Fetch current logged-in user profile details
  const { data: userResponse, isLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: getCurrentUser,
  });

  const user = userResponse?.data;

  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [subjects, setSubjects] = useState('');
  const [rate, setRate] = useState(30);
  const [experience, setExperience] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Hydrate state once data is loaded
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setBio(user.bio || '');
      setSubjects('');
      setRate(30);
      setExperience(1);
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
      console.error(err);
      setErrorMessage(err.response?.data?.message || 'Failed to update profile details.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-2xl animate-pulse space-y-6">
        <div className="h-8 w-48 bg-muted rounded" />
        <div className="h-96 bg-muted rounded-xl" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Profile</h1>
        <p className="text-muted-foreground">Customize your public tutor profile and adjust your availability rates.</p>
      </div>

      <Card className="shadow-lg border-border/50">
        <CardHeader className="bg-muted/10 border-b">
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" /> Profile Settings
          </CardTitle>
          <CardDescription>Update your hourly teaching fee and public information.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {successMessage && (
              <div className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 p-3 rounded-lg border border-green-200 text-center font-medium">
                {successMessage}
              </div>
            )}
            {errorMessage && (
              <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg border border-destructive/20 text-center font-medium">
                {errorMessage}
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">Public Full Name</label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="h-11"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="rate" className="text-sm font-medium flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-muted-foreground" /> Hourly Rate ($)
                </label>
                <Input
                  id="rate"
                  type="number"
                  min={1}
                  value={rate}
                  onChange={(e) => setRate(Number(e.target.value))}
                  required
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="experience" className="text-sm font-medium">Years of Experience</label>
                <Input
                  id="experience"
                  type="number"
                  min={0}
                  value={experience}
                  onChange={(e) => setExperience(Number(e.target.value))}
                  required
                  className="h-11"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="subjects" className="text-sm font-medium flex items-center gap-1.5">
                <BookOpen className="h-4 w-4 text-muted-foreground" /> Subjects Taught (comma-separated)
              </label>
              <Input
                id="subjects"
                placeholder="e.g. Mathematics, Calculus, Algebra"
                value={subjects}
                onChange={(e) => setSubjects(e.target.value)}
                required
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="bio" className="text-sm font-medium">Public Bio / Introduction</label>
              <Textarea
                id="bio"
                placeholder="Tell students about your qualifications, teaching methodology, and personality..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                required
                className="min-h-[120px] rounded-xl"
              />
            </div>

            <Button type="submit" className="w-full h-12 text-base mt-2" disabled={isSaving}>
              {isSaving ? 'Saving Changes...' : 'Save Public Profile'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
