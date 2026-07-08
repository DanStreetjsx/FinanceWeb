import { useRef, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { ADS_CONFIG, ADS_ENABLED } from 'src/config/ads-config';

type AdSenseWindow = Window & {
  adsbygoogle?: Array<Record<string, unknown>>;
};

type AdSenseSlotProps = {
  slot?: string;
  minHeight?: number;
  label?: string;
};

const ADSENSE_SCRIPT_SELECTOR = 'script[data-finance-adsense="true"]';

function loadAdSenseScript() {
  const existingScript = document.querySelector<HTMLScriptElement>(ADSENSE_SCRIPT_SELECTOR);

  if (existingScript) {
    return existingScript;
  }

  if (!ADS_CONFIG.ADSENSE_SCRIPT_URL) {
    return null;
  }

  const script = document.createElement('script');
  script.async = true;
  script.crossOrigin = 'anonymous';
  script.src = ADS_CONFIG.ADSENSE_SCRIPT_URL;
  script.dataset.financeAdsense = 'true';
  script.setAttribute('data-ad-client', ADS_CONFIG.ADSENSE_CLIENT_ID);

  document.head.appendChild(script);

  return script;
}

export function AdSenseSlot({
  slot,
  minHeight = 90,
  label = 'Publicidad',
}: AdSenseSlotProps) {
  const theme = useTheme();
  const adRef = useRef<HTMLElement | null>(null);
  const wasRequestedRef = useRef(false);
  const shouldRenderPlaceholder = import.meta.env.DEV && ADS_CONFIG.SHOW_PLACEHOLDER_IN_DEV;
  const hasValidConfig = ADS_ENABLED && Boolean(slot);

  useEffect(() => {
    if (!hasValidConfig || !adRef.current || wasRequestedRef.current) {
      return undefined;
    }

    const requestAd = () => {
      const adsWindow = window as AdSenseWindow;
      adsWindow.adsbygoogle = adsWindow.adsbygoogle || [];
      adsWindow.adsbygoogle.push({});
      wasRequestedRef.current = true;
    };

    try {
      const script = loadAdSenseScript();

      if (!script) {
        return undefined;
      }

      if ((window as AdSenseWindow).adsbygoogle || script.dataset.loaded === 'true') {
        requestAd();
        return undefined;
      }

      const handleLoad = () => {
        script.dataset.loaded = 'true';
        requestAd();
      };

      script.addEventListener('load', handleLoad, { once: true });

      return () => {
        script.removeEventListener('load', handleLoad);
      };
    } catch (error) {
      if (!import.meta.env.PROD) {
        console.warn('No se pudo solicitar el anuncio de AdSense.', error);
      }
    }

    return undefined;
  }, [hasValidConfig]);

  useEffect(() => {
    if (!hasValidConfig && import.meta.env.PROD) {
      console.warn('AdSense no se renderiza: revisa VITE_ENABLE_ADS, VITE_ADSENSE_CLIENT_ID y el slot.', {
        enabled: ADS_ENABLED,
        client: ADS_CONFIG.ADSENSE_CLIENT_ID,
        slot,
      });
    }
  }, [hasValidConfig, slot]);

  if (!hasValidConfig && !shouldRenderPlaceholder) {
    return null;
  }

  return (
    <Card
      sx={{
        p: 1.5,
        borderRadius: 2,
        border: `1px dashed ${alpha(theme.palette.primary.main, 0.24)}`,
        background: `linear-gradient(180deg, ${alpha(theme.palette.background.paper, 0.94)} 0%, ${alpha(theme.palette.primary.lighter, 0.22)} 100%)`,
      }}
    >
      <Typography
        variant="caption"
        sx={{ display: 'block', mb: 1, color: 'text.secondary', letterSpacing: 0.4, textTransform: 'uppercase' }}
      >
        {label}
      </Typography>

      {hasValidConfig ? (
        <ins
          ref={(node) => {
            adRef.current = node;
          }}
          className="adsbygoogle"
          style={{ display: 'block', minHeight, width: '100%', overflow: 'hidden' }}
          data-ad-client={ADS_CONFIG.ADSENSE_CLIENT_ID}
          data-ad-slot={slot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      ) : (
        <Box
          sx={{
            minHeight,
            borderRadius: 1.5,
            border: `1px dashed ${alpha(theme.palette.grey[500], 0.32)}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: alpha(theme.palette.grey[500], 0.06),
          }}
        >
          <Typography variant="caption" color="text.secondary">
            Configura `VITE_ADSENSE_CLIENT_ID` y `VITE_ADSENSE_SLOT_*` para activar anuncios.
          </Typography>
        </Box>
      )}
    </Card>
  );
}
