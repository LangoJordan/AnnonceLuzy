import { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import { User, Mail, Phone, MapPin, Building2, Save, ArrowLeft, Upload, Shield, Key } from 'lucide-react';

export default function EditProfile({ user, userType }) {
  const [imagePreview, setImagePreview] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');

  const { data, setData, post, processing, errors } = useForm({
    name: user.name || '',
    email: user.email || '',
    phone: user.phone || '',
    address: user.address || '',
    city: user.city || '',
    postal_code: user.postal_code || '',
    company_name: user.company_name || '',
    description: user.description || '',
    avatar: null,
  });

  const { data: passwordData, setData: setPasswordData, post: postPassword, processing: passwordProcessing, errors: passwordErrors } = useForm({
    current_password: '',
    password: '',
    password_confirmation: '',
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setData('avatar', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const submit = (e) => {
    e.preventDefault();
    post(route('profile.update'));
  };

  const submitPassword = (e) => {
    e.preventDefault();
    postPassword(route('password.update'));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head title="Profil" />
      <Header user={user} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link href="/" className="flex items-center text-blue-600 hover:text-blue-700 mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Link>
          <h1 className="text-4xl font-bold text-gray-900">Paramètres du profil</h1>
          <p className="text-gray-600 mt-2">Gérez vos informations personnelles et vos paramètres de compte</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-3 font-medium transition border-b-2 ${
              activeTab === 'profile'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center space-x-2">
              <User className="w-5 h-5" />
              <span>Profil</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('password')}
            className={`px-4 py-3 font-medium transition border-b-2 ${
              activeTab === 'password'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Key className="w-5 h-5" />
              <span>Sécurité</span>
            </div>
          </button>
          {userType === 'agency' && (
            <button
              onClick={() => setActiveTab('company')}
              className={`px-4 py-3 font-medium transition border-b-2 ${
                activeTab === 'company'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Building2 className="w-5 h-5" />
                <span>Entreprise</span>
              </div>
            </button>
          )}
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-xl border border-gray-200 p-8">
            <form onSubmit={submit} className="space-y-8">
              {/* Avatar Section */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-4">Photo de profil</label>
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-4xl">👤</span>
                    )}
                  </div>
                  <div>
                    <label className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer">
                      <Upload className="w-4 h-4" />
                      <span>Changer la photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                    <p className="text-xs text-gray-600 mt-2">JPG, PNG, GIF jusqu'à 5 MB</p>
                  </div>
                </div>
              </div>

              {/* Name Field */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Nom complet</label>
                  <div className="relative">
                    <User className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={data.name}
                      onChange={(e) => setData('name', e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                  </div>
                  {errors.name && <p className="text-red-600 text-sm mt-2">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={data.email}
                      onChange={(e) => setData('email', e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                  </div>
                  {errors.email && <p className="text-red-600 text-sm mt-2">{errors.email}</p>}
                </div>
              </div>

              {/* Phone and Address */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Téléphone</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      value={data.phone}
                      onChange={(e) => setData('phone', e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                  </div>
                  {errors.phone && <p className="text-red-600 text-sm mt-2">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Adresse</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={data.address}
                      onChange={(e) => setData('address', e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                  </div>
                  {errors.address && <p className="text-red-600 text-sm mt-2">{errors.address}</p>}
                </div>
              </div>

              {/* City and Postal Code */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Ville</label>
                  <input
                    type="text"
                    value={data.city}
                    onChange={(e) => setData('city', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                  {errors.city && <p className="text-red-600 text-sm mt-2">{errors.city}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Code postal</label>
                  <input
                    type="text"
                    value={data.postal_code}
                    onChange={(e) => setData('postal_code', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                  {errors.postal_code && <p className="text-red-600 text-sm mt-2">{errors.postal_code}</p>}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={processing}
                  className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-5 h-5" />
                  <span>{processing ? 'Enregistrement...' : 'Enregistrer les modifications'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Company Tab */}
        {activeTab === 'company' && userType === 'agency' && (
          <div className="bg-white rounded-xl border border-gray-200 p-8">
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Nom de l'entreprise</label>
                <div className="relative">
                  <Building2 className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={data.company_name}
                    onChange={(e) => setData('company_name', e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Description de l'entreprise</label>
                <textarea
                  value={data.description}
                  onChange={(e) => setData('description', e.target.value)}
                  rows="6"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="Décrivez votre entreprise..."
                />
              </div>

              <div className="flex gap-4 pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
                >
                  <Save className="w-5 h-5" />
                  <span>Enregistrer les modifications</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Password Tab */}
        {activeTab === 'password' && (
          <div className="bg-white rounded-xl border border-gray-200 p-8">
            <form onSubmit={submitPassword} className="space-y-6 max-w-md">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Mot de passe actuel</label>
                <input
                  type="password"
                  value={passwordData.current_password}
                  onChange={(e) => setPasswordData('current_password', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
                {passwordErrors.current_password && <p className="text-red-600 text-sm mt-2">{passwordErrors.current_password}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Nouveau mot de passe</label>
                <input
                  type="password"
                  value={passwordData.password}
                  onChange={(e) => setPasswordData('password', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
                {passwordErrors.password && <p className="text-red-600 text-sm mt-2">{passwordErrors.password}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Confirmer le nouveau mot de passe</label>
                <input
                  type="password"
                  value={passwordData.password_confirmation}
                  onChange={(e) => setPasswordData('password_confirmation', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
                {passwordErrors.password_confirmation && <p className="text-red-600 text-sm mt-2">{passwordErrors.password_confirmation}</p>}
              </div>

              <div className="flex gap-4 pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={passwordProcessing}
                  className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Shield className="w-5 h-5" />
                  <span>{passwordProcessing ? 'Mise à jour...' : 'Mettre à jour le mot de passe'}</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
