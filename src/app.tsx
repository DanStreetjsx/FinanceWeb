import 'src/global.css';

import { useEffect } from 'react';

import { usePathname } from 'src/routes/hooks';

import { ThemeProvider } from 'src/theme/theme-provider';
import { ADS_CONFIG, ADS_ENABLED } from 'src/config/ads-config';

// ----------------------------------------------------------------------

type AppProps = {
  children: React.ReactNode;
};

export default function App({ children }: AppProps) {
  useScrollToTop();
  useAdSenseScript();

  return (
    <ThemeProvider>
      {children}
    </ThemeProvider>
  );
}

// ----------------------------------------------------------------------

function useScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function useAdSenseScript() {
  useEffect(() => {
    if (!ADS_ENABLED || !ADS_CONFIG.ADSENSE_SCRIPT_URL) {
      return;
    }

    const existingScript = document.querySelector<HTMLScriptElement>(
      `script[src^="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"]`
    );

    if (existingScript) {
      return;
    }

    const script = document.createElement('script');
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.src = ADS_CONFIG.ADSENSE_SCRIPT_URL;

    document.head.appendChild(script);
  }, []);
}
