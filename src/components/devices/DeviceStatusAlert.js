import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  IconButton,
  Collapse,
  Badge,
  Tooltip,
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
} from '@mui/material';
import {
  Warning,
  Error,
  CheckCircle,
  Info,
  ExpandMore,
  ExpandLess,
  Settings,
  Notifications,
  NotificationsOff,
  Refresh,
} from '@mui/icons-material';
import api from '../../api/client';

const DeviceStatusAlert = () => {
  const [devices, setDevices] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState(true);
  const [alertSettings, setAlertSettings] = useState({
    enabled: true,
    checkInterval: 30, // seconds
    severity: 'warning', // warning, error, info
  });
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Fetch devices data
  const fetchDevices = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/devices/');
      setDevices(response.data);
    } catch (err) {
      setError('Failed to fetch devices');
      console.error('Error fetching devices:', err);
    } finally {
      setLoading(false);
    }
  };

  // Generate alerts based on device status
  const generateAlerts = () => {
    const newAlerts = [];
    
    devices.forEach(device => {
      const lastSeen = new Date(device.last_seen);
      const now = new Date();
      const timeDiff = (now - lastSeen) / 1000 / 60; // minutes
      
      // Device offline for more than 5 minutes
      if (device.status === 'offline' && timeDiff > 5) {
        newAlerts.push({
          id: `device-offline-${device.id}`,
          deviceId: device.id,
          deviceName: device.name,
          type: 'error',
          severity: 'high',
          message: `${device.name} has been offline for ${Math.round(timeDiff)} minutes`,
          timestamp: new Date(),
          category: 'connectivity'
        });
      }
      
      // Device in error state
      if (device.status === 'error') {
        newAlerts.push({
          id: `device-error-${device.id}`,
          deviceId: device.id,
          deviceName: device.name,
          type: 'error',
          severity: 'critical',
          message: `${device.name} is experiencing errors`,
          timestamp: new Date(),
          category: 'system'
        });
      }
      
      // Device in maintenance mode
      if (device.status === 'maintenance') {
        newAlerts.push({
          id: `device-maintenance-${device.id}`,
          deviceId: device.id,
          deviceName: device.name,
          type: 'warning',
          severity: 'medium',
          message: `${device.name} is under maintenance`,
          timestamp: new Date(),
          category: 'maintenance'
        });
      }
      
      // Device not responding (no recent activity)
      if (timeDiff > 10) {
        newAlerts.push({
          id: `device-unresponsive-${device.id}`,
          deviceId: device.id,
          deviceName: device.name,
          type: 'warning',
          severity: 'medium',
          message: `${device.name} has not responded for ${Math.round(timeDiff)} minutes`,
          timestamp: new Date(),
          category: 'connectivity'
        });
      }
    });
    
    setAlerts(newAlerts);
  };

  // Auto-refresh and alert generation
  useEffect(() => {
    fetchDevices();
    const interval = setInterval(() => {
      fetchDevices();
      generateAlerts();
    }, alertSettings.checkInterval * 1000);
    
    return () => clearInterval(interval);
  }, [alertSettings.checkInterval]);

  // Generate alerts when devices change
  useEffect(() => {
    if (devices.length > 0) {
      generateAlerts();
    }
  }, [devices]);

  const getAlertIcon = (type) => {
    switch (type) {
      case 'error': return <Error color="error" />;
      case 'warning': return <Warning color="warning" />;
      case 'info': return <Info color="info" />;
      case 'success': return <CheckCircle color="success" />;
      default: return <Info color="info" />;
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'error';
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'info';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'connectivity': return 'primary';
      case 'system': return 'error';
      case 'maintenance': return 'warning';
      case 'performance': return 'info';
      default: return 'default';
    }
  };

  const handleDismissAlert = (alertId) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const handleSettingsSave = () => {
    setSettingsOpen(false);
    // In a real app, you'd save these settings to backend/localStorage
    console.log('Alert settings saved:', alertSettings);
  };

  const activeAlerts = alerts.filter(alert => 
    alertSettings.enabled && 
    (alertSettings.severity === 'all' || alert.severity === alertSettings.severity)
  );

  const criticalAlerts = activeAlerts.filter(alert => alert.severity === 'critical');
  const highAlerts = activeAlerts.filter(alert => alert.severity === 'high');
  const mediumAlerts = activeAlerts.filter(alert => alert.severity === 'medium');

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center" gap={2}>
          <Typography variant="h5" component="h2">
            Device Status Alerts
          </Typography>
          <Badge badgeContent={activeAlerts.length} color="error">
            <Notifications color="action" />
          </Badge>
        </Box>
        <Box display="flex" gap={1}>
          <Tooltip title="Refresh">
            <IconButton onClick={fetchDevices} disabled={loading}>
              <Refresh />
            </IconButton>
          </Tooltip>
          <Tooltip title="Alert Settings">
            <IconButton onClick={() => setSettingsOpen(true)}>
              <Settings />
            </IconButton>
          </Tooltip>
          <IconButton onClick={() => setExpanded(!expanded)}>
            {expanded ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </Box>
      </Box>

      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Alert Summary */}
      <Collapse in={expanded}>
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Alert Summary
            </Typography>
            <Box display="flex" gap={2} flexWrap="wrap">
              <Chip
                icon={<Error />}
                label={`Critical: ${criticalAlerts.length}`}
                color="error"
                variant="outlined"
              />
              <Chip
                icon={<Warning />}
                label={`High: ${highAlerts.length}`}
                color="warning"
                variant="outlined"
              />
              <Chip
                icon={<Info />}
                label={`Medium: ${mediumAlerts.length}`}
                color="info"
                variant="outlined"
              />
              <Chip
                icon={<CheckCircle />}
                label={`Devices: ${devices.length}`}
                color="success"
                variant="outlined"
              />
            </Box>
          </CardContent>
        </Card>
      </Collapse>

      {/* Active Alerts */}
      {activeAlerts.length > 0 ? (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Active Alerts ({activeAlerts.length})
            </Typography>
            <List>
              {activeAlerts.map((alert) => (
                <ListItem
                  key={alert.id}
                  sx={{
                    border: 1,
                    borderColor: getSeverityColor(alert.severity),
                    borderRadius: 1,
                    mb: 1,
                    backgroundColor: `${getSeverityColor(alert.severity)}.50`
                  }}
                >
                  <ListItemIcon>
                    {getAlertIcon(alert.type)}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="subtitle1" fontWeight="bold">
                          {alert.deviceName}
                        </Typography>
                        <Box display="flex" gap={1} alignItems="center">
                          <Chip
                            label={alert.category}
                            size="small"
                            color={getCategoryColor(alert.category)}
                          />
                          <Chip
                            label={alert.severity}
                            size="small"
                            color={getSeverityColor(alert.severity)}
                          />
                        </Box>
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {alert.message}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {alert.timestamp.toLocaleString()}
                        </Typography>
                      </Box>
                    }
                  />
                  <IconButton
                    size="small"
                    onClick={() => handleDismissAlert(alert.id)}
                  >
                    <NotificationsOff />
                  </IconButton>
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" gap={2}>
              <CheckCircle color="success" />
              <Typography variant="h6" color="success.main">
                All devices are healthy!
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              No active alerts at this time.
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* Device Status Overview */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Device Status Overview
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={1}>
            {devices.map((device) => (
              <Chip
                key={device.id}
                icon={getAlertIcon(device.status === 'online' ? 'success' : 'error')}
                label={`${device.name} (${device.status})`}
                color={device.status === 'online' ? 'success' : 'error'}
                variant="outlined"
              />
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* Settings Dialog */}
      <Dialog open={settingsOpen} onClose={() => setSettingsOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Alert Settings</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Alert Severity</InputLabel>
              <Select
                value={alertSettings.severity}
                onChange={(e) => setAlertSettings(prev => ({ ...prev, severity: e.target.value }))}
                label="Alert Severity"
              >
                <MenuItem value="all">All Alerts</MenuItem>
                <MenuItem value="critical">Critical Only</MenuItem>
                <MenuItem value="high">High & Critical</MenuItem>
                <MenuItem value="medium">Medium & Above</MenuItem>
                <MenuItem value="low">All Levels</MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              fullWidth
              label="Check Interval (seconds)"
              type="number"
              value={alertSettings.checkInterval}
              onChange={(e) => setAlertSettings(prev => ({ 
                ...prev, 
                checkInterval: parseInt(e.target.value) || 30 
              }))}
              sx={{ mb: 2 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSettingsOpen(false)}>Cancel</Button>
          <Button onClick={handleSettingsSave} variant="contained">
            Save Settings
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DeviceStatusAlert; 