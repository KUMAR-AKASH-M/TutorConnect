"use client";

import { useQuery } from '@tanstack/react-query';
import { getSessions } from '@/services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Mail, Clock, Calendar, Search } from 'lucide-react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';

export default function TutorStudentsPage() {
  const { data: response, isLoading } = useQuery({
    queryKey: ['sessions'],
    queryFn: getSessions,
  });

  const sessions = response?.data || [];
  const [searchTerm, setSearchTerm] = useState('');

  // Find unique students and count lessons/get last dates
  const studentsMap: { [key: string]: { id: string; name: string; email: string; totalLessons: number; lastLessonDate: string } } = {};
  
  sessions.forEach((s: any) => {
    const studentId = s.studentId;
    if (!studentId) return;

    if (!studentsMap[studentId]) {
      studentsMap[studentId] = {
        id: studentId,
        name: s.studentName || 'Student',
        email: 'student@tutorconnect.com', // fallback
        totalLessons: 0,
        lastLessonDate: s.date
      };
    }
    studentsMap[studentId].totalLessons += 1;
    // update last lesson date if newer
    if (new Date(s.startTime) > new Date(studentsMap[studentId].lastLessonDate)) {
      studentsMap[studentId].lastLessonDate = s.date;
    }
  });

  const uniqueStudents = Object.values(studentsMap);
  const filteredStudents = uniqueStudents.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Students</h1>
          <p className="text-muted-foreground">Keep track of students who book lessons with you.</p>
        </div>
        
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search students..."
            className="pl-9 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2].map(i => <Card key={i} className="animate-pulse h-40" />)}
        </div>
      ) : filteredStudents.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredStudents.map(student => (
            <Card key={student.id} className="overflow-hidden border-border/50 hover:shadow-sm transition-shadow">
              <CardHeader className="bg-muted/10 border-b pb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold">
                    {student.name.charAt(0)}
                  </div>
                  <div>
                    <CardTitle className="text-base">{student.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-0.5"><Mail className="h-3 w-3" /> {student.email}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Lessons:</span>
                  <span className="font-semibold">{student.totalLessons}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Lesson:</span>
                  <span className="font-semibold">{student.lastLessonDate}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-2xl bg-muted/10 text-muted-foreground">
          <Users className="mx-auto h-8 w-8 mb-3" />
          {searchTerm ? 'No students found matching your search.' : 'You have not taught any students yet.'}
        </div>
      )}
    </div>
  );
}
