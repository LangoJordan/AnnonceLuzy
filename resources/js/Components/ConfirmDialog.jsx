import { AlertCircle, X } from 'lucide-react';
import { useThemeStore } from '../store';

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = 'Confirmer',
  cancelText = 'Annuler',
  isDangerous = false,
  onConfirm,
  onCancel,
  isLoading = false,
  error = null,
}) {
  const { theme } = useThemeStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onCancel}
      />

      {/* Dialog */}
      <div
        className={`relative rounded-lg shadow-xl max-w-sm w-full mx-4 ${
          theme === 'dark' ? 'bg-slate-900 border border-slate-700' : 'bg-white border border-gray-200'
        }`}
      >
        {/* Header */}
        <div className={`flex items-start justify-between p-6 border-b ${
          theme === 'dark' ? 'border-slate-700' : 'border-gray-200'
        }`}>
          <div className="flex items-center gap-3">
            {isDangerous && (
              <AlertCircle className={`w-5 h-5 flex-shrink-0 ${
                theme === 'dark' ? 'text-red-400' : 'text-red-600'
              }`} />
            )}
            <h2 className={`text-lg font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {title}
            </h2>
          </div>
          <button
            onClick={onCancel}
            disabled={isLoading}
            className={`p-1 rounded-lg transition ${
              theme === 'dark'
                ? 'hover:bg-slate-800 text-gray-400'
                : 'hover:bg-gray-100 text-gray-600'
            } disabled:opacity-50`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
            {message}
          </p>
          {error && (
            <div className={`mt-4 p-3 rounded-lg border ${
              theme === 'dark' ? 'border-red-500/20 bg-red-500/10 text-red-400' : 'border-red-300 bg-red-50 text-red-600'
            }`}>
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`flex gap-3 p-6 border-t ${
          theme === 'dark' ? 'border-slate-700' : 'border-gray-200'
        }`}>
          <button
            onClick={onCancel}
            disabled={isLoading}
            className={`flex-1 px-4 py-2 rounded-lg font-semibold transition ${
              theme === 'dark'
                ? 'border border-slate-700 bg-slate-800 hover:bg-slate-700 text-gray-100'
                : 'border border-gray-300 bg-white hover:bg-gray-100 text-gray-900'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 px-4 py-2 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed ${
              isDangerous
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
