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
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchDevices, removeDevice } from '../../store/devicesSlice';

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

      {status === 'loading' ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error">Error loading devices: {error}</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Last Seen</TableCell>
                <TableCell>Firmware</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((device) => (
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
                  <TableCell>{new Date(device.lastSeen).toLocaleString()}</TableCell>
                  <TableCell>{device.firmwareVersion}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(device.id)} color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(device.id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default DeviceList;
