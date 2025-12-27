import { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import FavoriteButton from '../Components/FavoriteButton';
import { useThemeStore } from '../store';
import {
  Search,
  MapPin,
  Eye,
  Briefcase,
  Wrench,
  Home as HomeIcon,
  BookOpen,
  ArrowRight,
  Star,
  CheckCircle,
  Users,
  TrendingUp,
  MousePointerClick,
  MessageCircle,
  FileCheck,
  Zap,
  Shield,
  Sparkles,
  Globe,
} from 'lucide-react';

export default function Home({ categories = [], featuredAds = [], countries = [], cities = [], user }) {
  const { theme } = useThemeStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [favoriteStates, setFavoriteStates] = useState({});

  // Filter cities based on selected country
  const availableCities = selectedCountry
    ? cities.filter(city => city.country_id === selectedCountry)
    : [];

  // Tier Badge Component
  const TierBadge = ({ tier, label, color }) => {
    if (!tier) return null;

    let colorClasses = 'bg-purple-500/20 text-purple-300 border border-purple-500/30';
    
    if (tier === 'boost') {
      colorClasses = 'bg-amber-500/20 text-amber-300 border border-amber-500/30';
    } else if (tier === 'subscription') {
      if (color === 'cyan') {
        colorClasses = 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30';
      } else if (color === 'blue') {
        colorClasses = 'bg-blue-500/20 text-blue-300 border border-blue-500/30';
      } else if (color === 'purple') {
        colorClasses = 'bg-purple-500/20 text-purple-300 border border-purple-500/30';
      }
    }

    const icons = {
      boost: <Zap className="w-3 h-3" />,
      subscription: <Shield className="w-3 h-3" />,
    };

    return (
      <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${colorClasses}`}>
        {icons[tier]}
        <span>{label}</span>
      </div>
    );
  };

  const ListingCard = ({ listing }) => (
    <Link
      href={`/ads/${listing.id}`}
      className="group h-full"
    >
      <div className={`h-full rounded-2xl overflow-hidden border transition-all duration-300 hover:shadow-2xl flex flex-col ${
        theme === 'dark'
          ? 'bg-slate-900 border-slate-800 hover:border-purple-600 hover:shadow-purple-900/30'
          : 'bg-white border-gray-200 hover:border-purple-400 hover:shadow-purple-200/30'
      }`}>
        {/* Image Section */}
        <div className={`relative h-56 overflow-hidden ${theme === 'dark' ? 'bg-slate-800' : 'bg-gray-200'}`}>
          <img 
            src={listing.main_photo || 'https://via.placeholder.com/400x300?text=Ad+Image'} 
            alt={listing.title} 
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
          />
          <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-gradient-to-t from-black/80 via-black/40 to-transparent' : 'bg-gradient-to-t from-black/40 via-black/20 to-transparent'}`}></div>
          
          {/* Badges */}
          <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
            {listing.tier_badge && (
              <TierBadge tier={listing.tier_badge} label={listing.tier_label} color={listing.tier_color} />
            )}
          </div>

          {/* Favorite Button */}
          <div className="absolute top-4 left-4 z-10">
            <FavoriteButton
              adId={listing.id}
              initialIsFavorite={favoriteStates[listing.id] || false}
              showAnimation={true}
              onToggle={(isFav) => setFavoriteStates(prev => ({ ...prev, [listing.id]: isFav }))}
            />
          </div>

          {/* Views Count Badge */}
          <div className={`absolute bottom-4 left-4 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs ${
            theme === 'dark'
              ? 'bg-black/40 backdrop-blur-sm text-gray-200'
              : 'bg-white/40 backdrop-blur-sm text-gray-900'
          }`}>
            <Eye className="w-3.5 h-3.5" />
            <span>{listing.views_count?.toLocaleString() || 0}</span>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 p-5 flex flex-col">
          {/* Title */}
          <h3 className={`font-bold text-lg line-clamp-2 mb-3 group-hover:transition ${
            theme === 'dark'
              ? 'text-white group-hover:text-purple-300'
              : 'text-gray-900 group-hover:text-purple-600'
          }`}>
            {listing.title}
          </h3>

          {/* Price */}
          <div className="mb-4">
            <p className={`text-2xl font-black bg-clip-text text-transparent ${
              theme === 'dark'
                ? 'bg-gradient-to-r from-purple-400 to-pink-400'
                : 'bg-gradient-to-r from-purple-600 to-pink-600'
            }`}>
              {listing.price > 0 ? `${listing.price.toLocaleString()} XFA` : 'Sur devis'}
            </p>
          </div>

          {/* Location */}
          <div className={`flex items-center gap-2 text-sm mb-auto ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span className="line-clamp-1">
              {listing.address && listing.city ? `${listing.address}, ${listing.city}` : listing.location || listing.city || 'Non spécifié'}
            </span>
          </div>

          {/* CTA Button */}
          <button className={`mt-4 w-full px-4 py-2.5 rounded-lg font-bold text-sm text-white transition flex items-center justify-center gap-2 group-hover:scale-105 transform ${
            theme === 'dark'
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-lg hover:shadow-pink-500/20'
              : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-lg hover:shadow-pink-400/20'
          }`}>
            <span>Voir l'annonce</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Link>
  );

  const howItWorks = [
    { 
      name: 'Recherchez',
      description: 'Utilisez nos filtres puissants pour trouver exactement ce que vous voulez.',
      icon: MousePointerClick,
      color: 'from-purple-600 to-pink-600'
    },
    { 
      name: 'Connectez',
      description: 'Discutez en toute sécurité avec les annonceurs via notre messagerie.',
      icon: MessageCircle,
      color: 'from-blue-600 to-cyan-600'
    },
    { 
      name: 'Concrétisez',
      description: 'Finalisez votre projet, que ce soit un emploi, un achat ou un service.',
      icon: FileCheck,
      color: 'from-emerald-600 to-teal-600'
    },
  ];

  return (
    <div className={`${theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-white text-gray-900'}`}>
      <Header user={user} />
      <main>
        {/* PREMIUM HERO SECTION */}
        <section className={`relative min-h-[90vh] flex items-center overflow-hidden ${
          theme === 'dark'
            ? 'bg-slate-950'
            : 'bg-gradient-to-br from-gray-50 to-blue-50'
        }`}>
          {/* Decorative Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className={`absolute top-0 right-0 w-96 h-96 rounded-full opacity-20 blur-3xl ${
              theme === 'dark' ? 'bg-purple-600' : 'bg-purple-400'
            }`}></div>
            <div className={`absolute bottom-0 left-0 w-96 h-96 rounded-full opacity-20 blur-3xl ${
              theme === 'dark' ? 'bg-blue-600' : 'bg-blue-300'
            }`}></div>
            <div className={`absolute top-1/2 left-1/2 w-96 h-96 rounded-full opacity-10 blur-3xl ${
              theme === 'dark' ? 'bg-pink-600' : 'bg-pink-400'
            }`}></div>
          </div>

          {/* Gradient Overlay */}
          <div className={`absolute inset-0 ${
            theme === 'dark'
              ? 'bg-gradient-to-b from-slate-950/0 via-slate-950/50 to-slate-950'
              : 'bg-gradient-to-b from-white/0 via-white/30 to-white'
          }`}></div>

          {/* Background Image */}
          <img 
            src="https://images.pexels.com/photos/19336409/pexels-photo-19336409.jpeg" 
            className={`absolute inset-0 w-full h-full object-cover ${theme === 'dark' ? 'opacity-20' : 'opacity-10'}`}
            alt="Hero background" 
          />

          {/* Content */}
          <div className="relative z-10 mx-auto max-w-5xl text-center px-4 sm:px-6 lg:px-8 w-full">
            {/* Badge */}
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm mb-8 border ${
              theme === 'dark'
                ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/30'
                : 'bg-gradient-to-r from-purple-100 to-pink-100 border-purple-300'
            }`}>
              <Sparkles className={`w-4 h-4 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} />
              <span className={`text-sm font-semibold ${theme === 'dark' ? 'text-purple-300' : 'text-purple-700'}`}>Découvrez des milliers d'opportunités vérifiées</span>
            </div>

            {/* Main Headline */}
            <h1 className={`text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-6 leading-tight ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Le point de départ de vos
              <span className={`block bg-clip-text text-transparent ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400'
                  : 'bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600'
              }`}>
                ambitions illimitées
              </span>
            </h1>

            {/* Subheading */}
            <p className={`mt-6 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed mb-12 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Trouvez votre prochain emploi, une propriété parfaite, ou un service qualifié. 
              Connectez-vous avec les meilleures agences certifiées.
            </p>

            {/* Search Bar */}
            <div className="max-w-4xl mx-auto">
              <div className="relative group">
                <div className={`absolute -inset-0.5 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition duration-300 ${
                  theme === 'dark'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600'
                    : 'bg-gradient-to-r from-purple-400 to-pink-400'
                }`}></div>
                <div className={`relative flex flex-col md:flex-row gap-2 rounded-2xl shadow-2xl p-3 border backdrop-blur-sm ${
                  theme === 'dark'
                    ? 'bg-slate-900/95 border-white/10'
                    : 'bg-white/95 border-gray-200'
                }`}>
                  {/* Search Input */}
                  <div className="flex-1 relative">
                    <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${
                      theme === 'dark' ? 'text-slate-400' : 'text-gray-400'
                    }`} />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Développeur React, Appartement Douala, Consultant SEO..."
                      className={`w-full pl-12 pr-4 py-3.5 bg-transparent rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm md:text-base ${
                        theme === 'dark'
                          ? 'text-white placeholder-gray-500'
                          : 'text-gray-900 placeholder-gray-400'
                      }`}
                    />
                  </div>

                  {/* Country Select */}
                  <select
                    value={selectedCountry || ''}
                    onChange={(e) => {
                      setSelectedCountry(e.target.value ? parseInt(e.target.value) : null);
                      setSelectedCity(null);
                    }}
                    className={`px-4 py-3.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm font-medium transition ${
                      theme === 'dark'
                        ? 'bg-slate-800/60 border-white/10 text-white hover:bg-slate-700/60'
                        : 'bg-gray-100/60 border-gray-300 text-gray-900 hover:bg-gray-200/60'
                    }`}
                  >
                    <option value="">Pays</option>
                    {countries.map(country => (
                      <option key={country.id} value={country.id}>
                        {country.name}
                      </option>
                    ))}
                  </select>

                  {/* City Select */}
                  {selectedCountry && (
                    <select
                      value={selectedCity || ''}
                      onChange={(e) => setSelectedCity(e.target.value ? parseInt(e.target.value) : null)}
                      className={`px-4 py-3.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm font-medium transition ${
                        theme === 'dark'
                          ? 'bg-slate-800/60 border-white/10 text-white hover:bg-slate-700/60'
                          : 'bg-gray-100/60 border-gray-300 text-gray-900 hover:bg-gray-200/60'
                      }`}
                    >
                      <option value="">Ville</option>
                      {availableCities.map(city => (
                        <option key={city.id} value={city.id}>
                          {city.name}
                        </option>
                      ))}
                    </select>
                  )}

                  {/* Search Button */}
                  <button
                    onClick={() => {
                      const query = new URLSearchParams();
                      if (searchQuery) query.append('q', searchQuery);
                      if (selectedCountry) query.append('country_id', selectedCountry);
                      if (selectedCity) query.append('city_id', selectedCity);
                      window.location.href = `/ads?${query.toString()}`;
                    }}
                    className="px-8 py-3.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg transition font-bold flex items-center justify-center gap-2 whitespace-nowrap hover:scale-105 transform text-sm md:text-base hover:shadow-pink-400/30"
                  >
                    <Search className="w-5 h-5" />
                    <span>Chercher</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className={`mt-16 grid grid-cols-3 gap-6 max-w-2xl mx-auto`}>
              <div className="text-center">
                <p className={`text-3xl font-black ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`}>50K+</p>
                <p className={`text-sm mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Annonces vérifiées</p>
              </div>
              <div className="text-center">
                <p className={`text-3xl font-black ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>1000+</p>
                <p className={`text-sm mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Agences certifiées</p>
              </div>
              <div className="text-center">
                <p className={`text-3xl font-black ${theme === 'dark' ? 'text-pink-400' : 'text-pink-600'}`}>★ 4.9</p>
                <p className={`text-sm mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Note moyenne</p>
              </div>
            </div>
          </div>
        </section>

        {/* CATEGORIES SECTION */}
        <section className={`py-24 sm:py-32 relative ${theme === 'dark' ? 'bg-slate-900/50' : 'bg-gradient-to-br from-gray-50 to-blue-50'}`}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="mx-auto max-w-2xl text-center mb-16">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm mb-6 border ${
                theme === 'dark'
                  ? 'bg-slate-800/50 border-slate-700'
                  : 'bg-purple-100/50 border-purple-300'
              }`}>
                <Globe className={`w-4 h-4 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} />
                <span className={`text-sm font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-purple-700'}`}>Parcourir par catégorie</span>
              </div>
              <h2 id="categories" className={`text-4xl sm:text-5xl font-black tracking-tight mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Explorez
                <span className={`block bg-clip-text text-transparent ${
                  theme === 'dark'
                    ? 'bg-gradient-to-r from-purple-400 to-pink-400'
                    : 'bg-gradient-to-r from-purple-600 to-pink-600'
                }`}>
                  tous les domaines
                </span>
              </h2>
              <p className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Trouvez rapidement ce qui vous correspond dans l'une de nos catégories.</p>
            </div>

            {/* Category Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {categories.map((category) => {
                const categoryIcons = {
                  'Emploi': Briefcase,
                  'Immobilier': HomeIcon,
                  'Services': Wrench,
                  'Formation': BookOpen,
                };
                
                const Icon = categoryIcons[category.name] || Briefcase;
                
                return (
                  <Link href={category.href} key={category.id} className={`group relative h-64 rounded-2xl overflow-hidden flex items-end p-6 transition-all duration-300 border ${
                    theme === 'dark'
                      ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-slate-800 hover:border-purple-600 hover:shadow-2xl hover:shadow-purple-900/30'
                      : 'bg-gradient-to-br from-white to-gray-50 border-gray-200 hover:border-purple-400 hover:shadow-2xl hover:shadow-purple-200/30'
                  }`}>
                    {/* Background Gradient */}
                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-300 ${
                      theme === 'dark'
                        ? 'bg-gradient-to-r from-purple-600/10 to-pink-600/10'
                        : 'bg-gradient-to-r from-purple-500/5 to-pink-500/5'
                    }`}></div>

                    {/* Content */}
                    <div className="relative flex items-center gap-4 w-full">
                      <div className="p-3 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl group-hover:shadow-lg group-hover:shadow-purple-600/50 transition">
                        <Icon className="w-6 h-6 text-white"/>
                      </div>
                      <div className="flex-1">
                        <h3 className={`text-xl font-bold group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text transition ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                          {category.name}
                        </h3>
                        {category.subcategories && category.subcategories.length > 0 && (
                          <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{category.subcategories.length} sous-catégories</p>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* FEATURED LISTINGS SECTION */}
        <section className={`py-24 sm:py-32 relative ${
          theme === 'dark'
            ? 'bg-gradient-to-b from-slate-900/30 to-transparent'
            : 'bg-gradient-to-b from-white to-gray-50'
        }`}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-8 mb-16">
              <div className="max-w-2xl">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm mb-6 border ${
                  theme === 'dark'
                    ? 'bg-slate-800/50 border-slate-700'
                    : 'bg-amber-100/50 border-amber-300'
                }`}>
                  <Star className={`w-4 h-4 ${theme === 'dark' ? 'text-amber-400' : 'text-amber-600'}`} />
                  <span className={`text-sm font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-amber-700'}`}>Annonces premium</span>
                </div>
                <h2 className={`text-4xl sm:text-5xl font-black tracking-tight mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  <span className={`block bg-clip-text text-transparent ${
                    theme === 'dark'
                      ? 'bg-gradient-to-r from-purple-400 to-pink-400'
                      : 'bg-gradient-to-r from-purple-600 to-pink-600'
                  }`}>
                    Opportunités
                  </span>
                  <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>à la une</span>
                </h2>
                <p className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Les meilleures occasions, boostées et certifiées par les agences partenaires.</p>
              </div>
              <Link
                href="/ads"
                className={`px-6 py-3 text-white rounded-xl font-bold transition flex items-center gap-2 whitespace-nowrap hover:scale-105 transform ${
                  theme === 'dark'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-lg hover:shadow-pink-500/30'
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-lg hover:shadow-pink-400/20'
                }`}
              >
                <span>Voir toutes les annonces</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Featured Ads Grid */}
            {featuredAds && featuredAds.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredAds.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            ) : (
              <div className={`text-center py-16 rounded-2xl border ${
                theme === 'dark'
                  ? 'bg-slate-900/50 border-slate-800'
                  : 'bg-gray-100 border-gray-300'
              }`}>
                <Star className={`w-12 h-12 mx-auto mb-4 ${theme === 'dark' ? 'text-slate-700' : 'text-gray-400'}`} />
                <p className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Aucune annonce disponible pour le moment.</p>
              </div>
            )}
          </div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section className={`py-24 sm:py-32 relative overflow-hidden ${theme === 'dark' ? 'bg-slate-950' : 'bg-gradient-to-br from-gray-50 to-blue-50'}`}>
          {/* Decorative Background */}
          <div className="absolute inset-0 overflow-hidden">
            <div className={`absolute top-1/4 right-0 w-96 h-96 rounded-full opacity-10 blur-3xl ${
              theme === 'dark' ? 'bg-purple-600' : 'bg-purple-400'
            }`}></div>
            <div className={`absolute bottom-1/4 left-0 w-96 h-96 rounded-full opacity-10 blur-3xl ${
              theme === 'dark' ? 'bg-blue-600' : 'bg-blue-300'
            }`}></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="mx-auto max-w-2xl text-center mb-16" id="how-it-works">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm mb-6 border ${
                theme === 'dark'
                  ? 'bg-slate-800/50 border-slate-700'
                  : 'bg-purple-100/50 border-purple-300'
              }`}>
                <Zap className={`w-4 h-4 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} />
                <span className={`text-sm font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-purple-700'}`}>Processus simplifié</span>
              </div>
              <h2 className={`text-4xl sm:text-5xl font-black tracking-tight mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                C'est aussi simple que
                <span className={`block bg-clip-text text-transparent ${
                  theme === 'dark'
                    ? 'bg-gradient-to-r from-purple-400 to-pink-400'
                    : 'bg-gradient-to-r from-purple-600 to-pink-600'
                }`}>
                  1, 2, 3
                </span>
              </h2>
              <p className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Trois étapes faciles pour transformer vos ambitions en réalité.</p>
            </div>

            {/* Steps Grid */}
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {howItWorks.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div key={step.name} className="group relative">
                    {/* Card */}
                    <div className={`relative p-8 rounded-2xl border transition-all duration-300 h-full flex flex-col ${
                      theme === 'dark'
                        ? 'bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700 hover:border-purple-600/50 hover:shadow-2xl hover:shadow-purple-900/20'
                        : 'bg-gradient-to-br from-white to-gray-50 border-gray-300 hover:border-purple-400 hover:shadow-2xl hover:shadow-purple-200/20'
                    }`}>
                      {/* Step Number */}
                      <div className={`inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r ${step.color} text-white font-black text-lg mb-6 group-hover:shadow-lg group-hover:shadow-purple-600/50 transition`}>
                        {index + 1}
                      </div>

                      {/* Icon */}
                      <Icon className={`h-8 w-8 mb-4 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} />

                      {/* Title */}
                      <h3 className={`text-xl font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{step.name}</h3>

                      {/* Description */}
                      <p className={`leading-relaxed ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>{step.description}</p>

                      {/* Arrow */}
                      {index < howItWorks.length - 1 && (
                        <div className="hidden md:block absolute -right-6 top-1/2 -translate-y-1/2">
                          <ArrowRight className={`w-5 h-5 ${theme === 'dark' ? 'text-purple-600/50' : 'text-purple-400/50'}`} />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className={`py-24 sm:py-32 relative overflow-hidden ${theme === 'dark' ? 'bg-slate-900/50' : 'bg-gradient-to-br from-purple-50 to-pink-50'}`}>
          {/* Background */}
          <div className={`absolute inset-0 ${
            theme === 'dark'
              ? 'bg-gradient-to-r from-purple-600/20 to-pink-600/20'
              : 'bg-gradient-to-r from-purple-300/10 to-pink-300/10'
          }`}></div>
          <div className="absolute inset-0 overflow-hidden">
            <div className={`absolute top-0 right-0 w-96 h-96 rounded-full opacity-20 blur-3xl ${
              theme === 'dark' ? 'bg-purple-600' : 'bg-purple-400'
            }`}></div>
          </div>

          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className={`text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-6 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Prêt à démarrer?
            </h2>
            <p className={`text-lg sm:text-xl max-w-2xl mx-auto mb-10 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Rejoignez des milliers d'utilisateurs satisfaits qui ont trouvé leur prochaine grande opportunité.
            </p>
            <Link
              href="/ads"
              className={`inline-flex px-8 py-4 text-white rounded-xl font-bold text-lg transition items-center gap-2 hover:scale-105 transform ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-2xl hover:shadow-pink-500/40'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-2xl hover:shadow-pink-400/30'
              }`}
            >
              <span>Commencer maintenant</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
