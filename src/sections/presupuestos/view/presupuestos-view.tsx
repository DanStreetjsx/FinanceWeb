import type { Category } from 'src/services/categorias/CategoriasRepository';
import type { Budget, BudgetCategory } from 'src/services/presupuestos/PresupuestosRepository';

import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import MenuItem from '@mui/material/MenuItem';
import Snackbar from '@mui/material/Snackbar';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TableContainer from '@mui/material/TableContainer';
import CircularProgress from '@mui/material/CircularProgress';

import { fCurrency } from 'src/utils/format-number';

import { ADS_CONFIG } from 'src/config/ads-config';
import { DashboardContent } from 'src/layouts/dashboard';
import { useCategories } from 'src/services/categorias/CategoriasRepositoryHooks';
import { 
  useBudgets, 
  useCreateBudget, 
  useUpdateBudget,
  useDeleteBudget,
  useBudgetCategories,
  useAddBudgetCategory,
  useUpdateBudgetCategory,
  useDeleteBudgetCategory
} from 'src/services/presupuestos/PresupuestosRepositoryHooks';

import { Iconify } from 'src/components/iconify';
import { AdSenseSlot } from 'src/components/ads';

// ----------------------------------------------------------------------

type NotificationState = { open: boolean; message: string; severity: 'success' | 'error' };

const getErrorMessage = (error: unknown) => (error instanceof Error ? error.message : 'Error inesperado');

export function PresupuestosView() {
  const { data: budgets, isLoading: loadingBudgets } = useBudgets();
  const { data: allCategories } = useCategories({ type: 'expense' });
  
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
  const { data: budgetCategories } = useBudgetCategories(selectedBudget?.id || 0);

  const createBudget = useCreateBudget();
  const updateBudget = useUpdateBudget();
  const deleteBudget = useDeleteBudget();
  const addCategory = useAddBudgetCategory();
  const updateBudgetCategory = useUpdateBudgetCategory();
  const deleteCategory = useDeleteBudgetCategory();

  const [openBudgetDialog, setOpenBudgetDialog] = useState(false);
  const [openCategoryDialog, setOpenCategoryDialog] = useState(false);

  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [budgetForm, setBudgetForm] = useState({ name: '', start_date: '', end_date: '' });

  const [editingCategory, setEditingCategory] = useState<BudgetCategory | null>(null);
  const [categoryForm, setCategoryForm] = useState({ category_id: '', allocated_amount: '' });

  const [notification, setNotification] = useState<NotificationState>({ open: false, message: '', severity: 'success' });

  // Seleccionar el primer presupuesto por defecto
  useEffect(() => {
    if (budgets?.length && !selectedBudget) {
      setSelectedBudget(budgets[0]);
    }
  }, [budgets, selectedBudget]);

  const handleOpenBudgetDialog = (budget?: Budget) => {
    if (budget) {
      setEditingBudget(budget);
      setBudgetForm({
        name: budget.name,
        start_date: budget.start_date.split('T')[0],
        end_date: budget.end_date.split('T')[0],
      });
    } else {
      setEditingBudget(null);
      setBudgetForm({ name: '', start_date: '', end_date: '' });
    }
    setOpenBudgetDialog(true);
  };

  const handleSaveBudget = () => {
    if (editingBudget) {
      updateBudget.mutate({
        id: editingBudget.id,
        data: budgetForm
      }, {
        onSuccess: () => {
          setOpenBudgetDialog(false);
          setEditingBudget(null);
          setNotification({ open: true, message: 'Presupuesto actualizado correctamente', severity: 'success' });
        },
        onError: (err: unknown) => {
          setNotification({ open: true, message: `Error: ${getErrorMessage(err)}`, severity: 'error' });
        }
      });
    } else {
      createBudget.mutate(budgetForm, {
        onSuccess: () => {
          setOpenBudgetDialog(false);
          setBudgetForm({ name: '', start_date: '', end_date: '' });
          setNotification({ open: true, message: 'Presupuesto creado correctamente', severity: 'success' });
        },
        onError: (err: unknown) => {
          setNotification({ open: true, message: `Error: ${getErrorMessage(err)}`, severity: 'error' });
        }
      });
    }
  };

  const handleOpenCategoryDialog = (item?: BudgetCategory) => {
    if (item) {
      setEditingCategory(item);
      setCategoryForm({
        category_id: item.category_id.toString(),
        allocated_amount: item.allocated_amount.toString(),
      });
    } else {
      setEditingCategory(null);
      setCategoryForm({ category_id: '', allocated_amount: '' });
    }
    setOpenCategoryDialog(true);
  };

  const handleSaveCategory = () => {
    if (!selectedBudget) return;

    if (editingCategory) {
      updateBudgetCategory.mutate({
        budgetId: selectedBudget.id,
        catId: editingCategory.id,
        data: {
          category_id: parseInt(categoryForm.category_id, 10),
          allocated_amount: parseFloat(categoryForm.allocated_amount)
        }
      }, {
        onSuccess: () => {
          setOpenCategoryDialog(false);
          setEditingCategory(null);
          setNotification({ open: true, message: 'Asignación actualizada correctamente', severity: 'success' });
        },
        onError: (err: unknown) => {
          setNotification({ open: true, message: `Error: ${getErrorMessage(err)}`, severity: 'error' });
        }
      });
    } else {
      addCategory.mutate({
        budgetId: selectedBudget.id,
        data: {
          category_id: parseInt(categoryForm.category_id, 10),
          allocated_amount: parseFloat(categoryForm.allocated_amount)
        }
      }, {
        onSuccess: () => {
          setOpenCategoryDialog(false);
          setCategoryForm({ category_id: '', allocated_amount: '' });
          setNotification({ open: true, message: 'Categoría asignada correctamente', severity: 'success' });
        },
        onError: (err: unknown) => {
          setNotification({ open: true, message: `Error: ${getErrorMessage(err)}`, severity: 'error' });
        }
      });
    }
  };

  const handleDeleteBudget = (id: number) => {
    if(confirm('¿Estás seguro de eliminar este presupuesto?')) {
      deleteBudget.mutate(id, {
        onSuccess: () => {
          setNotification({ open: true, message: 'Presupuesto eliminado', severity: 'success' });
          if (selectedBudget?.id === id) setSelectedBudget(null);
        }
      });
    }
  };

  const handleDeleteCategory = (catId: number) => {
    if (!selectedBudget) return;
    deleteCategory.mutate({ budgetId: selectedBudget.id, catId }, {
      onSuccess: () => {
        setNotification({ open: true, message: 'Asignación eliminada', severity: 'success' });
      }
    });
  };

  const totalAllocated = budgetCategories?.reduce((acc, curr) => acc + Number(curr.allocated_amount), 0) || 0;

  if (loadingBudgets) {
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
        <Typography variant="h4">Presupuestos</Typography>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={() => handleOpenBudgetDialog()}
        >
          Nuevo Presupuesto
        </Button>
      </Stack>

      <Box sx={{ mb: 4 }}>
        <AdSenseSlot
          slot={ADS_CONFIG.PRESUPUESTOS_INLINE_SLOT || ADS_CONFIG.DASHBOARD_TOP_SLOT}
          label="Publicidad"
          minHeight={110}
        />
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" mb={2}>Mis Presupuestos</Typography>
            <Stack spacing={1}>
              {budgets?.map((budget) => (
                <Button
                  key={budget.id}
                  variant={selectedBudget?.id === budget.id ? 'contained' : 'outlined'}
                  onClick={() => setSelectedBudget(budget)}
                  fullWidth
                  sx={{ justifyContent: 'space-between', textAlign: 'left', py: 1.5 }}
                >
                  <Box sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {budget.name}
                  </Box>
                  <Stack direction="row" spacing={0.5}>
                    <IconButton size="small" color="inherit" onClick={(e) => {
                      e.stopPropagation();
                      handleOpenBudgetDialog(budget);
                    }}>
                      <Iconify icon="solar:pen-bold" width={16} />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteBudget(budget.id);
                    }}>
                      <Iconify icon="solar:trash-bin-trash-bold" width={16} />
                    </IconButton>
                  </Stack>
                </Button>
              ))}
            </Stack>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          {selectedBudget ? (
            <Card sx={{ p: 3 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                <Box>
                  <Typography variant="h5">{selectedBudget.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Asignado: {fCurrency(totalAllocated)}
                  </Typography>
                </Box>
                <Button 
                  variant="outlined" 
                  startIcon={<Iconify icon="mingcute:add-line" />}
                  onClick={() => handleOpenCategoryDialog()}
                >
                  Asignar Categoría
                </Button>
              </Stack>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Categoría</TableCell>
                      <TableCell align="right">Monto Asignado</TableCell>
                      <TableCell align="right">Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {budgetCategories?.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.category?.name || 'Cargando...'}</TableCell>
                        <TableCell align="right">{fCurrency(item.allocated_amount)}</TableCell>
                        <TableCell align="right">
                          <IconButton color="primary" onClick={() => handleOpenCategoryDialog(item)}>
                            <Iconify icon="solar:pen-bold" />
                          </IconButton>
                          <IconButton color="error" onClick={() => handleDeleteCategory(item.id)}>
                            <Iconify icon="solar:trash-bin-trash-bold" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          ) : (
            <Box textAlign="center" py={10}>
              <Typography color="text.secondary">Selecciona o crea un presupuesto para comenzar</Typography>
            </Box>
          )}
        </Grid>
      </Grid>

      {/* Dialogo Nuevo/Editar Presupuesto */}
      <Dialog open={openBudgetDialog} onClose={() => setOpenBudgetDialog(false)} fullWidth maxWidth="xs">
        <DialogTitle>{editingBudget ? 'Editar Presupuesto' : 'Nuevo Presupuesto'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField 
              label="Nombre" 
              fullWidth 
              value={budgetForm.name} 
              onChange={(e) => setBudgetForm({ ...budgetForm, name: e.target.value })} 
            />
            <TextField 
              label="Fecha Inicio" 
              type="date" 
              fullWidth 
              InputLabelProps={{ shrink: true }} 
              value={budgetForm.start_date} 
              onChange={(e) => setBudgetForm({ ...budgetForm, start_date: e.target.value })} 
            />
            <TextField 
              label="Fecha Fin" 
              type="date" 
              fullWidth 
              InputLabelProps={{ shrink: true }} 
              value={budgetForm.end_date} 
              onChange={(e) => setBudgetForm({ ...budgetForm, end_date: e.target.value })} 
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenBudgetDialog(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSaveBudget}>
            {editingBudget ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialogo Asignar/Editar Categoría */}
      <Dialog open={openCategoryDialog} onClose={() => setOpenCategoryDialog(false)} fullWidth maxWidth="xs">
        <DialogTitle>{editingCategory ? 'Editar Asignación' : 'Asignar Categoría'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Categoría</InputLabel>
              <Select
                value={categoryForm.category_id}
                label="Categoría"
                onChange={(e) => setCategoryForm({ ...categoryForm, category_id: e.target.value })}
              >
                {allCategories?.map((cat: Category) => (
                  <MenuItem key={cat.id} value={cat.id.toString()}>{cat.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField 
              label="Monto" 
              type="number" 
              fullWidth 
              value={categoryForm.allocated_amount} 
              onChange={(e) => setCategoryForm({ ...categoryForm, allocated_amount: e.target.value })} 
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCategoryDialog(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSaveCategory}>
            {editingCategory ? 'Actualizar' : 'Asignar'}
          </Button>
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
