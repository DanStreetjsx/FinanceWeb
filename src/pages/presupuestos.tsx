import { CONFIG } from 'src/config-global';

import { Helmet } from 'src/components/helmet';

import { PresupuestosView } from 'src/sections/presupuestos/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet title={`Presupuestos - ${CONFIG.appName}`} />

      <PresupuestosView />
    </>
  );
}
