"use client";

import { useQuery } from '@tanstack/react-query';
import { getTutorById } from '@/services/api';
import { Tutor } from '@/types';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Star, GraduationCap, Clock, MapPin, ArrowLeft, Heart, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { use, useState } from 'react';
import { cn } from '@/lib/utils';

export default function TutorProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [activeTab, setActiveTab] = useState('About');
  
  const { data: response, isLoading, error } = useQuery({
    queryKey: ['tutor', id],
    queryFn: () => getTutorById(id as string),
  });

  const tutor = response?.data as Tutor | undefined;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl animate-pulse">
        <div className="h-48 bg-white rounded-2xl mb-8 border border-slate-100" />
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-64 bg-white rounded-2xl border border-slate-100" />
          </div>
          <div className="h-96 bg-white rounded-2xl border border-slate-100" />
        </div>
      </div>
    );
  }

  if (error || !tutor) {
    return (
      <div className="container mx-auto px-4 py-24 text-center max-w-6xl">
        <h2 className="text-2xl font-bold mb-4 text-slate-900">Tutor Not Found</h2>
        <p className="text-slate-500 mb-8">The tutor you are looking for does not exist or has been removed.</p>
        <Link href="/tutors">
          <Button variant="outline" className="border-slate-200">Back to Tutors</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <button onClick={() => router.back()} className="flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 mb-6 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to tutors
        </button>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Profile Header */}
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex flex-col md:flex-row items-center md:items-start gap-8">
              <div className="relative shrink-0">
                <img 
                  src={tutor.avatar} 
                  alt={tutor.name} 
                  className="w-32 h-32 md:w-40 md:h-40 rounded-3xl object-cover bg-slate-100 shadow-md"
                />
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                  <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">{tutor.name}</h1>
                  <CheckCircle2 className="h-6 w-6 text-blue-600" />
                </div>
                
                <p className="text-lg text-slate-600 mb-4">{tutor.subjects[0]} Tutor</p>
                
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-2 text-sm text-slate-600">
                  <div className="flex items-center gap-1.5 font-semibold text-slate-900">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    {tutor.rating} <span className="text-slate-500 font-normal">({tutor.reviewsCount} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-slate-400" />
                    New York, USA
                  </div>
                  <div className="flex items-center gap-1.5">
                    <GraduationCap className="h-4 w-4 text-slate-400" />
                    200+ students
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs & Content */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="flex border-b border-slate-100 px-2 overflow-x-auto hide-scrollbar">
                {['About', 'Subjects', 'Reviews (120)', 'Availability'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      "px-6 py-4 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors",
                      activeTab === tab 
                        ? "border-blue-600 text-blue-600" 
                        : "border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300"
                    )}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              
              <div className="p-8">
                {activeTab === 'About' && (
                  <div className="space-y-10">
                    <section>
                      <h3 className="text-xl font-bold text-slate-900 mb-4">About</h3>
                      <p className="text-slate-600 leading-relaxed">
                        I have a PhD in Mathematics and over {tutor.experience} years of experience teaching students from middle school to university level. I specialize in making complex mathematical concepts easy to understand. {tutor.bio}
                      </p>
                    </section>

                    <section>
                      <h3 className="text-xl font-bold text-slate-900 mb-4">Education</h3>
                      <ul className="space-y-4 text-slate-600">
                        <li className="flex gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 shrink-0" />
                          <div>
                            <p className="font-semibold text-slate-900">PhD in Mathematics</p>
                            <p className="text-sm">MIT • 2018</p>
                          </div>
                        </li>
                        <li className="flex gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 shrink-0" />
                          <div>
                            <p className="font-semibold text-slate-900">Master in Mathematics</p>
                            <p className="text-sm">Stanford University • 2014</p>
                          </div>
                        </li>
                      </ul>
                    </section>

                    <section>
                      <h3 className="text-xl font-bold text-slate-900 mb-4">Experience</h3>
                      <ul className="space-y-4 text-slate-600">
                        <li className="flex gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 shrink-0" />
                          <div>
                            <p className="font-semibold text-slate-900">{tutor.experience}+ years teaching experience</p>
                          </div>
                        </li>
                        {tutor.qualifications.map((qual, i) => (
                          <li key={i} className="flex gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 shrink-0" />
                            <div>
                              <p className="font-semibold text-slate-900">{qual}</p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </section>
                  </div>
                )}

                {activeTab === 'Subjects' && (
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-4">Subjects I Teach</h3>
                    <div className="flex flex-wrap gap-3">
                      {tutor.subjects.map(subject => (
                        <span key={subject} className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl font-semibold text-sm">
                          {subject}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Other tabs would be implemented similarly */}
                {(activeTab === 'Reviews (120)' || activeTab === 'Availability') && (
                  <div className="py-12 text-center text-slate-500">
                    Content for {activeTab}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar - Booking & Availability */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Booking Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="text-3xl font-extrabold text-slate-900">₹{tutor.hourlyRate}</span>
                  <span className="text-slate-500 font-medium">/ hour</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <Link href={`/student/book?tutor=${tutor.id}`}>
                  <Button className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-lg transition-all shadow-md shadow-blue-600/20">
                    Book Session
                  </Button>
                </Link>
                <Button variant="outline" className="w-full h-12 border-slate-200 text-slate-700 font-semibold rounded-xl">
                  <Heart className="h-5 w-5 mr-2 text-slate-400" /> Save
                </Button>
              </div>
              
              <div className="mt-6 pt-6 border-t border-slate-100">
                <h4 className="font-bold text-slate-900 mb-4">Availability</h4>
                
                {/* Mini Calendar Widget */}
                <div className="bg-slate-50 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-4">
                    <button className="p-1 hover:bg-slate-200 rounded-md"><ChevronLeft className="h-4 w-4 text-slate-500" /></button>
                    <span className="text-sm font-bold text-slate-900">May 2024</span>
                    <button className="p-1 hover:bg-slate-200 rounded-md"><ChevronRight className="h-4 w-4 text-slate-500" /></button>
                  </div>
                  
                  <div className="grid grid-cols-5 gap-2 text-center mb-4">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map(day => (
                      <div key={day} className="text-xs font-semibold text-slate-500">{day}</div>
                    ))}
                    {[13, 14, 15, 16, 17].map(date => (
                      <div key={date} className="text-sm font-medium text-slate-900 py-1">{date}</div>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-white border border-slate-200 rounded-lg py-2 text-center text-sm font-medium text-slate-600 hover:border-blue-600 cursor-pointer">9:00 AM</div>
                    <div className="bg-blue-600 text-white rounded-lg py-2 text-center text-sm font-semibold shadow-sm cursor-pointer">10:00 AM</div>
                    <div className="bg-white border border-slate-200 rounded-lg py-2 text-center text-sm font-medium text-slate-600 hover:border-blue-600 cursor-pointer">11:00 AM</div>
                    <div className="bg-white border border-slate-200 rounded-lg py-2 text-center text-sm font-medium text-slate-600 hover:border-blue-600 cursor-pointer">2:00 PM</div>
                  </div>
                </div>
                
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
