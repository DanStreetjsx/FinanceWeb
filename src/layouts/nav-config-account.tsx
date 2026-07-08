import { Iconify } from 'src/components/iconify';

import type { AccountPopoverProps } from './components/account-popover';

// ----------------------------------------------------------------------

export const _account: AccountPopoverProps['data'] = [
  {
    label: 'Inicio',
    href: '/',
    icon: <Iconify width={22} icon="solar:home-angle-bold-duotone" />,
  },
  {
    label: 'Perfil',
    href: '/dashboard/perfil',
    icon: <Iconify width={22} icon="solar:shield-keyhole-bold-duotone" />,
  },
  {
    label: 'Configuración',
    href: '/dashboard/configuracion',
    icon: <Iconify width={22} icon="solar:settings-bold-duotone" />,
  },
  {
    label: 'Admin',
    href: '/dashboard/admin',
    icon: <Iconify width={22} icon="solar:chart-2-bold-duotone" />,
    roles: ['admin'],
  },
];
