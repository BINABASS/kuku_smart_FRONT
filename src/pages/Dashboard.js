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
    Dashboard as DashboardIcon,
    People as PeopleIcon,
    Pets as PetsIcon,
    TrendingUp as TrendingUpIcon,
    Settings as SettingsIcon,
    Analytics as AnalyticsIcon,
    Receipt as ReceiptIcon,
    Business as BusinessIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();
    
    // Mock data for development
    const stats = {
        totalBatches: 15,
        activeBatches: 5,
        revenue: 25000,
        expenses: 18000,
        profit: 7000,
        recentManagers: [
            { name: 'John Doe', email: 'john@example.com' },
            { name: 'Jane Smith', email: 'jane@example.com' },
            { name: 'Mike Johnson', email: 'mike@example.com' },
            { name: 'Sarah Wilson', email: 'sarah@example.com' },
            { name: 'Chris Brown', email: 'chris@example.com' }
        ],
        environmentAlerts: 3,
        diseaseAlerts: 2,
        feedWaterAlerts: 1,
        // Added properties below
        recentBatches: [
            { id: 1, batch_name: 'Batch A', batch_status: 1 },
            { id: 2, batch_name: 'Batch B', batch_status: 0 },
            { id: 3, batch_name: 'Batch C', batch_status: 1 }
        ],
        feedAlerts: 1,
        waterAlerts: 0,
    };

    const handleQuickAction = (action) => {
        switch (action) {
            case 'addBatch':
                navigate('/dashboard/batches');
                break;
            case 'registerManager':
                navigate('/dashboard/managers');
                break;
            case 'addBreed':
                navigate('/dashboard/breeds');
                break;
            case 'systemSettings':
                navigate('/dashboard/settings');
                break;
            default:
                break;
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
                {/* Overview Cards */}
                <Grid item xs={12} md={3}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                                    <DashboardIcon />
                                </Avatar>
                                <Typography variant="h6">
                                    Total Batches
                                </Typography>
                            </Box>
                            <Typography variant="h4" component="div" sx={{ mb: 1 }}>
                                {stats.totalBatches}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Active Batches: {stats.activeBatches}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={3}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
                                    <AnalyticsIcon />
                                </Avatar>
                                <Typography variant="h6">
                                    Revenue
                                </Typography>
                            </Box>
                            <Typography variant="h4" component="div" sx={{ mb: 1 }}>
                                ${stats.revenue}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Total Revenue
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={3}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                                    <ReceiptIcon />
                                </Avatar>
                                <Typography variant="h6">
                                    Expenses
                                </Typography>
                            </Box>
                            <Typography variant="h4" component="div" sx={{ mb: 1 }}>
                                ${stats.expenses}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Total Expenses
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={3}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                                    <TrendingUpIcon />
                                </Avatar>
                                <Typography variant="h6">
                                    Profit
                                </Typography>
                            </Box>
                            <Typography variant="h4" component="div" sx={{ mb: 1 }}>
                                ${stats.profit}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Net Profit
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Alerts Section */}
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" component="div" sx={{ mb: 3 }}>
                                System Alerts
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={4}>
                                    <Paper
                                        sx={{
                                            p: 2,
                                            bgcolor: 'error.light',
                                            borderRadius: 2,
                                            height: '100%'
                                        }}
                                    >
                                        <Typography variant="h6" color="error.main">
                                            Environment Alerts
                                        </Typography>
                                        <Typography variant="h4" sx={{ mt: 1 }}>
                                            {stats.environmentAlerts}
                                        </Typography>
                                    </Paper>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Paper
                                        sx={{
                                            p: 2,
                                            bgcolor: 'warning.light',
                                            borderRadius: 2,
                                            height: '100%'
                                        }}
                                    >
                                        <Typography variant="h6" color="warning.main">
                                            Disease Alerts
                                        </Typography>
                                        <Typography variant="h4" sx={{ mt: 1 }}>
                                            {stats.diseaseAlerts}
                                        </Typography>
                                    </Paper>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Paper
                                        sx={{
                                            p: 2,
                                            bgcolor: 'info.light',
                                            borderRadius: 2,
                                            height: '100%'
                                        }}
                                    >
                                        <Typography variant="h6" color="info.main">
                                            Feed & Water Alerts
                                        </Typography>
                                        <Typography variant="h4" sx={{ mt: 1 }}>
                                            {stats.feedAlerts + stats.waterAlerts}
                                        </Typography>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Recent Activity */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" component="div" sx={{ mb: 3 }}>
                                Recent Batches
                            </Typography>
                            <List>
                                {stats.recentBatches.map((batch, index) => (
                                    <React.Fragment key={batch.id}>
                                        <ListItem>
                                            <ListItemText
                                                primary={batch.batch_name}
                                                secondary={`Status: ${batch.batch_status === 1 ? 'Active' : 'Inactive'}`}
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
                                        onClick={() => handleQuickAction('addBatch')}
                                        sx={{ mb: 2 }}
                                    >
                                        Add New Batch
                                    </Button>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        startIcon={<PeopleIcon />}
                                        onClick={() => handleQuickAction('registerManager')}
                                        sx={{ mb: 2 }}
                                    >
                                        Register Manager
                                    </Button>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        startIcon={<BusinessIcon />}
                                        onClick={() => handleQuickAction('addBreed')}
                                        sx={{ mb: 2 }}
                                    >
                                        Add New Breed
                                    </Button>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        startIcon={<SettingsIcon />}
                                        onClick={() => handleQuickAction('systemSettings')}
                                        sx={{ mb: 2 }}
                                    >
                                        System Settings
                                    </Button>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Dashboard;
