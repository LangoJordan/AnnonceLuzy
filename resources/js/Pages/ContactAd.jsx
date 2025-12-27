import { useState } from 'react';
import { useThemeStore } from '../store';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import { Mail, Phone, Send, AlertCircle, Check, ArrowLeft } from 'lucide-react';

export default function ContactAd({ ad = {}, user = null }) {
  const { theme } = useThemeStore();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    message: '',
    ad_id: ad.id,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Le nom est requis';
    if (!formData.email.trim()) newErrors.email = 'L\'email est requis';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Email invalide';
    if (!formData.message.trim()) newErrors.message = 'Le message est requis';
    if (formData.message.length < 10) newErrors.message = 'Le message doit contenir au moins 10 caractères';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || '',
        },
        credentials: 'same-origin',
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess(true);
        setStep(2);
      } else {
        setErrors({ submit: 'Une erreur s\'est produite lors de l\'envoi' });
      }
    } catch (error) {
      setErrors({ submit: 'Erreur de connexion' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900'}`}>
      <Header user={user} />

      <main className="flex-1 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          {step === 1 && (
            <>
              <div className="mb-8">
                <a
                  href={`/ads/${ad.id}`}
                  className={`inline-flex items-center gap-2 font-bold transition ${theme === 'dark' ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-700'}`}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Retour à l'annonce
                </a>
              </div>

              <div className={`rounded-lg border-2 p-8 ${theme === 'dark' ? 'border-slate-700 bg-slate-900' : 'border-purple-200 bg-white'}`}>
                <h1 className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                  Contacter l'annonceur
                </h1>
                <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                  Remplissez le formulaire ci-dessous pour envoyer un message
                </p>

                {/* Ad Preview */}
                <div className={`rounded-lg p-4 mb-8 mt-6 border ${theme === 'dark' ? 'border-slate-700 bg-slate-800/50' : 'border-gray-200 bg-gray-50'}`}>
                  <p className={`text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    À propos de:
                  </p>
                  <h3 className={`font-bold text-lg ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                    {ad.title}
                  </h3>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className={`block text-sm font-bold mb-3 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                      Votre nom
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Jean Dupont"
                      className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                        errors.name
                          ? theme === 'dark' ? 'border-red-500/50 bg-red-500/10' : 'border-red-300 bg-red-50'
                          : theme === 'dark' ? 'bg-slate-800 border-slate-700 text-gray-100' : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                    {errors.name && <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>{errors.name}</p>}
                  </div>

                  <div>
                    <label className={`block text-sm font-bold mb-3 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                      Votre email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="email@example.com"
                      className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                        errors.email
                          ? theme === 'dark' ? 'border-red-500/50 bg-red-500/10' : 'border-red-300 bg-red-50'
                          : theme === 'dark' ? 'bg-slate-800 border-slate-700 text-gray-100' : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                    {errors.email && <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>{errors.email}</p>}
                  </div>

                  <div>
                    <label className={`block text-sm font-bold mb-3 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                      Téléphone (optionnel)
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+33612345678"
                      className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                        theme === 'dark' ? 'bg-slate-800 border-slate-700 text-gray-100' : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-bold mb-3 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                      Votre message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Écrivez votre message ici..."
                      rows="6"
                      maxLength="1000"
                      className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                        errors.message
                          ? theme === 'dark' ? 'border-red-500/50 bg-red-500/10' : 'border-red-300 bg-red-50'
                          : theme === 'dark' ? 'bg-slate-800 border-slate-700 text-gray-100' : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                    <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      {formData.message.length}/1000 caractères
                    </p>
                    {errors.message && <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>{errors.message}</p>}
                  </div>

                  {errors.submit && (
                    <div className={`p-4 rounded-lg border flex items-start gap-3 ${theme === 'dark' ? 'border-red-500/20 bg-red-500/10' : 'border-red-300 bg-red-50'}`}>
                      <AlertCircle className={theme === 'dark' ? 'text-red-400' : 'text-red-600'} />
                      <p className={theme === 'dark' ? 'text-red-300' : 'text-red-700'}>{errors.submit}</p>
                    </div>
                  )}

                  <div className="flex gap-4 pt-4">
                    <a
                      href={`/ads/${ad.id}`}
                      className={`flex-1 py-3 rounded-lg font-bold border text-center transition ${theme === 'dark' ? 'border-slate-700 bg-slate-800 hover:bg-slate-700 text-gray-100' : 'border-gray-300 bg-white hover:bg-gray-100 text-gray-900'}`}
                    >
                      Annuler
                    </a>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 py-3 rounded-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <Send className="w-5 h-5" />
                      {loading ? 'Envoi en cours...' : 'Envoyer le message'}
                    </button>
                  </div>
                </form>
              </div>
            </>
          )}

          {step === 2 && success && (
            <div className={`rounded-lg border-2 p-12 text-center ${theme === 'dark' ? 'border-slate-700 bg-slate-900' : 'border-purple-200 bg-white'}`}>
              <div className="mb-6">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${theme === 'dark' ? 'bg-emerald-500/20' : 'bg-emerald-100'}`}>
                  <Check className={`w-8 h-8 ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`} />
                </div>
                <h2 className={`text-3xl font-bold mb-3 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                  Message envoyé!
                </h2>
                <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                  Votre message a été envoyé à l'annonceur. Vous recevrez une réponse dès que possible.
                </p>
              </div>

              <div className={`rounded-lg p-6 mb-8 border ${theme === 'dark' ? 'border-slate-700 bg-slate-800/50' : 'border-gray-200 bg-gray-50'}`}>
                <p className={`text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Conseils pour une meilleure réponse:
                </p>
                <ul className={`text-left space-y-2 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  <li>✓ Vérifiez que votre email est correct</li>
                  <li>✓ Consultez vos emails y compris les spams</li>
                  <li>✓ Soyez disponible pour être contacté</li>
                </ul>
              </div>

              <div className="flex gap-4">
                <a
                  href="/"
                  className={`flex-1 py-3 rounded-lg font-bold border text-center transition ${theme === 'dark' ? 'border-slate-700 bg-slate-800 hover:bg-slate-700 text-gray-100' : 'border-gray-300 bg-white hover:bg-gray-100 text-gray-900'}`}
                >
                  Accueil
                </a>
                <a
                  href={`/ads/${ad.id}`}
                  className="flex-1 py-3 rounded-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg transition text-center"
                >
                  Retour à l'annonce
                </a>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
