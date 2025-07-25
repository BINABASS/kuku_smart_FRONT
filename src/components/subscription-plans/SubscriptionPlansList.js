import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, IconButton } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import axios from 'axios';

const SubscriptionPlansList = ({ onEdit }) => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/subscription-plans/');
            setPlans(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching subscription plans:', error);
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8000/api/subscription-plans/${id}/`);
            fetchPlans();
        } catch (error) {
            console.error('Error deleting subscription plan:', error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Price</TableCell>
                        <TableCell>Duration</TableCell>
                        <TableCell>Features</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {plans.map((plan) => (
                        <TableRow key={plan.planID}>
                            <TableCell>{plan.plan_name}</TableCell>
                            <TableCell>{plan.description}</TableCell>
                            <TableCell>${plan.price}</TableCell>
                            <TableCell>{plan.duration} months</TableCell>
                            <TableCell>
                                <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                                    {plan.features?.split(',').map((feature, index) => (
                                        <li key={index} style={{ margin: '4px 0' }}>
                                            <span style={{
                                                padding: '2px 8px',
                                                borderRadius: '4px',
                                                backgroundColor: '#f5f5f5',
                                                color: '#333',
                                                fontSize: '0.875rem',
                                            }}>
                                                {feature.trim()}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </TableCell>
                            <TableCell>
                                <IconButton onClick={() => onEdit(plan)}>
                                    <EditIcon />
                                </IconButton>
                                <IconButton onClick={() => handleDelete(plan.planID)}>
                                    <DeleteIcon />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default SubscriptionPlansList;
