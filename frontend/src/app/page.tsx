import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Search, Star, Users, Video, Calendar, Shield, ArrowRight } from 'lucide-react';
import { dummyTutors } from '@/utils/dummyData';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-linear-to-b from-primary/10 to-background pt-24 pb-32">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground mb-6">
            Master Any Subject with <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-blue-600">Expert Tutors</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Connect with top-rated educators globally. Book 1-on-1 personalized learning sessions and achieve your academic goals faster.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/tutors">
              <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-lg rounded-full">
                Find a Tutor <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/register">
              <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-lg rounded-full">
                Become a Tutor
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y bg-muted/30">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold text-primary mb-2">10k+</p>
              <p className="text-sm font-medium text-muted-foreground">Active Students</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary mb-2">500+</p>
              <p className="text-sm font-medium text-muted-foreground">Expert Tutors</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary mb-2">50+</p>
              <p className="text-sm font-medium text-muted-foreground">Subjects</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary mb-2">4.9/5</p>
              <p className="text-sm font-medium text-muted-foreground">Average Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Tutors */}
      <section className="py-24">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold tracking-tight mb-4">Learn from the Best</h2>
              <p className="text-muted-foreground text-lg">
                Our platform features highly qualified tutors with proven track records of student success.
              </p>
            </div>
            <Link href="/tutors" className="mt-4 md:mt-0">
              <Button variant="ghost" className="text-primary hover:text-primary hover:bg-primary/10">
                View All Tutors <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {dummyTutors.map((tutor) => (
              <Card key={tutor.id} className="overflow-hidden hover:shadow-lg transition-shadow border-border/50">
                <CardHeader className="p-0">
                  <div className="h-32 bg-linear-to-r from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 relative">
                    <img 
                      src={tutor.avatar} 
                      alt={tutor.name} 
                      className="w-24 h-24 rounded-full border-4 border-background absolute -bottom-12 left-6 object-cover bg-white"
                    />
                  </div>
                  <div className="pt-16 pb-4 px-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl mb-1">{tutor.name}</CardTitle>
                        <CardDescription className="flex items-center gap-1 text-sm font-medium text-amber-500">
                          <Star className="h-4 w-4 fill-current" />
                          {tutor.rating} ({tutor.reviewsCount} reviews)
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <span className="text-xl font-bold">${tutor.hourlyRate}</span>
                        <span className="text-muted-foreground text-sm">/hr</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="px-6">
                  <p className="text-muted-foreground text-sm line-clamp-2 mb-4">{tutor.bio}</p>
                  <div className="flex flex-wrap gap-2">
                    {tutor.subjects.slice(0, 3).map(subject => (
                      <span key={subject} className="px-2.5 py-0.5 rounded-full bg-secondary text-secondary-foreground text-xs font-medium">
                        {subject}
                      </span>
                    ))}
                    {tutor.subjects.length > 3 && (
                      <span className="px-2.5 py-0.5 rounded-full bg-secondary text-secondary-foreground text-xs font-medium">
                        +{tutor.subjects.length - 3} more
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 bg-muted/20">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-4">How TutorConnect Works</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-16">
            Get started in minutes and begin your learning journey.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 text-primary">
                <Search className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">1. Find a Tutor</h3>
              <p className="text-muted-foreground">Search by subject, price, and availability to find your perfect match.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 text-primary">
                <Calendar className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">2. Book a Session</h3>
              <p className="text-muted-foreground">Choose a time that works for you and securely book your lesson.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 text-primary">
                <Video className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">3. Start Learning</h3>
              <p className="text-muted-foreground">Connect via our integrated classroom and achieve your academic goals.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="py-24">
        <div className="container mx-auto px-4 md:px-8">
          <div className="bg-primary rounded-3xl p-8 md:p-16 text-center text-primary-foreground">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to accelerate your learning?</h2>
            <p className="text-primary-foreground/80 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of students who have already improved their grades and mastered new skills with TutorConnect.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/register">
                <Button size="lg" variant="secondary" className="h-14 px-8 text-lg rounded-full text-primary hover:bg-white w-full sm:w-auto">
                  Get Started for Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
