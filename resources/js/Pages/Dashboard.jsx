import React, { useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';

export default function Dashboard({ user, hasAgencyPositions, selectedAgency, ...props }) {
  const [shouldRender, setShouldRender] = React.useState(false);

  useEffect(() => {
    if (!user) return;

    // Admin and Manager go directly to their dashboards
    if (user.user_type === 'admin') {
      router.visit('/admin', { method: 'get' });
    }
    else if (user.user_type === 'manager') {
      router.visit('/manager', { method: 'get' });
    }
    // Agency users go to agency dashboard
    else if (user.user_type === 'agency') {
      router.visit('/agence', { method: 'get' });
    }
    // Employees/visitors with agency positions
    else if (hasAgencyPositions) {
      // If they already have a selected agency, go directly to agency dashboard
      if (selectedAgency) {
        router.visit('/agence', { method: 'get' });
      } else {
        // Otherwise, they need to select an agency first
        router.visit('/select-agency', { method: 'get' });
      }
    }
    // Regular visitors - render the visitor dashboard content
    else {
      setShouldRender(true);
    }
  }, [user, hasAgencyPositions, selectedAgency]);

  // Show loading while redirecting
  if (!shouldRender && user && (user.user_type === 'admin' || user.user_type === 'manager' || user.user_type === 'agency' || hasAgencyPositions)) {
    return (
      <>
        <Head title="Redirection" />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-700 relative overflow-hidden">
          <div className="absolute inset-0 z-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          <div className="absolute inset-0 z-0 bg-black opacity-30"></div>

          <div className="relative z-10 text-center p-8 bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20">
            <Link href="/" className="flex items-center justify-center mb-6 space-x-3 text-white">
              <img src="/logo.png" alt="LUZY Logo" className="h-24 w-auto shadow-lg" />
            </Link>
            <div className="inline-flex items-center justify-center animate-spin-slow">
              <Loader2 className="w-16 h-16 text-white" />
            </div>
            <p className="text-white mt-6 text-xl font-semibold tracking-wide">Redirection vers votre tableau de bord...</p>
            <p className="text-white mt-2 text-sm opacity-80">Veuillez patienter un instant.</p>
          </div>
        </div>
      </>
    );
  }

  // For regular visitors, render the visitor dashboard
  return (
    <>
      <Head title="Tableau de bord" />
      <p>Visitor Dashboard</p>
    </>
  );
}
