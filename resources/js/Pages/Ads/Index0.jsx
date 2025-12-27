import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import {
  Search as SearchIcon,
  MapPin,
  Eye,
  Heart,
  ArrowLeft,
  FilterIcon,
  X,
  Star,
  TrendingUp,
  MapPinIcon,
} from 'lucide-react';

export default function AdsIndex({ user, query = '' }) {
  const [searchQuery, setSearchQuery] = useState(query);
  const [favorites, setFavorites] = useState([1, 4, 9, 12]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  // NOTE: Data is hardcoded for demonstration purposes.
    const allListings = [
    { id: 1, title: 'Développeur Full Stack React/Laravel', category: 'emploi', location: 'Paris', price: '45k-65k€', views: 342, rating: 4.8, agency: 'TechStartup Inc.', image: 'https://images.unsplash.com/photo-1605379399642-870262d3d051?q=80&w=2106&auto=format&fit=crop', color: 'from-blue-400 to-cyan-500', badge: 'À la une' },
    { id: 2, title: 'Responsable Marketing Digital', category: 'emploi', location: 'Lyon', price: '35k-50k€', views: 156, rating: 4.6, agency: 'Digital Agency', image: 'https://images.unsplash.com/photo-1573164771960-9159981e46c7?q=80&w=2069&auto=format&fit=crop', color: 'from-purple-400 to-pink-500' },
    { id: 3, title: 'Consultant Business Intelligence', category: 'emploi', location: 'Toulouse', price: '40k-60k€', views: 89, rating: 4.9, agency: 'Data Solutions', image: 'https://images.unsplash.com/photo-1543286386-713bdd5948fc?q=80&w=2070&auto=format&fit=crop', color: 'from-orange-400 to-red-500' },
    { id: 4, title: 'Développeur Python Senior', category: 'emploi', location: 'Bordeaux', price: '50k-70k€', views: 234, rating: 4.7, agency: 'Tech Corps', image: 'https://images.unsplash.com/photo-1526374965328-5f61d4dc18c5?q=80&w=2070&auto=format&fit=crop', color: 'from-cyan-400 to-blue-500' },
    { id: 5, title: 'Plombier Professionnel', category: 'services', location: 'Marseille', price: '50€-150€/h', views: 567, rating: 4.7, agency: 'Pro Services', image: 'https://images.unsplash.com/photo-1581092100869-be53a26a6358?q=80&w=2070&auto=format&fit=crop', color: 'from-green-400 to-emerald-500' },
    { id: 6, title: 'Nettoyage Professionnel', category: 'services', location: 'Bordeaux', price: '30€-80€/h', views: 112, rating: 4.5, agency: 'Clean Pro', image: 'https://images.unsplash.com/photo-1582218967923-4556637e6b01?q=80&w=2070&auto=format&fit=crop', color: 'from-yellow-400 to-orange-500' },
    { id: 7, title: 'Électricien Expert', category: 'services', location: 'Nice', price: '60€-180€/h', views: 198, rating: 4.9, agency: 'Électro Pro', image: 'https://images.unsplash.com/photo-1621905299863-bd47514a3e3c?q=80&w=2070&auto=format&fit=crop', color: 'from-orange-400 to-yellow-500' },
    { id: 8, title: 'Apartment Moderne Paris', category: 'immobilier', location: 'Paris 11e', price: '850€/mois', views: 567, rating: 4.8, agency: 'Immo Paris', image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=2070&auto=format&fit=crop', color: 'from-red-400 to-pink-500', badge: 'Vedette' },
    { id: 9, title: 'Maison Bretagne Côte', category: 'immobilier', location: 'Bretagne', price: '350k€', views: 423, rating: 4.6, agency: 'Maisons Côtière', image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=2070&auto=format&fit=crop', color: 'from-indigo-400 to-blue-500' },
    { id: 10, title: 'Studio Paris Centre', category: 'immobilier', location: 'Paris 6e', price: '650€/mois', views: 289, rating: 4.7, agency: 'Immo Paris', image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=2070&auto=format&fit=crop', color: 'from-cyan-400 to-teal-500' },
    { id: 11, title: 'Formation Python Avancé', category: 'formation', location: 'En ligne', price: '299€', views: 678, rating: 4.9, agency: 'TechAcademy', image: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=2070&auto=format&fit=crop', color: 'from-yellow-400 to-lime-500' },
    { id: 12, title: 'Cours Design Graphique', category: 'formation', location: 'En ligne', price: '199€', views: 445, rating: 4.8, agency: 'Design School', image: 'https://images.unsplash.com/photo-1587440871875-191322ee64b0?q=80&w=2071&auto=format&fit=crop', color: 'from-pink-400 to-rose-500', badge: 'Populaire' },
    { id: 13, title: 'Certification English C1', category: 'formation', location: 'En ligne', price: '149€', views: 334, rating: 4.7, agency: 'Language Pro', image: 'https://images.unsplash.com/photo-1596496180126-f2885906d2d0?q=80&w=2070&auto=format&fit=crop', color: 'from-blue-400 to-indigo-500' },
    { id: 14, title: 'Consultant Cloud AWS', category: 'emploi', location: 'Paris', price: '45k-65k€', views: 456, rating: 4.8, agency: 'CloudExperts', image: 'https://images.unsplash.com/photo-1587620962725-abab7ebfd8ab?q=80&w=2070&auto=format&fit=crop', color: 'from-orange-400 to-yellow-500' },
    { id: 15, title: 'Lead Developer Node.js', category: 'emploi', location: 'Lyon', price: '48k-68k€', views: 198, rating: 4.6, agency: 'NodeStudio', image: 'https://images.unsplash.com/photo-1617042375876-a14599ba2d9c?q=80&w=2070&auto=format&fit=crop', color: 'from-green-400 to-cyan-500' },
    { id: 16, title: 'Charpentier Qualifié', category: 'services', location: 'Annecy', price: '45€-120€/h', views: 156, rating: 4.8, agency: 'Bâtiment Pro', image: 'https://images.unsplash.com/photo-1621905299863-bd47514a3e3c?q=80&w=2070&auto=format&fit=crop', color: 'from-amber-400 to-orange-500' },
  ];

  const categories = [
    { id: 'all', name: 'Toutes', icon: '' },
    { id: 'emploi', name: 'Emploi', icon: '' },
    { id: 'services', name: 'Services', icon: '' },
    { id: 'immobilier', name: 'Immobilier', icon: '' },
    { id: 'formation', name: 'Formation', icon: '' },
  ];

  const locations = [
    'Toutes', 'Paris', 'Lyon', 'Marseille', 'Toulouse', 'Bordeaux', 'Nice', 'Bretagne', 'En ligne',
  ];

  const filteredResults = allListings.filter((result) => {
    const matchesSearch =
      result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      result.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      result.agency.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || result.category === selectedCategory;
    const matchesLocation = selectedLocation === 'all' || selectedLocation === 'Toutes' || result.location.includes(selectedLocation);

    return matchesSearch && matchesCategory && matchesLocation;
  });

  const sortedResults = [...filteredResults].sort((a, b) => {
    if (sortBy === 'recent') return b.id - a.id;
    if (sortBy === 'popular') return b.views - a.views;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0;
  });

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]
    );
  };

  const ListingCard = ({ listing }) => (
    <Link
      href={`/ads/${listing.id}`}
      className="group relative bg-slate-800/50 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-purple-800/20 transition-all duration-300 transform hover:-translate-y-1 border border-white/10"
    >
      <div className={`relative h-40 bg-gradient-to-br ${listing.color} overflow-hidden`}>
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <span className="text-5xl opacity-40 group-hover:scale-110 transition-transform duration-300">
            {categories.find(c => c.id === listing.category)?.icon}
          </span>
        </div>
        {listing.badge && (
          <div className="absolute top-3 right-3 px-3 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full text-xs font-bold shadow-lg">
            {listing.badge}
          </div>
        )}
        <button
          onClick={(e) => { e.preventDefault(); toggleFavorite(listing.id); }}
          className="absolute top-3 left-3 p-2 bg-black/30 backdrop-blur-sm rounded-full hover:bg-black/50 transition-colors"
        >
          <Heart
            className="w-5 h-5 transition-all"
            fill={favorites.includes(listing.id) ? 'rgb(236, 72, 153)' : 'none'}
            stroke={favorites.includes(listing.id) ? 'none' : 'white'}
          />
        </button>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <span className="px-2 py-1 bg-slate-700 text-slate-300 rounded-full text-xs font-bold">
            {categories.find((c) => c.id === listing.category)?.name}
          </span>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-bold text-white">{listing.rating}</span>
          </div>
        </div>

        <h3 className="font-bold text-white mb-2 line-clamp-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400">
          {listing.title}
        </h3>

        <div className="flex items-center gap-2 text-slate-400 text-sm mb-3">
          <MapPin className="w-4 h-4 flex-shrink-0" />
          <span className="line-clamp-1">{listing.location}</span>
        </div>

        <div className="text-xs text-slate-500 mb-4 truncate">
          par {listing.agency}
        </div>

        <div className="border-t border-white/10 pt-4 flex items-center justify-between">
          <p className="text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            {listing.price}
          </p>
          <div className="flex items-center gap-2 text-slate-400">
            <Eye className="w-4 h-4" />
            <span className="text-xs font-medium">{listing.views}</span>
          </div>
        </div>
      </div>
    </Link>
  );

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Head title={`Recherche: ${searchQuery || 'Toutes les annonces'}`} />
      <Header user={user} />

      <section className="relative py-12 px-4 bg-slate-950/50">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 opacity-10 blur-3xl"></div>
        <div className="max-w-7xl mx-auto relative">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/" className="flex items-center text-slate-300 hover:text-white font-bold group">
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition" />
              Accueil
            </Link>
          </div>

          <h1 className="text-4xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
            {searchQuery ? `Résultats pour "${searchQuery}"` : 'Toutes les annonces'}
          </h1>

          <div className="relative group">
             <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition duration-300"></div>
             <div className="relative">
                <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Chercher par mot-clé, catégorie, agence..."
                  className="w-full pl-14 pr-4 py-4 bg-slate-800/80 backdrop-blur-sm rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white text-lg"
                />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className={`${showFilters ? 'fixed inset-0 bg-slate-900/90 z-40 p-4' : 'hidden'} lg:sticky lg:top-24 lg:block lg:col-span-1 h-fit space-y-6`}>
            <div className="p-6 bg-slate-800/50 rounded-2xl border border-white/10 backdrop-blur-md">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg text-white flex items-center gap-2">
                  <FilterIcon className="w-5 h-5 text-purple-400" />
                  Filtres
                </h3>
                <button onClick={() => setShowFilters(false)} className="lg:hidden p-1 hover:bg-slate-700 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-bold text-white mb-3">Catégorie</h4>
                  <div className="space-y-2">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`w-full text-left px-4 py-2 rounded-lg font-medium transition ${
                          selectedCategory === cat.id
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                            : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        <span className="mr-2">{cat.icon}</span>{cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border-t border-white/10 pt-6">
                  <h4 className="font-bold text-white mb-3 flex items-center gap-2">
                    <MapPinIcon className="w-4 h-4 text-purple-400" />Localisation
                  </h4>
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {locations.map((loc) => (
                      <option key={loc} value={loc === 'Toutes' ? 'all' : loc} className="bg-slate-800 text-white">
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="border-t border-white/10 pt-6">
                  <h4 className="font-bold text-white mb-3 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-purple-400" />Trier par
                  </h4>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="recent" className="bg-slate-800 text-white">Plus récents</option>
                    <option value="popular" className="bg-slate-800 text-white">Plus populaires</option>
                    <option value="rating" className="bg-slate-800 text-white">Mieux notés</option>
                  </select>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Listings Area */}
          <main className="lg:col-span-3">
            <div className="flex items-center justify-between mb-8">
              <p className="text-gray-600 dark:text-gray-400 font-medium text-lg">
                <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{sortedResults.length}</span> résultat{sortedResults.length !== 1 && 's'}
              </p>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition flex items-center gap-2 shadow-md"
              >
                <FilterIcon className="w-4 h-4" /> Filtres
              </button>
            </div>

            {sortedResults.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-fadeIn">
                {sortedResults.map((result) => <ListingCard key={result.id} listing={result} />)}
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 p-16 text-center shadow-xl">
                <SearchIcon className="w-24 h-24 text-gray-400 dark:text-gray-600 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Aucun résultat trouvé</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-8">Essayez de modifier vos critères de recherche.</p>
                <Link
                  href="/ads"
                  className="inline-block px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition transform hover:scale-105 shadow-lg"
                >
                  Réinitialiser la recherche
                </Link>
              </div>
            )}
          </main>
        </div>
      </div>

      <Footer />

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
