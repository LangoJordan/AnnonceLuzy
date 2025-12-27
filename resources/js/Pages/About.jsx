import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, TrendingUp, Users, Lightbulb, Zap, Target, Award, Heart, Globe } from 'lucide-react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import { useThemeStore } from '../store';

export default function About({ user }) {
  const { theme } = useThemeStore();

  const values = [
    {
      icon: Lightbulb,
      title: 'Innovation',
      description: 'Nous innovons constamment pour offrir les meilleures solutions.',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: Zap,
      title: 'Performance',
      description: 'Une plateforme rapide, fiable et toujours disponible.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Heart,
      title: 'Communauté',
      description: 'Nous construisons une communauté inclusive et bienveillante.',
      color: 'from-red-500 to-pink-500'
    },
    {
      icon: Globe,
      title: 'Accessibilité',
      description: 'Accessible à tous, partout dans le monde.',
      color: 'from-blue-500 to-cyan-500'
    }
  ];

  const stats = [
    { number: '10K+', label: 'Annonces Actives', icon: TrendingUp },
    { number: '5K+', label: 'Utilisateurs Satisfaits', icon: Users },
    { number: '98%', label: 'Taux de Satisfaction', icon: Award },
    { number: '24/7', label: 'Support Dédié', icon: Zap }
  ];

  const ValueCard = ({ value }) => {
    const Icon = value.icon;

    return (
      <div className={`group rounded-2xl border overflow-hidden transition-all hover:shadow-xl ${
        theme === 'dark'
          ? 'bg-slate-800 border-slate-700 hover:border-slate-600'
          : 'bg-white border-gray-200 hover:border-gray-300'
      }`}>
        <div className={`p-8 relative overflow-hidden h-full flex flex-col`}>
          <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity bg-gradient-to-r ${value.color}`}></div>
          
          <div className="relative z-10 mb-6">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${value.color} text-white flex items-center justify-center group-hover:scale-110 transition-transform`}>
              <Icon className="w-6 h-6" />
            </div>
          </div>
          
          <div className="relative z-10 flex-1">
            <h3 className={`text-xl font-bold mb-3 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {value.title}
            </h3>
            <p className={`leading-relaxed ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {value.description}
            </p>
          </div>
        </div>
      </div>
    );
  };

  const StatCard = ({ stat }) => {
    const Icon = stat.icon;

    return (
      <div className={`rounded-2xl border p-8 text-center ${
        theme === 'dark'
          ? 'bg-slate-800 border-slate-700'
          : 'bg-white border-gray-200'
      }`}>
        <Icon className={`w-8 h-8 mx-auto mb-4 ${
          theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
        }`} />
        <p className="text-4xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
          {stat.number}
        </p>
        <p className={`font-semibold ${
          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
        }`}>
          {stat.label}
        </p>
      </div>
    );
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-slate-950' : 'bg-white'}`}>
      <Head title="À propos de LUZY" />
      <Header user={user} />

      {/* Hero Section */}
      <section className={`relative py-16 lg:py-24 overflow-hidden ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'
          : 'bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50'
      }`}>
        <div className="absolute inset-0 opacity-10">
          <div className={`absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl ${
            theme === 'dark' ? 'bg-purple-600' : 'bg-purple-400'
          }`}></div>
          <div className={`absolute bottom-0 left-0 w-96 h-96 rounded-full blur-3xl ${
            theme === 'dark' ? 'bg-indigo-600' : 'bg-indigo-400'
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
              La Plateforme qui Connecte les Opportunités
            </h1>
            <p className={`text-xl lg:text-2xl leading-relaxed ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              LUZY est née de l'ambition de révolutionner le marché des annonces en ligne en créant une plateforme intuitive, sécurisée et performante.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-8 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {stats.map((stat) => (
            <StatCard key={stat.label} stat={stat} />
          ))}
        </div>
      </section>

      {/* Our Story */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className={`rounded-3xl border overflow-hidden ${
          theme === 'dark'
            ? 'bg-slate-800 border-slate-700'
            : 'bg-white border-gray-200'
        }`}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 p-8 lg:p-16 items-center">
            <div>
              <div className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-bold mb-6">
                Notre Histoire
              </div>
              <h2 className={`text-4xl lg:text-5xl font-black mb-6 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Née d'une Vision
              </h2>
              <div className="space-y-4">
                <p className={`text-lg leading-relaxed ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  En 2023, notre équipe a observé un problème récurrent : les utilisateurs avaient du mal à trouver une plateforme d'annonces vraiment fiable et intuitive.
                </p>
                <p className={`text-lg leading-relaxed ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  C'est ainsi que LUZY est née. Nous avons décidé de créer une plateforme qui met l'utilisateur au cœur de tout, avec une sécurité sans compromis et une expérience fluide.
                </p>
                <p className={`text-lg leading-relaxed ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Aujourd'hui, LUZY compte des milliers d'utilisateurs satisfaits qui nous font confiance chaque jour.
                </p>
              </div>
            </div>
            <div className={`rounded-2xl overflow-hidden h-96 ${
              theme === 'dark' ? 'bg-slate-700' : 'bg-gray-200'
            }`}>
              <img
                src="https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Our Story"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className={`text-4xl lg:text-5xl font-black mb-12 text-center ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          Notre Mission & Vision
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className={`rounded-3xl border overflow-hidden ${
            theme === 'dark'
              ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700'
              : 'bg-gradient-to-br from-blue-50 to-cyan-50 border-gray-200'
          }`}>
            <div className="p-8 lg:p-12">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white flex items-center justify-center mb-6">
                <Target className="w-7 h-7" />
              </div>
              <h3 className={`text-2xl lg:text-3xl font-bold mb-4 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Notre Mission
              </h3>
              <p className={`text-lg leading-relaxed ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Simplifier la publication et la recherche d'annonces en offrant une plateforme intuitive, sécurisée et performante où les utilisateurs trouvent une expérience inégalée.
              </p>
            </div>
          </div>

          <div className={`rounded-3xl border overflow-hidden ${
            theme === 'dark'
              ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700'
              : 'bg-gradient-to-br from-purple-50 to-pink-50 border-gray-200'
          }`}>
            <div className="p-8 lg:p-12">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white flex items-center justify-center mb-6">
                <Lightbulb className="w-7 h-7" />
              </div>
              <h3 className={`text-2xl lg:text-3xl font-bold mb-4 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Notre Vision
              </h3>
              <p className={`text-lg leading-relaxed ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Devenir la plateforme d'annonces mondiale de référence, en unissant les gens autour d'opportunités et en créant un impact positif dans les communautés.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className={`text-4xl lg:text-5xl font-black mb-12 text-center ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          Nos Valeurs
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value) => (
            <ValueCard key={value.title} value={value} />
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className={`rounded-3xl border overflow-hidden ${
          theme === 'dark'
            ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700'
            : 'bg-gradient-to-br from-indigo-50 to-purple-50 border-gray-200'
        }`}>
          <div className="p-8 lg:p-16">
            <h2 className={`text-4xl lg:text-5xl font-black mb-8 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Une Équipe de Passionnés
            </h2>
            <p className={`text-xl leading-relaxed mb-8 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Derrière LUZY, il y a une équipe diverse et talentueuse, composée d'experts en technologie, design, marketing et support client. Nous travaillons ensemble chaque jour pour améliorer l'expérience de nos utilisateurs.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition transform hover:scale-105"
            >
              Nous Rejoindre
              <TrendingUp className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={`max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 rounded-3xl border overflow-hidden ${
        theme === 'dark'
          ? 'bg-gradient-to-r from-purple-900 to-pink-900 border-purple-700'
          : 'bg-gradient-to-r from-purple-600 to-pink-600 border-purple-300'
      }`}>
        <div className="text-center">
          <h2 className="text-4xl lg:text-5xl font-black text-white mb-6">
            Prêt à Rejoindre le Mouvement?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Découvrez les opportunités qui vous attendent sur LUZY.
          </p>
          <Link
            href="/ads"
            className="inline-flex items-center gap-2 px-8 py-3 bg-white text-purple-600 rounded-xl font-bold hover:shadow-lg transition transform hover:scale-105"
          >
            Parcourir les Annonces
            <TrendingUp className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
