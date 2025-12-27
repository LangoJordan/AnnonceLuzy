import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { User, Heart, ListTodo, Settings, Briefcase, BarChart, CreditCard, PlusCircle, ArrowRight, Shield, LogOut } from 'lucide-react';
import AgencySwitcher from '@/Components/AgencySwitcher';

export default function Dashboard({ auth, availableAgencies = [], selectedAgency = null }) {
    const isAdmin = auth.user.user_type === 'admin';
    const isManager = auth.user.user_type === 'manager';
    const isAgency = auth.user.user_type === 'agency';

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        Dashboard
                    </h2>
                    {(auth.user.user_type === 'employee' || auth.user.user_type === 'visitor') && availableAgencies.length > 0 && (
                        <AgencySwitcher
                            user={auth.user}
                            selectedAgency={selectedAgency}
                            availableAgencies={availableAgencies}
                        />
                    )}
                </div>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12 bg-gray-100 dark:bg-gray-900 min-h-screen">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-xl sm:rounded-lg p-6 lg:p-8">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                                Bienvenue, {auth.user.name}!
                            </h3>
                            <img
                                src={`https://picsum.photos/seed/${auth.user.id}/60/60`}
                                alt="User Avatar"
                                className="w-16 h-16 rounded-full border-2 border-indigo-500 shadow-md"
                            />
                        </div>

                        {/* Admin Dashboard Button */}
                        {isAdmin && (
                            <div className="mb-10 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="text-lg font-bold text-red-800 dark:text-red-300 flex items-center">
                                            <Shield className="w-5 h-5 mr-2" /> Espace Administrateur
                                        </h4>
                                        <p className="text-red-700 dark:text-red-400 mt-1">
                                            Gérez les utilisateurs, les agences, les abonnements et la modération.
                                        </p>
                                    </div>
                                    <Link href="/admin" className="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition shadow-md">
                                        <ArrowRight className="w-4 h-4 mr-2" /> Accéder
                                    </Link>
                                </div>
                            </div>
                        )}

                        {/* Manager Dashboard Button */}
                        {isManager && (
                            <div className="mb-10 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700 rounded-lg p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="text-lg font-bold text-orange-800 dark:text-orange-300 flex items-center">
                                            <Briefcase className="w-5 h-5 mr-2" /> Espace Manager
                                        </h4>
                                        <p className="text-orange-700 dark:text-orange-400 mt-1">
                                            Validez les agences, modérez les annonces et traitez les signalements.
                                        </p>
                                    </div>
                                    <Link href="/manager" className="inline-flex items-center px-6 py-3 bg-orange-600 text-white rounded-lg font-bold hover:bg-orange-700 transition shadow-md">
                                        <ArrowRight className="w-4 h-4 mr-2" /> Accéder
                                    </Link>
                                </div>
                            </div>
                        )}

                        {/* Agency Dashboard Button */}
                        {isAgency && (
                            <div className="mb-10 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 rounded-lg p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="text-lg font-bold text-emerald-800 dark:text-emerald-300 flex items-center">
                                            <Briefcase className="w-5 h-5 mr-2" /> Espace Agence
                                        </h4>
                                        <p className="text-emerald-700 dark:text-emerald-400 mt-1">
                                            Gérez vos annonces, espaces commerciaux et employés.
                                        </p>
                                    </div>
                                    <Link href="/agence" className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 transition shadow-md">
                                        <ArrowRight className="w-4 h-4 mr-2" /> Accéder
                                    </Link>
                                </div>
                            </div>
                        )}

                        <p className="text-lg text-gray-600 dark:text-gray-300 mb-10">
                            C'est votre espace personnalisé. Gérez vos annonces, vos favoris et votre profil ici.
                        </p>

                        {/* Visitor Quick Actions */}
                        {!isAdmin && !isManager && !isAgency && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                                {/* Quick Action Card: My Ads */}
                                <Link href="/my-ads" className="block bg-gradient-to-br from-indigo-500 to-indigo-700 hover:from-indigo-600 hover:to-indigo-800 transition-all duration-300 rounded-lg shadow-lg hover:shadow-xl p-6 text-white flex flex-col items-start space-y-4">
                                    <ListTodo className="w-10 h-10 text-white/80" />
                                    <h4 className="text-xl font-bold">Mes Annonces</h4>
                                    <p className="text-sm opacity-90">Gérez, modifiez ou boostez vos annonces publiées.</p>
                                    <span className="mt-auto text-sm font-medium flex items-center">
                                        Voir mes annonces <ArrowRight className="w-4 h-4 ml-2" />
                                    </span>
                                </Link>

                                {/* Quick Action Card: Favorites */}
                                <Link href="/favoris" className="block bg-gradient-to-br from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 transition-all duration-300 rounded-lg shadow-lg hover:shadow-xl p-6 text-white flex flex-col items-start space-y-4">
                                    <Heart className="w-10 h-10 text-white/80" />
                                    <h4 className="text-xl font-bold">Mes Favoris</h4>
                                    <p className="text-sm opacity-90">Retrouvez les annonces que vous avez aimées.</p>
                                    <span className="mt-auto text-sm font-medium flex items-center">
                                        Voir mes favoris <ArrowRight className="w-4 h-4 ml-2" />
                                    </span>
                                </Link>

                                {/* Quick Action Card: Profile Settings */}
                                <Link href="/profil" className="block bg-gradient-to-br from-purple-500 to-fuchsia-600 hover:from-purple-600 hover:to-fuchsia-700 transition-all duration-300 rounded-lg shadow-lg hover:shadow-xl p-6 text-white flex flex-col items-start space-y-4">
                                    <User className="w-10 h-10 text-white/80" />
                                    <h4 className="text-xl font-bold">Mon Profil</h4>
                                    <p className="text-sm opacity-90">Mettez à jour vos informations personnelles.</p>
                                    <span className="mt-auto text-sm font-medium flex items-center">
                                        Gérer le profil <ArrowRight className="w-4 h-4 ml-2" />
                                    </span>
                                </Link>
                            </div>
                        )}

                        {/* Additional Sections/Illustrations */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-gray-50 dark:bg-gray-900 p-8 rounded-xl shadow-inner">
                            <div>
                                <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Besoin d'aide ?</h4>
                                <p className="text-gray-700 dark:text-gray-300 mb-6">
                                    Notre équipe de support est là pour vous aider avec toutes vos questions.
                                </p>
                                <Link
                                    href="/contact"
                                    className="inline-flex items-center px-6 py-3 bg-indigo-500 text-white rounded-full font-medium hover:bg-indigo-600 transition shadow-md"
                                >
                                    <Settings className="w-4 h-4 mr-2" /> Contacter le support
                                </Link>
                            </div>
                            <div className="flex justify-center lg:justify-end">
                                <img
                                    src="https://picsum.photos/seed/dashboard-support/400/300"
                                    alt="Support Illustration"
                                    className="rounded-lg shadow-md max-w-full h-auto"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
