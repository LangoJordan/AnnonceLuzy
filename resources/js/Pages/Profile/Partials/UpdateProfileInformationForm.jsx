import { useForm, usePage } from '@inertiajs/react';
import { User, Mail, Phone } from 'lucide-react';

export default function UpdateProfileInformationForm() {
  const { auth } = usePage().props;
  const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
    name: auth.user.name,
    email: auth.user.email,
    phone: auth.user.phone || '',
  });

  const submit = (e) => {
    e.preventDefault();
    patch(route('profile.update'));
  };

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-gray-900">Informations du profil</h2>
        <p className="mt-1 text-gray-600">Mettez à jour les informations du profil et l'adresse e-mail de votre compte.</p>
      </div>

      <form onSubmit={submit} className="space-y-6 max-w-md">
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">Nom</label>
          <div className="relative">
            <User className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={data.name}
              onChange={(e) => setData('name', e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {errors.name && <p className="text-red-600 text-sm mt-2">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">Email</label>
          <div className="relative">
            <Mail className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
            <input
              type="email"
              value={data.email}
              onChange={(e) => setData('email', e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {errors.email && <p className="text-red-600 text-sm mt-2">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">Téléphone</label>
          <div className="relative">
            <Phone className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
            <input
              type="tel"
              value={data.phone}
              onChange={(e) => setData('phone', e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {errors.phone && <p className="text-red-600 text-sm mt-2">{errors.phone}</p>}
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={processing}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold disabled:opacity-50"
          >
            {processing ? 'Enregistrement...' : 'Enregistrer'}
          </button>
          {recentlySuccessful && <p className="text-green-600 font-semibold">✓ Enregistré</p>}
        </div>
      </form>
    </section>
  );
}
