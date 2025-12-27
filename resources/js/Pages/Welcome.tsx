import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Search, Briefcase, Home, Users, ArrowRight } from 'lucide-react'; // Import necessary icons

export default function Welcome({
    auth,
    laravelVersion,
    phpVersion,
}: PageProps<{ laravelVersion: string; phpVersion: string }>) {
    return (
        <>
            <Head title="Bienvenue sur LUZY" />
            <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:to-gray-800 text-gray-800 dark:text-gray-200 min-h-screen antialiased relative overflow-hidden">
                {/* Background Pattern/Overlay */}
                <div className="absolute inset-0 z-0 opacity-10 dark:opacity-5 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                
                {/* Navigation */}
                <nav className="relative z-10 w-full bg-white/80 dark:bg-black/70 backdrop-blur-md shadow-sm py-4">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8 flex justify-between items-center">
                        <Link href="/" className="flex items-center space-x-2">
                            <img src="/logo.png" alt="LUZY Logo" className="h-20 w-auto" />
                        </Link>
                        <div className="flex items-center space-x-4">
                            <Link href="/ads" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition font-medium">
                                Annonces
                            </Link>
                            <Link href="/about" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition font-medium">
                                À propos
                            </Link>
                            <Link href="/contact" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition font-medium">
                                Contact
                            </Link>
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-md"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="px-4 py-2 text-indigo-600 dark:text-indigo-400 border border-indigo-600 dark:border-indigo-400 rounded-lg hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-400 dark:hover:text-white transition shadow-md"
                                    >
                                        Se connecter
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-md"
                                    >
                                        S'inscrire
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <header className="relative py-20 lg:py-32 text-center overflow-hidden">
                    <div className="absolute inset-0 bg-black opacity-40 z-0"></div>
                    <img
                        src="https://picsum.photos/seed/hero-ads/1920/1080"
                        alt="Hero background"
                        className="absolute inset-0 w-full h-full object-cover z-0 filter blur-sm"
                    />
                    <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8 text-white">
                        <h1 className="text-4xl lg:text-6xl font-extrabold leading-tight mb-6 animate-fadeInDown">
                            Trouvez ou Publiez l'Annonce Parfaite
                        </h1>
                        <p className="text-lg lg:text-xl mb-10 opacity-90 animate-fadeInUp">
                            La plateforme ultime pour toutes vos annonces. Que vous cherchiez un emploi, un logement, des services, ou une formation, LUZY vous connecte.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fadeInUp delay-200">
                            <Link
                                href="/ads"
                                className="inline-flex items-center px-8 py-4 bg-indigo-600 text-white rounded-full font-bold text-lg hover:bg-indigo-700 transition transform hover:scale-105 shadow-lg"
                            >
                                <Search className="w-5 h-5 mr-3" /> Découvrir les Annonces
                            </Link>
                            <Link
                                href={auth.user ? route('ads.create') : route('register')}
                                className="inline-flex items-center px-8 py-4 bg-white text-indigo-600 rounded-full font-bold text-lg hover:bg-gray-100 transition transform hover:scale-105 shadow-lg"
                            >
                                <ArrowRight className="w-5 h-5 mr-3" /> Publier une Annonce
                            </Link>
                        </div>
                    </div>
                </header>

                <main className="relative z-10 py-16 lg:py-24">
                    {/* How It Works Section */}
                    <section className="max-w-7xl mx-auto px-6 lg:px-8 mb-20 text-center">
                        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-12">
                            Comment ça Marche ?
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                            <div className="flex flex-col items-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl transition-transform duration-300 hover:scale-105 group">
                                <img src="https://picsum.photos/seed/step1/200/150" alt="Parcourir les annonces" className="rounded-lg mb-6 shadow-md" />
                                <h3 className="text-xl font-semibold text-indigo-600 dark:text-indigo-400 mb-4">1. Parcourez les Annonces</h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Utilisez nos filtres avancés pour trouver rapidement ce que vous cherchez parmi des milliers d'annonces.
                                </p>
                            </div>
                            <div className="flex flex-col items-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl transition-transform duration-300 hover:scale-105 group">
                                <img src="https://picsum.photos/seed/step2/200/150" alt="Créer un compte" className="rounded-lg mb-6 shadow-md" />
                                <h3 className="text-xl font-semibold text-indigo-600 dark:text-indigo-400 mb-4">2. Créez Votre Compte</h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Inscrivez-vous gratuitement pour sauvegarder vos favoris et publier vos propres annonces.
                                </p>
                            </div>
                            <div className="flex flex-col items-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl transition-transform duration-300 hover:scale-105 group">
                                <img src="https://picsum.photos/seed/step3/200/150" alt="Publier une annonce" className="rounded-lg mb-6 shadow-md" />
                                <h3 className="text-xl font-semibold text-indigo-600 dark:text-indigo-400 mb-4">3. Publiez Votre Annonce</h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Décrivez votre offre ou demande, ajoutez des photos, et atteignez une large audience.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* User Types Section */}
                    <section className="bg-indigo-50 dark:bg-gray-900 py-16 lg:py-24">
                        <div className="max-w-7xl mx-auto px-6 lg:px-8">
                            <h2 className="text-3xl lg:text-4xl font-bold text-center text-gray-900 dark:text-white mb-16">
                                Pour Qui est LUZY ?
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                                {/* Visitor Card */}
                                <div className="flex flex-col items-center md:items-start text-center md:text-left p-10 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl hover:shadow-indigo-500/30 dark:hover:shadow-indigo-800/30 transition-all duration-300 transform hover:-translate-y-2">
                                    <Users className="w-16 h-16 text-indigo-600 dark:text-indigo-400 mb-6" />
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Visiteurs</h3>
                                    <p className="text-gray-700 dark:text-gray-300 mb-6">
                                        Recherchez des emplois, des biens immobiliers, des services ou des formations. Triez, filtrez, et ajoutez vos favoris en toute simplicité.
                                    </p>
                                    <Link
                                        href="/ads"
                                        className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-full font-medium hover:bg-indigo-700 transition"
                                    >
                                        <Search className="w-4 h-4 mr-2" /> Explorer les Annonces
                                    </Link>
                                </div>
                                <div className="hidden md:block">
                                    <img src="https://picsum.photos/seed/visitor/600/400" alt="Visitor illustration" className="rounded-2xl shadow-xl w-full h-auto object-cover" />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mt-16">
                                <div className="hidden md:block">
                                    <img src="https://picsum.photos/seed/agency/600/400" alt="Agency illustration" className="rounded-2xl shadow-xl w-full h-auto object-cover" />
                                </div>
                                {/* Agency Card */}
                                <div className="flex flex-col items-center md:items-end text-center md:text-right p-10 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl hover:shadow-indigo-500/30 dark:hover:shadow-indigo-800/30 transition-all duration-300 transform hover:-translate-y-2">
                                    <Briefcase className="w-16 h-16 text-emerald-600 dark:text-emerald-400 mb-6" />
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Agences & Professionnels</h3>
                                    <p className="text-gray-700 dark:text-gray-300 mb-6">
                                        Activez votre compte agence, publiez et boostez vos annonces, et gérez tout depuis un tableau de bord complet.
                                    </p>
                                    <Link
                                        href={auth.user ? route('agency.dashboard') : route('register')}
                                        className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white rounded-full font-medium hover:bg-emerald-700 transition"
                                    >
                                        <Briefcase className="w-4 h-4 mr-2" /> Devenir Annonceur
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>

                {/* Footer */}
                <footer className="relative z-10 py-10 bg-gray-100 dark:bg-gray-900 text-center text-sm text-gray-600 dark:text-gray-400">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8">
                        <p>&copy; {new Date().getFullYear()} LUZY. Tous droits réservés.</p>
                        <div className="mt-4 space-x-4">
                            <Link href="/privacy" className="hover:text-gray-800 dark:hover:text-white transition">Politique de Confidentialité</Link>
                            <Link href="/terms" className="hover:text-gray-800 dark:hover:text-white transition">Conditions Générales</Link>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
