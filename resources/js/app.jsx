import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import AppLayout from './Layouts/AppLayout';

const appName = import.meta.env.VITE_APP_NAME || 'AnnoncesHub';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);
        const page = <App {...props} />;
        const component = props.initialPage.component;

        const layout = component.layout || ((page) => <AppLayout {...props.initialPage.props}>{page}</AppLayout>);
            
        root.render(layout(page));
    },
    progress: {
        color: '#2563eb',
    },
});