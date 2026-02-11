import { CONFIG } from 'src/config-global';

import { Helmet } from 'src/components/helmet';

import { RecordatoriosView } from 'src/sections/recordatorios/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet title={`Recordatorios - ${CONFIG.appName}`} />

      <RecordatoriosView />
    </>
  );
}
