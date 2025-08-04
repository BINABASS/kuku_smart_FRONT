import React, { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    IconButton,
    Chip,
    Alert,
    CircularProgress,
    Box
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import api from '../../api/client';

const SubscriptionPlansList = ({ onEdit, onSuccess }) => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await api.get('/subscription-plans/');
            setPlans(response.data);
        } catch (error) {
            console.error('Error fetching subscription plans:', error);
            setError('Failed to load subscription plans. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this plan?')) {
            try {
                await api.delete(`/subscription-plans/${id}/`);
                fetchPlans();
                onSuccess && onSuccess();
            } catch (error) {
                console.error('Error deleting subscription plan:', error);
                setError('Failed to delete subscription plan. Please try again.');
            }
        }
    };

    const getStatusColor = (isActive) => {
        return isActive ? 'success' : 'error';
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'basic': return 'primary';
            case 'premium': return 'secondary';
            case 'enterprise': return 'warning';
            default: return 'default';
        }
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
                            <TableCell>Name</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell>Duration</TableCell>
                            <TableCell>Limits</TableCell>
                            <TableCell>Features</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {plans.map((plan) => (
                            <TableRow key={plan.id}>
                                <TableCell>
                                    <strong>{plan.name}</strong>
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={plan.type}
                                        color={getTypeColor(plan.type)}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>
                                    {plan.description?.substring(0, 50)}
                                    {plan.description?.length > 50 && '...'}
                                </TableCell>
                                <TableCell>
                                    <strong>${plan.price}</strong>
                                </TableCell>
                                <TableCell>
                                    {plan.duration_days} days
                                </TableCell>
                                <TableCell>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                        <Chip
                                            label={`${plan.max_devices} devices`}
                                            size="small"
                                            variant="outlined"
                                        />
                                        <Chip
                                            label={`${plan.max_sensors} sensors`}
                                            size="small"
                                            variant="outlined"
                                        />
                                        <Chip
                                            label={`${plan.max_batches} batches`}
                                            size="small"
                                            variant="outlined"
                                        />
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, maxWidth: 200 }}>
                                        {plan.features && Object.values(plan.features).slice(0, 3).map((feature, index) => (
                                            <Chip
                                                key={index}
                                                label={feature}
                                                size="small"
                                                variant="outlined"
                                            />
                                        ))}
                                        {plan.features && Object.values(plan.features).length > 3 && (
                                            <Chip
                                                label={`+${Object.values(plan.features).length - 3} more`}
                                                size="small"
                                                color="primary"
                                            />
                                        )}
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={plan.is_active ? 'Active' : 'Inactive'}
                                        color={getStatusColor(plan.is_active)}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>
                                    <IconButton onClick={() => onEdit(plan)} color="primary">
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(plan.id)} color="error">
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default SubscriptionPlansList;
