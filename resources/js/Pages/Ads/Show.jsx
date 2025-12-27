import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import FavoriteButton from '../../Components/FavoriteButton';
import InteractiveCharacter from '../../Components/InteractiveCharacter';
import { useThemeStore } from '../../store';
import {
  Heart,
  MapPin,
  Calendar,
  Share2,
  ArrowLeft,
  Phone,
  Mail,
  ChevronLeft,
  ChevronRight,
  Flag,
  Send,
  Star,
  Eye,
  CheckCircle2,
  Building2,
  Shield,
  Zap,
  ArrowRight,
  Sparkles,
  Copy,
  Check,
} from 'lucide-react';

export default function AdsShow({ ad = {}, agency = {}, relatedAds = [], isFavorite = false, user }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isAdFavorite, setIsAdFavorite] = useState(isFavorite);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [showSpaceInfo, setShowSpaceInfo] = useState(false);
  const { theme } = useThemeStore();

  const adData = ad || {};
  const agencyData = agency || {};
  const relatedList = relatedAds || [];

  const images = adData.photos && adData.photos.length > 0
    ? adData.photos.map(p => p.photo)
    : [adData.main_photo].filter(Boolean);

  const imageLabels = adData.photos && adData.photos.length > 0
    ? adData.photos.map(p => p.label)
    : ['Photo principale'];

  const handleNextImage = () => {
    setSelectedImage((prev) => (prev + 1) % images.length);
  };
  
  const handlePrevImage = () => {
    setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleContactClick = (event) => {
    // Record contact/inquiry without blocking the link
    const csrfTokenElement = document.querySelector('meta[name="csrf-token"]');
    const csrfToken = csrfTokenElement?.getAttribute('content');

    if (!csrfToken) {
      console.warn('CSRF token not found, attempting to record contact without it');
    }

    if (!adData.id) {
      console.warn('Ad ID not found, cannot record contact');
      return;
    }

    // Send the request asynchronously without blocking the link
    fetch('/api/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(csrfToken && { 'X-CSRF-TOKEN': csrfToken }),
      },
      body: JSON.stringify({
        ad_id: adData.id,
      }),
    })
      .then(response => {
        if (!response.ok) {
          console.warn(`Contact recording returned status ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Contact recorded successfully:', data);
      })
      .catch(error => {
        console.error('Contact tracking error:', error);
      });

    // Allow the link to function normally
    // Do NOT prevent default - the browser will handle the link
  };

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
      <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold ${badgeStyle}`}>
        {icons[tier]}
        <span>{label}</span>
      </div>
    );
  };

  return (
    <div className={theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-white text-gray-900'}>
      <Head title={adData.title || 'Annonce'} />
      <Header user={user} />
      <InteractiveCharacter />

      <main className="min-h-screen">
        {/* Back Link */}
        <div className={`border-b ${theme === 'dark' ? 'border-slate-800 bg-slate-900/50' : 'border-gray-200 bg-gray-50'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link href="/ads" className="inline-flex items-center text-purple-600 dark:text-purple-400 font-semibold text-sm hover:text-purple-700 dark:hover:text-purple-300 group transition">
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition" />
              Retour aux annonces
            </Link>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column - Gallery & Details */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Premium Gallery Section */}
              <div className={`rounded-2xl overflow-hidden border transition-all duration-300 ${
                theme === 'dark'
                  ? 'border-slate-700 bg-slate-900 hover:border-purple-600/50'
                  : 'border-gray-200 bg-white hover:border-purple-400'
              }`}>
                {/* Main Image */}
                <div className={`relative aspect-video bg-gradient-to-br from-slate-800 to-slate-900 overflow-hidden group`}>
                  {images.length > 0 ? (
                    <>
                      <img
                        src={images[selectedImage]}
                        alt={imageLabels[selectedImage] || adData.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      
                      {/* Overlay Gradient */}
                      <div className={`absolute inset-0 ${
                        theme === 'dark'
                          ? 'bg-gradient-to-t from-slate-900 via-transparent to-transparent'
                          : 'bg-gradient-to-t from-black/30 via-transparent to-transparent'
                      }`}></div>

                      {/* Image Info */}
                      <div className="absolute bottom-4 left-4 px-4 py-2 bg-black/60 backdrop-blur-md rounded-lg text-white text-xs font-bold">
                        {imageLabels[selectedImage]} {images.length > 1 && `(${selectedImage + 1}/${images.length})`}
                      </div>

                      {/* Favorite Button */}
                      <div className="absolute top-4 left-4 z-20">
                        <FavoriteButton
                          adId={adData.id}
                          initialIsFavorite={isAdFavorite}
                          showAnimation={true}
                          onToggle={setIsAdFavorite}
                        />
                      </div>

                      {/* Navigation Arrows */}
                      {images.length > 1 && (
                        <>
                          <button
                            onClick={handlePrevImage}
                            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/40 hover:bg-black/60 text-white transition-all duration-300 z-10 hover:scale-110 transform"
                          >
                            <ChevronLeft className="w-6 h-6" />
                          </button>
                          <button
                            onClick={handleNextImage}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/40 hover:bg-black/60 text-white transition-all duration-300 z-10 hover:scale-110 transform"
                          >
                            <ChevronRight className="w-6 h-6" />
                          </button>
                        </>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      Image non disponible
                    </div>
                  )}
                </div>

                {/* Thumbnails */}
                {images.length > 1 && (
                  <div className={`flex gap-2 p-4 overflow-x-auto ${theme === 'dark' ? 'bg-slate-800/50' : 'bg-gray-50'}`}>
                    {images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImage(idx)}
                        className={`flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 transition-all duration-300 hover:scale-110 transform ${
                          selectedImage === idx
                            ? 'border-purple-600 shadow-lg'
                            : theme === 'dark'
                            ? 'border-slate-700 hover:border-purple-600/50'
                            : 'border-gray-200 hover:border-purple-400'
                        }`}
                        title={imageLabels[idx]}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Title & Info Section */}
              <div className={`rounded-2xl border p-8 transition-all duration-300 ${
                theme === 'dark'
                  ? 'border-slate-700 bg-gradient-to-br from-slate-900 to-slate-800'
                  : 'border-gray-200 bg-gradient-to-br from-white to-gray-50'
              }`}>
                {/* Header */}
                <div className="mb-6 flex items-start justify-between gap-4">
                  <div className="flex-1">
                    {/* Category Badge */}
                    <span className="inline-block px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-700 dark:text-purple-300 rounded-lg text-xs font-bold mb-4 border border-purple-500/30">
                      {adData.category || 'Catégorie'}
                    </span>
                    
                    {/* Title */}
                    <h1 className={`text-4xl sm:text-5xl font-black tracking-tight mb-4 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {adData.title}
                    </h1>
                    
                    {/* Price */}
                    <p className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 mb-6">
                      {adData.price > 0 ? `${adData.price.toLocaleString()} XFA` : 'Sur devis'}
                    </p>
                  </div>
                  
                  {/* Tier Badge */}
                  {adData.tier_badge && (
                    <TierBadge tier={adData.tier_badge} label={adData.tier_label} color={adData.tier_color} />
                  )}
                </div>

                {/* Meta Information */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t" style={{ borderColor: theme === 'dark' ? 'rgb(30, 41, 59)' : 'rgb(229, 231, 235)' }}>
                  {adData.address && (
                    <div>
                      <p className={`text-xs font-semibold mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        <MapPin className="w-4 h-4 inline mr-1" />
                        Localisation
                      </p>
                      <p className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {adData.city}-{adData.country}<br />
                        Adress: {adData.address},
                      </p>
                    </div>
                  )}
                  {adData.created_at && (
                    <div>
                      <p className={`text-xs font-semibold mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        <Calendar className="w-4 h-4 inline mr-1" />
                        Publié
                      </p>
                      <p className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {new Date(adData.created_at).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className={`text-xs font-semibold mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      <Eye className="w-4 h-4 inline mr-1" />
                      Vues
                    </p>
                    <p className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {adData.views_count?.toLocaleString() || 0}
                    </p>
                  </div>
                  {adData.rating && (
                    <div>
                      <p className={`text-xs font-semibold mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        <Star className="w-4 h-4 inline mr-1" />
                        Note
                      </p>
                      <p className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {adData.rating} ⭐
                      </p>
                    </div>
                  )}
                </div>

                {/* Share Button */}
                <button
                  onClick={handleCopyUrl}
                  className={`mt-6 w-full px-6 py-3 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
                    copiedUrl
                      ? 'bg-green-500/20 text-green-600 dark:text-green-400'
                      : 'bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-purple-600 dark:text-purple-400 hover:from-purple-500/20 hover:to-pink-500/20'
                  }`}
                >
                  {copiedUrl ? (
                    <>
                      <Check className="w-5 h-5" />
                      Lien copié!
                    </>
                  ) : (
                    <>
                      <Copy className="w-5 h-5" />
                      Copier le lien
                    </>
                  )}
                </button>
              </div>

              {/* Description */}
              {adData.description && (
                <div className={`rounded-2xl border p-8 transition-all duration-300 ${
                  theme === 'dark'
                    ? 'border-slate-700 bg-gradient-to-br from-slate-900 to-slate-800'
                    : 'border-gray-200 bg-gradient-to-br from-white to-gray-50'
                }`}>
                  <h2 className="text-2xl font-black mb-6 flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    Description détaillée
                  </h2>
                  <p className={`whitespace-pre-wrap leading-relaxed text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    {adData.description}
                  </p>
                </div>
              )}
            </div>

            {/* Right Column - Agency & CTA */}
            <div className="space-y-8">
              
              {/* Agency Card */}
              {agencyData && (
                <div className={`rounded-2xl border-2 overflow-hidden transition-all duration-300 ${
                  theme === 'dark'
                    ? 'border-purple-600/50 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900'
                    : 'border-purple-200 bg-gradient-to-br from-purple-50 to-white'
                }`}>
                  {/* Header */}
                  <div className={`px-6 py-4 border-b-2 flex items-center gap-3 ${
                    theme === 'dark' ? 'border-purple-600/50 bg-purple-900/30' : 'border-purple-200 bg-purple-50'
                  }`}>
                    <div className={`p-2.5 rounded-lg ${
                      theme === 'dark' ? 'bg-purple-600/20' : 'bg-purple-200'
                    }`}>
                      <Building2 className={`w-5 h-5 ${
                        theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
                      }`} />
                    </div>
                    <h2 className={`text-lg font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      Annonceur
                    </h2>
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-6">
                    {/* Profile Card */}
                    <div className={`rounded-xl p-4 flex items-center gap-4 ${
                      theme === 'dark' ? 'bg-slate-800/50' : 'bg-gray-100'
                    }`}>
                      {agencyData.profile?.photo ? (
                        <img
                          src={agencyData.profile.photo}
                          alt={agencyData.name}
                          className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-purple-400 to-pink-600 flex items-center justify-center text-white text-2xl font-black flex-shrink-0">
                          {agencyData.name?.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className={`text-lg font-bold mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          {agencyData.name}
                        </h3>
                        {agencyData.profile?.slogan && (
                          <p className={`text-sm font-semibold italic mb-1 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`}>
                            "{agencyData.profile.slogan}"
                          </p>
                        )}
                        <div className="flex items-center gap-1">
                          <CheckCircle2 className={`w-4 h-4 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} />
                          <span className="text-xs font-bold text-green-600 dark:text-green-400">Vérifiée</span>
                        </div>
                      </div>
                    </div>

                    {/* Contact Methods */}
                    <div className="space-y-3">
                      {adData.contact_email && (
                        <a
                          href={`mailto:${adData.contact_email}`}
                          onClick={handleContactClick}
                          className={`flex items-center gap-3 p-4 rounded-lg transition-all duration-300 ${
                            theme === 'dark'
                              ? 'bg-slate-800/50 hover:bg-slate-700/50 text-gray-300 hover:text-purple-300'
                              : 'bg-gray-100 hover:bg-purple-100 text-gray-800 hover:text-purple-600'
                          }`}
                        >
                          <Mail className={`w-5 h-5 flex-shrink-0 ${
                            theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
                          }`} />
                          <span className="text-sm font-medium break-all">{adData.contact_email}</span>
                        </a>
                      )}
                      {adData.contact_phone && (
                        <a
                          href={`https://wa.me/${adData.contact_phone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={handleContactClick}
                          className={`flex items-center gap-3 p-4 rounded-lg transition-all duration-300 ${
                            theme === 'dark'
                              ? 'bg-slate-800/50 hover:bg-slate-700/50 text-gray-300 hover:text-purple-300'
                              : 'bg-gray-100 hover:bg-purple-100 text-gray-800 hover:text-purple-600'
                          }`}
                          title="Ouvrir sur WhatsApp"
                        >
                          <Phone className={`w-5 h-5 flex-shrink-0 ${
                            theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
                          }`} />
                          <span className="text-sm font-medium">{adData.contact_phone}</span>
                        </a>
                      )}
                    </div>

                    {/* Space Information - Hidden by Default */}
                    {agencyData.space && (
                      <>
                        {!showSpaceInfo ? (
                          <button
                            onClick={() => setShowSpaceInfo(true)}
                            className={`w-full rounded-xl p-4 border transition-all duration-300 flex items-center justify-between font-bold text-sm ${
                              theme === 'dark'
                                ? 'border-slate-700 bg-slate-800/30 hover:bg-slate-700/30 text-purple-400 hover:text-purple-300'
                                : 'border-gray-200 bg-gray-50 hover:bg-gray-100 text-purple-600 hover:text-purple-700'
                            }`}
                          >
                            <span>Informations de la boutique</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        ) : (
                          <div className={`rounded-xl p-4 border transition-all duration-300 ${
                            theme === 'dark'
                              ? 'border-purple-600/50 bg-purple-900/20'
                              : 'border-purple-200 bg-purple-50'
                          }`}>
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <p className={`text-xs font-semibold mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                  Espace Commercial
                                </p>
                                <h4 className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                  {agencyData.space.name}
                                </h4>
                              </div>
                              <button
                                onClick={() => setShowSpaceInfo(false)}
                                className={`text-xs font-bold px-2 py-1 rounded transition-all ${
                                  theme === 'dark'
                                    ? 'text-gray-400 hover:text-gray-300'
                                    : 'text-gray-600 hover:text-gray-700'
                                }`}
                                title="Masquer les informations"
                              >
                                ✕
                              </button>
                            </div>
                            <div className="space-y-2">
                              {agencyData.space.email && (
                                <p className={`text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                  <span className={`font-semibold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Email:</span> {agencyData.space.email}
                                </p>
                              )}
                              {agencyData.space.phone && (
                                <p className={`text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                  <span className={`font-semibold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Tél:</span> {agencyData.space.phone}
                                </p>
                              )}
                              {agencyData.space.address && (
                                <p className={`text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                  <span className={`font-semibold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Adresse:</span> {agencyData.space.address}
                                </p>
                              )}
                              {agencyData.space.city && (
                                <p className={`text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                  <span className={`font-semibold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Ville:</span> {agencyData.space.city}, {agencyData.space.country}
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                      </>
                    )}

                    {/* Action Button */}
                    {agencyData.status ? (
                      <Link
                        href={`/agencies/${agencyData.id}`}
                        className="w-full px-6 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold hover:shadow-lg hover:shadow-purple-600/30 transition-all duration-300 flex items-center justify-center gap-2 group transform hover:scale-105"
                      >
                        <Building2 className="w-5 h-5 group-hover:scale-110 transition" />
                        Visiter l'agence 
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    ) : (
                      <button
                        disabled
                        className={`w-full px-6 py-4 rounded-xl font-bold cursor-not-allowed opacity-50 ${
                          theme === 'dark' ? 'bg-slate-800 text-gray-400' : 'bg-gray-200 text-gray-600'
                        }`}
                        title="Cette agence n'est pas disponible pour le moment"
                      >
                        Agence non disponible
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Merchant Code Display */}
              {agencyData.space && agencyData.space.merchant_code && (
                <div className={`rounded-2xl border-2 p-6 transition-all duration-300 ${
                  theme === 'dark'
                    ? 'border-purple-600/50 bg-gradient-to-br from-purple-900/30 to-slate-900'
                    : 'border-purple-200 bg-gradient-to-br from-purple-50 to-white'
                }`}>
                  <p className={`text-xs font-semibold mb-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    CODE MARCHAND
                  </p>
                  <div className={`rounded-lg p-4 font-mono text-center font-bold text-lg tracking-wide ${
                    theme === 'dark'
                      ? 'bg-slate-800/50 text-purple-300 border border-slate-700'
                      : 'bg-gray-100 text-purple-700 border border-gray-300'
                  }`}>
                    {agencyData.space.merchant_code}
                  </div>
                  <p className={`text-xs text-center mt-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Utilisez ce code pour identifier cet espace commercial
                  </p>
                </div>
              )}

              {/* Report Button */}
              <Link
                href={`/ads/${adData.id}/signaler`}
                className={`w-full px-6 py-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 group transform hover:scale-105 border-2 ${
                  theme === 'dark'
                    ? 'border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:border-red-500/50'
                    : 'border-red-300 bg-red-50 text-red-600 hover:bg-red-100 hover:border-red-400'
                }`}
              >
                <Flag className="w-5 h-5 group-hover:scale-110 transition" />
                Signaler cette annonce
              </Link>
            </div>
          </div>

          {/* Related Ads Section */}
          {relatedList && relatedList.length > 0 && (
            <div className="mt-20 pt-12 border-t" style={{ borderColor: theme === 'dark' ? 'rgb(30, 41, 59)' : 'rgb(229, 231, 235)' }}>
              <div className="mb-10">
                <p className={`text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  PLUS D'ANNONCES
                </p>
                <h2 className="text-3xl font-black flex items-center gap-3">
                  <Sparkles className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                  Annonces similaires
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedList.slice(0, 3).map((relatedAd, index) => (
                  <Link
                    key={relatedAd.id}
                    href={`/ads/${relatedAd.id}`}
                    className="group h-full"
                    style={{ animation: `fadeInUp 0.6s ease-out ${index * 100}ms both` }}
                  >
                    <div className={`rounded-2xl overflow-hidden transition-all duration-500 h-full flex flex-col hover:scale-105 transform ${
                      theme === 'dark'
                        ? 'bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 hover:border-purple-600/50 hover:shadow-2xl hover:shadow-purple-900/40'
                        : 'bg-gradient-to-br from-white to-gray-50 border border-gray-200 hover:border-purple-400 hover:shadow-2xl hover:shadow-purple-300/40'
                    }`}>
                      <div className="relative h-40 overflow-hidden bg-gradient-to-br from-slate-700 to-slate-800">
                        <img
                          src={relatedAd.main_photo}
                          alt={relatedAd.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-4 flex-1 flex flex-col">
                        <h3 className={`font-bold text-sm line-clamp-2 mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          {relatedAd.title}
                        </h3>
                        <p className="text-lg font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
                          {relatedAd.price > 0 ? `${relatedAd.price.toLocaleString()} XFA` : 'Sur devis'}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

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
      `}</style>
    </div>
  );
}
