import { CONFIG } from 'src/config-global';

import { Helmet } from 'src/components/helmet';

import { IngresosView } from 'src/sections/ingresos/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet title={`Ingresos - ${CONFIG.appName}`} />

      <IngresosView />
    </>
  );
}
