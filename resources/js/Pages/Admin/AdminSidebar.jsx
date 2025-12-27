import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Disclosure } from '@headlessui/react';
import {
  LayoutDashboard, Users, Building2, DollarSign, Zap, Flag, BarChart3, Settings, LogOut,
  ChevronLeft, ChevronDown, Sun, Moon
} from 'lucide-react';
import { useThemeStore } from '../../store';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-lg transition-colors duration-200 flex-shrink-0 ${
        theme === 'dark'
          ? 'text-gray-300 hover:bg-slate-800'
          : 'text-gray-700 hover:bg-gray-200'
      }`}
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
};

export default function AdminSidebar({ user }) {
  const { sidebarOpen, toggleSidebar, theme } = useThemeStore();
  const { url } = usePage();

  const menuGroups = [
    {
      label: 'Tableau de Bord',
      href: '/admin',
      icon: LayoutDashboard,
    },
    {
      label: 'Gestion',
      icon: Users,
      group: true,
      items: [
        {
          label: 'Utilisateurs',
          href: '/admin/utilisateurs',
          icon: Users,
        },
        {
          label: 'Agences',
          href: '/admin/agences',
          icon: Building2,
        },
      ]
    },
    {
      label: 'Paiements & Abonnements',
      icon: DollarSign,
      group: true,
      items: [
        {
          label: 'Paiements',
          href: '/admin/paiements',
          icon: DollarSign,
        },
        {
          label: 'Plans d\'abonnement',
          href: '/admin/abonnements',
          icon: DollarSign,
        },
      ]
    },
    {
      label: 'Boosts',
      icon: Zap,
      group: true,
      items: [
        {
          label: 'Packs de Boost',
          href: '/admin/packs-boost',
          icon: Zap,
        },
        {
          label: 'Boosts Actifs',
          href: '/admin/boosts',
          icon: Zap,
        },
      ]
    },
    {
      label: 'Modération',
      href: '/admin/signalements',
      icon: Flag,
    },
    {
      label: 'Statistiques',
      href: '/admin/statistiques',
      icon: BarChart3,
    },
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
        <Link href="/admin" className={`flex items-center gap-3 transition-all duration-300 group ${
          !sidebarOpen ? 'justify-center' : ''
        }`}>
          <img src="/logo.png" alt="LUZY Logo" className="h-14 w-auto flex-shrink-0" />
          <span className={`text-lg font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 whitespace-nowrap transition-all duration-300 ${
            sidebarOpen ? "opacity-100" : "opacity-0 w-0 lg:opacity-100"
          }`}>
            ADMIN
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

      {/* Navigation Menu */}
      <nav className="px-4 py-4 flex-1 overflow-hidden">
        <ul className="space-y-1.5 h-full flex flex-col">
          {menuGroups.map((group, index) => {
            if (group.group) {
              return (
                <MenuGroup
                  key={index}
                  label={group.label}
                  icon={<group.icon size={24} />}
                  items={group.items}
                  currentPath={currentPath}
                  sidebarOpen={sidebarOpen}
                  theme={theme}
                />
              );
            }
            return (
              <AdminSidebarItem
                key={group.href}
                icon={<group.icon size={24} />}
                text={group.label}
                href={group.href}
                active={currentPath.startsWith(group.href)}
                sidebarOpen={sidebarOpen}
                theme={theme}
              />
            );
          })}
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
            src={user?.profile?.photo || `https://i.pravatar.cc/100?u=${user?.email || 'admin'}`}
            alt="Admin Avatar"
            className={`w-14 h-14 rounded-lg object-cover ring-2 transition-all flex-shrink-0 ${
              theme === 'dark'
                ? 'ring-purple-500/50'
                : 'ring-purple-300'
            } shadow-md`}
            onError={(e) => {
              e.target.src = `https://i.pravatar.cc/100?u=${user?.email || 'admin'}`;
            }}
          />
          <div className="leading-tight overflow-hidden min-w-0 flex-1">
            <h4 className={`font-bold text-base truncate ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
              {user?.name || 'Admin'}
            </h4>
            <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Administrateur
            </span>
          </div>
          <div className="flex-shrink-0">
            <ThemeToggle />
          </div>
        </div>

        {/* Action Buttons - Spacious */}
        <div className={`space-y-2 transition-all duration-300 ${
          sidebarOpen ? "opacity-100 block" : "opacity-0 hidden lg:opacity-100 lg:block"
        }`}>
          <Link
            href="/admin/settings"
            className={`flex items-center gap-3 px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 ${
              currentPath.startsWith('/admin/settings')
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

          <Link
            href={route('logout')}
            method="post"
            as="button"
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 border ${
              theme === 'dark'
                ? 'text-red-400 hover:bg-red-500/20 border-transparent hover:border-red-500/30'
                : 'text-red-600 hover:bg-red-50 border-transparent hover:border-red-200'
            }`}
          >
            <LogOut size={20} className="flex-shrink-0" />
            <span>Déconnexion</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}

function AdminSidebarItem({ icon, text, active, href, sidebarOpen, theme }) {
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

      {/* Text */}
      <div className={`
        overflow-hidden transition-all duration-300 flex-1
        ${sidebarOpen ? "opacity-100 w-auto" : "opacity-0 w-0"} lg:opacity-100 lg:w-auto
      `}>
        <span className="text-base font-bold whitespace-nowrap">
          {text}
        </span>
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
          <div className={`absolute left-[-6px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-t-transparent border-b-transparent ${
            theme === 'dark' ? 'border-r-slate-800' : 'border-r-white'
          }`}></div>
        </div>
      )}
    </Link>
  );
}

function MenuGroup({ label, icon, items, currentPath, sidebarOpen, theme }) {
  const isActive = items.some(item => currentPath.startsWith(item.href));

  return (
    <Disclosure as="div">
      {({ open }) => (
        <>
          <Disclosure.Button className={`
            w-full relative flex items-center gap-4 px-4 py-2.5 font-semibold rounded-lg cursor-pointer
            transition-all duration-200 group border flex-shrink-0
            ${isActive
              ? theme === 'dark'
                ? "bg-gradient-to-r from-purple-600/30 to-pink-600/30 text-purple-300 border-purple-500/30"
                : "bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border-purple-300"
              : theme === 'dark'
                ? "text-gray-300 hover:bg-slate-800 border-transparent hover:border-slate-700"
                : "text-gray-700 hover:bg-gray-100 border-transparent hover:border-gray-200"
            }
          `}>
            {/* Icon */}
            <div className={`
              transition-colors duration-200 flex-shrink-0
              ${isActive
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

            {/* Text */}
            <div className={`
              overflow-hidden transition-all duration-300 flex-1 flex items-center justify-between gap-2
              ${sidebarOpen ? "opacity-100 w-auto" : "opacity-0 w-0"} lg:opacity-100 lg:w-auto
            `}>
              <span className="text-base font-bold whitespace-nowrap">
                {label}
              </span>
              <ChevronDown
                size={18}
                className={`flex-shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
              />
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
                {label}
                <div className={`absolute left-[-6px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-t-transparent border-b-transparent ${
                  theme === 'dark' ? 'border-r-slate-800' : 'border-r-white'
                }`}></div>
              </div>
            )}
          </Disclosure.Button>

          <Disclosure.Panel as="ul" className="space-y-1 pl-6">
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`
                    relative flex items-center gap-4 px-4 py-2.5 font-semibold rounded-lg cursor-pointer
                    transition-all duration-200 group border flex-shrink-0
                    ${currentPath.startsWith(item.href)
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
                    ${currentPath.startsWith(item.href)
                      ? theme === 'dark'
                        ? "text-purple-400"
                        : "text-purple-600"
                      : theme === 'dark'
                        ? "text-gray-400 group-hover:text-purple-400"
                        : "text-gray-600 group-hover:text-purple-600"
                    }
                  `}>
                    <item.icon size={24} />
                  </div>

                  {/* Text */}
                  <div className={`
                    overflow-hidden transition-all duration-300 flex-1
                    ${sidebarOpen ? "opacity-100 w-auto" : "opacity-0 w-0"} lg:opacity-100 lg:w-auto
                  `}>
                    <span className="text-base font-bold whitespace-nowrap">
                      {item.label}
                    </span>
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
                      {item.label}
                      <div className={`absolute left-[-6px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-t-transparent border-b-transparent ${
                        theme === 'dark' ? 'border-r-slate-800' : 'border-r-white'
                      }`}></div>
                    </div>
                  )}
                </Link>
              </li>
            ))}
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
