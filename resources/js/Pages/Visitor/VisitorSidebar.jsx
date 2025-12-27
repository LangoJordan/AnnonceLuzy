import { Link, usePage } from '@inertiajs/react';
import {
  LayoutDashboard, Heart, History, UserCircle, LogOut, Home, Search, MapPin, Calendar, Star, MessageSquare, Share2, Filter, Bookmark, TrendingUp, Camera, Bell, Settings, ChevronFirst, ChevronLast, Sparkles, Compass, Users, Zap, Building2
} from 'lucide-react';
import { useThemeStore } from '../../store';
import { useState, useEffect } from 'react';

export default function VisitorSidebar({ user }) {
  const { sidebarOpen, toggleSidebar } = useThemeStore();
  const { url } = usePage();
  const [userActivity, setUserActivity] = useState({
    savedProperties: 24,
    viewedProperties: 156,
    searchHistory: 89,
    notifications: 3,
    recommendations: 12
  });

  const [recentSearches] = useState([
    { query: 'Appartement Paris 3 pièces', icon: MapPin, time: '2h' },
    { query: 'Maison avec jardin Lyon', icon: Home, time: '5h' },
    { query: 'Studio Marseille centre', icon: Building2, time: '1j' }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setUserActivity(prev => ({
        ...prev,
        recommendations: Math.max(8, Math.min(20, prev.recommendations + Math.floor((Math.random() - 0.5) * 3))),
        notifications: Math.max(0, Math.min(10, prev.notifications + Math.floor((Math.random() - 0.5) * 2)))
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const menuItems = [
    { 
      label: 'Tableau de bord', 
      href: '/dashboard', 
      icon: LayoutDashboard, 
      accent: 'text-indigo-500',
      description: 'Votre espace personnel'
    },
    { 
      label: 'Favoris', 
      href: '/favoris', 
      icon: Heart, 
      alert: userActivity.savedProperties,
      description: 'Biens sauvegardés',
      badge: { text: `${userActivity.savedProperties}`, type: 'info' }
    },
    { 
      label: 'Historique', 
      href: '/historique', 
      icon: History, 
      description: 'Vos recherches récentes',
      badge: { text: `${userActivity.viewedProperties}`, type: 'success' }
    },
    { 
      label: 'Profil', 
      href: '/profile', 
      icon: UserCircle, 
      description: 'Gérer votre compte'
    },
    { 
      label: 'Déconnexion', 
      href: '/logout', 
      icon: LogOut, 
      method: 'post',
      description: 'Quitter votre espace'
    }
  ];

  const quickActions = [
    { icon: Search, label: 'Nouvelle recherche', href: '/ads', color: 'bg-indigo-500' },
    { icon: Heart, label: 'Ajouter aux favoris', href: '/favoris', color: 'bg-pink-500' },
    { icon: MapPin, label: 'Parcourir par ville', href: '/ads?map=true', color: 'bg-green-500' }
  ];

  const currentPath = url;

  return (
    <aside className={`h-screen sticky top-0 transition-all duration-300 ease-in-out ${sidebarOpen ? "w-80" : "w-20"} z-30`}>
      <nav className="h-full flex flex-col bg-slate-900 border-r border-slate-800 shadow-2xl">
        {/* Header */}
        <div className="p-4 pb-2 flex justify-between items-center border-b border-slate-800">
          <Link href="/" className={`flex items-center gap-2 overflow-hidden transition-all ${sidebarOpen ? "w-auto" : "w-0"}`}>
            <img src="/logo.png" alt="LUZY Logo" className="h-12 w-auto" />
          </Link>
          <button onClick={toggleSidebar} className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-purple-400 transition-colors">
            {sidebarOpen ? <ChevronFirst size={20} /> : <ChevronLast size={20} />}
          </button>
        </div>

        {/* User Activity Panel */}
        {sidebarOpen && (
          <div className="p-4 border-b border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-purple-400 uppercase tracking-wider">Votre Activité</h3>
              <div className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-yellow-500" />
                <span className="text-xs text-gray-500 dark:text-gray-400">Actif</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20 rounded-lg p-3 border border-pink-200 dark:border-pink-800">
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="w-4 h-4 text-pink-500" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">Favoris</span>
                </div>
                <div className="text-xl font-bold text-gray-800 dark:text-white">{userActivity.savedProperties}</div>
                <div className="text-xs text-pink-600 dark:text-pink-400">Biens aimés</div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-2 mb-2">
                  <Search className="w-4 h-4 text-blue-500" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">Consultés</span>
                </div>
                <div className="text-xl font-bold text-gray-800 dark:text-white">{userActivity.viewedProperties}</div>
                <div className="text-xs text-blue-600 dark:text-blue-400">Biens vus</div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-3 border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-2 mb-2">
                  <Search className="w-4 h-4 text-green-500" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">Recherches</span>
                </div>
                <div className="text-xl font-bold text-gray-800 dark:text-white">{userActivity.searchHistory}</div>
                <div className="text-xs text-green-600 dark:text-green-400">Historique</div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg p-3 border border-purple-200 dark:border-purple-800">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-purple-500" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">Suggestions</span>
                </div>
                <div className="text-xl font-bold text-gray-800 dark:text-white">{userActivity.recommendations}</div>
                <div className="text-xs text-purple-600 dark:text-purple-400">Pour vous</div>
              </div>
            </div>
          </div>
        )}

        {/* Recent Searches */}
        {sidebarOpen && (
          <div className="px-4 py-3 border-b border-gray-200 dark:border-slate-700">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Recherches Récentes</h3>
            <div className="space-y-2">
              {recentSearches.map((search, index) => (
                <Link
                  key={index}
                  href={`/ads?q=${encodeURIComponent(search.query)}`}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors group"
                >
                  <search.icon className="w-4 h-4 text-gray-400 group-hover:text-indigo-500 transition-colors" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-700 dark:text-gray-300 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {search.query}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">{search.time}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        {sidebarOpen && (
          <div className="px-4 py-3 border-b border-gray-200 dark:border-slate-700">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Actions Rapides</h3>
            <div className="space-y-2">
              {quickActions.map((action, index) => (
                <Link
                  key={index}
                  href={action.href}
                  className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 dark:bg-slate-800/50 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors group"
                >
                  <div className={`w-8 h-8 rounded-lg ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <action.icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">{action.label}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Navigation Menu */}
        <div className="flex-1 px-3 py-4 overflow-y-auto">
          <ul className="space-y-1">
            {menuItems.map((item, index) => (
              <VisitorSidebarItem
                key={index}
                icon={<item.icon size={20} />}
                text={item.label}
                href={item.href}
                active={currentPath.startsWith(item.href)}
                alert={item.alert}
                method={item.method}
                accentClass={item.accent || 'text-indigo-500'}
                description={sidebarOpen ? item.description : ''}
                badge={item.badge}
                sidebarOpen={sidebarOpen}
              />
            ))}
          </ul>
        </div>

        {/* User Profile */}
        <div className="border-t border-gray-200 dark:border-slate-700 p-3">
          <div className="flex items-center">
            <div className="relative">
              <img 
                src={`https://i.pravatar.cc/100?u=${user?.email || 'visitor'}`} 
                alt="User Avatar" 
                className="w-10 h-10 rounded-lg object-cover ring-2 ring-indigo-500" 
              />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-slate-900"></div>
            </div>
            <div className={`flex justify-between items-center overflow-hidden transition-all ${sidebarOpen ? "w-52 ml-3" : "w-0"}`}>
              <div className="leading-4">
                <h4 className="font-semibold text-gray-800 dark:text-white">{user?.name || 'Visiteur'}</h4>
                <span className="text-xs text-gray-500 dark:text-gray-400">Membre Premium</span>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </aside>
  );
}

function VisitorSidebarItem({ icon, text, active, alert, href, method, accentClass, description, badge, sidebarOpen }) {
  const { theme } = useThemeStore();

  const activeBgClass = `bg-gradient-to-r from-purple-500/20 to-pink-500/10 border-l-2 border-purple-500 text-white`;
  const inactiveBgClass = "hover:bg-slate-800 text-gray-400 hover:text-white border-l-2 border-transparent";

  const getBadgeColor = (type) => {
    switch (type) {
      case 'success': return 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400';
      case 'warning': return 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'danger': return 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400';
      case 'info': return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400';
      default: return 'bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  return (
    <Link
      href={href}
      method={method}
      as={method ? "button" : "a"}
      className={`
        relative flex items-start py-3 px-3 my-1 font-medium rounded-lg cursor-pointer
        transition-all duration-200 group
        ${active ? activeBgClass : inactiveBgClass}
      `}
    >
      <div className="flex items-center gap-3 flex-1">
        <div className={`${active ? accentClass : 'text-gray-500 dark:text-gray-500'} transition-colors`}>
          {icon}
        </div>
        <div className={`overflow-hidden transition-all ${sidebarOpen ? "w-auto opacity-100" : "w-0 opacity-0"}`}>
          <div className="flex items-center justify-between">
            <span className={`${active ? 'text-gray-800 dark:text-white' : 'text-gray-700 dark:text-gray-300'} text-sm font-medium`}>
              {text}
            </span>
            {badge && (
              <span className={`text-xs px-2 py-0.5 rounded-full ${getBadgeColor(badge.type)}`}>
                {badge.text}
              </span>
            )}
          </div>
          {description && (
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">{description}</p>
          )}
        </div>
      </div>
      
      {alert && (
        <div className={`absolute right-3 top-3 w-5 h-5 flex items-center justify-center rounded-full bg-pink-500 text-white text-xs animate-pulse ${sidebarOpen ? "" : "top-1.5"}`}>
          {alert}
        </div>
      )}

      {!sidebarOpen && (
        <div className={`
          absolute left-full rounded-md px-2 py-1 ml-2
          bg-white dark:bg-slate-800 text-gray-800 dark:text-white text-sm whitespace-nowrap
          invisible opacity-0 -translate-x-2 transition-all
          group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
          border border-gray-200 dark:border-slate-700 shadow-lg
        `}>
          {text}
          {description && (
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{description}</div>
          )}
        </div>
      )}
    </Link>
  );
}
