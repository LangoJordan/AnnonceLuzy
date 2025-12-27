import { Head, useForm } from '@inertiajs/react';
import { Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useThemeStore } from '../../store';

export default function ResetPassword({ token, email }) {
  const { theme } = useThemeStore();
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const { data, setData, post, processing, errors } = useForm({
    token: token,
    email: email,
    password: '',
    password_confirmation: '',
  });

  const submit = (e) => {
    e.preventDefault();
    post(route('password.store'));
  };

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 ${
      theme === 'dark'
        ? 'bg-gradient-to-br from-slate-950 to-slate-900'
        : 'bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50'
    }`}>
      <Head title="Réinitialiser le mot de passe" />

      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute -top-40 -right-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob ${
          theme === 'dark' ? 'bg-blue-500' : 'bg-purple-300'
        }`}></div>
        <div className={`absolute -bottom-40 -left-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000 ${
          theme === 'dark' ? 'bg-purple-500' : 'bg-blue-300'
        }`}></div>
      </div>

      <div className={`relative w-full max-w-md rounded-2xl shadow-xl backdrop-blur-sm ${
        theme === 'dark'
          ? 'bg-slate-900/80 border border-slate-800 p-8'
          : 'bg-white/80 border border-gray-200 p-8'
      }`}>
        <div className="text-center mb-8">
          <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Réinitialiser le mot de passe
          </h1>
          <p className={`mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Entrez votre nouveau mot de passe
          </p>
        </div>

        <form onSubmit={submit} className="space-y-6">
          <div>
            <label htmlFor="password" className={`block text-sm font-semibold mb-2 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Nouveau mot de passe
            </label>
            <div className="relative">
              <Lock className={`absolute left-4 top-3.5 w-5 h-5 ${
                theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
              }`} />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={data.password}
                onChange={(e) => setData('password', e.target.value)}
                className={`w-full pl-12 pr-12 py-3 rounded-lg border transition focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  theme === 'dark'
                    ? 'bg-slate-800 border-slate-700 text-white placeholder:text-gray-600'
                    : 'bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-500'
                } ${errors.password ? 'border-red-500 focus:ring-red-500' : ''}`}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-4 top-3.5 transition ${
                  theme === 'dark'
                    ? 'text-gray-600 hover:text-gray-400'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-sm mt-2">{errors.password}</p>}
          </div>

          <div>
            <label htmlFor="password_confirmation" className={`block text-sm font-semibold mb-2 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Confirmer le mot de passe
            </label>
            <div className="relative">
              <Lock className={`absolute left-4 top-3.5 w-5 h-5 ${
                theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
              }`} />
              <input
                id="password_confirmation"
                type={showPasswordConfirm ? 'text' : 'password'}
                value={data.password_confirmation}
                onChange={(e) => setData('password_confirmation', e.target.value)}
                className={`w-full pl-12 pr-12 py-3 rounded-lg border transition focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  theme === 'dark'
                    ? 'bg-slate-800 border-slate-700 text-white placeholder:text-gray-600'
                    : 'bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-500'
                } ${errors.password_confirmation ? 'border-red-500 focus:ring-red-500' : ''}`}
                required
              />
              <button
                type="button"
                onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                className={`absolute right-4 top-3.5 transition ${
                  theme === 'dark'
                    ? 'text-gray-600 hover:text-gray-400'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {showPasswordConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password_confirmation && <p className="text-red-500 text-sm mt-2">{errors.password_confirmation}</p>}
          </div>

          <button
            type="submit"
            disabled={processing}
            className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition font-semibold flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-pink-500/20"
          >
            <span>{processing ? 'Mise à jour...' : 'Réinitialiser'}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>
      </div>

      <style>{`
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
      `}</style>
    </div>
  );
}
