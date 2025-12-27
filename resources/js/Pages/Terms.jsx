import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Gavel, FileText, AlertCircle, CheckCircle2, Info, Mail } from 'lucide-react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import { useThemeStore } from '../store';

export default function Terms({ user }) {
  const { theme } = useThemeStore();
  const [activeTab, setActiveTab] = useState('overview');

  const sections = [
    {
      id: 'acceptance',
      number: '01',
      title: 'Acceptation des Conditions',
      icon: CheckCircle2,
      description: 'En accédant et en utilisant LUZY, vous acceptez d\'être légalement lié par ces conditions.',
      content: 'En accédant et en utilisant LUZY, vous déclarez avoir lu, compris et accepté d\'être légalement lié par ces Conditions d\'Utilisation. Si vous n\'êtes pas d\'accord avec ces conditions, vous n\'êtes pas autorisé à utiliser notre service.'
    },
    {
      id: 'service',
      number: '02',
      title: 'Utilisation du Service',
      icon: FileText,
      description: 'LUZY est une plateforme de publication et consultation d\'annonces responsable.',
      content: 'LUZY est une plateforme destinée à la publication et la consultation d\'annonces. Vous vous engagez à utiliser le service de manière responsable, légale et en respectant les droits d\'autrui. Toute utilisation abusive, frauduleuse ou illégale du service est strictement interdite.'
    },
    {
      id: 'accounts',
      number: '03',
      title: 'Comptes Utilisateurs',
      icon: Info,
      description: 'Vous êtes responsable de toutes les activités de votre compte.',
      content: 'Pour accéder à certaines fonctionnalités de LUZY, vous devrez peut-être créer un compte. Vous êtes entièrement responsable de toutes les activités qui se produisent sous votre compte et de la confidentialité de votre mot de passe. Vous devez nous informer immédiatement de toute utilisation non autorisée de votre compte.'
    },
    {
      id: 'content',
      number: '04',
      title: 'Contenu Utilisateur',
      icon: AlertCircle,
      description: 'Vous êtes responsable du contenu que vous publiez sur la plateforme.',
      content: 'Vous êtes seul responsable du contenu que vous publiez sur LUZY. En publiant du contenu, vous garantissez que vous en détenez les droits et que celui-ci respecte nos règles de publication et la loi. LUZY se réserve le droit de retirer tout contenu jugé inapproprié ou illégal sans préavis.'
    },
    {
      id: 'liability',
      number: '05',
      title: 'Limitation de Responsabilité',
      icon: AlertCircle,
      description: 'LUZY agit en qualité d\'intermédiaire et ne garantit pas les transactions.',
      content: 'LUZY n\'agit qu\'en qualité d\'intermédiaire et ne saurait être tenue responsable des transactions ou des interactions entre utilisateurs. Nous ne garantissons pas l\'exactitude, l\'exhaustivité ou la fiabilité des annonces publiées. Votre utilisation du service se fait à vos propres risques.'
    },
    {
      id: 'changes',
      number: '06',
      title: 'Modification des Conditions',
      icon: FileText,
      description: 'Nous nous réservons le droit de modifier les conditions à tout moment.',
      content: 'LUZY se réserve le droit de modifier les présentes Conditions d\'Utilisation à tout moment. Les modifications entreront en vigueur dès leur publication sur le site web. Il est de votre responsabilité de consulter régulièrement ces conditions pour prendre connaissance des éventuelles mises à jour.'
    },
    {
      id: 'jurisdiction',
      number: '07',
      title: 'Droit Applicable et Juridiction',
      icon: Gavel,
      description: 'Ces conditions sont régies par le droit français et la compétence des tribunaux de Paris.',
      content: 'Ces Conditions d\'Utilisation sont régies par le droit français. Tout litige relatif à l\'interprétation ou à l\'exécution de ces conditions sera soumis à la compétence exclusive des tribunaux de Paris, France.'
    },
    {
      id: 'contact',
      number: '08',
      title: 'Contact',
      icon: Mail,
      description: 'Nous sommes là pour répondre à vos questions sur ces conditions.',
      content: 'Pour toute question concernant ces Conditions d\'Utilisation, veuillez nous contacter par e-mail à support@luzy.com ou en utilisant le formulaire de contact disponible sur notre site web.'
    }
  ];

  const TermsCard = ({ section }) => {
    const Icon = section.icon;

    return (
      <div className={`rounded-2xl border overflow-hidden transition-all hover:shadow-lg ${
        theme === 'dark'
          ? 'bg-slate-800 border-slate-700 hover:border-slate-600'
          : 'bg-white border-gray-200 hover:border-gray-300'
      }`}>
        <div className={`p-8 flex items-start gap-6 ${
          theme === 'dark' ? 'bg-slate-800/50' : 'bg-gray-50/50'
        }`}>
          <div className="flex-shrink-0">
            <span className={`text-4xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent`}>
              {section.number}
            </span>
          </div>
          <div className="flex-1">
            <div className="flex items-start gap-3 mb-2">
              <Icon className={`w-6 h-6 flex-shrink-0 mt-1 ${
                theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
              }`} />
              <h3 className={`text-xl lg:text-2xl font-bold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {section.title}
              </h3>
            </div>
            <p className={`text-base ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {section.description}
            </p>
          </div>
        </div>
        <div className={`px-8 py-6 border-t ${
          theme === 'dark'
            ? 'border-slate-700 text-gray-300'
            : 'border-gray-200 text-gray-700'
        }`}>
          <p className="leading-relaxed">
            {section.content}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-slate-950' : 'bg-white'}`}>
      <Head title="Conditions d'Utilisation - LUZY" />
      <Header user={user} />

      {/* Hero Section */}
      <section className={`relative py-16 lg:py-24 overflow-hidden ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'
          : 'bg-gradient-to-br from-purple-50 via-pink-50 to-white'
      }`}>
        <div className="absolute inset-0 opacity-10">
          <div className={`absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl ${
            theme === 'dark' ? 'bg-purple-600' : 'bg-purple-400'
          }`}></div>
          <div className={`absolute bottom-0 left-0 w-96 h-96 rounded-full blur-3xl ${
            theme === 'dark' ? 'bg-pink-600' : 'bg-pink-400'
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
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 text-white">
                <Gavel className="w-8 h-8" />
              </div>
              <h1 className={`text-5xl lg:text-6xl font-black ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Conditions d'Utilisation
              </h1>
            </div>
            <p className={`text-xl lg:text-2xl leading-relaxed ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Veuillez lire attentivement ces conditions qui régissent votre utilisation de la plateforme LUZY.
            </p>
          </div>
        </div>
      </section>

      {/* Key Points */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-8 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          <div className={`rounded-2xl border p-6 backdrop-blur-sm ${
            theme === 'dark'
              ? 'bg-slate-800/50 border-slate-700'
              : 'bg-white/50 border-gray-200'
          }`}>
            <CheckCircle2 className={`w-8 h-8 mb-3 ${
              theme === 'dark' ? 'text-green-400' : 'text-green-600'
            }`} />
            <h3 className={`font-bold text-lg mb-2 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Utilisation Responsable
            </h3>
            <p className={`text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Utilisez LUZY de manière légale et respectueuse
            </p>
          </div>
          <div className={`rounded-2xl border p-6 backdrop-blur-sm ${
            theme === 'dark'
              ? 'bg-slate-800/50 border-slate-700'
              : 'bg-white/50 border-gray-200'
          }`}>
            <AlertCircle className={`w-8 h-8 mb-3 ${
              theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'
            }`} />
            <h3 className={`font-bold text-lg mb-2 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Responsabilité du Contenu
            </h3>
            <p className={`text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Vous êtes responsable de ce que vous publiez
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-4">
          {sections.map((section) => (
            <TermsCard key={section.id} section={section} />
          ))}
        </div>

        {/* Important Notice */}
        <div className={`mt-20 rounded-3xl border overflow-hidden ${
          theme === 'dark'
            ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700'
            : 'bg-gradient-to-br from-purple-50 to-pink-50 border-gray-200'
        }`}>
          <div className="px-8 py-12 lg:p-16">
            <div className="flex items-start gap-4 mb-6">
              <AlertCircle className={`w-8 h-8 flex-shrink-0 ${
                theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'
              }`} />
              <h3 className={`text-2xl lg:text-3xl font-bold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Important à Noter
              </h3>
            </div>
            <p className={`text-lg mb-4 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              En acceptant ces conditions, vous reconnaissez que vous avez lu et compris l'intégralité de ce document. Si vous avez des questions ou des préoccupations, veuillez nous contacter avant d'utiliser la plateforme.
            </p>
            <p className={`text-base ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Dernière mise à jour: Décembre 2025
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
