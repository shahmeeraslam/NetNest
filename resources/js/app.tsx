import '@/css/global.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { initializeTheme } from './hooks/use-appearance';
import { HeadProvider } from 'react-head';

const appName = import.meta.env.VITE_APP_NAME || 'NetNest';




createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<HeadProvider> <App {...props} /></HeadProvider>);
    },
    progress: {
        color: '#4B5563',
    },

});

// This will set light / dark mode on load...
initializeTheme();
