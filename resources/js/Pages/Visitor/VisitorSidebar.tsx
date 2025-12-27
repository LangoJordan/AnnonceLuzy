import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
  LayoutDashboard, Heart, History, User, Settings, LogOut,
  ChevronFirst, ChevronLast, Bell, MessageSquare
} from 'lucide-react';
import { useThemeStore } from '../../store'; // Assuming this store handles theme state
import ThemeToggle from '@/Components/ThemeToggle'; // Re-use the common ThemeToggle

export default function VisitorSidebar({ user }) {
  const { sidebarOpen, toggleSidebar } = useThemeStore(); // Assuming useThemeStore also manages sidebar state
  const { url } = usePage();

  const menuItems = [
    {
      label: 'Tableau de Bord',
      href: '/dashboard',
      icon: LayoutDashboard,
      description: 'Vue d\'ensemble de votre activité',
    },
    {
      label: 'Favoris',
      href: '/favoris',
      icon: Heart,
      description: 'Vos annonces sauvegardées',
    },
    {
      label: 'Historique',
      href: '/historique',
      icon: History,
      description: 'Annonces récemment consultées',
    },
    {
      label: 'Profil',
      href: '/profil',
      icon: User,
      description: 'Gérez vos informations personnelles',
    }
  ];

  const currentPath = url;

  return (
    <aside className={`h-screen sticky top-0 transition-all duration-300 ease-in-out z-30
      ${sidebarOpen ? "w-80" : "w-20"}
      lg:w-80 lg:translate-x-0
      bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 shadow-xl
      ${!sidebarOpen && 'hidden lg:block'}
    `}>
      <nav className="h-full flex flex-col">
        {/* Header/Logo */}
        <div className="p-4 pb-2 flex justify-between items-center border-b border-gray-200 dark:border-gray-800">
          <Link href="/" className={`flex items-center gap-2 overflow-hidden transition-all duration-300
            ${sidebarOpen ? "w-auto opacity-100" : "w-0 opacity-0"} lg:w-auto lg:opacity-100
          `}>
            <img src="/logo.png" alt="LUZY Logo" className="h-12 w-auto object-contain" />
          </Link>
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 lg:hidden"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <ChevronFirst size={20} /> : <ChevronLast size={20} />}
          </button>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 px-3 py-4 overflow-y-auto scrollbar-hide">
          <ul className="space-y-1">
            {menuItems.map((item, index) => (
              <VisitorSidebarItem
                key={index}
                icon={<item.icon size={20} />}
                text={item.label}
                href={item.href}
                active={currentPath === item.href} // Exact match for dashboard items
                description={item.description}
                badge={item.badge}
                sidebarOpen={sidebarOpen}
              />
            ))}
          </ul>
        </div>

        {/* User Profile & Theme Toggle */}
        <div className="sticky bottom-0 border-t border-gray-200 dark:border-gray-800 p-3 bg-gray-50 dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <div className={`flex items-center transition-all duration-300
              ${sidebarOpen ? "opacity-100 w-auto" : "opacity-0 w-0 pointer-events-none"} lg:opacity-100 lg:w-auto
            `}>
              {/* User Avatar */}
              <img
                src={`https://i.pravatar.cc/100?u=${user?.email || 'visitor'}`}
                alt="Visitor Avatar"
                className="w-10 h-10 rounded-full object-cover ring-2 ring-purple-300 dark:ring-purple-600 shadow-md"
              />
              <div className="ml-3 leading-4 overflow-hidden">
                <h4 className="font-semibold text-gray-800 dark:text-gray-100">{user?.name || 'Visitor User'}</h4>
                <span className="text-xs text-gray-500 dark:text-gray-400">Membre</span>
              </div>
            </div>
            <ThemeToggle />
          </div>

          {/* Settings/Logout - Collapsed or Expanded */}
          <div className={`mt-3 pt-3 border-t border-gray-200 dark:border-gray-800 transition-all duration-300
            ${sidebarOpen ? "opacity-100 block" : "opacity-0 hidden"} lg:opacity-100 lg:block
          `}>
            <Link
              href="/profile" // Link to the user's profile settings
              className="flex items-center gap-3 p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 group"
            >
              <Settings size={20} className="text-gray-500 dark:text-gray-500 group-hover:text-purple-600 dark:group-hover:text-purple-400" />
              <span className="font-medium">Paramètres</span>
            </Link>
            <Link
              href={route('logout')}
              method="post"
              as="button"
              className="w-full flex items-center gap-3 p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-red-100 dark:hover:bg-red-900 hover:text-red-700 dark:hover:text-red-300 transition-colors duration-200 group mt-1"
            >
              <LogOut size={20} className="text-gray-500 dark:text-gray-500 group-hover:text-red-600 dark:group-hover:text-red-400" />
              <span className="font-medium">Déconnexion</span>
            </Link>
          </div>
        </div>
      </nav>
    </aside>
  );
}

function VisitorSidebarItem({ icon, text, active, href, description, badge, sidebarOpen }) {
  const getBadgeColor = (type) => {
    switch (type) {
      case 'success': return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'warning': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
      case 'danger': return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
      case 'info': return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <Link
      href={href}
      className={`
        relative flex items-center p-3 my-1 font-medium rounded-lg cursor-pointer
        transition-all duration-200 group
        ${active
          ? "bg-gradient-to-r from-purple-500/20 to-orange-500/10 text-purple-700 dark:text-purple-300"
          : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
        }
      `}>
      <div className={`
        ${active ? "text-purple-600 dark:text-purple-400" : "text-gray-500 dark:text-gray-500 group-hover:text-purple-600 dark:group-hover:text-purple-400"}
        transition-colors duration-200
      `}>
        {icon}
      </div>

      <div className={`
        overflow-hidden transition-all duration-300 ml-3
        ${sidebarOpen ? "w-auto opacity-100" : "w-0 opacity-0"} lg:w-auto lg:opacity-100
      `}>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">
            {text}
          </span>
          {badge && (
            <span className={`text-xs px-2 py-0.5 rounded-full ${getBadgeColor(badge.type)} ml-2`}>
              {badge.text}
            </span>
          )}
        </div>
        {description && sidebarOpen && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{description}</p>
        )}
      </div>

      {/* Tooltip for collapsed state */}
      {!sidebarOpen && (
        <div className={`
          absolute left-full rounded-md px-3 py-2 ml-4
          bg-gray-700 text-white text-sm whitespace-nowrap
          invisible opacity-0 -translate-x-3 transition-all duration-200 ease-in-out
          group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
          shadow-lg dark:bg-gray-800 z-50
        `}>
          <span className="font-semibold">{text}</span>
          {description && (
            <div className="text-xs text-gray-300 mt-1">{description}</div>
          )}
          <div className="absolute left-[-8px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-8 border-b-8 border-r-8 border-t-transparent border-b-transparent border-r-gray-700 dark:border-r-gray-800"></div>
        </div>
      )}
    </Link>
  );
}
