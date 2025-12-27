import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { route } from 'ziggy-js';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import { useThemeStore } from '../../store';
import {
  Heart,
  MapPin,
  Eye,
  Star,
  ArrowLeft,
  Trash2,
} from 'lucide-react';

export default function Favorites({ user, favorites: initialFavorites, categories }) {
  const { theme } = useThemeStore();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [favorites, setFavorites] = useState(Array.isArray(initialFavorites) ? initialFavorites : []);

  const removeFavorite = (id) => {
    router.delete(route('visitor.favorites.destroy', id), {
      onSuccess: () => {
        setFavorites(favorites.filter((f) => f.id !== id));
      },
    });
  };

  // Get subcategories for selected category
  const selectedCategoryData = categories?.find(cat => cat.id === selectedCategory);
  const availableSubcategories = selectedCategoryData?.subcategories || [];

  // Filter favorites
  const filteredFavorites = favorites.filter(f => {
    if (selectedCategory && f.categoryId !== selectedCategory) return false;
    if (selectedSubcategory && f.subcategoryId !== selectedSubcategory) return false;
    return true;
  });

  const handleCategoryChange = (categoryId) => {
    if (selectedCategory === categoryId) {
      setSelectedCategory(null);
      setSelectedSubcategory(null);
    } else {
      setSelectedCategory(categoryId);
      setSelectedSubcategory(null);
    }
  };

  const FavoriteCard = ({ favorite }) => (
    <div className={`group rounded-lg overflow-hidden border transition-all duration-300 ${theme === 'dark' ? 'bg-slate-800 hover:shadow-xl hover:shadow-purple-900/30 border-slate-700' : 'bg-white hover:shadow-xl hover:shadow-purple-200/30 border-gray-200'}`}>
      <div className={`relative h-40 overflow-hidden ${theme === 'dark' ? 'bg-slate-700' : 'bg-gray-200'}`}>
        {favorite.image ? (
          <img
            src={favorite.image}
            alt={favorite.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className={`w-full h-full flex items-center justify-center ${theme === 'dark' ? 'bg-slate-700' : 'bg-gray-300'}`}>
            <span className={`text-4xl ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`}>📷</span>
          </div>
        )}
        {favorite.badge && (
          <div className={`absolute top-3 right-3 px-3 py-1 rounded text-xs font-bold text-white ${theme === 'dark' ? 'bg-yellow-600' : 'bg-yellow-500'}`}>
            {favorite.badge}
          </div>
        )}
        <div className="absolute top-3 left-3 p-2 bg-red-500 text-white rounded-lg shadow-md">
          <Heart className="w-4 h-4 fill-current" />
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <span className="inline-block px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded text-xs font-bold">
            {favorite.category}
          </span>
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-bold">{favorite.rating}</span>
          </div>
        </div>

        <Link
          href={`/ads/${favorite.id}`}
          className={`font-bold text-base line-clamp-2 block mb-2 hover:text-purple-600 transition ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
        >
          {favorite.title}
        </Link>

        {favorite.subcategory && (
          <div className={`text-xs mb-2 font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            {favorite.subcategory}
          </div>
        )}

        <div className={`flex items-center gap-1 text-xs mb-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{favorite.location}</span>
        </div>

        <div className={`text-xs mb-4 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>
          {favorite.agency}
        </div>

        <div className={`flex items-center justify-between pt-3 border-t mb-4 ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
          <p className="text-lg font-bold text-purple-600">
            {favorite.price}
          </p>
          <div className={`flex items-center gap-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
            <Eye className="w-3 h-3" />
            <span className="text-xs">{favorite.views}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Link
            href={`/ads/${favorite.id}`}
            className="flex-1 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium text-xs text-center"
          >
            Voir détail
          </Link>
          <button
            onClick={() => removeFavorite(favorite.id)}
            className={`flex-1 px-3 py-2 rounded-lg transition font-medium text-xs flex items-center justify-center gap-1 ${theme === 'dark' ? 'bg-slate-700 text-gray-300 hover:bg-red-900/30 hover:text-red-300' : 'bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-600'}`}
          >
            <Trash2 className="w-3.5 h-3.5" />
            Retirer
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className={theme === 'dark' ? 'bg-slate-900 text-white' : 'bg-gray-50 text-gray-900'}>
      <Head title="Mes Favoris" />
      <Header user={user} />

      <main className="min-h-screen">
        {/* Header */}
        <section className={`${theme === 'dark' ? 'bg-gradient-to-b from-slate-800 to-slate-900' : 'bg-gradient-to-b from-red-50 to-gray-50'} py-12 px-4`}>
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
                  <Heart className="w-10 h-10 fill-red-500 text-red-500" />
                  Mes Favoris
                </h1>
                <p className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Retrouvez toutes vos annonces préférées
                </p>
              </div>
              <div className={`text-right ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                <p className={`text-4xl font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {filteredFavorites.length}
                </p>
                <p>Annonces sauvegardées</p>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 py-12">
          {/* Category and Subcategory Filters */}
          {categories && categories.length > 0 && (
            <div className="mb-12">
              <div className="mb-8">
                <h3 className={`text-lg font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Catégories
                </h3>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  <button
                    onClick={() => {
                      setSelectedCategory(null);
                      setSelectedSubcategory(null);
                    }}
                    className={`px-6 py-2 rounded-lg font-bold whitespace-nowrap transition text-sm ${
                      selectedCategory === null
                        ? 'bg-red-600 text-white'
                        : theme === 'dark'
                        ? 'bg-slate-800 text-gray-400 hover:bg-slate-700 hover:text-gray-300'
                        : 'bg-white text-gray-700 border border-gray-200 hover:border-red-300'
                    }`}
                  >
                    Toutes les catégories
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => handleCategoryChange(category.id)}
                      className={`px-6 py-2 rounded-lg font-bold whitespace-nowrap transition text-sm ${
                        selectedCategory === category.id
                          ? 'bg-red-600 text-white'
                          : theme === 'dark'
                          ? 'bg-slate-800 text-gray-400 hover:bg-slate-700 hover:text-gray-300'
                          : 'bg-white text-gray-700 border border-gray-200 hover:border-red-300'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subcategory Filters */}
              {selectedCategory && availableSubcategories.length > 0 && (
                <div>
                  <h3 className={`text-lg font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Sous-catégories
                  </h3>
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    <button
                      onClick={() => setSelectedSubcategory(null)}
                      className={`px-6 py-2 rounded-lg font-bold whitespace-nowrap transition text-sm ${
                        selectedSubcategory === null
                          ? 'bg-purple-600 text-white'
                          : theme === 'dark'
                          ? 'bg-slate-800 text-gray-400 hover:bg-slate-700 hover:text-gray-300'
                          : 'bg-white text-gray-700 border border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      Toutes
                    </button>
                    {availableSubcategories.map((subcategory) => (
                      <button
                        key={subcategory.id}
                        onClick={() => setSelectedSubcategory(subcategory.id)}
                        className={`px-6 py-2 rounded-lg font-bold whitespace-nowrap transition text-sm ${
                          selectedSubcategory === subcategory.id
                            ? 'bg-purple-600 text-white'
                            : theme === 'dark'
                            ? 'bg-slate-800 text-gray-400 hover:bg-slate-700 hover:text-gray-300'
                            : 'bg-white text-gray-700 border border-gray-200 hover:border-purple-300'
                        }`}
                      >
                        {subcategory.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Results */}
          {filteredFavorites.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFavorites.map((favorite) => (
                <FavoriteCard key={favorite.id} favorite={favorite} />
              ))}
            </div>
          ) : (
            <div className={`rounded-lg border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} p-16 text-center`}>
              <Heart className={`w-24 h-24 mx-auto mb-6 ${theme === 'dark' ? 'text-gray-700' : 'text-gray-300'}`} />
              <h3 className={`text-2xl font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {favorites.length === 0 ? 'Aucun favori' : 'Aucun résultat'}
              </h3>
              <p className={`mb-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {favorites.length === 0
                  ? 'Vous n\'avez pas encore ajouté d\'annonces à vos favoris'
                  : 'Aucune annonce ne correspond à vos critères de filtre'}
              </p>
              {favorites.length === 0 && (
                <Link
                  href="/ads"
                  className="inline-block px-8 py-3 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 transition transform hover:scale-105"
                >
                  Parcourir les annonces
                </Link>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
