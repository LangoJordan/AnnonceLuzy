import { useState } from 'react';
import { Heart, Check } from 'lucide-react';
import { usePage } from '@inertiajs/react';

export default function FavoriteButton({ 
  adId, 
  initialIsFavorite = false, 
  showAnimation = true,
  className = '',
  onToggle = null,
}) {
  const { props } = usePage();
  const user = props.auth?.user;
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleToggleFavorite = async (e) => {
    e?.preventDefault();
    e?.stopPropagation();

    if (isLoading) return;

    // Check if user is authenticated
    if (!user) {
      // Redirect to login or show message
      window.location.href = '/login';
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;
      
      if (!csrfToken) {
        throw new Error('CSRF token not found');
      }

      if (isFavorite) {
        // Remove from favorites
        const response = await fetch(`/api/favorites/ad/${adId}`, {
          method: 'DELETE',
          headers: {
            'X-CSRF-TOKEN': csrfToken,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          credentials: 'same-origin',
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        setIsFavorite(false);
        if (onToggle) {
          onToggle(false);
        }
      } else {
        // Add to favorites
        const response = await fetch('/api/favorites', {
          method: 'POST',
          headers: {
            'X-CSRF-TOKEN': csrfToken,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          credentials: 'same-origin',
          body: JSON.stringify({ ad_id: adId }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          if (response.status === 409) {
            // Already in favorites
            setIsFavorite(true);
            if (showAnimation) {
              setShowSuccess(true);
              setTimeout(() => setShowSuccess(false), 1500);
            }
            return;
          }
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setIsFavorite(true);

        // Show success animation
        if (showAnimation) {
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 1500);
        }

        if (onToggle) {
          onToggle(true);
        }
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
      setError(err.message);
      setTimeout(() => setError(null), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={handleToggleFavorite}
        disabled={isLoading}
        className={`p-2 rounded-full transition-all duration-300 flex items-center justify-center ${
          isFavorite
            ? 'bg-red-500/20 text-red-500'
            : 'bg-black/30 backdrop-blur-sm text-white hover:bg-black/50'
        } disabled:opacity-50 active:scale-95 transform`}
        title={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
        aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
      >
        {showSuccess && isFavorite ? (
          <Check className="w-5 h-5 animate-pulse" />
        ) : (
          <Heart
            className="w-5 h-5 transition-all"
            fill={isFavorite ? 'currentColor' : 'none'}
            stroke={isFavorite ? 'none' : 'currentColor'}
          />
        )}
      </button>

      {/* Success toast animation */}
      {showSuccess && isFavorite && (
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap animate-bounce z-50">
          ✓ Ajouté aux favoris
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap z-50">
          Erreur: {error}
        </div>
      )}
    </div>
  );
}
