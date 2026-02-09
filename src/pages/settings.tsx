import { CONFIG } from 'src/config-global';

import { SettingsView } from 'src/sections/user/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title> {`Configuraciones - ${CONFIG.appName}`}</title>

      <SettingsView />
    </>
  );
}
