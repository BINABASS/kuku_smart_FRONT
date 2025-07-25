import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Tabs,
  Tab,
  Paper,
  Grid,
  Chip,
  CircularProgress
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import InventoryList from '../components/inventory/InventoryList';
import InventoryForm from '../components/inventory/InventoryForm';
import { api } from '../utils/mockApi';

const Inventory = () => {
  const [inventory, setInventory] = useState([]);

  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [editItem, setEditItem] = useState(null);
  const [editOpen, setEditOpen] = useState(false);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleAdd = () => {
    setEditItem(null);
    setEditOpen(true);
  };

  const handleEdit = (item) => {
    setEditItem(item);
    setEditOpen(true);
  };

  const handleDelete = async (id) => {
    // In a real implementation, this would make an API call to delete the item
    setInventory(prev => prev.filter(item => item.id !== id));
  };

  const handleSubmit = async (formData) => {
    // In a real implementation, this would make an API call to create/update the item
    if (editItem) {
      setInventory(prev =>
        prev.map(item =>
          item.id === editItem.id ? { ...item, ...formData } : item
        )
      );
    } else {
      const newId = `inv${Date.now()}`;
      setInventory(prev => [...prev, { ...formData, id: newId }]);
    }
  };

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const inventoryRes = await api.get('/inventory');
        setInventory(inventoryRes.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching inventory:', error);
        setLoading(false);
      }
    };
    fetchInventory();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Inventory Management
      </Typography>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <Typography variant="h6">Total Items: {inventory.length}</Typography>
          </Grid>
          <Grid item>
            <Chip
              label={`Low Stock: ${inventory.filter(item => item.quantity <= item.minThreshold).length}`}
              color="warning"
              variant="outlined"
            />
          </Grid>
          <Grid item>
            <Chip
              label={`Expiring Soon: ${inventory.filter(item => 
                new Date(item.expiration) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
              ).length}`}
              color="error"
              variant="outlined"
            />
          </Grid>
          <Grid item xs="auto">
            <Button
              variant="contained"
              color="primary"
              onClick={handleAdd}
              startIcon={<AddIcon />}
            >
              Add Item
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Paper>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="All Items" />
          <Tab label="Low Stock" />
          <Tab label="Expiring Soon" />
        </Tabs>
        <Box sx={{ p: 2 }}>
          <InventoryList
            inventory={inventory}
            onEdit={handleEdit}
            onDelete={handleDelete}
            showLowStockOnly={tabValue === 1}
            showExpiringOnly={tabValue === 2}
          />
        </Box>
      </Paper>

      <InventoryForm
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onSubmit={handleSubmit}
        item={editItem}
      />
    </Box>
  );
};

export default Inventory; 