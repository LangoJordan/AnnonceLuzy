import { Link } from '@inertiajs/react';
import { Building2, AlertCircle } from 'lucide-react';

export default function AgencyContextBanner({ agencyName, agencyId, spaceName, onChangeClick = null }) {
    if (!agencyName) {
        return (
            <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                    <p className="font-semibold text-yellow-800 dark:text-yellow-300">
                        Aucune agence sélectionnée
                    </p>
                    <p className="text-sm text-yellow-700 dark:text-yellow-400 mt-1">
                        Veuillez <Link href="/select-agency" className="underline font-semibold hover:no-underline">sélectionner une agence</Link> pour continuer.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="mb-6 p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-700 rounded-lg">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <Building2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    <div>
                        <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">
                            Agence actuelle
                        </p>
                        <p className="font-bold text-indigo-900 dark:text-indigo-200">
                            {agencyName}
                        </p>
                        {spaceName && (
                            <p className="text-sm text-indigo-700 dark:text-indigo-300 mt-1">
                                Espace : <span className="font-semibold">{spaceName}</span>
                            </p>
                        )}
                    </div>
                </div>
                {onChangeClick && (
                    <button
                        onClick={onChangeClick}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition text-sm"
                    >
                        Changer
                    </button>
                )}
            </div>
        </div>
    );
}
