import { useState } from 'react';
import { Link } from '@inertiajs/react';
import Header from '../../Components/Header';
import AgencySidebar from './AgencySidebar';
import { useThemeStore } from '../../store';
import {
  Download,
  Eye,
  MousePointerClick,
  DollarSign,
  Target,
  ArrowUpRight,
} from 'lucide-react';

export default function AgencyStatistics({ user }) {
  const { theme } = useThemeStore();
  const [dateRange, setDateRange] = useState('month');

  const stats = [
    { label: 'Impressions', value: '12,847', change: '+12%', icon: Eye, color: 'purple' },
    { label: 'Clics', value: '1,234', change: '+8%', icon: MousePointerClick, color: 'pink' },
    { label: 'Revenu', value: '3,450€', change: '+15%', icon: DollarSign, color: 'emerald' },
    { label: 'Taux CTR', value: '9.6%', change: '+2.3%', icon: Target, color: 'cyan' },
  ];

  const topAds = [
    { title: 'Développeur Full Stack React/Laravel', impressions: 3456, clicks: 428, ctr: '12.4%', revenue: '1,200€', trend: '+18%' },
    { title: 'Designer UX/UI', impressions: 2341, clicks: 245, ctr: '10.5%', revenue: '685€', trend: '+12%' },
    { title: 'Responsable Commercial B2B', impressions: 1876, clicks: 198, ctr: '10.5%', revenue: '554€', trend: '+8%' },
    { title: 'Community Manager', impressions: 1234, clicks: 124, ctr: '10.0%', revenue: '347€', trend: '+5%' },
    { title: 'Infirmier(e) - Nuit', impressions: 989, clicks: 89, ctr: '9.0%', revenue: '249€', trend: '+3%' },
  ];

  const categoryMetrics = [
    { category: 'Emploi', ads: 8, impressions: 6234, clicks: 612, revenue: '1,708€', pct: 49 },
    { category: 'Services', ads: 3, impressions: 3456, clicks: 389, revenue: '1,087€', pct: 31 },
    { category: 'Immobilier', ads: 2, impressions: 1892, clicks: 156, revenue: '436€', pct: 13 },
    { category: 'Formation', ads: 1, impressions: 1265, clicks: 77, revenue: '215€', pct: 7 },
  ];

  const chartData = [
    { day: 'Lun', value: 854 },
    { day: 'Mar', value: 923 },
    { day: 'Mer', value: 1087 },
    { day: 'Jeu', value: 956 },
    { day: 'Ven', value: 1245 },
    { day: 'Sam', value: 2134 },
    { day: 'Dim', value: 1618 },
  ];

  const maxValue = Math.max(...chartData.map(d => d.value));

  const getColorBg = (color) => {
    const colors = {
      purple: theme === 'dark' ? 'bg-purple-500/20' : 'bg-purple-100',
      pink: theme === 'dark' ? 'bg-pink-500/20' : 'bg-pink-100',
      emerald: theme === 'dark' ? 'bg-emerald-500/20' : 'bg-emerald-100',
      cyan: theme === 'dark' ? 'bg-cyan-500/20' : 'bg-cyan-100',
    };
    return colors[color];
  };

  const getColorText = (color) => {
    const colors = {
      purple: theme === 'dark' ? 'text-purple-400' : 'text-purple-700',
      pink: theme === 'dark' ? 'text-pink-400' : 'text-pink-700',
      emerald: theme === 'dark' ? 'text-emerald-400' : 'text-emerald-700',
      cyan: theme === 'dark' ? 'text-cyan-400' : 'text-cyan-700',
    };
    return colors[color];
  };

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <Header user={user} />

      <div className="flex flex-1">
        <AgencySidebar user={user} />

        <main className="flex-1">
          <div className={theme === 'dark' ? 'bg-slate-900/50 border-b border-slate-800' : 'bg-white border-b border-gray-200'}>
            <div className="max-w-7xl mx-auto px-8 py-12 flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-3">Statistiques</h1>
                <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}>
                  Performance de vos annonces en temps réel
                </p>
              </div>
              <div className="flex gap-4">
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className={`px-4 py-2 rounded-lg border font-medium ${theme === 'dark' ? 'border-slate-700 bg-slate-800 text-gray-100' : 'border-gray-300 bg-white text-gray-900'}`}
                >
                  <option value="week">Cette semaine</option>
                  <option value="month">Ce mois</option>
                  <option value="quarter">Ce trimestre</option>
                  <option value="year">Cette année</option>
                </select>
                <button className={`px-4 py-2 rounded-lg border font-medium flex items-center gap-2 transition ${theme === 'dark' ? 'border-slate-700 bg-slate-800 hover:bg-slate-700 text-gray-100' : 'border-gray-300 bg-white hover:bg-gray-100 text-gray-900'}`}>
                  <Download className="w-4 h-4" />
                  Exporter
                </button>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-8 py-16">
            {/* Key Metrics */}
            <div className="grid grid-cols-4 gap-6 mb-12">
              {stats.map((stat) => {
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
                        {stat.change}
                      </div>
                    </div>
                    <p className={`text-sm font-bold mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>
                      {stat.label}
                    </p>
                    <p className={`text-3xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                      {stat.value}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Chart and Summary */}
            <div className="grid grid-cols-3 gap-6 mb-12">
              <div className={`col-span-2 rounded-lg border p-8 ${theme === 'dark' ? 'border-slate-700 bg-slate-900' : 'border-gray-200 bg-white'}`}>
                <h2 className={`text-xl font-bold mb-6 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                  Impressions cette semaine
                </h2>
                <div className="flex items-end justify-between gap-2 h-64">
                  {chartData.map((data, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-3">
                      <div
                        className="w-full rounded-t transition-all duration-300 hover:bg-purple-500/80 cursor-pointer"
                        style={{
                          height: `${(data.value / maxValue) * 100}%`,
                          background: 'linear-gradient(to top, rgb(168, 85, 247), rgb(139, 92, 246))',
                        }}
                      ></div>
                      <span className={`text-sm font-bold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>
                        {data.day}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className={`rounded-lg border p-8 ${theme === 'dark' ? 'border-slate-700 bg-slate-900' : 'border-gray-200 bg-white'}`}>
                <h2 className={`text-xl font-bold mb-6 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                  Répartition par catégorie
                </h2>
                <div className="space-y-4">
                  {categoryMetrics.map((cat) => (
                    <div key={cat.category}>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-sm font-bold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                          {cat.category}
                        </span>
                        <span className={`text-sm font-bold text-purple-600 dark:text-purple-400`}>
                          {cat.pct}%
                        </span>
                      </div>
                      <div className={`h-2 rounded-full overflow-hidden ${theme === 'dark' ? 'bg-slate-800' : 'bg-gray-200'}`}>
                        <div
                          className="h-full bg-gradient-to-r from-purple-600 to-pink-600"
                          style={{ width: `${cat.pct}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Top Ads Table */}
            <div className={`rounded-lg border overflow-hidden ${theme === 'dark' ? 'border-slate-700 bg-slate-900' : 'border-gray-200 bg-white'}`}>
              <div className={`p-8 border-b ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
                <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                  Annonces les plus performantes
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={`border-b ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
                      <th className={`text-left px-8 py-4 font-bold text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>Annonce</th>
                      <th className={`text-left px-8 py-4 font-bold text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>Impressions</th>
                      <th className={`text-left px-8 py-4 font-bold text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>Clics</th>
                      <th className={`text-left px-8 py-4 font-bold text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>CTR</th>
                      <th className={`text-left px-8 py-4 font-bold text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>Revenu</th>
                      <th className={`text-left px-8 py-4 font-bold text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>Tendance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topAds.map((ad, idx) => (
                      <tr
                        key={idx}
                        className={`border-b transition ${theme === 'dark' ? 'border-slate-700 hover:bg-slate-800/30' : 'border-gray-100 hover:bg-gray-50'}`}
                      >
                        <td className={`px-8 py-4 font-bold max-w-xs truncate ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                          {ad.title}
                        </td>
                        <td className={`px-8 py-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-800'}`}>
                          {ad.impressions.toLocaleString()}
                        </td>
                        <td className={`px-8 py-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-800'}`}>
                          {ad.clicks}
                        </td>
                        <td className={`px-8 py-4 font-bold text-purple-600 dark:text-purple-400`}>
                          {ad.ctr}
                        </td>
                        <td className={`px-8 py-4 font-bold text-emerald-600 dark:text-emerald-400`}>
                          {ad.revenue}
                        </td>
                        <td className="px-8 py-4">
                          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                            <ArrowUpRight className="w-4 h-4" />
                            {ad.trend}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>

  
    </div>
  );
}
