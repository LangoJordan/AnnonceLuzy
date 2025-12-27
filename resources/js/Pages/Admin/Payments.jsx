import { useState } from 'react';
import Header from '../../Components/Header';
import AdminSidebar from './AdminSidebar';
import Footer from '../../Components/Footer';
import { useThemeStore } from '../../store';
import {
  CreditCard, Search, Filter, Download, Zap, CheckCircle, Clock, X,
  TrendingUp, DollarSign, ArrowUpRight
} from 'lucide-react';
import { Link } from '@inertiajs/react';

export default function AdminPayments({ transactions, stats, filters }) {
  const { theme } = useThemeStore();
  const [typeFilter, setTypeFilter] = useState(filters?.type || 'all');
  const [statusFilter, setStatusFilter] = useState(filters?.status || 'all');
  const [searchTerm, setSearchTerm] = useState(filters?.search || '');
  const [dateFrom, setDateFrom] = useState(filters?.date_from || '');
  const [dateTo, setDateTo] = useState(filters?.date_to || '');

  const getStatusColor = (status) => {
    return status === 'success' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
      : status === 'pending' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
      : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
  };

  const getStatusLabel = (status) => {
    return status === 'success' ? 'Complété'
      : status === 'pending' ? 'En attente'
      : 'Échoué';
  };

  const getTypeLabel = (type) => {
    return type === 'subscription' ? 'Abonnement'
      : type === 'boost' ? 'Boost'
      : 'Autre';
  };

  const buildFilterParams = (overrides = {}) => {
    const params = new URLSearchParams();
    const search = overrides.search !== undefined ? overrides.search : searchTerm;
    const type = overrides.type !== undefined ? overrides.type : typeFilter;
    const status = overrides.status !== undefined ? overrides.status : statusFilter;
    const from = overrides.date_from !== undefined ? overrides.date_from : dateFrom;
    const to = overrides.date_to !== undefined ? overrides.date_to : dateTo;

    if (search) params.append('search', search);
    if (type !== 'all') params.append('type', type);
    if (status !== 'all') params.append('status', status);
    if (from) params.append('date_from', from);
    if (to) params.append('date_to', to);

    return params.toString();
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    window.location.href = `/admin/paiements?${buildFilterParams({ search: e.target.value })}`;
  };

  const handleTypeChange = (type) => {
    setTypeFilter(type);
    window.location.href = `/admin/paiements?${buildFilterParams({ type })}`;
  };

  const handleStatusChange = (status) => {
    setStatusFilter(status);
    window.location.href = `/admin/paiements?${buildFilterParams({ status })}`;
  };

  const handleDateFromChange = (e) => {
    setDateFrom(e.target.value);
  };

  const handleDateToChange = (e) => {
    setDateTo(e.target.value);
  };

  const handleValidatePeriod = () => {
    window.location.href = `/admin/paiements?${buildFilterParams({ date_from: dateFrom, date_to: dateTo })}`;
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
                <CreditCard className="w-10 h-10 text-purple-600 dark:text-purple-400" />
                Gestion des Paiements
              </h1>
              <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}>
                {stats?.total_transactions || 0} transactions • Revenu total: XFA {(stats?.total_amount || 0).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-8 py-16">
            {/* Revenue Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
              {[
                { label: 'Revenu Total', value: `XFA ${(stats?.total_amount || 0).toLocaleString()}`, icon: DollarSign },
                { label: 'Transactions', value: (stats?.total_transactions || 0).toLocaleString(), icon: CreditCard },
                { label: 'Abonnements', value: `XFA ${(stats?.by_type?.subscription || 0).toLocaleString()}`, icon: CheckCircle },
                { label: 'Boosts', value: `XFA ${(stats?.by_type?.boost || 0).toLocaleString()}`, icon: Zap },
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
                    <p className={`text-lg font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                      {stat.value}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Filters */}
            <div className={`rounded-lg border p-6 mb-8 ${theme === 'dark' ? 'border-slate-700 bg-slate-900' : 'border-gray-200 bg-white'}`}>
              <div className="space-y-4">
                {/* First Row - Search and Dropdowns */}
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Search */}
                  <div className="flex-1 relative">
                    <Search className={`absolute left-3 top-3 w-5 h-5 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} />
                    <input
                      type="text"
                      placeholder="Chercher par agence, référence..."
                      defaultValue={searchTerm}
                      onChange={handleSearch}
                      className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                        theme === 'dark'
                          ? 'border-slate-700 bg-slate-800 text-gray-100 placeholder-gray-500'
                          : 'border-gray-300 bg-white text-gray-900 placeholder-gray-400'
                      }`}
                    />
                  </div>

                  {/* Type Filter */}
                  <select
                    value={typeFilter}
                    onChange={(e) => handleTypeChange(e.target.value)}
                    className={`px-4 py-2 rounded-lg border ${
                      theme === 'dark'
                        ? 'border-slate-700 bg-slate-800 text-gray-100'
                        : 'border-gray-300 bg-white text-gray-900'
                    }`}
                  >
                    <option value="all">Tous les types</option>
                    <option value="subscription">Abonnements</option>
                    <option value="boost">Boosts</option>
                  </select>

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
                    <option value="success">Complétés</option>
                    <option value="pending">En attente</option>
                    <option value="failed">Échoués</option>
                  </select>
                </div>

                {/* Second Row - Date Filters */}
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Date From */}
                  <div className="flex-1">
                    <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      Du :
                    </label>
                    <input
                      type="date"
                      value={dateFrom}
                      onChange={handleDateFromChange}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        theme === 'dark'
                          ? 'border-slate-700 bg-slate-800 text-gray-100'
                          : 'border-gray-300 bg-white text-gray-900'
                      }`}
                    />
                  </div>

                  {/* Date To */}
                  <div className="flex-1">
                    <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      Au :
                    </label>
                    <input
                      type="date"
                      value={dateTo}
                      onChange={handleDateToChange}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        theme === 'dark'
                          ? 'border-slate-700 bg-slate-800 text-gray-100'
                          : 'border-gray-300 bg-white text-gray-900'
                      }`}
                    />
                  </div>

                  {/* Validate Button */}
                  <div className="flex items-end gap-2">
                    <button
                      onClick={handleValidatePeriod}
                      className={`px-6 py-2 rounded-lg font-medium transition ${
                        theme === 'dark'
                          ? 'bg-purple-600 hover:bg-purple-700 text-white'
                          : 'bg-purple-600 hover:bg-purple-700 text-white'
                      }`}
                    >
                      Valider
                    </button>
                    {(dateFrom || dateTo) && (
                      <button
                        onClick={() => {
                          setDateFrom('');
                          setDateTo('');
                          window.location.href = `/admin/paiements?${buildFilterParams({ date_from: '', date_to: '' })}`;
                        }}
                        className={`px-4 py-2 rounded-lg font-medium transition ${
                          theme === 'dark'
                            ? 'bg-slate-800 hover:bg-slate-700 text-gray-300'
                            : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                        }`}
                      >
                        Réinitialiser dates
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Transactions Table */}
            <div className={`rounded-lg border overflow-hidden ${theme === 'dark' ? 'border-slate-700 bg-slate-900' : 'border-gray-200 bg-white'}`}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={`border-b ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
                      <th className={`text-left px-6 py-4 font-bold text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>ID / Référence</th>
                      <th className={`text-left px-6 py-4 font-bold text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>Agence</th>
                      <th className={`text-left px-6 py-4 font-bold text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>Montant</th>
                      <th className={`text-left px-6 py-4 font-bold text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>Type</th>
                      <th className={`text-left px-6 py-4 font-bold text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>Méthode</th>
                      <th className={`text-left px-6 py-4 font-bold text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>Statut</th>
                      <th className={`text-left px-6 py-4 font-bold text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions?.data && transactions.data.length > 0 ? (
                      transactions.data.map((transaction) => (
                        <tr
                          key={transaction.id}
                          className={`border-b transition ${theme === 'dark' ? 'border-slate-700 hover:bg-slate-800/30' : 'border-gray-100 hover:bg-gray-50'}`}
                        >
                          <td className={`px-6 py-4 font-bold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                            #{transaction.id}
                          </td>
                          <td className={`px-6 py-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-800'}`}>
                            {transaction.sender_name || 'N/A'}
                          </td>
                          <td className={`px-6 py-4 font-bold text-emerald-600 dark:text-emerald-400`}>
                            XFA {(transaction.amount || 0).toLocaleString()}
                          </td>
                          <td className={`px-6 py-4 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-800'}`}>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              transaction.transaction_type === 'subscription'
                                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                                : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                            }`}>
                              {getTypeLabel(transaction.transaction_type)}
                            </span>
                          </td>
                          <td className={`px-6 py-4 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-800'}`}>
                            {transaction.mode || 'N/A'}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(transaction.status)}`}>
                              {getStatusLabel(transaction.status)}
                            </span>
                          </td>
                          <td className={`px-6 py-4 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-800'}`}>
                            {transaction.date}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className={`px-6 py-12 text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          Aucune transaction trouvée
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {transactions?.links && (
                <div className={`flex items-center justify-between p-6 border-t ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Page {transactions.current_page} de {transactions.last_page}
                  </p>
                  <div className="flex gap-2">
                    {transactions.links.map((link, i) => {
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
