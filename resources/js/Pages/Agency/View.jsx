import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import FavoriteButton from '../../Components/FavoriteButton';
import { useThemeStore } from '../../store';
import {
  ArrowLeft,
  MapPin,
  Mail,
  Phone,
  Filter,
  Grid,
  List,
  ChevronDown,
  Search,
  Zap,
  Quote,
  Star,
  Eye,
  Globe,
  DollarSign,
  Award,
} from 'lucide-react';

export default function AgencyView({ user, agency = {}, ads = [] }) {
  const { theme } = useThemeStore();
  const [viewMode, setViewMode] = useState('grid');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSpace, setSelectedSpace] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [favoriteStates, setFavoriteStates] = useState({});

  // Filter ads
  const filteredAds = (ads || []).filter(ad => {
    const matchesCategory = selectedCategory === 'all' || ad.category === selectedCategory;
    const matchesSpace = selectedSpace === 'all' || ad.space?.id === parseInt(selectedSpace);
    const matchesSearch = ad.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSpace && matchesSearch;
  });

  const categories = ['all', ...new Set((ads || []).map(ad => ad.category).filter(Boolean))];
  const adCategories = categories.slice(1);
  const agencySpaces = (agency.spaces || []);

  const TierBadge = ({ tier, label }) => {
    if (!tier) return null;
    let colorClasses = 'bg-purple-500/20 text-purple-300 border border-purple-500/30';
    if (tier === 'boost') {
      colorClasses = 'bg-amber-500/20 text-amber-300 border border-amber-500/30';
    }
    const icons = {
      boost: <Zap className="w-3 h-3" />,
    };
    return (
      <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${colorClasses}`}>
        {icons[tier]}
        <span>{label}</span>
      </div>
    );
  };

  const AdCard = ({ ad }) => (
    <Link
      href={`/ads/${ad.id}`}
      className={`group rounded-xl overflow-hidden border transition-all duration-300 hover:shadow-2xl ${theme === 'dark' ? 'border-slate-700 bg-slate-900 hover:border-purple-600' : 'border-gray-200 bg-white hover:border-purple-400'}`}
    >
      <div className="relative h-48 overflow-hidden bg-gray-300">
        <img
          src={ad.main_photo || 'https://via.placeholder.com/300x200'}
          alt={ad.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
        <div className="absolute top-3 right-3 flex items-center gap-2">
          {ad.tier_badge && (
            <TierBadge tier={ad.tier_badge} label={ad.tier_label} />
          )}
          <FavoriteButton
            adId={ad.id}
            initialIsFavorite={favoriteStates[ad.id] || false}
            showAnimation={true}
            onToggle={(isFav) => setFavoriteStates(prev => ({ ...prev, [ad.id]: isFav }))}
            className="relative"
          />
        </div>
      </div>
      <div className="p-5">
        <p className={`font-bold text-sm line-clamp-2 mb-3 group-hover:text-purple-600 transition ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          {ad.title}
        </p>
        {ad.category && (
          <p className={`text-xs font-semibold px-3 py-1.5 rounded-full inline-block mb-3 ${theme === 'dark' ? 'bg-purple-500/20 text-purple-300' : 'bg-purple-100 text-purple-700'}`}>
            {ad.category}
          </p>
        )}
        <p className="text-2xl font-black text-purple-600 dark:text-purple-400 mb-4">
          {ad.price > 0 ? `${ad.price.toLocaleString()} XFA` : 'Sur devis'}
        </p>
        <div className={`flex items-center justify-between text-xs font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            {ad.city}
          </span>
          <span className="flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" />
            {ad.views_count?.toLocaleString() || 0}
          </span>
        </div>
      </div>
    </Link>
  );

  const AdListItem = ({ ad }) => (
    <Link
      href={`/ads/${ad.id}`}
      className={`group flex gap-4 p-4 rounded-xl border transition-all hover:shadow-lg ${theme === 'dark' ? 'border-slate-700 bg-slate-900 hover:border-purple-600' : 'border-gray-200 bg-white hover:border-purple-300'}`}
    >
      <div className="relative flex-shrink-0 overflow-hidden rounded-lg">
        <img
          src={ad.main_photo || 'https://via.placeholder.com/100x100'}
          alt={ad.title}
          className="w-24 h-24 object-cover group-hover:scale-110 transition-transform duration-300"
        />
        {ad.tier_badge && (
          <div className="absolute -top-2 -right-2">
            <TierBadge tier={ad.tier_badge} label={ad.tier_label} />
          </div>
        )}
      </div>
      <div className="flex-1">
        <div className="flex items-start justify-between gap-4 mb-2">
          <p className={`font-bold text-sm group-hover:text-purple-600 transition ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {ad.title}
          </p>
          <div className="flex items-center gap-2 flex-shrink-0">
            {ad.space && (
              <span className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${theme === 'dark' ? 'bg-blue-500/30 text-blue-300' : 'bg-blue-100 text-blue-700'}`}>
                {ad.space.name}
              </span>
            )}
            <FavoriteButton
              adId={ad.id}
              initialIsFavorite={favoriteStates[ad.id] || false}
              showAnimation={true}
              onToggle={(isFav) => setFavoriteStates(prev => ({ ...prev, [ad.id]: isFav }))}
              className="relative"
            />
          </div>
        </div>
        {ad.category && (
          <p className={`text-xs font-semibold px-3 py-1.5 rounded-full inline-block mb-2 ${theme === 'dark' ? 'bg-purple-500/20 text-purple-300' : 'bg-purple-100 text-purple-700'}`}>
            {ad.category}
          </p>
        )}
        <p className="text-lg font-bold text-purple-600 dark:text-purple-400 mb-2">
          {ad.price > 0 ? `${ad.price.toLocaleString()} XFA` : 'Sur devis'}
        </p>
        <div className={`flex gap-4 text-xs font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            {ad.city}
          </span>
          <span className="flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" />
            {ad.views_count?.toLocaleString() || 0}
          </span>
        </div>
      </div>
    </Link>
  );

  return (
    <div className={theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-white text-gray-900'}>
      <Head title={`${agency.name || 'Agence'}`} />
      <Header user={user} />

      <main className="min-h-screen">
        {/* Navigation */}
        <div className={`border-b sticky top-16 z-40 backdrop-blur-sm ${theme === 'dark' ? 'border-slate-800 bg-slate-950/80' : 'border-gray-200 bg-white/80'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <Link href="/ads" className="inline-flex items-center text-purple-600 font-semibold text-sm hover:text-purple-700 group">
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition" />
              Retour aux annonces
            </Link>
          </div>
        </div>

        {/* HERO SECTION - Premium Design */}
        <section className={`relative overflow-hidden ${theme === 'dark' ? 'bg-slate-900' : 'bg-gradient-to-b from-gray-50 to-white'}`}>
          {/* Decorative Background */}
          <div className="absolute inset-0 overflow-hidden">
            <div className={`absolute top-0 right-0 w-96 h-96 rounded-full opacity-10 blur-3xl ${theme === 'dark' ? 'bg-purple-600' : 'bg-purple-400'}`}></div>
            <div className={`absolute bottom-0 left-0 w-96 h-96 rounded-full opacity-10 blur-3xl ${theme === 'dark' ? 'bg-blue-600' : 'bg-blue-400'}`}></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Left: Profile Photo & Basic Info */}
              <div className="flex flex-col items-center lg:items-start">
                {/* Profile Photo - Large & Beautiful */}
                <div className="relative mb-12 w-full flex justify-center lg:justify-start">
                  <div className="relative group">
                    {/* Shadow Effect */}
                    <div className={`absolute -inset-4 rounded-3xl blur-3xl opacity-20 group-hover:opacity-30 transition ${theme === 'dark' ? 'bg-purple-600' : 'bg-purple-400'}`}></div>
                    
                    {/* Photo Container */}
                    <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-3xl overflow-hidden border-4 border-white shadow-2xl">
                      {agency.profile?.photo ? (
                        <img
                          src={agency.profile.photo}
                          alt={agency.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white">
                          <span className="text-8xl font-black opacity-50">
                            {agency.name?.charAt(0).toUpperCase() || 'A'}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Badge */}
                    {agency.subscription && (
                      <div className="absolute -bottom-4 -right-4 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-full font-bold shadow-lg text-sm flex items-center gap-2">
                        <Star className="w-4 h-4" />
                        Certifié Actif
                      </div>
                    )}
                  </div>
                </div>

                {/* Contact Quick Links */}
                <div className="w-full space-y-3">
                  {agency.email && (
                    <a
                      href={`mailto:${agency.email}`}
                      className={`flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition ${theme === 'dark' ? 'bg-slate-800 hover:bg-slate-700 text-gray-200' : 'bg-gray-100 hover:bg-purple-100 text-gray-800'}`}
                    >
                      <Mail className="w-5 h-5 text-purple-600" />
                      {agency.email}
                    </a>
                  )}
                  {agency.phone && (
                    <a
                      href={`tel:${agency.phone}`}
                      className={`flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition ${theme === 'dark' ? 'bg-slate-800 hover:bg-slate-700 text-gray-200' : 'bg-gray-100 hover:bg-blue-100 text-gray-800'}`}
                    >
                      <Phone className="w-5 h-5 text-blue-600" />
                      {agency.phone}
                    </a>
                  )}
                </div>
              </div>

              {/* Right: Agency Info & Description */}
              <div className="flex flex-col justify-center">
                {/* Name & Slogan */}
                <div className="mb-8">
                  <h1 className={`text-5xl lg:text-6xl font-black leading-tight mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {agency.name}
                  </h1>
                  {agency.profile?.slogan && (
                    <div className="flex items-start gap-4 mb-6">
                      <Quote className={`w-6 h-6 flex-shrink-0 mt-1 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} />
                      <p className={`text-xl italic font-semibold ${theme === 'dark' ? 'text-purple-300' : 'text-purple-700'}`}>
                        {agency.profile.slogan}
                      </p>
                    </div>
                  )}
                </div>

                {/* Description */}
                {agency.profile?.description && (
                  <div className="mb-8">
                    <p className={`text-lg leading-relaxed mb-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      {agency.profile.description}
                    </p>
                  </div>
                )}

                {/* Address */}
                {agency.profile?.address && (
                  <div className={`flex items-start gap-4 p-5 rounded-xl mb-8 ${theme === 'dark' ? 'bg-slate-800/50' : 'bg-gray-100'}`}>
                    <MapPin className={`w-6 h-6 flex-shrink-0 mt-1 ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`} />
                    <div>
                      <p className={`font-semibold mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        Adresse
                      </p>
                      <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        {agency.profile.address}
                      </p>
                      {(agency.city || agency.country) && (
                        <p className={`text-sm mt-2 font-medium ${theme === 'dark' ? 'text-gray-500' : 'text-gray-700'}`}>
                          {[agency.city, agency.country].filter(Boolean).join(', ')}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className={`p-4 rounded-xl text-center ${theme === 'dark' ? 'bg-slate-800' : 'bg-gray-100'}`}>
                    <p className="text-3xl font-black text-purple-600 dark:text-purple-400">
                      {agency.ads_count || 0}
                    </p>
                    <p className={`text-xs font-semibold mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      Annonce{agency.ads_count !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className={`p-4 rounded-xl text-center ${theme === 'dark' ? 'bg-slate-800' : 'bg-gray-100'}`}>
                    <p className="text-3xl font-black text-blue-600 dark:text-blue-400">
                      {agency.spaces_count || 0}
                    </p>
                    <p className={`text-xs font-semibold mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      Espace{agency.spaces_count !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className={`p-4 rounded-xl text-center ${theme === 'dark' ? 'bg-slate-800' : 'bg-gray-100'}`}>
                    <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
                      ★ 4.8
                    </p>
                    <p className={`text-xs font-semibold mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      Note
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* MAIN CONTENT SECTION */}
        <section className={theme === 'dark' ? 'bg-slate-950' : 'bg-gray-50'}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              
              {/* SIDEBAR - Filters */}
              <div className="lg:col-span-1">
                <div className={`rounded-2xl border sticky top-32 ${theme === 'dark' ? 'border-slate-700 bg-slate-900' : 'border-gray-200 bg-white'}`}>
                  <div className={`px-6 py-4 border-b ${theme === 'dark' ? 'border-slate-700 bg-slate-800/50' : 'border-gray-200 bg-gray-50'}`}>
                    <h3 className={`font-black text-lg flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      <Filter className="w-5 h-5 text-purple-600" />
                      Filtrer
                    </h3>
                  </div>

                  <div className="p-6 space-y-6">
                    {/* Search */}
                    <div>
                      <label className={`text-xs font-bold uppercase tracking-wider mb-2 block ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        Recherche
                      </label>
                      <div className={`flex items-center gap-2 px-4 py-3 rounded-lg border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-gray-50 border-gray-300'}`}>
                        <Search className="w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Chercher..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className={`flex-1 bg-transparent border-0 outline-none text-sm ${theme === 'dark' ? 'text-white placeholder-gray-600' : 'text-gray-900 placeholder-gray-500'}`}
                        />
                      </div>
                    </div>

                    {/* Category Filter */}
                    {adCategories.length > 0 && (
                      <div>
                        <label className={`text-xs font-bold uppercase tracking-wider mb-2 block ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          Catégorie
                        </label>
                        <select
                          value={selectedCategory}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          className={`w-full px-4 py-3 rounded-lg border font-medium text-sm ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                        >
                          <option value="all">Toutes les catégories</option>
                          {adCategories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Space Filter */}
                    {agencySpaces.length > 0 && (
                      <div>
                        <label className={`text-xs font-bold uppercase tracking-wider mb-2 block ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          Espace Commercial
                        </label>
                        <select
                          value={selectedSpace}
                          onChange={(e) => setSelectedSpace(e.target.value)}
                          className={`w-full px-4 py-3 rounded-lg border font-medium text-sm ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                        >
                          <option value="all">Tous les espaces</option>
                          {agencySpaces.map(space => (
                            <option key={space.id} value={space.id}>{space.name}</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* MAIN - Ads */}
              <div className="lg:col-span-3 space-y-12">
                
                {/* Ads Header */}
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <h2 className={`text-3xl font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      Annonces ({filteredAds.length})
                    </h2>
                    
                    {filteredAds.length > 0 && (
                      <div className={`flex items-center gap-2 p-2 rounded-lg ${theme === 'dark' ? 'bg-slate-800' : 'bg-gray-100'}`}>
                        <button
                          onClick={() => setViewMode('grid')}
                          className={`p-2 rounded-lg transition ${viewMode === 'grid' ? 'bg-purple-600 text-white' : theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'}`}
                          title="Vue grille"
                        >
                          <Grid className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => setViewMode('list')}
                          className={`p-2 rounded-lg transition ${viewMode === 'list' ? 'bg-purple-600 text-white' : theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'}`}
                          title="Vue liste"
                        >
                          <List className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Ads Display */}
                  {filteredAds.length > 0 ? (
                    viewMode === 'grid' ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredAds.map(ad => (
                          <AdCard key={ad.id} ad={ad} />
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {filteredAds.map(ad => (
                          <AdListItem key={ad.id} ad={ad} />
                        ))}
                      </div>
                    )
                  ) : (
                    <div className={`rounded-2xl border-2 border-dashed p-16 text-center ${theme === 'dark' ? 'border-slate-700 bg-slate-800/30' : 'border-gray-300 bg-gray-50'}`}>
                      <Search className={`w-12 h-12 mx-auto mb-4 opacity-40 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} />
                      <p className={`text-lg font-semibold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        Aucune annonce trouvée
                      </p>
                    </div>
                  )}
                </div>

                {/* COMMERCIAL SPACES - Bottom Section */}
                {agencySpaces.length > 0 && (
                  <div className="mt-20 pt-20 border-t-2 border-gray-200 dark:border-slate-700">
                    <h2 className={`text-3xl font-black mb-12 flex items-center gap-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      <Globe className="w-8 h-8 text-blue-600" />
                      Espaces Commerciaux
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {agencySpaces.map(space => (
                        <div
                          key={space.id}
                          className={`group rounded-2xl border-2 overflow-hidden transition-all duration-300 hover:shadow-2xl ${theme === 'dark' ? 'border-blue-600/50 bg-gradient-to-br from-slate-900 to-slate-800' : 'border-blue-200 bg-gradient-to-br from-white to-blue-50'}`}
                        >
                          {/* Header */}
                          <div className={`px-6 py-5 border-b-2 ${theme === 'dark' ? 'border-blue-600/50 bg-blue-900/20' : 'border-blue-200 bg-blue-100/30'}`}>
                            <h3 className={`text-xl font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                              {space.name}
                            </h3>
                            <p className={`text-xs font-semibold mt-1 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-700'}`}>
                              {space.ads_count || 0} annonce{space.ads_count !== 1 ? 's' : ''}
                            </p>
                          </div>

                          {/* Content */}
                          <div className="p-6 space-y-4">
                            {/* Location */}
                            {space.address && (
                              <div className="flex items-start gap-3">
                                <MapPin className={`w-5 h-5 flex-shrink-0 mt-1 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
                                <div>
                                  <p className={`font-semibold text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                    {space.address}
                                  </p>
                                  {(space.city || space.country) && (
                                    <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                      {[space.city, space.country].filter(Boolean).join(', ')}
                                    </p>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Contact */}
                            <div className="space-y-2 pt-2">
                              {space.email && (
                                <a
                                  href={`mailto:${space.email}`}
                                  className={`flex items-center gap-3 p-3 rounded-lg transition ${theme === 'dark' ? 'hover:bg-slate-700/50 text-gray-300 hover:text-blue-300' : 'hover:bg-blue-100 text-gray-700 hover:text-blue-600'}`}
                                >
                                  <Mail className={`w-4 h-4 flex-shrink-0 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
                                  <span className="text-sm font-medium break-all">{space.email}</span>
                                </a>
                              )}
                              {space.phone && (
                                <a
                                  href={`tel:${space.phone}`}
                                  className={`flex items-center gap-3 p-3 rounded-lg transition ${theme === 'dark' ? 'hover:bg-slate-700/50 text-gray-300 hover:text-blue-300' : 'hover:bg-blue-100 text-gray-700 hover:text-blue-600'}`}
                                >
                                  <Phone className={`w-4 h-4 flex-shrink-0 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
                                  <span className="text-sm font-medium">{space.phone}</span>
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
