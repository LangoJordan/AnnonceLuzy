import { useState } from 'react';
import { useThemeStore } from '../store';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import { ArrowLeft, Send, AlertTriangle, Check, Flag, AlertOctagon, UserX, Copy, Clock, HelpCircle, MapPin, DollarSign, Eye } from 'lucide-react';
import { Head, Link } from '@inertiajs/react';

const REPORT_REASONS = [
  { 
    id: 'spam', 
    label: 'Spam ou arnaque', 
    description: 'Contenu dupliqué, faux contact ou offre trompeuse',
    icon: AlertOctagon,
    color: 'from-red-500 to-orange-500'
  },
  { 
    id: 'fraud', 
    label: 'Fraude ou escroquerie', 
    description: 'Activité suspecte, vol ou arnaque évidente',
    icon: AlertTriangle,
    color: 'from-orange-500 to-red-500'
  },
  { 
    id: 'inappropriate', 
    label: 'Contenu inapproprié', 
    description: 'Contenu offensant, violent ou illégal',
    icon: Flag,
    color: 'from-red-500 to-pink-500'
  },
  { 
    id: 'harassment', 
    label: 'Harcèlement', 
    description: 'Commentaires abusifs ou menaces',
    icon: UserX,
    color: 'from-pink-500 to-red-500'
  },
  { 
    id: 'duplicate', 
    label: 'Annonce en doublon', 
    description: 'Même annonce publiée plusieurs fois',
    icon: Copy,
    color: 'from-blue-500 to-purple-500'
  },
  { 
    id: 'expired', 
    label: 'Annonce expirée', 
    description: 'Offre ou service n\'est plus disponible',
    icon: Clock,
    color: 'from-amber-500 to-orange-500'
  },
];

export default function ReportAd({ ad = {}, user = null }) {
  const { theme } = useThemeStore();

  // Proper ad data handling - MUST be before useState
  const adData = ad || {};

  // Get main image - use main_photo directly
  const mainImage = adData.main_photo || 'https://via.placeholder.com/400x300';

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    reason: '',
    description: '',
    email: user?.email || '',
    ad_id: adData.id,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.reason) newErrors.reason = 'Veuillez sélectionner une raison';
    if (!formData.description.trim()) newErrors.description = 'Veuillez décrire le problème';
    if (formData.description.length < 10) newErrors.description = 'La description doit contenir au moins 10 caractères';
    if (!formData.email.trim()) newErrors.email = 'L\'email est requis';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const selectedReason = REPORT_REASONS.find(r => r.id === formData.reason);
      const reasonLabel = selectedReason?.label || formData.reason;

      const concatenatedReason = `Raison du signalement: ${reasonLabel}\n\nDétails supplémentaires:\n${formData.description}\n\nEmail du signaleur: ${formData.email}`;

      const payload = {
        ad_id: formData.ad_id,
        reason: concatenatedReason,
        user_id: user?.id || 0,
      };

      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || '',
        },
        credentials: 'same-origin',
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setSuccess(true);
        setStep(2);
      } else {
        const errorData = await response.json();
        setErrors({ submit: errorData.message || 'Une erreur s\'est produite lors de l\'envoi' });
      }
    } catch (error) {
      setErrors({ submit: 'Erreur de connexion' });
    } finally {
      setLoading(false);
    }
  };

  const selectedReasonData = REPORT_REASONS.find(r => r.id === formData.reason);

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900'}`}>
      <Head title="Signaler une annonce" />
      <Header user={user} />

      <main className="flex-1">
        {step === 1 && (
          <>
            {/* Navigation Bar */}
            <div className={`border-b sticky top-16 z-40 backdrop-blur-sm ${theme === 'dark' ? 'border-slate-800 bg-slate-950/80' : 'border-gray-200 bg-white/80'}`}>
              <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                <Link href={`/ads/${adData.id}`} className="inline-flex items-center text-purple-600 font-semibold text-sm hover:text-purple-700 group">
                  <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition" />
                  Retour à l'annonce
                </Link>
              </div>
            </div>

            {/* Hero Section - Ad Preview */}
            <section className={`relative overflow-hidden ${theme === 'dark' ? 'bg-slate-900' : 'bg-gradient-to-b from-gray-50 to-white'}`}>
              <div className="absolute inset-0 overflow-hidden">
                <div className={`absolute top-0 right-0 w-96 h-96 rounded-full opacity-10 blur-3xl ${theme === 'dark' ? 'bg-red-600' : 'bg-red-400'}`}></div>
                <div className={`absolute bottom-0 left-0 w-96 h-96 rounded-full opacity-10 blur-3xl ${theme === 'dark' ? 'bg-orange-600' : 'bg-orange-400'}`}></div>
              </div>

              <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Ad Image */}
                  <div className="lg:col-span-1">
                    <div className="relative group rounded-2xl overflow-hidden border-4 border-white shadow-2xl h-64 lg:h-80 bg-gray-300 flex items-center justify-center">
                      {mainImage && mainImage !== 'https://via.placeholder.com/400x300' ? (
                        <>
                          <img
                            src={mainImage}
                            alt={adData.title || 'Annonce'}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            onError={(e) => {
                              console.error('Image load error:', e);
                              e.target.style.display = 'none';
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                        </>
                      ) : (
                        <div className="text-center">
                          <Eye className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-500">Pas d'image disponible</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Ad Info */}
                  <div className="lg:col-span-2 flex flex-col justify-center">
                    <div className="mb-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-red-500/20' : 'bg-red-100'}`}>
                          <AlertTriangle className={`w-6 h-6 ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`} />
                        </div>
                        <div>
                          <h1 className={`text-3xl lg:text-4xl font-black ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                            Signaler une annonce
                          </h1>
                          <p className={theme === 'dark' ? 'text-gray-400 text-sm' : 'text-gray-600 text-sm'}>
                            Aidez-nous à maintenir une communauté sûre et de confiance
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Ad Details Card */}
                    <div className={`rounded-2xl border-2 p-6 space-y-4 ${theme === 'dark' ? 'border-slate-700 bg-slate-800/50' : 'border-gray-200 bg-white'}`}>
                      <div>
                        <p className={`text-xs font-bold uppercase tracking-wider mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          Annonce signalée
                        </p>
                        <h2 className={`text-2xl font-bold line-clamp-2 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                          {adData.title || 'Titre indisponible'}
                        </h2>
                      </div>

                      <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-slate-700">
                        {/* Location */}
                        <div>
                          <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            Localisation
                          </p>
                          <p className={`font-semibold flex items-center gap-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>
                            <MapPin className="w-4 h-4 text-blue-600" />
                            {adData.location || 'Non spécifiée'}
                          </p>
                        </div>

                        {/* Address */}
                        {adData.address && (
                          <div>
                            <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                              Adresse
                            </p>
                            <p className={`font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>
                              {adData.address}
                            </p>
                          </div>
                        )}

                        {/* Views */}
                        {adData.views_count !== undefined && (
                          <div className={`flex items-center gap-1 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            <Eye className="w-4 h-4" />
                            {adData.views_count.toLocaleString()} vues
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Form Section */}
            <section className={theme === 'dark' ? 'bg-slate-950' : 'bg-gray-50'}>
              <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="max-w-3xl mx-auto">
                  <form onSubmit={handleSubmit} className="space-y-12">
                    {/* Reasons Grid */}
                    <div>
                      <div className="mb-8">
                        <h2 className={`text-2xl font-black mb-2 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                          Raison du signalement
                        </h2>
                        <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                          Sélectionnez la raison qui correspond le mieux à votre signalement
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {REPORT_REASONS.map(reason => {
                          const Icon = reason.icon;
                          const isSelected = formData.reason === reason.id;
                          return (
                            <button
                              key={reason.id}
                              type="button"
                              onClick={() => {
                                setFormData(prev => ({ ...prev, reason: reason.id }));
                                if (errors.reason) setErrors(prev => ({ ...prev, reason: '' }));
                              }}
                              className={`group relative overflow-hidden rounded-2xl border-2 p-6 text-left transition-all duration-300 ${
                                isSelected
                                  ? theme === 'dark'
                                    ? 'border-purple-500 bg-purple-900/20 ring-2 ring-purple-500/50'
                                    : 'border-purple-500 bg-purple-50 ring-2 ring-purple-500/30'
                                  : theme === 'dark'
                                  ? 'border-slate-700 bg-slate-800 hover:border-slate-600'
                                  : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                              }`}
                            >
                              {/* Background Gradient */}
                              <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 bg-gradient-to-br ${reason.color} transition-opacity duration-300`}></div>

                              {/* Content */}
                              <div className="relative z-10">
                                <div className="flex items-start gap-3 mb-3">
                                  <div className={`p-3 rounded-xl flex-shrink-0 bg-gradient-to-br ${reason.color} text-white`}>
                                    <Icon className="w-5 h-5" />
                                  </div>
                                  {isSelected && (
                                    <div className="ml-auto flex-shrink-0">
                                      <div className="w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center">
                                        <Check className="w-3 h-3 text-white" />
                                      </div>
                                    </div>
                                  )}
                                </div>
                                <p className={`font-bold text-base mb-1 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                                  {reason.label}
                                </p>
                                <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                  {reason.description}
                                </p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                      {errors.reason && <p className={`text-sm mt-4 flex items-center gap-2 ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>
                        <AlertTriangle className="w-4 h-4" />
                        {errors.reason}
                      </p>}
                    </div>

                    {/* Reason Details Card */}
                    {selectedReasonData && (
                      <div className={`rounded-2xl border-2 p-6 ${theme === 'dark' ? 'border-blue-600/30 bg-blue-900/10' : 'border-blue-200 bg-blue-50'}`}>
                        <p className={`text-sm font-semibold flex items-center gap-2 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-700'}`}>
                          <HelpCircle className="w-4 h-4" />
                          {selectedReasonData.label} sélectionné
                        </p>
                      </div>
                    )}

                    {/* Description */}
                    <div>
                      <label className={`block text-lg font-bold mb-4 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                        Détails supplémentaires
                      </label>
                      <div className={`relative rounded-2xl border-2 overflow-hidden ${
                        errors.description
                          ? theme === 'dark' ? 'border-red-500/50 bg-red-500/10' : 'border-red-300 bg-red-50'
                          : theme === 'dark' ? 'border-slate-700 bg-slate-800' : 'border-gray-300 bg-white'
                      }`}>
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          placeholder="Décrivez en détail les problèmes que vous avez identifiés..."
                          rows="6"
                          maxLength="1000"
                          className={`w-full px-6 py-4 border-0 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-transparent resize-none ${
                            theme === 'dark' ? 'text-gray-100 placeholder-gray-600' : 'text-gray-900 placeholder-gray-500'
                          }`}
                        />
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <p className={`text-xs font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          {formData.description.length}/1000 caractères
                        </p>
                        {errors.description && <p className={`text-xs ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>{errors.description}</p>}
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className={`block text-lg font-bold mb-4 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                        Votre adresse email
                      </label>
                      <div className={`relative rounded-2xl border-2 overflow-hidden ${
                        errors.email
                          ? theme === 'dark' ? 'border-red-500/50 bg-red-500/10' : 'border-red-300 bg-red-50'
                          : theme === 'dark' ? 'border-slate-700 bg-slate-800' : 'border-gray-300 bg-white'
                      }`}>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="votre@email.com"
                          className={`w-full px-6 py-4 border-0 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-transparent ${
                            theme === 'dark' ? 'text-gray-100 placeholder-gray-600' : 'text-gray-900 placeholder-gray-500'
                          }`}
                        />
                      </div>
                      {errors.email && <p className={`text-sm mt-3 ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>{errors.email}</p>}
                    </div>

                    {/* Info Box */}
                    <div className={`rounded-2xl border-2 p-6 ${theme === 'dark' ? 'border-amber-600/30 bg-amber-900/10' : 'border-amber-200 bg-amber-50'}`}>
                      <p className={`font-semibold flex items-start gap-3 ${theme === 'dark' ? 'text-amber-300' : 'text-amber-900'}`}>
                        <Clock className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <span>
                          Votre signalement sera examiné par notre équipe de modération sous 24 heures. Nous vous remercions de votre vigilance !
                        </span>
                      </p>
                    </div>

                    {/* Error Alert */}
                    {errors.submit && (
                      <div className={`rounded-2xl border-2 p-6 flex items-start gap-4 ${theme === 'dark' ? 'border-red-600/30 bg-red-900/10' : 'border-red-200 bg-red-50'}`}>
                        <AlertTriangle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`} />
                        <p className={theme === 'dark' ? 'text-red-300' : 'text-red-700'}>{errors.submit}</p>
                      </div>
                    )}

                    {/* Buttons */}
                    <div className="flex gap-4 pt-8 border-t border-gray-200 dark:border-slate-800">
                      <Link
                        href={`/ads/${adData.id}`}
                        className={`flex-1 py-4 rounded-xl font-bold text-center transition-all duration-200 ${
                          theme === 'dark'
                            ? 'border-2 border-slate-700 bg-slate-800 hover:bg-slate-700 text-gray-100'
                            : 'border-2 border-gray-300 bg-white hover:bg-gray-50 text-gray-900'
                        }`}
                      >
                        Annuler
                      </Link>
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 py-4 rounded-xl font-bold bg-gradient-to-r from-red-500 via-red-600 to-orange-600 text-white hover:shadow-2xl transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2 group"
                      >
                        <Send className="w-5 h-5 group-hover:translate-x-1 transition" />
                        {loading ? 'Envoi en cours...' : 'Envoyer le signalement'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </section>
          </>
        )}

        {step === 2 && success && (
          <>
            {/* Success Hero */}
            <section className={`relative overflow-hidden ${theme === 'dark' ? 'bg-slate-900' : 'bg-gradient-to-b from-gray-50 to-white'}`}>
              <div className="absolute inset-0 overflow-hidden">
                <div className={`absolute top-0 right-0 w-96 h-96 rounded-full opacity-10 blur-3xl ${theme === 'dark' ? 'bg-emerald-600' : 'bg-emerald-400'}`}></div>
                <div className={`absolute bottom-0 left-0 w-96 h-96 rounded-full opacity-10 blur-3xl ${theme === 'dark' ? 'bg-blue-600' : 'bg-blue-400'}`}></div>
              </div>

              <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="text-center">
                  {/* Success Icon */}
                  <div className="mb-8 flex justify-center">
                    <div className={`relative w-24 h-24 rounded-full flex items-center justify-center ${theme === 'dark' ? 'bg-emerald-500/20' : 'bg-emerald-100'}`}>
                      <div className="absolute inset-0 rounded-full animate-pulse opacity-75 border-4 border-emerald-500"></div>
                      <Check className={`w-12 h-12 ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`} />
                    </div>
                  </div>

                  {/* Heading */}
                  <h1 className={`text-4xl lg:text-5xl font-black mb-4 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                    Signalement envoyé!
                  </h1>
                  <p className={`text-lg mb-12 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Merci d'avoir aidé à maintenir notre communauté sûre et de confiance.
                  </p>

                  {/* Info Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className={`rounded-2xl border-2 p-6 ${theme === 'dark' ? 'border-blue-600/30 bg-blue-900/10' : 'border-blue-200 bg-blue-50'}`}>
                      <div className={`text-3xl font-black mb-3 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
                        24h
                      </div>
                      <p className={`text-sm font-semibold ${theme === 'dark' ? 'text-blue-300' : 'text-blue-900'}`}>
                        Délai d'examen
                      </p>
                    </div>

                    <div className={`rounded-2xl border-2 p-6 ${theme === 'dark' ? 'border-green-600/30 bg-green-900/10' : 'border-green-200 bg-green-50'}`}>
                      <div className={`text-3xl font-black mb-3 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
                        ✓
                      </div>
                      <p className={`text-sm font-semibold ${theme === 'dark' ? 'text-green-300' : 'text-green-900'}`}>
                        Actions appropriées
                      </p>
                    </div>

                    <div className={`rounded-2xl border-2 p-6 ${theme === 'dark' ? 'border-purple-600/30 bg-purple-900/10' : 'border-purple-200 bg-purple-50'}`}>
                      <div className={`text-3xl font-black mb-3 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`}>
                        🛡️
                      </div>
                      <p className={`text-sm font-semibold ${theme === 'dark' ? 'text-purple-300' : 'text-purple-900'}`}>
                        Communauté protégée
                      </p>
                    </div>
                  </div>

                  {/* Process Info */}
                  <div className={`rounded-2xl border-2 p-8 mb-12 text-left ${theme === 'dark' ? 'border-slate-700 bg-slate-800/50' : 'border-gray-200 bg-white'}`}>
                    <h3 className={`text-lg font-bold mb-6 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                      Que se passe-t-il ensuite ?
                    </h3>
                    <ul className={`space-y-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      <li className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-xs">
                          1
                        </div>
                        <span>Notre équipe examinera attentivement votre signalement</span>
                      </li>
                      <li className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-xs">
                          2
                        </div>
                        <span>Si fondé, l'annonce sera supprimée ou modérée en conséquence</span>
                      </li>
                      <li className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-xs">
                          3
                        </div>
                        <span>Les signalements non fondés seront archivés de manière confidentielle</span>
                      </li>
                    </ul>
                  </div>

                  {/* Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                      href="/"
                      className={`px-8 py-4 rounded-xl font-bold transition-all duration-200 ${
                        theme === 'dark'
                          ? 'border-2 border-slate-700 bg-slate-800 hover:bg-slate-700 text-gray-100'
                          : 'border-2 border-gray-300 bg-white hover:bg-gray-50 text-gray-900'
                      }`}
                    >
                      Accueil
                    </Link>
                    <Link
                      href="/ads"
                      className="px-8 py-4 rounded-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-2xl transition-all duration-200"
                    >
                      Consulter les annonces
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
