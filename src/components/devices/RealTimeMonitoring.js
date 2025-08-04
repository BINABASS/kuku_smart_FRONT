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
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  Wifi,
  WifiOff,
  Warning,
  CheckCircle,
  Error,
  Refresh,
  Settings,
  Visibility,
} from '@mui/icons-material';
import api from '../../api/client';

const RealTimeMonitoring = () => {
  const [devices, setDevices] = useState([]);
  const [sensors, setSensors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [alerts, setAlerts] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Fetch devices and sensors data
  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [devicesResponse, sensorsResponse] = await Promise.all([
        api.get('/devices/'),
        api.get('/sensors/')
      ]);
      
      setDevices(devicesResponse.data);
      setSensors(sensorsResponse.data);
      setLastUpdate(new Date());
    } catch (err) {
      setError('Failed to fetch real-time data');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh every 30 seconds
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Generate alerts based on device and sensor status
  useEffect(() => {
    const newAlerts = [];
    
    // Device alerts
    devices.forEach(device => {
      if (device.status === 'offline') {
        newAlerts.push({
          id: `device-${device.id}`,
          type: 'warning',
          message: `${device.name} is offline`,
          timestamp: new Date()
        });
      } else if (device.status === 'error') {
        newAlerts.push({
          id: `device-${device.id}`,
          type: 'error',
          message: `${device.name} has an error`,
          timestamp: new Date()
        });
      }
    });

    // Sensor alerts
    sensors.forEach(sensor => {
      if (sensor.status === 'error') {
        newAlerts.push({
          id: `sensor-${sensor.id}`,
          type: 'error',
          message: `${sensor.name} sensor has an error`,
          timestamp: new Date()
        });
      }
      
      // Threshold alerts
      if (sensor.min_threshold && sensor.current_value < sensor.min_threshold) {
        newAlerts.push({
          id: `sensor-${sensor.id}-low`,
          type: 'warning',
          message: `${sensor.name} value (${sensor.current_value}${sensor.unit}) is below threshold (${sensor.min_threshold}${sensor.unit})`,
          timestamp: new Date()
        });
      }
      
      if (sensor.max_threshold && sensor.current_value > sensor.max_threshold) {
        newAlerts.push({
          id: `sensor-${sensor.id}-high`,
          type: 'warning',
          message: `${sensor.name} value (${sensor.current_value}${sensor.unit}) is above threshold (${sensor.max_threshold}${sensor.unit})`,
          timestamp: new Date()
        });
      }
    });

    setAlerts(newAlerts);
  }, [devices, sensors]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'success';
      case 'offline': return 'error';
      case 'maintenance': return 'warning';
      case 'error': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'online': return <Wifi />;
      case 'offline': return <WifiOff />;
      case 'maintenance': return <Settings />;
      case 'error': return <Error />;
      default: return <Visibility />;
    }
  };

  const getAlertColor = (type) => {
    switch (type) {
      case 'warning': return 'warning';
      case 'error': return 'error';
      case 'info': return 'info';
      case 'success': return 'success';
      default: return 'info';
    }
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
          Real-Time Monitoring
        </Typography>
        <Box display="flex" alignItems="center" gap={2}>
          <Typography variant="body2" color="text.secondary">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </Typography>
          <IconButton onClick={fetchData} disabled={loading}>
            <Refresh />
          </IconButton>
        </Box>
      </Box>

      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Alerts Section */}
      {alerts.length > 0 && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Active Alerts ({alerts.length})
            </Typography>
            <List dense>
              {alerts.slice(0, 5).map((alert) => (
                <ListItem key={alert.id}>
                  <ListItemIcon>
                    {alert.type === 'warning' ? <Warning color="warning" /> : <Error color="error" />}
                  </ListItemIcon>
                  <ListItemText
                    primary={alert.message}
                    secondary={alert.timestamp.toLocaleTimeString()}
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      )}

      <Grid container spacing={3}>
        {/* Devices Overview */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Devices Status ({devices.length})
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
                {devices.map((device) => (
                  <Chip
                    key={device.id}
                    icon={getStatusIcon(device.status)}
                    label={`${device.name} (${device.type})`}
                    color={getStatusColor(device.status)}
                    variant="outlined"
                    size="small"
                  />
                ))}
              </Box>
              <Typography variant="body2" color="text.secondary">
                Online: {devices.filter(d => d.status === 'online').length} | 
                Offline: {devices.filter(d => d.status === 'offline').length} | 
                Error: {devices.filter(d => d.status === 'error').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Sensors Overview */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Sensors Status ({sensors.length})
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
                {sensors.map((sensor) => (
                  <Chip
                    key={sensor.id}
                    icon={sensor.status === 'active' ? <CheckCircle /> : <Error />}
                    label={`${sensor.name}: ${sensor.current_value}${sensor.unit}`}
                    color={sensor.status === 'active' ? 'success' : 'error'}
                    variant="outlined"
                    size="small"
                  />
                ))}
              </Box>
              <Typography variant="body2" color="text.secondary">
                Active: {sensors.filter(s => s.status === 'active').length} | 
                Inactive: {sensors.filter(s => s.status === 'inactive').length} | 
                Error: {sensors.filter(s => s.status === 'error').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Live Data Display */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Live Sensor Data
              </Typography>
              <Grid container spacing={2}>
                {sensors.map((sensor) => (
                  <Grid item xs={12} sm={6} md={4} key={sensor.id}>
                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="h6" color="primary">
                        {sensor.name}
                      </Typography>
                      <Typography variant="h4" sx={{ my: 1 }}>
                        {sensor.current_value}{sensor.unit}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {sensor.type} • {sensor.status}
                      </Typography>
                      {sensor.min_threshold && sensor.max_threshold && (
                        <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                          Range: {sensor.min_threshold} - {sensor.max_threshold}{sensor.unit}
                        </Typography>
                      )}
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Device Details */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Device Details
              </Typography>
              <Grid container spacing={2}>
                {devices.map((device) => (
                  <Grid item xs={12} sm={6} md={4} key={device.id}>
                    <Paper sx={{ p: 2 }}>
                      <Box display="flex" alignItems="center" gap={1} mb={1}>
                        {getStatusIcon(device.status)}
                        <Typography variant="h6">
                          {device.name}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        Type: {device.type}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Status: {device.status}
                      </Typography>
                      {device.location && (
                        <Typography variant="body2" color="text.secondary">
                          Location: {device.location}
                        </Typography>
                      )}
                      <Typography variant="body2" color="text.secondary">
                        Firmware: {device.firmware_version}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Last Seen: {new Date(device.last_seen).toLocaleString()}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RealTimeMonitoring; 