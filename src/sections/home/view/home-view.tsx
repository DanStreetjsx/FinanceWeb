import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { RouterLink } from 'src/routes/components';

import { ADS_CONFIG } from 'src/config/ads-config';

import { Logo } from 'src/components/logo';
import { Iconify } from 'src/components/iconify';
import { AdSenseSlot } from 'src/components/ads/adsense-slot';

// ----------------------------------------------------------------------

const FEATURES = [
  {
    title: 'Registra desde WhatsApp',
    description: 'Escribe algo simple como "almuerzo 25" o "+ sueldo 3000" y Finance lo convierte en movimiento.',
    icon: 'logos:whatsapp-icon',
  },
  {
    title: 'Visualiza tu mes',
    description: 'Mira ingresos, gastos, balance y categorías sin construir tablas ni fórmulas manuales.',
    icon: 'solar:chart-2-bold-duotone',
  },
  {
    title: 'Presupuestos y alertas',
    description: 'Define límites, recibe recordatorios y detecta cuando estás gastando más rápido de lo esperado.',
    icon: 'solar:bell-bing-bold-duotone',
  },
];

const ARTICLE_POINTS = [
  'El problema no es que Excel sea malo: el problema es que exige disciplina todos los días.',
  'Si registrar un gasto te toma demasiado tiempo, lo normal es que lo dejes para después y luego olvides detalles.',
  'Finance reduce esa fricción: anotas desde el teléfono, revisas el dashboard cuando quieres y mantienes tu historial ordenado.',
];

const FAQS = [
  {
    question: '¿Finance reemplaza mi Excel?',
    answer:
      'Puede reemplazarlo para el seguimiento diario. Si quieres analizar más a fondo, puedes usar la información organizada como base para tus reportes.',
  },
  {
    question: '¿Necesito instalar una app?',
    answer:
      'No. Puedes usar la web y registrar movimientos desde WhatsApp, que ya forma parte de tu rutina diaria.',
  },
  {
    question: '¿Sirve para ingresos y gastos?',
    answer:
      'Sí. Puedes registrar gastos, ingresos, categorías, presupuestos y recordatorios para tener una vista clara de tu dinero.',
  },
];

export function HomeView() {
  const theme = useTheme();

  return (
    <Box sx={{ bgcolor: '#f8fbff', minHeight: '100vh', color: '#172033' }}>
      <Box
        component="header"
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          bgcolor: alpha('#ffffff', 0.86),
          backdropFilter: 'blur(12px)',
          borderBottom: `1px solid ${alpha(theme.palette.grey[500], 0.16)}`,
        }}
      >
        <Container maxWidth="lg">
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ py: 1.5 }}>
            <Stack direction="row" alignItems="center" spacing={1.25}>
              <Logo sx={{ width: 38, height: 38 }} />
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                Finance
              </Typography>
            </Stack>

            <Stack direction="row" spacing={1}>
              <Button component={RouterLink} href="/sign-in" color="inherit">
                Entrar
              </Button>
              <Button component={RouterLink} href="/sign-up" variant="contained">
                Crear cuenta
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>

      <Box
        component="main"
        sx={{
          overflow: 'hidden',
          background:
            'linear-gradient(180deg, #edf8ff 0%, #ffffff 48%, #f8fbff 100%)',
        }}
      >
        <Container maxWidth="lg" sx={{ pt: { xs: 6, md: 9 }, pb: { xs: 6, md: 8 } }}>
          <Grid container spacing={{ xs: 4, md: 6 }} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack spacing={3}>
                <Chip
                  label="Finanzas personales sin hojas interminables"
                  sx={{
                    alignSelf: 'flex-start',
                    color: 'primary.dark',
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    fontWeight: 700,
                  }}
                />

                <Typography variant="h1" sx={{ fontSize: { xs: 42, md: 64 }, lineHeight: 1.02, fontWeight: 900 }}>
                  ¿Cansado de registrar tus gastos en Excel?
                </Typography>

                <Typography variant="h5" color="text.secondary" sx={{ lineHeight: 1.55, maxWidth: 620 }}>
                  Finance te ayuda a anotar tus gastos desde WhatsApp y revisar cuánto estás gastando sin sentarte frente
                  a una computadora a ordenar filas, fórmulas y categorías.
                </Typography>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                  <Button component={RouterLink} href="/sign-up" size="large" variant="contained">
                    Empezar gratis
                  </Button>
                  <Button component={RouterLink} href="/sign-in" size="large" variant="outlined">
                    Ya tengo cuenta
                  </Button>
                </Stack>

                <Stack direction="row" flexWrap="wrap" gap={1}>
                  {['WhatsApp', 'Presupuestos', 'Recordatorios', 'Dashboard'].map((item) => (
                    <Chip key={item} label={item} variant="outlined" />
                  ))}
                </Stack>
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Card
                sx={{
                  p: { xs: 2, md: 3 },
                  borderRadius: '8px',
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.18)}`,
                  boxShadow: `0 28px 70px -34px ${alpha(theme.palette.primary.dark, 0.6)}`,
                }}
              >
                <Stack spacing={2}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Box sx={{ width: 10, height: 10, borderRadius: 99, bgcolor: 'error.main' }} />
                    <Box sx={{ width: 10, height: 10, borderRadius: 99, bgcolor: 'warning.main' }} />
                    <Box sx={{ width: 10, height: 10, borderRadius: 99, bgcolor: 'success.main' }} />
                    <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                      finance.site/dashboard
                    </Typography>
                  </Stack>

                  <Box
                    sx={{
                      p: 2.5,
                      borderRadius: 2,
                      bgcolor: '#eef9ff',
                      border: `1px solid ${alpha(theme.palette.info.main, 0.24)}`,
                    }}
                  >
                    <Typography variant="overline" color="primary.main" sx={{ fontWeight: 800 }}>
                      Resumen de julio
                    </Typography>
                    <Grid container spacing={1.5} sx={{ mt: 1 }}>
                      {[
                        ['Ingresos', 'S/ 3,200'],
                        ['Gastos', 'S/ 1,480'],
                        ['Saldo', 'S/ 1,720'],
                      ].map(([label, value]) => (
                        <Grid key={label} size={{ xs: 12, sm: 4 }}>
                          <Box sx={{ p: 1.5, borderRadius: 1.5, bgcolor: 'common.white' }}>
                            <Typography variant="caption" color="text.secondary">
                              {label}
                            </Typography>
                            <Typography variant="h6">{value}</Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>

                  <Stack spacing={1.25}>
                    {[
                      ['WhatsApp', 'cena 25', 'Gasto registrado en comida'],
                      ['WhatsApp', '+ sueldo 3000', 'Ingreso registrado'],
                      ['Finance', 'Alerta', 'Tu presupuesto de delivery va al 82%'],
                    ].map(([source, text, detail]) => (
                      <Box
                        key={`${source}-${text}`}
                        sx={{
                          p: 1.5,
                          borderRadius: 1.5,
                          bgcolor: alpha(theme.palette.grey[500], 0.06),
                          border: `1px solid ${alpha(theme.palette.grey[500], 0.14)}`,
                        }}
                      >
                        <Stack direction="row" justifyContent="space-between" spacing={2}>
                          <Typography variant="subtitle2">{text}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {source}
                          </Typography>
                        </Stack>
                        <Typography variant="body2" color="text.secondary">
                          {detail}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </Stack>
              </Card>
            </Grid>
          </Grid>
        </Container>

        <Container maxWidth="lg" sx={{ pb: { xs: 5, md: 7 } }}>
          <AdSenseSlot
            slot={ADS_CONFIG.DASHBOARD_TOP_SLOT}
            minHeight={120}
            label="Publicidad"
          />
        </Container>

        <Box sx={{ bgcolor: 'common.white', borderTop: `1px solid ${alpha(theme.palette.grey[500], 0.12)}` }}>
          <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
            <Grid container spacing={3}>
              {FEATURES.map((feature) => (
                <Grid key={feature.title} size={{ xs: 12, md: 4 }}>
                  <Card sx={{ p: 3, height: '100%', borderRadius: '8px', boxShadow: 'none', border: `1px solid ${alpha(theme.palette.grey[500], 0.16)}` }}>
                    <Iconify icon={feature.icon} width={38} sx={{ mb: 2 }} />
                    <Typography variant="h5" sx={{ mb: 1 }}>
                      {feature.title}
                    </Typography>
                    <Typography color="text.secondary">{feature.description}</Typography>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        <Container maxWidth="md" sx={{ py: { xs: 6, md: 8 } }}>
          <Stack spacing={3}>
            <Typography variant="h2" sx={{ fontWeight: 900 }}>
              El control financiero falla cuando registrar gastos se vuelve una tarea pesada
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ fontSize: 18, lineHeight: 1.8 }}>
              Muchas personas empiezan el mes con una hoja de cálculo perfecta. Separan categorías, crean fórmulas,
              preparan colores y prometen actualizarla todos los días. Pero después llega la vida real: almuerzos,
              taxis, compras pequeñas, pagos por transferencia, delivery y gastos que se olvidan antes de llegar a casa.
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ fontSize: 18, lineHeight: 1.8 }}>
              Finance nace para reducir esa fricción. En vez de esperar a tener tiempo para abrir Excel, puedes registrar
              el movimiento en el momento desde WhatsApp. Luego, cuando quieras revisar tu situación, el dashboard ya
              tiene tus ingresos, gastos, categorías, presupuestos y alertas en un solo lugar.
            </Typography>

            <Stack spacing={1.5}>
              {ARTICLE_POINTS.map((point) => (
                <Stack key={point} direction="row" spacing={1.5}>
                  <Iconify icon="solar:check-circle-bold" width={24} sx={{ color: 'success.main', mt: 0.3 }} />
                  <Typography color="text.secondary" sx={{ fontSize: 17 }}>
                    {point}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Stack>
        </Container>

        <Container maxWidth="lg" sx={{ pb: { xs: 6, md: 8 } }}>
          <AdSenseSlot
            slot={ADS_CONFIG.DASHBOARD_BOTTOM_SLOT}
            minHeight={180}
            label="Publicidad"
          />
        </Container>

        <Box sx={{ bgcolor: '#0f172a', color: 'common.white' }}>
          <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
            <Grid container spacing={4} alignItems="center">
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="h2" sx={{ fontWeight: 900, mb: 2 }}>
                  Cómo funciona
                </Typography>
                <Typography sx={{ color: alpha('#ffffff', 0.72), fontSize: 18, lineHeight: 1.8 }}>
                  Finance no intenta complicarte la vida con más pantallas. Empieza con un mensaje simple, organiza tus
                  datos y te muestra una lectura clara para tomar mejores decisiones.
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Stack spacing={2}>
                  {[
                    ['1', 'Crea tu cuenta con tu número de WhatsApp.'],
                    ['2', 'Registra gastos o ingresos con mensajes cortos.'],
                    ['3', 'Revisa tu dashboard y ajusta tu presupuesto.'],
                  ].map(([step, text]) => (
                    <Stack key={step} direction="row" spacing={2} alignItems="center">
                      <Box
                        sx={{
                          width: 42,
                          height: 42,
                          display: 'grid',
                          borderRadius: 99,
                          placeItems: 'center',
                          bgcolor: 'primary.main',
                          fontWeight: 800,
                        }}
                      >
                        {step}
                      </Box>
                      <Typography sx={{ color: alpha('#ffffff', 0.84), fontSize: 17 }}>{text}</Typography>
                    </Stack>
                  ))}
                </Stack>
              </Grid>
            </Grid>
          </Container>
        </Box>

        <Container maxWidth="md" sx={{ py: { xs: 6, md: 8 } }}>
          <Typography variant="h2" sx={{ fontWeight: 900, mb: 3 }}>
            Preguntas frecuentes
          </Typography>
          <Stack spacing={2}>
            {FAQS.map((faq) => (
              <Card key={faq.question} sx={{ p: 3, borderRadius: '8px', boxShadow: 'none', border: `1px solid ${alpha(theme.palette.grey[500], 0.16)}` }}>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  {faq.question}
                </Typography>
                <Typography color="text.secondary">{faq.answer}</Typography>
              </Card>
            ))}
          </Stack>
        </Container>

        <Container maxWidth="lg" sx={{ pb: { xs: 6, md: 8 } }}>
          <Card
            sx={{
              p: { xs: 3, md: 5 },
              textAlign: 'center',
              borderRadius: '8px',
              bgcolor: '#e9f8ff',
              border: `1px solid ${alpha(theme.palette.primary.main, 0.18)}`,
              boxShadow: 'none',
            }}
          >
            <Typography variant="h3" sx={{ fontWeight: 900, mb: 1.5 }}>
              Deja que tus gastos se registren cuando ocurren
            </Typography>
            <Typography color="text.secondary" sx={{ maxWidth: 720, mx: 'auto', mb: 3 }}>
              Empieza con Finance y cambia la rutina de revisar tus finanzas solo cuando ya se te olvidó en qué gastaste.
            </Typography>
            <Button component={RouterLink} href="/sign-up" size="large" variant="contained">
              Crear mi cuenta
            </Button>
          </Card>
        </Container>
      </Box>

      <Box component="footer" sx={{ py: 3, bgcolor: 'common.white', borderTop: `1px solid ${alpha(theme.palette.grey[500], 0.14)}` }}>
        <Container maxWidth="lg">
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              © {new Date().getFullYear()} Finance. Control financiero simple para el día a día.
            </Typography>
            <Stack direction="row" spacing={2}>
              <Link component={RouterLink} href="/sign-in" color="text.secondary" underline="hover">
                Entrar
              </Link>
              <Link component={RouterLink} href="/sign-up" color="text.secondary" underline="hover">
                Registro
              </Link>
            </Stack>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}
