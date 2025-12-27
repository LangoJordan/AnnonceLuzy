import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { MapPin, Users, FileText, ArrowRight, Plus, Building2 } from 'lucide-react';

export default function SpaceManagement({ auth, spaces, agency }) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        Gestion des Espaces Commerciaux
                    </h2>
                    {auth.user.user_type === 'agency' && (
                        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition flex items-center gap-2">
                            <Plus className="w-4 h-4" />
                            Nouvel Espace
                        </button>
                    )}
                </div>
            }
        >
            <Head title="Espaces Commerciaux" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    {spaces.length === 0 ? (
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-12 text-center">
                            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Building2 className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Aucun espace commercial</h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-6">
                                {auth.user.user_type === 'agency' 
                                    ? "Commencez par créer votre premier espace commercial pour publier des annonces."
                                    : "Vous n'êtes assigné à aucun espace commercial pour le moment."}
                            </p>
                            {auth.user.user_type === 'agency' && (
                                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition">
                                    Créer un espace
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {spaces.map((space) => (
                                <Link 
                                    key={space.id} 
                                    href={route('agency.space-details', space.id)}
                                    className="block bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg hover:shadow-md transition duration-300 border border-transparent hover:border-indigo-500"
                                >
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                                <Building2 className="w-6 h-6" />
                                            </div>
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                space.status 
                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                                                    : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                            }`}>
                                                {space.status ? 'Actif' : 'Inactif'}
                                            </span>
                                        </div>

                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 truncate">
                                            {space.name}
                                        </h3>

                                        <div className="space-y-2 mb-6">
                                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                                <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                                                <span className="truncate">
                                                    {space.city?.name}, {space.country?.name}
                                                </span>
                                            </div>
                                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                                <Users className="w-4 h-4 mr-2 flex-shrink-0" />
                                                <span>{space.employee_count} employé(s)</span>
                                            </div>
                                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                                <FileText className="w-4 h-4 mr-2 flex-shrink-0" />
                                                <span>{space.ad_count} annonce(s)</span>
                                            </div>
                                        </div>

                                        <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
                                            <div className="text-xs text-gray-400">
                                                Code: <span className="font-mono font-medium text-gray-600 dark:text-gray-300">{space.merchant_code}</span>
                                            </div>
                                            <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400 flex items-center group">
                                                Gérer <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
