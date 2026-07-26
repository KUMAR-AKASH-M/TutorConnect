"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { 
  GraduationCap, 
  Search, 
  Calendar, 
  TrendingUp, 
  CreditCard, 
  UserCheck, 
  ShieldCheck, 
  Eye, 
  Check 
} from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  const offers = [
    { icon: Search, text: "Find expert tutors by subject and expertise" },
    { icon: Calendar, text: "Easy session booking and scheduling" },
    { icon: TrendingUp, text: "Track learning progress and achievements" },
    { icon: CreditCard, text: "Secure payment management" },
    { icon: UserCheck, text: "Professional tutor profiles" },
    { icon: GraduationCap, text: "Personalized learning experience" },
    { icon: ShieldCheck, text: "Secure authentication and privacy" },
  ];

  const benefits = [
    "Verified and experienced tutors",
    "Simple and user-friendly interface",
    "Flexible scheduling",
    "Progress tracking dashboard",
    "Secure and reliable platform",
    "Responsive across desktop and mobile devices",
  ];

  const steps = [
    { num: "1", title: "Create Account", desc: "Sign up as a student or tutor." },
    { num: "2", title: "Search Tutors", desc: "Filter by subject or rates." },
    { num: "3", title: "Check Availability", desc: "View tutor calendars." },
    { num: "4", title: "Book a Lesson", desc: "Schedule a convenient slot." },
    { num: "5", title: "Learn & Track", desc: "Connect in virtual sessions." },
    { num: "6", title: "Leave a Review", desc: "Share feedback after lessons." },
  ];

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden pb-16">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-blue-100/60 via-slate-50 to-slate-50 -z-10" />

      {/* 1. Hero Section */}
      <section className="relative overflow-hidden py-20 mb-10">
        <div className="container mx-auto px-4 text-center max-w-3xl space-y-6 relative z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-6">
            About TutorConnect
          </h1>
          <p className="text-lg md:text-xl text-slate-600 leading-relaxed font-medium">
            Empowering students to achieve their learning goals by connecting them with qualified tutors through a simple, secure, and interactive online platform.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 max-w-5xl space-y-24 relative z-10">
        {/* 2. Who We Are & 3. Our Mission */}
        <section className="grid md:grid-cols-2 gap-12 items-start">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Who We Are</h2>
            <div className="space-y-4 text-slate-600 leading-relaxed text-sm md:text-base">
              <p>
                TutorConnect is an online tutoring platform designed to make quality education accessible to everyone. Our platform connects students with experienced tutors across various subjects, enabling personalized learning through scheduled one-on-one sessions.
              </p>
              <p>
                We aim to simplify the learning process by providing an intuitive platform where students can discover tutors, book sessions, track their progress, and manage payments, while tutors can efficiently organize their teaching schedules and monitor student performance.
              </p>
            </div>
          </div>

          <div className="bg-white border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl p-8 md:p-10 space-y-4">
            <h2 className="text-2xl font-bold tracking-tight text-blue-600">Our Mission</h2>
            <p className="text-slate-600 leading-relaxed text-sm md:text-base">
              Our mission is to bridge the gap between students and skilled educators by creating a reliable, secure, and technology-driven learning environment that promotes academic growth and lifelong learning.
            </p>
          </div>
        </section>

        {/* 4. What We Offer */}
        <section className="space-y-8 bg-white p-10 rounded-3xl shadow-sm border border-slate-100">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">What We Offer</h2>
            <p className="text-slate-500 mt-2">Core features designed for a seamless educational journey.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto">
            {offers.map((offer, idx) => {
              const Icon = offer.icon;
              return (
                <div key={idx} className="flex items-center gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100 hover:bg-blue-50/50 hover:border-blue-100 transition-colors">
                  <div className="bg-blue-100 text-blue-600 p-2.5 rounded-lg shrink-0">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-medium text-slate-700 leading-snug">{offer.text}</span>
                </div>
              );
            })}
          </div>
        </section>

        {/* 5. Why Choose Us? */}
        <section className="grid md:grid-cols-2 gap-12 items-center bg-white border border-slate-100 rounded-3xl p-8 md:p-12 shadow-sm">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Why Choose Us?</h2>
            <div className="grid gap-4">
              {benefits.map((benefit, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <div className="bg-green-100 text-green-600 p-2 rounded-full shrink-0">
                    <Check className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-semibold text-slate-700">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative aspect-video rounded-2xl overflow-hidden shadow-lg border border-slate-200">
            <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80" alt="Students studying together" className="object-cover h-full w-full" />
          </div>
        </section>

        {/* 6. How It Works */}
        <section className="space-y-10">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">How It Works</h2>
            <p className="text-slate-500 mt-2">Your step-by-step path to getting started.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {steps.map((step, idx) => (
              <Card key={idx} className="border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white rounded-3xl hover:shadow-md transition-shadow">
                <CardHeader className="pb-3 flex flex-row justify-between items-start">
                  <span className="text-4xl font-black text-blue-100">{step.num}</span>
                </CardHeader>
                <CardContent className="space-y-2">
                  <h3 className="font-bold text-lg text-slate-900">{step.title}</h3>
                  <p className="text-sm text-slate-500 leading-normal">{step.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* 7. Our Vision */}
        <section className="text-center max-w-3xl mx-auto space-y-6 bg-white p-12 rounded-3xl border border-slate-100 shadow-sm">
          <div className="bg-blue-50 text-blue-600 p-4 rounded-full w-fit mx-auto"><Eye className="h-8 w-8" /></div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Our Vision</h2>
          <p className="text-slate-600 leading-relaxed text-sm md:text-base">
            We envision a future where every student has access to high-quality education regardless of location. By leveraging technology, we strive to create a learning ecosystem that fosters collaboration, continuous improvement, and academic excellence.
          </p>
        </section>

        {/* 8. Call to Action */}
        <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-[2.5rem] p-10 md:p-16 text-center space-y-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
          
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to start learning?</h2>
            <p className="max-w-xl mx-auto text-base text-blue-100 leading-relaxed mb-8">
              Join TutorConnect today and connect with experienced tutors who can help you achieve your academic goals.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/tutors">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 font-bold rounded-xl px-8 h-14 shadow-lg text-base">
                  Find a Tutor
                </Button>
              </Link>
              <Link href="/register">
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 font-bold rounded-xl px-8 h-14 text-base bg-transparent">
                  Become a Tutor
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
