import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { validateEnvironment } from './lib/env';
import { ToastProvider } from './components/ToastNotification';
import OfflineBanner from './components/OfflineBanner';

// Validate environment variables on startup
validateEnvironment();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ToastProvider>
      <OfflineBanner />
      <App />
    </ToastProvider>
  </StrictMode>
);
