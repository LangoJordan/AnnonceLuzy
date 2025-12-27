import { useState } from 'react';
import Header from '../../Components/Header';
import AdminSidebar from './AdminSidebar';
import Footer from '../../Components/Footer';
import { useThemeStore } from '../../store';
import BoostPackageForm from '../../Components/Admin/BoostPackageForm';
import {
  Zap, Plus, Edit2, Trash2, Check, Flame, TrendingUp, ArrowRight
} from 'lucide-react';
import { router } from '@inertiajs/react';

export default function AdminBoostPackages({ packages, stats }) {
  const { theme } = useThemeStore();
  const [showForm, setShowForm] = useState(false);
  const [editingBoost, setEditingBoost] = useState(null);

  const boostColors = {
    1: { bg: theme === 'dark' ? 'bg-blue-500/20' : 'bg-blue-100', text: theme === 'dark' ? 'text-blue-400' : 'text-blue-700' },
    2: { bg: theme === 'dark' ? 'bg-purple-500/20' : 'bg-purple-100', text: theme === 'dark' ? 'text-purple-400' : 'text-purple-700' },
    3: { bg: theme === 'dark' ? 'bg-orange-500/20' : 'bg-orange-100', text: theme === 'dark' ? 'text-orange-400' : 'text-orange-700' },
  };

  const handleEditBoost = (boost) => {
    setEditingBoost(boost);
    setShowForm(true);
  };

  const handleCreateBoost = () => {
    setEditingBoost(null);
    setShowForm(true);
  };

  const handleFormSubmit = () => {
    router.get('/admin/packs-boost');
  };

  const handleDeleteBoost = (boostId) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce pack de boost ?')) {
      router.delete(`/admin/boosts/${boostId}/delete`, {
        onSuccess: () => {
          router.get('/admin/packs-boost');
        }
      });
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
            <div className="max-w-7xl mx-auto px-8 py-12 flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-3 flex items-center gap-3">
                  <Zap className="w-10 h-10 text-amber-600 dark:text-amber-400" />
                  Packs de Boost
                </h1>
                <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}>
                  Gérer les packages de boost de visibilité
                </p>
              </div>
              <button
                onClick={handleCreateBoost}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition ${
                  theme === 'dark'
                    ? 'bg-amber-600 hover:bg-amber-700 text-white'
                    : 'bg-amber-600 hover:bg-amber-700 text-white'
                }`}
              >
                <Plus className="w-5 h-5" />
                Nouveau Pack
              </button>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-8 py-16">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
              {[
                { label: 'Packs Totaux', value: stats?.total_packages || 0, icon: Zap },
                { label: 'Boosts Actifs', value: stats?.active_boosts || 0, icon: Flame },
                { label: 'Revenu', value: `XFA ${(stats?.total_revenue || 0).toLocaleString()}`, icon: TrendingUp },
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
                      <Icon className="w-4 h-4 text-amber-500" />
                    </div>
                    <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                      {stat.value}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Packages Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {packages?.map((pkg) => (
                <div
                  key={pkg.id}
                  className={`rounded-lg border overflow-hidden transition ${
                    theme === 'dark' ? 'border-slate-700 bg-slate-900 hover:bg-slate-800' : 'border-gray-200 bg-white hover:bg-gray-50'
                  }`}
                >
                  <div className={`${boostColors[pkg.priority_level]?.bg || boostColors[1]?.bg} p-4 border-b border-slate-700`}>
                    <div className="flex items-center justify-between">
                      <h3 className={`text-xl font-bold ${boostColors[pkg.priority_level]?.text || boostColors[1]?.text}`}>
                        {pkg.label}
                      </h3>
                      <Zap className={`w-6 h-6 ${boostColors[pkg.priority_level]?.text || boostColors[1]?.text}`} />
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="mb-6 pb-6 border-b border-slate-700">
                      <p className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                        XFA {(pkg.amount || 0).toLocaleString()}
                      </p>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        {pkg.duration_days} jour{pkg.duration_days > 1 ? 's' : ''}
                      </p>
                    </div>

                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className={`text-sm font-bold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                          Niveau de Boost
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${boostColors[pkg.priority_level]?.bg}`}>
                          {pkg.priority_level === 1 ? 'Bronze' : pkg.priority_level === 2 ? 'Argent' : 'Or'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className={`text-sm font-bold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                          Boosts Actifs
                        </span>
                        <span className={`text-lg font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                          {pkg.active_boosts || 0}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditBoost(pkg)}
                        className={`flex-1 px-4 py-2 rounded-lg border transition font-semibold text-sm ${
                          theme === 'dark'
                            ? 'border-slate-700 text-amber-400 hover:bg-slate-800'
                            : 'border-gray-300 text-amber-600 hover:bg-gray-100'
                        }`}
                      >
                        <Edit2 className="w-4 h-4 inline mr-2" />
                        Éditer
                      </button>
                      <button
                        onClick={() => handleDeleteBoost(pkg.id)}
                        className={`flex-1 px-4 py-2 rounded-lg border transition font-semibold text-sm ${
                          theme === 'dark'
                            ? 'border-red-500/30 text-red-400 hover:bg-red-500/10'
                            : 'border-red-300 text-red-600 hover:bg-red-100'
                        }`}
                      >
                        <Trash2 className="w-4 h-4 inline mr-2" />
                        Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      <Footer />

      {showForm && (
        <BoostPackageForm
          boost={editingBoost}
          onClose={() => setShowForm(false)}
          onSubmit={handleFormSubmit}
        />
      )}
    </div>
  );
}
