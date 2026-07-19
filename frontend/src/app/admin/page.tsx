"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BookOpen, AlertCircle, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { dummyTutors } from '@/utils/dummyData';

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">Platform overview and statistics.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Download Report</Button>
          <Button>Platform Settings</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,345</div>
            <p className="text-xs text-muted-foreground">+180 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tutors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">542</div>
            <p className="text-xs text-muted-foreground">+12 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sessions This Month</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3,456</div>
            <p className="text-xs text-muted-foreground">+5% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <AlertCircle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Tutor applications to review</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Tutor Applications</CardTitle>
            <CardDescription>Review and approve new tutors.</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="space-y-4">
                {dummyTutors.slice(0, 3).map((tutor) => (
                  <div key={tutor.id} className="flex items-center justify-between border p-4 rounded-xl">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 bg-muted rounded-full overflow-hidden shrink-0">
                        <img src={tutor.avatar} alt="Tutor avatar" className="object-cover h-full w-full" />
                      </div>
                      <div>
                        <p className="font-medium">{tutor.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {tutor.subjects.join(', ')}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Review</Button>
                      <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">Approve</Button>
                    </div>
                  </div>
                ))}
             </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Platform Activity</CardTitle>
            <CardDescription>Recent actions across the platform.</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="space-y-6">
                {[
                  { text: "New user registration", time: "2m ago" },
                  { text: "Payment processed for Session #124", time: "15m ago" },
                  { text: "Tutor Profile updated (ID: 3)", time: "1h ago" },
                  { text: "New dispute opened", time: "2h ago", alert: true },
                  { text: "Payouts processed successfully", time: "5h ago" },
                ].map((activity, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className={`h-2 w-2 mt-2 rounded-full shrink-0 ${activity.alert ? 'bg-destructive' : 'bg-primary'}`} />
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${activity.alert ? 'text-destructive' : ''}`}>{activity.text}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
