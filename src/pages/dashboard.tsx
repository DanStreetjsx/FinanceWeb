import { CONFIG } from 'src/config-global';

import { Helmet } from 'src/components/helmet';

import { OverviewAnalyticsView as DashboardView } from 'src/sections/overview/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet title={`Inicio - ${CONFIG.appName}`} />
      <meta
        name="description"
        content="Panel de control de finanzas personales"
      />

      <DashboardView />
    </>
  );
}
