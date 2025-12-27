import { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import FavoriteButton from '../../Components/FavoriteButton';
import InteractiveCharacter from '../../Components/InteractiveCharacter';
import { useThemeStore } from '../../store';
import {
  Search,
  MapPin,
  Eye,
  Filter,
  Grid,
  List,
  X,
  Star,
  Clock,
  ArrowUpRight,
  Shield,
  Sparkles,
  TrendingUp,
  Zap,
} from 'lucide-react';

export default function AdsIndex({ user, query = '' }) {
  const [searchQuery, setSearchQuery] = useState(query);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [favoriteStates, setFavoriteStates] = useState({});
  const [activeFilters, setActiveFilters] = useState({
    category: 'all',
    location: 'all',
    priceMin: 0,
    priceMax: 1000000,
    verified: false,
    sortBy: 'recent'
  });
  const { theme } = useThemeStore();

  const categories = [
    { id: 'emploi', name: 'Emploi', count: 1234 },
    { id: 'immobilier', name: 'Immobilier', count: 2847 },
    { id: 'services', name: 'Services', count: 3456 },
    { id: 'formation', name: 'Formation', count: 892 },
    { id: 'vehicules', name: 'Véhicules', count: 5623 },
  ];

  const locations = [
    { id: 'all', name: 'Toutes les régions' },
    { id: 'paris', name: 'Île-de-France', count: 2341 },
    { id: 'lyon', name: 'Auvergne-Rhône-Alpes', count: 1876 },
    { id: 'marseille', name: 'Provence-Alpes', count: 1654 },
  ];

  const allListings = [
    { id: 1, title: 'Développeur Full Stack React/Laravel Senior', location: 'Paris', price: '65k-85k€', category: 'emploi', badge: 'Urgent', image: 'https://images.unsplash.com/photo-1605379399642-870262d3d051?q=80&w=2106&auto=format&fit=crop', views: 1234, date: 'Il y a 2 jours', rating: 4.8, verified: true },
    { id: 2, title: 'Villa d\'architecte avec piscine, vue mer', location: 'Nice', price: '1.2M €', category: 'immobilier', badge: 'Exclusif', image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2071&auto=format&fit=crop', views: 892, date: 'Il y a 5 jours', rating: 4.9, verified: true },
    { id: 3, title: 'Consultant SEO/SEA Expert Certifié Google', location: 'En ligne', price: 'Sur devis', category: 'services', badge: null, image: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?q=80&w=2070&auto=format&fit=crop', views: 567, date: 'Il y a 1 semaine', rating: 4.7, verified: false },
    { id: 4, title: 'Formation Complète UX/UI Design 2024', location: 'En ligne', price: '499€', category: 'formation', badge: 'Populaire', image: 'https://images.unsplash.com/photo-1587440871875-191322ee64b0?q=80&w=2071&auto=format&fit=crop', views: 2341, date: 'Il y a 3 jours', rating: 4.9, verified: true },
    { id: 5, title: 'Data Scientist Senior - Machine Learning', location: 'Lyon', price: '55k-70k€', category: 'emploi', badge: null, image: 'https://images.unsplash.com/photo-1526374965328-5f61d4dc18c5?q=80&w=2070&auto=format&fit=crop', views: 445, date: 'Il y a 1 jour', rating: 4.6, verified: true },
    { id: 6, title: 'Appartement T3 rénové, coeur de Bordeaux', location: 'Bordeaux', price: '450,000€', category: 'immobilier', badge: 'Nouveau', image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=2070&auto=format&fit=crop', views: 789, date: 'Aujourd\'hui', rating: 4.5, verified: false },
    { id: 7, title: 'Coach sportif personnel - Programmes sur mesure', location: 'À domicile', price: '60€/h', category: 'services', badge: null, image: 'https://images.unsplash.com/photo-1571019613454-1cb2f98b2d8b?q=80&w=2070&auto=format&fit=crop', views: 234, date: 'Il y a 4 jours', rating: 4.8, verified: true },
    { id: 8, title: 'Bootcamp Développement Web Full-Stack', location: 'Paris', price: '6500€', category: 'formation', badge: 'Intensif', image: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=2070&auto=format&fit=crop', views: 1567, date: 'Il y a 6 jours', rating: 4.7, verified: true },
  ];

  const handleFilterChange = (filterName, value) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const ListingCard = ({ listing }) => (
    <Link href={`/ads/${listing.id}`} className="group h-full">
      <div className={`group relative h-full rounded-xl overflow-hidden border transition-all duration-500 hover:scale-105 transform ${
        theme === 'dark'
          ? 'border-slate-700 bg-gradient-to-br from-slate-900 to-slate-800 hover:border-purple-600/50 hover:shadow-2xl hover:shadow-purple-900/40'
          : 'border-gray-200 bg-gradient-to-br from-white to-gray-50 hover:border-purple-300 hover:shadow-2xl hover:shadow-purple-200/40'
      }`}>
        {/* Image Container */}
        <div className="relative h-48 overflow-hidden bg-gray-300">
          <img 
            src={listing.image} 
            alt={listing.title} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
          />
          
          {/* Overlay gradient */}
          <div className={`absolute inset-0 ${
            theme === 'dark'
              ? 'bg-gradient-to-t from-slate-900 via-transparent to-transparent'
              : 'bg-gradient-to-t from-black/30 via-transparent to-transparent'
          }`}></div>
          
          {/* Badges Container */}
          <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2">
            {listing.badge && (
              <div className="px-3 py-1.5 bg-red-500/90 backdrop-blur-sm text-white rounded-lg text-xs font-bold animate-pulse">
                {listing.badge}
              </div>
            )}
            
            {listing.verified && (
              <div className="flex items-center gap-1 px-3 py-1.5 bg-emerald-500/90 backdrop-blur-sm text-white rounded-lg text-xs font-bold">
                <Shield className="w-3 h-3" />
                Vérifié
              </div>
            )}
          </div>

          {/* Favorite Button */}
          <div className="absolute bottom-3 right-3">
            <FavoriteButton
              adId={listing.id}
              initialIsFavorite={favoriteStates[listing.id] || false}
              showAnimation={true}
              onToggle={(isFav) => setFavoriteStates(prev => ({ ...prev, [listing.id]: isFav }))}
            />
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4 flex flex-col flex-1">
          {/* Category Badge */}
          <div className={`inline-block px-3 py-1 rounded-lg text-xs font-bold mb-3 w-fit bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/30`}>
            {listing.category}
          </div>
          
          {/* Title */}
          <h3 className={`font-bold text-sm line-clamp-2 mb-3 group-hover:text-purple-600 dark:group-hover:text-purple-300 transition ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            {listing.title}
          </h3>

          {/* Price */}
          <p className="text-lg font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
            {listing.price}
          </p>

          {/* Info Section */}
          <div className="space-y-2 mb-4 text-xs flex-1">
            <div className={`flex items-center gap-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-purple-600 dark:text-purple-400" />
              <span className="line-clamp-1">{listing.location}</span>
            </div>
            <div className={`flex items-center gap-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              <Clock className="w-3.5 h-3.5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
              <span>{listing.date}</span>
            </div>
          </div>

          {/* Footer Section */}
          <div className={`flex items-center justify-between pt-3 border-t ${
            theme === 'dark' ? 'border-slate-700' : 'border-gray-200'
          }`}>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span className="text-xs font-bold">{listing.rating}</span>
              <span className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>({listing.views})</span>
            </div>
            <div className="text-purple-600 dark:text-purple-400 font-bold text-xs group-hover:translate-x-1 transition transform">
              Voir →
            </div>
          </div>
        </div>
      </div>
    </Link>
  );

  return (
    <div className={theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-white text-gray-900'}>
      <Header user={user} />
      <InteractiveCharacter />

      <main>
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
            <div className={`absolute top-1/2 right-1/4 w-80 h-80 rounded-full opacity-15 blur-3xl ${
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

          <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            {/* Header Badge */}
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm mb-8 border animate-fade-in ${
              theme === 'dark'
                ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/30'
                : 'bg-gradient-to-r from-purple-100 to-pink-100 border-purple-300'
            }`}>
              <Sparkles className={`w-4 h-4 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} />
              <span className={`text-sm font-semibold ${theme === 'dark' ? 'text-purple-300' : 'text-purple-700'}`}>
                Explorez les meilleures opportunités
              </span>
            </div>

            {/* Title */}
            <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-6 leading-tight ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Parcourez les
              <span className={`block bg-clip-text text-transparent ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400'
                  : 'bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600'
              }`}>
                meilleures annonces
              </span>
            </h1>

            {/* Subtitle */}
            <p className={`max-w-3xl text-lg sm:text-xl mb-8 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Découvrez des opportunités vérifiées dans toutes les catégories. Filtrez, recherchez et connectez-vous avec les meilleures agences.
            </p>

            {/* Enhanced Search Bar */}
            <div className="max-w-4xl">
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
                    <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${
                      theme === 'dark' ? 'text-slate-400' : 'text-gray-400'
                    }`} />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Développeur React, apartment Paris..."
                      className={`w-full pl-12 pr-4 py-3.5 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base ${
                        theme === 'dark'
                          ? 'bg-transparent text-white placeholder-gray-500'
                          : 'bg-transparent text-gray-900 placeholder-gray-400'
                      }`}
                    />
                  </div>
                  <Link
                    href={searchQuery ? `/search?q=${searchQuery}` : '/ads'}
                    className="px-8 py-3.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg transition font-bold flex items-center justify-center gap-2 whitespace-nowrap hover:scale-105 transform text-sm sm:text-base hover:shadow-pink-400/30"
                  >
                    <Search className="w-5 h-5" />
                    <span>Chercher</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className={`${theme === 'dark' ? 'bg-slate-950' : 'bg-gray-50'} py-12 sm:py-16`}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex gap-8">
              {/* Filters Sidebar */}
              <aside className={`w-80 ${showMobileFilters ? 'block' : 'hidden'} sm:block`}>
                <div className={`rounded-xl border p-6 sticky top-24 transition-all duration-300 ${
                  theme === 'dark'
                    ? 'border-slate-700 bg-gradient-to-br from-slate-900 to-slate-800 hover:shadow-2xl hover:shadow-purple-900/20'
                    : 'border-gray-200 bg-gradient-to-br from-white to-gray-50 hover:shadow-2xl hover:shadow-purple-200/20'
                }`}>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-bold text-lg flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      Filtrer
                    </h2>
                    <button onClick={() => setShowMobileFilters(false)} className="sm:hidden">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Category Filter */}
                  <div className="mb-6 pb-6 border-b border-gray-200 dark:border-slate-700">
                    <h3 className="font-bold mb-4">Catégorie</h3>
                    <div className="space-y-2">
                      <label className={`flex items-center gap-3 p-2 rounded cursor-pointer transition ${
                        theme === 'dark' ? 'hover:bg-slate-700/50' : 'hover:bg-purple-50'
                      }`}>
                        <input
                          type="radio"
                          name="category"
                          value="all"
                          checked={activeFilters.category === 'all'}
                          onChange={(e) => handleFilterChange('category', e.target.value)}
                          className="w-4 h-4 accent-purple-600"
                        />
                        <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>Toutes</span>
                      </label>
                      {categories.map(cat => (
                        <label key={cat.id} className={`flex items-center gap-3 p-2 rounded cursor-pointer transition ${
                          theme === 'dark' ? 'hover:bg-slate-700/50' : 'hover:bg-purple-50'
                        }`}>
                          <input
                            type="radio"
                            name="category"
                            value={cat.id}
                            checked={activeFilters.category === cat.id}
                            onChange={(e) => handleFilterChange('category', e.target.value)}
                            className="w-4 h-4 accent-purple-600"
                          />
                          <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>{cat.name}</span>
                          <span className={`ml-auto text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                            {cat.count}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Location Filter */}
                  <div className="mb-6 pb-6 border-b border-gray-200 dark:border-slate-700">
                    <h3 className="font-bold mb-4">Localisation</h3>
                    <div className="space-y-2">
                      {locations.map(loc => (
                        <label key={loc.id} className={`flex items-center gap-3 p-2 rounded cursor-pointer transition ${
                          theme === 'dark' ? 'hover:bg-slate-700/50' : 'hover:bg-purple-50'
                        }`}>
                          <input
                            type="radio"
                            name="location"
                            value={loc.id}
                            checked={activeFilters.location === loc.id}
                            onChange={(e) => handleFilterChange('location', e.target.value)}
                            className="w-4 h-4 accent-purple-600"
                          />
                          <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>{loc.name}</span>
                          {loc.count && (
                            <span className={`ml-auto text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                              {loc.count}
                            </span>
                          )}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Sort */}
                  <div>
                    <h3 className="font-bold mb-4">Trier par</h3>
                    <select
                      value={activeFilters.sortBy}
                      onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                      className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-600 transition ${
                        theme === 'dark'
                          ? 'bg-slate-800 border-slate-700 text-white hover:border-purple-600/50'
                          : 'bg-white border-gray-300 text-gray-900 hover:border-purple-400'
                      }`}
                    >
                      <option value="recent">Plus récent</option>
                      <option value="popular">Plus populaire</option>
                      <option value="rating">Meilleure note</option>
                      <option value="price_asc">Prix croissant</option>
                      <option value="price_desc">Prix décroissant</option>
                    </select>
                  </div>
                </div>
              </aside>

              {/* Content Area */}
              <div className="flex-1">
                {/* Top Control Bar */}
                <div className={`rounded-xl border p-4 mb-6 flex items-center justify-between transition-all duration-300 ${
                  theme === 'dark'
                    ? 'border-slate-700 bg-gradient-to-r from-slate-900 to-slate-800 hover:shadow-lg hover:shadow-purple-900/20'
                    : 'border-gray-200 bg-gradient-to-r from-white to-gray-50 hover:shadow-lg hover:shadow-purple-200/20'
                }`}>
                  <div className={`flex items-center gap-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    <Zap className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span className="font-medium">{allListings.length} annonces trouvées</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-lg transition ${
                        viewMode === 'grid'
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                          : theme === 'dark'
                          ? 'bg-slate-800 text-gray-400 hover:bg-slate-700'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <Grid className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-lg transition ${
                        viewMode === 'list'
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                          : theme === 'dark'
                          ? 'bg-slate-800 text-gray-400 hover:bg-slate-700'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <List className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setShowMobileFilters(!showMobileFilters)}
                      className={`sm:hidden p-2 rounded-lg transition ${
                        theme === 'dark'
                          ? 'bg-slate-800 text-gray-400 hover:bg-slate-700'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <Filter className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Listings Grid/List */}
                <div>
                  {viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                      {allListings.map((listing, index) => (
                        <div key={listing.id} style={{ animationDelay: `${index * 50}ms` }} className="animate-fade-in">
                          <ListingCard listing={listing} />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4 animate-fade-in">
                      {allListings.map((listing) => (
                        <Link key={listing.id} href={`/ads/${listing.id}`} className={`group flex gap-4 p-4 rounded-xl border transition-all duration-300 hover:scale-102 ${
                          theme === 'dark'
                            ? 'border-slate-700 bg-gradient-to-r from-slate-900 to-slate-800 hover:border-purple-600/50 hover:shadow-2xl hover:shadow-purple-900/40'
                            : 'border-gray-200 bg-gradient-to-r from-white to-gray-50 hover:border-purple-300 hover:shadow-2xl hover:shadow-purple-200/40'
                        }`}>
                          <div className="relative w-32 h-28 rounded-lg overflow-hidden flex-shrink-0 bg-gray-300">
                            <img src={listing.image} alt={listing.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            {listing.badge && (
                              <div className="absolute top-2 right-2 px-2 py-1 bg-red-500/90 text-white rounded text-xs font-bold">
                                {listing.badge}
                              </div>
                            )}
                          </div>
                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              <div className="inline-block px-3 py-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-700 dark:text-purple-300 rounded text-xs font-bold mb-2 border border-purple-500/30">
                                {listing.category}
                              </div>
                              <h3 className={`font-bold text-sm line-clamp-2 mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-300 transition ${
                                theme === 'dark' ? 'text-white' : 'text-gray-900'
                              }`}>
                                {listing.title}
                              </h3>
                              <p className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 mb-2">
                                {listing.price}
                              </p>
                              <div className={`flex gap-4 text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                                  {listing.location}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Eye className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                                  {listing.views}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                                  {listing.date}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-slate-700">
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                <span className="text-xs font-bold">{listing.rating}</span>
                              </div>
                              <div onClick={(e) => e.preventDefault()}>
                                <FavoriteButton
                                  adId={listing.id}
                                  initialIsFavorite={favoriteStates[listing.id] || false}
                                  showAnimation={true}
                                  onToggle={(isFav) => setFavoriteStates(prev => ({ ...prev, [listing.id]: isFav }))}
                                />
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* CSS Animations */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.6s ease-out forwards;
          opacity: 0;
        }

        @keyframes scale102 {
          from {
            transform: scale(1);
          }
          to {
            transform: scale(1.02);
          }
        }

        .hover\:scale-102:hover {
          animation: scale102 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
