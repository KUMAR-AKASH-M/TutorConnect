"use client";

import { useQuery } from '@tanstack/react-query';
import { getSessions } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';
import { Session } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Trophy, Clock, BookOpen, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ProgressPage() {
  const { user } = useAuth();
  
  const { data: response, isLoading } = useQuery({
    queryKey: ['sessions', user?.role, user?.id],
    queryFn: () => getSessions(user?.role || 'student', user?.id || ''),
    enabled: !!user?.id,
  });

  const sessions: Session[] = response?.data || [];
  
  // Calculate metrics
  const completedSessions = sessions.filter(s => s.status === 'Completed');
  
  let totalHours = 0;
  completedSessions.forEach(session => {
    const start = new Date(session.startTime).getTime();
    const end = new Date(session.endTime).getTime();
    totalHours += (end - start) / (1000 * 60 * 60);
  });
  
  const uniqueTutors = new Set(completedSessions.map(s => s.tutorId)).size;

  if (isLoading) {
    return <div className="p-8 text-center animate-pulse">Loading progress data...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Learning Progress</h1>
        <p className="text-slate-500 mt-1">Track your tutoring milestones and achievements.</p>
      </div>

      {completedSessions.length === 0 ? (
        <Card className="border-0 shadow-sm bg-white rounded-3xl">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <div className="h-16 w-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
              <Trophy className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-slate-900">No completed sessions yet</h3>
            <p className="text-slate-500 max-w-sm mb-6">
              Your learning metrics will appear here once you complete your first tutoring session.
            </p>
            <Link href="/student/book">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md shadow-blue-500/20">Book a Session</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0">
                <CardTitle className="text-sm font-semibold text-slate-500">Total Hours</CardTitle>
                <div className="bg-blue-50 p-2 rounded-xl text-blue-600">
                  <Clock className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent className="p-0 pt-4">
                <div className="text-4xl font-bold text-slate-900">{totalHours.toFixed(1)}</div>
              </CardContent>
            </Card>
            <Card className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0">
                <CardTitle className="text-sm font-semibold text-slate-500">Completed Sessions</CardTitle>
                <div className="bg-emerald-50 p-2 rounded-xl text-emerald-600">
                  <BookOpen className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent className="p-0 pt-4">
                <div className="text-4xl font-bold text-slate-900">{completedSessions.length}</div>
              </CardContent>
            </Card>
            <Card className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0">
                <CardTitle className="text-sm font-semibold text-slate-500">Unique Tutors</CardTitle>
                <div className="bg-purple-50 p-2 rounded-xl text-purple-600">
                  <GraduationCap className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent className="p-0 pt-4">
                <div className="text-4xl font-bold text-slate-900">{uniqueTutors}</div>
              </CardContent>
            </Card>
            <Card className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0">
                <CardTitle className="text-sm font-semibold text-slate-500">Current Streak</CardTitle>
                <div className="bg-amber-50 p-2 rounded-xl text-amber-500">
                  <Trophy className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent className="p-0 pt-4">
                <div className="text-4xl font-bold text-slate-900">1</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 mt-8">
            <Card className="col-span-1 bg-white rounded-3xl border border-slate-100 shadow-sm">
              <CardHeader className="p-8 pb-4">
                <CardTitle className="text-xl font-bold text-slate-900">Recent Milestones</CardTitle>
                <CardDescription className="text-slate-500">Your latest learning achievements</CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-0">
                <div className="space-y-6 mt-4">
                  <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="h-12 w-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center shrink-0">
                      <BookOpen className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">First Session Completed</p>
                      <p className="text-sm text-slate-500">You took your first step towards mastery!</p>
                    </div>
                  </div>
                  {totalHours >= 5 && (
                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="h-12 w-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center shrink-0">
                        <Trophy className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">5 Hours of Learning</p>
                        <p className="text-sm text-slate-500">Dedicated 5 hours to improving your skills.</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
