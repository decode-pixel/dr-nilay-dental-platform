import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { validateEnvironment } from './lib/env';
import { ToastProvider } from './components/ToastNotification';
import OfflineBanner from './components/OfflineBanner';

// Validate environment variables on startup
validateEnvironment();

// Fix iOS Safari 100vh bug — keeps --vh accurate on resize/scroll
function setVh() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}
setVh();
window.addEventListener('resize', setVh);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ToastProvider>
      <OfflineBanner />
      <App />
    </ToastProvider>
  </StrictMode>
);
