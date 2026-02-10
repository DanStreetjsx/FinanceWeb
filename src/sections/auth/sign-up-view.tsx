import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { useState, useCallback } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';

import { useRouter } from 'src/routes/hooks';

import { useRegister } from 'src/services/auth/AuthRepositoryHooks';

import { Logo } from 'src/components/logo';
import { Iconify } from 'src/components/iconify';

import RetroGrid from '../../components/magicui/RetroGrid';
import { BorderBeam } from '../../components/magicui/BorderBeam';
import SparklesText from '../../components/magicui/SparklesText';

// ----------------------------------------------------------------------

const COUNTRY_CODES = [
  { code: '51', label: '🇵🇪 +51' },
  { code: '1', label: '🇺🇸 +1' },
  { code: '52', label: '🇲🇽 +52' },
  { code: '54', label: '🇦🇷 +54' },
  { code: '56', label: '🇨🇱 +56' },
  { code: '57', label: '🇨🇴 +57' },
  { code: '34', label: '🇪🇸 +34' },
];

const SignUpFormSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  phone_prefix: z.string().min(1, 'Código es requerido'),
  phone_number: z.string().min(9, 'El número de teléfono debe tener al menos 9 dígitos'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

type SignUpFormValues = z.infer<typeof SignUpFormSchema>;

export function SignUpView() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const { register: registerUser, isLoading, error } = useRegister();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(SignUpFormSchema),
    defaultValues: {
      name: '',
      phone_prefix: '51',
      phone_number: '',
      password: '',
    },
  });

  const currentPrefix = watch('phone_prefix');

  const onSubmit = useCallback(async (data: SignUpFormValues) => {
    try {
      registerUser(data, {
        onSuccess: (res) => {
          if (res.status === 'success') {
            router.push('/sign-in');
          }
        }
      });
    } catch (err) {
      console.error('Error al intentar registrarse:', err);
    }
  }, [registerUser, router]);

  return (
    <>
      <RetroGrid className="fixed inset-0 z-0" />

      <Box sx={{ mb: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 1 }}>
        <Logo sx={{ mb: 2 }} />
        
        <SparklesText 
          text="Crea tu cuenta" 
          className="text-2xl font-bold tracking-tight"
        />
        
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
          ¿Ya tienes cuenta?
          <Link variant="subtitle2" sx={{ ml: 0.5, cursor: 'pointer' }} onClick={() => router.push('/sign-in')}>
            Inicia sesión
          </Link>
        </Typography>
      </Box>

      <Box 
        sx={{ 
          p: 4, 
          borderRadius: 2, 
          bgcolor: 'background.paper',
          boxShadow: (theme) => theme.customShadows.z8,
          position: 'relative',
          zIndex: 1,
          overflow: 'hidden',
          border: (theme) => `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          {!!error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

          <TextField
            fullWidth
            label="Nombre completo"
            {...register('name')}
            error={!!errors.name}
            helperText={errors.name?.message}
            sx={{ mb: 3 }}
          />

          <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
            <FormControl sx={{ minWidth: 100 }}>
              <Select
                value={currentPrefix}
                onChange={(e) => setValue('phone_prefix', e.target.value as string)}
                sx={{ height: 56 }}
              >
                {COUNTRY_CODES.map((country) => (
                  <MenuItem key={country.code} value={country.code}>{country.label}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Número de Teléfono"
              {...register('phone_number')}
              error={!!errors.phone_number}
              helperText={errors.phone_number?.message}
            />
          </Box>

          <TextField
            fullWidth
            label="Contraseña"
            type={showPassword ? 'text' : 'password'}
            {...register('password')}
            error={!!errors.password}
            helperText={errors.password?.message}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ mb: 3 }}
          />

          <Button
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            color="inherit"
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : 'Registrarse'}
          </Button>
        </Box>
        <BorderBeam size={250} duration={12} delay={9} />
      </Box>
    </>
  );
}
