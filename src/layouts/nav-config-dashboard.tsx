import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} />;

export type NavItem = {
  title: string;
  path: string;
  icon: React.ReactNode;
  info?: React.ReactNode;
};

export const navData = [
  {
    title: 'Inicio',
    path: '/dashboard',
    icon: icon('ic-analytics'),
  },
  {
    title: 'Ingresos',
    path: '/dashboard/ingresos',
    icon: icon('ic-user'),
  },
  {
    title: 'Gastos',
    path: '/dashboard/gastos',
    icon: icon('ic-cart'),
  },
  {
    title: 'Presupuestos',
    path: '/dashboard/presupuestos',
    icon: icon('ic-blog'),
  },
  {
    title: 'Recordatorios',
    path: '/dashboard/recordatorios',
    icon: icon('ic-notification'),
  },
  {
    title: 'Categorías',
    path: '/dashboard/categorias',
    icon: icon('ic-lock'),
  },
];
