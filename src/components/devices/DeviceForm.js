import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { addDevice, updateDevice } from '../../store/devicesSlice';

const DeviceForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const selectedDevice = useSelector((state) => state.devices.selectedDevice);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    status: 'offline',
    firmwareVersion: '',
    updateInterval: 300,
  });

  React.useEffect(() => {
    if (id && selectedDevice) {
      setFormData(selectedDevice);
    }
  }, [id, selectedDevice]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await dispatch(updateDevice({ id, deviceData: formData }));
      } else {
        await dispatch(addDevice(formData));
      }
      navigate('/dashboard/devices');
    } catch (error) {
      console.error('Error saving device:', error);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard/devices');
  };

  const deviceTypes = [
    { value: 'temperature', label: 'Temperature Sensor' },
    { value: 'humidity', label: 'Humidity Sensor' },
    { value: 'feed', label: 'Feed Dispenser' },
    { value: 'water', label: 'Water Dispenser' },
    { value: 'light', label: 'Light Controller' },
  ];

  const statusOptions = [
    { value: 'online', label: 'Online' },
    { value: 'offline', label: 'Offline' },
    { value: 'maintenance', label: 'Maintenance' },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        {id ? 'Edit Device' : 'Add New Device'}
      </Typography>
      
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Device Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          margin="normal"
          required
        />
        
        <FormControl fullWidth margin="normal">
          <InputLabel>Type</InputLabel>
          <Select
            name="type"
            value={formData.type}
            onChange={handleChange}
            label="Type"
            required
          >
            {deviceTypes.map((type) => (
              <MenuItem key={type.value} value={type.value}>
                {type.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel>Status</InputLabel>
          <Select
            name="status"
            value={formData.status}
            onChange={handleChange}
            label="Status"
          >
            {statusOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          label="Firmware Version"
          name="firmwareVersion"
          value={formData.firmwareVersion}
          onChange={handleChange}
          margin="normal"
        />

        <TextField
          fullWidth
          label="Update Interval (seconds)"
          name="updateInterval"
          type="number"
          value={formData.updateInterval}
          onChange={handleChange}
          margin="normal"
          inputProps={{
            min: 30,
            max: 3600,
          }}
        />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          <Button variant="outlined" onClick={handleCancel} sx={{ mr: 2 }}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary">
            {id ? 'Update Device' : 'Add Device'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default DeviceForm;
