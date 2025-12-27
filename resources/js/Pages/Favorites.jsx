import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import InteractiveCharacter from '../Components/InteractiveCharacter';
import { useThemeStore } from '../store';
import { Heart, Trash2, ArrowLeft, MapPin, Eye, Star, Sparkles, ArrowRight, Search } from 'lucide-react';

export default function Favorites({ user }) {
  const { theme } = useThemeStore();
  const [favorites, setFavorites] = useState([
    { id: 1, title: 'Développeur Full Stack React/Laravel', location: 'Paris', price: '45k-65k€', views: 342, image: 'https://images.unsplash.com/photo-1605379399642-870262d3d051?q=80&w=2106&auto=format&fit=crop', category: 'Emploi', rating: 4.8 },
    { id: 2, title: 'Responsable Marketing Digital', location: 'Lyon', price: '35k-50k€', views: 156, image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop', category: 'Emploi', rating: 4.6 },
    { id: 3, title: 'Consultant Business Intelligence', location: 'Toulouse', price: '40k-60k€', views: 89, image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop', category: 'Services', rating: 4.9 },
    { id: 4, title: 'Plombier Professionnel', location: 'Marseille', price: '50€-150€/h', views: 567, image: 'https://images.unsplash.com/photo-1607190591413-26ec84bc58a9?q=80&w=2070&auto=format&fit=crop', category: 'Services', rating: 4.7 },
  ]);

  const removeFavorite = (id) => {
    setFavorites(favorites.filter(fav => fav.id !== id));
  };

  return (
    <div className={theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-white text-gray-900'}>
      <Head title="Mes Favoris - LUZY" />
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
          <div className={`absolute top-1/2 right-1/3 w-80 h-80 rounded-full opacity-15 blur-3xl ${
            theme === 'dark' ? 'bg-pink-600' : 'bg-pink-400'
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
            <Heart className={`w-4 h-4 fill-current ${theme === 'dark' ? 'text-pink-400' : 'text-pink-600'}`} />
            <span className={`text-sm font-semibold ${theme === 'dark' ? 'text-purple-300' : 'text-purple-700'}`}>
              Vos favoris sélectionnés
            </span>
          </div>

          {/* Title */}
          <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-6 leading-tight ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Vos annonces
            <span className={`block bg-clip-text text-transparent ${
              theme === 'dark'
                ? 'bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400'
                : 'bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600'
            }`}>
              favorites
            </span>
          </h1>

          {/* Subtitle */}
          <p className={`max-w-3xl mx-auto text-lg sm:text-xl mb-10 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Retrouvez toutes les annonces que vous avez sauvegardées et suivez vos opportunités préférées.
          </p>

          {/* Favorites Count */}
          <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-full ${
            theme === 'dark'
              ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30'
              : 'bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-300'
          }`}>
            <Heart className="w-5 h-5 fill-current text-pink-600 dark:text-pink-400" />
            <span className="font-bold">{favorites.length} annonce{favorites.length !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </div>

      {/* FAVORITES SECTION */}
      <div className={`${theme === 'dark' ? 'bg-slate-950' : 'bg-gray-50'} py-12 sm:py-16`}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {favorites.length > 0 ? (
            <div>
              <p className={`text-sm font-semibold mb-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                <span className={`text-lg font-black ${theme === 'dark' ? 'text-pink-400' : 'text-pink-600'}`}>
                  {favorites.length}
                </span>
                <span> annonce{favorites.length !== 1 ? 's' : ''} sauvegardée{favorites.length !== 1 ? 's' : ''}</span>
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                {favorites.map((fav, index) => (
                  <Link
                    key={fav.id}
                    href={`/ads/${fav.id}`}
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
                          src={fav.image}
                          alt={fav.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        
                        {/* Overlay Gradient */}
                        <div className={`absolute inset-0 ${
                          theme === 'dark'
                            ? 'bg-gradient-to-t from-slate-900 via-transparent to-transparent'
                            : 'bg-gradient-to-t from-black/30 via-transparent to-transparent'
                        }`}></div>

                        {/* Favorite Badge */}
                        <div className="absolute top-4 left-4 px-3 py-1.5 bg-pink-500/80 backdrop-blur-md text-white rounded-full text-xs font-bold flex items-center gap-1">
                          <Heart className="w-3.5 h-3.5 fill-current" />
                          Favori
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            removeFavorite(fav.id);
                          }}
                          className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md transition-all duration-300 transform hover:scale-110 bg-red-500/80 text-white hover:bg-red-600/80 shadow-lg`}
                          aria-label="Supprimer des favoris"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>

                        {/* Views Badge */}
                        <div className={`absolute bottom-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-md ${
                          theme === 'dark'
                            ? 'bg-black/40 text-gray-200'
                            : 'bg-white/40 text-gray-900'
                        }`}>
                          <Eye className="w-3.5 h-3.5" />
                          <span>{fav.views}</span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className={`p-5 flex flex-col flex-1 ${
                        theme === 'dark' ? 'bg-gradient-to-b from-slate-800 to-slate-900' : 'bg-gradient-to-b from-white to-gray-50'
                      }`}>
                        {/* Category & Rating */}
                        <div className="flex items-center justify-between gap-3 mb-3">
                          <span className="px-3 py-1 rounded-lg text-xs font-bold bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/30 w-fit">
                            {fav.category}
                          </span>
                          {fav.rating && (
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                              <span className="text-xs font-bold">{fav.rating}</span>
                            </div>
                          )}
                        </div>

                        {/* Title */}
                        <h3 className={`font-bold text-base line-clamp-2 mb-3 group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors ${
                          theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                        }`}>
                          {fav.title}
                        </h3>

                        {/* Location */}
                        <div className={`flex items-center gap-2 text-sm mb-3 ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          <MapPin className="w-4 h-4 flex-shrink-0 text-purple-600 dark:text-purple-400" />
                          <span className="line-clamp-1">{fav.location}</span>
                        </div>

                        {/* Spacer */}
                        <div className="flex-1" />

                        {/* Price & Button */}
                        <div className={`flex items-center justify-between pt-4 border-t ${
                          theme === 'dark' ? 'border-slate-700' : 'border-gray-200'
                        }`}>
                          <p className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
                            {fav.price}
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
                <Heart className={`w-8 h-8 ${theme === 'dark' ? 'text-slate-600' : 'text-gray-400'}`} />
              </div>
              <p className={`text-lg font-bold mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                Aucune annonce en favori
              </p>
              <p className={`mb-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Parcourez nos annonces et ajoutez celles qui vous intéressent à vos favoris.
              </p>
              <Link
                href="/ads"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg transition font-bold hover:scale-105 transform"
              >
                <Search className="w-5 h-5" />
                Parcourir les annonces
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
