"use client";

import { useQuery } from '@tanstack/react-query';
import { getSessions } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Search, Bell, Users, Video, Calendar, DollarSign, Star, ChevronRight } from 'lucide-react';
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
  // Mock data for the UI
  const totalStudents = 28;
  const totalEarnings = 2450;
  const rating = 4.9;

  return (
    <div className="space-y-8 bg-slate-50 min-h-full pb-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Welcome back, Dr. {firstName}! 👋</h1>
          <p className="text-slate-500 mt-1">Here's your teaching overview.</p>
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
            <img src={`https://ui-avatars.com/api/?name=${user?.name || 'Tutor'}&background=random`} alt="Avatar" className="w-10 h-10 rounded-full border-2 border-white shadow-sm" />
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <p className="text-sm font-semibold text-slate-500 mb-2">Total Students</p>
          <div className="text-4xl font-bold text-slate-900">{totalStudents}</div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <p className="text-sm font-semibold text-blue-600 mb-2">Upcoming Sessions</p>
          <div className="text-4xl font-bold text-blue-600">{upcomingSessions.length}</div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <p className="text-sm font-semibold text-emerald-600 mb-2">Total Earnings</p>
          <div className="text-4xl font-bold text-emerald-600">₹{totalEarnings.toLocaleString()}</div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <p className="text-sm font-semibold text-amber-500 mb-2">Rating</p>
          <div className="flex items-center gap-2">
            <span className="text-4xl font-bold text-slate-900">{rating}</span>
            <Star className="h-6 w-6 fill-amber-400 text-amber-400" />
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Upcoming Sessions List */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-slate-900">Upcoming Sessions</h3>
              <Link href="#" className="text-sm text-blue-600 font-semibold hover:underline">View all sessions</Link>
            </div>
            
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => <div key={i} className="h-20 bg-slate-50 animate-pulse rounded-2xl" />)}
              </div>
            ) : upcomingSessions.length > 0 ? (
              <div className="space-y-4">
                {upcomingSessions.map((session, index) => (
                  <div key={session.id} className="flex flex-col sm:flex-row items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:border-blue-100 hover:shadow-md transition-all gap-4">
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <img src={`https://ui-avatars.com/api/?name=${session.studentId}&background=random`} alt="Student" className="w-12 h-12 rounded-full" />
                      <div>
                        <p className="font-bold text-slate-900">{session.studentId}</p>
                        <p className="text-xs text-slate-500 mb-1">Calculus - Advanced</p>
                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                          <Calendar className="h-3.5 w-3.5" />
                          {new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(session.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                    <Button className="w-full sm:w-auto bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl shadow-none">
                      Join
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                No upcoming sessions scheduled.
              </div>
            )}
          </div>
          
          {/* Earnings Overview */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-slate-900">Earnings Overview</h3>
              <select className="bg-slate-50 border-none text-sm font-semibold text-slate-700 rounded-lg p-2 outline-none">
                <option>This Month</option>
                <option>Last Month</option>
              </select>
            </div>
            
            <div className="h-64 flex items-end justify-between px-2 pb-4 relative">
              {/* Simple CSS graph mockup for the UI reference */}
              <div className="absolute inset-0 flex flex-col justify-between pb-8 pointer-events-none">
                {[15, 10, 5, 0].map(val => (
                  <div key={val} className="w-full border-t border-slate-100 relative">
                    <span className="absolute -top-3 -left-2 text-xs text-slate-400">₹{val}k</span>
                  </div>
                ))}
              </div>
              
              {/* SVG Line Graph */}
              <svg className="absolute inset-0 h-full w-full pt-8 pb-8 pl-8 overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                <path d="M0,80 L20,60 L40,70 L60,30 L80,40 L100,10" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M0,100 L0,80 L20,60 L40,70 L60,30 L80,40 L100,10 L100,100 Z" fill="url(#blue-gradient)" opacity="0.2" />
                <defs>
                  <linearGradient id="blue-gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563eb" stopOpacity="1" />
                    <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <circle cx="0" cy="80" r="3" fill="#2563eb" />
                <circle cx="20" cy="60" r="3" fill="#2563eb" />
                <circle cx="40" cy="70" r="3" fill="#2563eb" />
                <circle cx="60" cy="30" r="3" fill="#2563eb" />
                <circle cx="80" cy="40" r="3" fill="#2563eb" />
                <circle cx="100" cy="10" r="3" fill="#2563eb" />
              </svg>
              
              <div className="w-full flex justify-between absolute bottom-0 pl-8 pr-2">
                {['May 1', 'May 8', 'May 15', 'May 22', 'May 29'].map(day => (
                  <span key={day} className="text-xs text-slate-400">{day}</span>
                ))}
              </div>
            </div>
          </div>
          
        </div>

        {/* Right Sidebar */}
        <div className="space-y-8">
          
          {/* Students Progress */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-6">Students Progress</h3>
            
            <div className="space-y-6">
              {[
                { name: 'John Smith', subject: 'Calculus', pct: 85, color: 'bg-blue-600' },
                { name: 'Emily Davis', subject: 'Physics', pct: 70, color: 'bg-amber-500' },
                { name: 'Mike Wilson', subject: 'Algebra', pct: 90, color: 'bg-emerald-500' },
              ].map(student => (
                <div key={student.name} className="flex items-center gap-4">
                  <img src={`https://ui-avatars.com/api/?name=${student.name}&background=random`} alt="Student" className="w-10 h-10 rounded-full" />
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-bold text-slate-900">{student.name}</span>
                      <span className="text-xs font-semibold text-slate-500">{student.pct}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full ${student.color} rounded-full`} style={{ width: `${student.pct}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-6">Quick Actions</h3>
            
            <div className="grid gap-3">
              <Link href="#" className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all group">
                <div className="bg-blue-50 p-3 rounded-xl text-blue-600">
                  <Calendar className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">Add Availability</p>
                  <p className="text-xs text-slate-500">Set your available time slots</p>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link href="#" className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all group">
                <div className="bg-blue-50 p-3 rounded-xl text-blue-600">
                  <Users className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">View Students</p>
                  <p className="text-xs text-slate-500">Manage your students</p>
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
