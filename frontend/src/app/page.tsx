"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Search, Star, CheckCircle2, PlayCircle, Users, BookOpen, Clock, Trophy } from 'lucide-react';
import { motion, Variants } from 'framer-motion';

const featuredTutors = [
  {
    id: 't1',
    name: 'Priya Sharma',
    subject: 'Mathematics',
    rating: 4.9,
    reviewsCount: 142,
    hourlyRate: 45,
    avatar: '/tutors/indian_tutor_1_1785045831493.png'
  },
  {
    id: 't2',
    name: 'Rahul Patel',
    subject: 'Computer Science',
    rating: 5.0,
    reviewsCount: 89,
    hourlyRate: 60,
    avatar: '/tutors/indian_tutor_2_1785045845331.png'
  },
  {
    id: 't3',
    name: 'Ananya Desai',
    subject: 'English Literature',
    rating: 4.8,
    reviewsCount: 201,
    hourlyRate: 35,
    avatar: '/tutors/indian_tutor_3_1785045860150.png'
  },
  {
    id: 't4',
    name: 'Vikram Singh',
    subject: 'Chemistry',
    rating: 4.7,
    reviewsCount: 156,
    hourlyRate: 50,
    avatar: '/tutors/indian_tutor_4_1785045872223.png'
  }
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden bg-white">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-blue-50/80 via-white to-white -z-10" />
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-blue-100/40 rounded-full blur-3xl -z-10 -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-indigo-50/40 rounded-full blur-3xl -z-10 translate-y-1/2 -translate-x-1/3" />
        
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-2xl">
              <motion.div variants={fadeUp} className="mb-6 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-semibold">
                <span>#1 Online Tutoring Platform</span>
              </motion.div>
              
              <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
                Learn. Connect.<br/>
                Succeed with<br/>
                <span className="text-blue-600">Expert Tutors</span>
              </motion.h1>
              
              <motion.p variants={fadeUp} className="text-lg text-slate-600 mb-10 max-w-lg leading-relaxed">
                Find the perfect tutor, book sessions, and achieve your academic goals with personalized learning.
              </motion.p>
              
              <motion.div variants={fadeUp} className="bg-white p-2 rounded-2xl shadow-lg border border-slate-100 flex items-center mb-8 max-w-lg">
                <Search className="h-5 w-5 text-slate-400 ml-3 shrink-0" />
                <input 
                  type="text" 
                  placeholder="Search for a subject or tutor..." 
                  className="flex-1 bg-transparent border-none outline-none px-4 text-slate-700"
                />
                <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-8 h-12 font-semibold">
                  Search
                </Button>
              </motion.div>

              <motion.div variants={fadeUp} className="flex items-center gap-4 text-sm font-medium text-slate-500">
                <span>Popular:</span>
                <div className="flex gap-2">
                  {['Math', 'Science', 'English', 'Programming', 'Physics'].map(tag => (
                    <span key={tag} className="text-blue-600 bg-blue-50 px-3 py-1 rounded-full cursor-pointer hover:bg-blue-100 transition-colors">
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            </motion.div>

            {/* Right Content - Hero Image & Floating Cards */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative hidden md:block"
            >
              <div className="relative w-full aspect-square max-w-lg mx-auto">
                <div className="absolute inset-0 bg-blue-100 rounded-full scale-90 -z-10 translate-x-4 translate-y-4" />
                <img 
                  src="/hero_student.png" 
                  alt="Student learning online" 
                  className="w-full h-full object-cover rounded-full shadow-2xl border-8 border-white"
                />
                
                {/* Floating Widget 1 */}
                <div className="absolute top-12 -left-12 bg-white/95 backdrop-blur-md p-4 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100 flex items-center gap-4 animate-bounce hover:scale-105 transition-transform cursor-pointer" style={{ animationDuration: '3s' }}>
                  <div className="relative">
                    <img src="/tutors/indian_tutor_1_1785045831493.png" className="w-14 h-14 rounded-full object-cover border-2 border-blue-500 p-0.5" alt="Tutor" />
                    <div className="absolute bottom-0 right-0 bg-green-500 w-4 h-4 rounded-full border-2 border-white" />
                  </div>
                  <div className="pr-4">
                    <p className="font-bold text-slate-900 text-sm flex items-center gap-1">Kavya Patel <CheckCircle2 className="w-4 h-4 text-blue-500" /></p>
                    <p className="text-blue-600 font-medium text-xs mt-0.5">Expert Math Tutor</p>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <div className="flex">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      </div>
                      <span className="text-xs font-bold text-slate-700">5.0</span>
                    </div>
                  </div>
                </div>

                {/* Floating Widget 2 */}
                <div className="absolute bottom-24 -right-8 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-3 animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>
                  <div className="bg-green-100 p-2 rounded-lg">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">Session Booked</p>
                    <p className="text-slate-500 text-xs">Today, 10:00 AM</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Feature Badges */}
      <section className="bg-white border-b py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            {[
              { icon: CheckCircle2, title: "Verified Tutors", desc: "All tutors are verified and experienced" },
              { icon: Clock, title: "Flexible Learning", desc: "Book sessions that fit your schedule" },
              { icon: PlayCircle, title: "Progress Tracking", desc: "Track your learning and achievements" }
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-4 max-w-xs">
                <div className="bg-blue-50 p-3 rounded-2xl text-blue-600 shrink-0">
                  <feature.icon className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{feature.title}</h4>
                  <p className="text-slate-500 text-xs mt-0.5">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Tutors */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex justify-between items-end mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900">Featured Tutors</h2>
            <Link href="/tutors" className="text-blue-600 font-semibold hover:underline">
              View all tutors
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredTutors.map((tutor) => (
              <Card key={tutor.id} className="border-0 shadow-sm hover:shadow-md transition-shadow bg-white rounded-2xl overflow-hidden cursor-pointer group">
                <CardContent className="p-0">
                  <div className="bg-slate-100 h-32 relative flex justify-center">
                    <img 
                      src={tutor.avatar} 
                      alt={tutor.name} 
                      className="w-20 h-20 rounded-full border-4 border-white absolute -bottom-10 object-cover shadow-sm group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="pt-14 pb-6 px-6 text-center">
                    <h3 className="font-bold text-lg text-slate-900">{tutor.name}</h3>
                    <p className="text-slate-500 text-sm mb-3">{tutor.subject} Tutor</p>
                    
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                      <div className="flex items-center gap-1 text-sm font-semibold text-slate-700">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        {tutor.rating} <span className="text-slate-400 font-normal">({tutor.reviewsCount})</span>
                      </div>
                      <div className="font-bold text-slate-900">
                        ₹{tutor.hourlyRate} <span className="text-slate-400 text-sm font-normal">/ hour</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900">How it Works</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-10 left-[12%] right-[12%] h-px bg-slate-200 -z-10" />

            {[
              { num: 1, icon: Search, title: "Find a Tutor", desc: "Search and filter tutors based on your needs." },
              { num: 2, icon: Clock, title: "Book a Session", desc: "Choose a time and book your session." },
              { num: 3, icon: BookOpen, title: "Learn & Grow", desc: "Attend sessions and track your progress." },
              { num: 4, icon: Trophy, title: "Achieve Goals", desc: "Reach your academic goals with confidence." }
            ].map((step, i) => (
              <div key={i} className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-20 w-20 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shadow-sm border border-blue-100 z-10">
                    <span className="text-2xl font-bold">{step.num}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{step.num}. {step.title}</h3>
                  </div>
                </div>
                <p className="text-slate-500 text-sm pl-2">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Testimonial & CTA */}
      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="bg-linear-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] rounded-[2.5rem] p-10 md:p-16 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12 shadow-2xl shadow-blue-900/20 border border-slate-700/50">
            {/* Glowing accents */}
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />
            
            <div className="absolute top-0 right-0 opacity-[0.03] scale-150 transform translate-x-1/4 -translate-y-1/4">
              <svg width="400" height="400" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <path fill="#ffffff" d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,81.6,-46.3C91.4,-33.5,98,-18.1,98.5,-2.5C99,13.1,93.4,28.8,83.9,41.9C74.4,55,61.1,65.5,46.7,73.1C32.3,80.7,16.1,85.4,0,85.4C-16.2,85.4,-32.3,80.8,-46.5,73.1C-60.7,65.4,-72.9,54.6,-82.1,41.5C-91.3,28.4,-97.5,13,-97.6,-2.6C-97.7,-18.2,-91.7,-34,-82.3,-46.8C-72.9,-59.6,-60.1,-69.4,-46.1,-76.6C-32.1,-83.8,-16,-88.4,0.3,-88.9C16.6,-89.4,30.6,-83.6,44.7,-76.4Z" transform="translate(100 100)" />
              </svg>
            </div>
            
            <div className="max-w-3xl relative z-10">
              <div className="text-blue-400/50 mb-8 transform -translate-x-2">
                <svg width="48" height="36" viewBox="0 0 60 45" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M26.4173 1.83626L21.4326 0C14.072 2.80521 8.3516 7.42416 4.2713 13.8569C0.244795 20.2896 -1.13961 27.6033 0.655972 35.7981L2.24715 42.6688L15.352 39.549L13.7609 32.6784C12.4414 26.9859 13.9189 22.4504 18.1934 19.072C22.4678 15.6936 27.4299 13.8797 33.0797 13.6303L35.803 13.5133L38.4116 0.814324L35.6883 0.931293C29.6738 1.18957 24.316 2.5027 19.6151 4.87063C14.9142 7.23856 10.7431 10.513 7.10185 14.6939C11.5363 10.3705 17.9747 6.0847 26.4173 1.83626ZM58.0057 1.83626L53.021 0C45.6604 2.80521 39.94 7.42416 35.8597 13.8569C31.8332 20.2896 30.4488 27.6033 32.2444 35.7981L33.8355 42.6688L46.9404 39.549L45.3493 32.6784C44.0298 26.9859 45.5073 22.4504 49.7818 19.072C54.0562 15.6936 59.0183 13.8797 64.6681 13.6303L67.3914 13.5133L70 0.814324L67.2767 0.931293C61.2622 1.18957 55.9044 2.5027 51.2035 4.87063C46.5026 7.23856 42.3315 10.513 38.6903 14.6939C43.1247 10.3705 49.5631 6.0847 58.0057 1.83626Z" />
                </svg>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-10 tracking-tight">
                "TutorConnect has helped me improve my grades and confidence. My tutor is simply amazing!"
              </h2>
              <div className="inline-flex items-center gap-4 bg-white/5 p-3 pr-8 rounded-full border border-white/10 backdrop-blur-sm">
                <img src="/akash.jpg" alt="Kumar Akash" className="w-14 h-14 rounded-full border-2 border-blue-500 shadow-lg object-cover" />
                <div>
                  <p className="font-bold text-white text-lg leading-none mb-1">Kumar Akash</p>
                  <p className="text-blue-300 font-medium text-sm">High School Student</p>
                </div>
              </div>
            </div>
            
            <div className="relative z-10 w-full md:w-auto">
              <Link href="/register">
                <Button className="w-full md:w-auto h-14 px-10 text-lg rounded-full bg-blue-600 hover:bg-blue-500 text-white shadow-xl transition-all">
                  Sign Up Today
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="mt-16 pt-10 border-t border-slate-200 grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-slate-700">
            <div>
              <div className="flex items-center justify-center gap-2 mb-2 text-blue-600">
                <Users className="h-6 w-6" />
                <span className="text-3xl font-extrabold text-slate-900">10,000+</span>
              </div>
              <p className="text-sm font-semibold">Students</p>
            </div>
            <div>
              <div className="flex items-center justify-center gap-2 mb-2 text-blue-600">
                <Users className="h-6 w-6" />
                <span className="text-3xl font-extrabold text-slate-900">2,000+</span>
              </div>
              <p className="text-sm font-semibold">Expert Tutors</p>
            </div>
            <div>
              <div className="flex items-center justify-center gap-2 mb-2 text-blue-600">
                <BookOpen className="h-6 w-6" />
                <span className="text-3xl font-extrabold text-slate-900">50,000+</span>
              </div>
              <p className="text-sm font-semibold">Sessions Completed</p>
            </div>
            <div>
              <div className="flex items-center justify-center gap-2 mb-2 text-blue-600">
                <CheckCircle2 className="h-6 w-6" />
                <span className="text-3xl font-extrabold text-slate-900">98%</span>
              </div>
              <p className="text-sm font-semibold">Satisfaction Rate</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
