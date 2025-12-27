import { useState } from 'react';
import Header from '../../Components/Header';
import AdminSidebar from './AdminSidebar';
import Footer from '../../Components/Footer';
import { useThemeStore } from '../../store';
import {
  BarChart3, Users, Flame, Eye, MessageSquare, DollarSign,
  TrendingUp, Calendar, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function AdminStatistics({ stats, charts, filters }) {
  const { theme } = useThemeStore();
  const [period, setPeriod] = useState(filters?.period || 'month');

  const colors = {
    primary: theme === 'dark' ? '#a855f7' : '#9333ea',
    secondary: theme === 'dark' ? '#06b6d4' : '#0891b2',
    success: theme === 'dark' ? '#10b981' : '#059669',
    warning: theme === 'dark' ? '#f59e0b' : '#d97706',
  };

  const adStatusColors = {
    valid: '#10b981',
    pending: '#f59e0b',
    blocked: '#ef4444',
  };

  const userTypeColors = {
    visitor: '#06b6d4',
    agency: '#8b5cf6',
    employee: '#ec4899',
  };

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <Header />

      <div className="flex flex-1">
        <AdminSidebar />

        <main className="flex-1 overflow-auto">
          {/* Header */}
          <div className={theme === 'dark' ? 'bg-slate-900/50 border-b border-slate-800' : 'bg-white border-b border-gray-200'}>
            <div className="max-w-7xl mx-auto px-8 py-12">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-bold mb-3 flex items-center gap-3">
                    <BarChart3 className="w-10 h-10 text-purple-600 dark:text-purple-400" />
                    Statistiques & Analytiques
                  </h1>
                  <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}>
                    Analyse détaillée de la plateforme
                  </p>
                </div>
                <select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className={`px-4 py-2 rounded-lg border ${
                    theme === 'dark'
                      ? 'border-slate-700 bg-slate-800 text-gray-100'
                      : 'border-gray-300 bg-white text-gray-900'
                  }`}
                >
                  <option value="week">Cette semaine</option>
                  <option value="month">Ce mois</option>
                  <option value="quarter">Ce trimestre</option>
                  <option value="year">Cette année</option>
                </select>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-8 py-16">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
              {[
                { label: 'Utilisateurs', value: (stats?.total_users || 0).toLocaleString(), icon: Users },
                { label: 'Annonces', value: (stats?.total_ads || 0).toLocaleString(), icon: Flame },
                { label: 'Vues', value: (stats?.total_views || 0).toLocaleString(), icon: Eye },
                { label: 'Revenu', value: `XFA ${(stats?.total_revenue || 0).toLocaleString()}`, icon: DollarSign },
              ].map((stat) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className={`rounded-lg border p-4 ${theme === 'dark' ? 'border-slate-700 bg-slate-900' : 'border-gray-200 bg-white'}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className={`text-sm font-bold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>
                        {stat.label}
                      </p>
                      <Icon className="w-4 h-4 text-purple-500" />
                    </div>
                    <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                      {stat.value}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
              {/* User Growth */}
              <div className={`rounded-lg border p-6 ${theme === 'dark' ? 'border-slate-700 bg-slate-900' : 'border-gray-200 bg-white'}`}>
                <h2 className={`text-lg font-bold mb-6 flex items-center gap-2 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                  <Users className="w-5 h-5 text-cyan-500" /> Croissance des Utilisateurs
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={charts?.userGrowth || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#334155' : '#e5e7eb'} />
                    <XAxis dataKey="date" stroke={theme === 'dark' ? '#94a3b8' : '#6b7280'} />
                    <YAxis stroke={theme === 'dark' ? '#94a3b8' : '#6b7280'} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: theme === 'dark' ? '#1e293b' : '#fff',
                        border: `1px solid ${theme === 'dark' ? '#475569' : '#e5e7eb'}`,
                        borderRadius: '8px',
                        color: theme === 'dark' ? '#e2e8f0' : '#1f2937',
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke={colors.primary}
                      strokeWidth={2}
                      dot={{ fill: colors.primary, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Ad Status Distribution */}
              <div className={`rounded-lg border p-6 ${theme === 'dark' ? 'border-slate-700 bg-slate-900' : 'border-gray-200 bg-white'}`}>
                <h2 className={`text-lg font-bold mb-6 flex items-center gap-2 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                  <Flame className="w-5 h-5 text-orange-500" /> Distribution des Annonces
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Publiées', value: charts?.adStatus?.valid || 0, fill: adStatusColors.valid },
                        { name: 'En attente', value: charts?.adStatus?.pending || 0, fill: adStatusColors.pending },
                        { name: 'Bloquées', value: charts?.adStatus?.blocked || 0, fill: adStatusColors.blocked },
                      ].filter(item => item.value > 0)}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {[
                        { name: 'Publiées', value: 0, fill: adStatusColors.valid },
                        { name: 'En attente', value: 0, fill: adStatusColors.pending },
                        { name: 'Bloquées', value: 0, fill: adStatusColors.blocked },
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: theme === 'dark' ? '#1e293b' : '#fff',
                        border: `1px solid ${theme === 'dark' ? '#475569' : '#e5e7eb'}`,
                        borderRadius: '8px',
                        color: theme === 'dark' ? '#e2e8f0' : '#1f2937',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Revenue Growth */}
              <div className={`rounded-lg border p-6 ${theme === 'dark' ? 'border-slate-700 bg-slate-900' : 'border-gray-200 bg-white'}`}>
                <h2 className={`text-lg font-bold mb-6 flex items-center gap-2 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                  <DollarSign className="w-5 h-5 text-green-500" /> Croissance des Revenus
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={charts?.revenueGrowth || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#334155' : '#e5e7eb'} />
                    <XAxis dataKey="date" stroke={theme === 'dark' ? '#94a3b8' : '#6b7280'} />
                    <YAxis stroke={theme === 'dark' ? '#94a3b8' : '#6b7280'} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: theme === 'dark' ? '#1e293b' : '#fff',
                        border: `1px solid ${theme === 'dark' ? '#475569' : '#e5e7eb'}`,
                        borderRadius: '8px',
                        color: theme === 'dark' ? '#e2e8f0' : '#1f2937',
                      }}
                    />
                    <Bar dataKey="amount" fill={colors.success} radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Ad Growth */}
              <div className={`rounded-lg border p-6 ${theme === 'dark' ? 'border-slate-700 bg-slate-900' : 'border-gray-200 bg-white'}`}>
                <h2 className={`text-lg font-bold mb-6 flex items-center gap-2 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                  <TrendingUp className="w-5 h-5 text-purple-500" /> Croissance des Annonces
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={charts?.adGrowth || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#334155' : '#e5e7eb'} />
                    <XAxis dataKey="date" stroke={theme === 'dark' ? '#94a3b8' : '#6b7280'} />
                    <YAxis stroke={theme === 'dark' ? '#94a3b8' : '#6b7280'} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: theme === 'dark' ? '#1e293b' : '#fff',
                        border: `1px solid ${theme === 'dark' ? '#475569' : '#e5e7eb'}`,
                        borderRadius: '8px',
                        color: theme === 'dark' ? '#e2e8f0' : '#1f2937',
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke={colors.warning}
                      strokeWidth={2}
                      dot={{ fill: colors.warning, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top Ads */}
            <div className={`rounded-lg border p-6 mb-8 ${theme === 'dark' ? 'border-slate-700 bg-slate-900' : 'border-gray-200 bg-white'}`}>
              <h2 className={`text-lg font-bold mb-6 flex items-center gap-2 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                <Flame className="w-5 h-5 text-orange-500" /> Annonces les Plus Vues
              </h2>
              <div className="space-y-3">
                {charts?.topAds?.slice(0, 10).map((ad, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center justify-between p-4 rounded-lg ${theme === 'dark' ? 'bg-slate-800' : 'bg-gray-50'}`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <span className={`text-sm font-bold px-2 py-1 rounded ${theme === 'dark' ? 'bg-slate-700' : 'bg-gray-200'}`}>
                          #{idx + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className={`font-semibold truncate ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                            {ad.title}
                          </p>
                          <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            {ad.agency}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <p className={`font-bold text-lg ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                        {ad.views.toLocaleString()}
                      </p>
                      <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        vues
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Agencies */}
            <div className={`rounded-lg border p-6 ${theme === 'dark' ? 'border-slate-700 bg-slate-900' : 'border-gray-200 bg-white'}`}>
              <h2 className={`text-lg font-bold mb-6 flex items-center gap-2 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                <Users className="w-5 h-5 text-purple-500" /> Agences les Plus Actives
              </h2>
              <div className="space-y-3">
                {charts?.topAgencies?.slice(0, 10).map((agency, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center justify-between p-4 rounded-lg ${theme === 'dark' ? 'bg-slate-800' : 'bg-gray-50'}`}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span className={`text-sm font-bold px-2 py-1 rounded ${theme === 'dark' ? 'bg-slate-700' : 'bg-gray-200'}`}>
                        #{idx + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className={`font-semibold truncate ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                          {agency.name}
                        </p>
                        <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          {agency.ads_count} annonces
                        </p>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <p className={`font-bold text-lg ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                        {agency.total_views.toLocaleString()}
                      </p>
                      <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        vues
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
