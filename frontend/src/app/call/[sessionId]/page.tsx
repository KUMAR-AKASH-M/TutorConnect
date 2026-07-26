"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft } from 'lucide-react';
import api from '@/services/api';

export default function CallPage({ params }: { params: { sessionId: string } }) {
  const router = useRouter();
  const [meetingUrl, setMeetingUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMeetingUrl() {
      try {
        const res = await api.get(`/sessions/${params.sessionId}/meeting`);
        if (res.data.success && res.data.url) {
          setMeetingUrl(res.data.url);
        } else {
          setError('Failed to fetch meeting URL');
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Error joining meeting');
      }
    }
    fetchMeetingUrl();
  }, [params.sessionId]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-red-100 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Connection Error</h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  if (!meetingUrl) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
        <Loader2 className="h-10 w-10 text-blue-600 animate-spin mb-4" />
        <h2 className="text-xl font-semibold text-slate-800">Generating secure meeting room...</h2>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-slate-900">
      <div className="flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="text-slate-300 hover:text-white hover:bg-slate-800">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Leave Call
          </Button>
          <h1 className="text-white font-semibold">TutorConnect Live Session</h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-xs font-medium text-slate-300 uppercase tracking-wider">Live</span>
        </div>
      </div>
      <div className="flex-1 w-full h-full relative">
        <iframe
          src={meetingUrl}
          allow="camera; microphone; fullscreen; speaker; display-capture"
          className="absolute inset-0 w-full h-full border-0"
        />
      </div>
    </div>
  );
}
