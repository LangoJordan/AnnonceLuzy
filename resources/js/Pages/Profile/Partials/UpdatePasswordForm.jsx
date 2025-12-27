import { useForm } from '@inertiajs/react';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

export default function UpdatePasswordForm() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { data, setData, put, errors, processing, recentlySuccessful } = useForm({
    current_password: '',
    password: '',
    password_confirmation: '',
  });

  const updatePassword = (e) => {
    e.preventDefault();
    put(route('password.update'));
  };

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
          <Lock className="w-6 h-6 text-blue-600" />
          <span>Mettre à jour le mot de passe</span>
        </h2>
        <p className="mt-1 text-gray-600">
          Assurez-vous que votre compte utilise un mot de passe long et aléatoire.
        </p>
      </div>

      <form onSubmit={updatePassword} className="space-y-6 max-w-md">
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">Mot de passe actuel</label>
          <div className="relative">
            <Lock className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
            <input
              type={showCurrent ? 'text' : 'password'}
              value={data.current_password}
              onChange={(e) => setData('current_password', e.target.value)}
              className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
            >
              {showCurrent ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.current_password && <p className="text-red-600 text-sm mt-2">{errors.current_password}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">Nouveau mot de passe</label>
          <div className="relative">
            <Lock className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
            <input
              type={showNew ? 'text' : 'password'}
              value={data.password}
              onChange={(e) => setData('password', e.target.value)}
              className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
            >
              {showNew ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.password && <p className="text-red-600 text-sm mt-2">{errors.password}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">Confirmer le mot de passe</label>
          <div className="relative">
            <Lock className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
            <input
              type={showConfirm ? 'text' : 'password'}
              value={data.password_confirmation}
              onChange={(e) => setData('password_confirmation', e.target.value)}
              className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
            >
              {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.password_confirmation && <p className="text-red-600 text-sm mt-2">{errors.password_confirmation}</p>}
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={processing}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold disabled:opacity-50"
          >
            {processing ? 'Mise à jour...' : 'Enregistrer'}
          </button>
          {recentlySuccessful && <p className="text-green-600 font-semibold">✓ Enregistré</p>}
        </div>
      </form>
    </section>
  );
}
