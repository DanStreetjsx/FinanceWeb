import type { AdminMetric } from 'src/services/admin/AdminMetricsRepository';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import { alpha, useTheme } from '@mui/material/styles';

import { fNumber, fPercent } from 'src/utils/format-number';

import { DashboardContent } from 'src/layouts/dashboard';
import { useAdminMetrics } from 'src/services/admin/AdminMetricsRepositoryHooks';

import { Iconify } from 'src/components/iconify';
import { Chart, useChart } from 'src/components/chart';

import { AnalyticsCurrentVisits } from 'src/sections/overview/analytics-current-visits';

// ----------------------------------------------------------------------

const RANGE_OPTIONS = [7, 30, 90];

function getMetricColor(value: number): 'success' | 'warning' | 'error' {
  if (value > 0) return 'success';
  if (value < 0) return 'error';
  return 'warning';
}

function MetricCard({
  title,
  metric,
  icon,
  suffix,
}: {
  title: string;
  metric: AdminMetric;
  icon: string;
  suffix?: string;
}) {
  const theme = useTheme();
  const color = getMetricColor(metric.change_percent);

  return (
    <Card
      sx={{
        p: 2.5,
        height: '100%',
        borderRadius: '8px',
        border: `1px solid ${alpha(theme.palette.grey[500], 0.18)}`,
        boxShadow: `0 16px 32px -24px ${alpha(theme.palette.grey[900], 0.5)}`,
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
        <Box
          sx={{
            width: 44,
            height: 44,
            display: 'grid',
            borderRadius: 1.5,
            placeItems: 'center',
            color: 'primary.main',
            bgcolor: alpha(theme.palette.primary.main, 0.12),
          }}
        >
          <Iconify icon={icon} width={24} />
        </Box>

        <Chip
          size="small"
          color={color}
          label={`${metric.change_percent > 0 ? '+' : ''}${fPercent(metric.change_percent)}`}
        />
      </Stack>

      <Typography variant="h4" sx={{ mt: 2 }}>
        {fNumber(metric.value)}
        {suffix}
      </Typography>
      <Typography variant="subtitle2" color="text.secondary">
        {title}
      </Typography>
      <Typography variant="caption" color="text.disabled">
        Antes: {fNumber(metric.previous_value)}
      </Typography>
    </Card>
  );
}

function DailyActivityChart({ data }: { data: NonNullable<ReturnType<typeof useAdminMetrics>['data']>['charts']['daily_activity'] }) {
  const categories = data.map((item) =>
    new Intl.DateTimeFormat('es-PE', { day: '2-digit', month: 'short' }).format(new Date(`${item.date}T00:00:00`))
  );

  const chartOptions = useChart({
    stroke: { width: [0, 0, 3, 3], curve: 'smooth' },
    xaxis: { categories },
    tooltip: { y: { formatter: (value: number) => fNumber(value) } },
    yaxis: { labels: { formatter: (value: number) => fNumber(value) } },
  });

  return (
    <Card sx={{ height: '100%', borderRadius: '8px' }}>
      <CardHeader title="Actividad diaria" subheader="Visitas, registros y conversación por WhatsApp" />
      <Chart
        type="line"
        series={[
          { name: 'Visitas web', type: 'column', data: data.map((item) => item.visits) },
          { name: 'Usuarios nuevos', type: 'column', data: data.map((item) => item.users) },
          { name: 'WhatsApp recibidos', type: 'line', data: data.map((item) => item.whatsapp_inbound) },
          { name: 'WhatsApp enviados', type: 'line', data: data.map((item) => item.whatsapp_outbound) },
        ]}
        options={chartOptions}
        sx={{ height: 380, px: 2, py: 3 }}
      />
    </Card>
  );
}

function TopPagesCard({ pages }: { pages: NonNullable<ReturnType<typeof useAdminMetrics>['data']>['charts']['top_pages'] }) {
  const maxVisits = Math.max(...pages.map((page) => page.visits), 1);

  return (
    <Card sx={{ height: '100%', borderRadius: '8px' }}>
      <CardHeader title="Páginas más visitadas" subheader="Rutas con más tracción dentro de la web" />
      <Stack spacing={2} sx={{ p: 3 }}>
        {pages.length === 0 && <Alert severity="info">Todavía no hay visitas registradas.</Alert>}
        {pages.map((page) => (
          <Box key={page.path}>
            <Stack direction="row" justifyContent="space-between" gap={2}>
              <Typography variant="subtitle2" noWrap>
                {page.path}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {fNumber(page.visits)}
              </Typography>
            </Stack>
            <Box
              sx={{
                mt: 1,
                height: 8,
                borderRadius: 99,
                bgcolor: 'action.hover',
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  height: 1,
                  width: `${Math.max(4, (page.visits / maxVisits) * 100)}%`,
                  borderRadius: 'inherit',
                  bgcolor: 'primary.main',
                }}
              />
            </Box>
            <Typography variant="caption" color="text.disabled">
              {fNumber(page.unique_visitors)} visitantes únicos
            </Typography>
          </Box>
        ))}
      </Stack>
    </Card>
  );
}

export function AdminDashboardView() {
  const theme = useTheme();
  const [days, setDays] = useState(30);
  const { data, isLoading, error } = useAdminMetrics(days);

  if (isLoading) {
    return (
      <DashboardContent maxWidth="xl">
        <Grid container spacing={3}>
          {Array.from({ length: 8 }).map((_, index) => (
            <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }}>
              <Skeleton variant="rounded" height={154} />
            </Grid>
          ))}
        </Grid>
      </DashboardContent>
    );
  }

  if (error || !data) {
    return (
      <DashboardContent maxWidth="xl">
        <Alert severity="error">No se pudo cargar el dashboard de administradores.</Alert>
      </DashboardContent>
    );
  }

  return (
    <DashboardContent maxWidth="xl" sx={{ bgcolor: alpha(theme.palette.grey[500], 0.06), pb: 5 }}>
      <Stack spacing={3}>
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2}>
          <Box>
            <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 700 }}>
              Solo administradores
            </Typography>
            <Typography variant="h3">Funcionamiento de la web</Typography>
            <Typography variant="body2" color="text.secondary">
              Del {data.period.start_date} al {data.period.end_date}. Incluye tráfico web, registros y actividad WhatsApp.
            </Typography>
          </Box>

          <Stack direction="row" spacing={1} alignItems="center">
            {RANGE_OPTIONS.map((option) => (
              <Button
                key={option}
                variant={days === option ? 'contained' : 'outlined'}
                onClick={() => setDays(option)}
                sx={{ borderRadius: 1.5 }}
              >
                {option} días
              </Button>
            ))}
          </Stack>
        </Stack>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <MetricCard title="Visitas a la web" metric={data.summary.web_visits} icon="solar:eye-bold" />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <MetricCard title="Visitantes únicos" metric={data.summary.unique_visitors} icon="solar:users-group-rounded-bold" />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <MetricCard title="Usuarios registrados web" metric={data.summary.web_users} icon="solar:user-plus-bold" />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <MetricCard title="Usuarios activos WhatsApp" metric={data.summary.whatsapp_users} icon="logos:whatsapp-icon" />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <MetricCard title="Mensajes WhatsApp recibidos" metric={data.summary.whatsapp_inbound_messages} icon="solar:inbox-in-bold" />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <MetricCard title="Mensajes WhatsApp enviados" metric={data.summary.whatsapp_outbound_messages} icon="solar:plain-bold" />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <MetricCard title="Transacciones creadas" metric={data.summary.transactions} icon="solar:wallet-money-bold" />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card sx={{ p: 2.5, height: '100%', borderRadius: '8px' }}>
              <Iconify icon="solar:check-circle-bold" width={42} color={theme.palette.success.main} />
              <Typography variant="h4" sx={{ mt: 2 }}>
                {fPercent(data.summary.whatsapp_delivery_rate.value)}
              </Typography>
              <Typography variant="subtitle2" color="text.secondary">
                Tasa de envío WhatsApp
              </Typography>
              <Typography variant="caption" color="text.disabled">
                Antes: {fPercent(data.summary.whatsapp_delivery_rate.previous_value)}
              </Typography>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, lg: 8 }}>
            <DailyActivityChart data={data.charts.daily_activity} />
          </Grid>
          <Grid size={{ xs: 12, lg: 4 }}>
            <AnalyticsCurrentVisits
              title="Estado de mensajes"
              subheader="Enviados, fallidos y recibidos"
              chart={{ series: data.charts.message_status }}
              sx={{ height: '100%', borderRadius: '8px' }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 7 }}>
            <TopPagesCard pages={data.charts.top_pages} />
          </Grid>
          <Grid size={{ xs: 12, md: 5 }}>
            <Card sx={{ height: '100%', borderRadius: '8px' }}>
              <CardHeader title="Registros y usuarios" subheader="Últimos usuarios creados" />
              <Stack divider={<Divider flexItem />} sx={{ px: 3, pb: 3 }}>
                {data.recent.users.map((user) => (
                  <Stack key={user.id} direction="row" justifyContent="space-between" spacing={2} sx={{ py: 1.5 }}>
                    <Box>
                      <Typography variant="subtitle2">{user.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {user.phone}
                      </Typography>
                    </Box>
                    <Stack alignItems="flex-end">
                      <Chip size="small" label={user.role} color={user.role === 'admin' ? 'primary' : 'default'} />
                      <Typography variant="caption" color="text.disabled">
                        {user.created_at}
                      </Typography>
                    </Stack>
                  </Stack>
                ))}
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Stack>
    </DashboardContent>
  );
}
