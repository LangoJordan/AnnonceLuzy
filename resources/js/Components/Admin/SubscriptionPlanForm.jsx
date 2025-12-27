import { useState } from 'react';
import { useThemeStore } from '../../store';
import { X } from 'lucide-react';
import { router } from '@inertiajs/react';

export default function SubscriptionPlanForm({ plan, onClose, onSubmit }) {
  const { theme } = useThemeStore();
  const [formData, setFormData] = useState({
    label: plan?.label || '',
    amount: plan?.amount || 0,
    duration_days: plan?.duration_days || 30,
    max_ads: plan?.max_ads || 10,
    max_spaces: plan?.max_spaces || 1,
    is_active: plan?.is_active || true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox'
        ? checked
        : (name.includes('_') || name === 'amount' || name === 'max_ads' || name === 'max_spaces')
        ? parseInt(value)
        : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const url = plan
      ? `/admin/subscriptions/${plan.id}/update`
      : '/admin/subscriptions/store';

    const method = plan ? 'post' : 'post';

    router.post(
      url,
      formData,
      {
        onSuccess: () => {
          setIsLoading(false);
          onClose();
          if (onSubmit) onSubmit(formData);
        },
        onError: (errors) => {
          setIsLoading(false);
          setError(errors?.message || 'Une erreur est survenue');
        }
      }
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className={`rounded-lg max-w-2xl w-full ${theme === 'dark' ? 'bg-slate-900' : 'bg-white'}`}>
        <div className={`flex items-center justify-between p-6 border-b ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
          <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
            {plan ? 'Éditer le Plan' : 'Nouveau Plan d\'Abonnement'}
          </h2>
          <button onClick={onClose} className={`p-1 rounded transition ${theme === 'dark' ? 'hover:bg-slate-800' : 'hover:bg-gray-100'}`}>
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className={`p-4 rounded-lg border ${theme === 'dark' ? 'border-red-500/30 bg-red-500/10 text-red-400' : 'border-red-300 bg-red-100 text-red-700'}`}>
              {error}
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={`block text-sm font-bold mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>
                Nom du Plan
              </label>
              <input
                type="text"
                name="label"
                value={formData.label}
                onChange={handleChange}
                placeholder="ex: Plan Standard"
                className={`w-full px-4 py-2 rounded-lg border ${
                  theme === 'dark'
                    ? 'border-slate-700 bg-slate-800 text-gray-100 placeholder-gray-500'
                    : 'border-gray-300 bg-white text-gray-900 placeholder-gray-400'
                } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                required
              />
            </div>

            <div>
              <label className={`block text-sm font-bold mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>
                Montant (XFA)
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="10000"
                className={`w-full px-4 py-2 rounded-lg border ${
                  theme === 'dark'
                    ? 'border-slate-700 bg-slate-800 text-gray-100'
                    : 'border-gray-300 bg-white text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                required
              />
            </div>

            <div>
              <label className={`block text-sm font-bold mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>
                Durée (jours)
              </label>
              <input
                type="number"
                name="duration_days"
                value={formData.duration_days}
                onChange={handleChange}
                placeholder="30"
                className={`w-full px-4 py-2 rounded-lg border ${
                  theme === 'dark'
                    ? 'border-slate-700 bg-slate-800 text-gray-100'
                    : 'border-gray-300 bg-white text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                required
              />
            </div>

            <div>
              <label className={`block text-sm font-bold mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>
                Max Annonces
              </label>
              <input
                type="number"
                name="max_ads"
                value={formData.max_ads}
                onChange={handleChange}
                placeholder="10"
                className={`w-full px-4 py-2 rounded-lg border ${
                  theme === 'dark'
                    ? 'border-slate-700 bg-slate-800 text-gray-100'
                    : 'border-gray-300 bg-white text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                required
              />
            </div>

            <div>
              <label className={`block text-sm font-bold mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>
                Max Espaces
              </label>
              <input
                type="number"
                name="max_spaces"
                value={formData.max_spaces}
                onChange={handleChange}
                placeholder="1"
                className={`w-full px-4 py-2 rounded-lg border ${
                  theme === 'dark'
                    ? 'border-slate-700 bg-slate-800 text-gray-100'
                    : 'border-gray-300 bg-white text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                required
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <label className={`flex items-center gap-2 cursor-pointer ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                className="w-4 h-4 rounded"
              />
              <span className="text-sm font-bold">Plan Actif</span>
            </label>
          </div>

          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className={`px-6 py-2 rounded-lg border font-semibold transition ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              } ${
                theme === 'dark'
                  ? 'border-slate-700 text-gray-300 hover:bg-slate-800'
                  : 'border-gray-300 text-gray-600 hover:bg-gray-100'
              }`}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`px-6 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold transition ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'En cours...' : (plan ? 'Mettre à jour' : 'Créer')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
