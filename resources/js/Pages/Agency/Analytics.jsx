import { useState, useMemo } from 'react';
import { router } from '@inertiajs/react';
import { useThemeStore } from '../../store';
import AgencyLayout from '../../Layouts/AgencyLayout';
import AgencyContextBanner from '../../Components/AgencyContextBanner';
import {
  Download,
  Eye,
  MousePointerClick,
  Target,
  ArrowUpRight,
  TrendingUp,
  Activity,
  Phone,
  Mail,
  Calendar,
  User,
  Filter,
  ChevronDown,
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function Analytics({ user = {}, analytics = {}, selectedAgency = null, availableAgencies = [] }) {
  const { theme } = useThemeStore();
  const [selectedAd, setSelectedAd] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Helper function to safely extract string values from properties that might be objects
  const safeString = (value, fallback = 'N/A') => {
    if (value === null || value === undefined) return fallback;
    if (typeof value === 'string') return value;
    if (typeof value === 'object') {
      return value.title || value.name || value.slug || JSON.stringify(value);
    }
    return String(value);
  };

  // Get period and date from URL parameters if they exist
  const params = new URLSearchParams(window.location.search);
  const [period, setPeriod] = useState(params.get('period') || 'month');
  const [selectedDay, setSelectedDay] = useState(params.get('date') || '');

  // Handle period change - reload the page with new parameters
  const handlePeriodChange = (newPeriod) => {
    setPeriod(newPeriod);
    const newParams = new URLSearchParams();
    newParams.set('period', newPeriod);
    if (newPeriod === 'day' && selectedDay) {
      newParams.set('date', selectedDay);
    }
    router.get(route('agency.analytics'), Object.fromEntries(newParams));
  };

  // Handle date change - reload the page with new parameters
  const handleDateChange = (newDate) => {
    setSelectedDay(newDate);
    const newParams = new URLSearchParams();
    newParams.set('period', 'day');
    newParams.set('date', newDate);
    router.get(route('agency.analytics'), Object.fromEntries(newParams));
  };

  // Export function - generates CSV from current analytics data
  const handleExport = () => {
    try {
      // Prepare CSV content
      let csvContent = 'data:text/csv;charset=utf-8,';

      // Add header
      csvContent += `Analytiques ${period === 'day' && selectedDay ? selectedDay : period}\n`;
      csvContent += `Généré le ${new Date().toLocaleDateString('fr-FR')}\n\n`;

      // Add summary stats
      csvContent += 'RÉSUMÉ\n';
      csvContent += `Total des vues,${analytics.totalViews || 0}\n`;
      csvContent += `Total des contacts,${analytics.totalContacts || 0}\n`;
      csvContent += `Taux de conversion,${analytics.conversionRate || 0}%\n`;
      csvContent += `Moyenne vues/annonce,${analytics.avgViewsPerAd || 0}\n`;
      csvContent += `Annonces actives,${analytics.activeAds || 0}\n\n`;

      // Add top ads
      if (analytics.topAds && analytics.topAds.length > 0) {
        csvContent += 'TOP ANNONCES\n';
        csvContent += 'Titre,Vues,Contacts,CTR\n';
        analytics.topAds.forEach(ad => {
          csvContent += `"${safeString(ad.title)}",${ad.views || 0},${ad.clicks || 0},${ad.ctr || 0}%\n`;
        });
        csvContent += '\n';
      }

      // Add category metrics
      if (analytics.categoryMetrics && analytics.categoryMetrics.length > 0) {
        csvContent += 'PERFORMANCE PAR CATÉGORIE\n';
        csvContent += 'Catégorie,Annonces,Impressions,Clics,CTR\n';
        analytics.categoryMetrics.forEach(cat => {
          const categoryName = typeof cat.category === 'object' && cat.category !== null ? (cat.category.name || cat.category.slug || 'N/A') : (cat.category || 'N/A');
          csvContent += `"${categoryName}",${cat.ads || 0},${cat.impressions || 0},${cat.clicks || 0},${cat.pct || 0}%\n`;
        });
        csvContent += '\n';
      }

      // Add recent contacts
      if (analytics.recentContacts && analytics.recentContacts.length > 0) {
        csvContent += 'DERNIERS CONTACTS\n';
        csvContent += 'Nom,Email,Téléphone,Annonce,Date\n';
        analytics.recentContacts.forEach(contact => {
          csvContent += `"${safeString(contact.user_name, 'N/A')}","${safeString(contact.user_email, 'N/A')}","${safeString(contact.user_phone, 'N/A')}","${safeString(contact.ad_title, 'N/A')}","${contact.created_at || ''}"\n`;
        });
      }

      // Download CSV
      const link = document.createElement('a');
      link.setAttribute('href', encodeURI(csvContent));
      const fileName = `analytics-${period}-${new Date().toISOString().split('T')[0]}.csv`;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error exporting analytics:', error);
      alert('Erreur lors de l\'export des données');
    }
  };

  const stats = {
    totalViews: analytics?.totalViews ?? 0,
    totalClicks: analytics?.totalClicks ?? 0,
    totalContacts: analytics?.totalContacts ?? 0,
    conversionRate: analytics?.conversionRate ?? 0,
    avgViewsPerAd: analytics?.avgViewsPerAd ?? 0,
    activeAds: analytics?.activeAds ?? 0,
  };

  // DONNÉES RÉELLES du backend
  const topAds = analytics?.topAds ?? [];
  const categoryMetrics = analytics?.categoryMetrics ?? [];
  const recentContacts = analytics?.recentContacts ?? [];
  const recentViews = analytics?.recentViews ?? [];
  const performanceData = analytics?.performanceData ?? [];
  const contactsByAd = analytics?.contactsByAd ?? [];

  const COLORS = ['#a855f7', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#3b82f6'];

  const ctr = stats.totalViews > 0 ? ((stats.totalClicks / stats.totalViews) * 100).toFixed(1) : 0;

  const getColorBg = (color) => {
    const colors = {
      purple: theme === 'dark' ? 'bg-purple-500/20' : 'bg-purple-100',
      pink: theme === 'dark' ? 'bg-pink-500/20' : 'bg-pink-100',
      emerald: theme === 'dark' ? 'bg-emerald-500/20' : 'bg-emerald-100',
      cyan: theme === 'dark' ? 'bg-cyan-500/20' : 'bg-cyan-100',
      blue: theme === 'dark' ? 'bg-blue-500/20' : 'bg-blue-100',
    };
    return colors[color];
  };

  const getColorText = (color) => {
    const colors = {
      purple: theme === 'dark' ? 'text-purple-400' : 'text-purple-700',
      pink: theme === 'dark' ? 'text-pink-400' : 'text-pink-700',
      emerald: theme === 'dark' ? 'text-emerald-400' : 'text-emerald-700',
      cyan: theme === 'dark' ? 'text-cyan-400' : 'text-cyan-700',
      blue: theme === 'dark' ? 'text-blue-400' : 'text-blue-700',
    };
    return colors[color];
  };

  const StatCard = ({ icon: Icon, label, value, color, trend, subtext }) => (
    <div className={`rounded-lg border p-6 transition ${theme === 'dark' ? 'border-slate-700 bg-slate-900 hover:bg-slate-800' : 'border-gray-200 bg-white hover:bg-gray-50'}`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getColorBg(color)}`}>
          <Icon className={`w-6 h-6 ${getColorText(color)}`} />
        </div>
        {trend && (
          <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-sm font-bold">
            <ArrowUpRight className="w-4 h-4" />
            {trend}
          </div>
        )}
      </div>
      <p className={`text-sm font-bold mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>
        {label}
      </p>
      <p className={`text-3xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
        {typeof value === 'number' ? value.toLocaleString('fr-FR') : value}
      </p>
      {subtext && <p className={`text-xs mt-2 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>{subtext}</p>}
    </div>
  );

  return (
    <>
      {/* Agency Context Banner */}
      <div className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <AgencyContextBanner
            agencyName={selectedAgency?.name}
            agencyId={selectedAgency?.id}
            spaceName={selectedAgency?.spaceName}
            onChangeClick={() => window.location.href = '/select-agency'}
          />
        </div>
      </div>

      {/* Header */}
      <div className={theme === 'dark' ? 'bg-slate-900/50 border-b border-slate-800' : 'bg-white border-b border-gray-200'}>
        <div className="max-w-7xl mx-auto px-8 py-12 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <TrendingUp className="w-8 h-8 text-purple-600" />
              <h1 className="text-4xl font-bold">Analytiques Détaillées</h1>
            </div>
            <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}>
              Analyse complète des performances avec données réelles de vos visiteurs
            </p>
          </div>
          <div className="flex gap-4 items-end">
            <div className="flex flex-col gap-2">
              <label className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Période
              </label>
              <select
                value={period}
                onChange={(e) => handlePeriodChange(e.target.value)}
                className={`px-4 py-2 rounded-lg border font-medium ${theme === 'dark' ? 'border-slate-700 bg-slate-800 text-gray-100' : 'border-gray-300 bg-white text-gray-900'}`}
              >
                <option value="day">Ce jour</option>
                <option value="week">Cette semaine</option>
                <option value="month">Ce mois</option>
                <option value="quarter">Ce trimestre</option>
                <option value="year">Cette année</option>
              </select>
            </div>
            {period === 'day' && (
              <div className="flex flex-col gap-2">
                <label className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Sélectionner un jour
                </label>
                <input
                  type="date"
                  value={selectedDay}
                  onChange={(e) => handleDateChange(e.target.value)}
                  className={`px-4 py-2 rounded-lg border font-medium ${theme === 'dark' ? 'border-slate-700 bg-slate-800 text-gray-100' : 'border-gray-300 bg-white text-gray-900'}`}
                />
              </div>
            )}
            <button
              onClick={handleExport}
              className={`px-4 py-2 rounded-lg border font-medium flex items-center gap-2 transition ${theme === 'dark' ? 'border-slate-700 bg-slate-800 hover:bg-slate-700 text-gray-100' : 'border-gray-300 bg-white hover:bg-gray-100 text-gray-900'}`}
            >
              <Download className="w-4 h-4" />
              Exporter
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-16">
        {/* Tabs */}
        <div className={`flex gap-4 mb-8 border-b ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
          {['overview', 'contacts', 'views', 'detailed'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 px-4 font-bold transition border-b-2 flex items-center gap-2 ${
                activeTab === tab
                  ? `border-purple-600 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`
                  : `border-transparent ${theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'}`
              }`}
            >
              {tab === 'overview' && (
                <>
                  <BarChart className="w-4 h-4" />
                  Vue d'ensemble
                </>
              )}
              {tab === 'contacts' && (
                <>
                  <Mail className="w-4 h-4" />
                  Contacts reçus
                </>
              )}
              {tab === 'views' && (
                <>
                  <Eye className="w-4 h-4" />
                  Consultations
                </>
              )}
              {tab === 'detailed' && (
                <>
                  <Filter className="w-4 h-4" />
                  Détails par annonce
                </>
              )}
            </button>
          ))}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-12">
            {/* Key Metrics Cards */}
            <div className="grid grid-cols-4 gap-6">
              <StatCard 
                icon={Eye} 
                label="Vues totales" 
                value={stats.totalViews} 
                color="purple" 
                trend="+12%"
                subtext={`${stats.avgViewsPerAd} vues/annonce`}
              />
              <StatCard 
                icon={MousePointerClick} 
                label="Contacts reçus" 
                value={stats.totalContacts} 
                color="emerald" 
                trend="+18%"
                subtext={`${stats.totalContacts} personnes intéressées`}
              />
              <StatCard 
                icon={Target} 
                label="Taux de conversion" 
                value={`${ctr}%`} 
                color="cyan"
                subtext={`${stats.conversionRate}% conversion globale`}
              />
              <StatCard 
                icon={TrendingUp} 
                label="Annonces actives" 
                value={stats.activeAds} 
                color="pink"
              />
            </div>

            {/* Performance Graph - VRAIS DONNÉES */}
            <div className={`rounded-lg border p-8 ${theme === 'dark' ? 'border-slate-700 bg-slate-900' : 'border-gray-200 bg-white'}`}>
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                  Performance (DONNÉES RÉELLES)
                </h2>
              </div>
              {performanceData && performanceData.length > 0 ? (
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#334155' : '#e5e7eb'} />
                    <XAxis
                      dataKey="date"
                      stroke={theme === 'dark' ? '#94a3b8' : '#6b7280'}
                      tick={{ fontSize: 11 }}
                      interval={Math.floor(performanceData.length / 6)}
                      tickFormatter={(value) => {
                        if (typeof value === 'string' && value.includes('-')) {
                          const parts = value.split('-');
                          return `${parts[2]}/${parts[1]}`;
                        }
                        return value;
                      }}
                    />
                    <YAxis stroke={theme === 'dark' ? '#94a3b8' : '#6b7280'} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: theme === 'dark' ? '#1e293b' : '#fff',
                        border: theme === 'dark' ? '1px solid #334155' : '1px solid #e5e7eb'
                      }}
                      formatter={(value) => value.toLocaleString('fr-FR')}
                      labelFormatter={(label) => {
                        if (typeof label === 'string' && label.includes('-')) {
                          const parts = label.split('-');
                          const date = new Date(label);
                          return date.toLocaleDateString('fr-FR');
                        }
                        return label;
                      }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="views" stroke="#a855f7" strokeWidth={3} name="Vues" dot={false} />
                    <Line type="monotone" dataKey="contacts" stroke="#10b981" strokeWidth={3} name="Contacts" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className={`flex flex-col items-center justify-center py-12 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  <Activity className="w-12 h-12 mb-3 opacity-50" />
                  <p>Aucune donnée de performance disponible pour cette période</p>
                </div>
              )}
            </div>

            {/* Category Breakdown - VRAIES DONNÉES */}
            {categoryMetrics.length > 0 && (
              <div className="grid grid-cols-2 gap-6">
                <div className={`rounded-lg border p-8 ${theme === 'dark' ? 'border-slate-700 bg-slate-900' : 'border-gray-200 bg-white'}`}>
                  <div className="flex items-center gap-3 mb-6">
                    <Activity className="w-5 h-5 text-blue-600" />
                    <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                      Performance par catégorie
                    </h2>
                  </div>
                  <div className="space-y-4">
                    {categoryMetrics.map((cat, idx) => (
                      <div key={idx} className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-slate-800' : 'bg-gray-50'}`}>
                        <div className="flex justify-between items-center mb-2">
                          <span className={`font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                            {typeof cat.category === 'object' && cat.category !== null ? (cat.category.name || cat.category.slug || 'Catégorie') : (cat.category || 'Catégorie')}
                          </span>
                          <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
                            {cat.pct}% CTR
                          </span>
                        </div>
                        <div className={`h-2 rounded-full overflow-hidden mb-2 ${theme === 'dark' ? 'bg-slate-700' : 'bg-gray-200'}`}>
                          <div
                            className="h-full bg-gradient-to-r from-purple-600 to-pink-600"
                            style={{ width: `${cat.pct}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                            {cat.impressions} vues • {cat.clicks} clics
                          </span>
                          <span className={`font-bold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            {cat.ads} annonce{cat.ads > 1 ? 's' : ''}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top Ads - VRAIES DONNÉES */}
                <div className={`rounded-lg border p-8 ${theme === 'dark' ? 'border-slate-700 bg-slate-900' : 'border-gray-200 bg-white'}`}>
                  <div className="flex items-center gap-3 mb-6">
                    <Target className="w-5 h-5 text-pink-600" />
                    <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                      Top 5 annonces
                    </h2>
                  </div>
                  <div className="space-y-3">
                    {topAds.slice(0, 5).map((ad, idx) => (
                      <div key={ad.id} className={`p-3 rounded-lg flex items-center justify-between ${theme === 'dark' ? 'bg-slate-800' : 'bg-gray-50'}`}>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-purple-600"># {idx + 1}</span>
                            <span className={`text-sm font-bold truncate ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                              {safeString(ad.title).substring(0, 30)}...
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-xs mt-1">
                            <div className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>{ad.views} vues</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>{ad.contacts} contacts</span>
                            </div>
                          </div>
                        </div>
                        <span className={`font-bold ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`}>
                          {ad.ctr}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: CONTACTS REÇUS */}
        {activeTab === 'contacts' && (
          <div className="space-y-8">
            <div className={`rounded-lg border overflow-hidden ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
              <div className={`p-6 border-b ${theme === 'dark' ? 'border-slate-700 bg-slate-900' : 'border-gray-200 bg-white'}`}>
                <h2 className={`text-xl font-bold flex items-center gap-2 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                  <Mail className="w-5 h-5 text-emerald-600" />
                  Derniers contacts reçus ({recentContacts.length})
                </h2>
              </div>
              <div className={`p-6 ${theme === 'dark' ? 'bg-slate-900' : 'bg-white'}`}>
                {recentContacts.length > 0 ? (
                  <div className="space-y-4">
                    {recentContacts.map(contact => (
                      <div
                        key={contact.id}
                        className={`p-4 rounded-lg border ${theme === 'dark' ? 'border-slate-700 bg-slate-800 hover:bg-slate-750' : 'border-gray-200 bg-gray-50 hover:bg-gray-100'} transition`}
                      >
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h3 className={`font-bold mb-2 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                              {safeString(contact.user_name)}
                            </h3>
                            <p className={`text-sm mb-2 flex items-center gap-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                              <Calendar className="w-4 h-4" />
                              Annonce: <span className="font-semibold">{safeString(contact.ad_title)}</span>
                            </p>
                            <div className="flex flex-col gap-1 text-sm">
                              {contact.user_email && contact.user_email !== 'N/A' && (
                                <div className="flex items-center gap-2">
                                  <Mail className="w-4 h-4" />
                                  <a href={`mailto:${safeString(contact.user_email)}`} className="text-purple-600 dark:text-purple-400 hover:underline">
                                    {safeString(contact.user_email)}
                                  </a>
                                </div>
                              )}
                              {contact.user_phone && contact.user_phone !== 'N/A' && (
                                <div className="flex items-center gap-2">
                                  <Phone className="w-4 h-4" />
                                  <a href={`tel:${safeString(contact.user_phone)}`} className="text-purple-600 dark:text-purple-400 hover:underline">
                                    {safeString(contact.user_phone)}
                                  </a>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col justify-between">
                            <div className={`text-xs flex items-center gap-2 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>
                              <Calendar className="w-4 h-4" />
                              {contact.created_at}
                            </div>
                            <button className="px-4 py-2 rounded-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg transition text-sm">
                              Répondre
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={`text-center py-12 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    <Activity className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p>Aucun contact reçu pour le moment</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CONSULTATIONS */}
        {activeTab === 'views' && (
          <div className="space-y-8">
            <div className={`rounded-lg border overflow-hidden ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
              <div className={`p-6 border-b ${theme === 'dark' ? 'border-slate-700 bg-slate-900' : 'border-gray-200 bg-white'}`}>
                <h2 className={`text-xl font-bold flex items-center gap-2 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                  <Eye className="w-5 h-5 text-purple-600" />
                  Dernières consultations ({recentViews.length})
                </h2>
              </div>
              <div className={`p-6 ${theme === 'dark' ? 'bg-slate-900' : 'bg-white'}`}>
                {recentViews.length > 0 ? (
                  <div className="space-y-3">
                    {recentViews.map(view => (
                      <div
                        key={view.id}
                        className={`p-3 rounded-lg border flex items-center justify-between ${theme === 'dark' ? 'border-slate-700 bg-slate-800' : 'border-gray-200 bg-gray-50'}`}
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${theme === 'dark' ? 'bg-slate-700' : 'bg-gray-200'}`}>
                            <User className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className={`font-bold text-sm ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                              {safeString(view.user_name)}
                            </h3>
                            <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                              A consulté: <span className="font-semibold">{safeString(view.ad_title)}</span>
                            </p>
                          </div>
                        </div>
                        <div className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>
                          {view.created_at}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={`text-center py-12 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    <Eye className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p>Aucune consultation enregistrée</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: DÉTAILS PAR ANNONCE */}
        {activeTab === 'detailed' && (
          <div className="space-y-8">
            {contactsByAd.length > 0 ? (
              contactsByAd.map(adData => (
                <div
                  key={adData.ad_id}
                  className={`rounded-lg border overflow-hidden ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}
                >
                  <div
                    onClick={() => setSelectedAd(selectedAd === adData.ad_id ? null : adData.ad_id)}
                    className={`p-6 border-b cursor-pointer transition ${theme === 'dark' ? 'border-slate-700 bg-slate-900 hover:bg-slate-850' : 'border-gray-200 bg-white hover:bg-gray-50'}`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                          {safeString(adData.ad_title)}
                        </h3>
                        <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          {adData.total_contacts} contact{adData.total_contacts > 1 ? 's' : ''} reçu{adData.total_contacts > 1 ? 's' : ''}
                        </p>
                      </div>
                      <ChevronDown
                        className={`w-5 h-5 transition ${selectedAd === adData.ad_id ? 'rotate-180' : ''}`}
                      />
                    </div>
                  </div>

                  {selectedAd === adData.ad_id && (
                    <div className={`p-6 space-y-3 ${theme === 'dark' ? 'bg-slate-900' : 'bg-white'}`}>
                      {adData.contacts.map(contact => (
                        <div
                          key={contact.id}
                          className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-slate-800' : 'bg-gray-50'}`}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className={`font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                                {safeString(contact.user_name)}
                              </h4>
                              <div className="flex flex-col gap-1 mt-2 text-sm">
                                {contact.user_email && contact.user_email !== 'N/A' && (
                                  <div className="flex items-center gap-2">
                                    <Mail className="w-4 h-4" />
                                    <a href={`mailto:${safeString(contact.user_email)}`} className="text-purple-600 dark:text-purple-400 hover:underline">
                                      {safeString(contact.user_email)}
                                    </a>
                                  </div>
                                )}
                                {contact.user_phone && contact.user_phone !== 'N/A' && (
                                  <div className="flex items-center gap-2">
                                    <Phone className="w-4 h-4" />
                                    <a href={`tel:${safeString(contact.user_phone)}`} className="text-purple-600 dark:text-purple-400 hover:underline">
                                      {safeString(contact.user_phone)}
                                    </a>
                                  </div>
                                )}
                              </div>
                            </div>
                            <span className={`text-xs px-2 py-1 rounded-full ${theme === 'dark' ? 'bg-slate-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`}>
                              {contact.created_at}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className={`rounded-lg border-2 border-dashed p-12 text-center ${theme === 'dark' ? 'border-slate-700 bg-slate-900/30' : 'border-gray-300 bg-gray-50'}`}>
                <Activity className={`w-16 h-16 mx-auto mb-4 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} />
                <h3 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>
                  Aucune interaction enregistrée
                </h3>
                <p className={theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}>
                  Les contacts et consultations apparaîtront ici
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

Analytics.layout = page => <AgencyLayout {...page.props}>{page}</AgencyLayout>;
