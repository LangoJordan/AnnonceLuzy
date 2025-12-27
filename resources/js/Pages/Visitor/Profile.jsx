import { useState, useMemo } from 'react';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import { useThemeStore } from '../../store';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Heart,
  Eye,
  Settings,
  LogOut,
  Shield,
  Bell,
  Lock,
  Save,
  X,
  Camera,
} from 'lucide-react';

export default function Profile({ user: initialUser, profile: initialProfile, stats: initialStats, countries = [], cities = [] }) {
  const { theme } = useThemeStore();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [selectedCountryId, setSelectedCountryId] = useState(initialUser?.country_id || null);
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    newAdsNotifications: true,
    boostNotifications: true,
    agencyUpdates: false,
  });

  const { data: formData, setData: setFormData, patch, processing, errors } = useForm({
    name: initialUser?.name || '',
    email: initialUser?.email || '',
    phone: initialUser?.phone || '',
    address: initialUser?.address || '',
    country_id: initialUser?.country_id || '',
    city_id: initialUser?.city_id || '',
    description: initialProfile?.description || '',
    slogan: initialProfile?.slogan || '',
  });

  const { data: passwordData, setData: setPasswordData, patch: patchPassword, processing: passwordProcessing, errors: passwordErrors, reset: resetPassword } = useForm({
    current_password: '',
    password: '',
    password_confirmation: '',
  });

  // Filter cities based on selected country
  const availableCities = useMemo(() => {
    const countryId = formData.country_id || selectedCountryId;
    return cities.filter(city => city.country_id === parseInt(countryId));
  }, [formData.country_id, selectedCountryId, cities]);

  const handleCountryChange = (e) => {
    const countryId = parseInt(e.target.value);
    setSelectedCountryId(countryId);
    setFormData('country_id', countryId);
    setFormData('city_id', '');
  };

  const handleSave = () => {
    patch(route('visitor.profile.update'), {
      onSuccess: () => {
        setIsEditing(false);
      },
    });
  };

  const handlePasswordChange = () => {
    patchPassword(route('visitor.profile.password'), {
      onSuccess: () => {
        resetPassword();
      },
    });
  };

  const stats = initialStats || [];

  const iconMap = {
    Heart: Heart,
    Eye: Eye,
    Bell: Bell,
    Calendar: Calendar,
  };

  const ProfileStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
      {stats.map((stat) => {
        const Icon = typeof stat.icon === 'string' ? iconMap[stat.icon] : stat.icon;
        const colorClass = stat.label === 'Favoris' ? 'text-red-500' : stat.label === 'Historique' ? 'text-cyan-500' : stat.label === 'Contacts' ? 'text-yellow-500' : 'text-blue-500';

        return (
          <div key={stat.label} className={`rounded-lg border ${theme === 'dark' ? 'bg-slate-800 border-slate-700 hover:shadow-lg hover:shadow-purple-900/20' : 'bg-white border-gray-200 hover:shadow-lg hover:shadow-purple-100/50'} p-6 transition text-center`}>
            {Icon && <Icon className={`w-8 h-8 mx-auto mb-3 ${colorClass}`} />}
            <p className={`text-3xl font-black mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {stat.value}
            </p>
            <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              {stat.label}
            </p>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className={theme === 'dark' ? 'bg-slate-900 text-white' : 'bg-gray-50 text-gray-900'}>
      <Head title="Mon Profil" />
      <Header user={initialUser} />

      <main className="min-h-screen">
        {/* Header */}
        <section className={`${theme === 'dark' ? 'bg-gradient-to-b from-slate-800 to-slate-900' : 'bg-gradient-to-b from-purple-50 to-gray-50'} py-12 px-4`}>
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between flex-wrap gap-8">
              <div className="flex items-center gap-6">
                <div className={`w-20 h-20 rounded-lg flex items-center justify-center relative group border-2 overflow-hidden ${theme === 'dark' ? 'bg-slate-700 border-slate-600' : 'bg-purple-100 border-purple-300'}`}>
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-400 to-purple-600 text-white font-bold text-lg">
                    {formData.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <button className={`absolute bottom-0 right-0 p-2 rounded-lg transition ${theme === 'dark' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-600 hover:bg-purple-700'} text-white`}>
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                <div>
                  <h1 className={`text-4xl sm:text-5xl font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {formData.name}
                  </h1>
                  <p className={`flex items-center gap-2 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    <MapPin className="w-4 h-4" />
                    {formData.address || 'Non spécifié'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-8 py-3 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 transition flex items-center gap-2"
              >
                <Settings className="w-5 h-5" />
                {isEditing ? 'Annuler' : 'Modifier'}
              </button>
            </div>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-4 py-12">
          {/* Stats */}
          <ProfileStats />

          {/* Tabs */}
          <div className={`mb-8 border-b ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
            <div className="flex gap-8">
              {['profile', 'notifications', 'security'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-4 font-bold whitespace-nowrap transition-all text-sm ${
                    activeTab === tab
                      ? 'text-purple-600 border-b-2 border-purple-600'
                      : theme === 'dark'
                      ? 'text-gray-400 hover:text-gray-300'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab === 'profile' && 'Informations'}
                  {tab === 'notifications' && 'Notifications'}
                  {tab === 'security' && 'Sécurité'}
                </button>
              ))}
            </div>
          </div>

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className={`rounded-lg border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} p-8`}>
              <h2 className={`text-2xl font-black mb-8 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Informations Personnelles
              </h2>

              <div className="space-y-8">
                {/* Name */}
                <div>
                  <label className={`block text-sm font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Nom Complet
                  </label>
                  {isEditing ? (
                    <>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData('name', e.target.value)}
                        className={`w-full px-6 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm ${theme === 'dark' ? 'bg-slate-700 border border-slate-600 text-white' : 'bg-white border border-gray-300 text-gray-900'}`}
                      />
                      {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </>
                  ) : (
                    <p className={`text-lg font-semibold flex items-center gap-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>
                      <User className="w-5 h-5 text-purple-600" />
                      {formData.name}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className={`block text-sm font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Email
                  </label>
                  {isEditing ? (
                    <>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData('email', e.target.value)}
                        className={`w-full px-6 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm ${theme === 'dark' ? 'bg-slate-700 border border-slate-600 text-white' : 'bg-white border border-gray-300 text-gray-900'}`}
                      />
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </>
                  ) : (
                    <p className={`text-lg font-semibold flex items-center gap-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>
                      <Mail className="w-5 h-5 text-purple-600" />
                      {formData.email}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className={`block text-sm font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Téléphone
                  </label>
                  {isEditing ? (
                    <>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData('phone', e.target.value)}
                        className={`w-full px-6 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm ${theme === 'dark' ? 'bg-slate-700 border border-slate-600 text-white' : 'bg-white border border-gray-300 text-gray-900'}`}
                      />
                      {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                    </>
                  ) : (
                    <p className={`text-lg font-semibold flex items-center gap-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>
                      <Phone className="w-5 h-5 text-purple-600" />
                      {formData.phone || '-'}
                    </p>
                  )}
                </div>

                {/* Country */}
                <div>
                  <label className={`block text-sm font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Pays
                  </label>
                  {isEditing ? (
                    <>
                      <select
                        value={formData.country_id}
                        onChange={handleCountryChange}
                        className={`w-full px-6 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm ${theme === 'dark' ? 'bg-slate-700 border border-slate-600 text-white' : 'bg-white border border-gray-300 text-gray-900'}`}
                      >
                        <option value="">Sélectionnez un pays</option>
                        {countries.map(country => (
                          <option key={country.id} value={country.id}>
                            {country.name}
                          </option>
                        ))}
                      </select>
                      {errors.country_id && <p className="text-red-500 text-xs mt-1">{errors.country_id}</p>}
                    </>
                  ) : (
                    <p className={`text-lg font-semibold flex items-center gap-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>
                      <MapPin className="w-5 h-5 text-purple-600" />
                      {countries.find(c => c.id === formData.country_id)?.name || '-'}
                    </p>
                  )}
                </div>

                {/* City */}
                <div>
                  <label className={`block text-sm font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Ville
                  </label>
                  {isEditing ? (
                    <>
                      <select
                        value={formData.city_id}
                        onChange={(e) => setFormData('city_id', parseInt(e.target.value) || '')}
                        disabled={!formData.country_id}
                        className={`w-full px-6 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm ${theme === 'dark' ? 'bg-slate-700 border border-slate-600 text-white disabled:opacity-50' : 'bg-white border border-gray-300 text-gray-900 disabled:opacity-50'}`}
                      >
                        <option value="">Sélectionnez une ville</option>
                        {availableCities.map(city => (
                          <option key={city.id} value={city.id}>
                            {city.name}
                          </option>
                        ))}
                      </select>
                      {errors.city_id && <p className="text-red-500 text-xs mt-1">{errors.city_id}</p>}
                    </>
                  ) : (
                    <p className={`text-lg font-semibold flex items-center gap-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>
                      <MapPin className="w-5 h-5 text-purple-600" />
                      {cities.find(c => c.id === formData.city_id)?.name || '-'}
                    </p>
                  )}
                </div>

                {/* Address */}
                <div>
                  <label className={`block text-sm font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Adresse
                  </label>
                  {isEditing ? (
                    <>
                      <input
                        type="text"
                        value={formData.address}
                        onChange={(e) => setFormData('address', e.target.value)}
                        className={`w-full px-6 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm ${theme === 'dark' ? 'bg-slate-700 border border-slate-600 text-white' : 'bg-white border border-gray-300 text-gray-900'}`}
                      />
                      {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                    </>
                  ) : (
                    <p className={`text-lg font-semibold flex items-center gap-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>
                      <MapPin className="w-5 h-5 text-purple-600" />
                      {formData.address || '-'}
                    </p>
                  )}
                </div>

                {/* Bio */}
                <div>
                  <label className={`block text-sm font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Biographie
                  </label>
                  {isEditing ? (
                    <>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData('description', e.target.value)}
                        className={`w-full px-6 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 h-32 text-sm ${theme === 'dark' ? 'bg-slate-700 border border-slate-600 text-white' : 'bg-white border border-gray-300 text-gray-900'}`}
                      />
                      {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                    </>
                  ) : (
                    <p className={`text-lg font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>
                      {formData.description || '-'}
                    </p>
                  )}
                </div>

                {isEditing && (
                  <div className="flex gap-4 pt-4 border-t border-gray-200 dark:border-slate-700">
                    <button
                      onClick={handleSave}
                      disabled={processing}
                      className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <Save className="w-5 h-5" />
                      {processing ? 'Enregistrement...' : 'Enregistrer'}
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className={`flex-1 px-6 py-3 rounded-lg font-bold transition ${theme === 'dark' ? 'bg-slate-700 text-white hover:bg-slate-600' : 'border border-gray-300 text-gray-700 hover:bg-gray-100'}`}
                    >
                      Annuler
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className={`rounded-lg border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} p-8`}>
              <h2 className={`text-2xl font-black mb-8 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Préférences de Notification
              </h2>

              <div className="space-y-6">
                {[
                  {
                    id: 'emailNotifications',
                    label: 'Notifications par Email',
                    description: 'Recevez les mises à jour importantes par email',
                    icon: Mail,
                  },
                  {
                    id: 'newAdsNotifications',
                    label: 'Nouvelles Annonces',
                    description: 'Soyez notifié des nouvelles annonces correspondant à vos favoris',
                    icon: Bell,
                  },
                  {
                    id: 'boostNotifications',
                    label: 'Boosts et Promotions',
                    description: 'Recevez les notifications sur les annonces boostées',
                    icon: Heart,
                  },
                  {
                    id: 'agencyUpdates',
                    label: 'Mises à Jour des Agences',
                    description: 'Recevez les actualités des agences que vous suivez',
                    icon: Bell,
                  },
                ].map((option) => {
                  const Icon = option.icon;
                  return (
                    <div
                      key={option.id}
                      className={`flex items-center justify-between p-6 rounded-lg border transition ${theme === 'dark' ? 'bg-slate-700 border-slate-600 hover:border-purple-600' : 'border-gray-200 hover:border-purple-300'}`}
                    >
                      <div className="flex items-start gap-4">
                        <Icon className="w-6 h-6 text-purple-600 mt-1 flex-shrink-0" />
                        <div>
                          <p className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            {option.label}
                          </p>
                          <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            {option.description}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          setNotificationSettings({
                            ...notificationSettings,
                            [option.id]: !notificationSettings[option.id],
                          })
                        }
                        className={`relative inline-flex h-8 w-14 items-center rounded-full transition flex-shrink-0 ${
                          notificationSettings[option.id] ? 'bg-purple-600' : theme === 'dark' ? 'bg-slate-600' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-6 w-6 transform rounded-full bg-white transition ${
                            notificationSettings[option.id] ? 'translate-x-7' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-8">
              {/* Change Password */}
              <div className={`rounded-lg border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} p-8`}>
                <h2 className={`text-2xl font-black mb-8 flex items-center gap-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  <Lock className="w-8 h-8 text-purple-600" />
                  Sécurité
                </h2>

                <div className="space-y-6">
                  <div>
                    <label className={`block text-sm font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      Ancien mot de passe
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={passwordData.current_password}
                      onChange={(e) => setPasswordData('current_password', e.target.value)}
                      className={`w-full px-6 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm ${theme === 'dark' ? 'bg-slate-700 border border-slate-600 text-white' : 'bg-white border border-gray-300 text-gray-900'}`}
                    />
                    {passwordErrors.current_password && <p className="text-red-500 text-xs mt-1">{passwordErrors.current_password}</p>}
                  </div>

                  <div>
                    <label className={`block text-sm font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      Nouveau mot de passe
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={passwordData.password}
                      onChange={(e) => setPasswordData('password', e.target.value)}
                      className={`w-full px-6 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm ${theme === 'dark' ? 'bg-slate-700 border border-slate-600 text-white' : 'bg-white border border-gray-300 text-gray-900'}`}
                    />
                    {passwordErrors.password && <p className="text-red-500 text-xs mt-1">{passwordErrors.password}</p>}
                  </div>

                  <div>
                    <label className={`block text-sm font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      Confirmer le mot de passe
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={passwordData.password_confirmation}
                      onChange={(e) => setPasswordData('password_confirmation', e.target.value)}
                      className={`w-full px-6 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm ${theme === 'dark' ? 'bg-slate-700 border border-slate-600 text-white' : 'bg-white border border-gray-300 text-gray-900'}`}
                    />
                  </div>

                  <button
                    onClick={handlePasswordChange}
                    disabled={passwordProcessing}
                    className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 transition disabled:opacity-50"
                  >
                    {passwordProcessing ? 'Changement...' : 'Changer le mot de passe'}
                  </button>
                </div>
              </div>

              {/* Account Status */}
              <div className={`rounded-lg border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} p-8`}>
                <h2 className={`text-2xl font-black mb-8 flex items-center gap-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  <Shield className="w-8 h-8 text-green-600" />
                  Statut du Compte
                </h2>

                <div className="space-y-4">
                  <div className={`flex items-center justify-between p-4 rounded-lg border-2 border-green-500 ${theme === 'dark' ? 'bg-green-900/20' : 'bg-green-50'}`}>
                    <p className={`font-bold ${theme === 'dark' ? 'text-green-400' : 'text-green-900'}`}>
                      Compte Actif
                    </p>
                    <span className="text-green-600 font-bold">✓</span>
                  </div>

                  <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Votre compte est en bon état. Continuez à profiter de tous les avantages de notre plateforme.
                  </p>

                  <button
                    onClick={() => {
                      if (window.confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.')) {
                        const deletePassword = prompt('Veuillez entrer votre mot de passe pour confirmer:');
                        if (deletePassword) {
                          router.delete(route('visitor.profile.destroy'), {
                            data: { password: deletePassword }
                          });
                        }
                      }
                    }}
                    className={`px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition text-sm ${theme === 'dark' ? 'border border-red-700 text-red-400 hover:bg-red-900/20' : 'border border-red-600 text-red-600 hover:bg-red-50'}`}
                  >
                    <LogOut className="w-5 h-5" />
                    Supprimer le compte
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
