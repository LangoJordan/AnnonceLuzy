import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Trash2, Lock } from 'lucide-react';

export default function DeleteUserForm() {
  const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
  const { data, setData, delete: destroy, processing, errors, reset } = useForm({
    password: '',
  });

  const deleteUser = (e) => {
    e.preventDefault();
    destroy(route('profile.destroy'), {
      onSuccess: () => {
        reset();
      },
    });
  };

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
          <Trash2 className="w-6 h-6 text-red-600" />
          <span>Supprimer le compte</span>
        </h2>
        <p className="mt-1 text-gray-600">
          Une fois votre compte supprimé, il n'y a pas de retour en arrière. Veuillez être certain.
        </p>
      </div>

      <button
        onClick={() => setConfirmingUserDeletion(true)}
        className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold"
      >
        Supprimer le compte
      </button>

      {confirmingUserDeletion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Êtes-vous certain?</h3>
            <p className="text-gray-600 mb-6">
              Une fois supprimé, votre compte ne peut pas être récupéré.
            </p>

            <form onSubmit={deleteUser} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Votre mot de passe"
                  />
                </div>
                {errors.password && <p className="text-red-600 text-sm mt-2">{errors.password}</p>}
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setConfirmingUserDeletion(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={processing}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold disabled:opacity-50"
                >
                  {processing ? 'Suppression...' : 'Supprimer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
