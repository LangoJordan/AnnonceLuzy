import { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import axios from 'axios';
import Header from '../../Components/Header';
import AgencySidebar from './AgencySidebar';
import Footer from '../../Components/Footer';
import ConfirmDialog from '../../Components/ConfirmDialog';
import { useThemeStore } from '../../store';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Plus,
  Edit2,
  Trash2,
  MapPin,
  Phone,
  Mail,
  Users,
  FileText,
  AlertCircle,
  Eye,
  EyeOff,
  Check,
} from 'lucide-react';

export default function SpaceDetails({
  user,
  space = null,
  employees = [],
  ads = [],
  countries = [],
  cities = [],
}) {
  const { theme } = useThemeStore();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showEmployeeForm, setShowEmployeeForm] = useState(false);
  const [employeeFormMode, setEmployeeFormMode] = useState('create'); // 'create' or 'existing'
  const [showPassword, setShowPassword] = useState(false);
  const [showSpaceEditForm, setShowSpaceEditForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [existingEmployeeSearch, setExistingEmployeeSearch] = useState('');
  const [availableEmployees, setAvailableEmployees] = useState([]);
  const [searchingEmployees, setSearchingEmployees] = useState(false);
  const [spaceFormData, setSpaceFormData] = useState({
    name: space?.name || '',
    merchant_code: space?.merchant_code || '',
    country_id: space?.country_id || '',
    city_id: space?.city_id || '',
    address: space?.address || '',
    phone: space?.phone || '',
    email: space?.email || '',
  });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: '',
    role: 'employee',
    space_ids: space ? [space.id] : [],
  });
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState([]);
  const [existingEmployeeData, setExistingEmployeeData] = useState({
    user_ids: [],
    role: 'employee',
    space_ids: space ? [space.id] : [],
  });
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    isDangerous: false,
    confirmText: 'Confirmer',
    onConfirm: null,
    isLoading: false,
  });

  if (!space) {
    return (
      <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-gray-100 text-gray-900'}`}>
        <Header user={user} />
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Espace non trouvé</h1>
            <Link href="/agence/espaces" className="text-purple-600 hover:text-purple-700">
              Retourner à la liste
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const slides = [
    {
      id: 'info',
      title: 'Informations',
      icon: FileText,
    },
    {
      id: 'employees',
      title: `Employés (${employees.length})`,
      icon: Users,
    },
    {
      id: 'ads',
      title: `Annonces (${ads.length})`,
      icon: FileText,
    },
  ];

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleExistingEmployeeSearch = async (query) => {
    if (query.trim().length < 2) {
      setAvailableEmployees([]);
      return;
    }

    setSearchingEmployees(true);
    try {
      const response = await axios.get('/agence/users/search', {
        params: { q: query },
        headers: {
          'Accept': 'application/json',
        },
      });

      setAvailableEmployees(response.data.data || []);
      setErrors({});
    } catch (error) {
      console.error('Error searching employees:', error);
      setAvailableEmployees([]);
      setErrors({ search: 'Erreur lors de la recherche d\'employés' });
    } finally {
      setSearchingEmployees(false);
    }
  };

  const handleSubmitEmployee = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (employeeFormMode === 'create') {
      router.post('/agence/employes', formData, {
        onError: (errors) => {
          setErrors(errors);
          setIsSubmitting(false);
        },
        onSuccess: () => {
          setShowEmployeeForm(false);
          setFormData({
            name: '',
            email: '',
            phone: '',
            password: '',
            password_confirmation: '',
            role: 'employee',
            space_ids: space ? [space.id] : [],
          });
          setIsSubmitting(false);
        },
      });
    } else {
      // For multiple employee assignment
      if (selectedEmployeeIds.length > 0) {
        router.post('/agence/employes/assign-multiple', {
          user_ids: selectedEmployeeIds,
          role: existingEmployeeData.role,
          space_id: space.id,
        }, {
          onError: (errors) => {
            setErrors(errors);
            setIsSubmitting(false);
          },
          onSuccess: () => {
            setShowEmployeeForm(false);
            setSelectedEmployeeIds([]);
            setExistingEmployeeData({
              role: 'employee',
            });
            setExistingEmployeeSearch('');
            setAvailableEmployees([]);
            setIsSubmitting(false);
          },
        });
      } else {
        setErrors({ 'employees': 'Veuillez sélectionner au moins un employé' });
        setIsSubmitting(false);
      }
    }
  };

  const handleDeleteEmployee = (positionId, employeeName) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Supprimer l\'employé',
      message: `Êtes-vous sûr de vouloir supprimer ${employeeName} de cet espace? Cet employé restera dans le système et pourra être assigné à un autre espace.`,
      isDangerous: true,
      confirmText: 'Supprimer',
      isLoading: false,
      onConfirm: () => {
        setConfirmDialog((prev) => ({ ...prev, isLoading: true }));
        router.delete(`/agence/employes/${positionId}`, {
          onSuccess: () => {
            setConfirmDialog({ ...confirmDialog, isOpen: false });
            setShowEmployeeForm(false);
          },
          onError: (errors) => {
            setConfirmDialog({ ...confirmDialog, isOpen: false });
            setErrors(errors);
          },
        });
      },
    });
  };

  const handleEditSpace = () => {
    setSpaceFormData({
      name: space?.name || '',
      description: space?.description || '',
      merchant_code: space?.merchant_code || '',
      country_id: space?.country_id || '',
      city_id: space?.city_id || '',
      address: space?.address || '',
      phone: space?.phone || '',
      email: space?.email || '',
    });
    setShowSpaceEditForm(true);
  };

  const handleSubmitSpaceEdit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    router.patch(`/agence/espaces/${space.id}`, spaceFormData, {
      onError: (errors) => {
        setErrors(errors);
        setIsSubmitting(false);
      },
      onSuccess: () => {
        setShowSpaceEditForm(false);
        setIsSubmitting(false);
      },
    });
  };

  const handleDeleteSpace = () => {
    setConfirmDialog({
      isOpen: true,
      title: 'Supprimer l\'espace',
      message: `Êtes-vous sûr de vouloir supprimer cet espace? Cette action est irréversible et supprimera tous les employés assignés à cet espace (les utilisateurs ne seront pas supprimés, seulement leurs postes dans cet espace).`,
      isDangerous: true,
      confirmText: 'Supprimer',
      isLoading: false,
      onConfirm: () => {
        setConfirmDialog((prev) => ({ ...prev, isLoading: true }));
        router.delete(`/agence/espaces/${space.id}`, {
          onSuccess: () => {
            router.visit('/agence/espaces');
          },
          onError: (errors) => {
            setConfirmDialog({ ...confirmDialog, isOpen: false });
            setErrors(errors);
          },
        });
      },
    });
  };

  const bgClass = theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-gray-100 text-gray-900';
  const cardBgClass = theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200';
  const headerBgClass = theme === 'dark' ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-gray-200';
  const inputBgClass = theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-300 text-gray-900';
  const buttonBgClass = 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg';
  const slideBgClass = theme === 'dark' ? 'bg-slate-800' : 'bg-gray-50';

  return (
    <div className={`min-h-screen flex flex-col ${bgClass}`}>
      <Header user={user} />

      <div className="flex flex-1">
        <AgencySidebar user={user} />

        <main className="flex-1">
          {/* Header */}
          <div className={`border-b ${headerBgClass}`}>
            <div className="max-w-7xl mx-auto px-8 py-8">
              <Link
                href="/agence/espaces"
                className={`inline-flex items-center gap-2 mb-4 font-semibold transition ${
                  theme === 'dark' ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-700'
                }`}
              >
                <ArrowLeft className="w-4 h-4" />
                Retour aux espaces
              </Link>
              <h1 className="text-4xl font-bold">{space.name}</h1>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-8 py-12">
            {/* Slides Navigation */}
            <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
              {slides.map((slide, index) => {
                const SlideIcon = slide.icon;
                return (
                  <button
                    key={slide.id}
                    onClick={() => goToSlide(index)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition whitespace-nowrap ${
                      currentSlide === index
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                        : theme === 'dark'
                        ? 'bg-slate-800 text-gray-300 hover:bg-slate-700'
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <SlideIcon className="w-4 h-4" />
                    {slide.title}
                  </button>
                );
              })}
            </div>

            {/* Slide Container */}
            <div className={`rounded-lg border-2 p-8 ${cardBgClass}`}>
              {/* Slide 1: Information */}
              {currentSlide === 0 && !showSpaceEditForm && (
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Informations de l'espace</h2>
                    <div className="flex gap-2">
                      <button
                        onClick={handleEditSpace}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition ${
                          theme === 'dark'
                            ? 'bg-slate-800 hover:bg-slate-700 text-gray-300'
                            : 'bg-white border border-gray-300 hover:bg-gray-100'
                        }`}
                      >
                        <Edit2 className="w-4 h-4" />
                        Modifier
                      </button>
                      <button
                        onClick={handleDeleteSpace}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10`}
                      >
                        <Trash2 className="w-4 h-4" />
                        Supprimer
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <h3 className={`text-sm font-bold mb-4 uppercase tracking-wider ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        Localisation
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <MapPin className="w-5 h-5 text-purple-600 flex-shrink-0 mt-1" />
                          <div>
                            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                              Pays & Ville
                            </p>
                            <p className="font-semibold">
                              {space.city?.name && space.country?.name
                                ? `${space.city.name}, ${space.country.name}`
                                : 'Non défini'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <MapPin className="w-5 h-5 text-purple-600 flex-shrink-0 mt-1" />
                          <div>
                            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                              Adresse
                            </p>
                            <p className="font-semibold">{space.address}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className={`text-sm font-bold mb-4 uppercase tracking-wider ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        Contact
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <Phone className="w-5 h-5 text-purple-600 flex-shrink-0 mt-1" />
                          <div>
                            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                              Téléphone
                            </p>
                            <p className="font-semibold">{space.phone}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Mail className="w-5 h-5 text-purple-600 flex-shrink-0 mt-1" />
                          <div>
                            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                              Email
                            </p>
                            <p className="font-semibold break-all">{space.email}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`border-t ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'} pt-8`}>
                    <h3 className={`text-sm font-bold mb-4 uppercase tracking-wider ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      Référence
                    </h3>
                    <div className={`p-4 rounded-lg ${slideBgClass} border ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        Code marchand
                      </p>
                      <p className="font-mono text-lg font-bold text-purple-600">
                        {space.merchant_code}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Slide 1: Edit Space Form */}
              {currentSlide === 0 && showSpaceEditForm && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold">Modifier l'espace</h2>

                  {Object.keys(errors).length > 0 && (
                    <div
                      className={`p-4 rounded-lg flex items-start gap-3 ${
                        theme === 'dark'
                          ? 'bg-red-500/10 border border-red-500/30'
                          : 'bg-red-50 border border-red-300'
                      }`}
                    >
                      <AlertCircle
                        className={`w-5 h-5 flex-shrink-0 ${
                          theme === 'dark' ? 'text-red-400' : 'text-red-600'
                        }`}
                      />
                      <div>
                        {Object.entries(errors).map(([field, messages]) => (
                          <p
                            key={field}
                            className={theme === 'dark' ? 'text-red-400' : 'text-red-700'}
                          >
                            {Array.isArray(messages) ? messages.join(', ') : messages}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleSubmitSpaceEdit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={`block text-sm font-bold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                          Nom de l'espace
                        </label>
                        <input
                          type="text"
                          value={spaceFormData.name}
                          onChange={(e) => setSpaceFormData({ ...spaceFormData, name: e.target.value })}
                          className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 ${inputBgClass}`}
                          required
                        />
                      </div>

                      <div>
                        <label className={`block text-sm font-bold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                          Code marchant
                        </label>
                        <input
                          type="text"
                          value={spaceFormData.merchant_code}
                          onChange={(e) => setSpaceFormData({ ...spaceFormData, merchant_code: e.target.value })}
                          placeholder="Code unique"
                          className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 ${inputBgClass}`}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={`block text-sm font-bold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                          Pays
                        </label>
                        <select
                          value={spaceFormData.country_id}
                          onChange={(e) => setSpaceFormData({ ...spaceFormData, country_id: e.target.value })}
                          className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 ${inputBgClass}`}
                          required
                        >
                          <option value="">Sélectionner un pays</option>
                          {countries.map((country) => (
                            <option key={country.id} value={country.id}>
                              {country.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className={`block text-sm font-bold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                          Ville
                        </label>
                        <select
                          value={spaceFormData.city_id}
                          onChange={(e) => setSpaceFormData({ ...spaceFormData, city_id: e.target.value })}
                          className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 ${inputBgClass}`}
                          required
                        >
                          <option value="">Sélectionner une ville</option>
                          {cities.map((city) => (
                            <option key={city.id} value={city.id}>
                              {city.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className={`block text-sm font-bold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        Adresse
                      </label>
                      <input
                        type="text"
                        value={spaceFormData.address}
                        onChange={(e) => setSpaceFormData({ ...spaceFormData, address: e.target.value })}
                        className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 ${inputBgClass}`}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={`block text-sm font-bold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                          Téléphone
                        </label>
                        <input
                          type="tel"
                          value={spaceFormData.phone}
                          onChange={(e) => setSpaceFormData({ ...spaceFormData, phone: e.target.value })}
                          className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 ${inputBgClass}`}
                          required
                        />
                      </div>
                      <div>
                        <label className={`block text-sm font-bold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                          Email
                        </label>
                        <input
                          type="email"
                          value={spaceFormData.email}
                          onChange={(e) => setSpaceFormData({ ...spaceFormData, email: e.target.value })}
                          className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 ${inputBgClass}`}
                          required
                        />
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`flex-1 ${buttonBgClass} px-4 py-2 rounded-lg font-bold transition disabled:opacity-50`}
                      >
                        {isSubmitting ? 'Modification en cours...' : 'Enregistrer les modifications'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowSpaceEditForm(false)}
                        className={`flex-1 px-4 py-2 rounded-lg font-bold border transition ${
                          theme === 'dark'
                            ? 'border-slate-700 bg-slate-800 hover:bg-slate-700'
                            : 'border-gray-300 bg-white hover:bg-gray-100'
                        }`}
                      >
                        Annuler
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Slide 2: Employees */}
              {currentSlide === 1 && (
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Employés de l'espace</h2>
                    <button
                      onClick={() => setShowEmployeeForm(!showEmployeeForm)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition ${buttonBgClass}`}
                    >
                      <Plus className="w-4 h-4" />
                      Ajouter employé
                    </button>
                  </div>

                  {showEmployeeForm && (
                    <form
                      onSubmit={handleSubmitEmployee}
                      className={`p-6 rounded-lg border-2 ${cardBgClass} space-y-4`}
                    >
                      <div className="flex gap-2 mb-4">
                        <button
                          type="button"
                          onClick={() => {
                            setEmployeeFormMode('create');
                            setErrors({});
                          }}
                          className={`px-4 py-2 rounded-lg font-semibold transition ${
                            employeeFormMode === 'create'
                              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                              : theme === 'dark'
                              ? 'bg-slate-800 text-gray-300 hover:bg-slate-700'
                              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          Créer nouveau
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEmployeeFormMode('existing');
                            setErrors({});
                          }}
                          className={`px-4 py-2 rounded-lg font-semibold transition ${
                            employeeFormMode === 'existing'
                              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                              : theme === 'dark'
                              ? 'bg-slate-800 text-gray-300 hover:bg-slate-700'
                              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          Assigner existant
                        </button>
                      </div>

                      <h3 className="font-bold text-lg">
                        {employeeFormMode === 'create' ? 'Créer un nouvel employé' : 'Assigner un employé existant'}
                      </h3>

                      {Object.keys(errors).length > 0 && (
                        <div
                          className={`p-4 rounded-lg flex items-start gap-3 ${
                            theme === 'dark'
                              ? 'bg-red-500/10 border border-red-500/30'
                              : 'bg-red-50 border border-red-300'
                          }`}
                        >
                          <AlertCircle
                            className={`w-5 h-5 flex-shrink-0 ${
                              theme === 'dark' ? 'text-red-400' : 'text-red-600'
                            }`}
                          />
                          <div>
                            {Object.entries(errors).map(([field, messages]) => (
                              <p
                                key={field}
                                className={theme === 'dark' ? 'text-red-400' : 'text-red-700'}
                              >
                                {Array.isArray(messages) ? messages.join(', ') : messages}
                              </p>
                            ))}
                          </div>
                        </div>
                      )}

                      {employeeFormMode === 'create' ? (
                        <>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className={`block text-sm font-bold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                Nom complet
                              </label>
                              <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 ${inputBgClass}`}
                                required
                              />
                            </div>
                            <div>
                              <label className={`block text-sm font-bold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                Email
                              </label>
                              <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 ${inputBgClass}`}
                                required
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className={`block text-sm font-bold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                Téléphone
                              </label>
                              <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 ${inputBgClass}`}
                              />
                            </div>
                            <div>
                              <label className={`block text-sm font-bold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                Rôle
                              </label>
                              <select
                                name="role"
                                value={formData.role}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 ${inputBgClass}`}
                              >
                                <option value="employee">Employé</option>
                                <option value="commercial">Commercial</option>
                                <option value="manager">Manager</option>
                              </select>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className={`block text-sm font-bold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                Mot de passe
                              </label>
                              <div className="relative">
                                <input
                                  type={showPassword ? 'text' : 'password'}
                                  name="password"
                                  value={formData.password}
                                  onChange={handleInputChange}
                                  className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 ${inputBgClass}`}
                                  required
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowPassword(!showPassword)}
                                  className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                                    theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'
                                  }`}
                                >
                                  {showPassword ? (
                                    <EyeOff className="w-4 h-4" />
                                  ) : (
                                    <Eye className="w-4 h-4" />
                                  )}
                                </button>
                              </div>
                            </div>
                            <div>
                              <label className={`block text-sm font-bold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                Confirmer le mot de passe
                              </label>
                              <input
                                type={showPassword ? 'text' : 'password'}
                                name="password_confirmation"
                                value={formData.password_confirmation}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 ${inputBgClass}`}
                                required
                              />
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div>
                            <label className={`block text-sm font-bold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                              Rechercher des employés
                            </label>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={existingEmployeeSearch}
                                onChange={(e) => setExistingEmployeeSearch(e.target.value)}
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') {
                                    handleExistingEmployeeSearch(existingEmployeeSearch);
                                  }
                                }}
                                placeholder="Rechercher par nom ou email..."
                                className={`flex-1 px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 ${inputBgClass}`}
                              />
                              <button
                                type="button"
                                onClick={() => handleExistingEmployeeSearch(existingEmployeeSearch)}
                                disabled={searchingEmployees || existingEmployeeSearch.trim().length < 2}
                                className={`px-4 py-2 rounded-lg font-semibold transition ${
                                  searchingEmployees || existingEmployeeSearch.trim().length < 2
                                    ? 'opacity-50 cursor-not-allowed bg-gray-400 text-white'
                                    : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg'
                                }`}
                              >
                                {searchingEmployees ? 'Recherche...' : 'Rechercher'}
                              </button>
                            </div>
                          </div>

                          {availableEmployees.length > 0 && (
                            <div className={`rounded-lg border-2 ${theme === 'dark' ? 'border-slate-700' : 'border-gray-300'}`}>
                              <div className={`p-4 ${slideBgClass} border-b ${theme === 'dark' ? 'border-slate-700' : 'border-gray-300'}`}>
                                <p className={`text-sm font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                  Résultats ({availableEmployees.length})
                                </p>
                              </div>
                              <div className="max-h-64 overflow-y-auto">
                                {availableEmployees.map((emp) => (
                                  <label
                                    key={emp.id}
                                    className={`flex items-center gap-3 px-4 py-3 border-b cursor-pointer hover:bg-purple-50 dark:hover:bg-slate-800 transition ${
                                      theme === 'dark' ? 'border-slate-700' : 'border-gray-300'
                                    }`}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={selectedEmployeeIds.includes(emp.id)}
                                      onChange={(e) => {
                                        if (e.target.checked) {
                                          setSelectedEmployeeIds([...selectedEmployeeIds, emp.id]);
                                        } else {
                                          setSelectedEmployeeIds(selectedEmployeeIds.filter((id) => id !== emp.id));
                                        }
                                      }}
                                      className="w-5 h-5 rounded cursor-pointer"
                                    />
                                    <div className="flex-1">
                                      <p className="font-semibold">{emp.name}</p>
                                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{emp.email}</p>
                                    </div>
                                  </label>
                                ))}
                              </div>
                            </div>
                          )}

                          {selectedEmployeeIds.length > 0 && (
                            <div className={`p-4 rounded-lg border-2 ${slideBgClass}`}>
                              <p className={`text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                Employés sélectionnés ({selectedEmployeeIds.length})
                              </p>
                              <div className="space-y-2">
                                {availableEmployees
                                  .filter((emp) => selectedEmployeeIds.includes(emp.id))
                                  .map((emp) => (
                                    <div
                                      key={emp.id}
                                      className={`px-3 py-2 rounded ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'} border ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}
                                    >
                                      <p className="font-medium">{emp.name}</p>
                                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{emp.email}</p>
                                    </div>
                                  ))}
                              </div>
                            </div>
                          )}

                          <div>
                            <label className={`block text-sm font-bold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                              Rôle pour tous les employés
                            </label>
                            <select
                              value={existingEmployeeData.role}
                              onChange={(e) =>
                                setExistingEmployeeData({
                                  ...existingEmployeeData,
                                  role: e.target.value,
                                })
                              }
                              className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 ${inputBgClass}`}
                            >
                              <option value="employee">Employé</option>
                              <option value="commercial">Commercial</option>
                              <option value="manager">Manager</option>
                            </select>
                          </div>
                        </>
                      )}

                      <div className="flex gap-3 pt-4">
                        <button
                          type="submit"
                          disabled={isSubmitting || (employeeFormMode === 'existing' && selectedEmployeeIds.length === 0)}
                          className={`flex-1 ${buttonBgClass} px-4 py-2 rounded-lg font-bold transition disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          {isSubmitting ? (employeeFormMode === 'create' ? 'Création en cours...' : 'Assignation en cours...') : (employeeFormMode === 'create' ? 'Créer l\'employé' : 'Assigner les employés')}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowEmployeeForm(false);
                            setSelectedEmployeeIds([]);
                            setExistingEmployeeSearch('');
                            setAvailableEmployees([]);
                            setErrors({});
                          }}
                          className={`flex-1 px-4 py-2 rounded-lg font-bold border transition ${
                            theme === 'dark'
                              ? 'border-slate-700 bg-slate-800 hover:bg-slate-700'
                              : 'border-gray-300 bg-white hover:bg-gray-100'
                          }`}
                        >
                          Annuler
                        </button>
                      </div>
                    </form>
                  )}

                  {employees.length > 0 ? (
                    <div className="grid gap-4">
                      {employees.map((employee) => (
                        <div
                          key={employee.id}
                          className={`p-4 rounded-lg border-2 ${slideBgClass}`}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="font-bold text-lg">{employee.user_name}</h3>
                              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                {employee.user_email}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-bold ${
                                  employee.role === 'commercial'
                                    ? theme === 'dark'
                                      ? 'bg-purple-500/20 text-purple-300'
                                      : 'bg-purple-100 text-purple-700'
                                    : employee.role === 'manager'
                                    ? theme === 'dark'
                                      ? 'bg-blue-500/20 text-blue-300'
                                      : 'bg-blue-100 text-blue-700'
                                    : theme === 'dark'
                                    ? 'bg-gray-700 text-gray-200'
                                    : 'bg-gray-200 text-gray-800'
                                }`}
                              >
                                {employee.role === 'commercial'
                                  ? 'Commercial'
                                  : employee.role === 'manager'
                                  ? 'Manager'
                                  : 'Employé'}
                              </span>
                              <button
                                onClick={() => handleDeleteEmployee(employee.id, employee.user_name)}
                                className={`p-2 rounded-lg transition ${
                                  theme === 'dark'
                                    ? 'text-red-400 hover:bg-red-500/20'
                                    : 'text-red-600 hover:bg-red-50'
                                }`}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-sm">
                            {employee.user_phone && (
                              <span className={`flex items-center gap-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                <Phone className="w-3 h-3" />
                                {employee.user_phone}
                              </span>
                            )}
                            <span className={`flex items-center gap-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                              <FileText className="w-3 h-3" />
                              {employee.ads_created} annonce{employee.ads_created !== 1 ? 's' : ''}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div
                      className={`p-8 rounded-lg text-center ${slideBgClass}`}
                    >
                      <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                        Aucun employé assigné à cet espace
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Slide 3: Ads */}
              {currentSlide === 2 && (
                <div className="space-y-8">
                  <h2 className="text-2xl font-bold">Annonces de l'espace</h2>

                  {ads.length > 0 ? (
                    <div className="grid gap-4">
                      {ads.map((ad) => (
                        <div
                          key={ad.id}
                          className={`p-4 rounded-lg border-2 ${slideBgClass}`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-bold text-lg">{ad.title}</h3>
                              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                {ad.city && ad.country
                                  ? `${ad.city}, ${ad.country}`
                                  : 'Localisation non définie'}
                              </p>
                            </div>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-bold ${
                                ad.status === 'valid'
                                  ? theme === 'dark'
                                    ? 'bg-emerald-500/20 text-emerald-300'
                                    : 'bg-emerald-100 text-emerald-700'
                                  : theme === 'dark'
                                  ? 'bg-yellow-500/20 text-yellow-300'
                                  : 'bg-yellow-100 text-yellow-700'
                              }`}
                            >
                              {ad.status === 'valid' ? 'Active' : 'En attente'}
                            </span>
                          </div>
                          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-3`}>
                            Créée le {new Date(ad.created_at).toLocaleDateString('fr-FR')}
                          </p>
                          <div className="flex items-center gap-4 text-sm">
                            <span className={`flex items-center gap-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                              <Eye className="w-3 h-3" />
                              {ad.views_count} vue{ad.views_count !== 1 ? 's' : ''}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div
                      className={`p-8 rounded-lg text-center ${slideBgClass}`}
                    >
                      <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                        Aucune annonce publiée dans cet espace
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Slide Navigation Arrows */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={prevSlide}
                className={`p-2 rounded-lg transition ${
                  theme === 'dark'
                    ? 'bg-slate-800 hover:bg-slate-700 text-gray-300'
                    : 'bg-white border border-gray-300 hover:bg-gray-100'
                }`}
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <div className="flex gap-2">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-2 h-2 rounded-full transition ${
                      currentSlide === index
                        ? 'bg-purple-600 w-6'
                        : theme === 'dark'
                        ? 'bg-slate-700 hover:bg-slate-600'
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={nextSlide}
                className={`p-2 rounded-lg transition ${
                  theme === 'dark'
                    ? 'bg-slate-800 hover:bg-slate-700 text-gray-300'
                    : 'bg-white border border-gray-300 hover:bg-gray-100'
                }`}
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </main>
      </div>

      <Footer />

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        isDangerous={confirmDialog.isDangerous}
        confirmText={confirmDialog.confirmText}
        isLoading={confirmDialog.isLoading}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
      />
    </div>
  );
}
