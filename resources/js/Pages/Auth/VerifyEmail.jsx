import { Head, useForm, Link } from '@inertiajs/react';
import { Mail, ArrowRight } from 'lucide-react';
import { useThemeStore } from '../../store';

export default function VerifyEmail({ status }) {
  const { theme } = useThemeStore();
  const { post, processing } = useForm();

  const submit = (e) => {
    e.preventDefault();
    post(route('verification.send'));
  };

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 ${
      theme === 'dark'
        ? 'bg-gradient-to-br from-slate-950 to-slate-900'
        : 'bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50'
    }`}>
      <Head title="Vérifier l'email" />

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
          <div className={`text-6xl mb-4 ${theme === 'dark' ? 'opacity-100' : 'opacity-90'}`}>📧</div>
          <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Vérifier votre email
          </h1>
          <p className={`mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Nous avons envoyé un lien de vérification à votre adresse email
          </p>
        </div>

        {status === 'verification-link-sent' && (
          <div className={`mb-6 p-4 rounded-lg text-sm font-medium border ${
            theme === 'dark'
              ? 'bg-green-500/10 border-green-500/20 text-green-400'
              : 'bg-green-50 border-green-300 text-green-700'
          }`}>
            Un nouveau lien de vérification a été envoyé à votre adresse email.
          </div>
        )}

        <form onSubmit={submit} className="space-y-6">
          <button
            type="submit"
            disabled={processing}
            className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition font-semibold flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-pink-500/20"
          >
            <Mail className="w-5 h-5" />
            <span>{processing ? 'Envoi...' : 'Renvoyer le lien'}</span>
          </button>
        </form>

        <div className={`mt-8 pt-6 border-t text-center ${
          theme === 'dark' ? 'border-slate-800' : 'border-gray-300'
        }`}>
          <Link href={route('logout')} method="post" className={`text-sm font-medium transition ${
            theme === 'dark'
              ? 'text-gray-500 hover:text-gray-400'
              : 'text-gray-600 hover:text-gray-900'
          }`}>
            Se déconnecter
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
