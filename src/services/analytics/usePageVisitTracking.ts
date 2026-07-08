import { useEffect } from 'react';

import { usePathname } from 'src/routes/hooks';

import api from '../api';

function getSessionId() {
  const key = 'finance_visit_session_id';
  const existing = sessionStorage.getItem(key);

  if (existing) {
    return existing;
  }

  const id = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
  sessionStorage.setItem(key, id);

  return id;
}

export function usePageVisitTracking() {
  const pathname = usePathname();

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      api.post('/analytics/visits', {
        path: `${window.location.pathname}${window.location.search}`,
        title: document.title,
        referrer: document.referrer || null,
        session_id: getSessionId(),
      }).catch(() => {
        // Analytics should never interrupt the user journey.
      });
    }, 350);

    return () => window.clearTimeout(timeoutId);
  }, [pathname]);
}
