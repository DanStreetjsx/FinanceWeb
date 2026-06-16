import { useState, type MouseEvent } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import AlertTitle from '@mui/material/AlertTitle';
import CardHeader from '@mui/material/CardHeader';
import { alpha, useTheme } from '@mui/material/styles';
import LinearProgress from '@mui/material/LinearProgress';
import CircularProgress from '@mui/material/CircularProgress';

import { fPercent, fCurrency } from 'src/utils/format-number';

import { DashboardContent } from 'src/layouts/dashboard';
import { useDashboardData } from 'src/services/analiticas/AnaliticasRepositoryHooks';

import { AnalyticsCurrentVisits } from '../analytics-current-visits';
import { AnalyticsWebsiteVisits } from '../analytics-website-visits';
import { AnalyticsWidgetSummary } from '../analytics-widget-summary';
import { AnalyticsCurrentSubject } from '../analytics-current-subject';
import { AnalyticsConversionRates } from '../analytics-conversion-rates';
import { AnalyticsSavingsEvolution } from '../analytics-savings-evolution';
import { AnalyticsSpendingComparison } from '../analytics-spending-comparison';

// ----------------------------------------------------------------------

function getCurrentMonthValue() {
  const now = new Date();
  const month = `${now.getMonth() + 1}`.padStart(2, '0');
  return `${now.getFullYear()}-${month}`;
}

function getPreviousMonthValue() {
  const now = new Date();
  now.setMonth(now.getMonth() - 1);
  const month = `${now.getMonth() + 1}`.padStart(2, '0');
  return `${now.getFullYear()}-${month}`;
}

const MONTH_OPTIONS = [
  { value: '01', label: 'ene.' },
  { value: '02', label: 'feb.' },
  { value: '03', label: 'mar.' },
  { value: '04', label: 'abr.' },
  { value: '05', label: 'may.' },
  { value: '06', label: 'jun.' },
  { value: '07', label: 'jul.' },
  { value: '08', label: 'ago.' },
  { value: '09', label: 'sep.' },
  { value: '10', label: 'oct.' },
  { value: '11', label: 'nov.' },
  { value: '12', label: 'dic.' },
];

export function OverviewAnalyticsView() {
  const theme = useTheme();
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonthValue());
  const [monthPickerAnchorEl, setMonthPickerAnchorEl] = useState<HTMLElement | null>(null);
  const [monthPickerYear, setMonthPickerYear] = useState(Number(getCurrentMonthValue().slice(0, 4)));
  const { data, isLoading, error } = useDashboardData(selectedMonth);

  if (isLoading) {
    return (
      <DashboardContent>
        <Box sx={{ display: 'flex', flexGrow: 1, justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress />
        </Box>
      </DashboardContent>
    );
  }

  if (error) {
    return (
      <DashboardContent>
        <Typography variant="h4" color="error">Error al cargar los datos del dashboard</Typography>
      </DashboardContent>
    );
  }

  const metrics = data?.metrics || {
    income: 0,
    expense: 0,
    balance: 0,
    expense_diff_percent: 0,
    previous_month_expense: 0
  };
  const history = data?.history || [];
  const categoriesBreakdown = (data?.categories_breakdown || []).map((item) => ({
    label: item.label,
    value: Number(item.value) || 0,
  }));
  const burnRate = data?.burn_rate;
  const remainingBudget = burnRate?.remaining_budget ?? 0;
  const burnRateStatus = burnRate?.status;
  const burnRateHealthMessage = burnRate?.health_message || 'No hay datos de presupuesto';
  const hasBudget = Boolean(burnRate?.has_budget);
  const totalSpent = burnRate?.total_spent ?? 0;
  const totalCategorizedExpense = categoriesBreakdown.reduce((sum, category) => sum + category.value, 0);
  const rankedCategories = [...categoriesBreakdown]
    .filter((category) => category.value > 0)
    .sort((a, b) => b.value - a.value)
    .map((category) => ({
      ...category,
      share: totalCategorizedExpense > 0 ? (category.value / totalCategorizedExpense) * 100 : 0
    }));
  const topCategories = rankedCategories.slice(0, 6);
  const topCategoryLabels = topCategories.map((category) => category.label);
  const topCategoryValues = topCategories.map((category) => category.value);
  const topCategoryShares = topCategories.map((category) => Number(category.share.toFixed(2)));
  const dominantCategory = topCategories[0];
  const topThreeShare = topCategories.slice(0, 3).reduce((sum, category) => sum + category.share, 0);
  const expenseVsIncomeRatio = metrics.income > 0 ? (metrics.expense / metrics.income) * 100 : 0;
  const projectedOverrun = Math.max(0, (burnRate?.projected_monthly ?? 0) - (burnRate?.total_allocated ?? 0));
  const savingsIfTopCategoryDrops10 = (dominantCategory?.value ?? 0) * 0.1;
  const monthlyExpenseAverage =
    history.length > 0 ? history.reduce((sum, item) => sum + item.expense, 0) / history.length : metrics.expense;
  const historyCategories = history.length > 0 ? history.map((item) => item.month) : ['Sin datos'];
  const historyExpenseSeries = history.length > 0 ? history.map((item) => item.expense) : [0];
  const historyAverageSeries = history.length > 0 ? history.map(() => monthlyExpenseAverage) : [0];
  const spendingControlLabel =
    expenseVsIncomeRatio >= 85 ? 'Riesgo alto' : expenseVsIncomeRatio >= 65 ? 'Precaución' : 'Controlado';
  const spendingControlColor: 'error' | 'warning' | 'success' =
    expenseVsIncomeRatio >= 85 ? 'error' : expenseVsIncomeRatio >= 65 ? 'warning' : 'success';
  const selectedMonthDate = new Date(`${selectedMonth}-01T00:00:00`);
  const selectedMonthLabel = Number.isNaN(selectedMonthDate.getTime())
    ? selectedMonth
    : new Intl.DateTimeFormat('es-PE', { month: 'long', year: 'numeric' }).format(selectedMonthDate);
  const dominantCategoryName = dominantCategory?.label || 'Sin categoría dominante';
  const selectedYear = Number(selectedMonth.slice(0, 4));
  const monthPickerOpen = Boolean(monthPickerAnchorEl);

  const handleOpenMonthPicker = (event: MouseEvent<HTMLElement>) => {
    setMonthPickerYear(Number.isNaN(selectedYear) ? new Date().getFullYear() : selectedYear);
    setMonthPickerAnchorEl(event.currentTarget);
  };

  const handleCloseMonthPicker = () => {
    setMonthPickerAnchorEl(null);
  };

  const handleSelectMonth = (monthValue: string) => {
    setSelectedMonth(`${monthPickerYear}-${monthValue}`);
    handleCloseMonthPicker();
  };

  return (
    <DashboardContent
      maxWidth="xl"
      sx={{
        position: 'relative',
        overflow: 'hidden',
        pb: { xs: 4, md: 6 },
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          '&::before, &::after': {
            content: '""',
            position: 'absolute',
            borderRadius: '50%',
            filter: 'blur(48px)',
            opacity: 0.45,
          },
          '&::before': {
            width: 280,
            height: 280,
            top: -90,
            right: -80,
            bgcolor: alpha(theme.palette.primary.main, 0.4),
          },
          '&::after': {
            width: 220,
            height: 220,
            bottom: 90,
            left: -60,
            bgcolor: alpha(theme.palette.warning.main, 0.35),
          },
        }}
      />

      <Stack spacing={3} sx={{ position: 'relative' }}>
        <Card
          sx={{
            p: { xs: 2.5, md: 3.5 },
            borderRadius: 3,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.18)}`,
            background: `linear-gradient(130deg, ${alpha(theme.palette.primary.light, 0.22)} 0%, ${alpha(theme.palette.info.light, 0.18)} 50%, ${alpha(theme.palette.background.paper, 0.96)} 100%)`,
            boxShadow: `0 18px 38px -24px ${alpha(theme.palette.primary.main, 0.45)}`,
          }}
        >
          <Grid container spacing={2.5} alignItems="center">
            <Grid size={{ xs: 12, md: 8 }}>
              <Stack spacing={1.5}>
                <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 700 }}>
                  Centro de control financiero
                </Typography>
                <Typography variant="h3" sx={{ textTransform: 'capitalize', lineHeight: 1.2 }}>
                  Tu panorama financiero de {selectedMonthLabel}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Monitorea tus ingresos, detecta fugas de gasto y toma decisiones con más claridad.
                </Typography>
                <Stack direction="row" flexWrap="wrap" gap={1}>
                  <Chip
                    color="success"
                    label={`Saldo neto: ${fCurrency(metrics.balance)}`}
                    sx={{ bgcolor: alpha(theme.palette.success.main, 0.16), color: 'success.dark', fontWeight: 700 }}
                  />
                  <Chip
                    color="warning"
                    label={`Top gasto: ${dominantCategoryName}`}
                    sx={{ bgcolor: alpha(theme.palette.warning.main, 0.16), color: 'warning.dark', fontWeight: 700 }}
                  />
                  <Chip
                    color="info"
                    label={`Gasto/Ingreso: ${fPercent(expenseVsIncomeRatio)}`}
                    sx={{ bgcolor: alpha(theme.palette.info.main, 0.16), color: 'info.dark', fontWeight: 700 }}
                  />
                </Stack>
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.background.paper, 0.85),
                  border: `1px solid ${alpha(theme.palette.grey[500], 0.2)}`,
                  backdropFilter: 'blur(6px)',
                }}
              >
                <Typography variant="overline" sx={{ color: 'text.secondary', fontWeight: 700 }}>
                  Mes a analizar
                </Typography>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleOpenMonthPicker}
                  sx={{
                    mt: 1,
                    py: 1.1,
                    justifyContent: 'space-between',
                    borderRadius: 1.5,
                    boxShadow: 'none',
                    bgcolor: alpha(theme.palette.primary.main, 0.9),
                    '&:hover': { bgcolor: theme.palette.primary.main, boxShadow: 'none' },
                  }}
                >
                  {selectedMonthLabel}
                </Button>
                <Stack direction="row" spacing={1} sx={{ mt: 1.25 }}>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => setSelectedMonth(getCurrentMonthValue())}
                    sx={{ flex: 1, borderRadius: 1.25 }}
                  >
                    Este mes
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => setSelectedMonth(getPreviousMonthValue())}
                    sx={{ flex: 1, borderRadius: 1.25 }}
                  >
                    Mes pasado
                  </Button>
                </Stack>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1.5, display: 'block' }}>
                  Periodo API: {data?.period?.start_date || `${selectedMonth}-01`} a {data?.period?.end_date || 'fin de mes'}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Card>

        <Popover
          open={monthPickerOpen}
          anchorEl={monthPickerAnchorEl}
          onClose={handleCloseMonthPicker}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          slotProps={{
            paper: {
              sx: {
                mt: 1,
                p: 2,
                width: 320,
                borderRadius: 2,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.18)}`,
                background: `linear-gradient(180deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.primary.lighter, 0.18)} 100%)`,
              }
            }
          }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
            <Button size="small" onClick={() => setMonthPickerYear((prev) => prev - 1)}>
              Año anterior
            </Button>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              {monthPickerYear}
            </Typography>
            <Button size="small" onClick={() => setMonthPickerYear((prev) => prev + 1)}>
              Año siguiente
            </Button>
          </Stack>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
              gap: 1,
            }}
          >
            {MONTH_OPTIONS.map((month) => {
              const value = `${monthPickerYear}-${month.value}`;
              const isSelected = value === selectedMonth;

              return (
                <Button
                  key={month.value}
                  size="small"
                  variant={isSelected ? 'contained' : 'text'}
                  onClick={() => handleSelectMonth(month.value)}
                  sx={{
                    minWidth: 0,
                    px: 0,
                    py: 0.9,
                    borderRadius: 1.25,
                    color: isSelected ? 'common.white' : 'text.primary',
                    bgcolor: isSelected ? 'primary.main' : alpha(theme.palette.grey[500], 0.08),
                    '&:hover': {
                      bgcolor: isSelected ? 'primary.dark' : alpha(theme.palette.primary.main, 0.12),
                    },
                  }}
                >
                  {month.label}
                </Button>
              );
            })}
          </Box>
        </Popover>

        <Alert 
          severity="info" 
          icon={
            <Box
              component="img"
              src="/assets/icons/glass/ic-glass-message.svg"
              sx={{ width: 24, height: 24 }}
            />
          }
          sx={{
            borderRadius: 2.5,
            border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
            bgcolor: alpha(theme.palette.info.lighter, 0.6),
          }}
        >
          <AlertTitle sx={{ fontWeight: 'bold' }}>¡Registra tus gastos por WhatsApp!</AlertTitle>
          Ya puedes registrar tus movimientos enviando un mensaje. Prueba escribiendo:
          <strong> &quot;Almuerzo 25&quot;</strong> o <strong> &quot;+ Sueldo 3000&quot;</strong>.
          Revisa tu WhatsApp para encontrar el chat oficial.
        </Alert>

        <Typography variant="overline" sx={{ color: 'text.secondary', letterSpacing: 1.2, fontWeight: 700 }}>
          Resumen mensual
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
                total={remainingBudget}
                color={burnRateStatus === 'warning' ? 'warning' : burnRateStatus === 'over_budget' ? 'error' : 'success'}
                icon={
                  <img 
                    alt="Estado Presupuesto" 
                    src={
                      !burnRate
                        ? '/assets/icons/glass/ic-glass-pensando.svg'
                        : remainingBudget < 0
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
                  {burnRateHealthMessage}
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
                series: categoriesBreakdown.length > 0 
                  ? categoriesBreakdown.map(c => ({ label: c.label, value: c.value }))
                  : [{ label: 'Sin datos', value: 0 }],
              }}
            />
            <AnalyticsCurrentVisits
              title="Progreso del Presupuesto"
              chart={{
                series: hasBudget ? [
                  { label: 'Gastado', value: totalSpent },
                  { label: 'Restante', value: Math.max(0, remainingBudget) },
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
          <Typography variant="overline" sx={{ color: 'text.secondary', letterSpacing: 1.2, fontWeight: 700, mb: 1.5, display: 'block' }}>
            Profundidad del gasto
          </Typography>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 5 }}>
              <Card
                sx={{
                  p: 3,
                  height: '100%',
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #fffdf7 0%, #f5fbff 100%)',
                }}
              >
                <CardHeader
                  title="Radiografía de tus gastos"
                  subheader="Qué categorías están consumiendo más dinero"
                  sx={{ p: 0, mb: 2 }}
                />

                {topCategories.length === 0 ? (
                  <Alert severity="info">Todavía no hay suficiente data de categorías para este periodo.</Alert>
                ) : (
                  <Stack spacing={2}>
                    {topCategories.map((category) => (
                      <Box key={category.label}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.8 }}>
                          <Typography variant="subtitle2">{category.label}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {fCurrency(category.value)} ({fPercent(category.share)})
                          </Typography>
                        </Stack>
                        <LinearProgress
                          variant="determinate"
                          value={Math.min(100, category.share)}
                          sx={{ height: 8, borderRadius: 99 }}
                        />
                      </Box>
                    ))}
                  </Stack>
                )}
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <AnalyticsCurrentSubject
                title="Concentración del gasto"
                subheader="Distribución actual vs objetivo equilibrado"
                chart={{
                  categories: topCategoryLabels.length > 0 ? topCategoryLabels : ['Sin datos'],
                  series:
                    topCategoryLabels.length > 0
                      ? [
                          { name: 'Actual %', data: topCategoryShares },
                          {
                            name: 'Objetivo %',
                            data: topCategoryLabels.map(() => Number((100 / topCategoryLabels.length).toFixed(2)))
                          }
                        ]
                      : [
                          { name: 'Actual %', data: [0] },
                          { name: 'Objetivo %', data: [0] }
                        ],
                  options: {
                    yaxis: {
                      labels: {
                        formatter: (value: number) => `${Math.round(value)}%`
                      }
                    }
                  }
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <Card
                sx={{
                  p: 3,
                  height: '100%',
                  borderRadius: 2,
                  background: 'linear-gradient(180deg, #fff9ed 0%, #ffffff 100%)',
                }}
              >
                <Typography variant="overline" color="text.secondary">
                  Panel de control
                </Typography>
                <Typography variant="h6" sx={{ mt: 0.5, mb: 2 }}>
                  Semáforo financiero
                </Typography>

                <Chip label={spendingControlLabel} color={spendingControlColor} sx={{ mb: 2 }} />

                <Stack spacing={1.5}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Gasto sobre ingreso
                    </Typography>
                    <Typography variant="h5">{fPercent(expenseVsIncomeRatio)}</Typography>
                  </Box>

                  <Divider />

                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Top 3 categorías
                    </Typography>
                    <Typography variant="h5">{fPercent(topThreeShare)}</Typography>
                  </Box>

                  <Divider />

                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Ahorro potencial (bajando 10% la categoría líder)
                    </Typography>
                    <Typography variant="h6" color="success.main">
                      {fCurrency(savingsIfTopCategoryDrops10)}
                    </Typography>
                  </Box>

                  {projectedOverrun > 0 && (
                    <>
                      <Divider />
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Riesgo de sobrepasar presupuesto proyectado
                        </Typography>
                        <Typography variant="h6" color="error.main">
                          {fCurrency(projectedOverrun)}
                        </Typography>
                      </Box>
                    </>
                  )}
                </Stack>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Typography variant="overline" sx={{ color: 'text.secondary', letterSpacing: 1.2, fontWeight: 700, mb: 1.5, display: 'block' }}>
            Tendencias y comparativas
          </Typography>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <AnalyticsWebsiteVisits
                title="Top categorías por monto"
                subheader="Dónde se está concentrando el gasto real"
                chart={{
                  categories: topCategoryLabels.length > 0 ? topCategoryLabels : ['Sin datos'],
                  series: [{ name: 'Gasto', data: topCategoryValues.length > 0 ? topCategoryValues : [0] }],
                  options: {
                    plotOptions: { bar: { borderRadius: 6, columnWidth: '56%' } },
                    tooltip: { y: { formatter: (value: number) => fCurrency(value) } },
                    yaxis: { labels: { formatter: (value: number) => fCurrency(value) } },
                  }
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <AnalyticsWebsiteVisits
                title="Ritmo de gasto mensual"
                subheader="Compara cada mes contra tu promedio"
                chart={{
                  categories: historyCategories,
                  series: [
                    { name: 'Gasto mensual', data: historyExpenseSeries },
                    { name: 'Promedio', data: historyAverageSeries },
                  ],
                  options: {
                    tooltip: { y: { formatter: (value: number) => fCurrency(value) } },
                    yaxis: { labels: { formatter: (value: number) => fCurrency(value) } },
                  }
                }}
              />
            </Grid>
          </Grid>
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
      </Stack>
    </DashboardContent>
  );
}
