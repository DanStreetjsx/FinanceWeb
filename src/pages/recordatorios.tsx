import { CONFIG } from 'src/config-global';

import { RecordatoriosView } from 'src/sections/recordatorios/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title> {`Recordatorios - ${CONFIG.appName}`}</title>

      <RecordatoriosView />
    </>
  );
}
