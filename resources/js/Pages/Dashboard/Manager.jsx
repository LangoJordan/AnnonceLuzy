import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import {
  AlertCircle,
  CheckCircle,
  XCircle,
  Users,
  Package,
  TrendingUp,
  Search,
  Filter,
  Edit2,
  Eye,
  Trash2,
  ArrowLeft,
  MessageCircle,
  Clock,
} from 'lucide-react';

export default function ManagerDashboard({ user }) {
  const [activeTab, setActiveTab] = useState('validation');
  const [searchQuery, setSearchQuery] = useState('');

  const stats = [
    { label: 'Profils en attente', value: '8', icon: Clock, color: 'from-orange-500 to-yellow-500' },
    { label: 'Annonces à modérer', value: '15', icon: AlertCircle, color: 'from-red-500 to-pink-500' },
    { label: 'Agences actives', value: '234', icon: Users, color: 'from-blue-500 to-cyan-500' },
    { label: 'Appels reçus', value: '42', icon: MessageCircle, color: 'from-green-500 to-emerald-500' },
  ];

  const pendingProfiles = [
    {
      id: 1,
      name: 'Agence Innovation SARL',
      email: 'contact@innovation.fr',
      type: 'Agence',
      appliedAt: '2024-01-14',
      status: 'pending',
    },
    {
      id: 2,
      name: 'Solutions Marketing Plus',
      email: 'info@solutions-mk.com',
      type: 'Agence',
      appliedAt: '2024-01-12',
      status: 'pending',
    },
    {
      id: 3,
      name: 'Jean Leclerc',
      email: 'jean@example.com',
      type: 'Visiteur',
      appliedAt: '2024-01-10',
      status: 'pending',
    },
  ];

  const flaggedAds = [
    {
      id: 1,
      title: 'Annonce suspecte 1',
      agency: 'Agence X',
      reason: 'Contenu douteux',
      reportCount: 3,
      flaggedAt: '2024-01-15',
    },
    {
      id: 2,
      title: 'Services mal décrits',
      agency: 'Agence Y',
      reason: 'Informations manquantes',
      reportCount: 2,
      flaggedAt: '2024-01-14',
    },
    {
      id: 3,
      title: 'Offre trop agressive',
      agency: 'Agence Z',
      reason: 'Langage agressif',
      reportCount: 5,
      flaggedAt: '2024-01-13',
    },
  ];

  const agencies = [
    {
      id: 1,
      name: 'Agence TechStartup',
      contact: 'Jean Dupont',
      activeAds: 12,
      status: 'compliant',
      lastReview: '2024-01-10',
    },
    {
      id: 2,
      name: 'Agence Marketing Pro',
      contact: 'Marie Martin',
      activeAds: 8,
      status: 'warning',
      lastReview: '2024-01-08',
    },
    {
      id: 3,
      name: 'Agence Solutions',
      contact: 'Pierre Bernard',
      activeAds: 15,
      status: 'compliant',
      lastReview: '2024-01-12',
    },
  ];

  const reports = [
    {
      id: 1,
      type: 'Spam',
      description: 'Annonces dupliquées',
      reporter: 'Sophie J.',
      date: '2024-01-15',
      status: 'new',
    },
    {
      id: 2,
      type: 'Arnaque',
      description: 'Tarifs non honnêtes',
      reporter: 'Jean M.',
      date: '2024-01-14',
      status: 'investigating',
    },
    {
      id: 3,
      type: 'Contenu offensant',
      description: 'Langage abusif',
      reporter: 'Marie D.',
      date: '2024-01-13',
      status: 'resolved',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Head title="Dashboard Manager" />
      <Header user={user} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="flex items-center text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à l'accueil
          </Link>
          <h1 className="text-4xl font-bold text-gray-900">Dashboard Manager</h1>
          <p className="text-gray-600 mt-2">Validez les profils, modérez les annonces et supervisez les agences</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200 overflow-x-auto">
          {[
            { id: 'validation', label: 'Validation profils', icon: CheckCircle },
            { id: 'moderation', label: 'Modération annonces', icon: Eye },
            { id: 'agencies', label: 'Suivi agences', icon: Users },
            { id: 'reports', label: 'Signalements', icon: AlertCircle },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 font-medium transition border-b-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Validation Tab */}
        {activeTab === 'validation' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Profils en attente de validation</h2>

            <div className="space-y-4">
              {pendingProfiles.map((profile) => (
                <div key={profile.id} className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900">{profile.name}</h3>
                      <p className="text-gray-600 mt-1">{profile.email}</p>
                      <div className="flex items-center space-x-4 mt-3 text-sm">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-semibold">
                          {profile.type}
                        </span>
                        <span className="text-gray-600">Candidature reçue le {new Date(profile.appliedAt).toLocaleDateString('fr-FR')}</span>
                      </div>
                    </div>
                    <span className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-full text-sm font-semibold">
                      En attente
                    </span>
                  </div>

                  <div className="flex gap-3 pt-6 border-t border-gray-200">
                    <button className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold flex items-center justify-center space-x-2">
                      <CheckCircle className="w-5 h-5" />
                      <span>Approuver</span>
                    </button>
                    <button className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold flex items-center justify-center space-x-2">
                      <Eye className="w-5 h-5" />
                      <span>Examiner les détails</span>
                    </button>
                    <button className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold flex items-center justify-center space-x-2">
                      <XCircle className="w-5 h-5" />
                      <span>Rejeter</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Moderation Tab */}
        {activeTab === 'moderation' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Annonces à modérer</h2>

            <div className="space-y-4">
              {flaggedAds.map((ad) => (
                <div key={ad.id} className="bg-white rounded-xl border-l-4 border-red-500 border border-gray-200 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-900">{ad.title}</h3>
                        <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-semibold">
                          {ad.reportCount} signalement{ad.reportCount > 1 ? 's' : ''}
                        </span>
                      </div>
                      <p className="text-gray-600">Agence: <strong>{ad.agency}</strong></p>
                      <p className="text-sm text-gray-600 mt-2">Raison: {ad.reason}</p>
                      <p className="text-xs text-gray-500 mt-2">Signalée le {new Date(ad.flaggedAt).toLocaleDateString('fr-FR')}</p>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-gray-200">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-semibold">
                      Approuver
                    </button>
                    <button className="px-4 py-2 border-2 border-orange-300 text-orange-700 rounded-lg hover:bg-orange-50 transition text-sm font-semibold">
                      Éditer
                    </button>
                    <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-semibold">
                      Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Agencies Tab */}
        {activeTab === 'agencies' && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Chercher une agence..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button className="flex items-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-semibold">
                <Filter className="w-5 h-5" />
                <span>Filtres</span>
              </button>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Agence</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Contact</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Annonces actives</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Statut</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Dernier contrôle</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {agencies.map((agency) => (
                      <tr key={agency.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                        <td className="px-6 py-4 font-semibold text-gray-900">{agency.name}</td>
                        <td className="px-6 py-4 text-gray-600">{agency.contact}</td>
                        <td className="px-6 py-4">
                          <p className="font-semibold text-blue-600">{agency.activeAds}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            agency.status === 'compliant'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {agency.status === 'compliant' ? 'Conforme' : 'Avertissement'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{new Date(agency.lastReview).toLocaleDateString('fr-FR')}</td>
                        <td className="px-6 py-4">
                          <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm">
                            Examiner
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Signalements reçus</h2>

            <div className="space-y-4">
              {reports.map((report) => (
                <div key={report.id} className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                          {report.type}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          report.status === 'new'
                            ? 'bg-blue-100 text-blue-700'
                            : report.status === 'investigating'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {report.status === 'new' ? 'Nouveau' : report.status === 'investigating' ? 'En investigation' : 'Résolu'}
                        </span>
                      </div>
                      <p className="text-gray-900 font-medium mb-1">{report.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mt-3">
                        <span>Signalé par: <strong>{report.reporter}</strong></span>
                        <span>{new Date(report.date).toLocaleDateString('fr-FR')}</span>
                      </div>
                    </div>
                  </div>

                  {report.status === 'new' && (
                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                      <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-semibold">
                        Examiner
                      </button>
                      <button className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm font-semibold">
                        Rejeter le signalement
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
