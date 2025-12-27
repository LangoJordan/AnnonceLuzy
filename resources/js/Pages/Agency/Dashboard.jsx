import { useState } from 'react';
import { Link } from '@inertiajs/react';
import { useThemeStore } from '../../store';
import AgencyLayout from '../../Layouts/AgencyLayout';
import AgencyContextBanner from '../../Components/AgencyContextBanner';
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  TrendingUp,
  Users,
  CreditCard,
  BarChart3,
  ArrowUpRight,
  MapPin,
  Calendar,
  CheckCircle,
  Zap,
  Briefcase,
  MousePointerClick,
  DollarSign,
  Target,
} from 'lucide-react';

export default function AgencyDashboard({ user = {}, agency = {}, recentAds = [], commercials = [], paymentHistory = [], selectedAgency = null, availableAgencies = [] }) {
  const { theme } = useThemeStore();
  const [activeTab, setActiveTab] = useState('overview');

  const keyMetrics = [
    { label: 'Annonces Actives', value: agency?.stats?.activeAds || 0, icon: Zap, color: 'purple', change: '+2' },
    { label: 'Impressions', value: agency?.stats?.totalImpressions || 0, icon: Eye, color: 'pink', change: '+12%' },
    { label: 'Clics', value: agency?.stats?.totalClicks || 0, icon: MousePointerClick, color: 'cyan', change: '+8%' },
    { label: 'Revenu', value: agency?.stats?.revenue || '€0,00', icon: DollarSign, color: 'emerald', change: '+15%' },
  ];

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

      <div className={theme === 'dark' ? 'bg-slate-900/50 border-b border-slate-800' : 'bg-white border-b border-gray-200'}>
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className={`w-16 h-16 rounded-lg flex items-center justify-center ${theme === 'dark' ? 'bg-slate-800' : 'bg-gray-100'}`}>
                <Briefcase className={`w-8 h-8 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} />
              </div>
              <div>
                <h1 className="text-4xl font-bold">{agency?.name || 'Agence'}</h1>
                <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Tableau de bord de gestion</p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div></div>
            <span className={`inline-block px-6 py-3 rounded-lg font-semibold text-white ${theme === 'dark' ? 'bg-gradient-to-r from-purple-600 to-pink-600' : 'bg-purple-600'}`}>
              {agency?.subscription || 'Free'}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-16">
        {/* Key Metrics */}
        <div className="grid grid-cols-4 gap-6 mb-12">
          {keyMetrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <div
                key={metric.label}
                className={`rounded-lg border p-6 ${theme === 'dark' ? 'border-slate-700 bg-slate-900' : 'border-gray-200 bg-white'}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getColorBg(metric.color)}`}>
                    <Icon className={`w-6 h-6 ${getColorText(metric.color)}`} />
                  </div>
                  <div className="flex items-center gap-1 text-emerald-500 text-sm font-bold">
                    <ArrowUpRight className="w-4 h-4" />
                    {metric.change}
                  </div>
                </div>
                <p className={`text-sm font-bold mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>
                  {metric.label}
                </p>
                <p className={`text-3xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                  {metric.value}
                </p>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="mb-12 grid grid-cols-4 gap-4">
          <Link
            href="/agence/annonces/create"
            className={`rounded-lg border p-4 text-center transition ${theme === 'dark' ? 'border-slate-700 bg-slate-900 hover:border-slate-600 hover:bg-slate-800' : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'}`}
          >
            <Plus className={`w-6 h-6 mx-auto mb-2 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} />
            <p className={`text-sm font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>Nouvelle annonce</p>
          </Link>
          <Link
            href="/agence/espaces"
            className={`rounded-lg border p-4 text-center transition ${theme === 'dark' ? 'border-slate-700 bg-slate-900 hover:border-slate-600 hover:bg-slate-800' : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'}`}
          >
            <Briefcase className={`w-6 h-6 mx-auto mb-2 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
            <p className={`text-sm font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>Espaces</p>
          </Link>
          <Link
            href="/agence/employes"
            className={`rounded-lg border p-4 text-center transition ${theme === 'dark' ? 'border-slate-700 bg-slate-900 hover:border-slate-600 hover:bg-slate-800' : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'}`}
          >
            <Users className={`w-6 h-6 mx-auto mb-2 ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`} />
            <p className={`text-sm font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>Employés</p>
          </Link>
          <Link
            href="/agence/abonnements/renouveler"
            className={`rounded-lg border p-4 text-center transition ${theme === 'dark' ? 'border-slate-700 bg-slate-900 hover:border-slate-600 hover:bg-slate-800' : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'}`}
          >
            <CreditCard className={`w-6 h-6 mx-auto mb-2 ${theme === 'dark' ? 'text-orange-400' : 'text-orange-600'}`} />
            <p className={`text-sm font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>Renouveler</p>
          </Link>
        </div>

        {/* Tabs */}
        <div className={`rounded-lg border overflow-hidden ${theme === 'dark' ? 'border-slate-700 bg-slate-900' : 'border-gray-200 bg-white'}`}>
          <div className={`border-b ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
            <div className="flex">
              {[
                { id: 'overview', label: 'Aperçu' },
                { id: 'ads', label: 'Annonces' },
                { id: 'team', label: 'Équipe' },
                { id: 'billing', label: 'Facturation' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-4 font-semibold border-b-2 transition ${
                    activeTab === tab.id
                      ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                      : `border-transparent ${theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'}`
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-8">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <div>
                  <h2 className={`text-xl font-bold mb-6 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                    Activité Récente
                  </h2>
                  <div className="space-y-3">
                    {recentAds.slice(0, 2).map((ad) => (
                      <div key={ad.id} className={`flex items-center justify-between p-4 rounded-lg ${theme === 'dark' ? 'bg-slate-800/50' : 'bg-gray-50'}`}>
                        <div className="flex-1">
                          <p className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{ad.title}</p>
                          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mt-1`}>Créée le {ad.createdAt}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-purple-600 dark:text-purple-400">{ad.views} vues</p>
                          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{ad.clicks} clics</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Ads Tab */}
            {activeTab === 'ads' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>Gestion des Annonces</h2>
                  <Link
                    href="/agence/annonces/create"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transition"
                  >
                    <Plus className="w-5 h-5" />
                    Nouvelle annonce
                  </Link>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className={`border-b ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
                        <th className={`text-left px-6 py-4 font-bold text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>Annonce</th>
                        <th className={`text-left px-6 py-4 font-bold text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>Statut</th>
                        <th className={`text-left px-6 py-4 font-bold text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>Vues</th>
                        <th className={`text-left px-6 py-4 font-bold text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>CTR</th>
                        <th className={`text-left px-6 py-4 font-bold text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>Revenu</th>
                        <th className={`text-left px-6 py-4 font-bold text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentAds.map((ad) => (
                        <tr key={ad.id} className={`border-b transition ${theme === 'dark' ? 'border-slate-700 hover:bg-slate-800/30' : 'border-gray-100 hover:bg-gray-50'}`}>
                          <td className={`px-6 py-4 font-bold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>{ad.title}</td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${ad.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-300'}`}>
                              {ad.status === 'active' ? 'Active' : 'Archivée'}
                            </span>
                          </td>
                          <td className={`px-6 py-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-800'}`}>{ad.views}</td>
                          <td className="px-6 py-4 font-bold text-purple-600 dark:text-purple-400">{ad.ctr}</td>
                          <td className="px-6 py-4 font-bold text-emerald-600 dark:text-emerald-400">{ad.revenue}</td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <button className={`p-2 rounded transition ${theme === 'dark' ? 'hover:bg-slate-700' : 'hover:bg-gray-100'}`}>
                                <Edit2 className="w-4 h-4 text-gray-400" />
                              </button>
                              <button className={`p-2 rounded transition ${theme === 'dark' ? 'hover:bg-slate-700' : 'hover:bg-gray-100'}`}>
                                <Trash2 className="w-4 h-4 text-red-400" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Team Tab */}
            {activeTab === 'team' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>Équipe Commerciale</h2>
                  <button className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transition">
                    <Plus className="w-5 h-5" />
                    Ajouter
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {commercials.map((commercial) => (
                    <div key={commercial.id} className={`rounded-lg border p-6 ${theme === 'dark' ? 'border-slate-700 bg-slate-800/50' : 'border-gray-200 bg-gray-50'}`}>
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <p className={`font-bold text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{commercial.name}</p>
                          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mt-1`}>{commercial.email}</p>
                          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{commercial.phone}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{commercial.adsCreated}</p>
                          <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Annonces</p>
                        </div>
                      </div>
                      <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-slate-700">
                        <button className={`flex-1 px-3 py-2 rounded text-sm font-medium transition ${theme === 'dark' ? 'border border-slate-600 text-gray-300 hover:bg-slate-700' : 'border border-gray-300 text-gray-700 hover:bg-gray-100'}`}>
                          Éditer
                        </button>
                        <button className={`flex-1 px-3 py-2 rounded text-sm font-medium transition text-red-400 ${theme === 'dark' ? 'hover:bg-red-500/10' : 'hover:bg-red-50'}`}>
                          Supprimer
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Billing Tab */}
            {activeTab === 'billing' && (
              <div className="space-y-8">
                <div>
                  <h2 className={`text-xl font-bold mb-6 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>Abonnement Actuel</h2>
                  <div className={`rounded-lg border p-6 mb-6 ${theme === 'dark' ? 'border-purple-600/50 bg-gradient-to-br from-slate-800 to-slate-900/50' : 'border-purple-200 bg-gradient-to-br from-purple-50 to-white'}`}>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>    {agency?.subscription || 'Free'}</h3>
                      <CheckCircle className="w-8 h-8 text-emerald-400" />
                    </div>
                    <p className={`text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2`}>   XFA {agency?.amount || '0'} <span className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>/mois</span></p>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Prochain paiement: {agency?.nextBillingDate || 'N/A'}</p>
                    <div className="grid grid-cols-2 gap-3 mt-6 pt-6 border-t border-purple-200 dark:border-slate-700">
                      <Link
                        href="/agence/abonnements"
                        className={`px-4 py-3 rounded-lg font-semibold text-center transition ${theme === 'dark' ? 'border border-slate-600 bg-slate-800 hover:bg-slate-700 text-gray-100' : 'border border-purple-300 bg-white hover:bg-purple-50 text-purple-700'}`}
                      >
                        Voir les plans
                      </Link>
                      <Link
                        href="/agence/abonnements/renouveler"
                        className="px-4 py-3 rounded-lg font-semibold text-center text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-lg transition"
                      >
                        Renouveler
                      </Link>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className={`text-xl font-bold mb-6 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>Historique des Paiements</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className={`border-b ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
                          <th className={`text-left px-6 py-4 font-bold text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>Date</th>
                          <th className={`text-left px-6 py-4 font-bold text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>Type</th>
                          <th className={`text-left px-6 py-4 font-bold text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>Montant</th>
                          <th className={`text-left px-6 py-4 font-bold text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>Statut</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paymentHistory.map((payment) => (
                          <tr key={payment.id} className={`border-b transition ${theme === 'dark' ? 'border-slate-700 hover:bg-slate-800/30' : 'border-gray-100 hover:bg-gray-50'}`}>
                            <td className={`px-6 py-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-800'}`}>{payment.date}</td>
                            <td className={`px-6 py-4 font-bold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                              {payment.type === 'subscription' ? 'Abonnement' : 'Boost'}
                            </td>
                            <td className="px-6 py-4 font-bold text-purple-600 dark:text-purple-400">{payment.amount}</td>
                            <td className="px-6 py-4">
                              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-semibold">Complété</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

AgencyDashboard.layout = page => <AgencyLayout {...page.props}>{page}</AgencyLayout>;
