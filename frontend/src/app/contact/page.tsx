"use client";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Github, Linkedin, Mail, MessageSquare } from 'lucide-react';

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
      linkedin: "https://www.linkedin.com/in/iwillupdate"
    },
    {
      name: "Gourob Karmakar",
      github: "https://github.com/Gourob-karmakar",
      linkedin: "https://www.linkedin.com/in/gourobkarmakar"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-16 md:py-24 max-w-5xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight mb-3">Get in Touch</h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
          Have questions about TutorConnect? Send our team a message or connect with us directly.
        </p>
      </div>

      <div className="grid md:grid-cols-12 gap-8 items-start">
        {/* Contact Form (7 cols) */}
        <div className="md:col-span-7">
          <Card className="shadow-lg border-border/50">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" /> Send Message
              </CardTitle>
              <CardDescription>
                We typically respond within 24 hours.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert("Message sent successfully!"); }}>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">Name</label>
                    <Input id="name" placeholder="Your name" required className="h-11" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">Email</label>
                    <Input id="email" type="email" placeholder="you@example.com" required className="h-11" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">Message</label>
                  <textarea 
                    id="message" 
                    required
                    className="flex min-h-[140px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="How can we help you?"
                  />
                </div>
                <Button type="submit" className="w-full h-11 text-base">Send Message</Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Team profiles (5 cols) */}
        <div className="md:col-span-5 space-y-6">
          <Card className="shadow-lg border-border/50">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" /> Core Development Team
              </CardTitle>
              <CardDescription>
                Connect with the creators of TutorConnect.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {team.map((member, idx) => (
                <div key={idx} className="flex justify-between items-center bg-muted/30 p-4 rounded-xl border border-border/40 hover:bg-muted/50 transition-colors">
                  <div>
                    <h4 className="font-bold text-foreground text-base">{member.name}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">Software Developer</p>
                  </div>
                  <div className="flex gap-2">
                    <a 
                      href={member.github} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="p-2 rounded-lg bg-background hover:bg-primary/10 hover:text-primary border transition-colors"
                      title="GitHub"
                    >
                      <Github className="h-4 w-4" />
                    </a>
                    <a 
                      href={member.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="p-2 rounded-lg bg-background hover:bg-primary/10 hover:text-primary border transition-colors"
                      title="LinkedIn"
                    >
                      <Linkedin className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
