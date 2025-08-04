import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Alert,
  CircularProgress,
  Grid,
  InputAdornment,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import api from '../../api/client';

const InventoryTransactionForm = ({ open, onClose, transaction = null, onSuccess }) => {
  const [formData, setFormData] = useState({
    item: '',
    transaction_type: 'in',
    quantity: '',
    unit_price: '',
    total_amount: '',
    reference: '',
    notes: '',
    transaction_date: new Date(),
  });
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch items for dropdown
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await api.get('/inventory/items/');
        setItems(response.data);
      } catch (err) {
        console.error('Error fetching items:', err);
      }
    };
    fetchItems();
  }, []);

  // Set form data when editing
  useEffect(() => {
    if (transaction) {
      setFormData({
        item: transaction.item || '',
        transaction_type: transaction.transaction_type || 'in',
        quantity: transaction.quantity || '',
        unit_price: transaction.unit_price || '',
        total_amount: transaction.total_amount || '',
        reference: transaction.reference || '',
        notes: transaction.notes || '',
        transaction_date: transaction.transaction_date ? new Date(transaction.transaction_date) : new Date(),
      });
    } else {
      setFormData({
        item: '',
        transaction_type: 'in',
        quantity: '',
        unit_price: '',
        total_amount: '',
        reference: '',
        notes: '',
        transaction_date: new Date(),
      });
    }
  }, [transaction]);

  // Calculate total amount when quantity or unit price changes
  useEffect(() => {
    const quantity = parseFloat(formData.quantity) || 0;
    const unitPrice = parseFloat(formData.unit_price) || 0;
    const total = quantity * unitPrice;
    
    setFormData(prev => ({
      ...prev,
      total_amount: total.toFixed(2)
    }));
  }, [formData.quantity, formData.unit_price]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    if (!formData.item) {
      setError('Please select an item');
      return false;
    }
    if (!formData.transaction_type) {
      setError('Please select a transaction type');
      return false;
    }
    if (!formData.quantity || parseFloat(formData.quantity) <= 0) {
      setError('Please enter a valid quantity');
      return false;
    }
    if (!formData.unit_price || parseFloat(formData.unit_price) < 0) {
      setError('Please enter a valid unit price');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const submitData = {
        ...formData,
        quantity: parseInt(formData.quantity),
        unit_price: parseFloat(formData.unit_price),
        total_amount: parseFloat(formData.total_amount),
        transaction_date: formData.transaction_date.toISOString(),
      };

      if (transaction) {
        // Update existing transaction
        await api.put(`/inventory/transactions/${transaction.id}/`, submitData);
        setSuccess('Transaction updated successfully!');
      } else {
        // Create new transaction
        await api.post('/inventory/transactions/', submitData);
        setSuccess('Transaction created successfully!');
      }

      setTimeout(() => {
        onSuccess && onSuccess();
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save transaction');
      console.error('Error saving transaction:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError('');
    setSuccess('');
    setFormData({
      item: '',
      transaction_type: 'in',
      quantity: '',
      unit_price: '',
      total_amount: '',
      reference: '',
      notes: '',
      transaction_date: new Date(),
    });
    onClose();
  };

  const transactionTypes = [
    { value: 'in', label: 'Stock In' },
    { value: 'out', label: 'Stock Out' },
    { value: 'adjustment', label: 'Adjustment' },
    { value: 'return', label: 'Return' },
  ];

  const selectedItem = items.find(item => item.id === formData.item);

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="md" 
      fullWidth
      disableEnforceFocus 
      disableAutoFocus 
      keepMounted={false}
      aria-labelledby="transaction-dialog-title"
    >
      <DialogTitle id="transaction-dialog-title">
        {transaction ? 'Edit Transaction' : 'Add New Transaction'}
      </DialogTitle>
      
      <DialogContent>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Box sx={{ mt: 2 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            
            {success && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {success}
              </Alert>
            )}

            <Grid container spacing={3}>
              {/* Item Selection */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Item</InputLabel>
                  <Select
                    value={formData.item}
                    onChange={(e) => handleInputChange('item', e.target.value)}
                    label="Item"
                  >
                    {items.map((item) => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.name} ({item.current_stock} {item.unit})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Transaction Type */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Transaction Type</InputLabel>
                  <Select
                    value={formData.transaction_type}
                    onChange={(e) => handleInputChange('transaction_type', e.target.value)}
                    label="Transaction Type"
                  >
                    {transactionTypes.map((type) => (
                      <MenuItem key={type.value} value={type.value}>
                        {type.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Quantity */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => handleInputChange('quantity', e.target.value)}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">
                      {selectedItem?.unit || 'units'}
                    </InputAdornment>,
                  }}
                />
              </Grid>

              {/* Unit Price */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Unit Price"
                  type="number"
                  value={formData.unit_price}
                  onChange={(e) => handleInputChange('unit_price', e.target.value)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                />
              </Grid>

              {/* Total Amount (Read-only) */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Total Amount"
                  value={formData.total_amount}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    readOnly: true,
                  }}
                />
              </Grid>

              {/* Transaction Date */}
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="Transaction Date"
                  value={formData.transaction_date}
                  onChange={(date) => handleInputChange('transaction_date', date)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>

              {/* Reference */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Reference"
                  value={formData.reference}
                  onChange={(e) => handleInputChange('reference', e.target.value)}
                  placeholder="e.g., PO-12345, Invoice-001"
                />
              </Grid>

              {/* Notes */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Notes"
                  multiline
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Additional notes about this transaction..."
                />
              </Grid>

              {/* Transaction Summary */}
              <Grid item xs={12}>
                <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    Transaction Summary
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <Typography variant="body2" color="text.secondary">
                        Item: {selectedItem?.name || 'Not selected'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography variant="body2" color="text.secondary">
                        Type: {transactionTypes.find(t => t.value === formData.transaction_type)?.label || 'Unknown'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography variant="body2" color="text.secondary">
                        Quantity: {formData.quantity || 0} {selectedItem?.unit || 'units'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography variant="body2" color="text.secondary">
                        Unit Price: ${parseFloat(formData.unit_price || 0).toFixed(2)}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography variant="body2" color="text.secondary">
                        Total: ${parseFloat(formData.total_amount || 0).toFixed(2)}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography variant="body2" color="text.secondary">
                        Date: {formData.transaction_date.toLocaleDateString()}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </LocalizationProvider>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          disabled={loading}
        >
          {loading ? <CircularProgress size={20} /> : (transaction ? 'Update' : 'Create')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InventoryTransactionForm; 