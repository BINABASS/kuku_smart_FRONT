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

const IncomeForm = ({ open, onClose, income = null, onSuccess }) => {
  const [formData, setFormData] = useState({
    farm: '',
    type: 'egg_sales',
    amount: '',
    description: '',
    date: new Date(),
  });
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch farms for dropdown
  useEffect(() => {
    const fetchFarms = async () => {
      try {
        const response = await api.get('/farms/');
        setFarms(response.data);
      } catch (err) {
        console.error('Error fetching farms:', err);
      }
    };
    fetchFarms();
  }, []);

  // Set form data when editing
  useEffect(() => {
    if (income) {
      setFormData({
        farm: income.farm || '',
        type: income.type || 'egg_sales',
        amount: income.amount || '',
        description: income.description || '',
        date: income.date ? new Date(income.date) : new Date(),
      });
    } else {
      setFormData({
        farm: '',
        type: 'egg_sales',
        amount: '',
        description: '',
        date: new Date(),
      });
    }
  }, [income]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    if (!formData.farm) {
      setError('Please select a farm');
      return false;
    }
    if (!formData.type) {
      setError('Please select an income type');
      return false;
    }
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setError('Please enter a valid amount');
      return false;
    }
    if (!formData.description.trim()) {
      setError('Please enter a description');
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
        amount: parseFloat(formData.amount),
        date: formData.date.toISOString().split('T')[0],
      };

      if (income) {
        // Update existing income
        await api.put(`/financials/income/${income.id}/`, submitData);
        setSuccess('Income updated successfully!');
      } else {
        // Create new income
        await api.post('/financials/income/', submitData);
        setSuccess('Income created successfully!');
      }

      setTimeout(() => {
        onSuccess && onSuccess();
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save income');
      console.error('Error saving income:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError('');
    setSuccess('');
    setFormData({
      farm: '',
      type: 'egg_sales',
      amount: '',
      description: '',
      date: new Date(),
    });
    onClose();
  };

  const incomeTypes = [
    { value: 'egg_sales', label: 'Egg Sales' },
    { value: 'meat_sales', label: 'Meat Sales' },
    { value: 'live_bird_sales', label: 'Live Bird Sales' },
    { value: 'subscription', label: 'Subscription' },
    { value: 'consultation', label: 'Consultation' },
    { value: 'other', label: 'Other' },
  ];

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="md" 
      fullWidth
      disableEnforceFocus 
      disableAutoFocus 
      keepMounted={false}
      aria-labelledby="income-dialog-title"
    >
      <DialogTitle id="income-dialog-title">
        {income ? 'Edit Income' : 'Add New Income'}
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
              {/* Farm Selection */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Farm</InputLabel>
                  <Select
                    value={formData.farm}
                    onChange={(e) => handleInputChange('farm', e.target.value)}
                    label="Farm"
                  >
                    {farms.map((farm) => (
                      <MenuItem key={farm.id} value={farm.id}>
                        {farm.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Income Type */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Income Type</InputLabel>
                  <Select
                    value={formData.type}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    label="Income Type"
                  >
                    {incomeTypes.map((type) => (
                      <MenuItem key={type.value} value={type.value}>
                        {type.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Amount */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Amount"
                  type="number"
                  value={formData.amount}
                  onChange={(e) => handleInputChange('amount', e.target.value)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                />
              </Grid>

              {/* Date */}
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="Income Date"
                  value={formData.date}
                  onChange={(date) => handleInputChange('date', date)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>

              {/* Description */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={3}
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe the income source in detail..."
                />
              </Grid>

              {/* Income Summary */}
              <Grid item xs={12}>
                <Box sx={{ p: 2, bgcolor: 'success.50', borderRadius: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    Income Summary
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <Typography variant="body2" color="text.secondary">
                        Type: {incomeTypes.find(t => t.value === formData.type)?.label || 'Unknown'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography variant="body2" color="text.secondary">
                        Amount: ${parseFloat(formData.amount || 0).toFixed(2)}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography variant="body2" color="text.secondary">
                        Date: {formData.date.toLocaleDateString()}
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
          {loading ? <CircularProgress size={20} /> : (income ? 'Update' : 'Create')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default IncomeForm; 