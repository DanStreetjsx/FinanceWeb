import { CONFIG } from 'src/config-global';

import { Helmet } from 'src/components/helmet';

import { ProfileView } from 'src/sections/user/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet title={`Perfil - ${CONFIG.appName}`} />

      <ProfileView />
    </>
  );
}
