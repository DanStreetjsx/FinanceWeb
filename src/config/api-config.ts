// src/config/api-config.ts

/**
 * Configuración de URLs de la API según el entorno.
 * Se utiliza import.meta.env.MODE para detectar si estamos en 'development' o 'production'.
 */

const API_CONFIG = {
  development: {
    BASE_URL: 'http://localhost:8000/api',
  },
  production: {
    BASE_URL: 'https://api.smart-general.com/api',
  },
};

// Detectar el entorno actual (Vite utiliza import.meta.env.MODE)
const currentMode = import.meta.env.MODE === 'production' ? 'production' : 'development';

export const CONFIG = {
  API_URL: API_CONFIG[currentMode].BASE_URL,
  IS_PRODUCTION: currentMode === 'production',
  IS_DEVELOPMENT: currentMode === 'development',
};

export default CONFIG;
