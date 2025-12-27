import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import InteractiveCharacter from '../Components/InteractiveCharacter';
import { useThemeStore } from '../store';
import { Search as SearchIcon, MapPin, Eye, Heart, ArrowLeft, Frown, Sparkles, ArrowRight } from 'lucide-react';

export default function Search({ user, query = '' }) {
  const { theme } = useThemeStore();
  const [searchQuery, setSearchQuery] = useState(query);
  const [favorites, setFavorites] = useState([]);

  const allSearchResults = [
    { id: 1, title: 'Développeur Full Stack React/Laravel', category: 'Emploi', location: 'Paris', price: '45k-65k€', views: 342, image: 'https://images.unsplash.com/photo-1605379399642-870262d3d051?q=80&w=2106&auto=format&fit=crop', rating: 4.8 },
    { id: 2, title: 'Responsable Marketing Digital', category: 'Emploi', location: 'Lyon', price: '35k-50k€', views: 156, image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop', rating: 4.6 },
    { id: 3, title: 'Consultant Business Intelligence', category: 'Services', location: 'Toulouse', price: '40k-60k€', views: 89, image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop', rating: 4.9 },
    { id: 4, title: 'Développeur Python', category: 'Emploi', location: 'Bordeaux', price: '50k-70k€', views: 234, image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070&auto=format&fit=crop', rating: 4.7 },
    { id: 5, title: 'Appartement T3 centre ville', category: 'Immobilier', location: 'Marseille', price: '950€/mois', views: 500, image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=2070&auto=format&fit=crop', rating: 4.5 },
    { id: 6, title: 'Cours de Yoga en ligne', category: 'Formation', location: 'En ligne', price: '50€/mois', views: 120, image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=2070&auto=format&fit=crop', rating: 4.9 },
  ];

  const filteredResults = allSearchResults.filter(result =>
    result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    result.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    result.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFavorite = (id) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]);
  };

  return (
    <div className={theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-white text-gray-900'}>
      <Head title={`Recherche${searchQuery ? ` - ${searchQuery}` : ''} - LUZY`} />
      <Header user={user} />
      <InteractiveCharacter />

      {/* PREMIUM HERO SECTION */}
      <div className={`relative overflow-hidden py-16 sm:py-24 ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-slate-900 via-slate-950 to-slate-950'
          : 'bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50'
      }`}>
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className={`absolute top-0 right-0 w-96 h-96 rounded-full opacity-20 blur-3xl ${
            theme === 'dark' ? 'bg-purple-600' : 'bg-purple-400'
          }`}></div>
          <div className={`absolute bottom-0 left-0 w-96 h-96 rounded-full opacity-20 blur-3xl ${
            theme === 'dark' ? 'bg-blue-600' : 'bg-blue-300'
          }`}></div>
        </div>

        {/* Animated Grid Background */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[length:4rem_4rem]"></div>
        </div>

        {/* Gradient Overlay */}
        <div className={`absolute inset-0 ${
          theme === 'dark'
            ? 'bg-gradient-to-b from-slate-950/0 via-slate-950/50 to-slate-950'
            : 'bg-gradient-to-b from-white/0 via-white/30 to-white'
        }`}></div>

        <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center">
          {/* Header Badge */}
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm mb-8 border animate-fade-in-up ${
            theme === 'dark'
              ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/30'
              : 'bg-gradient-to-r from-purple-100 to-pink-100 border-purple-300'
          }`}>
            <Sparkles className={`w-4 h-4 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} />
            <span className={`text-sm font-semibold ${theme === 'dark' ? 'text-purple-300' : 'text-purple-700'}`}>
              Résultats de recherche
            </span>
          </div>

          {/* Title */}
          <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-6 leading-tight ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Trouvez ce que vous
            <span className={`block bg-clip-text text-transparent ${
              theme === 'dark'
                ? 'bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400'
                : 'bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600'
            }`}>
              cherchez
            </span>
          </h1>

          {/* Subtitle */}
          <p className={`max-w-3xl mx-auto text-lg sm:text-xl mb-10 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Explorez nos résultats et trouvez l'opportunité parfaite.
          </p>

          {/* Premium Search Bar */}
          <div className="max-w-4xl mx-auto">
            <div className="relative group">
              <div className={`absolute -inset-0.5 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition duration-300 ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600'
                  : 'bg-gradient-to-r from-purple-400 to-pink-400'
              }`}></div>
              <div className={`relative flex flex-col sm:flex-row gap-2 rounded-2xl shadow-2xl p-3 border backdrop-blur-sm ${
                theme === 'dark'
                  ? 'bg-slate-900/95 border-white/10'
                  : 'bg-white/95 border-gray-200'
              }`}>
                <div className="flex-1 relative">
                  <SearchIcon className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${
                    theme === 'dark' ? 'text-slate-400' : 'text-gray-400'
                  }`} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Titre, description, mot-clé..."
                    className={`w-full pl-12 pr-4 py-3.5 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base ${
                      theme === 'dark'
                        ? 'bg-transparent text-white placeholder-gray-500'
                        : 'bg-transparent text-gray-900 placeholder-gray-400'
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RESULTS SECTION */}
      <div className={`${theme === 'dark' ? 'bg-slate-950' : 'bg-gray-50'} py-12 sm:py-16`}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Results Header */}
          <div className="mb-8">
            <p className={`text-sm font-semibold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              <span className={`text-lg font-black ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`}>
                {filteredResults.length}
              </span>
              <span> résultat{filteredResults.length !== 1 ? 's' : ''}</span>
              {searchQuery && <span> pour "<span className={theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}>{searchQuery}</span>"</span>}
            </p>
          </div>

          {filteredResults.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
              {filteredResults.map((result, index) => (
                <Link
                  key={result.id}
                  href={`/ads/${result.id}`}
                  className="group h-full"
                  style={{ animation: `fadeInUp 0.6s ease-out ${index * 50}ms both` }}
                >
                  <div className={`rounded-2xl overflow-hidden transition-all duration-500 h-full flex flex-col hover:scale-105 transform ${
                    theme === 'dark'
                      ? 'bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 hover:border-purple-600/50 hover:shadow-2xl hover:shadow-purple-900/40'
                      : 'bg-gradient-to-br from-white to-gray-50 border border-gray-200 hover:border-purple-400 hover:shadow-2xl hover:shadow-purple-300/40'
                  }`}>
                    {/* Image Container */}
                    <div className="relative overflow-hidden bg-gradient-to-br from-slate-700 to-slate-800 h-48 group-hover:h-56 transition-all duration-500">
                      <img
                        src={result.image}
                        alt={result.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      
                      {/* Overlay Gradient */}
                      <div className={`absolute inset-0 ${
                        theme === 'dark'
                          ? 'bg-gradient-to-t from-slate-900 via-transparent to-transparent'
                          : 'bg-gradient-to-t from-black/30 via-transparent to-transparent'
                      }`}></div>

                      {/* Favorite Button */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          toggleFavorite(result.id);
                        }}
                        className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md transition-all duration-300 transform hover:scale-110 ${
                          favorites.includes(result.id)
                            ? theme === 'dark'
                              ? 'bg-pink-500/80 shadow-lg shadow-pink-600/30'
                              : 'bg-pink-500/80 shadow-lg shadow-pink-400/30'
                            : theme === 'dark'
                            ? 'bg-black/40 hover:bg-black/60'
                            : 'bg-white/40 hover:bg-white/60'
                        }`}
                      >
                        <Heart
                          className="w-5 h-5 transition-all duration-300"
                          fill={favorites.includes(result.id) ? 'white' : 'none'}
                          stroke={favorites.includes(result.id) ? 'none' : 'white'}
                        />
                      </button>

                      {/* Views Badge */}
                      <div className={`absolute bottom-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-md ${
                        theme === 'dark'
                          ? 'bg-black/40 text-gray-200'
                          : 'bg-white/40 text-gray-900'
                      }`}>
                        <Eye className="w-3.5 h-3.5" />
                        <span>{result.views}</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className={`p-5 flex flex-col flex-1 ${
                      theme === 'dark' ? 'bg-gradient-to-b from-slate-800 to-slate-900' : 'bg-gradient-to-b from-white to-gray-50'
                    }`}>
                      {/* Category */}
                      <span className="px-3 py-1 rounded-lg text-xs font-bold bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/30 w-fit mb-3">
                        {result.category}
                      </span>

                      {/* Title */}
                      <h3 className={`font-bold text-base line-clamp-2 mb-3 group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors ${
                        theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                      }`}>
                        {result.title}
                      </h3>

                      {/* Location */}
                      <div className={`flex items-center gap-2 text-sm mb-3 ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        <MapPin className="w-4 h-4 flex-shrink-0 text-purple-600 dark:text-purple-400" />
                        <span className="line-clamp-1">{result.location}</span>
                      </div>

                      {/* Spacer */}
                      <div className="flex-1" />

                      {/* Price & Button */}
                      <div className={`flex items-center justify-between pt-4 border-t ${
                        theme === 'dark' ? 'border-slate-700' : 'border-gray-200'
                      }`}>
                        <p className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
                          {result.price}
                        </p>
                        <div className="text-purple-600 dark:text-purple-400 font-bold group-hover:translate-x-1 transition-transform">
                          <ArrowRight className="w-5 h-5" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className={`text-center py-16 rounded-2xl border ${
              theme === 'dark'
                ? 'bg-slate-900/50 border-slate-800'
                : 'bg-white border-gray-200'
            }`}>
              <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                theme === 'dark' ? 'bg-slate-800' : 'bg-gray-200'
              }`}>
                <Frown className={`w-8 h-8 ${theme === 'dark' ? 'text-slate-600' : 'text-gray-400'}`} />
              </div>
              <p className={`text-lg font-bold mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                Aucun résultat trouvé
              </p>
              <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                Essayez d'autres mots-clés ou explorez toutes nos annonces.
              </p>
              <Link
                href="/ads"
                className="inline-flex items-center gap-2 px-6 py-3 mt-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg transition font-bold hover:scale-105 transform"
              >
                <SearchIcon className="w-5 h-5" />
                Parcourir toutes les annonces
              </Link>
            </div>
          )}
        </div>
      </div>

      <Footer />

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-fade-in {
          animation: fadeInUp 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}
