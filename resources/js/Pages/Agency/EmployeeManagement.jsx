import { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import axios from 'axios';
import Header from '../../Components/Header';
import AgencySidebar from './AgencySidebar';
import ConfirmDialog from '../../Components/ConfirmDialog';
import { useThemeStore } from '../../store';
import {
  Plus,
  Edit2,
  Trash2,
  Mail,
  Phone,
  Briefcase,
  Save,
  X,
  Users,
  AlertCircle,
  FileText,
  Check,
  Loader,
} from 'lucide-react';

export default function EmployeeManagement({ user = {}, employees = [], spaces = [] }) {
  const { theme } = useThemeStore();
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState('create'); // 'create', 'edit', or 'existing'
  const [editingId, setEditingId] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [availableEmployees, setAvailableEmployees] = useState([]);
  const [searchingEmployees, setSearchingEmployees] = useState(false);
  const [existingEmployeeSearch, setExistingEmployeeSearch] = useState('');
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState([]);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    isDangerous: false,
    confirmText: 'Confirmer',
    onConfirm: null,
    isLoading: false,
    error: null,
  });

  const { data, setData, post, patch, delete: destroy, processing, errors, recentlySuccessful, reset } = useForm({
    name: '',
    email: '',
    phone: '',
    role: 'employee',
    space_ids: [],
    password: '',
    password_confirmation: '',
  });

  const validateForm = () => {
    const newErrors = {};
    if (!data.name.trim()) newErrors.name = 'Le nom est requis';
    if (!data.email.trim()) newErrors.email = 'L\'email est requis';
    if (!editingId && !data.password) newErrors.password = 'Le mot de passe est requis';
    if (!editingId && data.password && data.password.length < 8) {
      newErrors.password = 'Le mot de passe doit contenir au moins 8 caractères';
    }
    if (!editingId && data.password !== data.password_confirmation) {
      newErrors.password_confirmation = 'Les mots de passe ne correspondent pas';
    }
    if (data.space_ids.length === 0) newErrors.space_ids = 'Sélectionner au moins un espace';
    if (!['employee', 'commercial', 'manager'].includes(data.role)) {
      newErrors.role = 'Rôle invalide';
    }
    setFieldErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData(name, value);
    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSpaceToggle = (spaceId) => {
    const id = parseInt(spaceId);
    const newSpaceIds = data.space_ids.map(id => parseInt(id));
    setData('space_ids',
      newSpaceIds.includes(id)
        ? newSpaceIds.filter(currentId => currentId !== id)
        : [...newSpaceIds, id]
    );
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
      });
      setAvailableEmployees(response.data.data || []);
      setFieldErrors({});
    } catch (error) {
      console.error('Error searching employees:', error);
      setAvailableEmployees([]);
      setFieldErrors({ search: 'Erreur lors de la recherche d\'employés' });
    } finally {
      setSearchingEmployees(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (formMode === 'existing') {
      // Handle existing employee assignment
      if (selectedEmployeeIds.length === 0) {
        setFieldErrors({ employees: 'Veuillez sélectionner au moins un employé' });
        return;
      }

      if (data.space_ids.length === 0) {
        setFieldErrors({ space_ids: 'Sélectionner au moins un espace' });
        return;
      }

      router.post('/agence/employes/assign-multiple', {
        user_ids: selectedEmployeeIds,
        role: data.role,
        space_id: data.space_ids[0],
      }, {
        onSuccess: () => {
          handleCancel();
          router.visit(route('agency.employees'));
        },
        onError: (errors) => {
          setFieldErrors(errors || {});
        },
      });
    } else {
      // Handle create/edit
      if (!validateForm()) {
        return;
      }

      if (editingId) {
        patch(route('agency.employee-update', editingId), {
          onSuccess: () => {
            router.visit(route('agency.employees'));
          },
          onError: (errors) => {
            console.error('Update failed:', errors);
          },
        });
      } else {
        post(route('agency.employee-store'), {
          onSuccess: () => {
            router.visit(route('agency.employees'));
          },
          onError: (errors) => {
            console.error('Creation failed:', errors);
          },
        });
      }
    }
  };

  const handleEdit = (employee) => {
    setFormMode('edit');
    setData({
      name: employee.name,
      email: employee.email,
      phone: employee.phone || '',
      role: employee.role || 'employee',
      space_ids: employee.spaces?.map(s => s.id) || [],
      password: '',
      password_confirmation: '',
    });
    setEditingId(employee.id);
    setShowForm(true);
  };

  const handleDelete = (positionId, employeeName) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Supprimer du poste',
      message: `Êtes-vous sûr de vouloir supprimer ${employeeName}? Cet employé sera retiré de ce poste. L'utilisateur sera conservé dans le système.`,
      isDangerous: true,
      confirmText: 'Supprimer',
      isLoading: false,
      onConfirm: () => {
        setConfirmDialog((prev) => ({ ...prev, isLoading: true, error: null }));
        destroy(route('agency.employee-delete', positionId), {
          onSuccess: () => {
            setConfirmDialog({ isOpen: false, title: '', message: '', isDangerous: false, confirmText: 'Confirmer', onConfirm: null, isLoading: false, error: null });
            router.visit(route('agency.employees'));
          },
          onError: (errors) => {
            console.error('Delete error:', errors);
            setConfirmDialog((prev) => ({
              ...prev,
              isLoading: false,
              error: errors?.message || 'Une erreur est survenue lors de la suppression'
            }));
          },
        });
      },
      error: null,
    });
  };

  const handleCancel = () => {
    setShowForm(false);
    setFormMode('create');
    setEditingId(null);
    setAvailableEmployees([]);
    setExistingEmployeeSearch('');
    setSelectedEmployeeIds([]);
    reset();
    setFieldErrors({});
  };

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <Header user={user} />

      <div className="flex flex-1">
        <AgencySidebar user={user} />

        <main className="flex-1">
          <div className={theme === 'dark' ? 'bg-slate-900/50 border-b border-slate-800' : 'bg-white border-b border-gray-200'}>
            <div className="max-w-7xl mx-auto px-8 py-12 flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-3">Gestion des employés</h1>
                <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}>
                  Gérez les employés assignés à vos espaces commerciaux
                </p>
              </div>
              {!showForm && (
                <button
                  onClick={() => setShowForm(true)}
                  className="flex items-center gap-2 px-6 py-3 rounded-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg transition"
                >
                  <Plus className="w-5 h-5" />
                  Ajouter un employé
                </button>
              )}
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-8 py-12">
            {/* Success Message */}
            {recentlySuccessful && (
              <div className={`mb-6 p-4 rounded-lg border flex items-start gap-3 ${theme === 'dark' ? 'border-emerald-500/20 bg-emerald-500/10' : 'border-emerald-300 bg-emerald-50'}`}>
                <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`} />
                <p className={theme === 'dark' ? 'text-emerald-300' : 'text-emerald-700'}>
                  {editingId ? 'Employé modifié avec succès!' : 'Employé créé avec succès!'}
                </p>
              </div>
            )}

            {/* Form */}
            {showForm && (
              <div className={`rounded-lg border-2 p-8 mb-12 ${theme === 'dark' ? 'border-slate-700 bg-slate-900' : 'border-purple-200 bg-white'}`}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                    {editingId ? 'Modifier l\'employé' : 'Ajouter un employé'}
                  </h2>
                  <button
                    onClick={handleCancel}
                    className={`p-2 rounded-lg transition ${theme === 'dark' ? 'hover:bg-slate-800' : 'hover:bg-gray-100'}`}
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {!editingId && (
                  <div className="flex gap-2 mb-6">
                    <button
                      type="button"
                      onClick={() => {
                        setFormMode('create');
                        setFieldErrors({});
                      }}
                      className={`px-4 py-2 rounded-lg font-semibold transition ${
                        formMode === 'create'
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
                        setFormMode('existing');
                        setFieldErrors({});
                      }}
                      className={`px-4 py-2 rounded-lg font-semibold transition ${
                        formMode === 'existing'
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                          : theme === 'dark'
                          ? 'bg-slate-800 text-gray-300 hover:bg-slate-700'
                          : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      Ajouter existant
                    </button>
                  </div>
                )}

                {(Object.keys(errors).length > 0 || Object.keys(fieldErrors).length > 0) && (
                  <div className={`mb-6 p-4 rounded-lg border flex items-start gap-3 ${theme === 'dark' ? 'border-red-500/20 bg-red-500/10' : 'border-red-300 bg-red-50'}`}>
                    <AlertCircle className={theme === 'dark' ? 'text-red-400' : 'text-red-600'} />
                    <div>
                      <p className={`font-bold ${theme === 'dark' ? 'text-red-300' : 'text-red-700'}`}>Erreurs:</p>
                      <ul className={`text-sm mt-2 ${theme === 'dark' ? 'text-red-300' : 'text-red-700'}`}>
                        {Object.entries({ ...errors, ...fieldErrors }).map(([field, message]) => (
                          <li key={field}>• {message}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {formMode === 'existing' ? (
                    <>
                      <div>
                        <label className={`block text-sm font-bold mb-3 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
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
                            className={`flex-1 px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                              theme === 'dark' ? 'bg-slate-800 border-slate-700 text-gray-100' : 'bg-white border-gray-300 text-gray-900'
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() => handleExistingEmployeeSearch(existingEmployeeSearch)}
                            disabled={searchingEmployees || existingEmployeeSearch.trim().length < 2}
                            className={`px-4 py-3 rounded-lg font-semibold transition ${
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
                          <div className={`p-4 ${theme === 'dark' ? 'bg-slate-800 border-b border-slate-700' : 'bg-gray-50 border-b border-gray-300'}`}>
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
                        <div className={`p-4 rounded-lg border-2 ${theme === 'dark' ? 'border-slate-700 bg-slate-800' : 'border-gray-300 bg-gray-50'}`}>
                          <p className={`text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            Employés sélectionnés ({selectedEmployeeIds.length})
                          </p>
                          <div className="space-y-2">
                            {availableEmployees
                              .filter((emp) => selectedEmployeeIds.includes(emp.id))
                              .map((emp) => (
                                <div
                                  key={emp.id}
                                  className={`px-3 py-2 rounded ${theme === 'dark' ? 'bg-slate-700' : 'bg-white'} border ${theme === 'dark' ? 'border-slate-600' : 'border-gray-200'}`}
                                >
                                  <p className="font-medium">{emp.name}</p>
                                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{emp.email}</p>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className={`block text-sm font-bold mb-3 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                            Rôle
                          </label>
                          <select
                            value={data.role}
                            onChange={handleInputChange}
                            name="role"
                            className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                              theme === 'dark' ? 'bg-slate-800 border-slate-700 text-gray-100' : 'bg-white border-gray-300 text-gray-900'
                            }`}
                          >
                            <option value="employee">Employé</option>
                            <option value="commercial">Commercial</option>
                            <option value="manager">Responsable</option>
                          </select>
                        </div>

                        <div>
                          <label className={`block text-sm font-bold mb-3 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                            Espace
                          </label>
                          <select
                            value={data.space_ids[0] || ''}
                            onChange={(e) => setData('space_ids', e.target.value ? [parseInt(e.target.value)] : [])}
                            className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                              fieldErrors.space_ids
                                ? theme === 'dark' ? 'border-red-500/50 bg-red-500/10' : 'border-red-300 bg-red-50'
                                : theme === 'dark' ? 'bg-slate-800 border-slate-700 text-gray-100' : 'bg-white border-gray-300 text-gray-900'
                            }`}
                          >
                            <option value="">Sélectionner un espace</option>
                            {spaces.map((space) => (
                              <option key={space.id} value={space.id}>
                                {space.name}
                              </option>
                            ))}
                          </select>
                          {fieldErrors.space_ids && <p className={`text-sm mt-2 ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>{fieldErrors.space_ids}</p>}
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className={`block text-sm font-bold mb-3 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                            Nom complet
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={data.name}
                            onChange={handleInputChange}
                            placeholder="Ex: Jean Dupont"
                            className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                              errors.name || fieldErrors.name
                                ? theme === 'dark' ? 'border-red-500/50 bg-red-500/10' : 'border-red-300 bg-red-50'
                                : theme === 'dark' ? 'bg-slate-800 border-slate-700 text-gray-100' : 'bg-white border-gray-300 text-gray-900'
                            }`}
                          />
                          {(errors.name || fieldErrors.name) && <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>{errors.name || fieldErrors.name}</p>}
                        </div>

                        <div>
                          <label className={`block text-sm font-bold mb-3 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                            Email
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={data.email}
                            onChange={handleInputChange}
                            placeholder="exemple@email.com"
                            className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                              errors.email || fieldErrors.email
                                ? theme === 'dark' ? 'border-red-500/50 bg-red-500/10' : 'border-red-300 bg-red-50'
                                : theme === 'dark' ? 'bg-slate-800 border-slate-700 text-gray-100' : 'bg-white border-gray-300 text-gray-900'
                            }`}
                          />
                          {(errors.email || fieldErrors.email) && <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>{errors.email || fieldErrors.email}</p>}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className={`block text-sm font-bold mb-3 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                            Téléphone
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            value={data.phone}
                            onChange={handleInputChange}
                            placeholder="+33612345678"
                            className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                              theme === 'dark' ? 'bg-slate-800 border-slate-700 text-gray-100' : 'bg-white border-gray-300 text-gray-900'
                            }`}
                          />
                        </div>

                        <div>
                          <label className={`block text-sm font-bold mb-3 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                            Rôle
                          </label>
                          <select
                            name="role"
                            value={data.role}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                              theme === 'dark' ? 'bg-slate-800 border-slate-700 text-gray-100' : 'bg-white border-gray-300 text-gray-900'
                            }`}
                          >
                            <option value="employee">Employé</option>
                            <option value="commercial">Commercial</option>
                            <option value="manager">Responsable</option>
                          </select>
                        </div>
                      </div>

                      {!editingId && (
                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <label className={`block text-sm font-bold mb-3 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                              Mot de passe
                            </label>
                            <input
                              type="password"
                              name="password"
                              value={data.password}
                              onChange={handleInputChange}
                              placeholder="••••••••"
                              className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                                errors.password || fieldErrors.password
                                  ? theme === 'dark' ? 'border-red-500/50 bg-red-500/10' : 'border-red-300 bg-red-50'
                                  : theme === 'dark' ? 'bg-slate-800 border-slate-700 text-gray-100' : 'bg-white border-gray-300 text-gray-900'
                              }`}
                            />
                            {(errors.password || fieldErrors.password) && <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>{errors.password || fieldErrors.password}</p>}
                          </div>

                          <div>
                            <label className={`block text-sm font-bold mb-3 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                              Confirmer le mot de passe
                            </label>
                            <input
                              type="password"
                              name="password_confirmation"
                              value={data.password_confirmation}
                              onChange={handleInputChange}
                              placeholder="••••••••"
                              className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                                errors.password_confirmation || fieldErrors.password_confirmation
                                  ? theme === 'dark' ? 'border-red-500/50 bg-red-500/10' : 'border-red-300 bg-red-50'
                                  : theme === 'dark' ? 'bg-slate-800 border-slate-700 text-gray-100' : 'bg-white border-gray-300 text-gray-900'
                              }`}
                            />
                            {(errors.password_confirmation || fieldErrors.password_confirmation) && <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>{errors.password_confirmation || fieldErrors.password_confirmation}</p>}
                          </div>
                        </div>
                      )}

                      <div>
                        <label className={`block text-sm font-bold mb-3 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                          Espaces assignés
                        </label>
                        <div className="space-y-2">
                          {spaces.length > 0 ? (
                            spaces.map(space => (
                              <div key={space.id} className="flex items-center gap-3">
                                <input
                                  type="checkbox"
                                  id={`space_${space.id}`}
                                  checked={data.space_ids.includes(parseInt(space.id))}
                                  onChange={() => handleSpaceToggle(space.id)}
                                  className="w-5 h-5 rounded cursor-pointer"
                                />
                                <label
                                  htmlFor={`space_${space.id}`}
                                  className={`flex-1 cursor-pointer font-medium ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}
                                >
                                  {space.name}
                                </label>
                              </div>
                            ))
                          ) : (
                            <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                              Aucun espace disponible
                            </p>
                          )}
                        </div>
                        {(errors.space_ids || fieldErrors.space_ids) && <p className={`text-sm mt-2 ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>{errors.space_ids || fieldErrors.space_ids}</p>}
                      </div>
                    </>
                  )}

                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className={`flex-1 py-3 rounded-lg font-bold border transition ${theme === 'dark' ? 'border-slate-700 bg-slate-800 hover:bg-slate-700 text-gray-100' : 'border-gray-300 bg-white hover:bg-gray-100 text-gray-900'}`}
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      disabled={processing || (formMode === 'existing' && selectedEmployeeIds.length === 0)}
                      className="flex-1 py-3 rounded-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {processing ? (
                        <>
                          <Loader className="w-5 h-5 animate-spin" />
                          En cours...
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5" />
                          {formMode === 'existing' ? 'Assigner' : (editingId ? 'Modifier' : 'Ajouter')}
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Employees List */}
            {!showForm && (
              <>
                {employees.length > 0 ? (
                  <div className="grid grid-cols-1 gap-6">
                    {employees.map(employee => (
                      <div
                        key={employee.id}
                        className={`rounded-lg border-2 p-6 transition ${theme === 'dark' ? 'border-slate-700 bg-slate-900 hover:border-slate-600' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                              {employee.name}
                            </h3>
                            <div className={`text-sm font-semibold mt-2 flex items-center gap-2 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`}>
                              <Briefcase className="w-4 h-4" />
                              {employee.role === 'employee' ? 'Employé' : employee.role === 'commercial' ? 'Commercial' : 'Responsable'}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(employee)}
                              className={`p-3 rounded-lg transition ${theme === 'dark' ? 'bg-slate-800 hover:bg-slate-700 text-blue-400' : 'bg-blue-100 hover:bg-blue-200 text-blue-600'}`}
                              title="Éditer l'employé"
                            >
                              <Edit2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>

                        <div className={`text-sm mt-3 flex gap-4 mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          <span className="flex items-center gap-1">
                            <Mail className="w-4 h-4" />
                            {employee.email}
                          </span>
                          {employee.phone && (
                            <span className="flex items-center gap-1">
                              <Phone className="w-4 h-4" />
                              {employee.phone}
                            </span>
                          )}
                        </div>

                        {employee.spaces && employee.spaces.length > 0 && (
                          <div className="mt-4">
                            <p className={`text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                              Espaces assignés:
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {employee.spaces.map(space => (
                                <div
                                  key={space.id}
                                  className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${
                                    theme === 'dark'
                                      ? 'bg-purple-500/20 text-purple-300'
                                      : 'bg-purple-100 text-purple-700'
                                  }`}
                                >
                                  <span>{space.name}</span>
                                  <button
                                    onClick={() => handleDelete(space.position_id, `${employee.name} de ${space.name}`)}
                                    className={`p-1 rounded transition ${
                                      theme === 'dark'
                                        ? 'hover:bg-red-500/20 text-red-400 hover:text-red-300'
                                        : 'hover:bg-red-100 text-red-600 hover:text-red-700'
                                    }`}
                                    title={`Supprimer ${employee.name} de ${space.name}`}
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {employee.adsCreated && (
                          <div className={`text-sm mt-4 flex items-center gap-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            <FileText className="w-4 h-4" />
                            {employee.adsCreated} annonce{employee.adsCreated !== 1 ? 's' : ''}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={`rounded-lg border-2 border-dashed p-12 text-center ${theme === 'dark' ? 'border-slate-700 bg-slate-900/30' : 'border-gray-300 bg-gray-50'}`}>
                    <Users className={`w-16 h-16 mx-auto mb-4 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} />
                    <h3 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>
                      Aucun employé
                    </h3>
                    <p className={theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}>
                      Ajoutez votre premier employé pour commencer
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>

   

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
