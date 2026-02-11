import { CONFIG } from 'src/config-global';

import { Helmet } from 'src/components/helmet';

import { SignInView } from 'src/sections/auth';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet title={`Iniciar sesión - ${CONFIG.appName}`} />
      
      <SignInView />
    </>
  );
}
