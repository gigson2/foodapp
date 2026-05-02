import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from '@/app';
import { registerServiceWorker } from '@/services/pwaService';

registerServiceWorker();

const container = document.getElementById('app');

if (! container) {
    throw new Error('SPA mount node #app was not found.');
}

createRoot(container).render(
    <StrictMode>
        <App />
    </StrictMode>,
);
