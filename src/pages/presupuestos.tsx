import { CONFIG } from 'src/config-global';

import { PresupuestosView } from 'src/sections/presupuestos/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Presupuestos - ${CONFIG.appName}`}</title>

      <PresupuestosView />
    </>
  );
}
