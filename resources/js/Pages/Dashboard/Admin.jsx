import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import {
  Users,
  CreditCard,
  BarChart3,
  AlertCircle,
  CheckCircle,
  XCircle,
  Eye,
  Filter,
  Search,
  Edit2,
  Ban,
  Settings,
  TrendingUp,
  DollarSign,
  Package,
  ArrowLeft,
} from 'lucide-react';

export default function AdminDashboard({ user }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');

  const stats = [
    { label: 'Utilisateurs totaux', value: '2,543', icon: Users, color: 'from-blue-500 to-cyan-500' },
    { label: 'Annonces actives', value: '856', icon: Package, color: 'from-green-500 to-emerald-500' },
    { label: 'Revenus (mois)', value: '12,450€', icon: DollarSign, color: 'from-purple-500 to-pink-500' },
    { label: 'Signalements en attente', value: '23', icon: AlertCircle, color: 'from-orange-500 to-red-500' },
  ];

  const users = [
    { id: 1, name: 'Jean Dupont', email: 'jean@example.com', type: 'Agence', status: 'active', joined: '2024-01-01' },
    { id: 2, name: 'Marie Martin', email: 'marie@example.com', type: 'Visiteur', status: 'active', joined: '2024-01-05' },
    { id: 3, name: 'Pierre Bernard', email: 'pierre@example.com', type: 'Agence', status: 'suspended', joined: '2023-12-15' },
    { id: 4, name: 'Sophie Johnson', email: 'sophie@example.com', type: 'Visiteur', status: 'active', joined: '2024-01-10' },
  ];

  const reports = [
    { id: 1, type: 'Contenu offensant', ad: 'Annonce #123', reportedBy: 'Jean D.', date: '2024-01-15', status: 'pending' },
    { id: 2, type: 'Arnaque suspectée', ad: 'Annonce #456', reportedBy: 'Marie M.', date: '2024-01-14', status: 'pending' },
    { id: 3, type: 'Spam', ad: 'Annonce #789', reportedBy: 'Pierre B.', date: '2024-01-12', status: 'resolved' },
  ];

  const payments = [
    { id: 1, user: 'Agence TechStartup', type: 'Abonnement', amount: 99, date: '2024-01-10', status: 'completed' },
    { id: 2, user: 'Agence Marketing Pro', type: 'Boost annonce', amount: 49, date: '2024-01-12', status: 'completed' },
    { id: 3, user: 'Agence Solutions', type: 'Abonnement', amount: 199, date: '2024-01-15', status: 'pending' },
  ];

  const managers = [
    { id: 1, name: 'Admin Manager 1', email: 'manager1@admin.com', createdAt: '2023-12-01', status: 'active' },
    { id: 2, name: 'Admin Manager 2', email: 'manager2@admin.com', createdAt: '2023-12-15', status: 'active' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Head title="Dashboard Admin" />
      <Header user={user} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="flex items-center text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à l'accueil
          </Link>
          <h1 className="text-4xl font-bold text-gray-900">Dashboard Administrateur</h1>
          <p className="text-gray-600 mt-2">Gérez la plateforme, utilisateurs et paiements</p>
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
            { id: 'overview', label: 'Aperçu', icon: BarChart3 },
            { id: 'users', label: 'Utilisateurs', icon: Users },
            { id: 'reports', label: 'Signalements', icon: AlertCircle },
            { id: 'payments', label: 'Paiements', icon: CreditCard },
            { id: 'managers', label: 'Managers', icon: Settings },
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

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Chercher un utilisateur..."
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
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Utilisateur</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Type</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Email</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Inscription</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Statut</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                        <td className="px-6 py-4 font-semibold text-gray-900">{u.name}</td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                            {u.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{u.email}</td>
                        <td className="px-6 py-4 text-gray-600">{new Date(u.joined).toLocaleDateString('fr-FR')}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            u.status === 'active'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {u.status === 'active' ? 'Actif' : 'Suspendu'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <button className="p-2 hover:bg-gray-200 rounded-lg transition">
                              <Edit2 className="w-4 h-4 text-blue-600" />
                            </button>
                            <button className="p-2 hover:bg-gray-200 rounded-lg transition">
                              <Ban className="w-4 h-4 text-red-600" />
                            </button>
                          </div>
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
            <h2 className="text-2xl font-bold text-gray-900">Signalements</h2>
            <div className="space-y-4">
              {reports.map((report) => (
                <div key={report.id} className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                          {report.type}
                        </span>
                        <p className="text-sm text-gray-600">{report.ad}</p>
                      </div>
                      <p className="text-gray-700 mb-2">Signalé par <strong>{report.reportedBy}</strong></p>
                      <p className="text-xs text-gray-500">{new Date(report.date).toLocaleString('fr-FR')}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        report.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {report.status === 'pending' ? 'En attente' : 'Résolu'}
                      </span>
                      {report.status === 'pending' && (
                        <div className="flex gap-2">
                          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-semibold">
                            Examiner
                          </button>
                          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm font-semibold">
                            Ignorer
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Payments Tab */}
        {activeTab === 'payments' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Transactions</h2>
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Utilisateur</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Type</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Montant</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((payment) => (
                      <tr key={payment.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                        <td className="px-6 py-4 font-semibold text-gray-900">{payment.user}</td>
                        <td className="px-6 py-4 text-gray-600">{payment.type}</td>
                        <td className="px-6 py-4">
                          <p className="font-bold text-green-600">{payment.amount}€</p>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{new Date(payment.date).toLocaleDateString('fr-FR')}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            payment.status === 'completed'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {payment.status === 'completed' ? 'Complété' : 'En attente'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Managers Tab */}
        {activeTab === 'managers' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Gestion des Managers</h2>
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold">
                Créer un Manager
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {managers.map((manager) => (
                <div key={manager.id} className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-xl">
                      👤
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{manager.name}</h3>
                      <p className="text-sm text-gray-600">Manager</p>
                    </div>
                  </div>
                  <div className="mb-4 pb-4 border-b border-gray-200">
                    <p className="text-sm text-gray-600">{manager.email}</p>
                    <p className="text-xs text-gray-500 mt-2">Créé le {new Date(manager.createdAt).toLocaleDateString('fr-FR')}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                      {manager.status === 'active' ? 'Actif' : 'Inactif'}
                    </span>
                    <button className="text-red-600 hover:text-red-700 font-medium text-sm">
                      Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart Placeholder */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <TrendingUp className="w-6 h-6 text-blue-600" />
                <span>Tendances du mois</span>
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Nouvelles annonces</span>
                    <span className="font-bold">342</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '80%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Nouveaux utilisateurs</span>
                    <span className="font-bold">156</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Revenus générés</span>
                    <span className="font-bold">12,450€</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: '70%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Activité récente</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">Annonce publiée</p>
                    <p className="text-sm text-gray-600">par Jean Dupont il y a 2h</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">Signalement reçu</p>
                    <p className="text-sm text-gray-600">Contenu offensant il y a 4h</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CreditCard className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">Paiement reçu</p>
                    <p className="text-sm text-gray-600">99€ abonnement il y a 6h</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
