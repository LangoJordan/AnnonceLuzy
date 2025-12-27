import { useState, useEffect, useMemo } from 'react';
import { Link, router } from '@inertiajs/react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import InteractiveCharacter from '../Components/InteractiveCharacter';
import { useThemeStore } from '../store';
import {
  Search,
  MapPin,
  Heart,
  Eye,
  ChevronDown,
  ArrowRight,
  Filter,
  X,
  Star,
  Zap,
  TrendingUp,
  Clock,
  DollarSign,
  Shield,
  Sparkles,
  ArrowUp,
} from 'lucide-react';

export default function Ads({ user, ads: initialAds = [], pagination = {}, filters: initialFilters = {}, categories = [], countries = [], cities: initialCities = [] }) {
  const { theme } = useThemeStore();
  const [searchQuery, setSearchQuery] = useState(initialFilters.query || '');
  const [selectedCategory, setSelectedCategory] = useState(initialFilters.category_id || null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(initialFilters.subcategory_id || null);
  const [selectedCountry, setSelectedCountry] = useState(initialFilters.country_id || null);
  const [selectedCity, setSelectedCity] = useState(initialFilters.city_id || null);
  const [addressFilter, setAddressFilter] = useState(initialFilters.address || '');
  const [sortBy, setSortBy] = useState(initialFilters.sort || 'relevance');
  const [currentPage, setCurrentPage] = useState(initialFilters.page || 1);
  const [favorites, setFavorites] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [availableCities, setAvailableCities] = useState(initialCities);
  const [expandedFilters, setExpandedFilters] = useState({});

  // Get subcategories for selected category
  const subcategories = useMemo(() => {
    if (!selectedCategory) return [];
    const category = categories.find(c => c.id === selectedCategory);
    return category?.subcategories || [];
  }, [selectedCategory, categories]);

  // Handle search and filter changes
  useEffect(() => {
    setIsLoading(true);
    const params = new URLSearchParams();

    if (searchQuery) params.append('q', searchQuery);
    if (selectedCategory) params.append('category_id', selectedCategory);
    if (selectedSubcategory) params.append('subcategory_id', selectedSubcategory);
    if (selectedCountry) params.append('country_id', selectedCountry);
    if (selectedCity) params.append('city_id', selectedCity);
    if (addressFilter) params.append('address', addressFilter);
    if (sortBy !== 'relevance') params.append('sort', sortBy);
    if (currentPage > 1) params.append('page', currentPage);

    router.visit(`/ads?${params.toString()}`, {
      preserveState: true,
      onSuccess: () => setIsLoading(false),
    });
  }, [searchQuery, selectedCategory, selectedSubcategory, selectedCountry, selectedCity, addressFilter, sortBy, currentPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
    if (selectedSubcategory && !subcategories.find(s => s.id === selectedSubcategory)) {
      setSelectedSubcategory(null);
    }
  }, [searchQuery, selectedCategory]);

  // Update available cities when country changes
  useEffect(() => {
    if (selectedCountry) {
      const filtered = initialCities.filter(city => city.country_id === selectedCountry);
      setAvailableCities(filtered);
      if (selectedCity && !filtered.find(c => c.id === selectedCity)) {
        setSelectedCity(null);
      }
    } else {
      setAvailableCities([]);
      setSelectedCity(null);
    }
  }, [selectedCountry, initialCities]);

  const toggleFavorite = (id) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  const toggleFilterExpand = (filterName) => {
    setExpandedFilters(prev => ({
      ...prev,
      [filterName]: !prev[filterName]
    }));
  };

  // Tier badge component
  const TierBadge = ({ tier, label, color }) => {
    if (!tier) return null;

    let badgeStyle = 'bg-purple-500/20 text-purple-300 border border-purple-500/30';

    if (tier === 'boost') {
      badgeStyle = 'bg-amber-500/20 text-amber-300 border border-amber-500/30';
    } else if (tier === 'subscription') {
      if (color === 'cyan') {
        badgeStyle = 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30';
      } else if (color === 'blue') {
        badgeStyle = 'bg-blue-500/20 text-blue-300 border border-blue-500/30';
      } else if (color === 'purple') {
        badgeStyle = 'bg-purple-500/20 text-purple-300 border border-purple-500/30';
      }
    }

    const icons = {
      boost: <Zap className="w-3 h-3" />,
      subscription: <Shield className="w-3 h-3" />,
    };

    return (
      <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${badgeStyle}`}>
        {icons[tier]}
        <span>{label}</span>
      </div>
    );
  };

  // Premium Ad Card Component
  const AdCard = ({ ad, index }) => (
    <Link href={`/ads/${ad.id}`} className="group h-full">
      <div 
        className={`rounded-2xl overflow-hidden transition-all duration-500 h-full flex flex-col hover:scale-105 transform ${
          theme === 'dark'
            ? 'bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 hover:border-purple-600/50 hover:shadow-2xl hover:shadow-purple-900/40'
            : 'bg-gradient-to-br from-white to-gray-50 border border-gray-200 hover:border-purple-400 hover:shadow-2xl hover:shadow-purple-300/40'
        }`}
        style={{
          animation: `fadeInUp 0.6s ease-out ${index * 50}ms both`
        }}
      >
        {/* Image Container */}
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-700 to-slate-800 h-48 group-hover:h-56 transition-all duration-500">
          <img
            src={ad.main_photo}
            alt={ad.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          
          {/* Overlay Gradient */}
          <div className={`absolute inset-0 ${
            theme === 'dark'
              ? 'bg-gradient-to-t from-slate-900 via-transparent to-transparent'
              : 'bg-gradient-to-t from-black/30 via-transparent to-transparent'
          }`}></div>

          {/* Tier Badge */}
          {ad.tier_badge && (
            <div className="absolute top-4 left-4 animate-fade-in-up">
              <TierBadge tier={ad.tier_badge} label={ad.tier_label} color={ad.tier_color} />
            </div>
          )}

          {/* Favorite Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleFavorite(ad.id);
            }}
            className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md transition-all duration-300 transform hover:scale-110 ${
              favorites.includes(ad.id)
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
              fill={favorites.includes(ad.id) ? 'white' : 'none'}
              stroke={favorites.includes(ad.id) ? 'none' : 'white'}
            />
          </button>

          {/* Views Badge */}
          <div className={`absolute bottom-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-md ${
            theme === 'dark'
              ? 'bg-black/40 text-gray-200'
              : 'bg-white/40 text-gray-900'
          }`}>
            <Eye className="w-3.5 h-3.5" />
            <span>{ad.views_count?.toLocaleString() || 0}</span>
          </div>
        </div>

        {/* Content */}
        <div className={`p-5 flex flex-col flex-1 ${theme === 'dark' ? 'bg-gradient-to-b from-slate-800 to-slate-900' : 'bg-gradient-to-b from-white to-gray-50'}`}>
          {/* Category & Subcategory */}
          {ad.category && (
            <div className={`flex items-center gap-2 mb-3 flex-wrap`}>
              <span className="px-3 py-1 rounded-lg text-xs font-bold bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/30">
                {ad.category}
              </span>
              {ad.subcategory && (
                <span className={`text-xs font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  • {ad.subcategory}
                </span>
              )}
            </div>
          )}

          {/* Title */}
          <h3 className={`font-bold text-base line-clamp-2 mb-3 group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors ${
            theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
          }`}>
            {ad.title}
          </h3>

          {/* Location */}
          <div className={`flex items-start gap-2 text-sm mb-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5 text-purple-600 dark:text-purple-400" />
            <span className="line-clamp-1 leading-tight">
              {ad.address && ad.city ? `${ad.address}, ${ad.city}` : ad.location}
              {ad.country && !ad.city ? ` (${ad.country})` : ''}
            </span>
          </div>

          {/* Agency Name */}
          {ad.agency_name && (
            <div className={`text-sm font-semibold mb-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              {ad.agency_name}
            </div>
          )}

          {/* Spacer */}
          <div className="flex-1" />

          {/* Price & Button */}
          <div className={`flex items-center justify-between pt-4 border-t ${
            theme === 'dark' ? 'border-slate-700' : 'border-gray-200'
          }`}>
            <p className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
              {ad.price > 0 ? `${ad.price.toLocaleString()} XFA` : 'Sur devis'}
            </p>
            <div className="text-purple-600 dark:text-purple-400 font-bold group-hover:translate-x-1 transition-transform">
              <ArrowRight className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );

  const hasActiveFilters = searchQuery || selectedCategory || selectedSubcategory || selectedCountry || selectedCity || addressFilter;

  return (
    <div className={theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-white text-gray-900'}>
      <Header user={user} />
      <InteractiveCharacter />

      <main className="min-h-screen">
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
            <div className={`absolute bottom-1/3 right-1/3 w-80 h-80 rounded-full opacity-15 blur-3xl ${
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

          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Header Badge */}
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm mb-8 border animate-fade-in-up ${
              theme === 'dark'
                ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/30'
                : 'bg-gradient-to-r from-purple-100 to-pink-100 border-purple-300'
            }`}>
              <Sparkles className={`w-4 h-4 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} />
              <span className={`text-sm font-semibold ${theme === 'dark' ? 'text-purple-300' : 'text-purple-700'}`}>
                {pagination.total ? `${pagination.total} annonce${pagination.total > 1 ? 's' : ''}` : 'Explorez les annonces'}
              </span>
            </div>

            {/* Title */}
            <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-6 leading-tight ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Découvrez toutes les
              <span className={`block bg-clip-text text-transparent ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400'
                  : 'bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600'
              }`}>
                opportunités exceptionnelles
              </span>
            </h1>

            {/* Subtitle */}
            <p className={`max-w-3xl text-lg sm:text-xl mb-10 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Filtrez, recherchez et explorez des milliers d'annonces vérifiées. Utilisez nos outils avancés pour trouver exactement ce que vous cherchez.
            </p>

            {/* Premium Search Bar */}
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
                      placeholder="Titre, description, mot-clé..."
                      className={`w-full pl-12 pr-4 py-3.5 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base ${
                        theme === 'dark'
                          ? 'bg-transparent text-white placeholder-gray-500'
                          : 'bg-transparent text-gray-900 placeholder-gray-400'
                      }`}
                    />
                  </div>
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="px-6 py-3.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg transition font-bold flex items-center justify-center gap-2 whitespace-nowrap hover:scale-105 transform text-sm sm:text-base hover:shadow-pink-400/30 lg:hidden"
                  >
                    <Filter className="w-5 h-5" />
                    <span>Filtres</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className={`${theme === 'dark' ? 'bg-slate-950' : 'bg-gray-50'} py-12 sm:py-16`}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Sidebar Filters */}
              <div className={`lg:col-span-1 ${showFilters ? 'block' : 'hidden lg:block'} space-y-4`}>
                <div className={`rounded-2xl p-6 sticky top-24 transition-all duration-300 ${
                  theme === 'dark'
                    ? 'border-slate-700 bg-gradient-to-br from-slate-900 to-slate-800 hover:shadow-2xl hover:shadow-purple-900/20'
                    : 'border-gray-200 bg-gradient-to-br from-white to-gray-50 hover:shadow-2xl hover:shadow-purple-200/20'
                } border`}>
                  <div className="flex items-center justify-between mb-6 lg:hidden">
                    <h2 className="font-bold flex items-center gap-2">
                      <Filter className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      Filtres
                    </h2>
                    <button onClick={() => setShowFilters(false)} className="p-1">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Categories Filter */}
                  <div className="mb-6">
                    <button
                      onClick={() => toggleFilterExpand('category')}
                      className={`w-full flex items-center justify-between font-bold text-sm mb-3 p-2 rounded-lg transition ${
                        theme === 'dark' ? 'hover:bg-slate-700/50' : 'hover:bg-purple-50'
                      }`}
                    >
                      <span className={theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}>Catégorie</span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${expandedFilters.category ? 'rotate-180' : ''}`} />
                    </button>
                    {expandedFilters.category !== false && (
                      <div className="space-y-2 animate-fade-in-up">
                        <button
                          onClick={() => {
                            setSelectedCategory(null);
                            setSelectedSubcategory(null);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg transition text-sm ${
                            !selectedCategory
                              ? theme === 'dark' ? 'bg-purple-600/20 text-purple-300' : 'bg-purple-100 text-purple-700'
                              : theme === 'dark' ? 'hover:bg-slate-700/50' : 'hover:bg-purple-50'
                          }`}
                        >
                          Toutes
                        </button>
                        {categories.map(cat => (
                          <button
                            key={cat.id}
                            onClick={() => {
                              setSelectedCategory(cat.id);
                              setSelectedSubcategory(null);
                            }}
                            className={`w-full text-left px-3 py-2 rounded-lg transition text-sm ${
                              selectedCategory === cat.id
                                ? theme === 'dark' ? 'bg-purple-600/20 text-purple-300' : 'bg-purple-100 text-purple-700'
                                : theme === 'dark' ? 'hover:bg-slate-700/50' : 'hover:bg-purple-50'
                            }`}
                          >
                            {cat.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Subcategories Filter */}
                  {subcategories.length > 0 && (
                    <div className="mb-6 pb-6 border-b" style={{ borderColor: theme === 'dark' ? 'rgb(30, 41, 59)' : 'rgb(229, 231, 235)' }}>
                      <button
                        onClick={() => toggleFilterExpand('subcategory')}
                        className={`w-full flex items-center justify-between font-bold text-sm mb-3 p-2 rounded-lg transition ${
                          theme === 'dark' ? 'hover:bg-slate-700/50' : 'hover:bg-purple-50'
                        }`}
                      >
                        <span className={theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}>Sous-catégorie</span>
                        <ChevronDown className={`w-4 h-4 transition-transform ${expandedFilters.subcategory ? 'rotate-180' : ''}`} />
                      </button>
                      {expandedFilters.subcategory !== false && (
                        <div className="space-y-2 animate-fade-in-up">
                          {subcategories.map(subcat => (
                            <button
                              key={subcat.id}
                              onClick={() => setSelectedSubcategory(subcat.id)}
                              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                                selectedSubcategory === subcat.id
                                  ? theme === 'dark' ? 'bg-purple-600/20 text-purple-300' : 'bg-purple-100 text-purple-700'
                                  : theme === 'dark' ? 'hover:bg-slate-700/50' : 'hover:bg-purple-50'
                              }`}
                            >
                              {subcat.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Location Filters */}
                  <div className="mb-6 pb-6 border-b" style={{ borderColor: theme === 'dark' ? 'rgb(30, 41, 59)' : 'rgb(229, 231, 235)' }}>
                    <h3 className={`font-bold text-sm mb-3 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                      Localisation
                    </h3>

                    {/* Country Filter */}
                    <div className="mb-4">
                      <label className={`block text-xs font-semibold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        Pays
                      </label>
                      <select
                        value={selectedCountry || ''}
                        onChange={(e) => setSelectedCountry(e.target.value ? parseInt(e.target.value) : null)}
                        className={`w-full px-3 py-2.5 rounded-lg border transition ${
                          theme === 'dark'
                            ? 'bg-slate-800/50 border-slate-700 text-white focus:border-purple-500 hover:border-purple-600/50'
                            : 'bg-white border-gray-300 text-gray-900 focus:border-purple-500 hover:border-purple-400'
                        } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
                      >
                        <option value="">Tous les pays</option>
                        {countries.map(country => (
                          <option key={country.id} value={country.id}>
                            {country.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* City Filter */}
                    {selectedCountry && (
                      <div className="mb-4 animate-fade-in-up">
                        <label className={`block text-xs font-semibold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                          Ville
                        </label>
                        <select
                          value={selectedCity || ''}
                          onChange={(e) => setSelectedCity(e.target.value ? parseInt(e.target.value) : null)}
                          className={`w-full px-3 py-2.5 rounded-lg border transition ${
                            theme === 'dark'
                              ? 'bg-slate-800/50 border-slate-700 text-white focus:border-purple-500 hover:border-purple-600/50'
                              : 'bg-white border-gray-300 text-gray-900 focus:border-purple-500 hover:border-purple-400'
                          } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
                        >
                          <option value="">Toutes les villes</option>
                          {availableCities.map(city => (
                            <option key={city.id} value={city.id}>
                              {city.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Address Filter */}
                    <div>
                      <label className={`block text-xs font-semibold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        Adresse
                      </label>
                      <input
                        type="text"
                        value={addressFilter}
                        onChange={(e) => setAddressFilter(e.target.value)}
                        placeholder="Quartier, rue..."
                        className={`w-full px-3 py-2.5 rounded-lg border transition ${
                          theme === 'dark'
                            ? 'bg-slate-800/50 border-slate-700 text-white placeholder-gray-500 focus:border-purple-500 hover:border-purple-600/50'
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500 hover:border-purple-400'
                        } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
                      />
                    </div>
                  </div>

                  {/* Sorting */}
                  <div className="mb-6">
                    <h3 className={`font-bold text-sm mb-3 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                      Trier par
                    </h3>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className={`w-full px-3 py-2.5 rounded-lg border transition ${
                        theme === 'dark'
                          ? 'bg-slate-800/50 border-slate-700 text-white focus:border-purple-500 hover:border-purple-600/50'
                          : 'bg-white border-gray-300 text-gray-900 focus:border-purple-500 hover:border-purple-400'
                      } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
                    >
                      <option value="relevance">Pertinence</option>
                      <option value="newest">Plus récent</option>
                      <option value="most_viewed">Plus vues</option>
                      <option value="price_asc">Prix (bas → haut)</option>
                      <option value="price_desc">Prix (haut → bas)</option>
                    </select>
                  </div>

                  {/* Clear Filters */}
                  {hasActiveFilters && (
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory(null);
                        setSelectedSubcategory(null);
                        setSelectedCountry(null);
                        setSelectedCity(null);
                        setAddressFilter('');
                      }}
                      className={`w-full py-2.5 px-3 rounded-lg font-bold text-sm transition transform hover:scale-105 ${
                        theme === 'dark'
                          ? 'bg-gradient-to-r from-purple-600/20 to-pink-600/20 hover:from-purple-600/30 hover:to-pink-600/30 text-purple-300'
                          : 'bg-gradient-to-r from-purple-100 to-pink-100 hover:from-purple-200 hover:to-pink-200 text-purple-700'
                      }`}
                    >
                      ✕ Réinitialiser
                    </button>
                  )}
                </div>
              </div>

              {/* Main Content */}
              <div className="lg:col-span-3">
                {/* Results Header */}
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <p className={`text-sm font-semibold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      {pagination.total ? (
                        <>
                          <span className={`text-lg font-black ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`}>
                            {pagination.total}
                          </span>
                          <span> annonce{pagination.total > 1 ? 's' : ''} trouvée{pagination.total > 1 ? 's' : ''}</span>
                        </>
                      ) : 'Aucune annonce'}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-lg font-bold text-sm transition transform hover:scale-105 ${
                      theme === 'dark'
                        ? 'bg-gradient-to-r from-purple-600/20 to-pink-600/20 text-purple-300 hover:from-purple-600/30 hover:to-pink-600/30'
                        : 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 hover:from-purple-200 hover:to-pink-200'
                    }`}
                  >
                    <Filter className="w-4 h-4" />
                    Filtres
                  </button>
                </div>

                {/* Ads Grid */}
                {isLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[...Array(6)].map((_, i) => (
                      <div
                        key={i}
                        className={`rounded-2xl animate-pulse h-96 ${
                          theme === 'dark' ? 'bg-gradient-to-br from-slate-800 to-slate-900' : 'bg-gradient-to-br from-gray-200 to-gray-100'
                        }`}
                      />
                    ))}
                  </div>
                ) : initialAds && initialAds.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                      {initialAds.map((ad, index) => (
                        <AdCard key={ad.id} ad={ad} index={index} />
                      ))}
                    </div>

                    {/* Premium Pagination */}
                    {pagination.total_pages > 1 && (
                      <div className="flex items-center justify-center gap-2 mt-16 flex-wrap">
                        <button
                          disabled={currentPage === 1}
                          onClick={() => setCurrentPage(currentPage - 1)}
                          className={`px-4 py-2.5 rounded-lg font-bold transition transform hover:scale-105 flex items-center gap-2 ${
                            currentPage === 1
                              ? theme === 'dark' ? 'bg-slate-800 text-gray-500' : 'bg-gray-200 text-gray-400'
                              : theme === 'dark' ? 'bg-slate-800 hover:bg-slate-700 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                          }`}
                        >
                          <ArrowUp className="w-4 h-4 rotate-180" />
                          Précédent
                        </button>

                        {[...Array(pagination.total_pages)].map((_, i) => {
                          const page = i + 1;
                          if (page < currentPage - 2 || page > currentPage + 2) return null;
                          return (
                            <button
                              key={page}
                              onClick={() => setCurrentPage(page)}
                              className={`px-4 py-2.5 rounded-lg font-bold transition transform hover:scale-105 ${
                                currentPage === page
                                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                                  : theme === 'dark' ? 'bg-slate-800 hover:bg-slate-700 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                              }`}
                            >
                              {page}
                            </button>
                          );
                        })}

                        <button
                          disabled={!pagination.has_more}
                          onClick={() => setCurrentPage(currentPage + 1)}
                          className={`px-4 py-2.5 rounded-lg font-bold transition transform hover:scale-105 flex items-center gap-2 ${
                            !pagination.has_more
                              ? theme === 'dark' ? 'bg-slate-800 text-gray-500' : 'bg-gray-200 text-gray-400'
                              : theme === 'dark' ? 'bg-slate-800 hover:bg-slate-700 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                          }`}
                        >
                          Suivant
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className={`text-center py-16 rounded-2xl border ${
                    theme === 'dark'
                      ? 'bg-slate-900/50 border-slate-800'
                      : 'bg-gray-100 border-gray-300'
                  }`}>
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                      theme === 'dark' ? 'bg-slate-800' : 'bg-gray-200'
                    }`}>
                      <Search className={`w-8 h-8 ${theme === 'dark' ? 'text-slate-600' : 'text-gray-400'}`} />
                    </div>
                    <p className={`text-lg font-bold mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                      Aucune annonce trouvée
                    </p>
                    <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                      Essayez d'ajuster vos filtres ou votre recherche
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* CSS Animations */}
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
      `}</style>
    </div>
  );
}
