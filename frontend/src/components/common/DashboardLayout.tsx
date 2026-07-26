"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LogOut, User } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getCurrentUser, logout } from '@/services/api';

export interface SidebarLink {
  href: string;
  label: string;
  icon: LucideIcon;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  links: SidebarLink[];
  title: string;
}

export function DashboardLayout({ children, links }: DashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: userResponse } = useQuery({
    queryKey: ['currentUser'],
    queryFn: getCurrentUser,
    retry: false,
  });

  const user = userResponse?.data;

  const handleLogout = async () => {
    await logout();
    queryClient.clear();
    router.push('/');
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-slate-50 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute top-0 left-0 w-full h-96 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-blue-100/40 via-slate-50 to-slate-50 -z-10" />

      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-6 relative z-10">
        {/* Sidebar */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden sticky top-24">

            {/* User Info */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-5 flex items-center gap-3">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-11 h-11 rounded-full object-cover border-2 border-white/40 shrink-0" />
              ) : (
                <div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <User className="h-5 w-5 text-white" />
                </div>
              )}
              <div className="min-w-0">
                <p className="font-bold text-white text-sm truncate">{user?.name || 'User'}</p>
                <p className="text-blue-200 text-xs capitalize truncate">{user?.role || 'Dashboard'}</p>
              </div>
            </div>

            {/* Nav Links */}
            <nav className="p-3 space-y-0.5">
              <p className="text-xs font-bold tracking-wider text-slate-400 uppercase px-3 py-2">Menu</p>
              {links.map((link) => {
                const isActive = pathname === link.href || (link.href !== '/student' && link.href !== '/tutor' && pathname.startsWith(`${link.href}/`));
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150",
                      isActive
                        ? "bg-blue-50 text-blue-600"
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                    )}
                  >
                    <Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-blue-600" : "text-slate-400")} />
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Bottom actions */}
            <div className="p-3 border-t border-slate-100 space-y-0.5">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all duration-150 group"
              >
                <LogOut className="h-4 w-4 text-slate-400 group-hover:text-red-500 shrink-0" />
                Logout
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 w-full overflow-hidden min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
