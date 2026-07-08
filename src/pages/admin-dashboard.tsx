import { CONFIG } from 'src/config-global';

import { Helmet } from 'src/components/helmet';

import { AdminDashboardView } from 'src/sections/admin/view';

// ----------------------------------------------------------------------

export default function AdminDashboardPage() {
  return (
    <>
      <Helmet title={`Admin - ${CONFIG.appName}`} />

      <AdminDashboardView />
    </>
  );
}
