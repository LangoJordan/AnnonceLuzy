import { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import Header from '../../Components/Header';
import AgencySidebar from './AgencySidebar';
import Footer from '../../Components/Footer';
import AgencyContextBanner from '../../Components/AgencyContextBanner';
import { useThemeStore } from '../../store';
import {
  Plus,
  Edit2,
  Trash2,
  ChevronRight,
  MapPin,
  Users,
  FileText,
  ArrowLeft,
  AlertCircle,
} from 'lucide-react';

export default function SpaceManagement({
  user,
  selectedAgency = null,
  availableAgencies = [],
  spaces = [],
  countries = [],
  cities = [],
  agency = {},
}) {
  const { theme } = useThemeStore();
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState('create');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    merchant_code: '',
    country_id: '',
    city_id: '',
    address: '',
    phone: '',
    email: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddSpace = () => {
    setFormMode('create');
    setFormData({
      name: '',
      description: '',
      merchant_code: '',
      country_id: '',
      city_id: '',
      address: '',
      phone: '',
      email: '',
    });
    setErrors({});
    setShowForm(true);
  };

  const handleDeleteSpace = (spaceId) => {
    if (
      confirm(
        'Êtes-vous sûr de vouloir supprimer cet espace commercial? Cette action est irréversible.'
      )
    ) {
      router.delete(`/agence/espaces/${spaceId}`, {
        onError: (errors) => setErrors(errors),
      });
    }
  };

  const handleSubmitSpace = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const url = formMode === 'create' ? '/agence/espaces' : '/agence/espaces';
    const method = formMode === 'create' ? 'post' : 'patch';

    router[method](url, formData, {
      onError: (errors) => {
        setErrors(errors);
        setIsSubmitting(false);
      },
      onSuccess: () => {
        setShowForm(false);
        setIsSubmitting(false);
      },
    });
  };

  const bgClass = theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-gray-100 text-gray-900';
  const cardBgClass = theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200';
  const headerBgClass = theme === 'dark' ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-gray-200';
  const inputBgClass = theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-300 text-gray-900';
  const buttonBgClass = 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg';

  if (showForm) {
    return (
      <div className={`min-h-screen flex flex-col ${bgClass}`}>
        <Header user={user} />
        <div className="flex flex-1">
          <AgencySidebar user={user} />
          <main className="flex-1">
            <div className={`border-b ${headerBgClass}`}>
              <div className="max-w-7xl mx-auto px-8 py-8">
                <h1 className="text-4xl font-bold mb-3">
                  {formMode === 'create' ? 'Créer un nouvel espace' : 'Modifier l\'espace'}
                </h1>
              </div>
            </div>

            <div className="max-w-2xl mx-auto px-8 py-12">
              <form onSubmit={handleSubmitSpace} className={`rounded-lg border-2 p-8 ${cardBgClass}`}>
                {Object.keys(errors).length > 0 && (
                  <div className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${theme === 'dark' ? 'bg-red-500/10 border border-red-500/30' : 'bg-red-50 border border-red-300'}`}>
                    <AlertCircle className={`w-5 h-5 flex-shrink-0 ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`} />
                    <div>
                      {Object.entries(errors).map(([field, messages]) => (
                        <p key={field} className={theme === 'dark' ? 'text-red-400' : 'text-red-700'}>
                          {Array.isArray(messages) ? messages.join(', ') : messages}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    <label className={`block text-sm font-bold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      Nom de l'espace
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={`w-full px-4 py-2 rounded-lg border ${inputBgClass} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                      required
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-bold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className={`w-full px-4 py-2 rounded-lg border ${inputBgClass} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                      rows="3"
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-bold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      Code marchand
                    </label>
                    <input
                      type="text"
                      name="merchant_code"
                      value={formData.merchant_code}
                      onChange={(e) => setFormData({ ...formData, merchant_code: e.target.value })}
                      className={`w-full px-4 py-2 rounded-lg border ${inputBgClass} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-bold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        Pays
                      </label>
                      <select
                        name="country_id"
                        value={formData.country_id}
                        onChange={(e) => setFormData({ ...formData, country_id: e.target.value })}
                        className={`w-full px-4 py-2 rounded-lg border ${inputBgClass} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                        required
                      >
                        <option value="">Sélectionner un pays</option>
                        {countries.map((country) => (
                          <option key={country.id} value={country.id}>
                            {country.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className={`block text-sm font-bold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        Ville
                      </label>
                      <select
                        name="city_id"
                        value={formData.city_id}
                        onChange={(e) => setFormData({ ...formData, city_id: e.target.value })}
                        className={`w-full px-4 py-2 rounded-lg border ${inputBgClass} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                        required
                      >
                        <option value="">Sélectionner une ville</option>
                        {cities.map((city) => (
                          <option key={city.id} value={city.id}>
                            {city.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className={`block text-sm font-bold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      Adresse
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className={`w-full px-4 py-2 rounded-lg border ${inputBgClass} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-bold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        Téléphone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className={`w-full px-4 py-2 rounded-lg border ${inputBgClass} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                        required
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-bold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className={`w-full px-4 py-2 rounded-lg border ${inputBgClass} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 mt-8">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`flex-1 ${buttonBgClass} px-6 py-3 rounded-lg font-bold transition disabled:opacity-50`}
                  >
                    {isSubmitting ? 'Création en cours...' : 'Créer l\'espace'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className={`flex-1 px-6 py-3 rounded-lg font-bold transition ${
                      theme === 'dark'
                        ? 'border border-slate-600 bg-slate-800 hover:bg-slate-700'
                        : 'border border-gray-300 bg-white hover:bg-gray-100'
                    }`}
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col ${bgClass}`}>
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
          <div className={`border-b ${headerBgClass}`}>
            <div className="max-w-7xl mx-auto px-8 py-12">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-4xl font-bold mb-3">Espaces commerciaux</h1>
                  <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}>
                    Gérez les emplacements de votre agence et les employés assignés
                  </p>
                </div>
                <button
                  onClick={handleAddSpace}
                  className={`flex items-center gap-2 ${buttonBgClass} px-6 py-3 rounded-lg font-bold transition`}
                >
                  <Plus className="w-5 h-5" />
                  Nouvel espace
                </button>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-8 py-12">
            {spaces && spaces.length > 0 ? (
              <div className="grid gap-6">
                {spaces.map((space) => (
                  <Link
                    key={space.id}
                    href={route('agency.space-details', { id: space.id })}
                    className={`rounded-lg border-2 p-6 transition hover:shadow-lg block ${cardBgClass}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold mb-2">{space.name}</h3>
                        <p className={`mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>
                          {space.description || 'Aucune description'}
                        </p>
                        <div className="flex items-center gap-6">
                          <div className="flex items-center gap-2">
                            <MapPin
                              className={`w-5 h-5 ${
                                theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
                              }`}
                            />
                            <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                              {space.city?.name || 'Localisation non définie'}
                              {space.country?.name && `, ${space.country.name}`}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users
                              className={`w-5 h-5 ${
                                theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
                              }`}
                            />
                            <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                              {space.employee_count} employé
                              {space.employee_count !== 1 ? 's' : ''}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FileText
                              className={`w-5 h-5 ${
                                theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
                              }`}
                            />
                            <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                              {space.ad_count} annonce
                              {space.ad_count !== 1 ? 's' : ''}
                            </span>
                          </div>
                        </div>
                      </div>
                      <ChevronRight
                        className={`w-6 h-6 flex-shrink-0 ${
                          theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
                        }`}
                      />
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className={`rounded-lg border-2 p-12 text-center ${cardBgClass}`}>
                <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-bold mb-2">Aucun espace commercial</h3>
                <p className={`mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Créez votre premier espace commercial pour commencer à gérer vos annonces
                </p>
                <button
                  onClick={handleAddSpace}
                  className={`${buttonBgClass} px-6 py-3 rounded-lg font-bold inline-flex items-center gap-2`}
                >
                  <Plus className="w-5 h-5" />
                  Créer un espace
                </button>
              </div>
            )}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
