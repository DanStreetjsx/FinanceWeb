import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Alert from '@mui/material/Alert';
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
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import TableFooter from '@mui/material/TableFooter';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import LinearProgress from '@mui/material/LinearProgress';
import TableContainer from '@mui/material/TableContainer';
import CircularProgress from '@mui/material/CircularProgress';

import { fCurrency } from 'src/utils/format-number';

import { DashboardContent } from 'src/layouts/dashboard';
import { useAuthStatus } from 'src/services/auth/AuthRepositoryHooks';
import { useCategories } from 'src/services/categorias/CategoriasRepositoryHooks';
import { useDashboardData } from 'src/services/analiticas/AnaliticasRepositoryHooks';
import { 
  useTransactions, 
  useCreateTransaction, 
  useUpdateTransaction, 
  useDeleteTransaction 
} from 'src/services/transacciones/TransaccionesRepositoryHooks';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

function IngresosTable({ 
  rows, 
  isLoading, 
  onDelete,
  onEdit 
}: { 
  rows: any[], 
  isLoading: boolean,
  onDelete: (id: number) => void,
  onEdit: (row: any) => void
}) {
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 500, overflow: 'auto' }}>
      <Table size="small" stickyHeader sx={{ tableLayout: 'fixed', minWidth: 800 }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold', color: '#637381' }}>DETALLE</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: '#637381', textAlign: 'center' }}>CATEGORÍA</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: '#637381', textAlign: 'center' }}>MÉTODO</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: '#637381', textAlign: 'center' }}>MONTO</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: '#637381', textAlign: 'center' }}>FECHA</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: '#637381', textAlign: 'center' }}>ACCIONES</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} sx={{ textAlign: 'center', py: 10 }}>
                <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 'medium' }}>
                  No se encontraron ingresos con los filtros seleccionados.
                </Typography>
                <Typography variant="caption" color="text.disabled">
                  Intenta cambiar la categoría, el método o el rango de fechas.
                </Typography>
              </TableCell>
            </TableRow>
          )}
          {rows.map((row) => (
            <TableRow key={row.id} hover>
              <TableCell sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {row.detail || row.description || 'Sin detalle'}
              </TableCell>
              <TableCell sx={{ textAlign: 'center' }}>{row.category?.name || 'Sin categoría'}</TableCell>
              <TableCell sx={{ textAlign: 'center' }}>{row.source || 'Efectivo'}</TableCell>
              <TableCell sx={{ textAlign: 'center' }}>{fCurrency(row.amount)}</TableCell>
              <TableCell sx={{ textAlign: 'center' }}>
                {new Date(row.operation_at).toLocaleDateString('es-PE')}
              </TableCell>
              <TableCell sx={{ textAlign: 'center' }}>
                <Button size="small" onClick={() => onEdit(row)}>Editar</Button>
                <Button size="small" color="error" onClick={() => onDelete(row.id)}>Eliminar</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow sx={{ position: 'sticky', bottom: 0, bgcolor: '#f4f6f8' }}>
            <TableCell sx={{ fontWeight: 'bold' }}>TOTAL</TableCell>
            <TableCell colSpan={2} />
            <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>
              {fCurrency(rows.reduce((sum, row) => sum + (parseFloat(row.amount) || 0), 0))}
            </TableCell>
            <TableCell colSpan={2} />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}

export function IngresosView() {
  const { isAuthenticated } = useAuthStatus();
  const { data: dashData } = useDashboardData();
  const { data: categories } = useCategories({ type: 'income' });
  
  // Estado para los filtros (Automático/Reactivo)
  const [filters, setFilters] = useState({
    category_id: '',
    source: '',
    start_date: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    end_date: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split('T')[0]
  });

  const { data: transResponse, isLoading, isFetching, refetch } = useTransactions({
    type: 'income',
    start_date: filters.start_date,
    end_date: filters.end_date,
    category_id: filters.category_id ? parseInt(filters.category_id, 10) : undefined,
    source: filters.source || undefined,
    per_page: 100
  });

  const totalAllocated = dashData?.burn_rate?.total_allocated || 0;

  const createMutation = useCreateTransaction();
  const updateMutation = useUpdateTransaction();
  const deleteMutation = useDeleteTransaction();

  const [form, setForm] = useState({
    detail: '',
    amount: '',
    category_id: '',
    source: 'Efectivo',
    operation_at: new Date().toISOString().split('T')[0]
  });

  const [editingItem, setEditingItem] = useState<any>(null);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const handleAddIngreso = () => {
    if (!form.detail || !form.amount || !form.category_id) {
      setNotification({ open: true, message: 'Completa los campos obligatorios', severity: 'error' });
      return;
    }

    createMutation.mutate({
      detail: form.detail,
      amount: parseFloat(form.amount),
      category_id: parseInt(form.category_id, 10),
      source: form.source,
      operation_at: form.operation_at,
      type: 'income',
      currency: 'PEN'
    }, {
      onSuccess: () => {
        setNotification({ open: true, message: 'Ingreso añadido correctamente', severity: 'success' });
        setForm({ detail: '', amount: '', category_id: '', source: 'Efectivo', operation_at: new Date().toISOString().split('T')[0] });
        refetch();
      },
      onError: (err: any) => {
        setNotification({ open: true, message: `Error: ${err.message}`, severity: 'error' });
      }
    });
  };

  const handleUpdateIngreso = () => {
    if (!editingItem) return;

    updateMutation.mutate({
      id: editingItem.id,
      data: {
        detail: editingItem.detail,
        amount: parseFloat(editingItem.amount),
        category_id: editingItem.category_id,
        source: editingItem.source,
        operation_at: editingItem.operation_at,
        type: 'income'
      }
    }, {
      onSuccess: () => {
        setNotification({ open: true, message: 'Ingreso actualizado', severity: 'success' });
        setEditingItem(null);
        refetch();
      }
    });
  };

  const handleDelete = (id: number) => {
    if (window.confirm('¿Estás seguro de eliminar este ingreso?')) {
      deleteMutation.mutate(id, {
        onSuccess: () => {
          setNotification({ open: true, message: 'Ingreso eliminado', severity: 'success' });
          refetch();
        }
      });
    }
  };

  const metrics = dashData?.metrics || { income: 0, expense: 0, balance: 0 };
  
  const metodosPago = ['Efectivo', 'WhatsApp', 'Yape', 'Plin', 'BCP', 'Transferencia Bancaria', 'Venta'];

  return (
    <DashboardContent maxWidth="xl" sx={{ width: '100%', px: { xs: 1, md: 3 }, maxWidth: 'none' }}>
      <Typography variant="h4" sx={{ mb: 5 }}>
        Ingresos
      </Typography>

      <Grid container spacing={3} sx={{ mb: 5 }}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Box sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">Ingresos Totales (Mes)</Typography>
            <Typography variant="h5" color="success.main">{fCurrency(metrics.income)}</Typography>
          </Box>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Box sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">Saldo Neto (Mes)</Typography>
            <Typography variant="h5" color={metrics.balance >= 0 ? 'success.main' : 'error.main'}>
              {fCurrency(metrics.balance)}
            </Typography>
          </Box>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Box sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">Gastos Totales (Mes)</Typography>
            <Typography variant="h5" color="error.main">{fCurrency(metrics.expense)}</Typography>
          </Box>
        </Grid>
      </Grid>

      <Card sx={{ p: 3, mb: 5, bgcolor: 'primary.lighter', color: 'primary.darker' }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Iconify icon="eva:trending-up-fill" width={32} />
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6">Planificación de Presupuesto</Typography>
            <Typography variant="body2">
              De tus ingresos de {fCurrency(metrics.income)}, has asignado <strong>{fCurrency(totalAllocated)}</strong> a tus presupuestos.
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="subtitle2">Disponible para asignar</Typography>
            <Typography variant="h5">{fCurrency(Math.max(0, metrics.income - totalAllocated))}</Typography>
          </Box>
        </Stack>
        <LinearProgress 
          variant="determinate" 
          value={metrics.income > 0 ? (totalAllocated / metrics.income) * 100 : 0} 
          sx={{ mt: 2, height: 8, borderRadius: 5 }}
        />
      </Card>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <Box sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Registrar Nuevo Ingreso</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4 }}>
              <TextField 
                label="Detalle (Ej: Sueldo, Venta...)" 
                size="small" 
                value={form.detail} 
                onChange={(e) => setForm({ ...form, detail: e.target.value })} 
                sx={{ flexGrow: 1, minWidth: 200 }}
              />
              <TextField 
                label="Monto" 
                type="number" 
                size="small" 
                value={form.amount} 
                onChange={(e) => setForm({ ...form, amount: e.target.value })} 
                sx={{ width: 120 }}
              />
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <Select
                  value={form.category_id}
                  onChange={(e) => setForm({ ...form, category_id: e.target.value as string })}
                  displayEmpty
                >
                  <MenuItem value="" disabled>Categoría</MenuItem>
                  {categories?.map((cat: any) => (
                    <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <Select
                  value={form.source}
                  onChange={(e) => setForm({ ...form, source: e.target.value as string })}
                >
                  {metodosPago.map((metodo) => (
                    <MenuItem key={metodo} value={metodo}>{metodo}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField 
                type="date" 
                size="small" 
                value={form.operation_at} 
                onChange={(e) => setForm({ ...form, operation_at: e.target.value })} 
              />
              <Button 
                variant="contained" 
                onClick={handleAddIngreso}
                disabled={createMutation.isPending}
              >
                Añadir
              </Button>
            </Box>

            <Typography variant="h6" sx={{ mb: 2 }}>Filtros de Listado</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3, p: 2, bgcolor: '#f9fafb', borderRadius: 1 }}>
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <Select
                  value={filters.category_id}
                  onChange={(e) => setFilters({ ...filters, category_id: e.target.value as string })}
                  displayEmpty
                >
                  <MenuItem value="">Todas las categorías</MenuItem>
                  {categories?.map((cat: any) => (
                    <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <Select
                  value={filters.source}
                  onChange={(e) => setFilters({ ...filters, source: e.target.value as string })}
                  displayEmpty
                >
                  <MenuItem value="">Todos los métodos</MenuItem>
                  {metodosPago.map((metodo) => (
                    <MenuItem key={metodo} value={metodo}>{metodo}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2">Desde:</Typography>
                <TextField 
                  type="date" 
                  size="small" 
                  value={filters.start_date} 
                  onChange={(e) => setFilters({ ...filters, start_date: e.target.value })} 
                />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2">Hasta:</Typography>
                <TextField 
                  type="date" 
                  size="small" 
                  value={filters.end_date} 
                  onChange={(e) => setFilters({ ...filters, end_date: e.target.value })} 
                />
              </Box>
              {isFetching && <CircularProgress size={20} sx={{ ml: 1 }} />}
            </Box>

            {!isAuthenticated ? (
              <Alert severity="warning">Inicia sesión para gestionar tus ingresos</Alert>
            ) : (
              <IngresosTable 
                rows={transResponse?.data || []} 
                isLoading={isLoading} 
                onDelete={handleDelete}
                onEdit={(row) => setEditingItem({
                  ...row,
                  operation_at: new Date(row.operation_at).toISOString().split('T')[0]
                })}
              />
            )}
          </Box>
        </Grid>
      </Grid>

      {/* Dialogo de Edición */}
      <Dialog open={!!editingItem} onClose={() => setEditingItem(null)} fullWidth maxWidth="sm">
        <DialogTitle>Editar Ingreso</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField 
              fullWidth
              label="Detalle" 
              value={editingItem?.detail || ''} 
              onChange={(e) => setEditingItem({ ...editingItem, detail: e.target.value })} 
            />
            <TextField 
              fullWidth
              label="Monto" 
              type="number" 
              value={editingItem?.amount || ''} 
              onChange={(e) => setEditingItem({ ...editingItem, amount: e.target.value })} 
            />
            <FormControl fullWidth>
              <Select
                value={editingItem?.category_id || ''}
                onChange={(e) => setEditingItem({ ...editingItem, category_id: e.target.value })}
              >
                {categories?.map((cat: any) => (
                  <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <Select
                value={editingItem?.source || ''}
                onChange={(e) => setEditingItem({ ...editingItem, source: e.target.value })}
              >
                {metodosPago.map((metodo) => (
                  <MenuItem key={metodo} value={metodo}>{metodo}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField 
              fullWidth
              type="date" 
              label="Fecha"
              InputLabelProps={{ shrink: true }}
              value={editingItem?.operation_at || ''} 
              onChange={(e) => setEditingItem({ ...editingItem, operation_at: e.target.value })} 
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditingItem(null)}>Cancelar</Button>
          <Button variant="contained" onClick={handleUpdateIngreso} disabled={updateMutation.isPending}>
            Guardar Cambios
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar 
        open={notification.open} 
        autoHideDuration={4000} 
        onClose={() => setNotification({ ...notification, open: false })}
      >
        <Alert severity={notification.severity} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </DashboardContent>
  );
}
