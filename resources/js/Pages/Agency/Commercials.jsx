import { useState } from 'react';
import { Link } from '@inertiajs/react';
import Header from '../../Components/Header';
import AgencySidebar from './AgencySidebar';
import AgencyContextBanner from '../../Components/AgencyContextBanner';
import { useThemeStore } from '../../store';
import { Plus, Edit2, Trash2, Mail, Phone, FileText, Search, TrendingUp, Award, User, ArrowUpRight } from 'lucide-react';

export default function AgencyCommercials({ user, selectedAgency = null, availableAgencies = [] }) {
  const { theme } = useThemeStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCommercialId, setSelectedCommercialId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'commercial',
  });

  const commercials = [
    {
      id: 1,
      name: 'Alice Dupont',
      email: 'alice@techstartup.com',
      phone: '+33 6 12 34 56 78',
      adsCreated: 8,
      totalViews: 1240,
      totalClicks: 145,
      revenue: '450€',
      joinedAt: '2023-12-15',
      status: 'active',
      performance: 'excellent',
    },
    {
      id: 2,
      name: 'Bob Martin',
      email: 'bob@techstartup.com',
      phone: '+33 6 87 65 43 21',
      adsCreated: 5,
      totalViews: 680,
      totalClicks: 78,
      revenue: '250€',
      joinedAt: '2024-01-05',
      status: 'active',
      performance: 'good',
    },
    {
      id: 3,
      name: 'Claire Leclerc',
      email: 'claire@techstartup.com',
      phone: '+33 6 56 78 90 12',
      adsCreated: 12,
      totalViews: 2150,
      totalClicks: 287,
      revenue: '825€',
      joinedAt: '2023-11-20',
      status: 'active',
      performance: 'excellent',
    },
    {
      id: 4,
      name: 'David Rousseau',
      email: 'david@techstartup.com',
      phone: '+33 6 34 56 78 90',
      adsCreated: 3,
      totalViews: 420,
      totalClicks: 42,
      revenue: '125€',
      joinedAt: '2024-01-10',
      status: 'inactive',
      performance: 'average',
    },
  ];

  const filteredCommercials = commercials.filter((commercial) =>
    commercial.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    commercial.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    totalCommercials: commercials.length,
    activeCommercials: commercials.filter((c) => c.status === 'active').length,
    totalAds: commercials.reduce((sum, c) => sum + c.adsCreated, 0),
    totalRevenue: commercials.reduce((sum, c) => sum + parseFloat(c.revenue), 0),
  };

  const handleDeleteClick = (commercialId) => {
    setSelectedCommercialId(commercialId);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    setShowDeleteModal(false);
    setSelectedCommercialId(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddCommercial = (e) => {
    e.preventDefault();
    setShowAddModal(false);
    setFormData({ name: '', email: '', phone: '', role: 'commercial' });
  };

  const getPerformanceColor = (performance) => {
    switch (performance) {
      case 'excellent':
        return 'bg-emerald-500/20 text-emerald-400';
      case 'good':
        return 'bg-purple-500/20 text-purple-400';
      case 'average':
        return 'bg-yellow-500/20 text-yellow-400';
      default:
        return 'bg-slate-700 text-slate-300';
    }
  };

  const getPerformanceLabel = (performance) => {
    switch (performance) {
      case 'excellent':
        return 'Excellent';
      case 'good':
        return 'Bon';
      case 'average':
        return 'Moyen';
      default:
        return 'N/A';
    }
  };

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <Header user={user} />

      {/* Agency Context Banner */}
      <div className="border-b border-gray-200 dark:border-slate-800">
        <div className="max-w-full px-8 py-4">
          <AgencyContextBanner
            agencyName={selectedAgency?.name}
            agencyId={selectedAgency?.id}
            spaceName={selectedAgency?.spaceName}
            onChangeClick={() => window.location.href = '/select-agency'}
          />
        </div>
      </div>

      <div className="flex flex-1">
        <AgencySidebar user={user} />

        <main className="flex-1">
          <div className={theme === 'dark' ? 'bg-slate-900/50 border-b border-slate-800' : 'bg-white border-b border-gray-200'}>
            <div className="max-w-7xl mx-auto px-8 py-12 flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-3">Équipe Commerciale</h1>
                <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}>
                  Gérez vos commerciaux et suivez leur performance
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transition"
              >
                <Plus className="w-5 h-5" />
                Ajouter commercial
              </button>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-8 py-16">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
              <div className={`rounded-lg border p-6 ${theme === 'dark' ? 'border-slate-700 bg-slate-900' : 'border-gray-200 bg-white'}`}>
                <p className={`text-sm font-bold mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>Total</p>
                <p className="text-3xl font-bold">{stats.totalCommercials}</p>
              </div>
              <div className={`rounded-lg border p-6 ${theme === 'dark' ? 'border-slate-700 bg-slate-900' : 'border-gray-200 bg-white'}`}>
                <p className={`text-sm font-bold mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>Actifs</p>
                <p className="text-3xl font-bold text-emerald-500">{stats.activeCommercials}</p>
              </div>
              <div className={`rounded-lg border p-6 ${theme === 'dark' ? 'border-slate-700 bg-slate-900' : 'border-gray-200 bg-white'}`}>
                <p className={`text-sm font-bold mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>Annonces</p>
                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{stats.totalAds}</p>
              </div>
              <div className={`rounded-lg border p-6 ${theme === 'dark' ? 'border-slate-700 bg-slate-900' : 'border-gray-200 bg-white'}`}>
                <p className={`text-sm font-bold mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>Revenu</p>
                <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{stats.totalRevenue.toFixed(0)}€</p>
              </div>
            </div>

            {/* Search */}
            <div className="mb-8">
              <div className="relative">
                <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${theme === 'dark' ? 'text-slate-500' : 'text-gray-400'}`} />
                <input
                  type="text"
                  placeholder="Rechercher par nom ou email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-12 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-600 ${theme === 'dark' ? 'border-slate-700 bg-slate-900 text-white' : 'border-gray-300 bg-white text-gray-900'}`}
                />
              </div>
            </div>

            {/* Commercials Grid */}
            {filteredCommercials.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredCommercials.map((commercial) => (
                  <div key={commercial.id} className={`rounded-lg border p-6 transition-all ${theme === 'dark' ? 'border-slate-700 bg-slate-900 hover:border-purple-600/50' : 'border-gray-200 bg-white hover:border-purple-300'}`}>
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                          {commercial.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">{commercial.name}</h3>
                          <div className="flex items-center gap-3 mt-2 text-sm">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>{commercial.email}</span>
                          </div>
                          <div className="flex items-center gap-3 mt-1 text-sm">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>{commercial.phone}</span>
                          </div>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${commercial.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-300'}`}>
                        {commercial.status === 'active' ? 'Actif' : 'Inactif'}
                      </span>
                    </div>

                    {/* Performance Badge */}
                    <div className={`mb-4 pb-4 border-b ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getPerformanceColor(commercial.performance)}`}>
                        <Award className="w-3 h-3" />
                        {getPerformanceLabel(commercial.performance)}
                      </span>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-3 mb-6 pb-6 border-b border-gray-200 dark:border-slate-700">
                      <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-slate-800' : 'bg-gray-50'}`}>
                        <p className={`text-xs font-bold mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Annonces</p>
                        <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{commercial.adsCreated}</p>
                      </div>
                      <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-slate-800' : 'bg-gray-50'}`}>
                        <p className={`text-xs font-bold mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Vues</p>
                        <p className="text-2xl font-bold">{commercial.totalViews}</p>
                      </div>
                      <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-slate-800' : 'bg-gray-50'}`}>
                        <p className={`text-xs font-bold mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Clics</p>
                        <p className="text-2xl font-bold text-pink-500">{commercial.totalClicks}</p>
                      </div>
                      <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-slate-800' : 'bg-gray-50'}`}>
                        <p className={`text-xs font-bold mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Revenu</p>
                        <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{commercial.revenue}</p>
                      </div>
                    </div>

                    {/* Info */}
                    <div className={`flex items-center justify-between text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-6`}>
                      <span>Depuis {new Date(commercial.joinedAt).toLocaleDateString('fr-FR')}</span>
                      <div className="flex items-center gap-1 text-emerald-500 font-bold">
                        <ArrowUpRight className="w-3 h-3" />
                        Tendance positive
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Link
                        href={`/agence/commerciaux/${commercial.id}`}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${theme === 'dark' ? 'border border-slate-700 text-gray-300 hover:bg-slate-800' : 'border border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                      >
                        <FileText className="w-4 h-4" />
                        Détails
                      </Link>
                      <button className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${theme === 'dark' ? 'border border-slate-700 text-gray-300 hover:bg-slate-800' : 'border border-gray-300 text-gray-700 hover:bg-gray-50'}`}>
                        <Edit2 className="w-4 h-4" />
                        Éditer
                      </button>
                      <button
                        onClick={() => handleDeleteClick(commercial.id)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition text-red-400 ${theme === 'dark' ? 'hover:bg-red-500/10' : 'hover:bg-red-50'}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={`rounded-lg border p-12 text-center ${theme === 'dark' ? 'border-slate-700 bg-slate-900' : 'border-gray-200 bg-white'}`}>
                <User className={`w-16 h-16 mx-auto mb-4 ${theme === 'dark' ? 'text-slate-700' : 'text-gray-300'}`} />
                <p className={`mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Aucun commercial trouvé</p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transition"
                >
                  <Plus className="w-5 h-5" />
                  Ajouter votre premier commercial
                </button>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className={`rounded-lg p-8 max-w-md w-full border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
            <h2 className="text-2xl font-bold mb-6">Ajouter un commercial</h2>
            <form onSubmit={handleAddCommercial} className="space-y-4">
              <div>
                <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Nom complet</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Jean Dupont"
                  className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-600 ${theme === 'dark' ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                  required
                />
              </div>
              <div>
                <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="jean@example.com"
                  className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-600 ${theme === 'dark' ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                  required
                />
              </div>
              <div>
                <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Téléphone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+33 6 12 34 56 78"
                  className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-600 ${theme === 'dark' ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                  required
                />
              </div>
              <div>
                <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Rôle</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-600 ${theme === 'dark' ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                >
                  <option value="commercial">Commercial</option>
                  <option value="manager">Manager</option>
                  <option value="coordinator">Coordinateur</option>
                </select>
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className={`flex-1 px-4 py-3 rounded-lg transition font-semibold ${theme === 'dark' ? 'border border-slate-600 text-gray-300 hover:bg-slate-700' : 'border border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold"
                >
                  Ajouter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className={`rounded-lg p-8 max-w-sm w-full border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
            <h2 className="text-2xl font-bold mb-4">Confirmer la suppression</h2>
            <p className={`mb-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Êtes-vous sûr de vouloir supprimer ce commercial? Cette action est irréversible.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className={`flex-1 px-4 py-3 rounded-lg transition font-semibold ${theme === 'dark' ? 'border border-slate-600 text-gray-300 hover:bg-slate-700' : 'border border-gray-300 text-gray-700 hover:bg-gray-50'}`}
              >
                Annuler
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

  
    </div>
  );
}
