import { useState, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Mail, Lock, ArrowRight, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useThemeStore } from '../../store';

export default function Login({ status, canResetPassword }) {
  const { theme } = useThemeStore();
  const [showPassword, setShowPassword] = useState(false);
  const [generalError, setGeneralError] = useState(null);

  const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
    email: '',
    password: '',
    remember: false,
  });

  // Clear errors when user starts typing
  const handleEmailChange = (e) => {
    setData('email', e.target.value);
    if (errors.email) setGeneralError(null);
  };

  const handlePasswordChange = (e) => {
    setData('password', e.target.value);
    if (errors.password) setGeneralError(null);
  };

  const submit = (e) => {
    e.preventDefault();
    setGeneralError(null);
    post(route('login'), {
      onError: (errors) => {
        // Handle generic authentication errors
        if (errors.email && !errors.password) {
          setGeneralError('Email ou mot de passe incorrect');
        } else if (errors.email?.includes('throttle')) {
          setGeneralError('Trop de tentatives. Veuillez réessayer dans quelques minutes.');
        } else {
          setGeneralError('Impossible de se connecter. Veuillez vérifier vos identifiants.');
        }
      },
    });
  };

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 ${theme === 'dark' ? 'bg-slate-950' : 'bg-white'}`}>
      <Head title="Connexion" />

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-12">
          <div className={`w-12 h-12 rounded-lg ${theme === 'dark' ? 'bg-gradient-to-br from-purple-600 to-pink-600' : 'bg-gradient-to-br from-purple-600 to-pink-600'} flex items-center justify-center text-white font-black text-lg mx-auto mb-6`}>
            A
          </div>
          <h1 className={`text-3xl font-black mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Bienvenue
          </h1>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Connectez-vous à votre compte AnnoncesHub
          </p>
        </div>

        {/* Status Message */}
        {status && (
          <div className={`mb-6 p-4 rounded-lg text-sm font-medium border flex items-start gap-3 ${theme === 'dark' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-green-50 border-green-200 text-green-800'}`}>
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            {status}
          </div>
        )}

        {/* General Error Message */}
        {generalError && (
          <div className={`mb-6 p-4 rounded-lg text-sm font-medium border flex items-start gap-3 ${theme === 'dark' ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-red-50 border-red-200 text-red-800'}`}>
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            {generalError}
          </div>
        )}

        {/* Form */}
        <form onSubmit={submit} className="space-y-5">
          {/* Email */}
          <div>
            <label htmlFor="email" className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Email
            </label>
            <div className="relative">
              <Mail className={`absolute left-3.5 top-3.5 w-5 h-5 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} />
              <input
                id="email"
                type="email"
                value={data.email}
                onChange={handleEmailChange}
                placeholder="vous@exemple.com"
                className={`w-full pl-11 pr-4 py-2.5 rounded-lg transition border ${
                  errors.email
                    ? theme === 'dark'
                      ? 'bg-red-950/20 border-red-700 text-white placeholder:text-gray-600 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                      : 'bg-red-50 border-red-300 text-gray-900 placeholder:text-gray-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                    : theme === 'dark'
                      ? 'bg-slate-900 border-slate-800 text-white placeholder:text-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500'
                      : 'bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500'
                }`}
                required
              />
            </div>
            {errors.email && <p className={`text-xs mt-1.5 ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Mot de passe
            </label>
            <div className="relative">
              <Lock className={`absolute left-3.5 top-3.5 w-5 h-5 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={data.password}
                onChange={handlePasswordChange}
                placeholder="••••••••"
                className={`w-full pl-11 pr-11 py-2.5 rounded-lg transition border ${
                  errors.password
                    ? theme === 'dark'
                      ? 'bg-red-950/20 border-red-700 text-white placeholder:text-gray-600 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                      : 'bg-red-50 border-red-300 text-gray-900 placeholder:text-gray-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                    : theme === 'dark'
                      ? 'bg-slate-900 border-slate-800 text-white placeholder:text-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500'
                      : 'bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500'
                }`}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-3.5 top-3.5 ${theme === 'dark' ? 'text-gray-600 hover:text-gray-400' : 'text-gray-500 hover:text-gray-700'}`}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && <p className={`text-xs mt-1.5 ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>{errors.password}</p>}
          </div>

          {/* Remember & Forgot */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={data.remember}
                onChange={(e) => setData('remember', e.target.checked)}
                className="w-4 h-4 rounded border border-gray-300 accent-purple-600"
              />
              <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>
                Se souvenir de moi
              </span>
            </label>
            {canResetPassword && (
              <Link
                href={route('password.request')}
                className="text-sm text-purple-600 hover:text-purple-700 font-semibold"
              >
                Mot de passe oublié?
              </Link>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={processing}
            className={`w-full py-2.5 px-4 rounded-lg font-semibold text-sm transition flex items-center justify-center gap-2 ${processing ? 'opacity-50 cursor-not-allowed' : ''} bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800`}
          >
            {processing ? 'Connexion...' : 'Se connecter'}
            {!processing && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        {/* Divider */}
        <div className="my-7 flex items-center gap-3">
          <div className={`flex-1 h-px ${theme === 'dark' ? 'bg-slate-800' : 'bg-gray-300'}`}></div>
          <span className={`text-xs ${theme === 'dark' ? 'text-gray-600' : 'text-gray-500'}`}>Ou</span>
          <div className={`flex-1 h-px ${theme === 'dark' ? 'bg-slate-800' : 'bg-gray-300'}`}></div>
        </div>

        {/* Sign Up */}
        <p className={`text-center text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          Pas encore de compte?{' '}
          <Link href={route('register')} className="text-purple-600 hover:text-purple-700 font-semibold">
            S'inscrire
          </Link>
        </p>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-slate-800 text-center">
          <Link href="/" className={`text-xs ${theme === 'dark' ? 'text-gray-500 hover:text-gray-400' : 'text-gray-600 hover:text-gray-900'}`}>
            ← Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
