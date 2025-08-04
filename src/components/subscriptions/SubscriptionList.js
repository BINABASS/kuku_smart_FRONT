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

const SubscriptionList = ({ onEdit, onSuccess }) => {
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedSubscriptionId, setSelectedSubscriptionId] = useState(null);

    useEffect(() => {
        fetchSubscriptions();
    }, []);

    const fetchSubscriptions = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await api.get('/subscriptions/');
            setSubscriptions(response.data);
        } catch (error) {
            console.error('Error fetching subscriptions:', error);
            setError('Failed to load subscriptions. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = (id) => {
        setSelectedSubscriptionId(id);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            await api.delete(`/subscriptions/${selectedSubscriptionId}/`);
            setDeleteDialogOpen(false);
            fetchSubscriptions();
            onSuccess && onSuccess();
        } catch (error) {
            console.error('Error deleting subscription:', error);
            setError('Failed to delete subscription. Please try again.');
        }
    };

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false);
        setSelectedSubscriptionId(null);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'success';
            case 'pending': return 'warning';
            case 'expired': return 'error';
            case 'cancelled': return 'default';
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
                            <TableCell>Plan</TableCell>
                            <TableCell>Farm</TableCell>
                            <TableCell>Start Date</TableCell>
                            <TableCell>End Date</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Auto Renew</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {subscriptions.map((subscription) => (
                            <TableRow key={subscription.id}>
                                <TableCell>
                                    <Box>
                                        <div><strong>{subscription.user_email}</strong></div>
                                        {subscription.manager_name && (
                                            <div style={{ fontSize: '0.875rem', color: '#666' }}>
                                                {subscription.manager_name}
                                            </div>
                                        )}
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Chip 
                                        label={subscription.plan_name} 
                                        color="primary" 
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>
                                    {subscription.farm_name || 'No farm assigned'}
                                </TableCell>
                                <TableCell>
                                    {formatDate(subscription.start_date)}
                                </TableCell>
                                <TableCell>
                                    {formatDate(subscription.end_date)}
                                </TableCell>
                                <TableCell>
                                    <Chip 
                                        label={subscription.status} 
                                        color={getStatusColor(subscription.status)}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Chip 
                                        label={subscription.auto_renew ? 'Yes' : 'No'} 
                                        color={subscription.auto_renew ? 'success' : 'default'}
                                        size="small"
                                        variant="outlined"
                                    />
                                </TableCell>
                                <TableCell>
                                    <IconButton 
                                        onClick={() => onEdit(subscription)}
                                        size="small"
                                        sx={{ mr: 1 }}
                                    >
                                        <EditIcon sx={{ color: 'primary.main' }} />
                                    </IconButton>
                                    <IconButton 
                                        onClick={() => handleDeleteClick(subscription.id)}
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
                <DialogTitle>Delete Subscription</DialogTitle>
                <DialogContent>
                    Are you sure you want to delete this subscription? This action cannot be undone.
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

export default SubscriptionList;
