import { CONFIG } from 'src/config-global';

import { Helmet } from 'src/components/helmet';

import { GastosView } from 'src/sections/gastos/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet title={`Gastos - ${CONFIG.appName}`} />

      <GastosView />
    </>
  );
}
