import { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import { ChevronDown, Building2, LogOut, Plus } from 'lucide-react';

export default function AgencySwitcher({ user, selectedAgency, availableAgencies = [] }) {
    const [isOpen, setIsOpen] = useState(false);

    // Pour les employés avec positions d'agence
    if (user.user_type !== 'employee' && user.user_type !== 'visitor') {
        return null;
    }

    // Si pas d'agences disponibles
    if (!availableAgencies || availableAgencies.length === 0) {
        return null;
    }

    const handleSelectAgency = (agencyId, spaceId) => {
        router.post('/select-agency', {
            agency_id: agencyId,
            space_id: spaceId,
        }, {
            onSuccess: () => {
                setIsOpen(false);
                window.location.reload(); // Rafraîchir pour appliquer le nouveau contexte
            }
        });
    };

    const handleClearSelection = () => {
        router.post('/clear-agency-selection', {}, {
            onSuccess: () => {
                setIsOpen(false);
                router.visit('/dashboard');
            }
        });
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition text-gray-900 dark:text-white font-medium"
            >
                <Building2 className="w-4 h-4" />
                <span className="hidden sm:inline max-w-xs truncate">
                    {selectedAgency ? selectedAgency.name : 'Sélectionner une agence'}
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-50">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                            Agence actuelle
                        </p>
                        {selectedAgency ? (
                            <p className="text-base font-bold text-gray-900 dark:text-white">
                                {selectedAgency.name}
                            </p>
                        ) : (
                            <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                                Aucune agence sélectionnée
                            </p>
                        )}
                    </div>

                    <div className="max-h-64 overflow-y-auto">
                        {availableAgencies.length > 0 ? (
                            availableAgencies.map((agency) => (
                                <button
                                    key={agency.agency_id}
                                    onClick={() => handleSelectAgency(agency.agency_id, agency.spaces[0].space_id)}
                                    className={`w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition border-b border-gray-100 dark:border-gray-700 last:border-b-0 ${
                                        selectedAgency?.id === agency.agency_id
                                            ? 'bg-indigo-50 dark:bg-indigo-900/20'
                                            : ''
                                    }`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <p className="font-semibold text-gray-900 dark:text-white">
                                                {agency.agency_name}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                {agency.spaces.length} espace{agency.spaces.length !== 1 ? 's' : ''}
                                            </p>
                                        </div>
                                        {selectedAgency?.id === agency.agency_id && (
                                            <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2"></div>
                                        )}
                                    </div>
                                </button>
                            ))
                        ) : (
                            <div className="px-4 py-6 text-center">
                                <p className="text-gray-500 dark:text-gray-400 text-sm">
                                    Aucune agence disponible
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="border-t border-gray-200 dark:border-gray-700 p-3 space-y-2">
                        <Link
                            href="/select-agency"
                            className="flex items-center space-x-2 px-3 py-2 w-full text-left text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded transition"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Voir toutes les agences</span>
                        </Link>
                        <button
                            onClick={handleClearSelection}
                            className="flex items-center space-x-2 px-3 py-2 w-full text-left text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition"
                        >
                            <LogOut className="w-4 h-4" />
                            <span>Déselectionner agence</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
