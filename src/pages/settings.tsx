import { CONFIG } from 'src/config-global';

import { Helmet } from 'src/components/helmet';

import { SettingsView } from 'src/sections/user/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet title={`Configuraciones - ${CONFIG.appName}`} />

      <SettingsView />
    </>
  );
}
