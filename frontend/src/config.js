// Central API configuration
// Always use relative paths in production to support deployment on Vercel/Docker correctly.
export const API_URL = import.meta.env.MODE === 'production' ? '' : (import.meta.env.VITE_API_URL || '');
