import { useState } from 'react';
import Header from '../../Components/Header';
import AdminSidebar from './AdminSidebar';
import Footer from '../../Components/Footer';
import { useThemeStore } from '../../store';
import {
  Users, Search, Edit2, Trash2, Check, X, Shield, Mail, Phone, MapPin,
  Calendar, CreditCard, Ban, MoreVertical, Eye, EyeOff, ArrowUpRight,
  ArrowDownUp, Filter
} from 'lucide-react';
import { usePage, Link } from '@inertiajs/react';

export default function AdminUsers({ users = {}, stats = {}, filters = {} }) {
  const { theme } = useThemeStore();
  const [activeFilter, setActiveFilter] = useState(filters?.type || 'all');
  const [statusFilter, setStatusFilter] = useState(filters?.status || 'all');
  const [searchTerm, setSearchTerm] = useState(filters?.search || '');

  // Ensure we have default values for stats
  const dashboardStats = {
    total: stats?.total || 0,
    visitors: stats?.visitors || 0,
    agencies: stats?.agencies || 0,
    employees: stats?.employees || 0,
    active: stats?.active || 0,
    pending: stats?.pending || 0,
    blocked: stats?.blocked || 0,
  };

  // Ensure we have user data
  const usersList = users?.data || [];
  const pagination = {
    current_page: users?.current_page || 1,
    last_page: users?.last_page || 1,
    links: users?.links || [],
  };

  const getStatusColor = (status) => {
    return status === 1 ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
      : status === 2 ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
      : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
  };

  const getStatusLabel = (status) => {
    return status === 1 ? 'Validé'
      : status === 2 ? 'En attente'
      : 'Bloqué';
  };

  const getUserTypeLabel = (type) => {
    return type === 'agency' ? 'Agence'
      : type === 'employee' ? 'Employé'
      : 'Visiteur';
  };

  const getUserTypeColor = (type) => {
    return type === 'agency' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
      : type === 'employee' ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400'
      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
  };

  const handleSearch = (e) => {
    const params = new URLSearchParams();
    if (e.target.value) params.append('search', e.target.value);
    if (activeFilter !== 'all') params.append('type', activeFilter);
    if (statusFilter !== 'all') params.append('status', statusFilter);
    window.location.href = `/admin/utilisateurs?${params.toString()}`;
  };

  const handleFilterChange = (type) => {
    const params = new URLSearchParams();
    params.append('type', type);
    if (statusFilter !== 'all') params.append('status', statusFilter);
    if (searchTerm) params.append('search', searchTerm);
    window.location.href = `/admin/utilisateurs?${params.toString()}`;
  };

  const handleStatusChange = (status) => {
    const params = new URLSearchParams();
    params.append('status', status);
    if (activeFilter !== 'all') params.append('type', activeFilter);
    if (searchTerm) params.append('search', searchTerm);
    window.location.href = `/admin/utilisateurs?${params.toString()}`;
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
                <Users className="w-10 h-10 text-purple-600 dark:text-purple-400" />
                Gestion des Utilisateurs
              </h1>
              <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}>
                {dashboardStats.total} utilisateurs • {dashboardStats.active} actifs • {dashboardStats.pending} en attente
              </p>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-8 py-16">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-12">
              {[
                { label: 'Total', value: dashboardStats.total, icon: Users, color: 'purple' },
                { label: 'Visiteurs', value: dashboardStats.visitors, icon: Eye, color: 'cyan' },
                { label: 'Agences', value: dashboardStats.agencies, icon: CreditCard, color: 'blue' },
                { label: 'Employés', value: dashboardStats.employees, icon: Shield, color: 'indigo' },
                { label: 'Bloqués', value: dashboardStats.blocked, icon: Ban, color: 'red' },
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
                    placeholder="Chercher par nom, email ou téléphone..."
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
                  value={activeFilter}
                  onChange={(e) => handleFilterChange(e.target.value)}
                  className={`px-4 py-2 rounded-lg border ${
                    theme === 'dark'
                      ? 'border-slate-700 bg-slate-800 text-gray-100'
                      : 'border-gray-300 bg-white text-gray-900'
                  }`}
                >
                  <option value="all">Tous les types</option>
                  <option value="visitor">Visiteurs</option>
                  <option value="agency">Agences</option>
                  <option value="employee">Employés</option>
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
                  <option value="1">Validé</option>
                  <option value="2">En attente</option>
                  <option value="3">Bloqué</option>
                </select>
              </div>
            </div>

            {/* Users Table */}
            <div className={`rounded-lg border overflow-hidden ${theme === 'dark' ? 'border-slate-700 bg-slate-900' : 'border-gray-200 bg-white'}`}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={`border-b ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
                      <th className={`text-left px-6 py-4 font-bold text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>Utilisateur</th>
                      <th className={`text-left px-6 py-4 font-bold text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>Email</th>
                      <th className={`text-left px-6 py-4 font-bold text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>Type</th>
                      <th className={`text-left px-6 py-4 font-bold text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>Statut</th>
                      <th className={`text-left px-6 py-4 font-bold text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>Inscription</th>
                      <th className={`text-left px-6 py-4 font-bold text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersList && usersList.length > 0 ? (
                      usersList.map((u) => (
                        <tr
                          key={u.id}
                          className={`border-b transition ${theme === 'dark' ? 'border-slate-700 hover:bg-slate-800/30' : 'border-gray-100 hover:bg-gray-50'}`}
                        >
                          <td className={`px-6 py-4 font-bold max-w-xs truncate ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                            {u.name}
                          </td>
                          <td className={`px-6 py-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-800'}`}>
                            {u.email}
                          </td>
                          <td className={`px-6 py-4 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-800'}`}>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getUserTypeColor(u.user_type)}`}>
                              {getUserTypeLabel(u.user_type)}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(u.status)}`}>
                              {getStatusLabel(u.status)}
                            </span>
                          </td>
                          <td className={`px-6 py-4 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-800'}`}>
                            {u.created_at}
                          </td>
                          <td className="px-6 py-4 text-sm space-x-2">
                            <Link
                              href={`/admin/utilisateurs/${u.id}`}
                              className={`font-medium ${theme === 'dark' ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-800'}`}
                            >
                              Détails
                            </Link>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className={`px-6 py-8 text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          Aucun utilisateur trouvé
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination.links && pagination.links.length > 0 && (
                <div className={`flex items-center justify-between p-6 border-t ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
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
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
