import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import Header from '../../Components/Header';
import AgencySidebar from './AgencySidebar';
import Footer from '../../Components/Footer';
import AgencyContextBanner from '../../Components/AgencyContextBanner';
import { useThemeStore } from '../../store';
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  FileText,
  Users,
  AlertCircle,
  CheckCircle,
  Eye,
  MessageSquare,
  Edit2,
  Calendar,
  Save,
  X,
  ImageIcon,
  Loader,
} from 'lucide-react';

export default function Profile({
  user = {},
  agency = {},
  spaces = [],
  activeSubscription = null,
  stats = {},
  city = {},
  country = {},
  countries = [],
  cities = [],
  selectedAgency = null,
  availableAgencies = [],
}) {
  const { theme } = useThemeStore();
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(agency?.photo || '');
  const [photoError, setPhotoError] = useState('');
  const [filteredCities, setFilteredCities] = useState(cities);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    // Agency info
    agency_name: agency?.name || '',
    slogan: agency?.slogan || '',
    description: agency?.description || '',
    // Profile photo
    photo: agency?.photo || '',
    // Contact info
    email: agency?.email || '',
    phone: agency?.phone || '',
    address: agency?.address || '',
    // Location
    country_id: agency?.country_id || '',
    city_id: agency?.city_id || '',
    // Merchant code
    merchant_code: agency?.merchant_code || '',
  });

  // Filter cities when country changes
  useEffect(() => {
    if (formData.country_id) {
      const filtered = cities.filter(c => c.country_id == formData.country_id);
      setFilteredCities(filtered);
    } else {
      setFilteredCities([]);
    }
  }, [formData.country_id, cities]);

  // Preview image when URL changes
  const validateImageUrl = (url) => {
    if (!url.trim()) {
      setPhotoPreview('');
      setPhotoError('');
      return;
    }

    const img = new Image();
    img.onload = () => {
      setPhotoPreview(url);
      setPhotoError('');
    };
    img.onerror = () => {
      setPhotoError('URL invalide ou image non accessible');
    };
    img.src = url;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'photo') {
      validateImageUrl(value);
    }

    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.agency_name.trim()) newErrors.agency_name = 'Le nom de l\'agence est requis';
    if (!formData.slogan.trim()) newErrors.slogan = 'Le slogan est requis';
    if (!formData.description.trim()) newErrors.description = 'La description est requise';
    if (!formData.email.trim()) newErrors.email = 'L\'email est requis';
    if (!formData.country_id) newErrors.country_id = 'Le pays est requis';
    if (!formData.city_id) newErrors.city_id = 'La ville est requise';
    if (!formData.address.trim()) newErrors.address = 'L\'adresse est requise';
    if (!formData.merchant_code.trim()) newErrors.merchant_code = 'Le code marchand est requis';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSaving(true);

    router.patch('/agence/profil', formData, {
      onSuccess: () => {
        setIsSaving(false);
        setSuccess(true);
        setIsEditMode(false);
        setTimeout(() => setSuccess(false), 5000);
      },
      onError: (errors) => {
        setIsSaving(false);
        setErrors(errors);
      },
    });
  };

  const themeClasses = {
    bg: theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-gray-100 text-gray-900',
    card: theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200',
    header: theme === 'dark' ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-gray-200',
    input: theme === 'dark' ? 'bg-slate-800 border-slate-700 text-gray-100' : 'bg-white border-gray-300 text-gray-900',
    label: theme === 'dark' ? 'text-gray-300' : 'text-gray-700',
    muted: theme === 'dark' ? 'text-gray-400' : 'text-gray-600',
  };

  return (
    <div className={`min-h-screen flex flex-col ${themeClasses.bg}`}>
      <Header user={user} />

      {/* Agency Context Banner */}
      <div className="border-b border-gray-200 dark:border-slate-800">
        <div className="max-w-full px-8 py-4">
          <AgencyContextBanner
            agencyName={selectedAgency?.name}
            agencyId={selectedAgency?.id}
            spaceName={selectedAgency?.spaceName}
            onChangeClick={() => window.location.href = '/select-agency'}
          />
        </div>
      </div>

      <div className="flex flex-1">
        <AgencySidebar user={user} />

        <main className="flex-1">
          {/* Header */}
          <div className={`border-b ${themeClasses.header}`}>
            <div className="max-w-7xl mx-auto px-8 py-12">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-4xl font-bold mb-2">{agency?.name || 'Mon Agence'}</h1>
                  {agency?.slogan && (
                    <p className={themeClasses.muted}>{agency.slogan}</p>
                  )}
                </div>
                {!isEditMode && (
                  <button
                    onClick={() => setIsEditMode(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg transition"
                  >
                    <Edit2 className="w-4 h-4" />
                    Modifier le profil
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-8 py-12">
            {/* Success Message */}
            {success && (
              <div className={`mb-8 p-4 rounded-lg border flex items-start gap-3 ${
                theme === 'dark'
                  ? 'border-emerald-500/20 bg-emerald-500/10'
                  : 'border-emerald-300 bg-emerald-50'
              }`}>
                <CheckCircle className={theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'} />
                <p className={`font-bold ${theme === 'dark' ? 'text-emerald-300' : 'text-emerald-700'}`}>
                  Profil mis à jour avec succès!
                </p>
              </div>
            )}

            {/* Status Alert */}
            {agency?.status === false && (
              <div className={`mb-8 p-4 rounded-lg border flex items-start gap-3 ${
                theme === 'dark'
                  ? 'border-yellow-500/20 bg-yellow-500/10'
                  : 'border-yellow-300 bg-yellow-50'
              }`}>
                <AlertCircle className={theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'} />
                <div>
                  <p className={`font-bold ${theme === 'dark' ? 'text-yellow-300' : 'text-yellow-700'}`}>
                    En attente de validation
                  </p>
                  <p className={`text-sm ${theme === 'dark' ? 'text-yellow-300' : 'text-yellow-700'}`}>
                    Votre agence est actuellement en attente de validation par l'administrateur.
                  </p>
                </div>
              </div>
            )}

            {agency?.status === true && !isEditMode && (
              <div className={`mb-8 p-4 rounded-lg border flex items-start gap-3 ${
                theme === 'dark'
                  ? 'border-emerald-500/20 bg-emerald-500/10'
                  : 'border-emerald-300 bg-emerald-50'
              }`}>
                <CheckCircle className={theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'} />
                <p className={`font-bold ${theme === 'dark' ? 'text-emerald-300' : 'text-emerald-700'}`}>
                  Agence validée et active
                </p>
              </div>
            )}

            {/* Edit Form */}
            {isEditMode ? (
              <div className={`rounded-lg border-2 p-8 ${themeClasses.card}`}>
                <h2 className="text-2xl font-bold mb-8">Modifier le profil de l'agence</h2>

                {Object.keys(errors).length > 0 && (
                  <div className={`mb-6 p-4 rounded-lg border flex items-start gap-3 ${
                    theme === 'dark' ? 'border-red-500/20 bg-red-500/10' : 'border-red-300 bg-red-50'
                  }`}>
                    <AlertCircle className={theme === 'dark' ? 'text-red-400' : 'text-red-600'} />
                    <div>
                      <p className={`font-bold mb-2 ${theme === 'dark' ? 'text-red-300' : 'text-red-700'}`}>Erreurs:</p>
                      <ul className={`text-sm space-y-1 ${theme === 'dark' ? 'text-red-300' : 'text-red-700'}`}>
                        {Object.entries(errors).map(([field, message]) => (
                          <li key={field}>• {message}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Photo Section */}
                  <div className={`rounded-lg border-2 p-6 ${theme === 'dark' ? 'border-slate-700' : 'border-gray-300'}`}>
                    <h3 className={`text-lg font-bold mb-4 ${themeClasses.label}`}>Photo du profil</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className={`block text-sm font-bold mb-2 ${themeClasses.label}`}>
                          URL de l'image
                        </label>
                        <input
                          type="url"
                          name="photo"
                          value={formData.photo}
                          onChange={handleInputChange}
                          placeholder="https://exemple.com/logo.png"
                          className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 ${themeClasses.input}`}
                        />
                        <p className={`text-xs mt-1 ${themeClasses.muted}`}>
                          Entrez une URL valide vers une image (JPG, PNG, etc.)
                        </p>
                        {photoError && (
                          <p className="text-sm mt-2 text-red-600">{photoError}</p>
                        )}
                      </div>

                      {photoPreview && !photoError && (
                        <div className={`border-2 rounded-lg p-4 ${theme === 'dark' ? 'border-slate-700 bg-slate-800' : 'border-gray-300 bg-gray-50'}`}>
                          <p className={`text-sm font-bold mb-3 ${themeClasses.label}`}>Prévisualisation:</p>
                          <img 
                            src={photoPreview} 
                            alt="Aperçu du logo" 
                            className="w-full max-w-xs h-auto rounded-lg object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Basic Information */}
                  <div className={`rounded-lg border-2 p-6 ${theme === 'dark' ? 'border-slate-700' : 'border-gray-300'}`}>
                    <h3 className={`text-lg font-bold mb-4 ${themeClasses.label}`}>Informations de base</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className={`block text-sm font-bold mb-2 ${themeClasses.label}`}>
                          Nom de l'agence *
                        </label>
                        <input
                          type="text"
                          name="agency_name"
                          value={formData.agency_name}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                            errors.agency_name ? 'border-red-500' : ''
                          } ${themeClasses.input}`}
                        />
                        {errors.agency_name && <p className="text-sm mt-1 text-red-600">{errors.agency_name}</p>}
                      </div>

                      <div>
                        <label className={`block text-sm font-bold mb-2 ${themeClasses.label}`}>
                          Slogan *
                        </label>
                        <input
                          type="text"
                          name="slogan"
                          value={formData.slogan}
                          onChange={handleInputChange}
                          maxLength="100"
                          className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                            errors.slogan ? 'border-red-500' : ''
                          } ${themeClasses.input}`}
                        />
                        <p className={`text-xs mt-1 ${themeClasses.muted}`}>
                          {formData.slogan.length}/100 caractères
                        </p>
                        {errors.slogan && <p className="text-sm mt-1 text-red-600">{errors.slogan}</p>}
                      </div>

                      <div>
                        <label className={`block text-sm font-bold mb-2 ${themeClasses.label}`}>
                          Description *
                        </label>
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          rows="5"
                          maxLength="2000"
                          className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                            errors.description ? 'border-red-500' : ''
                          } ${themeClasses.input}`}
                        />
                        <p className={`text-xs mt-1 ${themeClasses.muted}`}>
                          {formData.description.length}/2000 caractères
                        </p>
                        {errors.description && <p className="text-sm mt-1 text-red-600">{errors.description}</p>}
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className={`rounded-lg border-2 p-6 ${theme === 'dark' ? 'border-slate-700' : 'border-gray-300'}`}>
                    <h3 className={`text-lg font-bold mb-4 ${themeClasses.label}`}>Coordonnées</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className={`block text-sm font-bold mb-2 ${themeClasses.label}`}>
                          Email *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                            errors.email ? 'border-red-500' : ''
                          } ${themeClasses.input}`}
                        />
                        {errors.email && <p className="text-sm mt-1 text-red-600">{errors.email}</p>}
                      </div>

                      <div>
                        <label className={`block text-sm font-bold mb-2 ${themeClasses.label}`}>
                          Téléphone
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 ${themeClasses.input}`}
                        />
                      </div>

                      <div>
                        <label className={`block text-sm font-bold mb-2 ${themeClasses.label}`}>
                          Adresse *
                        </label>
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                            errors.address ? 'border-red-500' : ''
                          } ${themeClasses.input}`}
                        />
                        {errors.address && <p className="text-sm mt-1 text-red-600">{errors.address}</p>}
                      </div>
                    </div>
                  </div>

                  {/* Location */}
                  <div className={`rounded-lg border-2 p-6 ${theme === 'dark' ? 'border-slate-700' : 'border-gray-300'}`}>
                    <h3 className={`text-lg font-bold mb-4 ${themeClasses.label}`}>Localisation</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={`block text-sm font-bold mb-2 ${themeClasses.label}`}>
                          Pays *
                        </label>
                        <select
                          name="country_id"
                          value={formData.country_id}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                            errors.country_id ? 'border-red-500' : ''
                          } ${themeClasses.input}`}
                        >
                          <option value="">Sélectionner un pays</option>
                          {countries.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                        {errors.country_id && <p className="text-sm mt-1 text-red-600">{errors.country_id}</p>}
                      </div>

                      <div>
                        <label className={`block text-sm font-bold mb-2 ${themeClasses.label}`}>
                          Ville *
                        </label>
                        <select
                          name="city_id"
                          value={formData.city_id}
                          onChange={handleInputChange}
                          disabled={!formData.country_id}
                          className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                            errors.city_id ? 'border-red-500' : ''
                          } ${themeClasses.input} ${!formData.country_id ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          <option value="">Sélectionner une ville</option>
                          {filteredCities.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                        {errors.city_id && <p className="text-sm mt-1 text-red-600">{errors.city_id}</p>}
                      </div>
                    </div>
                  </div>

                  {/* Merchant Code */}
                  <div className={`rounded-lg border-2 p-6 ${theme === 'dark' ? 'border-slate-700' : 'border-gray-300'}`}>
                    <h3 className={`text-lg font-bold mb-4 ${themeClasses.label}`}>Code Marchand</h3>
                    
                    <div>
                      <label className={`block text-sm font-bold mb-2 ${themeClasses.label}`}>
                        Code marchand *
                      </label>
                      <input
                        type="text"
                        name="merchant_code"
                        value={formData.merchant_code}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono ${
                          errors.merchant_code ? 'border-red-500' : ''
                        } ${themeClasses.input}`}
                      />
                      {errors.merchant_code && <p className="text-sm mt-1 text-red-600">{errors.merchant_code}</p>}
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditMode(false);
                        setFormData({
                          agency_name: agency?.name || '',
                          slogan: agency?.slogan || '',
                          description: agency?.description || '',
                          photo: agency?.photo || '',
                          email: agency?.email || '',
                          phone: agency?.phone || '',
                          address: agency?.address || '',
                          country_id: agency?.country_id || '',
                          city_id: agency?.city_id || '',
                          merchant_code: agency?.merchant_code || '',
                        });
                        setErrors({});
                        setPhotoError('');
                      }}
                      className={`flex-1 py-3 rounded-lg font-bold border transition ${
                        theme === 'dark'
                          ? 'border-slate-700 bg-slate-800 hover:bg-slate-700'
                          : 'border-gray-300 bg-white hover:bg-gray-100'
                      }`}
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="flex-1 py-3 rounded-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isSaving ? (
                        <>
                          <Loader className="w-5 h-5 animate-spin" />
                          Enregistrement...
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5" />
                          Enregistrer les modifications
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <>
                {/* View Mode */}
                <div className="grid grid-cols-3 gap-6 mb-12">
                  {/* Logo Display */}
                  {agency?.photo && (
                    <div className={`rounded-lg border-2 p-6 col-span-1 ${themeClasses.card}`}>
                      <h3 className={`text-sm font-bold uppercase tracking-wider mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        Logo
                      </h3>
                      <img
                        src={agency.photo}
                        alt="Logo de l'agence"
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    </div>
                  )}

                  {/* Contact Info */}
                  <div className={`rounded-lg border-2 p-6 ${agency?.logo ? 'col-span-1' : 'col-span-2'} ${themeClasses.card}`}>
                    <h3 className={`text-sm font-bold uppercase tracking-wider mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      Coordonnées
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <Mail className="w-5 h-5 text-purple-600 flex-shrink-0 mt-1" />
                        <div>
                          <p className={`text-sm ${themeClasses.muted}`}>Email</p>
                          <p className="font-semibold break-all">{agency?.email}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Phone className="w-5 h-5 text-purple-600 flex-shrink-0 mt-1" />
                        <div>
                          <p className={`text-sm ${themeClasses.muted}`}>Téléphone</p>
                          <p className="font-semibold">{agency?.phone || 'Non défini'}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-purple-600 flex-shrink-0 mt-1" />
                        <div>
                          <p className={`text-sm ${themeClasses.muted}`}>Localisation</p>
                          <p className="font-semibold">
                            {city?.name && country?.name ? `${city.name}, ${country.name}` : 'Non définie'}
                          </p>
                          {agency?.address && (
                            <p className={`text-sm ${themeClasses.muted}`}>{agency.address}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Subscription Status */}
                  <div className={`rounded-lg border-2 p-6 ${themeClasses.card}`}>
                    <h3 className={`text-sm font-bold uppercase tracking-wider mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      Abonnement
                    </h3>
                    {activeSubscription ? (
                      <div className="space-y-4">
                        <div>
                          <p className={`text-sm ${themeClasses.muted}`}>Plan actif</p>
                          <p className="font-bold text-lg">{activeSubscription.plan_name}</p>
                        </div>
                        <div>
                          <p className={`text-sm ${themeClasses.muted}`}>Annonces restantes</p>
                          <p className="font-bold text-lg">
                            {activeSubscription.ads_remaining}/{activeSubscription.ads_limit}
                          </p>
                        </div>
                        <div>
                          <p className={`text-sm ${themeClasses.muted}`}>Valide jusqu'au</p>
                          <p className="font-semibold">
                            {new Date(activeSubscription.ends_at).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                        <div className={`mt-4 p-3 rounded-lg ${theme === 'dark' ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-emerald-50 border border-emerald-300'}`}>
                          <p className={`text-sm font-bold ${theme === 'dark' ? 'text-emerald-300' : 'text-emerald-700'}`}>
                            ✓ Actif
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className={`p-4 rounded-lg text-center ${theme === 'dark' ? 'bg-red-500/10 border border-red-500/20' : 'bg-red-50 border border-red-300'}`}>
                        <p className={`text-sm font-bold ${theme === 'dark' ? 'text-red-300' : 'text-red-700'}`}>
                          Aucun abonnement actif
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Statistics */}
                  <div className={`rounded-lg border-2 p-6 ${themeClasses.card}`}>
                    <h3 className={`text-sm font-bold uppercase tracking-wider mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      Statistiques
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-purple-600" />
                          <span className={themeClasses.muted}>Annonces</span>
                        </span>
                        <p className="font-bold text-lg">{stats?.total_ads || 0}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <Eye className="w-4 h-4 text-blue-600" />
                          <span className={themeClasses.muted}>Vues</span>
                        </span>
                        <p className="font-bold text-lg">{stats?.total_views || 0}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <MessageSquare className="w-4 h-4 text-green-600" />
                          <span className={themeClasses.muted}>Contacts</span>
                        </span>
                        <p className="font-bold text-lg">{stats?.total_contacts || 0}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                {agency?.description && (
                  <div className={`rounded-lg border-2 p-8 mb-12 ${themeClasses.card}`}>
                    <h2 className="text-2xl font-bold mb-4">À propos de l'agence</h2>
                    <p className={`leading-relaxed ${themeClasses.muted}`}>{agency.description}</p>
                  </div>
                )}

                {/* Spaces */}
                <div className={`rounded-lg border-2 p-8 mb-12 ${themeClasses.card}`}>
                  <h2 className="text-2xl font-bold mb-6">Espaces commerciaux ({spaces.length})</h2>
                  {spaces.length > 0 ? (
                    <div className="grid grid-cols-2 gap-6">
                      {spaces.map(space => (
                        <div
                          key={space.id}
                          className={`rounded-lg border-2 p-6 ${
                            theme === 'dark' ? 'border-slate-700 hover:border-slate-600' : 'border-gray-200 hover:border-gray-300'
                          } transition cursor-pointer`}
                          onClick={() => router.visit(`/agence/espaces/${space.id}`)}
                        >
                          <div className="flex items-start gap-3 mb-3">
                            <Building2 className="w-5 h-5 text-purple-600 flex-shrink-0" />
                            <div className="flex-1">
                              <h3 className="font-bold text-lg">{space.name}</h3>
                              <p className={`text-sm ${themeClasses.muted}`}>
                                {space.city_name && space.country_name ? `${space.city_name}, ${space.country_name}` : 'Localisation non définie'}
                              </p>
                            </div>
                          </div>
                          <div className="space-y-2 text-sm">
                            {space.phone && (
                              <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4" />
                                <span>{space.phone}</span>
                              </div>
                            )}
                            {space.email && (
                              <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                <span className="break-all">{space.email}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className={`text-center py-8 rounded-lg ${theme === 'dark' ? 'bg-slate-800' : 'bg-gray-50'}`}>
                      <Building2 className={`w-12 h-12 mx-auto mb-2 ${themeClasses.muted}`} />
                      <p className={themeClasses.muted}>Aucun espace commercial</p>
                    </div>
                  )}
                </div>

                {/* Employees Count */}
                <div className={`rounded-lg border-2 p-8 ${themeClasses.card}`}>
                  <h2 className="text-2xl font-bold mb-4">Équipe</h2>
                  <div className="flex items-center gap-4">
                    <Users className="w-12 h-12 text-purple-600" />
                    <div>
                      <p className={themeClasses.muted}>Total d'employés</p>
                      <p className="font-bold text-3xl">{stats?.total_employees || 0}</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
