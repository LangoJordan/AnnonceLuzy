import { Head, Link, useForm } from '@inertiajs/react';
import { Mail, ArrowRight } from 'lucide-react';
import { useThemeStore } from '../../store';

export default function ForgotPassword({ status }) {
  const { theme } = useThemeStore();
  const { data, setData, post, processing, errors } = useForm({
    email: '',
  });

  const submit = (e) => {
    e.preventDefault();
    post(route('password.email'));
  };

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 ${
      theme === 'dark'
        ? 'bg-gradient-to-br from-slate-950 to-slate-900'
        : 'bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50'
    }`}>
      <Head title="Mot de passe oublié" />

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
            Mot de passe oublié?
          </h1>
          <p className={`mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Entrez votre email pour réinitialiser votre mot de passe
          </p>
        </div>

        {status && (
          <div className={`mb-6 p-4 rounded-lg text-sm font-medium border ${
            theme === 'dark'
              ? 'bg-green-500/10 border-green-500/20 text-green-400'
              : 'bg-green-50 border-green-300 text-green-700'
          }`}>
            {status}
          </div>
        )}

        <form onSubmit={submit} className="space-y-6">
          <div>
            <label htmlFor="email" className={`block text-sm font-semibold mb-2 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Email
            </label>
            <div className="relative">
              <Mail className={`absolute left-4 top-3.5 w-5 h-5 ${
                theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
              }`} />
              <input
                id="email"
                type="email"
                name="email"
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
                placeholder="vous@exemple.com"
                className={`w-full pl-12 pr-4 py-3 rounded-lg border transition focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  theme === 'dark'
                    ? 'bg-slate-800 border-slate-700 text-white placeholder:text-gray-600'
                    : 'bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-500'
                } ${errors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
                required
              />
            </div>
            {errors.email && <p className="text-red-500 text-sm mt-2">{errors.email}</p>}
          </div>

          <button
            type="submit"
            disabled={processing}
            className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition font-semibold flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-pink-500/20"
          >
            <span>{processing ? 'Envoi...' : 'Envoyer le lien'}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        <div className={`mt-8 pt-6 border-t text-center ${
          theme === 'dark' ? 'border-slate-800' : 'border-gray-300'
        }`}>
          <Link href="/login" className={`text-sm font-medium transition ${
            theme === 'dark'
              ? 'text-gray-500 hover:text-gray-400'
              : 'text-gray-600 hover:text-gray-900'
          }`}>
            ← Retour à la connexion
          </Link>
        </div>
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
