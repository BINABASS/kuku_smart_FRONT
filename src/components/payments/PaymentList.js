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
  Button 
} from '@mui/material';
import { 
  Edit as EditIcon,
  DeleteOutline as DeleteOutlineIcon 
} from '@mui/icons-material';
import api from '../../utils/api';

const PaymentList = ({ onEdit }) => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedPaymentId, setSelectedPaymentId] = useState(null);

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        try {
            const response = await api.get('/payments');
            setPayments(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching payments:', error);
            setLoading(false);
        }
    };

    const handleDeleteClick = (id) => {
        setSelectedPaymentId(id);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            await api.delete(`/payments/${selectedPaymentId}`);
            setDeleteDialogOpen(false);
            fetchPayments();
        } catch (error) {
            console.error('Error deleting payment:', error);
        }
    };

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false);
        setSelectedPaymentId(null);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Farmer</TableCell>
                            <TableCell>Subscription</TableCell>
                            <TableCell>Amount</TableCell>
                            <TableCell>Payment Date</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {payments.map((payment) => (
                            <TableRow key={payment.id}>
                                <TableCell>{payment.farmerName}</TableCell>
                                <TableCell>{payment.subscriptionPlan}</TableCell>
                                <TableCell>
                                    <span style={{ 
                                        fontWeight: 500,
                                        color: payment.status === 'paid' ? '#1976d2' : '#b00020'
                                    }}>
                                        ${payment.amount}
                                    </span>
                                </TableCell>
                                <TableCell>{new Date(payment.paymentDate).toLocaleDateString()}</TableCell>
                                <TableCell>
                                    <span 
                                        style={{ 
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            fontSize: '0.875rem',
                                            fontWeight: 500,
                                            color: payment.status === 'paid' ? '#1976d2' : '#b00020',
                                            backgroundColor: payment.status === 'paid' ? '#e3f2fd' : '#ffebee'
                                        }}
                                    >
                                        {payment.status}
                                    </span>
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
                    Are you sure you want to delete this payment?
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
        </>
    );
};

export default PaymentList;
