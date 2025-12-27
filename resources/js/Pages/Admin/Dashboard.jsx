import { useState } from 'react';
import Header from '../../Components/Header';
import AdminSidebar from './AdminSidebar';
import Footer from '../../Components/Footer';
import { useThemeStore } from '../../store';
import {
  Users, CreditCard, AlertCircle, TrendingUp, BarChart3, Shield,
  Eye, Ban, CheckCircle, Zap, Activity, ArrowUpRight, ArrowDownLeft,
  Calendar, Briefcase, DollarSign, Download, Flame, Clock, Lock, AlertTriangle, Flag as FlagIcon
} from 'lucide-react';
import { Link } from '@inertiajs/react';

export default function AdminDashboard({ user, stats = {}, recentActivities = {} }) {
  const { theme } = useThemeStore();
  const [activeTab, setActiveTab] = useState('overview');

  // Ensure we have default values
  const dashboardStats = {
    users: stats?.users || { total: 0, visitors: 0, agencies: 0, employees: 0, active: 0, pending: 0, blocked: 0, new_today: 0, new_week: 0 },
    ads: stats?.ads || { total: 0, valid: 0, pending: 0, blocked: 0, new_today: 0 },
    revenue: stats?.revenue || { total: 0, today: 0, week: 0, month: 0 },
    reports: stats?.reports || { total: 0, pending: 0, resolved: 0 },
    subscriptions: stats?.subscriptions || { active: 0, pending: 0, expired: 0 },
    boosts: stats?.boosts || { active: 0, pending: 0 }
  };

  const activities = {
    new_users: recentActivities?.new_users || [],
    new_ads: recentActivities?.new_ads || [],
    pending_ads: recentActivities?.pending_ads || [],
    recent_reports: recentActivities?.recent_reports || [],
    pending_agencies: recentActivities?.pending_agencies || []
  };

  const getColorBg = (color) => {
    const colors = {
      purple: theme === 'dark' ? 'bg-purple-500/20' : 'bg-purple-100',
      pink: theme === 'dark' ? 'bg-pink-500/20' : 'bg-pink-100',
      emerald: theme === 'dark' ? 'bg-emerald-500/20' : 'bg-emerald-100',
      cyan: theme === 'dark' ? 'bg-cyan-500/20' : 'bg-cyan-100',
      yellow: theme === 'dark' ? 'bg-yellow-500/20' : 'bg-yellow-100',
      red: theme === 'dark' ? 'bg-red-500/20' : 'bg-red-100',
      orange: theme === 'dark' ? 'bg-orange-500/20' : 'bg-orange-100',
    };
    return colors[color] || colors.purple;
  };

  const getColorText = (color) => {
    const colors = {
      purple: theme === 'dark' ? 'text-purple-400' : 'text-purple-700',
      pink: theme === 'dark' ? 'text-pink-400' : 'text-pink-700',
      emerald: theme === 'dark' ? 'text-emerald-400' : 'text-emerald-700',
      cyan: theme === 'dark' ? 'text-cyan-400' : 'text-cyan-700',
      yellow: theme === 'dark' ? 'text-yellow-400' : 'text-yellow-700',
      red: theme === 'dark' ? 'text-red-400' : 'text-red-700',
      orange: theme === 'dark' ? 'text-orange-400' : 'text-orange-700',
    };
    return colors[color] || colors.purple;
  };

  const getStatusBg = (status) => {
    return status === 1 ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
      : status === 2 ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
      : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
  };

  const getStatusLabel = (status) => {
    return status === 1 ? 'Validé'
      : status === 2 ? 'En attente'
      : 'Bloqué';
  };

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <Header user={user} />

      <div className="flex flex-1">
        <AdminSidebar user={user} />

        <main className="flex-1 overflow-auto">
          <div className={theme === 'dark' ? 'bg-slate-900/50 border-b border-slate-800' : 'bg-white border-b border-gray-200'}>
            <div className="max-w-7xl mx-auto px-8 py-12 flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-3 flex items-center gap-3">
                  <Shield className="w-10 h-10 text-purple-600 dark:text-purple-400" />
                  Tableau de bord Admin
                </h1>
                <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}>
                  Gestion complète de la plateforme
                </p>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-8 py-16">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {[
                { label: 'Utilisateurs', value: dashboardStats.users.total, change: `+${dashboardStats.users.new_today} aujourd'hui`, icon: Users, color: 'purple' },
                { label: 'Agences', value: dashboardStats.users.agencies, change: `+${dashboardStats.users.pending} en attente`, icon: Briefcase, color: 'cyan' },
                { label: 'Annonces', value: dashboardStats.ads.total, change: `${dashboardStats.ads.pending} en attente`, icon: Flame, color: 'pink' },
                { label: 'Revenu', value: `XFA ${(dashboardStats.revenue.total || 0).toLocaleString()}`, change: `XFA ${(dashboardStats.revenue.month || 0).toLocaleString()} ce mois`, icon: DollarSign, color: 'emerald' },
              ].map((stat) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className={`rounded-lg border p-6 ${theme === 'dark' ? 'border-slate-700 bg-slate-900' : 'border-gray-200 bg-white'}`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getColorBg(stat.color)}`}>
                        <Icon className={`w-6 h-6 ${getColorText(stat.color)}`} />
                      </div>
                      <div className="flex items-center gap-1 text-emerald-500 text-sm font-bold">
                        <ArrowUpRight className="w-4 h-4" />
                      </div>
                    </div>
                    <p className={`text-sm font-bold mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>
                      {stat.label}
                    </p>
                    <p className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                      {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                    </p>
                    <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>
                      {stat.change}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Alert Cards for Critical Items */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {[
                { 
                  label: 'Annonces En Attente', 
                  value: dashboardStats.ads.pending, 
                  icon: AlertTriangle, 
                  color: 'yellow',
                  link: '/admin/annonces-en-attente'
                },
                { 
                  label: 'Signalements Non Résolus', 
                  value: dashboardStats.reports.pending, 
                  icon: FlagIcon, 
                  color: 'red',
                  link: '/admin/signalements'
                },
                { 
                  label: 'Agences En Validation', 
                  value: dashboardStats.users.pending, 
                  icon: Clock, 
                  color: 'orange',
                  link: '/admin/agences?status=2'
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.label}
                    href={item.link}
                    className={`rounded-lg border p-6 transition ${theme === 'dark' ? 'border-slate-700 bg-slate-900 hover:bg-slate-800' : 'border-gray-200 bg-white hover:bg-gray-50'}`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className={`text-sm font-bold mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>
                          {item.label}
                        </p>
                        <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                          {item.value}
                        </p>
                      </div>
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getColorBg(item.color)}`}>
                        <Icon className={`w-6 h-6 ${getColorText(item.color)}`} />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Tabs */}
            <div className="mb-8">
              <div className={`flex gap-4 border-b overflow-x-auto ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
                {[
                  { id: 'overview', label: 'Aperçu' },
                  { id: 'users', label: 'Utilisateurs Récents' },
                  { id: 'ads', label: 'Annonces En Attente' },
                  { id: 'reports', label: 'Signalements' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-3 font-semibold border-b-2 transition whitespace-nowrap ${
                      activeTab === tab.id
                        ? theme === 'dark'
                          ? 'border-purple-500 text-purple-400'
                          : 'border-purple-600 text-purple-600'
                        : theme === 'dark'
                        ? 'border-transparent text-gray-400 hover:text-gray-300'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <div className={`rounded-lg border p-8 ${theme === 'dark' ? 'border-slate-700 bg-slate-900' : 'border-gray-200 bg-white'}`}>
                  <h2 className={`text-2xl font-bold mb-6 flex items-center gap-2 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                    <Activity className="w-6 h-6 text-green-500" /> Activité Récente
                  </h2>
                  {activities.new_users && activities.new_users.length > 0 ? (
                    <div className="space-y-3">
                      {activities.new_users.slice(0, 5).map((u) => (
                        <div key={u.id} className={`flex items-center justify-between p-4 rounded-lg border ${theme === 'dark' ? 'border-slate-700 bg-slate-800' : 'border-gray-200 bg-gray-50'}`}>
                          <div>
                            <p className={`font-semibold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>{u.name}</p>
                            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{u.email}</p>
                          </div>
                          <div className="text-right">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBg(u.status)}`}>
                              {getStatusLabel(u.status)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className={`text-center py-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      Aucune activité récente
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div className={`rounded-lg border overflow-hidden ${theme === 'dark' ? 'border-slate-700 bg-slate-900' : 'border-gray-200 bg-white'}`}>
                <div className={`p-8 border-b ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
                  <h2 className={`text-2xl font-bold flex items-center gap-2 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                    <Users className="w-6 h-6 text-purple-500" /> Utilisateurs Récents
                  </h2>
                </div>
                {activities.new_users && activities.new_users.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className={`border-b ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
                          <th className={`text-left px-8 py-4 font-bold text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>Nom</th>
                          <th className={`text-left px-8 py-4 font-bold text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>Email</th>
                          <th className={`text-left px-8 py-4 font-bold text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>Statut</th>
                          <th className={`text-left px-8 py-4 font-bold text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activities.new_users.slice(0, 10).map((u) => (
                          <tr
                            key={u.id}
                            className={`border-b transition ${theme === 'dark' ? 'border-slate-700 hover:bg-slate-800/30' : 'border-gray-100 hover:bg-gray-50'}`}
                          >
                            <td className={`px-8 py-4 font-bold max-w-xs truncate ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                              {u.name}
                            </td>
                            <td className={`px-8 py-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-800'}`}>
                              {u.email}
                            </td>
                            <td className="px-8 py-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBg(u.status)}`}>
                                {getStatusLabel(u.status)}
                              </span>
                            </td>
                            <td className={`px-8 py-4 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-800'}`}>
                              {u.created_at}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Aucun utilisateur récent</p>
                  </div>
                )}
              </div>
            )}

            {/* Ads Tab */}
            {activeTab === 'ads' && (
              <div className={`rounded-lg border overflow-hidden ${theme === 'dark' ? 'border-slate-700 bg-slate-900' : 'border-gray-200 bg-white'}`}>
                <div className={`p-8 border-b ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
                  <h2 className={`text-2xl font-bold flex items-center gap-2 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                    <Flame className="w-6 h-6 text-orange-500" /> Annonces En Attente de Validation
                  </h2>
                </div>
                {activities.pending_ads && activities.pending_ads.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className={`border-b ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
                          <th className={`text-left px-8 py-4 font-bold text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>Titre</th>
                          <th className={`text-left px-8 py-4 font-bold text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>Agence</th>
                          <th className={`text-left px-8 py-4 font-bold text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>Date</th>
                          <th className={`text-left px-8 py-4 font-bold text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activities.pending_ads.slice(0, 10).map((ad) => (
                          <tr
                            key={ad.id}
                            className={`border-b transition ${theme === 'dark' ? 'border-slate-700 hover:bg-slate-800/30' : 'border-gray-100 hover:bg-gray-50'}`}
                          >
                            <td className={`px-8 py-4 font-bold max-w-xs truncate ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                              {ad.title}
                            </td>
                            <td className={`px-8 py-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-800'}`}>
                              {ad.user?.name || 'N/A'}
                            </td>
                            <td className={`px-8 py-4 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-800'}`}>
                              {ad.created_at}
                            </td>
                            <td className="px-8 py-4 text-sm space-x-2">
                              <Link href={`/admin/annonces/${ad.id}`} className={`font-medium ${theme === 'dark' ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-800'}`}>
                                Examiner
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Aucune annonce en attente</p>
                  </div>
                )}
              </div>
            )}

            {/* Reports Tab */}
            {activeTab === 'reports' && (
              <div className={`rounded-lg border p-8 ${theme === 'dark' ? 'border-slate-700 bg-slate-900' : 'border-gray-200 bg-white'}`}>
                <h2 className={`text-2xl font-bold mb-6 flex items-center gap-2 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                  <AlertCircle className="w-6 h-6 text-red-500" /> Signalements Récents
                </h2>
                {activities.recent_reports && activities.recent_reports.length > 0 ? (
                  <div className="space-y-4">
                    {activities.recent_reports.slice(0, 5).map((report) => (
                      <div key={report.id} className={`rounded-lg border p-6 ${theme === 'dark' ? 'border-slate-700 bg-slate-800' : 'border-gray-200 bg-gray-50'}`}>
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                              {report.ad?.title || 'Annonce'}
                            </h3>
                            <p className={`text-sm mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                              Raison: {report.reason}
                            </p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                            report.status === 'pending' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                            : report.status === 'investigating' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                            : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                          }`}>
                            {report.status === 'pending' ? 'Ouvert' : report.status === 'investigating' ? 'En cours' : 'Résolu'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className={`text-center py-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Aucun signalement récent
                  </p>
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
