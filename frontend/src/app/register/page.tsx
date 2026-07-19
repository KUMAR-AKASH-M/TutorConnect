"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { signup } from '@/services/api';
import { BookOpen } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

export default function RegisterPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'student' | 'tutor'>('student');

  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await signup({ name, email, password, role });
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      
      router.push(`/${role}`);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Registration failed. Please check your credentials and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-16rem)] px-4 py-12">
      <Card className="w-full max-w-md shadow-lg border-border/50">
        <CardHeader className="space-y-2 text-center pb-6">
          <div className="flex justify-center mb-4">
            <div className="bg-primary/10 text-primary p-3 rounded-full">
              <BookOpen className="h-8 w-8" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Create an account</CardTitle>
          <CardDescription>
            Join TutorConnect to start your learning journey.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg mb-6 text-center font-medium border border-destructive/20 animate-pulse">
              {error}
            </div>
          )}
          <div className="flex gap-4 mb-6">
            <Button
              type="button"
              variant={role === 'student' ? 'default' : 'outline'}
              className="flex-1"
              onClick={() => setRole('student')}
            >
              I am a Student
            </Button>
            <Button
              type="button"
              variant={role === 'tutor' ? 'default' : 'outline'}
              className="flex-1"
              onClick={() => setRole('tutor')}
            >
              I am a Tutor
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">Full Name</label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">Password</label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11"
                minLength={8}
              />
            </div>
            <Button type="submit" className="w-full h-11 text-base mt-2" disabled={isLoading}>
              {isLoading ? 'Creating account...' : 'Sign up'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center border-t p-6">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
