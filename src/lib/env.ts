import { logger } from './logger';

/**
 * Validates critical environment variables at startup.
 * Throws a startup error if critical variables are missing or incorrectly formatted.
 */
export function validateEnvironment() {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  const errors: string[] = [];

  // Check URL
  if (!supabaseUrl) {
    errors.push('VITE_SUPABASE_URL environment variable is missing.');
  } else if (!supabaseUrl.startsWith('https://')) {
    errors.push('VITE_SUPABASE_URL is invalid (must begin with https://).');
  }

  // Check Anon Key
  if (!supabaseAnonKey) {
    errors.push('VITE_SUPABASE_ANON_KEY environment variable is missing.');
  }

  if (errors.length > 0) {
    const combinedMessage = errors.join(' ');
    logger.error(`Critical configuration failure: ${combinedMessage}`);
    
    // We render a user-facing error overlay on the page if this fails
    if (typeof document !== 'undefined') {
      const overlay = document.createElement('div');
      overlay.style.position = 'fixed';
      overlay.style.inset = '0';
      overlay.style.backgroundColor = '#0b0c1e';
      overlay.style.color = '#ef4444';
      overlay.style.padding = '2rem';
      overlay.style.fontFamily = 'sans-serif';
      overlay.style.zIndex = '999999';
      overlay.innerHTML = `
        <div style="max-width: 600px; margin: 10% auto; background: rgba(255,255,255,0.03); border: 1px border rgba(239, 68, 68, 0.2); padding: 2rem; border-radius: 1rem; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
          <h1 style="font-size: 1.5rem; font-weight: bold; margin-bottom: 1rem;">Configuration Startup Failure</h1>
          <p style="color: #9ca3af; font-size: 0.875rem; line-height: 1.5;">${combinedMessage}</p>
          <p style="color: #6b7280; font-size: 0.75rem; margin-top: 1.5rem;">Please configure the environment parameters in your hosting provider or local .env file.</p>
        </div>
      `;
      document.body.appendChild(overlay);
    }
    throw new Error(combinedMessage);
  } else {
    logger.info('Environment configurations validated successfully.');
  }
}
