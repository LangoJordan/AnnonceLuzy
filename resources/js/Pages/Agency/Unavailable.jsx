import { Head, Link } from '@inertiajs/react';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import { useThemeStore } from '../../store';
import { AlertCircle, ArrowLeft, Home } from 'lucide-react';

export default function AgencyUnavailable({ user, message = 'Cette agence n\'est pas disponible pour le moment.' }) {
  const { theme } = useThemeStore();

  return (
    <div className={theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-gray-100 text-gray-900'}>
      <Head title="Agence non disponible" />
      <Header user={user} />

      <main className="min-h-screen">
        {/* Back Link */}
        <div className={`border-b ${theme === 'dark' ? 'border-slate-800 bg-slate-900/50' : 'border-gray-200 bg-white'}`}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <Link href="/ads" className="inline-flex items-center text-purple-600 font-semibold text-sm hover:text-purple-700 group">
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition" />
              Retour aux annonces
            </Link>
          </div>
        </div>

        {/* Unavailable Message */}
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex items-center justify-center min-h-[calc(100vh-200px)]">
          <div className={`rounded-lg border p-12 text-center ${theme === 'dark' ? 'border-slate-700 bg-slate-900' : 'border-gray-200 bg-white'}`}>
            <div className="flex justify-center mb-6">
              <div className={`p-4 rounded-full ${theme === 'dark' ? 'bg-red-900/20' : 'bg-red-100'}`}>
                <AlertCircle className={`w-12 h-12 ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`} />
              </div>
            </div>

            <h1 className="text-3xl font-bold mb-4">Agence non disponible</h1>

            <p className={`text-lg mb-8 max-w-md mx-auto ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              {message}
            </p>

            <p className={`text-sm mb-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Veuillez réessayer ultérieurement ou consulter les autres annonces disponibles.
            </p>

            <div className="flex gap-4 justify-center">
              <Link
                href="/ads"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 transition"
              >
                <Home className="w-4 h-4" />
                Voir toutes les annonces
              </Link>
              <Link
                href="/"
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition border ${theme === 'dark' ? 'border-slate-700 bg-slate-800 hover:bg-slate-700 text-white' : 'border-gray-300 bg-white hover:bg-gray-50 text-gray-900'}`}
              >
                <ArrowLeft className="w-4 h-4" />
                Accueil
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
