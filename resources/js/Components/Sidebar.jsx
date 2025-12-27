import { Link, usePage } from '@inertiajs/react';
import { useThemeStore } from '../store';
import AdminSidebar from '../Pages/Admin/AdminSidebar';
import AgencySidebar from '../Pages/Agency/AgencySidebar';
import VisitorSidebar from '../Pages/Visitor/VisitorSidebar';

export default function Sidebar({ user }) {
  const userRole = user?.role || 'visitor';
   return <AgencySidebar user={user} />;
  switch (userRole) {
    case 'admin':
      return <AdminSidebar user={user} />;
    case 'agency':
      return <AgencySidebar user={user} />;
    case 'visitor':
    default:
      return <VisitorSidebar user={user} />;
  }
}