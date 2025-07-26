import React from 'react';
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    Avatar,
    ListItem,
    ListItemText,
    Divider,
    List,
    Paper,
    Button,
} from '@mui/material';
import {
    Pets as PetsIcon,
    TrendingUp as TrendingUpIcon,
    Settings as SettingsIcon,
    Analytics as AnalyticsIcon,
    Receipt as ReceiptIcon,
    Business as BusinessIcon,
    Water as WaterIcon,
    LocalDining as LocalDiningIcon,
    Warning as WarningIcon,
} from '@mui/icons-material';
import { useFarmerGuard } from '../utils/rbacMiddleware';

const FarmerDashboard = () => {
    const isFarmer = useFarmerGuard();

    if (!isFarmer) {
        return <div>You do not have permission to access this page</div>;
    }

    // Farmer-specific stats
    const stats = {
        totalFlocks: 5,
        activeFlocks: 3,
        feedStock: 1000,
        waterLevel: 80,
        recentAlerts: 2,
        farmSize: 'Medium',
        recentFlocks: [
            { id: 1, flock_name: 'Flock A', flock_size: 500, status: 'Healthy' },
            { id: 2, flock_name: 'Flock B', flock_size: 300, status: 'Monitoring' },
            { id: 3, flock_name: 'Flock C', flock_size: 400, status: 'Healthy' }
        ],
        alerts: [
            { id: 1, type: 'Feed', message: 'Low feed stock alert', timestamp: '2025-07-25' },
            { id: 2, type: 'Water', message: 'Water level low', timestamp: '2025-07-25' }
        ]
    };

    return (
        <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
                {/* Farmer Overview Cards */}
                <Grid item xs={12} md={3}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                                    <PetsIcon />
                                </Avatar>
                                <Typography variant="h6">
                                    Total Flocks
                                </Typography>
                            </Box>
                            <Typography variant="h4" component="div" sx={{ mb: 1 }}>
                                {stats.totalFlocks}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Active: {stats.activeFlocks}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={3}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                                    <LocalDiningIcon />
                                </Avatar>
                                <Typography variant="h6">
                                    Feed Stock
                                </Typography>
                            </Box>
                            <Typography variant="h4" component="div" sx={{ mb: 1 }}>
                                {stats.feedStock} kg
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Remaining Feed
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={3}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Avatar sx={{ bgcolor: 'info.main', mr: 2 }}>
                                    <WaterIcon />
                                </Avatar>
                                <Typography variant="h6">
                                    Water Level
                                </Typography>
                            </Box>
                            <Typography variant="h4" component="div" sx={{ mb: 1 }}>
                                {stats.waterLevel}%
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Current Level
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={3}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                                    <WarningIcon />
                                </Avatar>
                                <Typography variant="h6">
                                    Alerts
                                </Typography>
                            </Box>
                            <Typography variant="h4" component="div" sx={{ mb: 1 }}>
                                {stats.recentAlerts}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Active Alerts
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Recent Flocks Section */}
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" component="div" sx={{ mb: 3 }}>
                                Recent Flocks
                            </Typography>
                            <List>
                                {stats.recentFlocks.map((flock) => (
                                    <React.Fragment key={flock.id}>
                                        <ListItem>
                                            <ListItemText
                                                primary={`${flock.flock_name} (${flock.flock_size} birds)`}
                                                secondary={`Status: ${flock.status}`}
                                            />
                                        </ListItem>
                                        <Divider />
                                    </React.Fragment>
                                ))}
                            </List>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Quick Actions */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" component="div" sx={{ mb: 3 }}>
                                Quick Actions
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        startIcon={<PetsIcon />}
                                        sx={{ mb: 2 }}
                                    >
                                        Add New Flock
                                    </Button>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        startIcon={<SettingsIcon />}
                                        sx={{ mb: 2 }}
                                    >
                                        Farm Settings
                                    </Button>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Alerts Section */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" component="div" sx={{ mb: 3 }}>
                                Recent Alerts
                            </Typography>
                            <List>
                                {stats.alerts.map((alert) => (
                                    <React.Fragment key={alert.id}>
                                        <ListItem>
                                            <ListItemText
                                                primary={alert.message}
                                                secondary={alert.timestamp}
                                            />
                                        </ListItem>
                                        <Divider />
                                    </React.Fragment>
                                ))}
                            </List>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default FarmerDashboard;
