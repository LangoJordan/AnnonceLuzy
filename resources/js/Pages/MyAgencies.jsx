import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Building2, Users, BarChart3, MapPin, ArrowRight, Loader2, Clock } from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function MyAgencies({ user, agencies = [], selectedAgency = null }) {
    const [loadingAgency, setLoadingAgency] = useState(null);

    const handleSelectAgency = (agencyId, spaceId) => {
        setLoadingAgency(agencyId);
        router.post('/select-agency', {
            agency_id: agencyId,
            space_id: spaceId,
        }, {
            onFinish: () => setLoadingAgency(null),
        });
    };

    if (agencies.length === 0) {
        return (
            <AuthenticatedLayout
                header={
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        Mes agences
                    </h2>
                }
            >
                <Head title="Mes agences" />
                <div className="py-12">
                    <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6 text-center">
                            <Building2 className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                Aucune agence assignée
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Vous n'êtes assigné à aucune agence pour le moment.
                            </p>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Mes agences
                </h2>
            }
        >
            <Head title="Mes agences" />

            <div className="py-12">
                <div className="max-w-6xl mx-auto sm:px-6 lg:px-8">
                    {/* Header Info */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            Mes agences assignées
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Vous êtes assigné à {agencies.length} agence{agencies.length > 1 ? 's' : ''}.
                            Sélectionnez une agence pour gérer ses opérations.
                        </p>
                    </div>

                    {/* Selected Agency Banner */}
                    {selectedAgency && (
                        <div className="mb-8 p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-700 rounded-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                                        Agence actuellement sélectionnée
                                    </p>
                                    <p className="text-lg font-bold text-indigo-900 dark:text-indigo-100 mt-1">
                                        {selectedAgency.name}
                                    </p>
                                </div>
                                <Link
                                    href="/agence"
                                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
                                >
                                    Accéder au dashboard
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* Agencies Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {agencies.map((agency) => (
                            <div
                                key={agency.agency_id}
                                className={`bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-all border-2 overflow-hidden ${
                                    selectedAgency?.id === agency.agency_id
                                        ? 'border-indigo-500'
                                        : 'border-gray-200 dark:border-gray-700'
                                }`}
                            >
                                {/* Card Header */}
                                <div className={`p-6 ${
                                    selectedAgency?.id === agency.agency_id
                                        ? 'bg-indigo-50 dark:bg-indigo-900/20'
                                        : 'bg-gray-50 dark:bg-gray-700/50'
                                }`}>
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center space-x-3 flex-1">
                                            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center">
                                                <Building2 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                                    {agency.agency_name}
                                                </h3>
                                                {selectedAgency?.id === agency.agency_id && (
                                                    <span className="inline-block mt-1 px-3 py-1 bg-indigo-600 text-white text-xs font-semibold rounded-full">
                                                        Sélectionnée
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Card Content */}
                                <div className="p-6">
                                    {/* Spaces */}
                                    <div className="mb-6">
                                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                                            <MapPin className="w-4 h-4 mr-2" />
                                            Espaces commerciaux
                                        </p>
                                        <div className="space-y-2">
                                            {agency.spaces.map((space) => (
                                                <div
                                                    key={space.space_id}
                                                    className="px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded text-sm text-gray-700 dark:text-gray-300"
                                                >
                                                    {space.space_name}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Roles */}
                                    <div className="mb-6">
                                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                                            <Users className="w-4 h-4 mr-2" />
                                            Vos rôles
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {agency.spaces.map((space, idx) => (
                                                <span
                                                    key={idx}
                                                    className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full capitalize"
                                                >
                                                    {space.role}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Card Footer */}
                                <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700">
                                    <button
                                        onClick={() => handleSelectAgency(agency.agency_id, agency.spaces[0].space_id)}
                                        disabled={loadingAgency === agency.agency_id}
                                        className={`w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg font-medium transition ${
                                            selectedAgency?.id === agency.agency_id
                                                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                                                : 'bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-500'
                                        } ${loadingAgency === agency.agency_id ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        {loadingAgency === agency.agency_id ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                <span>Chargement...</span>
                                            </>
                                        ) : selectedAgency?.id === agency.agency_id ? (
                                            <>
                                                <ArrowRight className="w-4 h-4" />
                                                <span>Aller au dashboard</span>
                                            </>
                                        ) : (
                                            <>
                                                <ArrowRight className="w-4 h-4" />
                                                <span>Sélectionner</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Info Box */}
                    <div className="mt-12 p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
                        <p className="text-sm text-blue-800 dark:text-blue-300">
                            <Clock className="w-4 h-4 inline mr-2" />
                            <span className="font-semibold">Conseil :</span> Vous pouvez aussi changer d'agence rapidement via le sélecteur dans le header du dashboard.
                        </p>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
