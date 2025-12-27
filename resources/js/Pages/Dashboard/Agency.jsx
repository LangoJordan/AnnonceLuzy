import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import {
  Plus,
  Eye,
  Heart,
  TrendingUp,
  DollarSign,
  Users,
  Zap,
  Edit2,
  Trash2,
  BarChart3,
  CreditCard,
  Settings,
  Package,
  ArrowUp,
  Calendar,
  ArrowLeft,
} from 'lucide-react';

export default function AgencyDashboard({ user }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const stats = [
    { label: 'Annonces actives', value: '12', icon: Package, color: 'from-blue-500 to-cyan-500' },
    { label: 'Vues totales', value: '2,543', icon: Eye, color: 'from-purple-500 to-pink-500' },
    { label: 'Revenus', value: '4,250€', icon: DollarSign, color: 'from-green-500 to-emerald-500' },
    { label: 'Abonnement actif', value: 'Premium', icon: CreditCard, color: 'from-yellow-500 to-orange-500' },
  ];

  const ads = [
    {
      id: 1,
      title: 'Développeur Full Stack React/Laravel',
      category: 'Emploi',
      views: 342,
      likes: 45,
      status: 'active',
      createdAt: '2024-01-10',
      promoted: true,
    },
    {
      id: 2,
      title: 'Responsable Marketing Digital',
      category: 'Emploi',
      views: 156,
      likes: 23,
      status: 'active',
      createdAt: '2024-01-08',
      promoted: false,
    },
    {
      id: 3,
      title: 'Consultant Business Intelligence',
      category: 'Services',
      views: 89,
      likes: 12,
      status: 'expired',
      createdAt: '2023-12-28',
      promoted: false,
    },
  ];

  const staff = [
    { id: 1, name: 'Marie Dupont', email: 'marie@agency.com', role: 'Commercial', status: 'active' },
    { id: 2, name: 'Jean Martin', email: 'jean@agency.com', role: 'Manager', status: 'active' },
    { id: 3, name: 'Sophie Bernard', email: 'sophie@agency.com', role: 'Commercial', status: 'inactive' },
  ];

  const subscription = {
    plan: 'Premium',
    monthlyPrice: 99,
    nextBillingDate: '2024-02-10',
    features: ['Annonces illimitées', 'Boost gratuit 2x/mois', 'Support prioritaire', 'Analytiques avancées'],
  };

  const transactions = [
    { id: 1, type: 'Boost annonce', amount: -49, date: '2024-01-15', status: 'completed' },
    { id: 2, type: 'Abonnement mensuel', amount: -99, date: '2024-01-10', status: 'completed' },
    { id: 3, type: 'Boost annonce', amount: -49, date: '2024-01-05', status: 'completed' },
  ];

  const merchantCodes = [
    { id: 1, code: 'MER-001-ABC', espace: 'Espace Principal', views: 1250, transactions: 45 },
    { id: 2, code: 'MER-002-XYZ', espace: 'Espace Secondaire', views: 450, transactions: 15 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Head title="Dashboard Agence" />
      <Header user={user} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="flex items-center text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à l'accueil
          </Link>
          <h1 className="text-4xl font-bold text-gray-900">Dashboard Agence</h1>
          <p className="text-gray-600 mt-2">Gérez vos annonces, équipe et abonnement</p>
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
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          {[
            { id: 'overview', label: 'Aperçu', icon: BarChart3 },
            { id: 'ads', label: 'Annonces', icon: Package },
            { id: 'staff', label: 'Équipe', icon: Users },
            { id: 'subscription', label: 'Abonnement', icon: CreditCard },
            { id: 'codes', label: 'Codes marchands', icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 font-medium transition border-b-2 ${
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

        {/* Ads Tab */}
        {activeTab === 'ads' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Gestion des annonces</h2>
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
              >
                <Plus className="w-5 h-5" />
                <span>Créer une annonce</span>
              </button>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Titre</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Catégorie</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Vues</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">J'aime</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Statut</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ads.map((ad) => (
                      <tr key={ad.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-semibold text-gray-900">{ad.title}</p>
                            <p className="text-sm text-gray-600 mt-1">{new Date(ad.createdAt).toLocaleDateString('fr-FR')}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                            {ad.category}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-1 text-gray-700">
                            <Eye className="w-4 h-4" />
                            <span>{ad.views}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-1 text-gray-700">
                            <Heart className="w-4 h-4" />
                            <span>{ad.likes}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            ad.status === 'active'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {ad.status === 'active' ? 'Actif' : 'Expiré'}
                          </span>
                          {ad.promoted && (
                            <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-semibold">
                              <Zap className="w-3 h-3 inline mr-1" />
                              Boosté
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <button className="p-2 hover:bg-gray-200 rounded-lg transition">
                              <Edit2 className="w-4 h-4 text-blue-600" />
                            </button>
                            <button className="p-2 hover:bg-gray-200 rounded-lg transition">
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </button>
                            {ad.status === 'active' && (
                              <button className="p-2 hover:bg-yellow-100 rounded-lg transition">
                                <Zap className="w-4 h-4 text-yellow-600" />
                              </button>
                            )}
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

        {/* Staff Tab */}
        {activeTab === 'staff' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Gestion de l'équipe</h2>
              <button className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold">
                <Plus className="w-5 h-5" />
                <span>Inviter un membre</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {staff.map((member) => (
                <div key={member.id} className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-xl">
                      👤
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{member.name}</h3>
                      <p className="text-sm text-gray-600">{member.role}</p>
                    </div>
                  </div>
                  <div className="mb-4 pb-4 border-b border-gray-200">
                    <p className="text-sm text-gray-600">{member.email}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      member.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {member.status === 'active' ? 'Actif' : 'Inactif'}
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

        {/* Subscription Tab */}
        {activeTab === 'subscription' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Abonnement et facturation</h2>

            {/* Current Plan */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{subscription.plan}</h3>
                  <p className="text-blue-600 font-semibold mt-1">{subscription.monthlyPrice}€/mois</p>
                </div>
                <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold">
                  Changer de plan
                </button>
              </div>
              <p className="text-gray-600 mb-4">Prochaine facturation: {new Date(subscription.nextBillingDate).toLocaleDateString('fr-FR')}</p>
              <div className="grid grid-cols-2 gap-4">
                {subscription.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <span className="text-green-600">✓</span>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Transactions */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Historique des transactions</h3>
              <div className="space-y-3">
                {transactions.map((trans) => (
                  <div key={trans.id} className="bg-white rounded-lg border border-gray-200 p-4 flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{trans.type}</p>
                      <p className="text-sm text-gray-600">{new Date(trans.date).toLocaleDateString('fr-FR')}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-red-600">{trans.amount}€</p>
                      <span className="text-xs text-green-600">Complété</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Merchant Codes Tab */}
        {activeTab === 'codes' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Codes marchands</h2>
              <button className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold">
                <Plus className="w-5 h-5" />
                <span>Créer un code</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {merchantCodes.map((item) => (
                <div key={item.id} className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 mb-4 font-mono font-bold text-lg text-gray-900">
                    {item.code}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-4">{item.espace}</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Vues</p>
                      <p className="text-2xl font-bold text-blue-600">{item.views}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Transactions</p>
                      <p className="text-2xl font-bold text-green-600">{item.transactions}</p>
                    </div>
                  </div>
                  <button className="w-full mt-4 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-semibold text-sm">
                    Gérer
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Performance */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                  <span>Performance du mois</span>
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Vues</span>
                      <span className="font-bold text-gray-900">2,543</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Favoris</span>
                      <span className="font-bold text-gray-900">156</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-pink-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Messages reçus</span>
                      <span className="font-bold text-gray-900">89</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Actions rapides</h3>
                <div className="space-y-3">
                  <button className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold flex items-center justify-center space-x-2">
                    <Plus className="w-5 h-5" />
                    <span>Créer une annonce</span>
                  </button>
                  <button className="w-full px-4 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition font-semibold flex items-center justify-center space-x-2">
                    <Zap className="w-5 h-5" />
                    <span>Booster une annonce</span>
                  </button>
                  <button className="w-full px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold">
                    Voir les messages
                  </button>
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
