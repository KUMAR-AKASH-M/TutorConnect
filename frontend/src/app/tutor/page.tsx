"use client";

import { useQuery } from '@tanstack/react-query';
import { getSessions } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Search, Bell, Users, Video, Calendar, Star, ChevronRight, IndianRupee, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { Session } from '@/types';

export default function TutorDashboard() {
  const { user } = useAuth();
  
  const { data: response, isLoading } = useQuery({
    queryKey: ['sessions', user?.role, user?.id],
    queryFn: () => getSessions(user?.role || 'tutor', user?.id || ''),
    enabled: !!user?.id,
  });

  const sessions: Session[] = response?.data || [];
  const upcomingSessions = sessions.filter(s => s.status === 'Pending' || s.status === 'Confirmed');

  const firstName = user?.name ? user.name.split(' ')[0] : 'Tutor';
  const totalStudents = 28;
  const totalEarnings = 2450;
  const rating = 4.9;

  const mockStudents = [
    { name: 'Arjun Mehta', subject: 'Calculus', pct: 85, color: 'bg-blue-600' },
    { name: 'Pooja Verma', subject: 'Physics', pct: 70, color: 'bg-amber-500' },
    { name: 'Ravi Kumar', subject: 'Algebra', pct: 90, color: 'bg-emerald-500' },
  ];

  return (
    <div className="space-y-6 bg-slate-50 min-h-full pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Welcome back, {firstName}! 👋</h1>
          <p className="text-slate-500 mt-1">Here's your teaching overview for today.</p>
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
              <p className="text-sm font-bold text-slate-900">{user?.name || 'Tutor'}</p>
              <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
            </div>
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'Tutor')}&background=3b82f6&color=fff&bold=true`}
              alt="Avatar"
              className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
          <p className="text-sm font-semibold text-slate-500 mb-2">Total Students</p>
          <div className="text-4xl font-bold text-slate-900">{totalStudents}</div>
          <p className="text-xs text-slate-400 mt-1">enrolled</p>
        </div>
        <div className="bg-linear-to-br from-blue-600 to-indigo-600 p-5 rounded-3xl text-white shadow-lg shadow-blue-500/20">
          <p className="text-sm font-medium text-white/80 mb-2">Upcoming</p>
          <div className="text-4xl font-bold">{upcomingSessions.length}</div>
          <p className="text-xs text-white/60 mt-1">sessions</p>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
          <p className="text-sm font-semibold text-emerald-600 mb-2">Total Earnings</p>
          <div className="text-4xl font-bold text-emerald-600">₹{totalEarnings.toLocaleString('en-IN')}</div>
          <p className="text-xs text-slate-400 mt-1">this month</p>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
          <p className="text-sm font-semibold text-amber-500 mb-2">Rating</p>
          <div className="flex items-center gap-2">
            <span className="text-4xl font-bold text-slate-900">{rating}</span>
            <Star className="h-6 w-6 fill-amber-400 text-amber-400" />
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-6">

          {/* Upcoming Sessions */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-slate-900">Upcoming Sessions</h3>
              <Link href="/tutor/schedule" className="text-sm text-blue-600 font-semibold hover:underline">View schedule</Link>
            </div>
            
            {isLoading ? (
              <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-20 bg-slate-100 animate-pulse rounded-2xl" />)}</div>
            ) : upcomingSessions.length > 0 ? (
              <div className="space-y-3">
                {upcomingSessions.map((session) => (
                  <div key={session.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-100 hover:bg-blue-50/30 transition-all gap-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(session.studentId || 'S')}&background=3b82f6&color=fff&bold=true`}
                        alt="Student"
                        className="w-12 h-12 rounded-full shrink-0"
                      />
                      <div>
                        <p className="font-bold text-slate-900">{session.studentId || 'Student'}</p>
                        <p className="text-xs text-slate-500 mb-1.5">Calculus — Advanced</p>
                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                          <Calendar className="h-3.5 w-3.5" />
                          {new Date(session.startTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} – {new Date(session.endTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                    <Link href={`/call/${(session as any)._id || session.id}`} className="shrink-0">
                      <Button size="sm" className="h-10 px-5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white shadow-none transition-colors">
                        Join
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <Video className="h-8 w-8 mx-auto mb-2 text-slate-300" />
                <p className="text-sm font-medium text-slate-500">No upcoming sessions.</p>
              </div>
            )}
          </div>

          {/* Earnings Chart */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="bg-emerald-50 p-2 rounded-xl text-emerald-600"><TrendingUp className="h-5 w-5" /></div>
                <h3 className="font-bold text-slate-900">Earnings Overview</h3>
              </div>
              <select className="bg-slate-50 border-none text-sm font-semibold text-slate-700 rounded-xl p-2 outline-none cursor-pointer">
                <option>This Month</option>
                <option>Last Month</option>
              </select>
            </div>
            
            <div className="h-52 relative">
              <div className="absolute inset-0 flex flex-col justify-between pb-6 pointer-events-none">
                {['₹15k', '₹10k', '₹5k', '₹0'].map(val => (
                  <div key={val} className="w-full border-t border-slate-100 relative">
                    <span className="absolute -top-3 left-0 text-xs text-slate-400">{val}</span>
                  </div>
                ))}
              </div>
              <svg className="absolute inset-0 h-full w-full pl-10 pb-6 overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                <defs>
                  <linearGradient id="green-gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d="M0,80 L20,60 L40,70 L60,30 L80,40 L100,10" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M0,100 L0,80 L20,60 L40,70 L60,30 L80,40 L100,10 L100,100 Z" fill="url(#green-gradient)" />
                {[{x:0,y:80},{x:20,y:60},{x:40,y:70},{x:60,y:30},{x:80,y:40},{x:100,y:10}].map((p, i) => (
                  <circle key={i} cx={p.x} cy={p.y} r="3" fill="#10b981" />
                ))}
              </svg>
              <div className="absolute bottom-0 left-10 right-0 flex justify-between">
                {['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'].map(m => (
                  <span key={m} className="text-xs text-slate-400">{m}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Student Progress */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-5">Student Progress</h3>
            <div className="space-y-5">
              {mockStudents.map(student => (
                <div key={student.name} className="flex items-center gap-4">
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=e2e8f0&color=1e293b&bold=true`}
                    alt={student.name}
                    className="w-10 h-10 rounded-full shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-sm font-bold text-slate-900 truncate">{student.name}</span>
                      <span className="text-xs font-semibold text-slate-500 ml-2">{student.pct}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full ${student.color} rounded-full`} style={{ width: `${student.pct}%` }} />
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{student.subject}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4">Quick Actions</h3>
            <div className="grid gap-2">
              {[
                { href: '/tutor/schedule', icon: Calendar, label: 'Add Availability', desc: 'Set your available slots', color: 'bg-blue-50 text-blue-600' },
                { href: '/tutor/students', icon: Users, label: 'View Students', desc: 'Manage your students', color: 'bg-purple-50 text-purple-600' },
                { href: '/tutor/earnings', icon: IndianRupee, label: 'View Earnings', desc: 'Track your revenue', color: 'bg-emerald-50 text-emerald-600' },
              ].map(({ href, icon: Icon, label, desc, color }) => (
                <Link key={href} href={href} className="flex items-center gap-3 p-3.5 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all group">
                  <div className={`p-2 rounded-xl shrink-0 ${color}`}>
                    <Icon className="h-4 w-4" />
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
