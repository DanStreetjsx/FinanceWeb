const rawAdSenseClientId = import.meta.env.VITE_ADSENSE_CLIENT_ID?.trim();

export const ADS_CONFIG = {
  ENABLE_ADS: import.meta.env.VITE_ENABLE_ADS === 'true',
  ADSENSE_CLIENT_ID: rawAdSenseClientId || '',
  ADSENSE_SCRIPT_URL: rawAdSenseClientId
    ? `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${rawAdSenseClientId}`
    : '',
  DASHBOARD_TOP_SLOT: import.meta.env.VITE_ADSENSE_SLOT_DASHBOARD_TOP?.trim() || '',
  DASHBOARD_BOTTOM_SLOT: import.meta.env.VITE_ADSENSE_SLOT_DASHBOARD_BOTTOM?.trim() || '',
  INGRESOS_INLINE_SLOT: import.meta.env.VITE_ADSENSE_SLOT_INGRESOS_INLINE?.trim() || '',
  GASTOS_INLINE_SLOT: import.meta.env.VITE_ADSENSE_SLOT_GASTOS_INLINE?.trim() || '',
  PRESUPUESTOS_INLINE_SLOT: import.meta.env.VITE_ADSENSE_SLOT_PRESUPUESTOS_INLINE?.trim() || '',
  RECORDATORIOS_INLINE_SLOT: import.meta.env.VITE_ADSENSE_SLOT_RECORDATORIOS_INLINE?.trim() || '',
  CATEGORIAS_INLINE_SLOT: import.meta.env.VITE_ADSENSE_SLOT_CATEGORIAS_INLINE?.trim() || '',
  SHOW_PLACEHOLDER_IN_DEV: import.meta.env.VITE_ADS_PLACEHOLDER_IN_DEV !== 'false',
} as const;

export const ADS_ENABLED = ADS_CONFIG.ENABLE_ADS && Boolean(ADS_CONFIG.ADSENSE_CLIENT_ID);
