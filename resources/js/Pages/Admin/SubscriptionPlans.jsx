import { useState } from 'react';
import Header from '../../Components/Header';
import AdminSidebar from './AdminSidebar';
import Footer from '../../Components/Footer';
import { useThemeStore } from '../../store';
import SubscriptionPlanForm from '../../Components/Admin/SubscriptionPlanForm';
import {
  CreditCard, Plus, Edit2, Trash2, Check, Users, Zap, ArrowRight
} from 'lucide-react';
import { router } from '@inertiajs/react';

export default function AdminSubscriptionPlans({ plans, stats }) {
  const { theme } = useThemeStore();
  const [showForm, setShowForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);

  const handleEditPlan = (plan) => {
    setEditingPlan(plan);
    setShowForm(true);
  };

  const handleCreatePlan = () => {
    setEditingPlan(null);
    setShowForm(true);
  };

  const handleFormSubmit = () => {
    router.get('/admin/abonnements');
  };

  const handleDeletePlan = (planId) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce plan d\'abonnement ?')) {
      router.delete(`/admin/subscriptions/${planId}/delete`, {
        onSuccess: () => {
          router.get('/admin/abonnements');
        }
      });
    }
  };

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <Header />

      <div className="flex flex-1">
        <AdminSidebar />

        <main className="flex-1 overflow-auto">
          {/* Header */}
          <div className={theme === 'dark' ? 'bg-slate-900/50 border-b border-slate-800' : 'bg-white border-b border-gray-200'}>
            <div className="max-w-7xl mx-auto px-8 py-12 flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-3 flex items-center gap-3">
                  <CreditCard className="w-10 h-10 text-purple-600 dark:text-purple-400" />
                  Plans d'Abonnement
                </h1>
                <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}>
                  Gérer les plans d'abonnement et les souscriptions actives
                </p>
              </div>
              <button
                onClick={handleCreatePlan}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition ${
                  theme === 'dark'
                    ? 'bg-purple-600 hover:bg-purple-700 text-white'
                    : 'bg-purple-600 hover:bg-purple-700 text-white'
                }`}
              >
                <Plus className="w-5 h-5" />
                Nouveau Plan
              </button>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-8 py-16">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
              {[
                { label: 'Plans Totaux', value: stats?.total_plans || 0, icon: CreditCard },
                { label: 'Abonnements Actifs', value: stats?.active_subscriptions || 0, icon: Users },
                { label: 'Revenu', value: `XFA ${(stats?.total_revenue || 0).toLocaleString()}`, icon: Zap },
              ].map((stat) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className={`rounded-lg border p-4 ${theme === 'dark' ? 'border-slate-700 bg-slate-900' : 'border-gray-200 bg-white'}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className={`text-sm font-bold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>
                        {stat.label}
                      </p>
                      <Icon className="w-4 h-4 text-purple-500" />
                    </div>
                    <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                      {stat.value}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plans?.map((plan) => (
                <div
                  key={plan.id}
                  className={`rounded-lg border overflow-hidden ${
                    plan.level === 2
                      ? theme === 'dark'
                        ? 'border-purple-500 bg-gradient-to-br from-slate-900 to-slate-900/80 ring-2 ring-purple-500'
                        : 'border-purple-400 bg-gradient-to-br from-white to-purple-50 ring-2 ring-purple-400'
                      : theme === 'dark'
                      ? 'border-slate-700 bg-slate-900'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  {plan.level === 2 && (
                    <div className={`text-center py-2 font-bold text-sm ${
                      theme === 'dark'
                        ? 'bg-purple-600/20 text-purple-300'
                        : 'bg-purple-100 text-purple-700'
                    }`}>
                      POPULAIRE
                    </div>
                  )}

                  <div className="p-6">
                    <h3 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                      {plan.label}
                    </h3>

                    <div className="mb-6">
                      <p className={`text-sm mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        {plan.description}
                      </p>
                    </div>

                    <div className="mb-6 pb-6 border-b border-slate-700">
                      <p className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                        XFA {(plan.amount || 0).toLocaleString()}
                      </p>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        tous les {plan.duration_days} jours
                      </p>
                    </div>

                    <ul className="space-y-3 mb-6">
                      <li className="flex items-center gap-3">
                        <Check className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                        <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                          {plan.max_ads} annonces
                        </span>
                      </li>
                      {plan.features && Object.entries(plan.features).map(([feature, available]) => (
                        <li key={feature} className="flex items-center gap-3">
                          {available && <Check className="w-5 h-5 text-emerald-500 flex-shrink-0" />}
                          <span className={`text-sm ${available ? (theme === 'dark' ? 'text-gray-300' : 'text-gray-700') : theme === 'dark' ? 'text-gray-500 line-through' : 'text-gray-400 line-through'}`}>
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <div className="text-center mb-4">
                      <p className={`text-sm font-bold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        {plan.active_subscriptions?.toLocaleString() || 0} abonnements actifs
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditPlan(plan)}
                        className={`flex-1 px-4 py-2 rounded-lg border transition font-semibold text-sm ${
                          theme === 'dark'
                            ? 'border-slate-700 text-purple-400 hover:bg-slate-800'
                            : 'border-gray-300 text-purple-600 hover:bg-gray-100'
                        }`}
                      >
                        <Edit2 className="w-4 h-4 inline mr-2" />
                        Éditer
                      </button>
                      <button
                        onClick={() => handleDeletePlan(plan.id)}
                        className={`flex-1 px-4 py-2 rounded-lg border transition font-semibold text-sm ${
                          theme === 'dark'
                            ? 'border-red-500/30 text-red-400 hover:bg-red-500/10'
                            : 'border-red-300 text-red-600 hover:bg-red-100'
                        }`}
                      >
                        <Trash2 className="w-4 h-4 inline mr-2" />
                        Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      <Footer />

      {showForm && (
        <SubscriptionPlanForm
          plan={editingPlan}
          onClose={() => setShowForm(false)}
          onSubmit={handleFormSubmit}
        />
      )}
    </div>
  );
}
