import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  IconButton,
  Alert,
  CircularProgress,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Inventory,
  Add,
  Refresh,
  Visibility,
  Edit,
  Delete,
  TrendingUp,
  TrendingDown,
  Warning,
  CheckCircle,
  Schedule,
  Category,
} from '@mui/icons-material';
import api from '../../api/client';
import InventoryCategoryForm from './InventoryCategoryForm';
import InventoryTransactionForm from './InventoryTransactionForm';

const InventoryDashboard = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [categoryFormOpen, setCategoryFormOpen] = useState(false);
  const [transactionFormOpen, setTransactionFormOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  // Fetch inventory data
  const fetchInventoryData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [itemsResponse, categoriesResponse, transactionsResponse] = await Promise.all([
        api.get('/inventory/items/'),
        api.get('/inventory/categories/'),
        api.get('/inventory/transactions/')
      ]);
      
      setItems(itemsResponse.data);
      setCategories(categoriesResponse.data);
      setTransactions(transactionsResponse.data);
    } catch (err) {
      setError('Failed to fetch inventory data');
      console.error('Error fetching inventory data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventoryData();
  }, []);

  // Calculate inventory summaries
  const calculateSummaries = () => {
    const totalItems = items.length;
    const lowStockItems = items.filter(item => item.current_stock <= item.min_stock_level);
    const overstockedItems = items.filter(item => item.current_stock >= item.max_stock_level);
    const totalValue = items.reduce((sum, item) => sum + (item.current_stock * parseFloat(item.unit_price || 0)), 0);
    const expiringItems = items.filter(item => {
      if (!item.expiry_date) return false;
      const expiryDate = new Date(item.expiry_date);
      const daysUntilExpiry = Math.ceil((expiryDate - new Date()) / (1000 * 60 * 60 * 24));
      return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
    });

    return {
      totalItems,
      lowStockItems: lowStockItems.length,
      overstockedItems: overstockedItems.length,
      totalValue,
      expiringItems: expiringItems.length,
      totalCategories: categories.length,
      totalTransactions: transactions.length
    };
  };

  const summaries = calculateSummaries();

  const handleCategoryEdit = (category) => {
    setSelectedCategory(category);
    setCategoryFormOpen(true);
  };

  const handleTransactionEdit = (transaction) => {
    setSelectedTransaction(transaction);
    setTransactionFormOpen(true);
  };

  const handleFormClose = () => {
    setCategoryFormOpen(false);
    setTransactionFormOpen(false);
    setSelectedCategory(null);
    setSelectedTransaction(null);
  };

  const handleFormSuccess = () => {
    fetchInventoryData();
  };

  const getStockStatusColor = (item) => {
    if (item.current_stock <= item.min_stock_level) return 'error';
    if (item.current_stock >= item.max_stock_level) return 'warning';
    return 'success';
  };

  const getStockStatusIcon = (item) => {
    if (item.current_stock <= item.min_stock_level) return <Warning />;
    if (item.current_stock >= item.max_stock_level) return <TrendingUp />;
    return <CheckCircle />;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" gutterBottom>
          Inventory Dashboard
        </Typography>
        <Box display="flex" gap={1}>
          <IconButton onClick={fetchInventoryData} disabled={loading}>
            <Refresh />
          </IconButton>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setCategoryFormOpen(true)}
          >
            Add Category
          </Button>
        </Box>
      </Box>

      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Inventory Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <Inventory color="primary" />
                <Typography variant="h6">Total Items</Typography>
              </Box>
              <Typography variant="h4" color="primary">
                {summaries.totalItems}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Inventory items
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <Warning color="warning" />
                <Typography variant="h6">Low Stock</Typography>
              </Box>
              <Typography variant="h4" color="warning.main">
                {summaries.lowStockItems}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Items need restocking
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <TrendingUp color="success" />
                <Typography variant="h6">Total Value</Typography>
              </Box>
              <Typography variant="h4" color="success.main">
                {formatCurrency(summaries.totalValue)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Inventory value
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <Schedule color="info" />
                <Typography variant="h6">Expiring Soon</Typography>
              </Box>
              <Typography variant="h4" color="info.main">
                {summaries.expiringItems}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Items expiring in 30 days
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Inventory Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Categories ({summaries.totalCategories})</Typography>
                <Button
                  size="small"
                  startIcon={<Add />}
                  onClick={() => setCategoryFormOpen(true)}
                >
                  Add Category
                </Button>
              </Box>
              <List>
                {categories.slice(0, 5).map((category) => (
                  <ListItem key={category.id} divider>
                    <ListItemIcon>
                      <Category color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={category.name}
                      secondary={category.description || 'No description'}
                    />
                    <Box display="flex" gap={1}>
                      <IconButton size="small" onClick={() => handleCategoryEdit(category)}>
                        <Edit />
                      </IconButton>
                      <IconButton size="small">
                        <Visibility />
                      </IconButton>
                    </Box>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Recent Transactions ({summaries.totalTransactions})</Typography>
                <Button
                  size="small"
                  startIcon={<Add />}
                  onClick={() => setTransactionFormOpen(true)}
                >
                  Add Transaction
                </Button>
              </Box>
              <List>
                {transactions.slice(0, 5).map((transaction) => (
                  <ListItem key={transaction.id} divider>
                    <ListItemIcon>
                      {transaction.transaction_type === 'in' ? (
                        <TrendingUp color="success" />
                      ) : (
                        <TrendingDown color="warning" />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={`${transaction.item_name} - ${transaction.transaction_type.toUpperCase()}`}
                      secondary={
                        <Box>
                          <Typography variant="body2">
                            {transaction.quantity} units • {formatCurrency(transaction.total_amount)}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(transaction.transaction_date).toLocaleDateString()}
                          </Typography>
                        </Box>
                      }
                    />
                    <Box display="flex" gap={1}>
                      <IconButton size="small" onClick={() => handleTransactionEdit(transaction)}>
                        <Edit />
                      </IconButton>
                    </Box>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Stock Levels */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Stock Levels
          </Typography>
          <Grid container spacing={2}>
            {items.map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item.id}>
                <Paper sx={{ p: 2 }}>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    {getStockStatusIcon(item)}
                    <Typography variant="h6">
                      {item.name}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Current: {item.current_stock} {item.unit}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Min: {item.min_stock_level} | Max: {item.max_stock_level}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Unit Price: {formatCurrency(item.unit_price || 0)}
                  </Typography>
                  {item.expiry_date && (
                    <Typography variant="body2" color="text.secondary">
                      Expires: {new Date(item.expiry_date).toLocaleDateString()}
                    </Typography>
                  )}
                  <Chip
                    label={item.current_stock <= item.min_stock_level ? 'Low Stock' : 
                           item.current_stock >= item.max_stock_level ? 'Overstocked' : 'Normal'}
                    color={getStockStatusColor(item)}
                    size="small"
                    sx={{ mt: 1 }}
                  />
                </Paper>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Stock Status Overview */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Stock Status Overview
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h4" color="success.main">
                  {items.filter(item => item.current_stock > item.min_stock_level && item.current_stock < item.max_stock_level).length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Normal Stock
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h4" color="error.main">
                  {items.filter(item => item.current_stock <= item.min_stock_level).length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Low Stock
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h4" color="warning.main">
                  {items.filter(item => item.current_stock >= item.max_stock_level).length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Overstocked
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h4" color="info.main">
                  {items.filter(item => item.current_stock === 0).length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Out of Stock
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Forms */}
      <InventoryCategoryForm
        open={categoryFormOpen}
        onClose={handleFormClose}
        category={selectedCategory}
        onSuccess={handleFormSuccess}
      />
      
      <InventoryTransactionForm
        open={transactionFormOpen}
        onClose={handleFormClose}
        transaction={selectedTransaction}
        onSuccess={handleFormSuccess}
      />
    </Box>
  );
};

export default InventoryDashboard; 