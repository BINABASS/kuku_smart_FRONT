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

const BudgetForm = ({ open, onClose, budget = null, onSuccess }) => {
  const [formData, setFormData] = useState({
    farm: '',
    type: 'monthly',
    category: '',
    allocated_amount: '',
    spent_amount: '0.00',
    start_date: new Date(),
    end_date: new Date(),
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
    if (budget) {
      setFormData({
        farm: budget.farm || '',
        type: budget.type || 'monthly',
        category: budget.category || '',
        allocated_amount: budget.allocated_amount || '',
        spent_amount: budget.spent_amount || '0.00',
        start_date: budget.start_date ? new Date(budget.start_date) : new Date(),
        end_date: budget.end_date ? new Date(budget.end_date) : new Date(),
      });
    } else {
      setFormData({
        farm: '',
        type: 'monthly',
        category: '',
        allocated_amount: '',
        spent_amount: '0.00',
        start_date: new Date(),
        end_date: new Date(),
      });
    }
  }, [budget]);

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
    if (!formData.category) {
      setError('Please enter a category');
      return false;
    }
    if (!formData.allocated_amount || parseFloat(formData.allocated_amount) <= 0) {
      setError('Please enter a valid allocated amount');
      return false;
    }
    if (formData.start_date >= formData.end_date) {
      setError('End date must be after start date');
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
        allocated_amount: parseFloat(formData.allocated_amount),
        spent_amount: parseFloat(formData.spent_amount),
        start_date: formData.start_date.toISOString().split('T')[0],
        end_date: formData.end_date.toISOString().split('T')[0],
      };

      if (budget) {
        // Update existing budget
        await api.put(`/financials/budgets/${budget.id}/`, submitData);
        setSuccess('Budget updated successfully!');
      } else {
        // Create new budget
        await api.post('/financials/budgets/', submitData);
        setSuccess('Budget created successfully!');
      }

      setTimeout(() => {
        onSuccess && onSuccess();
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save budget');
      console.error('Error saving budget:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError('');
    setSuccess('');
    setFormData({
      farm: '',
      type: 'monthly',
      category: '',
      allocated_amount: '',
      spent_amount: '0.00',
      start_date: new Date(),
      end_date: new Date(),
    });
    onClose();
  };

  const calculateRemaining = () => {
    const allocated = parseFloat(formData.allocated_amount) || 0;
    const spent = parseFloat(formData.spent_amount) || 0;
    return allocated - spent;
  };

  const calculateSpentPercentage = () => {
    const allocated = parseFloat(formData.allocated_amount) || 0;
    const spent = parseFloat(formData.spent_amount) || 0;
    if (allocated > 0) {
      return (spent / allocated) * 100;
    }
    return 0;
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="md" 
      fullWidth
      disableEnforceFocus 
      disableAutoFocus 
      keepMounted={false}
      aria-labelledby="budget-dialog-title"
    >
      <DialogTitle id="budget-dialog-title">
        {budget ? 'Edit Budget' : 'Create New Budget'}
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

              {/* Budget Type */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Budget Type</InputLabel>
                  <Select
                    value={formData.type}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    label="Budget Type"
                  >
                    <MenuItem value="monthly">Monthly</MenuItem>
                    <MenuItem value="quarterly">Quarterly</MenuItem>
                    <MenuItem value="yearly">Yearly</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Category */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Budget Category"
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  placeholder="e.g., Feed, Medicine, Equipment"
                />
              </Grid>

              {/* Amount Fields */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Allocated Amount"
                  type="number"
                  value={formData.allocated_amount}
                  onChange={(e) => handleInputChange('allocated_amount', e.target.value)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Spent Amount"
                  type="number"
                  value={formData.spent_amount}
                  onChange={(e) => handleInputChange('spent_amount', e.target.value)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                />
              </Grid>

              {/* Date Fields */}
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="Start Date"
                  value={formData.start_date}
                  onChange={(date) => handleInputChange('start_date', date)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <DatePicker
                  label="End Date"
                  value={formData.end_date}
                  onChange={(date) => handleInputChange('end_date', date)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>

              {/* Budget Summary */}
              <Grid item xs={12}>
                <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    Budget Summary
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <Typography variant="body2" color="text.secondary">
                        Allocated: ${parseFloat(formData.allocated_amount || 0).toFixed(2)}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography variant="body2" color="text.secondary">
                        Spent: ${parseFloat(formData.spent_amount || 0).toFixed(2)}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography variant="body2" color="text.secondary">
                        Remaining: ${calculateRemaining().toFixed(2)}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary">
                        Spent Percentage: {calculateSpentPercentage().toFixed(1)}%
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
          {loading ? <CircularProgress size={20} /> : (budget ? 'Update' : 'Create')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BudgetForm; 