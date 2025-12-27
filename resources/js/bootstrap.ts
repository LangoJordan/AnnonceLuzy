import axios from 'axios';
window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

/**
 * Initialize CSRF token from meta tag
 */
function initializeCsrfToken() {
    const token = document.head.querySelector('meta[name="csrf-token"]');
    if (token) {
        window.axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content;
    } else {
        console.warn('CSRF token not found in meta tag');
    }
}

// Initial CSRF token setup
initializeCsrfToken();

// Enable credentials for same-origin requests
window.axios.defaults.withCredentials = true;

// Add request interceptor to ensure token is always fresh
axios.interceptors.request.use(
    (config) => {
        // Before each request, verify token is in headers
        // Re-read from meta tag to handle dynamic updates
        const token = document.head.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        if (token) {
            config.headers['X-CSRF-TOKEN'] = token;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Add response interceptor to handle CSRF token updates
axios.interceptors.response.use(
    (response) => {
        // Update CSRF token from response headers if available
        const newToken = response.headers['x-csrf-token'];
        if (newToken) {
            window.axios.defaults.headers.common['X-CSRF-TOKEN'] = newToken;
            const metaTag = document.head.querySelector('meta[name="csrf-token"]');
            if (metaTag) {
                metaTag.setAttribute('content', newToken);
            }
        }
        return response;
    },
    (error) => {
        // Handle 419 errors by reloading the page to get a new token
        if (error.response?.status === 419) {
            console.warn('CSRF token expired, reloading page...');
            window.location.href = window.location.href;
        }
        return Promise.reject(error);
    }
);
