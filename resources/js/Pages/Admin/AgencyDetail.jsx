import { useState } from 'react';
import Header from '../../Components/Header';
import AdminSidebar from './AdminSidebar';
import Footer from '../../Components/Footer';
import { useThemeStore } from '../../store';
import { usePage, Link } from '@inertiajs/react';
import axios from 'axios';
import {
  Building2, Users, CreditCard, Calendar, MapPin, Phone, Mail,
  ShieldCheck, ArrowUpRight, ArrowDownLeft, Copy, Eye, Edit2, Trash2,
  CheckCircle, AlertCircle, Zap, TrendingUp, Package, FileText, Filter,
  ChevronLeft, Globe, Code, Activity, BarChart3, Flag, MessageSquare, Check, Clock, Lock, X
} from 'lucide-react';

const Toast = ({ message, type = 'success', onClose }) => {
  const Icon = type === 'success' ? Check : type === 'error' ? AlertCircle : null;

  const toastStyle = {
    success: {
      bg: '#10b981',
      border: '#059669',
      text: '#ffffff',
    },
    error: {
      bg: '#ef4444',
      border: '#dc2626',
      text: '#ffffff',
    },
  };

  const style = toastStyle[type] || toastStyle.success;

  return (
    <div
      className="fixed top-4 right-4 z-50 flex items-center gap-3 px-5 py-4 rounded-lg shadow-lg animate-slide-in"
      style={{
        backgroundColor: style.bg,
        borderLeft: `4px solid ${style.border}`,
        color: style.text,
        minWidth: '300px',
      }}
    >
      {Icon && <Icon className="w-5 h-5 flex-shrink-0" style={{ color: style.text }} />}
      <span className="font-medium text-sm flex-1" style={{ color: style.text }}>
        {message}
      </span>
      <button
        onClick={onClose}
        className="ml-2 hover:opacity-75 transition"
        style={{ color: style.text }}
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default function AdminAgencyDetail() {
  const { theme } = useThemeStore();
  const { props } = usePage();
  const { agency, ads = [], transactions = [] } = props;
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedAd, setExpandedAd] = useState(null);
  const [toast, setToast] = useState(null);
  const [loadingAdId, setLoadingAdId] = useState(null);
  const [updatingStatuses, setUpdatingStatuses] = useState({});
  const [updatingReportStatuses, setUpdatingReportStatuses] = useState({});
  const [adsList, setAdsList] = useState(ads);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const getAdStatusColor = (status) => {
    return status === 'valid' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
      : status === 'pending' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
      : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
  };

  const getAdStatusLabel = (status) => {
    return status === 'valid' ? 'Valide' : status === 'pending' ? 'En attente' : 'Bloquée';
  };

  const getReportStatusColor = (status) => {
    return status === 'resolved' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
      : status === 'pending' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
      : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
  };

  const getReportStatusLabel = (status) => {
    return status === 'resolved' ? 'Résolu' : status === 'pending' ? 'En attente' : 'Rejeté';
  };

  const handleAdStatusChange = async (adId, newStatus) => {
    setLoadingAdId(adId);
    setUpdatingStatuses(prev => ({ ...prev, [adId]: newStatus }));

    try {
      const response = await axios.patch(`/admin/annonces/${adId}/status`, {
        status: newStatus,
      });
      if (response.data.status === 'success') {
        const statusLabel = newStatus === 'pending' ? 'En attente' : newStatus === 'valid' ? 'Valide' : 'Bloquée';
        showToast(`Annonce marquée comme "${statusLabel}"`, 'success');

        setAdsList(prevAds =>
          prevAds.map(ad =>
            ad.id === adId ? { ...ad, status: newStatus } : ad
          )
        );

        setTimeout(() => {
          setUpdatingStatuses(prev => {
            const newState = { ...prev };
            delete newState[adId];
            return newState;
          });
        }, 300);
      }
    } catch (error) {
      console.error('Error updating ad status:', error);
      showToast('Erreur lors de la mise à jour du statut de l\'annonce', 'error');
      setUpdatingStatuses(prev => {
        const newState = { ...prev };
        delete newState[adId];
        return newState;
      });
    } finally {
      setLoadingAdId(null);
    }
  };

  const handleReportStatusChange = async (reportId, adId, newStatus) => {
    setUpdatingReportStatuses(prev => ({ ...prev, [reportId]: newStatus }));

    try {
      const response = await axios.patch(`/admin/signalements/${reportId}/status`, {
        status: newStatus,
      });
      if (response.data.status === 'success') {
        const statusLabel = getReportStatusLabel(newStatus);
        showToast(`Signalement marqué comme "${statusLabel}"`, 'success');

        setAdsList(prevAds =>
          prevAds.map(ad =>
            ad.id === adId
              ? {
                  ...ad,
                  reports: ad.reports.map(r =>
                    r.id === reportId ? { ...r, status: newStatus } : r
                  ),
                }
              : ad
          )
        );

        setTimeout(() => {
          setUpdatingReportStatuses(prev => {
            const newState = { ...prev };
            delete newState[reportId];
            return newState;
          });
        }, 300);
      }
    } catch (error) {
      console.error('Error updating report status:', error);
      showToast('Erreur lors de la mise à jour du statut du signalement', 'error');
      setUpdatingReportStatuses(prev => {
        const newState = { ...prev };
        delete newState[reportId];
        return newState;
      });
    }
  };

  if (!agency) {
    return (
      <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-gray-100 text-gray-900'}`}>
        <Header />
        <div className="flex flex-1">
          <AdminSidebar />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <p className="text-lg">Agence non trouvée</p>
            </div>
          </main>
        </div>
        <Footer />
      </div>
    );
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <Header />

      <div className="flex flex-1">
        <AdminSidebar />

        <main className="flex-1 overflow-auto">
          {/* Header with agency info */}
          <div className={theme === 'dark' ? 'bg-slate-900/50 border-b border-slate-800' : 'bg-white border-b border-gray-200'}>
            <div className="max-w-7xl mx-auto px-8 py-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start gap-4">
                  <Link
                    href="/admin/agences"
                    className={`p-2 rounded-lg transition ${theme === 'dark' ? 'hover:bg-slate-800' : 'hover:bg-gray-100'}`}
                    title="Retour"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </Link>
                  {agency.profile?.photo && (
                    <img src={agency.profile.photo} alt={agency.name} className="w-20 h-20 rounded-lg object-cover border border-slate-700" />
                  )}
                  <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2 mb-2">
                      {agency.name}
                      {agency.status === 1 && <ShieldCheck className="w-6 h-6 text-emerald-500" />}
                    </h1>
                    <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                      {agency.country?.name} • Inscrite depuis {agency.created_at}
                    </p>
                  </div>
                </div>
                <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                  agency.status === 1 ? 'bg-emerald-500/20 text-emerald-400'
                  : agency.status === 2 ? 'bg-yellow-500/20 text-yellow-400'
                  : 'bg-red-500/20 text-red-400'
                }`}>
                  {agency.status_label}
                </span>
              </div>

              {/* Quick stats */}
              <div className="grid grid-cols-5 gap-4">
                {[
                  { label: 'Espaces', value: agency.spaces?.length || 0, icon: Globe, color: 'blue' },
                  { label: 'Annonces', value: agency.stats?.total_ads || 0, icon: FileText, color: 'purple' },
                  { label: 'Actives', value: agency.stats?.active_ads || 0, icon: CheckCircle, color: 'emerald' },
                  { label: 'Vues', value: agency.stats?.total_views || 0, icon: Eye, color: 'cyan' },
                  { label: 'Favoris', value: agency.stats?.total_favorites || 0, icon: CreditCard, color: 'pink' },
                ].map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div key={stat.label} className={`rounded-lg border p-4 ${theme === 'dark' ? 'border-slate-700 bg-slate-800' : 'border-gray-200 bg-gray-50'}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className={`w-5 h-5 ${
                          stat.color === 'blue' ? 'text-blue-400' :
                          stat.color === 'purple' ? 'text-purple-400' :
                          stat.color === 'emerald' ? 'text-emerald-400' :
                          stat.color === 'cyan' ? 'text-cyan-400' : 'text-pink-400'
                        }`} />
                        <p className={`text-xs font-bold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          {stat.label}
                        </p>
                      </div>
                      <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                        {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-8 py-16">
            {/* Tabs */}
            <div className="flex gap-4 border-b mb-8 overflow-x-auto">
              {[
                { id: 'overview', label: 'Aperçu', icon: BarChart3 },
                { id: 'spaces', label: 'Espaces Commerciaux', icon: Globe },
                { id: 'ads', label: 'Annonces', icon: FileText },
                { id: 'transactions', label: 'Transactions', icon: CreditCard },
                { id: 'contacts', label: 'Coordonnées', icon: Mail },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-3 border-b-2 font-semibold transition whitespace-nowrap ${
                      activeTab === tab.id
                        ? theme === 'dark'
                          ? 'border-purple-500 text-purple-400'
                          : 'border-purple-600 text-purple-600'
                        : theme === 'dark'
                        ? 'border-transparent text-gray-400 hover:text-gray-300'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  {/* Subscription Info */}
                  <div className={`rounded-lg border p-6 ${theme === 'dark' ? 'border-slate-700 bg-slate-900' : 'border-gray-200 bg-white'}`}>
                    <h3 className={`text-lg font-bold mb-4 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                      Abonnement
                    </h3>
                    {agency.subscription ? (
                      <div className="space-y-4">
                        <div className={`rounded-lg p-4 border ${
                          agency.subscription.status === 'active'
                            ? theme === 'dark'
                              ? 'border-emerald-600/30 bg-emerald-900/20'
                              : 'border-emerald-200 bg-emerald-50'
                            : theme === 'dark'
                            ? 'border-red-600/30 bg-red-900/20'
                            : 'border-red-200 bg-red-50'
                        }`}>
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <p className={`text-xs font-semibold uppercase tracking-wide ${
                                agency.subscription.status === 'active'
                                  ? 'text-emerald-600 dark:text-emerald-400'
                                  : 'text-red-600 dark:text-red-400'
                              }`}>
                                Plan actuel
                              </p>
                              <p className={`text-lg font-bold mt-1 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                                {agency.subscription.label}
                              </p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                              agency.subscription.status === 'active'
                                ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                                : 'bg-red-500/20 text-red-600 dark:text-red-400'
                            }`}>
                              {agency.subscription.status_label}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Début</p>
                              <p className={`font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                                {agency.subscription.start_date}
                              </p>
                            </div>
                            <div>
                              <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Fin</p>
                              <p className={`font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                                {agency.subscription.end_date}
                              </p>
                            </div>
                          </div>
                          <div className="mt-3 pt-3 border-t border-inherit">
                            <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Montant</p>
                            <p className={`text-2xl font-bold ${
                              agency.subscription.status === 'active'
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : 'text-red-600 dark:text-red-400'
                            }`}>
                              {agency.subscription.amount}€
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className={`rounded-lg p-4 border ${theme === 'dark' ? 'border-slate-600 bg-slate-800' : 'border-gray-300 bg-gray-100'}`}>
                        <p className={`text-sm font-bold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                          ❌ Aucun abonnement
                        </p>
                        <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          Cette agence n'a pas d'abonnement actif
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Contact Info */}
                  <div className={`rounded-lg border p-6 ${theme === 'dark' ? 'border-slate-700 bg-slate-900' : 'border-gray-200 bg-white'}`}>
                    <h3 className={`text-lg font-bold mb-4 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                      Informations
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <Mail className="w-5 h-5 text-gray-400 mt-1" />
                        <div>
                          <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>Email</p>
                          <p className={theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}>{agency.email}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Phone className="w-5 h-5 text-gray-400 mt-1" />
                        <div>
                          <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>Téléphone</p>
                          <p className={theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}>{agency.phone}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button className="flex-1 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition">
                    Éditer l'Agence
                  </button>
                  <Link
                    href={`/admin/paiements?search=${agency.name}`}
                    className={`flex-1 px-4 py-3 rounded-lg border font-semibold transition text-center ${
                      theme === 'dark'
                        ? 'border-slate-700 text-gray-300 hover:bg-slate-800'
                        : 'border-gray-300 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    Voir les Paiements
                  </Link>
                  {agency.status === 2 && (
                    <>
                      <button className="px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition">
                        Valider
                      </button>
                      <button className="px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition">
                        Refuser
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Spaces Tab */}
            {activeTab === 'spaces' && (
              <div className="space-y-6">
                {agency.spaces && agency.spaces.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {agency.spaces.map((space) => (
                      <div
                        key={space.id}
                        className={`rounded-lg border p-6 transition-all duration-300 ${
                          theme === 'dark'
                            ? 'border-slate-700 bg-slate-900 hover:bg-slate-800 hover:border-purple-500/50'
                            : 'border-gray-200 bg-white hover:shadow-lg'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className={`text-lg font-bold mb-1 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                              {space.name}
                            </h3>
                            <p className={`text-sm flex items-center gap-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                              <MapPin className="w-4 h-4" />
                              {space.city?.name}, {space.country?.name}
                            </p>
                          </div>
                          <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded text-xs font-bold">
                            Actif
                          </span>
                        </div>

                        <div className={`mb-4 pb-4 border-b rounded-lg p-3 ${theme === 'dark' ? 'border-slate-700 bg-slate-800' : 'border-gray-200 bg-gray-50'}`}>
                          <p className={`text-xs font-bold uppercase mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            Code Marchand
                          </p>
                          <div className="flex items-center justify-between gap-2">
                            <code className={`font-mono font-bold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                              {space.merchant_code}
                            </code>
                            <button
                              onClick={() => copyToClipboard(space.merchant_code)}
                              className={`p-1.5 rounded transition ${theme === 'dark' ? 'hover:bg-slate-700' : 'hover:bg-gray-100'}`}
                              title="Copier"
                            >
                              <Copy className="w-4 h-4 text-purple-400" />
                            </button>
                          </div>
                        </div>

                        <div className="space-y-3 mb-4">
                          <div className="flex items-center justify-between text-sm">
                            <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Email</span>
                            <span className={`font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                              {space.email}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Téléphone</span>
                            <span className={`font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                              {space.phone}
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button className={`flex-1 px-3 py-2 rounded-lg border transition text-sm font-medium ${
                            theme === 'dark'
                              ? 'border-slate-700 text-gray-300 hover:bg-slate-800'
                              : 'border-gray-300 text-gray-600 hover:bg-gray-100'
                          }`}>
                            <Edit2 className="w-4 h-4 mx-auto" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={`rounded-lg border p-12 text-center ${theme === 'dark' ? 'border-slate-700 bg-slate-900' : 'border-gray-200 bg-white'}`}>
                    <Globe className={`w-16 h-16 mx-auto mb-4 ${theme === 'dark' ? 'text-slate-600' : 'text-gray-300'}`} />
                    <p className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      Aucun espace commercial
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Ads Tab */}
            {activeTab === 'ads' && (
              <div className="space-y-4">
                {adsList && adsList.length > 0 ? (
                  adsList.map((ad) => (
                    <div
                      key={ad.id}
                      className={`rounded-lg border overflow-hidden ${theme === 'dark' ? 'border-slate-700 bg-slate-900' : 'border-gray-200 bg-white'}`}
                    >
                      {/* Ad Header */}
                      <div
                        onClick={() => setExpandedAd(expandedAd === ad.id ? null : ad.id)}
                        className={`p-4 border-b cursor-pointer transition ${theme === 'dark' ? 'hover:bg-slate-800' : 'hover:bg-gray-50'}`}
                        style={{borderColor: theme === 'dark' ? '#334155' : '#e5e7eb'}}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-bold">{ad.title}</h3>
                            <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                              Espace: <span className="font-semibold">{ad.space_name}</span>
                            </p>
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getAdStatusColor(ad.status)}`}>
                              {getAdStatusLabel(ad.status)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Expanded Ad Details */}
                      {expandedAd === ad.id && (
                        <div className="p-6 space-y-6" style={{borderTop: theme === 'dark' ? '1px solid #334155' : '1px solid #e5e7eb'}}>
                          {/* Status Management */}
                          <div>
                            <h4 className="font-bold mb-3 text-sm uppercase tracking-wider">Modifier le statut</h4>
                            <div className="flex gap-2 flex-wrap">
                              {['pending', 'valid', 'blocked'].map((status) => {
                                const isActive = updatingStatuses[ad.id] === status || ad.status === status;
                                const isLoading = loadingAdId === ad.id;

                                return (
                                  <button
                                    key={status}
                                    onClick={() => handleAdStatusChange(ad.id, status)}
                                    disabled={isLoading}
                                    className={`flex items-center gap-2 px-4 py-2 rounded text-sm font-medium transition-all duration-300 transform ${
                                      isActive
                                        ? `${getAdStatusColor(updatingStatuses[ad.id] || ad.status)} shadow-md scale-105`
                                        : theme === 'dark'
                                        ? 'bg-slate-800 text-gray-300 hover:bg-slate-700 hover:scale-102'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-102'
                                    } disabled:opacity-50 disabled:cursor-not-allowed active:scale-95`}
                                  >
                                    {isLoading && loadingAdId === ad.id ? (
                                      <div className="w-4 h-4 border-2 border-transparent border-t-current rounded-full animate-spin" />
                                    ) : null}
                                    {getAdStatusLabel(status)}
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* Views Subsection */}
                          <div className={`rounded-lg border p-5 ${theme === 'dark' ? 'border-slate-700 bg-slate-800' : 'border-gray-200 bg-gray-50'}`}>
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="font-bold text-base flex items-center gap-2">
                                <Eye className="w-5 h-5 text-blue-500" />
                                Vues
                              </h4>
                              <span className={`text-2xl font-bold ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
                                {ad.views_count || 0}
                              </span>
                            </div>
                            <p className={`text-xs mb-4 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>
                              Total des vues (connecté et non connecté)
                            </p>

                            {ad.views && ad.views.length > 0 && (
                              <div>
                                <p className={`text-sm font-semibold mb-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>
                                  Détail des vues liées aux utilisateurs:
                                </p>
                                <div className="space-y-2 max-h-72 overflow-y-auto">
                                  {ad.views.map((view) => (
                                    <div
                                      key={view.id}
                                      className={`text-sm p-3 rounded border ${theme === 'dark' ? 'bg-slate-700 border-slate-600' : 'bg-white border-gray-200'}`}
                                    >
                                      <p className="font-medium">{view.user_name}</p>
                                      <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                        {view.user_email}
                                      </p>
                                      <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                                        {view.created_at}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Reports Subsection */}
                          <div className={`rounded-lg border p-5 ${theme === 'dark' ? 'border-slate-700 bg-slate-800' : 'border-gray-200 bg-gray-50'}`}>
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="font-bold text-base flex items-center gap-2">
                                <Flag className="w-5 h-5 text-red-500" />
                                Signalements
                              </h4>
                              <span className={`text-xl font-bold ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>
                                {ad.reports ? ad.reports.length : 0}
                              </span>
                            </div>

                            {ad.reports && ad.reports.length > 0 ? (
                              <div className="space-y-3 max-h-72 overflow-y-auto">
                                {ad.reports.map((report) => (
                                  <div
                                    key={report.id}
                                    className={`p-3 rounded border ${theme === 'dark' ? 'bg-slate-700 border-slate-600' : 'bg-white border-gray-200'}`}
                                  >
                                    <div className="flex items-start justify-between mb-2">
                                      <div className="flex-1">
                                        <p className="font-medium text-sm">{report.user_name}</p>
                                        <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                          {report.user_email}
                                        </p>
                                      </div>
                                      <span className={`px-2 py-1 rounded text-xs font-semibold whitespace-nowrap ${getReportStatusColor(report.status || 'pending')}`}>
                                        {getReportStatusLabel(report.status || 'pending')}
                                      </span>
                                    </div>
                                    <p className={`text-xs mb-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                      <span className="font-semibold">Raison:</span> {report.reason}
                                    </p>
                                    <p className={`text-xs mb-3 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                                      {report.created_at}
                                    </p>
                                    <div className="flex gap-2 flex-wrap">
                                      {['pending', 'resolved', 'rejected'].map((status) => {
                                        const isActive = updatingReportStatuses[report.id] === status || report.status === status;

                                        return (
                                          <button
                                            key={status}
                                            onClick={() => handleReportStatusChange(report.id, ad.id, status)}
                                            className={`px-3 py-1 rounded text-xs font-medium transition ${
                                              isActive
                                                ? `${getReportStatusColor(updatingReportStatuses[report.id] || report.status || 'pending')} shadow-md`
                                                : theme === 'dark'
                                                ? 'bg-slate-600 text-gray-300 hover:bg-slate-500'
                                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                            }`}
                                          >
                                            {getReportStatusLabel(status)}
                                          </button>
                                        );
                                      })}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                Aucun signalement
                              </p>
                            )}
                          </div>

                          {/* Contacts Subsection */}
                          <div className={`rounded-lg border p-5 ${theme === 'dark' ? 'border-slate-700 bg-slate-800' : 'border-gray-200 bg-gray-50'}`}>
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="font-bold text-base flex items-center gap-2">
                                <MessageSquare className="w-5 h-5 text-green-500" />
                                Contacts
                              </h4>
                              <span className={`text-xl font-bold ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
                                {ad.contacts ? ad.contacts.length : 0}
                              </span>
                            </div>

                            {ad.contacts && ad.contacts.length > 0 ? (
                              <div className="space-y-2 max-h-72 overflow-y-auto">
                                {ad.contacts.map((contact) => (
                                  <div
                                    key={contact.id}
                                    className={`text-sm p-3 rounded border ${theme === 'dark' ? 'bg-slate-700 border-slate-600' : 'bg-white border-gray-200'}`}
                                  >
                                    <p className="font-medium">{contact.user_name}</p>
                                    <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                      {contact.user_email}
                                    </p>
                                    <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                                      {contact.created_at}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                Aucun contact
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className={`rounded-lg border p-12 text-center ${theme === 'dark' ? 'border-slate-700 bg-slate-900' : 'border-gray-200 bg-white'}`}>
                    <FileText className={`w-16 h-16 mx-auto mb-4 ${theme === 'dark' ? 'text-slate-600' : 'text-gray-300'}`} />
                    <p className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      Aucune annonce trouvée
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Transactions Tab */}
            {activeTab === 'transactions' && (
              <div className="space-y-6">
                {transactions && transactions.length > 0 ? (
                  <div className={`rounded-lg border overflow-hidden ${theme === 'dark' ? 'border-slate-700 bg-slate-900' : 'border-gray-200 bg-white'}`}>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className={`border-b ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
                            <th className={`text-left px-6 py-4 font-bold text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>
                              Type
                            </th>
                            <th className={`text-left px-6 py-4 font-bold text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>
                              De
                            </th>
                            <th className={`text-left px-6 py-4 font-bold text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>
                              À
                            </th>
                            <th className={`text-left px-6 py-4 font-bold text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>
                              Montant
                            </th>
                            <th className={`text-left px-6 py-4 font-bold text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>
                              Mode
                            </th>
                            <th className={`text-left px-6 py-4 font-bold text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>
                              Statut
                            </th>
                            <th className={`text-left px-6 py-4 font-bold text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>
                              Date
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {transactions.map((transaction) => (
                            <tr key={transaction.id} className={`border-b transition ${theme === 'dark' ? 'border-slate-700 hover:bg-slate-800/30' : 'border-gray-100 hover:bg-gray-50'}`}>
                              <td className={`px-6 py-4 font-bold text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                  transaction.transaction_type === 'boost'
                                    ? 'bg-purple-500/20 text-purple-400'
                                    : 'bg-blue-500/20 text-blue-400'
                                }`}>
                                  {transaction.transaction_type === 'boost' ? 'Boost' : 'Abonnement'}
                                </span>
                              </td>
                              <td className={`px-6 py-4 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>
                                {transaction.sender_name || 'N/A'}
                              </td>
                              <td className={`px-6 py-4 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>
                                {transaction.receiver_name || 'N/A'}
                              </td>
                              <td className={`px-6 py-4 font-bold text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                                €{typeof transaction.amount === 'number' ? transaction.amount.toFixed(2) : transaction.amount}
                              </td>
                              <td className={`px-6 py-4 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>
                                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                  transaction.mode === 'card'
                                    ? 'bg-cyan-500/20 text-cyan-400'
                                    : transaction.mode === 'wallet'
                                    ? 'bg-green-500/20 text-green-400'
                                    : 'bg-gray-500/20 text-gray-400'
                                }`}>
                                  {transaction.mode === 'card' ? 'Carte' : transaction.mode === 'wallet' ? 'Portefeuille' : transaction.mode}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                  transaction.status === 'success'
                                    ? 'bg-emerald-500/20 text-emerald-400'
                                    : transaction.status === 'pending'
                                    ? 'bg-yellow-500/20 text-yellow-400'
                                    : 'bg-red-500/20 text-red-400'
                                }`}>
                                  {transaction.status === 'success' ? 'Succès' : transaction.status === 'pending' ? 'En attente' : 'Échec'}
                                </span>
                              </td>
                              <td className={`px-6 py-4 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                {transaction.date}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className={`rounded-lg border p-12 text-center ${theme === 'dark' ? 'border-slate-700 bg-slate-900' : 'border-gray-200 bg-white'}`}>
                    <CreditCard className={`w-16 h-16 mx-auto mb-4 ${theme === 'dark' ? 'text-slate-600' : 'text-gray-300'}`} />
                    <p className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      Aucune transaction trouvée
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Contacts Tab */}
            {activeTab === 'contacts' && (
              <div className={`rounded-lg border p-8 max-w-2xl ${theme === 'dark' ? 'border-slate-700 bg-slate-900' : 'border-gray-200 bg-white'}`}>
                <h2 className={`text-2xl font-bold mb-6 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                  Coordonnées de l'Agence
                </h2>

                <div className="space-y-6">
                  {[
                    { icon: Building2, label: 'Nom', value: agency.name },
                    { icon: Mail, label: 'Email', value: agency.email },
                    { icon: Phone, label: 'Téléphone', value: agency.phone },
                    { icon: MapPin, label: 'Localisation', value: `${agency.city?.name}, ${agency.country?.name}` },
                    { icon: Calendar, label: 'Inscrite le', value: agency.created_at },
                    { icon: Code, label: 'Code Marchand', value: agency.merchant_code },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.label} className={`pb-6 border-b flex items-start gap-4 ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
                        <Icon className={`w-6 h-6 mt-1 flex-shrink-0 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} />
                        <div className="flex-1">
                          <p className={`text-sm font-bold mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            {item.label}
                          </p>
                          <p className={`text-lg font-semibold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                            {item.value}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      <Footer />

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Styles for animations */}
      <style>{`
        @keyframes slide-in {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }

        .scale-102 {
          transform: scale(1.02);
        }

        .hover\\:scale-102:hover {
          transform: scale(1.02);
        }

        button {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        button:active {
          transform: scale(0.95) !important;
        }
      `}</style>
    </div>
  );
}
