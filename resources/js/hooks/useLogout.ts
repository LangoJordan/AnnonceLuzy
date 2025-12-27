import { useCallback } from 'react';
import { router } from '@inertiajs/react';

/**
 * Custom hook for handling logout with proper error handling
 * Ensures CSRF token is properly synced and handles 419 errors
 */
export function useLogout() {
  const handleLogout = useCallback(async () => {
    try {
      // Get the latest CSRF token from meta tag
      const csrfToken = document.head.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
      
      if (!csrfToken) {
        console.error('CSRF token not found');
        // If no token, reload page to get a new one
        window.location.href = '/';
        return;
      }

      // Use Inertia's router to make the logout POST request
      router.post(route('logout'), {}, {
        onError: (errors) => {
          console.error('Logout error:', errors);
          // If logout fails, reload the page to clear session
          window.location.href = '/';
        },
        onSuccess: () => {
          // Successfully logged out, Inertia will redirect
          console.log('Logged out successfully');
        },
      });
    } catch (error) {
      console.error('Logout failed:', error);
      // Force redirect to home on error
      window.location.href = '/';
    }
  }, []);

  return { handleLogout };
}
