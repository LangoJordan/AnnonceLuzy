import { useState, useEffect } from 'react';
import { Link, router } from '@inertiajs/react';
import Header from '../../Components/Header';
import AgencySidebar from './AgencySidebar';
import Footer from '../../Components/Footer';
import { useThemeStore } from '../../store';
import {
  ArrowLeft,
  Check,
  Lock,
  CreditCard,
  Smartphone,
  DollarSign,
  AlertCircle,
  ShieldCheck,
  Loader,
} from 'lucide-react';

export default function SubscriptionPayment({
  user,
  subscription = null,
  plan = null,
  selectedPlan = null,
  allPlans = [],
  billingHistory = []
}) {
  const { theme } = useThemeStore();
  const [step, setStep] = useState(1);
  const [selectedPayment, setSelectedPayment] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);

  const [formData, setFormData] = useState({
    card_number: '',
    card_holder: '',
    expiry: '',
    cvc: '',
    phone: '',
    pin: '',
  });

  const [errors, setErrors] = useState({});

  // Use selectedPlan from controller, or fall back to subscription/plan
  const currentPlan = selectedPlan || plan || subscription || {
    id: null,
    label: 'Plan',
    amount: 0,
    duration_days: 30,
    max_ads: 10,
  };

  const paymentMethods = [
    {
      id: 'card',
      name: 'Carte bancaire',
      icon: CreditCard,
      description: 'Visa, Mastercard, etc.',
    },
    {
      id: 'om',
      name: 'Orange Money',
      icon: Smartphone,
      description: 'Paiement mobile sécurisé',
    },
    {
      id: 'mtn',
      name: 'MTN Money',
      icon: Smartphone,
      description: 'Paiement mobile sécurisé',
    },
  ];

  const validateCardForm = () => {
    const newErrors = {};
    
    if (!formData.card_number.replace(/\s/g, '').match(/^\d{13,19}$/)) {
      newErrors.card_number = 'Numéro de carte invalide';
    }
    if (!formData.card_holder.trim()) {
      newErrors.card_holder = 'Nom du titulaire requis';
    }
    if (!formData.expiry.match(/^\d{2}\/\d{2}$/)) {
      newErrors.expiry = 'Format MM/YY requis';
    }
    if (!formData.cvc.match(/^\d{3,4}$/)) {
      newErrors.cvc = 'CVC invalide';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateMobileForm = () => {
    const newErrors = {};
    
    if (!formData.phone.match(/^[0-9]{8,13}$/)) {
      newErrors.phone = 'Numéro de téléphone invalide';
    }
    if (!formData.pin.match(/^\d{4}$/)) {
      newErrors.pin = 'Code PIN invalide (4 chiffres)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'card_number') {
      formattedValue = value.replace(/\s/g, '').match(/.{1,4}/g)?.join(' ') || value;
    } else if (name === 'expiry') {
      const numbers = value.replace(/\D/g, '');
      if (numbers.length >= 2) {
        formattedValue = numbers.slice(0, 2) + '/' + numbers.slice(2, 4);
      } else {
        formattedValue = numbers;
      }
    }

    setFormData((prev) => ({ ...prev, [name]: formattedValue }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handlePayment = () => {
    let isValid = false;

    if (selectedPayment === 'card') {
      isValid = validateCardForm();
    } else {
      isValid = validateMobileForm();
    }

    if (!isValid) return;
    if (!currentPlan || !currentPlan.id) {
      setErrors({ submit: 'Veuillez sélectionner un plan' });
      return;
    }

    setIsProcessing(true);

    // Use native Inertia POST method
    router.post('/agence/abonnements/renouveler', {
      subscription_id: currentPlan.id,
      payment_method: 'simulated',
    }, {
      onSuccess: () => {
        setStep('success');
        setTimeout(() => {
          router.visit('/agence/abonnements');
        }, 3000);
      },
      onError: (errors) => {
        setErrors({ submit: errors.payment || 'Erreur de paiement' });
        setIsProcessing(false);
      },
    });
  };

  if (step === 'success') {
    return (
      <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-gray-100 text-gray-900'}`}>
        <Header user={user} />

        <div className="flex flex-1">
          <AgencySidebar user={user} />

          <main className="flex-1">
            <div className="max-w-4xl mx-auto px-8 py-24 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 flex items-center justify-center mb-6 animate-bounce">
                <Check className="w-10 h-10 text-white" />
              </div>
              <h2 className={`text-3xl font-bold mb-3 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                Abonnement activé avec succès!
              </h2>
              <p className={`text-lg mb-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Votre nouvel abonnement est maintenant actif. Redirection en cours...
              </p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <Header user={user} />

      <div className="flex flex-1">
        <AgencySidebar user={user} />

        <main className="flex-1">
          <div className={theme === 'dark' ? 'bg-slate-900/50 border-b border-slate-800' : 'bg-white border-b border-gray-200'}>
            <div className="max-w-4xl mx-auto px-8 py-8">
              <div className="flex items-center justify-between">
                <Link
                  href="/agence/abonnements"
                  className={`inline-flex items-center gap-2 font-bold transition ${theme === 'dark' ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-700'}`}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Retour aux plans
                </Link>
                <span className={`px-4 py-2 rounded-full text-xs font-bold ${theme === 'dark' ? 'bg-purple-500/20 text-purple-300' : 'bg-purple-100 text-purple-700'}`}>
                  {currentPlan.label || 'Nouvel abonnement'}
                </span>
              </div>
              <h1 className={`text-3xl font-bold mt-4 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                Finaliser votre abonnement
              </h1>
            </div>
          </div>

          <div className="max-w-4xl mx-auto px-8 py-12">
            {/* Steps */}
            <div className="flex items-center justify-between mb-12">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition ${
                      s < step
                        ? 'bg-emerald-500 text-white'
                        : s === step
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white ring-2 ring-purple-600/30'
                        : theme === 'dark'
                        ? 'bg-slate-800 text-gray-400'
                        : 'bg-gray-300 text-gray-600'
                    }`}
                  >
                    {s < step ? <Check className="w-5 h-5" /> : s}
                  </div>
                  {s < 3 && (
                    <div
                      className={`h-1 flex-1 mx-3 transition ${
                        s < step
                          ? 'bg-emerald-500'
                          : theme === 'dark'
                          ? 'bg-slate-800'
                          : 'bg-gray-300'
                      }`}
                    ></div>
                  )}
                </div>
              ))}
            </div>

            {/* Step 1: Plan Review */}
            {step === 1 && (
              <div>
                <h2 className={`text-2xl font-bold mb-8 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                  Vérifier votre plan
                </h2>

                <div className={`rounded-lg border-2 p-8 mb-8 ${theme === 'dark' ? 'border-purple-600/50 bg-gradient-to-br from-slate-800 to-slate-900/50' : 'border-purple-200 bg-gradient-to-br from-purple-50 to-white'}`}>
                  <div className="flex items-start justify-between mb-8">
                    <div>
                      <h3 className="text-3xl font-bold mb-2">{currentPlan.label || 'Plan'}</h3>
                      <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                        Durée: {currentPlan.duration_days || 30} jours
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-2">
                        {currentPlan.amount || 0}€
                      </p>
                      <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                        /mois
                      </p>
                    </div>
                  </div>

                  <div className={`space-y-3 mb-8 pb-8 border-b ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
                    <div className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                      <span className={theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}>
                        Jusqu'à {currentPlan.max_ads || 10} annonces
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                      <span className={theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}>
                        Support prioritaire
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                      <span className={theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}>
                        Accès à tous les outils
                      </span>
                    </div>
                  </div>

                  <div className={`p-4 rounded-lg border flex items-center gap-3 ${theme === 'dark' ? 'border-emerald-500/20 bg-emerald-500/10' : 'border-emerald-300 bg-emerald-50'}`}>
                    <ShieldCheck className={theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'} />
                    <p className={`font-semibold ${theme === 'dark' ? 'text-emerald-300' : 'text-emerald-700'}`}>
                      Paiement sécurisé - Vos données sont protégées
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setStep(2)}
                  className="w-full py-4 rounded-lg font-bold text-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg transition"
                >
                  Continuer vers le paiement
                </button>
              </div>
            )}

            {/* Step 2: Payment Method */}
            {step === 2 && (
              <div>
                <h2 className={`text-2xl font-bold mb-8 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                  Choisir le mode de paiement
                </h2>

                {errors.submit && (
                  <div className={`mb-8 p-4 rounded-lg border flex items-start gap-3 ${theme === 'dark' ? 'border-red-500/20 bg-red-500/10' : 'border-red-300 bg-red-50'}`}>
                    <AlertCircle className={theme === 'dark' ? 'text-red-400' : 'text-red-600'} />
                    <p className={theme === 'dark' ? 'text-red-300' : 'text-red-700'}>
                      {errors.submit}
                    </p>
                  </div>
                )}

                <div className="space-y-3 mb-8">
                  {paymentMethods.map((method) => {
                    const Icon = method.icon;
                    return (
                      <label
                        key={method.id}
                        className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition ${
                          selectedPayment === method.id
                            ? theme === 'dark'
                              ? 'border-purple-500 bg-slate-800'
                              : 'border-purple-500 bg-purple-50'
                            : theme === 'dark'
                            ? 'border-slate-700 hover:border-slate-600'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment"
                          value={method.id}
                          checked={selectedPayment === method.id}
                          onChange={(e) => {
                            setSelectedPayment(e.target.value);
                            setErrors({});
                          }}
                          className="w-5 h-5"
                        />
                        <Icon className="w-6 h-6 text-purple-600 flex-shrink-0" />
                        <div className="flex-1">
                          <p className={`font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                            {method.name}
                          </p>
                          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            {method.description}
                          </p>
                        </div>
                        {selectedPayment === method.id && (
                          <Check className="w-5 h-5 text-purple-600 flex-shrink-0" />
                        )}
                      </label>
                    );
                  })}
                </div>

                {/* Card Payment Form */}
                {selectedPayment === 'card' && (
                  <div className={`rounded-lg border p-6 mb-8 ${theme === 'dark' ? 'border-slate-700 bg-slate-900' : 'border-gray-200 bg-white'}`}>
                    <h3 className={`font-bold text-lg mb-6 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                      Détails de la carte
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <label className={`block text-sm font-bold mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                          Numéro de carte
                        </label>
                        <input
                          type="text"
                          name="card_number"
                          placeholder="4242 4242 4242 4242"
                          value={formData.card_number}
                          onChange={handleInputChange}
                          maxLength="19"
                          autoComplete="off"
                          className={`w-full px-4 py-3 rounded-lg border font-mono focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                            errors.card_number
                              ? theme === 'dark' ? 'border-red-500 bg-slate-800' : 'border-red-500 bg-white'
                              : theme === 'dark' ? 'border-slate-700 bg-slate-800' : 'border-gray-300 bg-white'
                          } text-gray-900 dark:text-gray-100`}
                        />
                        {errors.card_number && <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>{errors.card_number}</p>}
                      </div>

                      <div>
                        <label className={`block text-sm font-bold mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                          Titulaire
                        </label>
                        <input
                          type="text"
                          name="card_holder"
                          placeholder="Jean Dupont"
                          value={formData.card_holder}
                          onChange={handleInputChange}
                          autoComplete="off"
                          className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                            errors.card_holder
                              ? theme === 'dark' ? 'border-red-500 bg-slate-800' : 'border-red-500 bg-white'
                              : theme === 'dark' ? 'border-slate-700 bg-slate-800' : 'border-gray-300 bg-white'
                          } text-gray-900 dark:text-gray-100`}
                        />
                        {errors.card_holder && <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>{errors.card_holder}</p>}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className={`block text-sm font-bold mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                            Expiration (MM/YY)
                          </label>
                          <input
                            type="text"
                            name="expiry"
                            placeholder="MM/YY"
                            value={formData.expiry}
                            onChange={handleInputChange}
                            maxLength="5"
                            autoComplete="off"
                            className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                              errors.expiry
                                ? theme === 'dark' ? 'border-red-500 bg-slate-800' : 'border-red-500 bg-white'
                                : theme === 'dark' ? 'border-slate-700 bg-slate-800' : 'border-gray-300 bg-white'
                            } text-gray-900 dark:text-gray-100`}
                          />
                          {errors.expiry && <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>{errors.expiry}</p>}
                        </div>

                        <div>
                          <label className={`block text-sm font-bold mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                            CVC
                          </label>
                          <input
                            type="text"
                            name="cvc"
                            placeholder="123"
                            value={formData.cvc}
                            onChange={handleInputChange}
                            maxLength="4"
                            autoComplete="off"
                            className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                              errors.cvc
                                ? theme === 'dark' ? 'border-red-500 bg-slate-800' : 'border-red-500 bg-white'
                                : theme === 'dark' ? 'border-slate-700 bg-slate-800' : 'border-gray-300 bg-white'
                            } text-gray-900 dark:text-gray-100`}
                          />
                          {errors.cvc && <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>{errors.cvc}</p>}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Mobile Payment Form */}
                {(selectedPayment === 'om' || selectedPayment === 'mtn') && (
                  <div className={`rounded-lg border p-6 mb-8 ${theme === 'dark' ? 'border-slate-700 bg-slate-900' : 'border-gray-200 bg-white'}`}>
                    <h3 className={`font-bold text-lg mb-6 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                      Détails du paiement mobile
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <label className={`block text-sm font-bold mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                          Numéro de téléphone
                        </label>
                        <div className="flex gap-2">
                          <span className={`inline-flex items-center px-3 rounded-l-lg border border-r-0 ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-gray-400' : 'bg-gray-100 border-gray-300 text-gray-600'}`}>
                            +
                          </span>
                          <input
                            type="text"
                            name="phone"
                            placeholder="212345678"
                            value={formData.phone}
                            onChange={handleInputChange}
                            autoComplete="off"
                            className={`flex-1 px-4 py-3 rounded-r-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                              errors.phone
                                ? theme === 'dark' ? 'border-red-500 bg-slate-800' : 'border-red-500 bg-white'
                                : theme === 'dark' ? 'border-slate-700 bg-slate-800' : 'border-gray-300 bg-white'
                            } text-gray-900 dark:text-gray-100`}
                          />
                        </div>
                        {errors.phone && <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>{errors.phone}</p>}
                      </div>

                      <div>
                        <label className={`block text-sm font-bold mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                          Code PIN (4 chiffres)
                        </label>
                        <input
                          type="password"
                          name="pin"
                          placeholder="••••"
                          value={formData.pin}
                          onChange={handleInputChange}
                          maxLength="4"
                          autoComplete="off"
                          className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 tracking-widest ${
                            errors.pin
                              ? theme === 'dark' ? 'border-red-500 bg-slate-800' : 'border-red-500 bg-white'
                              : theme === 'dark' ? 'border-slate-700 bg-slate-800' : 'border-gray-300 bg-white'
                          } text-gray-900 dark:text-gray-100`}
                        />
                        {errors.pin && <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>{errors.pin}</p>}
                      </div>

                      <div className={`p-3 rounded-lg border ${theme === 'dark' ? 'border-amber-500/20 bg-amber-500/10' : 'border-amber-300 bg-amber-50'}`}>
                        <p className={`text-sm ${theme === 'dark' ? 'text-amber-300' : 'text-amber-700'}`}>
                          Vous recevrez un SMS de confirmation après la transaction
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-4">
                  <button
                    onClick={() => setStep(1)}
                    disabled={isProcessing}
                    className={`flex-1 py-3 rounded-lg font-bold border transition ${isProcessing ? 'opacity-50 cursor-not-allowed' : theme === 'dark' ? 'border-slate-700 bg-slate-800 hover:bg-slate-700 text-gray-100' : 'border-gray-300 bg-white hover:bg-gray-100 text-gray-900'}`}
                  >
                    Retour
                  </button>
                  <button
                    onClick={handlePayment}
                    disabled={isProcessing}
                    className="flex-1 py-3 rounded-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin" />
                        Traitement...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5" />
                        Payer {currentPlan.amount || 0}€
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

    </div>
  );
}
