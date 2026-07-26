"use client";

import { useQuery } from '@tanstack/react-query';
import { getSessions } from '@/services/api';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Mail, Clock, Search, GraduationCap } from 'lucide-react';
import { useState } from 'react';

export default function TutorStudentsPage() {
  const { data: response, isLoading } = useQuery({
    queryKey: ['sessions'],
    queryFn: getSessions,
  });

  const sessions = response?.data || [];
  const [searchTerm, setSearchTerm] = useState('');

  const studentsMap: { [key: string]: { id: string; name: string; email: string; totalLessons: number; lastLessonDate: string } } = {};
  
  sessions.forEach((s: any) => {
    const studentId = s.studentId;
    if (!studentId) return;

    if (!studentsMap[studentId]) {
      studentsMap[studentId] = {
        id: studentId,
        name: s.studentName || 'Student',
        email: 'student@tutorconnect.com',
        totalLessons: 0,
        lastLessonDate: s.date
      };
    }
    studentsMap[studentId].totalLessons += 1;
    if (new Date(s.startTime) > new Date(studentsMap[studentId].lastLessonDate)) {
      studentsMap[studentId].lastLessonDate = s.date;
    }
  });

  const uniqueStudents = Object.values(studentsMap);
  const filteredStudents = uniqueStudents.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const avatarColors = ['bg-blue-100 text-blue-700', 'bg-emerald-100 text-emerald-700', 'bg-purple-100 text-purple-700', 'bg-amber-100 text-amber-700', 'bg-rose-100 text-rose-700'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">My Students</h1>
          <p className="text-slate-500 mt-1">Keep track of students who book lessons with you.</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="search"
            placeholder="Search students..."
            className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:ring-2 focus:ring-blue-600 outline-none text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Total Students</p>
          <div className="text-3xl font-bold text-slate-900 mt-1">{uniqueStudents.length}</div>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Total Lessons</p>
          <div className="text-3xl font-bold text-blue-600 mt-1">{sessions.length}</div>
        </div>
        <div className="col-span-2 sm:col-span-1 bg-gradient-to-br from-blue-600 to-indigo-600 p-5 rounded-3xl text-white shadow-lg shadow-blue-500/20">
          <p className="text-sm font-medium text-white/80">Avg. Lessons / Student</p>
          <div className="text-3xl font-bold mt-1">{uniqueStudents.length > 0 ? (sessions.length / uniqueStudents.length).toFixed(1) : '0'}</div>
        </div>
      </div>

      {/* Students Grid */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(i => <div key={i} className="h-44 bg-slate-100 rounded-3xl animate-pulse" />)}
        </div>
      ) : filteredStudents.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredStudents.map((student, idx) => (
            <Card key={student.id} className="border-0 shadow-sm bg-white rounded-3xl hover:shadow-md transition-shadow overflow-hidden group">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-5">
                  <div className={`h-14 w-14 rounded-2xl flex items-center justify-center font-bold text-xl shrink-0 ${avatarColors[idx % avatarColors.length]}`}>
                    {student.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-slate-900 truncate">{student.name}</h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5 truncate">
                      <Mail className="h-3 w-3 shrink-0" /> {student.email}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 p-3 rounded-2xl">
                    <p className="text-xs text-slate-500 mb-1 flex items-center gap-1"><GraduationCap className="h-3 w-3" /> Lessons</p>
                    <p className="font-bold text-slate-900">{student.totalLessons}</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-2xl">
                    <p className="text-xs text-slate-500 mb-1 flex items-center gap-1"><Clock className="h-3 w-3" /> Last Lesson</p>
                    <p className="font-bold text-slate-900 text-xs truncate">{student.lastLessonDate || 'N/A'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm text-center py-20">
          <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">
            {searchTerm ? 'No students found' : 'No students yet'}
          </h3>
          <p className="text-slate-500 text-sm">
            {searchTerm ? `No results for "${searchTerm}"` : 'Students who book sessions with you will appear here.'}
          </p>
        </div>
      )}
    </div>
  );
}
