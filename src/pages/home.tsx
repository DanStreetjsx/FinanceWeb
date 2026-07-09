import { CONFIG } from 'src/config-global';

import { Helmet } from 'src/components/helmet';

import { HomeView } from 'src/sections/home/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet title={`Finance - Controla tus gastos sin Excel | ${CONFIG.appName}`} />
      <meta
        name="description"
        content="Finance te ayuda a registrar gastos por WhatsApp, entender tus finanzas y dejar de depender de hojas de Excel para saber cuánto estás gastando."
      />

      <HomeView />
    </>
  );
}
