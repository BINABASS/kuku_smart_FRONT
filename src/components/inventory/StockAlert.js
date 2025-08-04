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
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
  Collapse,
  Badge,
  Tooltip,
} from '@mui/material';
import {
  Warning,
  Error,
  CheckCircle,
  Info,
  ExpandMore,
  ExpandLess,
  Refresh,
  Notifications,
  NotificationsOff,
  Inventory,
  Schedule,
} from '@mui/icons-material';
import api from '../../api/client';

const StockAlert = () => {
  const [items, setItems] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState(true);

  // Fetch inventory items
  const fetchItems = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/inventory/items/');
      setItems(response.data);
    } catch (err) {
      setError('Failed to fetch inventory items');
      console.error('Error fetching items:', err);
    } finally {
      setLoading(false);
    }
  };

  // Generate alerts based on stock levels and expiry dates
  const generateAlerts = () => {
    const newAlerts = [];
    const now = new Date();
    
    items.forEach(item => {
      // Low stock alerts
      if (item.current_stock <= item.min_stock_level) {
        newAlerts.push({
          id: `low-stock-${item.id}`,
          itemId: item.id,
          itemName: item.name,
          type: 'warning',
          severity: item.current_stock === 0 ? 'critical' : 'high',
          message: `${item.name} is low on stock (${item.current_stock} ${item.unit} remaining)`,
          category: 'low_stock',
          timestamp: new Date(),
          currentStock: item.current_stock,
          minStock: item.min_stock_level,
        });
      }

      // Overstock alerts
      if (item.current_stock >= item.max_stock_level) {
        newAlerts.push({
          id: `overstock-${item.id}`,
          itemId: item.id,
          itemName: item.name,
          type: 'info',
          severity: 'medium',
          message: `${item.name} is overstocked (${item.current_stock} ${item.unit})`,
          category: 'overstock',
          timestamp: new Date(),
          currentStock: item.current_stock,
          maxStock: item.max_stock_level,
        });
      }

      // Expiry date alerts
      if (item.expiry_date) {
        const expiryDate = new Date(item.expiry_date);
        const daysUntilExpiry = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));
        
        if (daysUntilExpiry <= 30 && daysUntilExpiry > 0) {
          newAlerts.push({
            id: `expiry-${item.id}`,
            itemId: item.id,
            itemName: item.name,
            type: 'warning',
            severity: daysUntilExpiry <= 7 ? 'critical' : 'high',
            message: `${item.name} expires in ${daysUntilExpiry} days`,
            category: 'expiry',
            timestamp: new Date(),
            expiryDate: item.expiry_date,
            daysUntilExpiry,
          });
        } else if (daysUntilExpiry <= 0) {
          newAlerts.push({
            id: `expired-${item.id}`,
            itemId: item.id,
            itemName: item.name,
            type: 'error',
            severity: 'critical',
            message: `${item.name} has expired`,
            category: 'expired',
            timestamp: new Date(),
            expiryDate: item.expiry_date,
            daysUntilExpiry,
          });
        }
      }
    });

    setAlerts(newAlerts);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    if (items.length > 0) {
      generateAlerts();
    }
  }, [items]);

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
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'success';
      default: return 'info';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'low_stock': return 'error';
      case 'overstock': return 'warning';
      case 'expiry': return 'warning';
      case 'expired': return 'error';
      default: return 'default';
    }
  };

  const handleDismissAlert = (alertId) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const criticalAlerts = alerts.filter(alert => alert.severity === 'critical');
  const highAlerts = alerts.filter(alert => alert.severity === 'high');
  const mediumAlerts = alerts.filter(alert => alert.severity === 'medium');

  const lowStockItems = items.filter(item => item.current_stock <= item.min_stock_level);
  const overstockedItems = items.filter(item => item.current_stock >= item.max_stock_level);
  const expiringItems = items.filter(item => {
    if (!item.expiry_date) return false;
    const expiryDate = new Date(item.expiry_date);
    const daysUntilExpiry = Math.ceil((expiryDate - new Date()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  });

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
        <Box display="flex" alignItems="center" gap={2}>
          <Typography variant="h5" component="h2">
            Stock Alerts
          </Typography>
          <Badge badgeContent={alerts.length} color="error">
            <Notifications color="action" />
          </Badge>
        </Box>
        <Box display="flex" gap={1}>
          <Tooltip title="Refresh">
            <IconButton onClick={fetchItems} disabled={loading}>
              <Refresh />
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
                icon={<Inventory />}
                label={`Items: ${items.length}`}
                color="success"
                variant="outlined"
              />
            </Box>
          </CardContent>
        </Card>
      </Collapse>

      {/* Active Alerts */}
      {alerts.length > 0 ? (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Active Alerts ({alerts.length})
            </Typography>
            <List>
              {alerts.map((alert) => (
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
                          {alert.itemName}
                        </Typography>
                        <Box display="flex" gap={1} alignItems="center">
                          <Chip
                            label={alert.category.replace('_', ' ')}
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
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box display="flex" alignItems="center" gap={2}>
              <CheckCircle color="success" />
              <Typography variant="h6" color="success.main">
                All inventory items are healthy!
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              No active stock alerts at this time.
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* Stock Overview */}
      <Grid container spacing={3}>
        {/* Low Stock Items */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Low Stock Items ({lowStockItems.length})
              </Typography>
              <List dense>
                {lowStockItems.map((item) => (
                  <ListItem key={item.id} divider>
                    <ListItemIcon>
                      <Warning color="warning" />
                    </ListItemIcon>
                    <ListItemText
                      primary={item.name}
                      secondary={`${item.current_stock} ${item.unit} remaining (Min: ${item.min_stock_level})`}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Overstocked Items */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Overstocked Items ({overstockedItems.length})
              </Typography>
              <List dense>
                {overstockedItems.map((item) => (
                  <ListItem key={item.id} divider>
                    <ListItemIcon>
                      <Info color="info" />
                    </ListItemIcon>
                    <ListItemText
                      primary={item.name}
                      secondary={`${item.current_stock} ${item.unit} (Max: ${item.max_stock_level})`}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Expiring Items */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Expiring Soon ({expiringItems.length})
              </Typography>
              <List dense>
                {expiringItems.map((item) => {
                  const expiryDate = new Date(item.expiry_date);
                  const daysUntilExpiry = Math.ceil((expiryDate - new Date()) / (1000 * 60 * 60 * 24));
                  
                  return (
                    <ListItem key={item.id} divider>
                      <ListItemIcon>
                        <Schedule color="warning" />
                      </ListItemIcon>
                      <ListItemText
                        primary={item.name}
                        secondary={`Expires in ${daysUntilExpiry} days (${expiryDate.toLocaleDateString()})`}
                      />
                    </ListItem>
                  );
                })}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Inventory Summary */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Inventory Summary
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h4" color="primary">
                  {items.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Items
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h4" color="error">
                  {lowStockItems.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Low Stock
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h4" color="warning">
                  {overstockedItems.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Overstocked
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h4" color="warning">
                  {expiringItems.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Expiring Soon
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default StockAlert; 