import { Head, Link } from '@inertiajs/react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import { useThemeStore } from '../store';
import {
  Home,
  ArrowLeft,
  AlertCircle,
  Mail,
  Phone,
} from 'lucide-react';

export default function Error({ user, status = 404, statusCode = null, statusDescription = null, admin = null }) {
  const { theme } = useThemeStore();

  const getErrorInfo = () => {
    // If it's a 403 with status code, it's a user/agency status issue
    if (status === 403 && statusCode) {
      return {
        title: statusDescription || 'Accès Refusé',
        description: statusCode === 2
          ? 'Votre compte est actuellement en cours d\'analyse. Nous vérifierons les informations et vous informerons dès que possible.'
          : statusCode === 3
          ? 'Votre compte a été bloqué. Contactez un administrateur pour plus d\'informations.'
          : 'Vous n\'avez pas la permission d\'accéder à cette ressource.',
      };
    }

    const errors = {
      403: {
        title: 'Accès Refusé',
        description: 'Vous n\'avez pas la permission d\'accéder à cette ressource.',
      },
      404: {
        title: 'Page Non Trouvée',
        description: 'La page que vous recherchez n\'existe pas ou a été déplacée.',
      },
      419: {
        title: 'Session Expirée',
        description: 'Votre session a expiré. Veuillez vous reconnecter pour continuer.',
      },
      500: {
        title: 'Erreur du Serveur',
        description: 'Une erreur s\'est produite sur le serveur. Nos équipes ont été informées.',
      },
      503: {
        title: 'Service Indisponible',
        description: 'Le service est temporairement indisponible. Veuillez réessayer dans quelques instants.',
      },
    };
    return errors[status] || {
      title: 'Oups ! Une erreur est survenue',
      description: 'Une erreur inattendue s\'est produite. Veuillez réessayer ou contacter le support.',
    };
  };

  const error = getErrorInfo();

  return (
    <div className={theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-white text-gray-900'}>
      <Head title={`${status} - ${error.title}`} />
      <Header user={user} />

      <main className="min-h-screen flex items-center justify-center px-4 py-12 lg:py-20">
        <div className="max-w-2xl w-full">
          
          {/* Error Card */}
          <div className={`rounded-2xl border p-12 text-center transition-all duration-300 ${
            theme === 'dark'
              ? 'border-slate-700 bg-gradient-to-br from-slate-900 to-slate-800'
              : 'border-gray-200 bg-gradient-to-br from-white to-gray-50'
          }`}>
            
            {/* Icon */}
            <div className="mb-8 flex justify-center">
              <div className={`p-6 rounded-2xl ${
                theme === 'dark' ? 'bg-purple-500/20' : 'bg-purple-100'
              }`}>
                <AlertCircle className={`w-16 h-16 ${
                  theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
                }`} />
              </div>
            </div>

            {/* Status Code */}
            <div className="text-6xl lg:text-7xl font-black mb-4 opacity-10">
              {status}
            </div>

            {/* Title */}
            <h1 className={`text-4xl lg:text-5xl font-black mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {error.title}
            </h1>

            {/* Description */}
            <p className={`text-lg lg:text-xl mb-8 leading-relaxed ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {error.description}
            </p>

            {/* Admin Contact Info - if user status issue and admin exists */}
            {(statusCode === 2 || statusCode === 3) && admin && (
              <div className={`mb-12 p-6 rounded-xl border-2 ${
                theme === 'dark'
                  ? 'border-purple-500/30 bg-purple-500/10'
                  : 'border-purple-300 bg-purple-50'
              }`}>
                <h3 className={`font-bold mb-4 text-lg ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  Contactez un administrateur
                </h3>
                <div className="space-y-3">
                  {admin.name && (
                    <p className={`text-sm ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      <span className="font-semibold">Nom:</span> {admin.name}
                    </p>
                  )}
                  {admin.email && (
                    <a
                      href={`mailto:${admin.email}`}
                      className="flex items-center gap-2 text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline"
                    >
                      <Mail className="w-4 h-4" />
                      {admin.email}
                    </a>
                  )}
                  {admin.phone && (
                    <a
                      href={`tel:${admin.phone}`}
                      className="flex items-center gap-2 text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline"
                    >
                      <Phone className="w-4 h-4" />
                      {admin.phone}
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold hover:shadow-lg hover:shadow-purple-600/30 transition-all duration-300 flex items-center justify-center gap-2 group transform hover:scale-105"
              >
                <Home className="w-5 h-5 group-hover:scale-110 transition" />
                Accueil
              </Link>
              <button
                onClick={() => window.history.back()}
                className={`px-8 py-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 group transform hover:scale-105 border-2 ${
                  theme === 'dark'
                    ? 'border-slate-700 bg-slate-800/50 hover:bg-slate-700/50 text-gray-200'
                    : 'border-gray-300 bg-gray-100 hover:bg-gray-200 text-gray-900'
                }`}
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition" />
                Retour
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
