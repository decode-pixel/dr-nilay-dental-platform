// Centralized logging system for Dr. Nilay Dental Platform
// Supports Info, Warn, Error, and Debug logs. Debug is disabled in production.

const IS_PROD = import.meta.env.PROD;

export const logger = {
  info(message: string, ...args: any[]) {
    console.info(`[INFO] ${message}`, ...args);
  },

  warn(message: string, ...args: any[]) {
    console.warn(`[WARN] ${message}`, ...args);
  },

  error(message: string, ...args: any[]) {
    console.error(`[ERROR] ${message}`, ...args);
  },

  debug(message: string, ...args: any[]) {
    if (!IS_PROD) {
      console.debug(`[DEBUG] ${message}`, ...args);
    }
  }
};
