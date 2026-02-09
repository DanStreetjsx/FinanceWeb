import { CONFIG } from 'src/config-global';

import { OverviewAnalyticsView as DashboardView } from 'src/sections/overview/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Inicio - ${CONFIG.appName}`}</title>
      <meta
        name="description"
        content="Panel de control de finanzas personales"
      />

      <DashboardView />
    </>
  );
}
