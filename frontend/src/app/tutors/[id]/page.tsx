"use client";

import { useQuery } from '@tanstack/react-query';
import { getTutorById } from '@/services/api';
import { Tutor } from '@/types';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Star, GraduationCap, Clock, Languages, ArrowLeft, Video } from 'lucide-react';
import Link from 'next/link';
import { use } from 'react';

export default function TutorProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  
  const { data: response, isLoading, error } = useQuery({
    queryKey: ['tutor', id],
    queryFn: () => getTutorById(id as string),
  });

  const tutor: Tutor | undefined = response?.data;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 animate-pulse">
        <div className="h-48 bg-muted/50 rounded-xl mb-8" />
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
            <div className="h-64 bg-muted/50 rounded-xl" />
          </div>
          <div className="h-96 bg-muted/50 rounded-xl" />
        </div>
      </div>
    );
  }

  if (error || !tutor) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold mb-4">Tutor Not Found</h2>
        <p className="text-muted-foreground mb-8">The tutor you are looking for does not exist or has been removed.</p>
        <Link href="/tutors">
          <Button>Back to Tutors</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <Button variant="ghost" onClick={() => router.back()} className="mb-6 -ml-4 text-muted-foreground">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>

      {/* Header Profile Section */}
      <div className="bg-card border rounded-2xl p-6 md:p-10 mb-8 flex flex-col md:flex-row gap-8 items-start relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2" />
        
        <img 
          src={tutor.avatar} 
          alt={tutor.name} 
          className="w-32 h-32 md:w-48 md:h-48 rounded-2xl object-cover border-4 border-background shadow-lg"
        />
        
        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">{tutor.name}</h1>
              <div className="flex items-center gap-2 text-amber-500 font-medium bg-amber-500/10 w-fit px-3 py-1 rounded-full text-sm">
                <Star className="h-4 w-4 fill-current" />
                {tutor.rating} ({tutor.reviewsCount} reviews)
              </div>
            </div>
            <div className="text-left md:text-right bg-secondary px-6 py-4 rounded-xl">
              <span className="text-3xl font-bold">${tutor.hourlyRate}</span>
              <span className="text-muted-foreground">/hour</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {tutor.subjects.map(subject => (
              <span key={subject} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                {subject}
              </span>
            ))}
          </div>
          
          <p className="text-lg text-muted-foreground leading-relaxed">
            {tutor.bio}
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-6">About Me</h2>
            <Card>
              <CardContent className="p-6 prose dark:prose-invert max-w-none">
                <p>
                  Hi, I&apos;m {tutor.name}. I have {tutor.experience} years of experience teaching {tutor.subjects.join(' and ')}. 
                  My teaching philosophy focuses on understanding core concepts rather than memorization. 
                  I tailor my lessons to each student&apos;s unique learning style and pace.
                </p>
                <p>
                  Whether you&apos;re preparing for an exam or just want to improve your understanding, 
                  I&apos;m here to help you achieve your goals. Let&apos;s start learning together!
                </p>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6">Qualifications</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {tutor.qualifications.map((qual, i) => (
                <div key={i} className="flex items-start gap-3 bg-muted/30 p-4 rounded-xl border">
                  <div className="bg-background p-2 rounded-lg border shadow-sm text-primary">
                    <GraduationCap className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">{qual}</p>
                    <p className="text-sm text-muted-foreground">Verified Certificate</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="sticky top-24 border-primary/20 shadow-md">
            <CardHeader>
              <CardTitle>Book a Session</CardTitle>
              <CardDescription>Select a time to start learning</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <Video className="h-5 w-5 text-muted-foreground" />
                <span>1-on-1 Online Video Session</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <span>60 minutes per session</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Languages className="h-5 w-5 text-muted-foreground" />
                <span>English, Spanish</span>
              </div>
              
              <div className="pt-4 mt-4 border-t border-border">
                <Link href={`/student/book?tutor=${tutor.id}`}>
                  <Button className="w-full text-base h-12" size="lg">
                    Book Now
                  </Button>
                </Link>
                <p className="text-xs text-center text-muted-foreground mt-3">
                  You won&apos;t be charged yet
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
