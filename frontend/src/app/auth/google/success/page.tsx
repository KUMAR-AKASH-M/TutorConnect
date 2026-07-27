"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useQueryClient } from '@tanstack/react-query';

const normalizeRole = (role: string | null) => {
  const normalizedRole = role?.toLowerCase();

  if (normalizedRole === 'client' || normalizedRole === 'student') {
    return 'student';
  }

  if (normalizedRole === 'tutor' || normalizedRole === 'admin') {
    return normalizedRole;
  }

  return null;
};

export default function GoogleAuthSuccessPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [error, setError] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const errorMessage = params.get('error');
    const role = normalizeRole(params.get('role'));

    if (errorMessage) {
      setError(errorMessage);
      return;
    }

    if (role) {
      localStorage.setItem('tutorconnect_role', role);
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      router.replace(`/${role}`);
      return;
    }

    setError('Google sign-in did not return an account role.');
  }, [queryClient, router]);

  return (
    <div className="flex min-h-[calc(100vh-16rem)] items-center justify-center px-4">
      <Card className="w-full max-w-md border-border/50 shadow-lg">
        <CardHeader className="text-center">
          <CardTitle>{error ? 'Google sign-in failed' : 'Signing you in'}</CardTitle>
          <CardDescription>
            {error || 'Taking you to your TutorConnect dashboard.'}
          </CardDescription>
        </CardHeader>
        {error && (
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/login">Back to sign in</Link>
            </Button>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
