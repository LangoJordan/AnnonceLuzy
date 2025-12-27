import '../css/app.css';
import './bootstrap';

import { createInertiaApp, router } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { syncCsrfTokenFromProps } from './utils/csrfToken';

const appName = import.meta.env.VITE_APP_NAME || 'AnnoncesHub';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        // Sync CSRF token on initial load
        if (props.initialPage.props.csrf_token) {
            syncCsrfTokenFromProps(props.initialPage.props.csrf_token);
        }

        const root = createRoot(el);
        root.render(<App {...props} />);
    },
    progress: {
        color: '#2563eb',
    },
});

// Sync CSRF token on every subsequent navigation to prevent 419 errors
router.on('success', (event) => {
    const csrfToken = event.detail.page.props.csrf_token;
    if (csrfToken) {
        syncCsrfTokenFromProps(csrfToken);
    }
});