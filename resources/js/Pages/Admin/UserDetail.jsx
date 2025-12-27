import { useState } from 'react';
import Header from '../../Components/Header';
import AdminSidebar from './AdminSidebar';
import Footer from '../../Components/Footer';
import { useThemeStore } from '../../store';
import {
  ArrowLeft, Mail, Phone, MapPin, Calendar, Badge, Users, Briefcase,
  FileText, Eye, MessageSquare, Flag, Building, MapIcon, Check, Clock, Lock, X, AlertCircle, CreditCard
} from 'lucide-react';
import { usePage, Link } from '@inertiajs/react';
import axios from 'axios';

// Toast notification component
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
    info: {
      bg: '#3b82f6',
      border: '#2563eb',
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

export default function UserDetail({ user = null, transactions = [] }) {
  const { theme } = useThemeStore();
  const [activeTab, setActiveTab] = useState('personal');
  const [userStatus, setUserStatus] = useState(user?.status);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [expandedAd, setExpandedAd] = useState(null);
  const [activeAdTab, setActiveAdTab] = useState(null);
  const [toast, setToast] = useState(null);
  const [loadingAdId, setLoadingAdId] = useState(null);
  const [updatingStatuses, setUpdatingStatuses] = useState({});
  const [updatingReportStatuses, setUpdatingReportStatuses] = useState({});
  const [ads, setAds] = useState(user?.type_data?.ads || []);
  const [userTransactions, setUserTransactions] = useState(transactions);

  if (!user) {
    return (
      <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-gray-100 text-gray-900'}`}>
        <Header />
        <div className="flex flex-1">
          <AdminSidebar />
          <main className="flex-1 overflow-auto p-8">
            <div className={`rounded-lg border p-6 text-center ${theme === 'dark' ? 'border-slate-700 bg-slate-900' : 'border-gray-200 bg-white'}`}>
              <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Utilisateur non trouvé</p>
            </div>
          </main>
        </div>
        <Footer />
      </div>
    );
  }

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

  const getUserTypeIcon = (type) => {
    if (type === 'agency') return <Building className="w-5 h-5" />;
    if (type === 'employee') return <Briefcase className="w-5 h-5" />;
    return <Users className="w-5 h-5" />;
  };

  const getUserTypeColor = (type) => {
    return type === 'agency' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
      : type === 'employee' ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400'
      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleStatusChange = async (newStatus) => {
    setLoadingStatus(true);
    try {
      const response = await axios.patch(`/admin/utilisateurs/${user.id}/status`, {
        status: newStatus,
      });
      if (response.data.status === 'success') {
        setUserStatus(newStatus);
        const statusLabel = newStatus === 1 ? 'Validé' : newStatus === 2 ? 'En attente' : 'Bloqué';
        showToast(`Utilisateur marqué comme "${statusLabel}"`, 'success');
      }
    } catch (error) {
      console.error('Error updating user status:', error);
      showToast('Erreur lors de la mise à jour du statut', 'error');
    } finally {
      setLoadingStatus(false);
    }
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

        // Mettre à jour l'état local de l'annonce
        setAds(prevAds =>
          prevAds.map(ad =>
            ad.id === adId ? { ...ad, status: newStatus } : ad
          )
        );

        // Nettoyer l'état de mise à jour
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

  const handleReportStatusChange = async (reportId, adId, newStatus) => {
    setUpdatingReportStatuses(prev => ({ ...prev, [reportId]: newStatus }));

    try {
      const response = await axios.patch(`/admin/signalements/${reportId}/status`, {
        status: newStatus,
      });
      if (response.data.status === 'success') {
        const statusLabel = getReportStatusLabel(newStatus);
        showToast(`Signalement marqué comme "${statusLabel}"`, 'success');

        setAds(prevAds =>
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

  const tabs = [
    { id: 'personal', label: 'Informations Personnelles', icon: FileText },
    ...(user.user_type === 'agency' ? [
      { id: 'ads', label: 'Annonces', icon: FileText },
      { id: 'employees', label: 'Employés', icon: Users },
      { id: 'spaces', label: 'Espaces', icon: Building },
      { id: 'transactions', label: 'Transactions', icon: CreditCard },
    ] : []),
    ...(user.user_type === 'employee' ? [
      { id: 'ads', label: 'Annonces', icon: FileText },
      { id: 'positions', label: 'Postes', icon: Badge },
      { id: 'transactions', label: 'Transactions', icon: CreditCard },
    ] : []),
  ];

  const renderPersonalTab = () => (
    <div className="space-y-8">
      {/* Contact Information */}
      <div>
        <h3 className={`text-lg font-bold mb-4 pb-2 border-b ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
          Contact
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className={`text-sm mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Email</p>
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-blue-500 flex-shrink-0" />
              <p className="font-medium break-all">{user.personal_info?.contact?.email || user.email}</p>
            </div>
          </div>

          {(user.personal_info?.contact?.phone || user.phone) && (
            <div>
              <p className={`text-sm mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Téléphone</p>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-green-500 flex-shrink-0" />
                <p className="font-medium">{user.personal_info?.contact?.phone || user.phone}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Location Information */}
      {(user.personal_info?.location?.country || user.personal_info?.location?.city || user.personal_info?.location?.address) && (
        <div>
          <h3 className={`text-lg font-bold mb-4 pb-2 border-b ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
            Localisation
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {user.personal_info?.location?.country && (
              <div>
                <p className={`text-sm mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Pays</p>
                <p className="font-medium">{user.personal_info.location.country}</p>
              </div>
            )}

            {user.personal_info?.location?.city && (
              <div>
                <p className={`text-sm mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Ville</p>
                <p className="font-medium">{user.personal_info.location.city}</p>
              </div>
            )}

            {user.personal_info?.location?.address && (
              <div className="md:col-span-2">
                <p className={`text-sm mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Adresse</p>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="font-medium">{user.personal_info.location.address}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Account Information */}
      <div>
        <h3 className={`text-lg font-bold mb-4 pb-2 border-b ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
          Compte
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {user.personal_info?.account?.merchant_code && (
            <div>
              <p className={`text-sm mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Code Marchand</p>
              <p className="font-medium font-mono">{user.personal_info.account.merchant_code}</p>
            </div>
          )}

          <div>
            <p className={`text-sm mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Statut</p>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(userStatus)}`}>
              {getStatusLabel(userStatus)}
            </span>
          </div>
        </div>
      </div>

      {/* Profile Information */}
      {user.profile && (
        <div>
          <h3 className={`text-lg font-bold mb-4 pb-2 border-b ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
            Profil Détaillé
          </h3>
          <div className="space-y-4">
            {user.profile.photo && (
              <div>
                <p className={`text-sm mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Photo</p>
                <img src={user.profile.photo} alt="Photo de profil" className="w-32 h-32 rounded-lg object-cover" />
              </div>
            )}

            {user.profile.slogan && (
              <div>
                <p className={`text-sm mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Slogan</p>
                <p className="font-medium italic">{user.profile.slogan}</p>
              </div>
            )}

            {user.profile.description && (
              <div>
                <p className={`text-sm mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Biographie</p>
                <p className={`font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  {user.profile.description}
                </p>
              </div>
            )}

            {user.profile.address && (
              <div>
                <p className={`text-sm mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Adresse Profil</p>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                  <p className="font-medium">{user.profile.address}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Dates */}
      <div>
        <h3 className={`text-lg font-bold mb-4 pb-2 border-b ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
          Historique
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className={`text-sm mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Inscription</p>
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-indigo-500 flex-shrink-0" />
              <p className="font-medium">{user.personal_info?.dates?.created_at || user.created_at}</p>
            </div>
          </div>

          <div>
            <p className={`text-sm mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Dernière Modification</p>
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-orange-500 flex-shrink-0" />
              <p className="font-medium">{user.personal_info?.dates?.updated_at || user.updated_at}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAdsTab = () => {
    return (
      <div className="space-y-4">
        {ads.length > 0 ? (
          ads.map((ad) => (
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
          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Aucune annonce</p>
        )}
      </div>
    );
  };

  const renderSpacesTab = () => {
    const spaces = user.type_data?.spaces || [];

    return (
      <div className="space-y-4">
        {spaces.length > 0 ? (
          spaces.map((space) => (
            <div
              key={space.id}
              className={`rounded-lg border p-4 ${theme === 'dark' ? 'border-slate-700 bg-slate-900' : 'border-gray-200 bg-gray-50'}`}
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-bold">{space.name}</h3>
                <Badge className="px-2 py-1 text-xs bg-blue-500 text-white rounded">{space.employees_count} emp.</Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span>{space.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span>{space.phone}</span>
                </div>
                <div className="flex items-center gap-2 md:col-span-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span>{space.address}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Aucun espace</p>
        )}
      </div>
    );
  };

  const renderEmployeesTab = () => {
    const employees = user.type_data?.employees || [];

    return (
      <div className="overflow-x-auto">
        {employees.length > 0 ? (
          <table className="w-full text-left">
            <thead>
              <tr className={`border-b ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
                <th className={`px-4 py-3 font-bold text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>Nom</th>
                <th className={`px-4 py-3 font-bold text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>Email</th>
                <th className={`px-4 py-3 font-bold text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>Rôle</th>
                <th className={`px-4 py-3 font-bold text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>Espace</th>
                <th className={`px-4 py-3 font-bold text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>Action</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp.id} className={`border-b ${theme === 'dark' ? 'border-slate-700 hover:bg-slate-800' : 'border-gray-200 hover:bg-gray-50'}`}>
                  <td className="px-4 py-3 font-medium">{emp.name}</td>
                  <td className="px-4 py-3">{emp.email}</td>
                  <td className="px-4 py-3">{emp.role}</td>
                  <td className="px-4 py-3">{emp.space_name}</td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/utilisateurs/${emp.id}`}
                      className={`px-3 py-1 rounded text-xs font-semibold ${
                        theme === 'dark'
                          ? 'bg-slate-700 text-blue-400 hover:bg-slate-600'
                          : 'bg-gray-200 text-blue-600 hover:bg-gray-300'
                      }`}
                    >
                      Détails
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Aucun employé</p>
        )}
      </div>
    );
  };

  const renderPositionsTab = () => {
    const positions = user.type_data?.positions || [];

    return (
      <div className="space-y-4">
        {positions.length > 0 ? (
          positions.map((position) => (
            <div
              key={position.id}
              className={`rounded-lg border p-4 ${theme === 'dark' ? 'border-slate-700 bg-slate-900' : 'border-gray-200 bg-gray-50'}`}
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-bold">{position.space.name}</h3>
                <Badge className="w-5 h-5 text-blue-500" />
              </div>
              <p className={`text-sm mb-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Agence: <span className="font-semibold">{position.agency.name}</span>
              </p>
              <p className={`text-sm mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Rôle: <span className="font-semibold">{position.role}</span>
              </p>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span>{position.space.address}</span>
              </div>
            </div>
          ))
        ) : (
          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Aucun poste</p>
        )}
      </div>
    );
  };

  const renderTransactionsTab = () => {
    return (
      <div className="space-y-6">
        {userTransactions && userTransactions.length > 0 ? (
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
                  {userTransactions.map((transaction) => (
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
    );
  };

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <Header />

      <div className="flex flex-1">
        <AdminSidebar />

        <main className="flex-1 overflow-auto">
          {/* Header */}
          <div className={theme === 'dark' ? 'bg-slate-900/50 border-b border-slate-800' : 'bg-white border-b border-gray-200'}>
            <div className="max-w-7xl mx-auto px-8 py-8">
              <div className="flex items-center gap-4 mb-6">
                <Link
                  href="/admin/utilisateurs"
                  className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-slate-800' : 'hover:bg-gray-100'}`}
                >
                  <ArrowLeft className="w-6 h-6" />
                </Link>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2 ${getUserTypeColor(user.user_type)}`}>
                      {getUserTypeIcon(user.user_type)}
                      {getUserTypeLabel(user.user_type)}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(userStatus)}`}>
                      {getStatusLabel(userStatus)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Management Buttons */}
              <div className="border-t" style={{borderColor: theme === 'dark' ? '#334155' : '#e5e7eb'}}>
                <div className="pt-4">
                  <p className={`text-sm font-semibold mb-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>
                    Modifier le statut
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {[
                      { value: 1, label: 'Validé', icon: Check, color: 'emerald' },
                      { value: 2, label: 'En attente', icon: Clock, color: 'yellow' },
                      { value: 3, label: 'Bloqué', icon: Lock, color: 'red' },
                    ].map((statusOption) => {
                      const Icon = statusOption.icon;
                      const isActive = userStatus === statusOption.value;

                      return (
                        <button
                          key={statusOption.value}
                          onClick={() => handleStatusChange(statusOption.value)}
                          disabled={loadingStatus}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 transform ${
                            isActive
                              ? `${getStatusColor(statusOption.value)} shadow-lg scale-105`
                              : theme === 'dark'
                              ? 'bg-slate-800 text-gray-300 hover:bg-slate-700 hover:scale-102'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:scale-102'
                          } disabled:opacity-50 disabled:cursor-not-allowed active:scale-95`}
                        >
                          {loadingStatus ? (
                            <div className="w-4 h-4 border-2 border-transparent border-t-current rounded-full animate-spin" />
                          ) : (
                            <Icon className="w-4 h-4" />
                          )}
                          {statusOption.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-8 py-12">
            {/* Tabs Navigation */}
            <div className={`rounded-lg border mb-8 overflow-hidden ${theme === 'dark' ? 'border-slate-700 bg-slate-900' : 'border-gray-200 bg-white'}`}>
              <div className="flex border-b" style={{borderColor: theme === 'dark' ? '#334155' : '#e5e7eb'}}>
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-6 py-4 font-medium border-b-2 transition-colors ${
                        activeTab === tab.id
                          ? `border-blue-500 text-blue-600 ${theme === 'dark' ? 'bg-slate-800' : 'bg-gray-50'}`
                          : `border-transparent ${theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'}`
                      }`}
                      style={{borderBottom: activeTab === tab.id ? '2px solid #3b82f6' : 'none'}}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Tab Content */}
              <div className="p-8">
                {activeTab === 'personal' && renderPersonalTab()}
                {activeTab === 'ads' && renderAdsTab()}
                {activeTab === 'spaces' && renderSpacesTab()}
                {activeTab === 'employees' && renderEmployeesTab()}
                {activeTab === 'positions' && renderPositionsTab()}
                {activeTab === 'transactions' && renderTransactionsTab()}
              </div>
            </div>
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

        @keyframes fade-out {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }

        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }

        .animate-fade-out {
          animation: fade-out 0.3s ease-in;
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

        .text-emerald-100 {
          color: #dcfce7;
        }

        .text-red-100 {
          color: #fee2e2;
        }

        .text-blue-100 {
          color: #dbeafe;
        }
      `}</style>
    </div>
  );
}
