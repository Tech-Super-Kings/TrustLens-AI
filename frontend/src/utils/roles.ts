import { Briefcase, Building2, GraduationCap, Landmark, ShieldCheck, type LucideIcon } from 'lucide-react';

export type UserRole = 'student' | 'employer' | 'university' | 'government' | 'admin';

export const roleLabels: Record<UserRole, string> = {
  student: 'Student',
  employer: 'Employer',
  university: 'University',
  government: 'Government Agency',
  admin: 'Admin',
};

export const roleDashboardPaths: Record<UserRole, string> = {
  student: '/dashboard/student',
  employer: '/dashboard/employer',
  university: '/dashboard/university',
  government: '/dashboard/government',
  admin: '/dashboard/admin',
};

export const roleIcons: Record<UserRole, LucideIcon> = {
  student: GraduationCap,
  employer: Briefcase,
  university: Building2,
  government: Landmark,
  admin: ShieldCheck,
};

export const roles = Object.keys(roleLabels) as UserRole[];
