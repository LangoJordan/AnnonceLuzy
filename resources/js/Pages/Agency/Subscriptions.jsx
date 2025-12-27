import { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import Header from '../../Components/Header';
import AgencySidebar from './AgencySidebar';
import { useThemeStore } from '../../store';
import {
  Check,
  X,
  Download,
  Loader,
} from 'lucide-react';

export default function AgencySubscriptions({ user, currentSubscription = null, plans = [], billingHistory = [] }) {
  const { theme } = useThemeStore();
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const savings = billingCycle === 'yearly' ? Math.round(49 * 12 - 490) : 0;

  const handlePlanSelect = (planId) => {
    setSelectedPlanId(planId);
    setIsProcessing(true);
    
    // Redirect to payment page with selected plan
    router.visit(`/agence/abonnements/renouveler?plan=${planId}`, { method: 'get' });
  };

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <Header user={user} />

      <div className="flex flex-1">
        <AgencySidebar user={user} />

        <main className="flex-1">
          <div className={theme === 'dark' ? 'bg-slate-900/50 border-b border-slate-800' : 'bg-white border-b border-gray-200'}>
            <div className="max-w-7xl mx-auto px-8 py-12">
              <h1 className="text-4xl font-bold mb-3">Plans d'abonnement</h1>
              <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}>
                Gérez votre plan et vos paiements
              </p>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-8 py-16">
            {/* Current Plan Section */}
            {currentSubscription ? (
              <div className="mb-20">
                <h2 className="text-2xl font-bold mb-8">Votre abonnement actuel</h2>
                <div className={`rounded-xl border-2 p-8 ${theme === 'dark' ? 'border-purple-500/30 bg-gradient-to-br from-slate-800 to-slate-900' : 'border-purple-300 bg-gradient-to-br from-purple-50 to-white'}`}>
                  <div className="flex items-start justify-between mb-8">
                    <div>
                      <div className="flex items-center gap-4 mb-4">
                        <h3 className="text-3xl font-bold">{currentSubscription.plan}</h3>
                        <span className={`px-4 py-2 rounded-full text-sm font-bold ${currentSubscription.status === 'active' ? (theme === 'dark' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-emerald-100 text-emerald-700') : (theme === 'dark' ? 'bg-red-500/20 text-red-300' : 'bg-red-100 text-red-700')}`}>
                          {currentSubscription.status === 'active' ? 'Actif' : 'Inactif'}
                        </span>
                      </div>
                      <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                        Renouvellement: {new Date(currentSubscription.nextBillingDate).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-2">
                        {currentSubscription.price}xfa
                      </p>
                      <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                        /mois
                      </p>
                    </div>
                  </div>

                  <div className={`grid grid-cols-2 gap-8 mb-8 pb-8 border-b ${theme === 'dark' ? 'border-slate-700' : 'border-gray-300'}`}>
                    <div>
                      <p className={`text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        Débuté le
                      </p>
                      <p className={`text-lg font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                        {new Date(currentSubscription.startDate).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <div>
                      <p className={`text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        Renouvellement automatique
                      </p>
                      <p className="text-lg font-bold text-emerald-500">{currentSubscription.autoRenew ? 'Activé' : 'Désactivé'}</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Link
                      href="/agence/abonnements/renouveler"
                      className={`flex-1 px-6 py-3 rounded-lg font-semibold transition text-center ${theme === 'dark' ? 'border border-slate-600 bg-slate-800 hover:bg-slate-700 text-gray-100' : 'border border-gray-300 bg-white hover:bg-gray-100 text-gray-900'}`}
                    >
                      Gérer le renouvellement
                    </Link>
                    <button className={`flex-1 px-6 py-3 rounded-lg font-semibold transition ${theme === 'dark' ? 'border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-400' : 'border border-red-300 bg-red-50 hover:bg-red-100 text-red-700'}`}>
                      Résilier
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mb-20">
                <div className={`rounded-xl border-l-4 p-8 ${theme === 'dark' ? 'border-l-red-500 bg-red-500/10 border border-red-500/20' : 'border-l-red-600 bg-red-50 border border-red-100'}`}>
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-red-300' : 'text-red-700'}`}>
                    ⚠️ Abonnement expiré
                  </h2>
                  <p className={`mb-6 text-lg ${theme === 'dark' ? 'text-red-200' : 'text-red-800'}`}>
                    Votre abonnement a expiré ou n'est plus actif. Pour continuer à gérer votre agence et créer des annonces, vous devez renouveler votre abonnement.
                  </p>
                  <button
                    onClick={() => window.location.href = '/agence/abonnements/renouveler'}
                    className={`px-6 py-3 rounded-lg font-bold transition ${theme === 'dark' ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-red-600 hover:bg-red-700 text-white'}`}
                  >
                    Renouveler mon abonnement
                  </button>
                </div>
              </div>
            )}

            {/* Plans Comparison */}
            {plans.length > 0 && (
              <div className="mb-20">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold">Tous nos plans</h2>
                  <div className={`flex items-center gap-4 p-1 rounded-lg ${theme === 'dark' ? 'bg-slate-800' : 'bg-white border border-gray-200'}`}>
                    <button
                      onClick={() => setBillingCycle('monthly')}
                      className={`px-4 py-2 rounded font-semibold transition ${billingCycle === 'monthly' ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' : theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                      Mensuel
                    </button>
                    <button
                      onClick={() => setBillingCycle('yearly')}
                      className={`px-4 py-2 rounded font-semibold transition ${billingCycle === 'yearly' ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' : theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                      Annuel
                    </button>
                  </div>
                </div>

                <div className={`grid gap-6 ${plans.length === 3 ? 'grid-cols-3' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
                  {plans.map((plan) => {
                    const price = billingCycle === 'monthly' ? plan.price : Math.round(plan.priceAnnual / 12);
                    const isLoading = selectedPlanId === plan.id && isProcessing;
                    
                    return (
                      <div
                        key={plan.id}
                        className={`rounded-xl border-2 overflow-hidden transition ${
                          plan.current
                            ? theme === 'dark'
                              ? 'border-purple-500 bg-gradient-to-b from-slate-800 to-slate-900 ring-2 ring-purple-500/50'
                              : 'border-purple-500 bg-gradient-to-b from-purple-100 to-white ring-2 ring-purple-500/30'
                            : theme === 'dark'
                            ? 'border-slate-700 bg-slate-900 hover:border-slate-600'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                      >
                        <div className="p-8">
                          <h3 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                            {plan.name}
                          </h3>
                          <p className={`text-sm mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            {plan.description}
                          </p>

                          <div className="mb-8">
                            <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-1">
                              {price}xfa
                            </p>
                            <p className={`text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                              {billingCycle === 'monthly' ? '/mois' : '/mois (annuel)'}
                            </p>
                          </div>

                          <button
                            onClick={() => handlePlanSelect(plan.id)}
                            disabled={plan.current || isLoading}
                            className={`w-full px-4 py-3 rounded-lg font-bold transition mb-8 flex items-center justify-center gap-2 ${
                              plan.current
                                ? theme === 'dark'
                                  ? 'border border-slate-600 bg-slate-800 text-gray-400'
                                  : 'border border-gray-300 bg-gray-100 text-gray-600'
                                : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed'
                            }`}
                          >
                            {isLoading ? (
                              <>
                                <Loader className="w-4 h-4 animate-spin" />
                                Traitement...
                              </>
                            ) : plan.current ? (
                              'Plan actuel'
                            ) : (
                              'Choisir ce plan'
                            )}
                          </button>

                          <div className="space-y-3">
                            {(plan.features || []).map((feature, idx) => (
                              <div key={idx} className="flex items-center gap-3">
                                <Check className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                                <span className={`text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                                  {feature}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Billing History */}
            {billingHistory.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-8">Historique de facturation</h2>
                <div className={`rounded-xl border overflow-hidden ${theme === 'dark' ? 'border-slate-700 bg-slate-900' : 'border-gray-200 bg-white'}`}>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className={`border-b ${theme === 'dark' ? 'border-slate-700 bg-slate-800' : 'border-gray-100 bg-gray-50'}`}>
                          <th className={`text-left px-8 py-4 font-bold text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-800'}`}>Date</th>
                          <th className={`text-left px-8 py-4 font-bold text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-800'}`}>Plan</th>
                          <th className={`text-left px-8 py-4 font-bold text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-800'}`}>Montant</th>
                          <th className={`text-left px-8 py-4 font-bold text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-800'}`}>Statut</th>
                          <th className={`text-left px-8 py-4 font-bold text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-800'}`}></th>
                        </tr>
                      </thead>
                      <tbody>
                        {billingHistory.map((item) => (
                          <tr
                            key={item.id}
                            className={`border-b transition ${theme === 'dark' ? 'border-slate-700 hover:bg-slate-800/30' : 'border-gray-100 hover:bg-gray-50'}`}
                          >
                            <td className={`px-8 py-4 font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                              {new Date(item.date).toLocaleDateString('fr-FR')}
                            </td>
                            <td className={`px-8 py-4 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                              <div className="flex items-center gap-2">
                                <span>{item.plan}</span>
                                <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                                  item.type === 'boost'
                                    ? (theme === 'dark' ? 'bg-amber-500/20 text-amber-300' : 'bg-amber-100 text-amber-700')
                                    : (theme === 'dark' ? 'bg-purple-500/20 text-purple-300' : 'bg-purple-100 text-purple-700')
                                }`}>
                                  {item.type === 'boost' ? 'BOOST' : 'ABONNEMENT'}
                                </span>
                              </div>
                            </td>
                            <td className={`px-8 py-4 font-bold text-purple-600 dark:text-purple-400`}>{item.amount}xfa</td>
                            <td className="px-8 py-4">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                                item.status === 'Success' || item.status === 'Completed' || item.status === 'completed'
                                  ? (theme === 'dark' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-emerald-100 text-emerald-700')
                                  : item.status === 'Pending' || item.status === 'pending'
                                  ? (theme === 'dark' ? 'bg-amber-500/20 text-amber-300' : 'bg-amber-100 text-amber-700')
                                  : (theme === 'dark' ? 'bg-red-500/20 text-red-300' : 'bg-red-100 text-red-700')
                              }`}>
                                {item.status === 'Success' || item.status === 'Completed' ? 'Payé' : item.status === 'Pending' ? 'En attente' : 'Échoué'}
                              </span>
                            </td>
                            <td className="px-8 py-4 text-right">
                              <button className={`inline-flex items-center gap-2 text-sm font-bold transition ${theme === 'dark' ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-700'}`}>
                                <Download className="w-4 h-4" />
                                Facture
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

    </div>
  );
}
