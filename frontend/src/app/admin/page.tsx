"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BookOpen, AlertCircle, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

const mockApplications = [
  { id: 't1', name: 'Priya Sharma', subjects: ['Mathematics', 'Physics'], avatar: '/tutors/indian_tutor_1_1785045831493.png' },
  { id: 't2', name: 'Rahul Patel', subjects: ['Computer Science', 'Python'], avatar: '/tutors/indian_tutor_2_1785045845331.png' },
  { id: 't3', name: 'Ananya Desai', subjects: ['English', 'Literature'], avatar: '/tutors/indian_tutor_3_1785045860150.png' },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-500 mt-1">Platform overview and statistics.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-slate-200 rounded-xl h-10">Download Report</Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-10 shadow-md shadow-blue-500/20">Platform Settings</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-slate-500">Total Users</p>
            <div className="bg-blue-50 p-2 rounded-xl text-blue-600"><Users className="h-4 w-4" /></div>
          </div>
          <div className="text-3xl font-bold text-slate-900">12,345</div>
          <p className="text-xs text-slate-400 mt-1">+180 from last month</p>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-slate-500">Active Tutors</p>
            <div className="bg-purple-50 p-2 rounded-xl text-purple-600"><Users className="h-4 w-4" /></div>
          </div>
          <div className="text-3xl font-bold text-slate-900">542</div>
          <p className="text-xs text-slate-400 mt-1">+12 from last month</p>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-slate-500">Sessions This Month</p>
            <div className="bg-emerald-50 p-2 rounded-xl text-emerald-600"><BookOpen className="h-4 w-4" /></div>
          </div>
          <div className="text-3xl font-bold text-slate-900">3,456</div>
          <p className="text-xs text-slate-400 mt-1">+5% from last month</p>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-slate-500">Pending Approvals</p>
            <div className="bg-amber-50 p-2 rounded-xl text-amber-500"><AlertCircle className="h-4 w-4" /></div>
          </div>
          <div className="text-3xl font-bold text-slate-900">8</div>
          <p className="text-xs text-slate-400 mt-1">Tutor applications to review</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="font-bold text-slate-900">Recent Tutor Applications</h2>
            <p className="text-slate-500 text-sm mt-1">Review and approve new tutors.</p>
          </div>
          <div className="divide-y divide-slate-50">
            {mockApplications.map((tutor) => (
              <div key={tutor.id} className="flex items-center justify-between p-5 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="h-11 w-11 rounded-2xl overflow-hidden shrink-0 bg-slate-100">
                    <img src={tutor.avatar} alt="Tutor avatar" className="object-cover h-full w-full" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{tutor.name}</p>
                    <p className="text-sm text-slate-500">{tutor.subjects.join(', ')}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="rounded-xl border-slate-200">Review</Button>
                  <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl">Approve</Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-3 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="font-bold text-slate-900">Platform Activity</h2>
            <p className="text-slate-500 text-sm mt-1">Recent actions across the platform.</p>
          </div>
          <div className="divide-y divide-slate-50">
            {[
              { text: 'New user registration', time: '2m ago', type: 'normal' },
              { text: 'Payment processed for Session #124', time: '15m ago', type: 'normal' },
              { text: 'Tutor Profile updated (ID: 3)', time: '1h ago', type: 'normal' },
              { text: 'New dispute opened', time: '2h ago', type: 'alert' },
              { text: 'Payouts processed successfully', time: '5h ago', type: 'normal' },
            ].map((activity, i) => (
              <div key={i} className="flex items-start gap-4 p-4 hover:bg-slate-50 transition-colors">
                <div className={`h-2 w-2 mt-2 rounded-full shrink-0 ${activity.type === 'alert' ? 'bg-red-500' : 'bg-blue-500'}`} />
                <div className="flex-1">
                  <p className={`text-sm font-semibold ${activity.type === 'alert' ? 'text-red-600' : 'text-slate-900'}`}>{activity.text}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
