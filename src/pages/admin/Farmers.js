import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Typography,
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
} from '@mui/icons-material';
import axios from 'axios';
import FarmerForm from '../../components/farmers/FarmerForm';

const sampleFarmers = [
    {
        farmerID: 1,
        username: 'jdoe',
        fullName: 'John Doe',
        address: '123 Main St, Dar es Salaam',
        email: 'jdoe@example.com',
        phone: '+255 700 000 001',
        createdDate: '2024-07-01',
    },
    {
        farmerID: 2,
        username: 'asmith',
        fullName: 'Asha Smith',
        address: '456 Farm Rd, Zanzibar',
        email: 'asmith@example.com',
        phone: '+255 700 000 002',
        createdDate: '2024-07-10',
    },
    {
        farmerID: 3,
        username: 'mkassim',
        fullName: 'Mohamed Kassim',
        address: '789 Poultry Ave, Arusha',
        email: 'mkassim@example.com',
        phone: '+255 700 000 003',
        createdDate: '2024-07-15',
    },
];

const Farmers = () => {
    const [farmers, setFarmers] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedFarmer, setSelectedFarmer] = useState(null);
    const [usingSampleData, setUsingSampleData] = useState(false);

    useEffect(() => {
        fetchFarmers();
    }, []);

    const fetchFarmers = async () => {
        setUsingSampleData(false);
        try {
            const response = await axios.get('http://localhost:8000/api/farmers/');
            setFarmers(response.data);
        } catch (error) {
            console.error('Error fetching farmers:', error);
            setUsingSampleData(true);
            setFarmers([...sampleFarmers]);
        }
    };

    const handleOpenDialog = (farmer = null) => {
        setSelectedFarmer(farmer);
        setOpenDialog(true);
    };

    const handleAddOrEdit = (newFarmer) => {
        if (usingSampleData) {
            if (selectedFarmer) {
                // Edit
                setFarmers(prev => prev.map(f => f.farmerID === selectedFarmer.farmerID ? { ...f, ...newFarmer } : f));
            } else {
                // Add
                const nextID = Math.max(0, ...farmers.map(f => f.farmerID)) + 1;
                setFarmers(prev => [...prev, { ...newFarmer, farmerID: nextID, createdDate: new Date().toISOString().split('T')[0] }]);
            }
        } else {
            fetchFarmers(); // Will refresh from API after add/edit
        }
        setOpenDialog(false);
        setSelectedFarmer(null);
    };

    const handleDelete = async (farmerID) => {
        if (window.confirm('Are you sure you want to delete this farmer?')) {
            if (usingSampleData) {
                setFarmers(prev => prev.filter(f => f.farmerID !== farmerID));
            } else {
                try {
                    await axios.delete(`http://localhost:8000/api/farmers/${farmerID}/`);
                    fetchFarmers();
                } catch (error) {
                    console.error('Error deleting farmer:', error);
                }
            }
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h5">Farmers</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog()}
                >
                    Add Farmer
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Username</TableCell>
                            <TableCell>Full Name</TableCell>
                            <TableCell>Address</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Phone</TableCell>
                            <TableCell>Created Date</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {farmers.map((farmer) => (
                            <TableRow key={farmer.farmerID}>
                                <TableCell>{farmer.username}</TableCell>
                                <TableCell>{farmer.fullName}</TableCell>
                                <TableCell>{farmer.address}</TableCell>
                                <TableCell>{farmer.email}</TableCell>
                                <TableCell>{farmer.phone}</TableCell>
                                <TableCell>{farmer.createdDate}</TableCell>
                                <TableCell>
                                    <IconButton
                                        onClick={() => handleOpenDialog(farmer)}
                                        color="primary"
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        onClick={() => handleDelete(farmer.farmerID)}
                                        color="error"
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <FarmerForm
                open={openDialog}
                onClose={() => {
                    setOpenDialog(false);
                    setSelectedFarmer(null);
                }}
                farmer={selectedFarmer}
                onSave={handleAddOrEdit}
                useSample={usingSampleData}
            />
        </Box>
    );
};

export default Farmers;
