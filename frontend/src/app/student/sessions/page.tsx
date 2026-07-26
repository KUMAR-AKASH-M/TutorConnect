"use client";

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getSessions } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';
import { Session } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Video, FileText, CalendarPlus } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function MySessionsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'cancelled'>('upcoming');

  const { data: response, isLoading } = useQuery({
    queryKey: ['sessions', user?.role, user?.id],
    queryFn: () => getSessions(user?.role || 'student', user?.id || ''),
    enabled: !!user?.id,
  });

  const sessions: Session[] = response?.data || [];

  const upcomingSessions = sessions.filter((s) => s.status === 'Pending' || s.status === 'Confirmed');
  const pastSessions = sessions.filter((s) => s.status === 'Completed');
  const cancelledSessions = sessions.filter((s) => s.status === 'Cancelled');

  const getFilteredSessions = () => {
    if (activeTab === 'upcoming') return upcomingSessions;
    if (activeTab === 'past') return pastSessions;
    return cancelledSessions;
  };

  const filteredSessions = getFilteredSessions();

  if (isLoading) {
    return <div className="p-8 text-center animate-pulse">Loading sessions...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">My Sessions</h1>
          <p className="text-slate-500 mt-1">Manage all your tutoring sessions.</p>
        </div>
        <Link href="/student/book">
          <Button className="gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md shadow-blue-500/20">
            <CalendarPlus className="h-4 w-4" />
            Book New Session
          </Button>
        </Link>
      </div>

      <div className="flex border-b border-slate-100 mb-6 px-2">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={cn(
            "px-6 py-4 font-semibold text-sm transition-colors border-b-2",
            activeTab === 'upcoming' ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300"
          )}
        >
          Upcoming ({upcomingSessions.length})
        </button>
        <button
          onClick={() => setActiveTab('past')}
          className={cn(
            "px-6 py-4 font-semibold text-sm transition-colors border-b-2",
            activeTab === 'past' ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300"
          )}
        >
          Past ({pastSessions.length})
        </button>
        <button
          onClick={() => setActiveTab('cancelled')}
          className={cn(
            "px-6 py-4 font-semibold text-sm transition-colors border-b-2",
            activeTab === 'cancelled' ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300"
          )}
        >
          Cancelled ({cancelledSessions.length})
        </button>
      </div>

      {filteredSessions.length === 0 ? (
        <Card className="border-0 shadow-sm bg-white rounded-3xl">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <div className="h-16 w-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
              <CalendarPlus className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-slate-900">No {activeTab} sessions</h3>
            <p className="text-slate-500 max-w-sm mb-6">
              You don&apos;t have any {activeTab} sessions right now. Book a new session to start learning!
            </p>
            <Link href="/tutors">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md shadow-blue-500/20">Find a Tutor</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredSessions.map((session) => (
            <Card key={session.id} className="border border-slate-100 shadow-sm bg-white rounded-2xl hover:border-blue-100 hover:shadow-md transition-all">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  <div className="flex gap-4">
                    <img src={`https://ui-avatars.com/api/?name=${session.tutorName || 'Tutor'}&background=random`} alt="Tutor" className="w-12 h-12 rounded-full" />
                    <div>
                      <h3 className="font-bold text-lg text-slate-900">Session with {session.tutorName || 'Tutor'}</h3>
                      <div className="flex items-center text-slate-500 mt-1 gap-2 text-sm font-semibold">
                        <Clock className="h-4 w-4" />
                        <span>
                          {new Date(session.startTime).toLocaleDateString()} at{' '}
                          {new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{' '}
                          {new Date(session.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div className="mt-2 text-sm font-semibold">
                        Status: <span className={cn(
                          session.status === 'Confirmed' ? "text-emerald-600" :
                          session.status === 'Pending' ? "text-amber-500" :
                          session.status === 'Cancelled' ? "text-red-500" : "text-slate-500"
                        )}>{session.status}</span>
                      </div>
                    </div>
                  </div>
                  
                  {session.notes && (
                    <div className="md:w-1/3 bg-slate-50 p-4 rounded-xl text-sm flex items-start gap-2 border border-slate-100">
                      <FileText className="h-4 w-4 shrink-0 text-slate-400 mt-0.5" />
                      <p className="text-slate-600 font-medium leading-relaxed">{session.notes}</p>
                    </div>
                  )}
                  
                  {activeTab === 'upcoming' && (
                    <div className="flex items-center gap-3 mt-4 md:mt-0">
                      <Button variant="outline" size="sm" className="w-full md:w-auto h-10 px-4 rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50">Cancel</Button>
                      <Link href={`/call/${session._id}`}>
                        <Button size="sm" className="w-full md:w-auto h-10 px-4 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white shadow-none">Join Call</Button>
                      </Link>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
