"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GraduationCap, Menu, X, User as UserIcon, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { getCurrentUser, logout } from '@/services/api';
import { User } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // We'll re-fetch the user if the pathname changes as a simple way to update state after login
  const { data: userResponse, refetch } = useQuery({
    queryKey: ['currentUser', pathname],
    queryFn: getCurrentUser,
    retry: false,
  });

  const user: User | null = userResponse?.data || null;

  const handleLogout = async () => {
    await logout();
    refetch();
    router.push('/');
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/tutors', label: 'Find a Tutor' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-200 shadow-sm transition-all duration-300">
      <div className="container mx-auto max-w-7xl px-4 flex h-20 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-blue-600">
              <GraduationCap className="h-7 w-7" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">TutorConnect</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-semibold transition-all hover:text-blue-600 relative py-2 ${
                pathname === link.href ? 'text-blue-600 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-blue-600 after:rounded-full' : 'text-slate-600'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <Link href={`/${user.role}`}>
                <Button variant="ghost" className="gap-2 font-bold text-slate-700 hover:text-blue-600 hover:bg-blue-50">
                  <UserIcon className="h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              <Button variant="outline" onClick={handleLogout} className="gap-2 font-bold text-slate-700 hover:text-red-600 hover:bg-red-50 hover:border-red-200 shadow-sm">
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" className="font-bold text-slate-700 hover:text-blue-600 hover:bg-blue-50 h-10 px-6 rounded-xl">Log in</Button>
              </Link>
              <Link href="/register">
                <Button className="font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-7 h-10 shadow-md shadow-blue-600/20">Sign up</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 text-slate-600 hover:text-slate-900"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b bg-background p-4 absolute top-16 left-0 right-0 shadow-lg">
          <nav className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-sm font-medium ${
                  pathname === link.href ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="h-px bg-border my-2" />
            {user ? (
              <>
                <Link href={`/${user.role}`} onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full justify-start gap-2 font-bold text-slate-700 hover:text-blue-600 hover:bg-blue-50">
                    <UserIcon className="h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
                <Button variant="outline" className="w-full justify-start gap-2 font-bold text-slate-700 hover:text-red-600 hover:bg-red-50 hover:border-red-200" onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}>
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              <div className="flex flex-col gap-2">
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full">Log in</Button>
                </Link>
                <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="w-full">Sign up</Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
