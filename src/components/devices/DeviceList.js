import React from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  IconButton,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchDevices, removeDevice, clearError } from '../../store/devicesSlice';

const DeviceList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, status, error } = useSelector((state) => state.devices);

  React.useEffect(() => {
    dispatch(fetchDevices());
  }, [dispatch]);

  const handleEdit = (id) => {
    navigate(`/dashboard/devices/${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this device?')) {
      await dispatch(removeDevice(id));
    }
  };

  const handleClearError = () => {
    dispatch(clearError());
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'online':
        return 'success';
      case 'offline':
        return 'error';
      case 'maintenance':
        return 'warning';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Devices</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/dashboard/devices/new')}
        >
          Add Device
        </Button>
      </Box>

      {error && (
        <Alert severity="error" onClose={handleClearError} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {status === 'loading' ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Last Seen</TableCell>
                <TableCell>Firmware</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography variant="body2" color="textSecondary">
                      No devices found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                items.map((device) => (
                  <TableRow key={device.id}>
                    <TableCell>{device.name}</TableCell>
                    <TableCell>{device.type}</TableCell>
                    <TableCell>
                      <Typography
                        sx={{
                          color: `text.${getStatusColor(device.status)}`,
                          fontWeight: 'bold',
                        }}
                      >
                        {device.status}
                      </Typography>
                    </TableCell>
                    <TableCell>{device.location || 'N/A'}</TableCell>
                    <TableCell>{formatDate(device.last_seen)}</TableCell>
                    <TableCell>{device.firmware_version}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleEdit(device.id)} color="primary">
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(device.id)} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default DeviceList;
