"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { getTutors } from '@/services/api';
import { Tutor } from '@/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Star, Filter, Heart, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const SUBJECTS = ['All Subjects', 'Math', 'Science', 'English', 'Programming', 'Physics', 'Chemistry'];

export default function BrowseTutorsPage() {
  const { data: response, isLoading } = useQuery({
    queryKey: ['tutors'],
    queryFn: getTutors,
  });

  const tutors: Tutor[] = response?.data || [];
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSubject, setActiveSubject] = useState('All Subjects');
  const [priceRange, setPriceRange] = useState(50);
  
  const filteredTutors = tutors.filter(tutor => {
    const matchesSearch = tutor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tutor.subjects.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesSubject = activeSubject === 'All Subjects' || tutor.subjects.includes(activeSubject);
    const matchesPrice = tutor.hourlyRate <= priceRange;
    
    return matchesSearch && matchesSubject && matchesPrice;
  });

  return (
    <div className="min-h-screen bg-slate-50 py-8 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-96 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-blue-100/40 via-slate-50 to-slate-50 -z-10" />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        
        {/* Header & Search */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Browse Tutors</h1>
          <div className="flex w-full md:w-auto gap-3">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                type="search"
                placeholder="Search tutors or subjects..."
                className="pl-10 h-12 rounded-xl bg-white border-slate-200 shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="h-12 px-4 rounded-xl bg-white border-slate-200 shadow-sm flex items-center gap-2 md:hidden">
              <Filter className="h-4 w-4" /> Filters
            </Button>
            <div className="hidden md:flex items-center text-sm font-medium text-slate-500">
              Sort by: <span className="text-slate-900 ml-1 cursor-pointer">Featured</span>
            </div>
          </div>
        </div>

        {/* Subject Pills */}
        <div className="flex overflow-x-auto pb-4 mb-6 gap-2 hide-scrollbar">
          {SUBJECTS.map(subject => (
            <button
              key={subject}
              onClick={() => setActiveSubject(subject)}
              className={cn(
                "px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all",
                activeSubject === subject 
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" 
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              )}
            >
              {subject}
            </button>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar Filters */}
          <div className="w-full lg:w-64 shrink-0 hidden md:block">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm sticky top-24">
              <h3 className="font-bold text-slate-900 mb-6">Filters</h3>
              
              <div className="mb-8">
                <h4 className="text-sm font-semibold text-slate-900 mb-3">Subject</h4>
                <div className="relative">
                  <select className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm">
                    {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div className="mb-8">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-sm font-semibold text-slate-900">Price Range</h4>
                  <span className="text-xs font-bold text-blue-600">₹{priceRange}</span>
                </div>
                <input 
                  type="range" 
                  min="10" max="100" 
                  value={priceRange} 
                  onChange={(e) => setPriceRange(parseInt(e.target.value))}
                  className="w-full accent-blue-600"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-2 font-medium">
                  <span>₹10</span>
                  <span>₹100+</span>
                </div>
              </div>

              <div className="mb-8">
                <h4 className="text-sm font-semibold text-slate-900 mb-3">Rating</h4>
                <div className="space-y-3">
                  {['4.5+', '4.0+', '3.5+', '3.0+'].map(rating => (
                    <label key={rating} className="flex items-center gap-3 cursor-pointer group">
                      <div className="w-4 h-4 rounded border border-slate-300 group-hover:border-blue-500 flex items-center justify-center">
                        {rating === '4.5+' && <div className="w-2 h-2 bg-blue-600 rounded-sm" />}
                      </div>
                      <span className="text-sm text-slate-600">{rating}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-slate-900 mb-3">Availability</h4>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="w-4 h-4 rounded border border-slate-300 group-hover:border-blue-500" />
                  <span className="text-sm text-slate-600">Available Now</span>
                </label>
              </div>
            </div>
          </div>

          {/* Tutor List */}
          <div className="flex-1 space-y-4">
            {isLoading ? (
              [1, 2, 3].map(i => (
                <div key={i} className="bg-white h-40 rounded-2xl animate-pulse border border-slate-100" />
              ))
            ) : filteredTutors.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-2xl border border-slate-100">
                <p className="text-slate-500 font-medium">No tutors found matching your criteria.</p>
              </div>
            ) : (
              filteredTutors.map((tutor) => (
                <Card key={tutor.id} className="border border-slate-100 shadow-sm hover:shadow-md transition-shadow bg-white rounded-2xl overflow-hidden group">
                  <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-6">
                    {/* Avatar */}
                    <div className="relative shrink-0">
                      <img 
                        src={tutor.avatar} 
                        alt={tutor.name} 
                        className="w-24 h-24 sm:w-20 sm:h-20 rounded-2xl object-cover bg-slate-100"
                      />
                      <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1">
                        <CheckCircle2 className="h-5 w-5 text-blue-600" />
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-bold text-xl text-slate-900 truncate">{tutor.name}</h3>
                          <p className="text-slate-500 text-sm mb-2 truncate">
                            {tutor.subjects.join(', ')}
                          </p>
                        </div>
                        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-red-500 shrink-0">
                          <Heart className="h-5 w-5" />
                        </Button>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-sm mt-1">
                        <div className="flex items-center gap-1 font-semibold text-slate-700">
                          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                          {tutor.rating} <span className="text-slate-400 font-normal">({tutor.reviewsCount})</span>
                        </div>
                        <div className="flex items-center gap-2 text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded-md">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Available Now
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-row sm:flex-col items-center justify-between sm:justify-center w-full sm:w-32 gap-3 shrink-0 pt-4 sm:pt-0 border-t sm:border-t-0 sm:border-l border-slate-100 sm:pl-6">
                      <div className="text-center">
                        <span className="font-bold text-xl text-slate-900">₹{tutor.hourlyRate}</span>
                        <span className="text-slate-500 text-xs">/ hour</span>
                      </div>
                      <Link href={`/tutors/${tutor.id}`} className="w-full">
                        <Button variant="outline" className="w-full text-blue-600 border-blue-200 hover:bg-blue-50 font-semibold rounded-lg">
                          View Profile
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
