import React from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import {
  LayoutDashboard, FileText, Users, CreditCard, BarChart3, Settings, LogOut,
  ChevronLeft, MapPin, Users2, TrendingUp, User, Home
} from 'lucide-react';
import { useThemeStore } from '../../store';

export default function AgencySidebar({ user }) {
  const { theme, sidebarOpen, toggleSidebar } = useThemeStore();
  const { url } = usePage();

  const menuItems = [
    {
      label: 'Tableau de bord',
      href: '/agence',
      icon: Home,
    },
    {
      label: 'Annonces',
      href: '/agence/annonces',
      icon: FileText,
      badge: '12'
    },
    {
      label: 'Espaces',
      href: '/agence/espaces',
      icon: MapPin,
    },
    {
      label: 'Employés',
      href: '/agence/employes',
      icon: Users2,
    },
    {
      label: 'Abonnements',
      href: '/agence/abonnements',
      icon: CreditCard,
    },
    {
      label: 'Analytiques',
      href: '/agence/analytiques',
      icon: TrendingUp,
    },
    {
      label: 'Profil',
      href: '/agence/profil',
      icon: User,
    }
  ];

  const currentPath = url;

  return (
    <aside className={`h-screen sticky top-0 transition-all duration-300 ease-in-out z-30
      ${sidebarOpen ? "w-72" : "w-24"}
      lg:w-72
      ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}
      border-r shadow-lg flex flex-col overflow-hidden
      ${!sidebarOpen && 'hidden lg:flex'}
    `}>
      {/* Logo Section - More spacious */}
      <div className={`px-6 py-6 flex justify-between items-center border-b transition-colors flex-shrink-0 ${
        theme === 'dark' ? 'border-slate-800' : 'border-gray-200'
      }`}>
        <Link href="/agence" className={`flex items-center gap-3 transition-all duration-300 group ${
          !sidebarOpen ? 'justify-center' : ''
        }`}>
          <img src="/logo.png" alt="LUZY Logo" className="h-14 w-auto flex-shrink-0" />
          <span className={`text-lg font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 whitespace-nowrap transition-all duration-300 ${
            sidebarOpen ? "opacity-100" : "opacity-0 w-0 lg:opacity-100"
          }`}>
            AGENCY
          </span>
        </Link>
        
        {/* Toggle Button */}
        <button
          onClick={toggleSidebar}
          className={`p-2.5 rounded-lg transition-colors duration-200 lg:hidden flex-shrink-0 ${
            theme === 'dark'
              ? 'text-gray-400 hover:bg-slate-800 hover:text-purple-400'
              : 'text-gray-600 hover:bg-gray-100 hover:text-purple-600'
          }`}
          aria-label="Toggle sidebar"
        >
          <ChevronLeft size={20} className={`transition-transform duration-300 ${!sidebarOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Navigation Menu - Non-scrollable */}
      <nav className="px-4 py-4 flex-1 overflow-hidden">
        <ul className="space-y-1.5 h-full flex flex-col">
          {menuItems.map((item) => (
            <AgencySidebarItem
              key={item.href}
              icon={<item.icon size={24} />}
              text={item.label}
              href={item.href}
              active={currentPath.startsWith(item.href)}
              badge={item.badge}
              sidebarOpen={sidebarOpen}
              theme={theme}
            />
          ))}
        </ul>
      </nav>

      {/* User Profile Section - Bottom, spacious */}
      <div className={`border-t p-4 transition-colors flex-shrink-0 ${
        theme === 'dark'
          ? 'border-slate-800 bg-slate-800/30'
          : 'border-gray-200 bg-gray-50'
      }`}>
        {/* User Info Card */}
        <div className={`flex items-center gap-4 mb-4 transition-all duration-300 ${
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none lg:opacity-100"
        }`}>
          <img
            src={user?.profile?.photo || `https://i.pravatar.cc/100?u=${user?.email || 'agency'}`}
            alt="Agency Avatar"
            className={`w-14 h-14 rounded-lg object-cover ring-2 transition-all flex-shrink-0 ${
              theme === 'dark'
                ? 'ring-purple-500/50'
                : 'ring-purple-300'
            } shadow-md`}
            onError={(e) => {
              e.target.src = `https://i.pravatar.cc/100?u=${user?.email || 'agency'}`;
            }}
          />
          <div className="leading-tight overflow-hidden min-w-0">
            <h4 className={`font-bold text-base truncate ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
              {user?.name || 'Agence'}
            </h4>
            <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Agence
            </span>
          </div>
        </div>

        {/* Action Buttons - Spacious */}
        <div className={`space-y-2 transition-all duration-300 ${
          sidebarOpen ? "opacity-100 block" : "opacity-0 hidden lg:opacity-100 lg:block"
        }`}>
          <Link
            href="/agence/profil"
            className={`flex items-center gap-3 px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 ${
              currentPath.startsWith('/agence/profil')
                ? theme === 'dark'
                  ? 'bg-gradient-to-r from-purple-600/30 to-pink-600/30 text-purple-300 border border-purple-500/30'
                  : 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border border-purple-300'
                : theme === 'dark'
                ? 'text-gray-300 hover:bg-slate-700 border border-transparent'
                : 'text-gray-700 hover:bg-gray-100 border border-transparent'
            } border`}
          >
            <Settings size={20} className="flex-shrink-0" />
            <span>Paramètres</span>
          </Link>

          <button
            onClick={() => router.post(route('logout'))}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 border ${
              theme === 'dark'
                ? 'text-red-400 hover:bg-red-500/20 border-transparent hover:border-red-500/30'
                : 'text-red-600 hover:bg-red-50 border-transparent hover:border-red-200'
            }`}
          >
            <LogOut size={20} className="flex-shrink-0" />
            <span>Déconnexion</span>
          </button>
        </div>
      </div>
    </aside>
  );
}

function AgencySidebarItem({ icon, text, active, href, badge, sidebarOpen, theme }) {
  return (
    <Link
      href={href}
      className={`
        relative flex items-center gap-4 px-4 py-2.5 font-semibold rounded-lg cursor-pointer
        transition-all duration-200 group border flex-shrink-0
        ${active
          ? theme === 'dark'
            ? "bg-gradient-to-r from-purple-600/30 to-pink-600/30 text-purple-300 border-purple-500/30"
            : "bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border-purple-300"
          : theme === 'dark'
            ? "text-gray-300 hover:bg-slate-800 border-transparent hover:border-slate-700"
            : "text-gray-700 hover:bg-gray-100 border-transparent hover:border-gray-200"
        }
      `}
    >
      {/* Icon */}
      <div className={`
        transition-colors duration-200 flex-shrink-0
        ${active
          ? theme === 'dark'
            ? "text-purple-400"
            : "text-purple-600"
          : theme === 'dark'
            ? "text-gray-400 group-hover:text-purple-400"
            : "text-gray-600 group-hover:text-purple-600"
        }
      `}>
        {icon}
      </div>

      {/* Text and Badge */}
      <div className={`
        overflow-hidden transition-all duration-300 flex-1 flex items-center justify-between gap-2
        ${sidebarOpen ? "opacity-100 w-auto" : "opacity-0 w-0"} lg:opacity-100 lg:w-auto
      `}>
        <span className="text-base font-bold whitespace-nowrap">
          {text}
        </span>
        {badge && (
          <span className={`text-xs px-3 py-1 rounded-full font-bold whitespace-nowrap flex-shrink-0 ${
            theme === 'dark'
              ? 'bg-purple-500/20 text-purple-300'
              : 'bg-purple-100 text-purple-700'
          }`}>
            {badge}
          </span>
        )}
      </div>

      {/* Tooltip for collapsed state */}
      {!sidebarOpen && (
        <div className={`
          absolute left-full rounded-lg px-4 py-3 ml-4 min-w-max
          text-sm font-semibold
          invisible opacity-0 -translate-x-3 transition-all duration-200 ease-in-out
          group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
          shadow-xl z-50 border
          ${theme === 'dark'
            ? 'bg-slate-800 text-gray-100 border-slate-700'
            : 'bg-white text-gray-900 border-gray-200'
          }
        `}>
          {text}
          {badge && (
            <span className={`ml-2 text-xs px-2 py-1 rounded-full font-bold ${
              theme === 'dark'
                ? 'bg-purple-500/20 text-purple-300'
                : 'bg-purple-100 text-purple-700'
            }`}>
              {badge}
            </span>
          )}
          <div className={`absolute left-[-6px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-t-transparent border-b-transparent ${
            theme === 'dark' ? 'border-r-slate-800' : 'border-r-white'
          }`}></div>
        </div>
      )}
    </Link>
  );
}
