"use client";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Phone, MapPin, Github, Linkedin } from 'lucide-react';

export default function ContactPage() {
  const team = [
    {
      name: "Aditya Kumar",
      github: "https://github.com/adityak71",
      linkedin: "https://www.linkedin.com/in/aditya-kumar-lpu"
    },
    {
      name: "Kumar Akash",
      github: "https://github.com/KUMAR-AKASH-M",
      linkedin: "https://www.linkedin.com/in/kumar-akash01"
    },
    {
      name: "Gourob Karmakar",
      github: "https://github.com/Gourob-karmakar",
      linkedin: "https://www.linkedin.com/in/gourobkarmakar"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-16 md:py-24 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-96 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-blue-100/40 via-slate-50 to-slate-50 -z-10" />

      <div className="container mx-auto px-4 max-w-5xl relative z-10">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">Get in Touch</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Have a question or feedback? We'd love to hear from you. Fill out the form below or reach out directly to our team.
          </p>
        </div>

        <div className="grid md:grid-cols-5 gap-8 lg:gap-12 mb-16">
          {/* Contact Info */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col gap-8 h-full">
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-6">Contact Information</h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-50 p-3 rounded-2xl text-blue-600 shrink-0">
                      <Mail className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Email Us</p>
                      <p className="text-slate-500 text-sm mt-1">support@tutorconnect.com</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-50 p-3 rounded-2xl text-blue-600 shrink-0">
                      <Phone className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Call Us</p>
                      <p className="text-slate-500 text-sm mt-1">+1 (555) 123-4567</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-50 p-3 rounded-2xl text-blue-600 shrink-0">
                      <MapPin className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Headquarters</p>
                      <p className="text-slate-500 text-sm mt-1">123 Education Lane<br />San Francisco, CA 94105</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="md:col-span-3">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Send us a message</h3>
              <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); alert("Message sent successfully!"); }}>
                <div className="grid md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="text-sm font-semibold text-slate-900">First Name</label>
                    <Input id="firstName" placeholder="John" className="h-12 rounded-xl bg-slate-50 border-slate-200" required />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="lastName" className="text-sm font-semibold text-slate-900">Last Name</label>
                    <Input id="lastName" placeholder="Doe" className="h-12 rounded-xl bg-slate-50 border-slate-200" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-semibold text-slate-900">Email Address</label>
                  <Input id="email" type="email" placeholder="you@example.com" className="h-12 rounded-xl bg-slate-50 border-slate-200" required />
                </div>
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-semibold text-slate-900">Your Message</label>
                  <textarea 
                    id="message" 
                    className="flex min-h-[150px] w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 outline-none resize-y text-slate-900"
                    placeholder="How can we help you?"
                    required
                  />
                </div>
                <Button type="submit" className="w-full h-12 text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md shadow-blue-500/20 mt-2">
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>

        {/* Team Profiles Section */}
        <div className="mt-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Core Development Team</h2>
            <p className="text-slate-500 mt-2">Connect with the creators of TutorConnect</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {team.map((member, idx) => (
              <div key={idx} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                <div className="h-20 w-20 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-4 border border-blue-100">
                  <span className="text-2xl font-bold">{member.name.charAt(0)}</span>
                </div>
                <h4 className="font-bold text-slate-900 text-lg">{member.name}</h4>
                <p className="text-sm text-blue-600 font-medium mb-6">Software Developer</p>
                <div className="flex gap-3">
                  <a href={member.github} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors border border-slate-200">
                    <Github className="h-5 w-5" />
                  </a>
                  <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 transition-colors border border-blue-200">
                    <Linkedin className="h-5 w-5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
