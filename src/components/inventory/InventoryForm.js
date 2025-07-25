import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box
} from '@mui/material';
import { api } from '../../utils/mockApi';

const InventoryForm = ({ open, onClose, onSubmit, item }) => {
  const [formData, setFormData] = useState({
    type: item?.type || '',
    category: item?.category || '',
    name: item?.name || '',
    quantity: item?.quantity || 0,
    minThreshold: item?.minThreshold || 0,
    maxThreshold: item?.maxThreshold || 0,
    supplier: item?.supplier || '',
    expiration: item?.expiration || '',
    notes: item?.notes || ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{item ? 'Edit Inventory Item' : 'Add New Inventory Item'}</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <FormControl fullWidth>
            <InputLabel>Type</InputLabel>
            <Select
              name="type"
              value={formData.type}
              onChange={handleChange}
              label="Type"
              required
            >
              <MenuItem value="feed">Feed</MenuItem>
              <MenuItem value="medicine">Medicine</MenuItem>
              <MenuItem value="equipment">Equipment</MenuItem>
              <MenuItem value="supplies">Supplies</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              name="category"
              value={formData.category}
              onChange={handleChange}
              label="Category"
              required
            >
              {api.get('/inventory/types').then(response => {
                const categories = response.data.find(type => type.id === formData.type)?.categories || [];
                return categories.map(category => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ));
              })}
            </Select>
          </FormControl>

          <TextField
            name="name"
            label="Name"
            value={formData.name}
            onChange={handleChange}
            required
            fullWidth
          />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              name="quantity"
              label="Quantity"
              value={formData.quantity}
              onChange={handleChange}
              type="number"
              required
              fullWidth
            />
            <TextField
              name="minThreshold"
              label="Min Threshold"
              value={formData.minThreshold}
              onChange={handleChange}
              type="number"
              required
              fullWidth
            />
            <TextField
              name="maxThreshold"
              label="Max Threshold"
              value={formData.maxThreshold}
              onChange={handleChange}
              type="number"
              required
              fullWidth
            />
          </Box>

          <TextField
            name="supplier"
            label="Supplier"
            value={formData.supplier}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            name="expiration"
            label="Expiration Date"
            value={formData.expiration}
            onChange={handleChange}
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            name="notes"
            label="Notes"
            value={formData.notes}
            onChange={handleChange}
            multiline
            rows={3}
            fullWidth
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit" variant="contained" color="primary">
          {item ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InventoryForm;
