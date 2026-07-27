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
    } catch (err: unknown) {
      console.error(err);
      const message = err && typeof err === 'object' && 'response' in err
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
        : undefined;
      setError(message || 'Registration failed. Please check your credentials and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-slate-50 py-12 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-96 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-blue-100/40 via-slate-50 to-slate-50 -z-10" />

      <Card className="w-full max-w-lg shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 rounded-3xl bg-white relative z-10">
        <CardHeader className="space-y-3 text-center pt-10 pb-6">
          <div className="flex justify-center mb-2">
            <div className="bg-blue-50 text-blue-600 p-4 rounded-2xl">
              <BookOpen className="h-8 w-8" />
            </div>
          </div>
          <CardTitle className="text-3xl font-extrabold tracking-tight text-slate-900">Create an account</CardTitle>
          <CardDescription className="text-slate-500 text-base">
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
              variant="outline"
              className={`flex-1 h-12 rounded-xl font-semibold border-2 transition-all ${role === 'student' ? 'border-blue-600 text-blue-600 bg-blue-50/50' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
              onClick={() => setRole('student')}
            >
              I am a Student
            </Button>
            <Button
              type="button"
              variant="outline"
              className={`flex-1 h-12 rounded-xl font-semibold border-2 transition-all ${role === 'tutor' ? 'border-blue-600 text-blue-600 bg-blue-50/50' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
              onClick={() => setRole('tutor')}
            >
              I am a Tutor
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-semibold text-slate-900">Full Name</label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="h-12 rounded-xl bg-slate-50 border-slate-200"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-semibold text-slate-900">Email</label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 rounded-xl bg-slate-50 border-slate-200"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-semibold text-slate-900">Password</label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12 rounded-xl bg-slate-50 border-slate-200"
                minLength={8}
              />
            </div>
            <Button type="submit" className="w-full h-12 text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md shadow-blue-500/20 mt-4" disabled={isLoading}>
              {isLoading ? 'Creating account...' : 'Sign up'}
            </Button>
            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or</span>
              </div>
            </div>
            <Button asChild type="button" variant="outline" className="w-full h-11 text-base">
              <Link href={`/api/auth/google?role=${role}`}>
                <span className="mr-2 flex h-5 w-5 items-center justify-center rounded-full border text-xs font-semibold">G</span>
                Continue with Google
              </Link>
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center border-t border-slate-100 p-8">
          <p className="text-slate-500 font-medium">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-600 font-bold hover:underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
