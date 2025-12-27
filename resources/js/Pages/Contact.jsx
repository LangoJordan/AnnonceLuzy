import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Mail, Phone, MapPin, Clock, ArrowLeft, Send, MessageSquare, Github, Linkedin, Twitter, CheckCircle2 } from 'lucide-react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import { useThemeStore } from '../store';

export default function Contact({ user }) {
  const { theme } = useThemeStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setFormData({ name: '', email: '', subject: '', message: '' });
      setSubmitted(false);
    }, 3000);
  };

  const contactMethods = [
    {
      icon: Mail,
      title: 'Email',
      value: 'neptunedemangalangojordan@gmail.com',
      href: 'mailto:neptunedemangalangojordan@gmail.com',
      description: 'Réponse dans les 24h',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Phone,
      title: 'Téléphone',
      value: '+33 1 23 45 67 89',
      href: 'tel:+33123456789',
      description: 'Disponible Lun-Ven',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: MapPin,
      title: 'Bureau',
      value: '123 Rue de l\'Innovation, 75000 Paris',
      href: '#',
      description: 'Visites sur rendez-vous',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Clock,
      title: 'Support',
      value: 'Lun-Ven: 9:00-18:00 | Sam: 10:00-16:00',
      href: '#',
      description: 'Support en temps réel',
      color: 'from-orange-500 to-red-500'
    }
  ];

  const ContactMethodCard = ({ method }) => {
    const Icon = method.icon;

    return (
      <a
        href={method.href}
        className={`group relative rounded-2xl border overflow-hidden transition-all hover:shadow-xl ${
          theme === 'dark'
            ? 'bg-slate-800 border-slate-700 hover:border-slate-600'
            : 'bg-white border-gray-200 hover:border-gray-300'
        }`}
      >
        <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity bg-gradient-to-r ${method.color}`}></div>
        
        <div className="relative p-6 lg:p-8">
          <div className="flex items-start gap-4 mb-4">
            <div className={`p-3 rounded-xl bg-gradient-to-r ${method.color} text-white flex-shrink-0`}>
              <Icon className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className={`font-bold text-lg ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {method.title}
              </h3>
              <p className={`text-sm mt-1 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {method.description}
              </p>
            </div>
          </div>
          <p className={`font-semibold group-hover:underline ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            {method.value}
          </p>
        </div>
      </a>
    );
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-slate-950' : 'bg-white'}`}>
      <Head title="Contactez LUZY" />
      <Header user={user} />

      {/* Hero Section */}
      <section className={`relative py-16 lg:py-24 overflow-hidden ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'
          : 'bg-gradient-to-br from-indigo-50 via-purple-50 to-white'
      }`}>
        <div className="absolute inset-0 opacity-10">
          <div className={`absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl ${
            theme === 'dark' ? 'bg-indigo-600' : 'bg-indigo-400'
          }`}></div>
          <div className={`absolute bottom-0 left-0 w-96 h-96 rounded-full blur-3xl ${
            theme === 'dark' ? 'bg-purple-600' : 'bg-purple-400'
          }`}></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/" className={`inline-flex items-center font-medium group mb-8 ${
            theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
          }`}>
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition" />
            Retour à l'accueil
          </Link>

          <div className="max-w-3xl">
            <h1 className={`text-5xl lg:text-6xl font-black mb-6 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Parlons Ensemble
            </h1>
            <p className={`text-xl lg:text-2xl leading-relaxed ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Avez-vous une question? Une suggestion? Ou souhaitez-vous simplement dire bonjour? Contactez-nous – nous serions ravis de vous entendre!
            </p>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-8 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
          {contactMethods.map((method) => (
            <ContactMethodCard key={method.title} method={method} />
          ))}
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Form */}
          <div className={`lg:col-span-2 rounded-3xl border overflow-hidden ${
            theme === 'dark'
              ? 'bg-slate-800 border-slate-700'
              : 'bg-white border-gray-200'
          }`}>
            <div className={`p-8 lg:p-12 ${
              theme === 'dark' ? 'bg-slate-800/50' : 'bg-gray-50/50'
            }`}>
              <h2 className={`text-3xl font-bold mb-8 flex items-center gap-3 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                <MessageSquare className="w-8 h-8 text-purple-600" />
                Envoyez-nous un Message
              </h2>

              {submitted ? (
                <div className={`rounded-xl border-2 p-8 text-center ${
                  theme === 'dark'
                    ? 'bg-green-500/10 border-green-500/30'
                    : 'bg-green-50 border-green-300'
                }`}>
                  <CheckCircle2 className={`w-12 h-12 mx-auto mb-4 ${
                    theme === 'dark' ? 'text-green-400' : 'text-green-600'
                  }`} />
                  <h3 className={`text-xl font-bold mb-2 ${
                    theme === 'dark' ? 'text-green-400' : 'text-green-700'
                  }`}>
                    Message Envoyé!
                  </h3>
                  <p className={
                    theme === 'dark' ? 'text-green-300' : 'text-green-700'
                  }>
                    Merci de nous avoir contactés. Nous vous répondrons très bientôt.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className={`block text-sm font-semibold mb-3 ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        Nom
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className={`w-full px-4 py-3 rounded-lg border transition focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                          theme === 'dark'
                            ? 'bg-slate-700 border-slate-600 text-white placeholder:text-gray-500'
                            : 'bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-500'
                        }`}
                        placeholder="Votre nom"
                        required
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-semibold mb-3 ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        Email
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className={`w-full px-4 py-3 rounded-lg border transition focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                          theme === 'dark'
                            ? 'bg-slate-700 border-slate-600 text-white placeholder:text-gray-500'
                            : 'bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-500'
                        }`}
                        placeholder="votre@email.com"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className={`block text-sm font-semibold mb-3 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      Sujet
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className={`w-full px-4 py-3 rounded-lg border transition focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                        theme === 'dark'
                          ? 'bg-slate-700 border-slate-600 text-white placeholder:text-gray-500'
                          : 'bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-500'
                      }`}
                      placeholder="Quel est le sujet de votre message?"
                      required
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-semibold mb-3 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      Message
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows="6"
                      className={`w-full px-4 py-3 rounded-lg border transition focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none ${
                        theme === 'dark'
                          ? 'bg-slate-700 border-slate-600 text-white placeholder:text-gray-500'
                          : 'bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-500'
                      }`}
                      placeholder="Parlez-nous de votre message..."
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition font-semibold flex items-center justify-center gap-2 hover:scale-105 transform"
                  >
                    <Send className="w-5 h-5" />
                    Envoyer le Message
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-8">
            {/* Business Hours */}
            <div className={`rounded-3xl border overflow-hidden ${
              theme === 'dark'
                ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700'
                : 'bg-gradient-to-br from-blue-50 to-cyan-50 border-gray-200'
            }`}>
              <div className="p-8">
                <h3 className={`text-xl font-bold mb-4 flex items-center gap-2 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  <Clock className={`w-6 h-6 ${
                    theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'
                  }`} />
                  Heures d'Ouverture
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className={`font-medium ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Lun - Ven
                    </span>
                    <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                      9:00 - 18:00
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`font-medium ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Samedi
                    </span>
                    <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                      10:00 - 16:00
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`font-medium ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Dimanche
                    </span>
                    <span className={`${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Fermé
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className={`rounded-3xl border overflow-hidden ${
              theme === 'dark'
                ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700'
                : 'bg-gradient-to-br from-purple-50 to-pink-50 border-gray-200'
            }`}>
              <div className="p-8">
                <h3 className={`text-xl font-bold mb-4 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  Suivez-Nous
                </h3>
                <div className="flex gap-4">
                  {[
                    { icon: Linkedin, href: '#' },
                    { icon: Twitter, href: '#' },
                    { icon: Github, href: '#' }
                  ].map((social, idx) => {
                    const Icon = social.icon;
                    return (
                      <a
                        key={idx}
                        href={social.href}
                        className={`p-3 rounded-lg border transition hover:scale-110 ${
                          theme === 'dark'
                            ? 'bg-slate-700 border-slate-600 text-gray-400 hover:text-white hover:border-purple-500'
                            : 'bg-white border-gray-300 text-gray-600 hover:text-purple-600 hover:border-purple-300'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Response Time */}
            <div className={`rounded-3xl border overflow-hidden ${
              theme === 'dark'
                ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700'
                : 'bg-gradient-to-br from-green-50 to-emerald-50 border-gray-200'
            }`}>
              <div className="p-8">
                <h3 className={`text-xl font-bold mb-2 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  Temps de Réponse
                </h3>
                <p className={`${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Nous nous efforçons de répondre dans les <span className="font-bold">24 heures</span> à tous les messages.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
