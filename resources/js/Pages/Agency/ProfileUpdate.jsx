import { useState } from 'react';
import { Link } from '@inertiajs/react';
import Header from '../../Components/Header';
import AgencySidebar from './AgencySidebar';
import { useThemeStore } from '../../store';
import {
  Upload,
  Save,
  AlertCircle,
  Check,
  MapPin,
  Building2,
  FileText,
  Image as ImageIcon,
} from 'lucide-react';

export default function ProfileUpdate({ user = {}, agency = {}, countries = [], cities = [] }) {
  const { theme } = useThemeStore();
  const [logoPreview, setLogoPreview] = useState(agency?.photo || null);
  const [selectedCountry, setSelectedCountry] = useState(agency?.country_id || '');
  const [formData, setFormData] = useState({
    agency_name: agency?.name || '',
    slogan: agency?.slogan || '',
    description: agency?.description || '',
    merchant_code: agency?.merchant_code || '',
    logo: null,
    country_id: agency?.country_id || '',
    city_id: agency?.city_id || '',
    address: agency?.address || '',
    phone: agency?.phone || '',
    email: agency?.email || user?.email || '',
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const filteredCities = selectedCountry
    ? cities.filter(city => city.country_id == selectedCountry)
    : [];

  const validateForm = () => {
    const newErrors = {};
    if (!formData.agency_name.trim()) newErrors.agency_name = 'Le nom de l\'agence est requis';
    if (!formData.slogan.trim()) newErrors.slogan = 'Le slogan est requis';
    if (!formData.description.trim()) newErrors.description = 'La description est requise';
    if (!formData.country_id) newErrors.country_id = 'Le pays est requis';
    if (!formData.city_id) newErrors.city_id = 'La ville est requise';
    if (!formData.address.trim()) newErrors.address = 'L\'adresse est requise';
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

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, logo: file }));
      const reader = new FileReader();
      reader.onload = (event) => setLogoPreview(event.target?.result);
      reader.readAsDataURL(file);
    }
  };

  const handleCountryChange = (value) => {
    setSelectedCountry(value);
    setFormData(prev => ({ ...prev, country_id: value, city_id: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formDataToSubmit = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === 'logo' && formData[key] instanceof File) {
        formDataToSubmit.append('logo', formData[key]);
      } else if (key !== 'logo') {
        formDataToSubmit.append(key, formData[key] || '');
      }
    });

    try {
      const response = await fetch('/agence/profil', {
        method: 'PATCH',
        headers: {
          'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]')?.content,
        },
        body: formDataToSubmit,
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 5000);
      } else {
        const errorData = await response.json();
        setErrors({ submit: errorData.message || 'Une erreur s\'est produite lors de la mise à jour' });
      }
    } catch (error) {
      setErrors({ submit: 'Erreur de connexion' });
    }
  };

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <Header user={user} />

      <div className="flex flex-1">
        <AgencySidebar user={user} />

        <main className="flex-1">
          <div className={theme === 'dark' ? 'bg-slate-900/50 border-b border-slate-800' : 'bg-white border-b border-gray-200'}>
            <div className="max-w-4xl mx-auto px-8 py-12">
              <h1 className="text-4xl font-bold mb-3">Profil de l'agence</h1>
              <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}>
                Mettez à jour les informations de votre agence
              </p>
            </div>
          </div>

          <div className="max-w-4xl mx-auto px-8 py-12">
            {success && (
              <div className={`mb-8 p-4 rounded-lg border flex items-center gap-3 ${theme === 'dark' ? 'border-emerald-500/20 bg-emerald-500/10' : 'border-emerald-300 bg-emerald-50'}`}>
                <Check className={`w-5 h-5 ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`} />
                <p className={`font-bold ${theme === 'dark' ? 'text-emerald-300' : 'text-emerald-700'}`}>
                  Votre profil a été mis à jour avec succès!
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Logo Section */}
              <div className={`rounded-lg border-2 p-8 ${theme === 'dark' ? 'border-slate-700 bg-slate-900' : 'border-gray-200 bg-white'}`}>
                <h2 className={`text-2xl font-bold mb-6 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                  Logo de l'agence
                </h2>

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
                    <img src={logoPreview} alt="Logo" className="w-32 h-32 object-cover rounded mx-auto" />
                  ) : (
                    <div>
                      <ImageIcon className={`w-12 h-12 mx-auto mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'}`} />
                      <p className={`font-bold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>Cliquez pour changer le logo</p>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>JPG, PNG jusqu'à 5MB</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Basic Information */}
              <div className={`rounded-lg border-2 p-8 ${theme === 'dark' ? 'border-slate-700 bg-slate-900' : 'border-gray-200 bg-white'}`}>
                <h2 className={`text-2xl font-bold mb-6 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                  Informations générales
                </h2>

                <div className="space-y-6">
                  <div>
                    <label className={`block text-sm font-bold mb-3 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                      Nom de l'agence
                    </label>
                    <input
                      type="text"
                      name="agency_name"
                      value={formData.agency_name}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                        errors.agency_name
                          ? theme === 'dark' ? 'border-red-500/50 bg-red-500/10' : 'border-red-300 bg-red-50'
                          : theme === 'dark' ? 'bg-slate-800 border-slate-700 text-gray-100' : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                    {errors.agency_name && <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>{errors.agency_name}</p>}
                  </div>

                  <div>
                    <label className={`block text-sm font-bold mb-3 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                      Slogan
                    </label>
                    <input
                      type="text"
                      name="slogan"
                      value={formData.slogan}
                      onChange={handleInputChange}
                      maxLength="100"
                      className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                        errors.slogan
                          ? theme === 'dark' ? 'border-red-500/50 bg-red-500/10' : 'border-red-300 bg-red-50'
                          : theme === 'dark' ? 'bg-slate-800 border-slate-700 text-gray-100' : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                    {errors.slogan && <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>{errors.slogan}</p>}
                  </div>

                  <div>
                    <label className={`block text-sm font-bold mb-3 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="5"
                      maxLength="2000"
                      className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                        errors.description
                          ? theme === 'dark' ? 'border-red-500/50 bg-red-500/10' : 'border-red-300 bg-red-50'
                          : theme === 'dark' ? 'bg-slate-800 border-slate-700 text-gray-100' : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                    <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      {formData.description.length}/2000 caractères
                    </p>
                    {errors.description && <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>{errors.description}</p>}
                  </div>

                  <div>
                    <label className={`block text-sm font-bold mb-3 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                      Code marchand
                    </label>
                    <input
                      type="text"
                      name="merchant_code"
                      value={formData.merchant_code}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                        errors.merchant_code
                          ? theme === 'dark' ? 'border-red-500/50 bg-red-500/10' : 'border-red-300 bg-red-50'
                          : theme === 'dark' ? 'bg-slate-800 border-slate-700 text-gray-100' : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                    {errors.merchant_code && <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>{errors.merchant_code}</p>}
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className={`rounded-lg border-2 p-8 ${theme === 'dark' ? 'border-slate-700 bg-slate-900' : 'border-gray-200 bg-white'}`}>
                <h2 className={`text-2xl font-bold mb-6 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                  Coordonnées
                </h2>

                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className={`block text-sm font-bold mb-3 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                          theme === 'dark' ? 'bg-slate-800 border-slate-700 text-gray-100' : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
                    </div>

                    <div>
                      <label className={`block text-sm font-bold mb-3 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                        Téléphone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                          theme === 'dark' ? 'bg-slate-800 border-slate-700 text-gray-100' : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className={`rounded-lg border-2 p-8 ${theme === 'dark' ? 'border-slate-700 bg-slate-900' : 'border-gray-200 bg-white'}`}>
                <h2 className={`text-2xl font-bold mb-6 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                  Localisation
                </h2>

                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className={`block text-sm font-bold mb-3 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                        Pays
                      </label>
                      <select
                        value={formData.country_id}
                        onChange={(e) => handleCountryChange(e.target.value)}
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
                      {errors.country_id && <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>{errors.country_id}</p>}
                    </div>

                    <div>
                      <label className={`block text-sm font-bold mb-3 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                        Ville
                      </label>
                      <select
                        value={formData.city_id}
                        onChange={(e) => handleInputChange({ target: { name: 'city_id', value: e.target.value } })}
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
                      {errors.city_id && <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>{errors.city_id}</p>}
                    </div>
                  </div>

                  <div>
                    <label className={`block text-sm font-bold mb-3 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                      Adresse
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                        errors.address
                          ? theme === 'dark' ? 'border-red-500/50 bg-red-500/10' : 'border-red-300 bg-red-50'
                          : theme === 'dark' ? 'bg-slate-800 border-slate-700 text-gray-100' : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                    {errors.address && <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>{errors.address}</p>}
                  </div>
                </div>
              </div>

              {errors.submit && (
                <div className={`p-4 rounded-lg border flex items-start gap-3 ${theme === 'dark' ? 'border-red-500/20 bg-red-500/10' : 'border-red-300 bg-red-50'}`}>
                  <AlertCircle className={theme === 'dark' ? 'text-red-400' : 'text-red-600'} />
                  <p className={theme === 'dark' ? 'text-red-300' : 'text-red-700'}>{errors.submit}</p>
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <Link
                  href="/agence"
                  className={`flex-1 py-3 rounded-lg font-bold border text-center transition ${theme === 'dark' ? 'border-slate-700 bg-slate-800 hover:bg-slate-700 text-gray-100' : 'border-gray-300 bg-white hover:bg-gray-100 text-gray-900'}`}
                >
                  Annuler
                </Link>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg transition flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  Sauvegarder les modifications
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>

    </div>
  );
}
