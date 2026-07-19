import { DashboardLayout } from '@/components/common/DashboardLayout';
import { LayoutDashboard, Calendar, Users, Wallet, UserCircle } from 'lucide-react';

const tutorLinks = [
  { href: '/tutor', label: 'Overview', icon: LayoutDashboard },
  { href: '/tutor/schedule', label: 'My Schedule', icon: Calendar },
  { href: '/tutor/students', label: 'My Students', icon: Users },
  { href: '/tutor/earnings', label: 'Earnings', icon: Wallet },
  { href: '/tutor/profile', label: 'Edit Profile', icon: UserCircle },
];

export default function TutorLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout links={tutorLinks} title="Tutor Dashboard">
      {children}
    </DashboardLayout>
  );
}
