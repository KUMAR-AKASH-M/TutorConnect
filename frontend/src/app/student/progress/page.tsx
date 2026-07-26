"use client";

import { useQuery } from '@tanstack/react-query';
import { getSessions } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';
import { Session } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Trophy, Clock, BookOpen, GraduationCap, Flame, TrendingUp, CalendarCheck } from 'lucide-react';
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
  
  const completedSessions = sessions.filter(s => s.status === 'Completed');
  
  let totalHours = 0;
  completedSessions.forEach(session => {
    const start = new Date(session.startTime).getTime();
    const end = new Date(session.endTime).getTime();
    totalHours += (end - start) / (1000 * 60 * 60);
  });
  
  const uniqueTutors = new Set(completedSessions.map(s => s.tutorId)).size;

  const stats = [
    { label: 'Total Hours', value: totalHours.toFixed(1), icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50', unit: 'hrs' },
    { label: 'Sessions Done', value: completedSessions.length, icon: CalendarCheck, color: 'text-emerald-600', bg: 'bg-emerald-50', unit: '' },
    { label: 'Unique Tutors', value: uniqueTutors, icon: GraduationCap, color: 'text-purple-600', bg: 'bg-purple-50', unit: '' },
    { label: 'Current Streak', value: 1, icon: Flame, color: 'text-amber-500', bg: 'bg-amber-50', unit: 'days' },
  ];

  const subjectProgress = [
    { subject: 'Mathematics', pct: 80, color: 'bg-blue-600' },
    { subject: 'Physics', pct: 75, color: 'bg-emerald-500' },
    { subject: 'English', pct: 70, color: 'bg-purple-500' },
    { subject: 'Programming', pct: 60, color: 'bg-amber-500' },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-20 bg-slate-100 rounded-3xl animate-pulse" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="h-32 bg-slate-100 rounded-3xl animate-pulse" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Learning Progress</h1>
        <p className="text-slate-500 mt-1">Track your tutoring milestones and achievements.</p>
      </div>

      {completedSessions.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex flex-col items-center justify-center p-16 text-center">
            <div className="h-20 w-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-5">
              <Trophy className="h-10 w-10" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-slate-900">No progress yet</h3>
            <p className="text-slate-500 max-w-sm mb-6">
              Your learning metrics will appear here once you complete your first tutoring session.
            </p>
            <Link href="/student/book">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md shadow-blue-500/20 h-11 px-6">
                Book a Session
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Stats Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map(({ label, value, icon: Icon, color, bg, unit }) => (
              <div key={label} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-slate-500">{label}</p>
                  <div className={`${bg} p-2 rounded-xl ${color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                </div>
                <div className={`text-3xl font-bold ${color}`}>
                  {value}<span className="text-lg ml-1 font-semibold">{unit}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Subject Progress */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-6">
                <div className="bg-blue-50 p-2 rounded-xl text-blue-600"><TrendingUp className="h-5 w-5" /></div>
                <div>
                  <h2 className="font-bold text-slate-900">Subject Progress</h2>
                  <p className="text-slate-500 text-xs">Your proficiency across subjects</p>
                </div>
              </div>
              <div className="space-y-5">
                {subjectProgress.map(item => (
                  <div key={item.subject}>
                    <div className="flex justify-between text-sm font-semibold mb-2">
                      <span className="text-slate-700">{item.subject}</span>
                      <span className="text-slate-900">{item.pct}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full ${item.color} rounded-full transition-all duration-700`} style={{ width: `${item.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Milestones */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-6">
                <div className="bg-amber-50 p-2 rounded-xl text-amber-500"><Trophy className="h-5 w-5" /></div>
                <div>
                  <h2 className="font-bold text-slate-900">Milestones</h2>
                  <p className="text-slate-500 text-xs">Your learning achievements</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-2xl">
                  <div className="h-12 w-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center shrink-0">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">First Session Completed</p>
                    <p className="text-xs text-slate-500 mt-0.5">You took your first step towards mastery!</p>
                  </div>
                </div>

                {totalHours >= 5 && (
                  <div className="flex items-center gap-4 p-4 bg-amber-50 rounded-2xl">
                    <div className="h-12 w-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center shrink-0">
                      <Trophy className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">5 Hours of Learning</p>
                      <p className="text-xs text-slate-500 mt-0.5">Dedicated 5 hours to improving your skills.</p>
                    </div>
                  </div>
                )}

                {completedSessions.length >= 3 && (
                  <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-2xl">
                    <div className="h-12 w-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center shrink-0">
                      <GraduationCap className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">3 Sessions Completed</p>
                      <p className="text-xs text-slate-500 mt-0.5">You're building great learning habits!</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
