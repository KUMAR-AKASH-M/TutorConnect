import { DashboardLayout } from '@/components/common/DashboardLayout';
import { LayoutDashboard, Users, BookOpen, FileCheck, Settings } from 'lucide-react';

const adminLinks = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/users', label: 'Manage Users', icon: Users },
  { href: '/admin/sessions', label: 'All Sessions', icon: BookOpen },
  { href: '/admin/approvals', label: 'Tutor Approvals', icon: FileCheck },
  { href: '/admin/settings', label: 'Platform Settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout links={adminLinks} title="Admin Dashboard">
      {children}
    </DashboardLayout>
  );
}
