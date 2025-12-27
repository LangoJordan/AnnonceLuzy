import { useState } from 'react';
import Header from '../../Components/Header';
import AdminSidebar from './AdminSidebar';
import Footer from '../../Components/Footer';
import { useThemeStore } from '../../store';
import {
  Zap, Search, Filter, Flame, CheckCircle, XCircle, Calendar, Eye
} from 'lucide-react';
import { Link } from '@inertiajs/react';

export default function AdminBoosts({ boosts, stats, filters }) {
  const { theme } = useThemeStore();
  const [statusFilter, setStatusFilter] = useState(filters?.status || 'all');
  const [searchTerm, setSearchTerm] = useState(filters?.search || '');

  const getStatusColor = (status) => {
    return status === 'active' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
      : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
  };

  const getStatusLabel = (status) => {
    return status === 'active' ? 'Actif' : 'Expiré';
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    const params = new URLSearchParams();
    if (e.target.value) params.append('search', e.target.value);
    if (statusFilter !== 'all') params.append('status', statusFilter);
    window.location.href = `/admin/boosts?${params.toString()}`;
  };

  const handleStatusChange = (status) => {
    setStatusFilter(status);
    const params = new URLSearchParams();
    params.append('status', status);
    if (searchTerm) params.append('search', searchTerm);
    window.location.href = `/admin/boosts?${params.toString()}`;
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
              <h1 className="text-4xl font-bold mb-3 flex items-center gap-3">
                <Zap className="w-10 h-10 text-amber-600 dark:text-amber-400" />
                Gestion des Boosts
              </h1>
              <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}>
                {stats?.total_active || 0} actifs • {stats?.total_expired || 0} expirés
              </p>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-8 py-16">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
              {[
                { label: 'Boosts Actifs', value: stats?.total_active || 0, icon: CheckCircle },
                { label: 'Boosts Expirés', value: stats?.total_expired || 0, icon: XCircle },
                { label: 'Revenu', value: `XFA ${(stats?.total_revenue || 0).toLocaleString()}`, icon: Flame },
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
                      <Icon className="w-4 h-4 text-amber-500" />
                    </div>
                    <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                      {stat.value}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Filters */}
            <div className={`rounded-lg border p-6 mb-8 ${theme === 'dark' ? 'border-slate-700 bg-slate-900' : 'border-gray-200 bg-white'}`}>
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                  <Search className={`absolute left-3 top-3 w-5 h-5 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} />
                  <input
                    type="text"
                    placeholder="Chercher par titre d'annonce..."
                    defaultValue={searchTerm}
                    onChange={handleSearch}
                    className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                      theme === 'dark'
                        ? 'border-slate-700 bg-slate-800 text-gray-100 placeholder-gray-500'
                        : 'border-gray-300 bg-white text-gray-900 placeholder-gray-400'
                    }`}
                  />
                </div>

                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className={`px-4 py-2 rounded-lg border ${
                    theme === 'dark'
                      ? 'border-slate-700 bg-slate-800 text-gray-100'
                      : 'border-gray-300 bg-white text-gray-900'
                  }`}
                >
                  <option value="all">Tous les statuts</option>
                  <option value="active">Actifs</option>
                  <option value="expired">Expirés</option>
                </select>
              </div>
            </div>

            {/* Boosts Table */}
            <div className={`rounded-lg border overflow-hidden ${theme === 'dark' ? 'border-slate-700 bg-slate-900' : 'border-gray-200 bg-white'}`}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={`border-b ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
                      <th className={`text-left px-6 py-4 font-bold text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>Annonce</th>
                      <th className={`text-left px-6 py-4 font-bold text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>Agence</th>
                      <th className={`text-left px-6 py-4 font-bold text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>Package</th>
                      <th className={`text-left px-6 py-4 font-bold text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>Coût</th>
                      <th className={`text-left px-6 py-4 font-bold text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>Durée</th>
                      <th className={`text-left px-6 py-4 font-bold text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {boosts?.data && boosts.data.length > 0 ? (
                      boosts.data.map((boost) => (
                        <tr
                          key={boost.id}
                          className={`border-b transition ${theme === 'dark' ? 'border-slate-700 hover:bg-slate-800/30' : 'border-gray-100 hover:bg-gray-50'}`}
                        >
                          <td className={`px-6 py-4 font-bold max-w-xs truncate ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                            {boost.ad_title || 'N/A'}
                          </td>
                          <td className={`px-6 py-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-800'}`}>
                            {boost.agency_name || 'N/A'}
                          </td>
                          <td className={`px-6 py-4 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-800'}`}>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              boost.boost_level === 3 ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'
                              : boost.boost_level === 2 ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400'
                              : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                            }`}>
                              {boost.boost_package || 'Inconnu'}
                            </span>
                          </td>
                          <td className={`px-6 py-4 font-bold text-amber-600 dark:text-amber-400`}>
                            {boost.currency || 'XFA'} {(boost.cost || 0).toLocaleString()}
                          </td>
                          <td className={`px-6 py-4 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-800'}`}>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span>{boost.start_date} à {boost.end_date}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(boost.status)}`}>
                              {getStatusLabel(boost.status)}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className={`px-6 py-12 text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          Aucun boost trouvé
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {boosts?.links && (
                <div className={`flex items-center justify-between p-6 border-t ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Page {boosts.current_page} de {boosts.last_page}
                  </p>
                  <div className="flex gap-2">
                    {boosts.links.map((link, i) => {
                      // Skip rendering if no URL (disabled items like "...")
                      if (!link.url) {
                        return (
                          <button
                            key={i}
                            disabled
                            className={`px-3 py-2 rounded-lg border text-sm font-medium cursor-not-allowed opacity-50 ${
                              theme === 'dark'
                                ? 'border-slate-700 text-gray-500'
                                : 'border-gray-300 text-gray-400'
                            }`}
                          >
                            {link.label.replace('&laquo;', '«').replace('&raquo;', '»')}
                          </button>
                        );
                      }

                      return (
                        <Link
                          key={i}
                          href={link.url}
                          className={`px-3 py-2 rounded-lg border text-sm font-medium transition ${
                            link.active
                              ? theme === 'dark'
                                ? 'bg-purple-600 border-purple-600 text-white'
                                : 'bg-purple-600 border-purple-600 text-white'
                              : theme === 'dark'
                              ? 'border-slate-700 text-gray-300 hover:bg-slate-800'
                              : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {link.label.replace('&laquo;', '«').replace('&raquo;', '»')}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
