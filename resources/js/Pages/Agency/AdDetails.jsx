import { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import Header from '../../Components/Header';
import AgencySidebar from './AgencySidebar';
import { useThemeStore } from '../../store';
import {
  ArrowLeft,
  Edit2,
  Trash2,
  Eye,
  MousePointerClick,
  MessageSquare,
  Share2,
  Clock,
  MapPin,
  Tag,
  DollarSign,
  Calendar,
  Zap,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Image as ImageIcon,
} from 'lucide-react';

export default function AdDetails({ user = {}, ad = null, features = [] }) {
  const { theme } = useThemeStore();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  if (!ad) {
    return (
      <div className={`flex h-screen flex-col ${theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-white text-gray-900'}`}>
        <Header user={user} />
        <div className="flex flex-1 overflow-hidden">
          <AgencySidebar user={user} />
          <main className="flex-1 overflow-y-auto flex items-center justify-center">
            <div className={`rounded-lg p-8 text-center ${theme === 'dark' ? 'bg-slate-900' : 'bg-white'}`}>
              <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                Annonce non trouvée
              </p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const stats = [
    { label: 'Vues', value: ad.views, icon: Eye, color: 'purple' },
    { label: 'Clics', value: ad.clicks, icon: MousePointerClick, color: 'blue' },
    { label: 'Demandes', value: ad.contacts, icon: MessageSquare, color: 'emerald' },
  ];

  const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className={`rounded-lg border-2 p-6 ${theme === 'dark' ? 'border-slate-700 bg-slate-900' : 'border-gray-200 bg-white'}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className={`text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            {label}
          </p>
          <p className={`text-3xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
            {value.toLocaleString()}
          </p>
        </div>
        <div className={`p-3 rounded-lg ${
          color === 'purple' ? (theme === 'dark' ? 'bg-slate-800' : 'bg-purple-100') :
          color === 'blue' ? (theme === 'dark' ? 'bg-slate-800' : 'bg-blue-100') :
          (theme === 'dark' ? 'bg-slate-800' : 'bg-emerald-100')
        }`}>
          <Icon className={`w-6 h-6 ${
            color === 'purple' ? 'text-purple-600' :
            color === 'blue' ? 'text-blue-600' :
            'text-emerald-600'
          }`} />
        </div>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <Header user={user} />

      <div className="flex flex-1">
        <AgencySidebar user={user} />

        <main className="flex-1">
          {/* Header */}
          <div className={theme === 'dark' ? 'bg-slate-900/50 border-b border-slate-800' : 'bg-white border-b border-gray-200'}>
            <div className="max-w-6xl mx-auto px-8 py-8">
              <Link
                href="/agence/annonces"
                className={`inline-flex items-center gap-2 mb-6 font-bold transition ${theme === 'dark' ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-700'}`}
              >
                <ArrowLeft className="w-4 h-4" />
                Retour aux annonces
              </Link>

              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                      {ad.title}
                    </h1>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      ad.status === 'active'
                        ? theme === 'dark' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-emerald-100 text-emerald-700'
                        : theme === 'dark' ? 'bg-red-500/20 text-red-300' : 'bg-red-100 text-red-700'
                    }`}>
                      {ad.status === 'active' ? 'Actif' : 'Inactif'}
                    </span>
                  </div>
                  <div className={`flex items-center gap-4 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    <span className="flex items-center gap-1">
                      <Tag className="w-4 h-4" />
                      {ad.category} - {ad.subcategory}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {ad.city}, {ad.country}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(ad.created_at).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link
                    href={`/agence/annonces/${ad.id}/boost`}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg font-bold bg-amber-600 text-white hover:bg-amber-700 transition"
                  >
                    <Zap className="w-4 h-4" />
                    Booster
                  </Link>
                  <Link
                    href={`/agence/annonces/${ad.id}/edit`}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg font-bold bg-blue-600 text-white hover:bg-blue-700 transition"
                  >
                    <Edit2 className="w-4 h-4" />
                    Éditer
                  </Link>
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg font-bold bg-red-600 text-white hover:bg-red-700 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-6xl mx-auto px-8 py-12">
            {/* Status Indicators */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {ad.featured && (
                <div className={`rounded-lg border-2 p-4 flex items-center gap-3 ${theme === 'dark' ? 'border-purple-500/30 bg-purple-500/10' : 'border-purple-300 bg-purple-50'}`}>
                  <CheckCircle className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className={`font-bold text-sm ${theme === 'dark' ? 'text-purple-300' : 'text-purple-700'}`}>Annonce mise en avant</p>
                    <p className={`text-xs ${theme === 'dark' ? 'text-purple-400/70' : 'text-purple-600/70'}`}>Visibilité renforcée</p>
                  </div>
                </div>
              )}
              {ad.boosted && (
                <div className={`rounded-lg border-2 p-4 flex items-center gap-3 ${theme === 'dark' ? 'border-amber-500/30 bg-amber-500/10' : 'border-amber-300 bg-amber-50'}`}>
                  <Zap className="w-5 h-5 text-amber-600" />
                  <div>
                    <p className={`font-bold text-sm ${theme === 'dark' ? 'text-amber-300' : 'text-amber-700'}`}>Annonce boostée</p>
                    <p className={`text-xs ${theme === 'dark' ? 'text-amber-400/70' : 'text-amber-600/70'}`}>Jusqu'au {new Date(ad.boost_until).toLocaleDateString('fr-FR')}</p>
                  </div>
                </div>
              )}
              <div className={`rounded-lg border-2 p-4 flex items-center gap-3 ${theme === 'dark' ? 'border-blue-500/30 bg-blue-500/10' : 'border-blue-300 bg-blue-50'}`}>
                <Clock className="w-5 h-5 text-blue-600" />
                <div>
                  <p className={`font-bold text-sm ${theme === 'dark' ? 'text-blue-300' : 'text-blue-700'}`}>Expire le</p>
                  <p className={`text-xs ${theme === 'dark' ? 'text-blue-400/70' : 'text-blue-600/70'}`}>{new Date(ad.expiry_date).toLocaleDateString('fr-FR')}</p>
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="mb-12">
              <h2 className={`text-2xl font-bold mb-6 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                Statistiques
              </h2>
              <div className="grid grid-cols-3 gap-6">
                {stats.map((stat, idx) => (
                  <StatCard
                    key={idx}
                    icon={stat.icon}
                    label={stat.label}
                    value={stat.value}
                    color={stat.color}
                  />
                ))}
              </div>
            </div>

            {/* Photo */}
            <div className="mb-12">
              <h2 className={`text-2xl font-bold mb-6 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                Photos
              </h2>
              <div className={`rounded-lg border-2 overflow-hidden mb-6 ${theme === 'dark' ? 'border-slate-700 bg-slate-900' : 'border-gray-200 bg-white'}`}>
                <img src={ad.main_photo} alt={ad.title} className="w-full h-96 object-cover" />
                <div className={`p-6 border-t ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
                  <p className={`text-sm font-bold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Photo principale
                  </p>
                </div>
              </div>

              {features && features.length > 0 && (
                <div>
                  <h3 className={`text-lg font-bold mb-4 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                    Photos de facettes ({features.length})
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    {features.map((feature, index) => (
                      <div
                        key={feature.id || index}
                        className={`rounded-lg border-2 overflow-hidden ${theme === 'dark' ? 'border-slate-700 bg-slate-900' : 'border-gray-200 bg-white'}`}
                      >
                        <img
                          src={feature.photo}
                          alt={feature.label || `Facette ${index + 1}`}
                          className="w-full h-40 object-cover"
                        />
                        <div className={`p-4 border-t ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
                          <p className={`text-sm font-bold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                            {feature.label || `Facette ${index + 1}`}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="mb-12">
              <h2 className={`text-2xl font-bold mb-6 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                Description
              </h2>
              <div className={`rounded-lg border-2 p-6 ${theme === 'dark' ? 'border-slate-700 bg-slate-900' : 'border-gray-200 bg-white'}`}>
                <p className={`whitespace-pre-line ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                  {ad.description}
                </p>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-6 mb-12">
              <div className={`rounded-lg border-2 p-6 ${theme === 'dark' ? 'border-slate-700 bg-slate-900' : 'border-gray-200 bg-white'}`}>
                <h3 className={`text-lg font-bold mb-6 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                  Localisation
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className={`text-sm font-bold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Pays</p>
                    <p className={`text-lg font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>{ad.country}</p>
                  </div>
                  <div>
                    <p className={`text-sm font-bold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Ville</p>
                    <p className={`text-lg font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>{ad.city}</p>
                  </div>
                  <div>
                    <p className={`text-sm font-bold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Adresse</p>
                    <p className={`text-lg font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>{ad.address}</p>
                  </div>
                </div>
              </div>

              <div className={`rounded-lg border-2 p-6 ${theme === 'dark' ? 'border-slate-700 bg-slate-900' : 'border-gray-200 bg-white'}`}>
                <h3 className={`text-lg font-bold mb-6 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                  Tarification & Contact
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className={`text-sm font-bold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Prix</p>
                    <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                      {ad.price.toLocaleString()} XFA {ad.price_description}
                    </p>
                  </div>
                  <div>
                    <p className={`text-sm font-bold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Téléphone</p>
                    <p className={`text-lg font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>{ad.contact_phone}</p>
                  </div>
                  <div>
                    <p className={`text-sm font-bold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Email</p>
                    <p className={`text-lg font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>{ad.contact_email}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Meta Information */}
            <div className={`rounded-lg border-2 p-6 ${theme === 'dark' ? 'border-slate-700 bg-slate-900' : 'border-gray-200 bg-white'}`}>
              <h3 className={`text-lg font-bold mb-6 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                Informations
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className={`text-sm font-bold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Espace commercial</p>
                  <p className={`text-lg font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>{ad.space.name}</p>
                </div>
                <div>
                  <p className={`text-sm font-bold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Créée le</p>
                  <p className={`text-lg font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>{new Date(ad.created_at).toLocaleDateString('fr-FR')}</p>
                </div>
                <div>
                  <p className={`text-sm font-bold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Publiée le</p>
                  <p className={`text-lg font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>{new Date(ad.published_at).toLocaleDateString('fr-FR')}</p>
                </div>
                <div>
                  <p className={`text-sm font-bold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Dernière modification</p>
                  <p className={`text-lg font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>{new Date(ad.updated_at).toLocaleDateString('fr-FR')}</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className={`rounded-lg p-8 max-w-md ${theme === 'dark' ? 'bg-slate-900 text-white' : 'bg-white text-gray-900'}`}>
            <div className="flex items-center gap-4 mb-6">
              <AlertCircle className="w-8 h-8 text-red-600" />
              <h3 className="text-xl font-bold">Supprimer l'annonce?</h3>
            </div>
            <p className={`mb-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Cette action ne peut pas être annulée. L'annonce et toutes ses données seront définitivement supprimées.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className={`flex-1 py-2 rounded-lg font-bold border transition ${theme === 'dark' ? 'border-slate-700 bg-slate-800 hover:bg-slate-700' : 'border-gray-300 bg-white hover:bg-gray-100'}`}
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  router.delete(route('agency.ad-delete', ad.id), {
                    onSuccess: () => {
                      router.visit(route('agency.ads'));
                    },
                  });
                }}
                className="flex-1 py-2 rounded-lg font-bold bg-red-600 text-white hover:bg-red-700 transition"
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
