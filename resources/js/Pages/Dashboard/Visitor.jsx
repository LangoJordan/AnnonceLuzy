import { useState } from 'react';
import { Link, Head } from '@inertiajs/react';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import { useThemeStore } from '../../store';
import {
  Heart,
  Eye,
  Bell,
  Settings,
  User,
  Search,
  Zap,
  TrendingUp,
  Calendar,
  ArrowRight,
  MapPin,
  Star,
} from 'lucide-react';

export default function VisitorDashboard({ user, favoritesCount, viewsCount, alertsCount, recentSearches, recommendations }) {
  const { theme } = useThemeStore();

  const stats = [
    { label: 'Favoris', value: favoritesCount, icon: Heart, href: '/favoris' },
    { label: 'Historique', value: viewsCount, icon: Eye, href: '/historique' },
    { label: 'Alertes', value: alertsCount, icon: Bell, href: '/notifications' },
    { label: 'Profil', value: '📋', icon: User, href: '/profil' },
  ];

  const RecommendationCard = ({ ad }) => (
    <Link
      href={`/ads/${ad.id}`}
      className={`group rounded-xl overflow-hidden transition-all duration-300 border ${theme === 'dark' ? 'bg-slate-800 hover:shadow-xl hover:shadow-purple-900/30 border-slate-700' : 'bg-white hover:shadow-xl hover:shadow-purple-200/30 border-gray-200'}`}
    >
      <div className={`relative h-48 overflow-hidden ${theme === 'dark' ? 'bg-slate-700' : 'bg-gray-200'}`}>
        {ad.image ? (
          <img
            src={ad.image}
            alt={ad.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className={`w-full h-full flex items-center justify-center ${theme === 'dark' ? 'bg-slate-700' : 'bg-gray-300'}`}>
            <span className={`text-5xl ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`}>📷</span>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="inline-block px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded text-xs font-bold mb-2">
          {ad.category}
        </div>

        <h3 className={`font-bold text-base line-clamp-2 mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          {ad.title}
        </h3>

        <p className="text-lg font-bold text-purple-600 mb-3">
          {ad.price}
        </p>

        <div className="space-y-2 mb-4 text-sm">
          <div className={`flex items-center gap-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span className="line-clamp-1">{ad.location}</span>
          </div>
          <div className={`flex items-center gap-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            <Eye className="w-4 h-4 flex-shrink-0" />
            <span>{ad.views} vues</span>
          </div>
        </div>

        <div className={`flex items-center justify-between pt-3 border-t ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            <span className="text-sm font-medium">4.8</span>
          </div>
          <span className="text-purple-600 dark:text-purple-400 font-bold text-sm">Voir →</span>
        </div>
      </div>
    </Link>
  );

  return (
    <div className={theme === 'dark' ? 'bg-slate-900 text-white' : 'bg-gray-50 text-gray-900'}>
      <Head title="Dashboard" />
      <Header user={user} />

      <main className="min-h-screen">
        {/* Hero Section */}
        <section className={`${theme === 'dark' ? 'bg-gradient-to-b from-slate-800 to-slate-900' : 'bg-gradient-to-b from-purple-50 to-gray-50'} py-12 px-4`}>
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between flex-wrap gap-8">
              <div>
                <h1 className={`text-4xl sm:text-5xl font-black mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Bienvenue, {user?.name || 'Visiteur'}! 👋
                </h1>
                <p className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Retrouvez vos recherches, favoris et recommandations personnalisées
                </p>
              </div>
              <Link
                href="/profil"
                className={`px-8 py-3 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 transition flex items-center gap-2 transform hover:scale-105`}
              >
                <User className="w-5 h-5" />
                Mon profil
              </Link>
            </div>
          </div>
        </section>

        {/* Quick Stats */}
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Link
                  key={stat.label}
                  href={stat.href}
                  className={`group rounded-lg border ${theme === 'dark' ? 'bg-slate-800 border-slate-700 hover:shadow-lg hover:shadow-purple-900/20' : 'bg-white border-gray-200 hover:shadow-lg hover:shadow-purple-100/50'} p-6 transition`}
                >
                  <Icon className={`w-8 h-8 text-purple-600 mx-auto mb-3 group-hover:scale-125 transition`} />
                  <p className={`text-3xl font-black mb-1 text-center ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {stat.value}
                  </p>
                  <p className={`text-sm font-medium text-center group-hover:text-purple-600 transition ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {stat.label}
                  </p>
                </Link>
              );
            })}
          </div>

          {/* Search Box */}
          <div className={`rounded-lg border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} p-6 mb-16`}>
            <h2 className={`text-2xl font-black mb-6 flex items-center gap-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              <Search className="w-6 h-6 text-purple-600" />
              Rechercher une nouvelle annonce
            </h2>

            <div className="relative mb-6">
              <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} />
              <input
                type="text"
                placeholder="Rechercher..."
                className={`w-full pl-12 pr-6 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm ${theme === 'dark' ? 'bg-slate-700 border-slate-600 text-white placeholder:text-gray-500' : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-400'}`}
              />
            </div>

            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((search) => (
                  <Link
                    key={search.query}
                    href={`/ads?q=${search.query}`}
                    className={`px-4 py-2 rounded-lg font-medium text-xs transition ${theme === 'dark' ? 'bg-purple-900/30 text-purple-300 hover:bg-purple-900/50' : 'bg-purple-100 text-purple-700 hover:bg-purple-200'}`}
                  >
                    {search.query}
                    <span className="ml-2 opacity-70">({search.count})</span>
                  </Link>
                ))}
              </div>

              <Link
                href="/ads"
                className="px-6 py-2 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 transition flex items-center gap-2"
              >
                Chercher
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Recommendations */}
          <div className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className={`text-3xl font-black flex items-center gap-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                <Zap className="w-8 h-8 text-yellow-500" />
                Recommandé pour vous
              </h2>
              <Link href="/ads" className="text-purple-600 dark:text-purple-400 font-bold hover:underline flex items-center gap-2 text-sm">
                Voir plus
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recommendations.map((ad) => (
                <RecommendationCard key={ad.id} ad={ad} />
              ))}
            </div>
          </div>

          {/* Account Links */}
          <div className={`rounded-lg border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} p-6`}>
            <h2 className={`text-2xl font-black mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Accès rapide
            </h2>

            <div className="space-y-3">
              <Link
                href="/favoris"
                className={`flex items-center justify-between p-4 rounded-lg transition ${theme === 'dark' ? 'bg-slate-700 hover:bg-slate-600' : 'bg-gray-50 hover:bg-gray-100'}`}
              >
                <div className="flex items-center gap-3">
                  <Heart className="w-5 h-5 text-red-500" />
                  <span className="font-bold">Mes favoris</span>
                </div>
                <ArrowRight className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} />
              </Link>

              <Link
                href="/historique"
                className={`flex items-center justify-between p-4 rounded-lg transition ${theme === 'dark' ? 'bg-slate-700 hover:bg-slate-600' : 'bg-gray-50 hover:bg-gray-100'}`}
              >
                <div className="flex items-center gap-3">
                  <Eye className="w-5 h-5 text-cyan-500" />
                  <span className="font-bold">Mon historique</span>
                </div>
                <ArrowRight className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} />
              </Link>

              <Link
                href="/profil"
                className={`flex items-center justify-between p-4 rounded-lg transition ${theme === 'dark' ? 'bg-slate-700 hover:bg-slate-600' : 'bg-gray-50 hover:bg-gray-100'}`}
              >
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-purple-600" />
                  <span className="font-bold">Mon profil</span>
                </div>
                <ArrowRight className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} />
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
