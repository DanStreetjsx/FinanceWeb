import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { useState, useCallback } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
// 2. Importaciones de Material-UI (mui)
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';

// 3. Importaciones de rutas (routes)
import { useRouter } from 'src/routes/hooks';

// 4. Importaciones de servicios/auth (auth)
import { useLogin } from 'src/services/auth/AuthRepositoryHooks';

// 5. Importaciones de componentes (components)
import { Iconify } from 'src/components/iconify'
// ----------------------------------------------------------------------

// Esquema de validación con Zod
const LoginFormSchema = z.object({
  phone_number: z.string().min(9, 'El número de teléfono debe tener al menos 9 dígitos').min(1, 'Número de teléfono es requerido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  rememberMe: z.boolean().optional()
});

type LoginFormValues = z.infer<typeof LoginFormSchema>;

export function SignInView() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, error } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      phone_number: '',
      password: '',
      rememberMe: true,
    },
  });

  const onSubmit = useCallback(async (data: LoginFormValues) => {
    try {
      login({
        phone_number: data.phone_number,
        password: data.password,
        rememberMe: data.rememberMe
      }, {
        onSuccess: (response) => {
          if (response.status === 'success') {
            console.log('Login exitoso, redirigiendo a dashboard');
            router.push('/dashboard');
          } else {
            console.error('Error en respuesta de login:', response.message);
          }
        }
      });
    } catch (err) {
      console.error('Error en el login:', err);
    }
  }, [login, router]);

  const renderForm = (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        display: 'flex',
        alignItems: 'flex-end',
        flexDirection: 'column',
      }}
    >
      {!!error && (
        <Alert severity="error" sx={{ mb: 3, width: '100%' }}>
          {error}
        </Alert>
      )}

      <TextField
        fullWidth
        label="Número de Teléfono"
        placeholder="Ej: 908123564"
        {...register('phone_number')}
        error={!!errors.phone_number}
        helperText={errors.phone_number?.message}
        sx={{ mb: 3 }}
        slotProps={{
          inputLabel: { shrink: true },
        }}
      />

      <Link variant="body2" color="inherit" sx={{ mb: 1.5 }}>
        ¿Olvidaste tu contraseña?
      </Link>

      <TextField
        fullWidth
        label="Contraseña"
        type={showPassword ? 'text' : 'password'}
        {...register('password')}
        error={!!errors.password}
        helperText={errors.password?.message}
        slotProps={{
          inputLabel: { shrink: true },
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
        sx={{ mb: 3 }}
      />

      <Button
        fullWidth
        size="large"
        type="submit"
        color="inherit"
        variant="contained"
        disabled={isLoading}
        sx={{ position: 'relative' }}
      >
        {isLoading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          'Iniciar sesión'
        )}
      </Button>
    </Box>
  );

  return (
    <>
      <Box sx={{ mb: 5, textAlign: 'center' }}>
        <Typography variant="h5">Inicia sesión en Finance</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
          ¿No tienes cuenta?
          <Link variant="subtitle2" sx={{ ml: 0.5, cursor: 'pointer' }} onClick={() => router.push('/sign-up')}>
            Regístrate
          </Link>
        </Typography>
      </Box>

      {renderForm}
      <Divider sx={{ my: 3, '&::before, &::after': { borderTopStyle: 'dashed' } }}>
        <Typography
          variant="overline"
          sx={{ color: 'text.secondary', fontWeight: 'fontWeightMedium' }}
        >
          O
        </Typography>
      </Divider>
      <Box
        sx={{
          gap: 1,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <IconButton color="inherit">
          <Iconify width={22} icon="socials:google" />
        </IconButton>
        <IconButton color="inherit">
          <Iconify width={22} icon="socials:github" />
        </IconButton>
        <IconButton color="inherit">
          <Iconify width={22} icon="socials:twitter" />
        </IconButton>
      </Box>
    </>
  );
}
