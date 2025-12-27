import { useState } from 'react';
import Header from '../../Components/Header';
import AdminSidebar from './AdminSidebar';
import Footer from '../../Components/Footer';
import { useThemeStore } from '../../store';
import { Link } from '@inertiajs/react';
import {
  ArrowLeft, AlertCircle, Clock, CheckCircle, XCircle, MapPin, Phone, Mail,
  DollarSign, Eye, Calendar, User, Building, Ban, X
} from 'lucide-react';

export default function ReportDetail({ report, ad, features, creator, agency }) {
  const { theme } = useThemeStore();
  const [activeTab, setActiveTab] = useState('details');
  const [loading, setLoading] = useState(false);
  const [currentReport, setCurrentReport] = useState(report);

  if (!report || !ad) {
    return (
      <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-gray-100 text-gray-900'}`}>
        <Header />
        <div className="flex flex-1">
          <AdminSidebar />
          <main className="flex-1 overflow-auto p-8">
            <div className={`rounded-lg border p-8 text-center ${theme === 'dark' ? 'border-slate-700 bg-slate-900' : 'border-gray-200 bg-white'}`}>
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Signalement non trouvé</p>
            </div>
          </main>
        </div>
        <Footer />
      </div>
    );
  }

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
      case 'pending': return AlertCircle;
      case 'investigating': return Clock;
      case 'resolved': return CheckCircle;
      default: return XCircle;
    }
  };

  const StatusIcon = getStatusIcon(currentReport?.status);

  const updateReportStatus = async (newStatus) => {
    setLoading(true);
    try {
      const response = await fetch(`/admin/signalements/${currentReport.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]')?.content,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setCurrentReport(prev => ({ ...prev, status: newStatus }));
      } else {
        console.error('Erreur lors de la mise à jour du statut');
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const blockAd = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/admin/annonces/${currentReport.ad_id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]')?.content,
        },
        body: JSON.stringify({ status: 'blocked' }),
      });

      if (response.ok) {
        // Also mark the report as resolved
        await updateReportStatus('resolved');
        setCurrentReport(prev => ({ ...prev, status: 'resolved' }));
      } else {
        console.error('Erreur lors du blocage de l\'annonce');
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const unlockAd = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/admin/annonces/${currentReport.ad_id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]')?.content,
        },
        body: JSON.stringify({ status: 'valid' }),
      });

      if (response.ok) {
        window.location.href = '/admin/signalements';
      } else {
        console.error('Erreur lors du déblocage de l\'annonce');
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteReport = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce signalement? Cette action est irréversible.')) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/admin/signalements/${currentReport.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]')?.content,
        },
      });

      if (response.ok) {
        window.location.href = '/admin/signalements';
      } else {
        console.error('Erreur lors de la suppression du signalement');
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
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
            <div className="max-w-7xl mx-auto px-8 py-8">
              <Link
                href="/admin/signalements"
                className={`flex items-center gap-2 mb-4 text-sm font-semibold ${theme === 'dark' ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-700'}`}
              >
                <ArrowLeft className="w-4 h-4" />
                Retour aux signalements
              </Link>
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{ad.title || 'Annonce supprimée'}</h1>
                  <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                    Signalement #{currentReport.id} • {getStatusLabel(currentReport.status)}
                  </p>
                </div>
                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${getStatusColor(currentReport.status)}`}>
                  <StatusIcon className="w-5 h-5" />
                  <span className="font-semibold">{getStatusLabel(currentReport.status)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-8 py-12">
            {/* Tabs */}
            <div className={`rounded-lg border mb-8 overflow-hidden ${theme === 'dark' ? 'border-slate-700 bg-slate-900' : 'border-gray-200 bg-white'}`}>
              <div className="flex border-b" style={{ borderColor: theme === 'dark' ? '#475569' : '#e5e7eb' }}>
                {[
                  { id: 'details', label: 'Détails du signalement' },
                  { id: 'annonce', label: 'Annonce' },
                  { id: 'agence', label: 'Agence / Créateur' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 px-6 py-4 font-semibold text-center transition ${
                      activeTab === tab.id
                        ? theme === 'dark'
                          ? 'bg-purple-600 text-white'
                          : 'bg-purple-600 text-white'
                        : theme === 'dark'
                        ? 'text-gray-400 hover:text-gray-300'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="p-8">
                {/* Details Tab */}
                {activeTab === 'details' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <p className={`text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          Raison du signalement
                        </p>
                        <p className={`text-lg whitespace-pre-wrap ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                          {currentReport.reason}
                        </p>
                      </div>

                      <div>
                        <p className={`text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          Status
                        </p>
                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${getStatusColor(currentReport.status)}`}>
                          <StatusIcon className="w-4 h-4" />
                          {getStatusLabel(currentReport.status)}
                        </div>
                      </div>

                      <div>
                        <p className={`text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          Date du signalement
                        </p>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className={theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}>
                            {currentReport.created_at}
                          </span>
                        </div>
                      </div>

                      <div>
                        <p className={`text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          Signalé par
                        </p>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className={theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}>
                            {currentReport.reporter?.name || 'Utilisateur supprimé'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Annonce Tab */}
                {activeTab === 'annonce' && (
                  <div className="space-y-6">
                    {ad.main_photo && (
                      <div className="mb-6">
                        <img
                          src={ad.main_photo}
                          alt={ad.title}
                          className="w-full h-80 object-cover rounded-lg"
                        />
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <p className={`text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          Titre
                        </p>
                        <p className={`text-lg ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                          {ad.title}
                        </p>
                      </div>

                      <div>
                        <p className={`text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          Prix
                        </p>
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-emerald-500" />
                          <span className={`text-lg font-bold ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`}>
                            XFA {(ad.price || 0).toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <div>
                        <p className={`text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          Adresse
                        </p>
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                          <span className={theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}>
                            {ad.address}
                          </span>
                        </div>
                      </div>

                      <div>
                        <p className={`text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          Status
                        </p>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          ad.status === 'valid' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                          : ad.status === 'pending' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                          : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                        }`}>
                          {ad.status === 'valid' ? 'Valide' : ad.status === 'pending' ? 'En attente' : 'Bloquée'}
                        </span>
                      </div>

                      <div>
                        <p className={`text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          Date de création
                        </p>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className={theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}>
                            {ad.created_at}
                          </span>
                        </div>
                      </div>

                      <div>
                        <p className={`text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          Vues
                        </p>
                        <div className="flex items-center gap-2">
                          <Eye className="w-4 h-4 text-gray-400" />
                          <span className={theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}>
                            {ad.views_count?.toLocaleString() || 0}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className={`text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        Description
                      </p>
                      <p className={`leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        {ad.description}
                      </p>
                    </div>

                    <div className={`rounded-lg border p-6 ${theme === 'dark' ? 'border-slate-700 bg-slate-800' : 'border-gray-200 bg-gray-50'}`}>
                      <h3 className={`text-lg font-bold mb-4 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                        Informations de contact
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                            {ad.contact_phone}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                            {ad.contact_email}
                          </span>
                        </div>
                      </div>
                    </div>

                    {features && features.length > 0 && (
                      <div>
                        <h3 className={`text-lg font-bold mb-4 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                          Caractéristiques
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {features.map((feature) => (
                            <div
                              key={feature.id}
                              className={`rounded-lg border p-4 ${theme === 'dark' ? 'border-slate-700 bg-slate-800' : 'border-gray-200 bg-white'}`}
                            >
                              {feature.photo && (
                                <img
                                  src={feature.photo}
                                  alt={feature.label}
                                  className="w-full h-32 object-cover rounded-lg mb-3"
                                />
                              )}
                              <p className={`text-sm font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                {feature.label}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Agence Tab */}
                {activeTab === 'agence' && (
                  <div className="space-y-6">
                    {creator && (
                      <div className={`rounded-lg border p-6 ${theme === 'dark' ? 'border-slate-700 bg-slate-800' : 'border-gray-200 bg-gray-50'}`}>
                        <h3 className={`text-xl font-bold mb-6 flex items-center gap-2 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                          <User className="w-6 h-6" />
                          Créateur de l'annonce
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                          <div>
                            <p className={`text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                              Nom
                            </p>
                            <p className={`text-lg ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                              {creator.name}
                            </p>
                          </div>

                          <div>
                            <p className={`text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                              Email
                            </p>
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4 text-gray-400" />
                              <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                                {creator.email}
                              </span>
                            </div>
                          </div>

                          <div>
                            <p className={`text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                              Téléphone
                            </p>
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4 text-gray-400" />
                              <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                                {creator.phone || 'N/A'}
                              </span>
                            </div>
                          </div>

                          <div>
                            <p className={`text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                              Type d'utilisateur
                            </p>
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              creator.user_type === 'agency' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                            }`}>
                              {creator.user_type === 'agency' ? 'Agence' : 'Utilisateur'}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {agency && (
                      <div className={`rounded-lg border p-6 ${theme === 'dark' ? 'border-slate-700 bg-slate-800' : 'border-gray-200 bg-gray-50'}`}>
                        <h3 className={`text-xl font-bold mb-6 flex items-center gap-2 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                          <Building className="w-6 h-6" />
                          Agence
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                          <div>
                            <p className={`text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                              Nom
                            </p>
                            <p className={`text-lg ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                              {agency.name}
                            </p>
                          </div>

                          <div>
                            <p className={`text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                              Email
                            </p>
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4 text-gray-400" />
                              <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                                {agency.email}
                              </span>
                            </div>
                          </div>

                          <div>
                            <p className={`text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                              Téléphone
                            </p>
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4 text-gray-400" />
                              <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                                {agency.phone}
                              </span>
                            </div>
                          </div>

                          <div>
                            <p className={`text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                              Adresse
                            </p>
                            <div className="flex items-start gap-2">
                              <MapPin className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                              <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                                {agency.address}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <Link
                            href={`/admin/agences/${agency.id}`}
                            className={`flex-1 px-4 py-2 rounded-lg border font-semibold text-center transition ${
                              theme === 'dark'
                                ? 'border-purple-500/30 text-purple-400 hover:bg-purple-500/10'
                                : 'border-purple-300 text-purple-600 hover:bg-purple-100'
                            }`}
                          >
                            Détails admin
                          </Link>
                          <Link
                            href={`/agencies/${agency.id}`}
                            className={`flex-1 px-4 py-2 rounded-lg border font-semibold text-center transition ${
                              theme === 'dark'
                                ? 'border-blue-500/30 text-blue-400 hover:bg-blue-500/10'
                                : 'border-blue-300 text-blue-600 hover:bg-blue-100'
                            }`}
                          >
                            Voir la page publique
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className={`rounded-lg border p-6 mt-8 ${theme === 'dark' ? 'border-slate-700 bg-slate-900' : 'border-gray-200 bg-white'}`}>
              <h3 className={`text-lg font-bold mb-4 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                Actions
              </h3>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/admin/signalements"
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition text-sm font-medium ${
                    theme === 'dark'
                      ? 'border-slate-700 bg-slate-800 hover:bg-slate-700 text-gray-100'
                      : 'border-gray-300 bg-white hover:bg-gray-100 text-gray-900'
                  }`}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Retour aux signalements
                </Link>

                {currentReport.status === 'pending' && (
                  <>
                    <button
                      onClick={() => updateReportStatus('investigating')}
                      disabled={loading}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition text-sm font-medium disabled:opacity-50 ${
                        theme === 'dark'
                          ? 'bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20'
                          : 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
                      }`}
                    >
                      <Clock className="w-4 h-4" />
                      Marquer en cours
                    </button>
                    <button
                      onClick={() => updateReportStatus('resolved')}
                      disabled={loading}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition text-sm font-medium disabled:opacity-50 ${
                        theme === 'dark'
                          ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                          : 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200'
                      }`}
                    >
                      <CheckCircle className="w-4 h-4" />
                      Résoudre
                    </button>
                    <button
                      onClick={() => blockAd()}
                      disabled={loading}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition text-sm font-medium disabled:opacity-50 ${
                        theme === 'dark'
                          ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                          : 'bg-red-100 text-red-600 hover:bg-red-200'
                      }`}
                    >
                      <Ban className="w-4 h-4" />
                      Bloquer l'annonce
                    </button>
                  </>
                )}

                {currentReport.status === 'investigating' && (
                  <>
                    <button
                      onClick={() => updateReportStatus('resolved')}
                      disabled={loading}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition text-sm font-medium disabled:opacity-50 ${
                        theme === 'dark'
                          ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                          : 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200'
                      }`}
                    >
                      <CheckCircle className="w-4 h-4" />
                      Résoudre
                    </button>
                    <button
                      onClick={() => blockAd()}
                      disabled={loading}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition text-sm font-medium disabled:opacity-50 ${
                        theme === 'dark'
                          ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                          : 'bg-red-100 text-red-600 hover:bg-red-200'
                      }`}
                    >
                      <Ban className="w-4 h-4" />
                      Bloquer l'annonce
                    </button>
                  </>
                )}

                {/* Unlock Ad Button - Show if ad is blocked */}
                {ad?.status === 'blocked' && (
                  <button
                    onClick={() => unlockAd()}
                    disabled={loading}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition text-sm font-medium disabled:opacity-50 ${
                      theme === 'dark'
                        ? 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20'
                        : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                    }`}
                  >
                    <CheckCircle className="w-4 h-4" />
                    Débloquer l'annonce
                  </button>
                )}

                {/* Delete Report Button - Always available */}
                <button
                  onClick={() => deleteReport()}
                  disabled={loading}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition text-sm font-medium disabled:opacity-50 ${
                    theme === 'dark'
                      ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                      : 'bg-red-100 text-red-600 hover:bg-red-200'
                  }`}
                >
                  <X className="w-4 h-4" />
                  Supprimer le signalement
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
