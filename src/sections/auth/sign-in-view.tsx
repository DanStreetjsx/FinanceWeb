import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { useState, useCallback } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import FormControlLabel from '@mui/material/FormControlLabel';
import CircularProgress from '@mui/material/CircularProgress';

import { useRouter } from 'src/routes/hooks';

import { useLogin } from 'src/services/auth/AuthRepositoryHooks';

import { Logo } from 'src/components/logo';
import { Iconify } from 'src/components/iconify';

import RetroGrid from '../../components/magicui/RetroGrid';
import { BorderBeam } from '../../components/magicui/BorderBeam';
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
  const [loginSuccess, setLoginSuccess] = useState(false);
  const { login, isLoading, error } = useLogin();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      phone_number: '',
      password: '',
      rememberMe: true,
    },
  });

  const rememberMe = watch('rememberMe');

  const onSubmit = useCallback(async (data: LoginFormValues) => {
    login({
      phone_number: data.phone_number,
      password: data.password,
      rememberMe: data.rememberMe
    }, {
      onSuccess: (response) => {
        if (response.status === 'success') {
          setLoginSuccess(true);
          setTimeout(() => {
            router.push('/dashboard');
          }, 1000);
        }
      }
    });
  }, [login, router]);

  const renderForm = (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
      }}
    >
      {!!error && (
        <Alert severity="error" sx={{ mb: 3, width: '100%' }}>
          {error}
        </Alert>
      )}

      {loginSuccess && (
        <Alert severity="success" sx={{ mb: 3, width: '100%' }}>
          ¡Bienvenido de nuevo! Redirigiendo...
        </Alert>
      )}

      <TextField
        fullWidth
        label="Número de Teléfono"
        placeholder="Ej: 983171622 "
        {...register('phone_number')}
        error={!!errors.phone_number}
        helperText={errors.phone_number?.message}
        sx={{ 
          mb: 2.5,
          '& .MuiOutlinedInput-root': {
            bgcolor: 'background.neutral',
            transition: (theme) => theme.transitions.create(['box-shadow', 'background-color', 'border-color']),
            '&:hover': {
              bgcolor: 'background.paper',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'primary.light',
              },
            },
            '&.Mui-focused': {
              bgcolor: 'background.paper',
              boxShadow: (theme) => `0 8px 16px 0 ${theme.palette.primary.main}12`,
              '& .MuiOutlinedInput-notchedOutline': {
                borderWidth: 1,
                borderColor: 'primary.main',
              },
            },
            borderRadius: 2,
            height: 56,
          },
          '& .MuiInputLabel-root': {
            px: 0.5,
            '&.Mui-focused': {
              color: 'primary.main',
            }
          }
        }}
        slotProps={{
          inputLabel: { shrink: true },
          input: {
            startAdornment: (
              <InputAdornment position="start" sx={{ ml: 0.5, mr: 1 }}>
                <Iconify icon="solar:phone-bold" width={24} sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          },
        }}
      />

      <TextField
        fullWidth
        label="Contraseña"
        type={showPassword ? 'text' : 'password'}
        {...register('password')}
        error={!!errors.password}
        helperText={errors.password?.message}
        sx={{ 
          mb: 1.5,
          '& .MuiOutlinedInput-root': {
            bgcolor: 'background.neutral',
            transition: (theme) => theme.transitions.create(['box-shadow', 'background-color', 'border-color']),
            '&:hover': {
              bgcolor: 'background.paper',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'primary.light',
              },
            },
            '&.Mui-focused': {
              bgcolor: 'background.paper',
              boxShadow: (theme) => `0 8px 16px 0 ${theme.palette.primary.main}12`,
              '& .MuiOutlinedInput-notchedOutline': {
                borderWidth: 1,
                borderColor: 'primary.main',
              },
            },
            borderRadius: 2,
            height: 56,
          },
          '& .MuiInputLabel-root': {
            px: 0.5,
            '&.Mui-focused': {
              color: 'primary.main',
            }
          }
        }}
        slotProps={{
          inputLabel: { shrink: true },
          input: {
            startAdornment: (
              <InputAdornment position="start" sx={{ ml: 0.5, mr: 1 }}>
                <Iconify icon="solar:lock-password-bold" width={24} sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" sx={{ mr: 0.5 }}>
                  <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} width={20} />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />

      <Box sx={{ mb: 2, width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <FormControlLabel
          control={
            <Checkbox 
              checked={rememberMe}
              onChange={(e) => setValue('rememberMe', e.target.checked)}
              size="small"
            />
          }
          label={
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Recordar contraseña
            </Typography>
          }
        />
        <Link variant="body2" color="inherit" sx={{ fontWeight: 600, cursor: 'pointer' }}>
          ¿Olvidaste tu contraseña?
        </Link>
      </Box>

      <Button
        fullWidth
        size="large"
        type="submit"
        color="primary"
        variant="contained"
        disabled={isLoading}
        sx={{ 
          position: 'relative',
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
        {isLoading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          'Iniciar sesión'
        )}
      </Button>
    </Box>
  );

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        bgcolor: 'background.paper',
        overflow: { xs: 'auto', md: 'hidden' },
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
          justifyContent: { xs: 'flex-start', md: 'center' },
          position: 'relative',
          p: { xs: 4, md: 5 },
          pt: { xs: 8, md: 5 },
          textAlign: 'center',
          minHeight: { xs: '240px', md: '100%' },
        }}
      >
        <RetroGrid className="opacity-20" />
        
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Logo
            isSingle
            sx={{
              width: { xs: 80, md: 120 },
              height: { xs: 80, md: 120 },
              mb: { xs: 2, md: 3 },
              filter: 'drop-shadow(0px 4px 20px rgba(0,0,0,0.2))',
              '& img': { width: '100%', height: '100%' }
            }}
          />
          <Typography variant="h2" sx={{ fontWeight: 800, mb: 1, letterSpacing: -1, display: { xs: 'none', md: 'block' } }}>
            Finance
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.8, maxWidth: 360, mx: 'auto', lineHeight: 1.6, display: { xs: 'none', md: 'block' } }}>
            Gestiona tus finanzas de manera inteligente con IA y automatización desde WhatsApp.
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
      </Box>

      {/* Right Side - Form Section */}
      <Box
        sx={{
          flex: { xs: '1 1 auto', md: '1 1 55%' },
          display: 'flex',
          alignItems: { xs: 'flex-start', md: 'center' },
          justifyContent: 'center',
          p: { xs: 0, md: 8 },
          bgcolor: { xs: 'transparent', md: 'background.paper' },
          position: 'relative',
          mt: { xs: -6, md: 0 },
          zIndex: 3,
        }}
      >
        <Box 
          sx={{ 
            width: '100%', 
            maxWidth: 420,
            bgcolor: 'background.paper',
            borderRadius: { xs: '32px 32px 0 0', md: 0 },
            p: { xs: 4, md: 0 },
            minHeight: { xs: 'calc(100vh - 180px)', md: 'auto' },
            boxShadow: { xs: '0 -10px 40px rgba(0,0,0,0.1)', md: 'none' },
          }}
        >
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography variant="h3" sx={{ fontWeight: 800, letterSpacing: -1, mb: 1 }}>
              ¡Hola de nuevo!
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              ¿No tienes cuenta?{' '}
              <Link
                variant="subtitle2"
                sx={{ cursor: 'pointer', color: 'primary.main', fontWeight: 700 }}
                onClick={() => router.push('/sign-up')}
              >
                Regístrate ahora
              </Link>
            </Typography>
          </Box>

          <Box
            sx={{
              position: 'relative',
              p: { xs: 0, md: 1 },
              borderRadius: 3,
              bgcolor: { xs: 'transparent', md: 'background.neutral' },
              boxShadow: (theme) => ({
                xs: 'none',
                md: `
                  inset 0 1px 1px ${theme.palette.common.white},
                  0 10px 20px -10px ${theme.palette.primary.main}40,
                  0 2px 5px rgba(0,0,0,0.05)
                `
              }),
            }}
          >
            <Box
              sx={{
                p: { xs: 0, md: 3 },
                borderRadius: 2.5,
                bgcolor: 'background.paper',
                boxShadow: (theme) => ({ xs: 'none', md: theme.customShadows.z12 }),
              }}
            >
              {renderForm}
            </Box>
            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
              <BorderBeam size={250} duration={12} delay={9} />
            </Box>
          </Box>

          <Divider sx={{ my: 4, '&::before, &::after': { borderTopStyle: 'dashed' } }}>
            <Typography variant="overline" sx={{ color: 'text.disabled' }}>
              O continuar con
            </Typography>
          </Divider>

          <Box sx={{ gap: 3, display: 'flex', justifyContent: 'center' }}>
            <IconButton
              sx={{
                width: 48,
                height: 48,
                color: '#DB4437',
                border: (theme) => `1px solid ${theme.palette.divider}`,
                '&:hover': { bgcolor: 'rgba(219, 68, 55, 0.04)', borderColor: '#DB4437' }
              }}
            >
              <Iconify width={24} icon="socials:google" />
            </IconButton>
            <IconButton
              sx={{
                width: 48,
                height: 48,
                color: '#1877F2',
                border: (theme) => `1px solid ${theme.palette.divider}`,
                '&:hover': { bgcolor: 'rgba(24, 119, 242, 0.04)', borderColor: '#1877F2' }
              }}
            >
              <Iconify width={24} icon="socials:facebook" />
            </IconButton>
            <IconButton
              sx={{
                width: 48,
                height: 48,
                color: '#000000',
                border: (theme) => `1px solid ${theme.palette.divider}`,
                '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)', borderColor: '#000000' }
              }}
            >
              <Iconify width={24} icon="logos:apple" />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </Box>
  );

}
