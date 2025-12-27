import { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import Header from '../../Components/Header';
import AgencySidebar from './AgencySidebar';
import { useThemeStore } from '../../store';
import {
  ArrowLeft,
  Check,
  Eye,
  MousePointerClick,
  TrendingUp,
  Zap,
  CreditCard,
  Lock,
  Smartphone,
  ShieldCheck,
  AlertCircle,
  Loader,
} from 'lucide-react';

export default function BoostAd({ user, ad, packages = [] }) {
  const { theme } = useThemeStore();
  const [step, setStep] = useState(1);
  const [selectedPackageId, setSelectedPackageId] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [cardDetails, setCardDetails] = useState({
    number: '',
    holder: '',
    expiry: '',
    cvc: '',
  });
  const [mobileDetails, setMobileDetails] = useState({
    phone: '',
    pin: '',
  });

  if (!ad) {
    return (
      <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-gray-100 text-gray-900'}`}>
        <Header user={user} />
        <div className="flex flex-1">
          <AgencySidebar user={user} />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Annonce non trouvée</h2>
              <Link href="/agence/annonces" className="text-purple-600 hover:underline">Retour aux annonces</Link>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const selectedPackage = packages.find(p => p.id === selectedPackageId);

  const handlePurchase = () => {
    if (!selectedPackage) return;

    setIsProcessing(true);
    setError(null);

    // Use native Inertia POST method
    router.post(`/agence/annonces/${ad.id}/boost`, {
      boost_id: selectedPackage.id,
      payment_method: 'simulated',
    }, {
      onSuccess: () => {
        setStep('success');
        // Redirect after showing success message
        setTimeout(() => {
          router.visit(`/agence/annonces/${ad.id}`);
        }, 2000);
      },
      onError: (errors) => {
        setError(errors.payment || 'Erreur lors du paiement');
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
                Boost activé avec succès!
              </h2>
              <p className={`text-lg mb-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Votre annonce bénéficie désormais d'une meilleure visibilité. Redirection...
              </p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const currentPackage = selectedPackage;

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <Header user={user} />

      <div className="flex flex-1">
        <AgencySidebar user={user} />

        <main className="flex-1">
          <div className={theme === 'dark' ? 'bg-slate-900/50 border-b border-slate-800' : 'bg-white border-b border-gray-200'}>
            <div className="max-w-4xl mx-auto px-8 py-8">
              <Link
                href={`/agence/annonces/${ad.id}`}
                className={`inline-flex items-center gap-2 mb-6 font-bold transition ${theme === 'dark' ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-700'}`}
              >
                <ArrowLeft className="w-4 h-4" />
                Retour aux détails
              </Link>
              <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                Booster votre annonce
              </h1>
            </div>
          </div>

          <div className="max-w-4xl mx-auto px-8 py-12">
            {/* Ad Preview */}
            <div className={`rounded-lg border-2 border-dashed p-6 mb-12 ${theme === 'dark' ? 'border-slate-700 bg-slate-900/30' : 'border-gray-300 bg-gray-50'}`}>
              <h3 className={`font-bold text-lg mb-2 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                {ad.title}
              </h3>
              <p className={`text-sm font-semibold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>
                📍 {ad.location} • 👁️ {ad.views} vues • 🖱️ {ad.clicks} clics
              </p>
            </div>

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

            {error && (
              <div className={`rounded-lg p-4 mb-8 flex items-center gap-3 ${theme === 'dark' ? 'bg-red-500/10 border border-red-500/20' : 'bg-red-50 border border-red-200'}`}>
                <AlertCircle className={`w-5 h-5 flex-shrink-0 ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`} />
                <p className={`font-semibold ${theme === 'dark' ? 'text-red-300' : 'text-red-700'}`}>{error}</p>
              </div>
            )}

            {/* Step 1: Choose Package */}
            {step === 1 && (
              <div>
                <h2 className={`text-2xl font-bold mb-8 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                  Choisir un package
                </h2>
                {packages.length === 0 ? (
                  <div className={`text-center py-12 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    <p>Aucun package de boost disponible</p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-3 gap-6 mb-8">
                      {packages.map((pkg) => (
                        <div
                          key={pkg.id}
                          onClick={() => setSelectedPackageId(pkg.id)}
                          className={`relative rounded-xl border-2 cursor-pointer transition p-6 ${
                            selectedPackageId === pkg.id
                              ? theme === 'dark'
                                ? 'border-purple-500 bg-slate-800 ring-2 ring-purple-500/30'
                                : 'border-purple-500 bg-purple-50 ring-2 ring-purple-500/30'
                              : theme === 'dark'
                              ? 'border-slate-700 bg-slate-900 hover:border-slate-600'
                              : 'border-gray-200 bg-white hover:border-gray-300'
                          }`}
                        >
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${theme === 'dark' ? 'bg-slate-800' : 'bg-gray-100'}`}>
                            <Zap className="w-6 h-6 text-purple-600" />
                          </div>

                          <h3 className={`text-xl font-bold mb-1 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                            {pkg.name}
                          </h3>
                          <p className={`text-sm mb-6 font-semibold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>
                            {pkg.duration} jours
                          </p>

                          <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-6">
                            {pkg.price}€
                          </p>

                          <div className={`space-y-3 mb-6 pb-6 border-b ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
                            {pkg.benefits.map((benefit) => (
                              <div key={benefit.label} className="flex items-start gap-3">
                                <Check className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <p className={`text-xs font-bold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>
                                    {benefit.label}
                                  </p>
                                  <p className={`font-bold ${benefit.highlight ? 'text-purple-600' : theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                                    {benefit.value}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>

                          {selectedPackageId === pkg.id && (
                            <div className={`w-full py-2 rounded-lg border font-bold text-sm text-center transition ${theme === 'dark' ? 'bg-purple-500/20 border-purple-500/50 text-purple-300' : 'bg-purple-100 border-purple-300 text-purple-700'}`}>
                              Sélectionné
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => setStep(2)}
                      disabled={!selectedPackageId}
                      className={`w-full py-4 rounded-lg font-bold text-lg transition ${
                        selectedPackageId
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg'
                          : theme === 'dark'
                          ? 'bg-slate-800 text-gray-500 cursor-not-allowed'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      Continuer vers la confirmation
                    </button>
                  </>
                )}
              </div>
            )}

            {/* Step 2: Confirm */}
            {step === 2 && currentPackage && (
              <div>
                <h2 className={`text-2xl font-bold mb-8 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                  Vérifier votre commande
                </h2>

                <div className={`rounded-lg border p-8 mb-8 ${theme === 'dark' ? 'border-slate-700 bg-slate-900' : 'border-gray-200 bg-white'}`}>
                  <h3 className={`font-bold text-lg mb-6 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                    Résumé
                  </h3>

                  <div className={`space-y-4 pb-6 border-b ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
                    <div className="flex justify-between items-center">
                      <span className={`font-semibold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>Package</span>
                      <span className={`font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                        {currentPackage.name}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={`font-semibold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>Durée</span>
                      <span className={`font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                        {currentPackage.duration} jours
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={`font-semibold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>Début</span>
                      <span className={`font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                        {new Date().toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={`font-semibold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>Fin</span>
                      <span className={`font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                        {new Date(Date.now() + currentPackage.duration * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center py-6 mb-8">
                    <span className={`text-lg font-bold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                      Total
                    </span>
                    <span className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                      {currentPackage.price}€
                    </span>
                  </div>

                  <div className={`p-4 rounded-lg border ${theme === 'dark' ? 'border-emerald-500/20 bg-emerald-500/10' : 'border-emerald-300 bg-emerald-50'}`}>
                    <p className={`text-sm font-bold ${theme === 'dark' ? 'text-emerald-300' : 'text-emerald-700'}`}>
                      Résultats estimés: +{currentPackage.benefits[2].value.split('+')[1].split(' ')[0]} impressions
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setStep(1)}
                    className={`flex-1 py-3 rounded-lg font-bold border transition ${theme === 'dark' ? 'border-slate-700 bg-slate-800 hover:bg-slate-700 text-gray-100' : 'border-gray-300 bg-white hover:bg-gray-100 text-gray-900'}`}
                  >
                    Retour
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="flex-1 py-3 rounded-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg transition"
                  >
                    Aller au paiement
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Payment & Confirmation */}
            {step === 3 && currentPackage && (
              <div>
                <h2 className={`text-2xl font-bold mb-8 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                  Paiement
                </h2>

                <div className={`rounded-lg border p-8 mb-8 ${theme === 'dark' ? 'border-slate-700 bg-slate-900' : 'border-gray-200 bg-white'}`}>
                  <h3 className={`font-bold text-lg mb-6 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                    Méthode de paiement
                  </h3>

                  <div className="space-y-3 mb-8">
                    {[
                      { id: 'card', name: 'Carte bancaire', icon: CreditCard, description: 'Visa, Mastercard' },
                      { id: 'om', name: 'Orange Money', icon: Smartphone, description: 'Paiement mobile' },
                      { id: 'mtn', name: 'MTN Money', icon: Smartphone, description: 'Paiement mobile' },
                    ].map((method) => {
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
                              setError(null);
                            }}
                            className="w-5 h-5"
                          />
                          <Icon className="w-5 h-5 text-purple-600" />
                          <div className="flex-1 min-w-0">
                            <p className={`font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                              {method.name}
                            </p>
                            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                              {method.description}
                            </p>
                          </div>
                          {selectedPayment === method.id && (
                            <Check className="w-5 h-5 text-purple-600" />
                          )}
                        </label>
                      );
                    })}
                  </div>

                  {selectedPayment === 'card' && (
                    <div className="space-y-4 mb-8 pb-8 border-b border-gray-300/20">
                      <h3 className={`font-bold text-lg mb-4 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                        Détails de la carte
                      </h3>
                      <div>
                        <label className={`block text-sm font-bold mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                          Numéro de carte
                        </label>
                        <input
                          type="text"
                          placeholder="4242 4242 4242 4242"
                          maxLength="19"
                          value={cardDetails.number}
                          onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
                          autoComplete="off"
                          className={`w-full px-4 py-3 rounded-lg border font-mono focus:outline-none focus:ring-2 focus:ring-purple-500 ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-gray-100' : 'bg-white border-gray-300 text-gray-900'}`}
                        />
                      </div>
                      <div>
                        <label className={`block text-sm font-bold mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                          Titulaire
                        </label>
                        <input
                          type="text"
                          placeholder="Jean Dupont"
                          value={cardDetails.holder}
                          onChange={(e) => setCardDetails({...cardDetails, holder: e.target.value})}
                          autoComplete="off"
                          className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-gray-100' : 'bg-white border-gray-300 text-gray-900'}`}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className={`block text-sm font-bold mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                            Expiration (MM/YY)
                          </label>
                          <input
                            type="text"
                            placeholder="MM/YY"
                            maxLength="5"
                            value={cardDetails.expiry}
                            onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                            autoComplete="off"
                            className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-gray-100' : 'bg-white border-gray-300 text-gray-900'}`}
                          />
                        </div>
                        <div>
                          <label className={`block text-sm font-bold mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                            CVC
                          </label>
                          <input
                            type="text"
                            placeholder="123"
                            maxLength="4"
                            value={cardDetails.cvc}
                            onChange={(e) => setCardDetails({...cardDetails, cvc: e.target.value})}
                            autoComplete="off"
                            className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-gray-100' : 'bg-white border-gray-300 text-gray-900'}`}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {(selectedPayment === 'om' || selectedPayment === 'mtn') && (
                    <div className="space-y-4 mb-8 pb-8 border-b border-gray-300/20">
                      <h3 className={`font-bold text-lg mb-4 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                        Paiement mobile
                      </h3>
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
                            placeholder="212345678"
                            value={mobileDetails.phone}
                            onChange={(e) => setMobileDetails({...mobileDetails, phone: e.target.value})}
                            autoComplete="off"
                            className={`flex-1 px-4 py-3 rounded-r-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-gray-100' : 'bg-white border-gray-300 text-gray-900'}`}
                          />
                        </div>
                      </div>
                      <div>
                        <label className={`block text-sm font-bold mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                          Code PIN (4 chiffres)
                        </label>
                        <input
                          type="password"
                          placeholder="••••"
                          maxLength="4"
                          value={mobileDetails.pin}
                          onChange={(e) => setMobileDetails({...mobileDetails, pin: e.target.value})}
                          autoComplete="off"
                          className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 tracking-widest ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-gray-100' : 'bg-white border-gray-300 text-gray-900'}`}
                        />
                      </div>
                      <div className={`p-3 rounded-lg border ${theme === 'dark' ? 'border-amber-500/20 bg-amber-500/10' : 'border-amber-300 bg-amber-50'}`}>
                        <p className={`text-sm ${theme === 'dark' ? 'text-amber-300' : 'text-amber-700'}`}>
                          Vous recevrez un SMS de confirmation après la transaction
                        </p>
                      </div>
                    </div>
                  )}

                  <div className={`p-4 rounded-lg border flex items-center gap-3 mb-8 ${theme === 'dark' ? 'border-emerald-500/20 bg-emerald-500/10' : 'border-emerald-300 bg-emerald-50'}`}>
                    <ShieldCheck className={`w-5 h-5 flex-shrink-0 ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`} />
                    <p className={`text-sm font-semibold ${theme === 'dark' ? 'text-emerald-300' : 'text-emerald-700'}`}>
                      Paiement sécurisé - Vos données sont cryptées
                    </p>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => setStep(2)}
                      disabled={isProcessing}
                      className={`flex-1 py-3 rounded-lg font-bold border transition ${isProcessing ? 'opacity-50 cursor-not-allowed' : theme === 'dark' ? 'border-slate-700 bg-slate-800 hover:bg-slate-700 text-gray-100' : 'border-gray-300 bg-white hover:bg-gray-100 text-gray-900'}`}
                    >
                      Retour
                    </button>
                    <button 
                      onClick={handlePurchase}
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
                          Payer {currentPackage.price}€
                        </>
                      )}
                    </button>
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
