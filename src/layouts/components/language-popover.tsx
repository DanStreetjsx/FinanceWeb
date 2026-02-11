import type { IconButtonProps } from '@mui/material/IconButton';

import { usePopover } from 'minimal-shared/hooks';

import Popover from '@mui/material/Popover';
import MenuList from '@mui/material/MenuList';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';

import { useAuthStatus } from 'src/services/auth/AuthRepositoryHooks';

// ----------------------------------------------------------------------

const COUNTRY_OPTIONS = [
  { value: '51', label: 'Perú', icon: '🇵🇪' },
  { value: '1', label: 'USA', icon: '🇺🇸' },
  { value: '52', label: 'México', icon: '🇲🇽' },
  { value: '54', label: 'Argentina', icon: '🇦🇷' },
  { value: '56', label: 'Chile', icon: '🇨🇱' },
  { value: '57', label: 'Colombia', icon: '🇨🇴' },
  { value: '34', label: 'España', icon: '🇪🇸' },
];

export function LanguagePopover({ sx, ...other }: IconButtonProps) {
  const { user } = useAuthStatus();
  const { open, anchorEl, onClose, onOpen } = usePopover();

  const currentCountry = COUNTRY_OPTIONS.find((c) => c.value === user?.phone_prefix) || COUNTRY_OPTIONS[0];

  const renderFlag = (icon: string) => (
    <Typography variant="h4" sx={{ lineHeight: 1 }}>
      {icon}
    </Typography>
  );

  return (
    <>
      <IconButton
        onClick={onOpen}
        sx={[
          (theme) => ({
            p: 0,
            width: 40,
            height: 40,
            ...(open && { bgcolor: theme.vars.palette.action.selected }),
          }),
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
        {...other}
      >
        {renderFlag(currentCountry.icon)}
      </IconButton>

      <Popover
        open={!!open}
        anchorEl={anchorEl}
        onClose={onClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuList
          sx={{
            p: 0.5,
            gap: 0.5,
            width: 160,
            display: 'flex',
            flexDirection: 'column',
            [`& .${menuItemClasses.root}`]: {
              px: 1,
              gap: 2,
              borderRadius: 0.75,
            },
          }}
        >
          {COUNTRY_OPTIONS.map((option) => (
            <MenuItem
              key={option.value}
              selected={option.value === currentCountry.value}
              onClick={onClose}
              disabled
            >
              <Typography variant="h5">{option.icon}</Typography>
              {option.label}
            </MenuItem>
          ))}
        </MenuList>
      </Popover>
    </>
  );
}
