"use client";

import { useQuery } from '@tanstack/react-query';
import { getSessions } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Search, Bell, CheckCircle2, IndianRupee, Calendar, BookOpen, Clock, ChevronRight, Flame, TrendingUp } from 'lucide-react';
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
    <div className="space-y-6 bg-slate-50 min-h-full pb-8">
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
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'Student')}&background=3b82f6&color=fff&bold=true`}
              alt="Avatar"
              className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-linear-to-br from-blue-600 to-indigo-600 p-5 rounded-3xl text-white shadow-lg shadow-blue-500/20">
          <p className="text-sm font-medium text-white/80 mb-2">Upcoming</p>
          <div className="text-4xl font-bold">{upcomingSessions.length}</div>
          <p className="text-xs text-white/60 mt-1">sessions</p>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
          <p className="text-sm font-semibold text-emerald-600 mb-2">Completed</p>
          <div className="text-4xl font-bold text-emerald-600">{pastSessions.length}</div>
          <p className="text-xs text-slate-400 mt-1">sessions</p>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
          <p className="text-sm font-semibold text-slate-500 mb-2">Hours Learned</p>
          <div className="text-4xl font-bold text-slate-900">24.5</div>
          <p className="text-xs text-slate-400 mt-1">this month</p>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
          <p className="text-sm font-semibold text-amber-500 mb-2 flex items-center gap-1"><Flame className="h-3.5 w-3.5" /> Streak</p>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-bold text-amber-500">7</span>
            <span className="text-base font-bold text-amber-400">days</span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">

          {/* Upcoming Session */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-slate-900">Upcoming Session</h3>
              <Link href="/student/sessions" className="text-sm text-blue-600 font-semibold hover:underline">View all</Link>
            </div>
            {isLoading ? (
              <div className="h-28 bg-slate-100 animate-pulse rounded-2xl" />
            ) : upcomingSessions.length > 0 ? (
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-blue-50 rounded-2xl border border-blue-100">
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(upcomingSessions[0].tutorName || 'Tutor')}&background=3b82f6&color=fff&bold=true`}
                  alt="Tutor"
                  className="w-14 h-14 rounded-2xl shadow-sm shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-900">Calculus - Advanced Topics</p>
                  <p className="text-sm text-slate-500 mb-2">with {upcomingSessions[0].tutorName || 'Tutor'}</p>
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(upcomingSessions[0].startTime).toLocaleDateString('en-IN')} · {new Date(upcomingSessions[0].startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <Link href={`/call/${(upcomingSessions[0] as any)._id || upcomingSessions[0].id}`} className="shrink-0">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md shadow-blue-500/20 h-10 px-5">
                    Join
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="text-center py-10 text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <Calendar className="h-8 w-8 mx-auto mb-2 text-slate-300" />
                <p className="text-sm font-medium text-slate-500">No upcoming sessions.</p>
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-slate-900">Recent Activity</h3>
              <Link href="/student/sessions" className="text-sm text-blue-600 font-semibold hover:underline">View all activity</Link>
            </div>
            
            <div className="space-y-4">
              {[
                { icon: CheckCircle2, color: 'bg-emerald-50 text-emerald-600', text: 'Session completed — Calculus Basics', date: '18 Jul, 2026' },
                { icon: IndianRupee, color: 'bg-blue-50 text-blue-600', text: 'Payment successful — ₹1,350', date: '18 Jul, 2026' },
                { icon: Clock, color: 'bg-purple-50 text-purple-600', text: 'Session booked — Physics', date: '17 Jul, 2026' },
              ].map(({ icon: Icon, color, text, date }, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">{text}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Your Progress */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <div className="bg-blue-50 p-2 rounded-xl text-blue-600"><TrendingUp className="h-5 w-5" /></div>
              <h3 className="font-bold text-slate-900">Your Progress</h3>
            </div>
            
            <div className="flex items-end justify-between mb-6 pb-6 border-b border-slate-100">
              <div>
                <p className="text-sm text-slate-500 mb-1">Overall Progress</p>
                <span className="text-4xl font-bold text-slate-900">75%</span>
              </div>
              <div className="w-28 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="w-[75%] h-full bg-blue-600 rounded-full" />
              </div>
            </div>
            
            <div className="space-y-4">
              {[
                { subject: 'Math', pct: 80, color: 'bg-blue-600' },
                { subject: 'Physics', pct: 75, color: 'bg-emerald-500' },
                { subject: 'English', pct: 70, color: 'bg-amber-500' },
                { subject: 'Programming', pct: 60, color: 'bg-purple-500' },
              ].map(item => (
                <div key={item.subject}>
                  <div className="flex justify-between text-sm font-semibold mb-1.5">
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
            <h3 className="font-bold text-slate-900 mb-5">Quick Actions</h3>
            <div className="grid gap-2">
              {[
                { href: '/student/book', icon: Calendar, label: 'Book New Session', desc: 'Find and book a new session', color: 'bg-blue-50 text-blue-600' },
                { href: '/tutors', icon: Search, label: 'Browse Tutors', desc: 'Explore expert tutors', color: 'bg-purple-50 text-purple-600' },
                { href: '/student/progress', icon: BookOpen, label: 'View Progress', desc: 'Check your learning progress', color: 'bg-emerald-50 text-emerald-600' },
              ].map(({ href, icon: Icon, label, desc, color }) => (
                <Link key={href} href={href} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all group">
                  <div className={`p-2.5 rounded-xl shrink-0 ${color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">{label}</p>
                    <p className="text-xs text-slate-500">{desc}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
