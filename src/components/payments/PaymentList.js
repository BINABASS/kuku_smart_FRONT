import React, { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  IconButton, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button,
  Chip,
  Alert,
  CircularProgress,
  Box
} from '@mui/material';
import { 
  Edit as EditIcon,
  DeleteOutline as DeleteOutlineIcon 
} from '@mui/icons-material';
import api from '../../api/client';

const PaymentList = ({ onEdit, onSuccess }) => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedPaymentId, setSelectedPaymentId] = useState(null);

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await api.get('/payments/');
            setPayments(response.data);
        } catch (error) {
            console.error('Error fetching payments:', error);
            setError('Failed to load payments. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = (id) => {
        setSelectedPaymentId(id);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            await api.delete(`/payments/${selectedPaymentId}/`);
            setDeleteDialogOpen(false);
            fetchPayments();
            onSuccess && onSuccess();
        } catch (error) {
            console.error('Error deleting payment:', error);
            setError('Failed to delete payment. Please try again.');
        }
    };

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false);
        setSelectedPaymentId(null);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'success';
            case 'pending': return 'warning';
            case 'failed': return 'error';
            case 'refunded': return 'info';
            default: return 'default';
        }
    };

    const getPaymentMethodColor = (method) => {
        switch (method) {
            case 'credit_card': return 'primary';
            case 'bank_transfer': return 'secondary';
            case 'mobile_money': return 'warning';
            case 'paypal': return 'info';
            default: return 'default';
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString();
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>User</TableCell>
                            <TableCell>Subscription</TableCell>
                            <TableCell>Amount</TableCell>
                            <TableCell>Payment Method</TableCell>
                            <TableCell>Transaction ID</TableCell>
                            <TableCell>Payment Date</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {payments.map((payment) => (
                            <TableRow key={payment.id}>
                                <TableCell>
                                    <Box>
                                        <div><strong>{payment.subscription_user}</strong></div>
                                        {payment.manager_name && (
                                            <div style={{ fontSize: '0.875rem', color: '#666' }}>
                                                {payment.manager_name}
                                            </div>
                                        )}
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Chip 
                                        label={payment.subscription_plan} 
                                        color="primary" 
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Box>
                                        <div style={{ fontWeight: 500, fontSize: '1.1rem' }}>
                                            {payment.currency} {payment.amount}
                                        </div>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Chip 
                                        label={payment.payment_method.replace('_', ' ')} 
                                        color={getPaymentMethodColor(payment.payment_method)}
                                        size="small"
                                        variant="outlined"
                                    />
                                </TableCell>
                                <TableCell>
                                    {payment.transaction_id || 'N/A'}
                                </TableCell>
                                <TableCell>
                                    {formatDate(payment.payment_date)}
                                </TableCell>
                                <TableCell>
                                    <Chip 
                                        label={payment.status} 
                                        color={getStatusColor(payment.status)}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>
                                    <IconButton 
                                        onClick={() => onEdit(payment)}
                                        size="small"
                                        sx={{ mr: 1 }}
                                    >
                                        <EditIcon sx={{ color: 'primary.main' }} />
                                    </IconButton>
                                    <IconButton 
                                        onClick={() => handleDeleteClick(payment.id)}
                                        size="small"
                                        sx={{ color: 'error.main' }}
                                    >
                                        <DeleteOutlineIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Dialog
                open={deleteDialogOpen}
                onClose={handleDeleteCancel}
            >
                <DialogTitle>Delete Payment</DialogTitle>
                <DialogContent>
                    Are you sure you want to delete this payment? This action cannot be undone.
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteCancel} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDeleteConfirm} variant="contained" color="error">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default PaymentList;
