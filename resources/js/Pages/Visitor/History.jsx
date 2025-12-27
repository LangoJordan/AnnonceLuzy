import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { route } from 'ziggy-js';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import { useThemeStore } from '../../store';
import {
  Clock,
  MapPin,
  Eye,
  Star,
  ArrowLeft,
  Trash2,
  Calendar,
} from 'lucide-react';

export default function History({ user, history: initialHistory }) {
  const { theme } = useThemeStore();
  const [sortBy, setSortBy] = useState('recent');
  const [history, setHistory] = useState(Array.isArray(initialHistory) ? initialHistory : []);

  const removeFromHistory = (id) => {
    router.delete(route('visitor.history.destroy', id), {
      onSuccess: () => {
        setHistory(history.filter((h) => h.id !== id));
      },
    });
  };

  const clearHistory = () => {
    router.post(route('visitor.history.clear'), {}, {
      onSuccess: () => {
        setHistory([]);
      },
    });
  };

  const sortedHistory = [...history].sort((a, b) => {
    if (sortBy === 'recent') return new Date(b.viewedAt) - new Date(a.viewedAt);
    if (sortBy === 'mostViewed') return b.viewCount - a.viewCount;
    return 0;
  });

  const HistoryCard = ({ item }) => (
    <div className={`group rounded-lg overflow-hidden border transition-all duration-300 ${theme === 'dark' ? 'bg-slate-800 hover:shadow-xl hover:shadow-purple-900/30 border-slate-700' : 'bg-white hover:shadow-xl hover:shadow-purple-200/30 border-gray-200'}`}>
      <div className={`relative h-40 overflow-hidden ${theme === 'dark' ? 'bg-slate-700' : 'bg-gray-200'}`}>
        {item.image ? (
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className={`w-full h-full flex items-center justify-center ${theme === 'dark' ? 'bg-slate-700' : 'bg-gray-300'}`}>
            <span className={`text-4xl ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`}>📷</span>
          </div>
        )}
        <div className={`absolute top-3 right-3 px-3 py-1 rounded text-xs font-bold flex items-center gap-1 text-white ${theme === 'dark' ? 'bg-cyan-700' : 'bg-cyan-500'}`}>
          <Clock className="w-3 h-3" />
          Vu {item.viewCount}x
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <span className="inline-block px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded text-xs font-bold">
            {item.category}
          </span>
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-bold">{item.rating}</span>
          </div>
        </div>

        <Link
          href={`/ads/${item.id}`}
          className={`font-bold text-base line-clamp-2 block mb-2 hover:text-purple-600 transition ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
        >
          {item.title}
        </Link>

        <div className={`flex items-center gap-1 text-xs mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{item.location}</span>
        </div>

        <div className={`flex items-center gap-1 text-xs mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{new Date(item.viewedAt).toLocaleDateString('fr-FR')}</span>
        </div>

        <div className={`flex items-center justify-between pt-3 border-t mb-4 ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
          <p className="text-lg font-bold text-purple-600">
            {item.price}
          </p>
          <div className={`flex items-center gap-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
            <Eye className="w-3 h-3" />
            <span className="text-xs">{item.views}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Link
            href={`/ads/${item.id}`}
            className="flex-1 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium text-xs text-center"
          >
            Voir détail
          </Link>
          <button
            onClick={() => removeFromHistory(item.id)}
            className={`flex-1 px-3 py-2 rounded-lg transition font-medium text-xs flex items-center justify-center gap-1 ${theme === 'dark' ? 'bg-slate-700 text-gray-300 hover:bg-red-900/30 hover:text-red-300' : 'bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-600'}`}
          >
            <Trash2 className="w-3.5 h-3.5" />
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className={theme === 'dark' ? 'bg-slate-900 text-white' : 'bg-gray-50 text-gray-900'}>
      <Head title="Mon Historique" />
      <Header user={user} />

      <main className="min-h-screen">
        {/* Header */}
        <section className={`${theme === 'dark' ? 'bg-gradient-to-b from-slate-800 to-slate-900' : 'bg-gradient-to-b from-cyan-50 to-gray-50'} py-12 px-4`}>
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <Link href="/dashboard" className={`inline-flex items-center font-bold group text-sm ${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition" />
                Dashboard
              </Link>
            </div>

            <div className="flex items-center justify-between flex-wrap gap-8">
              <div>
                <h1 className={`text-4xl sm:text-5xl font-black mb-3 flex items-center gap-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  <Clock className="w-10 h-10" />
                  Mon Historique
                </h1>
                <p className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Toutes les annonces que vous avez consultées
                </p>
              </div>
              <div className={`text-right ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                <p className={`text-4xl font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {history.length}
                </p>
                <p>Annonces consultées</p>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 py-12">
          {/* Controls */}
          {history.length > 0 && (
            <div className="mb-12 flex items-center justify-between flex-wrap gap-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={`px-6 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 font-bold text-sm ${theme === 'dark' ? 'bg-slate-800 border border-slate-700 text-white' : 'bg-white border border-gray-300 text-gray-900'}`}
              >
                <option value="recent">Plus récent</option>
                <option value="mostViewed">Plus consulté</option>
              </select>

              <button
                onClick={clearHistory}
                className={`px-6 py-2 rounded-lg transition font-bold flex items-center gap-2 text-sm ${theme === 'dark' ? 'border border-red-700 text-red-400 hover:bg-red-900/20' : 'border border-red-400 text-red-600 hover:bg-red-50'}`}
              >
                <Trash2 className="w-4 h-4" />
                Effacer l'historique
              </button>
            </div>
          )}

          {/* Results */}
          {sortedHistory.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedHistory.map((item) => (
                <HistoryCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className={`rounded-lg border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} p-16 text-center`}>
              <Clock className={`w-24 h-24 mx-auto mb-6 ${theme === 'dark' ? 'text-gray-700' : 'text-gray-300'}`} />
              <h3 className={`text-2xl font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Aucun historique
              </h3>
              <p className={`mb-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Vous n'avez pas encore consulté d'annonces
              </p>
              <Link
                href="/ads"
                className="inline-block px-8 py-3 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 transition transform hover:scale-105"
              >
                Parcourir les annonces
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
