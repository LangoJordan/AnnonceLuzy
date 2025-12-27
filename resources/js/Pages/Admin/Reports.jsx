import { useState } from 'react';
import Header from '../../Components/Header';
import AdminSidebar from './AdminSidebar';
import Footer from '../../Components/Footer';
import { useThemeStore } from '../../store';
import {
  AlertCircle, Search, Filter, Eye, Ban, Check, X, Flame,
  AlertTriangle, Clock, CheckCircle, XCircle
} from 'lucide-react';
import { Link } from '@inertiajs/react';

export default function AdminReports({ reports, stats, filters }) {
  const { theme } = useThemeStore();
  const [statusFilter, setStatusFilter] = useState(filters?.status || 'all');
  const [searchTerm, setSearchTerm] = useState(filters?.search || '');
  const [loading, setLoading] = useState({});
  const [localReports, setLocalReports] = useState(reports?.data || []);

  const getStatusColor = (status) => {
    return status === 'pending' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
      : status === 'investigating' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
      : status === 'resolved' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
  };

  const getStatusLabel = (status) => {
    return status === 'pending' ? 'Ouvert'
      : status === 'investigating' ? 'En cours'
      : status === 'resolved' ? 'Résolu'
      : 'Rejeté';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return AlertTriangle;
      case 'investigating': return Clock;
      case 'resolved': return CheckCircle;
      default: return XCircle;
    }
  };

  const handleSearch = (e) => {
    const params = new URLSearchParams();
    if (e.target.value) params.append('search', e.target.value);
    if (statusFilter !== 'all') params.append('status', statusFilter);
    window.location.href = `/admin/signalements?${params.toString()}`;
  };

  const handleStatusChange = (status) => {
    const params = new URLSearchParams();
    params.append('status', status);
    if (searchTerm) params.append('search', searchTerm);
    window.location.href = `/admin/signalements?${params.toString()}`;
  };

  const updateReportStatus = async (reportId, newStatus) => {
    setLoading(prev => ({ ...prev, [reportId]: true }));
    try {
      const response = await fetch(`/admin/signalements/${reportId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]')?.content,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        // Update local state
        setLocalReports(prev =>
          prev.map(r => r.id === reportId ? { ...r, status: newStatus } : r)
        );
      } else {
        console.error('Erreur lors de la mise à jour du statut');
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(prev => ({ ...prev, [reportId]: false }));
    }
  };

  const blockAd = async (reportId, adId) => {
    setLoading(prev => ({ ...prev, [reportId]: true }));
    try {
      const response = await fetch(`/admin/annonces/${adId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]')?.content,
        },
        body: JSON.stringify({ status: 'blocked' }),
      });

      if (response.ok) {
        // Also mark the report as resolved
        await updateReportStatus(reportId, 'resolved');
        setLocalReports(prev =>
          prev.map(r => r.id === reportId ? { ...r, status: 'resolved' } : r)
        );
      } else {
        console.error('Erreur lors du blocage de l\'annonce');
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(prev => ({ ...prev, [reportId]: false }));
    }
  };

  const deleteReport = async (reportId) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce signalement? Cette action est irréversible.')) {
      return;
    }

    setLoading(prev => ({ ...prev, [reportId]: true }));
    try {
      const response = await fetch(`/admin/signalements/${reportId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]')?.content,
        },
      });

      if (response.ok) {
        // Remove report from local list
        setLocalReports(prev => prev.filter(r => r.id !== reportId));
      } else {
        console.error('Erreur lors de la suppression du signalement');
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(prev => ({ ...prev, [reportId]: false }));
    }
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
                <AlertCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
                Modération & Signalements
              </h1>
              <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}>
                {stats?.total || 0} signalements • {stats?.pending || 0} en attente • {stats?.resolved || 0} résolus
              </p>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-8 py-16">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
              {[
                { label: 'Total', value: stats?.total || 0, icon: AlertCircle },
                { label: 'En attente', value: stats?.pending || 0, icon: Clock },
                { label: 'Résolus', value: stats?.resolved || 0, icon: CheckCircle },
                { label: 'Rejetés', value: stats?.rejected || 0, icon: XCircle },
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
                      <Icon className="w-4 h-4 text-red-500" />
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
                  <option value="pending">En attente</option>
                  <option value="investigating">En cours</option>
                  <option value="resolved">Résolus</option>
                  <option value="rejected">Rejetés</option>
                </select>
              </div>
            </div>

            {/* Reports List */}
            <div className="space-y-4">
              {localReports?.map((report) => {
                const StatusIcon = getStatusIcon(report.status);
                const isProcessing = loading[report.id];
                return (
                  <div
                    key={report.id}
                    className={`rounded-lg border p-6 ${theme === 'dark' ? 'border-slate-700 bg-slate-900 hover:bg-slate-800/50' : 'border-gray-200 bg-white hover:bg-gray-50'} transition`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4 flex-1">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          report.status === 'pending' ? 'bg-red-100 dark:bg-red-900/30'
                          : report.status === 'investigating' ? 'bg-yellow-100 dark:bg-yellow-900/30'
                          : 'bg-emerald-100 dark:bg-emerald-900/30'
                        }`}>
                          <StatusIcon className={`w-6 h-6 ${
                            report.status === 'pending' ? 'text-red-600 dark:text-red-400'
                            : report.status === 'investigating' ? 'text-yellow-600 dark:text-yellow-400'
                            : 'text-emerald-600 dark:text-emerald-400'
                          }`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                              {report.ad_title || 'Annonce supprimée'}
                            </h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getStatusColor(report.status)}`}>
                              {getStatusLabel(report.status)}
                            </span>
                          </div>
                          <p className={`text-sm mb-2 line-clamp-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            <span className="font-semibold">Raison:</span> {report.reason}
                          </p>
                          <p className={`text-xs mt-2 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                            Signalé par <span className="font-semibold">{report.user?.name || 'Utilisateur supprimé'}</span> le {report.created_at}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-700">
                      <Link
                        href={`/admin/signalements/${report.id}`}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition text-sm font-medium ${
                          theme === 'dark'
                            ? 'border-purple-500/30 text-purple-400 hover:bg-purple-500/10'
                            : 'border-purple-300 text-purple-600 hover:bg-purple-100'
                        }`}
                      >
                        <Eye className="w-4 h-4" />
                        Détails
                      </Link>

                      {report.status === 'pending' && (
                        <>
                          <button
                            onClick={() => updateReportStatus(report.id, 'investigating')}
                            disabled={isProcessing}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition text-sm font-medium disabled:opacity-50 ${
                              theme === 'dark'
                                ? 'bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20'
                                : 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
                            }`}
                          >
                            <Clock className="w-4 h-4" />
                            En cours
                          </button>
                          <button
                            onClick={() => updateReportStatus(report.id, 'resolved')}
                            disabled={isProcessing}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition text-sm font-medium disabled:opacity-50 ${
                              theme === 'dark'
                                ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                                : 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200'
                            }`}
                          >
                            <Check className="w-4 h-4" />
                            Résoudre
                          </button>
                          <button
                            onClick={() => blockAd(report.id, report.ad_id)}
                            disabled={isProcessing}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition text-sm font-medium disabled:opacity-50 ${
                              theme === 'dark'
                                ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                                : 'bg-red-100 text-red-600 hover:bg-red-200'
                            }`}
                          >
                            <Ban className="w-4 h-4" />
                            Bloquer l'annonce
                          </button>
                          <button
                            onClick={() => deleteReport(report.id)}
                            disabled={isProcessing}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition text-sm font-medium disabled:opacity-50 ${
                              theme === 'dark'
                                ? 'bg-gray-500/10 text-gray-400 hover:bg-gray-500/20'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                          >
                            <X className="w-4 h-4" />
                            Supprimer
                          </button>
                        </>
                      )}

                      {report.status === 'investigating' && (
                        <>
                          <button
                            onClick={() => updateReportStatus(report.id, 'resolved')}
                            disabled={isProcessing}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition text-sm font-medium disabled:opacity-50 ${
                              theme === 'dark'
                                ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                                : 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200'
                            }`}
                          >
                            <Check className="w-4 h-4" />
                            Résoudre
                          </button>
                          <button
                            onClick={() => blockAd(report.id, report.ad_id)}
                            disabled={isProcessing}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition text-sm font-medium disabled:opacity-50 ${
                              theme === 'dark'
                                ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                                : 'bg-red-100 text-red-600 hover:bg-red-200'
                            }`}
                          >
                            <Ban className="w-4 h-4" />
                            Bloquer l'annonce
                          </button>
                          <button
                            onClick={() => deleteReport(report.id)}
                            disabled={isProcessing}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition text-sm font-medium disabled:opacity-50 ${
                              theme === 'dark'
                                ? 'bg-gray-500/10 text-gray-400 hover:bg-gray-500/20'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                          >
                            <X className="w-4 h-4" />
                            Supprimer
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {reports?.links && (
              <div className={`flex items-center justify-between p-6 border-t mt-8 ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Page {reports.current_page} de {reports.last_page}
                </p>
                <div className="flex gap-2">
                  {reports.links.map((link, i) => {
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
        </main>
      </div>

      <Footer />
    </div>
  );
}
