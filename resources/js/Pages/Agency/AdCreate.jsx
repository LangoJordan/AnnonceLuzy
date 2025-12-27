import { useState } from 'react';
import { Link, router, useForm } from '@inertiajs/react';
import Header from '../../Components/Header';
import AgencySidebar from './AgencySidebar';
import { useThemeStore } from '../../store';
import {
  ArrowLeft,
  Plus,
  X,
  MapPin,
  Tag,
  DollarSign,
  FileText,
  Image as ImageIcon,
  AlertCircle,
  Check,
  Loader,
} from 'lucide-react';

export default function AdCreate({ user = {}, spaces = [], countries = [], cities = [], categories = [] }) {
  const { theme } = useThemeStore();
  const [step, setStep] = useState(1);
  const [mainPhotoPreview, setMainPhotoPreview] = useState(null);
  const [additionalPhotoPreviews, setAdditionalPhotoPreviews] = useState([]);
  const [fieldErrors, setFieldErrors] = useState({});

  const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
    title: '',
    category_id: '',
    subcategory_id: '',
    space_id: '',
    country_id: '',
    city_id: '',
    address: '',
    description: '',
    price: '',
    price_description: 'fixe',
    main_photo: '',
    additional_photos: [],
    contact_phone: '',
    contact_email: user?.email || '',
  });

  const selectedCategory = categories.find(c => c.id === parseInt(data.category_id));

  const validateStep = (stepNum) => {
    const newErrors = {};

    if (stepNum === 1) {
      if (!data.title.trim()) newErrors.title = 'Le titre est requis';
      if (data.title.length < 10) newErrors.title = 'Le titre doit contenir au moins 10 caractères';
      if (!data.category_id) newErrors.category_id = 'Veuillez sélectionner une catégorie';
      if (!data.subcategory_id) newErrors.subcategory_id = 'Veuillez sélectionner une sous-catégorie';
    } else if (stepNum === 2) {
      if (!data.space_id) newErrors.space_id = 'Veuillez sélectionner un espace commercial';
      if (!data.country_id) newErrors.country_id = 'Veuillez sélectionner un pays';
      if (!data.city_id) newErrors.city_id = 'Veuillez sélectionner une ville';
      if (!data.address.trim()) newErrors.address = 'L\'adresse est requise';
    } else if (stepNum === 3) {
      if (!data.description.trim()) newErrors.description = 'La description est requise';
      if (data.description.length < 20) newErrors.description = 'La description doit contenir au moins 20 caractères';
      if (!data.main_photo.trim()) newErrors.main_photo = 'L\'URL de la photo principale est requise';
      if (!isValidUrl(data.main_photo)) newErrors.main_photo = 'L\'URL de la photo n\'est pas valide';
    }

    setFieldErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData(name, value);
    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleMainPhotoUrlChange = (url) => {
    setData('main_photo', url);
    if (url.trim() && isValidUrl(url)) {
      setMainPhotoPreview(url);
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.main_photo;
        return newErrors;
      });
    }
  };

  const handleAddAdditionalPhotoUrl = (url) => {
    if (!url.trim() || !isValidUrl(url)) {
      setFieldErrors(prev => ({
        ...prev,
        additional_photos: 'L\'URL n\'est pas valide'
      }));
      return;
    }

    if (data.additional_photos.length >= 5) {
      setFieldErrors(prev => ({
        ...prev,
        additional_photos: 'Maximum 5 photos supplémentaires'
      }));
      return;
    }

    setData('additional_photos', [...data.additional_photos, url]);
    setAdditionalPhotoPreviews(prev => [...prev, url]);
    setFieldErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors.additional_photos;
      return newErrors;
    });
  };

  const removeAdditionalPhoto = (index) => {
    setData('additional_photos', data.additional_photos.filter((_, i) => i !== index));
    setAdditionalPhotoPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = {};
    if (!data.price_description) newErrors.price_description = 'Veuillez sélectionner une option de prix';
    if (!data.contact_email.trim()) newErrors.contact_email = 'L\'email est requis';
    
    if (Object.keys(newErrors).length > 0) {
      setFieldErrors(newErrors);
      return;
    }

    post(route('ads.store'), {
      onSuccess: () => {
        router.visit('/agence/annonces');
      },
    });
  };

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <Header user={user} />

      <div className="flex flex-1">
        <AgencySidebar user={user} />

        <main className="flex-1">
          <div className={theme === 'dark' ? 'bg-slate-900/50 border-b border-slate-800' : 'bg-white border-b border-gray-200'}>
            <div className="max-w-4xl mx-auto px-8 py-8">
              <Link
                href="/agence/annonces"
                className={`inline-flex items-center gap-2 mb-6 font-bold transition ${theme === 'dark' ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-700'}`}
              >
                <ArrowLeft className="w-4 h-4" />
                Retour aux annonces
              </Link>
              <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                Créer une nouvelle annonce
              </h1>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto px-8 py-12">
            {/* Steps Indicator */}
            <div className="flex items-center justify-between mb-12">
              {[1, 2, 3, 4].map((s) => (
                <div key={s} className="flex items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition cursor-pointer ${
                      s < step
                        ? 'bg-emerald-500 text-white'
                        : s === step
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white ring-2 ring-purple-600/30'
                        : theme === 'dark'
                        ? 'bg-slate-800 text-gray-400'
                        : 'bg-gray-300 text-gray-600'
                    }`}
                    onClick={() => s < step && setStep(s)}
                  >
                    {s < step ? <Check className="w-5 h-5" /> : s}
                  </div>
                  {s < 4 && (
                    <div
                      className={`h-1 flex-1 mx-3 transition ${
                        s < step
                          ? 'bg-emerald-500'
                          : theme === 'dark'
                          ? 'bg-slate-800'
                          : 'bg-gray-300'
                      }`}
                    ></div>
                  )}
                </div>
              ))}
            </div>

            {/* Success Message */}
            {recentlySuccessful && (
              <div className={`mb-6 p-4 rounded-lg border flex items-start gap-3 ${theme === 'dark' ? 'border-emerald-500/20 bg-emerald-500/10' : 'border-emerald-300 bg-emerald-50'}`}>
                <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`} />
                <p className={theme === 'dark' ? 'text-emerald-300' : 'text-emerald-700'}>✓ Annonce créée avec succès!</p>
              </div>
            )}

            {/* Error Messages */}
            {Object.keys(errors).length > 0 && (
              <div className={`mb-6 p-4 rounded-lg border flex items-start gap-3 ${theme === 'dark' ? 'border-red-500/20 bg-red-500/10' : 'border-red-300 bg-red-50'}`}>
                <AlertCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`} />
                <div>
                  <p className={`font-bold ${theme === 'dark' ? 'text-red-300' : 'text-red-700'}`}>Erreurs du formulaire:</p>
                  <ul className={`text-sm mt-2 ${theme === 'dark' ? 'text-red-300' : 'text-red-700'}`}>
                    {Object.entries(errors).map(([field, message]) => (
                      <li key={field}>• {message}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Step 1: Category & Title */}
            {step === 1 && (
              <div>
                <h2 className={`text-2xl font-bold mb-8 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                  Détails de l'annonce
                </h2>

                <div className={`rounded-lg border p-6 mb-8 ${theme === 'dark' ? 'border-slate-700 bg-slate-900' : 'border-gray-200 bg-white'}`}>
                  <div className="mb-6">
                    <label className={`block text-sm font-bold mb-3 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                      Titre de l'annonce
                    </label>
                    <input
                      type="text"
                      name="title"
                      placeholder="Ex: Développeur Full Stack Senior React/Laravel"
                      value={data.title}
                      onChange={handleInputChange}
                      maxLength="100"
                      className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                        errors.title || fieldErrors.title
                          ? theme === 'dark' ? 'border-red-500/50 bg-red-500/10' : 'border-red-300 bg-red-50'
                          : theme === 'dark' ? 'bg-slate-800 border-slate-700 text-gray-100' : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                    <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      {data.title.length}/100 caractères
                    </p>
                    {(errors.title || fieldErrors.title) && <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>{errors.title || fieldErrors.title}</p>}
                  </div>

                  <div className="mb-6">
                    <label className={`block text-sm font-bold mb-3 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                      Catégorie
                    </label>
                    <div className="grid grid-cols-4 gap-3">
                      {categories.map(category => (
                        <button
                          key={category.id}
                          type="button"
                          onClick={() => {
                            setData('category_id', category.id);
                            setData('subcategory_id', '');
                          }}
                          className={`p-4 rounded-lg border-2 transition text-center ${
                            parseInt(data.category_id) === category.id
                              ? theme === 'dark'
                                ? 'border-purple-500 bg-slate-800 ring-2 ring-purple-500/30'
                                : 'border-purple-500 bg-purple-50 ring-2 ring-purple-500/30'
                              : theme === 'dark'
                              ? 'border-slate-700 hover:border-slate-600'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <p className={`text-sm font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                            {category.name}
                          </p>
                        </button>
                      ))}
                    </div>
                    {(errors.category_id || fieldErrors.category_id) && <p className={`text-sm mt-2 ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>{errors.category_id || fieldErrors.category_id}</p>}
                  </div>

                  {selectedCategory && (
                    <div>
                      <label className={`block text-sm font-bold mb-3 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                        Sous-catégorie
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {selectedCategory.subcategories.map(subcat => (
                          <button
                            key={subcat.id}
                            type="button"
                            onClick={() => {
                              setData('subcategory_id', subcat.id);
                            }}
                            className={`p-3 rounded-lg border-2 transition font-semibold text-sm ${
                              parseInt(data.subcategory_id) === subcat.id
                                ? theme === 'dark'
                                  ? 'border-purple-500 bg-slate-800'
                                  : 'border-purple-500 bg-purple-50'
                                : theme === 'dark'
                                ? 'border-slate-700 hover:border-slate-600'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            {subcat.name}
                          </button>
                        ))}
                      </div>
                      {(errors.subcategory_id || fieldErrors.subcategory_id) && <p className={`text-sm mt-2 ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>{errors.subcategory_id || fieldErrors.subcategory_id}</p>}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => validateStep(1) && setStep(2)}
                  className="w-full py-3 rounded-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg transition"
                >
                  Continuer
                </button>
              </div>
            )}

            {/* Step 2: Location & Space */}
            {step === 2 && (
              <div>
                <h2 className={`text-2xl font-bold mb-8 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                  Localisation
                </h2>

                <div className={`rounded-lg border p-6 mb-8 ${theme === 'dark' ? 'border-slate-700 bg-slate-900' : 'border-gray-200 bg-white'}`}>
                  <div className="mb-6">
                    <label className={`block text-sm font-bold mb-3 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                      Espace commercial
                    </label>
                    <select
                      name="space_id"
                      value={data.space_id}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                        errors.space_id || fieldErrors.space_id
                          ? theme === 'dark' ? 'border-red-500/50 bg-red-500/10' : 'border-red-300 bg-red-50'
                          : theme === 'dark' ? 'bg-slate-800 border-slate-700 text-gray-100' : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    >
                      <option value="">Sélectionner un espace</option>
                      {spaces.map(space => (
                        <option key={space.id} value={space.id}>{space.name}</option>
                      ))}
                    </select>
                    {(errors.space_id || fieldErrors.space_id) && <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>{errors.space_id || fieldErrors.space_id}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className={`block text-sm font-bold mb-3 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                        Pays
                      </label>
                      <select
                        name="country_id"
                        value={data.country_id}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                          errors.country_id || fieldErrors.country_id
                            ? theme === 'dark' ? 'border-red-500/50 bg-red-500/10' : 'border-red-300 bg-red-50'
                            : theme === 'dark' ? 'bg-slate-800 border-slate-700 text-gray-100' : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      >
                        <option value="">Sélectionner un pays</option>
                        {countries.map(country => (
                          <option key={country.id} value={country.id}>{country.name}</option>
                        ))}
                      </select>
                      {(errors.country_id || fieldErrors.country_id) && <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>{errors.country_id || fieldErrors.country_id}</p>}
                    </div>

                    <div>
                      <label className={`block text-sm font-bold mb-3 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                        Ville
                      </label>
                      <select
                        name="city_id"
                        value={data.city_id}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                          errors.city_id || fieldErrors.city_id
                            ? theme === 'dark' ? 'border-red-500/50 bg-red-500/10' : 'border-red-300 bg-red-50'
                            : theme === 'dark' ? 'bg-slate-800 border-slate-700 text-gray-100' : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      >
                        <option value="">Sélectionner une ville</option>
                        {cities.map(city => (
                          <option key={city.id} value={city.id}>{city.name}</option>
                        ))}
                      </select>
                      {(errors.city_id || fieldErrors.city_id) && <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>{errors.city_id || fieldErrors.city_id}</p>}
                    </div>
                  </div>

                  <div>
                    <label className={`block text-sm font-bold mb-3 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                      Adresse précise
                    </label>
                    <input
                      type="text"
                      name="address"
                      placeholder="Ex: 123 Rue de la Paix, 75000"
                      value={data.address}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                        errors.address || fieldErrors.address
                          ? theme === 'dark' ? 'border-red-500/50 bg-red-500/10' : 'border-red-300 bg-red-50'
                          : theme === 'dark' ? 'bg-slate-800 border-slate-700 text-gray-100' : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                    {(errors.address || fieldErrors.address) && <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>{errors.address || fieldErrors.address}</p>}
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className={`flex-1 py-3 rounded-lg font-bold border transition ${theme === 'dark' ? 'border-slate-700 bg-slate-800 hover:bg-slate-700 text-gray-100' : 'border-gray-300 bg-white hover:bg-gray-100 text-gray-900'}`}
                  >
                    Retour
                  </button>
                  <button
                    type="button"
                    onClick={() => validateStep(2) && setStep(3)}
                    className="flex-1 py-3 rounded-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg transition"
                  >
                    Continuer
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Description & Media */}
            {step === 3 && (
              <div>
                <h2 className={`text-2xl font-bold mb-8 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                  Description et médias
                </h2>

                <div className={`rounded-lg border p-6 mb-8 ${theme === 'dark' ? 'border-slate-700 bg-slate-900' : 'border-gray-200 bg-white'}`}>
                  <div className="mb-6">
                    <label className={`block text-sm font-bold mb-3 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                      Description détaillée
                    </label>
                    <textarea
                      name="description"
                      placeholder="Décrivez votre annonce en détail..."
                      value={data.description}
                      onChange={handleInputChange}
                      rows="6"
                      maxLength="2000"
                      className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                        errors.description || fieldErrors.description
                          ? theme === 'dark' ? 'border-red-500/50 bg-red-500/10' : 'border-red-300 bg-red-50'
                          : theme === 'dark' ? 'bg-slate-800 border-slate-700 text-gray-100' : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                    <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      {data.description.length}/2000 caractères
                    </p>
                    {(errors.description || fieldErrors.description) && <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>{errors.description || fieldErrors.description}</p>}
                  </div>

                  <div className="mb-6">
                    <label className={`block text-sm font-bold mb-3 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                      URL de la photo principale
                    </label>
                    <div className="space-y-3">
                      <input
                        type="url"
                        placeholder="https://exemple.com/photo.jpg"
                        value={data.main_photo}
                        onChange={(e) => handleMainPhotoUrlChange(e.target.value)}
                        className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                          errors.main_photo || fieldErrors.main_photo
                            ? theme === 'dark' ? 'border-red-500/50 bg-red-500/10' : 'border-red-300 bg-red-50'
                            : theme === 'dark' ? 'bg-slate-800 border-slate-700 text-gray-100' : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
                      {(errors.main_photo || fieldErrors.main_photo) && <p className={`text-sm ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>{errors.main_photo || fieldErrors.main_photo}</p>}
                    </div>

                    {mainPhotoPreview && (
                      <div className="mt-4">
                        <p className={`text-sm font-bold mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>Aperçu:</p>
                        <img
                          src={mainPhotoPreview}
                          alt="Main photo preview"
                          className="w-full h-48 object-cover rounded-lg border-2 border-purple-500"
                          onError={() => {
                            setMainPhotoPreview(null);
                            setFieldErrors(prev => ({
                              ...prev,
                              main_photo: 'Impossible de charger l\'image. Vérifiez l\'URL.'
                            }));
                          }}
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className={`block text-sm font-bold mb-3 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                      Photos supplémentaires (max 5)
                    </label>
                    <div className="space-y-3">
                      <input
                        type="url"
                        placeholder="https://exemple.com/photo2.jpg"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddAdditionalPhotoUrl(e.target.value);
                            e.target.value = '';
                          }
                        }}
                        className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                          theme === 'dark' ? 'bg-slate-800 border-slate-700 text-gray-100' : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
                      <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        Appuyez sur Entrée pour ajouter une URL
                      </p>
                      {fieldErrors.additional_photos && <p className={`text-sm ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>{fieldErrors.additional_photos}</p>}
                    </div>

                    {additionalPhotoPreviews.length > 0 && (
                      <div className="mt-6">
                        <p className={`text-sm font-bold mb-3 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                          Aperçus ({additionalPhotoPreviews.length}/5):
                        </p>
                        <div className="grid grid-cols-5 gap-3">
                          {additionalPhotoPreviews.map((preview, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={preview}
                                alt={`Additional ${index}`}
                                className="w-full h-20 object-cover rounded border-2 border-purple-500"
                                onError={() => removeAdditionalPhoto(index)}
                              />
                              <button
                                type="button"
                                onClick={() => removeAdditionalPhoto(index)}
                                className={`absolute top-1 right-1 p-1 rounded opacity-0 group-hover:opacity-100 transition ${
                                  theme === 'dark' ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'
                                }`}
                              >
                                <X className="w-4 h-4 text-white" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className={`flex-1 py-3 rounded-lg font-bold border transition ${theme === 'dark' ? 'border-slate-700 bg-slate-800 hover:bg-slate-700 text-gray-100' : 'border-gray-300 bg-white hover:bg-gray-100 text-gray-900'}`}
                  >
                    Retour
                  </button>
                  <button
                    type="button"
                    onClick={() => validateStep(3) && setStep(4)}
                    className="flex-1 py-3 rounded-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg transition"
                  >
                    Continuer
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Pricing & Contact */}
            {step === 4 && (
              <div>
                <h2 className={`text-2xl font-bold mb-8 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                  Tarification et contact
                </h2>

                <div className={`rounded-lg border p-6 mb-8 ${theme === 'dark' ? 'border-slate-700 bg-slate-900' : 'border-gray-200 bg-white'}`}>
                  <div className="mb-6">
                    <label className={`block text-sm font-bold mb-3 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                      Prix (optionnel)
                    </label>
                    <div className="flex gap-3">
                      <input
                        type="number"
                        name="price"
                        placeholder="0"
                        value={data.price}
                        onChange={handleInputChange}
                        min="0"
                        className={`flex-1 px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                          theme === 'dark' ? 'bg-slate-800 border-slate-700 text-gray-100' : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
                      <select
                        name="price_description"
                        value={data.price_description}
                        onChange={handleInputChange}
                        className={`px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                          theme === 'dark' ? 'bg-slate-800 border-slate-700 text-gray-100' : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      >
                        <option value="fixe">Fixe</option>
                        <option value="negociable">Négociable</option>
                        <option value="sur-demande">Sur demande</option>
                        <option value="gratuit">Gratuit</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className={`block text-sm font-bold mb-3 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                        Téléphone de contact
                      </label>
                      <input
                        type="tel"
                        name="contact_phone"
                        placeholder="+33612345678"
                        value={data.contact_phone}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                          errors.contact_phone
                            ? theme === 'dark' ? 'border-red-500/50 bg-red-500/10' : 'border-red-300 bg-red-50'
                            : theme === 'dark' ? 'bg-slate-800 border-slate-700 text-gray-100' : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
                      {errors.contact_phone && <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>{errors.contact_phone}</p>}
                    </div>

                    <div>
                      <label className={`block text-sm font-bold mb-3 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                        Email de contact
                      </label>
                      <input
                        type="email"
                        name="contact_email"
                        value={data.contact_email}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                          errors.contact_email
                            ? theme === 'dark' ? 'border-red-500/50 bg-red-500/10' : 'border-red-300 bg-red-50'
                            : theme === 'dark' ? 'bg-slate-800 border-slate-700 text-gray-100' : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
                      {errors.contact_email && <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>{errors.contact_email}</p>}
                    </div>
                  </div>

                  <div className={`p-4 rounded-lg border ${theme === 'dark' ? 'border-emerald-500/20 bg-emerald-500/10' : 'border-emerald-300 bg-emerald-50'}`}>
                    <p className={`text-sm font-bold ${theme === 'dark' ? 'text-emerald-300' : 'text-emerald-700'}`}>
                      Votre annonce sera en attente de validation avant publication
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className={`flex-1 py-3 rounded-lg font-bold border transition ${theme === 'dark' ? 'border-slate-700 bg-slate-800 hover:bg-slate-700 text-gray-100' : 'border-gray-300 bg-white hover:bg-gray-100 text-gray-900'}`}
                  >
                    Retour
                  </button>
                  <button
                    type="submit"
                    disabled={processing}
                    className="flex-1 py-3 rounded-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {processing ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin" />
                        Création en cours...
                      </>
                    ) : (
                      <>
                        <Check className="w-5 h-5" />
                        Créer l'annonce
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>
        </main>
      </div>


    </div>
  );
}
