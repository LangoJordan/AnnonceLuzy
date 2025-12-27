import { useState } from 'react';
import { Link, useForm } from '@inertiajs/react';
import { useThemeStore } from '../../store';
import GuestLayout from '../../Layouts/GuestLayout';
import InputError from '../../Components/InputError';
import InputLabel from '../../Components/InputLabel';
import PrimaryButton from '../../Components/PrimaryButton';
import { Upload, AlertCircle, Check, MapPin, Building2, User, Mail, Phone } from 'lucide-react';

export default function AgencyRegister({ countries = [], cities = [] }) {
  const { theme } = useThemeStore();
  const [step, setStep] = useState(1);
  const [logoPreview, setLogoPreview] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState('');

  const { data, setData, post, processing, errors } = useForm({
    agency_name: '',
    email: '',
    password: '',
    password_confirmation: '',
    representative_name: '',
    phone: '',
    country_id: '',
    city_id: '',
    address: '',
    business_description: '',
    slogan: '',
    logo: null,
    business_type: '',
  });

  const filteredCities = selectedCountry 
    ? cities.filter(city => city.country_id == selectedCountry)
    : [];

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setData('logo', file);
      const reader = new FileReader();
      reader.onload = (event) => setLogoPreview(event.target?.result);
      reader.readAsDataURL(file);
    }
  };

  const handleCountryChange = (e) => {
    const countryId = e.target.value;
    setSelectedCountry(countryId);
    setData(prev => ({ ...prev, country_id: countryId, city_id: '' }));
  };

  const validateStep = (stepNum) => {
    if (stepNum === 1) {
      return data.agency_name && data.business_type && data.slogan;
    } else if (stepNum === 2) {
      return data.representative_name && data.email && data.phone;
    } else if (stepNum === 3) {
      return data.country_id && data.city_id && data.address;
    } else if (stepNum === 4) {
      return data.password && data.password === data.password_confirmation;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateStep(4)) return;
    
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (key === 'logo' && data[key] instanceof File) {
        formData.append('logo', data[key]);
      } else if (data[key]) {
        formData.append(key, data[key]);
      }
    });

    post('/register-agency', { forceFormData: true });
  };

  return (
    <GuestLayout>
      <div className={`min-h-screen py-12 px-4 ${theme === 'dark' ? 'bg-slate-950' : 'bg-gradient-to-br from-purple-50 to-pink-50'}`}>
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className={`text-4xl font-bold mb-2 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
              Créer une agence
            </h1>
            <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
              Rejoignez notre plateforme en tant qu'agence professionnelle
            </p>
          </div>

          {/* Steps */}
          <div className="flex items-center justify-between mb-12">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <button
                  onClick={() => s < step && setStep(s)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition ${
                    s < step
                      ? 'bg-emerald-500 text-white'
                      : s === step
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white ring-2 ring-purple-600/30'
                      : theme === 'dark'
                      ? 'bg-slate-800 text-gray-400'
                      : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  {s < step ? <Check className="w-5 h-5" /> : s}
                </button>
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

          <form onSubmit={handleSubmit}>
            {/* Step 1: Business Details */}
            {step === 1 && (
              <div className={`rounded-lg border-2 p-8 ${theme === 'dark' ? 'border-slate-700 bg-slate-900' : 'border-purple-200 bg-white'}`}>
                <h2 className={`text-2xl font-bold mb-6 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                  Détails de votre agence
                </h2>

                <div className="space-y-6 mb-8">
                  <div>
                    <label className={`block text-sm font-bold mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                      Nom de l'agence
                    </label>
                    <input
                      type="text"
                      value={data.agency_name}
                      onChange={(e) => setData('agency_name', e.target.value)}
                      className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                        errors.agency_name
                          ? theme === 'dark' ? 'border-red-500/50 bg-red-500/10' : 'border-red-300 bg-red-50'
                          : theme === 'dark' ? 'bg-slate-800 border-slate-700 text-gray-100' : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      placeholder="Ex: Tech Solutions SARL"
                    />
                    {errors.agency_name && <InputError message={errors.agency_name} />}
                  </div>

                  <div>
                    <label className={`block text-sm font-bold mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                      Type de business
                    </label>
                    <select
                      value={data.business_type}
                      onChange={(e) => setData('business_type', e.target.value)}
                      className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                        errors.business_type
                          ? theme === 'dark' ? 'border-red-500/50 bg-red-500/10' : 'border-red-300 bg-red-50'
                          : theme === 'dark' ? 'bg-slate-800 border-slate-700 text-gray-100' : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    >
                      <option value="">Sélectionner un type</option>
                      <option value="agence_immobiliere">Agence Immobilière</option>
                      <option value="agence_emploi">Agence d'Emploi</option>
                      <option value="agence_services">Agence de Services</option>
                      <option value="commerce">Commerce</option>
                      <option value="autre">Autre</option>
                    </select>
                    {errors.business_type && <InputError message={errors.business_type} />}
                  </div>

                  <div>
                    <label className={`block text-sm font-bold mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                      Slogan
                    </label>
                    <input
                      type="text"
                      value={data.slogan}
                      onChange={(e) => setData('slogan', e.target.value)}
                      className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                        errors.slogan
                          ? theme === 'dark' ? 'border-red-500/50 bg-red-500/10' : 'border-red-300 bg-red-50'
                          : theme === 'dark' ? 'bg-slate-800 border-slate-700 text-gray-100' : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      placeholder="Ex: Votre solution de confiance"
                      maxLength="100"
                    />
                    {errors.slogan && <InputError message={errors.slogan} />}
                  </div>

                  <div>
                    <label className={`block text-sm font-bold mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                      Logo (optionnel)
                    </label>
                    <div className={`relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition ${
                      theme === 'dark' ? 'border-slate-700 hover:border-slate-600 bg-slate-900/50' : 'border-gray-300 hover:border-gray-400 bg-gray-50'
                    }`}>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      {logoPreview ? (
                        <img src={logoPreview} alt="Logo" className="w-24 h-24 object-cover rounded mx-auto" />
                      ) : (
                        <div>
                          <Upload className={`w-8 h-8 mx-auto mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'}`} />
                          <p className={`font-bold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>Ajouter un logo</p>
                        </div>
                      )}
                    </div>
                  </div>
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

            {/* Step 2: Contact Information */}
            {step === 2 && (
              <div className={`rounded-lg border-2 p-8 ${theme === 'dark' ? 'border-slate-700 bg-slate-900' : 'border-purple-200 bg-white'}`}>
                <h2 className={`text-2xl font-bold mb-6 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                  Responsable et contact
                </h2>

                <div className="space-y-6 mb-8">
                  <div>
                    <label className={`block text-sm font-bold mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                      Nom du représentant
                    </label>
                    <input
                      type="text"
                      value={data.representative_name}
                      onChange={(e) => setData('representative_name', e.target.value)}
                      className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                        errors.representative_name
                          ? theme === 'dark' ? 'border-red-500/50 bg-red-500/10' : 'border-red-300 bg-red-50'
                          : theme === 'dark' ? 'bg-slate-800 border-slate-700 text-gray-100' : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      placeholder="Jean Dupont"
                    />
                    {errors.representative_name && <InputError message={errors.representative_name} />}
                  </div>

                  <div>
                    <label className={`block text-sm font-bold mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                      Email
                    </label>
                    <input
                      type="email"
                      value={data.email}
                      onChange={(e) => setData('email', e.target.value)}
                      className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                        errors.email
                          ? theme === 'dark' ? 'border-red-500/50 bg-red-500/10' : 'border-red-300 bg-red-50'
                          : theme === 'dark' ? 'bg-slate-800 border-slate-700 text-gray-100' : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      placeholder="contact@agence.com"
                    />
                    {errors.email && <InputError message={errors.email} />}
                  </div>

                  <div>
                    <label className={`block text-sm font-bold mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      value={data.phone}
                      onChange={(e) => setData('phone', e.target.value)}
                      className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                        errors.phone
                          ? theme === 'dark' ? 'border-red-500/50 bg-red-500/10' : 'border-red-300 bg-red-50'
                          : theme === 'dark' ? 'bg-slate-800 border-slate-700 text-gray-100' : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      placeholder="+33612345678"
                    />
                    {errors.phone && <InputError message={errors.phone} />}
                  </div>

                  <div>
                    <label className={`block text-sm font-bold mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                      Description de l'agence
                    </label>
                    <textarea
                      value={data.business_description}
                      onChange={(e) => setData('business_description', e.target.value)}
                      className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                        theme === 'dark' ? 'bg-slate-800 border-slate-700 text-gray-100' : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      placeholder="Décrivez votre agence..."
                      rows="4"
                    />
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

            {/* Step 3: Location */}
            {step === 3 && (
              <div className={`rounded-lg border-2 p-8 ${theme === 'dark' ? 'border-slate-700 bg-slate-900' : 'border-purple-200 bg-white'}`}>
                <h2 className={`text-2xl font-bold mb-6 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                  Localisation
                </h2>

                <div className="space-y-6 mb-8">
                  <div>
                    <label className={`block text-sm font-bold mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                      Pays
                    </label>
                    <select
                      value={data.country_id}
                      onChange={handleCountryChange}
                      className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                        errors.country_id
                          ? theme === 'dark' ? 'border-red-500/50 bg-red-500/10' : 'border-red-300 bg-red-50'
                          : theme === 'dark' ? 'bg-slate-800 border-slate-700 text-gray-100' : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    >
                      <option value="">Sélectionner un pays</option>
                      {countries.map(country => (
                        <option key={country.id} value={country.id}>{country.name}</option>
                      ))}
                    </select>
                    {errors.country_id && <InputError message={errors.country_id} />}
                  </div>

                  <div>
                    <label className={`block text-sm font-bold mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                      Ville
                    </label>
                    <select
                      value={data.city_id}
                      onChange={(e) => setData('city_id', e.target.value)}
                      disabled={!selectedCountry}
                      className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                        errors.city_id
                          ? theme === 'dark' ? 'border-red-500/50 bg-red-500/10' : 'border-red-300 bg-red-50'
                          : theme === 'dark' ? 'bg-slate-800 border-slate-700 text-gray-100' : 'bg-white border-gray-300 text-gray-900'
                      } ${!selectedCountry ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <option value="">Sélectionner une ville</option>
                      {filteredCities.map(city => (
                        <option key={city.id} value={city.id}>{city.name}</option>
                      ))}
                    </select>
                    {errors.city_id && <InputError message={errors.city_id} />}
                  </div>

                  <div>
                    <label className={`block text-sm font-bold mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                      Adresse
                    </label>
                    <input
                      type="text"
                      value={data.address}
                      onChange={(e) => setData('address', e.target.value)}
                      className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                        errors.address
                          ? theme === 'dark' ? 'border-red-500/50 bg-red-500/10' : 'border-red-300 bg-red-50'
                          : theme === 'dark' ? 'bg-slate-800 border-slate-700 text-gray-100' : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      placeholder="123 Rue de la Paix"
                    />
                    {errors.address && <InputError message={errors.address} />}
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

            {/* Step 4: Password */}
            {step === 4 && (
              <div className={`rounded-lg border-2 p-8 ${theme === 'dark' ? 'border-slate-700 bg-slate-900' : 'border-purple-200 bg-white'}`}>
                <h2 className={`text-2xl font-bold mb-6 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                  Sécurité du compte
                </h2>

                <div className={`mb-6 p-4 rounded-lg border ${theme === 'dark' ? 'border-amber-500/20 bg-amber-500/10' : 'border-amber-300 bg-amber-50'}`}>
                  <p className={`text-sm font-bold ${theme === 'dark' ? 'text-amber-300' : 'text-amber-700'}`}>
                    Votre agence sera soumise à une validation administrative après l'inscription
                  </p>
                </div>

                <div className="space-y-6 mb-8">
                  <div>
                    <label className={`block text-sm font-bold mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                      Mot de passe
                    </label>
                    <input
                      type="password"
                      value={data.password}
                      onChange={(e) => setData('password', e.target.value)}
                      className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                        errors.password
                          ? theme === 'dark' ? 'border-red-500/50 bg-red-500/10' : 'border-red-300 bg-red-50'
                          : theme === 'dark' ? 'bg-slate-800 border-slate-700 text-gray-100' : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                    {errors.password && <InputError message={errors.password} />}
                  </div>

                  <div>
                    <label className={`block text-sm font-bold mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                      Confirmer le mot de passe
                    </label>
                    <input
                      type="password"
                      value={data.password_confirmation}
                      onChange={(e) => setData('password_confirmation', e.target.value)}
                      className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                        errors.password_confirmation
                          ? theme === 'dark' ? 'border-red-500/50 bg-red-500/10' : 'border-red-300 bg-red-50'
                          : theme === 'dark' ? 'bg-slate-800 border-slate-700 text-gray-100' : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                    {errors.password_confirmation && <InputError message={errors.password_confirmation} />}
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
                    className="flex-1 py-3 rounded-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg transition disabled:opacity-50"
                  >
                    {processing ? 'Inscription...' : 'Créer mon agence'}
                  </button>
                </div>

                <p className={`text-center mt-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Déjà inscrit?{' '}
                  <Link href="/login" className="text-purple-600 dark:text-purple-400 font-bold hover:underline">
                    Se connecter
                  </Link>
                </p>
              </div>
            )}
          </form>
        </div>
      </div>
    </GuestLayout>
  );
}
