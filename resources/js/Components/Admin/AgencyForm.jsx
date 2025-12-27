import { useState } from 'react';
import { useThemeStore } from '../../store';
import { X } from 'lucide-react';

export default function AgencyForm({ agency, onClose, onSubmit }) {
  const { theme } = useThemeStore();
  const [formData, setFormData] = useState({
    name: agency?.name || '',
    email: agency?.email || '',
    phone: agency?.phone || '',
    status: agency?.status || 1,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: (name === 'status') ? parseInt(value) : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className={`rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto ${theme === 'dark' ? 'bg-slate-900' : 'bg-white'}`}>
        <div className={`sticky top-0 flex items-center justify-between p-6 border-b ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
          <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
            {agency ? 'Éditer l\'Agence' : 'Nouvelle Agence'}
          </h2>
          <button onClick={onClose} className={`p-1 rounded transition ${theme === 'dark' ? 'hover:bg-slate-800' : 'hover:bg-gray-100'}`}>
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={`block text-sm font-bold mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>
                Nom de l'Agence
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Mon Agence SARL"
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
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="contact@agence.com"
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
                Téléphone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+33 1 23 45 67 89"
                className={`w-full px-4 py-2 rounded-lg border ${
                  theme === 'dark'
                    ? 'border-slate-700 bg-slate-800 text-gray-100 placeholder-gray-500'
                    : 'border-gray-300 bg-white text-gray-900 placeholder-gray-400'
                } focus:outline-none focus:ring-2 focus:ring-purple-500`}
              />
            </div>

            <div>
              <label className={`block text-sm font-bold mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>
                Statut
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-lg border ${
                  theme === 'dark'
                    ? 'border-slate-700 bg-slate-800 text-gray-100'
                    : 'border-gray-300 bg-white text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-purple-500`}
              >
                <option value="1">Validée</option>
                <option value="2">En attente</option>
                <option value="3">Bloquée</option>
              </select>
            </div>
          </div>

          <div className={`p-3 rounded-lg border ${theme === 'dark' ? 'border-slate-700 bg-slate-800' : 'border-gray-300 bg-gray-50'}`}>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              💡 La description et le slogan sont gérés dans le profil de l'agence
            </p>
          </div>

          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className={`px-6 py-2 rounded-lg border font-semibold transition ${
                theme === 'dark'
                  ? 'border-slate-700 text-gray-300 hover:bg-slate-800'
                  : 'border-gray-300 text-gray-600 hover:bg-gray-100'
              }`}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold transition"
            >
              {agency ? 'Mettre à jour' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
