import { CONFIG } from 'src/config-global';

import { SignUpView } from 'src/sections/auth';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Registrarse - ${CONFIG.appName}`}</title>

      <SignUpView />
    </>
  );
}
