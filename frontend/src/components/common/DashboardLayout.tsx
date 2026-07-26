"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { User } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

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

export function DashboardLayout({ children, links, title }: DashboardLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-slate-50 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-96 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-blue-100/40 via-slate-50 to-slate-50 -z-10" />

      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8 relative z-10">
        {/* Sidebar */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="bg-white rounded-3xl py-6 px-4 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <h2 className="text-xs font-bold tracking-wider text-slate-400 uppercase mb-4 px-4">Dashboard</h2>
          <nav className="space-y-1">
            {links.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
              const Icon = link.icon;
              
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                    isActive 
                      ? "bg-blue-50 text-blue-600" 
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 w-full overflow-hidden">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-slate-500" />
            </div>
          </div>
        </div>
        {children}
      </main>
    </div>
  </div>
  );
}
