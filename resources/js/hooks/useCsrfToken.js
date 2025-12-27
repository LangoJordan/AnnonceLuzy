/**
 * Hook to get CSRF token from meta tag
 * Used to ensure CSRF tokens are properly sent with Inertia POST requests
 */
export function useCsrfToken() {
    const token = document.head.querySelector('meta[name="csrf-token"]')?.content;
    return token || '';
}
