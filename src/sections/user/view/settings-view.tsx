import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Snackbar from '@mui/material/Snackbar';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import FormControlLabel from '@mui/material/FormControlLabel';

import { DashboardContent } from 'src/layouts/dashboard';
import { useSettings, useUpdateSettings } from 'src/services/configuracion/ConfiguracionRepositoryHooks';

// ----------------------------------------------------------------------

const CURRENCIES = [
  { value: 'PEN', label: 'Soles (S/)' },
  { value: 'USD', label: 'Dólares ($)' },
  { value: 'EUR', label: 'Euros (€)' },
];

const LOCALES = [
  { value: 'es-PE', label: 'Español (Perú)' },
  { value: 'en-US', label: 'English (US)' },
];

const DAYS_OF_WEEK = [
  { value: 0, label: 'Domingo' },
  { value: 1, label: 'Lunes' },
  { value: 2, label: 'Martes' },
  { value: 3, label: 'Miércoles' },
  { value: 4, label: 'Jueves' },
  { value: 5, label: 'Viernes' },
  { value: 6, label: 'Sábado' },
];

type SettingsFormData = {
  default_currency: string;
  locale: string;
  start_of_week: number;
  phone_prefix: string;
  notify_daily_reminder: boolean;
  notify_budget_warnings: boolean;
};

type FormChangeEvent = {
  target: {
    type?: string;
    value: string | number;
    checked?: boolean;
  };
};

export function SettingsView() {
  const { data: settings, isLoading: settingsLoading } = useSettings();
  const { mutate: updateSettings, isPending: updating } = useUpdateSettings();

  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [formData, setFormData] = useState<SettingsFormData>({
    default_currency: 'PEN',
    locale: 'es-PE',
    start_of_week: 1,
    phone_prefix: '51',
    notify_daily_reminder: true,
    notify_budget_warnings: true,
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        default_currency: settings.default_currency,
        locale: settings.locale,
        start_of_week: settings.start_of_week,
        phone_prefix: settings.phone_prefix || '51',
        notify_daily_reminder: settings.notify_daily_reminder,
        notify_budget_warnings: settings.notify_budget_warnings,
      });
    }
  }, [settings]);

  const handleChange = <K extends keyof SettingsFormData>(field: K) => (event: FormChangeEvent) => {
    const value = (event.target.type === 'checkbox' ? event.target.checked : event.target.value) as SettingsFormData[K];
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    updateSettings(formData, {
      onSuccess: () => {
        setNotification({ open: true, message: 'Configuraciones guardadas', severity: 'success' });
      },
      onError: () => {
        setNotification({ open: true, message: 'Error al guardar configuraciones', severity: 'error' });
      }
    });
  };

  return (
    <DashboardContent>
      <Typography variant="h4" sx={{ mb: 5 }}>
        Configuraciones
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <Typography variant="h6">Preferencias Generales</Typography>
              
              <TextField
                select
                fullWidth
                label="Moneda Predeterminada"
                value={formData.default_currency}
                onChange={handleChange('default_currency')}
              >
                {CURRENCIES.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                fullWidth
                label="Idioma / Región"
                value={formData.locale}
                onChange={handleChange('locale')}
              >
                {LOCALES.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                fullWidth
                label="Inicio de Semana"
                value={formData.start_of_week}
                onChange={handleChange('start_of_week')}
              >
                {DAYS_OF_WEEK.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>

              <Divider />

              <Typography variant="h6">Notificaciones</Typography>
              
              <FormControlLabel
                control={
                  <Switch 
                    checked={formData.notify_daily_reminder} 
                    onChange={handleChange('notify_daily_reminder')} 
                  />
                }
                label="Recordatorios diarios (WhatsApp)"
              />
              <FormControlLabel
                control={
                  <Switch 
                    checked={formData.notify_budget_warnings} 
                    onChange={handleChange('notify_budget_warnings')} 
                  />
                }
                label="Alertas de presupuesto excedido"
              />

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                <LoadingButton
                  variant="contained"
                  onClick={handleSave}
                  loading={updating || settingsLoading}
                >
                  Guardar Configuraciones
                </LoadingButton>
              </Box>
            </Stack>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ p: 3, bgcolor: 'primary.lighter' }}>
            <Stack spacing={2}>
              <Typography variant="h6" color="primary.darker">Configuración de WhatsApp</Typography>
              <Typography variant="body2" color="primary.darker">
                Para recibir notificaciones y registrar gastos por WhatsApp, asegúrate de tener configurado tu prefijo de país correctamente.
              </Typography>
              <TextField
                label="Prefijo de País"
                value={formData.phone_prefix}
                onChange={handleChange('phone_prefix')}
                sx={{ bgcolor: 'background.paper', borderRadius: 1 }}
              />
              <Typography variant="caption" color="primary.darker">
                * Prefijo actual configurado: +{formData.phone_prefix}
              </Typography>
            </Stack>
          </Card>
        </Grid>
      </Grid>

      <Snackbar
        open={notification.open}
        autoHideDuration={3000}
        onClose={() => setNotification({ ...notification, open: false })}
        message={notification.message}
      />
    </DashboardContent>
  );
}
