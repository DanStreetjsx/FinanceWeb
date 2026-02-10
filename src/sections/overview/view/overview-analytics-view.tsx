import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { DashboardContent } from 'src/layouts/dashboard';
import { useDashboardData } from 'src/services/analiticas/AnaliticasRepositoryHooks';

import { AnalyticsCurrentVisits } from '../analytics-current-visits';
import { AnalyticsWebsiteVisits } from '../analytics-website-visits';
import { AnalyticsWidgetSummary } from '../analytics-widget-summary';
import { AnalyticsConversionRates } from '../analytics-conversion-rates';
import { AnalyticsSavingsEvolution } from '../analytics-savings-evolution';
import { AnalyticsSpendingComparison } from '../analytics-spending-comparison';

// ----------------------------------------------------------------------

export function OverviewAnalyticsView() {
  const { data, isLoading, error } = useDashboardData();

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <DashboardContent>
        <Typography variant="h4" color="error">Error al cargar los datos del dashboard</Typography>
      </DashboardContent>
    );
  }

  const { metrics, history, categories_breakdown, burn_rate } = data || {
    metrics: { income: 0, expense: 0, balance: 0, expense_diff_percent: 0, previous_month_expense: 0 },
    history: [],
    categories_breakdown: [],
    burn_rate: { health_message: 'No hay datos de presupuesto' }
  };

  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
        ¡Bienvenido de nuevo!
      </Typography>

      <Grid container spacing={3} alignItems="stretch">
        {/* Primera fila: 4 cards de métricas */}
        <Grid size={{ xs: 12 }}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <AnalyticsWidgetSummary
                title="Ingresos Total"
                percent={0}
                total={metrics.income}
                color="primary"
                icon={<img alt="Ingresos" src="/assets/icons/glass/ic-glass-bag.svg" />} 
                chart={{
                  categories: history.map(h => h.month),
                  series: history.map(h => h.income),
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <AnalyticsWidgetSummary
                title="Total Gastado"
                percent={metrics.expense_diff_percent}
                total={metrics.expense}
                color="error"
                icon={<img alt="Gastos" src="/assets/icons/glass/ic-glass-buy.svg" />} 
                chart={{
                  categories: history.map(h => h.month),
                  series: history.map(h => h.expense),
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <AnalyticsWidgetSummary
                title="Saldo"
                percent={0}
                total={metrics.balance}
                color="success"
                icon={<img alt="Saldo" src="/assets/icons/glass/ic-glass-wallet.svg" />} 
                chart={{
                  categories: history.map(h => h.month),
                  series: history.map(h => h.cumulative_balance),
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <AnalyticsWidgetSummary
                title="Estado de Presupuesto"
                percent={0}
                total={burn_rate.remaining_budget || 0}
                color={burn_rate.status === 'warning' ? 'warning' : burn_rate.status === 'over_budget' ? 'error' : 'success'}
                icon={
                  <img 
                    alt="Estado Presupuesto" 
                    src={
                      (burn_rate.remaining_budget ?? null) === null
                        ? '/assets/icons/glass/ic-glass-pensando.svg'
                        : burn_rate.remaining_budget < 0
                        ? '/assets/icons/glass/ic-glass-mal.png'
                        : '/assets/icons/glass/ic-glass-plus.svg'
                    } 
                  />
                } 
                chart={{
                  categories: history.map(h => h.month),
                  series: [0, 0, 0, 0, 0, 0],
                }}
              >
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {burn_rate.health_message}
                </Typography>
              </AnalyticsWidgetSummary>
            </Grid>
          </Grid>
        </Grid>

        {/* Segunda fila: pastel + evolución de ahorros */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Stack spacing={3}>
            <AnalyticsCurrentVisits
              title="Gastos por Categoría"
              chart={{
                series: categories_breakdown.length > 0 
                  ? categories_breakdown.map(c => ({ label: c.label, value: c.value }))
                  : [{ label: 'Sin datos', value: 0 }],
              }}
            />
            <AnalyticsCurrentVisits
              title="Progreso del Presupuesto"
              chart={{
                series: burn_rate.has_budget ? [
                  { label: 'Gastado', value: burn_rate.total_spent },
                  { label: 'Restante', value: Math.max(0, burn_rate.remaining_budget) },
                ] : [{ label: 'Sin presupuesto', value: 0 }],
              }}
            />
          </Stack>
        </Grid>
        
        <Grid size={{ xs: 12, md: 8 }}>
          <Stack spacing={3}>
            <AnalyticsSavingsEvolution
              title="Evolución de Ahorros"
              subheader="Balance acumulado mes a mes"
              chart={{
                categories: history.map(h => h.month),
                series: [
                  { name: 'Balance Acumulado', data: history.map(h => h.cumulative_balance) },
                  { name: 'Ahorro Mensual', data: history.map(h => h.savings) },
                ],
              }}
            />
            
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <AnalyticsSpendingComparison
                  title="Comparativa de Gastos"
                  subheader="Mes actual vs Mes anterior"
                  chart={{
                    categories: ['Gastos'],
                    series: [
                      { name: 'Mes Actual', data: [metrics.expense] },
                      { name: 'Mes Anterior', data: [metrics.previous_month_expense] },
                    ],
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <AnalyticsWebsiteVisits
                  title="Ingresos vs Gastos"
                  chart={{
                    categories: history.map(h => h.month),
                    series: [
                      { name: 'Ingresos', data: history.map(h => h.income) },
                      { name: 'Gastos', data: history.map(h => h.expense) },
                    ],
                  }}
                />
              </Grid>
            </Grid>
          </Stack>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <AnalyticsConversionRates
            title="Historial de Movimientos"
            subheader="Ingresos y gastos de los últimos 6 meses"
            chart={{
              categories: history.map(h => h.month),
              series: [
                { name: 'Ingresos', data: history.map(h => h.income) },
                { name: 'Gastos', data: history.map(h => h.expense) },
              ],
            }}
          />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
