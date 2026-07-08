// src/config/api-config.ts

/**
 * Configuración de URLs de la API según el entorno.
 * Se utiliza import.meta.env.MODE para detectar si estamos en 'development' o 'production'.
 */

const API_CONFIG = {
  development: {
    BASE_URL: 'http://127.0.0.1:8000/api',
  },
  production: {
    BASE_URL: 'http://localhost:3039/api',
  },
};

// Detectar el entorno actual (Vite utiliza import.meta.env.MODE)
const currentMode = import.meta.env.MODE === 'production' ? 'production' : 'development';
const defaultApiUrl = API_CONFIG[currentMode].BASE_URL;
const envApiUrl = import.meta.env.VITE_API_URL?.trim();

export const CONFIG = {
  API_URL: envApiUrl || defaultApiUrl,
  IS_PRODUCTION: currentMode === 'production',
  IS_DEVELOPMENT: currentMode === 'development',
};

export default CONFIG;
