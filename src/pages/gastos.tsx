import { CONFIG } from 'src/config-global';

import { GastosView } from 'src/sections/gastos/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Gastos - ${CONFIG.appName}`}</title>

      <GastosView />
    </>
  );
}
