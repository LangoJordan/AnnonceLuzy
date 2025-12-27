import { useState } from 'react';
import { Link } from '@inertiajs/react';
import { useThemeStore } from '../../store';
import AgencyLayout from '../../Layouts/AgencyLayout';
import AgencyContextBanner from '../../Components/AgencyContextBanner';
import { Plus, Edit2, Trash2, Eye, Zap, Search, TrendingUp, Clock, MapPin, Download, ArrowUpRight } from 'lucide-react';

export default function AgencyAds({ user = {}, ads = [], stats = {}, selectedAgency = null, availableAgencies = [] }) {
  const { theme } = useThemeStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAdId, setSelectedAdId] = useState(null);

  const filteredAds = (Array.isArray(ads) ? ads : []).filter((ad) => {
    const matchesSearch = (ad.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (ad.location || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || ad.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleDeleteClick = (adId) => {
    setSelectedAdId(adId);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    setShowDeleteModal(false);
    setSelectedAdId(null);
  };

  return (
    <>
      {/* Agency Context Banner */}
      <div className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <AgencyContextBanner
            agencyName={selectedAgency?.name}
            agencyId={selectedAgency?.id}
            spaceName={selectedAgency?.spaceName}
            onChangeClick={() => window.location.href = '/select-agency'}
          />
        </div>
      </div>

      <div className={theme === 'dark' ? 'bg-slate-900/50 border-b border-slate-800' : 'bg-white border-b border-gray-200'}>
        <div className="max-w-7xl mx-auto px-8 py-12 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-3">Gestion des Annonces</h1>
            <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}>
              Créez, modifiez et boostez vos annonces
            </p>
          </div>
          <Link
            href="/agence/annonces/create"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transition"
          >
            <Plus className="w-5 h-5" />
            Nouvelle annonce
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-16">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-12">
          <div className={`rounded-lg border p-6 ${theme === 'dark' ? 'border-slate-700 bg-slate-900' : 'border-gray-200 bg-white'}`}>
            <p className={`text-sm font-bold mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>Total</p>
            <p className="text-3xl font-bold mb-1">{stats?.totalAds || 0}</p>
            <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>Annonces</p>
          </div>
          <div className={`rounded-lg border p-6 ${theme === 'dark' ? 'border-slate-700 bg-slate-900' : 'border-gray-200 bg-white'}`}>
            <p className={`text-sm font-bold mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>Actives</p>
            <p className="text-3xl font-bold text-emerald-500 mb-1">{stats?.activeAds || 0}</p>
            <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>En ligne</p>
          </div>
          <div className={`rounded-lg border p-6 ${theme === 'dark' ? 'border-slate-700 bg-slate-900' : 'border-gray-200 bg-white'}`}>
            <p className={`text-sm font-bold mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>Vues</p>
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">{stats?.totalViews || 0}</p>
            <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>Total</p>
          </div>
          <div className={`rounded-lg border p-6 ${theme === 'dark' ? 'border-slate-700 bg-slate-900' : 'border-gray-200 bg-white'}`}>
            <p className={`text-sm font-bold mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>Clics</p>
            <p className="text-3xl font-bold text-pink-500 mb-1">{stats?.totalClicks || 0}</p>
            <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>Total</p>
          </div>
          <div className={`rounded-lg border p-6 ${theme === 'dark' ? 'border-slate-700 bg-slate-900' : 'border-gray-200 bg-white'}`}>
            <p className={`text-sm font-bold mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>Revenu</p>
            <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-1">{stats?.totalRevenue || 'XFA 0,00'}</p>
            <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>Généré</p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 flex gap-4">
          <div className="flex-1 relative">
            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${theme === 'dark' ? 'text-slate-500' : 'text-gray-400'}`} />
            <input
              type="text"
              placeholder="Rechercher par titre ou localisation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-12 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-600 ${theme === 'dark' ? 'border-slate-700 bg-slate-900 text-white' : 'border-gray-300 bg-white text-gray-900'}`}
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className={`px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-600 ${theme === 'dark' ? 'border-slate-700 bg-slate-900 text-white' : 'border-gray-300 bg-white text-gray-900'}`}
          >
            <option value="all">Tous les statuts</option>
            <option value="active">Actives</option>
            <option value="archived">Archivées</option>
          </select>
        </div>

        {/* Ads Table */}
        <div className={`rounded-lg border overflow-hidden ${theme === 'dark' ? 'border-slate-700 bg-slate-900' : 'border-gray-200 bg-white'}`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
                  <th className={`text-left px-6 py-4 font-bold text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>Annonce</th>
                  <th className={`text-left px-6 py-4 font-bold text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>Statut</th>
                  <th className={`text-left px-6 py-4 font-bold text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>Vues</th>
                  <th className={`text-left px-6 py-4 font-bold text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>Clics</th>
                  <th className={`text-left px-6 py-4 font-bold text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>CTR</th>
                  <th className={`text-left px-6 py-4 font-bold text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>Revenu</th>
                  <th className={`text-left px-6 py-4 font-bold text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAds.length > 0 ? (
                  filteredAds.map((ad) => (
                    <tr key={ad.id} className={`border-b transition ${theme === 'dark' ? 'border-slate-700 hover:bg-slate-800/30' : 'border-gray-200 hover:bg-gray-50'}`}>
                      <td className={`px-6 py-4 font-bold max-w-xs truncate ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                        <div>
                          <p>{ad.title}</p>
                          <div className="flex items-center gap-3 text-xs mt-1">
                            <span className={`flex items-center gap-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                              <MapPin className="w-3 h-3" />
                              {ad.location}
                            </span>
                            <span className={`flex items-center gap-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                              <Clock className="w-3 h-3" />
                              {ad.createdAt}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${ad.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-300'}`}>
                            {ad.status === 'active' ? 'Active' : 'Archivée'}
                          </span>
                          {ad.boosted && (
                            <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-semibold flex items-center gap-1">
                              <Zap className="w-3 h-3" />
                              Boostée
                            </span>
                          )}
                        </div>
                      </td>
                      <td className={`px-6 py-4 font-bold flex items-center gap-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-800'}`}>
                        <Eye className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        {ad.views}
                      </td>
                      <td className={`px-6 py-4 font-bold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-800'}`}>
                        {ad.clicks}
                      </td>
                      <td className="px-6 py-4 font-bold text-purple-600 dark:text-purple-400">
                        {ad.ctr}
                      </td>
                      <td className="px-6 py-4 font-bold text-emerald-600 dark:text-emerald-400">
                        {ad.revenue}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <Link
                            href={`/agence/annonces/${ad.id}`}
                            className={`p-2 rounded transition ${theme === 'dark' ? 'hover:bg-slate-800' : 'hover:bg-gray-100'}`}
                            title="Voir les détails"
                          >
                            <Eye className="w-4 h-4 text-gray-400" />
                          </Link>
                          <Link
                            href={`/agence/annonces/${ad.id}/edit`}
                            className={`p-2 rounded transition ${theme === 'dark' ? 'hover:bg-slate-800' : 'hover:bg-gray-100'}`}
                            title="Éditer l'annonce"
                          >
                            <Edit2 className="w-4 h-4 text-gray-400" />
                          </Link>
                          <button
                            onClick={() => handleDeleteClick(ad.id)}
                            className={`p-2 rounded transition ${theme === 'dark' ? 'hover:bg-slate-800' : 'hover:bg-gray-100'}`}
                          >
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center">
                      <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        Aucune annonce trouvée
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className={`rounded-lg p-8 max-w-sm w-full border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
            <h2 className="text-2xl font-bold mb-4">Confirmer la suppression</h2>
            <p className={`mb-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Êtes-vous sûr de vouloir supprimer cette annonce? Cette action est irréversible.
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
    </>
  );
}

AgencyAds.layout = page => <AgencyLayout {...page.props}>{page}</AgencyLayout>;
