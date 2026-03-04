import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { useState, useCallback } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import FormControlLabel from '@mui/material/FormControlLabel';
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
  notify_daily_reminder: z.boolean(),
  notify_budget_warnings: z.boolean(),
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
      notify_daily_reminder: true,
      notify_budget_warnings: true,
    },
  });

  const currentPrefix = watch('phone_prefix');
  const notifyDaily = watch('notify_daily_reminder');
  const notifyBudget = watch('notify_budget_warnings');

  const onSubmit = useCallback(async (data: SignUpFormValues) => {
    try {
      const payload = {
        ...data,
        notify_daily_reminder: !!data.notify_daily_reminder,
        notify_budget_warnings: !!data.notify_budget_warnings,
      };
      registerUser(payload, {
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
                      transition: (theme) => theme.transitions.create(['box-shadow', 'background-color', 'border-color']),
                      '&:hover': {
                        bgcolor: 'background.paper',
                        '& .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.light' },
                      },
                      '&.Mui-focused': {
                        bgcolor: 'background.paper',
                        boxShadow: (theme) => `0 8px 16px 0 ${theme.palette.primary.main}12`,
                        '& .MuiOutlinedInput-notchedOutline': { borderWidth: 1, borderColor: 'primary.main' },
                      },
                      borderRadius: 2,
                      height: 56,
                    },
                    '& .MuiInputLabel-root': {
                      px: 0.5,
                      '&.Mui-focused': { color: 'primary.main' }
                    }
                  }}
                  slotProps={{
                    inputLabel: { shrink: true },
                    input: {
                      startAdornment: (
                        <InputAdornment position="start" sx={{ ml: 0.5, mr: 1 }}>
                          <Iconify icon="solar:user-bold" width={24} sx={{ color: 'text.disabled' }} />
                        </InputAdornment>
                      ),
                    },
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
                        borderRadius: 2,
                        '& .MuiOutlinedInput-notchedOutline': { borderColor: 'transparent' },
                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.light' },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main' },
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
                        transition: (theme) => theme.transitions.create(['box-shadow', 'background-color', 'border-color']),
                        '&:hover': {
                          bgcolor: 'background.paper',
                          '& .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.light' },
                        },
                        '&.Mui-focused': {
                          bgcolor: 'background.paper',
                          boxShadow: (theme) => `0 8px 16px 0 ${theme.palette.primary.main}12`,
                          '& .MuiOutlinedInput-notchedOutline': { borderWidth: 1, borderColor: 'primary.main' },
                        },
                        borderRadius: 2,
                        height: 56,
                      },
                      '& .MuiInputLabel-root': {
                        px: 0.5,
                        '&.Mui-focused': { color: 'primary.main' }
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
                </Box>

                <TextField
                  fullWidth
                  label="Contraseña"
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  sx={{ 
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      bgcolor: 'background.neutral',
                      transition: (theme) => theme.transitions.create(['box-shadow', 'background-color', 'border-color']),
                      '&:hover': {
                        bgcolor: 'background.paper',
                        '& .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.light' },
                      },
                      '&.Mui-focused': {
                        bgcolor: 'background.paper',
                        boxShadow: (theme) => `0 8px 16px 0 ${theme.palette.primary.main}12`,
                        '& .MuiOutlinedInput-notchedOutline': { borderWidth: 1, borderColor: 'primary.main' },
                      },
                      borderRadius: 2,
                      height: 56,
                    },
                    '& .MuiInputLabel-root': {
                      px: 0.5,
                      '&.Mui-focused': { color: 'primary.main' }
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

                <Box sx={{ mb: 2.5, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <FormControlLabel
                    control={
                      <Checkbox 
                        checked={notifyDaily}
                        onChange={(e) => setValue('notify_daily_reminder', e.target.checked)}
                        size="small"
                        sx={{ color: 'primary.main', '&.Mui-checked': { color: 'primary.main' } }}
                      />
                    }
                    label={
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Recibir recordatorios diarios por WhatsApp
                      </Typography>
                    }
                  />
                  <FormControlLabel
                    control={
                      <Checkbox 
                        checked={notifyBudget}
                        onChange={(e) => setValue('notify_budget_warnings', e.target.checked)}
                        size="small"
                        sx={{ color: 'primary.main', '&.Mui-checked': { color: 'primary.main' } }}
                      />
                    }
                    label={
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Alertas de presupuesto (Burn Rate)
                      </Typography>
                    }
                  />
                </Box>

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
                    borderRadius: 2,
                    boxShadow: (theme) => `0 8px 16px 0 ${theme.palette.primary.main}40`,
                    '&:hover': {
                      boxShadow: (theme) => `0 12px 20px 0 ${theme.palette.primary.main}60`,
                      transform: 'translateY(-2px)',
                    },
                    transition: (theme) => theme.transitions.create(['all']),
                  }}
                >
                  {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Registrarse'}
                </Button>
              </Box>
            </Box>
            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
              <BorderBeam size={250} duration={12} delay={9} />
            </Box>
          </Box>

          <Divider sx={{ my: 4, '&::before, &::after': { borderTopStyle: 'dashed' } }}>
            <Typography variant="overline" sx={{ color: 'text.disabled' }}>
              O registrarse con
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
