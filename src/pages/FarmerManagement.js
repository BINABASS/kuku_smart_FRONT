import React, { useState } from 'react';
import {
    Box,
    Button,
    Typography,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useRoleGuard } from '../utils/rbacMiddleware';

const FarmerManagement = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedFarmer, setSelectedFarmer] = useState(null);
    const [formData, setFormData] = useState({
        email: '',
        farmName: '',
        farmLocation: '',
        farmSize: '',
    });

    // Ensure only admins can access this page
    useRoleGuard('admin', null, null);

    const mockUsers = useSelector(state => state.auth.mockUsers);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Filter only farmer accounts
    const farmers = Object.values(mockUsers).filter(user => 
        user.role === 'farmer' && 
        (user.farmName.toLowerCase().includes(searchTerm.toLowerCase()) ||
         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
         user.farmLocation.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleOpenDialog = (farmer = null) => {
        if (farmer) {
            setFormData({
                email: farmer.email,
                farmName: farmer.farmName,
                farmLocation: farmer.farmLocation,
                farmSize: farmer.farmSize,
            });
        }
        setSelectedFarmer(farmer);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setSelectedFarmer(null);
        setFormData({
            email: '',
            farmName: '',
            farmLocation: '',
            farmSize: '',
        });
        setOpenDialog(false);
    };

    const handleSave = () => {
        // In a real app, this would update the farmer's data
        handleCloseDialog();
    };

    return (
        <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Typography variant="h4" gutterBottom>
                        Farmer Management
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Search Farmers"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        sx={{ mb: 3 }}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleOpenDialog()}
                        sx={{ mb: 3 }}
                    >
                        Add New Farmer
                    </Button>
                </Grid>
                <Grid item xs={12}>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Farm Name</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Location</TableCell>
                                    <TableCell>Size (acres)</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {farmers.map((farmer) => (
                                    <TableRow key={farmer.email}>
                                        <TableCell>{farmer.farmName}</TableCell>
                                        <TableCell>{farmer.email}</TableCell>
                                        <TableCell>{farmer.farmLocation}</TableCell>
                                        <TableCell>{farmer.farmSize}</TableCell>
                                        <TableCell>
                                            <IconButton
                                                onClick={() => handleOpenDialog(farmer)}
                                                color="primary"
                                            >
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton
                                                onClick={() => {
                                                    // In a real app, this would delete the farmer
                                                    console.log('Delete farmer:', farmer.email);
                                                }}
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
                </Grid>
            </Grid>

            {/* Farmer Edit Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {selectedFarmer ? 'Edit Farmer' : 'Add New Farmer'}
                </DialogTitle>
                <DialogContent>
                    <form>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Farm Name"
                                    name="farmName"
                                    value={formData.farmName}
                                    onChange={(e) => setFormData({ ...formData, farmName: e.target.value })}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Location"
                                    name="farmLocation"
                                    value={formData.farmLocation}
                                    onChange={(e) => setFormData({ ...formData, farmLocation: e.target.value })}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Size (acres)"
                                    name="farmSize"
                                    type="number"
                                    value={formData.farmSize}
                                    onChange={(e) => setFormData({ ...formData, farmSize: e.target.value })}
                                    required
                                />
                            </Grid>
                        </Grid>
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={handleSave} variant="contained" color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default FarmerManagement;
