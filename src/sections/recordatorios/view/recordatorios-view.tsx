import type { Reminder } from 'src/services/recordatorios/RecordatoriosRepository';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Switch from '@mui/material/Switch';
import TableRow from '@mui/material/TableRow';
import Snackbar from '@mui/material/Snackbar';
import MenuItem from '@mui/material/MenuItem';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TableContainer from '@mui/material/TableContainer';
import CircularProgress from '@mui/material/CircularProgress';
import FormControlLabel from '@mui/material/FormControlLabel';

import { fDate } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';

import { ADS_CONFIG } from 'src/config/ads-config';
import { DashboardContent } from 'src/layouts/dashboard';
import { 
  useReminders, 
  useCreateReminder, 
  useUpdateReminder, 
  useDeleteReminder 
} from 'src/services/recordatorios/RecordatoriosRepositoryHooks';

import { Iconify } from 'src/components/iconify';
import { AdSenseSlot } from 'src/components/ads';

// ----------------------------------------------------------------------

type ReminderForm = {
  title: string;
  amount: string;
  due_date: string;
  frequency: 'once' | 'weekly' | 'monthly';
  is_completed: boolean;
};

type NotificationState = { open: boolean; message: string; severity: 'success' | 'error' };

export function RecordatoriosView() {
  const { data: reminders, isLoading } = useReminders();
  
  const createReminder = useCreateReminder();
  const updateReminder = useUpdateReminder();
  const deleteReminder = useDeleteReminder();

  const [openDialog, setOpenDialog] = useState(false);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);
  const [form, setForm] = useState<ReminderForm>({
    title: '',
    amount: '',
    due_date: '',
    frequency: 'once',
    is_completed: false
  });
  const [notification, setNotification] = useState<NotificationState>({ open: false, message: '', severity: 'success' });

  const handleOpenDialog = (reminder?: Reminder) => {
    if (reminder) {
      setEditingReminder(reminder);
      setForm({
        title: reminder.title,
        amount: reminder.amount?.toString() || '',
        due_date: reminder.due_date.split('T')[0],
        frequency: reminder.frequency || 'once',
        is_completed: reminder.is_completed ?? false
      });
    } else {
      setEditingReminder(null);
      setForm({
        title: '',
        amount: '',
        due_date: '',
        frequency: 'once',
        is_completed: false
      });
    }
    setOpenDialog(true);
  };

  const handleSave = () => {
    if (!form.title || !form.due_date) {
      setNotification({ open: true, message: 'Título y fecha son obligatorios', severity: 'error' });
      return;
    }

    const data = {
      title: form.title,
      amount: parseFloat(form.amount) || 0,
      due_date: form.due_date,
      frequency: form.frequency,
      is_completed: form.is_completed
    };

    if (editingReminder) {
      updateReminder.mutate({
        id: editingReminder.id,
        data
      }, {
        onSuccess: () => {
          setNotification({ open: true, message: 'Recordatorio actualizado', severity: 'success' });
          setOpenDialog(false);
        }
      });
    } else {
      createReminder.mutate(data, {
        onSuccess: () => {
          setNotification({ open: true, message: 'Recordatorio creado', severity: 'success' });
          setOpenDialog(false);
        }
      });
    }
  };

  const handleDelete = (id: number) => {
    if (confirm('¿Estás seguro de eliminar este recordatorio?')) {
      deleteReminder.mutate(id, {
        onSuccess: () => {
          setNotification({ open: true, message: 'Recordatorio eliminado', severity: 'success' });
        }
      });
    }
  };

  if (isLoading) {
    return (
      <DashboardContent>
        <Box sx={{ display: 'flex', flexGrow: 1, justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress />
        </Box>
      </DashboardContent>
    );
  }

  return (
    <DashboardContent>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Recordatorios de Pagos</Typography>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={() => handleOpenDialog()}
        >
          Nuevo Recordatorio
        </Button>
      </Stack>

      <Box sx={{ mb: 4 }}>
        <AdSenseSlot
          slot={ADS_CONFIG.RECORDATORIOS_INLINE_SLOT || ADS_CONFIG.DASHBOARD_TOP_SLOT}
          label="Publicidad"
          minHeight={110}
        />
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <Card sx={{ p: 3 }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Título</TableCell>
                    <TableCell>Monto</TableCell>
                    <TableCell>Fecha de Vencimiento</TableCell>
                    <TableCell>Frecuencia</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell align="right">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reminders?.map((reminder) => (
                    <TableRow key={reminder.id}>
                      <TableCell>
                        <Typography variant="subtitle2">{reminder.title}</Typography>
                      </TableCell>
                      <TableCell>{fCurrency(reminder.amount)}</TableCell>
                      <TableCell>{fDate(reminder.due_date)}</TableCell>
                      <TableCell>
                        {reminder.frequency === 'once' ? 'Una vez' : 
                         reminder.frequency === 'weekly' ? 'Semanal' : 
                         reminder.frequency === 'monthly' ? 'Mensual' : 'Una vez'}
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            px: 1,
                            py: 0.5,
                            borderRadius: 1,
                            display: 'inline-flex',
                            typography: 'caption',
                            fontWeight: 'bold',
                            bgcolor: !reminder.is_completed ? 'success.lighter' : 'error.lighter',
                            color: !reminder.is_completed ? 'success.darker' : 'error.darker',
                          }}
                        >
                          {!reminder.is_completed ? 'Pendiente' : 'Pagado'}
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton onClick={() => handleOpenDialog(reminder)}>
                          <Iconify icon="solar:pen-bold" />
                        </IconButton>
                        <IconButton color="error" onClick={() => handleDelete(reminder.id)}>
                          <Iconify icon="solar:trash-bin-trash-bold" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  {reminders?.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                        <Typography variant="body2" color="text.secondary">
                          No hay recordatorios registrados
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>
      </Grid>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="xs">
        <DialogTitle>{editingReminder ? 'Editar Recordatorio' : 'Nuevo Recordatorio'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Título del pago (ej: Internet, Luz)"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
            <TextField
              fullWidth
              label="Monto aproximado"
              type="number"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
            />
            <TextField
              fullWidth
              label="Fecha de vencimiento"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={form.due_date}
              onChange={(e) => setForm({ ...form, due_date: e.target.value })}
            />
            <TextField
              fullWidth
              select
              label="Frecuencia"
              value={form.frequency}
              onChange={(e) => setForm({ ...form, frequency: e.target.value as ReminderForm['frequency'] })}
            >
              <MenuItem value="once">Una vez</MenuItem>
              <MenuItem value="weekly">Semanal</MenuItem>
              <MenuItem value="monthly">Mensual</MenuItem>
            </TextField>
            <FormControlLabel
              control={
                <Switch
                  checked={form.is_completed}
                  onChange={(e) => setForm({ ...form, is_completed: e.target.checked })}
                />
              }
              label="Marcar como pagado"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSave}>Guardar</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={notification.open}
        autoHideDuration={3000}
        onClose={() => setNotification({ ...notification, open: false })}
        message={notification.message}
      />
    </DashboardContent>
  );
}
