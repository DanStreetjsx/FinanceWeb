import { CONFIG } from 'src/config-global';

import { IngresosView } from 'src/sections/ingresos/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Ingresos - ${CONFIG.appName}`}</title>

      <IngresosView />
    </>
  );
}
