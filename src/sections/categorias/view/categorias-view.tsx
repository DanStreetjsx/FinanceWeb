import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TableRow from '@mui/material/TableRow';
import Snackbar from '@mui/material/Snackbar';
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

import { DashboardContent } from 'src/layouts/dashboard';
import { 
  useCategories, 
  useCreateCategory, 
  useUpdateCategory, 
  useDeleteCategory 
} from 'src/services/categorias/CategoriasRepositoryHooks';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function CategoriasView() {
  const { data: categories, isLoading } = useCategories();
  
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const [openDialog, setOpenDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [form, setForm] = useState({ name: '', type: 'expense' as 'expense' | 'income' | 'both' });
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const incomeCategories = categories?.filter(cat => cat.type === 'income' || cat.type === 'both') || [];
  const expenseCategories = categories?.filter(cat => cat.type === 'expense' || cat.type === 'both') || [];

  const handleOpenDialog = (type: 'expense' | 'income', category?: any) => {
    if (category) {
      setEditingCategory(category);
      setForm({ name: category.name, type: category.type });
    } else {
      setEditingCategory(null);
      setForm({ name: '', type });
    }
    setOpenDialog(true);
  };

  const handleSave = () => {
    if (!form.name) {
      setNotification({ open: true, message: 'El nombre es obligatorio', severity: 'error' });
      return;
    }

    if (editingCategory) {
      updateCategory.mutate({
        id: editingCategory.id,
        data: form
      }, {
        onSuccess: () => {
          setNotification({ open: true, message: 'Categoría actualizada', severity: 'success' });
          setOpenDialog(false);
        }
      });
    } else {
      createCategory.mutate(form, {
        onSuccess: () => {
          setNotification({ open: true, message: 'Categoría creada', severity: 'success' });
          setOpenDialog(false);
        }
      });
    }
  };

  const handleDelete = (id: number) => {
    if (confirm('¿Estás seguro de eliminar esta categoría?')) {
      deleteCategory.mutate(id, {
        onSuccess: () => {
          setNotification({ open: true, message: 'Categoría eliminada', severity: 'success' });
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
      <Typography variant="h4" sx={{ mb: 5 }}>
        Categorías
      </Typography>

      <Grid container spacing={3}>
        {/* Columna Gastos */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ p: 3 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
              <Typography variant="h6">Gastos</Typography>
              <Button
                variant="contained"
                color="error"
                startIcon={<Iconify icon="mingcute:add-line" />}
                onClick={() => handleOpenDialog('expense')}
              >
                Nueva
              </Button>
            </Stack>

            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Nombre</TableCell>
                    <TableCell align="right">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {expenseCategories.map((cat) => (
                    <TableRow key={cat.id}>
                      <TableCell>{cat.name}</TableCell>
                      <TableCell align="right">
                        <IconButton onClick={() => handleOpenDialog('expense', cat)}>
                          <Iconify icon="solar:pen-bold" />
                        </IconButton>
                        <IconButton color="error" onClick={() => handleDelete(cat.id)}>
                          <Iconify icon="solar:trash-bin-trash-bold" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>

        {/* Columna Ingresos */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ p: 3 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
              <Typography variant="h6">Ingresos</Typography>
              <Button
                variant="contained"
                color="success"
                startIcon={<Iconify icon="mingcute:add-line" />}
                onClick={() => handleOpenDialog('income')}
              >
                Nueva
              </Button>
            </Stack>

            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Nombre</TableCell>
                    <TableCell align="right">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {incomeCategories.map((cat) => (
                    <TableRow key={cat.id}>
                      <TableCell>{cat.name}</TableCell>
                      <TableCell align="right">
                        <IconButton onClick={() => handleOpenDialog('income', cat)}>
                          <Iconify icon="solar:pen-bold" />
                        </IconButton>
                        <IconButton color="error" onClick={() => handleDelete(cat.id)}>
                          <Iconify icon="solar:trash-bin-trash-bold" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>
      </Grid>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="xs">
        <DialogTitle>{editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Nombre de la categoría"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            sx={{ mt: 2 }}
          />
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
