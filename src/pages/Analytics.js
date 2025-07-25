import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid,
  Paper
} from '@mui/material';
import { 
  TrendingUp as TrendingUpIcon, 
  TrendingDown as TrendingDownIcon 
} from '@mui/icons-material';
import AnalyticsChart from '../components/analytics/AnalyticsChart';
import KpiCard from '../components/analytics/KpiCard';
import api from '../utils/api';

const AnalyticsPage = () => {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    totalRevenue: 0,
    activeSubscriptions: 0,
    newSubscriptions: 0,
    payments: [],
    subscriptions: [],
    devices: [],
    sensors: []
  });

  const fetchAnalyticsData = async () => {
    try {
      const [payments, subscriptions, devices, sensors] = await Promise.all([
        api.get('/analytics/payments'),
        api.get('/analytics/subscriptions'),
        api.get('/analytics/devices'),
        api.get('/analytics/sensors')
      ]);

      const totalRevenue = payments.data.reduce((sum, payment) => sum + payment.amount, 0);
      const activeSubscriptions = subscriptions.data.filter(sub => sub.status === 'active').length;
      const newSubscriptions = subscriptions.data.filter(sub => 
        new Date(sub.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      ).length;

      setMetrics({
        totalRevenue,
        activeSubscriptions,
        newSubscriptions,
        payments: payments.data,
        subscriptions: subscriptions.data,
        devices: devices.data,
        sensors: sensors.data
      });
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading analytics data...</Typography>
      </Box>
    );
  }

  // Prepare chart data
  const revenueData = {
    labels: metrics.payments.map(payment => new Date(payment.paymentDate).toLocaleDateString()),
    datasets: [{
      label: 'Revenue',
      data: metrics.payments.map(payment => payment.amount),
      fill: false,
      borderColor: '#2196f3',
      tension: 0.1
    }]
  };

  const subscriptionData = {
    labels: metrics.subscriptions.map(sub => new Date(sub.startDate).toLocaleDateString()),
    datasets: [{
      label: 'Active Subscriptions',
      data: metrics.subscriptions.map(sub => sub.status === 'active' ? 1 : 0),
      fill: false,
      borderColor: '#4CAF50',
      tension: 0.1
    }]
  };

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* KPI Cards */}
        <Grid item xs={12} md={3}>
          <KpiCard
            title="Total Revenue"
            value={`$${metrics.totalRevenue.toFixed(2)}`}
            change={25.6}
            isPositive={true}
            icon={<TrendingUpIcon sx={{ color: '#4CAF50' }} />}
            tooltip="Revenue increase compared to last month"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <KpiCard
            title="Active Subscriptions"
            value={metrics.activeSubscriptions}
            change={12.4}
            isPositive={true}
            icon={<TrendingUpIcon sx={{ color: '#4CAF50' }} />}
            tooltip="Active subscriptions growth"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <KpiCard
            title="New Subscriptions"
            value={metrics.newSubscriptions}
            change={-8.2}
            isPositive={false}
            icon={<TrendingDownIcon sx={{ color: '#F44336' }} />}
            tooltip="New subscriptions trend"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <KpiCard
            title="Connected Devices"
            value={metrics.devices.length}
            change={15.3}
            isPositive={true}
            icon={<TrendingUpIcon sx={{ color: '#4CAF50' }} />}
            tooltip="Connected devices growth"
          />
        </Grid>

        {/* Charts */}
        <Grid item xs={12} md={6}>
          <AnalyticsChart
            title="Revenue Over Time"
            data={revenueData}
            options={{
              timeRange: '30d',
              onChange: (options) => {
                // Handle time range change
              }
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <AnalyticsChart
            title="Subscription Trends"
            data={subscriptionData}
            options={{
              timeRange: '30d',
              onChange: (options) => {
                // Handle time range change
              }
            }}
          />
        </Grid>

        {/* Device and Sensor Stats */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Device Statistics
            </Typography>
            <Typography variant="body1">
              Total devices: {metrics.devices.length}
            </Typography>
            <Typography variant="body1">
              Active devices: {metrics.devices.filter(d => d.status === 'active').length}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Sensor Statistics
            </Typography>
            <Typography variant="body1">
              Total sensors: {metrics.sensors.length}
            </Typography>
            <Typography variant="body1">
              Active sensors: {metrics.sensors.filter(s => s.status === 'active').length}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AnalyticsPage; 