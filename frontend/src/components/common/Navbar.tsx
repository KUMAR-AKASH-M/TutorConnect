"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GraduationCap, Menu, X, User as UserIcon, LogOut, ChevronDown, LayoutDashboard, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { getCurrentUser, logout } from '@/services/api';
import { User } from '@/types';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { data: userResponse } = useQuery({
    queryKey: ['currentUser', pathname],
    queryFn: getCurrentUser,
    retry: false,
  });

  const user: User | null = userResponse?.data || null;

  const handleLogout = async () => {
    await logout();
    queryClient.clear();
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
            <div className="relative group">
              <button className="flex items-center gap-2.5 p-1.5 pl-3 rounded-full hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all outline-none">
                <span className="text-sm font-bold text-slate-700">{user.name.split(' ')[0]}</span>
                <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 overflow-hidden border-2 border-white shadow-sm">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <UserIcon className="h-4 w-4" />
                  )}
                </div>
                <ChevronDown className="h-4 w-4 text-slate-400 mr-1" />
              </button>

              {/* Dropdown Menu */}
              <div className="absolute right-0 top-[calc(100%+0.5rem)] w-60 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-2 group-hover:translate-y-0 overflow-hidden z-50">
                <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                  <p className="font-bold text-slate-900 truncate">{user.name}</p>
                  <p className="text-xs text-slate-500 truncate">{user.email}</p>
                </div>
                <div className="p-2 space-y-0.5">
                  <Link href={`/${user.role}`} className="flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors">
                    <LayoutDashboard className="h-4 w-4" /> Dashboard
                  </Link>
                  <Link href={`/${user.role}/profile`} className="flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors">
                    <UserIcon className="h-4 w-4" /> Edit Profile
                  </Link>
                  <Link href={`/${user.role}/settings`} className="flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors">
                    <Settings className="h-4 w-4" /> Account Settings
                  </Link>
                </div>
                <div className="p-2 border-t border-slate-100">
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors">
                    <LogOut className="h-4 w-4" /> Logout
                  </button>
                </div>
              </div>
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
        <div className="md:hidden bg-white border-b border-slate-100 p-4 absolute top-20 left-0 right-0 shadow-lg z-50">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                  pathname === link.href ? 'text-blue-600 bg-blue-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="h-px bg-slate-100 my-2" />
            {user ? (
              <>
                <Link href={`/${user.role}`} onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                  <LayoutDashboard className="h-4 w-4" /> Dashboard
                </Link>
                <Link href={`/${user.role}/profile`} onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                  <UserIcon className="h-4 w-4" /> Edit Profile
                </Link>
                <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors">
                  <LogOut className="h-4 w-4" /> Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2 p-2">
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full h-11 rounded-xl">Log in</Button>
                </Link>
                <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20">Sign up</Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
