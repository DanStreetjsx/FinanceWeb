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
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        bgcolor: 'background.paper',
        overflow: 'hidden',
        position: 'fixed',
        inset: 0,
        zIndex: 1100,
      }}
    >
      {/* Left Side - Brand Section */}
      <Box
        sx={{
          flex: { xs: '0 0 auto', md: '1 1 45%' },
          background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: 'common.white',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          p: 5,
          textAlign: 'center',
          minHeight: { xs: '300px', md: '100%' },
        }}
      >
        <RetroGrid className="opacity-20" />
        
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Logo
            isSingle
            sx={{
              width: 120,
              height: 120,
              mb: 3,
              filter: 'drop-shadow(0px 4px 20px rgba(0,0,0,0.2))',
              '& img': { width: '100%', height: '100%' }
            }}
          />
          <Typography variant="h2" sx={{ fontWeight: 800, mb: 2, letterSpacing: -1 }}>
            Finance
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.8, maxWidth: 360, mx: 'auto', lineHeight: 1.6 }}>
            Únete a la nueva era de la gestión financiera personal. Fácil, rápido y seguro.
          </Typography>
        </Box>

        {/* Cloud/Wave Separator (Visible only on desktop) */}
        <Box
          sx={{
            display: { xs: 'none', md: 'block' },
            position: 'absolute',
            right: -2,
            top: 0,
            bottom: 0,
            width: 100,
            zIndex: 2,
            pointerEvents: 'none',
          }}
        >
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 100 800"
            preserveAspectRatio="none"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 0C30 100 70 150 70 250C70 350 30 450 30 550C30 650 70 700 70 800H100V0H0Z"
              fill="white"
            />
          </svg>
        </Box>
        
        {/* Mobile Wave Separator */}
        <Box
          sx={{
            display: { xs: 'block', md: 'none' },
            position: 'absolute',
            bottom: -1,
            left: 0,
            right: 0,
            height: 60,
            zIndex: 2,
            pointerEvents: 'none',
          }}
        >
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 400 60"
            preserveAspectRatio="none"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 60C100 40 150 0 250 0C350 0 400 40 400 60H0Z"
              fill="white"
            />
          </svg>
        </Box>
      </Box>

      {/* Right Side - Form Section */}
      <Box
        sx={{
          flex: { xs: '1 1 auto', md: '1 1 55%' },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: { xs: 3, md: 8 },
          bgcolor: 'background.paper',
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 420 }}>
          <Box sx={{ mb: 5, textAlign: 'center' }}>
            <Typography variant="h3" sx={{ fontWeight: 800, letterSpacing: -1, mb: 1 }}>
              Crea tu cuenta
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              ¿Ya tienes cuenta?{' '}
              <Link
                variant="subtitle2"
                sx={{ cursor: 'pointer', color: 'primary.main', fontWeight: 700 }}
                onClick={() => router.push('/sign-in')}
              >
                Inicia sesión
              </Link>
            </Typography>
          </Box>

          <Box
            sx={{
              position: 'relative',
              p: 1,
              borderRadius: 3,
              bgcolor: 'background.neutral',
              boxShadow: (theme) => `
                inset 0 1px 1px ${theme.palette.common.white},
                0 10px 20px -10px ${theme.palette.primary.main}40,
                0 2px 5px rgba(0,0,0,0.05)
              `,
            }}
          >
            <Box
              sx={{
                p: 3,
                borderRadius: 2.5,
                bgcolor: 'background.paper',
                boxShadow: (theme) => theme.customShadows.z12,
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
                  sx={{ 
                    mb: 2.5,
                    '& .MuiOutlinedInput-root': {
                      bgcolor: 'background.neutral',
                      transition: (theme) => theme.transitions.create(['box-shadow', 'background-color']),
                      '&:hover': { bgcolor: 'background.paper' },
                      '&.Mui-focused': {
                        bgcolor: 'background.paper',
                        boxShadow: (theme) => `0 0 0 2px ${theme.palette.primary.main}20`,
                      },
                      borderRadius: 1.5,
                    }
                  }}
                />

                <Box sx={{ display: 'flex', gap: 1, mb: 2.5 }}>
                  <FormControl sx={{ minWidth: 100 }}>
                    <Select
                      value={currentPrefix}
                      onChange={(e) => setValue('phone_prefix', e.target.value as string)}
                      sx={{ 
                        height: 56,
                        bgcolor: 'background.neutral',
                        borderRadius: 1.5,
                      }}
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
                    sx={{ 
                      '& .MuiOutlinedInput-root': {
                        bgcolor: 'background.neutral',
                        transition: (theme) => theme.transitions.create(['box-shadow', 'background-color']),
                        '&:hover': { bgcolor: 'background.paper' },
                        '&.Mui-focused': {
                          bgcolor: 'background.paper',
                          boxShadow: (theme) => `0 0 0 2px ${theme.palette.primary.main}20`,
                        },
                        borderRadius: 1.5,
                      }
                    }}
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
                  sx={{ 
                    mb: 3,
                    '& .MuiOutlinedInput-root': {
                      bgcolor: 'background.neutral',
                      transition: (theme) => theme.transitions.create(['box-shadow', 'background-color']),
                      '&:hover': { bgcolor: 'background.paper' },
                      '&.Mui-focused': {
                        bgcolor: 'background.paper',
                        boxShadow: (theme) => `0 0 0 2px ${theme.palette.primary.main}20`,
                      },
                      borderRadius: 1.5,
                    }
                  }}
                />

                <Button
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isLoading}
                  sx={{ 
                    py: 1.5, 
                    fontSize: '1rem', 
                    fontWeight: 700,
                    borderRadius: 1.5,
                    boxShadow: (theme) => `0 8px 16px 0 ${theme.palette.primary.main}40`,
                    '&:hover': {
                      boxShadow: (theme) => `0 12px 20px 0 ${theme.palette.primary.main}60`,
                      transform: 'translateY(-2px)',
                    },
                    transition: (theme) => theme.transitions.create(['all']),
                  }}
                >
                  {isLoading ? <CircularProgress size={24} /> : 'Registrarse'}
                </Button>
              </Box>
            </Box>
            <BorderBeam size={250} duration={12} delay={9} />
          </Box>
        </Box>
      </Box>
    </Box>
  );

}
