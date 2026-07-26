"use client";

import { useQuery } from '@tanstack/react-query';
import { getSessions } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Search, Bell, CheckCircle2, DollarSign, Calendar, BookOpen, Clock, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Session } from '@/types';

export default function StudentDashboard() {
  const { user } = useAuth();
  
  const { data: response, isLoading } = useQuery({
    queryKey: ['sessions', user?.role, user?.id],
    queryFn: () => getSessions(user?.role || 'student', user?.id || ''),
    enabled: !!user?.id,
  });

  const sessions: Session[] = response?.data || [];
  
  const upcomingSessions = sessions.filter(s => s.status === 'Pending' || s.status === 'Confirmed');
  const pastSessions = sessions.filter(s => s.status === 'Completed');

  const firstName = user?.name ? user.name.split(' ')[0] : 'Student';

  return (
    <div className="space-y-8 bg-slate-50 min-h-full pb-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Welcome back, {firstName}! 👋</h1>
          <p className="text-slate-500 mt-1">Here's what's happening with your learning journey today.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-600 bg-slate-50 rounded-full h-10 w-10">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-600 bg-slate-50 rounded-full h-10 w-10">
            <Bell className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
            <div className="text-right hidden md:block">
              <p className="text-sm font-bold text-slate-900">{user?.name || 'Student'}</p>
              <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
            </div>
            <img src={`https://ui-avatars.com/api/?name=${user?.name || 'Student'}&background=random`} alt="Avatar" className="w-10 h-10 rounded-full border-2 border-white shadow-sm" />
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <p className="text-sm font-semibold text-blue-600 mb-2">Upcoming Sessions</p>
          <div className="text-4xl font-bold text-blue-600">{upcomingSessions.length}</div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <p className="text-sm font-semibold text-emerald-600 mb-2">Completed Sessions</p>
          <div className="text-4xl font-bold text-emerald-600">{pastSessions.length}</div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <p className="text-sm font-semibold text-slate-500 mb-2">Hours Learned</p>
          <div className="text-4xl font-bold text-slate-900">24.5</div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <p className="text-sm font-semibold text-amber-500 mb-2">Current Streak</p>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-bold text-amber-500">7</span>
            <span className="text-lg font-bold text-amber-500">days</span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        
        {/* Left Column */}
        <div className="space-y-8">
          
          {/* Upcoming Session */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-6">Upcoming Session</h3>
            {isLoading ? (
              <div className="h-32 bg-slate-50 animate-pulse rounded-2xl" />
            ) : upcomingSessions.length > 0 ? (
              <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-slate-50 rounded-2xl">
                <img src={`https://ui-avatars.com/api/?name=${upcomingSessions[0].tutorName || 'Tutor'}&background=random`} alt="Tutor" className="w-16 h-16 rounded-2xl shadow-sm bg-white" />
                <div className="flex-1 text-center sm:text-left">
                  <p className="font-bold text-slate-900">Calculus - Advanced Topics</p>
                  <p className="text-sm text-slate-500 mb-2">with Dr. {upcomingSessions[0].tutorName || 'Tutor'}</p>
                  <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-semibold text-slate-600">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(upcomingSessions[0].startTime).toLocaleDateString()} • {new Date(upcomingSessions[0].startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(upcomingSessions[0].endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md shadow-blue-500/20">
                  Join Session
                </Button>
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                No upcoming sessions scheduled.
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-slate-900">Recent Activity</h3>
              <Link href="/student/sessions" className="text-sm text-blue-600 font-semibold hover:underline">View all activity</Link>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-blue-50 p-2 rounded-lg shrink-0 mt-0.5">
                  <CheckCircle2 className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900 text-sm">Session completed - Calculus Basics</p>
                  <p className="text-xs text-slate-500 mt-1">May 16, 2024</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-emerald-50 p-2 rounded-lg shrink-0 mt-0.5">
                  <DollarSign className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900 text-sm">Payment successful - ₹30.00</p>
                  <p className="text-xs text-slate-500 mt-1">May 16, 2024</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-blue-50 p-2 rounded-lg shrink-0 mt-0.5">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900 text-sm">Session booked - Physics</p>
                  <p className="text-xs text-slate-500 mt-1">May 17, 2024</p>
                </div>
              </div>
            </div>
          </div>
          
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          
          {/* Your Progress */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-6">Your Progress</h3>
            
            <div className="flex items-end justify-between mb-8 pb-8 border-b border-slate-100">
              <div>
                <p className="text-sm text-slate-500 mb-1">Overall Progress</p>
                <div className="flex items-end gap-2">
                  <span className="text-4xl font-bold text-slate-900">75%</span>
                </div>
              </div>
              <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="w-[75%] h-full bg-blue-600 rounded-full" />
              </div>
            </div>
            
            <div className="space-y-6">
              {[
                { subject: 'Math', pct: 80, color: 'bg-blue-600' },
                { subject: 'Physics', pct: 75, color: 'bg-emerald-500' },
                { subject: 'English', pct: 70, color: 'bg-amber-500' },
                { subject: 'Programming', pct: 60, color: 'bg-purple-500' },
              ].map(item => (
                <div key={item.subject}>
                  <div className="flex justify-between text-sm font-semibold mb-2">
                    <span className="text-slate-700">{item.subject}</span>
                    <span className="text-slate-900">{item.pct}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-6">Quick Actions</h3>
            
            <div className="grid gap-3">
              <Link href="/student/book" className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all group">
                <div className="bg-blue-50 p-3 rounded-xl text-blue-600">
                  <Calendar className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">Book New Session</p>
                  <p className="text-xs text-slate-500">Find and book a new session</p>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link href="/tutors" className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all group">
                <div className="bg-blue-50 p-3 rounded-xl text-blue-600">
                  <Search className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">Browse Tutors</p>
                  <p className="text-xs text-slate-500">Explore expert tutors</p>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link href="/student/progress" className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all group">
                <div className="bg-blue-50 p-3 rounded-xl text-blue-600">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">View Progress</p>
                  <p className="text-xs text-slate-500">Check your learning progress</p>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
