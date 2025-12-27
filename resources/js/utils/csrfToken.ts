/**
 * Updates the CSRF token in the meta tag
 * This ensures the frontend always has the latest token after server-side regeneration
 */
export function updateCsrfToken(token: string): void {
  const metaTag = document.head.querySelector('meta[name="csrf-token"]');
  if (metaTag) {
    metaTag.setAttribute('content', token);
  }
  
  // Also update axios headers if available
  if (window.axios) {
    window.axios.defaults.headers.common['X-CSRF-TOKEN'] = token;
  }
}

/**
 * Gets the current CSRF token from the meta tag
 */
export function getCsrfToken(): string {
  return document.head.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
}

/**
 * Syncs CSRF token from Inertia props to meta tag
 * Call this when you have the csrf_token from server props
 */
export function syncCsrfTokenFromProps(csrfToken?: string): void {
  if (csrfToken) {
    updateCsrfToken(csrfToken);
  }
}
