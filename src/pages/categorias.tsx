import { CONFIG } from 'src/config-global';

import { CategoriasView } from 'src/sections/categorias/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title> {`Categorías - ${CONFIG.appName}`}</title>

      <CategoriasView />
    </>
  );
}
