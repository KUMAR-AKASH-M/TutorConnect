"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { getTutors } from '@/services/api';
import { Tutor } from '@/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Search, Star, Filter } from 'lucide-react';

export default function BrowseTutorsPage() {
  const { data: response, isLoading } = useQuery({
    queryKey: ['tutors'],
    queryFn: getTutors,
  });

  const tutors: Tutor[] = response?.data || [];
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredTutors = tutors.filter(tutor => 
    tutor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tutor.subjects.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Find Your Perfect Tutor</h1>
          <p className="text-muted-foreground">Browse through our expert educators and book a session.</p>
        </div>
        
        <div className="flex w-full md:w-auto gap-2">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search subjects or names..."
              className="pl-9 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="h-32 bg-muted/50 rounded-t-xl" />
              <CardContent className="h-32" />
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTutors.map((tutor) => (
            <Card key={tutor.id} className="overflow-hidden flex flex-col hover:shadow-md transition-shadow">
              <CardHeader className="p-0">
                <div className="h-24 bg-primary/5 relative">
                  <img 
                    src={tutor.avatar} 
                    alt={tutor.name} 
                    className="w-16 h-16 rounded-full border-2 border-background absolute -bottom-8 left-6 object-cover bg-white"
                  />
                </div>
                <div className="pt-10 pb-4 px-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{tutor.name}</CardTitle>
                      <CardDescription className="flex items-center gap-1 mt-1 text-amber-500 font-medium">
                        <Star className="h-3.5 w-3.5 fill-current" />
                        {tutor.rating} ({tutor.reviewsCount})
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <span className="font-bold">${tutor.hourlyRate}</span>
                      <span className="text-muted-foreground text-xs block">/hr</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-6 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{tutor.bio}</p>
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {tutor.subjects.slice(0, 3).map(subject => (
                      <span key={subject} className="px-2 py-0.5 bg-secondary text-secondary-foreground rounded text-xs">
                        {subject}
                      </span>
                    ))}
                    {tutor.subjects.length > 3 && (
                      <span className="px-2 py-0.5 bg-secondary text-secondary-foreground rounded text-xs">
                        +{tutor.subjects.length - 3}
                      </span>
                    )}
                  </div>
                </div>
                <Link href={`/tutors/${tutor.id}`} className="w-full block">
                  <Button className="w-full" variant="outline">View Profile</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
          
          {filteredTutors.length === 0 && (
            <div className="col-span-full py-12 text-center">
              <p className="text-muted-foreground">No tutors found matching your search.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
