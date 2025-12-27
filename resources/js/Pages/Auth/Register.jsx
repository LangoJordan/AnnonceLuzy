import { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle,
  Phone,
  MapPin,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { useThemeStore } from '../../store';

export default function Register({ countries, cities }) {
  const { theme } = useThemeStore();

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [userType, setUserType] = useState('visitor');

  const { data, setData, post, processing, errors } = useForm({
    name: '',
    email: '',
    phone: '',
    country_id: '',
    city_id: '',
    address: '',
    password: '',
    password_confirmation: '',
    user_type: 'visitor',
    terms: false,
  });

  const submit = (e) => {
    e.preventDefault();
    post(route('register'));
  };

  const handleContinue = () => currentStep < 4 && setCurrentStep(currentStep + 1);
  const handleBack = () => currentStep > 1 && setCurrentStep(currentStep - 1);

  const handlePhoneChange = (e) => {
    const filtered = e.target.value.replace(/[^\d+\s()\-]/g, '');
    setData('phone', filtered);
  };

  const userTypes = [
    { id: 'visitor', label: 'Visiteur', description: 'Consulter et sauvegarder des annonces' },
    { id: 'agency', label: 'Agence', description: 'Publier et gérer des annonces', needsVerification: true },
  ];

  const steps = [
    { number: 1, title: 'Compte' },
    { number: 2, title: 'Contact' },
    { number: 3, title: 'Lieu' },
    { number: 4, title: 'Sécurité' },
  ];

  const filteredCities = cities.filter(
    (city) => city.country_id === Number(data.country_id)
  );

  const isStep1Valid = userType && data.name && data.email;
  const isStep2Valid = data.phone;
  const isStep3Valid = data.country_id && data.city_id;

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 py-8 ${
      theme === 'dark'
        ? 'bg-gradient-to-br from-slate-950 to-slate-900'
        : 'bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50'
    }`}>
      <Head title="Inscription" />

      {/* Decorative background elements */}
      {theme === 'light' && (
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-0 left-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-20 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>
      )}

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-black text-lg mx-auto mb-5">
            L
          </div>
          <h1 className={`text-3xl font-black mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Créer un compte
          </h1>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Étape {currentStep} sur 4
          </p>
        </div>

        {/* Progress bar */}
        <div className="mb-8 flex gap-1">
          {steps.map((step) => (
            <div
              key={step.number}
              className={`flex-1 h-1 rounded-full transition-colors ${
                step.number <= currentStep
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600'
                  : theme === 'dark'
                  ? 'bg-slate-800'
                  : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        {/* Form Container */}
        <form onSubmit={submit} className={`space-y-6 p-6 rounded-2xl backdrop-blur-sm ${
          theme === 'dark'
            ? 'bg-slate-900/80 border border-slate-800'
            : 'bg-white/80 border border-gray-200 shadow-lg'
        }`}>

          {/* STEP 1 */}
          {currentStep === 1 && (
            <div className="space-y-5 animate-fadeIn">
              <h2 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Quel type de compte ?
              </h2>

              {userTypes.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => {
                    setUserType(type.id);
                    setData('user_type', type.id);
                  }}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                    userType === type.id
                      ? theme === 'dark'
                        ? 'border-purple-600 bg-purple-600/10'
                        : 'border-purple-500 bg-purple-100/30'
                      : theme === 'dark'
                      ? 'border-slate-800'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="flex gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      userType === type.id
                        ? 'bg-purple-600 border-purple-600'
                        : theme === 'dark'
                        ? 'border-gray-400'
                        : 'border-gray-400'
                    }`}>
                      {userType === type.id && <CheckCircle className="w-3 h-3 text-white" />}
                    </div>
                    <div>
                      <p className={`font-semibold text-sm ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {type.label}
                      </p>
                      <p className={`text-xs ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {type.description}
                      </p>
                      {type.needsVerification && (
                        <p className={`text-xs mt-1 flex items-center gap-1 ${
                          theme === 'dark' ? 'text-yellow-500' : 'text-yellow-600'
                        }`}>
                          <AlertCircle className="w-3 h-3" /> Vérification requise
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              ))}

              <input
                type="text"
                placeholder="Nom complet"
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
                className={`w-full px-4 py-2.5 rounded-lg border transition ${
                  theme === 'dark'
                    ? 'bg-slate-800 border-slate-700 text-white placeholder:text-gray-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500'
                    : 'bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500'
                } ${errors.name ? 'border-red-500 focus:ring-red-500' : ''}`}
                required
              />
              {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}

              <input
                type="email"
                placeholder="Email"
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
                className={`w-full px-4 py-2.5 rounded-lg border transition ${
                  theme === 'dark'
                    ? 'bg-slate-800 border-slate-700 text-white placeholder:text-gray-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500'
                    : 'bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500'
                } ${errors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
                required
              />
              {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
            </div>
          )}

          {/* STEP 2 */}
          {currentStep === 2 && (
            <div className="animate-fadeIn space-y-4">
              <div>
                <label className={`block text-sm font-semibold mb-2 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  Téléphone
                </label>
                <div className="relative">
                  <Phone className={`absolute left-3.5 top-3.5 w-5 h-5 ${
                    theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
                  }`} />
                  <input
                    type="text"
                    placeholder="+1 (555) 123-4567"
                    value={data.phone}
                    onChange={handlePhoneChange}
                    className={`w-full pl-11 pr-4 py-2.5 rounded-lg border transition ${
                      theme === 'dark'
                        ? 'bg-slate-800 border-slate-700 text-white placeholder:text-gray-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500'
                        : 'bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500'
                    } ${errors.phone ? 'border-red-500 focus:ring-red-500' : ''}`}
                    required
                  />
                </div>
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-fadeIn">
              <div>
                <label className={`block text-sm font-semibold mb-2 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  Pays
                </label>
                <div className="relative">
                  <MapPin className={`absolute left-3.5 top-3.5 w-5 h-5 pointer-events-none ${
                    theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
                  }`} />
                  <select
                    value={data.country_id}
                    onChange={(e) => {
                      setData('country_id', e.target.value);
                      setData('city_id', '');
                    }}
                    className={`w-full pl-11 pr-4 py-2.5 rounded-lg border transition appearance-none ${
                      theme === 'dark'
                        ? 'bg-slate-800 border-slate-700 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500'
                        : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-500'
                    } ${errors.country_id ? 'border-red-500 focus:ring-red-500' : ''}`}
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
                {errors.country_id && <p className="text-red-500 text-xs mt-1">{errors.country_id}</p>}
              </div>

              <div>
                <label className={`block text-sm font-semibold mb-2 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  Ville
                </label>
                <div className="relative">
                  <MapPin className={`absolute left-3.5 top-3.5 w-5 h-5 pointer-events-none ${
                    theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
                  }`} />
                  <select
                    value={data.city_id}
                    onChange={(e) => setData('city_id', e.target.value)}
                    className={`w-full pl-11 pr-4 py-2.5 rounded-lg border transition appearance-none ${
                      theme === 'dark'
                        ? 'bg-slate-800 border-slate-700 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500 disabled:opacity-50'
                        : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 disabled:opacity-50'
                    } ${errors.city_id ? 'border-red-500 focus:ring-red-500' : ''}`}
                    disabled={!data.country_id}
                    required
                  >
                    <option value="">Sélectionner une ville</option>
                    {filteredCities.map((city) => (
                      <option key={city.id} value={city.id}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.city_id && <p className="text-red-500 text-xs mt-1">{errors.city_id}</p>}
              </div>

              <input
                type="text"
                placeholder="Adresse (optionnel)"
                value={data.address}
                onChange={(e) => setData('address', e.target.value)}
                className={`w-full px-4 py-2.5 rounded-lg border transition ${
                  theme === 'dark'
                    ? 'bg-slate-800 border-slate-700 text-white placeholder:text-gray-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500'
                    : 'bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500'
                }`}
              />
            </div>
          )}

          {/* STEP 4 */}
          {currentStep === 4 && (
            <div className="space-y-4 animate-fadeIn">
              <div>
                <label className={`block text-sm font-semibold mb-2 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  Mot de passe
                </label>
                <div className="relative">
                  <Lock className={`absolute left-3.5 top-3.5 w-5 h-5 ${
                    theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
                  }`} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                    className={`w-full pl-11 pr-11 py-2.5 rounded-lg border transition ${
                      theme === 'dark'
                        ? 'bg-slate-800 border-slate-700 text-white placeholder:text-gray-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500'
                        : 'bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500'
                    } ${errors.password ? 'border-red-500 focus:ring-red-500' : ''}`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-3.5 top-3.5 transition ${
                      theme === 'dark'
                        ? 'text-gray-600 hover:text-gray-400'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>

              <div>
                <label className={`block text-sm font-semibold mb-2 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  Confirmation
                </label>
                <div className="relative">
                  <Lock className={`absolute left-3.5 top-3.5 w-5 h-5 ${
                    theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
                  }`} />
                  <input
                    type={showPasswordConfirm ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={data.password_confirmation}
                    onChange={(e) => setData('password_confirmation', e.target.value)}
                    className={`w-full pl-11 pr-11 py-2.5 rounded-lg border transition ${
                      theme === 'dark'
                        ? 'bg-slate-800 border-slate-700 text-white placeholder:text-gray-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500'
                        : 'bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500'
                    } ${errors.password_confirmation ? 'border-red-500 focus:ring-red-500' : ''}`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                    className={`absolute right-3.5 top-3.5 transition ${
                      theme === 'dark'
                        ? 'text-gray-600 hover:text-gray-400'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {showPasswordConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password_confirmation && <p className="text-red-500 text-xs mt-1">{errors.password_confirmation}</p>}
              </div>

              <label className={`flex items-start gap-2 text-xs ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                <input
                  type="checkbox"
                  checked={data.terms}
                  onChange={(e) => setData('terms', e.target.checked)}
                  className={`w-4 h-4 mt-0.5 rounded border accent-purple-600 flex-shrink-0 ${
                    theme === 'dark' ? 'border-slate-700 bg-slate-700' : 'border-gray-300'
                  }`}
                  required
                />
                <span>J'accepte les conditions d'utilisation</span>
              </label>
              {errors.terms && <p className="text-red-500 text-xs">{errors.terms}</p>}
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleBack}
              disabled={currentStep === 1}
              className={`flex-1 py-2.5 px-4 rounded-lg font-semibold text-sm transition flex items-center justify-center gap-2 ${
                currentStep === 1
                  ? theme === 'dark'
                    ? 'bg-slate-800 text-gray-600 cursor-not-allowed opacity-50'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed opacity-50'
                  : theme === 'dark'
                  ? 'bg-slate-800 text-white hover:bg-slate-700'
                  : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              Retour
            </button>

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={handleContinue}
                disabled={(currentStep === 1 && !isStep1Valid) || (currentStep === 2 && !isStep2Valid) || (currentStep === 3 && !isStep3Valid)}
                className={`flex-1 py-2.5 px-4 rounded-lg font-semibold text-sm transition flex items-center justify-center gap-2 text-white ${
                  (currentStep === 1 && !isStep1Valid) || (currentStep === 2 && !isStep2Valid) || (currentStep === 3 && !isStep3Valid)
                    ? 'bg-purple-600/50 cursor-not-allowed opacity-50'
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 hover:shadow-lg hover:shadow-pink-500/20'
                }`}
              >
                Suivant
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={processing || !data.terms}
                className={`flex-1 py-2.5 px-4 rounded-lg font-semibold text-sm transition flex items-center justify-center gap-2 text-white ${
                  processing || !data.terms ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg hover:shadow-pink-500/20'
                } bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700`}
              >
                {processing ? 'Création...' : 'Créer'}
                {!processing && <ArrowRight className="w-4 h-4" />}
              </button>
            )}
          </div>
        </form>

        {/* Sign In Link */}
        <p className={`text-center text-sm mt-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          Vous avez déjà un compte?{' '}
          <Link href={route('login')} className="text-purple-600 hover:text-purple-700 font-semibold transition">
            Se connecter
          </Link>
        </p>

        {/* Footer */}
        <div className={`mt-6 pt-4 border-t text-center ${
          theme === 'dark' ? 'border-slate-800' : 'border-gray-300'
        }`}>
          <Link href="/" className={`text-xs transition ${
            theme === 'dark'
              ? 'text-gray-500 hover:text-gray-400'
              : 'text-gray-600 hover:text-gray-900'
          }`}>
            ← Retour à l'accueil
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
