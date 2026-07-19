"use client";

import { useQuery } from '@tanstack/react-query';
import { getCurrentUser, getStudentProgress } from '@/services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, BookOpen, Clock, Award, Star } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function StudentProgressPage() {
  // 1. Fetch current logged-in user
  const { data: userResponse, isLoading: isUserLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: getCurrentUser,
  });

  const studentId = userResponse?.data?.id;

  // 2. Fetch progress logs for this student
  const { data: progressResponse, isLoading: isProgressLoading } = useQuery({
    queryKey: ['progress', studentId],
    queryFn: () => getStudentProgress(studentId as string),
    enabled: !!studentId,
  });

  const progressLogs = progressResponse?.data || [];

  const isLoading = isUserLoading || isProgressLoading;

  // Aggregate completion status
  const subjectsMap: { [key: string]: { total: number; sum: number; count: number } } = {};
  progressLogs.forEach((p: any) => {
    const sub = p.subject || 'General';
    if (!subjectsMap[sub]) {
      subjectsMap[sub] = { total: 0, sum: 0, count: 0 };
    }
    subjectsMap[sub].sum += p.completionPercentage || 0;
    subjectsMap[sub].count += 1;
  });

  const subjectsProgress = Object.keys(subjectsMap).map(sub => ({
    name: sub,
    percentage: Math.round(subjectsMap[sub].sum / subjectsMap[sub].count),
    logsCount: subjectsMap[sub].count
  }));

  const totalLessons = progressLogs.length;
  const completedLessons = progressLogs.filter((p: any) => p.status === 'Completed').length;
  const overallAvgCompletion = totalLessons > 0
    ? Math.round(progressLogs.reduce((sum: number, p: any) => sum + (p.completionPercentage || 0), 0) / totalLessons)
    : 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Learning Progress</h1>
        <p className="text-muted-foreground">Monitor your course milestones, subjects studied, and tutor comments.</p>
      </div>

      {isLoading ? (
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            {[1, 2, 3].map(i => <div key={i} className="h-28 bg-muted/50 rounded-2xl animate-pulse" />)}
          </div>
          <div className="h-96 bg-muted/50 rounded-2xl animate-pulse" />
        </div>
      ) : progressLogs.length > 0 ? (
        <>
          {/* Quick Metrics */}
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="border-none shadow-md bg-white dark:bg-black/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Overall Completion</CardTitle>
                <div className="bg-primary/15 p-2 rounded-lg text-primary"><Award className="h-4 w-4" /></div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground mb-2">{overallAvgCompletion}%</div>
                <Progress value={overallAvgCompletion} className="h-2" />
              </CardContent>
            </Card>

            <Card className="border-none shadow-md bg-white dark:bg-black/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Subjects Mastered</CardTitle>
                <div className="bg-green-150/15 p-2 rounded-lg text-green-600"><BookOpen className="h-4 w-4" /></div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{subjectsProgress.length}</div>
                <p className="text-xs text-muted-foreground mt-1.5">Across science, math & humanities</p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md bg-white dark:bg-black/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Completed Units</CardTitle>
                <div className="bg-orange-100 dark:bg-orange-900/30 p-2 rounded-lg text-orange-600 dark:text-orange-400"><CheckCircle2 className="h-4 w-4" /></div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{completedLessons} / {totalLessons}</div>
                <p className="text-xs text-muted-foreground mt-1.5">Confirmed by your tutors</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Subject breakdown list */}
            <Card className="col-span-1 border-none shadow-md bg-white dark:bg-black/50">
              <CardHeader>
                <CardTitle className="text-lg">Subjects Overview</CardTitle>
                <CardDescription>Average performance per subject</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {subjectsProgress.map((sub, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-semibold">{sub.name}</span>
                      <span className="text-muted-foreground">{sub.percentage}%</span>
                    </div>
                    <Progress value={sub.percentage} className="h-1.5" />
                    <p className="text-xs text-muted-foreground">{sub.logsCount} session log(s) available</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Logs Timeline */}
            <Card className="col-span-2 border-none shadow-md bg-white dark:bg-black/50">
              <CardHeader>
                <CardTitle className="text-lg">Timeline Feedback & Updates</CardTitle>
                <CardDescription>Detailed session progress reports compiled by your tutors.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6 relative border-l-2 pl-6 ml-3 border-border">
                  {progressLogs.map((log: any) => (
                    <div key={log._id} className="relative group">
                      {/* Timeline dot */}
                      <div className="absolute -left-[31px] bg-background border-2 border-primary p-1 rounded-full text-primary group-hover:scale-115 transition-transform">
                        <CheckCircle2 className="h-3 w-3" />
                      </div>
                      
                      <div className="bg-muted/30 p-5 rounded-2xl border border-border/40 hover:bg-muted/50 transition-colors">
                        <div className="flex justify-between items-start flex-wrap gap-2">
                          <div>
                            <span className="text-xs font-semibold uppercase tracking-wider text-primary px-2.5 py-0.5 rounded-full bg-primary/10">
                              {log.subject}
                            </span>
                            <h3 className="font-bold text-foreground text-base mt-2">
                              Topics: {log.topicsCovered?.join(', ') || 'General Review'}
                            </h3>
                          </div>
                          <span className="text-xs text-muted-foreground font-medium">
                            {new Date(log.updatedAt).toLocaleDateString()}
                          </span>
                        </div>

                        {log.notes && (
                          <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                            <strong>Tutor Notes:</strong> {log.notes}
                          </p>
                        )}

                        {log.feedback && (
                          <div className="mt-3 bg-card p-3 rounded-xl border border-border/60 text-sm italic text-foreground">
                            <strong>Feedback:</strong> &ldquo;{log.feedback}&rdquo;
                          </div>
                        )}

                        <div className="flex items-center gap-4 mt-4 text-xs font-medium text-muted-foreground">
                          <span>Status: <strong className={log.status === 'Completed' ? 'text-green-600' : 'text-primary'}>{log.status}</strong></span>
                          <span>•</span>
                          <span>Completion: <strong>{log.completionPercentage}%</strong></span>
                          <span>•</span>
                          <span>Tutor: {log.tutor?.name || 'Tutor'}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      ) : (
        <Card className="text-center py-20 bg-muted/10 border-2 border-dashed">
          <CardContent>
            <Award className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-bold mb-2">No Progress Recorded Yet</h3>
            <p className="text-muted-foreground max-w-sm mx-auto">
              Once you complete scheduled tutoring sessions, your tutors will compile progress reports and feedback here.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
