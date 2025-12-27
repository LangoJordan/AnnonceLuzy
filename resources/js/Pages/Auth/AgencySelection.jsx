import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Building2, MapPin, Badge, ArrowRight, LogOut } from 'lucide-react';

export default function AgencySelection({ user, agencies, selectedAgencyId, selectedSpaceId }) {
    const [loading, setLoading] = useState(false);

    const handleSelectAgency = (agencyId, spaceId) => {
        setLoading(true);
        router.post('/select-agency', {
            agency_id: agencyId,
            space_id: spaceId,
        }, {
            onFinish: () => setLoading(false),
        });
    };

    const handleLogout = () => {
        router.post('/logout');
    };

    return (
        <>
            <Head title="Sélectionner une agence" />
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
                {/* Background elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
                    <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse animation-delay-2000"></div>
                </div>

                {/* Header */}
                <div className="relative z-10 p-4 sm:p-6 flex justify-between items-center border-b border-purple-500/20">
                    <Link href="/" className="flex items-center space-x-2 text-white hover:opacity-80 transition">
                        <img src="/logo.png" alt="LUZY Logo" className="h-8 w-auto" />
                        <span className="font-bold text-xl hidden sm:inline">LUZY</span>
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 text-gray-300 hover:text-white transition px-4 py-2 rounded-lg hover:bg-red-500/10"
                    >
                        <LogOut className="w-4 h-4" />
                        <span className="hidden sm:inline">Déconnexion</span>
                    </button>
                </div>

                {/* Main content */}
                <div className="relative z-10 min-h-[calc(100vh-80px)] flex flex-col items-center justify-center p-4 sm:p-6">
                    <div className="w-full max-w-4xl">
                        {/* Welcome Section */}
                        <div className="mb-12 text-center">
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
                                Bienvenue, <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">{user.name}</span>
                            </h1>
                            <p className="text-lg text-gray-300 mb-2">
                                Vous êtes assigné à plusieurs agences
                            </p>
                            <p className="text-gray-400">
                                Veuillez sélectionner l'agence avec laquelle vous souhaitez travailler
                            </p>
                        </div>

                        {/* Agencies Grid */}
                        {agencies.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                {agencies.map((agency) => (
                                    <div key={agency.agency_id} className="group">
                                        <div className="bg-slate-800/50 backdrop-blur-xl border border-purple-500/20 rounded-xl p-6 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 h-full flex flex-col">
                                            {/* Agency Header */}
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-start space-x-3 flex-1">
                                                    <Building2 className="w-6 h-6 text-purple-400 flex-shrink-0 mt-1" />
                                                    <div className="flex-1">
                                                        <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition">
                                                            {agency.agency_name}
                                                        </h3>
                                                        <p className="text-sm text-gray-400 mt-1">
                                                            {agency.spaces.length} {agency.spaces.length === 1 ? 'espace' : 'espaces'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Spaces List */}
                                            <div className="space-y-3 mb-6 flex-1">
                                                {agency.spaces.map((space) => (
                                                    <div key={space.space_id} className="bg-slate-700/30 rounded-lg p-3 border border-slate-600/50">
                                                        <p className="text-sm font-semibold text-white mb-1">
                                                            {space.space_name}
                                                        </p>
                                                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs text-gray-400">
                                                            <div className="flex items-center space-x-1">
                                                                <MapPin className="w-3 h-3" />
                                                                <span>{space.location}</span>
                                                            </div>
                                                            <div className="flex items-center space-x-1">
                                                                <Badge className="w-3 h-3" />
                                                                <span className="capitalize">{space.role}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Select Button */}
                                            <button
                                                onClick={() => handleSelectAgency(agency.agency_id, agency.spaces[0].space_id)}
                                                disabled={loading}
                                                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 group/btn"
                                            >
                                                <span>{selectedAgencyId === agency.agency_id ? 'Sélectionné' : 'Sélectionner'}</span>
                                                {selectedAgencyId !== agency.agency_id && <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-slate-800/50 backdrop-blur-xl border border-red-500/20 rounded-xl p-8 text-center">
                                <Building2 className="w-12 h-12 text-red-400 mx-auto mb-4 opacity-50" />
                                <p className="text-gray-300 mb-4">
                                    Vous n'êtes assigné à aucune agence pour le moment.
                                </p>
                                <Link
                                    href="/"
                                    className="inline-flex items-center space-x-2 text-purple-400 hover:text-purple-300 transition font-semibold"
                                >
                                    <span>Retourner à l'accueil</span>
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        )}

                        {/* Help Section */}
                        {agencies.length > 0 && (
                            <div className="mt-12 p-6 bg-slate-800/30 border border-blue-500/20 rounded-xl">
                                <p className="text-sm text-gray-400">
                                    <span className="text-blue-400 font-semibold">💡 Conseil :</span> Une fois que vous avez sélectionné une agence, toutes les informations et opérations seront limitées à cette agence. Vous pourrez changer d'agence en cliquant sur le sélecteur d'agence dans votre tableau de bord.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
