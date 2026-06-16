/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ENABLE_ADS?: 'true' | 'false';
  readonly VITE_ADSENSE_CLIENT_ID?: string;
  readonly VITE_ADSENSE_SLOT_DASHBOARD_TOP?: string;
  readonly VITE_ADSENSE_SLOT_DASHBOARD_BOTTOM?: string;
  readonly VITE_ADSENSE_SLOT_INGRESOS_INLINE?: string;
  readonly VITE_ADSENSE_SLOT_GASTOS_INLINE?: string;
  readonly VITE_ADSENSE_SLOT_PRESUPUESTOS_INLINE?: string;
  readonly VITE_ADSENSE_SLOT_RECORDATORIOS_INLINE?: string;
  readonly VITE_ADSENSE_SLOT_CATEGORIAS_INLINE?: string;
  readonly VITE_ADS_PLACEHOLDER_IN_DEV?: 'true' | 'false';
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
