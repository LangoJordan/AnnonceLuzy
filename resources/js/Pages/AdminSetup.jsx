import { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { ShieldAlert, CheckCircle, AlertCircle, Shield } from 'lucide-react';
import { useThemeStore } from '../store';

export default function AdminSetup({ user, success, message }) {
  const { theme } = useThemeStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const { post, processing } = useForm();

  useEffect(() => {
    if (success) {
      // Redirect to admin dashboard after 2 seconds
      setTimeout(() => {
        window.location.href = '/admin';
      }, 2000);
    }
  }, [success]);

  const handleMakeAdmin = () => {
    setIsProcessing(true);
    post(route('admin.setup.make'), {
      onFinish: () => setIsProcessing(false),
    });
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-slate-950' : 'bg-gray-100'}`}>
      <div className={`w-full max-w-md rounded-lg border p-8 ${theme === 'dark' ? 'border-slate-700 bg-slate-900' : 'border-gray-200 bg-white'}`}>
        
        {/* Header */}
        <div className="text-center mb-8">
          <Shield className={`w-16 h-16 mx-auto mb-4 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} />
          <h1 className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
            Admin Setup
          </h1>
          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
            Initialize your admin account
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-300 dark:border-emerald-700">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <div>
                <p className="font-semibold text-emerald-700 dark:text-emerald-300">Succès!</p>
                <p className="text-sm text-emerald-600 dark:text-emerald-400">{message}</p>
              </div>
            </div>
          </div>
        )}

        {/* User Info */}
        <div className={`mb-6 p-4 rounded-lg border ${theme === 'dark' ? 'border-slate-700 bg-slate-800' : 'border-gray-200 bg-gray-50'}`}>
          <h2 className={`text-sm font-bold mb-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Votre Compte
          </h2>
          <div className="space-y-2">
            <div>
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>Nom</p>
              <p className={`font-semibold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>{user.name}</p>
            </div>
            <div>
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>Email</p>
              <p className={`font-semibold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>{user.email}</p>
            </div>
          </div>
        </div>

        {/* Current Status */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            {user.is_admin ? (
              <>
                <CheckCircle className="w-5 h-5 text-emerald-500" />
                <span className={`font-semibold ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`}>
                  Vous êtes administrateur
                </span>
              </>
            ) : (
              <>
                <AlertCircle className="w-5 h-5 text-yellow-500" />
                <span className={`font-semibold ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`}>
                  Pas encore administrateur
                </span>
              </>
            )}
          </div>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            {user.is_admin 
              ? "Vous avez accès à tous les tableaux de bord d'administration."
              : "Cliquez sur le bouton ci-dessous pour vous promouvoir en administrateur et accéder au tableau de bord."}
          </p>
        </div>

        {/* Action Button */}
        {!user.is_admin && !success && (
          <button
            onClick={handleMakeAdmin}
            disabled={isProcessing || processing}
            className={`w-full py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${
              isProcessing || processing
                ? theme === 'dark'
                  ? 'bg-purple-600/50 text-purple-200 cursor-not-allowed'
                  : 'bg-purple-400 text-purple-100 cursor-not-allowed'
                : theme === 'dark'
                ? 'bg-purple-600 hover:bg-purple-700 text-white'
                : 'bg-purple-600 hover:bg-purple-700 text-white'
            }`}
          >
            {isProcessing || processing ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Traitement...
              </>
            ) : (
              <>
                <ShieldAlert className="w-5 h-5" />
                Devenir Administrateur
              </>
            )}
          </button>
        )}

        {success && (
          <button
            onClick={() => window.location.href = '/admin'}
            className={`w-full py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${
              theme === 'dark'
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            <CheckCircle className="w-5 h-5" />
            Aller au Tableau de Bord
          </button>
        )}

        {user.is_admin && !success && (
          <a
            href="/admin"
            className={`w-full py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${
              theme === 'dark'
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            <Shield className="w-5 h-5" />
            Accéder au Tableau de Bord
          </a>
        )}

        {/* Info */}
        <div className="mt-6 p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700">
          <p className={`text-xs ${theme === 'dark' ? 'text-blue-300' : 'text-blue-700'}`}>
            💡 Une fois administrateur, vous pourrez accéder à tous les tableaux de bord, gérer les utilisateurs, les annonces, les paiements, et bien plus.
          </p>
        </div>
      </div>
    </div>
  );
}
