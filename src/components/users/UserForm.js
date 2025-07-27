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
  Chip,
  Box,
  Typography,
  Divider
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon
} from '@mui/icons-material';

const UserForm = ({ open, onClose, user, roles, onSubmit, onDelete }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
                    role: user?.role || 'manager',
    status: user?.status || 'active'
  });

  const handleSubmit = () => {
    onSubmit(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {user ? 'Edit User' : 'Create User'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <TextField
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            fullWidth
            margin="normal"
            InputProps={{
              startAdornment: <PersonIcon sx={{ mr: 1 }} />
            }}
          />
          <TextField
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            fullWidth
            margin="normal"
            InputProps={{
              startAdornment: <EmailIcon sx={{ mr: 1 }} />
            }}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Role</InputLabel>
            <Select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
              {roles.map((role) => (
                <MenuItem key={role.id} value={role.id}>
                  {role.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Status</InputLabel>
            <Select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </Select>
          </FormControl>
          {user && (
            <Box sx={{ mt: 3, p: 2, bgcolor: 'background.neutral' }}>
              <Typography variant="subtitle2" gutterBottom>
                Subscription Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Plan:</Typography>
                <Chip
                  size="small"
                  label={user.subscription}
                  color={user.paymentStatus === 'paid' ? 'success' : 'warning'}
                />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Payment Status:</Typography>
                <Chip
                  size="small"
                  label={user.paymentStatus}
                  color={user.paymentStatus === 'paid' ? 'success' : 'warning'}
                />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">Last Login:</Typography>
                <Typography variant="body2">
                  {new Date(user.lastLogin).toLocaleString()}
                </Typography>
              </Box>
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        {user && (
          <Button
            onClick={() => onDelete(user.id)}
            color="error"
            variant="outlined"
          >
            Delete
          </Button>
        )}
        <Button onClick={handleSubmit} variant="contained">
          {user ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserForm;
