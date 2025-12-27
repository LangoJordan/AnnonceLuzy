import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Shield, Lock, Eye, Check, ChevronDown, Mail } from 'lucide-react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import { useThemeStore } from '../store';

export default function Privacy({ user }) {
  const { theme } = useThemeStore();
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (id) => {
    setExpandedSections(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const sections = [
    {
      id: 1,
      title: 'Introduction',
      icon: Shield,
      color: 'from-blue-500 to-cyan-500',
      description: 'Bienvenue sur LUZY. La présente Politique de Confidentialité a pour but de vous informer sur la manière dont nous recueillons, utilisons, traitons et protégeons les données à caractère personnel que vous nous confiez lors de l\'utilisation de notre site web et de nos services.',
    },
    {
      id: 2,
      title: 'Collecte d\'Informations',
      icon: Eye,
      color: 'from-purple-500 to-pink-500',
      description: 'Nous recueillons des informations vous concernant de diverses manières. Les informations que vous nous fournissez directement incluent votre nom, adresse e-mail, numéro de téléphone, informations de paiement, et toute autre information que vous choisissez de partager lors de votre inscription, de la publication d\'une annonce, ou de la communication avec notre service client.',
      details: [
        'Informations directement fournies lors de l\'inscription',
        'Données d\'utilisation via cookies et technologies similaires',
        'Adresse IP et informations de navigateur',
        'Pages consultées et temps passé sur notre plateforme'
      ]
    },
    {
      id: 3,
      title: 'Utilisation des Informations',
      icon: Lock,
      color: 'from-green-500 to-emerald-500',
      description: 'Nous utilisons les informations collectées pour améliorer nos services, traiter vos transactions et gérer vos annonces.',
      details: [
        'Fournir, maintenir et améliorer nos services',
        'Traiter vos transactions et gérer vos annonces',
        'Communiquer avec vous et répondre à vos demandes',
        'Analyser les tendances et améliorer l\'efficacité',
        'Détecter et prévenir les activités frauduleuses'
      ]
    },
    {
      id: 4,
      title: 'Partage d\'Informations',
      icon: Check,
      color: 'from-orange-500 to-red-500',
      description: 'Nous ne partageons vos informations personnelles qu\'avec des tiers dans les circonstances suivantes et jamais à des fins de marketing sans votre consentement.',
      details: [
        'Avec votre consentement explicite',
        'Avec des prestataires de services de confiance',
        'Pour se conformer aux obligations légales',
        'En cas de fusion ou acquisition d\'actifs'
      ]
    },
    {
      id: 5,
      title: 'Sécurité des Données',
      icon: Shield,
      color: 'from-indigo-500 to-blue-500',
      description: 'Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles appropriées pour protéger vos informations personnelles contre l\'accès non autorisé, la modification et la destruction.',
    },
    {
      id: 6,
      title: 'Vos Droits',
      icon: Check,
      color: 'from-teal-500 to-cyan-500',
      description: 'Conformément à la réglementation applicable, vous disposez de droits spécifiques concernant vos données personnelles.',
      details: [
        'Droit d\'accès à vos données',
        'Droit de rectification de vos données',
        'Droit à l\'effacement ("droit à l\'oubli")',
        'Droit à la limitation du traitement',
        'Droit à la portabilité des données',
        'Droit d\'opposition au traitement'
      ]
    }
  ];

  const PrivacyCard = ({ section, expanded }) => {
    const Icon = section.icon;
    const colorGradient = section.color;

    return (
      <div className={`rounded-2xl border transition-all duration-300 ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 hover:border-slate-600'
          : 'bg-gradient-to-br from-white to-gray-50 border-gray-200 hover:border-gray-300'
      } ${expanded ? 'shadow-xl' : 'shadow-md hover:shadow-lg'} overflow-hidden`}>
        <button
          onClick={() => toggleSection(section.id)}
          className={`w-full px-6 py-5 flex items-center justify-between group ${
            expanded ? `bg-gradient-to-r ${colorGradient} text-white` : ''
          }`}
        >
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-lg ${
              expanded
                ? 'bg-white/20'
                : theme === 'dark'
                ? 'bg-gradient-to-br ' + colorGradient
                : 'bg-gradient-to-br ' + colorGradient
            }`}>
              <Icon className={`w-6 h-6 ${expanded ? 'text-white' : 'text-white'}`} />
            </div>
            <h3 className={`text-lg font-bold transition-colors ${
              expanded
                ? 'text-white'
                : theme === 'dark'
                ? 'text-white'
                : 'text-gray-900'
            }`}>
              {section.title}
            </h3>
          </div>
          <ChevronDown className={`w-5 h-5 transition-transform ${
            expanded
              ? 'rotate-180 text-white'
              : theme === 'dark'
              ? 'text-gray-400'
              : 'text-gray-600'
          }`} />
        </button>

        {expanded && (
          <div className={`px-6 py-6 space-y-4 ${
            theme === 'dark' ? 'bg-slate-800/50' : 'bg-gray-50/50'
          }`}>
            <p className={`leading-relaxed ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {section.description}
            </p>
            {section.details && (
              <ul className="space-y-3">
                {section.details.map((detail, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                      theme === 'dark' ? 'text-green-400' : 'text-green-600'
                    }`} />
                    <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                      {detail}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-slate-950' : 'bg-white'}`}>
      <Head title="Politique de Confidentialité - LUZY" />
      <Header user={user} />

      {/* Hero Section */}
      <section className={`relative py-16 lg:py-24 overflow-hidden ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'
          : 'bg-gradient-to-br from-blue-50 via-cyan-50 to-white'
      }`}>
        <div className="absolute inset-0 opacity-10">
          <div className={`absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl ${
            theme === 'dark' ? 'bg-blue-600' : 'bg-blue-300'
          }`}></div>
          <div className={`absolute bottom-0 left-0 w-96 h-96 rounded-full blur-3xl ${
            theme === 'dark' ? 'bg-cyan-600' : 'bg-cyan-300'
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
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                <Shield className="w-8 h-8" />
              </div>
              <h1 className={`text-5xl lg:text-6xl font-black ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Votre Confidentialité
              </h1>
            </div>
            <p className={`text-xl lg:text-2xl leading-relaxed ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Nous nous engageons à protéger vos données personnelles et à respecter votre vie privée. Cette politique explique comment nous collectons, utilisons et sécurisons vos informations.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-8 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className={`rounded-2xl border p-8 text-center backdrop-blur-sm ${
            theme === 'dark'
              ? 'bg-slate-800/50 border-slate-700'
              : 'bg-white/50 border-gray-200'
          }`}>
            <div className="text-4xl font-black bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent mb-2">
              100%
            </div>
            <p className={`font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Données Sécurisées
            </p>
          </div>
          <div className={`rounded-2xl border p-8 text-center backdrop-blur-sm ${
            theme === 'dark'
              ? 'bg-slate-800/50 border-slate-700'
              : 'bg-white/50 border-gray-200'
          }`}>
            <div className="text-4xl font-black bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent mb-2">
              24/7
            </div>
            <p className={`font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Surveillance Active
            </p>
          </div>
          <div className={`rounded-2xl border p-8 text-center backdrop-blur-sm ${
            theme === 'dark'
              ? 'bg-slate-800/50 border-slate-700'
              : 'bg-white/50 border-gray-200'
          }`}>
            <div className="text-4xl font-black bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent mb-2">
              RGPD
            </div>
            <p className={`font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Conforme & Certifié
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-4">
          {sections.map((section) => (
            <PrivacyCard
              key={section.id}
              section={section}
              expanded={expandedSections[section.id]}
            />
          ))}
        </div>

        {/* CTA Section */}
        <div className={`mt-20 rounded-3xl border overflow-hidden ${
          theme === 'dark'
            ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700'
            : 'bg-gradient-to-br from-blue-50 to-cyan-50 border-gray-200'
        }`}>
          <div className="px-8 py-12 lg:p-16">
            <div className="flex items-start gap-4 mb-6">
              <Mail className={`w-8 h-8 flex-shrink-0 ${
                theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
              }`} />
              <h3 className={`text-2xl lg:text-3xl font-bold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Des questions sur votre confidentialité?
              </h3>
            </div>
            <p className={`text-lg mb-8 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Notre équipe dédiée à la protection des données est à votre écoute pour répondre à toutes vos préoccupations.
            </p>
            <a href="mailto:privacy@luzy.com" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold hover:shadow-lg transition">
              <Mail className="w-5 h-5" />
              Contacter notre équipe
            </a>
          </div>
        </div>

        <p className={`mt-8 text-center text-sm ${
          theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
        }`}>
          Dernière mise à jour: Décembre 2025
        </p>
      </section>

      <Footer />
    </div>
  );
}
