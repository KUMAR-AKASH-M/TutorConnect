"use client";

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getSessions, updateProgress } from '@/services/api';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Video, Calendar, Clock, BookOpen, AlertCircle, Sparkles, CheckCircle2, X } from 'lucide-react';
import Link from 'next/link';
import { Session } from '@/types';

export default function TutorSchedulePage() {
  const queryClient = useQueryClient();
  
  const { data: response, isLoading } = useQuery({
    queryKey: ['sessions'],
    queryFn: getSessions,
  });

  const sessions: Session[] = response?.data || [];

  const [loggingProgressSession, setLoggingProgressSession] = useState<Session | null>(null);
  const [subject, setSubject] = useState('');
  const [topics, setTopics] = useState('');
  const [status, setStatus] = useState<'In Progress' | 'Completed'>('In Progress');
  const [percentage, setPercentage] = useState(50);
  const [notes, setNotes] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const upcomingSessions = sessions.filter(s => s.status === 'Confirmed' || s.status === 'Pending');
  const pastSessions = sessions.filter(s => s.status === 'Completed');

  const handleOpenProgress = (session: Session) => {
    setLoggingProgressSession(session);
    setSubject(session.subject || 'Math');
    setTopics('');
    setStatus('In Progress');
    setPercentage(50);
    setNotes('');
    setFeedback('');
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleProgressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loggingProgressSession) return;

    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const res = await updateProgress({
        studentId: loggingProgressSession.studentId,
        sessionId: loggingProgressSession.id,
        subject,
        topicsCovered: topics.split(',').map(t => t.trim()).filter(Boolean),
        status,
        completionPercentage: percentage,
        notes,
        feedback,
      });

      if (res.success) {
        setSuccessMessage('Progress logged and student notified!');
        queryClient.invalidateQueries({ queryKey: ['sessions'] });
        setTimeout(() => setLoggingProgressSession(null), 1800);
      } else {
        setErrorMessage(res.message || 'Failed to submit progress.');
      }
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Failed to log progress.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Teaching Schedule</h1>
        <p className="text-slate-500 mt-1">Manage your upcoming tutoring slots, check bookings, and log student progress.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Upcoming Sessions */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-slate-900 flex items-center gap-2">
              <div className="bg-blue-50 p-1.5 rounded-lg text-blue-600"><Calendar className="h-4 w-4" /></div>
              Upcoming Sessions
              <span className="text-sm font-semibold bg-blue-50 text-blue-600 px-2.5 py-0.5 rounded-full">{upcomingSessions.length}</span>
            </h2>
          </div>

          {isLoading ? (
            <div className="space-y-4">{[1, 2].map(i => <div key={i} className="h-28 bg-slate-100 rounded-3xl animate-pulse" />)}</div>
          ) : upcomingSessions.length > 0 ? (
            upcomingSessions.map(session => (
              <div key={session.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-50 text-blue-600 p-3 rounded-2xl shrink-0">
                    <Video className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Session with {session.studentName || 'Student'}</h3>
                    <div className="flex flex-wrap gap-3 text-xs font-medium text-slate-500 mt-1.5">
                      <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {session.date || new Date(session.startTime).toLocaleDateString('en-IN')}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 w-full sm:w-auto shrink-0">
                  <Button variant="outline" size="sm" className="flex-1 sm:flex-none rounded-xl border-slate-200 h-10 text-slate-600 hover:bg-slate-50" onClick={() => handleOpenProgress(session)}>
                    Log Progress
                  </Button>
                  <Link href={`/call/${session.id}`} className="flex-1 sm:flex-none">
                    <Button size="sm" className="w-full h-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20">
                      Start Lesson
                    </Button>
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-3xl border border-dashed border-slate-200 shadow-sm text-center py-16">
              <AlertCircle className="mx-auto h-10 w-10 text-slate-300 mb-3" />
              <p className="font-semibold text-slate-500">No upcoming sessions</p>
              <p className="text-sm text-slate-400 mt-1">New bookings from students will appear here.</p>
            </div>
          )}
        </div>

        {/* Completed Sessions */}
        <div className="space-y-4">
          <h2 className="font-bold text-slate-900 flex items-center gap-2">
            <div className="bg-emerald-50 p-1.5 rounded-lg text-emerald-600"><BookOpen className="h-4 w-4" /></div>
            Completed
            <span className="text-sm font-semibold bg-emerald-50 text-emerald-600 px-2.5 py-0.5 rounded-full">{pastSessions.length}</span>
          </h2>

          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            {isLoading ? (
              <div className="p-4 space-y-3">{[1, 2].map(i => <div key={i} className="h-12 bg-slate-100 rounded-xl animate-pulse" />)}</div>
            ) : pastSessions.length > 0 ? (
              <div className="divide-y divide-slate-50">
                {pastSessions.map(session => (
                  <div key={session.id} className="flex justify-between items-center p-4 hover:bg-slate-50 transition-colors">
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">{session.studentName || 'Student'}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{session.date || new Date(session.startTime).toLocaleDateString('en-IN')}</p>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700">Done</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-slate-400">
                <p className="text-sm font-medium">No session history yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Log Progress Modal */}
      {loggingProgressSession && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="bg-blue-50 p-2 rounded-xl text-blue-600">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-bold text-slate-900">Log Lesson Progress</h2>
                  <p className="text-slate-500 text-sm">For: <strong>{loggingProgressSession.studentName}</strong></p>
                </div>
              </div>
              <button onClick={() => setLoggingProgressSession(null)} className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full p-2 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6">
              {successMessage ? (
                <div className="flex items-center gap-3 bg-emerald-50 text-emerald-700 p-4 rounded-2xl font-semibold border border-emerald-100">
                  <CheckCircle2 className="h-5 w-5 shrink-0" />
                  {successMessage}
                </div>
              ) : (
                <form onSubmit={handleProgressSubmit} className="space-y-5">
                  {errorMessage && (
                    <div className="bg-red-50 text-red-700 text-sm p-3 rounded-xl border border-red-100 font-medium">{errorMessage}</div>
                  )}

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-900">Subject</label>
                      <Input required value={subject} onChange={(e) => setSubject(e.target.value)} className="h-11 rounded-xl border-slate-200 bg-slate-50" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-900">Completion ({percentage}%)</label>
                      <input
                        type="range" min={0} max={100} step={5} value={percentage}
                        onChange={(e) => setPercentage(Number(e.target.value))}
                        className="w-full h-11 cursor-pointer accent-blue-600"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-900">Topics Covered <span className="text-slate-400 font-normal">(comma-separated)</span></label>
                    <Input required placeholder="e.g. Kinematics, Velocity, Free fall" value={topics} onChange={(e) => setTopics(e.target.value)} className="h-11 rounded-xl border-slate-200 bg-slate-50" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-900">Lesson Status</label>
                    <select value={status} onChange={(e) => setStatus(e.target.value as any)} className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:ring-2 focus:ring-blue-600 outline-none">
                      <option value="In Progress">In Progress (Unit ongoing)</option>
                      <option value="Completed">Completed (Finalize session)</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-900">Private Notes</label>
                    <Textarea placeholder="Notes for grading or record keeping..." value={notes} onChange={(e) => setNotes(e.target.value)} className="rounded-xl border-slate-200 bg-slate-50 min-h-20" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-900">Feedback for Student</label>
                    <Textarea placeholder="Encouraging feedback and homework tips..." value={feedback} onChange={(e) => setFeedback(e.target.value)} className="rounded-xl border-slate-200 bg-slate-50 min-h-20" />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button type="button" variant="outline" className="flex-1 rounded-xl h-11 border-slate-200" onClick={() => setLoggingProgressSession(null)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting} className="flex-1 rounded-xl h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20">
                      {isSubmitting ? 'Logging...' : 'Log Progress'}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
