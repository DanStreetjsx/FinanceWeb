import { CONFIG } from 'src/config-global';

import { Helmet } from 'src/components/helmet';

import { SignUpView } from 'src/sections/auth';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet title={`Registrarse - ${CONFIG.appName}`} />

      <SignUpView />
    </>
  );
}
