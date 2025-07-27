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

const SubscriptionList = ({ onEdit }) => {
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSubscriptions();
    }, []);

    const fetchSubscriptions = async () => {
        try {
            const response = await api.get('/subscriptions');
            setSubscriptions(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching subscriptions:', error);
            setLoading(false);
        }
    };

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedSubscriptionId, setSelectedSubscriptionId] = useState(null);

    const handleDeleteClick = (id) => {
        setSelectedSubscriptionId(id);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            await api.delete(`/subscriptions/${selectedSubscriptionId}`);
            setDeleteDialogOpen(false);
            fetchSubscriptions();
        } catch (error) {
            console.error('Error deleting subscription:', error);
        }
    };

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false);
        setSelectedSubscriptionId(null);
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
                                                            <TableCell>Manager</TableCell>
                            <TableCell>Plan</TableCell>
                            <TableCell>Start Date</TableCell>
                            <TableCell>End Date</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {subscriptions.map((subscription) => (
                            <TableRow key={subscription.id}>
                                <TableCell>{subscription.managerName}</TableCell>
                                <TableCell>{subscription.plan}</TableCell>
                                <TableCell>{subscription.startDate}</TableCell>
                                <TableCell>{subscription.endDate}</TableCell>
                                <TableCell>
                                    <span 
                                        style={{ 
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            fontSize: '0.875rem',
                                            fontWeight: 500,
                                            color: subscription.status === 'active' ? '#1976d2' : '#b00020',
                                            backgroundColor: subscription.status === 'active' ? '#e3f2fd' : '#ffebee'
                                        }}
                                    >
                                        {subscription.status}
                                    </span>
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
                    Are you sure you want to delete this subscription?
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

export default SubscriptionList;
