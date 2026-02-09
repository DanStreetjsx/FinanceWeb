import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { DashboardContent } from 'src/layouts/dashboard';
import { useAuthStatus, useUpdateProfile } from 'src/services/auth/AuthRepositoryHooks';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function ProfileView() {
  const { user } = useAuthStatus();
  const { updateProfile, isLoading, error } = useUpdateProfile();

  const [showPassword, setShowPassword] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone_number: user?.phone_number || '',
    phone_prefix: user?.phone_prefix || '51',
    password: '',
    password_confirmation: '',
  });

  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [field]: event.target.value });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    const requestData: any = {
      name: formData.name,
      phone_number: formData.phone_number,
      phone_prefix: formData.phone_prefix,
    };

    if (formData.password) {
      if (formData.password !== formData.password_confirmation) {
        setNotification({ open: true, message: 'Las contraseñas no coinciden', severity: 'error' });
        return;
      }
      requestData.password = formData.password;
      requestData.password_confirmation = formData.password_confirmation;
    }

    updateProfile(requestData, {
      onSuccess: () => {
        setNotification({ open: true, message: 'Perfil actualizado correctamente', severity: 'success' });
        setFormData({ ...formData, password: '', password_confirmation: '' });
      },
    });
  };

  return (
    <DashboardContent>
      <Typography variant="h4" sx={{ mb: 5 }}>
        Mi Perfil
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ p: 3, textAlign: 'center' }}>
            <Box
              sx={{
                width: 120,
                height: 120,
                margin: 'auto',
                borderRadius: '50%',
                bgcolor: 'primary.lighter',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2,
              }}
            >
              <Typography variant="h2" color="primary.main">
                {user?.name?.charAt(0).toUpperCase()}
              </Typography>
            </Box>
            <Typography variant="h6">{user?.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              +{user?.phone_prefix}{user?.phone_number}
            </Typography>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ p: 3 }}>
            <form onSubmit={handleSubmit}>
              <Stack spacing={3}>
                {error && <Alert severity="error">{error}</Alert>}

                <Typography variant="subtitle1">Información Personal</Typography>
                
                <TextField
                  fullWidth
                  label="Nombre Completo"
                  value={formData.name}
                  onChange={handleChange('name')}
                />

                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField
                    sx={{ width: 100 }}
                    label="Prefijo"
                    value={formData.phone_prefix}
                    onChange={handleChange('phone_prefix')}
                  />
                  <TextField
                    fullWidth
                    label="Número de Teléfono"
                    value={formData.phone_number}
                    onChange={handleChange('phone_number')}
                  />
                </Box>

                <Typography variant="subtitle1" sx={{ mt: 3 }}>
                  Seguridad (Opcional)
                </Typography>

                <TextField
                  fullWidth
                  type={showPassword ? 'text' : 'password'}
                  label="Nueva Contraseña"
                  value={formData.password}
                  onChange={handleChange('password')}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                          <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  type={showPassword ? 'text' : 'password'}
                  label="Confirmar Contraseña"
                  value={formData.password_confirmation}
                  onChange={handleChange('password_confirmation')}
                />

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                  <LoadingButton
                    type="submit"
                    variant="contained"
                    loading={isLoading}
                  >
                    Guardar Cambios
                  </LoadingButton>
                </Box>
              </Stack>
            </form>
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
