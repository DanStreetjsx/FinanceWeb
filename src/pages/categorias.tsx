import { CONFIG } from 'src/config-global';

import { Helmet } from 'src/components/helmet';

import { CategoriasView } from 'src/sections/categorias/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet title={`Categorías - ${CONFIG.appName}`} />

      <CategoriasView />
    </>
  );
}
