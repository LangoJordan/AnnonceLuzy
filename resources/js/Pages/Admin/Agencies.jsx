import { useState } from 'react';
import Header from '../../Components/Header';
import AdminSidebar from './AdminSidebar';
import Footer from '../../Components/Footer';
import { useThemeStore } from '../../store';
import {
  Building2, Search, Edit2, Check, X, Shield, Mail, Phone, MapPin,
  Users, Flame, CheckCircle, Clock, Ban, MoreVertical, Filter, ArrowRight
} from 'lucide-react';
import { Link } from '@inertiajs/react';

export default function AdminAgencies({ agencies = {}, stats = {}, filters = {} }) {
  const { theme } = useThemeStore();
  const [statusFilter, setStatusFilter] = useState(filters?.status || 'all');
  const [searchTerm, setSearchTerm] = useState(filters?.search || '');

  // Ensure we have default values for all data
  const agenciesList = agencies?.data || [];
  const pagination = {
    current_page: agencies?.current_page || 1,
    last_page: agencies?.last_page || 1,
    links: agencies?.links || [],
  };

  const dashboardStats = {
    total: stats?.total || 0,
    active: stats?.active || 0,
    pending: stats?.pending || 0,
    blocked: stats?.blocked || 0,
  };

  const getStatusColor = (status) => {
    return status === 1 ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
      : status === 2 ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
      : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
  };

  const getStatusLabel = (status) => {
    return status === 1 ? 'Validée'
      : status === 2 ? 'En attente'
      : 'Bloquée';
  };

  const handleSearch = (e) => {
    const params = new URLSearchParams();
    if (e.target.value) params.append('search', e.target.value);
    if (statusFilter !== 'all') params.append('status', statusFilter);
    window.location.href = `/admin/agences?${params.toString()}`;
  };

  const handleStatusChange = (status) => {
    const params = new URLSearchParams();
    params.append('status', status);
    if (searchTerm) params.append('search', searchTerm);
    window.location.href = `/admin/agences?${params.toString()}`;
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
                <Building2 className="w-10 h-10 text-purple-600 dark:text-purple-400" />
                Gestion des Agences
              </h1>
              <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}>
                {dashboardStats.total} agences • {dashboardStats.active} actives • {dashboardStats.pending} en attente
              </p>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-8 py-16">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
              {[
                { label: 'Total', value: dashboardStats.total, icon: Building2 },
                { label: 'Actives', value: dashboardStats.active, icon: CheckCircle },
                { label: 'En attente', value: dashboardStats.pending, icon: Clock },
                { label: 'Bloquées', value: dashboardStats.blocked, icon: Ban },
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
                      {stat.value.toLocaleString()}
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
                    placeholder="Chercher par nom ou email..."
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
                  <option value="1">Validées</option>
                  <option value="2">En attente</option>
                  <option value="3">Bloquées</option>
                </select>
              </div>
            </div>

            {/* Agencies Grid */}
            <div className="grid grid-cols-1 gap-6">
              {agenciesList && agenciesList.length > 0 ? (
                agenciesList.map((agency) => (
                  <div
                    key={agency.id}
                    className={`rounded-lg border p-6 ${theme === 'dark' ? 'border-slate-700 bg-slate-900 hover:bg-slate-800/50' : 'border-gray-200 bg-white hover:bg-gray-50'} transition`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4 flex-1">
                        {agency.profile?.photo && (
                          <img
                            src={agency.profile.photo}
                            alt={agency.name}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className={`text-lg font-bold mb-1 truncate ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                            {agency.name}
                          </h3>
                          <p className={`text-sm mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            {agency.email}
                          </p>
                          {agency.phone && (
                            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                              {agency.phone}
                            </p>
                          )}
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ml-4 ${getStatusColor(agency.status)}`}>
                        {getStatusLabel(agency.status)}
                      </span>
                    </div>

                    {agency.profile?.description && (
                      <p className={`text-sm mb-4 line-clamp-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        {agency.profile.description}
                      </p>
                    )}

                    {/* Stats Row */}
                    <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 py-4 border-t border-b ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'} mb-4`}>
                      <div>
                        <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>Espaces</p>
                        <p className={`text-lg font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                          {agency.spaces_count}
                        </p>
                      </div>
                      <div>
                        <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>Annonces</p>
                        <p className={`text-lg font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                          {agency.ads_count}
                        </p>
                      </div>
                      <div>
                        <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>Inscription</p>
                        <p className={`text-sm font-bold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          {agency.created_at}
                        </p>
                      </div>
                    </div>

                    {/* Subscription Info */}
                    <div className={`p-4 rounded-lg mb-4 border ${
                      agency.subscription_status === 'active'
                        ? theme === 'dark'
                          ? 'border-emerald-600/30 bg-emerald-900/20'
                          : 'border-emerald-200 bg-emerald-50'
                        : agency.subscription_status === 'expired'
                        ? theme === 'dark'
                          ? 'border-red-600/30 bg-red-900/20'
                          : 'border-red-200 bg-red-50'
                        : theme === 'dark'
                        ? 'border-slate-600 bg-slate-800'
                        : 'border-gray-300 bg-gray-100'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className={`text-xs font-semibold uppercase tracking-wide ${
                            agency.subscription_status === 'active'
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : agency.subscription_status === 'expired'
                              ? 'text-red-600 dark:text-red-400'
                              : 'text-gray-600 dark:text-gray-400'
                          }`}>
                            Abonnement
                          </p>
                          {agency.subscription ? (
                            <div className="mt-1">
                              <p className={`font-bold text-sm ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                                {agency.subscription.label}
                              </p>
                              <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                {agency.subscription_status === 'expired' ? '❌ Expiré' : '✅ Valide'} • {agency.subscription.start_date} à {agency.subscription.end_date}
                              </p>
                              <p className={`text-sm font-bold mt-1 ${
                                agency.subscription_status === 'active'
                                  ? 'text-emerald-600 dark:text-emerald-400'
                                  : 'text-red-600 dark:text-red-400'
                              }`}>
                                {agency.subscription.amount}€
                              </p>
                            </div>
                          ) : (
                            <div className="mt-1">
                              <p className={`font-bold text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                Aucun abonnement
                              </p>
                              <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>
                                Cette agence n'a pas d'abonnement actif
                              </p>
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            agency.subscription_status === 'active'
                              ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                              : agency.subscription_status === 'expired'
                              ? 'bg-red-500/20 text-red-600 dark:text-red-400'
                              : 'bg-gray-500/20 text-gray-600 dark:text-gray-400'
                          }`}>
                            {agency.subscription_status === 'active'
                              ? 'Valide'
                              : agency.subscription_status === 'expired'
                              ? 'Expiré'
                              : 'Aucun'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <Link
                        href={`/admin/agences/${agency.id}`}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition text-sm font-medium ${
                          theme === 'dark'
                            ? 'border-purple-500/30 text-purple-400 hover:bg-purple-500/10'
                            : 'border-purple-300 text-purple-600 hover:bg-purple-100'
                        }`}
                      >
                        <Edit2 className="w-4 h-4" />
                        Détails
                      </Link>
                      {agency.status === 2 && (
                        <>
                          <button className={`flex items-center gap-2 px-4 py-2 rounded-lg transition text-sm font-medium ${
                            theme === 'dark'
                              ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                              : 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200'
                          }`}>
                            <Check className="w-4 h-4" />
                            Valider
                          </button>
                          <button className={`flex items-center gap-2 px-4 py-2 rounded-lg transition text-sm font-medium ${
                            theme === 'dark'
                              ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                              : 'bg-red-100 text-red-600 hover:bg-red-200'
                          }`}>
                            <X className="w-4 h-4" />
                            Refuser
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className={`rounded-lg border p-12 text-center ${theme === 'dark' ? 'border-slate-700 bg-slate-900' : 'border-gray-200 bg-white'}`}>
                  <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Aucune agence trouvée</p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {pagination.links && pagination.links.length > 0 && (
              <div className={`flex items-center justify-between p-6 border-t mt-8 ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Page {pagination.current_page} de {pagination.last_page}
                </p>
                <div className="flex gap-2">
                  {pagination.links.map((link, i) => (
                    <Link
                      key={i}
                      href={link.url || '#'}
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
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
